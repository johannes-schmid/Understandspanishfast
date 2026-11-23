// Generates one graded short story and rewrites it until it passes the vocabulary check.
// Usage: node --env-file=.env.local scripts/readers/generate.mjs --id level1-story01 [--level 1] [--theme "..."]
import fs from 'node:fs'
import path from 'node:path'
import Anthropic from '@anthropic-ai/sdk'
import { check, LEVELS } from './check.mjs'
import { entryLemmas, GRAMMAR } from './inflect.mjs'

const arg = (k, d) => (process.argv.includes(`--${k}`) ? process.argv[process.argv.indexOf(`--${k}`) + 1] : d)
const level = Number(arg('level', 1))
const id = arg('id', `level${level}-story01`)
const OUT = arg('out', 'samples/readers')
const MAX_ROUNDS = 5
const TARGET = 98
const theme = arg('theme', 'A man in his forties gets a letter from the father who left the family twenty years ago. He has to decide whether to answer. Quiet, adult, a little funny, ends with a small decision, not a big reunion.')

const words = JSON.parse(fs.readFileSync('data/words.json', 'utf8'))
const limit = LEVELS[level]
const allowed = words.filter((w) => w.rank <= limit)
const listText = allowed.map((w) => `${entryLemmas(w.word).join('/')}=${w.meanings[0]}`).join('; ')

const client = new Anthropic()
const S = (props) => ({ type: 'object', additionalProperties: false, properties: props, required: Object.keys(props) })
const STR = { type: 'string' }
const arr = (items) => ({ type: 'array', items })
const SCHEMA = S({
  title: STR,
  title_en: STR,
  summary_en: STR,
  names: arr(STR),
  paragraphs: arr(STR),
  glossary: arr(S({ word: STR, lemma: STR, en: STR })),
  questions: arr(S({ q: STR, a: STR, q_en: STR, a_en: STR })),
})

const SYSTEM = `You write graded short stories in Spanish for English-speaking adult learners. Each story is built ONLY from a fixed frequency word list, and a script verifies every word afterwards.

Craft:
- Adult, everyday life: work, family, money, love, friends, getting older, small moral choices. Never childish, never a textbook dialogue. Real characters with wants and a turn in the story.
- Natural dialogue (use the Spanish dash — for speech), the way people actually talk. Neutral Spanish that works in Spain and Latin America; avoid vosotros and regional slang.
- ${level === 1 ? "Mix past (pretérito and imperfecto) and present tense. Short, clear sentences (A1–A2), but not robotic: vary rhythm." : "Level A2–B1: use the full range of everyday tenses (pretérito, imperfecto, perfecto, future, conditional, some present subjunctive after quiero que / cuando / para que). Longer sentences with connectors are fine, but keep them easy to follow."}
- Correct accents and ¿ ¡ punctuation.

Vocabulary rules (strict):
- Use only words from the ALLOWED LIST below (any conjugation, plural or gender form is fine), plus grammar words: ${[...GRAMMAR].join(', ')}.
- Character and place names are allowed; list every one in "names". Use 2–4 short, common names.
- Numbers: write only allowed number words or digits.
- If a word outside the list is truly needed for the story, you may use at most ~1 per 100 words. Each one must appear in "glossary" with the exact form used in the text ("word"), its dictionary form ("lemma") and an English meaning ("en").
- Common words that are NOT on the list (avoid them): problema, favor (por favor), gracias, hola, oficina, coche. Prefer the closest allowed word.

Output fields:
- title (Spanish, short, allowed words only), title_en, summary_en (one sentence).
- paragraphs: the story as an array of paragraphs, ${level === 1 ? "600–900" : "900–1,200"} words in total. Dialogue lines can be their own paragraphs.
- questions: exactly 5 comprehension questions in simple Spanish (allowed words only) with a short Spanish answer, plus English translations of both.`

async function call(messages) {
  const stream = client.beta.messages.stream({
    model: 'claude-opus-5-5',
    max_tokens: 32000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: [{ type: 'text', text: `${SYSTEM}\n\nALLOWED LIST (top ${limit} words, lemma=meaning):\n${listText}`, cache_control: { type: 'ephemeral' } }],
    output_config: { effort: 'high', format: { type: 'json_schema', schema: SCHEMA } },
    messages,
  })
  const msg = await stream.finalMessage()
  if (msg.stop_reason === 'refusal') throw new Error('refused')
  if (msg.stop_reason === 'max_tokens') throw new Error('hit max_tokens')
  const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('')
  return { data: JSON.parse(text), usage: msg.usage, text }
}

