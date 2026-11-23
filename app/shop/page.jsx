import Link from 'next/link'
import ShopProducts from '@/components/ShopProducts'

const PAGE_URL = 'https://mostcommonspanish.com/shop'
const TITLE = 'Shop: Spanish Workbook, Anki Deck and Short Stories'
const DESC = 'The 1,500 most common Spanish words as a printable workbook (€5), an Anki deck with audio (€9) or both for €12, plus graded short stories with audio for the top 500 and top 1,500 words (€9 each). Instant download.'

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESC, url: PAGE_URL, type: 'website', images: ['https://mostcommonspanish.com/anki/card-preview.webp'] },
}

const COMPARE = [
  ['Format', 'Printable PDF', 'Anki .apkg file', 'Both'],
  ['Trains', 'Reading and writing', 'Recognising and recalling words', 'All of these'],
  ['Words', '1,500, ranked', '1,500, ranked', '1,500, ranked'],
  ['Audio', 'No', 'Word and sentence', 'Word and sentence'],
  ['Exercises and tests', '30 exercise pages, 6 tests', 'No', '30 exercise pages, 6 tests'],
  ['Review schedule', 'Day 3 and day 7, on paper', 'Automatic, by Anki', 'Both'],
  ['Works on', 'Paper or tablet', 'Anki desktop, AnkiDroid, AnkiMobile', 'All of these'],
]

const FAQ = [
  { q: 'Which one should I pick?', a: 'Pick the workbook if you learn best by writing and want exercises. Pick the Anki deck if you already use Anki or want audio on every word. The bundle gives you both: Anki for daily review, the workbook for practice. The short stories come in two levels: Level 1 uses only the top 500 words, Level 2 the top 1,500. Each has a PDF book and an MP3 of every story.' },
  { q: 'Can I get a refund?', a: 'Yes. Email us within 14 days of your purchase and we refund the full price.' },
  { q: 'Is this a subscription?', a: 'No. Each product is a one-time payment and an instant download. Your download page stays available, so you can download again later.' },
  { q: 'Do the workbook and deck use the same words?', a: 'Yes. Both cover the same 1,500 words in the same frequency order, and the deck is tagged with the same 30 units of 50 words, so you can use them side by side.' },
  { q: 'Can I try before buying?', a: 'Yes. Unit 1 of the workbook and the first 100 words of the Anki deck are free to download, and the flashcard sample runs in your browser.' },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}

export default function Shop() {
  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="ct-hero sp-hero">
        <div className="wrap">
          <h1 className="h1">The Top 1,500 shop</h1>
          <p className="lead">Start with the first 500 words in short stories you can read and hear. Then learn the 1,500 that cover about 80% of everyday Spanish: on paper, in Anki, and in longer stories.</p>
        </div>
      </section>

      <section className="sec sp-sec">
        <div className="wrap">
          <ShopProducts />
          <p className="fine sp-secure">One-time payment. Secure checkout by Stripe. Instant download. <Link href="/terms#refunds">14-day refund</Link>.</p>
        </div>
      </section>

      <section className="sec ct-sec" id="compare">
        <div className="wrap">
          <div className="sec-head">
            <h2>Compare the products</h2>
            <p className="lead">Same 1,500 words, same order. The difference is how you practise them.</p>
          </div>
          <div className="card ct-table-card">
            <table className="ct-table">
              <thead><tr><th scope="col"></th><th scope="col"><Link href="/workbook">Workbook</Link></th><th scope="col"><Link href="/anki-spanish-deck">Anki deck</Link></th><th scope="col" className="ct-us"><Link href="/bundle">Bundle</Link></th></tr></thead>
              <tbody>
                {COMPARE.map(([k, a, b, c]) => <tr key={k}><td>{k}</td><td>{a}</td><td>{b}</td><td className="ct-us">{c}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head"><h2>Try them free first</h2></div>
          <div className="wb-inside sp-free">
            <a className="card" href="/workbook/top-1500-workbook-sample-unit-1.pdf" target="_blank" rel="noopener"><b>Workbook Unit 1</b><span>7-page PDF: the method and the first 50 words</span></a>
            <a className="card" href="/anki/top-100-spanish-words-sample.apkg" download><b>Anki deck: first 100 words</b><span>6.7 MB .apkg, your progress carries over</span></a>
            <a className="card" href="/readers/la-carta-de-papa.pdf" target="_blank" rel="noopener"><b>Short story: La carta de papá</b><span>Story 1 of the Level 1 stories, PDF</span></a>
            <a className="card" href="/readers/la-otra-cuenta.pdf" target="_blank" rel="noopener"><b>Short story: La otra cuenta</b><span>Story 1 of the Level 2 stories, PDF</span></a>
            <Link className="card" href="/printable-spanish-flashcards"><b>Printable flashcards</b><span>The top 100 words as cut-out cards, PDF</span></Link>
            <Link className="card" href="/study"><b>Flashcards in your browser</b><span>The first 10 words with audio, no sign-up</span></Link>
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head"><h2>Questions</h2></div>
          <div className="faq">
            {FAQ.map(({ q, a }) => <div key={q} className="card faq-item"><h3>{q}</h3><p>{a}</p></div>)}
          </div>
        </div>
      </section>
    </div>
  )
}
