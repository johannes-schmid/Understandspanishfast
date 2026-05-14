'use client'

import { useState } from 'react'
import PaywallModal from '@/components/PaywallModal'

const FREE_LIMIT = 100

const SRS_BUTTONS = [
  { key: 'again', label: 'Again',  hint: 'Didn\'t know it',  bg: '#FBEAF0', color: '#D4537E', border: '#F0C4D4' },
  { key: 'hard',  label: 'Hard',   hint: 'Struggled',        bg: '#FFF3E0', color: '#C07050', border: '#EACFBB' },
  { key: 'good',  label: 'Good',   hint: 'Got it',           bg: 'var(--fog)', color: 'var(--synapse)', border: '#C8C2F0' },
  { key: 'easy',  label: 'Easy',   hint: 'Knew instantly',   bg: 'var(--signal-light)', color: 'var(--signal)', border: '#B8DECE' },
]

export default function FlashCard({ words, knownRanks, initialCardFront, unlocked }) {
  const knownSet = new Set(knownRanks)

  // Build initial queue: unknown words in rank order
  const [queue, setQueue] = useState(() => words.filter(w => !knownSet.has(w.rank)))
  const [flipped, setFlipped] = useState(false)
  const [cardFront, setCardFront] = useState(initialCardFront ?? 'spanish')
  const [sessionKnown, setSessionKnown] = useState(new Set())

  const card = queue[0] ?? null
  const totalKnown = knownRanks.length + sessionKnown.size

  if (!card) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎉</div>
        <h2 style={{ fontFamily: 'Fraunces', fontSize: '28px', fontWeight: 700, color: 'var(--deep-mind)', marginBottom: '12px' }}>
          Session complete
        </h2>
        <p style={{ color: 'var(--cortex)', marginBottom: '32px' }}>
          You've worked through all available cards.
        </p>
        <a href="/dashboard" style={{
          background: 'var(--synapse)', color: '#fff',
          borderRadius: '12px', padding: '14px 32px',
          fontWeight: 500, textDecoration: 'none'
        }}>
          Back to dashboard
        </a>
      </div>
    )
  }

  const isPaywalled = !unlocked && card.rank > FREE_LIMIT

  const frontText = cardFront === 'spanish' ? card.word : card.meanings[0]
  const backText  = cardFront === 'spanish' ? card.meanings[0] : card.word
  const frontLabel = cardFront === 'spanish' ? 'Spanish' : 'English'
  const backLabel  = cardFront === 'spanish' ? 'English' : 'Spanish'

  async function saveProgress(rank, status) {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word_rank: rank, status }),
    })
  }

  function handleAnswer(status) {
    saveProgress(card.rank, status)
    const [current, ...rest] = queue

    if (status === 'again') {
      // Put back at position 3 (or end if queue is short)
      const insertAt = Math.min(3, rest.length)
      const newQueue = [...rest.slice(0, insertAt), current, ...rest.slice(insertAt)]
      setQueue(newQueue)
    } else if (status === 'hard') {
      // Put back at end of queue
      setQueue([...rest, current])
    } else {
      // good / easy → remove from queue, count as known for session
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

  return (
    <>
      {isPaywalled && <PaywallModal />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <span style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: '20px', color: 'var(--deep-mind)' }}>
            {totalKnown}
          </span>
          <span style={{ color: 'var(--cortex)', fontSize: '14px' }}> / 1,500 known</span>
        </div>
        <button
          onClick={toggleCardFront}
          style={{
            background: 'var(--fog)', border: 'none', borderRadius: '8px',
            padding: '8px 14px', cursor: 'pointer', fontSize: '13px',
            color: 'var(--cortex)'
          }}
        >
          ⇄ {cardFront === 'spanish' ? 'ES → EN' : 'EN → ES'}
        </button>
      </div>

      {/* Card */}
      <div
        onClick={() => !flipped && setFlipped(true)}
        style={{
          background: 'var(--white-matter)', borderRadius: '20px',
          padding: '48px 36px', textAlign: 'center',
          cursor: flipped ? 'default' : 'pointer',
          border: '1px solid var(--cream-dark)', minHeight: '260px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          userSelect: 'none',
          boxShadow: flipped ? '0 8px 32px rgba(83,74,183,0.12)' : '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        {!flipped ? (
          <>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--cortex)', marginBottom: '16px' }}>
              {frontLabel} · rank #{card.rank}
            </p>
            <p style={{ fontFamily: 'Fraunces', fontSize: 'clamp(36px, 8vw, 52px)', fontWeight: 700, color: 'var(--deep-mind)' }}>
              {frontText}
            </p>
            <p style={{ color: 'var(--cortex)', fontSize: '13px', marginTop: '20px' }}>tap to reveal</p>
          </>
        ) : (
          <>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--cortex)', marginBottom: '16px' }}>
              {backLabel}
            </p>
            <p style={{ fontFamily: 'Fraunces', fontSize: 'clamp(28px, 6vw, 42px)', fontWeight: 700, color: 'var(--synapse)', marginBottom: '12px' }}>
              {backText}
            </p>
            {card.pos && (
              <p style={{ color: 'var(--cortex)', fontSize: '13px', marginBottom: '8px' }}>{card.pos}</p>
            )}
            {card.example_es && (
              <p style={{ color: 'var(--cortex)', fontSize: '14px', fontStyle: 'italic', maxWidth: '360px', lineHeight: 1.6 }}>
                "{card.example_es}"
              </p>
            )}
          </>
        )}
      </div>

      {/* SRS buttons — shown only when flipped */}
      {flipped && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '16px' }}>
          {SRS_BUTTONS.map(btn => (
            <button
              key={btn.key}
              onClick={() => handleAnswer(btn.key)}
              style={{
                padding: '12px 6px', borderRadius: '12px',
                border: `1px solid ${btn.border}`,
                background: btn.bg, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
              }}
            >
              <span style={{ fontFamily: 'Cabinet Grotesk', fontWeight: 600, fontSize: '15px', color: btn.color }}>
                {btn.label}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--cortex)' }}>{btn.hint}</span>
            </button>
          ))}
        </div>
      )}

      {/* Remaining count */}
      <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--cortex)', marginTop: '20px' }}>
        {queue.length} card{queue.length !== 1 ? 's' : ''} remaining in session
      </p>
    </>
  )
}
