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
}

const RELATED = {
  'the-power-of-the-first-100-words': ['cracking-the-1500', 'how-many-spanish-words-to-be-fluent', 'how-to-build-spanish-vocabulary'],
  'cracking-the-1500': ['how-many-spanish-words-to-be-fluent', 'the-power-of-the-first-100-words', 'how-to-build-spanish-vocabulary'],
  'how-many-spanish-words-to-be-fluent': ['cracking-the-1500', 'the-power-of-the-first-100-words', 'how-long-does-it-take-to-learn-spanish'],
  'how-long-does-it-take-to-learn-spanish': ['how-many-spanish-words-to-be-fluent', 'fastest-way-to-learn-spanish', 'is-spanish-hard-to-learn'],
  'best-spanish-learning-app': ['best-shows-to-learn-spanish', 'best-podcasts-for-learning-spanish', 'best-books-for-learning-spanish'],
  'fastest-way-to-learn-spanish': ['how-long-does-it-take-to-learn-spanish', 'how-to-build-spanish-vocabulary', 'best-spanish-learning-app'],
  'is-spanish-hard-to-learn': ['how-long-does-it-take-to-learn-spanish', 'how-many-spanish-words-to-be-fluent', 'benefits-of-learning-spanish'],
  'best-shows-to-learn-spanish': ['best-podcasts-for-learning-spanish', 'best-books-for-learning-spanish', 'best-spanish-learning-app'],
  'best-podcasts-for-learning-spanish': ['best-shows-to-learn-spanish', 'best-books-for-learning-spanish', 'learn-spanish-while-driving'],
  'learn-spanish-while-driving': ['best-podcasts-for-learning-spanish', 'best-shows-to-learn-spanish', 'fastest-way-to-learn-spanish'],
  'benefits-of-learning-spanish': ['is-spanish-hard-to-learn', 'how-long-does-it-take-to-learn-spanish', 'how-many-spanish-words-to-be-fluent'],
  'best-books-for-learning-spanish': ['best-shows-to-learn-spanish', 'best-podcasts-for-learning-spanish', 'best-spanish-learning-app'],
  'how-to-build-spanish-vocabulary': ['the-power-of-the-first-100-words', 'cracking-the-1500', 'how-many-spanish-words-to-be-fluent'],
}

// Most relevant word-list page per post (defaults to the flagship list).
const WORD_LINK = {
  'the-power-of-the-first-100-words': { href: '/words/top-100-spanish-words', label: 'See the top 100 Spanish words →' },
  'how-to-build-spanish-vocabulary': { href: '/words/spanish-frequency-list', label: 'See the Spanish frequency list & method →' },
}
const DEFAULT_WORD_LINK = { href: '/words/most-common-spanish-words', label: 'Browse the 1,000 most common Spanish words →' }

function RelatedPosts({ slug }) {
  const related = (RELATED[slug] || []).filter((s) => POSTS[s])
  const wordLink = WORD_LINK[slug] || DEFAULT_WORD_LINK
  if (!related.length) return null
  return (
    <section style={{ marginTop: '56px' }}>
      <h2 style={{
        fontFamily: "'Fraunces', serif", fontWeight: 900,
        fontSize: '26px', letterSpacing: '-0.5px', color: 'var(--deep-mind)', marginBottom: '18px',
      }}>Keep reading</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '18px' }}>
        {related.map((s) => (
          <Link key={s} href={`/blog/${s}`} style={{
            display: 'block', textDecoration: 'none',
            background: 'var(--white-matter)', borderRadius: '14px',
            border: '0.5px solid rgba(28,26,58,0.09)', padding: '18px 20px',
            fontSize: '15px', fontWeight: 500, color: 'var(--deep-mind)', lineHeight: 1.35,
          }}>{POSTS[s]}</Link>
        ))}
      </div>
      <Link href={wordLink.href} style={{ fontSize: '15px', fontWeight: 500, color: 'var(--synapse)', textDecoration: 'none' }}>
        {wordLink.label}
      </Link>
    </section>
  )
}

