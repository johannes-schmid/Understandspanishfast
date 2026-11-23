import Link from 'next/link'
import Image from 'next/image'
import { Download } from 'lucide-react'
import FlashcardFlip from '@/components/FlashcardFlip'
import { words } from '@/data/words'
import './flashcards.css'

const SITE = 'https://mostcommonspanish.com'
const PAGE_URL = `${SITE}/printable-spanish-flashcards`
const PDF = '/flashcards/top-100-spanish-flashcards.pdf'
const TITLE = 'Printable Spanish Flashcards PDF (Free, Top 100 Words)'
const DESC = 'Free printable Spanish flashcards PDF: the 100 most common words, double-sided with meaning and example sentence. Print on A4 or Letter, cut, study.'
const UPDATED = '2026-11-23'

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESC, url: PAGE_URL, type: 'website', images: [`${SITE}/flashcards/sheet-front.webp`] },
}

const POS = { 'v.': 'verb', 'n.m.': 'noun', 'n.f.': 'noun', 'n.': 'noun', 'adj.': 'adjective', 'adv.': 'adverb', 'pron.': 'pronoun', 'prep.': 'preposition', 'conj.': 'conjunction', 'det.': 'determiner', 'num.': 'number', 'intj.': 'interjection', 'expr.': 'phrase' }
const EL_FEM = new Set(['agua', 'alma', 'área', 'arma', 'hambre', 'aula', 'arte'])

function toCard(w) {
  const isNoun = w.pos.startsWith('n.')
  const word = isNoun ? w.word.replace(/^(un|una|el|la) /, '') : w.word
  const article = w.pos === 'n.m.' ? 'el' : w.pos === 'n.f.' ? (EL_FEM.has(word) ? 'el' : 'la') : null
  return { rank: w.rank, article, word, pos: POS[w.pos] || w.pos, meaning: w.meanings.slice(0, 2).join('; '), es: w.example_es, en: w.example_en }
}

const heroCard = toCard(words.find((w) => w.rank === 78))
const sample = words.slice(0, 8).map(toCard)

const PAGES = [
  { src: '/flashcards/sheet-front.webp', alt: 'Printable Spanish flashcards sheet with ten card fronts: ser, estar, ir, tener and more, with crop marks', cap: 'Fronts: the Spanish word, rank and type' },
  { src: '/flashcards/sheet-back.webp', alt: 'Back of the printable Spanish flashcards sheet with English meanings and example sentences, mirrored for double-sided printing', cap: 'Backs: meaning and a real example sentence' },
  { src: '/flashcards/instructions.webp', alt: 'Instructions page explaining how to print, cut and study the Spanish flashcards with three Leitner boxes', cap: 'How to print, cut and study' },
]

const FAQ = [
  { q: 'How do you print double-sided flashcards?', a: 'Choose double-sided printing and "flip on long edge" in your print dialog, at 100% or actual size. The backs in this PDF are already mirrored, so each meaning lands behind its word. Print one sheet first (pages 3 and 4) and hold it up to a window to check the cut lines meet.' },
  { q: 'What paper is best for printing flashcards?', a: 'Card stock of 160 to 200 g/m² (60 to 110 lb) works in most home printers and stops you reading the answer through the card. Normal 80 g/m² paper works too; it is just thinner and easier to see through.' },
  { q: 'What are the first 100 words to learn in Spanish?', a: 'The 100 most frequent ones: ser, estar, ir, tener, haber, qué, hacer, poder and so on. Together they make up about half of everything you hear in everyday Spanish. These flashcards are exactly those 100 words, in rank order.' },
  { q: 'Are flashcards good for learning Spanish?', a: 'Yes, for vocabulary. Testing yourself (looking at the Spanish and recalling the meaning before you flip) is one of the most reliable ways to make words stick. They work best on high-frequency words and with spaced review, which is what the three-box method in the PDF does.' },
  { q: 'How many Spanish words should I learn a day?', a: 'About 10 new words a day is sustainable for most adults. That gets you through these 100 cards in 10 days and through the 1,500 words that cover about 80% of everyday Spanish in around five months, with review.' },
  { q: 'Do I need to sign up to download?', a: 'No. The PDF downloads directly, no email needed. It is free for personal use, so print as many copies as you like for yourself or your class.' },
]

