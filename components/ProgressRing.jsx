'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Label } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'

const TOTAL = 1500

const chartConfig = {
  known: { color: 'var(--signal)' },
  learning: { color: '#E8A838' },
  upcoming: { color: 'var(--fog)' },
}

const MILESTONES = [
  { words: 100,  label: 'Basics' },
  { words: 500,  label: 'Simple stories' },
  { words: 1000, label: 'TV dialogue' },
  { words: 1500, label: 'Full foundation' },
]

export default function ProgressRing({ learned = 0, learning = 0 }) {
  const [animLearned, setAnimLearned] = useState(0)
  const [animLearning, setAnimLearning] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      setAnimLearned(learned)
      setAnimLearning(learning)
    }, 80)
    return () => clearTimeout(t)
  }, [learned, learning])

  const knownFrac = Math.min(animLearned / TOTAL, 1)
  const learningFrac = Math.min(animLearning / TOTAL, Math.max(0, 1 - knownFrac))
  const upcomingFrac = Math.max(0, 1 - knownFrac - learningFrac)

  const data = [
    { name: 'known', value: knownFrac || 0.0001 },
    { name: 'learning', value: learningFrac },
    { name: 'upcoming', value: upcomingFrac },
  ]

  const nextMilestone = MILESTONES.find(m => m.words > learned)
  const wordsUntil = nextMilestone ? nextMilestone.words - learned : 0

  const remaining = TOTAL - learned - learning
  const knownPct = Math.round((learned / TOTAL) * 100)
  const learningPct = Math.round((learning / TOTAL) * 100)
  const remainingPct = 100 - knownPct - learningPct

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <ChartContainer config={chartConfig} style={{ width: 240, height: 240 }}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={78}
            outerRadius={100}
            startAngle={90}
            endAngle={-270}
            strokeWidth={0}
            isAnimationActive
            animationBegin={0}
            animationDuration={900}
            animationEasing="ease-out"
          >
            <Cell fill="var(--signal)" strokeWidth={0} />
            <Cell fill="#E8A838" strokeWidth={0} />
            <Cell fill="var(--fog)" strokeWidth={0} />
            <Label
              content={({ viewBox }) => {
                const { cx, cy } = viewBox
                return (
                  <g>
                    <text
                      x={cx}
                      y={cy - 12}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontFamily: 'Fraunces', fontSize: '34px', fontWeight: 700, fill: 'var(--deep-mind)' }}
                    >
                      {learned}
                    </text>
                    <text
                      x={cx}
                      y={cy + 16}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontFamily: 'Cabinet Grotesk', fontSize: '12px', fill: 'var(--cortex)' }}
                    >
                      of 1,500 words
                    </text>
                  </g>
                )
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {[
          { color: 'var(--signal)', label: 'Known' },
          { color: '#E8A838', label: 'Learning' },
          { color: 'var(--fog)', label: 'Upcoming' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: 'var(--cortex)' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Stat row */}
      <div style={{
        display: 'flex', width: '100%', maxWidth: '300px',
        border: '1px solid var(--cream-dark)', borderRadius: '10px',
        overflow: 'hidden', marginTop: '4px',
      }}>
        {[
          { label: 'Known', value: learned, pct: knownPct, color: 'var(--signal)' },
          { label: 'Learning', value: learning, pct: learningPct, color: '#E8A838' },
          { label: 'Remaining', value: remaining, pct: remainingPct, color: 'var(--cortex)' },
        ].map((stat, i) => (
          <div key={stat.label} style={{
            flex: 1, textAlign: 'center', padding: '8px 4px',
            borderLeft: i > 0 ? '1px solid var(--cream-dark)' : 'none',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: stat.color, fontFamily: 'Fraunces' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--cortex)', marginTop: '1px' }}>
              {stat.label} · {stat.pct}%
            </div>
          </div>
        ))}
      </div>

      {/* Milestone sub-label */}
      {nextMilestone && (
        <p style={{ fontSize: '13px', color: 'var(--cortex)', textAlign: 'center' }}>
          <span style={{ color: 'var(--deep-mind)', fontWeight: 600 }}>{wordsUntil} words</span>
          {' '}until {nextMilestone.label}
        </p>
      )}
      {!nextMilestone && (
        <p style={{ fontSize: '13px', color: 'var(--signal)', fontWeight: 600 }}>
          All 1,500 words complete
        </p>
      )}
    </div>
  )
}