const usage = { input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 }
const addUsage = (u) => { for (const k of Object.keys(usage)) usage[k] += u[k] || 0 }
const wordCount = (paras) => paras.join(' ').split(/\s+/).filter((w) => /[\p{L}]/u.test(w)).length

const messages = [{ role: 'user', content: `Write story "${id}" at level ${level} (top ${limit} words).\n\nPremise: ${theme}` }]
let best = null
for (let round = 1; round <= MAX_ROUNDS; round++) {
  const { data, usage: u, text } = await call(messages)
  addUsage(u)
  const r = check(data.paragraphs, { level, names: data.names, glossary: data.glossary })
  const wc = wordCount(data.paragraphs)
  const maxGloss = Math.floor(r.words * 0.02)
  const unglossed = r.outOfList.filter((o) => !o.glossed)
  const extraGloss = data.glossary.filter((g) => !r.outOfList.some((o) => o.glossed && (o.forms.includes(g.word.toLowerCase()) || o.lemma === g.lemma)))
  console.log(`round ${round}: ${wc} words, coverage ${r.coverage}%, glossed ${r.glossed}/${maxGloss} allowed, unglossed ${unglossed.length} lemmas`)
  best = { data, r, wc }
  const problems = []
  if (unglossed.length) problems.push(`These words are NOT on the allowed list and not glossed. Replace each with allowed words (rephrase the sentence if needed):\n${unglossed.map((o) => `- ${o.forms.join(', ')}${o.rank ? ` (rank ${o.rank}, above ${limit})` : ''}`).join('\n')}`)
  if (r.glossed > maxGloss) problems.push(`Too many glossed words (${r.glossed} tokens, max ${maxGloss}). Replace some of: ${r.outOfList.filter((o) => o.glossed).map((o) => o.lemma).join(', ')}.`)
  if (r.coverage < TARGET) problems.push(`Coverage is ${r.coverage}%; it must be at least ${TARGET}%.`)
  const [minW, maxW] = level === 1 ? [600, 900] : [900, 1200]
  if (wc < minW || wc > maxW) problems.push(`The story has ${wc} words; it must be ${minW}–${maxW}.`)
  if (data.questions.length !== 5) problems.push('Write exactly 5 questions.')
  if (!problems.length) break
  if (round === MAX_ROUNDS) { console.warn('stopped at max rounds'); break }
  messages.push({ role: 'assistant', content: text })
  messages.push({ role: 'user', content: `The vocabulary check found problems:\n\n${problems.join('\n\n')}\n\nReturn the full corrected story JSON. Keep the plot, tone and length; change only what is needed. Glossary entries must list the exact form used in the text.${extraGloss.length ? `\nRemove glossary entries for words that are already allowed: ${extraGloss.map((g) => g.word).join(', ')}.` : ''}` })
}

const { data, r, wc } = best
const cost = (usage.input_tokens * 4 + usage.cache_creation_input_tokens * 5 + usage.cache_read_input_tokens * 0.2 + usage.output_tokens * 20) / 1e6
const result = {
  id,
  level,
  rankLimit: limit,
  title: data.title,
  title_en: data.title_en,
  summary_en: data.summary_en,
  names: data.names,
  paragraphs: data.paragraphs,
  glossary: data.glossary.filter((g) => r.outOfList.some((o) => o.glossed && (o.forms.includes(g.word.toLowerCase()) || o.lemma === g.lemma))),
  questions: data.questions,
  wordCount: wc,
  measured: {
    coverage: r.coverage,
    glossedPct: r.glossedPct,
    unglossed: r.unglossed,
    words: r.words,
    listTokens: r.inList,
    grammarTokens: r.grammar,
    nameTokens: r.names,
    uniqueListWords: r.uniqueLemmas,
    highestRankUsed: Math.max(...r.lemmasUsed.map((l) => l.rank)),
    lemmasUsed: r.lemmasUsed.map((l) => ({ lemma: l.lemma, rank: l.rank, count: l.count })),
    outOfList: r.outOfList,
  },
  generation: { model: 'claude-opus-5-5', usage, estCostUsd: +cost.toFixed(3), theme },
}
fs.mkdirSync(OUT, { recursive: true })
const file = path.join(OUT, `${id}.json`)
fs.writeFileSync(file, JSON.stringify(result, null, 2))
console.log(`wrote ${file} · coverage ${r.coverage}% · ${wc} words · est. $${cost.toFixed(3)}`)
