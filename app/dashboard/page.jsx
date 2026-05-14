import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { words } from '@/data/words'
import { articles } from '@/data/articles'
import ProgressRing from '@/components/ProgressRing'
import ActivityHeatmap from '@/components/ActivityHeatmap'
import ArticleCard from '@/components/ArticleCard'
import UnlockTracker from '@/components/UnlockTracker'

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

  const params = await searchParams
  const justUnlocked = params?.unlocked === 'true'

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>

        {justUnlocked && (
          <>
            <UnlockTracker />
            <div style={{
              background: 'var(--signal-light)', border: '1px solid var(--signal)',
              borderRadius: '12px', padding: '14px 20px', marginBottom: '32px',
              color: 'var(--signal)', fontSize: '15px'
            }}>
              Full access unlocked. All 1,500 words are now yours.
            </div>
          </>
        )}

        {/* Greeting */}
        <p style={{ color: 'var(--cortex)', fontSize: '15px', marginBottom: '28px' }}>
          {getGreeting()}, {name}
        </p>

        {/* Donut */}
        <div style={{
          background: 'var(--white-matter)', borderRadius: '20px',
          padding: '32px 24px', marginBottom: '12px',
          border: '1px solid var(--cream-dark)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <ProgressRing learned={learned} learning={learning} />
        </div>

        {/* Session stats chips */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            background: dueCount > 0 ? 'var(--fog)' : 'var(--white-matter)',
            border: `1px solid ${dueCount > 0 ? 'var(--synapse)' : 'var(--cream-dark)'}`,
            borderRadius: '10px', padding: '10px 14px',
          }}>
            <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Fraunces', color: dueCount > 0 ? 'var(--synapse)' : 'var(--cortex)' }}>
              {dueCount}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--cortex)' }}>to review</span>
          </div>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            background: 'var(--white-matter)',
            border: '1px solid var(--cream-dark)',
            borderRadius: '10px', padding: '10px 14px',
          }}>
            <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Fraunces', color: 'var(--deep-mind)' }}>
              {unseenCount}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--cortex)' }}>new words</span>
          </div>
        </div>

        {/* Study CTA */}
        <Link href="/study" style={{
          display: 'block', textAlign: 'center',
          background: 'var(--synapse)', color: '#fff',
          borderRadius: '16px', padding: '18px',
          fontWeight: 600, fontSize: '17px',
          textDecoration: 'none',
          marginBottom: '16px',
          boxShadow: '0 4px 20px rgba(83,74,183,0.3)',
        }}>
          {dueCount > 0
            ? `Review ${dueCount} due card${dueCount !== 1 ? 's' : ''} →`
            : learned === 0 ? 'Start studying →' : 'Study new words →'
          }
        </Link>

        {/* Activity heatmap */}
        <div style={{ marginBottom: '16px' }}>
          <ActivityHeatmap activityData={activityData} />
        </div>

        {/* Article cards */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cortex)', marginBottom: '12px' }}>
            Reading
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}>
            {articles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                knownCount={learned}
              />
            ))}
          </div>
        </div>

        {/* Next word preview */}
        {nextWord && (
          <div style={{
            background: 'var(--white-matter)', borderRadius: '16px',
            padding: '20px 24px', border: '1px solid var(--cream-dark)',
            marginBottom: '16px',
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

        {!unlocked && (
          <div style={{
            padding: '20px 24px', borderRadius: '16px',
            background: 'var(--fog)', border: '1px solid var(--purple-mid)',
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
