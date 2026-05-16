import WordsPageClient from '@/components/WordsPageClient'
import { words } from '@/data/words'

export const metadata = {
  title: '1000 Most Common Spanish Words — Frequency List',
  description: 'The 1,000 most common Spanish words ranked by real-world frequency. These words cover ~74% of everyday spoken Spanish. Filter, search, and mark as learned.',
  alternates: { canonical: 'https://mostcommonspanish.com/words/most-common-spanish-words' },
  openGraph: { type: 'article' },
}

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: '1000 Most Common Spanish Words',
  description: 'The 1,000 most frequently used Spanish words ranked by real-world corpus frequency, with English translations and example sentences.',
  url: 'https://mostcommonspanish.com/words/most-common-spanish-words',
  publisher: { '@type': 'Organization', name: 'Most Common Spanish', url: 'https://mostcommonspanish.com' },
  dateModified: '2026-05-16',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mostcommonspanish.com' },
    { '@type': 'ListItem', position: 2, name: '1000 Most Common Spanish Words', item: 'https://mostcommonspanish.com/words/most-common-spanish-words' },
  ],
}

const top50 = words.slice(0, 50)

export default function WordsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div style={{ display: 'none' }}>
        <h1>1000 Most Common Spanish Words — Frequency List</h1>
        <p>
          This is the definitive list of the 1,000 most common Spanish words, ranked by real-world frequency from spoken corpus data.
          Mastering these 1,000 words gives you approximately 74% lexical coverage of everyday Spanish conversation — meaning you'll
          understand roughly 3 out of every 4 words you hear or read. The top 2,000 words push that to over 80%.
        </p>
        <p>
          Unlike thematic word lists, this frequency-ranked list prioritizes what you'll actually encounter. Words like <em>ser</em> (to be),
          <em>tener</em> (to have), and <em>hacer</em> (to do) appear far more often than topic-specific vocabulary, making them the
          highest-value words to learn first. Each entry includes the Spanish word, part of speech, English meaning, and an example sentence.
        </p>
        <p>
          Below are the top 50 most common Spanish words as a preview. The full interactive list of 1,000 words follows, where you can
          search, filter by part of speech, and mark words as learned to track your progress.
        </p>

        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Spanish</th>
              <th>Type</th>
              <th>English</th>
            </tr>
          </thead>
          <tbody>
            {top50.map(w => (
              <tr key={w.rank}>
                <td>{w.rank}</td>
                <td>{w.word}</td>
                <td>{w.pos}</td>
                <td>{w.meanings[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <WordsPageClient />
    </>
  )
}
