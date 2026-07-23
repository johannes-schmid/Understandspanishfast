import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { words } from '@/data/words'
import FlashCard from '@/components/FlashCard'

export const metadata = {
  title: 'Practice Spanish free — no account needed | Most Common Spanish',
  description: 'Start learning the most common Spanish words right now. No sign-up required — practice your first 10 words free, then create an account to keep going.',
}

const FREE_WORDS = 10

export default async function PracticePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/study')

  const initialQueue = words.slice(0, FREE_WORDS).map(w => ({
    rank: w.rank,
    word: w.word,
    pos: w.pos,
    meanings: w.meanings,
    example_es: w.example_es ?? null,
    example_en: w.example_en ?? null,
    image: w.image ?? null,
    isNew: true,
  }))

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '76px' }}>
      <div className="app-wrap" style={{ maxWidth: '560px' }}>
        <FlashCard
          initialQueue={initialQueue}
          knownRanks={[]}
          initialCardFront="spanish"
          unlocked={true}
          initialTtsEnabled={true}
          anonymous={true}
          gateAfter={FREE_WORDS}
        />
      </div>
    </main>
  )
}
