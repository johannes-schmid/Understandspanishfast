import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { words } from '@/data/words'
import { articles } from '@/data/articles'
import ProgressRing from '@/components/ProgressRing'
import ActivityHeatmap from '@/components/ActivityHeatmap'
import ArticleCard from '@/components/ArticleCard'
import UnlockTracker from '@/components/UnlockTracker'
import DashboardCardStack from '@/components/DashboardCardStack'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Dashboard | Neuro' }

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

  // Stripe redirects here with ?unlocked=true after successful payment
  if ((await searchParams).unlocked === 'true') {
    await supabase
      .from('user_settings')
      .upsert({ user_id: user.id, unlocked: true }, { onConflict: 'user_id' })
  }

  const fourMonthsAgo = new Date()
  fourMonthsAgo.setDate(fourMonthsAgo.getDate() - 112)
  const fourMonthsAgoIso = fourMonthsAgo.toISOString().slice(0, 10)

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
      .gte('date', fourMonthsAgoIso),
  ])

  const allProgress = progressResult.data ?? []
  const now = new Date()

  const knownSet = new Set(
    allProgress.filter(r => ['good', 'easy'].includes(r.status)).map(r => r.word_rank)
  )
  const learningSet = new Set(
    allProgress.filter(r => ['again', 'hard'].includes(r.status)).map(r => r.word_rank)
  )
  const learned = knownSet.size
  const learning = learningSet.size
  const unlocked = settingsResult.data?.unlocked ?? false
  const name = user.user_metadata?.full_name?.split(' ')[0] ?? 'there'
  const activityData = (activityResult.data ?? []).map(r => ({ date: r.date, count: r.cards_reviewed ?? 0 }))

  const dueCount = allProgress.filter(r =>
    r.next_review && new Date(r.next_review) <= now
  ).length

  const wordLimit = unlocked ? 1500 : 100
  const unseenCount = Math.min(20,
    words.filter(w => w.rank <= wordLimit && !knownSet.has(w.rank) && !learningSet.has(w.rank)).length
  )

  const nextWord = words.find(w => !knownSet.has(w.rank)) ?? null

  const nextWords = words
    .filter(w => w.rank <= wordLimit && !knownSet.has(w.rank))
    .slice(0, 3)

  const params = await searchParams
  const justUnlocked = params?.unlocked === 'true'

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 20px' }}>

        {justUnlocked && (
          <>
            <UnlockTracker />
            <div style={{
              background: 'var(--signal-light)', border: '1px solid var(--signal)',
              borderRadius: '12px', padding: '14px 20px', marginBottom: '24px',
              color: 'var(--signal)', fontSize: '15px'
            }}>
              Full access unlocked. All 1,500 words are now yours.
            </div>
          </>
        )}

        {/* Greeting */}
        <p style={{ color: 'var(--cortex)', fontSize: '14px', marginBottom: '20px' }}>
          {getGreeting()}, {name}
        </p>

        {/* Stats chips + donut ring (overlapping into vocab card) */}
        <div style={{ marginBottom: '16px' }}>
          <DashboardCardStack
            nextWords={nextWords}
            dueCount={dueCount}
            learned={learned}
            learning={learning}
            unseenCount={unseenCount}
          />
        </div>

        {/* Study streak — standalone card */}
        <div style={{
          borderRadius: '24px', overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(28,26,58,0.07)',
          marginBottom: '16px',
        }}>
          <ActivityHeatmap activityData={activityData} />
        </div>

        {/* Reading — standalone card */}
        <div style={{
          background: 'var(--white-matter)', borderRadius: '24px',
          padding: '24px 20px',
          border: '1px solid var(--cream-dark)',
          boxShadow: '0 4px 20px rgba(28,26,58,0.07)',
          marginBottom: '16px',
        }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cortex)', marginBottom: '12px' }}>
            Reading
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} knownCount={learned} />
            ))}
          </div>
        </div>

        {/* Unlock banner — standalone */}
        {!unlocked && (
          <div style={{
            padding: '24px', borderRadius: '24px',
            background: 'var(--fog)', border: '1px solid var(--purple-mid)',
            boxShadow: '0 4px 20px rgba(83,74,183,0.1)',
            textAlign: 'center',
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
              fontWeight: 500, fontSize: '14px', textDecoration: 'none',
            }}>
              Get full access — €5
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}
