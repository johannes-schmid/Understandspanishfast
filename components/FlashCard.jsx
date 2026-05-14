'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import PaywallModal from '@/components/PaywallModal'
import { audioMap } from '@/data/audioMap'
import { sentenceAudioMap } from '@/data/sentenceAudioMap'

const FREE_LIMIT = 100
const NEW_WORD_SOFT_CAP = 15

const SRS_BUTTONS = [
  { key: 'again', label: 'Again', hint: "Didn't know", bg: '#FBEAF0', color: '#D4537E', border: '#F0C4D4', key2: '1' },
  { key: 'hard',  label: 'Hard',  hint: 'Struggled',   bg: '#FFF3E0', color: '#C07050', border: '#EACFBB', key2: '2' },
  { key: 'good',  label: 'Good',  hint: 'Got it',       bg: 'var(--fog)', color: 'var(--synapse)', border: '#C8C2F0', key2: '3' },
  { key: 'easy',  label: 'Easy',  hint: 'Instant',      bg: 'var(--signal-light)', color: 'var(--signal)', border: '#B8DECE', key2: '4' },
]

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
}) {
  const knownSet = new Set(knownRanks)

  const [queue, setQueue] = useState(() => initialQueue.filter(w => !knownSet.has(w.rank)))
  const [flipped, setFlipped] = useState(false)
  const [cardFront, setCardFront] = useState(initialCardFront ?? 'spanish')
  const [sessionKnown, setSessionKnown] = useState(new Set())
  const [ttsEnabled, setTtsEnabled] = useState(initialTtsEnabled ?? true)
  const [sessionNewCount, setSessionNewCount] = useState(0)
  const [showFlipHint, setShowFlipHint] = useState(true)

  const hasFlippedOnce = useRef(false)

  const card = queue[0] ?? null
  const totalKnown = knownRanks.length + sessionKnown.size

  // Play sentence audio after word MP3 finishes
  useEffect(() => {
    if (!flipped || !ttsEnabled || !card) return
    const t = setTimeout(() => speakSentence(card.word), 1500)
    return () => clearTimeout(t)
  }, [flipped])

  // Keyboard shortcuts
  const handleFlip = useCallback(() => {
    if (!flipped) {
      if (ttsEnabled && card) {
        speakWord(card.word)
      }
      setFlipped(true)
      if (!hasFlippedOnce.current) {
        hasFlippedOnce.current = true
        setShowFlipHint(false)
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

  async function saveProgress(rank, status) {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word_rank: rank, status }),
    })
  }

  function handleAnswer(status) {
    if (!card) return
    saveProgress(card.rank, status)
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
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tts_enabled: next }),
    })
  }

  if (!card) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎉</div>
        <h2 style={{ fontFamily: 'Fraunces', fontSize: '28px', fontWeight: 700, color: 'var(--deep-mind)', marginBottom: '12px' }}>
          Session complete
        </h2>
        <p style={{ color: 'var(--cortex)', marginBottom: '32px', fontSize: '15px' }}>
          You've worked through all cards for now.
        </p>
        <a href="/dashboard" style={{
          background: 'var(--synapse)', color: '#fff',
          borderRadius: '12px', padding: '14px 32px',
          fontWeight: 500, textDecoration: 'none', fontSize: '15px'
        }}>
          Back to dashboard
        </a>
      </div>
    )
  }

  const isPaywalled = !unlocked && card.rank > FREE_LIMIT
  const frontText = cardFront === 'spanish' ? card.word : card.meanings[0]
  const backText  = cardFront === 'spanish' ? card.meanings[0] : card.word
  const totalNewToday = newTodayCount + sessionNewCount
  const showCapBanner = card.isNew && totalNewToday >= NEW_WORD_SOFT_CAP

  return (
    <>
      {isPaywalled && <PaywallModal />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <a href="/dashboard" style={{ color: 'var(--cortex)', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ← Dashboard
        </a>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={toggleTts}
            title={ttsEnabled ? 'Mute audio' : 'Enable audio'}
            style={{
              background: ttsEnabled ? 'var(--fog)' : 'transparent',
              border: `1px solid ${ttsEnabled ? '#C8C2F0' : 'var(--cream-dark)'}`,
              borderRadius: '8px', padding: '7px 10px', cursor: 'pointer',
              fontSize: '16px', lineHeight: 1,
              color: ttsEnabled ? 'var(--synapse)' : 'var(--cortex)'
            }}
          >
            {ttsEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={toggleCardFront}
            style={{
              background: 'var(--fog)', border: '1px solid #C8C2F0', borderRadius: '8px',
              padding: '7px 12px', cursor: 'pointer', fontSize: '13px',
              color: 'var(--cortex)', fontWeight: 500
            }}
          >
            {cardFront === 'spanish' ? 'ES → EN' : 'EN → ES'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', fontSize: '12px' }}>
        <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'var(--white-matter)', borderRadius: '10px', border: '1px solid var(--cream-dark)' }}>
          <div style={{ fontWeight: 700, color: 'var(--deep-mind)', fontSize: '16px' }}>{totalKnown}</div>
          <div style={{ color: 'var(--cortex)' }}>Known</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'var(--white-matter)', borderRadius: '10px', border: '1px solid var(--cream-dark)' }}>
          <div style={{ fontWeight: 700, color: 'var(--synapse)', fontSize: '16px' }}>{dueCount}</div>
          <div style={{ color: 'var(--cortex)' }}>Reviews</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'var(--white-matter)', borderRadius: '10px', border: '1px solid var(--cream-dark)' }}>
          <div style={{ fontWeight: 700, color: 'var(--deep-mind)', fontSize: '16px' }}>{queue.length}</div>
          <div style={{ color: 'var(--cortex)' }}>In queue</div>
        </div>
      </div>

      {/* Soft cap banner */}
      {showCapBanner && (
        <div style={{
          background: '#FFF3E0', border: '1px solid #EACFBB', borderRadius: '10px',
          padding: '10px 14px', marginBottom: '12px', fontSize: '13px', color: '#C07050'
        }}>
          You've learned 15 new words today — great pace. Keep going or come back tomorrow for reviews.
        </div>
      )}

      {/* Card */}
      <div
        onClick={handleFlip}
        style={{
          background: 'var(--deep-mind)',
          borderRadius: '24px',
          padding: '52px 36px',
          textAlign: 'center',
          cursor: flipped ? 'default' : 'pointer',
          minHeight: '280px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          userSelect: 'none',
          boxShadow: '0 8px 40px rgba(28,26,58,0.18)',
          transition: 'box-shadow 0.2s',
          position: 'relative',
        }}
      >
        {/* TTS replay button */}
        {ttsEnabled && (
          <button
            onClick={e => { e.stopPropagation(); flipped ? speakSentence(card.word) : speakWord(card.word) }}
            style={{
              position: 'absolute', bottom: '16px', right: '16px',
              background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px',
              padding: '6px 8px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
              fontSize: '14px', lineHeight: 1
            }}
          >
            ↺
          </button>
        )}

        {!flipped ? (
          <>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
              {cardFront === 'spanish' ? 'Spanish' : 'English'} · #{card.rank}
            </p>
            <p style={{ fontFamily: 'Fraunces', fontSize: 'clamp(38px, 9vw, 56px)', fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: '8px' }}>
              {frontText}
            </p>
            {card.pos && (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '8px' }}>{card.pos}</p>
            )}
            {showFlipHint && (
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '28px' }}>
                tap to flip · or press Space
              </p>
            )}
          </>
        ) : (
          <>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
              {cardFront === 'spanish' ? 'English' : 'Spanish'}
            </p>
            {card.image && (
              <div style={{
                width: '140px', height: '140px', marginBottom: '18px',
                borderRadius: '60% 40% 55% 45% / 45% 55% 40% 60%',
                overflow: 'hidden', flexShrink: 0,
                boxShadow: '0 4px 24px rgba(120, 100, 220, 0.35)',
              }}>
                <img
                  src={`/word-images/${card.image}`}
                  alt={card.word}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
            <p style={{ fontFamily: 'Fraunces', fontSize: 'clamp(28px, 6vw, 44px)', fontWeight: 700, color: 'var(--purple-mid)', marginBottom: '16px', lineHeight: 1.1 }}>
              {backText}
            </p>
            {card.pos && (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>{card.pos}</p>
            )}
            {card.example_es && (
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', maxWidth: '340px', lineHeight: 1.65, marginBottom: '4px' }}>
                "{card.example_es}"
              </p>
            )}
            {card.example_en && (
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', maxWidth: '340px', lineHeight: 1.55 }}>
                {card.example_en}
              </p>
            )}
          </>
        )}
      </div>

      {/* SRS buttons */}
      {flipped && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '14px' }}>
          {SRS_BUTTONS.map(btn => (
            <button
              key={btn.key}
              onClick={() => handleAnswer(btn.key)}
              style={{
                padding: '12px 6px', borderRadius: '12px',
                border: `1px solid ${btn.border}`,
                background: btn.bg, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px'
              }}
            >
              <span style={{ fontWeight: 600, fontSize: '14px', color: btn.color }}>{btn.label}</span>
              <span style={{ fontSize: '10px', color: 'var(--cortex)' }}>{btn.hint}</span>
              <span style={{ fontSize: '10px', color: 'var(--cortex)', opacity: 0.6 }}>[{btn.key2}]</span>
            </button>
          ))}
        </div>
      )}

      {!flipped && (
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--cortex)', marginTop: '16px', opacity: 0.7 }}>
          {card.isNew ? 'New word' : 'Review'} · {queue.length} remaining
        </p>
      )}

    </>
  )
}
