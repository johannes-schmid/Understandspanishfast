'use client'

import { useState, useMemo, useRef, useEffect, Fragment } from 'react'
import Link from 'next/link'
import { TYPE_LABEL } from '@/data/wordTypes'
import { Arrow, CoverageBars, Crumbs, Offline, FaqSection, Closing } from '@/components/WordListPage'

const FILTERS = [
  { key: 'all',  label: 'All' },
  { key: 'verb', label: 'Verbs' },
  { key: 'noun', label: 'Nouns' },
  { key: 'adj',  label: 'Adjectives' },
  { key: 'adv',  label: 'Adverbs' },
  { key: 'other',label: 'Other' },
]
const OTHER_TYPES = new Set(['prep', 'conj', 'art', 'pron', 'det', 'num', 'other'])

const FAQS = [
  { q: 'How many Spanish words do I need to be conversational?', a: 'Around 1,000 of the most frequent words covers ~74% of everyday spoken Spanish. With 1,500 you reach roughly 80%, enough to follow most conversations and shows without constant guessing.' },
  { q: 'Where does this frequency list come from?', a: 'The list is compiled from large Spanish-language corpora, primarily TV and film subtitles and spoken-language sources, to reflect what real speakers actually say, not what textbooks teach.' },
  { q: 'Is this list free?', a: 'Yes. The full 1,500-word list is free to read, search, filter and mark as learned, with no signup. To practise, try the flashcards for free, or work through all 1,500 words on paper with the Top 1,500 workbook.' },
  { q: 'What’s the difference between this and Duolingo?', a: 'Duolingo teaches words in a fixed lesson order, mixing useful and obscure vocabulary. This list is ranked purely by frequency, so every word you learn directly increases your real-world comprehension.' },
  { q: 'Why 1,500 words and not 1,000 or 2,000?', a: '1,500 is the threshold where comprehension jumps from constantly guessing to mostly following. Below it you’re swimming against the current. Above it, context-guessing kicks in and learning accelerates naturally.' },
]

function getLearned() {
  try { return new Set(JSON.parse(localStorage.getItem('usf_learned') || '[]')) }
  catch { return new Set() }
}

function Tick() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fcfcff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
}

