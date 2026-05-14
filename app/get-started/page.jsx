import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SignInButton } from '@/components/AuthButton'

export const metadata = {
  title: 'Get started free | Neuro',
  description: 'Start understanding real Spanish today. Learn the 1,500 most useful words with science-backed flashcards and real comprehension tracking.',
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

/* ── App mockup components ── */

function FlashcardMockup() {
  return (
    <div style={{
      background: 'var(--white-matter)',
      borderRadius: '20px',
      padding: '32px 24px',
      border: '1px solid var(--cream-dark)',
      boxShadow: '0 8px 40px rgba(83,74,183,0.08)',
      maxWidth: '340px',
      margin: '0 auto',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <span style={{ fontSize: '11px', color: 'var(--cortex)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Card 24 / 30</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ width: '24px', height: '4px', borderRadius: '2px', background: i <= 3 ? 'var(--synapse)' : 'var(--fog)' }} />
          ))}
        </div>
      </div>

      {/* Card */}
      <div style={{
        background: 'var(--cream)',
        borderRadius: '16px',
        padding: '36px 24px',
        textAlign: 'center',
        marginBottom: '20px',
        border: '1px solid var(--cream-dark)',
      }}>
        <p style={{ fontSize: '11px', color: 'var(--cortex)', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Spanish → English</p>
        <p style={{ fontFamily: 'Fraunces', fontSize: '48px', fontWeight: 700, color: 'var(--deep-mind)', lineHeight: 1, marginBottom: '8px' }}>saber</p>
        <p style={{ fontSize: '12px', color: 'var(--cortex)' }}>verb · #14 most common</p>
        <div style={{ marginTop: '16px', padding: '10px 14px', background: 'var(--white-matter)', borderRadius: '10px', textAlign: 'left' }}>
          <p style={{ fontSize: '12px', color: 'var(--cortex)', fontStyle: 'italic' }}>"No sé qué quiero."</p>
          <p style={{ fontSize: '12px', color: 'var(--synapse)', marginTop: '4px' }}>I don't know what I want.</p>
        </div>
      </div>

      {/* Rating buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {[
          { label: 'Again', color: '#E53E3E', bg: '#FFF5F5' },
          { label: 'Hard', color: '#DD6B20', bg: '#FFFAF0' },
          { label: 'Good', color: 'var(--signal)', bg: 'var(--signal-light)' },
          { label: 'Easy', color: 'var(--synapse)', bg: 'var(--fog)' },
        ].map(btn => (
          <button key={btn.label} style={{
            padding: '8px 4px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: btn.bg, color: btn.color, fontSize: '12px', fontWeight: 600,
            fontFamily: 'inherit',
          }}>
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function DashboardMockup() {
  const segments = 15
  const filled = 9
  return (
    <div style={{
      background: 'var(--white-matter)',
      borderRadius: '20px',
      padding: '28px 24px',
      border: '1px solid var(--cream-dark)',
      boxShadow: '0 8px 40px rgba(83,74,183,0.08)',
      maxWidth: '340px',
      margin: '0 auto',
    }}>
      <p style={{ fontSize: '13px', color: 'var(--cortex)', marginBottom: '2px' }}>Good morning, Anna</p>
      <p style={{ fontFamily: 'Fraunces', fontSize: '22px', fontWeight: 700, color: 'var(--deep-mind)', marginBottom: '24px' }}>Your progress</p>

      {/* Progress ring mockup */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <div style={{ position: 'relative', width: '140px', height: '140px' }}>
          <svg viewBox="0 0 140 140" width="140" height="140">
            <circle cx="70" cy="70" r="54" fill="none" stroke="var(--fog)" strokeWidth="10"/>
            <circle cx="70" cy="70" r="54" fill="none" stroke="var(--synapse)" strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 54 * 0.6} ${2 * Math.PI * 54 * 0.4}`}
              strokeDashoffset={2 * Math.PI * 54 * 0.25}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Fraunces', fontSize: '28px', fontWeight: 700, color: 'var(--deep-mind)', lineHeight: 1 }}>~67%</span>
            <span style={{ fontSize: '11px', color: 'var(--cortex)', marginTop: '2px' }}>comprehension</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        {[
          { val: '847', label: 'words learned' },
          { val: '74%', label: 'retention' },
          { val: '12', label: 'day streak' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--cream)', borderRadius: '10px', padding: '10px 8px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Fraunces', fontSize: '18px', fontWeight: 700, color: 'var(--deep-mind)', lineHeight: 1 }}>{s.val}</p>
            <p style={{ fontSize: '10px', color: 'var(--cortex)', marginTop: '2px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--fog)', borderRadius: '10px', padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--synapse)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.5 4h4l-3.3 2.4 1.3 4L7 9 3.5 11.4l1.3-4L1.5 5h4z" fill="white"/></svg>
        </div>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--deep-mind)' }}>Next: 1,000 words</p>
          <p style={{ fontSize: '11px', color: 'var(--cortex)' }}>153 more to understand 80% of content</p>
        </div>
      </div>
    </div>
  )
}

function WordListMockup() {
  const words = [
    { rank: 1,  word: 'ser',    pos: 'verb',     meaning: 'to be' },
    { rank: 2,  word: 'estar',  pos: 'verb',     meaning: 'to be (state)' },
    { rank: 3,  word: 'tener',  pos: 'verb',     meaning: 'to have' },
    { rank: 4,  word: 'hacer',  pos: 'verb',     meaning: 'to do / make' },
    { rank: 5,  word: 'poder',  pos: 'verb',     meaning: 'to be able to' },
    { rank: 6,  word: 'decir',  pos: 'verb',     meaning: 'to say / tell' },
  ]
  return (
    <div style={{
      background: 'var(--white-matter)',
      borderRadius: '20px',
      padding: '20px',
      border: '1px solid var(--cream-dark)',
      boxShadow: '0 8px 40px rgba(83,74,183,0.08)',
      maxWidth: '340px',
      margin: '0 auto',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <p style={{ fontFamily: 'Fraunces', fontSize: '16px', fontWeight: 700, color: 'var(--deep-mind)' }}>1,500 Words</p>
        <span style={{ fontSize: '11px', background: 'var(--fog)', color: 'var(--synapse)', padding: '3px 10px', borderRadius: '99px', fontWeight: 600 }}>Frequency ranked</span>
      </div>
      {words.map((w, i) => (
        <div key={w.rank} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '9px 0',
          borderBottom: i < words.length - 1 ? '1px solid var(--cream-dark)' : 'none',
        }}>
          <span style={{ width: '22px', fontSize: '11px', color: 'var(--cortex)', textAlign: 'right', flexShrink: 0 }}>#{w.rank}</span>
          <span style={{ fontFamily: 'Fraunces', fontSize: '17px', fontWeight: 600, color: 'var(--deep-mind)', minWidth: '60px' }}>{w.word}</span>
          <span style={{ fontSize: '11px', color: 'var(--cortex)', flex: 1 }}>{w.meaning}</span>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: i < 4 ? 'var(--signal-light)' : 'var(--fog)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {i < 4 && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5 3.5-4" stroke="var(--signal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
          </div>
        </div>
      ))}
      <p style={{ fontSize: '11px', color: 'var(--cortex)', textAlign: 'center', marginTop: '12px' }}>· · · 1,494 more words · · ·</p>
    </div>
  )
}

const STEPS = [
  {
    n: '01',
    title: 'Sign in with Google',
    body: 'One tap. No form, no password, no credit card.',
  },
  {
    n: '02',
    title: 'Study your first words',
    body: 'Start with the most useful Spanish words immediately. Each session takes 5–10 minutes.',
  },
  {
    n: '03',
    title: 'Watch your comprehension grow',
    body: 'The dashboard shows exactly how much real-world Spanish you can now understand.',
  },
]

const FEATURES = [
  {
    label: 'Frequency-ranked word list',
    body: 'All 1,500 words ordered by how often they appear in real Spanish — conversations, shows, news.',
    mockup: <WordListMockup />,
    side: 'right',
  },
  {
    label: 'Science-backed flashcards',
    body: 'Rate each card as Again, Hard, Good, or Easy. The algorithm schedules the next review at exactly the right moment to lock the word into memory.',
    mockup: <FlashcardMockup />,
    side: 'left',
  },
  {
    label: 'Real comprehension tracking',
    body: 'Not XP or streaks. Your dashboard shows the exact percentage of everyday Spanish you can understand — and what milestone is next.',
    mockup: <DashboardMockup />,
    side: 'right',
  },
]

const COMPREHENSION = [
  { words: 100,  pct: '~50%', desc: 'Understand every other word in a conversation' },
  { words: 500,  pct: '~70%', desc: 'Follow most everyday exchanges' },
  { words: 1000, pct: '~80%', desc: 'Understand the majority of Netflix content' },
  { words: 1500, pct: '~87%', desc: 'Strong comprehension across all contexts' },
]

export default async function GetStartedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '72px' }}>

      {/* ── Hero ── */}
      <section style={{ textAlign: 'center', padding: '80px 24px 64px', maxWidth: '640px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'var(--fog)', borderRadius: '99px',
          padding: '5px 14px', marginBottom: '28px',
          fontSize: '12px', fontWeight: 600, color: 'var(--synapse)',
          letterSpacing: '0.04em',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="var(--synapse)" opacity="0.25"/><circle cx="5" cy="5" r="2" fill="var(--synapse)"/></svg>
          Free to start — no card required
        </div>

        <h1 style={{
          fontFamily: 'Fraunces',
          fontWeight: 900,
          fontSize: 'clamp(40px, 6vw, 68px)',
          lineHeight: 1.05,
          letterSpacing: '-2px',
          color: 'var(--deep-mind)',
          marginBottom: '24px',
        }}>
          Understand real Spanish.<br />
          <span style={{ color: 'var(--synapse)' }}>Faster than you think.</span>
        </h1>

        <p style={{ fontSize: '18px', color: 'var(--cortex)', lineHeight: 1.65, marginBottom: '40px', maxWidth: '480px', margin: '0 auto 40px' }}>
          The 1,500 most useful Spanish words, in the right order, with a proven review method. Watch your comprehension rise from zero to 87%—word by word.
        </p>

        <SignInButton className="btn-google" style={{ maxWidth: '320px', margin: '0 auto' }}>
          <GoogleIcon />
          Get started free with Google
        </SignInButton>
        <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--cortex)' }}>
          No password. No credit card. Takes 10 seconds.
        </p>
      </section>

      {/* ── Stat bar ── */}
      <section style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px 72px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px', background: 'var(--cream-dark)',
          border: '1px solid var(--cream-dark)', borderRadius: '16px', overflow: 'hidden',
        }}>
          {[
            { val: '1,500', label: 'high-frequency words' },
            { val: '87%', label: 'comprehension at the end' },
            { val: '5 min', label: 'avg. daily study time' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--white-matter)', padding: '20px 16px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Fraunces', fontSize: '28px', fontWeight: 700, color: 'var(--deep-mind)', lineHeight: 1 }}>{s.val}</p>
              <p style={{ fontSize: '12px', color: 'var(--cortex)', marginTop: '4px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature sections ── */}
      {FEATURES.map((feat, i) => (
        <section key={feat.label} style={{
          maxWidth: '900px', margin: '0 auto', padding: '0 24px 96px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}>
            {feat.side === 'right' ? (
              <>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--synapse)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Feature {i + 1}</span>
                  <h2 style={{ fontFamily: 'Fraunces', fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 700, color: 'var(--deep-mind)', lineHeight: 1.15, marginTop: '8px', marginBottom: '16px' }}>
                    {feat.label}
                  </h2>
                  <p style={{ fontSize: '16px', color: 'var(--cortex)', lineHeight: 1.7 }}>{feat.body}</p>
                </div>
                <div>{feat.mockup}</div>
              </>
            ) : (
              <>
                <div style={{ order: 2 }}>
                  <span style={{ fontSize: '11px', color: 'var(--synapse)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Feature {i + 1}</span>
                  <h2 style={{ fontFamily: 'Fraunces', fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 700, color: 'var(--deep-mind)', lineHeight: 1.15, marginTop: '8px', marginBottom: '16px' }}>
                    {feat.label}
                  </h2>
                  <p style={{ fontSize: '16px', color: 'var(--cortex)', lineHeight: 1.7 }}>{feat.body}</p>
                </div>
                <div style={{ order: 1 }}>{feat.mockup}</div>
              </>
            )}
          </div>
        </section>
      ))}

      {/* ── Comprehension path ── */}
      <section style={{ background: 'var(--deep-mind)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', color: 'var(--purple-mid)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>Your path</p>
          <h2 style={{ fontFamily: 'Fraunces', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#FAF7F2', lineHeight: 1.15, marginBottom: '48px', textAlign: 'center' }}>
            Every word expands what you understand
          </h2>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '18px', top: '12px', bottom: '12px', width: '2px', background: 'rgba(127,119,221,0.2)', borderRadius: '1px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {COMPREHENSION.map((m, i) => (
                <div key={m.words} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', padding: '16px 0' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                    background: i === 0 ? 'var(--signal)' : 'rgba(127,119,221,0.2)',
                    border: i === 0 ? 'none' : '1px solid rgba(127,119,221,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', zIndex: 1,
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: i === 0 ? 'white' : 'var(--purple-mid)' }}>{m.words}</span>
                  </div>
                  <div style={{ paddingTop: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'Fraunces', fontSize: '24px', fontWeight: 700, color: i === 0 ? 'var(--signal-light)' : '#FAF7F2' }}>{m.pct}</span>
                      <span style={{ fontSize: '12px', color: 'var(--purple-mid)' }}>of everyday Spanish</span>
                    </div>
                    <p style={{ fontSize: '14px', color: 'rgba(250,247,242,0.6)', lineHeight: 1.5 }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ maxWidth: '680px', margin: '0 auto', padding: '80px 24px' }}>
        <p style={{ fontSize: '11px', color: 'var(--synapse)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>How it works</p>
        <h2 style={{ fontFamily: 'Fraunces', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: 'var(--deep-mind)', lineHeight: 1.15, marginBottom: '48px', textAlign: 'center' }}>
          Three steps to real comprehension
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{
              display: 'flex', gap: '20px', alignItems: 'flex-start',
              background: 'var(--white-matter)', borderRadius: '16px', padding: '24px',
              border: '1px solid var(--cream-dark)',
            }}>
              <span style={{
                fontFamily: 'Fraunces', fontSize: '13px', fontWeight: 700,
                color: 'var(--synapse)', background: 'var(--fog)',
                borderRadius: '8px', padding: '4px 10px', flexShrink: 0, marginTop: '1px',
              }}>{s.n}</span>
              <div>
                <p style={{ fontWeight: 600, fontSize: '16px', color: 'var(--deep-mind)', marginBottom: '4px' }}>{s.title}</p>
                <p style={{ fontSize: '14px', color: 'var(--cortex)', lineHeight: 1.6 }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ background: 'var(--white-matter)', borderTop: '1px solid var(--cream-dark)', padding: '80px 24px 100px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Fraunces', fontSize: 'clamp(32px, 5vw, 50px)', fontWeight: 900, color: 'var(--deep-mind)', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '16px' }}>
            Start understanding Spanish today
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--cortex)', lineHeight: 1.65, marginBottom: '36px' }}>
            No course to finish. No lessons to sit through. Just the right words, at the right time — until you actually understand.
          </p>
          <SignInButton className="btn-google">
            <GoogleIcon />
            Get started free with Google
          </SignInButton>
          <p style={{ marginTop: '14px', fontSize: '13px', color: 'var(--cortex)' }}>
            Free to start. No credit card. 10 seconds.
          </p>
        </div>
      </section>

    </main>
  )
}
