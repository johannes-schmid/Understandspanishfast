import Link from 'next/link'

// Post registry (slug → short title) for internal cross-linking.
const POSTS = {
  'the-power-of-the-first-100-words': 'The Power of the First 100 Spanish Words',
  'cracking-the-1500': 'Cracking the 1,500: The Real Fluency Threshold',
  'how-many-spanish-words-to-be-fluent': 'How Many Spanish Words to Be Fluent?',
  'how-long-does-it-take-to-learn-spanish': 'How Long Does It Take to Learn Spanish?',
  'best-spanish-learning-app': 'Best Spanish Learning App in 2026',
  'fastest-way-to-learn-spanish': 'Fastest Way to Learn Spanish',
  'is-spanish-hard-to-learn': 'Is Spanish Hard to Learn?',
  'best-shows-to-learn-spanish': 'Best Shows to Learn Spanish',
  'best-podcasts-for-learning-spanish': 'Best Podcasts for Learning Spanish',
  'learn-spanish-while-driving': 'How to Learn Spanish While Driving',
  'benefits-of-learning-spanish': '10 Benefits of Learning Spanish',
  'best-books-for-learning-spanish': 'Best Books to Learn Spanish',
  'how-to-build-spanish-vocabulary': 'How to Build Spanish Vocabulary Fast',
  'best-free-apps-to-learn-spanish': 'Free Spanish Learning Apps: What’s Actually Free',
  'how-to-learn-spanish-as-an-adult': 'The Best Way to Learn Spanish as an Adult',
  'which-spanish-should-i-learn': 'Which Spanish Should I Learn?',
  'can-you-learn-spanish-by-watching-tv': 'Can You Learn Spanish by Watching TV?',
  'how-to-start-learning-spanish': 'How to Start Learning Spanish: Your First 30 Days',
}

const RELATED = {
  'the-power-of-the-first-100-words': ['cracking-the-1500', 'how-many-spanish-words-to-be-fluent', 'how-to-build-spanish-vocabulary'],
  'cracking-the-1500': ['how-many-spanish-words-to-be-fluent', 'the-power-of-the-first-100-words', 'how-to-build-spanish-vocabulary'],
  'how-many-spanish-words-to-be-fluent': ['cracking-the-1500', 'the-power-of-the-first-100-words', 'how-long-does-it-take-to-learn-spanish'],
  'how-long-does-it-take-to-learn-spanish': ['how-many-spanish-words-to-be-fluent', 'fastest-way-to-learn-spanish', 'is-spanish-hard-to-learn'],
  'best-spanish-learning-app': ['best-free-apps-to-learn-spanish', 'best-podcasts-for-learning-spanish', 'best-books-for-learning-spanish'],
  'fastest-way-to-learn-spanish': ['how-to-learn-spanish-as-an-adult', 'how-long-does-it-take-to-learn-spanish', 'how-to-build-spanish-vocabulary'],
  'is-spanish-hard-to-learn': ['how-long-does-it-take-to-learn-spanish', 'how-many-spanish-words-to-be-fluent', 'benefits-of-learning-spanish'],
  'best-shows-to-learn-spanish': ['can-you-learn-spanish-by-watching-tv', 'best-podcasts-for-learning-spanish', 'best-books-for-learning-spanish'],
  'best-podcasts-for-learning-spanish': ['best-shows-to-learn-spanish', 'best-books-for-learning-spanish', 'learn-spanish-while-driving'],
  'learn-spanish-while-driving': ['best-podcasts-for-learning-spanish', 'best-shows-to-learn-spanish', 'fastest-way-to-learn-spanish'],
  'benefits-of-learning-spanish': ['is-spanish-hard-to-learn', 'how-long-does-it-take-to-learn-spanish', 'how-many-spanish-words-to-be-fluent'],
  'best-books-for-learning-spanish': ['best-shows-to-learn-spanish', 'best-podcasts-for-learning-spanish', 'best-spanish-learning-app'],
  'how-to-build-spanish-vocabulary': ['the-power-of-the-first-100-words', 'cracking-the-1500', 'how-many-spanish-words-to-be-fluent'],
  'best-free-apps-to-learn-spanish': ['best-spanish-learning-app', 'how-to-start-learning-spanish', 'best-podcasts-for-learning-spanish'],
  'how-to-learn-spanish-as-an-adult': ['how-to-start-learning-spanish', 'fastest-way-to-learn-spanish', 'how-long-does-it-take-to-learn-spanish'],
  'which-spanish-should-i-learn': ['is-spanish-hard-to-learn', 'how-to-start-learning-spanish', 'best-shows-to-learn-spanish'],
  'can-you-learn-spanish-by-watching-tv': ['best-shows-to-learn-spanish', 'cracking-the-1500', 'how-many-spanish-words-to-be-fluent'],
  'how-to-start-learning-spanish': ['the-power-of-the-first-100-words', 'how-to-learn-spanish-as-an-adult', 'which-spanish-should-i-learn'],
}

