import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { normalise, corpusMap } from '@/lib/corpus'

// Local dev: @ai-sdk/openai. On Vercel: swap model string to 'anthropic/claude-haiku-4.5'
// and add AI_GATEWAY_API_KEY for gateway routing + observability.
const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
const MODEL = process.env.AI_GATEWAY_API_KEY ? 'anthropic/claude-haiku-4.5' : openai('gpt-4o-mini')

const SeedItemSchema = z.object({
  es: z.string().describe('Spanish word or short phrase'),
  en: z.string().describe('English translation'),
  pos: z.string().describe('Part of speech abbreviation, e.g. n., v., adj.'),
  example_es: z.string().describe('Simple Spanish sentence using this word, tailored to the learner level'),
  example_en: z.string().describe('English translation of the example sentence'),
  why: z.string().describe('One short sentence explaining why this word matters for the given scenario'),
})

const SeedSchema = z.object({
  items: z.array(SeedItemSchema).max(20),
})

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const scenario = (body?.scenario ?? '').trim().slice(0, 300)
  if (!scenario) return NextResponse.json({ error: 'scenario required' }, { status: 400 })

  // Determine learner level from known-word count
  const { data: progress } = await supabase
    .from('user_word_progress')
    .select('status')
    .eq('user_id', user.id)
    .in('status', ['good', 'easy'])

  const knownCount = progress?.length ?? 0
  const levelHint =
    knownCount < 100 ? 'absolute beginner (knows ~50 most common Spanish words)' :
    knownCount < 300 ? 'beginner (knows ~200 most common Spanish words)' :
    knownCount < 600 ? 'elementary (knows ~450 most common Spanish words)' :
    knownCount < 1000 ? 'intermediate (knows ~750 most common Spanish words)' :
    'upper-intermediate (knows ~1200 most common Spanish words)'

  const { object } = await generateObject({
    model: MODEL,
    schema: SeedSchema,
    prompt: `You are a Spanish vocabulary teacher. A ${levelHint} learner has told you about an upcoming real-life situation: "${scenario}".

Generate the 15–18 most practically useful Spanish words or short phrases for this exact situation. Prioritise:
1. Words they will hear and need to understand
2. Words they will need to say themselves
3. Ordered from most to least critical

For each word, write an example sentence appropriate for a ${levelHint}. Keep sentences short and natural. The "why" field should be one punchy sentence explaining its importance in this specific situation. Do not include words like "hola", "gracias", or other basics everyone already knows unless they are uniquely critical here.`,
  })

  // Reconcile with frequency corpus
  const deck = object.items.map((item, i) => {
    const key = normalise(item.es)
    const canonical = corpusMap.get(key)

    if (canonical) {
      return {
        rank: canonical.rank,
        word: canonical.word,
        pos: canonical.pos,
        meanings: canonical.meanings,
        example_es: item.example_es,  // use AI-generated sentence (level-tuned)
        example_en: item.example_en,
        image: canonical.image ?? null,
        why: item.why,
        isNew: true,
        isExtra: false,
      }
    }

    // Situational word not in corpus — exposure-only, no SRS tracking
    return {
      rank: null,
      word: item.es,
      pos: item.pos,
      meanings: [item.en],
      example_es: item.example_es,
      example_en: item.example_en,
      image: null,
      why: item.why,
      isNew: true,
      isExtra: true,
    }
  })

  return NextResponse.json({ deck, knownCount })
}
