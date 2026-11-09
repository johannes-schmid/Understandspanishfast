'use client'

import { useId, useState } from 'react'

export default function PdfDownloadForm({ source = 'words', title = 'Download the 1,000-word list', body = 'The full frequency-ranked list as a printable PDF. Enter your email and it’s yours.' }) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle')
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
      setMsg('That didn’t go through. Check your connection and try again.')
    }
  }

  return (
    <div className="card pdf-form">
      <h2 className="pdf-form-title">{title}</h2>
      <p className="pdf-form-body">{body}</p>

      {state === 'done' ? (
        <p className="pdf-form-done" role="status">
          Sent. Check your inbox, or <a href={url} target="_blank" rel="noopener noreferrer">download it now</a>.
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate={false}>
          <label htmlFor={id} className="pdf-form-label">Email</label>
          <div className="pdf-form-row">
            <input
              id={id}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-invalid={state === 'error' || undefined}
              aria-describedby={state === 'error' ? `${id}-err` : undefined}
            />
            <button type="submit" className="btn btn-coral" disabled={state === 'loading'}>
              {state === 'loading' ? 'Sending' : 'Get the PDF'}
            </button>
          </div>
          {state === 'error' && <p id={`${id}-err`} className="pdf-form-err">{msg}</p>}
          <p className="fine">One email with the link. No spam.</p>
        </form>
      )}
    </div>
  )
}
