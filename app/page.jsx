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

function Wave({ from, to, height = 90, shape = 'dome' }) {
  const h = height
  let d
  if (shape === 'dome') {
    d = `M0,${h} C480,0 960,0 1440,${h} L1440,${h} L0,${h} Z`
  } else if (shape === 'swave') {
    d = `M0,${h} C320,0 640,${h} 1080,${h * 0.15} C1260,0 1380,${h * 0.4} 1440,${h} L1440,${h} L0,${h} Z`
  } else if (shape === 'tilt') {
    d = `M0,${h * 0.1} C480,${h * 0.05} 900,${h * 0.6} 1440,${h} L1440,${h} L0,${h} Z`
  } else if (shape === 'shallow') {
    d = `M0,${h} C480,${h * 0.2} 960,${h * 0.2} 1440,${h} L1440,${h} L0,${h} Z`
  }
  return (
    <div style={{ background: from, lineHeight: 0, display: 'block', marginBottom: '-1px' }}>
      <svg viewBox={`0 0 1440 ${h}`} style={{ width: '100%', display: 'block' }} preserveAspectRatio="none" fill="none">
        <path d={d} fill={to} />
      </svg>
    </div>
  )
}

export default function Landing() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── HERO ── */}
      <section className="hero-section">
        {/* Decorative SVGs — hidden on mobile via .hero-deco-svg */}
        <svg className="hero-deco-svg" style={{position:'absolute',top:'120px',left:'52px',pointerEvents:'none'}} width="72" height="40" viewBox="0 0 72 40" fill="none">
          <path d="M4 32 Q18 4 36 20 Q54 36 68 8" stroke="#B07FA8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <svg className="hero-deco-svg" style={{position:'absolute',top:'200px',left:'180px',pointerEvents:'none'}} width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="20" stroke="#534AB7" strokeWidth="1" strokeDasharray="4 3"/>
        </svg>
        <svg className="hero-deco-svg" style={{position:'absolute',top:'155px',right:'52px',pointerEvents:'none'}} width="52" height="52" viewBox="0 0 52 52" fill="none">
          <circle cx="26" cy="26" r="24" stroke="#B07FA8" strokeWidth="1" strokeDasharray="3 4"/>
        </svg>
        <svg className="hero-deco-svg" style={{position:'absolute',top:'420px',right:'48px',pointerEvents:'none'}} width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 1 L12 7 L19 7 L13 11 L16 18 L10 14 L4 18 L7 11 L1 7 L8 7Z" fill="#EF9F27"/>
        </svg>

        <div className="hero-inner">
          <div>
            <div style={{
              display: 'inline-block', fontSize: '12px', fontWeight: 500,
              letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--synapse)',
              marginBottom: '20px', animation: 'fadeUp .6s .0s ease both',
            }}>
              Frequency-ranked · Free to start
            </div>

            <h1 style={{
              fontFamily: "'Fraunces', serif", fontWeight: 900,
              fontSize: 'clamp(48px, 6vw, 78px)',
              lineHeight: 1.0, letterSpacing: '-2.5px', color: 'var(--deep-mind)',
              marginBottom: '24px', animation: 'fadeUp .7s .05s ease both',
            }}>
              <div>The most common</div>
              <div style={{display:'inline-flex',flexDirection:'column',alignItems:'flex-start'}}>
                <span>Spanish words.</span>
                <svg viewBox="0 0 360 14" fill="none" style={{width:'100%',marginTop:'6px'}} preserveAspectRatio="none">
                  <path d="M2 10 C90 3 220 2 358 7" stroke="#534AB7" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{color:'var(--synapse)'}}>Learn them. Understand Spanish.</div>
            </h1>

            <p style={{
              fontSize: '17px', fontWeight: 300, color: 'var(--deep-mind)',
              lineHeight: 1.65, maxWidth: '440px', marginBottom: '36px',
              animation: 'fadeUp .7s .15s ease both',
            }}>
              Other apps teach words at random. This one starts with the most common Spanish words — the few hundred that appear most in real speech — so you understand around 80% of everyday conversations with your first 1,500.
            </p>

            <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'48px',animation:'fadeUp .7s .25s ease both',flexWrap:'wrap'}}>
              <a href="/practice" className="btn-primary">Start free →</a>
              <a href="#word-list" className="btn-ghost">See the word list ↓</a>
            </div>

            <div style={{display:'flex',alignItems:'center',gap:'24px',animation:'fadeUp .7s .35s ease both',flexWrap:'wrap'}}>
              <HeroStat num="1,500 words" label="≈ 80% of spoken Spanish"/>
              <div style={{width:'0.5px',height:'36px',background:'rgba(28,26,58,0.15)'}}/>
              <HeroStat num="15 min" label="a day, that's it"/>
              <div style={{width:'0.5px',height:'36px',background:'rgba(28,26,58,0.15)'}}/>
              <HeroStat num="Free" label="to start, no card"/>
            </div>
          </div>

          <div style={{animation:'fadeUp .8s .15s ease both',position:'relative'}}>
            <WordPoster/>
          </div>
        </div>
      </section>

      {/* Wave cream → white-matter */}
      <Wave from="var(--cream)" to="var(--white-matter)" height={55} shape="dome"/>

      {/* ── HOW MANY WORDS ── */}
      <section className="page-section" style={{ background: 'var(--white-matter)', padding: '80px 0 60px' }}>
        <div className="section-inner">
          <div className="s-eye">Coverage milestones</div>
          <h2 className="s-title">
            How many Spanish words<br/>do you actually need?
          </h2>
          <p className="s-body" style={{ marginBottom: '48px' }}>
            Language isn't evenly distributed. A small number of words appear again and again — master those and you unlock the majority of real Spanish.
          </p>

          <div className="coverage-box" style={{
            background: 'var(--cream)', borderRadius: '20px',
            padding: '32px 36px', border: '0.5px solid rgba(28,26,58,0.08)', marginBottom: '20px',
          }}>
            {/* Track */}
            <div style={{ height: '12px', background: 'var(--cream-dark)', borderRadius: '99px', position: 'relative', marginBottom: '32px' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '95%', background: 'linear-gradient(90deg, var(--mauve) 0%, var(--synapse) 55%, #2D7A5F 100%)', borderRadius: '99px' }}/>
            </div>
            <div className="coverage-tiles">
              <MilestoneTile pct="Tourist" sub="~250 words" color="var(--mauve)" bg="#EDD8EA" border="rgba(176,127,168,0.2)"
                desc="Order food, ask for directions. You're transacting, not conversing." />
              <MilestoneTile pct="Conversational" sub="~500 words" color="var(--synapse)" bg="#E8E6F8" border="rgba(83,74,183,0.2)"
                desc="Hold a basic chat about your day, work, family. Around 63% of everyday Spanish." />
              <MilestoneTile pct="Fluent" sub="~1,500 words" color="var(--synapse)" bg="#C8C2F0" border="rgba(83,74,183,0.3)" featured
                desc="Understand ~80% of spoken Spanish. Follow shows, chat naturally." />
              <MilestoneTile pct="Near-native" sub="~3,000 words" color="var(--signal)" bg="var(--white-matter)" border="rgba(28,26,58,0.08)"
                desc="Context-guessing works. Jokes land. 95%+ comprehension." />
            </div>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--cortex)', textAlign: 'center' }}>
            Based on lexical frequency research. Coverage figures are estimates from spoken Spanish corpus data.
          </p>
        </div>
      </section>

      {/* Wave white-matter → cream */}
      <Wave from="var(--white-matter)" to="var(--cream)" height={45} shape="shallow"/>

      {/* ── WORD LIST PREVIEW ── */}
      <section id="word-list" className="page-section" style={{ background: 'var(--cream)', padding: '80px 0' }}>
        <div className="section-inner">
          <div className="s-eye">The frequency list</div>
          <h2 className="s-title">
            The most common Spanish words,<br/>ranked by how often they appear
          </h2>
          <p className="s-body" style={{ marginBottom: '36px' }}>
            Not alphabetical. Not by theme. Ranked by real-world usage — so every word you learn is more useful than the last. Click any word to see it in a sentence, or read exactly <Link href="/blog/how-many-spanish-words-to-be-fluent" style={{ color: 'var(--synapse)', fontWeight: 500, textDecoration: 'underline' }}>how many Spanish words you need to be fluent</Link>.
          </p>

          <HomepageWordPreview />

          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <Link href="/words/most-common-spanish-words" className="btn-ghost" style={{ fontSize: '14px' }}>
              View full interactive list →
            </Link>
          </div>
        </div>
      </section>

      {/* Wave cream → deep-mind */}
      <Wave from="var(--cream)" to="var(--deep-mind)" height={90} shape="swave"/>

      {/* ── WHY FREQUENCY ── */}
      <section className="page-section" style={{ background: 'var(--deep-mind)', padding: '80px 0' }}>
        <div className="section-inner">
          <div className="s-eye" style={{ color: 'var(--mauve)' }}>Why frequency-first</div>
          <h2 className="s-title" style={{ color: 'var(--white-matter)' }}>
            Other lists teach you<br/><em style={{ fontStyle: 'italic', color: 'var(--mauve)' }}>giraffe</em> before <em style={{ fontStyle: 'normal', color: 'var(--synapse)' }}>but</em>.<br/>This one doesn't.
          </h2>
          <p className="s-body" style={{ color: 'rgba(123,127,168,.85)', marginBottom: '48px' }}>
            Language follows a power law: a tiny number of words carry the vast majority of meaning. Apps and textbooks ignore this. We don't.
          </p>

          <div className="science-grid">
            <FreqCard
              stat="50%" color="#B07FA8" bg="rgba(176,127,168,0.12)" border="rgba(176,127,168,0.2)"
              title="The first words cover half of everything"
              body="The most frequent Spanish words alone account for around 50% of all running speech. Learn them first and your comprehension jumps immediately."
            />
            <FreqCard
              stat="Zipf's Law" color="#534AB7" bg="rgba(83,74,183,0.12)" border="rgba(83,74,183,0.2)"
              title="Word frequency isn't random"
              body="The most common word appears roughly twice as often as the second most common, three times as often as the third. This pattern is why frequency lists work."
            />
            <FreqCard
              stat="~10,000" color="#2D7A5F" bg="rgba(45,122,95,0.12)" border="rgba(45,122,95,0.2)"
              title="Headwords unlock word families"
              body="Learning a word in its root form gives you access to all its conjugated forms. Mastering the core list unlocks many times more real-world vocabulary."
            />
          </div>
        </div>
      </section>

      {/* Wave deep-mind → cream */}
      <Wave from="var(--deep-mind)" to="var(--cream)" height={90} shape="tilt"/>

      {/* ── OUTCOMES ── */}
      <section className="page-section" style={{ background: 'var(--cream)', padding: '80px 0' }}>
        <div className="section-inner">
          <div className="s-eye">What you'll be able to do</div>
          <h2 className="s-title">
            Real milestones.<br/>No fake progress.
          </h2>
          <p className="s-body" style={{ marginBottom: '48px' }}>
            Most apps celebrate streaks. We show you what you can actually understand — and what's next.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { stage: 'First words', icon: '👋', desc: 'Catch the gist of what\'s being said. Recognise greetings, numbers, common requests.' },
              { stage: 'Basic conversation', icon: '💬', desc: 'Hold a chat about your day, family, work. Ask for directions. Order confidently.' },
              { stage: 'Functional fluency', icon: '📺', desc: 'Follow a Netflix show. Understand news headlines. Chat without constantly translating.' },
              { stage: 'Near-native', icon: '📖', desc: 'Read novels without a dictionary. Catch jokes, slang, regional dialects.' },
            ].map(({ stage, icon, desc }) => (
              <div key={stage} style={{
                background: 'var(--white-matter)', borderRadius: '16px',
                padding: '28px 24px', border: '0.5px solid rgba(28,26,58,0.08)',
              }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{icon}</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '16px', color: 'var(--deep-mind)', marginBottom: '8px' }}>{stage}</div>
                <div style={{ fontSize: '14px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave cream → cream-dark */}
      <Wave from="var(--cream)" to="var(--cream-dark)" height={45} shape="shallow"/>

      {/* ── HOW IT WORKS ── */}
      <section className="page-section" style={{ background: 'var(--cream-dark)', padding: '80px 0' }}>
        <div className="section-inner">
          <div className="s-eye">How it works</div>
          <h2 className="s-title">Three things. In the right order.</h2>
          <p className="s-body" style={{ marginBottom: '48px' }}>No grammar lessons. No levels. No gamification. Just the words you need, reviewed at exactly the right time.</p>

          <div className="steps-grid">
            <div className="step">
              <div className="step-num">01</div>
              <div className="step-icon">📊</div>
              <div className="step-title">Learn by frequency</div>
              <div className="step-body">Start with the words that appear most in real Spanish. Every word you learn is more useful than the one before it.</div>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <div className="step-icon">🔁</div>
              <div className="step-title">Spaced repetition</div>
              <div className="step-body">Words are reviewed at increasing intervals — just before you'd forget them. Hard words come back sooner. Solid ones later.</div>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <div className="step-icon">📈</div>
              <div className="step-title">Track your comprehension</div>
              <div className="step-body">Watch your coverage % climb as you learn. Not a streak counter — a real measure of what you can understand.</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <a href="/practice" className="btn-primary">Start free — takes 10 seconds</a>
          </div>
        </div>
      </section>

      {/* Wave cream-dark → deep-mind */}
      <Wave from="var(--cream-dark)" to="var(--deep-mind)" height={45} shape="dome"/>

      {/* ── APP CLIP ── */}
      <section className="page-section" style={{ background: 'var(--deep-mind)', padding: '80px 0' }}>
        <div className="section-inner" style={{ maxWidth: '860px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }} className="app-clip-grid">

            {/* Left: QR code */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{
                background: '#F5F3EE', borderRadius: '24px', padding: '20px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
              }}>
                <Image
                  src="/qr-practice.png"
                  alt="QR code to open Spanish vocabulary practice on iOS"
                  width={220}
                  height={220}
                  style={{ borderRadius: '8px', display: 'block' }}
                />
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>
                Point your iPhone camera here
              </p>
            </div>

            {/* Right: copy */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mauve)', marginBottom: '16px' }}>
                iOS App Clip — no download needed
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: 'clamp(32px, 4vw, 46px)', color: 'var(--white-matter)', lineHeight: 1.05, letterSpacing: '-1.5px', marginBottom: '20px' }}>
                Scan. Practice.<br/>No install required.
              </h2>
              <p style={{ fontSize: '16px', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '28px' }}>
                Point your iPhone camera at the QR code and start learning the most common Spanish words instantly — directly in iOS, without downloading an app.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { icon: '🆓', text: 'First 20 words free — no account, no credit card' },
                  { icon: '💾', text: 'Create a free account to save your progress' },
                  { icon: '🔓', text: 'Unlock all 1,500 words for €5 — one-time' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '18px', lineHeight: 1.4 }}>{icon}</span>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Wave deep-mind → white-matter */}
      <Wave from="var(--deep-mind)" to="var(--white-matter)" height={45} shape="dome"/>

      {/* ── VS. OTHER APPROACHES ── */}
      <section className="page-section" style={{ background: 'var(--white-matter)', padding: '80px 0' }}>
        <div className="section-inner" style={{ maxWidth: '780px' }}>
          <div className="s-eye">How we're different</div>
          <h2 className="s-title">Frequency-first vs. everything else</h2>

          <div className="compare-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderRadius: '16px', overflow: 'hidden', border: '0.5px solid rgba(28,26,58,0.12)', marginTop: '40px' }}>
            <div style={{ background: 'var(--cream-dark)', padding: '24px', borderRight: '0.5px solid rgba(28,26,58,0.1)' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cortex)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '.07em' }}>Random vocab apps</div>
              {['Alphabetical or thematic order','You might learn giraffe before but','Gamification over comprehension','No sense of real-world coverage','Slow path to understanding real Spanish'].map(t => (
                <div key={t} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '14px', color: 'var(--cortex)', fontWeight: 300 }}>
                  <span style={{ color: 'var(--dendrite)', flexShrink: 0 }}>✕</span>{t}
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--fog)', padding: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--synapse)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '.07em' }}>Frequency-first</div>
              {['Ranked by real-world usage','Every word more useful than the last','Comprehension % always visible','Science-backed spaced repetition','Fastest path to understanding real Spanish'].map(t => (
                <div key={t} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '14px', color: 'var(--deep-mind)', fontWeight: 300 }}>
                  <span style={{ color: 'var(--signal)', flexShrink: 0 }}>✓</span>{t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wave white-matter → cream */}
      <Wave from="var(--white-matter)" to="var(--cream)" height={45} shape="shallow"/>

      {/* ── FAQ ── */}
      <section className="page-section" style={{ background: 'var(--cream)', padding: '80px 0' }}>
        <div className="section-inner" style={{ maxWidth: '720px' }}>
          <div className="s-eye">Common questions</div>
          <h2 className="s-title" style={{ marginBottom: '40px' }}>FAQ</h2>

          {[
            {
              q: 'What are the most common Spanish words?',
              a: 'The most common Spanish words are high-frequency verbs and function words: ser, estar, ir, tener, hacer, poder, decir, querer. These appear so often because language is built on a small repeated core — the top words alone cover about half of everything you\'ll hear.',
            },
            {
              q: 'How many Spanish words do I need to be fluent?',
              a: 'Around 1,500 high-frequency words gets you to functional fluency — roughly 80% of everyday spoken Spanish. At 3,000 words you reach 95% coverage, where conversations feel effortless and context-guessing works reliably.',
            },
            {
              q: 'How many Spanish words to be conversational?',
              a: 'About 500 words is enough to hold a basic conversation about your day, work, and family. That gives you around 63% lexical coverage of everyday Spanish.',
            },
            {
              q: 'How long does it take to learn the most common Spanish words?',
              a: 'With 15–20 minutes of focused daily practice, most adults reach the functional fluency threshold in 4–8 months. The first 100 words — which cover roughly 50% of all Spanish you\'ll hear — usually take 1–2 weeks.',
            },
            {
              q: 'Why learn by frequency instead of by topic?',
              a: 'Topic-based lists (food, travel, etc.) teach you words by convenience, not usefulness. Frequency lists ensure every word you learn is as high-value as possible. You spend zero time on rare words until you\'ve covered the ones that actually appear in real Spanish.',
            },
          ].map(({ q, a }) => (
            <FaqItem key={q} q={q} a={a} />
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="cta-section" id="cta">
        <svg style={{position:'absolute',top:'44px',left:'80px',pointerEvents:'none'}} width="68" height="68" viewBox="0 0 68 68" fill="none">
          <path d="M10 58 Q18 16 34 34 Q50 52 58 10" stroke="#B07FA8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <svg style={{position:'absolute',top:'56px',right:'96px',pointerEvents:'none'}} width="54" height="54" viewBox="0 0 54 54" fill="none">
          <circle cx="27" cy="27" r="25" stroke="#534AB7" strokeWidth="1" strokeDasharray="4 3"/>
        </svg>
        <svg style={{position:'absolute',bottom:'60px',right:'80px',pointerEvents:'none'}} width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 2 L19 11 L29 11 L21 17 L24 26 L16 20 L8 26 L11 17 L3 11 L13 11Z" fill="#EF9F27" opacity="0.7"/>
        </svg>

        <div className="cta-title">
          <div style={{display:'flex',justifyContent:'center'}}>Start with the</div>
          <div style={{display:'flex',justifyContent:'center',color:'var(--synapse)'}}>most common words.</div>
          <div style={{display:'flex',justifyContent:'center'}}>Learn Spanish that sticks.</div>
        </div>

        <p className="cta-sub">Free to start. No card required. Takes 10 seconds.</p>
        <div className="cta-actions">
          <a href="/practice" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Sign up free — start learning now
          </a>
        </div>
        <div className="cta-note">Free account · Full list from €5 one-time · No subscription</div>
      </section>
    </div>
  )
}

/* ── Sub-components ── */

function HeroStat({ num, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '22px', color: 'var(--deep-mind)', letterSpacing: '-0.5px', lineHeight: 1 }}>{num}</span>
      <span style={{ fontSize: '12px', color: 'var(--cortex)', marginTop: '3px' }}>{label}</span>
    </div>
  )
}

