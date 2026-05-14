'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import WaitlistForm from '@/components/WaitlistForm'
import { WORDS, MILESTONES, MILESTONE_TEXT, TYPE_LABEL } from '@/data/words'

const FILTERS = [
  { key: 'all',  label: 'All' },
  { key: 'verb', label: 'Verbs' },
  { key: 'noun', label: 'Nouns' },
  { key: 'adj',  label: 'Adjectives' },
  { key: 'adv',  label: 'Adverbs' },
  { key: 'other',label: 'Other' },
]
const OTHER_TYPES = new Set(['prep', 'conj', 'art', 'pron', 'det', 'num', 'other'])

const TYPE_COLOR = {
  verb:  { bg: '#EDE8FB', color: 'var(--synapse)' },
  noun:  { bg: '#E1F5EE', color: 'var(--signal)' },
  adj:   { bg: '#F4D8E8', color: '#A03060' },
  adv:   { bg: '#FEF3C7', color: '#92400E' },
  prep:  { bg: 'var(--fog)', color: 'var(--synapse)' },
  conj:  { bg: 'var(--fog)', color: 'var(--synapse)' },
  art:   { bg: 'var(--cream-dark)', color: 'var(--cortex)' },
  pron:  { bg: 'var(--cream-dark)', color: 'var(--cortex)' },
  det:   { bg: 'var(--cream-dark)', color: 'var(--cortex)' },
  num:   { bg: 'var(--cream-dark)', color: 'var(--cortex)' },
  other: { bg: 'var(--cream-dark)', color: 'var(--cortex)' },
}

function getLearned() {
  try { return new Set(JSON.parse(localStorage.getItem('usf_learned') || '[]')) }
  catch { return new Set() }
}

