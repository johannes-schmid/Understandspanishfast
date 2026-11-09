import Link from 'next/link'
import Image from 'next/image'
import WorkbookCover from '@/components/WorkbookCover'

const Dot = () => <span className="dot" />

function AnkiCard({ size = 'md' }) {
  return (
    <Image
      src="/anki/card-preview.webp"
      alt="Anki card from the deck: el zapato, rank 701, with picture and example sentence"
      width={840}
      height={1260}
      sizes="180px"
      className={`sp-anki sp-anki-${size}`}
    />
  )
}

export const PRODUCTS = [
  {
    id: 'workbook-1500',
    name: 'Printable workbook',
    tagline: 'Learn the 1,500 words on paper',
    price: '€5',
    meta: 'PDF · 119 pages',
    href: '/workbook',
    points: ['30 units of 50 words, in rank order', 'Exercise page and mini-story per unit', 'Review test every 250 words', 'Answer key and 14-week plan'],
    visual: <div className="sp-vis-cover"><WorkbookCover /></div>,
  },
  {
    id: 'anki-1500',
    name: 'Anki deck',
    tagline: 'Learn the 1,500 words with spaced repetition',
    price: '€9',
    meta: '.apkg · 152 MB',
    href: '/anki-spanish-deck',
    points: ['1,500 notes, new cards in rank order', 'Native audio for every word and sentence', 'Example sentence with translation', 'Pictures on about 1,200 words'],
    visual: <AnkiCard />,
  },
  {
    id: 'bundle-1500',
    name: 'Workbook + Anki deck',
    tagline: 'Paper for practice, Anki for daily review',
    price: '€12',
    meta: 'Both downloads',
    was: '€14',
    best: true,
    href: '/shop#compare',
    points: ['Everything in the workbook', 'Everything in the Anki deck', 'Same words, same order, same units', 'Save €2 against buying both'],
    visual: (
      <div className="sp-vis-bundle">
        <WorkbookCover size="sm" />
        <AnkiCard size="sm" />
      </div>
    ),
  },
]

export default function ShopProducts({ headingLevel = 'h2' }) {
  const H = headingLevel
  return (
    <div className="sp-grid">
      {PRODUCTS.map((p) => (
        <article key={p.id} className={`card sp-card${p.best ? ' sp-best' : ''}`}>
          <div className="sp-visual">
            {p.visual}
          </div>
          <div className="sp-body">
            {p.best && <span className="chip coral sp-flag">BEST VALUE</span>}
            <H className="sp-name">{p.name}</H>
            <p className="sp-tag">{p.tagline}</p>
            <ul className="inside sp-points">
              {p.points.map((t) => <li key={t}><Dot />{t}</li>)}
            </ul>
            <div className="price sp-price">
              <b className="tab">{p.price}</b>
              {p.was && <s className="tab sp-was">{p.was}</s>}
              <span>{p.meta}</span>
            </div>
            <form action="/api/checkout" method="POST">
              <input type="hidden" name="product" value={p.id} />
              <button type="submit" className={`btn btn-block ${p.best ? 'btn-coral' : 'btn-navy'}`}>Buy for {p.price}</button>
            </form>
            <Link href={p.href} className="sp-more">{p.best ? 'Compare the two' : <>See what&rsquo;s inside</>}</Link>
          </div>
        </article>
      ))}
    </div>
  )
}
