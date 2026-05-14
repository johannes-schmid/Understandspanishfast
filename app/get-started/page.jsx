import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SignInButton } from '@/components/AuthButton'

export const metadata = { title: 'Get started free | Neuro' }

const WHAT_YOU_GET = [
  { icon: '📚', title: 'First 100 words — free, forever', body: 'Start immediately. No card, no trial, no expiry.' },
  { icon: '🧠', title: 'Science-backed flashcards', body: 'Again · Hard · Good · Easy. Each answer schedules the next review at the optimal time.' },
  { icon: '📊', title: 'Real comprehension tracking', body: 'Watch your % of everyday Spanish rise. Not XP — actual coverage.' },
  { icon: '🎯', title: 'Frequency-first order', body: 'Words ranked by real-world usage. Learn what actually matters, in the right order.' },
]

const MILESTONES = [
  { words: 100,  pct: '~50%', label: 'Comprehension preview',         free: true },
  { words: 500,  pct: '~70%', label: 'Everyday conversations',        free: false },
  { words: 1000, pct: '~80%', label: 'Understand most content',       free: false },
  { words: 1500, pct: '~87%', label: 'Strong comprehension foundation', free: false },
]

export default async function GetStartedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '88px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 32px 80px' }}>

        {/* Two-column grid on desktop, single column on mobile */}
        <div className="gs-grid">

          {/* ── LEFT: pitch ── */}
          <div className="gs-left">
            <h1 style={{ fontFamily: 'Fraunces', fontWeight: 900, fontSize: 'clamp(40px, 4.5vw, 62px)', lineHeight: 1.0, letterSpacing: '-2px', color: 'var(--deep-mind)', marginBottom: '20px' }}>
              <div>Stop collecting</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="32" height="32" viewBox="0 0 42 42" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M21 3 L25 15 L38 15 L28 23 L32 35 L21 27 L10 35 L14 23 L4 15 L17 15Z" fill="none" stroke="#EF9F27" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                streaks.
              </div>
              <div style={{ marginTop: '8px' }}>Start collecting</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                words that{' '}
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="20" cy="20" r="18" fill="#534AB7" opacity="0.1"/>
                  <path d="M10 20 Q20 9 30 20" stroke="#534AB7" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="10" cy="20" r="2.5" fill="#534AB7"/>
                  <circle cx="30" cy="20" r="2.5" fill="#534AB7"/>
                  <path d="M14 28 Q20 35 26 28" stroke="#534AB7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ color: 'var(--synapse)' }}>matter.</span>
              </div>
            </h1>
            <p style={{ color: 'var(--cortex)', fontSize: '15px', lineHeight: 1.65, marginBottom: '28px', maxWidth: '400px' }}>
              No course. No lessons. Just the 1,500 most useful Spanish words, reviewed with the method that actually builds memory.
            </p>

            {/* Benefit list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {WHAT_YOU_GET.map(item => (
                <div key={item.title} style={{
                  display: 'flex', gap: '14px', alignItems: 'flex-start',
                  background: 'var(--white-matter)', borderRadius: '12px',
                  padding: '14px 16px', border: '1px solid var(--cream-dark)'
                }}>
                  <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>{item.icon}</span>
                  <div>
                    <p style={{ fontWeight: 500, color: 'var(--deep-mind)', fontSize: '14px', marginBottom: '2px' }}>{item.title}</p>
                    <p style={{ color: 'var(--cortex)', fontSize: '13px', lineHeight: 1.5 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing note */}
            <div style={{
              background: 'var(--fog)', borderRadius: '12px', padding: '14px 16px',
              display: 'flex', gap: '10px', alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
              <p style={{ fontSize: '13px', color: 'var(--cortex)', lineHeight: 1.55 }}>
                First 100 words are <strong style={{ color: 'var(--deep-mind)' }}>completely free</strong> with no time limit.
                Unlock all 1,500 for a one-time <strong style={{ color: 'var(--deep-mind)' }}>€5</strong> — no subscription.
              </p>
            </div>
          </div>

          {/* ── RIGHT: milestones + CTA ── */}
          <div className="gs-right">
            <div style={{
              background: 'var(--white-matter)', borderRadius: '16px',
              padding: '24px', border: '1px solid var(--cream-dark)', marginBottom: '16px'
            }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cortex)', marginBottom: '16px' }}>
                What you unlock as you go
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {MILESTONES.map((m, i) => (
                  <div key={m.words} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '11px 0',
                    borderBottom: i < MILESTONES.length - 1 ? '1px solid var(--cream-dark)' : 'none'
                  }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '9px', flexShrink: 0,
                      background: m.free ? 'var(--signal-light)' : 'var(--fog)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700,
                      color: m.free ? 'var(--signal)' : 'var(--synapse)',
                      fontFamily: 'Fraunces'
                    }}>
                      {m.words}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--deep-mind)' }}>{m.label}</p>
                      <p style={{ fontSize: '12px', color: 'var(--cortex)' }}>{m.pct} comprehension</p>
                    </div>
                    {m.free
                      ? <span style={{ fontSize: '10px', background: 'var(--signal-light)', color: 'var(--signal)', padding: '2px 9px', borderRadius: '99px', fontWeight: 600, whiteSpace: 'nowrap' }}>Free</span>
                      : <span style={{ fontSize: '10px', background: 'var(--fog)', color: 'var(--synapse)', padding: '2px 9px', borderRadius: '99px', fontWeight: 600, whiteSpace: 'nowrap' }}>€5</span>
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <SignInButton className="btn-google">
              <GoogleIcon />
              Sign in with Google — it's free
            </SignInButton>
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--cortex)', marginTop: '10px' }}>
              No password. No credit card. Takes 10 seconds.
            </p>
          </div>

        </div>
      </div>
    </main>
  )
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
