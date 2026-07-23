import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { words } from '@/data/words'
import FlashCard from '@/components/FlashCard'
import { resolveActivePack } from '@/lib/activePack'

export const metadata = { title: 'Study | Most Common Spanish' }

function localIso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function computeStreak(countMap) {
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  // A streak survives today not being studied yet — start from yesterday in that case.
  if (!(countMap.get(localIso(cursor)) > 0)) cursor.setDate(cursor.getDate() - 1)

  let streak = 0
  while (countMap.get(localIso(cursor)) > 0) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export default async function StudyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Studying always studies the active pack. A custom active pack has its own
  // study page (which builds the queue from that pack's words).
  const activePack = await resolveActivePack(supabase, user.id)
  if (!activePack.isDefault) redirect(`/packs/${activePack.id}`)

  const streakWindowStart = new Date()
  streakWindowStart.setDate(streakWindowStart.getDate() - 400)

  const [progressResult, settingsResult, activityResult] = await Promise.all([
    supabase
      .from('user_word_progress')
      .select('word_rank, status')
      .eq('user_id', user.id),
    supabase
      .from('user_settings')
      .select('card_front, unlocked, tts_enabled')
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('study_activity')
      .select('date, cards_reviewed')
      .eq('user_id', user.id)
      .gte('date', localIso(streakWindowStart)),
  ])

  const allProgress = progressResult.data ?? []
  const progressMap = new Map(allProgress.map(r => [r.word_rank, r]))

  const knownRanks = allProgress
    .filter(r => ['good', 'easy'].includes(r.status))
    .map(r => r.word_rank)

  const activityMap = new Map((activityResult.data ?? []).map(r => [r.date, r.cards_reviewed ?? 0]))
  const streak = computeStreak(activityMap)
  const todayCount = activityMap.get(localIso(new Date())) ?? 0

  // These require the migration — default to empty until columns exist
  const dueRanks = new Set()
  const newTodayCount = 0

  const cardFront = settingsResult.data?.card_front ?? 'spanish'
  const unlocked = settingsResult.data?.unlocked ?? false
  const ttsEnabled = settingsResult.data?.tts_enabled ?? true

  const wordList = words.slice(0, 1500).map(w => ({
    rank: w.rank,
    word: w.word,
    pos: w.pos,
    meanings: w.meanings,
    example_es: w.example_es ?? null,
    example_en: w.example_en ?? null,
    image: w.image ?? null,
  }))

  // Due reviews first, then new words (no progress row)
  const dueWords = wordList
    .filter(w => dueRanks.has(w.rank))
    .sort((a, b) => {
      const ra = progressMap.get(a.rank)?.next_review ?? ''
      const rb = progressMap.get(b.rank)?.next_review ?? ''
      return ra < rb ? -1 : 1
    })
    .map(w => ({ ...w, isNew: false }))

  const seenRanks = new Set(allProgress.map(r => r.word_rank))
  const newWords = wordList
    .filter(w => !seenRanks.has(w.rank))
    .map(w => ({ ...w, isNew: true }))

  const initialQueue = [...dueWords, ...newWords]

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '76px' }}>
      <div className="app-wrap">
        <FlashCard
          initialQueue={initialQueue}
          knownRanks={knownRanks}
          initialCardFront={cardFront}
          unlocked={unlocked}
          initialTtsEnabled={ttsEnabled}
          newTodayCount={newTodayCount}
          dueCount={dueWords.length}
          streak={streak}
          todayCount={todayCount}
        />
      </div>
    </main>
  )
}
