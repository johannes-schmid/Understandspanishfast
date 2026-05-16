'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { words as WORDS } from '@/data/words'

const TIERS = [
  { from: 1,    to: 100,  label: 'Essential',    sample: 5 },
  { from: 101,  to: 250,  label: 'Fundamental',  sample: 5 },
  { from: 251,  to: 500,  label: 'Core',         sample: 5 },
  { from: 501,  to: 1000, label: 'Advanced',     sample: 5 },
  { from: 1001, to: 1500, label: 'Mastery',      sample: 5 },
  { from: 1501, to: 2000, label: 'Beyond',       sample: 5 },
]

function pickWords() {
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

function coveragePct(reach) {
  return Math.min(95, Math.round(reach / 3000 * 95))
}

export default function LevelTestClient() {
  const [deck] = useState(() => pickWords())
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const done = idx >= deck.length

  const reach = useMemo(() => computeReach(answers, deck), [answers, deck])
  const milestone = nextMilestone(reach)
  const level = levelLabel(reach)
  const gap = Math.max(0, 1500 - reach)
  const progressPct = Math.round((idx / deck.length) * 100)

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
  const current = deck[idx]

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>

      {/* Hero */}
      <section style={{ padding: '120px 56px 56px', textAlign: 'center' }}>
        <div className="s-eye">2-minute test</div>
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontWeight: 900,
          fontSize: 'clamp(40px, 5vw, 62px)', letterSpacing: '-2px',
          lineHeight: 1.05, color: 'var(--deep-mind)', marginBottom: '16px',
        }}>
          How much Spanish<br />do you actually know?
        </h1>
        <p style={{ fontSize: '17px', fontWeight: 300, color: 'var(--cortex)', maxWidth: '420px', margin: '0 auto', lineHeight: 1.7 }}>
          We show you frequency-ranked words. You say whether you'd recognise each one. We calculate your reach.
        </p>
      </section>

      {/* Main content */}
      <section style={{
        maxWidth: '1160px', margin: '0 auto', padding: '0 56px 80px',
        display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start',
      }}>

        {/* Quiz card */}
        <div style={{
          background: 'var(--white-matter)', borderRadius: '20px',
          border: '0.5px solid rgba(28,26,58,0.09)',
          padding: '40px', boxShadow: '0 8px 32px rgba(28,26,58,0.07)',
        }}>

          {!done ? (
            <>
              {/* Progress bar */}
              <div style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--cortex)' }}>{idx} of {deck.length} words</span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--synapse)' }}>{progressPct}%</span>
                </div>
                <div style={{ height: '5px', background: 'var(--cream-dark)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${progressPct}%`,
                    background: 'var(--synapse)', borderRadius: '99px',
                    transition: 'width .3s ease',
                  }} />
                </div>
              </div>

              {/* Word display */}
              <div style={{
                background: 'var(--deep-mind)', borderRadius: '16px',
                padding: '48px 40px', textAlign: 'center', marginBottom: '24px',
              }}>
                <div style={{
                  fontSize: '11px', fontWeight: 500, letterSpacing: '.08em',
                  textTransform: 'uppercase', color: 'var(--cortex)', marginBottom: '20px',
                }}>
                  {current.tier} · rank #{current.rank}
                </div>
                <div style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 900,
                  fontSize: 'clamp(52px, 7vw, 80px)', letterSpacing: '-3px',
                  lineHeight: 1, color: 'var(--white-matter)', marginBottom: '10px',
                }}>{current.word}</div>
                {current.type && (
                  <div style={{ fontSize: '14px', fontWeight: 300, color: 'var(--cortex)', fontStyle: 'italic' }}>
                    {current.type}
                  </div>
                )}
              </div>

              {/* Answer buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <button
                  onClick={() => answer(false)}
                  style={{
                    padding: '16px', borderRadius: '12px', border: '0.5px solid rgba(28,26,58,0.12)',
                    background: 'var(--cream)', color: 'var(--cortex)', fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: '15px', fontWeight: 500, cursor: 'pointer', transition: 'background .15s, transform .1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--cream-dark)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--cream)'}
                >
                  ✕ Not yet
                </button>
                <button
                  onClick={() => answer(true)}
                  style={{
                    padding: '16px', borderRadius: '12px', border: 'none',
                    background: 'var(--deep-mind)', color: 'var(--white-matter)',
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: '15px', fontWeight: 500, cursor: 'pointer', transition: 'background .15s, transform .1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--synapse)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--deep-mind)'}
                >
                  ✓ I know it
                </button>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--cortex)', textAlign: 'center', lineHeight: 1.6 }}>
                Be honest — we don't ask you to translate, just whether you'd recognise it in context.
              </p>
            </>
          ) : (
            <>
              {/* Results */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  display: 'inline-block', background: 'var(--signal-light)', color: 'var(--signal)',
                  fontSize: '11px', fontWeight: 500, letterSpacing: '.07em',
                  textTransform: 'uppercase', padding: '5px 16px', borderRadius: '99px', marginBottom: '20px',
                }}>Test complete</div>
                <div style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 900,
                  fontSize: '80px', letterSpacing: '-3px', lineHeight: 1,
                  color: 'var(--synapse)', marginBottom: '8px',
                }}>{reach}</div>
                <div style={{ fontSize: '18px', fontWeight: 300, color: 'var(--deep-mind)', marginBottom: '4px' }}>
                  words reach
                </div>
                <div style={{ fontSize: '14px', color: 'var(--cortex)' }}>{level}</div>
              </div>

              <div style={{
                background: 'var(--cream)', borderRadius: '14px',
                padding: '20px 24px', marginBottom: '24px',
              }}>
                <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--cortex)', marginBottom: '10px' }}>
                  What this means
                </div>
                <p style={{ fontSize: '14px', fontWeight: 300, color: 'var(--deep-mind)', lineHeight: 1.7 }}>
                  You can recognise roughly the top <strong>{reach}</strong> most-frequent Spanish words —
                  about <strong>{coveragePct(reach)}%</strong> coverage of everyday spoken Spanish.
                  You need {gap > 0 ? <><strong>{gap.toLocaleString()} more words</strong> to hit the fluency threshold.</> : <><strong>functional fluency</strong> — keep going!</>}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={restart}
                  style={{
                    padding: '14px', borderRadius: '12px', border: '0.5px solid rgba(28,26,58,0.12)',
                    background: 'var(--cream)', color: 'var(--cortex)', fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  Retake test
                </button>
                <Link href="/words/most-common-spanish-words" style={{
                  padding: '14px', borderRadius: '12px', border: 'none',
                  background: 'var(--deep-mind)', color: 'var(--white-matter)',
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: '14px', fontWeight: 500, textDecoration: 'none',
                  textAlign: 'center', display: 'block',
                }}>
                  See the word list
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Live estimate */}
          <div style={{
            background: 'var(--white-matter)', borderRadius: '20px',
            border: '0.5px solid rgba(28,26,58,0.09)',
            padding: '28px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--cortex)', marginBottom: '20px' }}>
              Real-time estimate
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--cortex)' }}>Word reach</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--synapse)' }}>{reach}</span>
              </div>
              <div style={{ height: '6px', background: 'var(--cream-dark)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${Math.min(100, reach / 1500 * 100)}%`,
                  background: 'var(--synapse)', borderRadius: '99px', transition: 'width .4s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--cortex)' }}>0</span>
                <span style={{ fontSize: '11px', color: 'var(--cortex)' }}>1,500</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--cream)', borderRadius: '10px' }}>
                <span style={{ fontSize: '13px', color: 'var(--deep-mind)' }}>Next milestone</span>
                <span style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 700,
                  fontSize: '20px', letterSpacing: '-0.5px', color: 'var(--synapse)',
                }}>{milestone}</span>
              </div>
              <div style={{ padding: '12px 14px', background: 'var(--cream)', borderRadius: '10px' }}>
                <span style={{ fontSize: '13px', color: 'var(--cortex)' }}>
                  Gap to fluency: <strong style={{ color: 'var(--deep-mind)' }}>{gap.toLocaleString()} words</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Content unlock */}
          <div style={{
            background: 'var(--deep-mind)', borderRadius: '20px', padding: '28px',
          }}>
            <div style={{
              fontSize: '11px', fontWeight: 500, letterSpacing: '.07em',
              textTransform: 'uppercase', color: 'var(--mauve)', marginBottom: '12px',
            }}>Content unlock</div>
            <p style={{ fontSize: '17px', fontWeight: 300, color: 'var(--white-matter)', lineHeight: 1.6, marginBottom: '16px' }}>
              You're <strong style={{ color: 'var(--mauve)', fontWeight: 700 }}>
                {Math.min(100, Math.round(reach / 800 * 100))}%
              </strong> ready for <em>Money Heist</em> Season 1.
            </p>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${Math.min(100, Math.round(reach / 800 * 100))}%`,
                background: 'var(--mauve)', borderRadius: '99px', transition: 'width .4s ease',
              }} />
            </div>
          </div>

          {/* CTA */}
          <div style={{
            background: 'var(--fog)', borderRadius: '20px', padding: '28px',
            border: '0.5px solid rgba(83,74,183,0.15)',
          }}>
            <div style={{
              fontFamily: "'Fraunces', serif", fontWeight: 700,
              fontSize: '20px', letterSpacing: '-0.5px', color: 'var(--deep-mind)',
              marginBottom: '8px',
            }}>Ready to close the gap?</div>
            <p style={{ fontSize: '14px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.65, marginBottom: '20px' }}>
              Create a free account and start learning the exact words you're missing.
            </p>
            <Link href="/get-started" className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>
              Sign up free
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
