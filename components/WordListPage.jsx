import Link from 'next/link'
import PdfDownloadForm from '@/components/PdfDownloadForm'

const BASE = 'https://mostcommonspanish.com'

function Stat({ label, value, sub, color = 'var(--deep-mind)' }) {
  return (
    <div style={{
      background: 'var(--white-matter)', borderRadius: '16px',
      border: '0.5px solid rgba(28,26,58,0.09)', padding: '24px 28px',
    }}>
      <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--cortex)', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: '38px', letterSpacing: '-1px', lineHeight: 1, color, marginBottom: sub ? '4px' : 0 }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', fontWeight: 300, color: 'var(--cortex)' }}>{sub}</div>}
    </div>
  )
}

/**
 * Server-rendered, SEO-first word-list page. Renders a static (indexable) table
 * with example sentences, coverage stats, sibling cross-links, FAQ, and JSON-LD.
 */
export default function WordListPage({
  eyebrow = 'Frequency list',
  title,
  intro,
  words,
  coverage,
  slug,
  breadcrumbName,
  schemaName,
  schemaDescription,
  siblings = [],
  faqs = [],
  showExamples = true,
}) {
  const url = `${BASE}/words/${slug}`

  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: schemaName || title,
    description: schemaDescription || intro,
    url,
    creator: { '@type': 'Organization', name: 'Most Common Spanish', url: BASE },
    publisher: { '@type': 'Organization', name: 'Most Common Spanish', url: BASE },
    dateModified: '2026-07-23',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Spanish Words', item: `${BASE}/words` },
      { '@type': 'ListItem', position: 3, name: breadcrumbName || title, item: url },
    ],
  }

  const faqSchema = faqs.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '120px 56px 80px' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: '13px', color: 'var(--cortex)', marginBottom: '28px' }}>
          <Link href="/" style={{ color: 'var(--cortex)' }}>Home</Link>
          {' / '}
          <Link href="/words" style={{ color: 'var(--cortex)' }}>Spanish Words</Link>
          {' / '}
          <span style={{ color: 'var(--deep-mind)' }}>{breadcrumbName || title}</span>
        </nav>

        {/* Header */}
        <div className="s-eye">{eyebrow}</div>
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontWeight: 900,
          fontSize: 'clamp(38px, 5vw, 58px)', letterSpacing: '-2px',
          lineHeight: 1.02, color: 'var(--deep-mind)', marginBottom: '16px',
        }}>{title}</h1>
        <div style={{ fontSize: '17px', fontWeight: 300, color: 'var(--cortex)', maxWidth: '640px', lineHeight: 1.7, marginBottom: '36px' }}>
          {intro}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '32px' }}>
          <Stat label="Words on this list" value={words.length.toLocaleString()} />
          <Stat label="Comprehension coverage" value={coverage} sub="of everyday spoken Spanish" color="var(--synapse)" />
        </div>

        {/* Lead magnet */}
        <div style={{ marginBottom: '28px' }}>
          <PdfDownloadForm source={slug} />
        </div>

        {/* Sibling cross-links */}
        {siblings.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {siblings.map((s) => (
              <Link key={s.href} href={s.href} style={{
                padding: '7px 16px', borderRadius: '99px',
                border: '0.5px solid rgba(28,26,58,0.14)',
                background: 'var(--white-matter)', color: 'var(--deep-mind)',
                fontSize: '13px', fontWeight: 500, textDecoration: 'none',
              }}>{s.label}</Link>
            ))}
          </div>
        )}

        {/* Table */}
        <div style={{
          background: 'var(--white-matter)', borderRadius: '16px',
          border: '0.5px solid rgba(28,26,58,0.09)', overflow: 'hidden', marginBottom: '48px',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--cream-dark)', borderBottom: '1px solid rgba(28,26,58,0.08)' }}>
                  {['#', 'Spanish', 'English', showExamples ? 'Example' : null].filter(Boolean).map((h, i) => (
                    <th key={i} style={{
                      padding: '10px 16px', fontSize: '11px', fontWeight: 500,
                      letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--cortex)',
                      width: i === 0 ? '56px' : undefined,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {words.map((w) => (
                  <tr key={w.rank} style={{ borderTop: '0.5px solid rgba(28,26,58,0.06)' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--cortex)', fontVariantNumeric: 'tabular-nums' }}>{w.rank}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--deep-mind)', fontSize: '16px' }}>{w.word}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 300, color: 'var(--cortex)' }}>
                      {Array.isArray(w.meanings) ? w.meanings.join(' · ') : w.meanings}
                    </td>
                    {showExamples && (
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 300, color: 'var(--cortex)' }}>
                        {w.example_es ? (
                          <>
                            <span style={{ color: 'var(--deep-mind)' }}>{w.example_es}</span>
                            {w.example_en ? <span style={{ display: 'block', opacity: 0.7 }}>{w.example_en}</span> : null}
                          </>
                        ) : null}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <h2 style={{
              fontFamily: "'Fraunces', serif", fontWeight: 900,
              fontSize: '32px', letterSpacing: '-1px', lineHeight: 1.1,
              color: 'var(--deep-mind)', marginBottom: '20px',
            }}>Frequently asked questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {faqs.map((f) => (
                <div key={f.q} style={{
                  background: 'var(--white-matter)', borderRadius: '14px',
                  border: '0.5px solid rgba(28,26,58,0.09)', padding: '22px 26px',
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--deep-mind)', marginBottom: '10px' }}>{f.q}</h3>
                  <p style={{ fontSize: '15px', fontWeight: 300, color: 'var(--cortex)', lineHeight: 1.7 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div style={{
          background: 'var(--deep-mind)', borderRadius: '20px',
          padding: '48px 44px', textAlign: 'center',
        }}>
          <div className="s-eye" style={{ color: 'var(--mauve)' }}>Learn these, don't just read them</div>
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 900,
            fontSize: 'clamp(26px, 3vw, 34px)', letterSpacing: '-1px', lineHeight: 1.1,
            color: 'var(--white-matter)', marginBottom: '12px',
          }}>Turn this list into real comprehension.</h2>
          <p style={{ fontSize: '15px', fontWeight: 300, color: 'var(--cortex)', marginBottom: '26px', lineHeight: 1.65, maxWidth: '460px', margin: '0 auto 26px' }}>
            Free for your first 500 words, with spaced repetition built in. Or take the 2-minute level test to see which words you already know.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/get-started" className="btn-primary" style={{ textDecoration: 'none' }}>Create free account</Link>
            <Link href="/level-test" className="btn-ghost" style={{ color: 'var(--mauve)', textDecoration: 'none' }}>Take the level test →</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
