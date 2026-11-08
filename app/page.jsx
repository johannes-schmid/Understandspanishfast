import Link from 'next/link'
import HomepageWordPreview from '@/components/HomepageWordPreview'
import { words } from '@/data/words'

export const metadata = {
  title: 'Most Common Spanish Words — Frequency-Ranked Vocabulary List',
  description: 'The most common Spanish words, ranked by real-world frequency. Try 10 free flashcards with native audio, then learn all 1,500 with the printable workbook.',
  alternates: { canonical: 'https://mostcommonspanish.com/' },
  openGraph: { url: 'https://mostcommonspanish.com/' },
}

const FAQ = [
  { q: 'What are the most common Spanish words?', a: 'Function words and core verbs: ser, estar, ir, tener, haber, qué, hacer, poder. They appear in nearly every sentence, which is why the top 100 cover about half of everyday Spanish.' },
  { q: 'How many Spanish words do I need to be conversational?', a: 'Around 500. That covers roughly 67% of everyday Spanish, enough for basic back-and-forth about your day, work and family.' },
  { q: 'How many Spanish words do I need to be fluent?', a: 'About 1,500 high-frequency words gets you to roughly 80% of everyday Spanish: the point where you follow most conversations and context fills in the rest.' },
  { q: 'How long does it take to learn the most common Spanish words?', a: 'With 15–20 minutes a day, most adults reach 1,500 words in four to eight months. The first 100 take one to two weeks.' },
  { q: 'What’s the difference between the free tools and the workbook?', a: 'The free tools are for studying on screen. The Top 1,500 workbook is a printable PDF with a fixed practice method and varied exercises, for people who learn better with a pen.' },
  { q: 'Do I need an account?', a: 'No. The free sample and the level test run in your browser. The workbook is a one-time PDF download, no account needed.' },
]

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Most Common Spanish',
  url: 'https://mostcommonspanish.com/',
  description: 'The most common Spanish words, ranked by real-world frequency.',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}

const COVERAGE = [
  { words: '100 words', pct: '50%', w: 50 },
  { words: '500 words', pct: '67%', w: 67, key: true },
  { words: '1,000 words', pct: '74%', w: 74 },
  { words: '1,500 words', pct: '80%', w: 80 },
  { words: '2,000 words', pct: '~84%', w: 84, est: true },
]

const GUIDES = [
  { href: '/words', t: 'All Spanish word lists', d: 'Frequency-ranked vocabulary hub' },
  { href: '/words/top-100-spanish-words', t: 'Top 100 Spanish words', d: 'About half of everyday speech' },
  { href: '/words/top-500-spanish-words', t: 'Top 500 Spanish words', d: 'Enough for a basic conversation' },
  { href: '/words/most-common-spanish-verbs', t: 'Most common Spanish verbs', d: 'The verbs that do the most work' },
  { href: '/words/spanish-frequency-list', t: 'Frequency list and method', d: 'How coverage is measured' },
  { href: '/blog/how-many-spanish-words-to-be-fluent', t: 'How many words to be fluent?', d: 'The numbers, explained' },
]

const previewWords = words.slice(0, 300).map(({ rank, word, pos, meanings, example_es, example_en, audio }) => ({ rank, word, pos, meanings, example_es: example_es ?? null, example_en: example_en ?? null, audio: audio ?? null }))

function Arrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

function Tick() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fcfcff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
}

const Dot = ({ green }) => <span className="dot" style={green ? { background: 'var(--green)' } : undefined} />

function CoverBars() {
  return <div className="cover-bars" aria-hidden="true"><i style={{ height: '30%' }} /><i style={{ height: '50%' }} /><i style={{ height: '72%' }} /><i style={{ height: '100%' }} /></div>
}

