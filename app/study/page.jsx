import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { words } from '@/data/words'
import FlashCard from '@/components/FlashCard'

export const metadata = { title: 'Study | Neuro' }

export default async function StudyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [progressResult, settingsResult] = await Promise.all([
    supabase
      .from('user_word_progress')
      .select('word_rank')
      .eq('user_id', user.id)
      .in('status', ['good', 'easy']),
    supabase
      .from('user_settings')
      .select('card_front, unlocked')
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  const knownRanks = (progressResult.data ?? []).map(r => r.word_rank)
  const cardFront = settingsResult.data?.card_front ?? 'spanish'
  const unlocked = settingsResult.data?.unlocked ?? false

  // Pass only first 1500 words, serializable subset
  const studyWords = words.slice(0, 1500).map(w => ({
    rank: w.rank,
    word: w.word,
    pos: w.pos,
    meanings: w.meanings,
    example_es: w.example_es ?? null,
  }))

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '100px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h1 style={{ fontFamily: 'Fraunces', fontSize: '24px', fontWeight: 700, color: 'var(--deep-mind)' }}>
            Study
          </h1>
          <a href="/dashboard" style={{ color: 'var(--cortex)', fontSize: '14px', textDecoration: 'none' }}>
            ← Dashboard
          </a>
        </div>
        <FlashCard
          words={studyWords}
          knownRanks={knownRanks}
          initialCardFront={cardFront}
          unlocked={unlocked}
        />
      </div>
    </main>
  )
}
