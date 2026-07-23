'use client'

import { useState, useEffect } from 'react'
import { TOTAL_WORDS as TOTAL, nextMilestone as findNextMilestone } from '@/lib/userStats'

const LEGEND = [
  { color: 'var(--signal)', label: 'Known' },
  { color: 'var(--gold)',   label: 'Learning' },
  { color: '#D3D0EA',       label: 'Upcoming' },
]

export default function ProgressRing({ learned = 0, learning = 0, total = TOTAL }) {
  const [anim, setAnim] = useState({ learned: 0, learning: 0 })

  useEffect(() => {
    const t = setTimeout(() => setAnim({ learned, learning }), 80)
    return () => clearTimeout(t)
  }, [learned, learning])

  const knownPct = Math.min((anim.learned / total) * 100, 100)
  const learningPct = Math.min((anim.learning / total) * 100, Math.max(0, 100 - knownPct))
  const ringEnd = knownPct + learningPct

  const isCorpus = total === TOTAL
  const nextMilestone = isCorpus ? findNextMilestone(learned) : null
  const wordsUntil = nextMilestone?.wordsUntil ?? 0

  const milestoneText = !isCorpus ? (
    learned >= total
      ? <b style={{ color: 'var(--signal)' }}>Pack complete</b>
      : <><b style={{ color: 'var(--deep-mind)' }}>{Math.max(0, total - learned)} words</b>{' '}left in this pack</>
  ) : nextMilestone ? (
    <>
      <b style={{ color: 'var(--deep-mind)' }}>{wordsUntil} words</b>
      {' '}until <span style={{ color: 'var(--iris)' }}>{nextMilestone.label}</span>
    </>
  ) : (
    <b style={{ color: 'var(--signal)' }}>All 1,500 words complete</b>
  )

  return (
    <div className="dash-mastery">
      <div className="u-desk" style={{ alignSelf: 'flex-start', fontSize: '10px', fontWeight: 600, letterSpacing: '.14em', color: 'var(--sand)' }}>
        VOCABULARY MASTERY
      </div>

      <div
        className="dash-ring"
        style={{
          background: `conic-gradient(from -90deg, var(--signal) 0 ${knownPct}%, var(--gold) ${knownPct}% ${ringEnd}%, var(--lilac) ${ringEnd}% 100%)`,
          transition: 'background 0.9s ease-out',
        }}
      >
        <div className="dash-ring-inner">
          <span className="dash-ring-value">{learned}</span>
          <span className="dash-ring-sub u-desk">of {total.toLocaleString()} words</span>
          <span className="dash-ring-sub u-mob">/ {total.toLocaleString()}</span>
        </div>
      </div>

      {/* Desktop: legend + milestone footer */}
      <div className="u-desk" style={{ width: '100%' }}>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', fontSize: '11px', color: '#6B6558' }}>
          {LEGEND.map(item => (
            <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
        <div style={{
          width: '100%', marginTop: '14px', paddingTop: '12px',
          borderTop: '1px solid rgba(28,26,58,.08)',
          textAlign: 'center', fontSize: '12px', color: '#6B6558',
        }}>
          {milestoneText}
        </div>
      </div>

      {/* Mobile: milestone + compact legend beside the ring */}
      <div className="u-mob" style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.12em', color: 'var(--sand)', marginBottom: '4px' }}>
          MASTERY
        </div>
        <div style={{ fontSize: '13px', lineHeight: 1.4, color: '#6B6558' }}>
          {milestoneText}
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px', fontSize: '10px', color: '#6B6558' }}>
          {LEGEND.slice(0, 2).map(item => (
            <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
