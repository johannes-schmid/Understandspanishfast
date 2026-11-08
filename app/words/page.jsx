import Link from 'next/link'
import { Arrow, CoverageBars, Crumbs, Offline, FaqSection, Closing } from '@/components/WordListPage'

const BASE = 'https://mostcommonspanish.com'
const URL = `${BASE}/words`

export const metadata = {
  title: 'Spanish Vocabulary — Frequency-Ranked Word Lists',
  description: 'Learn Spanish vocabulary the efficient way: word lists ranked by real-world frequency. Top 100, top 500, the 1,000 most common words, and the most common verbs — with coverage stats and examples.',
  alternates: { canonical: URL },
  openGraph: { type: 'website' },
}

const CARDS = [
  { href: '/words/most-common-spanish-words', title: '1,000 most common Spanish words', coverage: '~74–80% COVERAGE', desc: 'The full interactive frequency list. Search, filter by word type, hide the English to test yourself, and mark words as learned.' },
  { href: '/words/top-100-spanish-words', title: 'Top 100 Spanish words', coverage: '~50% COVERAGE', desc: 'The highest-value place to start: 100 words that make up half of everyday speech.' },
  { href: '/words/top-500-spanish-words', title: 'Top 500 Spanish words', coverage: '~67% COVERAGE', desc: 'Two of every three words in conversation. The point where you stop feeling lost.' },
  { href: '/words/most-common-spanish-verbs', title: 'Most common Spanish verbs', coverage: 'TOP 150 VERBS', desc: 'The verbs that carry the action of most sentences — ser, estar, tener, hacer, ir and the rest.' },
  { href: '/words/spanish-frequency-list', title: 'Spanish frequency list and method', coverage: 'HOW THE DATA WORKS', desc: 'The corpus behind the ranking and exactly how word counts map to comprehension.' },
]

const FAQS = [
  { q: 'What is the most efficient way to learn Spanish vocabulary?', a: 'Learn words in frequency order — most common first. Because a small set of words makes up most of everyday speech, learning by frequency means every word you study is one you will actually hear. The top 1,000 words alone cover about 74% of spoken Spanish.' },
  { q: 'How many Spanish words should I learn?', a: 'Aim for the 1,500 most common words. That covers roughly 80% of everyday spoken Spanish — the threshold where conversations and shows become followable. The first 500 already get you to about 67%.' },
  { q: 'Are these vocabulary lists free?', a: 'Yes. Every list here is free to read, search and use, with translations and example sentences. You can also try the flashcards for free, or print all 1,500 words in the Top 1,500 workbook.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: 'Spanish Vocabulary — Frequency-Ranked Word Lists',
      description: 'Frequency-ranked Spanish vocabulary lists with coverage stats and example sentences.',
      url: URL,
      isPartOf: { '@type': 'WebSite', name: 'Most Common Spanish', url: BASE },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Spanish Words', item: URL },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
}

export default function Page() {
  const [main, ...rest] = CARDS
  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="wrap pg">
        <Crumbs items={[{ href: '/', label: 'Home' }, { label: 'Spanish Words' }]} />

        <div className="pg-head solo">
          <div>
            <h1 className="pg-h1">Learn Spanish vocabulary <span className="soft">in the right order</span></h1>
            <p className="lead">Every list here is ranked by how often words actually appear in spoken Spanish. Start at the top and your comprehension rises as fast as it can for every word you learn.</p>
            <div className="cta-row">
              <Link className="btn btn-navy" href="/study">Start for free <Arrow /></Link>
              <Link className="btn btn-ghost" href="/workbook">Get the workbook</Link>
            </div>
          </div>
        </div>

        <div className="hub">
          <Link href={main.href} className="card hub-card main">
            <div>
              <span className="chip tab">{main.coverage}</span>
              <h2>{main.title}</h2>
              <p>{main.desc}</p>
              <span className="link">Open the full list <Arrow /></span>
            </div>
            <CoverageBars level={1000} />
          </Link>
          {rest.map((c) => (
            <Link key={c.href} href={c.href} className="card hub-card">
              <div><span className="chip tab">{c.coverage}</span></div>
              <h2>{c.title}</h2>
              <p>{c.desc}</p>
              <span className="link">Open <Arrow /></span>
            </Link>
          ))}
        </div>

        <section className="sec-sm">
          <div className="sec-head">
            <h2>Take the list offline</h2>
            <p className="lead">Get the top 1,000 as a free PDF, or work through all 1,500 words on paper with the workbook.</p>
          </div>
          <Offline source="words-hub" />
        </section>

        <FaqSection faqs={FAQS} />

        <Closing title="Start with the 100 words that cover half of Spanish" />
      </div>
    </div>
  )
}
