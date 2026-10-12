import Image from 'next/image'
import Link from 'next/link'
import HomepageWordPreview from '@/components/HomepageWordPreview'
import HeroCard from '@/components/HeroCard'
import { words } from '@/data/words'

export const metadata = {
  title: 'Most Common Spanish Words — Frequency-Ranked Vocabulary List',
  description: 'The most common Spanish words, ranked by real-world frequency. Free flashcards with native audio — the first 100 cover half of everyday Spanish. No account needed.',
  alternates: { canonical: 'https://mostcommonspanish.com/' },
  openGraph: { url: 'https://mostcommonspanish.com/' },
}

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
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the most common Spanish words?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The most common Spanish words are function words and high-frequency verbs that appear in virtually every sentence: ser (to be), estar (to be), ir (to go), tener (to have), hacer (to do/make), poder (to be able to), decir (to say), and querer (to want). These words appear so frequently because language is built on a small core of repeated vocabulary — the top words alone account for half of everything you will ever hear in Spanish.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many Spanish words do I need to be fluent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You need approximately 1,500 high-frequency Spanish words for functional fluency — the point where you understand around 80% of everyday spoken Spanish. At 3,000 words you reach 95% coverage, where context-guessing works reliably and conversations feel effortless.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many Spanish words do I need to be conversational?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Around 500 of the most common Spanish words is enough to hold a basic conversation — topics like your day, work, and family. This gives you roughly 63% lexical coverage of everyday Spanish.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to learn the most common Spanish words?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'With 15–20 minutes of focused daily practice using spaced repetition, most adults reach 1,500 words in 4–8 months. The first 100 words — which cover 50% of all Spanish you will hear — typically take 1–2 weeks.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why learn Spanish words by frequency instead of by topic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Frequency-ranked lists prioritize words by how often they actually appear in real Spanish. Most language apps and textbooks teach words alphabetically or by theme (food, travel, etc.), which means you spend equal time on rare words and essential ones. A frequency list ensures every word you learn is as useful as possible.',
      },
    },
  ],
}

