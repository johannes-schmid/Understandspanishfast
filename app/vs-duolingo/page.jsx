import Link from 'next/link'

const TITLE = 'Duolingo Alternative for Spanish Vocabulary'
const DESC = 'Stuck after months of Duolingo? Keep the habit, fix the vocabulary: learn the 1,500 most frequent Spanish words, which cover 80% of everyday speech.'

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: 'https://mostcommonspanish.com/vs-duolingo' },
  openGraph: { title: TITLE, description: DESC, url: 'https://mostcommonspanish.com/vs-duolingo', type: 'website', images: ['https://mostcommonspanish.com/og-default.png'] },
}

const FAQ = [
  {
    q: 'Should I quit Duolingo?',
    a: 'Not necessarily. Duolingo is good at one thing: getting you to show up every day. If the habit works for you, keep it. What it does not do is teach vocabulary in order of usefulness, so many learners finish hundreds of lessons and still miss common words in real conversations. Adding a frequency list closes that gap.',
  },
  {
    q: 'Why do I still not understand native speakers after Duolingo?',
    a: 'Two reasons come up most. Courses are organised by topic, so you learn words like animals and colours early while very common words wait for later units. And app sentences are slow and clean, while real speech is fast. Knowing the most frequent words first gives you the scaffolding to follow fast speech.',
  },
  {
    q: 'Is this a Duolingo replacement?',
    a: 'It replaces the vocabulary part. Duolingo also has listening, speaking and grammar exercises, and this site does not try to copy those. Most people get the best result by keeping a habit app or a podcast for listening and using the frequency list for vocabulary.',
  },
  {
    q: 'How long does the Top 1,500 take?',
    a: 'At about 20 minutes a day the workbook takes roughly 14 weeks: 30 units of 50 words, three days each, with review tests every 250 words.',
  },
  {
    q: 'Is it free?',
    a: 'The flashcard sample with the first 10 words is free in your browser, and all 1,500 words are listed free on the word-list pages. The printable workbook is €5.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}

const Check = () => (
  <svg className="ct-yes" width="18" height="18" viewBox="0 0 18 18" fill="none" role="img" aria-label="Yes"><path d="M4 9.5l3.2 3L14 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
const Cross = () => (
  <svg className="ct-no" width="16" height="16" viewBox="0 0 16 16" fill="none" role="img" aria-label="No"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
)
const Mark = ({ v }) => (v === true ? <Check /> : v === false ? <Cross /> : <span className="ct-part">{v}</span>)

const ROWS = [
  ['Daily habit and reminders', true, false],
  ['Listening and speaking exercises', true, false],
  ['Grammar lessons', true, false],
  ['Words taught in frequency order', false, true],
  ['Shows how much everyday Spanish you cover', false, true],
  ['Every word with a real example sentence', 'In lessons', true],
  ['Works offline on paper', false, true],
  ['Price', 'Free with ads, paid plan', '€5 once'],
]

export default function VsDuolingo() {
  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="ct-hero">
        <div className="wrap">
          <h1 className="h1">The Duolingo alternative<br /><span className="soft">for Spanish vocabulary</span></h1>
          <p className="lead">Long streak, lots of lessons, and native speakers still lose you after one sentence. The problem is usually vocabulary order, not effort.</p>
          <div className="cta-row">
            <Link className="btn btn-navy" href="/study">Start for free</Link>
            <Link className="btn btn-ghost" href="/workbook">Get the workbook</Link>
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>Why the streak doesn&rsquo;t turn into understanding</h2>
            <p className="lead">Duolingo is built to keep you coming back, and it is very good at that. Its courses are organised by topic. Real Spanish is not.</p>
          </div>
          <div className="card ct-trio">
            {[
              { title: 'Topics, not frequency', body: 'Units group words by theme. Words you will hear a hundred times a day sit next to words you may hear once a year, and you learn them with the same effort.' },
              { title: 'Clean sentences, fast reality', body: 'App sentences are short and slow. Real speech strings together the most frequent words at full speed. If those words are not automatic, you lose the thread.' },
              { title: 'Progress you can’t measure', body: 'XP and streaks measure activity. They don’t tell you how much of a real conversation you would follow today.' },
            ].map(({ title, body }) => (
              <div key={title} className="ct-trio-item"><h3>{title}</h3><p>{body}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>Duolingo vs the Top 1,500</h2>
            <p className="lead">An honest comparison. Duolingo does more things. This does one thing it skips.</p>
          </div>
          <div className="card ct-table-card">
            <table className="ct-table ct-compare">
              <thead><tr><th scope="col">Feature</th><th scope="col">Duolingo</th><th scope="col" className="ct-us">Top 1,500 workbook</th></tr></thead>
              <tbody>
                {ROWS.map(([feature, duo, us]) => (
                  <tr key={feature}><td>{feature}</td><td><Mark v={duo} /></td><td className="ct-us"><Mark v={us} /></td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ct-note">Not for you if you want an all-in-one course with grammar and speaking practice. Pair a habit app or <Link href="/blog/best-podcasts-for-learning-spanish">a Spanish podcast</Link> with the word list instead.</p>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>Keep Duolingo<br />Add the right words</h2>
            <p className="lead">The simplest fix is a split: 10 minutes of your habit app, 20 minutes of frequency vocabulary.</p>
          </div>
          <div className="method ct-steps">
            {[
              { n: 'FIND', t: 'Check your level', b: 'Take the 2-minute vocabulary test to see where the frequency list stops being familiar.' },
              { n: 'LEARN', t: 'Work down the list', b: '50 words per unit, in rank order, each with an example sentence.' },
              { n: 'REVIEW', t: 'Day 3 and day 7', b: 'Short checks lock the words in. A test every 250 words tells you when to move on.' },
              { n: 'USE', t: 'Listen for them', b: 'Your habit app and podcasts now reinforce words you already know.' },
            ].map(({ n, t, b }) => (
              <div key={n} className="step"><span className="mono">{n}</span><b>{t}</b><p>{b}</p></div>
            ))}
          </div>
          <p className="ct-note"><Link href="/level-test">Take the Spanish vocabulary test</Link></p>
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
            <h2>Keep the streak<br /><span className="soft">Learn the words that matter</span></h2>
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
