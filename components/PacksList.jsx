'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SOURCE_LABEL = { url: 'Website', pdf: 'PDF', srt: 'TV series' }

export default function PacksList({ packs }) {
  const router = useRouter()
  const [items, setItems] = useState(packs)
  const [busy, setBusy] = useState(null)

  async function remove(id) {
    if (!confirm('Delete this pack? Your progress on its words is kept for words in the main list.')) return
    setBusy(id)
    const res = await fetch(`/api/packs/${id}`, { method: 'DELETE' })
    setBusy(null)
    if (res.ok) setItems((prev) => prev.filter((p) => p.id !== id))
    else alert('Could not delete pack')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Fraunces', fontSize: '30px', fontWeight: 700 }}>Your packs</h1>
        <Link href="/packs/new" style={{
          background: '#534AB7', color: '#fff', borderRadius: '12px', padding: '10px 18px',
          fontSize: '14px', fontWeight: 600, textDecoration: 'none',
        }}>+ New pack</Link>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {/* Built-in default pack */}
        <Link href="/study" style={cardStyle}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '2px' }}>1500 most common words</div>
            <div style={{ color: '#8a8699', fontSize: '13px' }}>Default pack · frequency-ranked</div>
          </div>
          <span style={{ color: '#534AB7', fontSize: '14px', fontWeight: 600 }}>Study →</span>
        </Link>

        {items.map((p) => (
          <div key={p.id} style={{ ...cardStyle, cursor: 'default' }}>
            <Link href={`/packs/${p.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '2px' }}>{p.title}</div>
              <div style={{ color: '#8a8699', fontSize: '13px' }}>
                {SOURCE_LABEL[p.source_type] || p.source_type} · {p.word_count} words
              </div>
            </Link>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link href={`/packs/${p.id}`} style={{ color: '#534AB7', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Study →</Link>
              <button onClick={() => remove(p.id)} disabled={busy === p.id}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b9b5c6', fontSize: '13px' }}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p style={{ color: '#8a8699', fontSize: '14px', textAlign: 'center', padding: '24px 0' }}>
            No custom packs yet. Build one from a website, PDF, or TV series.
          </p>
        )}
      </div>
    </div>
  )
}

const cardStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  background: '#fff', border: '1px solid #eae7f0', borderRadius: '14px', padding: '16px 18px',
  textDecoration: 'none', color: 'inherit',
}
