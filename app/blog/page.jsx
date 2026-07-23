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
]

export default function BlogHub() {
  const featured = POSTS.find((p) => p.featured) || POSTS[0]
  const rest = POSTS.filter((p) => p !== featured)

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="blog-page-wrap">

        {/* Header */}
        <div style={{ marginBottom: '64px' }}>
          <div className="s-eye">From the blog</div>
          <h1 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 900,
            fontSize: 'clamp(40px, 5vw, 62px)', letterSpacing: '-2px',
            lineHeight: 1.0, color: 'var(--deep-mind)', marginBottom: '16px',
          }}>
            The science of<br />learning faster.
          </h1>
          <p style={{ fontSize: '17px', fontWeight: 300, color: 'var(--cortex)', maxWidth: '480px', lineHeight: 1.7 }}>
            No fluff. Frequency-first strategy, comprehension research, and the data behind getting fluent fast.
          </p>
        </div>

        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`} className="blog-featured-card" style={{
          background: 'var(--deep-mind)',
          borderRadius: '20px', overflow: 'hidden',
          textDecoration: 'none', marginBottom: '24px',
          transition: 'transform .2s, box-shadow .2s',
          boxShadow: '0 8px 32px rgba(28,26,58,0.12)',
        }}>
          <div style={{ padding: '48px 48px 48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{
                background: 'rgba(83,74,183,0.3)', color: 'var(--mauve)',
                fontSize: '11px', fontWeight: 500, letterSpacing: '.07em',
                textTransform: 'uppercase', padding: '4px 14px', borderRadius: '99px',
              }}>{featured.badge}</span>
              <span style={{ fontSize: '13px', color: 'var(--cortex)' }}>{featured.readTime}</span>
            </div>
            <h2 style={{
              fontFamily: "'Fraunces', serif", fontWeight: 900,
              fontSize: 'clamp(26px, 3vw, 38px)', letterSpacing: '-1px',
              lineHeight: 1.1, color: 'var(--white-matter)', marginBottom: '16px',
            }}>{featured.title}</h2>
            <p style={{ fontSize: '15px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.7, marginBottom: '28px', maxWidth: '520px' }}>
              {featured.excerpt}
            </p>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '14px', fontWeight: 500, color: 'var(--mauve)',
            }}>Read article →</span>
          </div>

          <div className="blog-featured-stat" style={{
            background: 'rgba(255,255,255,0.04)',
            borderLeft: '0.5px solid rgba(255,255,255,0.06)',
            padding: '48px',
          }}>
            <div style={{
              fontFamily: "'Fraunces', serif", fontWeight: 900,
              fontSize: '64px', letterSpacing: '-2px', lineHeight: 1,
              color: 'var(--mauve)', marginBottom: '8px',
            }}>{featured.stat}</div>
            <div style={{ fontSize: '13px', fontWeight: 300, color: 'var(--cortex)', textAlign: 'center', lineHeight: 1.5 }}>
              {featured.statLabel}
            </div>
          </div>
        </Link>

        {/* Secondary posts */}
        <div className="blog-posts-grid">
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} style={{
              background: 'var(--white-matter)', borderRadius: '20px',
              border: '0.5px solid rgba(28,26,58,0.09)',
              padding: '36px', textDecoration: 'none',
              display: 'flex', flexDirection: 'column', gap: '0',
              transition: 'transform .2s, box-shadow .2s',
              boxShadow: '0 4px 16px rgba(28,26,58,0.06)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{
                  background: 'var(--fog)', color: 'var(--synapse)',
                  fontSize: '11px', fontWeight: 500, letterSpacing: '.07em',
                  textTransform: 'uppercase', padding: '4px 14px', borderRadius: '99px',
                }}>{p.category}</span>
                <span style={{ fontSize: '13px', color: 'var(--cortex)' }}>{p.readTime}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' }}>
                <h3 style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 900,
                  fontSize: '22px', letterSpacing: '-0.5px', lineHeight: 1.15,
                  color: 'var(--deep-mind)', flex: 1,
                }}>{p.title}</h3>
                <div style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 900,
                  fontSize: '36px', letterSpacing: '-1px', lineHeight: 1,
                  color: 'var(--mauve)', flexShrink: 0,
                }}>{p.stat}</div>
              </div>

              <p style={{ fontSize: '14px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.7, marginBottom: '24px' }}>
                {p.excerpt}
              </p>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--synapse)', marginTop: 'auto' }}>
                Read article →
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="blog-cta-banner" style={{
          background: 'var(--deep-mind)', borderRadius: '20px',
          padding: '56px 64px',
        }}>
          <div>
            <div className="s-eye" style={{ color: 'var(--mauve)' }}>Not just reading</div>
            <h2 style={{
              fontFamily: "'Fraunces', serif", fontWeight: 900,
              fontSize: '32px', letterSpacing: '-1px', lineHeight: 1.1,
              color: 'var(--white-matter)', marginBottom: '10px',
            }}>Start applying it.</h2>
            <p style={{ fontSize: '15px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.65, maxWidth: '400px' }}>
              Create a free account and start learning the exact words that matter — ranked by real-world frequency.
            </p>
          </div>
          <Link href="/get-started" className="btn-primary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
            Sign up free
          </Link>
        </div>

      </div>
    </div>
  )
}
