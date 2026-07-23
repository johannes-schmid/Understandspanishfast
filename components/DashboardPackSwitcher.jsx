'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPackSwitcher({ activePack, packs }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  async function setActive(packId) {
    setBusy(true)
    setOpen(false)
    await fetch('/api/user/active-pack', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packId }),
    })
    router.refresh()
    setBusy(false)
  }

  return (
    <div className="dash-switcher" style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={busy}
        title={`Active pack: ${activePack.title}`}
        style={{
          height: '100%', display: 'flex', alignItems: 'center', gap: '8px',
          background: 'var(--white-matter)', border: '1px solid rgba(28,26,58,.1)',
          borderRadius: '12px', padding: '10px 16px', color: 'var(--purple-dark)',
          fontSize: '14px', fontWeight: 700, cursor: busy ? 'default' : 'pointer', fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        Switch pack <span style={{ fontSize: '11px', opacity: .7 }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '300px', maxWidth: '78vw',
          background: 'var(--white-matter)', color: 'var(--deep-mind)', borderRadius: '16px',
          boxShadow: '0 24px 60px rgba(10,8,30,.28)', border: '1px solid rgba(28,26,58,.08)',
          padding: '8px', zIndex: 70, animation: 'slideDown .18s ease both', textAlign: 'left',
        }}>
          <div style={{ padding: '8px 12px 6px', fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--sand)', fontWeight: 700 }}>
            Switch active pack
          </div>
          {packs.map((p) => {
            const isActive = (p.id ?? null) === (activePack.id ?? null)
            return (
              <button key={p.id ?? 'default'} onClick={() => !isActive && setActive(p.id)} style={{
                width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', border: 'none', background: 'transparent', borderRadius: '11px',
                cursor: isActive ? 'default' : 'pointer', fontFamily: 'inherit',
              }}>
                {isActive
                  ? <span style={{ flex: 'none', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--purple-dark)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>✓</span>
                  : <span style={{ flex: 'none', width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #D8D2E6' }} />}
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontWeight: 600, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
                  <span style={{ display: 'block', color: 'var(--cortex)', fontSize: '12px' }}>{p.meta}</span>
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
