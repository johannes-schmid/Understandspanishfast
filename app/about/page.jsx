import Link from 'next/link'

const TITLE = 'About Most Common Spanish'
const DESC = 'Who builds Most Common Spanish, how the 1,500-word frequency list is put together, and how the comprehension numbers on this site are calculated.'

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: 'https://mostcommonspanish.com/about' },
  openGraph: { title: TITLE, description: DESC, url: 'https://mostcommonspanish.com/about', type: 'profile', images: ['https://mostcommonspanish.com/og-default.png'] },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Johannes Schmid',
  url: 'https://mostcommonspanish.com/about',
  jobTitle: 'Product manager and founder of Most Common Spanish',
  worksFor: { '@type': 'Organization', name: 'Most Common Spanish', url: 'https://mostcommonspanish.com' },
  homeLocation: { '@type': 'Place', name: 'Barcelona, Spain' },
}

const PRINCIPLES = [
  { t: 'Frequency first', b: 'Every word on this site has a rank. Word #1 shows up more in everyday Spanish than word #2, and so on down the list. You learn them in that order, so each new word is the most useful one you don’t know yet.' },
  { t: 'Coverage, not streaks', b: 'Progress is measured as the share of everyday Spanish your words cover: about 50% at 100 words, 67% at 500, 74% at 1,000 and 80% at 1,500. No points, no badges.' },
  { t: 'Every word in context', b: 'Each of the 1,500 words comes with an example sentence and a translation, and the flashcards play native audio for the word and the sentence.' },
]

export default function About() {
  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      <section className="ct-hero">
        <div className="wrap">
          <h1 className="h1">About Most Common Spanish</h1>
          <p className="lead">Hi, I&rsquo;m Johannes Schmid. I&rsquo;m a product manager, and I build Most Common Spanish from Barcelona.</p>
          <p className="lead">The site exists for one reason: most learners spend months on vocabulary they rarely hear. This site gives you the words that actually come up, in the order they come up, and tells you how much Spanish they unlock.</p>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head"><h2>How the site works</h2></div>
          <div className="ct-feats">
            {PRINCIPLES.map(({ t, b }) => (
              <div key={t} className="card ct-feat"><h3>{t}</h3><p>{b}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec ct-sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>Where the numbers come from</h2>
            <p className="lead">The coverage figures are estimates based on lexical frequency research: how much of typical spoken Spanish is made up of the most frequent words. They describe the words you will hear, not a guarantee of understanding, because a few unknown words in a sentence can still hide its meaning.</p>
          </div>
          <p className="ct-note">See the full ranked list on the <Link href="/words/spanish-frequency-list">Spanish frequency list</Link> page, or check where you stand with the <Link href="/level-test">Spanish vocabulary test</Link>.</p>
        </div>
      </section>

      <section className="ct-end">
        <div className="wrap">
          <div className="panel close">
            <h2>Start with word #1<br /><span className="soft">The rest follows in order</span></h2>
            <div className="cta-row">
              <Link className="btn btn-navy" href="/study">Start for free</Link>
              <Link className="btn btn-ghost" href="/workbook">Get the workbook</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
