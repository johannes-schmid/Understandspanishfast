import Link from 'next/link'
import WordListPage from '@/components/WordListPage'
import { words } from '@/data/words'
import { DATE_MODIFIED, itemListSchema, pageMetadata } from '../_components/wordSets'
import SourceNote from '../_components/SourceNote'

const SLUG = 'top-1000-spanish-words'

export const metadata = pageMetadata({
  slug: SLUG,
  title: 'Top 1000 Spanish Words: Ranked List with Native Audio',
  description: 'The top 1000 Spanish words in strict frequency order, #1 to #1,000, each with native audio and an example sentence. Together they cover ~74% of spoken Spanish.',
})

const top1000 = words.slice(0, 1000)

const SIBLINGS = [
  { href: '/words/top-100-spanish-words', label: 'Top 100' },
  { href: '/words/top-500-spanish-words', label: 'Top 500' },
  { href: '/words/most-common-spanish-words', label: 'Interactive 1,500 list' },
  { href: '/words/most-common-spanish-verbs', label: 'Verbs' },
  { href: '/words/most-common-spanish-nouns', label: 'Nouns' },
  { href: '/words/most-common-spanish-adjectives', label: 'Adjectives' },
  { href: '/words/spanish-connectors', label: 'Connectors' },
]

const FAQS = [
  { q: 'How much Spanish do the top 1000 words cover?', a: 'About 74% of everyday spoken Spanish. In practice that means you recognise roughly three of every four words in a conversation or a TV episode. Corpora built from written text report higher numbers for the same 1,000 words, because writing reuses a smaller core vocabulary.' },
  { q: 'Is 1000 words enough to be fluent in Spanish?', a: 'No, but it is enough to hold simple conversations and to follow slow, clear speech. Fluency needs grammar, listening practice and more vocabulary. The next useful target is 1,500 words, which takes coverage to about 80%, the point where shows and native conversation become followable.' },
  { q: 'How long does it take to learn 1000 Spanish words?', a: 'At 15 to 20 new words a day with spaced repetition, most learners get through 1,000 words in two to three months. Words in the top 300 stick fastest, because you meet them constantly in anything you read or watch.' },
  { q: 'What are the most common words in Spanish?', a: 'The top of this list is dominated by verbs and small function words: ser, estar, ir, tener, hacer, poder, decir, plus con, si, pero and como. The first 100 words alone make up about half of everything you hear.' },
  { q: 'Should I learn the words in order?', a: 'Yes. Learning top to bottom means every word you study is at least as useful as the next one, so your comprehension rises as fast as possible per hour spent. Skip only words you already know well.' },
]

export default function Page() {
  return (
    <WordListPage
      title="The top 1000 Spanish words in order"
      level={1000}
      slug={SLUG}
      coverage="~74%"
      breadcrumbName="Top 1000 Spanish words"
      schemaName="Top 1000 Spanish Words by Frequency"
      schemaDescription="The 1,000 most frequent Spanish words in strict rank order, with English meanings, example sentences and native audio."
      dateModified={DATE_MODIFIED}
      factsNote={<SourceNote />}
      intro={
        <>
          These are the top 1000 Spanish words in strict frequency order, from #1 <em>ser</em> to #1,000.
          Learn them and you’ll recognise about <strong>74% of everyday spoken Spanish</strong>, three of every
          four words you hear. Every word has its meaning, an example sentence and native audio for both.
          Already past the{' '}<Link href="/words/top-500-spanish-words" className="tlink">top 500</Link>? Start at #501.
        </>
      }
      words={top1000}
      siblings={SIBLINGS}
      faqs={FAQS}
      showAudio
      anki
      listNote="1,000 words, #1 to #1,000. Tap ▶ to hear the word or the sentence."
      extraSchema={[itemListSchema({ name: 'Top 1000 Spanish Words', slug: SLUG, list: top1000, limit: 100 })]}
    >
      <section className="sec-sm">
        <div className="sec-head">
          <h2>What 1,000 words get you</h2>
        </div>
        <div className="notes">
          <div className="card note">
            <h3>Words #1 to #500: the skeleton</h3>
            <p>The first half is mostly verbs, pronouns and connectors. They make up <strong>about 67%</strong> of speech, so after #500 you can follow the shape of most conversations even when the topic words escape you.</p>
          </div>
          <div className="card note">
            <h3>Words #501 to #1,000: the content</h3>
            <p>The second half adds the nouns and adjectives that carry topics: family, work, money, time, feelings. Each word adds less coverage, but these are the words that turn the gist into actual understanding.</p>
          </div>
          <div className="card note">
            <h3>Where to go after #1,000</h3>
            <p>The next 500 words push coverage from 74% to <strong>about 80%</strong>. The <Link href="/words/most-common-spanish-words" className="tlink">full 1,500-word list</Link> lets you search, filter and mark words as learned.</p>
          </div>
          <div className="card note">
            <h3>Study by word type</h3>
            <p>Prefer to tackle one kind of word at a time? The same ranking is split into <Link href="/words/most-common-spanish-verbs" className="tlink">verbs</Link>, <Link href="/words/most-common-spanish-nouns" className="tlink">nouns</Link>, <Link href="/words/most-common-spanish-adjectives" className="tlink">adjectives</Link>, <Link href="/words/most-common-spanish-adverbs" className="tlink">adverbs</Link> and <Link href="/words/spanish-connectors" className="tlink">connectors</Link>.</p>
          </div>
        </div>
      </section>
    </WordListPage>
  )
}
