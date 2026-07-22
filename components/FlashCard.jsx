'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import PaywallModal from '@/components/PaywallModal'
import { SignInButton } from '@/components/AuthButton'
import { audioMap } from '@/data/audioMap'
import { sentenceAudioMap } from '@/data/sentenceAudioMap'
import { trackEvent } from '@/lib/analytics'

const FREE_LIMIT = 100
const NEW_WORD_SOFT_CAP = 15
const DAILY_TARGET = 20

const CARD_GRADIENT = 'linear-gradient(135deg,#1B1836 0%,#2C2658 55%,#413A78 100%)'

const SRS_BUTTONS = [
  { key: 'again', label: 'Again', interval: '<1 min', color: 'var(--clay)',   bg: 'linear-gradient(160deg,#FBEEEB,#F6F2E9)', border: 'rgba(180,85,63,.24)' },
  { key: 'hard',  label: 'Hard',  interval: '6 min',  color: 'var(--gold)',   bg: 'linear-gradient(160deg,#FBF2DF,#F6F2E9)', border: 'rgba(213,154,43,.28)' },
  { key: 'good',  label: 'Good',  interval: '1 day',  color: 'var(--signal)', bg: 'linear-gradient(160deg,#E9F3ED,#F6F2E9)', border: 'rgba(47,125,92,.3)' },
  { key: 'easy',  label: 'Easy',  interval: '4 days', color: 'var(--iris)',   bg: 'linear-gradient(160deg,#ECEBF7,#F6F2E9)', border: 'rgba(107,102,201,.3)' },
]

const SIDE_CARD = {
  background: 'linear-gradient(165deg,#FAF6EE,#F1ECE2)',
  border: '1px solid rgba(28,26,58,.07)',
  borderRadius: '14px',
  padding: '16px',
}

const SIDE_LABEL = {
  fontSize: '10px', fontWeight: 600, letterSpacing: '.14em',
  color: 'var(--sand)', marginBottom: '12px',
}

let audioEl = null
function playAudio(filename) {
  if (typeof window === 'undefined' || !filename) return
  if (audioEl) { audioEl.pause(); audioEl.currentTime = 0 }
  audioEl = new Audio(`/audio/${filename}`)
  audioEl.play().catch(err => console.warn('[audio] play failed:', filename, err.message))
}

function speakWord(word) {
  const file = audioMap[word?.toLowerCase()]
  if (file) {
    playAudio(file)
  } else if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(word)
    u.lang = 'es-ES'
    u.rate = 0.9
    window.speechSynthesis.speak(u)
  }
}

function speakSentence(word) {
  const file = sentenceAudioMap[word?.toLowerCase()]
  if (file) {
    playAudio(file)
  } else if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(word)
    u.lang = 'es-ES'
    u.rate = 0.85
    window.speechSynthesis.speak(u)
  }
}

