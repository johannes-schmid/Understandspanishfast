import Link from 'next/link'

export const metadata = {
  title: 'Blog',
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
    excerpt: 'Statistically, the first 100 words of any language account for 50% of all daily communication. Learn how to weaponize this core vocabulary for instant fluency.',
    category: 'Learning Science',
    badge: 'Featured',
    readTime: '8 min read',
    featured: true,
  },
  {
    slug: 'cracking-the-1500',
    title: 'Cracking the 1,500: The Real Threshold for Spanish Fluency',
    excerpt: 'Why 1,500 words is the magic number where comprehension flips from "guessing" to "following" — and how to get there efficiently.',
    category: 'Method',
    badge: 'Essential',
    readTime: '10 min read',
  },
  {
    slug: 'how-many-spanish-words-to-be-fluent',
    title: 'How Many Spanish Words Do You Need to Be Fluent?',
    excerpt: "A direct, data-backed answer to the most-asked question in language learning. Spoiler: it's probably less than you think.",
    category: 'Research',
    badge: 'Popular',
    readTime: '7 min read',
  },
]

export default function BlogHub() {
  const featured = POSTS.find((p) => p.featured) || POSTS[0]
  const rest = POSTS.filter((p) => p !== featured)

  return (
    <div className="bg-background text-on-background min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-32 pb-16">
        <div className="mb-16 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-semibold text-on-surface mb-3 tracking-tight">Cracking the 1,500</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Expert insights, linguistic shortcuts, and the psychological roadmap to mastering Spanish's most critical vocabulary.
          </p>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
          <Link href={`/blog/${featured.slug}`} className="lg:col-span-8 group cursor-pointer bg-white rounded-[2rem] overflow-hidden shadow-sm bento-card no-underline text-on-surface">
            <div className="aspect-[16/9] overflow-hidden relative bg-gradient-to-br from-orange-100 via-white to-blue-100">
              <PostHero title={featured.title} />
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-semibold">{featured.badge}</span>
                <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-xs font-semibold">{featured.category}</span>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 mb-3 text-on-surface-variant text-sm">
                <span className="material-symbols-rounded text-[18px]">schedule</span>
                <span>{featured.readTime}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-on-surface mb-3 group-hover:text-[#FF8C00] transition-colors">{featured.title}</h2>
              <p className="text-on-surface-variant mb-6">{featured.excerpt}</p>
              <span className="inline-flex items-center gap-2 text-[#FF8C00] font-semibold">
                Read article
                <span className="material-symbols-rounded">arrow_forward</span>
              </span>
            </div>
          </Link>

          <div className="lg:col-span-4 bg-primary-container text-on-primary-container p-8 rounded-[2rem] flex flex-col justify-between">
            <div>
              <span className="material-symbols-rounded text-[48px] mb-4 block">auto_awesome</span>
              <h3 className="text-2xl font-semibold mb-3">Mastery Path</h3>
              <p className="opacity-90 mb-6">Want to accelerate your journey to 1,500 words? Take the 2-minute Word Reach test.</p>
            </div>
            <Link href="/level-test" className="bg-on-primary-fixed text-primary-fixed py-3 px-6 rounded-full font-semibold self-start hover:scale-95 transition-transform no-underline">
              Test your level
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="bg-white rounded-[2rem] overflow-hidden bento-card group cursor-pointer no-underline text-on-surface">
              <div className="aspect-square bg-gradient-to-br from-orange-100 via-white to-blue-100 overflow-hidden relative">
                <PostHero title={p.title} />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-surface-container text-secondary px-3 py-1 rounded-full text-xs font-semibold">{p.category}</span>
                  <span className="text-on-surface-variant text-xs">{p.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold text-on-surface mb-2 group-hover:text-[#FF8C00] transition-colors">{p.title}</h3>
                <p className="text-on-surface-variant text-sm">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </section>

        <section className="bg-secondary-container rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-semibold text-on-secondary-container mb-2 tracking-tight">Don't miss a word.</h2>
            <p className="text-on-secondary-container/80">Join the waitlist and get early access plus the weekly "Word Bucket" — 10 essential words and 1 deep dive.</p>
          </div>
          <Link href="/#waitlist" className="bg-primary text-on-primary py-4 px-8 rounded-full font-semibold hover:bg-primary-container hover:text-on-primary-container transition-colors no-underline whitespace-nowrap">
            Join the waitlist
          </Link>
        </section>
      </main>
    </div>
  )
}

function PostHero({ title }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <div className="text-center">
        <span className="material-symbols-rounded text-[80px] text-[#FF8C00]/40">auto_stories</span>
        <p className="text-slate-700 font-semibold mt-2 line-clamp-2">{title}</p>
      </div>
    </div>
  )
}
