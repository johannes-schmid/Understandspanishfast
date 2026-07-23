import WordListPage from '@/components/WordListPage'
import { words } from '@/data/words'

export const metadata = {
  title: 'Top 500 Spanish Words — Frequency List (~67% Coverage)',
  description: 'The 500 most common Spanish words ranked by real-world frequency. These 500 words cover about two-thirds of everyday spoken Spanish. Full list with translations and examples.',
  alternates: { canonical: 'https://mostcommonspanish.com/words/top-500-spanish-words' },
  openGraph: { type: 'article' },
}

const top500 = words.slice(0, 500)

const SIBLINGS = [
  { href: '/words/most-common-spanish-words', label: '1,000 most common' },
  { href: '/words/top-100-spanish-words', label: 'Top 100' },
  { href: '/words/most-common-spanish-verbs', label: 'Common verbs' },
  { href: '/words/spanish-frequency-list', label: 'How this list is built' },
]

const FAQS = [
  { q: 'How much Spanish do the top 500 words cover?', a: 'The 500 most frequent Spanish words cover roughly 67% of everyday spoken Spanish — about two out of every three words you hear. It is the point where you stop feeling lost and start catching the gist of most conversations.' },
  { q: 'Is 500 words enough to have a basic conversation?', a: 'For simple, everyday exchanges, yes — 500 high-frequency words plus a little grammar is enough to understand and be understood in basic situations. To follow native-speed conversation and shows comfortably, keep going toward 1,000–1,500 words.' },
  { q: 'How long does it take to learn 500 Spanish words?', a: 'At 15–20 new words a day with spaced repetition, most learners reach 500 words in about four to six weeks. Because these are the highest-frequency words, you also see them constantly in real content, which reinforces them naturally.' },
  { q: 'What order should I learn them in?', a: 'Follow the frequency ranking top to bottom. The list is ordered so that each word you learn is at least as useful as the next, which means your comprehension rises as fast as possible per word learned.' },
]

export default function Page() {
  return (
    <WordListPage
      eyebrow="Top 500"
      title="The top 500 Spanish words"
      slug="top-500-spanish-words"
      coverage="~67%"
      breadcrumbName="Top 500 Spanish words"
      schemaName="Top 500 Most Common Spanish Words"
      schemaDescription="The 500 most frequently used Spanish words ranked by real-world corpus frequency, with English translations and example sentences."
      intro={
        <>
          The 500 most common Spanish words, ranked by real-world frequency. Learn these and you'll
          recognise roughly <strong>two out of every three words</strong> in everyday spoken Spanish — enough to
          follow the shape of most conversations. Continue to the{' '}
          <a href="/words/most-common-spanish-words" style={{ color: 'var(--synapse)' }}>full 1,000-word list</a> to
          push comprehension past 74%.
        </>
      }
      words={top500}
      siblings={SIBLINGS}
      faqs={FAQS}
      showExamples={false}
    />
  )
}
