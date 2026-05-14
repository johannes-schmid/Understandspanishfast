'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WORDS } from '@/data/words'

const TIERS = [
  { from: 1, to: 100, label: 'Essential', sample: 5 },
  { from: 101, to: 250, label: 'Fundamental', sample: 5 },
  { from: 251, to: 500, label: 'Core', sample: 5 },
  { from: 501, to: 1000, label: 'Advanced', sample: 5 },
  { from: 1001, to: 1500, label: 'Mastery', sample: 5 },
  { from: 1501, to: 2000, label: 'Beyond', sample: 5 },
]

function pickWords() {
  const out = []
  TIERS.forEach((t) => {
    const pool = WORDS.filter((w) => w.rank >= t.from && w.rank <= t.to)
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    out.push(...shuffled.slice(0, t.sample).map((w) => ({ ...w, tier: t.label })))
  })
  return out
}

function computeReach(answers, deck) {
  let reach = 0
  for (const t of TIERS) {
    const tierAnswers = deck.map((w, i) => ({ w, a: answers[i] })).filter(({ w }) => w.rank >= t.from && w.rank <= t.to)
    if (!tierAnswers.length) continue
    const known = tierAnswers.filter((x) => x.a === true).length
    const ratio = known / tierAnswers.length
    if (ratio >= 0.6) reach = t.to
    else {
      reach = Math.max(reach, t.from - 1 + Math.round(ratio * (t.to - t.from + 1)))
      break
    }
  }
  return reach
}

function nextMilestone(reach) {
  for (const m of [100, 250, 500, 1000, 1500, 2000]) if (reach < m) return m
  return 2000
}

function levelLabel(reach) {
  if (reach < 100) return 'A1 — Starter'
  if (reach < 250) return 'A1 — Survival'
  if (reach < 500) return 'A2 — Daily'
  if (reach < 1000) return 'B1 — Conversational'
  if (reach < 1500) return 'B2 — Fluent'
  return 'C1 — Mastery'
}

