import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { WORDS, MILESTONES, MILESTONE_TEXT, TYPE_LABEL } from '../data/words'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'verb', label: 'Verbs' },
  { key: 'noun', label: 'Nouns' },
  { key: 'adj', label: 'Adjectives' },
  { key: 'adv', label: 'Adverbs' },
  { key: 'other', label: 'Other' },
]
const OTHER_TYPES = new Set(['prep', 'conj', 'art', 'pron', 'det', 'num'])

function getLearned() {
  try { return new Set(JSON.parse(localStorage.getItem('usf_learned') || '[]')) }
  catch { return new Set() }
}

export default function WordsPage() {
  const [learned, setLearned] = useState(getLearned)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [hideTrans, setHideTrans] = useState(false)

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

  const showAll = filter === 'all' && !query
  const learnedCount = learned.size
  const coverage = Math.min(80, Math.round((learnedCount / 1500) * 80))

  function toggleLearned(rank) {
    setLearned((prev) => {
      const next = new Set(prev)
      if (next.has(rank)) next.delete(rank); else next.add(rank)
      localStorage.setItem('usf_learned', JSON.stringify([...next]))
      return next
    })
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: '1000 Most Common Spanish Words — Frequency List with Translations',
        description: 'The 1,000 most common Spanish words ranked by real-world frequency. Includes translations, parts of speech, and comprehension milestones.',
        image: 'https://mostcommonspanish.com/og-default.svg',
        author: {
          '@type': 'Person',
          name: 'Johannes Schmid',
          url: 'https://mostcommonspanish.com/about',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Most Common Spanish',
          logo: { '@type': 'ImageObject', url: 'https://mostcommonspanish.com/icon.svg' },
        },
        datePublished: '2026-01-01',
        dateModified: '2026-05-07',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mostcommonspanish.com/' },
          { '@type': 'ListItem', position: 2, name: 'Words', item: 'https://mostcommonspanish.com/words/' },
          { '@type': 'ListItem', position: 3, name: '1000 Most Common Spanish Words', item: 'https://mostcommonspanish.com/words/most-common-spanish-words' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How many Spanish words do I need to be conversational?',
            acceptedAnswer: { '@type': 'Answer', text: 'Around 1,000 of the most frequent words covers ~74% of everyday spoken Spanish. With 1,500 you reach roughly 80% — enough to follow most conversations and shows.' },
          },
          {
            '@type': 'Question',
            name: 'Where does this frequency list come from?',
            acceptedAnswer: { '@type': 'Answer', text: 'The list is compiled from large Spanish-language corpora — primarily TV/film subtitles and spoken-language sources — to reflect what real speakers actually say.' },
          },
          {
            '@type': 'Question',
            name: 'Is this list free?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes — the full 1,000-word list is free to read, search, filter, and mark as learned. No signup required.' },
          },
        ],
      },
    ],
  }

  return (
    <div className={`bg-background text-on-surface ${hideTrans ? 'hide-trans' : ''}`}>
      <SEO
        title="1000 Most Common Spanish Words — Frequency List"
        description="The 1,000 most common Spanish words ranked by real-world frequency. Filter, search, and mark as learned."
        canonical="/words/most-common-spanish-words"
        type="article"
        jsonLd={jsonLd}
      />

      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-32 pb-16">
        {/* Hero */}
        <header className="mb-10">
          <p className="text-sm text-on-surface-variant mb-2">
            <Link to="/" className="hover:text-[#FF8C00]">Home</Link> <span className="mx-1">/</span> Words
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-on-surface tracking-tight mb-4">
            1,000 Most Common Spanish Words
          </h1>
          <p className="text-lg text-on-surface-variant max-w-3xl">
            Ranked by real-world frequency. Learn the top 1,000 and you'll understand ~74% of everyday spoken Spanish.
            Filter by part of speech, search, hide translations to test yourself, and mark words as learned.
          </p>
        </header>

        {/* Coverage banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-surface-variant rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1">Words learned</p>
            <p className="text-3xl font-semibold text-on-surface">{learnedCount.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-surface-variant rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1">Coverage</p>
            <p className="text-3xl font-semibold text-[#FF8C00]">~{coverage}%</p>
          </div>
          <div className="bg-white border border-surface-variant rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1">Words on this list</p>
            <p className="text-3xl font-semibold text-on-surface">{WORDS.length.toLocaleString()}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white border border-surface-variant rounded-2xl p-4 md:p-6 mb-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Spanish or English…"
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-surface-variant focus:border-[#FF8C00] outline-none"
              />
            </div>
            <button
              onClick={() => setHideTrans((v) => !v)}
              className={`px-5 py-3 rounded-full font-semibold transition-colors ${hideTrans ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-on-surface-variant'}`}
            >
              {hideTrans ? 'Show translations' : 'Hide translations'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`filter-chip px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === f.key ? 'active' : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-surface-variant rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 w-16">#</th>
                  <th className="px-4 py-3">Spanish</th>
                  <th className="px-4 py-3">English</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 w-24 text-right">Learned</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w) => {
                  const isLearned = learned.has(w.rank)
                  const milestone = showAll && MILESTONES[w.rank - 1]
                  return (
                    <FragmentRow key={w.rank}>
                      {milestone && (
                        <tr className="milestone-row">
                          <td colSpan={5} className="px-4 py-3 text-sm font-bold text-on-tertiary-container">
                            🎯 {MILESTONE_TEXT[w.rank - 1]}
                          </td>
                        </tr>
                      )}
                      <tr className={`word-row border-t border-surface-variant ${isLearned ? 'row-learned' : ''}`}>
                        <td className="px-4 py-3 text-sm text-on-surface-variant font-mono">{w.rank}</td>
                        <td className="px-4 py-3 cell-word font-semibold text-on-surface">{w.word}</td>
                        <td className="px-4 py-3 cell-translation text-on-surface-variant">{w.translation}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold badge-${w.type}`}>
                            {TYPE_LABEL[w.type] || w.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => toggleLearned(w.rank)}
                            aria-label={isLearned ? 'Mark as not learned' : 'Mark as learned'}
                            className={`material-symbols-rounded ${isLearned ? 'text-[#FF8C00]' : 'text-surface-variant hover:text-[#FF8C00]'} transition-colors`}
                            style={isLearned ? { fontVariationSettings: "'FILL' 1" } : undefined}
                          >
                            check_circle
                          </button>
                        </td>
                      </tr>
                    </FragmentRow>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-on-surface-variant">No words match.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <section className="mt-12 bg-secondary-container rounded-[2rem] p-10 text-center">
          <h2 className="text-3xl font-semibold text-on-secondary-container mb-3 tracking-tight">Want to know what % you actually know?</h2>
          <p className="text-on-secondary-container/80 mb-6 max-w-xl mx-auto">Take the 2-minute Word Reach test to find out.</p>
          <Link to="/level-test" className="inline-block bg-primary-container text-on-primary-container px-10 py-4 rounded-full font-semibold shadow-lg hover:scale-[1.02] transition-all no-underline">
            Test Your Level
          </Link>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-3xl font-semibold mb-6 tracking-tight">FAQ</h2>
          <div className="space-y-4">
            <Faq q="How many Spanish words do I need to be conversational?" a="Around 1,000 of the most frequent words covers ~74% of everyday spoken Spanish. With 1,500 you reach roughly 80% — enough to follow most conversations and shows." />
            <Faq q="Where does this frequency list come from?" a="The list is compiled from large Spanish-language corpora — primarily TV/film subtitles and spoken-language sources — to reflect what real speakers actually say." />
            <Faq q="Is this list free?" a="Yes — the full 1,000-word list is free to read, search, filter, and mark as learned. No signup required." />
            <Faq q="What's the difference between this and Duolingo?" a="Duolingo teaches words in a fixed lesson order, mixing useful and obscure vocabulary. This list is ranked purely by frequency, so every word you learn pulls real-world comprehension up." />
          </div>
        </section>
      </main>
    </div>
  )
}

function FragmentRow({ children }) { return <>{children}</> }

function Faq({ q, a }) {
  return (
    <details className="bg-white border border-surface-variant rounded-2xl p-6 group">
      <summary className="cursor-pointer font-semibold text-on-surface flex justify-between items-center">
        {q}
        <span className="material-symbols-rounded transition-transform group-open:rotate-180">expand_more</span>
      </summary>
      <p className="mt-3 text-on-surface-variant leading-relaxed">{a}</p>
    </details>
  )
}
