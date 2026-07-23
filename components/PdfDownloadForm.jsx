'use client'

import { useState } from 'react'

export default function PdfDownloadForm({ source = 'words', compact = false }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | loading | done | error
  const [url, setUrl] = useState(null)
  const [msg, setMsg] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    if (!email || state === 'loading') return
    setState('loading')
    setMsg('')
    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      const data = await res.json()
      if (!res.ok) {
        setState('error')
        setMsg(data.error || 'Something went wrong. Please try again.')
        return
      }
      setUrl(data.url)
      setState('done')
      window.open(data.url, '_blank', 'noopener')
    } catch {
      setState('error')
      setMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <div style={{
      background: 'var(--white-matter)', borderRadius: '16px',
      border: '0.5px solid rgba(83,74,183,0.25)',
      padding: compact ? '22px 24px' : '28px 32px',
    }}>
      <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--synapse)', marginBottom: '8px' }}>
        Free PDF
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '19px', letterSpacing: '-0.4px', color: 'var(--deep-mind)', marginBottom: '6px' }}>
        Download the 1,000-word list
      </div>
      <p style={{ fontSize: '14px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.6, marginBottom: '16px' }}>
        The full frequency-ranked list as a printable PDF. Enter your email and it's yours.
      </p>

      {state === 'done' ? (
        <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--signal)' }}>
          ✓ Check your inbox — or{' '}
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--synapse)' }}>
            download it now
          </a>.
        </div>
      ) : (
        <form onSubmit={onSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{
              flex: 1, minWidth: '200px', padding: '12px 18px', borderRadius: '10px',
              border: '1.5px solid rgba(28,26,58,0.15)', background: 'var(--cream)',
              color: 'var(--deep-mind)', fontSize: '15px',
              fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 300, outline: 'none',
            }}
          />
          <button type="submit" className="btn-primary" disabled={state === 'loading'} style={{ whiteSpace: 'nowrap' }}>
            {state === 'loading' ? 'Sending…' : 'Get the PDF'}
          </button>
        </form>
      )}
      {state === 'error' && (
        <p style={{ fontSize: '13px', color: '#A03060', marginTop: '10px' }}>{msg}</p>
      )}
    </div>
  )
}
