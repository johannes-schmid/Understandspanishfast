import Link from 'next/link'

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
    image: 'https://mostcommonspanish.com/og-default.svg',
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

      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '120px 56px 80px' }}>

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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '48px', alignItems: 'start' }}>
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
              <div style={{
                background: 'var(--deep-mind)', borderRadius: '20px',
                padding: '32px 36px', textAlign: 'center', minWidth: '180px', flexShrink: 0,
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
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '64px', alignItems: 'start' }}>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sidebar}
          </aside>

          {/* Article */}
          <article>
            <div className="article-body" style={{ fontSize: '17px', color: 'var(--cortex)', lineHeight: 1.75 }}>
              {children}
            </div>

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
