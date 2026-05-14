import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { articles } from '@/data/articles'
import ReadingClient from '@/components/ReadingClient'

export const metadata = { title: 'Reading | Neuro' }

export default async function ReadingPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: progress } = await supabase
    .from('user_word_progress')
    .select('word_rank, status')
    .eq('user_id', user.id)

  const allProgress = progress ?? []
  const knownRanks = allProgress.filter(r => ['good', 'easy'].includes(r.status)).map(r => r.word_rank)
  const seenRanks = allProgress.filter(r => ['again', 'hard'].includes(r.status)).map(r => r.word_rank)
  const learned = knownRanks.length

  // Filter articles by minWords threshold
  const availableArticles = articles.filter(a => learned >= a.minWords)

  const params = await searchParams
  const selectedId = params?.id ? parseInt(params.id) : null
  const selectedArticle = selectedId
    ? availableArticles.find(a => a.id === selectedId)
    : availableArticles[0] ?? null

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        <ReadingClient
          articles={availableArticles}
          initialArticle={selectedArticle}
          knownRanks={knownRanks}
          seenRanks={seenRanks}
        />
      </div>
    </main>
  )
}
