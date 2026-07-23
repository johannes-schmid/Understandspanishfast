'use client'

import { useState } from 'react'

const BENEFITS = [
  'Unlimited AI-generated packs',
  'Website, PDF & subtitle imports',
  'All 1,500 core words unlocked too',
]

export default function PackPaywallModal({ onClose }) {
  const [busy, setBusy] = useState(false)

  async function upgrade() {
    setBusy(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const { url } = await res.json()
      if (url) window.location.href = url
      else setBusy(false)
    } catch {
      setBusy(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(20,18,44,.6)',
        backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', animation: 'fadeIn .2s ease both',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '440px', background: 'var(--white-matter)', borderRadius: '24px',
          overflow: 'hidden', boxShadow: '0 34px 90px rgba(10,8,30,.5)',
          animation: 'slideDown .26s cubic-bezier(.2,1,.3,1) both',
        }}
      >
        <div style={{
          position: 'relative',
          background: 'radial-gradient(420px 220px at 82% -40%, rgba(239,159,39,.5), transparent 60%),linear-gradient(150deg,#534AB7,#3C3489)',
          padding: '30px 30px 26px', color: '#fff',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,.18)',
            padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 800,
            letterSpacing: '.08em', marginBottom: '14px',
          }}>✦ FULL ACCESS</div>
          <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '27px', fontWeight: 700, margin: 0, lineHeight: 1.15 }}>
            You've used your free pack
          </h2>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '15px', lineHeight: 1.5, margin: '10px 0 0' }}>
            Free accounts include one AI-generated pack. Unlock for unlimited packs from any website, PDF or show.
          </p>
        </div>
        <div style={{ padding: '24px 30px 28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
            {BENEFITS.map((b) => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                <span style={{
                  flex: 'none', width: '22px', height: '22px', borderRadius: '50%',
                  background: 'var(--signal-light)', color: 'var(--signal)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800,
                }}>✓</span>
                <span style={{ fontSize: '15px', color: 'var(--deep-mind)' }}>{b}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '22px 0 16px' }}>
            <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '38px', fontWeight: 700, color: 'var(--deep-mind)' }}>€5</span>
            <span style={{ color: 'var(--cortex)', fontSize: '15px' }}>one-time · no subscription</span>
          </div>
          <button
            onClick={upgrade}
            disabled={busy}
            style={{
              width: '100%', background: 'linear-gradient(90deg,#534AB7,#7F77DD)', color: '#fff', border: 'none',
              padding: '15px', borderRadius: '14px', fontSize: '16px', fontWeight: 700,
              cursor: busy ? 'default' : 'pointer', boxShadow: '0 8px 22px rgba(83,74,183,.35)',
              marginBottom: '8px', opacity: busy ? 0.7 : 1, fontFamily: 'inherit',
            }}
          >
            {busy ? 'Redirecting…' : 'Get full access — €5'}
          </button>
          <button
            onClick={onClose}
            style={{
              width: '100%', background: 'none', border: 'none', color: 'var(--cortex)',
              padding: '10px', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
