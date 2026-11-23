import Link from 'next/link'
import '../clarity-coverage.css'
import { FunctionWordNote, LearnCtas, pct } from '@/components/CoverageShared'
import { Crumbs, FaqSection, Closing } from '@/components/WordListPage'
import ShowsExplorer from '@/components/ShowsExplorer'
import showsData from '@/data/shows.json'

const BASE = 'https://mostcommonspanish.com'
const URL = `${BASE}/spanish-shows-by-difficulty`
const TITLE = 'Spanish Shows and Films by Difficulty (83 Ranked)'
const DESCRIPTION = 'Spanish series and films ranked by an easiness score from real subtitles: familiar words, speaking speed and slang. Set your vocabulary and see what you can watch now.'

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { type: 'article', url: URL, title: TITLE, description: DESCRIPTION, siteName: 'Most Common Spanish', images: ['/og-default.png'] },
}

const shows = showsData.shows
const slim = shows.map(({ slug, title, type, country, years, coverage, easiness, level, cefr, wpm }) => ({ slug, title, type, country, years, coverage, easiness, level, cefr, wpm }))
const films = shows.filter((s) => s.type === 'Film').length
const series = shows.filter((s) => s.type === 'TV series').length
const podcasts = shows.length - films - series
const easiest = shows[0]
const hardest = shows[shows.length - 1]
const totalWords = shows.reduce((a, s) => a + s.sample.words, 0)
const lo1000 = Math.round(Math.min(...shows.map((s) => s.coverage[1000])))
const hi1000 = Math.round(Math.max(...shows.map((s) => s.coverage[1000])))
const avgList = shows.reduce((a, s) => a + s.listOnly[1500], 0) / shows.length

const FAQS = [
  { q: 'What is the easiest Spanish show or film to understand?', a: `${easiest.title} has the highest easiness score (${easiest.easiness}/100): the top 1,500 Spanish words cover ${pct(easiest.coverage[1500])} of its dialogue and it is spoken at about ${easiest.wpm || 'an average'} words per minute. Among series, ${shows.find((x) => x.type !== 'Film').title} ranks highest. Period dramas and quiet family films reuse everyday words; fast comedies full of slang score lowest.` },
  { q: 'How is the easiness score calculated?', a: 'It combines three things measured on real Spanish subtitles: the share of words covered by the top 1,500 (60% of the score), speaking speed in words per minute (25%), and how many rare words appear in a 5,000-word stretch (15%). Each is scaled against all titles on the list, so 100 is the easiest and 1 the hardest. Easy means roughly A2–B1, Medium B1, Hard B2 and Very hard C1.' },
  { q: 'Is La casa de papel hard to understand?', a: (() => { const s = shows.find((x) => x.slug === 'la-casa-de-papel'); return s ? `It sits at #${s.difficultyRank} of ${shows.length}. With 1,500 words you know about ${pct(s.coverage[1500])} of the words, but the dialogue is fast, full of Spanish swearing and heist vocabulary (rehenes, atraco). Our sample is only ${s.sample.units} episodes, so treat the rank as approximate.` : 'We do not have enough subtitle data for it yet.' })() },
  { q: 'Which shows can I watch with my level?', a: 'Take the 2-minute vocabulary test, or move the slider on this page to your number of words. Titles where you would recognise 90% or more of the words are marked "Watch now": watch them with Spanish subtitles. 86–90% is a stretch, and below that, learn more of the top 1,500 first.' },
  { q: 'Why are some popular shows missing?', a: 'We only rank titles with original Spanish subtitles in an open research corpus: at least three episodes for a series, or a complete film. Most Netflix series from 2018 on, such as Élite, Club de Cuervos, La casa de las flores and Alta mar, are not in it yet, so we do not guess their scores.' },
  { q: 'How much vocabulary do I need to watch Spanish TV?', a: `With 1,000 words you recognise roughly ${lo1000} to ${hi1000}% of the words in these shows. Comfortable viewing starts around 95%, which takes the top 1,500 words plus the words specific to the show you watch. Learning the frequent words first gets you there fastest.` },
]

