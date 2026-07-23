import Image from 'next/image'
import Link from 'next/link'
import HomepageWordPreview from '@/components/HomepageWordPreview'

export const metadata = {
  title: 'Most Common Spanish Words — Frequency-Ranked Vocabulary List',
  description: 'The most common Spanish words, ranked by real-world frequency. Master them and understand the vast majority of spoken Spanish. Free to start — no gamification.',
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

const SERIF = "'Fraunces', serif"
const EYE = { fontWeight: 600, fontSize: '11px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--synapse)', marginBottom: '12px' }
const H2 = { fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(30px, 4vw, 42px)', lineHeight: 1.08, letterSpacing: '-1px', color: 'var(--deep-mind)', margin: 0 }
const LEAD = { fontSize: '16px', lineHeight: 1.6, color: '#6b6558', maxWidth: '560px' }
const DARK_GRAD = 'linear-gradient(150deg,#1b1836 0%,#2a2453 55%,#3a3470 100%)'

function Check({ c = '#fff', s = 13 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
  )
}

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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--fog)', borderRadius: '30px', padding: '7px 14px', fontWeight: 600, fontSize: '11px', letterSpacing: '.1em', color: '#4f4aa8', marginBottom: '22px' }}>
              FREQUENCY-FIRST · SPANISH
            </div>
            <h1 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(44px, 6vw, 62px)', lineHeight: 1.0, letterSpacing: '-2px', color: 'var(--deep-mind)', margin: '0 0 6px' }}>
              The most common<br />Spanish words.
            </h1>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(44px, 6vw, 62px)', lineHeight: 1.0, letterSpacing: '-2px', margin: '0 0 24px' }}>
              <span style={{ background: 'linear-gradient(120deg,#6b66c9,#413a78)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', borderBottom: '3px solid #d59a2b', paddingBottom: '2px' }}>Learn them.</span><br />
              <span style={{ color: 'var(--deep-mind)' }}>Understand Spanish.</span>
            </div>
            <p style={{ ...LEAD, maxWidth: '460px', margin: '0 0 30px' }}>
              Most apps teach words you&apos;ll rarely use. We rank the 1,500 words that appear most in real Spanish — so every card you learn is one you&apos;ll actually hear. The first 500 cover about half of everything.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '38px', flexWrap: 'wrap' }}>
              <a href="/practice" style={{ background: 'linear-gradient(135deg,#f3d38a,#d59a2b)', color: '#211d3f', fontWeight: 700, fontSize: '15px', padding: '15px 28px', borderRadius: '12px', boxShadow: '0 12px 28px -12px rgba(213,154,43,.7)', textDecoration: 'none' }}>Start free →</a>
              <Link href="/level-test" style={{ border: '1px solid rgba(33,29,63,.2)', color: 'var(--deep-mind)', fontWeight: 600, fontSize: '15px', padding: '15px 26px', borderRadius: '12px', textDecoration: 'none' }}>Take the level test</Link>
            </div>
            <div style={{ display: 'flex', gap: '34px', flexWrap: 'wrap' }}>
              <HeroStat num="1,500" label="core words" />
              <HeroStat num="12 min" label="a day" divider />
              <HeroStat num="Free" label="no card needed" numColor="#2f7d5c" divider />
            </div>
          </div>

          {/* Hero flashcard */}
          <div className="lp-hero-visual" style={{ position: 'relative', height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '340px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(125,120,214,.4),transparent 68%)' }} />
            <div style={{ position: 'relative', width: '330px' }}>
              <div style={{ transform: 'rotate(-5deg)', background: 'linear-gradient(135deg,#1b1836 0%,#2c2658 55%,#413a78 100%)', borderRadius: '22px', padding: '36px 32px', color: '#fff', boxShadow: '0 40px 80px -30px rgba(33,29,63,.7)', animation: 'floaty 6s ease-in-out infinite', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(213,154,43,.35),transparent 68%)' }} />
                <div style={{ position: 'relative' }}>
                  <div style={{ fontWeight: 600, fontSize: '10px', letterSpacing: '.18em', color: 'rgba(255,255,255,.4)', marginBottom: '26px' }}>ESPAÑOL · #1</div>
                  <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: '60px', lineHeight: 1, letterSpacing: '-2px' }}>ser</div>
                  <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: '18px', color: 'rgba(255,255,255,.55)', marginTop: '10px' }}>to be · verb</div>
                  <div style={{ marginTop: '34px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, fontSize: '11px', color: 'rgba(255,255,255,.45)', marginBottom: '6px' }}>
                      <span>Learned</span><span>appears in ~1 of 25 words</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,.14)', borderRadius: '3px' }}>
                      <div style={{ width: '88%', height: '100%', background: 'linear-gradient(90deg,#f3d38a,#d59a2b)', borderRadius: '3px' }} />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ position: 'absolute', right: '-24px', bottom: '-12px', background: 'var(--white-matter)', border: '1px solid rgba(33,29,63,.08)', borderRadius: '16px', padding: '14px 18px', boxShadow: '0 20px 40px -18px rgba(33,29,63,.4)', animation: 'floaty2 5s ease-in-out infinite', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '26px', color: '#2f7d5c' }}>74%</div>
                <div style={{ fontWeight: 500, fontSize: '10px', color: '#a49c8c', letterSpacing: '.04em' }}>of daily Spanish<br />you can now read</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── COVERAGE ── */}
      <section className="lp-section">
        <div style={EYE}>COVERAGE</div>
        <h2 style={{ ...H2, maxWidth: '640px', marginBottom: '12px' }}>How many Spanish words do you actually need?</h2>
        <p style={{ ...LEAD, marginBottom: '36px' }}>Fewer than you think. Spanish leans hard on a small core — nail the right few hundred and you understand most of what you hear.</p>
        <div style={{ background: 'linear-gradient(165deg,#faf6ee,#f1ece2)', border: '1px solid rgba(33,29,63,.08)', borderRadius: '22px', padding: '34px' }}>
          <div style={{ position: 'relative', height: '12px', background: 'var(--fog)', borderRadius: '6px', margin: '0 6px 8px' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '100%', background: 'linear-gradient(90deg,#2f7d5c,#d59a2b 55%,#6b66c9)', borderRadius: '6px' }} />
            <div style={{ position: 'absolute', left: '9%', top: '50%', transform: 'translate(-50%,-50%)', width: '20px', height: '20px', borderRadius: '50%', background: '#211d3f', border: '3px solid #faf6ee', boxShadow: '0 2px 8px rgba(33,29,63,.4)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, fontSize: '11px', color: '#a49c8c', margin: '0 6px 26px' }}>
            <span style={{ color: 'var(--deep-mind)', fontWeight: 600 }}>You&apos;re here · 133 words</span><span>1,500</span>
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
        <div style={EYE}>THE LIST</div>
        <h2 style={{ ...H2, maxWidth: '660px', marginBottom: '12px' }}>The 1,500 most common words, ranked by how often they appear.</h2>
        <p style={{ ...LEAD, marginBottom: '28px' }}>
          No guessing which words matter. We counted them across millions of words of real Spanish and put the most useful ones first — or read exactly <Link href="/blog/how-many-spanish-words-to-be-fluent" style={{ color: 'var(--synapse)', fontWeight: 500, textDecoration: 'underline' }}>how many Spanish words you need to be fluent</Link>.
        </p>
        <HomepageWordPreview />
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
          <div style={{ ...EYE, color: '#e6c079' }}>WHY FREQUENCY</div>
          <h2 style={{ ...H2, color: '#fff', fontSize: 'clamp(30px,4.4vw,44px)', maxWidth: '660px', marginBottom: '50px' }}>
            Other lists teach you <em style={{ background: 'linear-gradient(120deg,#f3d38a,#d59a2b)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>jirafa</em> before <em style={{ color: '#8b86e0' }}>pero</em>. This one doesn&apos;t.
          </h2>
          <div className="lp-3">
            <FreqCard stat="50%" statColor="linear-gradient(120deg,#f3d38a,#d59a2b)" gradient title="Half of everything, from 500 words" body="The 500 most common words make up about half of all spoken Spanish. Learn those first and comprehension jumps fast." />
            <FreqCard stat="Zipf" statColor="#8b86e0" title="Word frequency isn't random" body="It follows a steep curve — a handful of words do most of the work. We order your learning to match that curve exactly." />
            <FreqCard stat="~10k" statColor="#5aa77e" title="You don't need most of them" body="A native knows ~10,000+ words. You'll be understood — and understand — with a fraction, if they're the right fraction." />
          </div>
        </div>
      </section>

      {/* ── MILESTONES ── */}
      <section className="lp-section" style={{ paddingTop: '80px' }}>
        <div style={EYE}>PROGRESS</div>
        <h2 style={{ ...H2, marginBottom: '12px' }}>Real milestones. No fake progress.</h2>
        <p style={{ ...LEAD, marginBottom: '36px' }}>Every word you learn moves you down a real path — and unlocks articles, mini-podcasts and story series matched to your level.</p>
        <div className="lp-4">
          <Milestone grad="linear-gradient(135deg,#2f7d5c,#3f9b73)" iconColor="#fff" border="rgba(47,125,92,.22)" title="First words" meta="0–133 · you're here" metaColor="#2f7d5c" body="The essentials — the words in almost every sentence."
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
          <div style={{ ...EYE, color: '#e6c079' }}>HOW IT WORKS</div>
          <h2 style={{ ...H2, color: '#fff', marginBottom: '46px' }}>Three things. In the right order.</h2>
          <div className="lp-3">
            <Step n="01" title="Learn by frequency" body="Cards come in order of how often each word appears — most useful first, always." />
            <Step n="02" title="Spaced repetition" body="Each word comes back exactly when you're about to forget it — the science-backed way to make it stick." />
            <Step n="03" title="Track comprehension" body="See exactly what percentage of real Spanish you can now understand — not a made-up score." />
          </div>
          <div style={{ marginTop: '44px' }}>
            <a href="/practice" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#f3d38a,#d59a2b)', color: '#211d3f', fontWeight: 700, fontSize: '15px', padding: '15px 28px', borderRadius: '12px', textDecoration: 'none' }}>Start free — takes 10 seconds</a>
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
            <div style={{ ...EYE, color: '#e6c079' }}>NO APP STORE, NO INSTALL</div>
            <h2 style={{ ...H2, color: '#fff', marginBottom: '16px' }}>Scan. Practice.<br />Right in your browser.</h2>
            <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'rgba(255,255,255,.6)', maxWidth: '420px', margin: '0 0 22px' }}>Point your phone at the code and start reviewing in seconds — your streak and progress sync everywhere.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Works offline once loaded', 'Syncs with your desktop instantly', 'No download, ever'].map(t => (
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
        <div style={EYE}>COMPARE</div>
        <h2 style={{ ...H2, marginBottom: '36px' }}>Frequency-first vs. everything else.</h2>
        <div className="lp-2">
          <div style={{ background: 'linear-gradient(160deg,#ecebf7,#f6f2e9)', border: '1px solid rgba(107,102,201,.25)', borderRadius: '20px', padding: '30px' }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: '19px', color: 'var(--deep-mind)', marginBottom: '20px' }}>Most Common Spanish</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              {['Learn the highest-impact words first', 'Comprehension you can measure', 'Reading unlocked as you go', 'Calm, no dark patterns'].map(t => (
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
        <div style={EYE}>QUESTIONS</div>
        <h2 style={{ ...H2, marginBottom: '30px' }}>Frequently asked.</h2>
        {[
          { q: 'What are the most common Spanish words?', a: 'They’re the words that appear most often across huge amounts of real Spanish — words like que, de, no and ser. A few hundred of them make up most of what you’ll ever hear or read.' },
          { q: 'How many Spanish words do I need to be conversational?', a: 'Around 800 of the most common words is enough to follow and take part in everyday conversation. We get you there in the most efficient order.' },
          { q: 'How many words to be fluent?', a: 'A solid base is about 1,500 core words — that’s the full list. From there, reading and listening naturally grow your vocabulary further.' },
          { q: 'Why learn by frequency instead of by topic?', a: 'Topic lists waste time on rare words. Frequency puts the highest-impact words first, so your comprehension climbs as fast as possible from day one.' },
          { q: 'Is it really free?', a: 'Yes — you can start learning for free, no card required. It’s built to respect your time, not monetise your attention.' },
        ].map(({ q, a }) => (
          <details key={q}>
            <summary>{q}<span className="faqp">+</span></summary>
            <div className="faqa">{a}</div>
          </details>
        ))}
      </section>

      {/* ── GUIDES & WORD LISTS ── */}
      <section className="lp-section" style={{ paddingTop: '60px' }}>
        <div style={EYE}>EXPLORE</div>
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
            <h2 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(34px,5vw,50px)', lineHeight: 1.05, letterSpacing: '-1.5px', color: '#fff', margin: '0 0 8px' }}>
              Start with the <span style={{ background: 'linear-gradient(120deg,#f3d38a,#d59a2b)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>most common words.</span>
            </h2>
            <h2 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(34px,5vw,50px)', lineHeight: 1.05, letterSpacing: '-1.5px', color: '#fff', margin: '0 0 22px' }}>Learn Spanish that sticks.</h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.6)', margin: '0 0 30px' }}>Free to start. 1,500 words in the right order.</p>
            <a href="/practice" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#f3d38a,#d59a2b)', color: '#211d3f', fontWeight: 700, fontSize: '16px', padding: '17px 38px', borderRadius: '13px', boxShadow: '0 16px 36px -14px rgba(213,154,43,.7)', textDecoration: 'none' }}>Sign up free — start learning now</a>
            <div style={{ fontWeight: 500, fontSize: '12px', color: 'rgba(255,255,255,.4)', marginTop: '16px' }}>No card needed · The app that respects your brain more than your screen time.</div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── Sub-components ── */

function HeroStat({ num, label, numColor = 'var(--deep-mind)', divider }) {
  return (
    <div style={divider ? { borderLeft: '1px solid rgba(33,29,63,.12)', paddingLeft: '34px' } : undefined}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: '26px', letterSpacing: '-0.5px', color: numColor }}>{num}</div>
      <div style={{ fontWeight: 500, fontSize: '12px', color: '#a49c8c' }}>{label}</div>
    </div>
  )
}

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
