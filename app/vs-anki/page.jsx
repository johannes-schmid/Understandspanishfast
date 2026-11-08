import Link from 'next/link'

export const metadata = {
  title: 'Anki Alternative for Spanish — Frequency-Ranked, No Setup',
  description: 'A better way to learn Spanish than Anki. Frequency-ranked vocabulary, spaced repetition built in, and real comprehension tracking. No deck building. Start in 10 seconds.',
  alternates: { canonical: 'https://mostcommonspanish.com/vs-anki' },
  openGraph: { url: 'https://mostcommonspanish.com/vs-anki' },
}

const FAQ = [
  {
    q: 'Is this better than Anki for learning Spanish?',
    a: 'For Spanish vocabulary specifically, yes. Anki is a general-purpose flashcard tool: you find or build your own deck, decide the order, and track your own progress. The Top 1,500 workbook is built for one job. The words are already ranked by real-world frequency, the review schedule is part of the method, and you always know how much everyday Spanish your words cover.',
  },
  {
    q: 'Do I need to build decks like in Anki?',
    a: 'No. The list is already built: the 1,500 most frequent Spanish words, ranked by how often they appear in real spoken Spanish, each with an example sentence. You start at word #1 and work forward in 30 units of 50.',
  },
  {
    q: 'Does this use spaced repetition like Anki?',
    a: 'Yes, on paper. Every unit runs through four passes (read, recall, use, review), and each unit comes back for a check on day 3 and day 7. A review test every 250 words catches anything that slipped. There is nothing to configure.',
  },
  {
    q: 'Can I import my existing Anki progress?',
    a: 'No. The workbook starts at the most frequent word and moves down the list. If you have already used Anki for Spanish, the early units will feel like review. Take the unit tests and skip ahead once you pass them.',
  },
  {
    q: 'What does the comprehension percentage mean?',
    a: 'It estimates how much of everyday spoken Spanish is made up of the words you know. The top 100 words cover around 50% of everyday speech. At 1,500 words you are at roughly 80%. The numbers come from lexical frequency corpus research.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is this better than Anki for learning Spanish?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: FAQ[0].a,
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to build decks like in Anki?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: FAQ[1].a,
      },
    },
    {
      '@type': 'Question',
      name: 'Does this use spaced repetition like Anki?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: FAQ[2].a,
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

const ROWS = [
  ['Spaced review', true, 'Day 3 + day 7'],
  ['Ready to use, no setup', false, true],
  ['Frequency-ranked vocabulary', false, true],
  ['Pre-built Spanish content', false, true],
  ['Shows your coverage of everyday Spanish', false, true],
  ['Knows what to teach next', false, true],
  ['Active recall in writing', false, true],
  ['Free to try', 'Desktop, Android', '10-card sample'],
]

export default function VsAnki() {
  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="ct-hero">
        <div className="wrap">
          <h1 className="h1">Anki for Spanish<br /><span className="soft">Without the setup</span></h1>
          <p className="lead">You know spaced repetition works. You&rsquo;ve tried Anki. But you spent more time managing decks than actually learning Spanish.</p>
          <p className="lead">The Top 1,500 workbook gives you what Anki gives you for Spanish, already done: the right words, in frequency order, with the review schedule built into the method.</p>
          <div className="cta-row">
            <Link className="btn btn-navy" href="/study">Start for free</Link>
            <Link className="btn btn-ghost" href="/workbook">Get the workbook</Link>
          </div>
          <ul className="proof">
            <li><span className="dot" />1,500 words ranked by frequency</li>
            <li><span className="dot" />Reviews on day 3 and day 7</li>
            <li><span className="dot" />€5 printable PDF</li>
          </ul>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>You didn&rsquo;t fail Anki<br />Anki failed you</h2>
            <p className="lead">Anki is a brilliant tool for people who already know how to learn. For Spanish specifically, it puts every hard decision on you.</p>
          </div>
          <div className="card ct-trio">
            {[
              { title: 'Deck building is a full-time job', body: 'You spent hours finding the "best" Spanish deck on AnkiWeb. Half the cards had typos. The other half taught you words you\'d never hear in a real conversation.' },
              { title: 'No order, no strategy', body: 'Most Anki decks are alphabetical or themed. You learned "aardvark" before "but." Frequency-ranked learning isn\'t the default. It has to be manually configured.' },
              { title: '500 reviews, no idea what you understand', body: 'Anki tells you how many cards you\'ve reviewed. It doesn\'t tell you what percentage of real Spanish you can now understand. Progress feels invisible.' },
            ].map(({ title, body }) => (
              <div key={title} className="ct-trio-item"><h3>{title}</h3><p>{body}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>Anki vs this</h2>
            <p className="lead">Same principle, spaced recall. The difference is everything you no longer have to decide yourself.</p>
          </div>
          <div className="card ct-table-card">
            <table className="ct-table ct-compare">
              <thead><tr><th scope="col">Feature</th><th scope="col">Anki</th><th scope="col" className="ct-us">Top 1,500 workbook</th></tr></thead>
              <tbody>
                {ROWS.map(([feature, anki, us]) => (
                  <tr key={feature}><td>{feature}</td><td><Mark v={anki} /></td><td className="ct-us"><Mark v={us} /></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>The three things Anki never solved</h2>
          </div>
          <div className="ct-feats">
            {[
              { t: 'No setup', s: 'Open it and start', b: 'No deck importing, no settings, no deciding what to study. The 1,500 most important Spanish words are already there, in the right order, with an example sentence for each.' },
              { t: 'Frequency-first', s: 'Every word earns its place', b: 'Words are ranked by how often they appear in real spoken Spanish, not alphabetically and not by theme. Word #1 is more useful than word #2. No Anki deck guarantees that.' },
              { t: 'Real progress', s: 'Not reviews, coverage', b: 'Progress is measured in coverage of everyday Spanish, not card counts. The first 100 words get you to about half. The full 1,500 get you to about 80%.' },
            ].map(({ t, s, b }) => (
              <div key={t} className="card ct-feat"><h3>{t}</h3><p className="ct-feat-sub">{s}</p><p>{b}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>Same method as Anki<br />Done right for Spanish</h2>
            <p className="lead">Spaced recall works. We didn&rsquo;t reinvent it. We removed everything you had to do yourself in Anki.</p>
          </div>
          <div className="method ct-steps">
            {[
              { n: 'PASS 1', t: 'Read', b: 'Word, meaning and a real sentence. Say it out loud.' },
              { n: 'PASS 2', t: 'Recall', b: 'Fold the page and write the meaning from memory, same as flipping an Anki card.' },
              { n: 'PASS 3', t: 'Use', b: 'Fill the gap in a fresh sentence so the word sticks in context.' },
              { n: 'PASS 4', t: 'Review', b: 'Check the unit again on day 3 and day 7. 45 of 50 means it is mastered.' },
            ].map(({ n, t, b }) => (
              <div key={n} className="step"><span className="mono">{n}</span><b>{t}</b><p>{b}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head"><h2>FAQ</h2></div>
          <div className="faq">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="card faq-item"><h3>{q}</h3><p>{a}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="ct-end">
        <div className="wrap">
          <div className="panel close">
            <h2>Anki taught you the method<br /><span className="soft">This does the rest</span></h2>
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
