'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'

const ROWS = 10
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'verb', label: 'Verbs' },
  { key: 'noun', label: 'Nouns' },
  { key: 'adj', label: 'Adjectives' },
  { key: 'adv', label: 'Adverbs' },
]
const POS_LABEL = { 'v.': 'verb', 'n.': 'noun', 'adj.': 'adjective', 'adv.': 'adverb', 'prep.': 'preposition', 'conj.': 'conjunction', 'pron.': 'pronoun', 'det.': 'determiner', 'art.': 'article', 'interj.': 'interjection', 'num.': 'number' }

function typeKey(pos = '') {
  const p = pos.toLowerCase()
  if (p.startsWith('v')) return 'verb'
  if (p.startsWith('n.')) return 'noun'
  if (p.startsWith('adj')) return 'adj'
  if (p.startsWith('adv')) return 'adv'
  return 'other'
}

function Arrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

export default function HomepageWordPreview({ words, total }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [hideEn, setHideEn] = useState(false)
  const [playing, setPlaying] = useState(null)
  const audio = useRef(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return words.filter((w) =>
      (filter === 'all' || typeKey(w.pos) === filter) &&
      (!q || w.word.toLowerCase().includes(q) || (w.meanings || []).some((m) => m.toLowerCase().includes(q)))
    )
  }, [words, search, filter])

  const rows = filtered.slice(0, ROWS)

  function play(w) {
    if (!w.audio) return
    if (audio.current) audio.current.pause()
    audio.current = new Audio(`/audio/${encodeURIComponent(w.audio)}`)
    setPlaying(w.rank)
    audio.current.onended = () => setPlaying(null)
    audio.current.play().catch(() => setPlaying(null))
  }

  return (
    <div className="card list-card">
      <div className="list-bar">
        <div className="seg" role="group" aria-label="Word type">
          {FILTERS.map((f) => (
            <button key={f.key} type="button" className={filter === f.key ? 'on' : undefined} aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>{f.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-ghost btn-sm" aria-pressed={hideEn} onClick={() => setHideEn((h) => !h)}>{hideEn ? 'Show English' : 'Hide English'}</button>
          <label className="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <span className="sr-only">Search words</span>
            <input type="search" placeholder={`Search ${words.length} words`} value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="list-empty">No words match “{search}”. Try the English meaning instead.</p>
      ) : (
        <table>
          <thead><tr><th>Rank</th><th>Word</th><th>Type</th><th>Meaning</th><th>Example</th><th><span className="sr-only">Audio</span></th></tr></thead>
          <tbody>
            {rows.map((w) => (
              <tr key={w.rank}>
                <td className="rk tab">#{w.rank}</td>
                <td className="w">{w.word}{!hideEn && <span className="w-sub">{w.meanings?.[0]}</span>}</td>
                <td className="pos">{POS_LABEL[w.pos] || w.pos}</td>
                <td className={`mn${hideEn ? ' hide-en' : ''}`}><span>{(w.meanings || []).slice(0, 2).join(', ')}</span></td>
                <td className={`ex${hideEn ? ' hide-en' : ''}`}>{w.example_es}{w.example_en && <small><span>{w.example_en}</span></small>}</td>
                <td>
                  {w.audio && (
                    <button type="button" className={`chk${playing === w.rank ? ' on' : ''}`} aria-label={`Play ${w.word}`} onClick={() => play(w)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill={playing === w.rank ? '#fcfcff' : '#14204a'} aria-hidden="true"><path d="M7 4.5v15l13-7.5z" /></svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="list-foot">
        <span className="tab">Showing {rows.length} of {total.toLocaleString('en')} · native audio on every word</span>
        <Link className="link" href="/words/most-common-spanish-words">See the full interactive list <Arrow /></Link>
      </div>
    </div>
  )
}
