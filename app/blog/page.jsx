import Link from 'next/link'

export const metadata = {
  title: 'Blog — Most Common Spanish',
  description: 'Articles on learning Spanish faster: high-frequency vocabulary strategy, comprehension thresholds, and the science of word frequency.',
  alternates: { canonical: 'https://mostcommonspanish.com/blog' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Most Common Spanish Blog',
  url: 'https://mostcommonspanish.com/blog',
  description: 'Expert insights, linguistic shortcuts, and the psychological roadmap to mastering Spanish.',
}

export const POSTS = [
  {
    slug: 'the-power-of-the-first-100-words',
    title: 'The Power of the First 100 Words',
    excerpt: 'The top 100 most frequent Spanish words account for 50% of all spoken language. Here\'s what they are, why they work, and how to learn them in weeks.',
    category: 'Learning Science',
    badge: 'Featured',
    readTime: '9 min read',
    stat: '50%',
    statLabel: 'of speech from 100 words',
    featured: true,
  },
  {
    slug: 'cracking-the-1500',
    title: 'Cracking the 1,500: The Real Threshold for Spanish Fluency',
    excerpt: 'Why 1,500 words is the magic number where comprehension flips from "guessing" to "following" — and how to get there efficiently.',
    category: 'Method',
    badge: 'Essential',
    readTime: '10 min read',
    stat: '80%',
    statLabel: 'comprehension at 1,500 words',
  },
  {
    slug: 'how-many-spanish-words-to-be-fluent',
    title: 'How Many Spanish Words Do You Need to Be Fluent?',
    excerpt: "A direct, data-backed answer. Covers lexemes vs word forms, register differences, and why 1,500 frequency-ranked words beats 5,000 random ones.",
    category: 'Research',
    badge: 'Popular',
    readTime: '10 min read',
    stat: '1,500',
    statLabel: 'the functional fluency threshold',
  },
  {
    slug: 'how-long-does-it-take-to-learn-spanish',
    title: 'How Long Does It Take to Learn Spanish?',
    excerpt: 'A realistic breakdown by goal level and daily study time — based on FSI data and frequency research. No hype, just honest numbers.',
    category: 'Roadmap',
    badge: 'Popular',
    readTime: '9 min read',
    stat: '480h',
    statLabel: 'to conversational fluency',
  },
  {
    slug: 'best-spanish-learning-app',
    title: 'Best Spanish Learning App in 2026 (Ranked & Honest)',
    excerpt: 'Duolingo, Anki, Pimsleur, Babbel, Language Transfer — ranked by what actually matters: vocabulary order, spaced repetition, and real-world application.',
    category: 'Tools',
    badge: 'New',
    readTime: '10 min read',
    stat: '6',
    statLabel: 'apps ranked honestly',
  },
  {
    slug: 'fastest-way-to-learn-spanish',
    title: 'Fastest Way to Learn Spanish: 10 Methods That Actually Work',
    excerpt: 'Speed comes from learning the right things first. 10 evidence-backed strategies that compress the timeline — from vocabulary sequencing to speaking from week one.',
    category: 'Method',
    badge: 'New',
    readTime: '10 min read',
    stat: '6–9mo',
    statLabel: 'to 80% comprehension',
  },
  {
    slug: 'is-spanish-hard-to-learn',
    title: 'Is Spanish Hard to Learn? An Honest Guide for English Speakers',
    excerpt: 'Spanish is one of the easiest languages for English speakers — but not effortless. Here\'s exactly what\'s easy, what\'s hard, and what 600 hours looks like.',
    category: 'Overview',
    badge: 'New',
    readTime: '9 min read',
    stat: '600h',
    statLabel: 'FSI estimate to B2',
  },
  {
    slug: 'best-shows-to-learn-spanish',
    title: 'Best Shows to Learn Spanish — Ranked by Level',
    excerpt: 'From Velvet (beginner) to Money Heist (intermediate) to Narcos (advanced) — with the one rule that makes TV actually count as language learning.',
    category: 'Resources',
    badge: 'New',
    readTime: '9 min read',
    stat: '10',
    statLabel: 'shows ranked by level',
  },
  {
    slug: 'best-podcasts-for-learning-spanish',
    title: 'Best Podcasts for Learning Spanish (Beginner to Advanced)',
    excerpt: 'Coffee Break Spanish, Radio Ambulante, Notes in Spanish — 9 podcasts ranked by level, with advice on how to use them so they build real comprehension.',
    category: 'Resources',
    badge: 'New',
    readTime: '9 min read',
    stat: '9',
    statLabel: 'podcasts ranked by level',
  },
  {
    slug: 'learn-spanish-while-driving',
    title: 'How to Learn Spanish While Driving',
    excerpt: 'A 30-minute daily commute adds up to 180 hours/year. Here\'s exactly what to listen to — and how to make it actually stick.',
    category: 'Method',
    badge: 'New',
    readTime: '7 min read',
    stat: '180h',
    statLabel: 'per year from a commute',
  },
  {
    slug: 'benefits-of-learning-spanish',
    title: '10 Benefits of Learning Spanish (That Actually Matter)',
    excerpt: 'Career salary premiums, cognitive protection against Alzheimer\'s, access to 500 million people — the data-backed case for learning Spanish.',
    category: 'Overview',
    badge: 'New',
    readTime: '8 min read',
    stat: '500M',
    statLabel: 'native Spanish speakers',
  },
  {
    slug: 'best-books-for-learning-spanish',
    title: 'Best Books to Learn Spanish in 2026',
    excerpt: 'Madrigal\'s Magic Key, the Frequency Dictionary, Pobre Ana, and El Alquimista — 11 books ranked across every level from A1 to C1+.',
    category: 'Resources',
    badge: 'New',
    readTime: '9 min read',
    stat: '11',
    statLabel: 'books ranked by stage',
  },
  {
    slug: 'how-to-build-spanish-vocabulary',
    title: 'How to Build Spanish Vocabulary Fast (The Right Way)',
    excerpt: 'Frequency order, spaced repetition, and context — the efficient path to 1,500 words, backed by what vocabulary research actually says.',
    category: 'Method',
    badge: 'New',
    readTime: '9 min read',
    stat: '15min',
    statLabel: 'daily to reach 1,500 words',
  },
  {
    slug: 'best-free-apps-to-learn-spanish',
    title: 'Free Spanish Learning Apps: What’s Actually Free',
    excerpt: 'Ten Spanish apps checked against their own pricing pages: what the free tier gives you, what sits behind the paywall, and a $0 setup that works.',
    category: 'Apps',
    badge: 'New',
    readTime: '12 min read',
    stat: '10',
    statLabel: 'apps, free tiers compared',
  },
  {
    slug: 'how-to-learn-spanish-as-an-adult',
    title: 'The Best Way to Learn Spanish as an Adult',
    excerpt: 'Adults have less time but better strategy. A 20-minute daily plan built around word milestones, plus what the research says about age.',
    category: 'Method',
    badge: 'New',
    readTime: '9 min read',
    stat: '20 min',
    statLabel: 'a day is enough',
  },
  {
    slug: 'which-spanish-should-i-learn',
    title: 'Which Spanish Should I Learn? Spain or Latin America',
    excerpt: 'We checked the 1,500 most common Spanish words to see how many actually change between Spain and Latin America. The answer is very few.',
    category: 'Method',
    badge: 'New',
    readTime: '7 min read',
    stat: '~20',
    statLabel: 'of 1,500 words differ by region',
  },
  {
    slug: 'can-you-learn-spanish-by-watching-tv',
    title: 'Can You Learn Spanish by Watching TV?',
    excerpt: 'Yes, once you know enough of the words being said. What the research says, what you will understand at each stage, and how to watch so it teaches you.',
    category: 'Method',
    badge: 'New',
    readTime: '8 min read',
    stat: '95%',
    statLabel: 'of words needed to follow TV',
  },
  {
    slug: 'how-to-start-learning-spanish',
    title: 'How to Start Learning Spanish: Your First 30 Days',
    excerpt: 'A day 1 to day 30 plan for complete beginners: the sounds, the 100 most common words, survival phrases, first listening and first conversation.',
    category: 'Beginners',
    badge: 'New',
    readTime: '8 min read',
    stat: '30 days',
    statLabel: 'to the first 100 words',
  },
]

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

export default function BlogHub() {
  const featured = POSTS.find((p) => p.featured) || POSTS[0]
  const rest = POSTS.filter((p) => p !== featured)

  return (
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="blog-hub">
        <div className="wrap">
          <header className="sec-head blog-hub-head">
            <h1 className="h1">The science of learning faster</h1>
            <p className="lead">No fluff. Frequency-first strategy, comprehension research, and the data behind getting fluent fast.</p>
          </header>

          <Link href={`/blog/${featured.slug}`} className="card blog-feat">
            <div className="blog-feat-body">
              <div className="post-meta"><span className="chip">{featured.category}</span><span>{featured.readTime}</span></div>
              <h2>{featured.title}</h2>
              <p className="lead">{featured.excerpt}</p>
              <span className="link">Read article<Arrow /></span>
            </div>
            <div className="panel blog-feat-stat" aria-hidden="true">
              <b className="tab">{featured.stat}</b>
              <span>{featured.statLabel}</span>
            </div>
          </Link>

          <ul className="card blog-list">
            {rest.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="blog-row">
                  <div className="blog-row-main">
                    <h3>{p.title}</h3>
                    <p>{p.excerpt}</p>
                    <div className="post-meta"><span className="chip">{p.category}</span><span>{p.readTime}</span></div>
                  </div>
                  <div className="blog-row-stat">
                    <b className="tab">{p.stat}</b>
                    <span>{p.statLabel}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <section className="panel close post-cta">
            <div>
              <h2>Start applying it</h2>
              <p className="lead">Start with the 100 words that cover half of everyday Spanish. Try ten real flashcards for free, or get all 1,500 in the printable workbook.</p>
            </div>
            <div className="cta-row">
              <Link className="btn btn-navy" href="/study">Start for free</Link>
              <Link className="btn btn-ghost" href="/workbook">Get the workbook</Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}