// Most relevant word-list page per post (defaults to the flagship list).
const WORD_LINK = {
  'the-power-of-the-first-100-words': { href: '/words/top-100-spanish-words', label: 'See the top 100 Spanish words →' },
  'how-to-build-spanish-vocabulary': { href: '/words/spanish-frequency-list', label: 'See the Spanish frequency list & method →' },
  'how-to-start-learning-spanish': { href: '/words/top-100-spanish-words', label: 'See the top 100 Spanish words →' },
  'can-you-learn-spanish-by-watching-tv': { href: '/level-test', label: 'Take the Spanish vocabulary test →' },
}
const DEFAULT_WORD_LINK = { href: '/words/most-common-spanish-words', label: 'Browse the 1,000 most common Spanish words →' }

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

function fmtDate(d) {
  return new Date(`${d}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

function RelatedPosts({ slug }) {
  const related = (RELATED[slug] || []).filter((s) => POSTS[s])
  const wordLink = WORD_LINK[slug] || DEFAULT_WORD_LINK
  if (!related.length) return null
  return (
    <section className="post-related" aria-labelledby="keep-reading">
      <h2 id="keep-reading">Keep reading</h2>
      <div className="guides">
        {related.map((s) => (
          <Link key={s} href={`/blog/${s}`} className="card guide"><b>{POSTS[s]}</b><span>Read article</span></Link>
        ))}
      </div>
      <Link href={wordLink.href} className="link post-wordlink">{wordLink.label.replace(/\s*→$/, '')}<Arrow /></Link>
    </section>
  )
}

export function PostCta({ title = 'Start with the 100 words that cover half of Spanish', body = 'Try ten real flashcards from the top of the frequency list, right in your browser. When you want all 1,500 on paper, the workbook is €5.' }) {
  return (
    <section className="panel close post-cta">
      <div>
        <h2>{title}</h2>
        <p className="lead">{body}</p>
      </div>
      <div className="cta-row">
        <Link className="btn btn-navy" href="/study">Start for free</Link>
        <Link className="btn btn-ghost" href="/workbook">Get the workbook</Link>
      </div>
    </section>
  )
}

export default function BlogPost({
  slug, title, description, category, readTime,
  datePublished = '2026-05-01', dateModified = '2026-05-07',
  author = 'Johannes Schmid', heroCallout, sidebar, children,
  image = 'https://mostcommonspanish.com/og-default.png',
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image,
    author: { '@type': 'Person', name: author, url: 'https://mostcommonspanish.com/about' },
    publisher: {
      '@type': 'Organization',
      name: 'Most Common Spanish',
      logo: { '@type': 'ImageObject', url: 'https://mostcommonspanish.com/icon.svg' },
    },
    datePublished,
    dateModified,
    mainEntityOfPage: `https://mostcommonspanish.com/blog/${slug}`,
  }

  return (
    <div className="cl cl-home cl-post">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="wrap">
        <header className="post-head">
          <Link href="/blog" className="post-back">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            All articles
          </Link>
          <h1 className="post-title">{title}</h1>
          <p className="lead post-dek">{description}</p>
          <div className="post-meta">
            <span className="chip">{category}</span>
            <span>By <Link href="/about" className="post-byline">{author}</Link></span>
            <span aria-hidden="true">·</span>
            <span>{readTime}</span>
            <span aria-hidden="true">·</span>
            <span>Updated <time dateTime={dateModified}>{fmtDate(dateModified)}</time></span>
          </div>
          {heroCallout && (
            <p className="post-stat"><b className="tab">{heroCallout.value}</b><span>{heroCallout.label}</span></p>
          )}
        </header>

        <div className="post-grid">
          <article className="card post-sheet">
            <div className="post-body">
              {children}
            </div>
          </article>
          {sidebar && <aside className="post-aside">{sidebar}</aside>}
        </div>

        <RelatedPosts slug={slug} />
        <PostCta />
      </div>
    </div>
  )
}

export function SidebarCallout({ title, children }) {
  return (
    <div className="card post-callout">
      <h3>{title}</h3>
      <div className="post-callout-body">{children}</div>
    </div>
  )
}

export function ProTip({ children }) {
  return (
    <div className="post-tip">
      <p className="post-tip-label">Pro tip</p>
      <p>{children}</p>
    </div>
  )
}
