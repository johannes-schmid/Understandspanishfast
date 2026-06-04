import Link from 'next/link'

export const metadata = {
  title: 'Best Spanish Vocabulary App — Frequency-Ranked, Free to Start',
  description: 'The Spanish vocabulary app that teaches words by frequency order and tracks your comprehension %. Learn the 1,500 words that cover 80% of everyday Spanish.',
  alternates: { canonical: 'https://mostcommonspanish.com/spanish-vocabulary-app' },
  openGraph: {
    title: 'Best Spanish Vocabulary App — Frequency-Ranked, Free to Start',
    description: 'The Spanish vocabulary app that teaches words by frequency order and tracks your comprehension %. Learn the 1,500 words that cover 80% of everyday Spanish.',
    url: 'https://mostcommonspanish.com/spanish-vocabulary-app',
    type: 'website',
    images: [{ url: 'https://mostcommonspanish.com/og-default.svg' }],
  },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'comprendo.',
  url: 'https://mostcommonspanish.com',
  description: 'A Spanish vocabulary app that ranks words by real-world frequency and tracks your comprehension percentage. Learn the 1,500 most important Spanish words in the right order.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free to start. Full list from €5 one-time.',
  },
  featureList: [
    'Frequency-ranked Spanish vocabulary',
    'Built-in spaced repetition',
    'Live comprehension percentage tracking',
    'No setup or deck building required',
    '1,500+ high-frequency words',
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best Spanish vocabulary app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best Spanish vocabulary app for comprehension is one that teaches words by frequency order — starting with the most commonly used words first. Apps like comprendo. pre-rank 1,500+ words by how often they appear in real spoken Spanish, so every minute of study gives you maximum return. Most popular apps like Duolingo teach by theme (food, travel, numbers), which is less efficient for building real comprehension quickly.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many Spanish vocabulary words do I need to learn?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Learning the 1,500 most frequent Spanish words gives you roughly 80% comprehension of everyday spoken Spanish. The top 100 words alone cover about 50% of all speech. This is why frequency order matters so much — the first 1,500 words are worth far more than the next 5,000.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a Spanish vocabulary app enough to become fluent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A vocabulary app is the foundation, not the whole picture. Vocabulary is the primary bottleneck for comprehension — once you have 1,500 high-frequency words, you can understand 80% of everyday Spanish and start consuming real content. Grammar, listening, and speaking practice build on that foundation. Most learners stall because they learn the wrong vocabulary in the wrong order, not because they lack grammar knowledge.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes a Spanish vocabulary app better than Duolingo or Babbel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Duolingo and Babbel organise vocabulary by theme (animals, colours, travel) rather than frequency. This feels intuitive but it is inefficient — you end up learning "the bear drinks milk" before you can say "I do not understand." A frequency-first app teaches the words that appear most in real Spanish first, so your comprehension grows faster per hour of study.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to learn Spanish vocabulary with an app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'At 15–30 minutes of daily study with a spaced repetition vocabulary app, most learners reach 1,500 words — and 80% comprehension of everyday Spanish — in 6 to 9 months. The key variable is word order: learning frequency-ranked words means every session builds directly toward real comprehension, rather than filling gaps in themed topics.',
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

const COMPARISON = [
  ['Frequency-ranked vocabulary', false, false, false, true],
  ['Spaced repetition built in', false, false, 'partial', true],
  ['Live comprehension %', false, false, false, true],
  ['No setup required', true, false, true, true],
  ['Free to start', true, false, false, true],
  ['Teaches most-used words first', false, false, false, true],
  ['Works on any device', true, true, true, true],
]

export default function SpanishVocabularyApp() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── HERO ── */}
      <section className="hero-section" style={{ paddingBottom: '80px' }}>
        <div className="hero-inner" style={{ gridTemplateColumns: '1fr', maxWidth: '780px', gap: '0' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '12px', fontWeight: 500, letterSpacing: '.08em',
              textTransform: 'uppercase', color: 'var(--synapse)',
              marginBottom: '24px',
            }}>
              <span style={{
                background: 'var(--fog)', color: 'var(--synapse)',
                padding: '3px 10px', borderRadius: '99px', fontSize: '11px',
              }}>Spanish vocabulary app</span>
              <span style={{ color: 'var(--cortex)' }}>·</span>
              <span style={{ color: 'var(--cortex)' }}>frequency-first</span>
            </div>

            <h1 style={{
              fontFamily: "'Fraunces', serif", fontWeight: 900,
              fontSize: 'clamp(44px, 6vw, 72px)',
              lineHeight: 1.0, letterSpacing: '-2.5px', color: 'var(--deep-mind)',
              marginBottom: '28px',
            }}>
              The Spanish vocabulary app<br />
              <span style={{ color: 'var(--synapse)' }}>that actually builds comprehension.</span>
            </h1>

            <p style={{
              fontSize: '19px', fontWeight: 300, color: 'var(--deep-mind)',
              lineHeight: 1.65, maxWidth: '580px', marginBottom: '16px',
            }}>
              Most Spanish vocabulary apps teach words by theme. You learn "the bear drinks milk" before you can order a coffee. That is not an accident — it is a design flaw.
            </p>
            <p style={{
              fontSize: '19px', fontWeight: 300, color: 'var(--deep-mind)',
              lineHeight: 1.65, maxWidth: '580px', marginBottom: '44px',
            }}>
              This app ranks every word by how often it appears in real spoken Spanish. Learn 1,500 words in frequency order and you will understand 80% of everyday Spanish. That is the whole system.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href="/get-started" className="btn-primary" style={{ fontSize: '16px', padding: '15px 30px' }}>
                Start learning free →
              </a>
              <Link href="/words/most-common-spanish-words" className="btn-ghost">
                See the word list ↓
              </Link>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--cortex)', marginTop: '16px' }}>
              Free to start · Full list from €5 one-time · No subscription
            </p>
          </div>
        </div>
      </section>

      <Wave from="var(--cream)" to="var(--white-matter)" height={50} shape="dome" />

      {/* ── WHY FREQUENCY MATTERS ── */}
      <section className="page-section" style={{ background: 'var(--white-matter)', padding: '80px 0' }}>
        <div className="section-inner" style={{ maxWidth: '860px' }}>
          <div className="s-eye">The vocabulary problem</div>
          <h2 className="s-title">Why most Spanish apps<br />leave you unable to understand anything.</h2>
          <p className="s-body" style={{ maxWidth: '600px' }}>
            The top 100 Spanish words account for 50% of all spoken language. The top 1,500 cover 80%.
            Every Spanish vocabulary app teaches you words — but almost none of them teach you the <em>right</em> words first.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '40px' }}>
            {[
              {
                num: '01',
                title: 'Thematic order wastes your time',
                body: 'Duolingo, Babbel, and Rosetta Stone group words by topic: colours, animals, travel. The issue is that "purple" (rare) gets learned before "because" (one of the most common words in Spanish). Theme-first is intuitive. It is also slow.',
                color: 'var(--dendrite)',
                bg: 'rgba(212,83,126,0.06)',
              },
              {
                num: '02',
                title: 'You cannot understand real Spanish yet',
                body: 'After 6 months on Duolingo, most learners can pass their own lessons but cannot follow a real conversation. The gap is vocabulary coverage — specifically, the 200–400 high-frequency words that appear in almost every sentence but that themed apps deprioritise.',
                color: 'var(--nerve)',
                bg: 'rgba(192,112,80,0.06)',
              },
              {
                num: '03',
                title: 'No one tells you how far you are',
                body: 'Popular apps measure streaks, XP, and lessons completed. None of them tell you what percentage of real Spanish you can actually understand. Progress feels abstract because it is measured in the wrong units.',
                color: 'var(--cortex)',
                bg: 'rgba(123,127,168,0.08)',
              },
            ].map(({ num, title, body, color, bg }) => (
              <div key={num} style={{
                background: bg, borderRadius: '16px', padding: '28px 24px',
                border: `0.5px solid ${color}22`,
              }}>
                <div style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 900,
                  fontSize: '13px', color, marginBottom: '12px', letterSpacing: '.05em',
                }}>{num}</div>
                <div style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 700,
                  fontSize: '17px', color: 'var(--deep-mind)', marginBottom: '10px', lineHeight: 1.2,
                }}>{title}</div>
                <div style={{ fontSize: '14px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.65 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Wave from="var(--white-matter)" to="var(--cream)" height={45} shape="shallow" />

      {/* ── COMPARISON TABLE ── */}
      <section className="page-section" style={{ background: 'var(--cream)', padding: '80px 0' }}>
        <div className="section-inner" style={{ maxWidth: '860px' }}>
          <div className="s-eye">App comparison</div>
          <h2 className="s-title">Spanish vocabulary apps compared</h2>
          <p className="s-body" style={{ maxWidth: '560px' }}>
            The difference that matters is not design or gamification — it is whether the app teaches words in the order that builds real comprehension fastest.
          </p>

          <div style={{ marginTop: '40px', borderRadius: '16px', overflow: 'hidden', border: '0.5px solid rgba(28,26,58,0.12)', overflowX: 'auto' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              background: 'var(--deep-mind)', padding: '16px 24px', minWidth: '560px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(250,247,242,0.4)', textTransform: 'uppercase', letterSpacing: '.07em' }}>Feature</div>
              {['Duolingo', 'Anki', 'Babbel', 'comprendo.'].map((name, i) => (
                <div key={name} style={{
                  fontSize: i === 3 ? '13px' : '12px',
                  fontWeight: i === 3 ? 600 : 500,
                  color: i === 3 ? 'var(--mauve)' : 'rgba(250,247,242,0.4)',
                  textTransform: 'uppercase', letterSpacing: '.07em', textAlign: 'center',
                }}>{name}</div>
              ))}
            </div>

            {COMPARISON.map(([feature, duolingo, anki, babbel, us], i) => (
              <div key={feature} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                padding: '15px 24px', alignItems: 'center', minWidth: '560px',
                background: i % 2 === 0 ? 'var(--white-matter)' : 'var(--cream)',
                borderBottom: '0.5px solid rgba(28,26,58,0.06)',
              }}>
                <div style={{ fontSize: '14px', fontWeight: 400, color: 'var(--deep-mind)' }}>{feature}</div>
                {[duolingo, anki, babbel, us].map((val, j) => (
                  <div key={j} style={{ textAlign: 'center' }}>
                    {val === true && <span style={{ color: j === 3 ? 'var(--signal)' : 'var(--signal)', fontSize: '16px', fontWeight: j === 3 ? 700 : 400 }}>✓</span>}
                    {val === false && <span style={{ color: 'var(--dendrite)', fontSize: '14px', opacity: 0.6 }}>✕</span>}
                    {val === 'partial' && <span style={{ color: 'var(--cortex)', fontSize: '12px' }}>Partial</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Wave from="var(--cream)" to="var(--deep-mind)" height={90} shape="swave" />

      {/* ── FEATURES ── */}
      <section className="page-section" style={{ background: 'var(--deep-mind)', padding: '80px 0' }}>
        <div className="section-inner">
          <div className="s-eye" style={{ color: 'var(--mauve)' }}>How it works</div>
          <h2 className="s-title" style={{ color: 'var(--white-matter)' }}>
            Three things no other<br />Spanish vocabulary app does.
          </h2>

          <div className="science-grid" style={{ marginTop: '8px' }}>
            <div style={{
              background: 'rgba(83,74,183,0.12)', borderRadius: '20px',
              padding: '32px 28px', border: '1px solid rgba(83,74,183,0.2)',
            }}>
              <div style={{
                fontFamily: "'Fraunces', serif", fontWeight: 900,
                fontSize: '32px', color: 'var(--synapse)', marginBottom: '14px', lineHeight: 1,
              }}>Frequency-first</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--white-matter)', marginBottom: '10px' }}>
                Word #1 is more useful than word #2. Always.
              </div>
              <div style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(123,127,168,0.85)', lineHeight: 1.65 }}>
                Every word is ranked by how often it appears in real spoken and written Spanish — corpus data, not editorial opinion.
                You learn the words that unlock the most comprehension first. No gaps, no skips, no "I know 500 words but cannot follow a conversation."
              </div>
            </div>

            <div style={{
              background: 'rgba(176,127,168,0.12)', borderRadius: '20px',
              padding: '32px 28px', border: '1px solid rgba(176,127,168,0.2)',
            }}>
              <div style={{
                fontFamily: "'Fraunces', serif", fontWeight: 900,
                fontSize: '32px', color: 'var(--mauve)', marginBottom: '14px', lineHeight: 1,
              }}>Spaced repetition</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--white-matter)', marginBottom: '10px' }}>
                Built in. Pre-configured. Nothing to set up.
              </div>
              <div style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(123,127,168,0.85)', lineHeight: 1.65 }}>
                Words are reviewed just before you would forget them — the algorithm spaces each card based on how well you know it.
                Hard words come back in hours. Solid words come back in days, then weeks. The science of spaced repetition without the manual configuration of Anki.
              </div>
            </div>

            <div style={{
              background: 'rgba(45,122,95,0.12)', borderRadius: '20px',
              padding: '32px 28px', border: '1px solid rgba(45,122,95,0.2)',
            }}>
              <div style={{
                fontFamily: "'Fraunces', serif", fontWeight: 900,
                fontSize: '32px', color: '#4CAF87', marginBottom: '14px', lineHeight: 1,
              }}>Comprehension %</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--white-matter)', marginBottom: '10px' }}>
                Not a streak. An actual number that means something.
              </div>
              <div style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(123,127,168,0.85)', lineHeight: 1.65 }}>
                After every session you see what percentage of real spoken Spanish you can now understand — based on lexical frequency research.
                Learn 100 words and you are at around 50%. At 1,500 words you hit 80%. The goal is always visible.
              </div>
            </div>
          </div>
        </div>
      </section>

      <Wave from="var(--deep-mind)" to="var(--cream)" height={90} shape="tilt" />

      {/* ── HOW TO USE ── */}
      <section className="page-section" style={{ background: 'var(--cream)', padding: '80px 0' }}>
        <div className="section-inner" style={{ maxWidth: '680px' }}>
          <div className="s-eye">Getting started</div>
          <h2 className="s-title">How the Spanish vocabulary app works</h2>
          <p className="s-body">
            No setup. No deck building. Open it and start with word #1 — the most common Spanish word.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              {
                n: '1',
                title: 'A word appears',
                body: 'A Spanish word is shown. Try to recall its meaning before revealing it. The order is always frequency-ranked — you are always working on the highest-value words.',
              },
              {
                n: '2',
                title: 'Rate how well you knew it',
                body: 'Easy, hard, or blank? Your rating tells the spaced repetition algorithm when to show this word again. The harder it was, the sooner it returns.',
              },
              {
                n: '3',
                title: 'New words unlock automatically',
                body: 'As you lock in existing words, new ones are introduced at the right pace. You are never overwhelmed and never bored — the system balances review and new learning for you.',
              },
              {
                n: '4',
                title: 'Your comprehension % climbs',
                body: 'Every word you master increases the percentage of real Spanish you can understand. The number is calculated from corpus data — it reflects real-world comprehension, not app points.',
              },
            ].map(({ n, title, body }, i, arr) => (
              <div key={n} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr',
                gap: '20px', alignItems: 'start',
                padding: '24px 0',
                borderBottom: i < arr.length - 1 ? '0.5px solid rgba(28,26,58,0.08)' : 'none',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--fog)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '16px',
                  color: 'var(--synapse)', flexShrink: 0,
                }}>{n}</div>
                <div>
                  <div style={{
                    fontFamily: "'Fraunces', serif", fontWeight: 700,
                    fontSize: '17px', color: 'var(--deep-mind)', marginBottom: '6px',
                  }}>{title}</div>
                  <div style={{ fontSize: '14px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.65 }}>{body}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '48px', padding: '28px 32px', background: 'var(--fog)', borderRadius: '16px' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '18px', color: 'var(--deep-mind)', marginBottom: '10px' }}>
              The research behind it
            </div>
            <p style={{ fontSize: '14px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.7, margin: 0 }}>
              The 80% comprehension threshold at 1,500 words is based on lexical frequency research —
              specifically Paul Nation's work on vocabulary coverage in natural language, which shows that the most
              frequent words in a language carry a disproportionate share of communicative load. You can read more in{' '}
              <Link href="/blog/how-many-spanish-words-to-be-fluent" style={{ color: 'var(--synapse)', textDecoration: 'underline' }}>
                how many Spanish words you need to be fluent
              </Link>{' '}
              and{' '}
              <Link href="/blog/how-to-build-spanish-vocabulary" style={{ color: 'var(--synapse)', textDecoration: 'underline' }}>
                how to build Spanish vocabulary fast
              </Link>.
            </p>
          </div>
        </div>
      </section>

      <Wave from="var(--cream)" to="var(--cream-dark)" height={45} shape="shallow" />

      {/* ── FAQ ── */}
      <section className="page-section" style={{ background: 'var(--cream-dark)', padding: '80px 0' }}>
        <div className="section-inner" style={{ maxWidth: '680px' }}>
          <div className="s-eye">Questions</div>
          <h2 className="s-title" style={{ marginBottom: '40px' }}>FAQ</h2>

          {[
            {
              q: 'What is the best Spanish vocabulary app?',
              a: 'The best Spanish vocabulary app is one that teaches words in frequency order — starting with the most commonly used words first. comprendo. pre-ranks 1,500+ words by how often they appear in real spoken Spanish, with spaced repetition built in and a live comprehension percentage so you always know where you stand.',
            },
            {
              q: 'How many Spanish words do I need to learn?',
              a: 'The top 1,500 most frequent Spanish words give you roughly 80% comprehension of everyday spoken Spanish. The first 100 words alone cover about 50% of all speech. Learning in frequency order means every word you add has a measurable impact on what you can understand.',
            },
            {
              q: 'Is this app better than Duolingo for vocabulary?',
              a: 'For vocabulary specifically, yes. Duolingo organises words by theme rather than frequency, which means you learn less-common words before mastering the high-frequency ones that appear in almost every sentence. comprendo. teaches words in the order that builds real comprehension fastest. You can read a full comparison in our guide to the best Spanish learning apps.',
            },
            {
              q: 'How is this different from Anki?',
              a: 'Anki is a powerful general-purpose flashcard tool — but you have to find or build your own Spanish deck, decide what order to learn words, and configure the spaced repetition settings yourself. comprendo. is purpose-built for Spanish vocabulary: the deck is pre-built, words are frequency-ranked, and spaced repetition is pre-configured. You open it and start learning in seconds.',
            },
            {
              q: 'How long does it take to reach 80% Spanish comprehension?',
              a: 'At 15–30 minutes of daily study with spaced repetition, most learners reach 1,500 words — and 80% comprehension of everyday Spanish — in 6 to 9 months. The exact timeline depends on consistency and prior language learning experience.',
            },
          ].map(({ q, a }) => (
            <details key={q} style={{ borderBottom: '0.5px solid rgba(28,26,58,0.1)', paddingBottom: '0' }}>
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
          ))}
        </div>
      </section>

      <Wave from="var(--cream-dark)" to="var(--white-matter)" height={45} shape="dome" />

      {/* ── FINAL CTA ── */}
      <section className="cta-section" id="cta">
        <svg className="hero-deco-svg" style={{ position: 'absolute', top: '44px', left: '80px', pointerEvents: 'none' }} width="68" height="68" viewBox="0 0 68 68" fill="none">
          <path d="M10 58 Q18 16 34 34 Q50 52 58 10" stroke="#B07FA8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <svg className="hero-deco-svg" style={{ position: 'absolute', top: '56px', right: '96px', pointerEvents: 'none' }} width="54" height="54" viewBox="0 0 54 54" fill="none">
          <circle cx="27" cy="27" r="25" stroke="#534AB7" strokeWidth="1" strokeDasharray="4 3" />
        </svg>

        <div className="cta-title">
          <div style={{ display: 'flex', justifyContent: 'center' }}>1,500 words.</div>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--synapse)' }}>80% of everyday Spanish.</div>
        </div>

        <p className="cta-sub">
          The Spanish vocabulary app that teaches words in the order that actually builds comprehension.
          Free to start — your percentage starts climbing from session one.
        </p>
        <div className="cta-actions">
          <a href="/get-started" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', fontSize: '16px', padding: '15px 30px' }}>
            Start learning free →
          </a>
        </div>
        <div className="cta-note">Free account · Full list from €5 one-time · No subscription</div>
      </section>
    </div>
  )
}
