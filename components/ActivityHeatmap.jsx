'use client'

const WEEKS = 21
const SHOW_DOW = [1, 4] // Mon, Thu

const EMPTY = '#E2E0F4'
const LIGHT = '#9DC4B0'
const FULL  = 'var(--signal)'

function getColor(count) {
  if (count === 0) return EMPTY
  if (count < 5) return LIGHT
  return FULL
}

function isoOf(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function buildGrid(countMap) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const start = new Date(today)
  start.setDate(today.getDate() - (WEEKS * 7 - 1))

  const cols = []
  const cursor = new Date(start)

  while (cursor <= today) {
    if (SHOW_DOW.includes(cursor.getDay())) {
      const weekIdx = Math.floor((cursor - start) / (7 * 86400000))
      if (!cols[weekIdx]) cols[weekIdx] = []
      cols[weekIdx].push({ iso: isoOf(cursor), count: countMap.get(isoOf(cursor)) ?? 0 })
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  while (cols.length < WEEKS) cols.push([])
  return cols
}

function computeStreak(countMap) {
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

function cardsThisWeek(countMap) {
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  let total = 0
  for (let i = 0; i < 7; i++) {
    total += countMap.get(isoOf(cursor)) ?? 0
    cursor.setDate(cursor.getDate() - 1)
  }
  return total
}

export default function ActivityHeatmap({ activityData = [] }) {
  const countMap = new Map(activityData.map(r => [r.date, r.count]))
  const grid = buildGrid(countMap)
  const streak = computeStreak(countMap)
  const weekTotal = cardsThisWeek(countMap)

  return (
    <div className="dash-streak">
      <div style={{ flex: 'none' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.14em', color: 'var(--sand)' }}>
          STUDY STREAK
        </div>
        <div style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 700, fontSize: '22px', color: 'var(--deep-mind)', lineHeight: 1.25 }}>
          {streak} day{streak === 1 ? '' : 's'}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--sand)' }}>
          {weekTotal} card{weekTotal === 1 ? '' : 's'} this week
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: `repeat(${WEEKS}, 1fr)`,
        gridTemplateRows: `repeat(${SHOW_DOW.length}, 14px)`,
        gridAutoFlow: 'column',
        gap: '5px',
      }}>
        {grid.map((col, wi) =>
          Array.from({ length: SHOW_DOW.length }, (_, di) => {
            const cell = col[di]
            return (
              <div
                key={`${wi}-${di}`}
                title={cell ? `${cell.iso}: ${cell.count} card${cell.count === 1 ? '' : 's'}` : ''}
                style={{
                  borderRadius: '3px',
                  background: cell ? getColor(cell.count) : 'transparent',
                }}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
