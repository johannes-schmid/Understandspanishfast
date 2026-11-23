// Screens candidates.json and writes card content for words 1,501–3,000.
// Usage: node --env-file=.env.local scripts/deck3000/generate.mjs [--limit 30] [--force]
// Each batch of candidates is cached in scripts/deck3000/.cache/batches/, so reruns only call the API for missing batches.
import fs from 'node:fs'
import path from 'node:path'
import Anthropic from '@anthropic-ai/sdk'

const DIR = 'scripts/deck3000'
const BATCH_DIR = path.join(DIR, '.cache/batches')
const OUT = 'data/words-3000.json'
const FIRST_RANK = 1501
const TARGET = 1500
const BATCH = 40
const CONCURRENCY = 6
const MAX_SENTENCE_WORDS = 14
const POS = ['n.m.', 'n.f.', 'n.', 'v.', 'adj.', 'adv.', 'num.', 'intj.', 'expr.', 'pron.', 'prep.', 'conj.', 'det.']
const DROP = ['function_word', 'proper_noun', 'sound_interjection', 'profanity', 'foreign', 'not_a_word', 'duplicate']

const args = process.argv.slice(2)
const force = args.includes('--force')
const limit = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : TARGET

const candidates = JSON.parse(fs.readFileSync(path.join(DIR, 'candidates.json'), 'utf8'))
const existing = JSON.parse(fs.readFileSync('data/words.json', 'utf8'))
const strip = (w) => w.toLowerCase().replace(/^(un|una|el|la|los|las)\s+/, '').trim()
const knownWords = existing.map((w) => strip(w.word))
const known = new Set(knownWords)

const client = new Anthropic()
fs.mkdirSync(BATCH_DIR, { recursive: true })

const SYSTEM = `You prepare clean data for an intermediate Spanish vocabulary deck (Anki) for English-speaking adult learners at A2–B1.
The learner already knows our first 1,500 words (listed below). This deck covers the next 1,500 content words by frequency in film and TV subtitles (OpenSubtitles).

You receive candidate lemmas from an automatic lemmatiser, in frequency order, each with its most frequent surface forms from the corpus. The lemmatiser makes mistakes, so decide the real dictionary headword from the surface forms.

For every candidate return one item, in the same order:
- "candidate": the candidate exactly as given.
- "decision": "keep" or one drop reason:
  - function_word: articles, prepositions, conjunctions, pronouns (personal, relative, interrogative, demonstrative, possessive), contractions (del, al), auxiliary-only forms.
  - proper_noun: names of people, places, brands, titles (john, york, sam).
  - sound_interjection: noises and fillers (oh, eh, ah, uh, ay, hmm, wow). Real words used as interjections (hola, adiós, gracias, ojalá, vale) are kept.
  - profanity: words whose main use is a swear word or vulgar insult (mierda, puta, joder, carajo, culo). Mild everyday words like idiota or estúpido are kept.
  - foreign: English or other non-Spanish words (the, ok, hey, io).
  - not_a_word: misspellings without accents (aqui, asi), fragments, tokenisation noise.
  - duplicate: the headword is a word the learner already knows (see list; compare dictionary forms, ignoring un/una), or an inflected, enclitic or imperative form of one (dame → dar, verte → ver, cállate → callar), or the same headword as an earlier candidate in this batch.
- "word": the dictionary headword: infinitive for verbs (reflexive -se only when the reflexive is the normal use), masculine singular for adjectives and nouns with both genders, singular for nouns. No article. Plural only for words that only exist in plural (gafas) or set phrases (gracias). For participles used mainly as adjectives (cansado, perdido) the headword is the adjective.
- "pos": one of ${POS.join(' ')}. Nouns use n.m. or n.f.; use n. only for nouns that take both genders with the same form (artista, paciente).
- "meanings": 1 to 3 short English glosses, most common sense first, as used in everyday speech.
- "example_es": one natural Spanish sentence as people actually say it in conversation (spoken register, not textbook). At most ${MAX_SENTENCE_WORDS} words. It must contain the headword (inflected is fine). Apart from the headword, use mostly words from the known list below and very common function words. Works in both Spain and Latin America, no regional slang. Correct accents and ¿ ¡. Adult topics: work, relationships, money, travel, health, home, everyday problems. No names of real people.
- "example_en": natural English translation of the sentence.
- "cognate": true if an English speaker would recognise the word from English with no study (hospital, perfecto, problema).
For dropped candidates, still fill "word" with your best headword, and set pos, meanings, example_es and example_en to "" / [] / "".

Words the learner already knows (our first 1,500):
${knownWords.join(', ')}`

const S = (props) => ({ type: 'object', additionalProperties: false, properties: props, required: Object.keys(props) })
const STR = { type: 'string' }
const SCHEMA = S({
  items: {
    type: 'array',
    items: S({
      candidate: STR,
      decision: { type: 'string', enum: ['keep', ...DROP] },
      word: STR,
      pos: { type: 'string', enum: [...POS, ''] },
      meanings: { type: 'array', items: STR },
      example_es: STR,
      example_en: STR,
      cognate: { type: 'boolean' },
    }),
  },
})

