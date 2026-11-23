import Link from 'next/link'
import { notFound } from 'next/navigation'
import '../../clarity-coverage.css'
import { CoverageMeter, FunctionWordNote, LearnCtas, WordChips, pct } from '@/components/CoverageShared'
import { Arrow, Crumbs, FaqSection, Closing } from '@/components/WordListPage'
import showsData from '@/data/shows.json'

const BASE = 'https://mostcommonspanish.com'
const shows = showsData.shows

export const dynamicParams = false

export function generateStaticParams() {
  return shows.map((s) => ({ slug: s.slug }))
}

function titleFor(s) {
  const full = `${s.title} Spanish Difficulty: Words You Need`
  return full.length <= 60 ? full : `${s.title} Spanish Difficulty`
}

function descFor(s) {
  return `How hard is ${s.title} in Spanish? With the top 1,500 words you know ${pct(s.coverage[1500])} of its dialogue. Rank #${s.difficultyRank} of ${shows.length}, plus the words to learn first.`
}

export function generateMetadata({ params }) {
  const s = shows.find((x) => x.slug === params.slug)
  if (!s) return {}
  const url = `${BASE}/spanish-shows/${s.slug}`
  const title = titleFor(s)
  const description = descFor(s)
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title, description, siteName: 'Most Common Spanish', images: ['/og-default.png'] },
  }
}

