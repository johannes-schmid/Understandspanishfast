'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PackPaywallModal from '@/components/PackPaywallModal'

const SOURCE_LABEL = { url: 'Website', pdf: 'PDF', srt: 'TV series', topic: 'Topic' }
const serif = { fontFamily: 'var(--font-fraunces), serif' }

export default function PacksList({ packs, activePackId = null, canBuild = true }) {
  const router = useRouter()
  const [items, setItems] = useState(packs)
  const [active, setActive] = useState(activePackId)
  const [busy, setBusy] = useState(null)
  const [paywall, setPaywall] = useState(false)

  async function setActivePack(id) {
    setBusy(id ?? 'default')
    setActive(id)
    await fetch('/api/user/active-pack', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packId: id }),
    })
    setBusy(null)
    router.refresh()
  }

  async function remove(id) {
    if (!confirm('Delete this pack? Your progress on its words is kept for words in the main list.')) return
    setBusy(id)
    const res = await fetch(`/api/packs/${id}`, { method: 'DELETE' })
    setBusy(null)
    if (res.ok) {
      setItems((prev) => prev.filter((p) => p.id !== id))
      if (active === id) setActive(null)
      router.refresh()
    } else {
      alert('Could not delete pack')
    }
  }

  function newPack() {
    if (canBuild) router.push('/packs/new')
    else setPaywall(true)
  }

  const rows = [
    { id: null, title: '1500 most common words', kind: 'Default', meta: 'Frequency-ranked', href: '/study', deletable: false },
    ...items.map((p) => ({
      id: p.id, title: p.title, kind: SOURCE_LABEL[p.source_type] || p.source_type,
      meta: `${p.word_count} words`, href: `/packs/${p.id}`, deletable: true,
    })),
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '28px' }}>
        <div>
          <h1 style={{ ...serif, fontSize: 'clamp(30px, 6vw, 40px)', fontWeight: 700, margin: 0, letterSpacing: '-.02em', color: 'var(--deep-mind)' }}>Your packs</h1>
          <p style={{ margin: '8px 0 0', color: 'var(--cortex)', fontSize: '15px', maxWidth: '440px' }}>
            Pick which pack drives your dashboard and study queue — or build a new one from real content.
          </p>
        </div>
        <button onClick={newPack} style={{
          background: 'var(--purple-dark)', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: '14px',
          fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 18px rgba(83,74,183,.3)', fontFamily: 'inherit',
        }}>+ New pack</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {rows.map((p) => {
          const isActive = (p.id ?? null) === (active ?? null)
          return (
            <div key={p.id ?? 'default'} style={{
              position: 'relative', background: 'var(--white-matter)', borderRadius: '18px', padding: '20px 22px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px',
              border: `1px solid ${isActive ? 'var(--purple-dark)' : 'rgba(28,26,58,.06)'}`,
              boxShadow: isActive ? '0 6px 20px rgba(83,74,183,.12)' : '0 1px 2px rgba(28,26,58,.04)',
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: '17px', color: 'var(--deep-mind)' }}>{p.title}</span>
                  {isActive && <span style={badge('var(--signal-light)', 'var(--signal)')}>Active</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '7px' }}>
                  <span style={badge('var(--fog)', 'var(--purple-dark)')}>{p.kind}</span>
                  <span style={{ color: 'var(--cortex)', fontSize: '14px' }}>{p.meta}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 'none' }}>
                {!isActive && (
                  <button onClick={() => setActivePack(p.id)} disabled={busy != null} style={{
                    background: 'transparent', border: '1px solid rgba(28,26,58,.16)', color: 'var(--purple-dark)',
                    padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  }}>Set active</button>
                )}
                <Link href={p.href} style={{ color: 'var(--purple-dark)', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>Study →</Link>
                {p.deletable && (
                  <button onClick={() => remove(p.id)} disabled={busy === p.id} style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sand)', fontSize: '14px', fontFamily: 'inherit',
                  }}>Delete</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {paywall && <PackPaywallModal onClose={() => setPaywall(false)} />}
    </div>
  )
}

const badge = (bg, color) => ({ background: bg, color, padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 })
