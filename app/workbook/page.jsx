import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import WorkbookCover from '@/components/WorkbookCover'
import SampleNote from '@/components/SampleNote'

export const metadata = {
  title: 'Spanish Vocabulary Workbook PDF: Top 1,500 Words',
  description: 'Printable Spanish vocabulary workbook PDF: the 1,500 most common words in 30 units, with exercises, review tests and an answer key. Free sample unit. €5.',
  alternates: { canonical: 'https://mostcommonspanish.com/workbook' },
  openGraph: { url: 'https://mostcommonspanish.com/workbook', images: ['/workbook/cover.webp'] },
}

const PRICE = '5.00'

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'The Top 1,500 Spanish Words — Printable Workbook',
  description: 'A printable PDF workbook covering the 1,500 most frequent Spanish words in 30 units, with exercises, review tests and an answer key.',
  image: 'https://mostcommonspanish.com/workbook/cover.webp',
  brand: { '@type': 'Brand', name: 'Most Common Spanish' },
  offers: { '@type': 'Offer', price: PRICE, priceCurrency: 'EUR', url: 'https://mostcommonspanish.com/workbook' },
}

const PREVIEWS = [
  { src: '/workbook/words.webp', alt: 'Workbook word page: 25 Spanish words with rank, meaning, example sentence and three review boxes', t: 'Word pages', d: '25 words per page, in frequency order. Meaning, example sentence with translation, and three boxes for your day 1, 3 and 7 reviews.' },
  { src: '/workbook/exercises.webp', alt: 'Workbook exercise page with gap-fill, matching, translation and a mini-story with gaps', t: 'One exercise page per unit', d: 'Gap-fill, matching, translation and a short story with gaps. Every sentence written for that unit’s words.' },
  { src: '/workbook/test.webp', alt: 'Workbook review test page asking for the meaning of 20 Spanish words', t: 'Review test every 250 words', d: 'Six tests, 35 points each, with a clear rule for when to move on and when to review first.' },
]

const INSIDE = [
  ['30 units × 50 words', 'The 1,500 most frequent Spanish words, ranked #1 to #1,500'],
  ['Four-pass method', 'Read, recall, use, review. You always know what to do next'],
  ['30 exercise pages', 'Gap-fill, matching, translation and a mini-story per unit'],
  ['6 review tests', 'One every 250 words, with a pass mark'],
  ['Answer key', 'Every exercise and test, at the back of the book'],
  ['Plan and tracker', 'A 14-week plan and 1,500 boxes to colour in'],
]

const FAQ = [
  { q: 'What do I get?', a: 'One PDF of 119 A4 pages. Print it at home or at a copy shop, or fill it in on a tablet. You can print as many copies as you need for yourself.' },
  { q: 'What level is it for?', a: 'Beginners and false beginners. If you know some Spanish already, the first units go fast and act as a review; the later units fill the gaps.' },
  { q: 'How long does it take?', a: 'About 20 minutes a day. Each unit takes three days, so the whole book takes roughly 14 weeks.' },
  { q: 'Is there audio?', a: 'The workbook is paper-first. For pronunciation, the free flashcards on this site play native audio for every word.' },
]

function Arrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}
const Dot = () => <span className="dot" />

function BuyBox() {
  return (
    <div className="card wb-buy">
      <div className="price"><b className="tab">€5</b><span>one-time · PDF · 119 pages</span></div>
      <form action="/api/checkout" method="POST">
        <button type="submit" className="btn btn-coral btn-block">Buy the workbook · €5</button>
      </form>
      <form action="/api/checkout" method="POST" className="buy-alt">
        <input type="hidden" name="product" value="bundle-1500" />
        <button type="submit" className="link">Add the Anki deck with audio: both for €12</button>
      </form>
      <p className="fine">Secure checkout by Stripe. Instant PDF download after payment.</p>
    </div>
  )
}

export default function WorkbookPage() {
  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <section className="hero wb-hero">
        <div className="wrap wb-hero-grid">
          <div className="panel wb-cover-panel">
            <WorkbookCover />
          </div>
          <div>
            <Suspense fallback={null}><SampleNote /></Suspense>
            <h1 className="h1 wb-h1">The Top 1,500 Spanish Words workbook</h1>
            <p className="lead">The 1,500 words that cover about 80% of everyday Spanish, in the order you will meet them. 30 short units, a fixed method and enough practice to make every word stick. Printable PDF.</p>
            <ul className="proof">
              <li><Dot />119 A4 pages</li>
              <li><Dot />About 20 minutes a day</li>
              <li><Dot />Answer key included</li>
            </ul>
            <BuyBox />
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>What is inside</h2>
            <p className="lead">No grammar course and no themed lists. The right words, in the right order, practised until you know them.</p>
          </div>
          <div className="wb-inside">
            {INSIDE.map(([t, d]) => (
              <div key={t} className="card"><b>{t}</b><span>{d}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>Look inside the book</h2>
            <p className="lead">Real pages from the workbook. Every word, sentence and exercise is in the PDF exactly like this.</p>
            <p className="wb-sample"><a className="link" href="/workbook/top-1500-workbook-sample-unit-1.pdf" target="_blank" rel="noopener">Download Unit 1 free (PDF, 7 pages)</a></p>
          </div>
          <div className="wb-previews">
            {PREVIEWS.map((p) => (
              <figure key={p.src} className="wb-prev">
                <div className="wb-page"><Image src={p.src} alt={p.alt} width={900} height={1273} sizes="(max-width: 900px) 100vw, 380px" /></div>
                <figcaption><b>{p.t}</b><span>{p.d}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>Four passes per unit</h2>
            <p className="lead">Each unit takes three days. You never have to decide what to study next.</p>
          </div>
          <div className="method wb-method">
            <div className="step"><span className="mono">PASS 1</span><b>Read</b><p>Say each word and its example sentence out loud.</p></div>
            <div className="step"><span className="mono">PASS 2</span><b>Recall</b><p>Cover the meanings and test yourself. Tick the first box.</p></div>
            <div className="step"><span className="mono">PASS 3</span><b>Use</b><p>Do the exercise page and check it in the answer key.</p></div>
            <div className="step"><span className="mono">PASS 4</span><b>Review</b><p>Day 3 and day 7 checks. Three ticks means learned.</p></div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="sec-head"><h2>Questions</h2></div>
          <div className="faq">
            {FAQ.map(({ q, a }) => <div key={q} className="card faq-item"><h3>{q}</h3><p>{a}</p></div>)}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 24px' }}>
        <div className="wrap">
          <div className="panel close">
            <h2>Not sure yet? Try the first 10 words free</h2>
            <div className="cta-row"><Link className="btn btn-navy" href="/study">Start for free <Arrow /></Link></div>
          </div>
        </div>
      </section>
    </div>
  )
}
