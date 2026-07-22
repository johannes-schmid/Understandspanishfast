'use client'

import Link from 'next/link'
import { useState } from 'react'

const GRADIENT = 'linear-gradient(135deg,#1B1836 0%,#2C2658 55%,#413A78 100%)'

function estimateMinutes(cards) {
  return Math.max(1, Math.round((cards * 3.3) / 60))
}

function EmptyState() {
  return (
    <Link href="/study" style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: 'var(--deep-mind)', borderRadius: '16px', padding: '32px 26px',
        color: '#fff', textAlign: 'center', minHeight: '230px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
      }}>
        <p style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '26px', fontWeight: 700 }}>
          All caught up
        </p>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.5)', marginBottom: '12px' }}>
          No cards due right now.
        </p>
        <span style={{
          background: '#F1ECE2', color: 'var(--deep-mind)', borderRadius: '11px',
          padding: '13px 26px', fontWeight: 700, fontSize: '14px',
        }}>
          Keep practicing →
        </span>
      </div>
    </Link>
  )
}

export default function ReviewHeroCard({ word, dueCount = 0, queueCount = 0, hasCards = false }) {
  const [hovered, setHovered] = useState(false)

  if (!hasCards || !word) return <EmptyState />

  const cards = dueCount > 0 ? dueCount : queueCount
  const minutes = estimateMinutes(cards)

  return (
    <>
      {/* ── Desktop ── */}
      <Link
        href="/study"
        className="u-desk"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ textDecoration: 'none', height: '100%' }}
      >
        <div style={{
          background: 'var(--deep-mind)', borderRadius: '16px', padding: '26px',
          color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          minHeight: '230px', height: '100%', position: 'relative', overflow: 'hidden',
          transform: hovered ? 'translateY(-3px)' : 'none',
          boxShadow: hovered ? '0 18px 44px rgba(28,26,58,.32)' : '0 8px 28px rgba(28,26,58,.22)',
          transition: 'transform .22s ease, box-shadow .22s ease',
        }}>
          <div style={{
            position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px',
            borderRadius: '50%', pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(125,120,214,.35), transparent 70%)',
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.16em', color: '#8B86C9' }}>
              {dueCount > 0 ? 'READY TO REVIEW' : 'READY TO LEARN'}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,.45)' }}>
              #{word.rank} in queue
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,.5)', marginBottom: '4px' }}>
              Next up
            </div>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 500, fontSize: '46px', lineHeight: 1 }}>
              {word.word}
              {word.pos && (
                <span style={{ fontStyle: 'italic', fontWeight: 400, fontSize: '20px', color: 'rgba(255,255,255,.55)', marginLeft: '10px' }}>
                  {word.pos}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
            <span style={{
              background: '#F1ECE2', color: 'var(--deep-mind)', fontWeight: 700, fontSize: '14px',
              padding: '13px 26px', borderRadius: '11px',
            }}>
              Start review →
            </span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)' }}>
              {cards} cards · ~{minutes} min
            </span>
          </div>
        </div>
      </Link>

      {/* ── Mobile ── */}
      <Link href="/study" className="u-mob" style={{ textDecoration: 'none' }}>
        <div style={{
          background: GRADIENT, borderRadius: '22px', padding: '22px',
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: '-40px', top: '-40px', width: '160px', height: '160px',
            borderRadius: '50%', pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(213,154,43,.4), transparent 68%)',
          }} />
          <div style={{
            position: 'absolute', left: '20%', bottom: '-70px', width: '170px', height: '170px',
            borderRadius: '50%', pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(125,120,214,.45), transparent 70%)',
          }} />

          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.16em', color: '#E6C079', marginBottom: '12px' }}>
              {cards} CARDS READY · ~{minutes} MIN
            </div>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 500, fontSize: '40px', lineHeight: 1, marginBottom: '4px' }}>
              {word.word}
            </div>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,.55)', marginBottom: '18px' }}>
              next up{word.pos ? ` · ${word.pos}` : ''}
            </div>
            <div style={{
              background: 'linear-gradient(135deg,#F3D38A,#D59A2B)', color: 'var(--deep-mind)',
              fontWeight: 700, fontSize: '15px', padding: '14px', borderRadius: '13px', textAlign: 'center',
            }}>
              Start review →
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}
