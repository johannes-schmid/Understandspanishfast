import Link from 'next/link'

export const metadata = {
  title: 'Best Spanish Vocabulary App — Frequency-Ranked, Free to Start',
  description: 'The Spanish vocabulary app that teaches words by frequency order and tracks your comprehension %. Learn the 1,500 words that cover 80% of everyday Spanish.',
  alternates: { canonical: 'https://mostcommonspanish.com/spanish-vocabulary-app' },
  openGraph: {
    title: 'Best Spanish Vocabulary App — Frequency-Ranked, Free to Start',
    description: 'The Spanish vocabulary app that teaches words by frequency order and tracks your comprehension %. Learn the 1,500 words that cover 80% of everyday Spanish.',
    url: 'https://mostcommonspanish.com/spanish-vocabulary-app',
    type: 'website',
    images: [{ url: 'https://mostcommonspanish.com/og-default.png' }],
  },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Most Common Spanish',
  url: 'https://mostcommonspanish.com',
  description: 'Spanish vocabulary ranked by real-world frequency: free flashcards to start, and a printable workbook for the 1,500 most important Spanish words in the right order.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free 10-card flashcard sample. The Top 1,500 workbook (printable PDF) is €5.',
  },
  featureList: [
    'Frequency-ranked Spanish vocabulary',
    'Spaced review schedule built into the method',
    'Coverage milestones from 50% to 80% of everyday Spanish',
    'No setup or deck building required',
    '1,500+ high-frequency words',
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best Spanish vocabulary app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best Spanish vocabulary app for comprehension is one that teaches words by frequency order — starting with the most commonly used words first. Most Common Spanish pre-ranks 1,500 words by how often they appear in real spoken Spanish, so every minute of study gives you maximum return. Most popular apps like Duolingo teach by theme (food, travel, numbers), which is less efficient for building real comprehension quickly.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many Spanish vocabulary words do I need to learn?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Learning the 1,500 most frequent Spanish words gives you roughly 80% comprehension of everyday spoken Spanish. The top 100 words alone cover about 50% of all speech. This is why frequency order matters so much — the first 1,500 words are worth far more than the next 5,000.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a Spanish vocabulary app enough to become fluent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A vocabulary app is the foundation, not the whole picture. Vocabulary is the primary bottleneck for comprehension — once you have 1,500 high-frequency words, you can understand 80% of everyday Spanish and start consuming real content. Grammar, listening, and speaking practice build on that foundation. Most learners stall because they learn the wrong vocabulary in the wrong order, not because they lack grammar knowledge.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes a Spanish vocabulary app better than Duolingo or Babbel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Duolingo and Babbel organise vocabulary by theme (animals, colours, travel) rather than frequency. This feels intuitive but it is inefficient — you end up learning "the bear drinks milk" before you can say "I do not understand." A frequency-first app teaches the words that appear most in real Spanish first, so your comprehension grows faster per hour of study.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to learn Spanish vocabulary with an app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'At 15–30 minutes of daily study with spaced review, most learners reach 1,500 words — and 80% comprehension of everyday Spanish — in 6 to 9 months. The key variable is word order: learning frequency-ranked words means every session builds directly toward real comprehension, rather than filling gaps in themed topics.',
      },
    },
  ],
}

