export const TOTAL_WORDS = 1500
export const FREE_WORDS = 100

const POINTS = [
  [0, 0], [100, 50], [250, 60], [500, 67], [750, 72], [1000, 74], [1500, 80], [2000, 84], [3000, 90],
]

export function coveragePct(knownCount) {
  const n = Math.max(0, knownCount)
  for (let i = 1; i < POINTS.length; i++) {
    const [x1, y1] = POINTS[i]
    if (n <= x1) {
      const [x0, y0] = POINTS[i - 1]
      return Math.round(y0 + ((n - x0) / (x1 - x0)) * (y1 - y0))
    }
  }
  return 90
}

export const MILESTONES = [
  { words: 100, pct: 50, label: 'Half of everyday speech' },
  { words: 250, pct: 60, label: 'Simple conversations' },
  { words: 500, pct: 67, label: 'Short stories' },
  { words: 1000, pct: 74, label: 'TV dialogue' },
  { words: 1500, pct: 80, label: 'Full foundation' },
]
