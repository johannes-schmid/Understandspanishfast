'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { coveragePct } from '@/lib/coverage'

function Arrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

function Icon({ d }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
}

const TIERS = [
  { from: 1,    to: 100,  label: 'Essential',    sample: 5 },
  { from: 101,  to: 250,  label: 'Fundamental',  sample: 5 },
  { from: 251,  to: 500,  label: 'Core',         sample: 5 },
  { from: 501,  to: 1000, label: 'Advanced',     sample: 5 },
  { from: 1001, to: 1500, label: 'Mastery',      sample: 5 },
  { from: 1501, to: 2000, label: 'Beyond',       sample: 5 },
]

function pickWords(WORDS) {
  const out = []
  TIERS.forEach((t) => {
    const pool = WORDS.filter((w) => w.rank >= t.from && w.rank <= t.to)
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    out.push(...shuffled.slice(0, t.sample).map((w) => ({ ...w, tier: t.label })))
  })
  return out
}

function computeReach(answers, deck) {
  let reach = 0
  for (const t of TIERS) {
    const tierAnswers = deck.map((w, i) => ({ w, a: answers[i] })).filter(({ w }) => w.rank >= t.from && w.rank <= t.to)
    if (!tierAnswers.length) continue
    const known = tierAnswers.filter((x) => x.a === true).length
    const ratio = known / tierAnswers.length
    if (ratio >= 0.6) reach = t.to
    else {
      reach = Math.max(reach, t.from - 1 + Math.round(ratio * (t.to - t.from + 1)))
      break
    }
  }
  return reach
}

function nextMilestone(reach) {
  for (const m of [100, 250, 500, 1000, 1500, 2000]) if (reach < m) return m
  return 2000
}

function levelLabel(reach) {
  if (reach < 100)  return 'A1 — Starter'
  if (reach < 250)  return 'A1 — Survival'
  if (reach < 500)  return 'A2 — Daily'
  if (reach < 1000) return 'B1 — Conversational'
  if (reach < 1500) return 'B2 — Fluent'
  return 'C1 — Mastery'
}

export default function LevelTestClient({ pool }) {
  const [deck, setDeck] = useState(null)
  useEffect(() => { setDeck(pickWords(pool)) }, [pool])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const ready = !!deck
  const done = ready && idx >= deck.length

  const reach = useMemo(() => (deck ? computeReach(answers, deck) : 0), [answers, deck])
  const milestone = nextMilestone(reach)
  const level = levelLabel(reach)
  const gap = Math.max(0, 1500 - reach)
  const total = deck ? deck.length : 25
  const progressPct = Math.round((idx / total) * 100)

  useEffect(() => {
    if (done) {
      try { localStorage.setItem('usf:lastReach', JSON.stringify({ reach, ts: Date.now() })) } catch {}
    }
  }, [done, reach])

  const answer = (known) => {
    setAnswers((a) => [...a, known])
    setIdx((i) => i + 1)
  }

  const restart = () => { setIdx(0); setAnswers([]); window.scrollTo({ top: 0 }) }
  const current = deck ? deck[idx] : null

  const showPct = Math.min(100, Math.round(reach / 800 * 100))

  return (
    <div className="cl cl-home">
      <div className="wrap pg">
        <div className="pg-head solo">
          <div>
            <h1 className="pg-h1">Spanish vocabulary test<br /><span className="soft">How many words you really know</span></h1>
            <p className="lead">We show you frequency-ranked words. You say whether you’d recognise each one. We estimate your vocabulary and how much everyday Spanish you already follow.</p>
          </div>
        </div>

        <section className="lt">
          <div className="card quiz">
            {!done ? (
              <>
                <div className="q-meta">
                  <span className="mono tab">WORD {idx + 1} OF {total}</span>
                  <span className="mono tab">{progressPct}%</span>
                </div>
                <div className="q-bar" aria-hidden="true"><i style={{ transform: `scaleX(${idx / total})` }} /></div>

                <div className="panel q-stage" aria-live="polite">
                  {current ? (
                    <>
                      <div className="mono tab">{current.tier.toUpperCase()} · RANK #{current.rank}</div>
                      <div className="q-big" lang="es">{current.word}</div>
                    </>
                  ) : (
                    <>
                      <div className="mono">PICKING WORDS</div>
                      <div className="q-big ghost" aria-hidden="true">palabra</div>
                    </>
                  )}
                </div>

                <div className="q-btns">
                  <button type="button" className="btn btn-ghost" disabled={!ready} onClick={() => answer(false)}><Icon d="M6 6l12 12M18 6 6 18" />Not yet</button>
                  <button type="button" className="btn btn-navy" disabled={!ready} onClick={() => answer(true)}><Icon d="M20 6 9 17l-5-5" />I know it</button>
                </div>

                <p className="q-hint">Be honest. You don’t need to translate it, only recognise it in context.</p>
              </>
            ) : (
              <div className="res">
                <span className="chip">TEST COMPLETE</span>
                <div className="res-num tab">{reach.toLocaleString('en')}</div>
                <div className="res-sub">words in your reach</div>
                <div className="res-lvl">{level}</div>

                <p className="res-body">
                  You recognise roughly the top <strong>{reach.toLocaleString('en')}</strong> most frequent Spanish words,
                  about <strong>{coveragePct(reach)}%</strong> of everyday spoken Spanish.{' '}
                  {gap > 0
                    ? <>You need <strong>{gap.toLocaleString('en')} more words</strong> to reach the 1,500-word threshold.</>
                    : <>You’re past the 1,500-word threshold for <strong>functional fluency</strong>.</>}
                </p>

                <div className="cta-row">
                  <Link className="btn btn-navy" href="/study">Start for free <Arrow /></Link>
                  <button type="button" className="btn btn-ghost" onClick={restart}>Retake test</button>
                </div>
                <p className="q-hint"><Link className="tlink" href="/words/most-common-spanish-words">See the full word list</Link></p>
              </div>
            )}
          </div>

          <aside className="side">
            <div className="card est">
              <span className="mono">LIVE ESTIMATE</span>
              <div className="est-num"><b className="tab">{reach.toLocaleString('en')}</b><span>words in reach</span></div>
              <div className="p-track" aria-hidden="true"><div className="p-fill" style={{ transform: `scaleX(${Math.min(1, reach / 1500)})` }} /></div>
              <div className="est-scale"><span className="mono tab">0</span><span className="mono tab">1,500</span></div>
              <div className="est-rows">
                <div className="est-row"><span>Next milestone</span><b className="tab">{milestone.toLocaleString('en')}</b></div>
                <div className="est-row"><span>Gap to 1,500</span><b className="tab">{gap.toLocaleString('en')}</b></div>
              </div>
            </div>

            <div className="card show">
              <span className="mono">READY FOR TV</span>
              <p>You’re <b className="tab">{showPct}%</b> ready for <em>Money Heist</em> season 1.</p>
              <div className="p-track" aria-hidden="true"><div className="p-fill" style={{ transform: `scaleX(${showPct / 100})` }} /></div>
            </div>

            <div className="card gap-card">
              <h2>Close the gap</h2>
              <p>Learn the exact words you’re missing, in frequency order. Try the flashcards for free, or work through all 1,500 on paper.</p>
              <Link className="btn btn-navy" href="/study">Start for free</Link>
              <Link className="btn btn-ghost" href="/workbook">Get the workbook</Link>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}
