'use client'

const WEEKS = 16
const SHOW_DOW = [1, 4] // Mon, Thu

// 4 intensity levels — 0 cards = gray, 1–4 = light, 5–9 = medium, 10+ = full
const LEVELS = [
  { min: 0,  max: 0,  color: '#E5E2F0' }, // inactive
  { min: 1,  max: 4,  color: '#9ACBB8' }, // light green
  { min: 5,  max: 9,  color: '#4D8D74' }, // medium green
  { min: 10, max: Infinity, color: '#2D7A5F' }, // full signal
]

function getColor(count) {
  if (count === 0) return '#E5E2F0'
  const level = LEVELS.find(l => count >= l.min && count <= l.max)
  return level?.color ?? '#2D7A5F'
}

function buildGrid(activityData) {
  const countMap = new Map(activityData.map(r => [r.date, r.count]))
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const start = new Date(today)
  start.setDate(today.getDate() - (WEEKS * 7 - 1))

  const cols = []
  const cursor = new Date(start)
  const end = new Date(today)
  end.setDate(today.getDate() + 1)

  while (cursor < end) {
    const dow = cursor.getDay()
    if (SHOW_DOW.includes(dow)) {
      const iso = cursor.toISOString().slice(0, 10)
      const weekIdx = Math.floor((cursor - start) / (7 * 86400000))
      if (!cols[weekIdx]) cols[weekIdx] = []
      cols[weekIdx].push({
        iso,
        count: countMap.get(iso) ?? 0,
        isFuture: cursor > today,
      })
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  while (cols.length < WEEKS) cols.push([])
  return cols
}

export default function ActivityHeatmap({ activityData = [] }) {
  const grid = buildGrid(activityData)
  const totalActive = activityData.filter(r => r.count > 0).length
  const totalCards = activityData.reduce((s, r) => s + (r.count ?? 0), 0)

  return (
    <div style={{
      background: 'var(--white-matter)',
      borderRadius: '16px',
      padding: '16px 20px',
      border: '1px solid var(--cream-dark)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cortex)' }}>
          Study streak
        </p>
        <p style={{ fontSize: '11px', color: 'var(--cortex)' }}>
          {totalActive} day{totalActive !== 1 ? 's' : ''} · {totalCards} cards reviewed
        </p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${WEEKS}, 1fr)`,
        gridTemplateRows: `repeat(${SHOW_DOW.length}, 1fr)`,
        gap: '3px',
      }}>
        {grid.map((col, wi) =>
          (col.length > 0 ? col : Array(SHOW_DOW.length).fill(null)).map((cell, di) => (
            <div
              key={`${wi}-${di}`}
              title={cell ? `${cell.iso}: ${cell.count} card${cell.count !== 1 ? 's' : ''}` : ''}
              style={{
                aspectRatio: '1',
                borderRadius: '2px',
                background: !cell || cell.isFuture ? 'transparent' : getColor(cell.count),
              }}
            />
          ))
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '10px', color: 'var(--cortex)' }}>Less</span>
        {['#E5E2F0', '#9ACBB8', '#4D8D74', '#2D7A5F'].map((c, i) => (
          <div key={i} style={{ width: '9px', height: '9px', borderRadius: '2px', background: c }} />
        ))}
        <span style={{ fontSize: '10px', color: 'var(--cortex)' }}>More</span>
      </div>
    </div>
  )
}
