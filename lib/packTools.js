import { generateText, generateObject, Output } from 'ai'
import { z } from 'zod'
import { RetryableError } from 'workflow'
import { DEFINITION_MODEL, TOPIC_MODEL } from '@/lib/aiModels'
import { createAdminClient } from '@/lib/supabase/admin'
import { putArtifact, getArtifact } from '@/lib/packArtifacts'
import { emitProgress } from '@/lib/packProgress'
import { normalise, lookupCorpus, levelHint } from '@/lib/corpus'
import { wordFrequencies, singularize, spanishScore } from '@/lib/spanishText'
import { searchSubtitles, downloadSubtitleText, stripSrt, SubdlError } from '@/lib/subdl'

const BASIC_RANK_CUTOFF = 100 // exclude the most-basic top words — they aren't "new"
const NONCORPUS_CAP = 60
export const TARGET = { min: 30, max: 50 }
const UPLOAD_BUCKET = 'pack-uploads'

function hashRef(prefix, s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return `${prefix}:${(h >>> 0).toString(36)}`
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function knownRankSet(userId) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('user_word_progress')
    .select('word_rank')
    .eq('user_id', userId)
    .in('status', ['good', 'easy'])
  return new Set((data || []).map((r) => r.word_rank))
}

// ── Source adapters ─────────────────────────────────────────────

export async function fetchUrlStep(buildId, url) {
  'use step'
  await emitProgress({ phase: 'fetch', message: `Fetching ${url}…` })
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; UnderstandSpanishFast/1.0)' } })
    if (!res.ok) {
      await emitProgress({ phase: 'note', message: `Couldn't fetch the page (${res.status}).` })
      return { ok: false, reason: `fetch failed (${res.status})` }
    }
    const text = stripHtml(await res.text())
    if (text.length < 200) {
      await emitProgress({ phase: 'note', message: 'That page had almost no readable text.' })
      return { ok: false, reason: 'page had almost no readable text (possibly JS-rendered or paywalled)' }
    }
    const score = spanishScore(text)
    const sourceRef = hashRef('src', url)
    await putArtifact(buildId, sourceRef, { text })
    await emitProgress({ phase: 'fetch', message: `Read ${text.length.toLocaleString()} characters`, data: { charCount: text.length } })
    return { ok: true, sourceRef, charCount: text.length, langGuess: score > 0.06 ? 'es' : 'other', truncated: text.length > 40000 }
  } catch (e) {
    await emitProgress({ phase: 'note', message: `Fetch failed: ${e.message}` })
    return { ok: false, reason: e.message }
  }
}

export async function extractPdfStep(buildId, storagePath) {
  'use step'
  await emitProgress({ phase: 'extract', message: 'Reading PDF…' })
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.storage.from(UPLOAD_BUCKET).download(storagePath)
    if (error) return { ok: false, reason: `could not read upload: ${error.message}` }
    const buf = new Uint8Array(await data.arrayBuffer())
    const { extractText, getDocumentProxy } = await import('unpdf')
    const pdf = await getDocumentProxy(buf)
    const { totalPages, text } = await extractText(pdf, { mergePages: true })
    const clean = text.replace(/\s+/g, ' ').trim()
    if (clean.length < 200) return { ok: false, reason: 'PDF has almost no extractable text (likely a scanned image)' }
    const sourceRef = hashRef('src', storagePath)
    await putArtifact(buildId, sourceRef, { text: clean })
    await emitProgress({ phase: 'extract', message: `Read ${totalPages} pages, ${clean.length.toLocaleString()} characters` })
    return { ok: true, sourceRef, pageCount: totalPages, charCount: clean.length }
  } catch (e) {
    return { ok: false, reason: e.message }
  }
}

