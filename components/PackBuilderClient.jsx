'use client'

import { useState, useRef, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import PackPaywallModal from '@/components/PackPaywallModal'

const TABS = [
  { key: 'topic', label: 'Topic' },
  { key: 'url', label: 'Website' },
  { key: 'pdf', label: 'PDF' },
  { key: 'srt', label: 'TV series' },
]

const PLACEHOLDER = {
  url: 'https://example.com/articulo-en-espanol',
  pdf: '',
  srt: 'La Casa de Papel',
}

const TOPIC_EXAMPLES = [
  'a wedding in Mexico next month',
  'ordering food at a restaurant',
  'checking into a hotel',
  'a doctor appointment',
  'taking a taxi in Madrid',
]

const PHASE_PCT = { generate: 45, fetch: 12, extract: 12, search: 12, download: 26, analyze: 50, define: 80, curate: 100 }

const DARK_BG =
  'radial-gradient(900px 520px at 82% -8%, rgba(83,74,183,.42), transparent 60%),' +
  'radial-gradient(720px 520px at 6% 110%, rgba(45,122,95,.24), transparent 60%),' +
  'linear-gradient(160deg,#1C1A3A,#241F52)'

const inputStyle = {
  width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,.22)',
  border: '1px solid rgba(255,255,255,.15)', borderRadius: '13px', padding: '16px',
  color: '#fff', fontSize: '15px', outline: 'none', fontFamily: 'inherit',
}
const genBtn = {
  width: '100%', background: 'linear-gradient(90deg,#534AB7,#7F77DD)', color: '#fff', border: 'none',
  padding: '16px', borderRadius: '13px', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
  boxShadow: '0 8px 24px rgba(83,74,183,.4)', fontFamily: 'inherit',
}
const serif = { fontFamily: 'var(--font-fraunces), serif' }

