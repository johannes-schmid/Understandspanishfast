import Link from 'next/link'
import '../clarity-coverage.css'
import CoverageTool from '@/components/CoverageTool'
import { LearnCtas, pct } from '@/components/CoverageShared'
import { Arrow, Crumbs, FaqSection, Closing } from '@/components/WordListPage'
import showsData from '@/data/shows.json'

const BASE = 'https://mostcommonspanish.com'
const URL = `${BASE}/how-much-spanish-do-i-understand`
const TITLE = 'How Much Spanish Do I Understand? Free Text Checker'
const DESCRIPTION = 'Paste Spanish text or upload subtitles and see how much you would understand with the top 100, 500, 1,000 or 1,500 words, plus the words to learn next.'

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { type: 'website', url: URL, title: TITLE, description: DESCRIPTION, siteName: 'Most Common Spanish', images: ['/og-default.png'] },
}

const shows = showsData.shows.filter((s) => s.type !== 'Podcast')
const lo = Math.min(...shows.map((s) => s.coverage[1500]))
const hi = Math.max(...shows.map((s) => s.coverage[1500]))
const lo1000 = Math.min(...shows.map((s) => s.coverage[1000]))
const hi1000 = Math.max(...shows.map((s) => s.coverage[1000]))
const podcast = showsData.shows.find((s) => s.type === 'Podcast')
const easiest = showsData.shows.slice(0, 5)

const FAQS = [
  { q: 'How much Spanish do I understand with 1,000 words?', a: `With the 1,000 most frequent words (plus the basic grammar words you learn alongside them) you recognise about ${Math.round(lo1000)} to ${Math.round(hi1000)}% of the words in the Spanish TV dialogue we measured. That is enough to follow the thread of most scenes, but you will still hit an unknown word every few lines.` },
  { q: 'How much Spanish do I need to understand a TV show?', a: `Most researchers put comfortable understanding at 95% of running words, and 98% for reading without help. In the ${shows.length} Spanish series we measured, the top 1,500 words cover ${Math.round(lo)} to ${Math.round(hi)}% of the dialogue. The rest is show-specific: names of jobs, places and slang that you pick up by watching.` },
  { q: 'How does the checker count words?', a: 'It splits the text into words, removes numbers, names and filler sounds, and matches every inflected form back to its dictionary word: es, soy and fue all count as ser; casas as casa. Each word is then checked against our frequency list of the 1,500 most common Spanish words.' },
  { q: 'Can I check a Netflix episode?', a: 'Yes. Download the Spanish subtitle file for the episode (.srt or .vtt) and upload it. Timestamps, line numbers and sound descriptions are stripped before counting, so you get the share of the spoken words you would know.' },
  { q: 'Why do grammar words count as known?', a: 'Words like de, la, que, en and no make up about a third of every Spanish sentence. Our ranked list leaves them out because every course teaches them in the first week, so the headline number counts them as known. The result panel also shows the number without them.' },
  { q: 'Is my text uploaded anywhere?', a: 'No. The word list is downloaded once and all counting happens in your browser. Nothing you paste or upload leaves your device.' },
]

export default function Page() {
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'How much Spanish do I understand? Text coverage checker',
    url: URL,
    description: DESCRIPTION,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any (web browser)',
    inLanguage: ['en', 'es'],
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    publisher: { '@type': 'Organization', name: 'Most Common Spanish', url: BASE },
    datePublished: '2026-11-23',
    dateModified: '2026-11-23',
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  const crumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'How much Spanish do I understand', item: URL },
    ],
  }

  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />

      <div className="wrap pg">
        <Crumbs items={[{ href: '/', label: 'Home' }, { label: 'How much Spanish do I understand' }]} />

        <div className="pg-head solo">
          <div>
            <h1 className="pg-h1">How much Spanish do I understand <span className="soft">in any text or show</span></h1>
            <p className="lead">
              Paste Spanish or upload a subtitle file. You see the share of words you would recognise after the top 100,
              500, 1,000 and 1,500 <Link href="/words/most-common-spanish-words" className="tlink">most common Spanish words</Link>,
              and which missing words come up most.
            </p>
          </div>
        </div>

        <CoverageTool />
        <LearnCtas />

        <section className="sec-sm">
          <div className="sec-head">
            <h2>Spanish shows, measured</h2>
            <p className="lead">
              We ran the same count over {showsData.shows.length} Spanish series and podcasts. With 1,500 words you know {Math.round(lo)} to {Math.round(hi)}% of what is said on screen.
            </p>
          </div>
          <div className="card">
            <ol className="cv-rank">
              {easiest.map((s) => (
                <li key={s.slug}>
                  <Link className="cv-row cv-mini" href={`/spanish-shows/${s.slug}`}>
                    <span className="cv-row-n tab">{s.difficultyRank}</span>
                    <span className="cv-row-t"><b>{s.title}</b><span>{s.country}, {s.years}</span></span>
                    <span className="cv-row-bar"><span className="cv-track"><i className="cv-fill" style={{ transform: `scaleX(${s.coverage[1500] / 100})` }} /></span><b className="tab">{pct(s.coverage[1500])}</b></span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          <div className="cta-row" style={{ marginTop: 20 }}>
            <Link className="link" href="/spanish-shows-by-difficulty">All {showsData.shows.length} ranked by difficulty <Arrow /></Link>
          </div>
        </section>

        <section className="sec-sm">
          <div className="sec-head"><h2>How the count works</h2></div>
          <div className="cv-prose">
            <p>
              The checker splits your text into words and leaves out numbers, names and filler sounds like <i>eh</i> or <i>mmm</i>.
              Every remaining word is traced back to its dictionary form, so <i>tienes</i> counts as <i>tener</i>, <i>buenas</i> as <i>bueno</i> and <i>dímelo</i> as <i>decir</i>.
              That form is then looked up in our <Link href="/words/spanish-frequency-list">frequency list</Link>.
            </p>
            <p>
              Grammar words such as <i>de, la, que, en</i> and <i>no</i> count as known at every level, because they are taught in the first lessons.
              They make up about a third of spoken Spanish; the result panel shows the number without them too.
              For comparison, the {podcast ? podcast.title : 'podcast'} transcripts we tested sit at {podcast ? pct(podcast.coverage[1500]) : 'n/a'} with 1,500 words, lower than TV dialogue because narration uses more varied vocabulary.
            </p>
            <p>
              Inflected forms come from the open <a href="https://github.com/michmech/lemmatization-lists" rel="noopener">lemmatization-lists</a> dataset (Open Database License), extended with our own rules for plurals and verb endings.
              Want shows to watch at your level? See the <Link href="/blog/best-shows-to-learn-spanish">best shows to learn Spanish</Link>.
            </p>
          </div>
        </section>

        <FaqSection faqs={FAQS} />
        <Closing title="Learn the words that close the gap" />
      </div>
    </div>
  )
}
