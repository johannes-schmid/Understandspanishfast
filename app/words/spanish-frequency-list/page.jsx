import Link from 'next/link'

const BASE = 'https://mostcommonspanish.com'
const URL = `${BASE}/words/spanish-frequency-list`

export const metadata = {
  title: 'Spanish Frequency List — How Word Frequency Maps to Comprehension',
  description: 'A Spanish word frequency list built from spoken-language corpora, and the method behind it: how many words you need for 50%, 67%, 74% and 80% comprehension of everyday Spanish.',
  alternates: { canonical: URL },
  openGraph: { type: 'article' },
}

const COVERAGE = [
  { words: 100, coverage: '~50%', note: 'Function words + core verbs. Half of everything you hear.' },
  { words: 250, coverage: '~60%', note: 'You start catching the gist of simple conversations.' },
  { words: 500, coverage: '~67%', note: 'Two of every three words. Basic conversations become followable.' },
  { words: 750, coverage: '~72%', note: 'Context-guessing kicks in for the words you don’t know.' },
  { words: 1000, coverage: '~74%', note: 'You understand roughly three of every four words.' },
  { words: 1500, coverage: '~80%', note: 'The comfort threshold: most conversation and shows are followable.' },
]

const FAQS = [
  { q: 'How many Spanish words do you need for 80% comprehension?', a: 'About 1,500 of the most frequent Spanish words cover roughly 80% of everyday spoken Spanish. The first 1,000 already reach about 74%; the jump from 74% to 80% is where following native-speed conversation and TV becomes comfortable rather than exhausting.' },
  { q: 'What corpus is this frequency list based on?', a: 'The ranking is compiled from large corpora of spoken and conversational Spanish — primarily film and television subtitles and other spoken-language sources — because those reflect how people actually talk, rather than formal written Spanish. Subtitle-based frequency data is the standard basis for real-world comprehension estimates.' },
  { q: 'Why do different sources give different coverage numbers?', a: 'Coverage depends on the corpus. Lists built from written text (news, literature) report higher coverage for the same word count because writing reuses a smaller core vocabulary. Spoken-language corpora — what this list uses — give slightly more conservative, and more realistic, numbers for understanding conversation, podcasts, and shows. That is why you’ll see figures like 87% quoted elsewhere for the top 1,000; our ~74% reflects spoken Spanish specifically.' },
  { q: 'Does knowing 80% of words mean understanding 80% of meaning?', a: 'Not exactly — but it is close enough to matter. At ~80% lexical coverage you know roughly four of every five words, and context fills in most of the rest, so overall understanding feels considerably higher than 80%. Below about 67% coverage, too many unknown words appear too close together for context to help.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Spanish Frequency List — How Word Frequency Maps to Comprehension',
      description: 'A Spanish word frequency list built from spoken-language corpora, and the method behind the comprehension coverage estimates.',
      image: `${BASE}/og-default.png`,
      author: { '@type': 'Person', name: 'Johannes Schmid', url: `${BASE}/about` },
      publisher: { '@type': 'Organization', name: 'Most Common Spanish', logo: { '@type': 'ImageObject', url: `${BASE}/icon.svg` } },
      datePublished: '2026-07-23',
      dateModified: '2026-07-23',
      mainEntityOfPage: URL,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Spanish Words', item: `${BASE}/words` },
        { '@type': 'ListItem', position: 3, name: 'Spanish Frequency List', item: URL },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
}

const H2 = { fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: 'clamp(26px, 3vw, 34px)', letterSpacing: '-1px', lineHeight: 1.1, color: 'var(--deep-mind)', margin: '48px 0 18px' }
const P = { fontSize: '17px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.75, marginBottom: '18px' }

export default function Page() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '120px 40px 80px' }}>
        <nav style={{ fontSize: '13px', color: 'var(--cortex)', marginBottom: '28px' }}>
          <Link href="/" style={{ color: 'var(--cortex)' }}>Home</Link>{' / '}
          <Link href="/words" style={{ color: 'var(--cortex)' }}>Spanish Words</Link>{' / '}
          <span style={{ color: 'var(--deep-mind)' }}>Spanish Frequency List</span>
        </nav>

        <div className="s-eye">Method &amp; sources</div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-2px', lineHeight: 1.02, color: 'var(--deep-mind)', marginBottom: '20px' }}>
          The Spanish frequency list, and how it maps to comprehension.
        </h1>
        <p style={{ ...P, fontSize: '19px' }}>
          A frequency list ranks words by how often they actually appear in real language. It's the most
          efficient possible order to learn vocabulary, because the words at the top are the ones you'll
          meet again and again. Here's the data behind our list — and exactly how many words you need
          to understand everyday Spanish.
        </p>

        <h2 style={H2}>How many words for how much comprehension</h2>
        <p style={P}>
          This is the core relationship every Spanish learner should know. Because a small number of words
          make up most of everyday speech, comprehension rises steeply at first, then levels off:
        </p>

        <div style={{ background: 'var(--white-matter)', borderRadius: '16px', border: '0.5px solid rgba(28,26,58,0.09)', overflow: 'hidden', marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--cream-dark)', borderBottom: '1px solid rgba(28,26,58,0.08)' }}>
                {['Words learned', 'Spoken coverage', 'What it feels like'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--cortex)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COVERAGE.map((r) => (
                <tr key={r.words} style={{ borderTop: '0.5px solid rgba(28,26,58,0.06)' }}>
                  <td style={{ padding: '13px 16px', fontWeight: 600, color: 'var(--deep-mind)', fontVariantNumeric: 'tabular-nums' }}>{r.words.toLocaleString()}</td>
                  <td style={{ padding: '13px 16px', fontWeight: 600, color: 'var(--synapse)' }}>{r.coverage}</td>
                  <td style={{ padding: '13px 16px', fontSize: '14px', fontWeight: 300, color: 'var(--cortex)' }}>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--cortex)', marginBottom: '18px' }}>
          Coverage figures are for spoken/conversational Spanish and are approximate.
        </p>

        <h2 style={H2}>Where the ranking comes from</h2>
        <p style={P}>
          Our list is compiled from large corpora of <strong>spoken and conversational Spanish</strong> —
          primarily film and television subtitles, which linguists use as a proxy for everyday speech because
          they capture how people really talk. This matters: a frequency list built from newspapers or
          literature over-weights formal vocabulary you rarely hear in conversation.
        </p>
        <p style={P}>
          You'll see other sites quote higher numbers — for example, "the top 1,000 words cover 87% of
          Spanish." Those figures usually come from <em>written</em> corpora, where a smaller core vocabulary
          is reused more heavily. Because our goal is real-world <em>listening</em> comprehension — conversations,
          podcasts, shows — we use the more conservative spoken-language figures: roughly 74% at 1,000 words
          and 80% at 1,500.
        </p>

        <h2 style={H2}>How to use it</h2>
        <p style={P}>
          Learn in frequency order, top to bottom, so every word you study is at least as useful as the next.
          Start with the <Link href="/words/top-100-spanish-words" style={{ color: 'var(--synapse)' }}>top 100</Link> (about 50% coverage),
          continue through the <Link href="/words/top-500-spanish-words" style={{ color: 'var(--synapse)' }}>top 500</Link> (~67%),
          and work toward the <Link href="/words/most-common-spanish-words" style={{ color: 'var(--synapse)' }}>full 1,000+ list</Link>.
          Pay special attention to the <Link href="/words/most-common-spanish-verbs" style={{ color: 'var(--synapse)' }}>most common verbs</Link>,
          which carry the meaning of most sentences. For the bigger picture on thresholds, see{' '}
          <Link href="/blog/how-many-spanish-words-to-be-fluent" style={{ color: 'var(--synapse)' }}>how many Spanish words you need to be fluent</Link>.
        </p>

        <h2 style={H2}>Frequently asked questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
          {FAQS.map((f) => (
            <div key={f.q} style={{ background: 'var(--white-matter)', borderRadius: '14px', border: '0.5px solid rgba(28,26,58,0.09)', padding: '22px 26px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--deep-mind)', marginBottom: '10px' }}>{f.q}</h3>
              <p style={{ fontSize: '15px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.7 }}>{f.a}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--deep-mind)', borderRadius: '20px', padding: '44px 40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: '30px', letterSpacing: '-1px', lineHeight: 1.1, color: 'var(--white-matter)', marginBottom: '12px' }}>
            See where you stand.
          </h2>
          <p style={{ fontSize: '15px', fontWeight: 300, color: 'var(--cortex)', marginBottom: '26px' }}>
            Take the 2-minute Word Reach test to find your current comprehension level.
          </p>
          <Link href="/level-test" className="btn-primary" style={{ textDecoration: 'none' }}>Take the level test</Link>
        </div>
      </div>
    </div>
  )
}
