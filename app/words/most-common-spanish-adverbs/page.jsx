import Link from 'next/link'
import WordListPage from '@/components/WordListPage'
import { DATE_MODIFIED, adverbKind, allAdverbs, itemListSchema, pageMetadata } from '../_components/wordSets'
import SourceNote from '../_components/SourceNote'

const SLUG = 'most-common-spanish-adverbs'

export const metadata = pageMetadata({
  slug: SLUG,
  title: 'Most Common Spanish Adverbs: 95 Ranked by Frequency',
  description: 'The most common Spanish adverbs ranked by real-world frequency: bien, aquí, ya, más, muy, ahora and 89 more. Grouped by type, with examples and native audio.',
})

const adverbs = allAdverbs
const inTop100 = adverbs.filter((a) => a.rank <= 100).length
const mente = adverbs.filter((a) => /mente$/.test(a.word))
const byKind = (k) => adverbs.filter((a) => adverbKind(a) === k)

const GROUPS = [
  { k: 'time', h: 'Time: when it happens', p: 'Ya, ahora, siempre and nunca are among the 110 most common words in Spanish.' },
  { k: 'place', h: 'Place: where it happens', p: 'Spanish has three “there” words: ahí (near you), allí and allá (far from both of us).' },
  { k: 'degree', h: 'Degree: how much', p: 'Más and muy alone appear in a huge share of everyday sentences.' },
  { k: 'focus', h: 'Focus and addition', p: 'También and tampoco are the “me too” and “me neither” of Spanish.' },
]

const SIBLINGS = [
  { href: '/words/spanish-connectors', label: 'Connectors' },
  { href: '/words/most-common-spanish-adjectives', label: 'Adjectives' },
  { href: '/words/most-common-spanish-verbs', label: 'Verbs' },
  { href: '/words/most-common-spanish-nouns', label: 'Nouns' },
  { href: '/words/top-1000-spanish-words', label: 'Top 1000' },
  { href: '/words/most-common-spanish-words', label: 'Interactive 1,500 list' },
]

const FAQS = [
  { q: 'What are the most common Spanish adverbs?', a: 'By frequency in spoken Spanish: bien (well), aquí (here), ya (already, now), más (more), muy (very), ahora (now), así (like this), cómo (how), sólo (only) and nunca (never). Most of the top adverbs are short words for time, place and degree, not -mente words.' },
  { q: 'How do you form adverbs in Spanish?', a: 'Take the feminine form of an adjective and add -mente: rápida becomes rápidamente, clara becomes claramente. Adjectives with one form just add it: fácil becomes fácilmente. If the adjective has an accent, the adverb keeps it.' },
  { q: 'Where do adverbs go in a Spanish sentence?', a: 'Usually right after the verb they describe (habla bien, come mucho) or right before the adjective or adverb they modify (muy bien, bastante caro). Time adverbs like ayer, hoy and siempre can also open the sentence: Ayer fui al cine.' },
  { q: 'What is the difference between ya and todavía?', a: 'Ya means "already" or "now" (Ya comí, I already ate). Todavía and aún mean "still" or, with no, "not yet" (Todavía no he comido, I have not eaten yet). They are opposites in many sentences, which is why learners mix them up.' },
  { q: 'When do you use solo vs. sólo?', a: 'Both mean "only" as an adverb. The Real Academia Española has recommended writing it without an accent since 2010, so solo is the standard spelling, but sólo still appears in subtitles and older texts. That is why both forms rank in the frequency data.' },
]

export default function Page() {
  return (
    <WordListPage
      title="The most common Spanish adverbs"
      level={1500}
      slug={SLUG}
      coverage={String(adverbs.length)}
      coverageLabel="adverbs in the top 1,500 words, which cover ~80% of spoken Spanish"
      breadcrumbName="Most common Spanish adverbs"
      schemaName="Most Common Spanish Adverbs"
      schemaDescription="All 95 adverbs in the 1,500 most frequent Spanish words, ranked by real-world frequency and grouped by type, with example sentences and native audio."
      dateModified={DATE_MODIFIED}
      factsNote={<SourceNote />}
      intro={
        <>
          The most common Spanish adverbs are bien, aquí, ya, más, muy and ahora. Below are all {adverbs.length} adverbs
          in the top 1,500 Spanish words, ranked by frequency and tagged by type. {inTop100} of them are in the
          top 100 words, so they punch far above their number. Only {mente.length} end in <strong>-mente</strong>: the
          adverbs you need first are short words for time, place and degree.
        </>
      }
      words={adverbs}
      siblings={SIBLINGS}
      faqs={FAQS}
      showAudio
      anki
      typeHeader="Kind"
      typeOf={adverbKind}
      listNote={`All ${adverbs.length} adverbs from the top 1,500. Rank = position in the full list.`}
      extraSchema={[itemListSchema({ name: 'Most Common Spanish Adverbs', slug: SLUG, list: adverbs })]}
    >
      <section className="sec-sm">
        <div className="sec-head">
          <h2>The same adverbs, grouped by job</h2>
        </div>
        <div className="notes">
          {GROUPS.map((g) => (
            <div key={g.k} className="card note">
              <h3>{g.h}</h3>
              <p>{g.p}</p>
              <div className="terms">{byKind(g.k).slice(0, 12).map((a) => <span key={a.rank}>{a.word}<i>#{a.rank}</i></span>)}</div>
            </div>
          ))}
        </div>
        <p className="src">Words like entonces, además and sin embargo that link whole sentences are on the <Link href="/words/spanish-connectors" className="tlink">Spanish connectors</Link> page.</p>
      </section>
    </WordListPage>
  )
}
