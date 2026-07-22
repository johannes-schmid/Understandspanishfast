import { words } from '@/data/words'

// Deterministic per (user, email) so a re-render or retry produces the same pack.
function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Prefers words the user has never seen, so the pack is always new to them.
// Falls back to the top ranks when they have already covered the pool.
export function pickWordPack({ userId, emailKey, seenRanks = new Set(), count = 5, maxRank = 300 }) {
  const pool = words.filter(w => w.rank <= maxRank && w.example_es && !seenRanks.has(w.rank))
  const source = pool.length >= count
    ? pool
    : words.filter(w => w.rank <= maxRank && w.example_es)

  const seed = hash(`${userId}:${emailKey}`)
  const stride = 7 + (seed % 13)

  const picked = []
  const used = new Set()
  let idx = seed % source.length

  while (picked.length < count && used.size < source.length) {
    if (!used.has(idx)) {
      used.add(idx)
      picked.push(source[idx])
    }
    idx = (idx + stride) % source.length
  }

  return picked.sort((a, b) => a.rank - b.rank)
}
