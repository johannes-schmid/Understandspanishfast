'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { coveragePct, MILESTONES } from '@/lib/coverage'

const BANDS = [
  { from: 1, to: 100 },
  { from: 101, to: 250 },
  { from: 251, to: 500 },
  { from: 501, to: 750 },
  { from: 751, to: 1000 },
  { from: 1001, to: 1250 },
  { from: 1251, to: 1500 },
]
const PER_BAND = 6
const FAKE_COUNT = 8
const MAX = 1500

const FAKES = [
  'un brocil', 'una carmuela', 'un sorquete', 'una dolcena', 'un garpanto', 'un colbreo',
  'plosar', 'mestrir', 'trunvar', 'vosquir', 'flentar', 'nuspar', 'zandomar',
  'fendrio', 'pelisdo', 'tribuendo',
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildDeck(pool) {
  const items = []
  BANDS.forEach((b, bi) => {
    const inBand = pool.filter(([rank]) => rank >= b.from && rank <= b.to)
    shuffle(inBand).slice(0, PER_BAND).forEach(([rank, word, meaning]) => {
      items.push({ rank, word, meaning, band: bi, sort: bi + Math.random() * 2.5 })
    })
  })
  shuffle(FAKES).slice(0, FAKE_COUNT).forEach((word) => {
    items.push({ word, fake: true, sort: 0.8 + Math.random() * (BANDS.length + 0.7) })
  })
  return items.sort((a, b) => a.sort - b.sort)
}

function score(deck, answers) {
  let fakeYes = 0
  const hits = BANDS.map(() => ({ yes: 0, n: 0 }))
  deck.forEach((item, i) => {
    const yes = answers[i] === true
    if (item.fake) { if (yes) fakeYes++ }
    else { hits[item.band].n++; if (yes) hits[item.band].yes++ }
  })
  const f = fakeYes / FAKE_COUNT
  const bands = BANDS.map((b, i) => {
    const h = hits[i].n ? hits[i].yes / hits[i].n : 0
    const p = f >= 1 ? 0 : Math.max(0, Math.min(1, (h - f) / (1 - f)))
    return { ...b, p, size: b.to - b.from + 1 }
  })
  const raw = bands.reduce((s, b) => s + b.p * b.size, 0)
  const missed = deck
    .map((item, i) => ({ item, yes: answers[i] === true }))
    .filter(({ item, yes }) => !item.fake && !yes)
    .map(({ item }) => item)
    .sort((a, b) => a.rank - b.rank)
  return { estimate: Math.round(raw / 10) * 10, fakeYes, bands, missed }
}

const fmt = (n) => n.toLocaleString('en')
const label = (n) => (n >= MAX - 50 ? '1,500+' : n === 0 ? '0' : `~${fmt(n)}`)

function milestoneInfo(n) {
  const passed = [...MILESTONES].reverse().find((m) => n >= m.words) || null
  const next = MILESTONES.find((m) => n < m.words) || null
  return { passed, next }
}

function recommendation(n, bands) {
  const weak = bands.find((b) => b.p < 0.85)
  const from = weak ? weak.from : MAX
  if (n < 150 || (bands[0] && bands[0].p < 0.7)) {
    return {
      key: 'study',
      title: 'Start with word #1, for free',
      body: 'Your first 100 words cover about half of everyday Spanish. Free flashcards in frequency order, no sign-up.',
      href: '/study', cta: 'Start for free', price: 'Free',
    }
  }
  if (n < 1000) {
    return {
      key: 'workbook',
      title: `Work through ranks ${fmt(from)} to 1,500 on paper`,
      body: '30 units of 50 words in rank order, with exercises, review tests and an answer key. Skip the units you already know.',
      href: '/workbook', cta: 'Get the workbook', price: '€5',
    }
  }
  return {
    key: 'anki',
    title: n >= MAX - 50 ? 'Keep all 1,500 words fresh' : `Close the gap from ${fmt(from)} to 1,500`,
    body: 'The full top 1,500 as a ready-made Anki deck with native audio and example sentences. Suspend the cards you know and drill the rest.',
    href: '/anki-spanish-deck', cta: 'Get the Anki deck', price: '€9',
  }
}

const OTHERS = [
  { key: 'study', label: 'Free flashcards', href: '/study' },
  { key: 'workbook', label: 'Workbook PDF · €5', href: '/workbook' },
  { key: 'anki', label: 'Anki deck · €9', href: '/anki-spanish-deck' },
]

function Arrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

function Icon({ d }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
}

function readShared() {
  try {
    const r = new URLSearchParams(window.location.search).get('r')
    if (r === null || !/^\d{1,4}$/.test(r)) return null
    const n = Number(r)
    return n >= 0 && n <= MAX ? n : null
  } catch { return null }
}

function setUrl(n) {
  try {
    const url = new URL(window.location.href)
    if (n === null) url.searchParams.delete('r')
    else url.searchParams.set('r', String(n))
    window.history.replaceState(null, '', url.pathname + url.search)
  } catch {}
}

export default function LevelTestClient({ pool }) {
  const [deck, setDeck] = useState(null)
  const [answers, setAnswers] = useState([])
  const [shared, setShared] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setDeck(buildDeck(pool))
    setShared(readShared())
  }, [pool])

  const total = deck ? deck.length : BANDS.length * PER_BAND + FAKE_COUNT
  const idx = answers.length
  const done = !!deck && idx >= deck.length
  const current = deck && !done ? deck[idx] : null
  const result = useMemo(() => (done ? score(deck, answers) : null), [done, deck, answers])

  const answer = useCallback((known) => {
    if (!deck) return
    setAnswers((a) => (a.length < deck.length ? [...a, known] : a))
  }, [deck])

  const undo = () => setAnswers((a) => a.slice(0, -1))

  useEffect(() => {
    if (done || !deck) return
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key.toLowerCase()
      if (k === 'arrowright' || k === 'y') { e.preventDefault(); answer(true) }
      else if (k === 'arrowleft' || k === 'n') { e.preventDefault(); answer(false) }
      else if (k === 'backspace') { e.preventDefault(); setAnswers((a) => a.slice(0, -1)) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [done, deck, answer])

  useEffect(() => {
    if (!result) return
    setUrl(result.estimate)
    setShared(null)
    try { localStorage.setItem('usf:lastReach', JSON.stringify({ reach: result.estimate, ts: Date.now() })) } catch {}
  }, [result])

  const restart = () => {
    setDeck(buildDeck(pool))
    setAnswers([])
    setCopied(false)
    setUrl(null)
    window.scrollTo({ top: 0 })
  }

  const share = async () => {
    if (!result) return
    const url = `https://mostcommonspanish.com/level-test?r=${result.estimate}`
    const text = `I know ${label(result.estimate)} Spanish words, ${coveragePct(result.estimate)}% of everyday Spanish. How many do you know?`
    try {
      if (navigator.share && window.matchMedia('(pointer:coarse)').matches) {
        await navigator.share({ title: 'How many Spanish words do you know?', text, url })
        return
      }
      await navigator.clipboard.writeText(`${text} ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    } catch {}
  }

  const progress = idx / total

  return (
    <div className="cl cl-home">
      <div className="wrap pg">
        <div className="pg-head solo">
          <div>
            <h1 className="pg-h1">How many Spanish words do you know?<br /><span className="soft">Find out in two minutes</span></h1>
            <p className="lead">Say yes or no to {total} words from the 1,500 most frequent in Spanish. Get your vocabulary size, how much everyday Spanish you follow, and what to learn next.</p>
          </div>
        </div>

        {shared !== null && !done && idx === 0 && (
          <div className="lt-shared" role="status">
            <b className="tab">{label(shared)}</b>
            <span>Spanish words known by the friend who sent this link, about {coveragePct(shared)}% of everyday Spanish. Your turn.</span>
          </div>
        )}

        <section className="lt" aria-label="Spanish vocabulary test">
          {!done ? (
            <>
              <div className="card quiz">
                <div className="q-meta">
                  <span className="mono tab">WORD {Math.min(idx + 1, total)} OF {total}</span>
                  {idx > 0
                    ? <button type="button" className="lt-undo" onClick={undo}>Undo</button>
                    : <span className="mono tab">ABOUT 2 MIN</span>}
                </div>
                <div className="q-bar" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>

                <div className="panel q-stage" aria-live="polite">
                  <div className="mono">DO YOU KNOW THIS WORD</div>
                  {current
                    ? <div key={idx} className="q-big lt-word" lang="es">{current.word}</div>
                    : <div className="q-big ghost" aria-hidden="true">palabra</div>}
                </div>

                <div className="q-btns">
                  <button type="button" className="btn btn-ghost" disabled={!current} onClick={() => answer(false)}>
                    <Icon d="M6 6l12 12M18 6 6 18" />No<kbd className="lt-kbd" aria-hidden="true">N</kbd>
                  </button>
                  <button type="button" className="btn btn-navy" disabled={!current} onClick={() => answer(true)}>
                    <Icon d="M20 6 9 17l-5-5" />Yes, I know it<kbd className="lt-kbd" aria-hidden="true">Y</kbd>
                  </button>
                </div>
                <p className="q-hint">Say yes only if you would understand it in a sentence. Some words are made up.</p>
              </div>

              <aside className="side">
                <div className="card lt-how">
                  <h2>How the score works</h2>
                  <ol>
                    <li><b className="tab">{BANDS.length * PER_BAND}</b> real words, {PER_BAND} from each of {BANDS.length} frequency bands between rank 1 and 1,500.</li>
                    <li><b className="tab">{FAKE_COUNT}</b> made-up words that look Spanish. Each yes to one lowers your score.</li>
                    <li>Your hit rate per band, corrected for guessing, becomes your estimate.</li>
                  </ol>
                  <p className="lt-how-note">The same yes/no method researchers use in LexTALE-style vocabulary tests.</p>
                </div>
              </aside>
            </>
          ) : (
            <Result result={result} share={share} copied={copied} restart={restart} />
          )}
        </section>
      </div>
    </div>
  )
}

function Result({ result, share, copied, restart }) {
  const { estimate, fakeYes, bands, missed } = result
  const pct = coveragePct(estimate)
  const { passed, next } = milestoneInfo(estimate)
  const rec = recommendation(estimate, bands)
  const weak = bands.find((b) => b.p < 0.85)
  const nextWords = (weak ? missed.filter((w) => w.rank >= weak.from) : missed).slice(0, 6)

  return (
    <>
      <div className="card quiz lt-res">
        <div className="lt-res-top">
          <span className="chip">YOUR RESULT</span>
          {fakeYes > 0 && <span className="mono lt-fakes tab">{fakeYes} OF {FAKE_COUNT} MADE-UP WORDS ACCEPTED</span>}
        </div>

        <div className="lt-score">
          <div>
            <div className="res-num tab">{label(estimate)}</div>
            <div className="res-sub">Spanish words known</div>
          </div>
          <div className="lt-cov">
            <b className="tab">{pct}%</b>
            <span>of everyday Spanish</span>
          </div>
        </div>

        <p className="res-body">
          {passed
            ? <>You have passed the <strong>{fmt(passed.words)}-word</strong> mark: <strong>{passed.label.toLowerCase()}</strong>. </>
            : <>You are still building the core 100 words that make up half of everyday speech. </>}
          {next
            ? <>Next milestone: <strong>{next.label.toLowerCase()}</strong> at {fmt(next.words)} words ({next.pct}%), about <strong>{fmt(Math.max(10, next.words - estimate))} words</strong> away.</>
            : <>That is the full frequency foundation. From here, real content teaches you faster than lists.</>}
          {fakeYes >= 3 && <> You said yes to {fakeYes} made-up words, which pulls your estimate down a lot. Retake it and only say yes when you are sure.</>}
        </p>

        <h2 className="lt-h">By frequency band</h2>
        <ul className="lt-bands">
          {bands.map((b) => (
            <li key={b.from} className={weak && b.from === weak.from ? 'is-next' : undefined}>
              <span className="mono tab">{fmt(b.from)}–{fmt(b.to)}</span>
              <span className="lt-track" aria-hidden="true"><i style={{ transform: `scaleX(${b.p})` }} /></span>
              <b className="tab">{Math.round(b.p * 100)}%</b>
            </li>
          ))}
        </ul>

        {nextWords.length > 0 && (
          <>
            <h2 className="lt-h">Learn these next{weak ? <span> ranks {fmt(weak.from)}–{fmt(weak.to)}</span> : null}</h2>
            <ul className="lt-next">
              {nextWords.map((w) => (
                <li key={w.rank}>
                  <span className="mono tab">#{w.rank}</span>
                  <b lang="es">{w.word}</b>
                  <span className="lt-mean">{w.meaning}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="cta-row lt-actions">
          <button type="button" className="btn btn-navy" onClick={share}>
            {copied ? 'Link copied' : 'Share my result'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={restart}>Retake test</button>
        </div>
        <p className="q-hint">Estimates vary by about ±100 words between runs. Take it twice and use the average.</p>
      </div>

      <aside className="side">
        <div className="card lt-rec">
          <div className="lt-rec-head">
            <span className="mono">RECOMMENDED FOR YOU</span>
            <b className="tab">{rec.price}</b>
          </div>
          <h2>{rec.title}</h2>
          <p>{rec.body}</p>
          <Link className="btn btn-coral" href={rec.href}>{rec.cta} <Arrow /></Link>
          <div className="lt-alt">
            {OTHERS.filter((o) => o.key !== rec.key).map((o) => (
              <Link key={o.key} className="link" href={o.href}>{o.label} <Arrow /></Link>
            ))}
          </div>
        </div>
        <div className="card lt-how">
          <h2>How we scored it</h2>
          <p>Your yes rate in each band, minus the rate you accepted made-up words, scaled by the size of the band. The test covers the top 1,500 words, so it tops out at 1,500+.</p>
          <Link className="tlink" href="/words/most-common-spanish-words">See all words in rank order</Link>
        </div>
      </aside>
    </>
  )
}
