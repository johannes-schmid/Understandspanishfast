import Link from 'next/link'
import WordListPage from '@/components/WordListPage'
import { DATE_MODIFIED, allAdjectives, feminineOf, itemListSchema, pageMetadata, wordByText } from '../_components/wordSets'
import SourceNote from '../_components/SourceNote'

const SLUG = 'most-common-spanish-adjectives'

export const metadata = pageMetadata({
  slug: SLUG,
  title: 'Most Common Spanish Adjectives: 191 Ranked, with Audio',
  description: 'The most common Spanish adjectives ranked by real-world frequency: bueno, otro, mejor, grande, nuevo and 186 more, each with its feminine form, an example and native audio.',
})

const adjectives = allAdjectives
const inTop500 = adjectives.filter((a) => a.rank <= 500).length
const inTop1000 = adjectives.filter((a) => a.rank <= 1000).length
const invariable = adjectives.filter((a) => feminineOf(a) === 'same')

const pick = (list) => list.map(wordByText).filter(Boolean)
const BEFORE = pick(['bueno', 'malo', 'grande', 'primero', 'último', 'otro', 'mismo', 'nuevo', 'viejo', 'único', 'pobre', 'cierto'])

const SIBLINGS = [
  { href: '/words/most-common-spanish-nouns', label: 'Nouns' },
  { href: '/words/most-common-spanish-verbs', label: 'Verbs' },
  { href: '/words/most-common-spanish-adverbs', label: 'Adverbs' },
  { href: '/words/spanish-connectors', label: 'Connectors' },
  { href: '/words/top-1000-spanish-words', label: 'Top 1000' },
  { href: '/words/most-common-spanish-words', label: 'Interactive 1,500 list' },
]

const FAQS = [
  { q: 'What are the most common Spanish adjectives?', a: 'Ranked by how often they appear in spoken Spanish, the most common adjectives are bueno (good), otro (other), mejor (better), grande (big), nuevo (new), poco (little, few), seguro (sure), primero (first), mismo (same) and claro (clear). All ten sit inside the top 140 words of the language.' },
  { q: 'Do Spanish adjectives go before or after the noun?', a: 'Usually after: una casa blanca, un coche rápido. A small group of very common adjectives often goes before the noun, including bueno, malo, grande, primero, último, otro and mismo. Numbers and words of quantity (mucho, poco) also go first.' },
  { q: 'How do Spanish adjectives agree with nouns?', a: 'They match the noun in gender and number. Adjectives ending in -o have four forms (bueno, buena, buenos, buenas). Adjectives ending in -e or a consonant usually have just two (grande, grandes; feliz, felices). The Feminine column in the list shows which form to use with la nouns.' },
  { q: 'Why is it buen amigo but amigo bueno?', a: 'Bueno, malo, primero and tercero drop their final -o before a masculine singular noun: un buen día, el primer día. Grande shortens to gran before any singular noun, and the meaning shifts from "big" to "great": una gran mujer, a great woman.' },
  { q: 'Which adjectives change meaning depending on position?', a: 'Several of the most common ones: un gran hombre (a great man) vs. un hombre grande (a big man), un viejo amigo (a long-time friend) vs. un amigo viejo (an elderly friend), un pobre chico (an unfortunate boy) vs. un chico pobre (a boy with no money).' },
]

export default function Page() {
  return (
    <WordListPage
      title="The most common Spanish adjectives"
      level={1500}
      slug={SLUG}
      coverage={String(adjectives.length)}
      coverageLabel="adjectives in the top 1,500 words, which cover ~80% of spoken Spanish"
      breadcrumbName="Most common Spanish adjectives"
      schemaName="Most Common Spanish Adjectives"
      schemaDescription="All 191 adjectives in the 1,500 most frequent Spanish words, ranked by real-world frequency, with feminine forms, English meanings, example sentences and native audio."
      dateModified={DATE_MODIFIED}
      factsNote={<SourceNote />}
      intro={
        <>
          The most common Spanish adjectives are bueno, otro, mejor, grande and nuevo. This list ranks all{' '}
          {adjectives.length} adjectives in the top 1,500 Spanish words by how often they’re actually used.
          {' '}{inTop500} of them are in the top 500 and {inTop1000} in the top 1,000. Each comes with its
          <strong> feminine form</strong>, an example sentence and native audio for the word and the sentence.
        </>
      }
      words={adjectives}
      siblings={SIBLINGS}
      faqs={FAQS}
      showAudio
      anki
      typeHeader="Feminine"
      typeOf={feminineOf}
      listNote={`All ${adjectives.length} adjectives from the top 1,500. Rank = position in the full list.`}
      extraSchema={[itemListSchema({ name: 'Most Common Spanish Adjectives', slug: SLUG, list: adjectives })]}
    >
      <section className="sec-sm">
        <div className="sec-head">
          <h2>Using these adjectives correctly</h2>
        </div>
        <div className="notes">
          <div className="card note">
            <h3>Match the noun: four forms or two</h3>
            <p>Adjectives ending in -o change for gender and number: <strong>un día bueno, una idea buena, días buenos</strong>. {invariable.length} adjectives on this list have the same form for el and la nouns, so they only change for the plural.</p>
            <div className="terms">{invariable.slice(0, 10).map((a) => <span key={a.rank}>{a.word}<i>#{a.rank}</i></span>)}</div>
          </div>
          <div className="card note">
            <h3>After the noun, except for a few</h3>
            <p>Most adjectives follow the noun (una casa nueva). These common ones often go before it, and some change meaning when they do.</p>
            <div className="terms">{BEFORE.map((a) => <span key={a.rank}>{a.word}<i>#{a.rank}</i></span>)}</div>
          </div>
        </div>
        <p className="src">Pair these with the <Link href="/words/most-common-spanish-nouns" className="tlink">most common nouns</Link> to see gender agreement in action.</p>
      </section>
    </WordListPage>
  )
}
