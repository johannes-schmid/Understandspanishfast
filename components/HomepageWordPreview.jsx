'use client'

import { useState } from 'react'
import Link from 'next/link'
import { words } from '@/data/words'

const PREVIEW_COUNT = 30
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'verb', label: 'Verbs' },
  { key: 'noun', label: 'Nouns' },
  { key: 'adj', label: 'Adjectives' },
  { key: 'adv', label: 'Adverbs' },
]

const TYPE_COLORS = {
  'v.':    { bg: '#EDE8FB', color: '#534AB7' },
  'n.':    { bg: '#E1F5EE', color: '#2D7A5F' },
  'adj.':  { bg: '#F4D8E8', color: '#A03060' },
  'adv.':  { bg: '#FEF3C7', color: '#92400E' },
}

function typeKey(pos) {
  if (!pos) return 'other'
  const p = pos.toLowerCase()
  if (p.startsWith('v')) return 'verb'
  if (p.startsWith('n')) return 'noun'
  if (p.startsWith('adj')) return 'adj'
  if (p.startsWith('adv')) return 'adv'
  return 'other'
}

export default function HomepageWordPreview() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const filtered = words.filter(w => {
    const matchSearch = !search ||
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      (w.meanings || []).some(m => m.toLowerCase().includes(search.toLowerCase()))
    const matchFilter = filter === 'all' || typeKey(w.pos) === filter
    return matchSearch && matchFilter
  })

  const preview = filtered.slice(0, PREVIEW_COUNT)
  const hasMore = filtered.length > PREVIEW_COUNT

  return (
    <div>
      {/* Controls */}
      <div style={{
        display: 'flex', gap: '12px', flexWrap: 'wrap',
        alignItems: 'center', marginBottom: '16px',
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '320px' }}>
          <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cortex)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search Spanish or English…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px 10px 40px',
              borderRadius: '8px', border: '1.5px solid rgba(28,26,58,0.15)',
              background: 'var(--white-matter)', color: 'var(--deep-mind)',
              fontSize: '14px', fontFamily: "'Cabinet Grotesk', sans-serif",
              fontWeight: 300, outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--synapse)'}
            onBlur={e => e.target.style.borderColor = 'rgba(28,26,58,0.15)'}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '8px 14px', borderRadius: '8px', fontSize: '13px',
              fontWeight: 500, cursor: 'pointer', border: 'none',
              fontFamily: "'Cabinet Grotesk', sans-serif",
              background: filter === f.key ? 'var(--deep-mind)' : 'var(--cream-dark)',
              color: filter === f.key ? 'var(--white-matter)' : 'var(--cortex)',
              transition: 'background .15s, color .15s',
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '0.5px solid rgba(28,26,58,0.1)' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '48px 1fr 1fr 80px',
          padding: '10px 16px', background: 'var(--cream-dark)',
          fontSize: '11px', fontWeight: 500, textTransform: 'uppercase',
          letterSpacing: '.07em', color: 'var(--cortex)',
        }}>
          <span>#</span><span>Spanish</span><span>English</span><span>Type</span>
        </div>

        {preview.map((w, i) => {
          const colors = TYPE_COLORS[w.pos] || { bg: 'var(--fog)', color: 'var(--synapse)' }
          const isExpanded = expanded === w.rank
          return (
            <div key={w.rank}>
              <div
                onClick={() => setExpanded(isExpanded ? null : w.rank)}
                style={{
                  display: 'grid', gridTemplateColumns: '48px 1fr 1fr 80px',
                  padding: '12px 16px', cursor: 'pointer',
                  background: i % 2 === 0 ? 'var(--white-matter)' : 'var(--cream)',
                  borderTop: '0.5px solid rgba(28,26,58,0.06)',
                  transition: 'background .1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--fog)'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'var(--white-matter)' : 'var(--cream)'}
              >
                <span style={{ fontSize: '13px', color: 'var(--cortex)', alignSelf: 'center' }}>{w.rank}</span>
                <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--deep-mind)', alignSelf: 'center' }}>{w.word}</span>
                <span style={{ fontSize: '14px', fontWeight: 300, color: 'var(--cortex)', alignSelf: 'center' }}>
                  {(w.meanings || []).slice(0, 2).join(' · ')}
                </span>
                <span style={{ alignSelf: 'center' }}>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: '6px',
                    fontSize: '11px', fontWeight: 500,
                    background: colors.bg, color: colors.color,
                  }}>{w.pos}</span>
                </span>
              </div>
              {isExpanded && (w.example_es || w.example_en) && (
                <div style={{
                  padding: '10px 16px 12px 64px',
                  background: 'var(--fog)',
                  borderTop: '0.5px solid rgba(28,26,58,0.06)',
                  fontSize: '13px', fontWeight: 300,
                }}>
                  {w.example_es && <div style={{ color: 'var(--deep-mind)', marginBottom: '3px', fontStyle: 'italic' }}>{w.example_es}</div>}
                  {w.example_en && <div style={{ color: 'var(--cortex)' }}>{w.example_en}</div>}
                </div>
              )}
            </div>
          )
        })}

        {/* Blur paywall overlay */}
        {hasMore && !search && (
          <div style={{ position: 'relative' }}>
            {/* Fake faded rows for depth */}
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '48px 1fr 1fr 80px',
                padding: '12px 16px',
                background: i % 2 === 0 ? 'var(--white-matter)' : 'var(--cream)',
                borderTop: '0.5px solid rgba(28,26,58,0.06)',
                opacity: 1 - i * 0.18,
                filter: `blur(${i * 1.2}px)`,
                pointerEvents: 'none',
              }}>
                <span style={{ fontSize: '13px', color: 'var(--cortex)' }}>{PREVIEW_COUNT + i + 1}</span>
                <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--deep-mind)' }}>{'─'.repeat(5 + (i % 3))}</span>
                <span style={{ fontSize: '14px', fontWeight: 300, color: 'var(--cortex)' }}>{'─'.repeat(8 + (i % 4))}</span>
                <span><span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', background: 'var(--cream-dark)', color: 'transparent' }}>v.</span></span>
              </div>
            ))}
            {/* CTA overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(242,237,228,0) 0%, rgba(242,237,228,0.85) 40%, rgba(242,237,228,0.97) 100%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'flex-end', padding: '32px 24px 28px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--deep-mind)', marginBottom: '6px' }}>
                {filtered.length - PREVIEW_COUNT} more words in the full list
              </p>
              <p style={{ fontSize: '13px', fontWeight: 300, color: 'var(--cortex)', marginBottom: '20px' }}>
                Create a free account to access all words, track your progress, and see your comprehension %.
              </p>
              <Link href="/get-started" className="btn-primary">
                Sign up free — it takes 10 seconds
              </Link>
            </div>
          </div>
        )}
      </div>

      {search && filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--cortex)', padding: '24px', fontSize: '14px' }}>
          No words found for "{search}"
        </p>
      )}
    </div>
  )
}
