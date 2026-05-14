import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { words } from '@/data/words'
import FlashCard from '@/components/FlashCard'

export const metadata = { title: 'Study | Neuro' }

export default async function StudyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [progressResult, settingsResult] = await Promise.all([
    supabase
      .from('user_word_progress')
      .select('word_rank, status')
      .eq('user_id', user.id),
    supabase
      .from('user_settings')
      .select('card_front, unlocked, tts_enabled')
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  const allProgress = progressResult.data ?? []
  const progressMap = new Map(allProgress.map(r => [r.word_rank, r]))

  const knownRanks = allProgress
    .filter(r => ['good', 'easy'].includes(r.status))
    .map(r => r.word_rank)

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
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '0 24px' }}>
        <FlashCard
          initialQueue={initialQueue}
          knownRanks={knownRanks}
          initialCardFront={cardFront}
          unlocked={unlocked}
          initialTtsEnabled={ttsEnabled}
          newTodayCount={newTodayCount}
          dueCount={dueWords.length}
        />
      </div>
    </main>
  )
}
