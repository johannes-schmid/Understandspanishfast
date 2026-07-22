'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const TABS = [
  { key: 'url', label: 'Website' },
  { key: 'pdf', label: 'PDF' },
  { key: 'srt', label: 'TV series' },
]

const card = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '20px',
  padding: '20px',
}
const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '12px', padding: '12px 14px', color: '#fff', fontSize: '15px', outline: 'none',
  fontFamily: 'inherit',
}

export default function PackBuilderClient() {
  const router = useRouter()
  const [tab, setTab] = useState('url')
  const [url, setUrl] = useState('')
  const [query, setQuery] = useState('')
  const [season, setSeason] = useState('')
  const [episode, setEpisode] = useState('')
  const [file, setFile] = useState(null)
  const [building, setBuilding] = useState(false)
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  async function startBuild() {
    setError(null)
    setEvents([])
    setBuilding(true)
    try {
      let res
      if (tab === 'pdf') {
        if (!file) throw new Error('Choose a PDF first')
        const fd = new FormData()
        fd.append('file', file)
        res = await fetch('/api/packs/build', { method: 'POST', body: fd })
      } else {
        const body = tab === 'url'
          ? { source_type: 'url', url: url.trim() }
          : {
              source_type: 'srt', query: query.trim(),
              season: season ? Number(season) : undefined,
              episode: episode ? Number(episode) : undefined,
            }
        res = await fetch('/api/packs/build', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
      }
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed to start')
      const { runId } = await res.json()
      await consumeStream(runId)
    } catch (e) {
      setError(e.message)
      setBuilding(false)
    }
  }

  async function consumeStream(runId) {
    const res = await fetch(`/api/packs/stream/${runId}`)
    if (!res.ok || !res.body) throw new Error('Could not open progress stream')
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let packId = null
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      let idx
      while ((idx = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, idx).trim()
        buffer = buffer.slice(idx + 1)
        if (!line) continue
        let evt
        try { evt = JSON.parse(line) } catch { continue }
        setEvents((prev) => [...prev, evt])
        if (evt.phase === 'done' && evt.data?.packId) packId = evt.data.packId
      }
    }
    if (packId) {
      router.push(`/packs/${packId}`)
    } else {
      setBuilding(false)
      setError("The builder couldn't create a pack from that source. It may not be usable Spanish, or had too few new words.")
    }
  }

  if (building) {
    return (
      <div style={card}>
        <h2 style={{ fontFamily: 'Fraunces', color: '#fff', fontSize: '22px', marginBottom: '18px' }}>Building your pack…</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {events.map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: e.phase === 'done' ? '#7CE0A0' : 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '1px' }}>
                {e.phase === 'done' ? '✓' : '•'}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', lineHeight: 1.4 }}>{e.message}</span>
            </div>
          ))}
          {events.length === 0 && (
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Starting agent…</span>
          )}
        </div>
        {error && <p style={{ color: '#F0C4D4', fontSize: '13px', marginTop: '16px' }}>{error}</p>}
      </div>
    )
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Fraunces', fontSize: 'clamp(26px, 6vw, 38px)', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
          Build a pack from real content
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', lineHeight: 1.6, maxWidth: '380px', margin: '0 auto' }}>
          Point the agent at something you want to understand. It finds the useful new words — skipping what you already know.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', justifyContent: 'center' }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              background: tab === t.key ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.14)', borderRadius: '100px', padding: '8px 18px',
              color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 500,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={card}>
        {tab === 'url' && (
          <input style={inputStyle} value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/articulo-en-espanol" />
        )}
        {tab === 'pdf' && (
          <div>
            <input ref={fileRef} type="file" accept="application/pdf" style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button onClick={() => fileRef.current?.click()} style={{ ...inputStyle, cursor: 'pointer', textAlign: 'left' }}>
              {file ? file.name : 'Choose a PDF (max 8MB)…'}
            </button>
          </div>
        )}
        {tab === 'srt' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input style={inputStyle} value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Series name, e.g. La Casa de Papel" />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input style={inputStyle} value={season} onChange={(e) => setSeason(e.target.value)}
                placeholder="Season (optional)" inputMode="numeric" />
              <input style={inputStyle} value={episode} onChange={(e) => setEpisode(e.target.value)}
                placeholder="Episode (optional)" inputMode="numeric" />
            </div>
          </div>
        )}

        <button
          onClick={startBuild}
          style={{
            marginTop: '16px', width: '100%',
            background: 'linear-gradient(135deg, #7F77DD 0%, #534AB7 100%)', border: 'none',
            borderRadius: '14px', padding: '14px', color: '#fff', fontWeight: 600, fontSize: '15px',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Generate pack →
        </button>
      </div>

      {error && <p style={{ color: '#F0C4D4', fontSize: '13px', textAlign: 'center', marginTop: '16px' }}>{error}</p>}
    </div>
  )
}
