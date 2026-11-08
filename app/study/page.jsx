import StudyClient from '@/components/StudyClient'

export const metadata = {
  title: 'Spanish Flashcards — Try the 10 Most Common Words Free',
  description: 'Try free flashcards for the 10 most common Spanish words, with native audio and example sentences. Then learn all 1,500 with the printable workbook.',
  alternates: { canonical: 'https://mostcommonspanish.com/study' },
  openGraph: { url: 'https://mostcommonspanish.com/study' },
}

export default function StudyPage() {
  return (
    <main className="cl cl-home study-page">
      <div className="wrap">
        <StudyClient />
      </div>
    </main>
  )
}
