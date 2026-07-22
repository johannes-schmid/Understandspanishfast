import { words } from '@/data/words'

// Normalise for fuzzy corpus matching (strip accents, lowercase)
export function normalise(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

// Lookup map built once at module scope (cold-start cost only): normalised word -> corpus entry
export const corpusMap = new Map()
for (const w of words) {
  corpusMap.set(normalise(w.word), w)
}

export function lookupCorpus(word) {
  return corpusMap.get(normalise(word)) ?? null
}

// Derive a learner-level hint from the count of known words
export function levelHint(knownCount) {
  return knownCount < 100 ? 'absolute beginner (knows ~50 most common Spanish words)' :
    knownCount < 300 ? 'beginner (knows ~200 most common Spanish words)' :
    knownCount < 600 ? 'elementary (knows ~450 most common Spanish words)' :
    knownCount < 1000 ? 'intermediate (knows ~750 most common Spanish words)' :
    'upper-intermediate (knows ~1200 most common Spanish words)'
}
