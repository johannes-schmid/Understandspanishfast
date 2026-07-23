import Link from 'next/link'
import PdfDownloadForm from '@/components/PdfDownloadForm'

const BASE = 'https://mostcommonspanish.com'
const URL = `${BASE}/words`

export const metadata = {
  title: 'Spanish Vocabulary — Frequency-Ranked Word Lists',
  description: 'Learn Spanish vocabulary the efficient way: word lists ranked by real-world frequency. Top 100, top 500, the 1,000 most common words, and the most common verbs — with coverage stats and examples.',
  alternates: { canonical: URL },
  openGraph: { type: 'website' },
}

const CARDS = [
  { href: '/words/most-common-spanish-words', title: '1,000 most common Spanish words', coverage: '~74–80% coverage', desc: 'The flagship interactive frequency list. Search, filter, hide translations, and mark words as learned.' },
  { href: '/words/top-100-spanish-words', title: 'Top 100 Spanish words', coverage: '~50% coverage', desc: 'The single highest-value place to start — 100 words that make up half of everyday speech.' },
  { href: '/words/top-500-spanish-words', title: 'Top 500 Spanish words', coverage: '~67% coverage', desc: 'Two of every three words in conversation. The point where you stop feeling lost.' },
  { href: '/words/most-common-spanish-verbs', title: 'Most common Spanish verbs', coverage: 'Top 150 verbs', desc: 'The verbs that carry the action of most sentences — ser, estar, tener, hacer, ir and more.' },
  { href: '/words/spanish-frequency-list', title: 'Spanish frequency list & method', coverage: 'How the data works', desc: 'The corpus behind the ranking and exactly how word counts map to comprehension.' },
]

const FAQS = [
  { q: 'What is the most efficient way to learn Spanish vocabulary?', a: 'Learn words in frequency order — most common first. Because a small set of words makes up most of everyday speech, learning by frequency means every word you study is one you will actually hear. The top 1,000 words alone cover about 74% of spoken Spanish.' },
  { q: 'How many Spanish words should I learn?', a: 'Aim for the 1,500 most common words. That covers roughly 80% of everyday spoken Spanish — the threshold where conversations and shows become followable. The first 500 already get you to about 67%.' },
  { q: 'Are these vocabulary lists free?', a: 'Yes. Every list here is free to read, search, and use, with translations and example sentences. A free account adds spaced-repetition practice on the top 500 words.' },
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
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '120px 40px 80px' }}>
        <nav style={{ fontSize: '13px', color: 'var(--cortex)', marginBottom: '28px' }}>
          <Link href="/" style={{ color: 'var(--cortex)' }}>Home</Link>{' / '}
          <span style={{ color: 'var(--deep-mind)' }}>Spanish Words</span>
        </nav>

        <div className="s-eye">Spanish vocabulary</div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: 'clamp(38px, 5vw, 58px)', letterSpacing: '-2px', lineHeight: 1.02, color: 'var(--deep-mind)', marginBottom: '20px' }}>
          Learn Spanish vocabulary<br />in the right order.
        </h1>
        <p style={{ fontSize: '18px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.7, maxWidth: '620px', marginBottom: '44px' }}>
          Every list here is ranked by how often words actually appear in spoken Spanish — the most
          efficient possible order to learn. Start at the top and your comprehension rises as fast as
          it can per word learned.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginBottom: '56px' }}>
          {CARDS.map((c) => (
            <Link key={c.href} href={c.href} style={{
              display: 'block', textDecoration: 'none',
              background: 'var(--white-matter)', borderRadius: '16px',
              border: '0.5px solid rgba(28,26,58,0.09)', padding: '26px 28px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--synapse)', marginBottom: '10px' }}>{c.coverage}</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px', color: 'var(--deep-mind)', marginBottom: '10px', lineHeight: 1.2 }}>{c.title}</div>
              <p style={{ fontSize: '14px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.6 }}>{c.desc}</p>
            </Link>
          ))}
        </div>

        <div style={{ maxWidth: '520px', marginBottom: '56px' }}>
          <PdfDownloadForm source="words-hub" />
        </div>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: '32px', letterSpacing: '-1px', lineHeight: 1.1, color: 'var(--deep-mind)', marginBottom: '20px' }}>
            Frequently asked questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {FAQS.map((f) => (
              <div key={f.q} style={{ background: 'var(--white-matter)', borderRadius: '14px', border: '0.5px solid rgba(28,26,58,0.09)', padding: '22px 26px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--deep-mind)', marginBottom: '10px' }}>{f.q}</h3>
                <p style={{ fontSize: '15px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.7 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
