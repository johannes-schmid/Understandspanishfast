import WordsPageClient from '@/components/WordsPageClient'

export const metadata = {
  title: '1000 Most Common Spanish Words — Frequency List',
  description: 'The 1,000 most common Spanish words ranked by real-world frequency. Filter, search, and mark as learned.',
  alternates: { canonical: 'https://mostcommonspanish.com/words/most-common-spanish-words' },
  openGraph: { type: 'article' },
}

export default function WordsPage() {
  return <WordsPageClient />
}