export async function searchSubtitlesStep(input) {
  'use step'
  await emitProgress({ phase: 'search', message: `Searching subtitles for “${input.query}”…` })
  try {
    const { results } = await searchSubtitles(input)
    await emitProgress({ phase: 'search', message: `Found ${results.length} Spanish subtitle files` })
    return { ok: true, results }
  } catch (e) {
    if (e instanceof SubdlError && e.status === 429) {
      throw new RetryableError('Subdl rate limited', { retryAfter: '5m' })
    }
    return { ok: false, reason: e.message }
  }
}

export async function downloadSubtitlesStep(buildId, url) {
  'use step'
  await emitProgress({ phase: 'download', message: 'Downloading subtitles…' })
  try {
    const srt = await downloadSubtitleText(url)
    const text = stripSrt(srt)
    if (text.length < 200) return { ok: false, reason: 'subtitle file was empty or unreadable' }
    const sourceRef = hashRef('src', String(url))
    await putArtifact(buildId, sourceRef, { text })
    await emitProgress({ phase: 'download', message: `Read ${text.length.toLocaleString()} characters of dialogue` })
    return { ok: true, sourceRef, charCount: text.length }
  } catch (e) {
    if (e instanceof SubdlError && e.status === 429) {
      throw new RetryableError('Subdl download quota exhausted', { retryAfter: '5m' })
    }
    return { ok: false, reason: e.message }
  }
}

// ── Analysis (deterministic; reads known-words server-side) ─────

export async function analyzeTextStep(buildId, sourceRef, userId) {
  'use step'
  await emitProgress({ phase: 'analyze', message: 'Analyzing vocabulary…' })
  const src = await getArtifact(buildId, sourceRef)
  if (!src?.text) return { ok: false, reason: 'source text not found — fetch/extract it first' }

  const freqs = wordFrequencies(src.text)
  const known = await knownRankSet(userId)

  const corpusHits = []
  const nonCorpus = []
  const seenRank = new Set()
  let excludedKnown = 0
  let excludedBasic = 0

  for (const { word, freq } of freqs) {
    const corpus = lookupCorpus(word) || lookupCorpus(singularize(word))
    if (corpus) {
      if (seenRank.has(corpus.rank)) continue
      if (known.has(corpus.rank)) { excludedKnown++; continue }
      if (corpus.rank <= BASIC_RANK_CUTOFF) { excludedBasic++; continue }
      seenRank.add(corpus.rank)
      corpusHits.push({ lemma: corpus.word, corpusRank: corpus.rank, pos: corpus.pos, freq })
    } else {
      nonCorpus.push({ lemma: word, freq })
    }
  }

  corpusHits.sort((a, b) => (b.freq + (1500 - b.corpusRank) / 50) - (a.freq + (1500 - a.corpusRank) / 50))
  nonCorpus.sort((a, b) => b.freq - a.freq)
  const cappedNonCorpus = nonCorpus.slice(0, NONCORPUS_CAP)

  const candidatesRef = hashRef('cand', sourceRef)
  // Stash the analyzed text sample too, so the curation step can rebuild the
  // in-context token stream without re-reading the source artifact.
  await putArtifact(buildId, candidatesRef, {
    corpusHits, nonCorpus: cappedNonCorpus, sample: src.text.slice(0, 40000),
  })

  const newWordCount = corpusHits.length + cappedNonCorpus.length
  await emitProgress({
    phase: 'analyze',
    message: `${freqs.length.toLocaleString()} distinct words · ${newWordCount} new after excluding ${excludedKnown} you know and ${excludedBasic} basics`,
    data: { newWordCount, excludedKnown, excludedBasic },
  })

  return {
    ok: true,
    totalUnique: freqs.length,
    corpusHitCount: corpusHits.length,
    nonCorpusCount: cappedNonCorpus.length,
    excludedKnown,
    excludedBasic,
    newWordCount,
    candidatesRef,
  }
}

// ── Definitions (single structured LLM call, non-corpus words only) ─

