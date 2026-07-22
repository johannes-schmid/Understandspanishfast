// Shared progress math. Used by the dashboard components and by the retention
// email cron, which has no React and no browser — so nothing here may touch the
// DOM or a Supabase client. Callers fetch the rows, these functions read them.

export const TOTAL_WORDS = 1500

export const MILESTONES = [
  { words: 100,  label: 'Basics' },
  { words: 500,  label: 'Simple stories' },
  { words: 1000, label: 'TV dialogue' },
  { words: 1500, label: 'Full foundation' },
]

const KNOWN_STATUSES = ['good', 'easy']
const LEARNING_STATUSES = ['again', 'hard']

export function isoOf(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// activityData: [{ date: 'YYYY-MM-DD', count: n }]
export function toCountMap(activityData = []) {
  return new Map(activityData.map(r => [r.date, r.count]))
}

export function computeStreak(countMap) {
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  // A streak survives today not being studied yet — start from yesterday in that case.
  if (!(countMap.get(isoOf(cursor)) > 0)) cursor.setDate(cursor.getDate() - 1)

  let streak = 0
  while (countMap.get(isoOf(cursor)) > 0) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function cardsThisWeek(countMap) {
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  let total = 0
  for (let i = 0; i < 7; i++) {
    total += countMap.get(isoOf(cursor)) ?? 0
    cursor.setDate(cursor.getDate() - 1)
  }
  return total
}

// progressRows: [{ word_rank, status, next_review }]
export function splitProgress(progressRows = [], now = new Date()) {
  const knownSet = new Set(
    progressRows.filter(r => KNOWN_STATUSES.includes(r.status)).map(r => r.word_rank)
  )
  const learningSet = new Set(
    progressRows.filter(r => LEARNING_STATUSES.includes(r.status)).map(r => r.word_rank)
  )
  const dueCount = progressRows.filter(r =>
    r.next_review && new Date(r.next_review) <= now
  ).length

  return {
    knownSet,
    learningSet,
    knownCount: knownSet.size,
    learningCount: learningSet.size,
    dueCount,
  }
}

// Share of everyday spoken Spanish covered by the top N words. Caps at 95%
// because the long tail never fully closes.
export function coveragePct(knownCount) {
  return Math.min(95, Math.round(knownCount / 3000 * 95))
}

export function nextMilestone(knownCount) {
  const milestone = MILESTONES.find(m => m.words > knownCount)
  if (!milestone) return null
  return { ...milestone, wordsUntil: milestone.words - knownCount }
}

// Whole days since the user last reviewed anything. null = never studied.
export function daysSinceStudy(activityData = []) {
  const studied = activityData.filter(r => (r.count ?? 0) > 0)
  if (studied.length === 0) return null

  const latest = studied
    .map(r => r.date)
    .sort()
    .at(-1)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const last = new Date(`${latest}T00:00:00`)

  return Math.round((today - last) / 86400000)
}

export function totalCardsReviewed(activityData = []) {
  return activityData.reduce((sum, r) => sum + (r.count ?? 0), 0)
}

export function daysPracticed(activityData = []) {
  return activityData.filter(r => (r.count ?? 0) > 0).length
}

// Share of an article's unique in-list words the user can already read.
// Mirrors what ArticleCard renders.
export function articleReadiness(article, knownCount) {
  const uniqueRanks = new Set(
    article.content.filter(t => t.type === 'word' && t.rank !== null).map(t => t.rank)
  )
  if (uniqueRanks.size === 0) return 0
  const knownInArticle = [...uniqueRanks].filter(r => knownCount >= r).length
  return Math.round((knownInArticle / uniqueRanks.size) * 100)
}