export default function PackBuilderClient({ unlocked = false, packCount = 0, initialTab = 'url' }) {
  const router = useRouter()
  const [view, setView] = useState('builder') // builder | building | curate | done
  const [tab, setTab] = useState(TABS.some((t) => t.key === initialTab) ? initialTab : 'url')
  const [url, setUrl] = useState('')
  const [scenario, setScenario] = useState('')
  const [query, setQuery] = useState('')
  const [season, setSeason] = useState('')
  const [episode, setEpisode] = useState('')
  const [file, setFile] = useState(null)
  const fileRef = useRef(null)

  const [events, setEvents] = useState([])
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const [buildId, setBuildId] = useState(null)
  const [curation, setCuration] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [saving, setSaving] = useState(false)
  const [created, setCreated] = useState(null)
  const [paywall, setPaywall] = useState(false)

  const usageLabel = unlocked
    ? 'Unlimited packs'
    : `${Math.max(0, 1 - packCount)} of 1 free generation left`

  async function startBuild() {
    setError(null); setEvents([]); setProgress(0)
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
          : tab === 'topic'
          ? { source_type: 'topic', scenario: scenario.trim() }
          : {
              source_type: 'srt', query: query.trim(),
              season: season ? Number(season) : undefined,
              episode: episode ? Number(episode) : undefined,
            }
        res = await fetch('/api/packs/build', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
      }
      if (res.status === 402) { setPaywall(true); return }
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed to start')
      const { runId, buildId: bid } = await res.json()
      setBuildId(bid)
      setView('building')
      await consumeStream(runId)
    } catch (e) {
      setError(e.message)
      setView('builder')
    }
  }

  async function consumeStream(runId) {
    const res = await fetch(`/api/packs/stream/${runId}`)
    if (!res.ok || !res.body) throw new Error('Could not open progress stream')
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let note = null
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
        if (evt.phase === 'note') note = evt.message
        else setEvents((prev) => [...prev, evt])
        setProgress((p) => Math.max(p, PHASE_PCT[evt.phase] ?? p))
        if (evt.phase === 'curate' && evt.data?.buildId) {
          await enterCurate(evt.data.buildId)
          return
        }
      }
    }
    setView('builder')
    setError(note || "The builder couldn't find usable new Spanish words in that source. Try a different, clearly Spanish page.")
  }

  async function enterCurate(bid) {
    const res = await fetch(`/api/packs/curation/${bid}`)
    if (!res.ok) throw new Error('Could not load the words for review')
    const data = await res.json()
    setBuildId(bid)
    setCuration(data)
    setSelected(new Set(data.words.filter((w) => w.isAuto).map((w) => w.key)))
    setProgress(100)
    setView('curate')
  }

  function toggle(key) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key); else next.add(key)
      return next
    })
  }

  async function createPack() {
    setSaving(true); setError(null)
    try {
      const res = await fetch('/api/packs/save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildId, selectedKeys: [...selected], title: curation.title }),
      })
      if (res.status === 402) { setPaywall(true); setSaving(false); return }
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Could not save the pack')
      setCreated(await res.json())
      setView('done')
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {view === 'builder' && renderBuilder()}
      {view === 'building' && renderBuilding()}
      {view === 'curate' && renderCurate()}
      {view === 'done' && renderDone()}
      {paywall && <PackPaywallModal onClose={() => setPaywall(false)} />}
    </>
  )

  // ── Builder ────────────────────────────────────────────────────
  function renderBuilder() {
    return (
      <section style={{ minHeight: '100dvh', background: DARK_BG, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '120px 24px 80px' }}>
        <div style={{ width: '100%', maxWidth: '640px', textAlign: 'center' }}>
          <button onClick={() => router.push('/packs')} style={backLink}>← Back to packs</button>
          <h1 style={{ ...serif, color: '#fff', fontSize: 'clamp(34px, 7vw, 52px)', fontWeight: 700, margin: 0, lineHeight: 1.1, letterSpacing: '-.02em' }}>
            Build a pack from real content
          </h1>
          <p style={{ color: 'rgba(255,255,255,.62)', fontSize: '17px', lineHeight: 1.55, maxWidth: '480px', margin: '20px auto 0' }}>
            Point the agent at something you want to understand. It finds the useful new words — skipping what you already know.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '28px 0 22px' }}>
            {TABS.map((t) => {
              const active = t.key === tab
              return (
                <button key={t.key} onClick={() => setTab(t.key)} style={{
                  padding: '10px 22px', borderRadius: '999px', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                  background: active ? 'var(--white-matter)' : 'rgba(255,255,255,.06)',
                  color: active ? 'var(--deep-mind)' : 'rgba(255,255,255,.78)',
                  border: `1px solid ${active ? 'var(--white-matter)' : 'rgba(255,255,255,.16)'}`,
                  transition: 'all .18s', fontFamily: 'inherit',
                }}>{t.label}</button>
              )
            })}
          </div>

          <div style={{ background: 'rgba(250,247,242,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '20px', padding: '22px' }}>
            {tab === 'topic' && (
              <div style={{ marginBottom: '14px' }}>
                <textarea
                  value={scenario} onChange={(e) => setScenario(e.target.value)} rows={2}
                  placeholder="Describe a real situation — e.g. a wedding in Mexico next month"
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); startBuild() } }}
                  style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                  {TOPIC_EXAMPLES.map((ex) => (
                    <button key={ex} onClick={() => setScenario(ex)} style={{
                      background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.14)', borderRadius: '100px',
                      padding: '6px 13px', cursor: 'pointer', color: 'rgba(255,255,255,.62)', fontSize: '12px', fontFamily: 'inherit',
                    }}>{ex}</button>
                  ))}
                </div>
              </div>
            )}
            {tab === 'url' && (
              <input style={{ ...inputStyle, marginBottom: '14px' }} value={url} onChange={(e) => setUrl(e.target.value)} placeholder={PLACEHOLDER.url} />
            )}
            {tab === 'pdf' && (
              <div style={{ marginBottom: '14px' }}>
                <input ref={fileRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <button onClick={() => fileRef.current?.click()} style={{ ...inputStyle, cursor: 'pointer', textAlign: 'left', color: file ? '#fff' : 'rgba(255,255,255,.55)' }}>
                  {file ? file.name : 'Choose a PDF (max 8MB)…'}
                </button>
              </div>
            )}
            {tab === 'srt' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                <input style={inputStyle} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={PLACEHOLDER.srt} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input style={inputStyle} value={season} onChange={(e) => setSeason(e.target.value)} placeholder="Season (optional)" inputMode="numeric" />
                  <input style={inputStyle} value={episode} onChange={(e) => setEpisode(e.target.value)} placeholder="Episode (optional)" inputMode="numeric" />
                </div>
              </div>
            )}
            <button onClick={startBuild} style={genBtn}>Generate pack →</button>
          </div>

          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '13px', marginTop: '16px' }}>{usageLabel}</p>
          {error && <p style={{ color: '#F0C4D4', fontSize: '13px', marginTop: '10px' }}>{error}</p>}
        </div>
      </section>
    )
  }

  // ── Building animation ─────────────────────────────────────────
  function renderBuilding() {
    return (
      <section style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden', background: DARK_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
        <div style={{ position: 'absolute', top: '16%', left: '12%', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(83,74,183,.5),transparent 70%)', filter: 'blur(20px)', animation: 'floatGlow 9s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '12%', right: '14%', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(45,122,95,.4),transparent 70%)', filter: 'blur(24px)', animation: 'floatGlow 11s ease-in-out infinite reverse' }} />

        <div style={{ width: '100%', maxWidth: '640px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            <div style={{ position: 'relative', width: '112px', height: '112px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', width: '96px', height: '96px', borderRadius: '26px', background: 'rgba(127,119,221,.45)', animation: 'orbPulse 2.2s ease-out infinite' }} />
              <div style={{ position: 'absolute', width: '96px', height: '96px', borderRadius: '26px', background: 'rgba(127,119,221,.3)', animation: 'orbPulse 2.2s ease-out .8s infinite' }} />
              <div style={{ position: 'absolute', top: '2px', right: '8px', color: '#EF9F27', fontSize: '16px', animation: 'sparkTwinkle 1.8s ease-in-out infinite' }}>✦</div>
              <div style={{ position: 'relative', width: '92px', height: '92px', borderRadius: '25px', background: 'linear-gradient(150deg,#534AB7,#3C3489)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'logoBob 3s ease-in-out infinite, logoGlow 2.6s ease-in-out infinite' }}>
                <div style={{ width: '46px', height: '38px', borderRadius: '6px', background: 'var(--white-matter)', padding: '8px 7px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '5px', overflow: 'hidden' }}>
                  {[{ w: '70%', c: '#EF9F27', d: '0s' }, { w: '100%', c: '#534AB7', d: '.3s' }, { w: '88%', c: '#534AB7', d: '.6s' }, { w: '60%', c: '#7B7FA8', d: '.9s' }].map((l, i) => (
                    <div key={i} style={{ height: '3px', width: l.w, borderRadius: '2px', background: l.c, transformOrigin: 'left', animation: `writeLine 2.4s ease-in-out ${l.d} infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <h2 style={{ ...serif, color: '#fff', fontSize: '30px', fontWeight: 600, textAlign: 'center', margin: '0 0 22px' }}>
            Building your pack
            <span style={{ display: 'inline-flex', gap: '4px', marginLeft: '4px', verticalAlign: 'middle' }}>
              {[0, 0.2, 0.4].map((d, i) => (
                <span key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#7F77DD', animation: `bounceDot 1.4s ${d}s infinite` }} />
              ))}
            </span>
          </h2>

          <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#534AB7,#7F77DD)', borderRadius: '999px', transition: 'width .6s cubic-bezier(.4,0,.2,1)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, width: '40%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent)', animation: 'barShimmer 1.4s linear infinite' }} />
            </div>
          </div>

          <div style={{ marginTop: '26px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {events.map((e, i) => {
              const done = i < events.length - 1
              return (
                <div key={i} style={{ display: 'flex', gap: '13px', alignItems: 'flex-start', animation: 'fadeUp .4s ease both' }}>
                  <div style={{ flex: 'none', width: '16px', height: '16px', marginTop: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {done
                      ? <span style={{ color: '#7EE0B8', fontSize: '16px', fontWeight: 800, lineHeight: '16px' }}>✓</span>
                      : <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.22)', borderTopColor: '#9A94D6', animation: 'spin .7s linear infinite' }} />}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,.92)', fontSize: '16px', lineHeight: 1.5, wordBreak: 'break-word' }}>{e.message}</div>
                </div>
              )
            })}
            {events.length === 0 && <span style={{ color: 'rgba(255,255,255,.5)', fontSize: '15px' }}>Starting agent…</span>}
          </div>
        </div>
      </section>
    )
  }

  // ── Curate / review ────────────────────────────────────────────
  function renderCurate() {
    const words = curation.words
    const selectedCount = selected.size
    const autoCount = curation.counts?.auto ?? words.filter((w) => w.isAuto).length
    const candCount = curation.counts?.candidate ?? words.filter((w) => !w.isAuto).length

    return (
      <section style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '110px 24px 90px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <button onClick={() => setView('builder')} style={{ ...backLink, color: 'var(--cortex)' }}>← Change source</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', margin: '6px 0 10px', flexWrap: 'wrap' }}>
            <span style={pill('var(--fog)', 'var(--purple-dark)')}>Step 2 of 2 · Review</span>
            <span style={pill('var(--signal-light)', 'var(--signal)')}>{autoCount} words auto-selected</span>
          </div>
          <h1 style={{ ...serif, fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 700, margin: 0, letterSpacing: '-.02em', color: 'var(--deep-mind)' }}>
            Review the words we found
          </h1>
          <p style={{ margin: '8px 0 0', color: 'var(--cortex)', fontSize: '15px', maxWidth: '620px' }}>
            We highlighted the words worth learning from this source — skipping the ones you already know. Tap any word to add it, or tap a highlight to drop it before we build the pack.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', margin: '20px 0 22px' }}>
            <Legend swatch={<span style={{ width: '16px', height: '16px', borderRadius: '5px', background: 'rgba(83,74,183,.16)', boxShadow: 'inset 0 -3px 0 rgba(83,74,183,.55)', display: 'inline-block' }} />} label="In your pack" />
            <Legend swatch={<span style={{ width: '16px', height: '16px', borderRadius: '5px', borderBottom: '2px dotted rgba(45,122,95,.6)', display: 'inline-block' }} />} label="Already known · skipped" />
            <Legend swatch={<span style={{ width: '16px', height: '16px', borderRadius: '5px', borderBottom: '2px dotted #C8C3D8', display: 'inline-block' }} />} label="Tap to add" />
          </div>

          <div className="pack-curate-grid">
            <div style={{ background: 'var(--white-matter)', borderRadius: '20px', padding: '30px 34px', border: '1px solid rgba(28,26,58,.06)', boxShadow: '0 1px 3px rgba(28,26,58,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid rgba(28,26,58,.08)' }}>
                <span style={{ flex: 'none', width: '26px', height: '26px', borderRadius: '8px', background: 'var(--fog)', color: 'var(--purple-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>⬚</span>
                <span style={{ ...serif, fontSize: '15px', color: 'var(--deep-mind)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{curation.title}</span>
              </div>
              <p style={{ ...serif, margin: 0, fontSize: '21px', lineHeight: 2.05, color: '#3A3752', whiteSpace: 'pre-wrap' }}>
                {curation.tokens.map((t, i) => renderToken(t, i))}
              </p>
            </div>

            <div style={{ position: 'sticky', top: '100px', background: 'linear-gradient(150deg,#252159,#1A1836)', borderRadius: '20px', padding: '24px', color: '#fff' }}>
              <div style={{ fontSize: '12px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#9A94D6', fontWeight: 700 }}>In your pack</div>
              <div style={{ ...serif, fontSize: '52px', fontWeight: 600, lineHeight: 1, margin: '6px 0 2px' }}>{selectedCount}</div>
              <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '13px' }}>words selected</div>
              <div style={{ margin: '20px 0', height: '1px', background: 'rgba(255,255,255,.12)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <SummaryRow dot="#7F77DD" label="Auto-selected" value={autoCount} />
                <SummaryRow dot="#5BBF97" label="Available to add" value={candCount} />
              </div>
              <button onClick={createPack} disabled={saving || selectedCount === 0} style={{ ...genBtn, marginTop: '22px', opacity: (saving || selectedCount === 0) ? 0.6 : 1, cursor: (saving || selectedCount === 0) ? 'default' : 'pointer' }}>
                {saving ? 'Creating…' : `Create pack · ${selectedCount} word${selectedCount === 1 ? '' : 's'} →`}
              </button>
              {error && <p style={{ color: '#F0C4D4', fontSize: '12px', marginTop: '10px' }}>{error}</p>}
              <p style={{ margin: '12px 0 0', color: 'rgba(255,255,255,.45)', fontSize: '12px', lineHeight: 1.5, textAlign: 'center' }}>
                You can refine the words anytime after the pack is created.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  function renderToken(t, i) {
    if (t.type === 'plain' || t.type === 'punct') {
      return <span key={i}>{t.lead}{t.text}</span>
    }
    if (t.type === 'known') {
      return (
        <Fragment key={i}>
          <span>{t.lead}</span>
          <span title={t.gloss} style={{ color: 'var(--signal)', borderBottom: '2px dotted rgba(45,122,95,.45)' }}>{t.text}</span>
        </Fragment>
      )
    }
    // selectable: auto or cand
    const on = selected.has(t.key)
    return (
      <Fragment key={i}>
        <span>{t.lead}</span>
        <span
          onClick={() => toggle(t.key)}
          title={on ? t.gloss : `Add “${t.text}” to pack`}
          style={on
            ? { background: 'rgba(83,74,183,.16)', color: 'var(--purple-dark)', borderRadius: '6px', padding: '2px 6px', fontWeight: 600, cursor: 'pointer', boxShadow: 'inset 0 -3px 0 rgba(83,74,183,.5)' }
            : { borderRadius: '6px', padding: '2px 3px', borderBottom: '2px dotted #C8C3D8', cursor: 'pointer' }}
        >{t.text}</span>
      </Fragment>
    )
  }

  // ── Done ───────────────────────────────────────────────────────
  function renderDone() {
    const confetti = Array.from({ length: 32 }, (_, i) => {
      const cols = ['#7F77DD', '#EF9F27', '#5BBF97', '#D4537E', '#FAF6EE']
      const l = Math.random() * 100, d = Math.random() * 0.5, du = 1.5 + Math.random() * 1.2, w = 6 + Math.random() * 7
      return <span key={i} style={{ position: 'absolute', top: 0, left: `${l}%`, width: `${w}px`, height: `${w * 0.5 + 3}px`, borderRadius: '2px', background: cols[i % cols.length], animation: `confettiFall ${du.toFixed(2)}s ${d.toFixed(2)}s ease-in forwards`, opacity: 0 }} />
    })
    return (
      <section style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden', background: DARK_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
        <div style={{ width: '100%', maxWidth: '560px', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-24px', left: 0, right: 0, height: '360px', pointerEvents: 'none' }}>{confetti}</div>
          <div style={{ width: '88px', height: '88px', borderRadius: '50%', margin: '0 auto 24px', background: 'linear-gradient(150deg,#2D7A5F,#1F5A45)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 10px rgba(45,122,95,.18),0 14px 44px rgba(45,122,95,.4)', animation: 'checkPop .6s cubic-bezier(.2,1.3,.4,1) both' }}>
            <span style={{ color: '#fff', fontSize: '46px', lineHeight: 1 }}>✓</span>
          </div>
          <h2 style={{ ...serif, color: '#fff', fontSize: '34px', fontWeight: 700, margin: 0 }}>Pack ready</h2>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '16px', margin: '12px 0 0' }}>Saved to your library and set as your active pack.</p>
          <div style={{ animation: 'slideDown .5s .15s ease both', margin: '26px auto 0', maxWidth: '440px', background: 'rgba(250,247,242,.06)', border: '1px solid rgba(255,255,255,.16)', borderRadius: '18px', padding: '20px 22px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ background: 'rgba(127,119,221,.25)', color: '#C9C4F2', padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>New</span>
            </div>
            <div style={{ ...serif, color: '#fff', fontSize: '22px', fontWeight: 600, lineHeight: 1.2 }}>{curation?.title}</div>
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '14px', marginTop: '5px' }}>{created?.wordCount} words · ready to study</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '26px', flexWrap: 'wrap' }}>
            <button onClick={() => router.push(`/packs/${created.packId}`)} style={{ ...genBtn, width: 'auto', padding: '14px 28px' }}>Study now →</button>
            <button onClick={() => router.push('/packs')} style={{ background: 'rgba(255,255,255,.08)', color: '#fff', border: '1px solid rgba(255,255,255,.2)', padding: '14px 24px', borderRadius: '13px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Back to packs</button>
          </div>
        </div>
      </section>
    )
  }
}

const backLink = { background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', fontSize: '14px', cursor: 'pointer', marginBottom: '20px', fontFamily: 'inherit' }
const pill = (bg, color) => ({ background: bg, color, padding: '4px 11px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 })

function Legend({ swatch, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {swatch}
      <span style={{ fontSize: '13px', color: '#3A3752' }}>{label}</span>
    </div>
  )
}

function SummaryRow({ dot, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '14px', color: 'rgba(255,255,255,.85)' }}>
        <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: dot }} />{label}
      </span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  )
}
