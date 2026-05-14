'use client'

import { useState, useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function PaywallModal() {
  const [loading, setLoading] = useState(false)

  useEffect(() => { trackEvent('paywall_shown') }, [])

  async function handleUpgrade() {
    trackEvent('upgrade_clicked')
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const { url } = await res.json()
      window.location.href = url
    } catch {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(28,26,58,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: '24px'
    }}>
      <div style={{
        background: 'var(--cream)', borderRadius: '20px',
        padding: '40px 36px', maxWidth: '420px', width: '100%',
        textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ fontFamily: 'Fraunces', fontSize: '26px', fontWeight: 700, color: 'var(--deep-mind)', marginBottom: '12px' }}>
          You've mastered the first 100 words
        </h2>
        <p style={{ color: 'var(--cortex)', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
          Unlock the remaining 1,400 words and build real Spanish comprehension — one payment, yours forever.
        </p>
        <div style={{
          background: 'var(--fog)', borderRadius: '12px', padding: '16px',
          marginBottom: '28px'
        }}>
          <span style={{ fontFamily: 'Fraunces', fontSize: '36px', fontWeight: 900, color: 'var(--synapse)' }}>€5</span>
          <span style={{ color: 'var(--cortex)', fontSize: '14px', marginLeft: '8px' }}>one-time · no subscription</span>
        </div>
        <button
          onClick={handleUpgrade}
          disabled={loading}
          style={{
            width: '100%', background: 'var(--synapse)', color: '#fff',
            border: 'none', borderRadius: '12px', padding: '16px',
            fontFamily: 'Cabinet Grotesk', fontWeight: 500, fontSize: '17px',
            cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Redirecting…' : 'Unlock all 1,500 words — €5'}
        </button>
      </div>
    </div>
  )
}
