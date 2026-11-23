import Link from 'next/link'

export const LEVEL_LABEL = { 100: '100', 500: '500', 1000: '1,000', 1500: '1,500' }

export function pct(v) {
  return `${Math.round(v)}%`
}

// Coverage bars: one row per word level, values in percent (0-100).
export function CoverageMeter({ values, highlight = 1500, levels = [100, 500, 1000, 1500], label, empty = false }) {
  const aria = label || levels.map((L) => `top ${LEVEL_LABEL[L]} words: ${pct(values[L])}`).join(', ')
  return (
    <div className="cv-bars" role="img" aria-label={aria}>
      {levels.map((L) => (
        <div key={L} className={`cv-bar${L === highlight ? ' on' : ''}`}>
          <span className="cv-bar-l tab">Top {LEVEL_LABEL[L]}</span>
          <span className="cv-track"><i className="cv-fill" style={{ transform: `scaleX(${Math.max(0, Math.min(100, values[L])) / 100})` }} /></span>
          <span className="cv-bar-v tab">{empty ? '-' : pct(values[L])}</span>
        </div>
      ))}
    </div>
  )
}

export function WordChips({ words, showRank = true }) {
  return (
    <ul className="cv-chips">
      {words.map((w) => (
        <li key={w.w} className="cv-chip">
          <span className="cv-chip-w">{w.w}</span>
          {w.meaning && <span className="cv-chip-m">{w.meaning}</span>}
          <span className="cv-chip-meta tab">
            {showRank && w.rank ? `#${w.rank.toLocaleString('en')} · ` : ''}{w.n.toLocaleString('en')}×
          </span>
        </li>
      ))}
    </ul>
  )
}

export function FunctionWordNote({ listOnly, level = 1500 }) {
  return (
    <p className="cv-fnote">
      Grammar words such as <i>de, la, que, en, no</i> count as known at every level; you learn them in the first lessons.
      {listOnly != null && <> Counting only the ranked list, the top {LEVEL_LABEL[level]} cover {pct(listOnly)}.</>}
    </p>
  )
}

export function LearnCtas() {
  return (
    <div className="cv-ctas">
      <div>
        <h2>Close the gap with the right words</h2>
        <p>Every word you are missing is either in the top 1,500 or rare enough to look up. Learn the list in frequency order and the first group disappears.</p>
      </div>
      <div className="cv-ctas-row">
        <Link className="btn btn-navy" href="/study">Start for free</Link>
        <Link className="btn btn-ghost" href="/anki-spanish-deck">Anki deck</Link>
        <Link className="btn btn-ghost" href="/workbook">Workbook</Link>
      </div>
    </div>
  )
}