export default function FlashCard({
  initialQueue,
  knownRanks,
  initialCardFront,
  unlocked,
  initialTtsEnabled,
  newTodayCount = 0,
  dueCount = 0,
  streak = 0,
  todayCount = 0,
  anonymous = false,
  gateAfter = 10,
}) {
  const knownSet = new Set(knownRanks)

  const [queue, setQueue] = useState(() => initialQueue.filter(w => !knownSet.has(w.rank)))
  const [flipped, setFlipped] = useState(false)
  const [cardFront, setCardFront] = useState(initialCardFront ?? 'spanish')
  const [sessionKnown, setSessionKnown] = useState(new Set())
  const [ttsEnabled, setTtsEnabled] = useState(initialTtsEnabled ?? true)
  const [sessionNewCount, setSessionNewCount] = useState(0)
  const [showFlipHint, setShowFlipHint] = useState(true)
  const [reviewedCount, setReviewedCount] = useState(0)

  const hasFlippedOnce = useRef(false)

  const card = queue[0] ?? null
  const totalKnown = knownRanks.length + sessionKnown.size

  // Play sentence audio after word MP3 finishes
  useEffect(() => {
    if (!flipped || !ttsEnabled || !card) return
    const t = setTimeout(() => speakSentence(card.word), 1500)
    return () => clearTimeout(t)
  }, [flipped])

  const handleFlip = useCallback(() => {
    if (!flipped) {
      if (ttsEnabled && card) {
        speakWord(card.word)
      }
      setFlipped(true)
      if (!hasFlippedOnce.current) {
        hasFlippedOnce.current = true
        setShowFlipHint(false)
        trackEvent('session_started')
      }
    }
  }, [flipped, ttsEnabled, card, cardFront])

  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        if (!flipped && ttsEnabled && card) speakWord(card.word)
        handleFlip()
      }
      if (flipped) {
        if (e.key === '1') handleAnswer('again')
        if (e.key === '2') handleAnswer('hard')
        if (e.key === '3') handleAnswer('good')
        if (e.key === '4') handleAnswer('easy')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flipped, handleFlip])

  async function saveProgress(card, status) {
    if (anonymous) return  // no persistence for logged-out trial
    if (card.rank != null) {
      // Corpus word (default deck or corpus word in a pack) — global SRS by rank.
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word_rank: card.rank, status }),
      })
    } else if (card.pack_word_id) {
      // Non-corpus pack word — SRS by pack_word_id.
      await fetch('/api/pack-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pack_word_id: card.pack_word_id, status }),
      })
    }
    // else: situational exposure-only card, not SRS-tracked
  }

  function handleAnswer(status) {
    if (!card) return
    trackEvent('card_reviewed', { rating: status, word_rank: card.rank })
    saveProgress(card, status)
    setReviewedCount(n => n + 1)
    const [current, ...rest] = queue

    if (current.isNew) {
      setSessionNewCount(n => n + 1)
    }

    if (status === 'again') {
      const insertAt = Math.min(3, rest.length)
      setQueue([...rest.slice(0, insertAt), current, ...rest.slice(insertAt)])
    } else if (status === 'hard') {
      setQueue([...rest, current])
    } else {
      setQueue(rest)
      setSessionKnown(prev => new Set([...prev, current.rank]))
    }
    setFlipped(false)
  }

  async function toggleCardFront() {
    const next = cardFront === 'spanish' ? 'english' : 'spanish'
    setCardFront(next)
    setFlipped(false)
    if (anonymous) return
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ card_front: next }),
    })
  }

  async function toggleTts() {
    const next = !ttsEnabled
    setTtsEnabled(next)
    if (!next) { if (audioEl) { audioEl.pause(); audioEl.currentTime = 0 }; window.speechSynthesis?.cancel() }
    if (anonymous) return
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tts_enabled: next }),
    })
  }

  if (anonymous && reviewedCount >= gateAfter) {
    return (
      <div style={{
        textAlign: 'center',
        background: CARD_GRADIENT,
        borderRadius: '24px',
        padding: '48px 32px',
        boxShadow: '0 26px 50px -24px rgba(28,26,58,.6)',
      }}>
        <div style={{ fontSize: '44px', marginBottom: '16px' }}>🔥</div>
        <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '26px', fontWeight: 700, color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>
          You just learned your first {gateAfter} words
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', fontSize: '15px', lineHeight: 1.6, maxWidth: '340px', marginLeft: 'auto', marginRight: 'auto' }}>
          Create a free account to save your progress and keep going — the next words unlock more of everyday Spanish.
        </p>
        <SignInButton className="btn-google" redirectPath="/study" style={{ maxWidth: '320px', margin: '0 auto' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Create free account with Google
        </SignInButton>
        <p style={{ marginTop: '14px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
          No password. No credit card. 10 seconds.
        </p>
      </div>
    )
  }

  if (!card) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎉</div>
        <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '28px', fontWeight: 700, color: 'var(--deep-mind)', marginBottom: '12px' }}>
          Session complete
        </h2>
        <p style={{ color: 'var(--cortex)', marginBottom: '32px', fontSize: '15px' }}>
          You've worked through all cards for now.
        </p>
        <a href="/dashboard" style={{
          background: 'var(--synapse)', color: '#fff',
          borderRadius: '12px', padding: '14px 32px',
          fontWeight: 500, textDecoration: 'none', fontSize: '15px',
        }}>
          Back to dashboard
        </a>
      </div>
    )
  }

  const isPaywalled = !unlocked && card.rank != null && card.rank > FREE_LIMIT
  const frontText = cardFront === 'spanish' ? card.word : card.meanings[0]
  const backText  = cardFront === 'spanish' ? card.meanings[0] : card.word
  const totalNewToday = newTodayCount + sessionNewCount
  const showCapBanner = card.isNew && totalNewToday >= NEW_WORD_SOFT_CAP

  const sessionTotal = anonymous ? gateAfter : reviewedCount + queue.length
  const progressPct = sessionTotal > 0 ? Math.min((reviewedCount / sessionTotal) * 100, 100) : 0
  const reviewsLeft = Math.max(dueCount - reviewedCount, 0)
  const toGoToday = Math.max(DAILY_TARGET - todayCount - reviewedCount, 0)

  return (
    <>
      {isPaywalled && <PaywallModal />}

      <div className={anonymous ? undefined : 'study-grid'}>
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            {anonymous ? (
              <span style={{ color: 'var(--iris)', fontSize: '13px', fontWeight: 600 }}>
                {reviewedCount} / {gateAfter} free words
              </span>
            ) : (
              <a href="/dashboard" style={{ color: 'var(--iris)', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>
                ← Dashboard
              </a>
            )}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={toggleTts}
                title={ttsEnabled ? 'Mute audio' : 'Enable audio'}
                style={{
                  width: '34px', height: '32px', borderRadius: '9px',
                  background: ttsEnabled ? 'var(--lilac)' : 'transparent',
                  border: `1px solid ${ttsEnabled ? 'transparent' : 'var(--cream-dark)'}`,
                  color: ttsEnabled ? 'var(--iris)' : 'var(--sand)',
                  cursor: 'pointer', fontSize: '15px', lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {ttsEnabled ? '🔊' : '🔇'}
              </button>
              <button
                onClick={toggleCardFront}
                style={{
                  background: 'var(--lilac)', color: '#4F4AA8', border: 'none',
                  fontWeight: 600, fontSize: '12px', padding: '8px 13px',
                  borderRadius: '9px', cursor: 'pointer',
                }}
              >
                {cardFront === 'spanish' ? 'ES → EN' : 'EN → ES'}
              </button>
            </div>
          </div>

          {/* Session progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ flex: 1, height: '6px', background: 'var(--lilac)', borderRadius: '3px' }}>
              <div style={{
                width: `${progressPct}%`, height: '100%', borderRadius: '3px',
                background: 'linear-gradient(90deg,#2F7D5C,#5AA77E)',
                transition: 'width .3s ease',
              }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--sand)' }}>
              {reviewedCount} / {sessionTotal}
            </span>
          </div>

          {/* Mobile-only counts row (sidebar is hidden there) */}
          {!anonymous && (
            <div className="u-mob" style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '12px', color: 'var(--sand)', marginBottom: '14px',
            }}>
              <span>Card {reviewedCount + 1} of {sessionTotal}</span>
              <span>{queue.length} in queue</span>
            </div>
          )}

          {/* Soft cap banner */}
          {showCapBanner && (
            <div style={{
              background: '#FBF2DF', border: '1px solid rgba(213,154,43,.28)', borderRadius: '11px',
              padding: '10px 14px', marginBottom: '12px', fontSize: '13px', color: '#8A6415',
            }}>
              You've learned 15 new words today — great pace. Keep going or come back tomorrow for reviews.
            </div>
          )}

          {/* Card */}
          <div
            onClick={handleFlip}
            className="study-card-face"
            style={{
              background: CARD_GRADIENT,
              borderRadius: '18px',
              textAlign: 'center',
              cursor: flipped ? 'default' : 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              userSelect: 'none',
              color: '#fff',
              boxShadow: '0 26px 50px -24px rgba(28,26,58,.6)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px',
              borderRadius: '50%', pointerEvents: 'none',
              background: 'radial-gradient(circle, rgba(213,154,43,.35), transparent 68%)',
            }} />
            <div style={{
              position: 'absolute', left: '-40px', bottom: '-60px', width: '200px', height: '200px',
              borderRadius: '50%', pointerEvents: 'none',
              background: 'radial-gradient(circle, rgba(125,120,214,.4), transparent 70%)',
            }} />

            {/* TTS replay button */}
            {ttsEnabled && (
              <button
                onClick={e => { e.stopPropagation(); flipped ? speakSentence(card.word) : speakWord(card.word) }}
                style={{
                  position: 'absolute', bottom: '14px', right: '14px', zIndex: 2,
                  background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px',
                  padding: '6px 9px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
                  fontSize: '14px', lineHeight: 1,
                }}
              >
                ↺
              </button>
            )}

            <div style={{ position: 'relative' }}>
              {!flipped ? (
                <>
                  <div style={{
                    fontSize: '11px', fontWeight: 600, letterSpacing: '.18em',
                    color: 'rgba(255,255,255,.4)', marginBottom: '20px', textTransform: 'uppercase',
                  }}>
                    {cardFront === 'spanish' ? 'Spanish' : 'English'} · {card.rank != null ? `#${card.rank}` : (
                      <span style={{ background: 'rgba(180,100,200,0.3)', borderRadius: '6px', padding: '1px 7px', color: 'rgba(200,160,240,0.9)' }}>
                        situational
                      </span>
                    )}
                  </div>
                  <div className="study-word">{frontText}</div>
                  {card.pos && (
                    <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '18px', color: 'rgba(255,255,255,.5)', marginTop: '12px' }}>
                      {card.pos}
                    </div>
                  )}
                  {showFlipHint && (
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.35)', marginTop: '26px' }}>
                      tap to flip · or press Space
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div style={{
                    fontSize: '11px', fontWeight: 600, letterSpacing: '.18em',
                    color: 'rgba(255,255,255,.4)', marginBottom: '20px', textTransform: 'uppercase',
                  }}>
                    {cardFront === 'spanish' ? 'English' : 'Spanish'}
                  </div>
                  {card.image && (
                    <div style={{
                      width: '130px', height: '130px', margin: '0 auto 18px',
                      borderRadius: '60% 40% 55% 45% / 45% 55% 40% 60%',
                      overflow: 'hidden', flexShrink: 0,
                      boxShadow: '0 4px 24px rgba(120,100,220,.35)',
                    }}>
                      <img
                        src={`/word-images/${card.image.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`}
                        alt={card.word}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div style={{
                    fontFamily: 'var(--font-fraunces), serif', fontWeight: 500,
                    fontSize: 'clamp(28px, 5vw, 44px)', lineHeight: 1.1,
                    color: 'var(--purple-mid)', marginBottom: '14px',
                  }}>
                    {backText}
                  </div>
                  {card.pos && (
                    <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,.4)', marginBottom: '14px' }}>
                      {card.pos}
                    </div>
                  )}
                  {card.example_es && (
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,.6)', fontStyle: 'italic', maxWidth: '340px', margin: '0 auto 4px', lineHeight: 1.65 }}>
                      "{card.example_es}"
                    </div>
                  )}
                  {card.example_en && (
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.3)', maxWidth: '340px', margin: '0 auto', lineHeight: 1.55 }}>
                      {card.example_en}
                    </div>
                  )}
                  {card.why && (
                    <div style={{ fontSize: '11px', color: 'rgba(180,100,200,.7)', maxWidth: '320px', margin: '12px auto 0', lineHeight: 1.5, fontStyle: 'italic' }}>
                      ✦ {card.why}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Verdict buttons */}
          {flipped && (
            <div className="study-verdicts">
              {SRS_BUTTONS.map(btn => (
                <button
                  key={btn.key}
                  onClick={() => handleAnswer(btn.key)}
                  style={{
                    textAlign: 'center', padding: '11px', borderRadius: '11px',
                    background: btn.bg, border: `1px solid ${btn.border}`, cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '13px', color: btn.color }}>{btn.label}</div>
                  <div style={{ fontSize: '10px', color: 'var(--sand)' }}>{btn.interval}</div>
                </button>
              ))}
            </div>
          )}

          {!flipped && (
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--sand)', marginTop: '16px' }}>
              {anonymous
                ? `New word · ${Math.max(gateAfter - reviewedCount, 0)} free words left`
                : `${card.isNew ? 'New word' : 'Review'} · ${queue.length} remaining`}
            </p>
          )}
        </div>

        {/* Sidebar — desktop only */}
        {!anonymous && (
          <div className="study-side">
            <div style={SIDE_CARD}>
              <div style={SIDE_LABEL}>THIS SESSION</div>
              {[
                { label: 'Known',        value: totalKnown,   color: 'var(--signal)' },
                { label: 'Reviews left', value: reviewsLeft,  color: 'var(--iris)' },
                { label: 'In queue',     value: queue.length, color: 'var(--deep-mind)' },
              ].map((row, i, arr) => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: i === arr.length - 1 ? 0 : '9px',
                }}>
                  <span style={{ fontSize: '13px', color: '#6B6558' }}>{row.label}</span>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: 'linear-gradient(135deg,#1B1836,#3A3470)', borderRadius: '14px',
              padding: '16px', color: '#fff', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', right: '-20px', top: '-20px', width: '100px', height: '100px',
                borderRadius: '50%', pointerEvents: 'none',
                background: 'radial-gradient(circle, rgba(213,154,43,.4), transparent 70%)',
              }} />
              <div style={{ ...SIDE_LABEL, color: 'rgba(255,255,255,.45)', marginBottom: '10px', position: 'relative' }}>
                STREAK
              </div>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 700, fontSize: '26px', position: 'relative' }}>
                {streak} 🔥
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.55)', marginTop: '2px', position: 'relative' }}>
                {toGoToday > 0
                  ? `Keep it alive — ${toGoToday} to go today.`
                  : "Today's target is done. Nice."}
              </div>
            </div>

            <div style={{ ...SIDE_CARD, padding: '14px 16px', fontSize: '12px', lineHeight: 1.7, color: '#8B8676' }}>
              <b style={{ color: 'var(--deep-mind)' }}>Shortcuts</b><br />
              Space flip · 1–4 rate
            </div>
          </div>
        )}
      </div>
    </>
  )
}
