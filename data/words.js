import data from './words.json'

export const words = data

function posToType(pos) {
  if (!pos) return 'other'
  const p = pos.toLowerCase()
  if (p.startsWith('v.')) return 'verb'
  if (p.startsWith('n.')) return 'noun'
  if (p.startsWith('adj.')) return 'adj'
  if (p.startsWith('adv.')) return 'adv'
  if (p.startsWith('prep.')) return 'prep'
  if (p.startsWith('conj.')) return 'conj'
  if (p.startsWith('art.')) return 'art'
  if (p.startsWith('pron.')) return 'pron'
  if (p.startsWith('det.')) return 'det'
  if (p.startsWith('num.')) return 'num'
  return 'other'
}

export { TYPE_LABEL } from './wordTypes'

export const WORDS = words.map(w => ({
  rank: w.rank,
  word: w.word,
  translation: Array.isArray(w.meanings) ? w.meanings[0] : w.meanings,
  meanings: Array.isArray(w.meanings) ? w.meanings : [w.meanings],
  type: posToType(w.pos),
  example_es: w.example_es || null,
  example_en: w.example_en || null,
}))

const MILESTONE_RANKS = { 100: '~50%', 250: '~60%', 500: '~67%', 750: '~72%', 1000: '~74%', 1500: '~80%' }
export const MILESTONES = WORDS.map(w => !!MILESTONE_RANKS[w.rank])
export const MILESTONE_TEXT = WORDS.map(w =>
  MILESTONE_RANKS[w.rank]
    ? `Top ${w.rank} words — you now understand ${MILESTONE_RANKS[w.rank]} of everyday spoken Spanish`
    : null
)
