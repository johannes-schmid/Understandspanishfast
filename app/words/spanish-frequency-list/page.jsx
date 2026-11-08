import Link from 'next/link'
import { Arrow, Crumbs, FaqSection, Closing } from '@/components/WordListPage'

const BASE = 'https://mostcommonspanish.com'
const URL = `${BASE}/words/spanish-frequency-list`

export const metadata = {
  title: 'Spanish Frequency List — How Word Frequency Maps to Comprehension',
  description: 'A Spanish word frequency list built from spoken-language corpora, and the method behind it: how many words you need for 50%, 67%, 74% and 80% comprehension of everyday Spanish.',
  alternates: { canonical: URL },
  openGraph: { type: 'article' },
}

const COVERAGE = [
  { words: 100, coverage: '~50%', w: 50, note: 'Function words + core verbs. Half of everything you hear.' },
  { words: 250, coverage: '~60%', w: 60, note: 'You start catching the gist of simple conversations.' },
  { words: 500, coverage: '~67%', w: 67, note: 'Two of every three words. Basic conversations become followable.' },
  { words: 750, coverage: '~72%', w: 72, note: 'Context-guessing kicks in for the words you don’t know.' },
  { words: 1000, coverage: '~74%', w: 74, note: 'You understand roughly three of every four words.' },
  { words: 1500, coverage: '~80%', w: 80, note: 'The comfort threshold: most conversation and shows are followable.' },
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

export default function Page() {
  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="wrap pg">
        <Crumbs items={[{ href: '/', label: 'Home' }, { href: '/words', label: 'Spanish Words' }, { label: 'Spanish Frequency List' }]} />

        <article className="prose">
          <h1 className="pg-h1">The Spanish frequency list <span className="soft">and how it maps to comprehension</span></h1>
          <p className="lead">
            A frequency list ranks words by how often they actually appear in real language. It’s the most
            efficient order to learn vocabulary in, because the words at the top are the ones you’ll
            meet again and again. Here’s the data behind our list, and exactly how many words you need
            to understand everyday Spanish.
          </p>

          <h2>How many words for how much comprehension</h2>
          <p>
            This is the core relationship every Spanish learner should know. Because a small number of words
            make up most of everyday speech, comprehension rises steeply at first, then levels off:
          </p>

          <div className="card dt">
            <table className="plain">
              <thead>
                <tr><th>Words learned</th><th>Spoken coverage</th><th>What it feels like</th></tr>
              </thead>
              <tbody>
                {COVERAGE.map((r) => (
                  <tr key={r.words}>
                    <td className="n tab">{r.words.toLocaleString('en')}</td>
                    <td className="c"><span className="cbar"><b className="tab">{r.coverage}</b><i style={{ width: `${r.w}px` }} aria-hidden="true" /></span></td>
                    <td className="f">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small">Coverage figures are for spoken and conversational Spanish and are approximate.</p>

          <h2>Where the ranking comes from</h2>
          <p>
            Our list is compiled from large corpora of <strong>spoken and conversational Spanish</strong>,
            primarily film and television subtitles, which linguists use as a proxy for everyday speech because
            they capture how people really talk. This matters: a frequency list built from newspapers or
            literature over-weights formal vocabulary you rarely hear in conversation.
          </p>
          <p>
            You’ll see other sites quote higher numbers, for example “the top 1,000 words cover 87% of
            Spanish.” Those figures usually come from <em>written</em> corpora, where a smaller core vocabulary
            is reused more heavily. Because our goal is real-world <em>listening</em> comprehension (conversations,
            podcasts, shows), we use the more conservative spoken-language figures: roughly 74% at 1,000 words
            and 80% at 1,500.
          </p>

          <h2>How to use it</h2>
          <p>
            Learn in frequency order, top to bottom, so every word you study is at least as useful as the next.
            Start with the <Link href="/words/top-100-spanish-words" className="tlink">top 100</Link> (about 50% coverage),
            continue through the <Link href="/words/top-500-spanish-words" className="tlink">top 500</Link> (~67%),
            and work toward the <Link href="/words/most-common-spanish-words" className="tlink">full 1,000+ list</Link>.
            Pay special attention to the <Link href="/words/most-common-spanish-verbs" className="tlink">most common verbs</Link>,
            which carry the meaning of most sentences. For the bigger picture on thresholds, see{' '}
            <Link href="/blog/how-many-spanish-words-to-be-fluent" className="tlink">how many Spanish words you need to be fluent</Link>.
          </p>
          <div className="cta-row">
            <Link className="btn btn-navy" href="/study">Start for free <Arrow /></Link>
            <Link className="btn btn-ghost" href="/workbook">Get the workbook</Link>
          </div>
        </article>

        <FaqSection faqs={FAQS} />

        <Closing title="Learn the list in frequency order" />
      </div>
    </div>
  )
}
