import Link from 'next/link'
import Image from 'next/image'
import PdfDownloadForm from '@/components/PdfDownloadForm'
import { words } from '@/data/words'

const PAGE_URL = 'https://mostcommonspanish.com/words/most-common-spanish-words-pdf'
const TITLE = '1000 Most Common Spanish Words PDF (Free Download)'
const DESC = 'Free printable PDF of the 1,000 most common Spanish words, ranked by frequency with part of speech and English meaning. 20 pages, no sign-up wall to browse.'

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESC, url: PAGE_URL, type: 'website', images: ['https://mostcommonspanish.com/words-pdf/page-2.webp'] },
}

const preview = words.slice(0, 12).map(({ rank, word, meanings }) => ({ rank, word, meaning: meanings[0] }))

const FAQ = [
  { q: 'What is in the PDF?', a: 'The 1,000 most common Spanish words in rank order, each with its part of speech and English meaning. It is 20 printable pages.' },
  { q: 'Is it really free?', a: 'Yes. Enter your email and the download opens straight away; we also send you the link. You can browse the same words online on the most common Spanish words page without signing up.' },
  { q: 'How should I use the list?', a: 'Learn it top to bottom. The first 100 words cover about half of everyday spoken Spanish, 500 cover about 67% and all 1,000 cover about 74%. Study 10 to 15 new words a day and review them on day 3 and day 7.' },
  { q: 'Is there a version with exercises?', a: 'Yes. The Top 1,500 workbook extends the list to 1,500 words and adds example sentences, an exercise page per unit, review tests and an answer key. It is a €5 printable PDF.' },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}

const PAGES = [
  { src: '/words-pdf/page-1.webp', alt: 'Cover page of the 1000 most common Spanish words PDF', cap: 'Cover' },
  { src: '/words-pdf/page-2.webp', alt: 'First page of the Spanish frequency list PDF with ranked words, part of speech and meaning', cap: 'Words #1 onward' },
  { src: '/words-pdf/page-11.webp', alt: 'Middle page of the printable Spanish word list PDF', cap: 'Words around #500' },
]

export default function WordsPdf() {
  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="ct-hero">
        <div className="wrap">
          <h1 className="h1">1,000 most common Spanish words<br /><span className="soft">Free printable PDF</span></h1>
          <p className="lead">The 1,000 words that cover about 74% of everyday spoken Spanish, ranked by frequency. Print it, pin it up, work down it.</p>
        </div>
      </section>

      <section className="sec ct-sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <PdfDownloadForm source="words-pdf-page" title="Get the PDF" body="20 pages, ranked #1 to #1,000, with part of speech and meaning. The download opens right away." />
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>What the pages look like</h2>
            <p className="lead">Real pages from the PDF. One word per line: rank, Spanish, type, English.</p>
          </div>
          <div className="pdf-preview">
            {PAGES.map((p) => (
              <figure key={p.src}>
                <Image src={p.src} alt={p.alt} width={911} height={1287} sizes="(max-width: 760px) 50vw, 360px" />
                <figcaption>{p.cap}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>The first 12 words on the list</h2>
            <p className="lead">These alone appear in almost every Spanish sentence you will hear.</p>
          </div>
          <div className="card ct-table-card">
            <table className="ct-table">
              <thead><tr><th scope="col">Rank</th><th scope="col">Spanish</th><th scope="col">Meaning</th></tr></thead>
              <tbody>
                {preview.map((w) => <tr key={w.rank}><td className="tab">#{w.rank}</td><td lang="es"><b>{w.word}</b></td><td>{w.meaning}</td></tr>)}
              </tbody>
            </table>
          </div>
          <p className="ct-note">Prefer to browse online? See the full <Link href="/words/most-common-spanish-words">most common Spanish words</Link> list with example sentences, or check how far down it you already are with the <Link href="/level-test">Spanish vocabulary test</Link>.</p>
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
            <h2>Want exercises with it<br /><span className="soft">The workbook covers 1,500 words</span></h2>
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
