// Resolves the user's active pack and computes its dashboard stats. The active
// pack drives the dashboard hero/ring/stats and the study queue. A null
// active_pack_id (or a stale/deleted id) means the built-in 1500-word corpus pack.

import { words } from '@/data/words'
import { splitProgress } from '@/lib/userStats'

const KNOWN = ['good', 'easy']
const LEARNING = ['again', 'hard']
const SOURCE_LABEL = { url: 'Website', pdf: 'PDF', srt: 'TV series', topic: 'Topic' }

export const DEFAULT_PACK = {
  id: null,
  title: '1500 most common words',
  meta: 'Default pack · frequency-ranked',
  isDefault: true,
  wordCount: 1500,
}

export async function resolveActivePack(supabase, userId) {
  const { data: settings } = await supabase
    .from('user_settings')
    .select('active_pack_id')
    .eq('user_id', userId)
    .maybeSingle()

  const activeId = settings?.active_pack_id ?? null
  if (!activeId) return DEFAULT_PACK

  const { data: pack } = await supabase
    .from('vocab_packs')
    .select('id, title, source_type, word_count')
    .eq('id', activeId)
    .eq('user_id', userId)
    .maybeSingle()

  if (!pack) return DEFAULT_PACK // stale/deleted → fall back to default
  return {
    id: pack.id,
    title: pack.title,
    meta: `${SOURCE_LABEL[pack.source_type] || pack.source_type} · ${pack.word_count} words`,
    isDefault: false,
    wordCount: pack.word_count,
  }
}

// Default entry + the user's custom packs, for the switcher dropdown.
export async function listSwitcherPacks(supabase, userId) {
  const { data: packs } = await supabase
    .from('vocab_packs')
    .select('id, title, source_type, word_count')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const customs = (packs ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    meta: `${SOURCE_LABEL[p.source_type] || p.source_type} · ${p.word_count} words`,
    isDefault: false,
    wordCount: p.word_count,
  }))
  return [DEFAULT_PACK, ...customs]
}

export async function computePackStats(supabase, userId, pack, { unlocked }) {
  if (pack.isDefault) return computeDefaultStats(supabase, userId, { unlocked })
  return computeCustomStats(supabase, userId, pack)
}

async function computeDefaultStats(supabase, userId, { unlocked }) {
  const { data: progress } = await supabase
    .from('user_word_progress')
    .select('word_rank, status, next_review')
    .eq('user_id', userId)

  const { knownSet, learningSet, knownCount, learningCount, dueCount } = splitProgress(progress ?? [])

  const wordLimit = unlocked ? 1500 : 100
  const inLimit = words.filter((w) => w.rank <= wordLimit)
  const unseen = inLimit.filter((w) => !knownSet.has(w.rank) && !learningSet.has(w.rank))
  const nextWord = inLimit.find((w) => !knownSet.has(w.rank)) ?? null

  return {
    known: knownCount,
    learning: learningCount,
    due: dueCount,
    unseen: Math.min(20, unseen.length),
    nextWord: nextWord ? { rank: nextWord.rank, word: nextWord.word, pos: nextWord.pos } : null,
    total: 1500,
    studyHref: '/study',
  }
}

async function computeCustomStats(supabase, userId, pack) {
  const now = new Date()
  const { data: packWords } = await supabase
    .from('pack_words')
    .select('id, position, lemma, pos, corpus_rank, meanings, example_es, example_en')
    .eq('pack_id', pack.id)
    .order('position')

  const rows = packWords ?? []
  const corpusRanks = rows.filter((w) => w.corpus_rank != null).map((w) => w.corpus_rank)
  const nonCorpusIds = rows.filter((w) => w.corpus_rank == null).map((w) => w.id)

  const [{ data: wp }, { data: pwp }] = await Promise.all([
    corpusRanks.length
      ? supabase.from('user_word_progress').select('word_rank, status, next_review').eq('user_id', userId).in('word_rank', corpusRanks)
      : Promise.resolve({ data: [] }),
    nonCorpusIds.length
      ? supabase.from('user_pack_word_progress').select('pack_word_id, status, next_review').eq('user_id', userId).in('pack_word_id', nonCorpusIds)
      : Promise.resolve({ data: [] }),
  ])

  const byRank = new Map((wp ?? []).map((r) => [r.word_rank, r]))
  const byId = new Map((pwp ?? []).map((r) => [r.pack_word_id, r]))

  let known = 0, learning = 0, due = 0, unseen = 0, nextWord = null
  for (const w of rows) {
    const prog = w.corpus_rank != null ? byRank.get(w.corpus_rank) : byId.get(w.id)
    if (!prog) {
      unseen++
      if (!nextWord) nextWord = { rank: w.corpus_rank, word: w.lemma, pos: w.pos }
      continue
    }
    if (KNOWN.includes(prog.status)) known++
    else if (LEARNING.includes(prog.status)) learning++
    if (prog.next_review && new Date(prog.next_review) <= now) due++
  }

  return {
    known,
    learning,
    due,
    unseen: Math.min(20, unseen),
    nextWord,
    total: rows.length,
    studyHref: `/packs/${pack.id}`,
  }
}
