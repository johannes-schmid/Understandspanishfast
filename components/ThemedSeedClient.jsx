'use client'

import { useState, useRef, useEffect } from 'react'
import FlashCard from '@/components/FlashCard'

const EXAMPLES = [
  'a wedding in Mexico next month',
  'ordering food at a restaurant',
  'checking into a hotel',
  'going to a doctor appointment',
  'shopping at a market',
  'taking a taxi in Madrid',
]

export default function ThemedSeedClient({ unlocked, cardFront, ttsEnabled }) {
  const [scenario, setScenario] = useState('')
  const [loading, setLoading] = useState(false)
  const [deck, setDeck] = useState(null)
  const [error, setError] = useState(null)
  const [placeholder, setPlaceholder] = useState(EXAMPLES[0])
  const textareaRef = useRef(null)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % EXAMPLES.length
      setPlaceholder(EXAMPLES[i])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  async function handleSeed(e) {
    e.preventDefault()
    const text = scenario.trim()
    if (!text) return
    setLoading(true)
    setError(null)
    setDeck(null)

    try {
      const res = await fetch('/api/ai/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: text }),
      })
      if (!res.ok) throw new Error('Generation failed')
      const data = await res.json()
      setDeck(data.deck)
    } catch (err) {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setDeck(null)
    setScenario('')
    setError(null)
  }

  if (deck) {
    const matched = deck.filter(c => !c.isExtra).length
    const extra = deck.filter(c => c.isExtra).length
    return (
      <div>
        {/* Session header */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={reset}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.5)', fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: 0, marginBottom: '12px',
            }}
          >
            ← New scenario
          </button>
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '14px',
            padding: '14px 18px',
            marginBottom: '4px',
          }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
              Themed session
            </p>
            <p style={{ color: '#fff', fontSize: '15px', fontWeight: 500, lineHeight: 1.4 }}>
              {scenario}
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
                {matched} frequency-ranked · {extra} situational
              </span>
            </div>
          </div>
        </div>

        <FlashCard
          initialQueue={deck}
          knownRanks={[]}
          initialCardFront={cardFront}
          unlocked={unlocked}
          initialTtsEnabled={ttsEnabled}
          newTodayCount={0}
          dueCount={0}
        />
      </div>
    )
  }

  return (
    <div style={{ animation: 'fadeUp 0.5s ease both' }}>
      {/* Hero label */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '100px',
          padding: '6px 16px',
          marginBottom: '20px',
        }}>
          <span style={{ fontSize: '14px' }}>✦</span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 500, letterSpacing: '0.06em' }}>
            AI-powered vocabulary
          </span>
        </div>

        <h1 style={{
          fontFamily: 'Fraunces',
          fontSize: 'clamp(28px, 7vw, 42px)',
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.15,
          marginBottom: '12px',
        }}>
          What's coming up?
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto' }}>
          Describe a real situation and get the exact words you'll need — ranked by usefulness, ready to study.
        </p>
      </div>

      {/* Input card */}
      <form onSubmit={handleSeed}>
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: '24px',
          padding: '6px 6px 6px 20px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
          marginBottom: '20px',
          transition: 'border-color 0.2s',
        }}>
          <textarea
            ref={textareaRef}
            value={scenario}
            onChange={e => setScenario(e.target.value)}
            placeholder={placeholder}
            rows={2}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSeed(e) }
            }}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '15px',
              lineHeight: 1.6,
              resize: 'none',
              fontFamily: 'inherit',
              paddingTop: '12px',
              paddingBottom: '12px',
            }}
          />
          <button
            type="submit"
            disabled={loading || !scenario.trim()}
            style={{
              flexShrink: 0,
              background: loading
                ? 'rgba(255,255,255,0.1)'
                : 'linear-gradient(135deg, #7F77DD 0%, #534AB7 100%)',
              border: 'none',
              borderRadius: '16px',
              padding: '12px 20px',
              cursor: loading || !scenario.trim() ? 'default' : 'pointer',
              color: '#fff',
              fontWeight: 600,
              fontSize: '14px',
              opacity: loading || !scenario.trim() ? 0.5 : 1,
              transition: 'opacity 0.2s, background 0.2s',
              whiteSpace: 'nowrap',
              alignSelf: 'flex-end',
              marginBottom: '2px',
            }}
          >
            {loading ? 'Generating…' : 'Seed session →'}
          </button>
        </div>
      </form>

      {error && (
        <p style={{ color: '#F0C4D4', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>
          {error}
        </p>
      )}

      {/* Loading shimmer */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.05)',
              animation: `pulse ${0.8 + i * 0.1}s ease-in-out infinite alternate`,
            }} />
          ))}
          <style>{`@keyframes pulse { from { opacity: 0.4 } to { opacity: 0.8 } }`}</style>
        </div>
      )}

      {/* Example chips */}
      {!loading && (
        <div>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', textAlign: 'center' }}>
            Try an example
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {EXAMPLES.slice(0, 5).map((ex) => (
              <button
                key={ex}
                onClick={() => setScenario(ex)}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '100px',
                  padding: '7px 14px',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '12px',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
