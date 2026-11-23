import Link from 'next/link'
import Image from 'next/image'
import WorkbookCover from '@/components/WorkbookCover'
import { productSchema } from '@/lib/productSchema'

const PAGE_URL = 'https://mostcommonspanish.com/bundle'
const TITLE = 'Spanish Workbook + Anki Deck Bundle: Top 1,500 Words'
const DESC = 'The printable Top 1,500 Spanish workbook and the Anki deck with native audio, for €12 instead of €14. Same 1,500 words, same order. One-time, instant download.'

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESC, url: PAGE_URL, type: 'website', images: ['https://mostcommonspanish.com/anki/card-preview.webp'] },
}

const schema = productSchema({
  name: 'The Top 1,500 Spanish Words — Workbook + Anki Deck',
  description: 'The printable PDF workbook and the Anki deck (.apkg) for the 1,500 most frequent Spanish words: 30 units with exercises and tests, plus spaced-repetition cards with native audio.',
  image: 'https://mostcommonspanish.com/anki/card-preview.webp',
  sku: 'bundle-1500',
  price: 1200,
  url: PAGE_URL,
})

const PARTS = [
  {
    name: 'Printable workbook',
    href: '/workbook',
    price: '€5',
    meta: 'PDF · 119 pages',
    points: ['30 units of 50 words, in rank order', 'Exercise page and mini-story per unit', 'Review test every 250 words, answer key'],
  },
  {
    name: 'Anki deck',
    href: '/anki-spanish-deck',
    price: '€9',
    meta: '.apkg · 152 MB',
    points: ['1,500 notes, new cards in rank order', 'Native audio for every word and sentence', 'Tagged with the same 30 units as the workbook'],
  },
]

const WEEK = [
  ['Every day', 'Anki: 10 new cards and your reviews. About 15 minutes.'],
  ['Every 5 days', 'Workbook: the exercise page and mini-story for the unit you just finished in Anki.'],
  ['Every 250 words', 'Workbook: the review test. Pass it, move on. Miss it, review that block first.'],
]

const FAQ = [
  { q: 'What do I get?', a: 'Two downloads right after payment: the 119-page workbook PDF and the 1,500-word Anki deck (.apkg). Both stay available on your download page.' },
  { q: 'Why both?', a: 'Anki is the fastest way to remember a word. The workbook makes you use it: gap-fills, translation and a short story per unit. Recall plus use is what makes words show up when you listen.' },
  { q: 'Do they match?', a: 'Yes. Same 1,500 words, same frequency order, and the deck is tagged with the workbook’s 30 units, so you always know which pages go with which cards.' },
  { q: 'Can I get a refund?', a: 'Yes. Email us within 14 days of your purchase for a full refund.' },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}

const Dot = () => <span className="dot" />

export default function Bundle() {
  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="hero wb-hero">
        <div className="wrap wb-hero-grid">
          <div className="panel wb-cover-panel bd-panel">
            <div className="sp-vis-bundle bd-vis">
              <WorkbookCover />
              <Image src="/anki/card-preview.webp" alt="Anki card from the deck: el zapato, rank 701, with picture and example sentence" width={840} height={1260} priority sizes="220px" className="sp-anki bd-anki" />
            </div>
          </div>
          <div>
            <h1 className="h1 wb-h1">Workbook + Anki deck<br /><span className="soft">The full Top 1,500 set</span></h1>
            <p className="lead">Anki makes you remember the words. The workbook makes you use them. Same 1,500 words, same order, built to run side by side.</p>
            <ul className="proof">
              <li><Dot />Two instant downloads</li>
              <li><Dot />Save €2</li>
              <li><Dot />14-day refund</li>
            </ul>
            <div className="card wb-buy">
              <div className="price"><b className="tab">€12</b><s className="tab sp-was">€14</s><span>one-time · PDF + .apkg</span></div>
              <form action="/api/checkout" method="POST">
                <input type="hidden" name="product" value="bundle-1500" />
                <button type="submit" className="btn btn-coral btn-block">Buy the bundle · €12</button>
              </form>
              <p className="fine">Secure checkout by Stripe. Both downloads right after payment. <Link href="/terms#refunds">Refund policy</Link>.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>What is in the bundle</h2>
            <p className="lead">Everything in both products. Each one has its own page if you want the full details.</p>
          </div>
          <div className="bd-parts">
            {PARTS.map((p) => (
              <Link key={p.name} href={p.href} className="card bd-part">
                <div className="bd-part-head">
                  <h3>{p.name}</h3>
                  <span className="bd-part-price"><b className="tab">{p.price}</b> {p.meta}</span>
                </div>
                <ul className="inside">
                  {p.points.map((t) => <li key={t}><Dot />{t}</li>)}
                </ul>
                <span className="sp-more bd-part-more">See what&rsquo;s inside</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="sec-head"><h2>How to use them together</h2></div>
          <div className="wb-inside">
            {WEEK.map(([t, d]) => <div key={t} className="card"><b>{t}</b><span>{d}</span></div>)}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="sec-head"><h2>Questions</h2></div>
          <div className="faq">
            {FAQ.map(({ q, a }) => <div key={q} className="card faq-item"><h3>{q}</h3><p>{a}</p></div>)}
          </div>
          <p className="ct-note">Want to try first? Get <a href="/workbook/top-1500-workbook-sample-unit-1.pdf" target="_blank" rel="noopener">Unit 1 of the workbook</a> and the <a href="/anki/top-100-spanish-words-sample.apkg" download>first 100 Anki cards</a> free, or see everything in the <Link href="/shop">shop</Link>.</p>
        </div>
      </section>
    </div>
  )
}