function WordPoster() {
  return (
    <div style={{ position: 'relative', height: '440px' }}>
      <div style={{
        position: 'absolute', top: '30px', left: '20px', right: '20px',
        background: 'rgba(28,26,58,0.85)', borderRadius: '20px',
        padding: '32px 36px 28px',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 24px 64px rgba(28,26,58,0.22)',
        zIndex: 1,
      }}>
        <Image
          src="/logo-element.png"
          alt=""
          width={320}
          height={320}
          priority
          sizes="320px"
          style={{ position: 'absolute', top: '-200px', right: '-100px', opacity: 0.22, pointerEvents: 'none', zIndex: 0 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--cortex)' }}>verb · most common</span>
          <span style={{ fontSize: '11px', color: 'rgba(123,127,168,0.45)' }}>#1</span>
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: '60px', color: 'var(--white-matter)', letterSpacing: '-3px', lineHeight: 1, marginBottom: '8px' }}>
          ser
        </div>
        <div style={{ fontSize: '14px', color: 'var(--cortex)', fontWeight: 300, marginBottom: '20px' }}>sér</div>
        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '12px', padding: '14px 16px' }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: '18px', color: 'var(--mauve)', marginBottom: '6px', letterSpacing: '-0.3px' }}>to be (permanent)</div>
          <div style={{ fontSize: '13px', color: 'var(--cortex)', fontWeight: 300, lineHeight: 1.55, borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '10px' }}>
            Mi hermano es médico. — My brother is a doctor.
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: '55px', right: '0',
        background: 'var(--white-matter)', borderRadius: '12px',
        padding: '14px 18px', border: '0.5px solid rgba(28,26,58,0.09)',
        boxShadow: '0 8px 24px rgba(28,26,58,0.1)', zIndex: 2, minWidth: '140px',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--cortex)', marginBottom: '6px' }}>Your coverage</div>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '28px', color: 'var(--synapse)', letterSpacing: '-0.5px', lineHeight: 1 }}>74%</div>
        <div style={{ fontSize: '11px', color: 'var(--cortex)', marginTop: '3px' }}>of spoken Spanish</div>
        <div style={{ height: '4px', background: 'var(--cream-dark)', borderRadius: '99px', marginTop: '8px' }}>
          <div style={{ height: '100%', width: '74%', background: 'var(--synapse)', borderRadius: '99px' }}/>
        </div>
      </div>
    </div>
  )
}

