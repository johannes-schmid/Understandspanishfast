'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProgressRing from '@/components/ProgressRing'

export default function DashboardCardStack({ nextWords = [], dueCount = 0, learned = 0, learning = 0, unseenCount = 0 }) {
  const [hovered, setHovered] = useState(false)

  const hasCards = dueCount > 0 || unseenCount > 0
  const frontWord = nextWords[0] ?? null
  const cardCount = Math.min(nextWords.length, 3)

  return (
    <div>

      {/* ── 1. Compact stats chips — standalone, no overlap ── */}
      <div style={{
        background: 'var(--white-matter)',
        borderRadius: '20px',
        padding: '14px 16px',
        border: '1px solid var(--cream-dark)',
        boxShadow: '0 4px 16px rgba(28,26,58,0.07)',
        display: 'flex', gap: '8px',
        marginBottom: '16px',
      }}>
        {[
          { value: learned,     label: 'Known',     color: 'var(--signal)' },
          { value: dueCount,    label: 'To review',  color: dueCount > 0 ? 'var(--synapse)' : 'var(--deep-mind)' },
          { value: unseenCount, label: 'New words',  color: 'var(--deep-mind)' },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1, background: 'var(--cream)',
            borderRadius: '12px', padding: '10px 12px',
            display: 'flex', flexDirection: 'column', gap: '2px',
          }}>
            <span style={{ fontFamily: 'Fraunces', fontSize: '22px', fontWeight: 700, color: stat.color, lineHeight: 1 }}>
              {stat.value}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--cortex)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── 2. Vocab card stack — renders first, sits at top ── */}
      <div style={{
        position: 'relative', zIndex: 1,
      }}>
        {/* Front card */}
        <Link
          href="/study"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'block', position: 'relative', zIndex: 2,
            textDecoration: 'none', borderRadius: '20px', overflow: 'hidden',
            margin: '0 14px',
            background: hasCards ? 'var(--deep-mind)' : 'var(--fog)',
            boxShadow: hovered
              ? '0 16px 40px rgba(28,26,58,0.38)'
              : '0 8px 28px rgba(28,26,58,0.28)',
            transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
            transition: 'transform 0.22s ease, box-shadow 0.22s ease',
          }}
        >
          {hasCards && frontWord ? (
            <>
              <div style={{ padding: '28px 28px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                    {dueCount > 0 ? 'Review' : 'New word'}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                    #{frontWord.rank}
                  </span>
                </div>
                <p style={{ fontFamily: 'Fraunces', fontSize: '52px', fontWeight: 900, color: 'var(--white-matter)', lineHeight: 1, letterSpacing: '-2px', marginBottom: '6px' }}>
                  {frontWord.word}
                </p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontWeight: 300 }}>
                  {frontWord.pos}
                </p>
              </div>
              <div style={{ background: 'var(--white-matter)', padding: '18px 28px 22px' }}>
                <p style={{ fontFamily: 'Fraunces', fontSize: '20px', fontWeight: 500, color: 'var(--mauve)', marginBottom: '6px', letterSpacing: '-0.3px' }}>
                  {frontWord.meanings[0]}
                </p>
                {frontWord.example_es && (
                  <p style={{ fontSize: '13px', color: 'var(--cortex)', fontStyle: 'italic', lineHeight: 1.55, borderLeft: '2px solid var(--cream-dark)', paddingLeft: '10px' }}>
                    "{frontWord.example_es}"
                  </p>
                )}
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--synapse)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Tap to study →
                  </span>
                  {dueCount > 0 && (
                    <span style={{ fontSize: '11px', color: 'var(--cortex)', background: 'var(--fog)', borderRadius: '6px', padding: '3px 8px' }}>
                      {dueCount} due
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: '36px 28px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Fraunces', fontSize: '24px', fontWeight: 700, color: 'var(--white-matter)', marginBottom: '8px' }}>
                All caught up
              </p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px', lineHeight: 1.55 }}>
                No cards due right now.
              </p>
              <span style={{ display: 'inline-block', background: 'var(--synapse)', color: '#fff', borderRadius: '10px', padding: '10px 22px', fontWeight: 600, fontSize: '14px' }}>
                Keep practicing →
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* ── 3. Donut ring card — slides up on top of vocab card ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        marginTop: '-160px',
        background: 'var(--white-matter)',
        borderRadius: '20px',
        padding: '24px 24px 64px',
        border: '1px solid var(--cream-dark)',
        boxShadow: '0 4px 20px rgba(28,26,58,0.09)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <ProgressRing learned={learned} learning={learning} />
      </div>

    </div>
  )
}
