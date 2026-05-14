'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Label } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'

const TOTAL = 1500

const chartConfig = {
  learned: { color: 'var(--synapse)' },
  remaining: { color: 'var(--fog)' },
}

export default function ProgressRing({ learned }) {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(learned), 80)
    return () => clearTimeout(timer)
  }, [learned])

  const pct = Math.min(animated / TOTAL, 1)
  const displayPct = Math.round(Math.min(learned / TOTAL, 1) * 100)

  const data = [
    { name: 'learned', value: pct },
    { name: 'remaining', value: 1 - pct },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <ChartContainer config={chartConfig} style={{ width: 220, height: 220 }}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={72}
            outerRadius={92}
            startAngle={90}
            endAngle={-270}
            strokeWidth={0}
            isAnimationActive
            animationBegin={0}
            animationDuration={900}
            animationEasing="ease-out"
          >
            <Cell fill="var(--synapse)" strokeWidth={0} />
            <Cell fill="var(--fog)" strokeWidth={0} />
            <Label
              content={({ viewBox }) => {
                const { cx, cy } = viewBox
                return (
                  <g>
                    <text
                      x={cx}
                      y={cy - 10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontFamily: 'Fraunces', fontSize: '30px', fontWeight: 700, fill: 'var(--deep-mind)' }}
                    >
                      {learned}
                    </text>
                    <text
                      x={cx}
                      y={cy + 18}
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
      <p style={{ color: 'var(--cortex)', fontSize: '14px' }}>
        {displayPct}% of everyday Spanish unlocked
      </p>
    </div>
  )
}
