import Link from 'next/link'

const TITLE = 'A Frequency Dictionary of Spanish: Review and Alternative'
const DESC = 'A Frequency Dictionary of Spanish by Mark Davies, reviewed: who it suits, who it doesn’t, and when a 1,500-word workbook is the better buy.'

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: 'https://mostcommonspanish.com/frequency-dictionary-of-spanish' },
  openGraph: { title: TITLE, description: DESC, url: 'https://mostcommonspanish.com/frequency-dictionary-of-spanish', type: 'article', images: ['https://mostcommonspanish.com/og-default.png'] },
}

const FAQ = [
  {
    q: 'What is A Frequency Dictionary of Spanish?',
    a: 'A reference book by Mark Davies, published by Routledge, that lists the 5,000 most frequent Spanish words with frequency data and an example for each. The first edition (2006) was built from a 20-million-word corpus. The second edition (2018), co-written with Kathy Hayward Davies, uses a web corpus of over two billion words from 21 Spanish-speaking countries.',
  },
  {
    q: 'Is a frequency dictionary good for beginners?',
    a: 'It is good for knowing what to learn, less good for learning it. A dictionary gives you the list and the data, but no exercises, review schedule or audio. Beginners who need a method usually do better with a course or workbook built on the same frequency idea, then use the dictionary later as a reference.',
  },
  {
    q: 'Do I need 5,000 words?',
    a: 'Not to start. The first 1,500 words cover about 80% of everyday spoken Spanish, which is where conversations and slow TV start to make sense. Going from 1,500 to 5,000 words adds more coverage, but each extra word adds less than the ones before it.',
  },
  {
    q: 'How is the Top 1,500 workbook different?',
    a: 'It covers fewer words and turns them into a 14-week study plan: 30 units of 50 words, a fixed four-pass method, an exercise page per unit, review tests every 250 words and an answer key. It is a printable PDF for €5.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}

const ROWS = [
  ['Words covered', '5,000', '1,500'],
  ['Built from', 'Large research corpus', 'Frequency-ranked list'],
  ['Example sentence per word', 'Yes', 'Yes, with translation'],
  ['Exercises and tests', 'No', '30 exercise pages, 6 tests'],
  ['Study plan', 'No', '14 weeks, 20 minutes a day'],
  ['Thematic and grammar lists', 'Yes', 'No'],
  ['Format', 'Print book and ebook', 'Printable PDF'],
]

export default function FrequencyDictionary() {
  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="ct-hero">
        <div className="wrap">
          <h1 className="h1">A Frequency Dictionary of Spanish<br /><span className="soft">Review and an alternative</span></h1>
          <p className="lead">Mark Davies&rsquo; book is the standard reference for which Spanish words matter most. It is a brilliant list. It is not a study method.</p>
          <div className="cta-row">
            <Link className="btn btn-navy" href="/workbook">See the workbook</Link>
            <Link className="btn btn-ghost" href="/words/spanish-frequency-list">Browse the free list</Link>
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>What the dictionary gets right</h2>
            <p className="lead">Frequency is the most reliable way to decide what to learn first, and this book made that data available to learners.</p>
          </div>
          <div className="ct-feats">
            {[
              { t: 'Serious data', b: 'The second edition draws on a web corpus of more than two billion words from 21 Spanish-speaking countries, so the ranking reflects Spanish as a whole, not one region.' },
              { t: 'Depth', b: '5,000 words, each with frequency information and an example, plus thematic vocabulary lists.' },
              { t: 'A long-term reference', b: 'Once you are past the core vocabulary, it stays useful for checking how common a new word really is before you spend time on it.' },
            ].map(({ t, b }) => <div key={t} className="card ct-feat"><h3>{t}</h3><p>{b}</p></div>)}
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>Where learners get stuck</h2>
            <p className="lead">A ranked list tells you what to learn. It doesn&rsquo;t make you remember it. Most people who buy a frequency dictionary read the first pages, then stop, because there is no plan, no practice and no way to check progress.</p>
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>Dictionary vs workbook</h2>
            <p className="lead">They solve different problems. Pick by what you need right now.</p>
          </div>
          <div className="card ct-table-card">
            <table className="ct-table">
              <thead><tr><th scope="col"></th><th scope="col">A Frequency Dictionary of Spanish</th><th scope="col" className="ct-us">Top 1,500 workbook</th></tr></thead>
              <tbody>
                {ROWS.map(([k, a, b]) => <tr key={k}><td>{k}</td><td>{a}</td><td className="ct-us">{b}</td></tr>)}
              </tbody>
            </table>
          </div>
          <p className="ct-note">Choose the dictionary if you are past the basics, want 5,000 words of reference data, or study linguistics. Choose the workbook if you are a beginner and want a plan that gets the first 1,500 words to stick. Details of the dictionary come from <a href="https://www.routledge.com/A-Frequency-Dictionary-of-Spanish-Core-Vocabulary-for-Learners/Davies-Davies/p/book/9781138686540" target="_blank" rel="noopener noreferrer">the publisher</a> and the <a href="https://linguistlist.org/issues/17/1962/" target="_blank" rel="noopener noreferrer">LINGUIST List review</a> of the first edition.</p>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head"><h2>FAQ</h2></div>
          <div className="faq">
            {FAQ.map(({ q, a }) => <div key={q} className="card faq-item"><h3>{q}</h3><p>{a}</p></div>)}
          </div>
        </div>
      </section>

      <section className="ct-end">
        <div className="wrap">
          <div className="panel close">
            <h2>The first 1,500 words<br /><span className="soft">With a plan to learn them</span></h2>
            <div className="cta-row">
              <Link className="btn btn-navy" href="/workbook">See the workbook</Link>
              <Link className="btn btn-ghost" href="/study">Try 10 words free</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
