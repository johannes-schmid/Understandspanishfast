import { generateText, Output } from 'ai'
import { z } from 'zod'
import { RetryableError } from 'workflow'
import { DEFINITION_MODEL } from '@/lib/aiModels'
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
  await putArtifact(buildId, candidatesRef, { corpusHits, nonCorpus: cappedNonCorpus })

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

For each Spanish word below, return a dictionary entry. Give the canonical LEMMA (infinitive for verbs, masculine singular for nouns/adjectives). Skip any token that is a proper noun, a foreign/non-Spanish word, a typo, or not a real Spanish word by omitting it from the output. Keep example sentences short and natural for the learner's level.

Words: ${wordList}`,
  })

  const entries = output?.entries || []
  await putArtifact(buildId, entriesRef, { entries })
  await emitProgress({ phase: 'define', message: `Defined ${entries.length} words` })
  return { ok: true, definedCount: entries.length, entriesRef }
}

// ── Persist (idempotent) ────────────────────────────────────────

export async function savePackStep(buildId, args, userId) {
  'use step'
  const { candidatesRef, entriesRef, title, sourceType, sourceLabel, runId } = args
  const supabase = createAdminClient()

  // Idempotency: a step replay after a crash must not create a duplicate pack.
  const { data: existing } = await supabase
    .from('vocab_packs')
    .select('id, word_count')
    .eq('build_id', buildId)
    .maybeSingle()
  if (existing) return { ok: true, packId: existing.id, wordCount: existing.word_count }

  const cand = await getArtifact(buildId, candidatesRef)
  const corpusHits = cand?.corpusHits || []
  const entries = entriesRef ? (await getArtifact(buildId, entriesRef))?.entries || [] : []
  const known = await knownRankSet(userId)

  const seen = new Set()
  const final = []

  for (const c of corpusHits) {
    const key = normalise(c.lemma)
    if (seen.has(key)) continue
    const corpus = lookupCorpus(c.lemma)
    if (!corpus) continue
    seen.add(key)
    final.push({
      lemma: corpus.word, corpus_rank: corpus.rank, pos: corpus.pos,
      meanings: corpus.meanings, example_es: corpus.example_es, example_en: corpus.example_en,
      image: corpus.image ?? null, why: null, doc_freq: c.freq,
    })
  }

  for (const e of entries) {
    const key = normalise(e.lemma)
    if (seen.has(key)) continue
    const corpus = lookupCorpus(e.lemma)
    if (corpus) {
      if (known.has(corpus.rank)) continue // lemmatized onto a word they already know
      seen.add(key)
      final.push({
        lemma: corpus.word, corpus_rank: corpus.rank, pos: corpus.pos,
        meanings: corpus.meanings, example_es: corpus.example_es, example_en: corpus.example_en,
        image: corpus.image ?? null, why: null, doc_freq: null,
      })
    } else {
      seen.add(key)
      final.push({
        lemma: e.lemma, corpus_rank: null, pos: e.pos,
        meanings: [e.definition_en], example_es: e.example_es, example_en: e.example_en,
        image: null, why: null, doc_freq: null,
      })
    }
  }

  const words = final.slice(0, TARGET.max)
  if (words.length === 0) {
    await emitProgress({ phase: 'note', message: 'No new words left after excluding what you already know.' })
    return { ok: false, reason: 'no new words found after excluding what the learner already knows' }
  }

  const { data: pack, error: packErr } = await supabase
    .from('vocab_packs')
    .insert({
      user_id: userId, title: title || 'Vocabulary pack', source_type: sourceType,
      source_ref: sourceLabel || null, status: 'ready', word_count: words.length,
      run_id: runId || null, build_id: buildId,
    })
    .select('id')
    .single()
  if (packErr) throw new Error(`savePack insert: ${packErr.message}`)

  const rows = words.map((w, i) => ({
    pack_id: pack.id, position: i, lemma: w.lemma, corpus_rank: w.corpus_rank, pos: w.pos,
    meanings: w.meanings, example_es: w.example_es, example_en: w.example_en,
    why: w.why, image: w.image, doc_freq: w.doc_freq,
  }))
  const { error: wordsErr } = await supabase.from('pack_words').insert(rows)
  if (wordsErr) throw new Error(`savePack words: ${wordsErr.message}`)

  await emitProgress({ phase: 'done', message: `Saved “${title}” — ${words.length} words`, data: { packId: pack.id, wordCount: words.length } })
  return { ok: true, packId: pack.id, wordCount: words.length }
}
