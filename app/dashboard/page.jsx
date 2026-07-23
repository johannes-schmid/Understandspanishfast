import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { words } from '@/data/words'
import { articles } from '@/data/articles'
import ProgressRing from '@/components/ProgressRing'
import ActivityHeatmap from '@/components/ActivityHeatmap'
import ArticleCard from '@/components/ArticleCard'
import UnlockTracker from '@/components/UnlockTracker'
import ReviewHeroCard from '@/components/ReviewHeroCard'
import { splitProgress } from '@/lib/userStats'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Dashboard | Most Common Spanish' }

const ACTIVITY_DAYS = 21 * 7

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

  const params = await searchParams
  const justUnlocked = params?.unlocked === 'true'

  // Stripe redirects here with ?unlocked=true after successful payment
  if (justUnlocked) {
    await supabase
      .from('user_settings')
      .upsert({ user_id: user.id, unlocked: true }, { onConflict: 'user_id' })
  }

  const activityStart = new Date()
  activityStart.setDate(activityStart.getDate() - ACTIVITY_DAYS)
  const activityStartIso = activityStart.toISOString().slice(0, 10)

  const [progressResult, settingsResult, activityResult] = await Promise.all([
    supabase
      .from('user_word_progress')
      .select('word_rank, status, next_review')
      .eq('user_id', user.id),
    supabase
      .from('user_settings')
      .select('unlocked')
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('study_activity')
      .select('date, cards_reviewed')
      .eq('user_id', user.id)
      .gte('date', activityStartIso),
  ])

  const allProgress = progressResult.data ?? []

  const { knownSet, learningSet, knownCount: learned, learningCount: learning, dueCount } =
    splitProgress(allProgress)

  const unlocked = settingsResult.data?.unlocked ?? false
  const name = user.user_metadata?.full_name?.split(' ')[0] ?? 'there'
  const activityData = (activityResult.data ?? []).map(r => ({ date: r.date, count: r.cards_reviewed ?? 0 }))

  const wordLimit = unlocked ? 1500 : 100
  const unseenCount = Math.min(20,
    words.filter(w => w.rank <= wordLimit && !knownSet.has(w.rank) && !learningSet.has(w.rank)).length
  )

  const nextWord = words.find(w => w.rank <= wordLimit && !knownSet.has(w.rank)) ?? null
  const hasCards = dueCount > 0 || unseenCount > 0

  const stats = [
    { value: learned,     label: 'Known',     color: 'var(--signal)' },
    { value: dueCount,    label: 'To review', color: 'var(--iris)' },
    { value: unseenCount, label: 'New',       color: 'var(--gold)' },
  ]

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '76px' }}>
      <div className="app-wrap">

        {justUnlocked && (
          <>
            <UnlockTracker />
            <div style={{
              background: 'var(--signal-light)', border: '1px solid var(--signal)',
              borderRadius: '12px', padding: '14px 20px', marginBottom: '18px',
              color: 'var(--signal)', fontSize: '15px',
            }}>
              Full access unlocked. All 1,500 words are now yours.
            </div>
          </>
        )}

        <div className="dash-body">

          {/* Greeting + stat chips (one row on desktop, split on mobile) */}
          <div className="dash-head">
            <div className="dash-greeting">
              <div style={{ fontSize: '13px', color: 'var(--sand)' }}>{getGreeting()},</div>
              <div style={{
                fontFamily: 'var(--font-fraunces), serif', fontWeight: 700,
                fontSize: '30px', color: 'var(--deep-mind)', lineHeight: 1.05,
              }}>
                {name}
              </div>
            </div>

            <div className="dash-stats">
              {stats.map(stat => (
                <div key={stat.label} className="dash-stat">
                  <div className="dash-stat-value" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="dash-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero + mastery ring */}
          <div className="dash-grid">
            <div className="dash-hero">
              <ReviewHeroCard
                word={nextWord}
                dueCount={dueCount}
                queueCount={unseenCount}
                hasCards={hasCards}
              />
            </div>
            <ProgressRing learned={learned} learning={learning} />
          </div>

          {/* Streak strip */}
          <ActivityHeatmap activityData={activityData} />

          {/* AI-powered themed session entry */}
          <Link href="/seed" className="dash-ai" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #2A1F4A 0%, #1A2842 100%)',
              borderRadius: '16px', padding: '18px 22px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
              border: '1px solid rgba(127,119,221,0.3)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: '-30px', right: '-20px',
                width: '120px', height: '120px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(127,119,221,0.3) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px' }}>✦</span>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(180,160,255,0.7)', letterSpacing: '0.14em' }}>
                    AI SESSION
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                  Studying for something specific?
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                  Describe it — get the exact vocab you'll need.
                </p>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px', flexShrink: 0, position: 'relative', zIndex: 1 }}>→</span>
            </div>
          </Link>

          {/* Reading */}
          <div className="dash-reading">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.14em', color: 'var(--iris)' }}>
                READING · MATCHED TO YOUR WORDS
              </span>
              <Link href="/reading" style={{ fontSize: '12px', color: 'var(--sand)', textDecoration: 'none' }}>
                See all →
              </Link>
            </div>
            <div className="dash-reading-grid">
              {articles.map(article => (
                <ArticleCard key={article.slug} article={article} knownCount={learned} />
              ))}
            </div>
          </div>

          {/* Unlock banner */}
          {!unlocked && (
            <div className="dash-unlock" style={{
              padding: '24px', borderRadius: '16px',
              background: 'var(--fog)', border: '1px solid var(--purple-mid)',
              textAlign: 'center',
            }}>
              <p style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '18px', fontWeight: 700, color: 'var(--deep-mind)', marginBottom: '6px' }}>
                First 100 words are free
              </p>
              <p style={{ color: 'var(--cortex)', fontSize: '13px', marginBottom: '16px' }}>
                Unlock all 1,500 words for €5 — one-time, no subscription.
              </p>
              <Link href="/study" style={{
                background: 'var(--synapse)', color: '#fff',
                borderRadius: '10px', padding: '11px 24px',
                fontWeight: 500, fontSize: '14px', textDecoration: 'none',
              }}>
                Get full access — €5
              </Link>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