export default function WordsPageClient({ words: WORDS, milestones: MILESTONES, milestoneText: MILESTONE_TEXT }) {
  const [learned, setLearned]     = useState(() => new Set())
  const [filter, setFilter]       = useState('all')
  const [query, setQuery]         = useState('')
  const [hideTrans, setHideTrans] = useState(false)
  const [playing, setPlaying]     = useState(null)
  const audio = useRef(null)

  useEffect(() => { setLearned(getLearned()) }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return WORDS.filter((w) => {
      const matchSearch = !q || w.word.toLowerCase().includes(q) || w.meanings.some((m) => m.toLowerCase().includes(q))
      let matchFilter = true
      if (filter === 'other') matchFilter = OTHER_TYPES.has(w.type)
      else if (filter !== 'all') matchFilter = w.type === filter
      return matchSearch && matchFilter
    })
  }, [WORDS, filter, query])

  const showAll      = filter === 'all' && !query
  const learnedCount = learned.size
  const coverage     = Math.min(80, Math.round((learnedCount / 1500) * 80))

  function toggleLearned(rank) {
    setLearned((prev) => {
      const next = new Set(prev)
      if (next.has(rank)) next.delete(rank); else next.add(rank)
      try { localStorage.setItem('usf_learned', JSON.stringify([...next])) } catch {}
      return next
    })
  }

  function play(w) {
    if (!w.audio) return
    if (audio.current) audio.current.pause()
    audio.current = new Audio(`/audio/${encodeURIComponent(w.audio)}`)
    setPlaying(w.rank)
    audio.current.onended = () => setPlaying(null)
    audio.current.play().catch(() => setPlaying(null))
  }

  return (
    <div className="cl cl-home">
      <div className="wrap pg">
        <Crumbs items={[{ href: '/', label: 'Home' }, { href: '/words', label: 'Spanish Words' }, { label: '1000 Most Common Spanish Words' }]} />

        <div className="pg-head">
          <div>
            <h1 className="pg-h1">The 1,000 most common Spanish words</h1>
            <p className="lead">
              Ranked by real-world frequency. The top 1,000 cover ~74% of everyday spoken Spanish;
              work through all 1,500 here and you’ll reach ~80%. Each word has its meaning, an example sentence and native audio.
            </p>
            <div className="cta-row">
              <Link className="btn btn-navy" href="/study">Start for free <Arrow /></Link>
              <Link className="btn btn-ghost" href="/workbook">Get the workbook</Link>
            </div>
          </div>
          <aside className="card facts">
            <div className="facts-top">
              <div>
                <div className="facts-num tab">~74%</div>
                <div className="facts-lbl">of everyday spoken Spanish</div>
              </div>
              <span className="mono tab">{WORDS.length.toLocaleString('en')} WORDS</span>
            </div>
            <CoverageBars level={1000} />
            <p className="facts-note">Share of words in everyday spoken Spanish you’ll recognise after learning the top N.</p>
          </aside>
        </div>

        <nav className="sibs" aria-label="Related word lists">
          <Link href="/words/top-100-spanish-words">Top 100</Link>
          <Link href="/words/top-500-spanish-words">Top 500</Link>
          <Link href="/words/most-common-spanish-verbs">Common verbs</Link>
          <Link href="/words/spanish-frequency-list">How this list is built</Link>
        </nav>

        <div className="card list-card wl" id="list">
          <div className="list-bar">
            <div className="seg" role="group" aria-label="Word type">
              {FILTERS.map((f) => (
                <button key={f.key} type="button" className={filter === f.key ? 'on' : undefined} aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>{f.label}</button>
              ))}
            </div>
            <div className="wl-tools">
              <button type="button" className="btn btn-ghost btn-sm" aria-pressed={hideTrans} onClick={() => setHideTrans((v) => !v)}>{hideTrans ? 'Show English' : 'Hide English'}</button>
              <label className="search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                <span className="sr-only">Search words</span>
                <input type="search" placeholder="Search Spanish or English" value={query} onChange={(e) => setQuery(e.target.value)} />
              </label>
            </div>
          </div>

          <div className="wl-progress">
            <span className="mono tab"><b>{learnedCount.toLocaleString('en')}</b> LEARNED</span>
            <div className="p-track" aria-hidden="true"><div className="p-fill" style={{ transform: `scaleX(${Math.min(1, learnedCount / 1500)})` }} /></div>
            <span className="mono tab">~{coverage}% COVERAGE · {filtered.length.toLocaleString('en')} SHOWN</span>
          </div>

          {filtered.length === 0 ? (
            <p className="list-empty">No words match “{query}”. Try the English meaning instead.</p>
          ) : (
            <table>
              <thead>
                <tr><th>Rank</th><th>Word</th><th>Type</th><th>Meaning</th><th>Example</th><th><span className="sr-only">Audio and learned</span></th></tr>
              </thead>
              <tbody>
                {filtered.map((w) => {
                  const isLearned = learned.has(w.rank)
                  const milestone = showAll && MILESTONES[w.rank - 1]
                  return (
                    <Fragment key={w.rank}>
                      <tr className={isLearned ? 'learned' : undefined}>
                        <td className="rk tab">#{w.rank}</td>
                        <td className="w">{w.word}{!hideTrans && <span className="w-sub">{w.translation}</span>}</td>
                        <td className="pos">{(TYPE_LABEL[w.type] || w.type).toLowerCase()}</td>
                        <td className={`mn${hideTrans ? ' hide-en' : ''}`}><span>{w.meanings.slice(0, 3).join(', ')}</span></td>
                        <td className={`ex${hideTrans ? ' hide-en' : ''}`}>
                          {w.example_es && <><span className="es">{w.example_es}</span>{w.example_en && <small><span>{w.example_en}</span></small>}</>}
                        </td>
                        <td className="acts-cell">
                          <div className="acts">
                            {w.audio && (
                              <button type="button" className={`chk${playing === w.rank ? ' on' : ''}`} aria-label={`Play ${w.word}`} onClick={() => play(w)}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill={playing === w.rank ? '#fcfcff' : '#14204a'} aria-hidden="true"><path d="M7 4.5v15l13-7.5z" /></svg>
                              </button>
                            )}
                            <button type="button" className={`chk${isLearned ? ' on' : ''}`} aria-pressed={isLearned} aria-label={isLearned ? `Mark ${w.word} as not learned` : `Mark ${w.word} as learned`} onClick={() => toggleLearned(w.rank)}>
                              {isLearned && <Tick />}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {milestone && (
                        <tr className="ms-row">
                          <td colSpan={6}><span className="mono tab">TOP {w.rank.toLocaleString('en')}</span>{MILESTONE_TEXT[w.rank - 1].split('— ')[1]}</td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <section className="sec-sm">
          <div className="sec-head">
            <h2>Take the list offline</h2>
            <p className="lead">Get the top 1,000 as a free PDF, or work through all 1,500 words on paper with the workbook.</p>
          </div>
          <Offline source="most-common-spanish-words" />
        </section>

        <FaqSection faqs={FAQS} />

        <Closing />
      </div>
    </div>
  )
}