export default function LevelTestClient() {
  const [deck] = useState(() => pickWords())
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const done = idx >= deck.length

  const reach = useMemo(() => computeReach(answers, deck), [answers, deck])
  const milestone = nextMilestone(reach)
  const level = levelLabel(reach)
  const gap = Math.max(0, 1500 - reach)

  useEffect(() => {
    if (done) {
      try { localStorage.setItem('usf:lastReach', JSON.stringify({ reach, ts: Date.now() })) } catch {}
    }
  }, [done, reach])

  const answer = (known) => {
    setAnswers((a) => [...a, known])
    setIdx((i) => i + 1)
  }

  const restart = () => { setIdx(0); setAnswers([]); window.scrollTo({ top: 0 }) }
  const current = deck[idx]
  const progressPct = Math.round((idx / deck.length) * 100)

  return (
    <div className="bg-background text-on-surface">
      <main className="relative pt-32 pb-16">
        <section className="px-8 max-w-5xl mx-auto text-center relative">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl -z-10"></div>
          <h1 className="text-4xl md:text-5xl font-semibold text-on-background mb-6 tracking-tight">
            How much Spanish do you <span className="text-[#FF8C00] italic">really</span> know?
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            Take the 2-minute Word Reach test to find your level and see what you can unlock.
          </p>
        </section>

        <section className="px-8 py-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-surface-variant flex flex-col gap-8">
            {!done ? (
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">{idx}/{deck.length} words</span>
                    <span className="text-sm text-[#FF8C00] font-bold">{progressPct}% Complete</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full transition-all" style={{ width: `${progressPct}%` }}></div>
                  </div>
                </div>

                <div className="py-12 flex flex-col items-center justify-center text-center bg-surface/50 rounded-2xl border border-dashed border-outline-variant">
                  <h2 className="text-5xl md:text-6xl font-semibold text-on-background tracking-tight">{current.word}</h2>
                  <p className="text-base text-secondary italic mt-3">{current.type}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={() => answer(false)} className="flex items-center justify-center gap-2 bg-surface-container-highest text-on-surface-variant h-auto py-5 rounded-full font-semibold border-2 border-transparent hover:border-outline-variant hover:bg-surface-container-highest transition-all active:scale-[0.98]">
                    <span className="material-symbols-rounded">close</span>
                    Not yet
                  </Button>
                  <Button onClick={() => answer(true)} className="flex items-center justify-center gap-2 bg-primary-container text-on-primary-container h-auto py-5 rounded-full font-semibold shadow-sm hover:brightness-105 hover:bg-primary-container transition-all active:scale-[0.98]">
                    <span className="material-symbols-rounded" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    I know it
                  </Button>
                </div>
                <p className="text-xs text-on-surface-variant text-center">Be honest. We don't ask you to translate — just whether you'd recognise it in context.</p>
              </>
            ) : (
              <>
                <div className="text-center py-4">
                  <span className="inline-flex items-center gap-2 px-4 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-sm font-bold mb-4">
                    <span className="material-symbols-rounded text-[18px]">check_circle</span>
                    Test Complete
                  </span>
                  <h2 className="text-3xl md:text-4xl font-semibold text-on-background mb-3 tracking-tight">Your Word Reach: <span className="text-[#FF8C00]">{reach}</span></h2>
                  <p className="text-on-surface-variant">{level}</p>
                </div>
                <div className="bg-surface-container-low rounded-2xl p-6">
                  <p className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-3">What this means</p>
                  <p className="text-on-surface leading-relaxed">
                    You can recognise roughly the top <b>{reach}</b> most-frequent Spanish words. That's about <b>{Math.min(80, Math.round(reach / 1500 * 80))}%</b> coverage of everyday spoken Spanish.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={restart} className="flex-1 h-auto bg-surface-container-highest text-on-surface-variant py-4 rounded-full font-semibold hover:brightness-95 hover:bg-surface-container-highest transition-all">
                    Retake test
                  </Button>
                  <Link href="/words/most-common-spanish-words" className="flex-1 text-center bg-primary-container text-on-primary-container py-4 rounded-full font-semibold shadow-sm hover:brightness-105 transition-all no-underline">
                    See the 1000-word list
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container rounded-[2rem] p-6 border border-surface-variant">
              <h3 className="text-2xl font-semibold text-on-surface mb-6">Real-time Estimate</h3>
              <div className="relative flex items-center justify-center py-8">
                <div className="w-48 h-48 rounded-full border-[12px] border-surface-container-high relative">
                  <div className="absolute inset-0 rounded-full border-[12px] border-primary-container border-t-transparent border-l-transparent" style={{ transform: `rotate(${-45 + Math.min(360, reach / 1500 * 360)}deg)` }}></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-semibold text-on-background">{reach}</span>
                    <span className="text-sm text-on-surface-variant">words reach</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-3 rounded-full">
                  <div className="flex items-center gap-2 px-2">
                    <span className="material-symbols-rounded text-secondary">flag</span>
                    <span className="text-sm font-medium">Next milestone: {milestone}</span>
                  </div>
                  <span className="text-xs font-medium bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full whitespace-nowrap">{level.split(' — ')[0]}</span>
                </div>
                <div className="px-3 text-on-surface-variant">
                  <p className="text-sm">Gap: <span className="font-bold text-on-surface">{gap.toLocaleString()} words</span> to Mastery.</p>
                </div>
              </div>
            </div>

            <div className="bg-tertiary-container text-on-tertiary-container rounded-[2rem] p-6 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-rounded">auto_awesome</span>
                  <span className="text-xs uppercase tracking-wider font-bold">Content Unlock</span>
                </div>
                <p className="text-2xl font-medium leading-tight">
                  You're <b>{Math.min(100, Math.round(reach / 800 * 100))}%</b> ready for <span className="italic">'Money Heist'</span> Season 1.
                </p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-20">
                <span className="material-symbols-rounded text-[120px]">movie</span>
              </div>
            </div>
          </div>
        </section>

        <section className="px-8 py-16 max-w-7xl mx-auto">
          <div className="bg-surface-container-highest rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <h2 className="text-3xl md:text-4xl font-semibold text-on-background tracking-tight">Unlock your full journey.</h2>
              <p className="text-lg text-on-surface-variant">
                Don't just measure your level — surpass it. We build a personalized roadmap based on your unique Word Reach.
              </p>
              <ul className="space-y-3 mt-2">
                {['Personalized vocabulary paths', 'Content matched to your level', 'Daily practice reminders'].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-rounded text-[#FF8C00]">check_circle</span>
                    <span className="font-medium">{t}</span>
                  </li>
                ))}
              </ul>
              <a href="/#waitlist" className="bg-primary-container text-on-primary-container px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all w-fit mt-4 no-underline">
                Join the Waitlist
              </a>
            </div>
            <div className="w-full md:w-1/2">
              <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-orange-100 via-white to-blue-100 flex items-center justify-center border-4 border-white shadow-xl">
                <div className="text-center px-8">
                  <span className="material-symbols-rounded text-[80px] text-[#FF8C00]">trending_up</span>
                  <p className="text-2xl font-semibold text-slate-900 mt-4">Track every word</p>
                  <p className="text-slate-600 mt-2">From rank #1 to #1500</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
