import Link from 'next/link'
import LevelTestClient from '@/components/LevelTestClient'
import { words } from '@/data/words'
import { MILESTONES } from '@/lib/coverage'
import '../clarity-leveltest.css'
import '../clarity-coverage.css'
import showsData from '@/data/shows.json'

const SHOWS = showsData.shows.map(({ slug, title, type, country, coverage, easiness }) => ({ slug, title, type, country, coverage, easiness }))

const pool = words.map(({ rank, word, meanings }) => [rank, word, Array.isArray(meanings) ? meanings[0] : meanings])

const URL_ = 'https://mostcommonspanish.com/level-test'
const TITLE = 'How Many Spanish Words Do I Know? Free Vocabulary Test'
const DESC = 'How many Spanish words do you know? Free 2-minute vocabulary test: get your word count, how much everyday Spanish you understand and what to learn next.'
const MODIFIED = '2026-11-23'

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: URL_ },
  openGraph: { title: TITLE, description: DESC, url: URL_, type: 'website', images: ['https://mostcommonspanish.com/og-default.png'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
}

const FAQ = [
  {
    q: 'How many Spanish words do I know?',
    a: 'Take the test above. It samples 42 words from the 1,500 most frequent Spanish words, adds 8 made-up words to catch guessing, and estimates how many of the top 1,500 you know. You get a word count, the share of everyday Spanish it covers, and the words to learn next.',
  },
  {
    q: 'How many words do you need to know to be conversational in Spanish?',
    a: 'Around 1,000 to 1,500 of the most frequent words. The top 1,000 cover about 74% of everyday spoken Spanish and the top 1,500 about 80%, which is where everyday conversations start to hold together without constant guessing.',
  },
  {
    q: 'Is 1,000 words enough to speak Spanish?',
    a: 'Enough to get by, not enough to relax. With 1,000 words you follow about three in four words of everyday speech: simple conversations work, TV dialogue is still patchy. The next 500 words add another six percentage points.',
  },
  {
    q: 'How many Spanish words does a native speaker know?',
    a: 'Adult native speakers recognise tens of thousands of words, often cited as 20,000 to 30,000 word families. Day to day they use far fewer. That gap is why frequency matters: a small core of words does most of the work in real speech.',
  },
  {
    q: 'How accurate is a Spanish vocabulary size test?',
    a: 'A yes/no test with made-up words is a well-studied way to estimate receptive vocabulary, but with 42 real words each result carries about ±100 words of noise. Take it twice and average. It measures recognition, not whether you can produce the word when speaking.',
  },
  {
    q: 'How many words do you need for B1 Spanish?',
    a: 'Estimates vary by source, but B1 learners are usually credited with roughly 2,000 words or more. CEFR levels also test grammar, listening and speaking, so a word count alone cannot place you on the scale. Use this test to track vocabulary, not to claim a level.',
  },
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${URL_}#app`,
      name: 'How many Spanish words do you know? Vocabulary size test',
      url: URL_,
      description: DESC,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any',
      inLanguage: 'en',
      isAccessibleForFree: true,
      dateModified: MODIFIED,
      educationalUse: 'assessment',
      about: { '@type': 'Thing', name: 'Spanish vocabulary size' },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      publisher: { '@type': 'Organization', name: 'Most Common Spanish', url: 'https://mostcommonspanish.com' },
    },
    {
      '@type': 'FAQPage',
      '@id': `${URL_}#faq`,
      dateModified: MODIFIED,
      mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ],
}

const UNLOCKS = {
  100: 'Greetings, the core verbs, the glue words of every sentence',
  250: 'Simple conversations about yourself and your day',
  500: 'Short stories and graded readers',
  1000: 'Most everyday talk and slow podcasts',
  1500: 'TV dialogue starts to hold together',
}

export default function LevelTest() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <LevelTestClient pool={pool} shows={SHOWS} />
      <div className="cl cl-home">
        <section className="sec ct-sec">
          <div className="wrap lt-method">
            <div>
              <h2>How the test estimates your vocabulary</h2>
              <p className="lead">It is a yes/no vocabulary test, the format researchers have used since Meara and Buxton (1987), and the one behind <a className="tlink" href="https://www.lextale.com/" rel="noopener" target="_blank">LexTALE</a> and its Spanish version, <a className="tlink" href="https://www.uv.es/revispsi/articulos1.14/3IZURA.pdf" rel="noopener" target="_blank">Lextale-Esp</a>.</p>
            </div>
            <ol className="lt-steps">
              <li><b>Frequency bands.</b> We split our list of the <Link className="tlink" href="/words/most-common-spanish-words">most common Spanish words</Link> into seven bands, from ranks 1–100 up to 1,251–1,500, and draw six words from each.</li>
              <li><b>Made-up words.</b> Eight Spanish-looking words that do not exist are mixed in. Saying yes to them shows how much you guess.</li>
              <li><b>Correction for guessing.</b> For each band we take your yes rate, subtract your yes rate on made-up words, and scale it: (hits − false alarms) ÷ (1 − false alarms). Then we multiply by the band size and add up the bands.</li>
              <li><b>Comprehension.</b> Your word count maps to the share of everyday spoken Spanish those words cover.</li>
            </ol>
          </div>
        </section>

        <section className="sec ct-sec">
          <div className="wrap">
            <div className="sec-head">
              <h2>What your score means</h2>
              <p className="lead">Frequency does the heavy lifting. The first 100 words cover half of what you hear. Each band after that adds less, so where you stop matters.</p>
            </div>
            <div className="card ct-table-card">
              <table className="ct-table">
                <thead><tr><th scope="col">Words known</th><th scope="col">Everyday Spanish covered</th><th scope="col">What it unlocks</th></tr></thead>
                <tbody>
                  {MILESTONES.map((m) => <tr key={m.words}><td className="tab">{m.words.toLocaleString('en')}</td><td className="tab">about {m.pct}%</td><td>{UNLOCKS[m.words] || m.label}</td></tr>)}
                </tbody>
              </table>
            </div>
            <p className="ct-note">Want the reasoning behind the numbers? Read <Link className="tlink" href="/blog/how-many-spanish-words-to-be-fluent">how many Spanish words you need to be fluent</Link> or browse the <Link className="tlink" href="/words/top-500-spanish-words">top 500 Spanish words</Link>.</p>
          </div>
        </section>

        <section className="sec ct-sec">
          <div className="wrap">
            <div className="sec-head"><h2>Questions about Spanish vocabulary size</h2></div>
            <div className="faq">
              {FAQ.map(({ q, a }) => <div key={q} className="card faq-item"><h3>{q}</h3><p>{a}</p></div>)}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