const EntrySchema = z.object({
  word: z.string().describe('the original surface form from the text'),
  lemma: z.string().describe('canonical dictionary form: infinitive for verbs, singular for nouns'),
  pos: z.string().describe('part of speech abbreviation, e.g. n., v., adj., adv.'),
  definition_en: z.string().describe('short English translation'),
  definition_es: z.string().describe('short Spanish definition'),
  example_es: z.string().describe('a simple natural Spanish sentence using the word'),
  example_en: z.string().describe('English translation of the example'),
  cefr: z.enum(['A1', 'A2', 'B1', 'B2', 'C1']).describe('estimated CEFR level'),
})

export async function generateDefinitionsStep(buildId, candidatesRef, userId) {
  'use step'
  const cand = await getArtifact(buildId, candidatesRef)
  const nonCorpus = cand?.nonCorpus || []
  const entriesRef = hashRef('entries', candidatesRef)

  if (nonCorpus.length === 0) {
    await putArtifact(buildId, entriesRef, { entries: [] })
    return { ok: true, definedCount: 0, entriesRef }
  }

  await emitProgress({ phase: 'define', message: `Writing definitions for ${nonCorpus.length} new words…` })
  const known = await knownRankSet(userId)
  const level = levelHint(known.size)
  const wordList = nonCorpus.map((w) => w.lemma).join(', ')

  const { output } = await generateText({
    model: DEFINITION_MODEL,
    output: Output.object({ schema: z.object({ entries: z.array(EntrySchema) }) }),
    prompt: `You are a Spanish lexicographer creating flashcards for a ${level} learner.

For each Spanish word below, return a dictionary entry. The "lemma" field must be the canonical DICTIONARY form only — infinitive for verbs (e.g. "corriendo" → "correr"), masculine singular for nouns/adjectives (e.g. "casas" → "casa", "buenas" → "bueno"). NEVER return a conjugated, plural, gendered, diminutive, or otherwise inflected form as the lemma. Skip any token that is a proper noun, a foreign/non-Spanish word, a typo, or not a real Spanish word by omitting it from the output. Keep example sentences short and natural for the learner's level.

Words: ${wordList}`,
  })

  const entries = output?.entries || []
  await putArtifact(buildId, entriesRef, { entries })
  await emitProgress({ phase: 'define', message: `Defined ${entries.length} words` })
  return { ok: true, definedCount: entries.length, entriesRef }
}

// ── Curation (assemble words + in-context tokens; user picks before saving) ──

const PACK_DISPLAY_MAX = 60 // auto-selected words shown for review
const CAND_MAX = 40         // extra "tap to add" words offered
const MAX_TOKENS = 1500     // in-context tokens rendered in the review UI
const WORD_RE = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g

// Turn a corpus entry into a curation/pack word record.
function corpusRecord(corpus, isAuto) {
  return {
    key: normalise(corpus.word), lemma: corpus.word, pos: corpus.pos,
    meanings: corpus.meanings, example_es: corpus.example_es, example_en: corpus.example_en,
    corpus_rank: corpus.rank, image: corpus.image ?? null,
    gloss: corpus.meanings?.[0] ?? '', isAuto,
  }
}