const countWords = (s) => s.replace(/[¿?¡!.,;:"«»—…]/g, ' ').split(/\s+/).filter(Boolean).length

function validate(batch, data) {
  const errs = []
  if (data.items?.length !== batch.length) errs.push(`got ${data.items?.length} items, need ${batch.length}`)
  data.items?.forEach((it, i) => {
    if (it.candidate !== batch[i]?.lemma) errs.push(`item ${i + 1} is "${it.candidate}", expected "${batch[i]?.lemma}"`)
    if (it.decision !== 'keep') return
    if (!it.word || !it.pos || !it.example_es || !it.example_en) errs.push(`${it.word}: empty field`)
    if (!it.meanings?.length || it.meanings.length > 3) errs.push(`${it.word}: ${it.meanings?.length} meanings`)
    const n = countWords(it.example_es)
    if (n > MAX_SENTENCE_WORDS) errs.push(`${it.word}: sentence has ${n} words`)
  })
  return errs
}

let inTok = 0, outTok = 0, cacheRead = 0, cacheWrite = 0
async function call(batch) {
  const list = batch.map((c, i) => `${i + 1}. ${c.lemma} — forms: ${c.forms.join(', ')}`).join('\n')
  const stream = client.beta.messages.stream({
    model: 'claude-opus-5-5',
    max_tokens: 32000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral', ttl: '1h' } }],
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: SCHEMA } },
    messages: [{ role: 'user', content: `Candidates (${batch.length}):\n${list}` }],
  })
  const msg = await stream.finalMessage()
  if (msg.stop_reason === 'refusal') throw new Error('refused')
  if (msg.stop_reason === 'max_tokens') throw new Error('hit max_tokens')
  const u = msg.usage
  inTok += u.input_tokens; outTok += u.output_tokens
  cacheRead += u.cache_read_input_tokens ?? 0; cacheWrite += u.cache_creation_input_tokens ?? 0
  const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('')
  return JSON.parse(text)
}

async function runBatch(n) {
  const file = path.join(BATCH_DIR, `batch-${String(n).padStart(3, '0')}.json`)
  if (!force && fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'))
  const batch = candidates.slice(n * BATCH, (n + 1) * BATCH)
  if (!batch.length) return null
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const data = await call(batch)
      const errs = validate(batch, data)
      if (errs.length) { console.warn(`batch ${n} attempt ${attempt}: ${errs.join('; ')}`); continue }
      fs.writeFileSync(file, JSON.stringify(data, null, 1))
      console.log(`done batch ${n}`)
      return data
    } catch (e) {
      if (e instanceof Anthropic.RateLimitError) await new Promise((r) => setTimeout(r, 20000))
      console.warn(`batch ${n} attempt ${attempt} failed: ${e.message}`)
    }
  }
  throw new Error(`batch ${n} failed 3 times`)
}

function assemble(results) {
  const seen = new Set(known)
  const words = []
  const dropped = {}
  for (const data of results) {
    for (const it of data.items) {
      let reason = it.decision
      const key = it.word.toLowerCase().trim()
      if (reason === 'keep' && seen.has(key)) reason = 'duplicate'
      if (reason !== 'keep') { (dropped[reason] ||= []).push(`${it.candidate}→${it.word}`); continue }
      if (words.length >= limit) continue
      seen.add(key)
      words.push({
        rank: FIRST_RANK + words.length,
        word: it.word.trim(),
        pos: it.pos,
        meanings: it.meanings,
        example_es: it.example_es.trim(),
        example_en: it.example_en.trim(),
        cognate: it.cognate,
      })
    }
  }
  return { words, dropped }
}

const results = []
let next = 0
while (true) {
  const { words } = assemble(results)
  if (words.length >= limit) break
  const wave = await Promise.all(Array.from({ length: limit >= TARGET ? CONCURRENCY : 1 }, () => runBatch(next++)))
  const got = wave.filter(Boolean)
  results.push(...got)
  if (got.length < wave.length) { console.warn('ran out of candidates; raise POOL_SIZE in build-list.mjs'); break }
}

const { words, dropped } = assemble(results)
fs.writeFileSync(OUT, JSON.stringify(words, null, 1))
fs.writeFileSync(path.join(DIR, 'dropped.json'), JSON.stringify(dropped, null, 1))
const overLong = words.filter((w) => countWords(w.example_es) > MAX_SENTENCE_WORDS).length
console.log(`wrote ${words.length} words (ranks ${FIRST_RANK}–${FIRST_RANK + words.length - 1}) to ${OUT} from ${results.length} batches; over-long sentences: ${overLong}`)
console.log('dropped:', Object.fromEntries(Object.entries(dropped).map(([k, v]) => [k, v.length])))
if (inTok || outTok) console.log(`tokens in ${inTok}, cache write ${cacheWrite}, cache read ${cacheRead}, out ${outTok}, est. cost $${((inTok * 4 + cacheWrite * 4 * 2 + cacheRead * 0.2 + outTok * 20) / 1e6).toFixed(2)}`)
