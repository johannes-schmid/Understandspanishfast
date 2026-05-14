import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { words } from '@/data/words'

export const metadata = { title: 'Dashboard | Neuro' }

const MILESTONES = [
  { words: 100,  pct: 25,  label: 'Basic conversations' },
  { words: 500,  pct: 55,  label: 'Follow simple stories' },
  { words: 1000, pct: 72,  label: 'Understand most TV dialogue' },
  { words: 1500, pct: 85,  label: 'Full fluency foundation' },
]

function comprehensionPct(learned) {
  // Approximation: 1500 words ≈ 85% of spoken Spanish
  return Math.round(Math.min(learned / 1500, 1) * 85)
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const now = new Date()

  const [progressResult, settingsResult] = await Promise.all([
    supabase
      .from('user_word_progress')
      .select('word_rank, status')
      .eq('user_id', user.id),
    supabase
      .from('user_settings')
      .select('unlocked')
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  const allProgress = progressResult.data ?? []
  const knownSet = new Set(
    allProgress.filter(r => ['good', 'easy'].includes(r.status)).map(r => r.word_rank)
  )
  const learned = knownSet.size
  const unlocked = settingsResult.data?.unlocked ?? false
  const name = user.user_metadata?.full_name?.split(' ')[0] ?? 'there'

  // Requires migration — show 0 until columns exist
  const dueCount = 0
  const newTodayCount = 0

  // Next word to preview
  const nextWord = words.find(w => !knownSet.has(w.rank)) ?? null

  const comprehension = comprehensionPct(learned)
  const nextMilestone = MILESTONES.find(m => m.words > learned)

  const params = await searchParams
  const justUnlocked = params?.unlocked === 'true'

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>

        {justUnlocked && (
          <div style={{
            background: 'var(--signal-light)', border: '1px solid var(--signal)',
            borderRadius: '12px', padding: '14px 20px', marginBottom: '32px',
            color: 'var(--signal)', fontSize: '15px'
          }}>
            Full access unlocked. All 1,500 words are now yours.
          </div>
        )}

        {/* Greeting */}
        <p style={{ color: 'var(--cortex)', fontSize: '15px', marginBottom: '4px' }}>
          {getGreeting()}, {name}
        </p>

        {/* Desktop: 2-col grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginTop: '24px'
        }}>

          {/* Left col: comprehension + stats */}
          <div>
            {/* Comprehension hero */}
            <div style={{
              background: 'var(--deep-mind)', borderRadius: '20px',
              padding: '36px 32px', marginBottom: '16px', textAlign: 'center',
              boxShadow: '0 8px 32px rgba(28,26,58,0.14)'
            }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                Current comprehension
              </p>
              <p style={{ fontFamily: 'Fraunces', fontSize: 'clamp(64px, 12vw, 88px)', fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: '4px' }}>
                {comprehension}%
              </p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                of everyday spoken Spanish
              </p>

              {nextMilestone && (
                <div style={{
                  marginTop: '24px', padding: '14px 16px',
                  background: 'rgba(255,255,255,0.08)', borderRadius: '12px',
                  textAlign: 'left'
                }}>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                    Next milestone → {nextMilestone.words} words
                  </p>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                    {nextMilestone.label} ({nextMilestone.pct}%)
                  </p>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '10px' }}>
                    <div style={{
                      height: '100%', borderRadius: '2px',
                      background: 'var(--purple-mid)',
                      width: `${Math.min(100, Math.round((learned / nextMilestone.words) * 100))}%`,
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>
                    {learned} / {nextMilestone.words} words
                  </p>
                </div>
              )}
            </div>

            {/* Stat chips */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { value: learned, label: 'Known', color: 'var(--signal)' },
                { value: dueCount, label: 'Due today', color: 'var(--synapse)' },
                { value: newTodayCount, label: 'New today', color: 'var(--deep-mind)' },
              ].map(chip => (
                <div key={chip.label} style={{
                  background: 'var(--white-matter)', borderRadius: '14px',
                  padding: '16px 12px', textAlign: 'center',
                  border: '1px solid var(--cream-dark)'
                }}>
                  <div style={{ fontFamily: 'Fraunces', fontSize: '26px', fontWeight: 700, color: chip.color, lineHeight: 1 }}>
                    {chip.value}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--cortex)', marginTop: '4px' }}>{chip.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right col: actions + preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Study CTA */}
            <Link href="/study" style={{
              display: 'block', textAlign: 'center',
              background: 'var(--synapse)', color: '#fff',
              borderRadius: '16px', padding: '20px',
              fontWeight: 600, fontSize: '18px',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(83,74,183,0.3)'
            }}>
              {dueCount > 0
                ? `Review ${dueCount} due card${dueCount !== 1 ? 's' : ''} →`
                : learned === 0 ? 'Start studying →' : 'Study new words →'
              }
            </Link>

            {/* Next word preview */}
            {nextWord && (
              <div style={{
                background: 'var(--white-matter)', borderRadius: '16px',
                padding: '20px 24px', border: '1px solid var(--cream-dark)'
              }}>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cortex)', marginBottom: '12px' }}>
                  Up next
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
                  <p style={{ fontFamily: 'Fraunces', fontSize: '28px', fontWeight: 700, color: 'var(--deep-mind)' }}>
                    {nextWord.word}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--cortex)' }}>{nextWord.pos}</p>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--cortex)' }}>
                  {nextWord.meanings[0]}
                </p>
                {nextWord.example_es && (
                  <p style={{ fontSize: '13px', color: 'var(--cortex)', fontStyle: 'italic', marginTop: '8px', lineHeight: 1.5, opacity: 0.7 }}>
                    "{nextWord.example_es}"
                  </p>
                )}
              </div>
            )}

            {/* Reading feature card */}
            <Link href="/reading" style={{
              display: 'block', textDecoration: 'none',
              background: 'var(--fog)', borderRadius: '16px',
              padding: '20px 24px', border: '1px solid #C8C2F0'
            }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--synapse)', marginBottom: '8px' }}>
                Reading
              </p>
              <p style={{ fontFamily: 'Fraunces', fontSize: '18px', fontWeight: 700, color: 'var(--deep-mind)', marginBottom: '6px' }}>
                Read with your words
              </p>
              <p style={{ fontSize: '13px', color: 'var(--cortex)', lineHeight: 1.55 }}>
                Short articles where known words are highlighted. See your vocabulary in action.
              </p>
              <p style={{ fontSize: '13px', color: 'var(--synapse)', marginTop: '10px', fontWeight: 500 }}>
                Explore articles →
              </p>
            </Link>

            {/* Milestones */}
            <div style={{
              background: 'var(--white-matter)', borderRadius: '16px',
              padding: '20px 24px', border: '1px solid var(--cream-dark)'
            }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cortex)', marginBottom: '14px' }}>
                Milestones
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {MILESTONES.map(m => {
                  const done = learned >= m.words
                  return (
                    <div key={m.words} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 14px', borderRadius: '10px',
                      background: done ? 'var(--signal-light)' : 'transparent',
                      border: `1px solid ${done ? 'var(--signal)' : 'var(--cream-dark)'}`,
                    }}>
                      <span style={{ fontSize: '14px', color: done ? 'var(--signal)' : 'var(--cortex)' }}>
                        {done ? '✓' : '○'}
                      </span>
                      <div>
                        <span style={{ fontWeight: 500, color: 'var(--deep-mind)', fontSize: '14px' }}>
                          {m.words} words
                        </span>
                        <span style={{ color: 'var(--cortex)', fontSize: '12px', marginLeft: '8px' }}>
                          {m.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {!unlocked && (
              <div style={{
                padding: '20px 24px', borderRadius: '16px',
                background: 'var(--fog)', border: '1px solid var(--purple-mid)',
                textAlign: 'center'
              }}>
                <p style={{ fontFamily: 'Fraunces', fontSize: '18px', fontWeight: 700, color: 'var(--deep-mind)', marginBottom: '6px' }}>
                  First 100 words are free
                </p>
                <p style={{ color: 'var(--cortex)', fontSize: '13px', marginBottom: '16px' }}>
                  Unlock all 1,500 words for €5 — one-time, no subscription.
                </p>
                <Link href="/study" style={{
                  background: 'var(--synapse)', color: '#fff',
                  borderRadius: '10px', padding: '11px 24px',
                  fontWeight: 500, fontSize: '14px', textDecoration: 'none'
                }}>
                  Get full access — €5
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  )
}