const Check = () => (
  <svg className="ct-yes" width="18" height="18" viewBox="0 0 18 18" fill="none" role="img" aria-label="Yes"><path d="M4 9.5l3.2 3L14 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
const Cross = () => (
  <svg className="ct-no" width="16" height="16" viewBox="0 0 16 16" fill="none" role="img" aria-label="No"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
)
const Mark = ({ v }) => (v === true ? <Check /> : v === false ? <Cross /> : <span className="ct-part">{v}</span>)

const COMPARISON = [
  ['Frequency-ranked vocabulary', false, false, false, true],
  ['Spaced review built in', false, 'Manual setup', 'Partial', true],
  ['Shows your coverage of everyday Spanish', false, false, false, true],
  ['No setup required', true, false, true, true],
  ['Free to start', true, true, false, true],
  ['Teaches most-used words first', false, false, false, true],
  ['Works on any device', true, true, true, true],
]

const FAQ = [
  {
    q: 'What is the best Spanish vocabulary app?',
    a: 'The best Spanish vocabulary app is one that teaches words in frequency order, starting with the most commonly used words first. Most Common Spanish ranks 1,500 words by how often they appear in real spoken Spanish. Try the first ten as free flashcards, then work through all 1,500 in the printable workbook, with a review schedule built in and coverage milestones so you always know where you stand.',
  },
  {
    q: 'How many Spanish words do I need to learn?',
    a: 'The top 1,500 most frequent Spanish words give you roughly 80% comprehension of everyday spoken Spanish. The first 100 words alone cover about 50% of all speech. Learning in frequency order means every word you add has a measurable impact on what you can understand.',
  },
  {
    q: 'Is this app better than Duolingo for vocabulary?',
    a: 'For vocabulary specifically, yes. Duolingo organises words by theme rather than frequency, which means you learn less-common words before mastering the high-frequency ones that appear in almost every sentence. Most Common Spanish teaches words in the order that builds real comprehension fastest.',
    link: { href: '/blog/best-spanish-learning-app', label: 'Read the full comparison of Spanish learning apps' },
  },
  {
    q: 'How is this different from Anki?',
    a: 'Anki is a powerful general-purpose flashcard tool, but you have to find or build your own Spanish deck, decide what order to learn words, and configure the spaced repetition settings yourself. Here the list is already built, the words are frequency-ranked, and the review schedule is part of the method. You start at word #1.',
    link: { href: '/vs-anki', label: 'See the Anki comparison' },
  },
  {
    q: 'How long does it take to reach 80% Spanish comprehension?',
    a: 'At 15–30 minutes of daily study with spaced review, most learners reach 1,500 words, and 80% comprehension of everyday Spanish, in 6 to 9 months. The exact timeline depends on consistency and prior language learning experience.',
  },
]

export default function SpanishVocabularyApp() {
  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="ct-hero">
        <div className="wrap">
          <h1 className="h1">The Spanish vocabulary app<br /><span className="soft">that actually builds comprehension</span></h1>
          <p className="lead">Most Spanish vocabulary apps teach words by theme. You learn &ldquo;the bear drinks milk&rdquo; before you can order a coffee. That is not an accident. It is a design flaw.</p>
          <p className="lead">Here every word is ranked by how often it appears in real spoken Spanish. Learn 1,500 words in frequency order and you will understand 80% of everyday Spanish. That is the whole system.</p>
          <div className="cta-row">
            <Link className="btn btn-navy" href="/study">Start for free</Link>
            <Link className="btn btn-ghost" href="/workbook">Get the workbook</Link>
          </div>
          <ul className="proof">
            <li><span className="dot" />10 free flashcards</li>
            <li><span className="dot" />1,500 words ranked by frequency</li>
            <li><span className="dot" /><Link className="ct-inline" href="/words/most-common-spanish-words">See the word list</Link></li>
          </ul>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>Why most Spanish apps leave you unable to understand anything</h2>
            <p className="lead">The top 100 Spanish words account for 50% of all spoken language. The top 1,500 cover 80%. Every Spanish vocabulary app teaches you words, but almost none of them teach you the <em>right</em> words first.</p>
          </div>
          <div className="card ct-trio">
            {[
              { title: 'Thematic order wastes your time', body: 'Duolingo, Babbel, and Rosetta Stone group words by topic: colours, animals, travel. The issue is that "purple" (rare) gets learned before "because" (one of the most common words in Spanish). Theme-first is intuitive. It is also slow.' },
              { title: 'You cannot understand real Spanish yet', body: 'After 6 months on Duolingo, most learners can pass their own lessons but cannot follow a real conversation. The gap is vocabulary coverage, specifically the 200–400 high-frequency words that appear in almost every sentence but that themed apps deprioritise.' },
              { title: 'No one tells you how far you are', body: 'Popular apps measure streaks, XP, and lessons completed. None of them tell you what percentage of real Spanish you can actually understand. Progress feels abstract because it is measured in the wrong units.' },
            ].map(({ title, body }) => (
              <div key={title} className="ct-trio-item"><h3>{title}</h3><p>{body}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>Spanish vocabulary apps compared</h2>
            <p className="lead">The difference that matters is not design or gamification. It is whether the app teaches words in the order that builds real comprehension fastest.</p>
          </div>
          <div className="card ct-table-card">
            <table className="ct-table ct-compare ct-compare-5">
              <thead>
                <tr><th scope="col">Feature</th><th scope="col">Duolingo</th><th scope="col">Anki</th><th scope="col">Babbel</th><th scope="col" className="ct-us">Most Common Spanish</th></tr>
              </thead>
              <tbody>
                {COMPARISON.map(([feature, ...vals]) => (
                  <tr key={feature}>
                    <td>{feature}</td>
                    {vals.map((v, j) => <td key={j} className={j === 3 ? 'ct-us' : undefined}><Mark v={v} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>Three things no other Spanish vocabulary app does</h2>
          </div>
          <div className="ct-feats">
            {[
              { t: 'Frequency-first', s: 'Word #1 is more useful than word #2, always', b: 'Every word is ranked by how often it appears in real spoken and written Spanish: corpus data, not editorial opinion. You learn the words that unlock the most comprehension first. No gaps, no skips, no "I know 500 words but cannot follow a conversation."' },
              { t: 'Spaced review', s: 'Built in, nothing to set up', b: 'Each unit of 50 words runs through read, recall, use and review, then comes back on day 3 and day 7. A review test every 250 words catches anything that slipped. Spaced repetition without the manual configuration of Anki.' },
              { t: 'Coverage, not streaks', s: 'A number that means something', b: 'Progress is measured in the share of everyday spoken Spanish your words cover, based on lexical frequency research. Learn 100 words and you are at around 50%. At 1,500 words you hit 80%. The goal is always visible.' },
            ].map(({ t, s, b }) => (
              <div key={t} className="card ct-feat"><h3>{t}</h3><p className="ct-feat-sub">{s}</p><p>{b}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>How the Spanish vocabulary app works</h2>
            <p className="lead">No setup. No deck building. Start with word #1, the most common Spanish word.</p>
          </div>
          <div className="method ct-steps">
            {[
              { n: 'STEP 1', t: 'Try ten free cards', b: 'The ten most common Spanish words as flashcards. Recall the meaning, then reveal it.' },
              { n: 'STEP 2', t: 'Get the workbook', b: 'All 1,500 words in frequency order, split into 30 units of 50, each with a real example sentence.' },
              { n: 'STEP 3', t: 'One unit every few days', b: 'Read, recall, use, review. Units come back on day 3 and day 7 so the words stay.' },
              { n: 'STEP 4', t: 'Watch your coverage climb', b: 'From about 50% of everyday Spanish at 100 words to about 80% at 1,500.' },
            ].map(({ n, t, b }) => (
              <div key={n} className="step"><span className="mono">{n}</span><b>{t}</b><p>{b}</p></div>
            ))}
          </div>
          <div className="card ct-note">
            <h3>The research behind it</h3>
            <p>
              The 80% comprehension threshold at 1,500 words is based on lexical frequency research, specifically Paul Nation&rsquo;s work on vocabulary coverage in natural language, which shows that the most frequent words in a language carry a disproportionate share of communicative load. You can read more in{' '}
              <Link href="/blog/how-many-spanish-words-to-be-fluent">how many Spanish words you need to be fluent</Link>{' '}and{' '}
              <Link href="/blog/how-to-build-spanish-vocabulary">how to build Spanish vocabulary fast</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head"><h2>FAQ</h2></div>
          <div className="faq">
            {FAQ.map(({ q, a, link }) => (
              <div key={q} className="card faq-item"><h3>{q}</h3><p>{a}{link && <> <Link href={link.href}>{link.label}</Link>.</>}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="ct-end">
        <div className="wrap">
          <div className="panel close">
            <div>
              <h2>1,500 words<br /><span className="soft">80% of everyday Spanish</span></h2>
              <p className="lead">Spanish vocabulary in the order that actually builds comprehension. Start with ten free flashcards, then get all 1,500 in the workbook.</p>
            </div>
            <div className="cta-row">
              <Link className="btn btn-navy" href="/study">Start for free</Link>
              <Link className="btn btn-ghost" href="/workbook">Get the workbook</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