// Build the auto-selected word set + the highlighted token stream for the review UI.
// Every selectable/addable token is backed by real data (corpus entry or an LLM
// definition), and always maps to a canonical LEMMA — never a surface form.
export function assembleCuration({ corpusHits = [], sample = '' }, entries = [], known = new Set()) {
  const autoMap = new Map() // key -> record (selected by default)

  for (const c of corpusHits) {
    if (autoMap.size >= PACK_DISPLAY_MAX) break
    const corpus = lookupCorpus(c.lemma)
    if (!corpus) continue
    const key = normalise(corpus.word)
    if (autoMap.has(key)) continue
    autoMap.set(key, corpusRecord(corpus, true))
  }
  for (const e of entries) {
    if (autoMap.size >= PACK_DISPLAY_MAX) break
    const corpus = lookupCorpus(e.lemma)
    if (corpus) {
      if (known.has(corpus.rank)) continue
      const key = normalise(corpus.word)
      if (autoMap.has(key)) continue
      autoMap.set(key, corpusRecord(corpus, true))
    } else {
      const key = normalise(e.lemma)
      if (autoMap.has(key)) continue
      autoMap.set(key, {
        key, lemma: e.lemma, pos: e.pos, meanings: [e.definition_en],
        example_es: e.example_es, example_en: e.example_en, corpus_rank: null,
        image: null, gloss: e.definition_en, isAuto: true,
      })
    }
  }

  const entryByWord = new Map(entries.map((e) => [String(e.word || '').toLowerCase(), e]))
  const candMap = new Map()
  const knownKeys = new Set()

  const tokens = []
  let last = 0, count = 0, m
  WORD_RE.lastIndex = 0
  while ((m = WORD_RE.exec(sample)) !== null && count < MAX_TOKENS) {
    const lead = sample.slice(last, m.index)
    last = m.index + m[0].length
    count++
    const raw = m[0]
    const lower = raw.toLowerCase()
    const corpus = lookupCorpus(lower) || lookupCorpus(singularize(lower))

    if (corpus) {
      const key = normalise(corpus.word)
      if (known.has(corpus.rank)) {
        knownKeys.add(key)
        tokens.push({ text: raw, lead, type: 'known', gloss: corpus.meanings?.[0] ?? '' })
      } else if (autoMap.has(key)) {
        tokens.push({ text: raw, lead, type: 'auto', key, gloss: autoMap.get(key).gloss })
      } else if (candMap.has(key) || (corpus.rank <= BASIC_RANK_CUTOFF && candMap.size < CAND_MAX)) {
        if (!candMap.has(key)) candMap.set(key, corpusRecord(corpus, false))
        tokens.push({ text: raw, lead, type: 'cand', key, gloss: corpus.meanings?.[0] ?? '' })
      } else {
        tokens.push({ text: raw, lead, type: 'plain' })
      }
    } else {
      const e = entryByWord.get(lower)
      const key = e ? normalise(e.lemma) : null
      if (key && autoMap.has(key)) {
        tokens.push({ text: raw, lead, type: 'auto', key, gloss: autoMap.get(key).gloss })
      } else {
        tokens.push({ text: raw, lead, type: 'plain' })
      }
    }
  }

  const words = [...autoMap.values(), ...candMap.values()]
  return {
    words, tokens,
    autoCount: autoMap.size,
    knownCount: knownKeys.size,
    candidateCount: candMap.size,
  }
}

// Final agent step: produce the curation payload instead of saving. The pack is
// persisted later by /api/packs/save once the user confirms their selection.
export async function prepareCurationStep(buildId, args, userId) {
  'use step'
  const { candidatesRef, entriesRef, title, sourceType, sourceLabel } = args
  const cand = await getArtifact(buildId, candidatesRef)
  if (!cand) return { ok: false, reason: 'candidates not found — analyze the source first' }
  const entries = entriesRef ? (await getArtifact(buildId, entriesRef))?.entries || [] : []
  const known = await knownRankSet(userId)

  const { words, tokens, autoCount, knownCount, candidateCount } = assembleCuration(cand, entries, known)
  if (autoCount === 0) {
    await emitProgress({ phase: 'note', message: 'No new words left after excluding what you already know.' })
    return { ok: false, reason: 'no new words found after excluding what the learner already knows' }
  }

  await putArtifact(buildId, 'curation', {
    userId, title: title || 'Vocabulary pack', sourceType, sourceLabel: sourceLabel || null,
    words, tokens,
  })
  await emitProgress({
    phase: 'curate',
    message: `Found ${autoCount} words worth learning — opening review`,
    data: { buildId, autoCount, knownCount, candidateCount },
  })
  return { ok: true, buildId, autoCount, knownCount, candidateCount }
}

// ── Topic packs (merged "describe a scenario" builder — no source text) ──────
// The LLM generates the useful words for a scenario directly; we synthesize a
// review text from the example sentences so the same curate UI + save flow apply.