const docSchema = {
  '@context': 'https://schema.org',
  '@type': 'DigitalDocument',
  name: 'Top 100 Spanish Flashcards (printable PDF)',
  description: 'Printable, double-sided cut-out flashcards of the 100 most common Spanish words, with rank, part of speech, English meaning and an example sentence.',
  url: PAGE_URL,
  encodingFormat: 'application/pdf',
  contentUrl: `${SITE}${PDF}`,
  image: `${SITE}/flashcards/cover.webp`,
  inLanguage: ['es', 'en'],
  isAccessibleForFree: true,
  numberOfPages: 22,
  learningResourceType: 'Flashcard',
  educationalLevel: 'Beginner',
  datePublished: UPDATED,
  dateModified: UPDATED,
  publisher: { '@type': 'Organization', name: 'Most Common Spanish', url: SITE },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}

export default function PrintableFlashcards() {
  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(docSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="hero fp-hero">
        <div className="wrap fp-hero-grid">
          <div>
            <h1 className="h1">Printable Spanish flashcards<br /><span className="soft">The 100 most common words</span></h1>
            <p className="lead">The 100 words that make up half of everyday spoken Spanish, as double-sided cards you print, cut and keep in your pocket.</p>
            <div className="cta-row">
              <a className="btn btn-coral" href={PDF} download><Download size={18} strokeWidth={2} aria-hidden="true" />Download the PDF</a>
              <a className="btn btn-ghost" href="#cards">See the cards</a>
            </div>
            <p className="fp-meta">22-page PDF for A4 or Letter, 480 KB. No email needed.</p>
          </div>
          <div className="panel fp-hero-panel">
            <FlashcardFlip card={heroCard} size="lg" />
          </div>
        </div>
      </section>

      <section className="sec ct-sec fp-sheets" id="cards">
        <div className="wrap">
          <div className="fp-head">
            <h2>What you print</h2>
            <p className="lead">Ten cards per sheet, 90 × 54 mm each. The Spanish word goes on the front; the meaning and a real example sentence go on the back.</p>
          </div>
          <div className="pdf-preview">
            {PAGES.map((p) => (
              <figure key={p.src}>
                <Image src={p.src} alt={p.alt} width={909} height={1287} sizes="(max-width: 760px) 50vw, 380px" />
                <figcaption>{p.cap}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="fp-head">
            <h2>Try the first cards</h2>
            <p className="lead">Tap a card to flip it. The number is the word’s frequency rank, so #1 is the word you will hear most.</p>
          </div>
          <div className="fp-grid">
            {sample.map((c) => <FlashcardFlip key={c.rank} card={c} />)}
          </div>
          <p className="fp-more">All 100 words with meanings are also on the <Link href="/words/top-100-spanish-words">top 100 Spanish words</Link> list.</p>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap fp-how">
          <div>
            <h2>How to print and cut them</h2>
            <ol className="fp-steps">
              <li><b>Print double-sided, flip on long edge,</b> at 100% or actual size. On US Letter, choose fit to page. The backs are mirrored so they line up.</li>
              <li><b>Test one sheet first.</b> Print pages 3 and 4 and hold the sheet up to a window. The cut lines on both sides should meet.</li>
              <li><b>Use card stock if you have it.</b> 160 to 200 g/m² keeps the answer from showing through.</li>
              <li><b>Cut on the marks.</b> Three long cuts top to bottom, then cut each strip into five cards. A paper trimmer is fastest.</li>
            </ol>
          </div>
          <div className="fp-study">
            <h3>Then study with three boxes</h3>
            <p>Look at the Spanish, say the meaning out loud, flip. Ten minutes a day is enough.</p>
            <div className="fp-boxes">
              <div><b>Box 1</b><span>every day</span><p>New cards and any card you missed.</p></div>
              <div><b>Box 2</b><span>every 3 days</span><p>Right once. Right again moves it on.</p></div>
              <div><b>Box 3</b><span>every week</span><p>Known. Miss it and it goes back to box 1.</p></div>
            </div>
            <p className="fp-alt">Rather study on your phone? The same words, with native audio, are free as <Link href="/study">online flashcards</Link>.</p>
          </div>
        </div>
      </section>

      <section className="ct-end">
        <div className="wrap">
          <div className="panel close">
            <div>
              <h2>Ready for the next 1,400<br /><span className="soft">The full set is coming soon</span></h2>
              <p className="fp-close-p">Until it is out, the workbook and the Anki deck cover all 1,500 words, about 80% of everyday Spanish.</p>
            </div>
            <div className="cta-row">
              <Link className="btn btn-navy" href="/workbook">See the workbook</Link>
              <Link className="btn btn-ghost" href="/anki-spanish-deck">See the Anki deck</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head"><h2>Questions</h2></div>
          <div className="faq">
            {FAQ.map(({ q, a }) => <div key={q} className="card faq-item"><h3>{q}</h3><p>{a}</p></div>)}
          </div>
          <p className="fp-updated">Updated <time dateTime={UPDATED}>23 November 2026</time></p>
        </div>
      </section>
    </div>
  )
}
