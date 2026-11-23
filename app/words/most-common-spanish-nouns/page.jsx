import Link from 'next/link'
import WordListPage from '@/components/WordListPage'
import { DATE_MODIFIED, allNouns, itemListSchema, nounBase, pageMetadata } from '../_components/wordSets'
import SourceNote from '../_components/SourceNote'

const SLUG = 'most-common-spanish-nouns'
const SHOWN = 300

export const metadata = pageMetadata({
  slug: SLUG,
  title: 'Most Common Spanish Nouns: Top 300 with el/la Gender',
  description: 'The 300 most common Spanish nouns ranked by real-world frequency, each with its el/la gender, meaning, example sentence and native audio. Learn the article with the word.',
})

const nouns = allNouns.slice(0, SHOWN)
const count = (g, list = allNouns) => list.filter((n) => n.gender === g).length
const masc = count('masculine')
const fem = count('feminine')
const both = count('both')
const mascPct = Math.round((masc / allNouns.length) * 100)

const ruleBreakers = allNouns.filter((n) => {
  const b = nounBase(n)
  return (n.gender === 'feminine' && /o$/.test(b)) || (n.gender === 'masculine' && /a$/.test(b))
})
const stressedA = allNouns.filter((n) => n.stressedA || (n.gender === 'feminine' && /^el /.test(n.word)))
const endsIn = (re) => allNouns.filter((n) => re.test(nounBase(n)))
const dadNouns = endsIn(/(dad|tad|tud)$/)
const cionNouns = endsIn(/(ción|sión)$/)

const SIBLINGS = [
  { href: '/words/most-common-spanish-verbs', label: 'Verbs' },
  { href: '/words/most-common-spanish-adjectives', label: 'Adjectives' },
  { href: '/words/most-common-spanish-adverbs', label: 'Adverbs' },
  { href: '/words/spanish-connectors', label: 'Connectors' },
  { href: '/words/top-1000-spanish-words', label: 'Top 1000' },
  { href: '/words/most-common-spanish-words', label: 'Interactive 1,500 list' },
]

const FAQS = [
  { q: 'What are the most common Spanish nouns?', a: `The most frequent Spanish nouns are el hombre (man), el día (day), la cosa (thing), el señor (sir, Mr.), el tiempo (time, weather), el año (year), la verdad (truth), la casa (house) and la vez (time, as in "one time"). They show up in almost every conversation, which is why they sit at the top of the list.` },
  { q: 'How do you know if a Spanish noun is masculine or feminine?', a: 'Look at the ending first. Most nouns ending in -o are masculine (el libro) and most ending in -a, -ción, -sión, -dad and -tud are feminine (la casa, la canción, la ciudad). The ending gets you right most of the time, but not always, so learn every noun together with el or la.' },
  { q: 'Are there more masculine or feminine nouns in Spanish?', a: `Slightly more masculine. Of the ${allNouns.length} nouns in our top 1,500 words, ${masc} are masculine (${mascPct}%), ${fem} are feminine and ${both} can take either article depending on who they refer to, like el/la estudiante.` },
  { q: 'Why is it el agua but las aguas?', a: 'Feminine nouns that start with a stressed a- or ha- sound take el in the singular so the two a sounds do not run together: el agua, el alma, el hambre. The noun is still feminine, so adjectives stay feminine (el agua fría) and the plural goes back to las (las aguas).' },
  { q: 'Why is it la mano and el día?', a: 'They are common exceptions to the ending rule. La mano is feminine despite the -o, and el día is masculine despite the -a. Many masculine nouns ending in -ma come from Greek, like el problema, el sistema and el tema.' },
  { q: 'How many Spanish nouns do I need to know?', a: 'Nouns make up about half of the 1,500 most common words, and those 1,500 words cover roughly 80% of everyday spoken Spanish. Learning the top 300 nouns gives you the people, places, time words and everyday objects that most conversations revolve around.' },
]

function Terms({ list, max = 12 }) {
  return (
    <div className="terms">
      {list.slice(0, max).map((n) => <span key={n.rank}>{n.word}<i>#{n.rank}</i></span>)}
    </div>
  )
}

export default function Page() {
  return (
    <WordListPage
      title="The most common Spanish nouns with el and la"
      level={1500}
      slug={SLUG}
      coverage={String(allNouns.length)}
      coverageLabel="nouns in the top 1,500 words, which cover ~80% of spoken Spanish"
      breadcrumbName="Most common Spanish nouns"
      schemaName="Most Common Spanish Nouns"
      schemaDescription="The 300 most frequently used Spanish nouns ranked by real-world frequency, with grammatical gender, English meanings, example sentences and native audio."
      dateModified={DATE_MODIFIED}
      factsNote={<SourceNote />}
      intro={
        <>
          The most common Spanish nouns are el hombre, el día, la cosa, el tiempo and la casa. Below are the
          top {SHOWN}, ranked by how often they appear in spoken Spanish, each shown with <strong>el or la</strong> so
          you learn the gender with the word. Every noun has a meaning, an example sentence and native audio.
          The rank is the word’s position in our full{' '}
          <Link href="/words/top-1000-spanish-words" className="tlink">frequency list</Link>.
        </>
      }
      words={nouns}
      siblings={SIBLINGS}
      faqs={FAQS}
      showAudio
      anki
      typeHeader="Gender"
      typeOf={(n) => n.gender}
      listNote={`The ${SHOWN} most frequent of ${allNouns.length} nouns. Rank = position in the full list.`}
      extraSchema={[itemListSchema({ name: 'Most Common Spanish Nouns', slug: SLUG, list: nouns })]}
    >
      <section className="sec-sm">
        <div className="sec-head">
          <h2>How to tell el from la</h2>
          <p className="lead">In our top 1,500 words, {masc} nouns are masculine, {fem} are feminine and {both} take either article.</p>
        </div>
        <div className="notes">
          <div className="card note">
            <h3>-o is usually el, -a is usually la</h3>
            <p>This covers most nouns on the list. The everyday exceptions are few, and you’ll meet them constantly, so learn them early.</p>
            <Terms list={ruleBreakers} />
          </div>
          <div className="card note">
            <h3>-dad, -tad, -tud, -ción and -sión are always la</h3>
            <p>{dadNouns.length + cionNouns.length} nouns in the top 1,500 end this way, and every one is feminine.</p>
            <Terms list={[...dadNouns.slice(0, 6), ...cionNouns.slice(0, 6)].sort((a, b) => a.rank - b.rank)} />
          </div>
          <div className="card note">
            <h3>Feminine nouns with el</h3>
            <p>A feminine noun that starts with a stressed a- sound takes <strong>el</strong> in the singular, but it stays feminine: el agua fría, las armas.</p>
            <Terms list={stressedA} />
          </div>
          <div className="card note">
            <h3>People nouns that take both</h3>
            <p>Some nouns for people keep one form and change only the article (el/la estudiante). Others change the ending (el jefe, la jefa).</p>
            <Terms list={allNouns.filter((n) => n.gender === 'both')} max={8} />
          </div>
        </div>
      </section>
    </WordListPage>
  )
}
