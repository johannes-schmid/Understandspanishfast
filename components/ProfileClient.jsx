'use client'

import { useState } from 'react'
import { SignOutButton } from '@/components/AuthButton'
import { trackEvent } from '@/lib/analytics'

function Card({ label, children }) {
  return (
    <section style={{
      background: 'var(--white-matter)', border: '1px solid var(--cream-dark)',
      borderRadius: '16px', padding: '20px 22px', marginBottom: '16px',
    }}>
      {label && (
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.14em', color: 'var(--iris)', marginBottom: '14px' }}>
          {label}
        </div>
      )}
      {children}
    </section>
  )
}

export default function ProfileClient({ name, email, avatarUrl, unlocked, cardFront, ttsEnabled, known, total, coverage }) {
  const [front, setFront] = useState(cardFront)
  const [tts, setTts] = useState(ttsEnabled)
  const [upgrading, setUpgrading] = useState(false)

  async function saveSetting(patch) {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
  }

  function changeFront(value) {
    setFront(value)
    saveSetting({ card_front: value })
  }

  function toggleTts() {
    const next = !tts
    setTts(next)
    saveSetting({ tts_enabled: next })
  }

  async function handleUpgrade() {
    trackEvent('upgrade_clicked')
    setUpgrading(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const { url } = await res.json()
      window.location.href = url
    } catch {
      setUpgrading(false)
    }
  }

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '76px', paddingBottom: '40px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 20px' }}>

        <h1 style={{
          fontFamily: 'var(--font-fraunces), serif', fontWeight: 700, fontSize: '30px',
          color: 'var(--deep-mind)', lineHeight: 1.05, margin: '8px 0 20px',
        }}>
          Profile
        </h1>

        {/* Account */}
        <Card label="ACCOUNT">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
              background: 'var(--fog)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="" width={52} height={52} style={{ objectFit: 'cover' }} />
                : <span className="material-symbols-rounded" style={{ fontSize: '28px', color: 'var(--synapse)' }}>person</span>}
            </div>
            <div style={{ minWidth: 0 }}>
              {name && <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--deep-mind)' }}>{name}</div>}
              <div style={{ fontSize: '13px', color: 'var(--cortex)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</div>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <SignOutButton className="profile-signout">Sign out</SignOutButton>
          </div>
        </Card>

        {/* Progress */}
        <Card label="PROGRESS">
          <div style={{ display: 'flex', gap: '28px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 700, fontSize: '30px', color: 'var(--signal)', lineHeight: 1 }}>
                {known}<span style={{ fontSize: '15px', color: 'var(--sand)', fontWeight: 400 }}> / {total}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--cortex)', marginTop: '4px' }}>Words known</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 700, fontSize: '30px', color: 'var(--synapse)', lineHeight: 1 }}>
                ~{coverage}%
              </div>
              <div style={{ fontSize: '12px', color: 'var(--cortex)', marginTop: '4px' }}>Everyday Spanish</div>
            </div>
          </div>
        </Card>

        {/* Upgrade */}
        <Card label="ACCESS">
          {unlocked ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '22px', color: 'var(--signal)' }}>verified</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--deep-mind)' }}>Full access</div>
                <div style={{ fontSize: '13px', color: 'var(--cortex)' }}>All 1,500 words unlocked — yours forever.</div>
              </div>
            </div>
          ) : (
            <>
              <p style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '17px', fontWeight: 700, color: 'var(--deep-mind)', marginBottom: '4px' }}>
                Unlock all 1,500 words
              </p>
              <p style={{ fontSize: '13px', color: 'var(--cortex)', lineHeight: 1.6, marginBottom: '16px' }}>
                You're on the free tier (first 100 words). Get the full frequency list and unlimited packs — €5 one-time, no subscription.
              </p>
              <button onClick={handleUpgrade} disabled={upgrading} className="profile-upgrade-btn">
                {upgrading ? 'Redirecting…' : 'Upgrade — €5'}
              </button>
            </>
          )}
        </Card>

        {/* Study settings */}
        <Card label="STUDY SETTINGS">
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--deep-mind)', marginBottom: '8px' }}>Card front</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[['spanish', 'Spanish'], ['english', 'English']].map(([value, text]) => (
                <button
                  key={value}
                  onClick={() => changeFront(value)}
                  className={`profile-seg ${front === value ? 'profile-seg--on' : ''}`}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--deep-mind)' }}>Audio (text-to-speech)</div>
              <div style={{ fontSize: '12px', color: 'var(--cortex)' }}>Hear each word read aloud</div>
            </div>
            <button
              role="switch"
              aria-checked={tts}
              onClick={toggleTts}
              className={`profile-switch ${tts ? 'profile-switch--on' : ''}`}
            >
              <span className="profile-switch-knob" />
            </button>
          </div>
        </Card>

      </div>
    </main>
  )
}
