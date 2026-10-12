import StudyClient from '@/components/StudyClient'

export const metadata = {
  title: 'Learn the 1,500 Most Common Spanish Words — Free Flashcards',
  description: 'Free spaced-repetition flashcards for the most common Spanish words, with native audio and example sentences. No account needed. Start with the first 100.',
  alternates: { canonical: 'https://mostcommonspanish.com/study' },
  openGraph: { url: 'https://mostcommonspanish.com/study' },
}

export default function StudyPage() {
  return (
    <main className="study-page">
      <div className="app-wrap">
        <StudyClient />
      </div>
    </main>
  )
}
