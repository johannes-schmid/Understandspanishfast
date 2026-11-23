'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { coverageAt, fit, productFor, PRODUCTS, readReach } from '@/lib/watchFit'

const TYPES = [['all', 'All'], ['series', 'Series'], ['film', 'Films']]
const REGIONS = [['all', 'All'], ['spain', 'Spain'], ['latam', 'Latin America']]
const LEVELS = [['all', 'All'], ['Easy', 'Easy'], ['Medium', 'Medium'], ['Hard', 'Hard'], ['Very hard', 'Very hard']]
const fmt = (n) => n.toLocaleString('en')

function Seg({ label, options, value, onChange }) {
  return (
    <div className="sx-seg" role="group" aria-label={label}>
      <span className="mono">{label}</span>
      <div>
        {options.map(([k, l]) => (
          <button key={k} type="button" aria-pressed={value === k} className={value === k ? 'on' : undefined} onClick={() => onChange(k)}>{l}</button>
        ))}
      </div>
    </div>
  )
}

export default function ShowsExplorer({ shows }) {
  const [words, setWords] = useState(1000)
  const [fromTest, setFromTest] = useState(false)
  const [type, setType] = useState('all')
  const [region, setRegion] = useState('all')
  const [level, setLevel] = useState('all')
  const [sort, setSort] = useState('fit')

  useEffect(() => {
    const r = readReach()
    if (r != null) { setWords(Math.max(100, Math.min(1500, Math.round(r / 50) * 50))); setFromTest(true) }
  }, [])

  const rows = useMemo(() => {
    const list = shows.filter((s) =>
      (type === 'all' || (type === 'film' ? s.type === 'Film' : s.type !== 'Film')) &&
      (region === 'all' || (region === 'spain' ? s.country.startsWith('Spain') : !s.country.startsWith('Spain'))) &&
      (level === 'all' || s.level === level))
    return list
      .map((s) => ({ s, f: fit(s, words) }))
      .sort((a, b) => (sort === 'fit' ? b.f.value - a.f.value || b.s.easiness - a.s.easiness : b.s.easiness - a.s.easiness))
  }, [shows, type, region, level, sort, words])

  const ready = useMemo(() => shows.filter((s) => coverageAt(s, words) >= 90).length, [shows, words])
  const rec = productFor(words)
  const main = PRODUCTS[rec.main]

  return (
    <>
      <div className="sx-top">
        <div className="card sx-you">
          <div className="sx-you-head">
            <span className="mono">{fromTest ? 'YOUR LEVEL TEST RESULT' : 'YOUR VOCABULARY'}</span>
            {!fromTest && <Link className="tlink" href="/level-test">Take the 2-minute test</Link>}
          </div>
          <label className="sx-words" htmlFor="sx-range">
            <b className="tab">{words >= 1500 ? '1,500+' : `~${fmt(words)}`}</b> Spanish words
          </label>
          <input id="sx-range" className="sx-range" type="range" min="100" max="1500" step="50" value={words} onChange={(e) => { setWords(Number(e.target.value)); setFromTest(false) }} />
          <p className="sx-you-sum">
            {ready > 0
              ? <><strong className="tab">{ready} of {shows.length}</strong> titles are ready to watch with Spanish subtitles (90%+ familiar words).</>
              : <>None of these titles reach 90% familiar words yet. At 1,000 words, {shows.filter((s) => coverageAt(s, 1000) >= 90).length} do.</>}
          </p>
        </div>
        <div className="card sx-rec">
          <span className="mono">NEXT STEP FOR YOU</span>
          <h2>{rec.title}</h2>
          <p>{rec.body}</p>
          <div className="sx-rec-buy">
            <Link className="btn btn-coral" href={main.href}>{main.name} · {main.price}</Link>
            <div className="sx-rec-alt">
              {rec.also.map((k) => <Link key={k} className="link" href={PRODUCTS[k].href}>{PRODUCTS[k].name} · {PRODUCTS[k].price}</Link>)}
            </div>
          </div>
        </div>
      </div>

      <div className="sx-filters">
        <Seg label="TYPE" options={TYPES} value={type} onChange={setType} />
        <Seg label="FROM" options={REGIONS} value={region} onChange={setRegion} />
        <Seg label="LEVEL" options={LEVELS} value={level} onChange={setLevel} />
        <Seg label="SORT" options={[['fit', 'Best for me'], ['easy', 'Easiest']]} value={sort} onChange={setSort} />
      </div>

      <div className="card sx-list">
        <div className="sx-row sx-head" aria-hidden="true">
          <span>Title</span><span>Easiness</span><span>Level</span><span>You follow</span>
        </div>
        <ol>
          {rows.map(({ s, f }) => (
            <li key={s.slug}>
              <Link className="sx-row" href={`/spanish-shows/${s.slug}`}>
                <span className="sx-t"><b>{s.title}</b><span>{s.type === 'Film' ? 'Film' : s.type === 'Podcast' ? 'Podcast' : 'Series'} · {s.country} · {s.years}</span></span>
                <span className="sx-score"><b className="tab">{s.easiness}</b><span>/100</span></span>
                <span className={`sx-lvl sx-${s.level.replace(' ', '-').toLowerCase()}`}>{s.level}<span>{s.cefr}</span></span>
                <span className="sx-fit">
                  <span className="sx-fit-top"><b className="tab">{Math.round(f.value)}%</b><span className={`sx-tag sx-${f.key}`}>{f.label}</span></span>
                  <span className="cv-track"><i className="cv-fill" style={{ transform: `scaleX(${f.value / 100})` }} /></span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        {rows.length === 0 && <p className="sx-empty">No titles match these filters.</p>}
      </div>
    </>
  )
}