function MilestoneTile({ pct, sub, color, bg, border, desc, featured }) {
  return (
    <div style={{
      background: bg, borderRadius: '16px', padding: '20px',
      border: `0.5px solid ${border}`, position: 'relative',
      ...(featured ? { boxShadow: '0 0 0 2px var(--synapse)' } : {}),
    }}>
      {featured && (
        <div style={{
          position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--synapse)', color: 'var(--white-matter)',
          fontSize: '10px', fontWeight: 500, padding: '3px 14px', borderRadius: '99px', whiteSpace: 'nowrap',
        }}>The target</div>
      )}
      <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: '18px', color, marginBottom: '4px' }}>{pct}</div>
      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--deep-mind)', marginBottom: '8px' }}>{sub}</div>
      <div style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(28,26,58,0.65)', lineHeight: 1.55 }}>{desc}</div>
    </div>
  )
}

function FreqCard({ stat, color, bg, border, title, body }) {
  return (
    <div style={{
      background: bg, borderRadius: '20px', padding: '32px 28px',
      border: `1px solid ${border}`,
    }}>
      <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: '36px', color, letterSpacing: '-1px', marginBottom: '12px', lineHeight: 1 }}>{stat}</div>
      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--white-matter)', marginBottom: '10px' }}>{title}</div>
      <div style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(123,127,168,0.85)', lineHeight: 1.6 }}>{body}</div>
    </div>
  )
}

function FaqItem({ q, a }) {
  return (
    <details style={{ borderBottom: '0.5px solid rgba(28,26,58,0.1)', paddingBottom: '0' }}>
      <summary style={{
        padding: '20px 0', cursor: 'pointer', listStyle: 'none',
        fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '17px',
        color: 'var(--deep-mind)', letterSpacing: '-0.3px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        {q}
        <span style={{ fontSize: '20px', color: 'var(--cortex)', flexShrink: 0, marginLeft: '16px' }}>+</span>
      </summary>
      <p style={{ fontSize: '15px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.7, paddingBottom: '20px', marginTop: '4px' }}>
        {a}
      </p>
    </details>
  )
}
