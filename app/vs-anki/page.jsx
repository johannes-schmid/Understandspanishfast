import Link from 'next/link'

export const metadata = {
  title: 'Anki Alternative for Spanish — Frequency-Ranked, No Setup',
  description: 'A better way to learn Spanish than Anki. Frequency-ranked vocabulary, spaced repetition built in, and real comprehension tracking. No deck building. Start in 10 seconds.',
  alternates: { canonical: 'https://mostcommonspanish.com/vs-anki' },
  openGraph: { url: 'https://mostcommonspanish.com/vs-anki' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is this better than Anki for learning Spanish?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For Spanish specifically, yes. Anki is a general-purpose flashcard tool — you have to find or build your own decks, decide what order to learn words, and track your own progress. This app is purpose-built for Spanish vocabulary: words are pre-ranked by real-world frequency, spaced repetition is built in, and your comprehension percentage is calculated automatically. You open the app and start learning in seconds.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to build decks like in Anki?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The deck is already built — 1,500+ high-frequency Spanish words ranked by how often they appear in real spoken Spanish. You start with the words that give you the most comprehension the fastest, in the right order, from day one.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this use spaced repetition like Anki?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The spaced repetition algorithm works the same way: words are reviewed at increasing intervals, just before you would forget them. Hard words come back sooner. Words you know well are spaced further apart. The difference is that it\'s pre-configured for Spanish vocabulary — you never have to touch a setting.',
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

export default function VsAnki() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── HERO ── */}
      <section className="hero-section" style={{ paddingBottom: '80px' }}>
        <div className="hero-inner" style={{ gridTemplateColumns: '1fr', maxWidth: '760px', gap: '0' }}>
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
              }}>Anki alternative</span>
              <span style={{ color: 'var(--cortex)' }}>·</span>
              <span style={{ color: 'var(--cortex)' }}>built for Spanish</span>
            </div>

            <h1 style={{
              fontFamily: "'Fraunces', serif", fontWeight: 900,
              fontSize: 'clamp(44px, 6vw, 72px)',
              lineHeight: 1.0, letterSpacing: '-2.5px', color: 'var(--deep-mind)',
              marginBottom: '28px',
            }}>
              Anki for Spanish.<br />
              <span style={{ color: 'var(--synapse)' }}>Without the setup.</span>
            </h1>

            <p style={{
              fontSize: '19px', fontWeight: 300, color: 'var(--deep-mind)',
              lineHeight: 1.65, maxWidth: '560px', marginBottom: '16px',
            }}>
              You know spaced repetition works. You've tried Anki. But you spent more time managing decks than actually learning Spanish.
            </p>
            <p style={{
              fontSize: '19px', fontWeight: 300, color: 'var(--deep-mind)',
              lineHeight: 1.65, maxWidth: '560px', marginBottom: '44px',
            }}>
              This has everything Anki does for Spanish — frequency-ranked, pre-built, with live comprehension tracking. Open it and start learning in 10 seconds.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href="/get-started" className="btn-primary" style={{ fontSize: '16px', padding: '15px 30px' }}>
                Switch from Anki — it's free →
              </a>
              <Link href="/words/most-common-spanish-words" className="btn-ghost">
                See the word list ↓
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Wave from="var(--cream)" to="var(--white-matter)" height={50} shape="dome" />

      {/* ── PAIN POINTS ── */}
      <section className="page-section" style={{ background: 'var(--white-matter)', padding: '80px 0' }}>
        <div className="section-inner" style={{ maxWidth: '860px' }}>
          <div className="s-eye">Why Anki users quit</div>
          <h2 className="s-title">You didn't fail Anki.<br />Anki failed you.</h2>
          <p className="s-body">
            Anki is a brilliant tool — for people who already know how to learn. For Spanish specifically, it puts every hard decision on you.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              {
                num: '01',
                title: 'Deck building is a full-time job',
                body: 'You spent hours finding the "best" Spanish deck on AnkiWeb. Half the cards had typos. The other half taught you words you\'d never hear in a real conversation.',
                color: 'var(--dendrite)',
                bg: 'rgba(212,83,126,0.06)',
              },
              {
                num: '02',
                title: 'No order. No strategy.',
                body: 'Most Anki decks are alphabetical or themed. You learned "aardvark" before "but." Frequency-ranked learning isn\'t the default — it has to be manually configured.',
                color: 'var(--nerve)',
                bg: 'rgba(192,112,80,0.06)',
              },
              {
                num: '03',
                title: '500 reviews. No idea what you can understand.',
                body: 'Anki tells you how many cards you\'ve reviewed. It doesn\'t tell you what percentage of real Spanish you can now understand. Progress feels invisible.',
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
        <div className="section-inner" style={{ maxWidth: '780px' }}>
          <div className="s-eye">Head to head</div>
          <h2 className="s-title">Anki vs. this</h2>

          <div style={{ marginTop: '40px', borderRadius: '16px', overflow: 'hidden', border: '0.5px solid rgba(28,26,58,0.12)' }}>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              background: 'var(--deep-mind)', padding: '16px 24px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(250,247,242,0.4)', textTransform: 'uppercase', letterSpacing: '.07em' }}>Feature</div>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(250,247,242,0.4)', textTransform: 'uppercase', letterSpacing: '.07em', textAlign: 'center' }}>Anki</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--mauve)', textTransform: 'uppercase', letterSpacing: '.07em', textAlign: 'center' }}>This</div>
            </div>

            {[
              ['Spaced repetition', true, true],
              ['Ready in 10 seconds', false, true],
              ['Frequency-ranked vocabulary', false, true],
              ['Pre-built Spanish content', false, true],
              ['Live comprehension %', false, true],
              ['Knows what to teach next', false, true],
              ['Works on mobile', 'partial', true],
              ['Free to start', true, true],
            ].map(([feature, anki, us], i) => (
              <div key={feature} style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                padding: '15px 24px', alignItems: 'center',
                background: i % 2 === 0 ? 'var(--white-matter)' : 'var(--cream)',
                borderBottom: '0.5px solid rgba(28,26,58,0.06)',
              }}>
                <div style={{ fontSize: '14px', fontWeight: 400, color: 'var(--deep-mind)' }}>{feature}</div>
                <div style={{ textAlign: 'center' }}>
                  {anki === true && <span style={{ color: 'var(--signal)', fontSize: '16px' }}>✓</span>}
                  {anki === false && <span style={{ color: 'var(--dendrite)', fontSize: '14px', opacity: 0.6 }}>✕</span>}
                  {anki === 'partial' && <span style={{ color: 'var(--cortex)', fontSize: '12px' }}>Partial</span>}
                </div>
                <div style={{ textAlign: 'center' }}>
                  {us && <span style={{ color: 'var(--signal)', fontSize: '16px', fontWeight: 700 }}>✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Wave from="var(--cream)" to="var(--deep-mind)" height={90} shape="swave" />

      {/* ── WHAT YOU GET ── */}
      <section className="page-section" style={{ background: 'var(--deep-mind)', padding: '80px 0' }}>
        <div className="section-inner">
          <div className="s-eye" style={{ color: 'var(--mauve)' }}>What's different</div>
          <h2 className="s-title" style={{ color: 'var(--white-matter)' }}>
            The three things<br />Anki never solved.
          </h2>

          <div className="science-grid" style={{ marginTop: '8px' }}>
            <div style={{
              background: 'rgba(176,127,168,0.12)', borderRadius: '20px',
              padding: '32px 28px', border: '1px solid rgba(176,127,168,0.2)',
              gridColumn: 'span 1',
            }}>
              <div style={{
                fontFamily: "'Fraunces', serif", fontWeight: 900,
                fontSize: '32px', color: 'var(--mauve)', marginBottom: '14px', lineHeight: 1,
              }}>No setup</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--white-matter)', marginBottom: '10px' }}>
                Open it. Start learning.
              </div>
              <div style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(123,127,168,0.85)', lineHeight: 1.65 }}>
                No deck importing. No settings to configure. No deciding what to study. The 1,500 most important Spanish words are already there, in the right order, waiting for you.
              </div>
            </div>

            <div style={{
              background: 'rgba(83,74,183,0.12)', borderRadius: '20px',
              padding: '32px 28px', border: '1px solid rgba(83,74,183,0.2)',
            }}>
              <div style={{
                fontFamily: "'Fraunces', serif", fontWeight: 900,
                fontSize: '32px', color: 'var(--synapse)', marginBottom: '14px', lineHeight: 1,
              }}>Frequency-first</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--white-matter)', marginBottom: '10px' }}>
                Every word earns its place.
              </div>
              <div style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(123,127,168,0.85)', lineHeight: 1.65 }}>
                Words are ranked by how often they appear in real spoken Spanish — not alphabetically, not by theme. Word #1 is more useful than word #2. Always. No Anki deck on earth guarantees that.
              </div>
            </div>

            <div style={{
              background: 'rgba(45,122,95,0.12)', borderRadius: '20px',
              padding: '32px 28px', border: '1px solid rgba(45,122,95,0.2)',
            }}>
              <div style={{
                fontFamily: "'Fraunces', serif", fontWeight: 900,
                fontSize: '32px', color: '#4CAF87', marginBottom: '14px', lineHeight: 1,
              }}>Real progress</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--white-matter)', marginBottom: '10px' }}>
                Not reviews. Comprehension.
              </div>
              <div style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(123,127,168,0.85)', lineHeight: 1.65 }}>
                After every session you see your comprehension percentage — how much of real spoken Spanish you can now understand. Not a card count. Not a streak. Something that actually means something.
              </div>
            </div>
          </div>
        </div>
      </section>

      <Wave from="var(--deep-mind)" to="var(--cream)" height={90} shape="tilt" />

      {/* ── HOW IT WORKS ── */}
      <section className="page-section" style={{ background: 'var(--cream)', padding: '80px 0' }}>
        <div className="section-inner" style={{ maxWidth: '680px' }}>
          <div className="s-eye">How it works</div>
          <h2 className="s-title">Same method as Anki.<br />Done right for Spanish.</h2>
          <p className="s-body">
            Spaced repetition works. We didn't reinvent it — we just removed everything you had to do yourself in Anki.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              {
                n: '1',
                title: 'See a word',
                body: 'A Spanish word appears. You try to recall the meaning before revealing it — same as Anki.',
              },
              {
                n: '2',
                title: 'Rate yourself',
                body: 'Was it easy, hard, or did you blank? Your rating determines when this word comes back.',
              },
              {
                n: '3',
                title: 'The algorithm spaces your reviews',
                body: 'Hard words return in hours. Solid words return in days, then weeks. Nothing is wasted.',
              },
              {
                n: '4',
                title: 'Watch your comprehension climb',
                body: 'Every word you lock in adds to your % of real spoken Spanish. The number keeps growing.',
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
        </div>
      </section>

      <Wave from="var(--cream)" to="var(--cream-dark)" height={45} shape="shallow" />

      {/* ── FAQ ── */}
      <section className="page-section" style={{ background: 'var(--cream-dark)', padding: '80px 0' }}>
        <div className="section-inner" style={{ maxWidth: '680px' }}>
          <div className="s-eye">Common questions</div>
          <h2 className="s-title" style={{ marginBottom: '40px' }}>FAQ</h2>

          {[
            {
              q: 'Is this better than Anki for learning Spanish?',
              a: 'For Spanish specifically, yes. Anki is a general-purpose tool — you have to find decks, configure settings, and decide what to learn. This is purpose-built: words are pre-ranked by real frequency, SRS is pre-configured, and your comprehension percentage is tracked automatically. You start learning in seconds, not hours.',
            },
            {
              q: 'Do I need to build decks like in Anki?',
              a: 'No. The deck is already built — 1,500+ high-frequency Spanish words ranked by how often they appear in real spoken Spanish. You start with the most impactful words first, in the right order, from day one.',
            },
            {
              q: 'Does this use spaced repetition like Anki?',
              a: 'Yes. Words are reviewed at increasing intervals, just before you\'d forget them. Hard words come back sooner, easy ones are spaced further apart. The difference is it\'s pre-configured for Spanish — you never touch a setting.',
            },
            {
              q: 'Can I import my existing Anki progress?',
              a: 'Not currently. The word list is standardised so everyone starts from the same frequency baseline. If you\'ve been using Anki for Spanish, you\'ll likely move through the early words quickly — they\'ll feel like review.',
            },
            {
              q: 'What does the comprehension percentage mean?',
              a: 'It\'s an estimate of what percentage of real spoken Spanish you can understand based on the words you\'ve learned. Learn the top 100 words and you can understand around 50% of everyday speech. At 1,500 words you\'re at roughly 80%. This is based on lexical frequency corpus research.',
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
        <svg className="hero-deco-svg" style={{position:'absolute',top:'44px',left:'80px',pointerEvents:'none'}} width="68" height="68" viewBox="0 0 68 68" fill="none">
          <path d="M10 58 Q18 16 34 34 Q50 52 58 10" stroke="#B07FA8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <svg className="hero-deco-svg" style={{position:'absolute',top:'56px',right:'96px',pointerEvents:'none'}} width="54" height="54" viewBox="0 0 54 54" fill="none">
          <circle cx="27" cy="27" r="25" stroke="#534AB7" strokeWidth="1" strokeDasharray="4 3"/>
        </svg>

        <div className="cta-title">
          <div style={{display:'flex',justifyContent:'center'}}>Anki taught you the method.</div>
          <div style={{display:'flex',justifyContent:'center',color:'var(--synapse)'}}>This does the rest.</div>
        </div>

        <p className="cta-sub">Free to start. No deck building. Your comprehension % starts climbing from session one.</p>
        <div className="cta-actions">
          <a href="/get-started" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', fontSize: '16px', padding: '15px 30px' }}>
            Switch from Anki — it's free →
          </a>
        </div>
        <div className="cta-note">Free account · Full list from €5 one-time · No subscription</div>
      </section>
    </div>
  )
}
