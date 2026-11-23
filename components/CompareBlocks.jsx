import Link from 'next/link'

export const SITE = 'https://mostcommonspanish.com'
export const CHECKED = '2026-11-23'
export const SAMPLE_URL = '/anki/top-100-spanish-words-sample.apkg'

export function compareMeta({ slug, title, description }) {
  const url = `${SITE}/${slug}`
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article', images: [`${SITE}/anki/card-preview.webp`] },
  }
}

export function compareSchemas({ slug, title, description, faq, itemList }) {
  const url = `${SITE}/${slug}`
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      url,
      mainEntityOfPage: url,
      image: `${SITE}/anki/card-preview.webp`,
      datePublished: CHECKED,
      dateModified: CHECKED,
      author: { '@type': 'Person', name: 'Johannes Schmid', url: `${SITE}/about` },
      publisher: { '@type': 'Organization', name: 'Most Common Spanish', url: SITE },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ]
  if (itemList) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: itemList.name,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: itemList.items.length,
      itemListElement: itemList.items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, url: item.url })),
    })
  }
  return schemas
}

export function CompareJsonLd({ schemas }) {
  return schemas.map((s, i) => (
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
  ))
}

const Check = () => (
  <svg className="ct-yes" width="18" height="18" viewBox="0 0 18 18" fill="none" role="img" aria-label="Yes"><path d="M4 9.5l3.2 3L14 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
const Cross = () => (
  <svg className="ct-no" width="16" height="16" viewBox="0 0 16 16" fill="none" role="img" aria-label="No"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
)
export const Mark = ({ v }) => (v === true ? <Check /> : v === false ? <Cross /> : <span className="ct-part">{v}</span>)

export function CompareHero({ title, soft, answer, children }) {
  return (
    <section className="ct-hero">
      <div className="wrap">
        <h1 className="h1">{title}{soft && <><br /><span className="soft">{soft}</span></>}</h1>
        <div className="post-qa" style={{ marginTop: 28, maxWidth: '68ch' }}>
          <p className="post-qa-label">Short answer</p>
          {answer}
        </div>
        {children}
        <div className="cta-row">
          <Link className="btn btn-navy" href="/anki-spanish-deck">See the Anki deck</Link>
          <a className="btn btn-ghost" href={SAMPLE_URL} download>Free 100-word sample</a>
        </div>
        <p className="fine" style={{ marginTop: 14, textAlign: 'left' }}>Facts checked {formatDate(CHECKED)}. Prices and features change, so check the linked sources before you buy.</p>
      </div>
    </section>
  )
}

export function CompareTable({ head, rows, usCol, usRow, wide }) {
  return (
    <div className="card ct-table-card">
      <table className={`ct-table ct-compare${wide ? ' ct-compare-5' : ''}`}>
        <thead>
          <tr>{head.map((h, i) => <th key={h} scope="col" className={i === usCol ? 'ct-us' : undefined}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map(([label, ...cells], r) => (
            <tr key={label}>
              <td className={r === usRow ? 'ct-us' : undefined}>{label}</td>
              {cells.map((c, i) => <td key={i} className={i + 1 === usCol || r === usRow ? 'ct-us' : undefined}><Mark v={c} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function CompareSection({ title, lead, children }) {
  return (
    <section className="sec ct-sec">
      <div className="wrap">
        {(title || lead) && (
          <div className="sec-head">
            {title && <h2>{title}</h2>}
            {lead && <p className="lead">{lead}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

export function CompareProse({ children }) {
  return <div className="card post-body" style={{ maxWidth: 820, margin: 0, padding: 'clamp(22px,4vw,40px)' }}>{children}</div>
}

export function CompareRanked({ items }) {
  return (
    <ol className="card blog-list" style={{ listStyle: 'none' }}>
      {items.map((d, i) => (
        <li key={d.name} id={d.id} style={{ padding: '26px 0', scrollMarginTop: 96 }}>
          <p className="post-meta" style={{ marginBottom: 10 }}><span className="chip">#{i + 1}</span><span>{d.bestFor}</span></p>
          <h3 style={{ fontSize: 21, marginBottom: 6 }}>{d.name}</h3>
          <p style={{ fontSize: 15, color: 'var(--ink-3)', marginBottom: 10 }}><b style={{ color: 'var(--navy)', fontSize: 17 }}>{d.price}</b> {d.priceNote}</p>
          <p style={{ fontSize: 15.5, color: 'var(--ink-2)', maxWidth: '68ch' }}>{d.body}</p>
          {d.cons && <p style={{ fontSize: 15, color: 'var(--ink-2)', maxWidth: '68ch', marginTop: 8 }}><b style={{ color: 'var(--navy)' }}>Watch out:</b> {d.cons}</p>}
          <p style={{ marginTop: 10, fontSize: 14.5 }}>{d.link}</p>
        </li>
      ))}
    </ol>
  )
}

export function CompareFaq({ faq }) {
  return (
    <CompareSection title="FAQ">
      <div className="faq">
        {faq.map(({ q, a }) => <div key={q} className="card faq-item"><h3>{q}</h3><p>{a}</p></div>)}
      </div>
    </CompareSection>
  )
}

export function CompareSources({ sources }) {
  return (
    <CompareSection>
      <div className="card ct-note">
        <h3>Sources</h3>
        <p>Every competitor fact on this page comes from these pages, checked on {formatDate(CHECKED)}.</p>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: 12, display: 'grid', gap: 8, fontSize: 15 }}>
          {sources.map(([label, href]) => (
            <li key={href}><a href={href} rel="nofollow noopener" target="_blank">{label}</a></li>
          ))}
        </ul>
      </div>
    </CompareSection>
  )
}

export function CompareEnd({ title, soft }) {
  return (
    <section className="ct-end">
      <div className="wrap">
        <div className="panel close">
          <div>
            <h2>{title}<br /><span className="soft">{soft}</span></h2>
            <p className="lead" style={{ marginTop: 14, fontSize: 16.5 }}>
              €9 once for all 1,500 words. Or start with the first 100 for free, or the <Link className="ct-inline" href="/study">browser flashcards</Link>.
            </p>
          </div>
          <div className="cta-row">
            <Link className="btn btn-navy" href="/anki-spanish-deck">See the Anki deck</Link>
            <a className="btn btn-ghost" href={SAMPLE_URL} download>Free 100-word sample</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CompareRelated() {
  return (
    <p className="ct-note">
      Not sure Anki is for you at all? Read <Link href="/vs-anki">Anki vs a ready-made system</Link>. Want to see the words first? The full <Link href="/words/most-common-spanish-words">list of the most common Spanish words</Link> is free.
    </p>
  )
}

function formatDate(iso) {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}