export default function WordsPageClient() {
  const [learned, setLearned]     = useState(getLearned)
  const [filter, setFilter]       = useState('all')
  const [query, setQuery]         = useState('')
  const [hideTrans, setHideTrans] = useState(false)
  const [expanded, setExpanded]   = useState(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return WORDS.filter((w) => {
      const matchSearch = !q || w.word.toLowerCase().includes(q) || w.translation.toLowerCase().includes(q)
      let matchFilter = true
      if (filter === 'other') matchFilter = OTHER_TYPES.has(w.type)
      else if (filter !== 'all') matchFilter = w.type === filter
      return matchSearch && matchFilter
    })
  }, [filter, query])

  const showAll      = filter === 'all' && !query
  const learnedCount = learned.size
  const coverage     = Math.min(80, Math.round((learnedCount / 1500) * 80))

  function toggleLearned(rank) {
    setLearned((prev) => {
      const next = new Set(prev)
      if (next.has(rank)) next.delete(rank); else next.add(rank)
      localStorage.setItem('usf_learned', JSON.stringify([...next]))
      return next
    })
  }

  function toggleExpanded(rank) {
    setExpanded(prev => prev === rank ? null : rank)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: '1500 Most Common Spanish Words — Frequency List with Translations',
        description: 'The 1,500 most common Spanish words ranked by real-world frequency. Includes translations, example sentences, and comprehension milestones.',
        image: 'https://mostcommonspanish.com/og-default.svg',
        author: { '@type': 'Person', name: 'Johannes Schmid', url: 'https://mostcommonspanish.com/about' },
        publisher: { '@type': 'Organization', name: 'Neuro', logo: { '@type': 'ImageObject', url: 'https://mostcommonspanish.com/icon.svg' } },
        datePublished: '2026-01-01',
        dateModified: '2026-05-14',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mostcommonspanish.com/' },
          { '@type': 'ListItem', position: 2, name: 'Words', item: 'https://mostcommonspanish.com/words/' },
          { '@type': 'ListItem', position: 3, name: '1500 Most Common Spanish Words', item: 'https://mostcommonspanish.com/words/most-common-spanish-words' },
        ],
      },
    ],
  }

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '120px 56px 80px' }}>

        {/* Header + inline CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '32px', marginBottom: '48px', flexWrap: 'wrap' }}>
          <div>
            <div className="s-eye">Frequency list</div>
            <h1 style={{
              fontFamily: "'Fraunces', serif", fontWeight: 900,
              fontSize: 'clamp(40px, 5vw, 62px)', letterSpacing: '-2px',
              lineHeight: 1.0, color: 'var(--deep-mind)', marginBottom: '16px',
            }}>
              1,500 most common<br />Spanish words.
            </h1>
            <p style={{ fontSize: '17px', fontWeight: 300, color: 'var(--cortex)', maxWidth: '520px', lineHeight: 1.7 }}>
              Ranked by real-world usage. Learn these and you'll understand ~80% of everyday spoken Spanish.
              Click any word to see example sentences.
            </p>
          </div>

          {/* Top CTA card */}
          <div style={{
            background: 'var(--deep-mind)', borderRadius: '16px',
            padding: '24px 28px', flexShrink: 0, maxWidth: '300px',
            border: '0.5px solid rgba(83,74,183,0.3)',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mauve)', marginBottom: '8px' }}>
              Free — 500 words
            </div>
            <div style={{
              fontFamily: "'Fraunces', serif", fontWeight: 900,
              fontSize: '20px', letterSpacing: '-0.5px', lineHeight: 1.15,
              color: 'var(--white-matter)', marginBottom: '6px',
            }}>
              Learn them with spaced repetition.
            </div>
            <p style={{ fontSize: '13px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.6, marginBottom: '16px' }}>
              No card required. No gamification.
            </p>
            <WaitlistForm label="Start free →" />
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '32px' }}>
          <StatCard label="Words learned" value={learnedCount.toLocaleString()} color="var(--deep-mind)" />
          <StatCard label="Comprehension" value={`~${coverage}%`} color="var(--synapse)" sub="of spoken Spanish" />
          <StatCard label="Words on this list" value={WORDS.length.toLocaleString()} color="var(--deep-mind)" />
        </div>

        {/* Controls */}
        <div style={{
          background: 'var(--white-matter)', borderRadius: '16px',
          border: '0.5px solid rgba(28,26,58,0.09)',
          padding: '20px 24px', marginBottom: '16px',
          display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <span style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--cortex)', fontSize: '16px', pointerEvents: 'none',
              }}>🔍</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Spanish or English…"
                style={{
                  width: '100%', paddingLeft: '40px', paddingRight: '16px',
                  height: '44px', borderRadius: '10px',
                  border: '1.5px solid rgba(28,26,58,0.12)',
                  background: 'var(--cream)', color: 'var(--deep-mind)',
                  fontSize: '15px', fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontWeight: 300, outline: 'none', transition: 'border-color .15s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--synapse)'}
                onBlur={e => e.target.style.borderColor = 'rgba(28,26,58,0.12)'}
              />
            </div>
            <button
              onClick={() => setHideTrans(v => !v)}
              style={{
                height: '44px', padding: '0 20px', borderRadius: '10px',
                border: hideTrans ? '1.5px solid var(--synapse)' : '1.5px solid rgba(28,26,58,0.12)',
                background: hideTrans ? 'var(--fog)' : 'var(--cream)',
                color: hideTrans ? 'var(--synapse)' : 'var(--cortex)',
                fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                fontFamily: "'Cabinet Grotesk', sans-serif",
                transition: 'all .15s', whiteSpace: 'nowrap',
              }}
            >
              {hideTrans ? 'Show translations' : 'Hide & test yourself'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: '6px 16px', borderRadius: '99px',
                  border: filter === f.key ? 'none' : '0.5px solid rgba(28,26,58,0.12)',
                  background: filter === f.key ? 'var(--deep-mind)' : 'transparent',
                  color: filter === f.key ? 'var(--white-matter)' : 'var(--cortex)',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  transition: 'all .15s',
                }}
              >
                {f.label}
              </button>
            ))}
            <span style={{ fontSize: '13px', color: 'var(--cortex)', marginLeft: 'auto', alignSelf: 'center' }}>
              {filtered.length.toLocaleString()} words
            </span>
          </div>
        </div>

        {/* Word table */}
        <div style={{
          background: 'var(--white-matter)', borderRadius: '16px',
          border: '0.5px solid rgba(28,26,58,0.09)', overflow: 'hidden',
          marginBottom: '48px',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--cream-dark)', borderBottom: '1px solid rgba(28,26,58,0.08)' }}>
                  {['#', 'Spanish', 'English', 'Type', ''].map((h, i) => (
                    <th key={i} style={{
                      padding: '10px 16px', fontSize: '11px', fontWeight: 500,
                      letterSpacing: '.08em', textTransform: 'uppercase',
                      color: 'var(--cortex)',
                      width: i === 0 ? '60px' : i === 3 ? '130px' : i === 4 ? '48px' : undefined,
                      textAlign: i === 4 ? 'right' : 'left',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((w, idx) => {
                  const isLearned  = learned.has(w.rank)
                  const isExpanded = expanded === w.rank
                  const milestone  = showAll && MILESTONES[w.rank - 1]
                  const tc         = TYPE_COLOR[w.type] || TYPE_COLOR.other

                  return (
                    <Fragment key={w.rank}>
                      {milestone && (
                        <tr>
                          <td colSpan={5} style={{
                            padding: '10px 16px', fontSize: '13px', fontWeight: 500,
                            background: 'linear-gradient(90deg, var(--fog) 0%, var(--cream) 100%)',
                            borderTop: '2px solid var(--synapse)',
                            borderBottom: '1px solid rgba(83,74,183,0.15)',
                            color: 'var(--synapse)',
                          }}>
                            🎯 {MILESTONE_TEXT[w.rank - 1]}
                          </td>
                        </tr>
                      )}

                      {/* Main word row */}
                      <tr
                        onClick={() => toggleExpanded(w.rank)}
                        style={{
                          borderTop: '0.5px solid rgba(28,26,58,0.06)',
                          opacity: isLearned ? 0.4 : 1,
                          cursor: 'pointer',
                          transition: 'background .1s, opacity .15s',
                          background: isExpanded ? 'var(--fog)' : 'transparent',
                        }}
                        onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = 'var(--cream)' }}
                        onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = 'transparent' }}
                      >
                        <td style={{ padding: '13px 16px', fontSize: '13px', color: 'var(--cortex)', fontVariantNumeric: 'tabular-nums' }}>
                          {w.rank}
                        </td>
                        <td style={{
                          padding: '13px 16px', fontWeight: 600, color: 'var(--deep-mind)', fontSize: '16px',
                          fontFamily: "'Cabinet Grotesk', sans-serif",
                          textDecoration: isLearned ? 'line-through' : 'none',
                        }}>
                          {w.word}
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: '14px', fontWeight: 300 }}>
                          <span style={{
                            color: hideTrans ? 'transparent' : 'var(--cortex)',
                            background: hideTrans ? 'rgba(83,74,183,0.1)' : 'transparent',
                            borderRadius: hideTrans ? '4px' : '0',
                            padding: hideTrans ? '2px 8px' : '0',
                            cursor: hideTrans ? 'pointer' : 'default',
                            userSelect: hideTrans ? 'none' : 'auto',
                            transition: 'color .1s',
                          }}
                            onMouseEnter={e => { if (hideTrans) e.currentTarget.style.color = 'var(--cortex)' }}
                            onMouseLeave={e => { if (hideTrans) e.currentTarget.style.color = 'transparent' }}
                          >
                            {w.meanings.length > 1 ? w.meanings.join(' · ') : w.translation}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{
                            display: 'inline-block', padding: '3px 10px', borderRadius: '99px',
                            fontSize: '11px', fontWeight: 500,
                            background: tc.bg, color: tc.color,
                          }}>
                            {TYPE_LABEL[w.type] || w.type}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleLearned(w.rank) }}
                            aria-label={isLearned ? 'Mark as not learned' : 'Mark as learned'}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                              color: isLearned ? 'var(--signal)' : 'rgba(28,26,58,0.2)',
                              fontSize: '16px', lineHeight: 1, transition: 'color .15s',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                            onMouseEnter={e => { if (!learned.has(w.rank)) e.currentTarget.style.color = 'var(--signal)' }}
                            onMouseLeave={e => { if (!learned.has(w.rank)) e.currentTarget.style.color = 'rgba(28,26,58,0.2)' }}
                          >
                            {isLearned ? '✓' : '○'}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded example row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} style={{
                            padding: '0 16px 16px 60px',
                            background: 'var(--fog)',
                            borderBottom: '0.5px solid rgba(83,74,183,0.15)',
                          }}>
                            {w.example_es && (
                              <div style={{
                                borderLeft: '2px solid var(--synapse)',
                                paddingLeft: '14px',
                              }}>
                                <div style={{ fontSize: '15px', fontWeight: 400, color: 'var(--deep-mind)', marginBottom: '4px' }}>
                                  {w.example_es}
                                </div>
                                <div style={{ fontSize: '13px', fontWeight: 300, color: 'var(--cortex)' }}>
                                  {w.example_en}
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}

                        </Fragment>
                  )
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--cortex)', fontSize: '15px' }}>
                      No words match.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          background: 'var(--deep-mind)', borderRadius: '20px',
          padding: '56px 64px', marginBottom: '64px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '48px', flexWrap: 'wrap', marginBottom: '36px' }}>
            <div>
              <div className="s-eye" style={{ color: 'var(--mauve)' }}>Stop collecting streaks</div>
              <h2 style={{
                fontFamily: "'Fraunces', serif", fontWeight: 900,
                fontSize: 'clamp(28px, 3.5vw, 40px)', letterSpacing: '-1px', lineHeight: 1.05,
                color: 'var(--white-matter)', marginBottom: '12px',
              }}>
                Start collecting words<br />that actually stick.
              </h2>
              <p style={{ fontSize: '15px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.65, maxWidth: '400px' }}>
                Free for your first 500 words. Spaced repetition built in. No badges, no nonsense — just the words you need to understand real Spanish.
              </p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: '14px',
              border: '0.5px solid rgba(255,255,255,0.07)',
              padding: '28px 32px', minWidth: '220px', flexShrink: 0,
            }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: '48px', letterSpacing: '-1.5px', lineHeight: 1, color: 'var(--mauve)', marginBottom: '4px' }}>€0</div>
              <div style={{ fontSize: '13px', fontWeight: 300, color: 'var(--cortex)', marginBottom: '4px' }}>500 words, forever free</div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--signal)', marginBottom: '20px' }}>Full deck from €29/year</div>
              <Link href="/level-test" style={{ fontSize: '13px', color: 'rgba(123,127,168,0.7)', textDecoration: 'none', display: 'block', marginBottom: '12px' }}>
                → Test your level first
              </Link>
            </div>
          </div>
          <WaitlistForm label="Get early access — free" />
        </div>

        {/* FAQ */}
        <section>
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 900,
            fontSize: '32px', letterSpacing: '-1px', lineHeight: 1.1,
            color: 'var(--deep-mind)', marginBottom: '24px',
          }}>FAQ</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Faq q="How many Spanish words do I need to be conversational?" a="Around 1,000 of the most frequent words covers ~74% of everyday spoken Spanish. With 1,500 you reach roughly 80% — enough to follow most conversations and shows without constant guessing." />
            <Faq q="Where does this frequency list come from?" a="The list is compiled from large Spanish-language corpora — primarily TV/film subtitles and spoken-language sources — to reflect what real speakers actually say, not what textbooks teach." />
            <Faq q="Is this list free?" a="Yes — the full 1,500-word list is free to read, search, filter, and mark as learned. No signup required. The free app account gives you spaced repetition on the top 500 words." />
            <Faq q="What's the difference between this and Duolingo?" a="Duolingo teaches words in a fixed lesson order, mixing useful and obscure vocabulary. This list is ranked purely by frequency, so every word you learn directly increases your real-world comprehension." />
            <Faq q="Why 1,500 words and not 1,000 or 2,000?" a="1,500 is the threshold where comprehension jumps from 'constantly guessing' to 'mostly following'. Below it you're swimming against the current. Above it, context-guessing kicks in and learning accelerates naturally." />
          </div>
        </section>

      </div>
    </div>
  )
}

function Fragment({ children }) { return <>{children}</> }

function StatCard({ label, value, color, sub }) {
  return (
    <div style={{
      background: 'var(--white-matter)', borderRadius: '16px',
      border: '0.5px solid rgba(28,26,58,0.09)', padding: '24px 28px',
    }}>
      <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--cortex)', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: '38px', letterSpacing: '-1px', lineHeight: 1, color, marginBottom: sub ? '4px' : 0 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '12px', fontWeight: 300, color: 'var(--cortex)' }}>{sub}</div>}
    </div>
  )
}

function Faq({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onClick={() => setOpen(v => !v)}
      style={{
        background: 'var(--white-matter)', borderRadius: '14px',
        border: open ? '0.5px solid rgba(83,74,183,0.3)' : '0.5px solid rgba(28,26,58,0.09)',
        padding: '20px 24px', cursor: 'pointer',
        transition: 'border-color .15s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--deep-mind)' }}>{q}</span>
        <span style={{
          color: 'var(--cortex)', fontSize: '16px', flexShrink: 0,
          transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none',
          display: 'inline-block',
        }}>↓</span>
      </div>
      {open && (
        <p style={{ fontSize: '14px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.7, marginTop: '12px' }}>{a}</p>
      )}
    </div>
  )
}
