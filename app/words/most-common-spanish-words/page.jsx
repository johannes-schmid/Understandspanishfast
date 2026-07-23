import WordsPageClient from '@/components/WordsPageClient'

export const metadata = {
  title: '1000 Most Common Spanish Words — Frequency List',
  description: 'The 1,000 most common Spanish words ranked by real-world frequency (~74% of everyday Spanish), plus 500 more to reach ~80%. Filter, search, and mark as learned.',
  alternates: { canonical: 'https://mostcommonspanish.com/words/most-common-spanish-words' },
  openGraph: { type: 'article' },
}

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: '1000 Most Common Spanish Words',
  description: 'The 1,000 most frequently used Spanish words ranked by real-world corpus frequency, with English translations and example sentences. The full list extends to 1,500 words for ~80% comprehension.',
  url: 'https://mostcommonspanish.com/words/most-common-spanish-words',
  creator: { '@type': 'Organization', name: 'Most Common Spanish', url: 'https://mostcommonspanish.com' },
  publisher: { '@type': 'Organization', name: 'Most Common Spanish', url: 'https://mostcommonspanish.com' },
  license: 'https://mostcommonspanish.com',
  dateModified: '2026-07-23',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mostcommonspanish.com' },
    { '@type': 'ListItem', position: 2, name: 'Spanish Words', item: 'https://mostcommonspanish.com/words' },
    { '@type': 'ListItem', position: 3, name: '1000 Most Common Spanish Words', item: 'https://mostcommonspanish.com/words/most-common-spanish-words' },
  ],
}

export default function WordsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <WordsPageClient />
    </>
  )
}
