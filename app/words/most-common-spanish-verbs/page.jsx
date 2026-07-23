import WordListPage from '@/components/WordListPage'
import { words } from '@/data/words'

export const metadata = {
  title: 'Most Common Spanish Verbs — Top 150 by Frequency (with Examples)',
  description: 'The most common Spanish verbs ranked by real-world frequency — ser, estar, tener, hacer, ir and more. Each with English meaning and an example sentence. Learn the verbs you actually need first.',
  alternates: { canonical: 'https://mostcommonspanish.com/words/most-common-spanish-verbs' },
  openGraph: { type: 'article' },
}

const verbs = words
  .filter((w) => typeof w.pos === 'string' && w.pos.toLowerCase().startsWith('v'))
  .slice(0, 150)
  .map((w, i) => ({ ...w, rank: i + 1 }))

const SIBLINGS = [
  { href: '/words/most-common-spanish-words', label: '1,000 most common' },
  { href: '/words/top-100-spanish-words', label: 'Top 100' },
  { href: '/words/top-500-spanish-words', label: 'Top 500' },
  { href: '/words/spanish-frequency-list', label: 'How this list is built' },
]

const FAQS = [
  { q: 'What are the most common Spanish verbs?', a: 'The most common Spanish verbs are ser (to be, permanent), estar (to be, temporary), tener (to have), hacer (to do/make), ir (to go), poder (to be able to), decir (to say), and ver (to see). These appear in a huge share of everyday sentences, which is why they are the first verbs worth mastering.' },
  { q: 'How many Spanish verbs do I need to know?', a: 'Around 100–150 verbs cover the vast majority of everyday spoken Spanish. Because verbs carry the action of a sentence, knowing the most frequent ones — plus how to conjugate them in the present, past, and future — unlocks comprehension quickly.' },
  { q: 'Should I learn ser or estar first?', a: 'Learn them together, since both mean "to be" and Spanish uses them for different situations. Ser is for permanent or defining traits (soy médico — I am a doctor); estar is for temporary states and location (estoy cansado — I am tired). They are the two single most useful verbs in the language.' },
  { q: 'What order should I learn Spanish verbs in?', a: 'Frequency order. This list is ranked by how often each verb appears in real spoken Spanish, so learning top to bottom means every verb you study is one you will actually hear and use.' },
]

export default function Page() {
  return (
    <WordListPage
      eyebrow="Verbs"
      title="The most common Spanish verbs"
      slug="most-common-spanish-verbs"
      coverage="Top 150"
      breadcrumbName="Most common Spanish verbs"
      schemaName="Most Common Spanish Verbs"
      schemaDescription="The most frequently used Spanish verbs ranked by real-world corpus frequency, with English translations and example sentences."
      intro={
        <>
          Verbs carry the action of every sentence, so the highest-frequency verbs are the ones that unlock
          the most comprehension per verb learned. Below are the <strong>150 most common Spanish verbs</strong>,
          ranked by real-world frequency, each with its meaning and an example sentence. Start at the top —
          ser, estar, tener, hacer, ir — and work down. For all parts of speech, see the{' '}
          <a href="/words/most-common-spanish-words" style={{ color: 'var(--synapse)' }}>full frequency list</a>.
        </>
      }
      words={verbs}
      siblings={SIBLINGS}
      faqs={FAQS}
      showExamples
    />
  )
}
