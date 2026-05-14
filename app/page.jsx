import Image from 'next/image'
import WaitlistForm from '@/components/WaitlistForm'

export const metadata = {
  title: 'Neuro — Spanish worth keeping',
  description: 'Master 3,000 frequency-ranked Spanish words. Understand 95% of spoken Spanish with science-backed spaced repetition — no gamification, no nonsense.',
  alternates: { canonical: 'https://mostcommonspanish.com/' },
  openGraph: { url: 'https://mostcommonspanish.com/' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Neuro',
  url: 'https://mostcommonspanish.com/',
  description: 'Master the 3,000 most useful Spanish words and understand 95% of spoken Spanish.',
}

/* Wave divider — smooth cubic bezier variants */
function Wave({ from, to, height = 90, shape = 'dome' }) {
  const h = height
  let d
  if (shape === 'dome') {
    // Symmetric smooth dome
    d = `M0,${h} C480,0 960,0 1440,${h} L1440,${h} L0,${h} Z`
  } else if (shape === 'swave') {
    // Smooth S — rises left, dips right
    d = `M0,${h} C320,0 640,${h} 1080,${h * 0.15} C1260,0 1380,${h * 0.4} 1440,${h} L1440,${h} L0,${h} Z`
  } else if (shape === 'tilt') {
    // Smooth left-lean: high on left, flows down to right
    d = `M0,${h * 0.1} C480,${h * 0.05} 900,${h * 0.6} 1440,${h} L1440,${h} L0,${h} Z`
  } else if (shape === 'shallow') {
    // Very gentle dome
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── HERO ── */}
      <section className="hero-section">
        {/* Squiggles */}
        <svg style={{position:'absolute',top:'120px',left:'52px',pointerEvents:'none'}} width="72" height="40" viewBox="0 0 72 40" fill="none">
          <path d="M4 32 Q18 4 36 20 Q54 36 68 8" stroke="#B07FA8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <svg style={{position:'absolute',top:'200px',left:'180px',pointerEvents:'none'}} width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="20" stroke="#534AB7" strokeWidth="1" strokeDasharray="4 3"/>
        </svg>
        <svg style={{position:'absolute',bottom:'260px',left:'56px',pointerEvents:'none'}} width="56" height="56" viewBox="0 0 56 56" fill="none">
          <path d="M8 28 Q14 4 28 14 Q42 24 48 8" stroke="#2D7A5F" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M42 5 L49 8 L44 14" stroke="#2D7A5F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <svg style={{position:'absolute',top:'160px',right:'44%',pointerEvents:'none'}} width="36" height="60" viewBox="0 0 36 60" fill="none">
          <path d="M18 4 Q32 16 18 28 Q4 40 18 56" stroke="#C07050" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <svg style={{position:'absolute',bottom:'180px',left:'38%',pointerEvents:'none'}} width="80" height="32" viewBox="0 0 80 32" fill="none">
          <path d="M4 16 Q20 4 40 16 Q60 28 76 16" stroke="#534AB7" strokeWidth="1" strokeLinecap="round" strokeDasharray="5 3"/>
        </svg>
        <svg style={{position:'absolute',top:'300px',right:'54%',pointerEvents:'none'}} width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 2 L17 10 L26 10 L19 15 L22 23 L14 18 L6 23 L9 15 L2 10 L11 10Z" fill="#EF9F27" opacity="0.7"/>
        </svg>
        <svg style={{position:'absolute',top:'155px',right:'52px',pointerEvents:'none'}} width="52" height="52" viewBox="0 0 52 52" fill="none">
          <circle cx="26" cy="26" r="24" stroke="#B07FA8" strokeWidth="1" strokeDasharray="3 4"/>
        </svg>
        <svg style={{position:'absolute',bottom:'200px',right:'64px',pointerEvents:'none'}} width="68" height="36" viewBox="0 0 68 36" fill="none">
          <path d="M4 28 Q18 4 34 18 Q50 32 64 8" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <svg style={{position:'absolute',top:'420px',right:'48px',pointerEvents:'none'}} width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 1 L12 7 L19 7 L13 11 L16 18 L10 14 L4 18 L7 11 L1 7 L8 7Z" fill="#EF9F27"/>
        </svg>

        <div className="hero-inner">
          <div>
            <h1 style={{
              fontFamily: "'Fraunces', serif", fontWeight: 900,
              fontSize: 'clamp(52px, 6.5vw, 84px)',
              lineHeight: 1.0, letterSpacing: '-2.5px', color: 'var(--deep-mind)',
              marginBottom: '28px', animation: 'fadeUp .7s .05s ease both',
            }}>
              <div>Respect your</div>
              <div>brain,</div>
              <div>not your</div>
              <div style={{display:'inline-flex',flexDirection:'column',alignItems:'flex-start'}}>
                <span>screen time.</span>
                <svg viewBox="0 0 340 14" fill="none" style={{width:'100%',marginTop:'6px'}} preserveAspectRatio="none">
                  <path d="M2 10 C80 3 200 2 338 7" stroke="#534AB7" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
            </h1>

            <p style={{
              fontSize:'17px', fontWeight:300, color:'var(--deep-mind)',
              lineHeight:1.65, maxWidth:'420px', marginBottom:'36px',
              animation:'fadeUp .7s .15s ease both',
            }}>
              Most apps teach you Spanish. Neuro teaches you the{' '}
              <strong style={{color:'var(--deep-mind)',fontWeight:500}}>right words</strong>, in the{' '}
              <strong style={{color:'var(--deep-mind)',fontWeight:500}}>right order</strong>, using the science of how memory actually works.
            </p>

            <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'52px',animation:'fadeUp .7s .25s ease both'}}>
              <a href="/get-started" className="btn-primary">Start free — 100 words</a>
              <a href="#science" className="btn-ghost">See the research →</a>
            </div>

            <div style={{display:'flex',alignItems:'center',gap:'24px',animation:'fadeUp .7s .35s ease both'}}>
              <HeroStat num="3,000" label="words for 95% fluency"/>
              <div style={{width:'0.5px',height:'36px',background:'rgba(28,26,58,0.15)'}}/>
              <HeroStat num="15 min" label="per day, that's it"/>
              <div style={{width:'0.5px',height:'36px',background:'rgba(28,26,58,0.15)'}}/>
              <HeroStat num="0" label="badges, points, nonsense"/>
            </div>
          </div>

          <div style={{animation:'fadeUp .8s .15s ease both',position:'relative'}}>
            <WordPoster/>
          </div>
        </div>
      </section>

      {/* Wave: cream → white-matter */}
      <Wave from="var(--cream)" to="var(--white-matter)" height={55} shape="dome"/>

      {/* ── SCIENCE ── */}
      <section id="science" className="science-section">
        <div className="section-inner">
          <div className="s-eye">Why this works</div>
          <h2 className="s-title">
            <div>Built on</div>
            <div style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
              real{' '}
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" style={{display:'inline-block',verticalAlign:'middle'}}>
                <path d="M19 3 L23 14 L35 14 L26 21 L29 32 L19 25 L9 32 L12 21 L3 14 L15 14Z" fill="#EF9F27"/>
              </svg>
              {' '}science.
            </div>
          </h2>

          <div className="science-grid">
            <ScienceCard
              num="80%" numColor="#534AB7" dotColor="#534AB7" bg="#C8C2F0"
              emoji="🎯" rotate={-2}
              label="1 in 5 words ruins it."
              body="At 80% coverage you hit an unknown word every 5 seconds. Context-guessing stops working. You need 95% before Spanish feels effortless — that's 3,000 words."
            />
            <ScienceCard
              num="4.2×" numColor="#8A5A84" dotColor="#8A5A84" bg="#E0C8DC"
              emoji="🧠" rotate={1.5}
              label="The struggle IS the learning."
              body="Retrieving a word from memory — even wrongly — builds 4.2× stronger retention than re-reading. Every Neuro card makes you try before you see."
            />
            <ScienceCard
              num="9%" numColor="#A05A38" dotColor="#A05A38" bg="#EED0BA"
              emoji="🏅" rotate={1.8}
              label="Badges add 9%. We skip them."
              body="Points and XP spike short-term engagement but only lift long-term retention by 9%. We skip the performance and keep the retention."
            />
            <ScienceCard
              num="8h" numColor="#A03060" dotColor="#A03060" bg="#F0C4D4"
              emoji="🌙" rotate={-1.5}
              label="Your pillow teaches too."
              body="Sleep actively replays new vocabulary and cements it. Reviewing before bed — even 5 cards — outperforms an afternoon session of 30."
            />
          </div>
        </div>
      </section>

      {/* Wave: white-matter → deep-mind */}
      <Wave from="var(--white-matter)" to="var(--deep-mind)" height={110} shape="swave"/>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="how-section">
        <div className="section-inner">
          <div className="s-eye" style={{color:'var(--mauve)'}}>How it works</div>
          <h2 className="s-title" style={{color:'var(--white-matter)',maxWidth:'100%'}}>
            <div>Four things.</div>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <rect x="3" y="3" width="28" height="28" rx="6" fill="rgba(176,127,168,.2)" stroke="#B07FA8" strokeWidth="1"/>
                <path d="M9 17 L15 23 L25 11" stroke="#B07FA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              In the right order.
            </div>
          </h2>
          <p className="s-body" style={{color:'rgba(123,127,168,.85)'}}>No grammar. No courses. No levels. Just the words you need, reviewed at exactly the right time.</p>

          <div className="steps-grid">
            <div className="step">
              <div className="step-num">01</div>
              <div className="step-icon">📊</div>
              <div className="step-title">Frequency-first</div>
              <div className="step-body">Words ranked by real-world usage. The top 3,000 cover 95% of conversation. You learn what actually matters.</div>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <div className="step-icon">🔍</div>
              <div className="step-title">Retrieve before reveal</div>
              <div className="step-body">Spanish word first. Try to recall it before the answer appears. That friction is exactly what builds memory.</div>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <div className="step-icon">📅</div>
              <div className="step-title">Spaced repetition</div>
              <div className="step-body">Reviews scheduled at the exact interval that maximises retention. Hard words sooner. Solid words later.</div>
            </div>
            <div className="step">
              <div className="step-num">04</div>
              <div className="step-icon">🌙</div>
              <div className="step-title">Sleep & protect</div>
              <div className="step-body">5 cards before bed beats 30 in the afternoon. Sleep replays vocabulary for free while you rest.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave: deep-mind → cream */}
      <Wave from="var(--deep-mind)" to="var(--cream)" height={110} shape="tilt"/>

      {/* ── COVERAGE ── */}
      <section className="coverage-wrap">
        <div className="section-inner">
          <div className="s-eye">Coverage milestones</div>
          <h2 className="s-title">
            <div>Honest targets.</div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
              No{' '}
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <rect x="2" y="2" width="30" height="30" rx="7" fill="#FBEAF0" stroke="#D4537E" strokeWidth="1"/>
                <path d="M9 9 L25 25 M25 9 L9 25" stroke="#D4537E" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {' '}fake progress.
            </div>
          </h2>
          <p className="s-body" style={{marginBottom:'48px'}}>Most apps celebrate 80% as fluency. Here's what each number actually feels like.</p>

          {/* Coverage bar — full width, prominent */}
          <div style={{background:'var(--white-matter)',borderRadius:'20px',padding:'32px 36px',border:'0.5px solid rgba(28,26,58,0.08)',marginBottom:'20px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:'16px'}}>
              <span style={{fontFamily:"'Fraunces', serif",fontWeight:900,fontSize:'22px',color:'var(--deep-mind)',letterSpacing:'-0.5px'}}>How many words do you actually need?</span>
            </div>
            {/* Track */}
            <div style={{height:'14px',background:'var(--cream-dark)',borderRadius:'99px',position:'relative',marginBottom:'20px'}}>
              <div style={{position:'absolute',top:0,left:0,height:'100%',width:'95%',background:'linear-gradient(90deg, var(--mauve) 0%, var(--synapse) 60%, #2D7A5F 100%)',borderRadius:'99px'}}/>
              {/* Marker 80% */}
              <div style={{position:'absolute',top:'-8px',left:'80%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}>
                <div style={{width:'2px',height:'30px',background:'var(--deep-mind)',borderRadius:'1px'}}/>
              </div>
              {/* Marker 95% */}
              <div style={{position:'absolute',top:'-8px',left:'95%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center'}}>
                <div style={{width:'2px',height:'30px',background:'var(--deep-mind)',borderRadius:'1px'}}/>
              </div>
            </div>
            {/* Labels under bar */}
            <div className="coverage-tiles">
              <div style={{padding:'16px 18px',background:'#EDD8EA',borderRadius:'12px',borderLeft:'3px solid var(--mauve)'}}>
                <div style={{fontFamily:"'Fraunces', serif",fontWeight:900,fontSize:'28px',color:'var(--mauve)',letterSpacing:'-0.5px',lineHeight:1}}>80%</div>
                <div style={{fontSize:'12px',fontWeight:500,color:'var(--deep-mind)',margin:'4px 0 2px'}}>~1,000 words · A2</div>
                <div style={{fontSize:'12px',fontWeight:300,color:'rgba(28,26,58,0.6)',lineHeight:1.5}}>1 word in 5 is still unknown. Conversations tire you out.</div>
                <div style={{fontSize:'11px',color:'var(--dendrite)',marginTop:'6px',fontWeight:500}}>⚠ Duolingo stops here.</div>
              </div>
              <div style={{padding:'16px 18px',background:'#C8C2F0',borderRadius:'12px',borderLeft:'3px solid var(--synapse)',boxShadow:'0 0 0 2px var(--synapse)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'2px'}}>
                  <div style={{fontFamily:"'Fraunces', serif",fontWeight:900,fontSize:'28px',color:'var(--synapse)',letterSpacing:'-0.5px',lineHeight:1}}>95%</div>
                  <span style={{background:'var(--synapse)',color:'var(--white-matter)',fontSize:'10px',fontWeight:500,padding:'2px 8px',borderRadius:'99px'}}>the goal</span>
                </div>
                <div style={{fontSize:'12px',fontWeight:500,color:'var(--deep-mind)',margin:'4px 0 2px'}}>~3,000 words · B2</div>
                <div style={{fontSize:'12px',fontWeight:300,color:'rgba(28,26,58,0.65)',lineHeight:1.5}}>Context-guessing works. Conversations feel effortless.</div>
              </div>
              <div style={{padding:'16px 18px',background:'var(--white-matter)',borderRadius:'12px',borderLeft:'3px solid var(--signal)',border:'0.5px solid rgba(28,26,58,0.08)'}}>
                <div style={{fontFamily:"'Fraunces', serif",fontWeight:900,fontSize:'28px',color:'var(--signal)',letterSpacing:'-0.5px',lineHeight:1}}>98%</div>
                <div style={{fontSize:'12px',fontWeight:500,color:'var(--deep-mind)',margin:'4px 0 2px'}}>~5,000 words · C1</div>
                <div style={{fontSize:'12px',fontWeight:300,color:'rgba(28,26,58,0.6)',lineHeight:1.5}}>Near-native. You catch jokes, dialects, fast speech.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave: cream → cream-dark */}
      <Wave from="var(--cream)" to="var(--cream-dark)" height={45} shape="shallow"/>

      {/* ── PHILOSOPHY + PRICING ── */}
      <section id="pricing" className="pricing-section">
        <div className="section-inner">
          <div className="s-eye">The philosophy</div>
          <h2 className="s-title">
            <div>Tired of</div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
              fake{' '}
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M8 18 Q18 5 28 18 Q18 31 8 18Z" fill="#EF9F27" opacity="0.85"/>
              </svg>
              {' '}progress?
            </div>
          </h2>

          <div className="anti-grid">
            <div className="anti-card anti-no">
              <div className="anti-label" style={{color:'rgba(28,26,58,0.6)'}}>
                <div className="anti-dot" style={{background:'rgba(123,127,168,.25)'}}/>
                What we don't do
              </div>
              <ul className="anti-list">
                {['Points, badges, XP, leaderboards','Celebrations when you finish','Streak copy that praises you','Grammar lessons or courses','Social features','Notifications designed to addict','Fake levels that feel like progress'].map(t => (
                  <li key={t}><span className="mark">✕</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="anti-card anti-yes">
              <div className="anti-label" style={{color:'var(--mauve)'}}>
                <div className="anti-dot" style={{background:'var(--mauve)'}}/>
                What we do instead
              </div>
              <ul className="anti-list">
                {['3,000 frequency-ordered words, nothing else','Spaced repetition that actually works','Honest coverage %, always visible','Absurd example sentences (they stick)','Bedtime mode — review before sleep','Loss aversion framing, not praise','One-time annual pricing, no nonsense'].map(t => (
                  <li key={t}><span className="mark">✓</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pricing-grid">
            <div className="price-card">
              <div className="p-tier">Free</div>
              <div className="p-amt">€0</div>
              <div className="p-period">forever</div>
              <div className="p-desc">First 500 words. A1–A2 core. Enough to see if this is for you.</div>
            </div>
            <div className="price-card featured">
              <div className="price-badge">Most sensible</div>
              <div className="p-tier">Annual</div>
              <div className="p-amt">€29</div>
              <div className="p-period">per year</div>
              <div className="p-desc">Full 5,000-word deck. Less than one Spanish class. More impact than ten.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section" id="cta">
        <svg style={{position:'absolute',top:'44px',left:'80px',pointerEvents:'none'}} width="68" height="68" viewBox="0 0 68 68" fill="none">
          <path d="M10 58 Q18 16 34 34 Q50 52 58 10" stroke="#B07FA8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <svg style={{position:'absolute',top:'56px',right:'96px',pointerEvents:'none'}} width="54" height="54" viewBox="0 0 54 54" fill="none">
          <circle cx="27" cy="27" r="25" stroke="#534AB7" strokeWidth="1" strokeDasharray="4 3"/>
        </svg>
        <svg style={{position:'absolute',bottom:'76px',left:'120px',pointerEvents:'none'}} width="62" height="34" viewBox="0 0 62 34" fill="none">
          <path d="M4 17 Q17 4 31 17 Q45 30 58 17" stroke="#2D7A5F" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <svg style={{position:'absolute',bottom:'60px',right:'80px',pointerEvents:'none'}} width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 2 L19 11 L29 11 L21 17 L24 26 L16 20 L8 26 L11 17 L3 11 L13 11Z" fill="#EF9F27" opacity="0.7"/>
        </svg>

        <div className="cta-title">
          <div style={{display:'flex',justifyContent:'center'}}>Stop collecting</div>
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'10px'}}>
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
              <path d="M21 3 L25 15 L38 15 L28 23 L32 35 L21 27 L10 35 L14 23 L4 15 L17 15Z" fill="none" stroke="#EF9F27" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            streaks.
          </div>
          <div style={{display:'flex',justifyContent:'center'}}>Start collecting</div>
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'10px'}}>
            words that{' '}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" fill="#534AB7" opacity="0.1"/>
              <path d="M10 20 Q20 9 30 20" stroke="#534AB7" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="20" r="2.5" fill="#534AB7"/>
              <circle cx="30" cy="20" r="2.5" fill="#534AB7"/>
              <path d="M14 28 Q20 35 26 28" stroke="#534AB7" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={{color:'var(--synapse)'}}>matter.</span>
          </div>
        </div>

        <p className="cta-sub">First 100 words free. No card details. Takes 10 seconds.</p>
        <div className="cta-actions">
          <a href="/get-started" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Start free — sign in with Google
          </a>
        </div>
        <div className="cta-note">100 words free · Full 1,500 words for €5 one-time · No subscription</div>
      </section>
    </div>
  )
}

/* ── Sub-components ── */

function HeroStat({ num, label }) {
  return (
    <div style={{display:'flex',flexDirection:'column'}}>
      <span style={{fontFamily:"'Fraunces', serif",fontWeight:700,fontSize:'30px',color:'var(--deep-mind)',letterSpacing:'-0.5px',lineHeight:1}}>{num}</span>
      <span style={{fontSize:'12px',color:'var(--cortex)',marginTop:'3px'}}>{label}</span>
    </div>
  )
}

function WordPoster() {
  return (
    <div style={{position:'relative',height:'460px'}}>
      {/* Logo element as decorative backdrop */}
      <Image
        src="/logo-element.png"
        alt=""
        width={260}
        height={260}
        style={{
          position:'absolute',top:'-10px',right:'-10px',
          opacity:0.12,
          filter:'blur(1px)',
          pointerEvents:'none',
          zIndex:0,
          objectFit:'contain',
        }}
      />

      {/* Main word card */}
      <div style={{
        position:'absolute',top:'30px',left:'20px',right:'20px',
        background:'var(--deep-mind)',borderRadius:'20px',
        padding:'32px 36px 28px',
        boxShadow:'0 24px 64px rgba(28,26,58,0.22), 0 4px 16px rgba(28,26,58,0.1)',
        zIndex:1,
      }}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
          <span style={{fontSize:'11px',fontWeight:500,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--cortex)'}}>verb · high frequency</span>
          <span style={{fontSize:'11px',color:'rgba(123,127,168,0.45)'}}>#847</span>
        </div>
        <div style={{fontFamily:"'Fraunces', serif",fontWeight:900,fontSize:'64px',color:'var(--white-matter)',letterSpacing:'-3px',lineHeight:1,marginBottom:'8px'}}>
          recordar
        </div>
        <div style={{fontSize:'14px',color:'var(--cortex)',fontWeight:300,marginBottom:'20px'}}>re · cor · dár</div>
        <div style={{background:'rgba(255,255,255,0.07)',borderRadius:'12px',padding:'14px 16px'}}>
          <div style={{fontFamily:"'Fraunces', serif",fontWeight:500,fontSize:'18px',color:'var(--mauve)',marginBottom:'6px',letterSpacing:'-0.3px'}}>to remember / to remind</div>
          <div style={{fontSize:'13px',color:'var(--cortex)',fontWeight:300,lineHeight:1.55,borderLeft:'2px solid rgba(255,255,255,0.1)',paddingLeft:'10px'}}>
            Mi abuela recuerda todos los chistes malos — y los cuenta igual.
          </div>
        </div>
      </div>

      {/* Floating accent cards */}
      <div style={{
        position:'absolute',bottom:'60px',right:'-10px',
        background:'var(--white-matter)',borderRadius:'12px',
        padding:'14px 18px',border:'0.5px solid rgba(28,26,58,0.09)',
        boxShadow:'0 8px 24px rgba(28,26,58,0.1)',
        zIndex:2,minWidth:'140px',
      }}>
        <div style={{fontSize:'11px',fontWeight:500,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--cortex)',marginBottom:'6px'}}>Coverage</div>
        <div style={{fontFamily:"'Fraunces', serif",fontWeight:700,fontSize:'28px',color:'var(--synapse)',letterSpacing:'-0.5px',lineHeight:1}}>74%</div>
        <div style={{fontSize:'11px',color:'var(--cortex)',marginTop:'3px'}}>of spoken Spanish</div>
        <div style={{height:'4px',background:'var(--cream-dark)',borderRadius:'99px',marginTop:'8px'}}>
          <div style={{height:'100%',width:'74%',background:'var(--synapse)',borderRadius:'99px'}}/>
        </div>
      </div>

      <div style={{
        position:'absolute',bottom:'0px',left:'0px',
        background:'var(--white-matter)',borderRadius:'12px',
        padding:'14px 18px',border:'0.5px solid rgba(28,26,58,0.09)',
        boxShadow:'0 8px 24px rgba(28,26,58,0.1)',
        zIndex:2,
      }}>
        <div style={{fontSize:'11px',fontWeight:500,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--cortex)',marginBottom:'6px'}}>Streak</div>
        <div style={{fontFamily:"'Fraunces', serif",fontWeight:700,fontSize:'28px',color:'var(--dendrite)',letterSpacing:'-0.5px',lineHeight:1}}>12</div>
        <div style={{fontSize:'11px',color:'var(--cortex)',marginTop:'3px'}}>Don't break it.</div>
        <div style={{display:'flex',gap:'3px',marginTop:'8px'}}>
          {['✓','✓','✓','✓','✓'].map((c,i)=>(
            <div key={i} style={{width:'20px',height:'20px',borderRadius:'4px',background:'var(--signal-light)',color:'var(--signal)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',fontWeight:500}}>{c}</div>
          ))}
          <div style={{width:'20px',height:'20px',borderRadius:'4px',background:'var(--synapse)',color:'var(--white-matter)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',fontWeight:500}}>T</div>
          <div style={{width:'20px',height:'20px',borderRadius:'4px',background:'var(--cream-dark)',color:'var(--cortex)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',fontWeight:500}}>S</div>
        </div>
      </div>

      <svg style={{position:'absolute',top:'0px',left:'-30px',zIndex:0,pointerEvents:'none'}} width="40" height="60" viewBox="0 0 40 60" fill="none">
        <path d="M20 4 Q36 16 20 28 Q4 40 20 56" stroke="#B07FA8" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <svg style={{position:'absolute',top:'-10px',left:'30%',zIndex:0,pointerEvents:'none'}} width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2 L14 8 L21 8 L15 12 L18 19 L12 15 L6 19 L9 12 L3 8 L10 8Z" fill="#EF9F27"/>
      </svg>
    </div>
  )
}

function ScienceCard({ num, numColor, dotColor, bg, emoji, label, body, rotate = 0 }) {
  return (
    <div className="science-card" style={{
      background: bg, borderRadius: '24px',
      padding: '36px 28px 32px', position: 'relative', overflow: 'hidden',
      transform: `rotate(${rotate}deg)`,
      textAlign: 'center',
      boxShadow: '0 8px 28px rgba(28,26,58,0.10)',
    }}>
      {/* Dashed inner frame */}
      <div style={{
        position:'absolute', inset:'10px', borderRadius:'18px',
        border:`2px dashed ${dotColor || numColor}`,
        opacity: 0.35, pointerEvents:'none',
      }}/>
      {/* Corner dots */}
      {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
        <div key={v+h} style={{
          position:'absolute', [v]:'18px', [h]:'18px',
          width:'7px', height:'7px', borderRadius:'50%',
          background: dotColor || numColor, opacity:0.55,
        }}/>
      ))}

      <div style={{position:'relative', zIndex:1}}>
        <div style={{fontSize:'44px',lineHeight:1,marginBottom:'14px'}}>{emoji}</div>
        <div style={{fontFamily:"'Fraunces', serif",fontWeight:900,fontSize:'60px',letterSpacing:'-2.5px',lineHeight:1,color:numColor,marginBottom:'10px'}}>{num}</div>
        <div style={{fontSize:'15px',fontWeight:600,color:'var(--deep-mind)',marginBottom:'10px',letterSpacing:'-0.2px'}}>{label}</div>
        <div style={{fontSize:'13px',fontWeight:300,color:'rgba(28,26,58,0.68)',lineHeight:1.6}}>{body}</div>
      </div>
    </div>
  )
}

function MilestoneTile({ pct, words, level, desc, color, bg, border, note, featured }) {
  return (
    <div style={{
      background: bg, borderRadius: '20px', padding: '28px 24px',
      border: `0.5px solid ${border}`, position: 'relative',
      ...(featured ? {boxShadow:'0 0 0 2.5px var(--synapse)'} : {}),
    }}>
      {featured && (
        <div style={{
          position:'absolute',top:'-11px',left:'50%',transform:'translateX(-50%)',
          background:'var(--synapse)',color:'var(--white-matter)',
          fontSize:'10px',fontWeight:500,padding:'3px 14px',borderRadius:'99px',whiteSpace:'nowrap',
          fontFamily:"'Cabinet Grotesk', sans-serif",
        }}>The target</div>
      )}
      <div style={{fontFamily:"'Fraunces', serif",fontWeight:900,fontSize:'52px',letterSpacing:'-2px',lineHeight:1,color:color,marginBottom:'8px'}}>{pct}</div>
      <div style={{fontSize:'13px',fontWeight:500,color:'var(--deep-mind)',marginBottom:'2px'}}>{words}</div>
      <div style={{fontSize:'11px',fontWeight:500,letterSpacing:'.05em',textTransform:'uppercase',color:color,marginBottom:'10px'}}>{level}</div>
      <div style={{fontSize:'13px',fontWeight:300,color:'rgba(28,26,58,0.6)',lineHeight:1.55}}>{desc}</div>
      {note && <div style={{fontSize:'11px',color:'var(--dendrite)',marginTop:'10px',fontWeight:500}}>{note}</div>}
    </div>
  )
}
