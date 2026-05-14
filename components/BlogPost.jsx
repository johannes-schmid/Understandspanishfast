import Link from 'next/link'

export default function BlogPost({ slug, title, description, category, readTime, datePublished = '2026-05-01', dateModified = '2026-05-07', author = 'Johannes Schmid', heroCallout, sidebar, children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: 'https://mostcommonspanish.com/og-default.svg',
    author: {
      '@type': 'Person',
      name: author,
      url: 'https://mostcommonspanish.com/about',
    },
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
    <div className="bg-background text-on-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-32 pb-16">
        <p className="text-sm text-on-surface-variant mb-4">
          <Link href="/blog" className="hover:text-[#FF8C00]">← Back to blog</Link>
        </p>

        <header className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-xs font-semibold">{category}</span>
                <span className="text-on-surface-variant text-sm">{readTime}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold text-on-surface mb-4 tracking-tight leading-tight">{title}</h1>
              <p className="text-lg text-on-surface-variant leading-relaxed">{description}</p>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="aspect-square rounded-[2rem] overflow-hidden shadow-lg border-4 border-white bg-gradient-to-br from-orange-100 via-white to-blue-100 flex items-center justify-center">
                <span className="material-symbols-rounded text-[120px] text-[#FF8C00]/40">auto_stories</span>
              </div>
              {heroCallout && (
                <div className="absolute -bottom-6 -left-2 bg-secondary-container p-5 rounded-2xl shadow-lg max-w-[220px]">
                  <p className="text-2xl font-semibold text-on-secondary-container">{heroCallout.value}</p>
                  <p className="text-sm text-on-secondary-container">{heroCallout.label}</p>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-28 space-y-6">{sidebar}</div>
          </aside>
          <article className="lg:col-span-8 order-1 lg:order-2">
            <div className="article-body text-on-surface-variant text-lg leading-relaxed space-y-6">
              {children}
            </div>

            <section className="bg-secondary-container rounded-[2rem] p-10 text-center mt-12 relative overflow-hidden">
              <h3 className="text-3xl font-semibold text-on-secondary-container mb-3 tracking-tight">Ready to master these words?</h3>
              <p className="text-on-secondary-container/80 mb-6 max-w-xl mx-auto">Take the 3-minute Word Reach test to see exactly which words you already know.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/level-test" className="bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-semibold shadow-sm hover:brightness-110 active:scale-95 transition-all no-underline">
                  Start Level Test
                </Link>
                <Link href="/#waitlist" className="bg-white text-secondary px-8 py-3 rounded-full font-semibold shadow-sm hover:bg-surface transition-all no-underline">
                  Join Waitlist
                </Link>
              </div>
            </section>
          </article>
        </div>
      </main>
    </div>
  )
}

export function SidebarCallout({ icon, title, children }) {
  return (
    <section className="bg-surface-container-high p-6 rounded-2xl border border-outline-variant">
      <span className="material-symbols-rounded text-[#FF8C00] mb-2 block">{icon}</span>
      <h3 className="text-xl font-semibold text-on-surface mb-2">{title}</h3>
      <div className="text-on-surface-variant text-sm leading-relaxed">{children}</div>
    </section>
  )
}

export function ProTip({ children }) {
  return (
    <section className="bg-primary-fixed p-6 rounded-2xl">
      <p className="text-xs text-on-primary-fixed font-bold uppercase tracking-wider mb-2">Pro Tip</p>
      <p className="text-on-primary-fixed">{children}</p>
    </section>
  )
}
