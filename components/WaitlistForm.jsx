'use client'

import { useState } from 'react'

export default function WaitlistForm({ label = 'Get early access' }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    try {
      const list = JSON.parse(localStorage.getItem('usf:waitlist') || '[]')
      list.push({ email, ts: Date.now() })
      localStorage.setItem('usf:waitlist', JSON.stringify(list))
    } catch {}
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        padding: '14px 24px', borderRadius: '10px',
        background: 'var(--signal-light)', color: 'var(--signal)',
        fontSize: '15px', fontWeight: 500,
        fontFamily: "'Cabinet Grotesk', sans-serif",
      }}>
        ✓ You're on the list. We'll be in touch.
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        style={{
          flex: 1, minWidth: '220px',
          padding: '13px 20px', borderRadius: '10px',
          border: '1.5px solid rgba(28,26,58,0.15)',
          background: 'var(--white-matter)', color: 'var(--deep-mind)',
          fontSize: '15px', fontFamily: "'Cabinet Grotesk', sans-serif",
          fontWeight: 300, outline: 'none',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--synapse)'}
        onBlur={e => e.target.style.borderColor = 'rgba(28,26,58,0.15)'}
      />
      <button
        type="submit"
        className="btn-primary"
        style={{ whiteSpace: 'nowrap' }}
      >
        {label}
      </button>
    </form>
  )
}