export default function Page({ params }) {
  const s = shows.find((x) => x.slug === params.slug)
  if (!s) notFound()
  const url = `${BASE}/spanish-shows/${s.slug}`
  const i = s.difficultyRank - 1
  const easier = shows[i - 1]
  const harder = shows[i + 1]
  const isPodcast = s.type === 'Podcast'
  const kind = isPodcast ? 'podcast' : 'show'
  const unknownEvery = Math.round(100 / (100 - s.coverage[1500]))
  const english = s.english && s.english !== s.title ? s.english : null

  const faqs = [
    { q: `Is ${s.title} good for learning Spanish?`, a: `${s.title} ranks #${s.difficultyRank} of ${shows.length} in our list${s.difficultyRank <= Math.ceil(shows.length / 3) ? ', so it is one of the easier options' : s.difficultyRank > (shows.length * 2) / 3 ? ', so it is one of the harder options' : ''}. With the 1,500 most common words you recognise ${pct(s.coverage[1500])} of what is said, about one unknown word in every ${unknownEvery}. Learn the ${kind}-specific words below first and it gets noticeably easier.` },
    { q: `How many Spanish words do I need for ${s.title}?`, a: `With 500 words you know ${pct(s.coverage[500])} of the words, with 1,000 words ${pct(s.coverage[1000])}, and with 1,500 words ${pct(s.coverage[1500])}. Comfortable understanding starts around 95%, so add the frequent ${kind}-specific words on this page on top of the top 1,500.` },
    { q: `What Spanish accent is used in ${s.title}?`, a: `${s.accent}. ${s.title} is from ${s.country} (${s.years}). Accent affects listening difficulty, but this ranking measures vocabulary only.` },
    { q: 'How was this measured?', a: `We analysed ${s.sample.words.toLocaleString('en')} words from ${s.sample.units} ${s.sample.unitLabel}, mapped every word to its dictionary form and checked it against the 1,500 most common Spanish words. Names, numbers and filler sounds are left out.` },
  ]

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `How much Spanish you need for ${s.title}`,
    description: descFor(s),
    url,
    mainEntityOfPage: url,
    image: `${BASE}/og-default.png`,
    about: { '@type': isPodcast ? 'PodcastSeries' : 'TVSeries', name: s.title, ...(english ? { alternateName: english } : {}), inLanguage: 'es' },
    author: { '@type': 'Organization', name: 'Most Common Spanish', url: BASE },
    publisher: { '@type': 'Organization', name: 'Most Common Spanish', url: BASE },
    datePublished: '2026-11-23',
    dateModified: '2026-11-23',
  }
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Spanish shows by difficulty', item: `${BASE}/spanish-shows-by-difficulty` },
      { '@type': 'ListItem', position: 3, name: s.title, item: url },
    ],
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="wrap pg">
        <Crumbs items={[{ href: '/', label: 'Home' }, { href: '/spanish-shows-by-difficulty', label: 'Shows by difficulty' }, { label: s.title }]} />

        <div className="pg-head">
          <div>
            <h1 className="pg-h1">How much Spanish you need for {s.title}</h1>
            <p className="lead">
              With the top 1,500 <Link href="/words/most-common-spanish-words" className="tlink">most common Spanish words</Link> you
              understand <strong>{pct(s.coverage[1500])} of the words</strong> in {s.title}{english ? ` (${english})` : ''}. That is one unknown
              word in every {unknownEvery}, and it ranks #{s.difficultyRank} of {shows.length} on our <Link href="/spanish-shows-by-difficulty" className="tlink">difficulty ranking</Link>.
            </p>
            <ul className="cv-meta">
              <li>{s.type}, {s.country}</li>
              <li>{s.years}</li>
              <li>{s.accent}</li>
            </ul>
          </div>
          <aside className="card facts">
            <div className="cv-facts-top">
              <div>
                <div className="facts-num tab">#{s.difficultyRank}</div>
                <div className="facts-lbl">of {shows.length}, easiest first</div>
              </div>
              <span className="mono tab">{s.sample.words.toLocaleString('en')} WORDS MEASURED</span>
            </div>
            <CoverageMeter values={s.coverage} highlight={1500} />
            <FunctionWordNote listOnly={s.listOnly[1500]} />
          </aside>
        </div>

        {s.nextWords.length > 0 && (
          <section className="sec-sm">
            <div className="sec-head">
              <h2>Learn these next</h2>
              <p className="lead">Words ranked 1,001 to 1,500 that come up most in {s.title}. If you know the top 1,000, these give the biggest jump.</p>
            </div>
            <WordChips words={s.nextWords} />
          </section>
        )}

        {s.beyondList.length > 0 && (
          <section className="sec-sm">
            <div className="sec-head">
              <h2>Words outside the top 1,500</h2>
              <p className="lead">The most frequent words in this {kind} that a frequency list will not teach you. Count = times heard in our sample.</p>
            </div>
            <ul className="cv-plain">
              {s.beyondList.map((w) => <li key={w.w}>{w.w}<span className="tab">{w.n}×</span></li>)}
            </ul>
          </section>
        )}

        <section className="sec-sm">
          <div className="cv-two">
            <div className="card">
              <h3>Compare</h3>
              <p>Shows next to {s.title} on the ranking.</p>
              <div className="cv-nb">
                {easier ? (
                  <Link href={`/spanish-shows/${easier.slug}`}><span>Easier: #{easier.difficultyRank}, {pct(easier.coverage[1500])}</span><b>{easier.title}</b></Link>
                ) : <Link href="/spanish-shows-by-difficulty"><span>Easiest on the list</span><b>See all shows</b></Link>}
                {harder ? (
                  <Link href={`/spanish-shows/${harder.slug}`}><span>Harder: #{harder.difficultyRank}, {pct(harder.coverage[1500])}</span><b>{harder.title}</b></Link>
                ) : <Link href="/spanish-shows-by-difficulty"><span>Hardest on the list</span><b>See all shows</b></Link>}
              </div>
            </div>
            <div className="card">
              <h3>Check one episode</h3>
              <p>Upload the Spanish subtitle file of any episode to see its exact number and missing words.</p>
              <Link className="btn btn-ghost btn-sm" href="/how-much-spanish-do-i-understand">Open the checker <Arrow /></Link>
            </div>
          </div>
          <p className="cv-gap">
            Measured on {s.sample.units} {s.sample.unitLabel} ({s.sample.words.toLocaleString('en')} words) from {isPodcast ? 'public episode transcripts' : 'Spanish subtitles in the OpenSubtitles corpus on OPUS'}.
            {s.sample.units < 6 ? ' Small sample, so treat the rank as approximate.' : ''} More picks in our guide to the <Link href="/blog/best-shows-to-learn-spanish" className="tlink">best shows to learn Spanish</Link>.
          </p>
        </section>

        <div style={{ marginTop: 40 }}><LearnCtas /></div>
        <FaqSection faqs={faqs} />
        <Closing title={`Learn the words ${s.title} uses most`} />
      </div>
    </div>
  )
}