export default function Page() {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Spanish series and films ranked by easiness',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: shows.length,
    itemListElement: shows.map((s) => ({
      '@type': 'ListItem',
      position: s.difficultyRank,
      url: `${BASE}/spanish-shows/${s.slug}`,
      name: s.title,
    })),
  }
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Spanish shows ranked by difficulty',
    description: DESCRIPTION,
    url: URL,
    mainEntityOfPage: URL,
    image: `${BASE}/og-default.png`,
    author: { '@type': 'Organization', name: 'Most Common Spanish', url: BASE },
    publisher: { '@type': 'Organization', name: 'Most Common Spanish', url: BASE },
    datePublished: '2026-11-23',
    dateModified: '2026-11-23',
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="wrap pg">
        <Crumbs items={[{ href: '/', label: 'Home' }, { label: 'Spanish shows by difficulty' }]} />

        <div className="pg-head solo">
          <div>
            <h1 className="pg-h1">Spanish shows and films by difficulty <span className="soft">and which ones you can watch now</span></h1>
            <p className="lead">
              {shows.length} Spanish-language titles ({series} series, {films} films{podcasts ? ` and ${podcasts === 1 ? 'a podcast' : `${podcasts} podcasts`}` : ''}), each with an easiness score from
              {' '}{totalWords.toLocaleString('en')} words of real subtitles: familiar words, speaking speed and slang. Set your vocabulary, or take the
              {' '}<Link href="/level-test" className="tlink">2-minute level test</Link>, and see what you can watch with the
              {' '}<Link href="/words/most-common-spanish-words" className="tlink">most common Spanish words</Link> you know.
            </p>
          </div>
        </div>

        <ShowsExplorer shows={slim} />
        <FunctionWordNote listOnly={avgList} />
        <p className="cv-gap">
          Not ranked yet: Élite, Club de Cuervos, La casa de las flores and Alta mar. We only include titles with original Spanish subtitles in an open research corpus,
          and we do not estimate the rest.
        </p>

        <section className="sec-sm">
          <div className="sec-head"><h2>What the numbers mean</h2></div>
          <div className="cv-prose">
            <p>
              The easiness score combines three measurements: the share of spoken words covered by the top 1,500 (60%), speaking speed (25%) and rare-word density (15%).
              The percentage in each row is the share of words you would recognise at the vocabulary size you set. With 1,500 words, at {pct(easiest.coverage[1500])} ({easiest.title}) you meet an unknown word roughly every {Math.round(100 / (100 - easiest.coverage[1500]))} words;
              at {pct(hardest.coverage[1500])} ({hardest.title}) it is every {Math.round(100 / (100 - hardest.coverage[1500]))}. A few points make a real difference.
            </p>
            <p>
              Historical and workplace dramas score high because characters reuse the same everyday vocabulary. Sitcoms and crime shows score lower: slang,
              swearing and show-specific words (euros, conserje, rehenes) push coverage down. Each show page lists those words, so you can learn them before episode one.
            </p>
            <p>
              Want to check something else? Paste any text or subtitle file into the <Link href="/how-much-spanish-do-i-understand">how much Spanish do I understand</Link> checker,
              or read our picks of the <Link href="/blog/best-shows-to-learn-spanish">best shows to learn Spanish</Link>.
            </p>
            <p>
              Sources: Spanish subtitles from the OpenSubtitles corpus on OPUS (Lison and Tiedemann, 2016) and public Radio Ambulante transcripts. Speaking speed is
              words per minute of on-screen subtitle time, so it reads a little higher than real speech.
              We publish only the derived statistics and short word lists, never the subtitles.
            </p>
          </div>
        </section>

        <div style={{ marginTop: 40 }}><LearnCtas /></div>
        <FaqSection faqs={FAQS} />
        <Closing title="Learn the words every show uses" />
      </div>
    </div>
  )
}
