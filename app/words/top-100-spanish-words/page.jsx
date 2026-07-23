import WordListPage from '@/components/WordListPage'
import { words } from '@/data/words'

export const metadata = {
  title: 'Top 100 Spanish Words — The First 100 to Learn (~50% Coverage)',
  description: 'The 100 most common Spanish words, ranked by real-world frequency. Just these 100 words make up roughly half of everyday spoken Spanish. With translations and example sentences.',
  alternates: { canonical: 'https://mostcommonspanish.com/words/top-100-spanish-words' },
  openGraph: { type: 'article' },
}

const top100 = words.slice(0, 100)

const SIBLINGS = [
  { href: '/words/most-common-spanish-words', label: '1,000 most common' },
  { href: '/words/top-500-spanish-words', label: 'Top 500' },
  { href: '/words/most-common-spanish-verbs', label: 'Common verbs' },
  { href: '/words/spanish-frequency-list', label: 'How this list is built' },
]

const FAQS = [
  { q: 'How much Spanish do the top 100 words cover?', a: 'The 100 most frequent Spanish words account for roughly 50% of the words used in everyday spoken Spanish. They are function words and high-frequency verbs — ser, estar, tener, hacer, ir — that appear in almost every sentence, so learning them first gives the fastest jump in comprehension.' },
  { q: 'Should I learn the first 100 words before anything else?', a: 'Yes. Because these words repeat constantly, every one you learn pays off immediately. Learning them before topic vocabulary (food, travel, etc.) means you can follow the structure of real sentences much sooner.' },
  { q: 'Are these the same as the 100 words Duolingo teaches?', a: 'Not necessarily. Most course apps introduce words by theme and lesson order. This list is ranked purely by how often each word actually appears in spoken Spanish, so it prioritises the highest-impact words regardless of topic.' },
  { q: 'What comes after the first 100 words?', a: 'Keep following frequency order: the top 500 push coverage to about 67%, and the top 1,000 to about 74%. See the full 1,000-word list to continue.' },
]

export default function Page() {
  return (
    <WordListPage
      eyebrow="Top 100"
      title="The top 100 Spanish words"
      slug="top-100-spanish-words"
      coverage="~50%"
      breadcrumbName="Top 100 Spanish words"
      schemaName="Top 100 Most Common Spanish Words"
      schemaDescription="The 100 most frequently used Spanish words ranked by real-world corpus frequency, with English translations and example sentences."
      intro={
        <>
          These are the 100 most common Spanish words, ranked by how often they appear in real spoken
          Spanish. Remarkably, just these 100 words make up around <strong>half of everything you'll hear</strong> in
          everyday conversation. That's why they're the single highest-value place to start. Each word below
          includes its English meaning and an example sentence. When you're ready, continue to the{' '}
          <a href="/words/most-common-spanish-words" style={{ color: 'var(--synapse)' }}>full 1,000-word list</a>.
        </>
      }
      words={top100}
      siblings={SIBLINGS}
      faqs={FAQS}
      showExamples
    />
  )
}