export default function Landing() {
  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1 className="h1">The most common Spanish words <span className="soft">in the order that matters</span></h1>
            <p className="lead">We ranked 1,500 words by how often they appear in real Spanish. Learn the first 100 and you already follow about half of everyday speech. Learn 1,500 and you follow about 80%.</p>
            <div className="cta-row">
              <Link className="btn btn-navy" href="/study">Start for free <Arrow /></Link>
              <Link className="btn btn-ghost" href="/workbook">See the workbook</Link>
            </div>
            <ul className="proof">
              <li><Dot />10 free cards, no sign-up</li>
              <li><Dot />Native audio on every word</li>
              <li><Dot />Printable workbook, €5</li>
            </ul>
          </div>

          <div className="panel hero-panel" aria-hidden="true">
            <div className="card ring-chip">
              <div className="mono lbl">YOUR COVERAGE</div>
              <svg className="cov-ring" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r="48" fill="none" stroke="#eceefa" strokeWidth="10" />
                <circle className="ring-arc" cx="56" cy="56" r="48" fill="none" stroke="#14204a" strokeWidth="10" strokeLinecap="round" strokeDasharray="302" strokeDashoffset="100" transform="rotate(-90 56 56)" />
                <text x="56" y="62" textAnchor="middle" className="ring-num" fill="#14204a">67%</text>
              </svg>
              <p><b>500 words</b> learned.<br />Next stop: 74%.</p>
            </div>
            <div className="card fc">
              <div className="fc-top"><span className="mono">#4 OF 1,500</span><span className="mono today">3 / 20 TODAY</span></div>
              <div className="fc-word">tener</div>
              <div className="fc-pos">verb · to have, to hold</div>
              <div className="fc-mean">¿Tienes tiempo para hablar?</div>
              <div className="fc-ex">Do you <em>have</em> time to talk?</div>
              <div className="fc-actions"><span>Again</span><span className="on">Good</span><span>Easy</span></div>
            </div>
            <div className="card next-chip">
              <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 6 }}>UP NEXT</div>
              <div className="next-row"><span className="mono">#5</span><b>haber</b><span className="m">to have (aux.)</span></div>
              <div className="next-row"><span className="mono">#6</span><b>qué</b><span className="m">what, how</span></div>
              <div className="next-row"><span className="mono">#7</span><b>hacer</b><span className="m">to do, to make</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="coverage" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>How many Spanish words do you need?</h2>
            <p className="lead">About 1,500 for everyday comprehension. Spanish runs on a small core: the most frequent words do most of the work, and every word after that adds a little less.</p>
          </div>
          <div className="cov">
            <div className="card cov-chart" role="img" aria-label="Share of everyday Spanish covered by number of words learned: 100 words 50%, 500 words 67%, 1,000 words 74%, 1,500 words 80%, 2,000 words about 84%.">
              <div className="bars">
                {COVERAGE.map((c) => (
                  <div key={c.words} className={`bar${c.key ? ' key' : ''}${c.est ? ' est' : ''}`}>
                    <span className="mono tab">{c.words}</span>
                    <div className="track"><div className="fill" style={{ width: `${c.w}%` }} /></div>
                    <span className="pct tab">{c.pct}</span>
                  </div>
                ))}
              </div>
              <div className="cov-note"><span>Share of words in everyday spoken and written Spanish you’ll recognise.</span><span className="mono">2,000 = APPROX.</span></div>
            </div>
            <div className="card cov-side">
              <div className="mile"><span className="tag tab">100</span><div><h3>Half of what you hear</h3><p>ser, estar, tener, qué, con. The words inside almost every sentence.</p></div></div>
              <div className="mile key"><span className="tag tab">500</span><div><h3>Hold a basic conversation</h3><p>Talk about your day, work and family without stalling on every line.</p></div></div>
              <div className="mile"><span className="tag tab">1,500</span><div><h3>Read and follow along</h3><p>Subtitles, simple news, short books. Context fills in the rest.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="word-list" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>The list, ranked by how often each word appears</h2>
            <p className="lead">Every word comes with its meaning, a real example sentence and native audio. Filter by type, or hide the English to test yourself. Or read exactly <Link href="/blog/how-many-spanish-words-to-be-fluent" style={{ color: 'var(--navy)', fontWeight: 600, textDecorationColor: 'var(--coral)', textUnderlineOffset: 3 }}>how many Spanish words you need to be fluent</Link>.</p>
          </div>
          <HomepageWordPreview words={previewWords} total={words.length} />
        </div>
      </section>

      <section className="sec" id="tools" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>Try it first, for free</h2>
            <p className="lead">Study in the browser, find your level in a few minutes, browse the lists. Your progress stays on your device.</p>
          </div>

          <div className="feat">
            <div className="panel feat-panel" aria-hidden="true">
              <div className="fc2-back" />
              <div className="card mini fc2">
                <div className="fc-top"><span className="mono">#112 OF 1,500</span><span className="mono">DUE NOW</span></div>
                <div className="fc-word" style={{ fontSize: 48, margin: '22px 0 8px' }}>poco</div>
                <div className="fc-pos">adjective · few, little</div>
                <div className="fc-mean" style={{ fontSize: 17 }}>Tengo pocos amigos en la ciudad.</div>
                <div className="fc-actions"><span>Again</span><span>Good</span><span className="on">Easy</span></div>
              </div>
            </div>
            <div>
              <div className="free-tag"><Dot green />FREE · 10-CARD SAMPLE</div>
              <h3>Ten flashcards to see how frequency-first feels</h3>
              <p className="lead">Cards arrive in frequency order with native audio and a real sentence. Rate how well you knew it; the schedule handles the rest.</p>
              <ul className="bul">
                <li><Dot />The 10 most common words, free, no sign-up</li>
                <li><Dot />Native audio and a real sentence on every card</li>
                <li><Dot />Then continue with all 1,500 in the workbook</li>
              </ul>
              <Link className="link" href="/study">Start for free <Arrow /></Link>
            </div>
          </div>

          <div className="feat flip">
            <div className="panel feat-panel" aria-hidden="true">
              <div className="card mini q-card">
                <div className="fc-top"><span className="mono">LEVEL TEST</span><span className="mono">12 / 28</span></div>
                <div className="q-prog"><i /></div>
                <div className="q-word">suceder</div>
                <div className="opt">to succeed in business <span className="mono">A</span></div>
                <div className="opt sel">to happen <span className="mono">B</span></div>
                <div className="opt">to suggest <span className="mono">C</span></div>
              </div>
            </div>
            <div>
              <div className="free-tag"><Dot green />FREE · LEVEL TEST</div>
              <h3>Find out where you stand in a few minutes</h3>
              <p className="lead">Words sampled across the frequency bands. You get an estimate of your vocabulary size and the rank to start from.</p>
              <ul className="bul">
                <li><Dot />Skip the words you already know</li>
                <li><Dot />Result in words and in % of everyday Spanish</li>
              </ul>
              <Link className="link" href="/level-test">Take the level test <Arrow /></Link>
            </div>
          </div>

          <div className="feat">
            <div className="panel feat-panel" aria-hidden="true">
              <div className="card mini wl-card">
                <div className="wl-row done"><span className="mono">#48</span><b>cómo<span>how</span></b><span className="chk on"><Tick /></span></div>
                <div className="wl-row done"><span className="mono">#214</span><b>suceder<span>to happen</span></b><span className="chk on"><Tick /></span></div>
                <div className="wl-row"><span className="mono">#347</span><b>prometer<span>to promise</span></b><span className="chk" /></div>
                <div className="wl-row"><span className="mono">#498</span><b>imaginar<span>to imagine</span></b><span className="chk" /></div>
                <div className="wl-row"><span className="mono">#1046</span><b>rodilla<span>knee</span></b><span className="chk" /></div>
              </div>
            </div>
            <div>
              <div className="free-tag"><Dot green />FREE · WORD LISTS</div>
              <h3>Interactive word lists for every level</h3>
              <p className="lead">Top 100, top 500, the most common verbs, the full frequency list. Each one searchable, with audio and example sentences.</p>
              <ul className="bul">
                <li><Dot />Mark words as learned, hide translations to self-test</li>
                <li><Dot />Free PDF of the top 1,000, sent to your inbox</li>
              </ul>
              <Link className="link" href="/words">Browse the word lists <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sec shop" id="workbooks" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>The Top 1,500 workbook for €5</h2>
            <p className="lead">One printable book for the 1,500 words that cover 80% of everyday Spanish. Short units, varied exercises and a fixed method, so you always know what to do next and when a word is learned.</p>
          </div>

          <article className="card flag">
            <div className="flag-cover">
              <div className="cover" role="img" aria-label="Top 1,500 workbook cover">
                <span className="mono">MOST COMMON SPANISH</span>
                <CoverBars />
                <div className="cover-num tab">1,500</div>
                <div className="cover-t">The Top 1,500 Workbook<br /><span style={{ opacity: 0.7, fontWeight: 500 }}>Words #1–1,500 · 80% coverage</span></div>
              </div>
            </div>
            <div className="flag-body">
              <div className="flag-meta"><span className="chip coral">PRINTABLE PDF</span><span className="chip">WORDS #1–1,500</span><span className="chip">≈80% COVERAGE</span></div>
              <h3>Every word you need for everyday Spanish, on paper</h3>
              <p className="lead">The 1,500 most frequent words, in ranked order, split into 30 units of 50. Each unit runs through the same four passes: read, recall, use, review. One unit every two or three days gets you through the book in about three months.</p>
              <div className="method">
                <div className="step"><span className="mono">PASS 1</span><b>Read</b><p>Word, meaning and a real sentence. Say it out loud.</p></div>
                <div className="step"><span className="mono">PASS 2</span><b>Recall</b><p>Fold the page. Write the meaning from memory.</p></div>
                <div className="step"><span className="mono">PASS 3</span><b>Use</b><p>Fill the gap in a fresh sentence.</p></div>
                <div className="step"><span className="mono">PASS 4</span><b>Review</b><p>Day 3 and day 7 check. 45 of 50 = unit mastered.</p></div>
              </div>
              <div className="page-mini" aria-hidden="true">
                <div className="pm-head"><span className="mono">UNIT 03 · PASS 2 · RECALL</span><span className="mono">P. 18</span></div>
                <div className="pm-row"><span className="mono">#141</span><b>llegar</b><span className="pm-line hw">to arrive</span></div>
                <div className="pm-row"><span className="mono">#142</span><b>mismo</b><span className="pm-line hw">same</span></div>
                <div className="pm-row"><span className="mono">#143</span><b>dejar</b><span className="pm-line" /></div>
              </div>
            </div>
            <aside className="flag-aside">
              <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 16 }}>WHAT’S INSIDE</div>
              <ul className="inside">
                <li><Dot />30 units × 50 words, ranked #1–1,500</li>
                <li><Dot />Example sentence for every word</li>
                <li><Dot />Gap-fill, matching, translation and mini-story exercises</li>
                <li><Dot />Review test every 250 words, plus a mastery tracker</li>
                <li><Dot />Answer key at the back</li>
                <li><Dot />PDF · A4 and US Letter</li>
              </ul>
              <div className="price"><b className="tab">€5</b><span>one-time · instant download</span></div>
              <Link className="btn btn-coral btn-block" href="/workbook">Get the workbook · €5</Link>
              <p className="fine">Print as many copies as you need.</p>
            </aside>
          </article>

        </div>
      </section>

      <section className="sec" id="faq" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>Questions and answers</h2>
            <p className="lead">Short answers. Longer ones live on the <Link href="/blog" style={{ color: 'var(--navy)', fontWeight: 600, textDecorationColor: 'var(--coral)', textUnderlineOffset: 3 }}>blog</Link>.</p>
          </div>
          <div className="faq">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="card faq-item"><h3>{q}</h3><p>{a}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 28 }}>
            <h2>Word lists and guides</h2>
          </div>
          <div className="guides">
            {GUIDES.map((g) => (
              <Link key={g.href} href={g.href} className="card guide"><b>{g.t}</b><span>{g.d}</span></Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 24px' }}>
        <div className="wrap">
          <div className="panel close">
            <h2>Start with the 10 most common words, free</h2>
            <div className="cta-row"><Link className="btn btn-navy" href="/study">Start for free</Link><Link className="btn btn-ghost" href="/workbook">See the workbook</Link></div>
          </div>
        </div>
      </section>
    </div>
  )
}
