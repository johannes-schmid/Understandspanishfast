import Link from 'next/link'
import '../clarity-coverage.css'
import { FunctionWordNote, LearnCtas, pct } from '@/components/CoverageShared'
import { Crumbs, FaqSection, Closing } from '@/components/WordListPage'
import showsData from '@/data/shows.json'

const BASE = 'https://mostcommonspanish.com'
const URL = `${BASE}/spanish-shows-by-difficulty`
const TITLE = 'Spanish Shows by Difficulty: Ranked by Vocabulary'
const DESCRIPTION = 'Spanish TV shows and podcasts ranked by how many of their words you know after learning the top 500, 1,000 and 1,500 Spanish words. Measured on real subtitles.'

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { type: 'article', url: URL, title: TITLE, description: DESCRIPTION, siteName: 'Most Common Spanish', images: ['/og-default.png'] },
}

const shows = showsData.shows
const easiest = shows[0]
const hardest = shows[shows.length - 1]
const totalWords = shows.reduce((a, s) => a + s.sample.words, 0)
const lo1000 = Math.round(Math.min(...shows.map((s) => s.coverage[1000])))
const hi1000 = Math.round(Math.max(...shows.map((s) => s.coverage[1000])))
const avgList = shows.reduce((a, s) => a + s.listOnly[1500], 0) / shows.length

const FAQS = [
  { q: 'What is the easiest Spanish show to understand?', a: `In our measurements, ${easiest.title} has the most familiar vocabulary: the top 1,500 Spanish words cover ${pct(easiest.coverage[1500])} of its dialogue. Period dramas and workplace series with a stable cast tend to reuse the same everyday words, which makes them easier than crime or comedy shows full of slang.` },
  { q: 'Is La casa de papel hard to understand?', a: (() => { const s = shows.find((x) => x.slug === 'la-casa-de-papel'); return s ? `It sits at #${s.difficultyRank} of ${shows.length}. With 1,500 words you know about ${pct(s.coverage[1500])} of the words, but the dialogue is fast, full of Spanish swearing and heist vocabulary (rehenes, atraco). Our sample is only ${s.sample.units} episodes, so treat the rank as approximate.` : 'We do not have enough subtitle data for it yet.' })() },
  { q: 'How is difficulty measured?', a: 'We take the Spanish subtitles of several episodes, map every word back to its dictionary form, and count the share that is in the top 500, 1,000 and 1,500 most common Spanish words. Shows are ranked by their coverage at 1,500 words. It measures vocabulary only, not speaking speed or accent.' },
  { q: 'Why are some popular shows missing?', a: 'We only rank shows where we could get Spanish subtitles for at least three episodes from an open research corpus. Élite, Club de Cuervos, Alta mar and Narcos are not in it yet. Narcos is also mostly in English, which would distort the numbers.' },
  { q: 'How much vocabulary do I need to watch Spanish TV?', a: `With 1,000 words you recognise roughly ${lo1000} to ${hi1000}% of the words in these shows. Comfortable viewing starts around 95%, which takes the top 1,500 words plus the words specific to the show you watch. Learning the frequent words first gets you there fastest.` },
]

export default function Page() {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Spanish TV shows and podcasts ranked by vocabulary difficulty',
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
            <h1 className="pg-h1">Spanish shows by difficulty <span className="soft">measured on their real dialogue</span></h1>
            <p className="lead">
              {shows.length} Spanish series and podcasts, ranked by how much of their dialogue you understand with the
              top 1,500 <Link href="/words/most-common-spanish-words" className="tlink">most common Spanish words</Link>.
              Easiest first. Based on {totalWords.toLocaleString('en')} words of subtitles and transcripts.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginTop: 36 }}>
          <ol className="cv-rank">
            <li aria-hidden="true">
              <div className="cv-row cv-row-head">
                <span>#</span><span>Show</span><span>500 words</span><span>1,000</span><span>1,500</span><span>Coverage at 1,500</span>
              </div>
            </li>
            {shows.map((s) => (
              <li key={s.slug}>
                <Link className="cv-row" href={`/spanish-shows/${s.slug}`}>
                  <span className="cv-row-n tab">{s.difficultyRank}</span>
                  <span className="cv-row-t"><b>{s.title}</b><span>{s.type === 'Podcast' ? `Podcast, ${s.accent}` : s.accent}</span></span>
                  <span className="cv-row-v tab">{pct(s.coverage[500])}</span>
                  <span className="cv-row-v tab">{pct(s.coverage[1000])}</span>
                  <span className="cv-row-v tab">{pct(s.coverage[1500])}</span>
                  <span className="cv-row-bar" aria-label={`${pct(s.coverage[1500])} with 1,500 words`}><span className="cv-track"><i className="cv-fill" style={{ transform: `scaleX(${s.coverage[1500] / 100})` }} /></span><b className="tab">{pct(s.coverage[1500])}</b></span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <FunctionWordNote listOnly={avgList} />
        <p className="cv-gap">
          Not ranked yet: Élite, Club de Cuervos, Alta mar and Narcos. We only include shows with Spanish subtitles for at least three episodes in an open research corpus,
          and we do not estimate the rest.
        </p>

        <section className="sec-sm">
          <div className="sec-head"><h2>What the numbers mean</h2></div>
          <div className="cv-prose">
            <p>
              The percentage is the share of spoken words you would recognise. At {pct(easiest.coverage[1500])} ({easiest.title}) you meet an unknown word roughly every {Math.round(100 / (100 - easiest.coverage[1500]))} words;
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
              Sources: Spanish subtitles from the OpenSubtitles corpus on OPUS (Lison and Tiedemann, 2016) and public Radio Ambulante transcripts.
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
