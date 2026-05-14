import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProgressRing from '@/components/ProgressRing'

export const metadata = { title: 'Dashboard | Neuro' }

const MILESTONES = [
  { words: 100, label: 'Comprehension preview + first podcast snippet' },
  { words: 500, label: 'Full word library unlocked' },
  { words: 1000, label: 'Paste your own Spanish text' },
  { words: 1500, label: 'Completion — full fluency foundation' },
]

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [progressResult, settingsResult] = await Promise.all([
    supabase
      .from('user_word_progress')
      .select('word_rank', { count: 'exact' })
      .eq('user_id', user.id)
      .in('status', ['good', 'easy']),
    supabase
      .from('user_settings')
      .select('unlocked')
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  const learned = progressResult.count ?? 0
  const unlocked = settingsResult.data?.unlocked ?? false
  const name = user.user_metadata?.full_name?.split(' ')[0] ?? 'there'

  const nextMilestone = MILESTONES.find(m => m.words > learned) ?? MILESTONES[MILESTONES.length - 1]

  const params = await searchParams
  const justUnlocked = params?.unlocked === 'true'

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '100px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>

        {justUnlocked && (
          <div style={{
            background: 'var(--signal-light)', border: '1px solid var(--signal)',
            borderRadius: '12px', padding: '14px 20px', marginBottom: '32px',
            color: 'var(--signal)', fontSize: '15px'
          }}>
            Full access unlocked. All 1,500 words are now yours.
          </div>
        )}

        <p style={{ color: 'var(--cortex)', fontSize: '15px', marginBottom: '4px' }}>
          {getTimeOfDay()}, {name}
        </p>
        <h1 style={{ fontFamily: 'Fraunces', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 700, color: 'var(--deep-mind)', marginBottom: '40px' }}>
          Your progress
        </h1>

        {/* Progress ring */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
          <ProgressRing learned={learned} />
        </div>

        {/* Next milestone */}
        <div style={{
          background: 'var(--white-matter)', borderRadius: '16px',
          padding: '24px', marginBottom: '24px',
          border: '1px solid var(--cream-dark)'
        }}>
          <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cortex)', marginBottom: '8px' }}>
            Next milestone
          </p>
          <p style={{ fontFamily: 'Fraunces', fontSize: '22px', fontWeight: 700, color: 'var(--synapse)', marginBottom: '4px' }}>
            {nextMilestone.words} words
          </p>
          <p style={{ color: 'var(--cortex)', fontSize: '14px' }}>{nextMilestone.label}</p>
        </div>

        {/* CTA */}
        <Link href="/study" style={{
          display: 'block', textAlign: 'center',
          background: 'var(--synapse)', color: '#fff',
          borderRadius: '12px', padding: '16px',
          fontWeight: 500, fontSize: '17px',
          textDecoration: 'none', marginBottom: '48px',
          transition: 'opacity 0.15s'
        }}>
          {learned === 0 ? 'Start studying →' : 'Continue studying →'}
        </Link>

        {/* Milestones list */}
        <div>
          <p style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cortex)', marginBottom: '16px' }}>
            Milestones
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {MILESTONES.map(m => {
              const done = learned >= m.words
              return (
                <div key={m.words} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 18px', borderRadius: '12px',
                  background: done ? 'var(--signal-light)' : 'var(--white-matter)',
                  border: `1px solid ${done ? 'var(--signal)' : 'var(--cream-dark)'}`,
                  opacity: done ? 1 : 0.7
                }}>
                  <span style={{ fontSize: '18px' }}>{done ? '✓' : '○'}</span>
                  <div>
                    <span style={{ fontWeight: 500, color: 'var(--deep-mind)', fontSize: '15px' }}>
                      {m.words} words
                    </span>
                    <span style={{ color: 'var(--cortex)', fontSize: '13px', marginLeft: '10px' }}>
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
            marginTop: '40px', padding: '24px', borderRadius: '16px',
            background: 'var(--fog)', border: '1px solid var(--purple-mid)',
            textAlign: 'center'
          }}>
            <p style={{ fontFamily: 'Fraunces', fontSize: '20px', fontWeight: 700, color: 'var(--deep-mind)', marginBottom: '8px' }}>
              First 100 words are free
            </p>
            <p style={{ color: 'var(--cortex)', fontSize: '14px', marginBottom: '20px' }}>
              Unlock all 1,500 words for a one-time payment of €5.
            </p>
            <Link href="/study" style={{
              background: 'var(--synapse)', color: '#fff',
              borderRadius: '10px', padding: '12px 28px',
              fontWeight: 500, fontSize: '15px', textDecoration: 'none'
            }}>
              Get full access — €5
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}