export default function BlogPost({
  slug, title, description, category, readTime,
  datePublished = '2026-05-01', dateModified = '2026-05-07',
  author = 'Johannes Schmid', heroCallout, sidebar, children,
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: 'https://mostcommonspanish.com/og-default.png',
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
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="blog-page-wrap">

        {/* Back link */}
        <Link href="/blog" className="blog-back-link">← Back to blog</Link>

        {/* Header */}
        <header style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{
              background: 'var(--fog)', color: 'var(--synapse)',
              fontSize: '11px', fontWeight: 500, letterSpacing: '.07em',
              textTransform: 'uppercase', padding: '4px 14px', borderRadius: '99px',
            }}>{category}</span>
            <span style={{ fontSize: '13px', color: 'var(--cortex)' }}>{readTime}</span>
          </div>

          <div className="blog-header-grid">
            <div>
              <h1 style={{
                fontFamily: "'Fraunces', serif", fontWeight: 900,
                fontSize: 'clamp(36px, 4vw, 56px)', letterSpacing: '-2px',
                lineHeight: 1.05, color: 'var(--deep-mind)', marginBottom: '20px',
              }}>{title}</h1>
              <p style={{ fontSize: '17px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.7, maxWidth: '560px' }}>
                {description}
              </p>
            </div>

            {heroCallout && (
              <div className="blog-hero-callout" style={{
                background: 'var(--deep-mind)', borderRadius: '20px',
                padding: '32px 36px', textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 900,
                  fontSize: '56px', letterSpacing: '-2px', lineHeight: 1,
                  color: 'var(--mauve)', marginBottom: '10px',
                }}>{heroCallout.value}</div>
                <div style={{ fontSize: '13px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.5 }}>
                  {heroCallout.label}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Body: sidebar + article */}
        <div className="blog-body-grid">

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sidebar}
          </aside>

          {/* Article */}
          <article>
            <div className="article-body" style={{ fontSize: '17px', color: 'var(--cortex)', lineHeight: 1.75 }}>
              {children}
            </div>

            <RelatedPosts slug={slug} />

            {/* Bottom CTA */}
            <div style={{
              background: 'var(--deep-mind)', borderRadius: '20px',
              padding: '48px 40px', textAlign: 'center', marginTop: '64px',
            }}>
              <div className="s-eye" style={{ color: 'var(--mauve)' }}>Ready to build on this?</div>
              <h3 style={{
                fontFamily: "'Fraunces', serif", fontWeight: 900,
                fontSize: '32px', letterSpacing: '-1px', lineHeight: 1.1,
                color: 'var(--white-matter)', marginBottom: '12px',
              }}>Find out where you stand.</h3>
              <p style={{ fontSize: '15px', fontWeight: 300, color: 'var(--cortex)', marginBottom: '28px', lineHeight: 1.65 }}>
                Take the 2-minute Word Reach test — see exactly which words you already know.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/level-test" className="btn-primary">Take the level test</Link>
                <Link href="/get-started" className="btn-ghost" style={{ color: 'var(--mauve)' }}>Sign up free →</Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

export function SidebarCallout({ title, children }) {
  return (
    <div style={{
      background: 'var(--white-matter)', border: '0.5px solid rgba(28,26,58,0.09)',
      borderRadius: '16px', padding: '24px',
    }}>
      <h3 style={{
        fontFamily: "'Fraunces', serif", fontWeight: 700,
        fontSize: '18px', letterSpacing: '-0.3px', color: 'var(--deep-mind)',
        marginBottom: '14px',
      }}>{title}</h3>
      <div style={{ fontSize: '14px', color: 'var(--cortex)', lineHeight: 1.65 }}>{children}</div>
    </div>
  )
}

export function ProTip({ children }) {
  return (
    <div style={{
      background: 'var(--fog)', borderLeft: '3px solid var(--synapse)',
      borderRadius: '12px', padding: '18px 20px',
    }}>
      <div style={{
        fontSize: '10px', fontWeight: 500, letterSpacing: '.1em',
        textTransform: 'uppercase', color: 'var(--synapse)', marginBottom: '8px',
      }}>Pro tip</div>
      <p style={{ fontSize: '14px', color: 'var(--deep-mind)', lineHeight: 1.65, fontWeight: 300 }}>{children}</p>
    </div>
  )
}
