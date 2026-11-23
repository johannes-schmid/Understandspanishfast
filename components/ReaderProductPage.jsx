import fs from 'node:fs'
import path from 'node:path'
import Link from 'next/link'
import Image from 'next/image'
import { productSchema } from '@/lib/productSchema'

const Dot = () => <span className="dot" />

export function readStories(level) {
  const dir = path.join(process.cwd(), 'readers', `level${level}`)
  const stories = fs.readdirSync(dir).filter((f) => /^level\d+-story\d+\.json$/.test(f)).sort().map((f) => {
    const s = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
    const audio = s.audio?.find((a) => a.kind === 'javier') || s.audio?.[0]
    return { id: s.id, title: s.title, en: s.title_en, summary: s.summary_en, words: s.wordCount, coverage: s.measured.coverage, seconds: audio?.seconds || 0 }
  })
  return {
    stories,
    totalWords: stories.reduce((t, s) => t + s.words, 0),
    minCoverage: Math.floor(Math.min(...stories.map((s) => s.coverage))),
    audioMin: Math.round(stories.reduce((t, s) => t + s.seconds, 0) / 60),
  }
}

const mins = (s) => Math.max(1, Math.round(s.seconds / 60))

export default function ReaderProductPage({ c }) {
  const { stories, totalWords, minCoverage, audioMin } = c.data
  const schema = productSchema({ name: c.schemaName, description: c.schemaDesc, image: `https://mostcommonspanish.com${c.cover}`, sku: c.product, price: c.price * 100, url: c.url })
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }
  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="hero wb-hero">
        <div className="wrap wb-hero-grid">
          <div className="panel wb-cover-panel rd-panel">
            <Image src={c.cover} alt={c.coverAlt} width={900} height={1273} priority sizes="(max-width: 900px) 240px, 320px" className="rd-cover" />
          </div>
          <div>
            <h1 className="h1 wb-h1">{c.h1}<br /><span className="soft">{c.h1Soft}</span></h1>
            <p className="lead">{c.lead}</p>
            <ul className="proof">
              <li><Dot />10 stories, {totalWords.toLocaleString('en')} words</li>
              <li><Dot />10 MP3s, {audioMin} min, Spain accent</li>
              <li><Dot />{minCoverage}%+ top-{c.limit.toLocaleString('en')} words</li>
            </ul>
            <div className="card wb-buy">
              <div className="price"><b className="tab">€{c.price}</b><span>one-time · PDF + 10 MP3s</span></div>
              <form action="/api/checkout" method="POST">
                <input type="hidden" name="product" value={c.product} />
                <button type="submit" className="btn btn-coral btn-block">Buy the 10 stories · €{c.price}</button>
              </form>
              <p className="fine">Secure checkout by Stripe. Instant download. <Link href="/terms#refunds">14-day refund</Link>.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="card rd-sample">
            <div>
              <span className="chip">STORY 1 · FREE</span>
              <h2>{stories[0].title}</h2>
              <p>{c.sampleBlurb}</p>
              <a className="link" href={`${c.sample}.pdf`} target="_blank" rel="noopener">Download story 1 (PDF)</a>
            </div>
            <audio controls preload="none" src={`${c.sample}.mp3`} className="rd-audio">
              <a href={`${c.sample}.mp3`}>Listen to story 1 (MP3)</a>
            </audio>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>The 10 stories</h2>
            <p className="lead">{c.storiesLead}</p>
          </div>
          <ol className="rd-list">
            {stories.map((s, i) => (
              <li key={s.id}>
                <span className="rd-n tab">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{s.title} <span>{s.en}</span></h3>
                  <p>{s.summary}</p>
                </div>
                <span className="rd-m tab">{s.words.toLocaleString('en')} words · {mins(s)} min</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap rd-check">
          <div>
            <h2>Every word is checked</h2>
            <p className="lead">A script reads each story, turns every word into its dictionary form and checks it against the top {c.limit.toLocaleString('en')}. At least {minCoverage}% of every story comes from the list. The handful of words that don&rsquo;t are explained in the margin the first time they appear.</p>
            <p className="lead">{c.checkLinks}</p>
          </div>
          <div className="wb-page rd-page">
            <Image src={c.pageImage} alt={c.pageAlt} width={900} height={1273} sizes="(max-width: 900px) 100vw, 440px" />
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="sec-head"><h2>How to use them</h2></div>
          <div className="method wb-method">
            {c.steps.map(([t, d], i) => <div key={t} className="step"><span className="mono">STEP {i + 1}</span><b>{t}</b><p>{d}</p></div>)}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="sec-head"><h2>Questions</h2></div>
          <div className="faq">
            {c.faq.map(({ q, a }) => <div key={q} className="card faq-item"><h3>{q}</h3><p>{a}</p></div>)}
          </div>
          <p className="ct-note">{c.footer}</p>
        </div>
      </section>
    </div>
  )
}