const SERIF = "var(--font-fraunces), serif"
const H2 = { fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(30px, 4vw, 42px)', lineHeight: 1.08, letterSpacing: '-1px', color: 'var(--deep-mind)', margin: 0 }
const LEAD = { fontSize: '16px', lineHeight: 1.6, color: '#6b6558', maxWidth: '560px' }
const DARK_GRAD = 'linear-gradient(150deg,#1b1836 0%,#2a2453 55%,#3a3470 100%)'

function Check({ c = '#fff', s = 13 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
  )
}

const previewWords = words.slice(0, 300).map(({ rank, word, pos, meanings, example_es, example_en }) => ({ rank, word, pos, meanings, example_es: example_es ?? null, example_en: example_en ?? null }))

export default function Landing() {
  return (
    <div className="lp-wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── HERO ── */}
      <header className="lp-hero">
        <div style={{ position: 'absolute', right: '-60px', top: '-20px', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(125,120,214,.28),transparent 62%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '20%', top: '180px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(213,154,43,.16),transparent 65%)', pointerEvents: 'none' }} />

        <div className="lp-hero-grid">
          <div>
            <h1 className="lp-h1">
              The most common<br />Spanish words.
              <span className="lp-h1-accent"><span>Learn them.</span> Understand Spanish.</span>
            </h1>
            <p style={{ ...LEAD, maxWidth: '470px', margin: '0 0 30px', fontSize: '18px' }}>
              Most apps teach words you&apos;ll rarely use. We rank the 1,500 words that appear most in real Spanish, so every card you learn is one you&apos;ll actually hear. The first 100 cover about half of everything.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '26px', flexWrap: 'wrap' }}>
              <Link href="/study" className="btn-gold lp-btn">Start the first 100 free</Link>
              <Link href="/level-test" className="lp-btn-outline">Take the level test</Link>
            </div>
            <ul className="lp-proof">
              <li><Check c="#2f7d5c" /> No account</li>
              <li><Check c="#2f7d5c" /> Native audio</li>
              <li><Check c="#2f7d5c" /> Spaced repetition</li>
            </ul>
          </div>

          <div className="lp-hero-visual">
            <HeroCard />
          </div>
        </div>
      </header>

      {/* ── COVERAGE ── */}
      <section className="lp-section">
        <h2 style={{ ...H2, maxWidth: '640px', marginBottom: '12px' }}>How many Spanish words do you actually need?</h2>
        <p style={{ ...LEAD, marginBottom: '36px' }}>Fewer than you think. Spanish leans hard on a small core — nail the right few hundred and you understand most of what you hear.</p>
        <div style={{ background: 'linear-gradient(165deg,#faf6ee,#f1ece2)', border: '1px solid rgba(33,29,63,.08)', borderRadius: '22px', padding: '34px' }}>
          <div className="lp-scale" aria-label="Comprehension by number of words learned">
            <div className="lp-scale-track"><div /></div>
            {[[100, 50], [500, 67], [1000, 74], [1500, 80]].map(([w, pct]) => (
              <div key={w} className="lp-scale-tick" style={{ left: `${(w / 1500) * 100}%` }}>
                <span className="lp-scale-pct tabular">{pct}%</span>
                <span className="lp-scale-words tabular">{w.toLocaleString()} words</span>
              </div>
            ))}
          </div>
          <div className="lp-3">
            <CoverageTile tag="TOURIST · ~250 WORDS" tagColor="#2f7d5c" border="rgba(47,125,92,.2)" title="Get by on a trip" body="Order food, ask directions, handle a hotel. Enough to survive and be polite." />
            <CoverageTile tag="CONVERSATIONAL · ~800" tagColor="#d59a2b" border="rgba(213,154,43,.22)" title="Hold a chat" body="Follow everyday conversation, tell stories, express opinions without stalling." />
            <CoverageTile tag="FLUENT BASE · 1,500" tagColor="#6b66c9" border="rgba(107,102,201,.28)" bg="linear-gradient(160deg,#ecebf7,#f6f2e9)" title="Read & understand" body="Comfortably read simple books, news and subtitles. The foundation everything builds on." />
          </div>
        </div>
      </section>

      {/* ── THE LIST ── */}
      <section id="word-list" className="lp-section">
        <h2 style={{ ...H2, maxWidth: '660px', marginBottom: '12px' }}>The 1,500 most common words, ranked by how often they appear.</h2>
        <p style={{ ...LEAD, marginBottom: '28px' }}>
          No guessing which words matter. We counted them across millions of words of real Spanish and put the most useful ones first — or read exactly <Link href="/blog/how-many-spanish-words-to-be-fluent" style={{ color: 'var(--synapse)', fontWeight: 500, textDecoration: 'underline' }}>how many Spanish words you need to be fluent</Link>.
        </p>
        <HomepageWordPreview words={previewWords} total={words.length} />
        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <Link href="/words/most-common-spanish-words" style={{ color: 'var(--synapse)', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
            See the full interactive list →
          </Link>
        </div>
      </section>

      {/* ── WHY FREQUENCY (dark) ── */}
      <section style={{ background: DARK_GRAD, borderRadius: '48px 48px 0 0', position: 'relative', overflow: 'hidden', marginTop: '20px' }}>
        <div style={{ position: 'absolute', right: '8%', top: '-40px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(213,154,43,.22),transparent 65%)' }} />
        <div style={{ position: 'absolute', left: 0, bottom: '-120px', width: '460px', height: '460px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(125,120,214,.32),transparent 68%)' }} />
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '80px 32px', position: 'relative' }} className="lp-pad">
          <h2 style={{ ...H2, color: '#fff', fontSize: 'clamp(30px,4.4vw,44px)', maxWidth: '660px', marginBottom: '50px' }}>
            Other lists teach you <em style={{ color: '#f0c56c' }}>jirafa</em> before <em style={{ color: '#8b86e0' }}>pero</em>. This one doesn&apos;t.
          </h2>
          <div className="lp-3">
            <FreqCard stat="50%" statColor="#f0c56c" title="Half of everything, from 100 words" body="The 100 most common words make up about half of all spoken Spanish. Learn those first and comprehension jumps fast." />
            <FreqCard stat="Zipf" statColor="#8b86e0" title="Word frequency isn't random" body="It follows a steep curve — a handful of words do most of the work. We order your learning to match that curve exactly." />
            <FreqCard stat="~10k" statColor="#5aa77e" title="You don't need most of them" body="A native knows ~10,000+ words. You'll be understood — and understand — with a fraction, if they're the right fraction." />
          </div>
        </div>
      </section>

      {/* ── MILESTONES ── */}
      <section className="lp-section" style={{ paddingTop: '80px' }}>
        <h2 style={{ ...H2, marginBottom: '12px' }}>Real milestones. No fake progress.</h2>
        <p style={{ ...LEAD, marginBottom: '36px' }}>Every word you learn moves your comprehension a measurable step. Here&apos;s what each stage gets you.</p>
        <div className="lp-4">
          <Milestone grad="linear-gradient(135deg,#2f7d5c,#3f9b73)" iconColor="#fff" border="rgba(47,125,92,.22)" title="First words" meta="first 100 · free, no account" metaColor="#2f7d5c" body="The essentials — the words in almost every sentence."
            icon={<path d="M20 6 9 17l-5-5" />} />
          <Milestone grad="linear-gradient(135deg,#e7b45f,#d59a2b)" iconColor="#fff" title="Basic conversation" meta="at 500 words" body="Follow simple stories and everyday back-and-forth."
            icon={<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-9A8.4 8.4 0 1 1 21 11.5z" />} />
          <Milestone grad="linear-gradient(135deg,#6b66c9,#413a78)" iconColor="#fff" title="Reading ready" meta="at 900 words" body="Read news, subtitles and short books with ease."
            icon={<path d="M4 5a2 2 0 0 1 2-2h6v18H6a2 2 0 0 1-2-2zM20 5a2 2 0 0 0-2-2h-6v18h6a2 2 0 0 0 2-2z" />} />
          <Milestone grad="linear-gradient(135deg,#211d3f,#4a4382)" iconColor="#f3d38a" title="Fluency base" meta="at 1,500 words" body="The complete core — the platform for real fluency."
            icon={<><path d="M8 21h8M12 17v4M5 4h14v4a7 7 0 0 1-14 0zM5 6H3a2 2 0 0 0 2 2M19 6h2a2 2 0 0 1-2 2" /></>} />
        </div>
      </section>

      {/* ── HOW IT WORKS (dark) ── */}
      <section className="lp-dark-round" style={{ background: DARK_GRAD, maxWidth: '1180px', margin: '40px auto' }}>
        <div style={{ position: 'absolute', left: '10%', top: '-60px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(213,154,43,.2),transparent 65%)' }} />
        <div style={{ position: 'absolute', right: '-40px', bottom: '-80px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(125,120,214,.32),transparent 68%)' }} />
        <div style={{ padding: '70px 60px', position: 'relative' }} className="lp-how-pad">
          <h2 style={{ ...H2, color: '#fff', marginBottom: '46px' }}>Three things. In the right order.</h2>
          <div className="lp-3">
            <Step n="01" title="Learn by frequency" body="Cards come in order of how often each word appears — most useful first, always." />
            <Step n="02" title="Spaced repetition" body="Each word comes back exactly when you're about to forget it — the science-backed way to make it stick." />
            <Step n="03" title="Track comprehension" body="See exactly what percentage of real Spanish you can now understand — not a made-up score." />
          </div>
          <div style={{ marginTop: '44px' }}>
            <Link href="/study" className="btn-gold lp-btn">Start the first 100 free</Link>
          </div>
        </div>
      </section>

      {/* ── QR / MOBILE (dark) ── */}
      <section style={{ background: '#1b1836', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '20%', top: '-40px', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(125,120,214,.28),transparent 66%)' }} />
        <div className="lp-qr" style={{ maxWidth: '1180px', margin: '0 auto', padding: '70px 32px' }}>
          <div style={{ background: '#faf6ee', borderRadius: '22px', padding: '20px', boxShadow: '0 24px 64px -20px rgba(0,0,0,.5)' }}>
            <Image src="/qr-practice.png" alt="QR code to open Spanish vocabulary practice on your phone" width={168} height={168} style={{ display: 'block', borderRadius: '8px' }} />
          </div>
          <div>
            <h2 style={{ ...H2, color: '#fff', marginBottom: '16px' }}>Scan. Practice.<br />Right in your browser.</h2>
            <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'rgba(255,255,255,.6)', maxWidth: '420px', margin: '0 0 22px' }}>Point your phone at the code and start reviewing in seconds. Your progress is saved right on your phone.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['No download, no account', 'Native audio for every word', 'Progress saved on your device'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '11px', fontWeight: 500, fontSize: '14px', color: 'rgba(255,255,255,.85)' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(47,125,92,.25)', color: '#5aa77e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check c="#5aa77e" /></span>{t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="lp-section" style={{ paddingTop: '80px' }}>
        <h2 style={{ ...H2, marginBottom: '36px' }}>Frequency-first vs. everything else.</h2>
        <div className="lp-2">
          <div style={{ background: 'linear-gradient(160deg,#ecebf7,#f6f2e9)', border: '1px solid rgba(107,102,201,.25)', borderRadius: '20px', padding: '30px' }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: '19px', color: 'var(--deep-mind)', marginBottom: '20px' }}>Most Common Spanish</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              {['Learn the highest-impact words first', 'Comprehension you can measure', 'Native audio and real example sentences', 'Calm, no dark patterns'].map(t => (
                <div key={t} style={{ display: 'flex', gap: '11px', fontWeight: 500, fontSize: '14px', color: 'var(--deep-mind)' }}>
                  <span style={{ flex: 'none', width: '22px', height: '22px', borderRadius: '50%', background: '#2f7d5c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check /></span>{t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--cream-dark)', border: '1px solid rgba(33,29,63,.1)', borderRadius: '20px', padding: '30px' }}>
            <div style={{ fontWeight: 600, fontSize: '17px', color: '#8b8676', marginBottom: '22px' }}>Typical apps</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              {['Random themed word lists', 'Vanity streaks & gems', 'You learn "giraffe" in week one', 'Notifications engineered to nag'].map(t => (
                <div key={t} style={{ display: 'flex', gap: '11px', fontWeight: 500, fontSize: '14px', color: '#8b8676' }}>
                  <span style={{ flex: 'none', width: '22px', height: '22px', borderRadius: '50%', background: '#d8cfbe', color: '#7a7264', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </span>{t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="lp-faq" style={{ maxWidth: '820px', margin: '0 auto', padding: '60px 32px 40px' }}>
        <h2 style={{ ...H2, marginBottom: '30px' }}>Frequently asked.</h2>
        {[
          { q: 'What are the most common Spanish words?', a: 'They’re the words that appear most often across huge amounts of real Spanish — words like que, de, no and ser. A few hundred of them make up most of what you’ll ever hear or read.' },
          { q: 'How many Spanish words do I need to be conversational?', a: 'Around 800 of the most common words is enough to follow and take part in everyday conversation. We get you there in the most efficient order.' },
          { q: 'How many words to be fluent?', a: 'A solid base is about 1,500 core words — that’s the full list. From there, reading and listening naturally grow your vocabulary further.' },
          { q: 'Why learn by frequency instead of by topic?', a: 'Topic lists waste time on rare words. Frequency puts the highest-impact words first, so your comprehension climbs as fast as possible from day one.' },
          { q: 'Is it really free?', a: 'Yes. The first 100 words need nothing at all — no account, no card. The other 1,400 are free too; we just ask for your email to unlock them.' },
          { q: 'Do I need an account?', a: 'No. Open the flashcards and start. Your progress is saved in the browser you study in.' },
        ].map(({ q, a }) => (
          <details key={q}>
            <summary>{q}<span className="faqp">+</span></summary>
            <div className="faqa">{a}</div>
          </details>
        ))}
      </section>

      {/* ── GUIDES & WORD LISTS ── */}
      <section className="lp-section" style={{ paddingTop: '60px' }}>
        <h2 style={{ ...H2, marginBottom: '28px' }}>Word lists & guides.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
          {[
            { href: '/words', t: 'All Spanish word lists', d: 'Frequency-ranked vocabulary hub' },
            { href: '/words/top-100-spanish-words', t: 'Top 100 Spanish words', d: '~50% of everyday speech' },
            { href: '/words/most-common-spanish-verbs', t: 'Most common Spanish verbs', d: 'The 150 verbs that matter most' },
            { href: '/words/spanish-frequency-list', t: 'Frequency list & method', d: 'How coverage really works' },
            { href: '/blog/how-many-spanish-words-to-be-fluent', t: 'How many words to be fluent?', d: 'The real answer' },
            { href: '/blog/best-podcasts-for-learning-spanish', t: 'Best podcasts to learn Spanish', d: 'Ranked by level' },
          ].map((c) => (
            <Link key={c.href} href={c.href} style={{
              display: 'block', textDecoration: 'none',
              background: 'var(--white-matter)', borderRadius: '14px',
              border: '1px solid rgba(28,26,58,0.09)', padding: '18px 20px',
            }}>
              <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--deep-mind)', marginBottom: '4px' }}>{c.t}</div>
              <div style={{ fontSize: '13px', fontWeight: 300, color: 'var(--cortex)' }}>{c.d}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="lp-section" style={{ paddingTop: '40px' }}>
        <div style={{ background: 'linear-gradient(135deg,#1b1836 0%,#2c2658 55%,#413a78 100%)', borderRadius: '32px', padding: '72px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: '15%', top: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(213,154,43,.28),transparent 66%)' }} />
          <div style={{ position: 'absolute', right: '12%', bottom: '-90px', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(125,120,214,.4),transparent 68%)' }} />
          <div style={{ position: 'relative' }}>
            <h2 className="lp-final-h">
              Start with the <span style={{ color: '#f0c56c' }}>most common words.</span><br />Learn Spanish that sticks.
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,.66)', margin: '0 0 30px' }}>The first 100 words are free, no account. 1,500 words in the right order.</p>
            <Link href="/study" className="btn-gold lp-btn lp-btn-lg">Start the first 100 free</Link>
            <div style={{ fontWeight: 500, fontSize: '13px', color: 'rgba(255,255,255,.5)', marginTop: '16px' }}>The app that respects your brain more than your screen time.</div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── Sub-components ── */

function CoverageTile({ tag, tagColor, border, bg = '#f6f2e9', title, body }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '16px', padding: '22px' }}>
      <div style={{ fontWeight: 600, fontSize: '10px', letterSpacing: '.12em', color: tagColor, marginBottom: '8px' }}>{tag}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: '18px', color: 'var(--deep-mind)', marginBottom: '6px' }}>{title}</div>
      <div style={{ fontSize: '13px', lineHeight: 1.55, color: '#8b8676' }}>{body}</div>
    </div>
  )
}

function FreqCard({ stat, statColor, gradient, title, body }) {
  return (
    <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '18px', padding: '26px' }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: '44px', lineHeight: 1, letterSpacing: '-1px', marginBottom: '14px', ...(gradient ? { background: statColor, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' } : { color: statColor }) }}>{stat}</div>
      <div style={{ fontWeight: 600, fontSize: '15px', color: '#fff', marginBottom: '6px' }}>{title}</div>
      <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(255,255,255,.55)' }}>{body}</div>
    </div>
  )
}

function Milestone({ grad, iconColor, border = 'rgba(33,29,63,.08)', icon, title, meta, metaColor = '#a49c8c', body }) {
  return (
    <div style={{ background: 'linear-gradient(165deg,#faf6ee,#f1ece2)', border: `1px solid ${border}`, borderRadius: '18px', padding: '22px' }}>
      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor, marginBottom: '16px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
      </div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: '17px', color: 'var(--deep-mind)' }}>{title}</div>
      <div style={{ fontWeight: 600, fontSize: '12px', color: metaColor, margin: '4px 0 8px' }}>{meta}</div>
      <div style={{ fontSize: '13px', lineHeight: 1.55, color: '#8b8676' }}>{body}</div>
    </div>
  )
}

function Step({ n, title, body }) {
  return (
    <div>
      <div style={{ fontWeight: 600, fontSize: '13px', color: '#e6c079', marginBottom: '14px' }}>{n}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: '20px', color: '#fff', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '14px', lineHeight: 1.65, color: 'rgba(255,255,255,.6)' }}>{body}</div>
    </div>
  )
}