const TopicItemSchema = z.object({
  es: z.string().describe('Spanish word or short phrase'),
  en: z.string().describe('English translation'),
  pos: z.string().describe('part of speech abbreviation, e.g. n., v., adj.'),
  lemma: z.string().describe('canonical dictionary lemma — infinitive for verbs, masculine singular otherwise; never inflected'),
  example_es: z.string().describe('simple Spanish sentence using the word, tuned to the learner level'),
  example_en: z.string().describe('English translation of the example'),
})

function tokenizeAgainst(sample, autoMap, known) {
  const tokens = []
  let last = 0, count = 0, m
  WORD_RE.lastIndex = 0
  while ((m = WORD_RE.exec(sample)) !== null && count < MAX_TOKENS) {
    const lead = sample.slice(last, m.index)
    last = m.index + m[0].length
    count++
    const raw = m[0]
    const lower = raw.toLowerCase()
    const corpus = lookupCorpus(lower) || lookupCorpus(singularize(lower))
    const key = corpus ? normalise(corpus.word) : normalise(lower)
    if (autoMap.has(key)) tokens.push({ text: raw, lead, type: 'auto', key, gloss: autoMap.get(key).gloss })
    else if (corpus && known.has(corpus.rank)) tokens.push({ text: raw, lead, type: 'known', gloss: corpus.meanings?.[0] ?? '' })
    else tokens.push({ text: raw, lead, type: 'plain' })
  }
  return tokens
}

export async function prepareTopicCurationStep(buildId, scenario, userId) {
  'use step'
  await emitProgress({ phase: 'generate', message: `Finding the most useful words for “${scenario}”…` })

  const known = await knownRankSet(userId)
  const level = levelHint(known.size)

  const { object } = await generateObject({
    model: TOPIC_MODEL,
    schema: z.object({ items: z.array(TopicItemSchema).max(24) }),
    prompt: `You are a Spanish vocabulary teacher. A ${level} learner described a real-life situation: "${scenario}".

Return the 16–22 most practically useful Spanish words or short phrases for this exact situation — the ones they will need to understand and to say, ordered most-critical first. The "lemma" must be the canonical dictionary form (infinitive for verbs, masculine singular for nouns/adjectives), never an inflected form. Write short natural example sentences for a ${level}. Skip basics like "hola"/"gracias" unless uniquely critical here.`,
  })

  const items = object?.items || []
  const autoMap = new Map()
  for (const it of items) {
    const corpus = lookupCorpus(it.lemma) || lookupCorpus(it.es)
    if (corpus) {
      if (known.has(corpus.rank)) continue
      const key = normalise(corpus.word)
      if (autoMap.has(key)) continue
      autoMap.set(key, { ...corpusRecord(corpus, true), example_es: it.example_es, example_en: it.example_en })
    } else {
      const key = normalise(it.lemma || it.es)
      if (autoMap.has(key)) continue
      autoMap.set(key, {
        key, lemma: it.lemma || it.es, pos: it.pos, meanings: [it.en],
        example_es: it.example_es, example_en: it.example_en, corpus_rank: null,
        image: null, gloss: it.en, isAuto: true,
      })
    }
  }

  if (autoMap.size === 0) {
    await emitProgress({ phase: 'note', message: 'Could not generate useful words for that. Try describing the situation differently.' })
    return { ok: false, reason: 'no words generated' }
  }

  const sample = items.map((it) => it.example_es).filter(Boolean).join(' ')
  const tokens = tokenizeAgainst(sample, autoMap, known)
  const words = [...autoMap.values()]

  const title = scenario.charAt(0).toUpperCase() + scenario.slice(1, 60)
  await putArtifact(buildId, 'curation', {
    userId, title, sourceType: 'topic', sourceLabel: scenario, words, tokens,
  })
  await emitProgress({
    phase: 'curate',
    message: `Found ${words.length} words worth learning — opening review`,
    data: { buildId, autoCount: words.length, knownCount: 0, candidateCount: 0 },
  })
  return { ok: true, buildId, autoCount: words.length }
}
