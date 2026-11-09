import Link from 'next/link'
import Image from 'next/image'

const PAGE_URL = 'https://mostcommonspanish.com/anki-spanish-deck'
const TITLE = 'Spanish Anki Deck: The 1,500 Most Common Words'
const DESC = 'A ready-made Spanish Anki deck of the 1,500 most frequent words in rank order, with native audio, example sentences and pictures. €9, free 100-word sample.'

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESC, url: PAGE_URL, type: 'website', images: ['https://mostcommonspanish.com/anki/card-preview.webp'] },
}

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'The Top 1,500 Spanish Words — Anki Deck',
  description: 'A Spanish Anki deck (.apkg) of the 1,500 most frequent words in rank order, with native audio for every word and example sentence, translations and pictures.',
  image: 'https://mostcommonspanish.com/anki/card-preview.webp',
  brand: { '@type': 'Brand', name: 'Most Common Spanish' },
  offers: { '@type': 'Offer', price: '9.00', priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: PAGE_URL },
}

const FAQ = [
  { q: 'What is in the deck?', a: '1,500 notes, one per word, ranked #1 to #1,500 by frequency. Each note has the word with its article, meaning, part of speech, an example sentence with translation, audio for the word and the sentence, and a picture for about 1,200 of the words.' },
  { q: 'Which card types does it make?', a: 'Two per word: Spanish to English (recognise it) and English to Spanish (say it). If you only want recognition, suspend the second card type in the browser in one click.' },
  { q: 'In what order do new cards appear?', a: 'In frequency order. Word #1 is your first new card, word #1,500 your last, so every day you learn the most useful words you don’t know yet.' },
  { q: 'Does it work on my phone?', a: 'Yes. It is a standard .apkg file. Import it in Anki on Windows, Mac or Linux and sync to AnkiDroid or AnkiMobile, or open it directly in AnkiDroid.' },
  { q: 'How do I import the free sample?', a: 'Download the file, then double-click it (desktop) or open it from your downloads (AnkiDroid). The deck appears as “Top 100 Spanish Words (free sample)”.' },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}

const INSIDE = [
  ['1,500 words in rank order', 'New cards follow frequency: the most common word first'],
  ['Audio on every card', 'The word and the example sentence, 3,000 clips'],
  ['Example sentences', 'Every word in a real sentence with English translation'],
  ['Pictures', 'On about 1,200 of the words, so meanings stick'],
  ['Coverage on the back', 'Each card shows how much everyday Spanish your words cover'],
  ['Tagged by unit', '30 units of 50 words, plus tags by part of speech'],
]

export default function AnkiDeck() {
  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="hero wb-hero">
        <div className="wrap wb-hero-grid">
          <div className="panel wb-cover-panel">
            <Image src="/anki/card-preview.webp" alt="Spanish Anki card for el zapato, rank 701, with meaning, picture, example sentence and coverage line" width={840} height={1260} priority sizes="(max-width: 900px) 80vw, 360px" className="anki-card" />
          </div>
          <div>
            <h1 className="h1 wb-h1">Spanish Anki deck<br /><span className="soft">The 1,500 most common words</span></h1>
            <p className="lead">No deck hunting, no typos, no aardvarks before &ldquo;but&rdquo;. The 1,500 words that cover about 80% of everyday Spanish, in the order you need them, with audio and example sentences.</p>
            <div className="card wb-buy">
              <div className="price"><b className="tab">€9</b><span>one-time · .apkg · 152 MB</span></div>
              <form action="/api/checkout" method="POST">
                <input type="hidden" name="product" value="anki-1500" />
                <button type="submit" className="btn btn-coral btn-block">Buy the Anki deck · €9</button>
              </form>
              <form action="/api/checkout" method="POST" className="buy-alt">
                <input type="hidden" name="product" value="bundle-1500" />
                <button type="submit" className="link">Add the printable workbook: both for €12</button>
              </form>
              <p className="fine">Secure checkout by Stripe. Instant download after payment. Not sure yet? <a href="/anki/top-100-spanish-words-sample.apkg" download>Get the first 100 words free</a>.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>What is inside</h2>
            <p className="lead">Built from the same ranked list as the workbook and the free flashcards on this site.</p>
          </div>
          <div className="wb-inside">
            {INSIDE.map(([t, d]) => <div key={t} className="card"><b>{t}</b><span>{d}</span></div>)}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="sec-head"><h2>Questions</h2></div>
          <div className="faq">
            {FAQ.map(({ q, a }) => <div key={q} className="card faq-item"><h3>{q}</h3><p>{a}</p></div>)}
          </div>
          <p className="ct-note">Prefer paper? The <Link href="/workbook">Top 1,500 workbook</Link> covers the same words with exercises and tests. Not sure where to start? Take the <Link href="/level-test">Spanish vocabulary test</Link>.</p>
        </div>
      </section>
    </div>
  )
}
