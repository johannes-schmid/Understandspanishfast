import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FlashCard from '@/components/FlashCard'

export const metadata = { title: 'Study Pack | Most Common Spanish' }

export default async function PackStudyPage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: pack } = await supabase
    .from('vocab_packs')
    .select('id, title')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()
  if (!pack) redirect('/packs')

  const [wordsResult, settingsResult, corpusProgResult] = await Promise.all([
    supabase.from('pack_words').select('*').eq('pack_id', id).order('position'),
    supabase.from('user_settings').select('card_front, unlocked, tts_enabled').eq('user_id', user.id).maybeSingle(),
    supabase.from('user_word_progress').select('word_rank, status').eq('user_id', user.id),
  ])

  const packWords = wordsResult.data ?? []
  const packWordIds = packWords.filter((w) => w.corpus_rank == null).map((w) => w.id)

  const { data: packProg } = packWordIds.length
    ? await supabase.from('user_pack_word_progress').select('pack_word_id, status').eq('user_id', user.id).in('pack_word_id', packWordIds)
    : { data: [] }

  const corpusProg = corpusProgResult.data ?? []
  const seenRanks = new Set(corpusProg.map((r) => r.word_rank))
  const knownRanks = corpusProg.filter((r) => ['good', 'easy'].includes(r.status)).map((r) => r.word_rank)
  const seenPackWords = new Set((packProg ?? []).map((r) => r.pack_word_id))

  const initialQueue = packWords.map((w) => {
    if (w.corpus_rank != null) {
      return {
        rank: w.corpus_rank, word: w.lemma, pos: w.pos, meanings: w.meanings,
        example_es: w.example_es, example_en: w.example_en, image: w.image,
        isNew: !seenRanks.has(w.corpus_rank),
      }
    }
    return {
      rank: null, pack_word_id: w.id, word: w.lemma, pos: w.pos, meanings: w.meanings,
      example_es: w.example_es, example_en: w.example_en, image: null,
      isNew: !seenPackWords.has(w.id),
    }
  })

  const cardFront = settingsResult.data?.card_front ?? 'spanish'
  const unlocked = settingsResult.data?.unlocked ?? false
  const ttsEnabled = settingsResult.data?.tts_enabled ?? true

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '76px' }}>
      <div className="app-wrap">
        <FlashCard
          initialQueue={initialQueue}
          knownRanks={knownRanks}
          initialCardFront={cardFront}
          unlocked={unlocked}
          initialTtsEnabled={ttsEnabled}
          newTodayCount={0}
          dueCount={0}
        />
      </div>
    </main>
  )
}
