import Link from 'next/link'
import LevelTestClient from '@/components/LevelTestClient'
import { words } from '@/data/words'

const pool = words.map(({ rank, word }) => ({ rank, word }))

const TITLE = 'Spanish Vocabulary Test: How Many Words Do You Know?'
const DESC = 'Free 2-minute Spanish vocabulary test. Rate 25 frequency-ranked words and get your vocabulary size, CEFR-style level and how much everyday Spanish you follow.'

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: 'https://mostcommonspanish.com/level-test' },
  openGraph: { title: TITLE, description: DESC, url: 'https://mostcommonspanish.com/level-test', type: 'website', images: ['https://mostcommonspanish.com/og-default.png'] },
}

const FAQ = [
  {
    q: 'How does the Spanish vocabulary test work?',
    a: 'You see 25 words, five from each of five frequency bands: ranks 1 to 100, 101 to 250, 251 to 500, 501 to 1,000 and 1,001 to 1,500. For each band you mark which words you recognise. If you know at least 60% of a band, you clear it. Your estimate is the highest band you clear, plus a share of the first band you don’t.',
  },
  {
    q: 'How accurate is it?',
    a: 'It is a quick estimate, not an exam. Twenty-five words is a small sample, and self-rating relies on honesty. Retake it two or three times and use the average. For a fair result, only mark a word as known if you would understand it in a sentence without help.',
  },
  {
    q: 'How many Spanish words do I need to know?',
    a: 'The top 100 words cover about half of everyday spoken Spanish. 500 words get you to about 67%, 1,000 to about 74% and 1,500 to about 80%. Around 1,500 is where real conversations and slow TV start to make sense.',
  },
  {
    q: 'What does my level label mean?',
    a: 'The labels (A1 Starter to C1 Mastery) are a rough mapping from vocabulary size to the CEFR scale, which also measures grammar, speaking and writing. Treat the label as a vocabulary indicator, not an official CEFR certificate.',
  },
  {
    q: 'I scored low. What should I learn next?',
    a: 'Learn the words in rank order from where your estimate stops. Every word you add is the most useful one you don’t know yet. The free flashcards start at word #1, and the full list is on the most common Spanish words page.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}

const BANDS = [
  ['1 to 100', 'about 50%', 'Greetings, the core verbs, everyday glue words'],
  ['101 to 500', 'about 67%', 'Simple conversations and short texts'],
  ['501 to 1,000', 'about 74%', 'Most everyday talk and slow podcasts'],
  ['1,001 to 1,500', 'about 80%', 'TV dialogue starts to hold together'],
]

export default function LevelTest() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <LevelTestClient pool={pool} />
      <div className="cl cl-home">
        <section className="sec ct-sec">
          <div className="wrap">
            <div className="sec-head">
              <h2>What your score means</h2>
              <p className="lead">The test ranks every word by how often it appears in everyday Spanish. Your score tells you how far down that list you can read.</p>
            </div>
            <div className="card ct-table-card">
              <table className="ct-table">
                <thead><tr><th scope="col">Words known</th><th scope="col">Everyday Spanish covered</th><th scope="col">What it unlocks</th></tr></thead>
                <tbody>
                  {BANDS.map(([w, c, d]) => <tr key={w}><td>{w}</td><td>{c}</td><td>{d}</td></tr>)}
                </tbody>
              </table>
            </div>
            <p className="ct-note">Want the words behind the numbers? See the <Link href="/words/most-common-spanish-words">1,000 most common Spanish words</Link> or read <Link href="/blog/how-many-spanish-words-to-be-fluent">how many Spanish words you need to be fluent</Link>.</p>
          </div>
        </section>

        <section className="sec ct-sec">
          <div className="wrap">
            <div className="sec-head"><h2>Questions about the test</h2></div>
            <div className="faq">
              {FAQ.map(({ q, a }) => <div key={q} className="card faq-item"><h3>{q}</h3><p>{a}</p></div>)}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
