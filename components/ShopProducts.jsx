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
    level: 1500,
    name: 'Printable workbook',
    tagline: 'Learn the 1,500 words on paper',
    price: '€5',
    meta: 'PDF · 119 pages',
    href: '/workbook',
    points: ['30 units of 50 words, in rank order', 'Exercise page and mini-story per unit', 'Review test every 250 words'],
    visual: <div className="sp-vis-cover"><WorkbookCover /></div>,
  },
  {
    id: 'anki-1500',
    level: 1500,
    name: 'Anki deck',
    tagline: 'Remember the 1,500 words with spaced repetition',
    price: '€9',
    meta: '.apkg · 152 MB',
    href: '/anki-spanish-deck',
    points: ['1,500 notes, new cards in rank order', 'Native audio for every word and sentence', 'Pictures on about 1,200 words'],
    visual: <AnkiCard />,
  },
  {
    id: 'bundle-1500',
    level: 1500,
    name: 'Workbook + Anki deck',
    tagline: 'Paper for practice, Anki for daily review',
    price: '€12',
    meta: 'Both downloads',
    was: '€14',
    best: true,
    href: '/bundle',
    points: ['Everything in the workbook', 'Everything in the Anki deck', 'Same words, same order, same units'],
    visual: (
      <div className="sp-vis-bundle">
        <WorkbookCover size="sm" />
        <AnkiCard size="sm" />
      </div>
    ),
  },
  {
    id: 'readers-500',
    level: 500,
    name: '10 short stories',
    tagline: 'Read and hear the first 500 words in real stories',
    price: '€9',
    meta: 'PDF + 10 MP3s',
    href: '/spanish-short-stories-for-beginners',
    points: ['Adult stories built from the top 500 words', 'Every story read by a native speaker', 'Questions and answer key for each story'],
    visual: <Image src="/readers/cover.webp" alt="Cover of Diez historias, ten Spanish short stories for beginners" width={900} height={1273} sizes="160px" className="sp-reader" />,
  },
  {
    id: 'readers-1500',
    level: 1500,
    name: '10 longer stories',
    tagline: 'Read and hear the 1,500 words in real stories',
    price: '€9',
    meta: 'PDF + 10 MP3s',
    href: '/spanish-short-stories-intermediate',
    points: ['Adult stories built from the top 1,500 words', 'Every story read by a native speaker', 'Questions and answer key for each story'],
    visual: <Image src="/readers/cover-level-2.webp" alt="Cover of Diez historias Level 2, ten Spanish short stories built from the 1,500 most common words" width={900} height={1273} sizes="160px" className="sp-reader" />,
  },
]

const TAG = { 500: '500 WORDS', 1500: '1,500 WORDS' }

function Card({ p, H }) {
  return (
    <article className={`card sp-card${p.best ? ' sp-best' : ''}`}>
      <div className="sp-visual">
        {p.visual}
        {p.best && <span className="chip coral sp-flag">BEST VALUE</span>}
        <span className={`chip sp-level-tag${p.level === 500 ? ' sp-l500' : ''}`}>{TAG[p.level]}</span>
      </div>
      <div className="sp-body">
        <H className="sp-name"><Link href={p.href} className="sp-link">{p.name}</Link></H>
        <p className="sp-tag">{p.tagline}</p>
        <ul className="inside sp-points">
          {p.points.map((t) => <li key={t}><Dot />{t}</li>)}
        </ul>
        <div className="price sp-price">
          <b className="tab">{p.price}</b>
          {p.was && <s className="tab sp-was">{p.was}</s>}
          <span>{p.meta}</span>
        </div>
        <form action="/api/checkout" method="POST" className="sp-buy">
          <input type="hidden" name="product" value={p.id} />
          <button type="submit" className={`btn btn-block ${p.best ? 'btn-coral' : 'btn-navy'}`}>Buy for {p.price}</button>
        </form>
        <span className="sp-more" aria-hidden="true">View product</span>
      </div>
    </article>
  )
}

export default function ShopProducts({ headingLevel = 'h2' }) {
  return (
    <div className="sp-grid">
      {PRODUCTS.map((p) => <Card key={p.id} p={p} H={headingLevel} />)}
    </div>
  )
}
