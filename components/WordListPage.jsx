import Link from 'next/link'
import PdfDownloadForm from '@/components/PdfDownloadForm'

const BASE = 'https://mostcommonspanish.com'

const POS_LABEL = { 'v.': 'verb', 'n.': 'noun', 'adj.': 'adjective', 'adv.': 'adverb', 'prep.': 'preposition', 'conj.': 'conjunction', 'pron.': 'pronoun', 'det.': 'determiner', 'art.': 'article', 'interj.': 'interjection', 'num.': 'number' }

export const COVERAGE_BARS = [
  { n: 100, label: '100', pct: '50%', w: 50 },
  { n: 500, label: '500', pct: '67%', w: 67 },
  { n: 1000, label: '1,000', pct: '74%', w: 74 },
  { n: 1500, label: '1,500', pct: '80%', w: 80 },
]

export function Arrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

export function CoverageBars({ level }) {
  return (
    <div className="bars" role="img" aria-label="Share of everyday Spanish covered: 100 words 50%, 500 words 67%, 1,000 words 74%, 1,500 words 80%.">
      {COVERAGE_BARS.map((c) => (
        <div key={c.n} className={`bar${c.n === level ? ' key' : ''}`}>
          <span className="mono tab">{c.label}</span>
          <div className="track"><div className="fill" style={{ width: `${c.w}%` }} /></div>
          <span className="pct tab">{c.pct}</span>
        </div>
      ))}
    </div>
  )
}

export function Crumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={it.label} style={{ display: 'contents' }}>
          {i > 0 && <span className="sep" aria-hidden="true">/</span>}
          {it.href ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
        </span>
      ))}
    </nav>
  )
}

export function Offline({ source }) {
  return (
    <div className="offline">
      <div className="pdf-slot"><PdfDownloadForm source={source} /></div>
      <div className="card wb">
        <div className="cover sm" aria-hidden="true">
          <span className="mono">MOST COMMON SPANISH</span>
          <div className="cover-bars"><i style={{ height: '30%' }} /><i style={{ height: '50%' }} /><i style={{ height: '72%' }} /><i style={{ height: '100%' }} /></div>
          <div className="cover-num tab">1,500</div>
          <div className="cover-t">The Top 1,500 Workbook</div>
        </div>
        <div>
          <div className="free-tag mono">PRINTABLE PDF · €5</div>
          <h3>The Top 1,500 workbook</h3>
          <p>All 1,500 words in ranked order, in 30 short units with exercises and an answer key. Print it and work through it with a pen.</p>
          <div className="cta-row">
            <Link className="btn btn-ghost btn-sm" href="/workbook">Get the workbook <Arrow /></Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FaqSection({ faqs, title = 'Questions and answers' }) {
  return (
    <section className="sec-sm">
      <div className="sec-head"><h2>{title}</h2></div>
      <div className="faq">
        {faqs.map((f) => (
          <div key={f.q} className="card faq-item"><h3>{f.q}</h3><p>{f.a}</p></div>
        ))}
      </div>
    </section>
  )
}

export function Closing({ title = 'Learn these words instead of just reading them' }) {
  return (
    <section className="sec-sm" style={{ paddingBottom: 24 }}>
      <div className="panel close">
        <h2>{title}</h2>
        <div className="cta-row">
          <Link className="btn btn-navy" href="/study">Start for free <Arrow /></Link>
          <Link className="btn btn-ghost" href="/level-test">Take the level test</Link>
        </div>
      </div>
    </section>
  )
}

/**
 * Server-rendered, SEO-first word-list page. Renders a static (indexable) table
 * with example sentences, coverage stats, sibling cross-links, FAQ, and JSON-LD.
 */
export default function WordListPage({
  title,
  intro,
  words,
  coverage,
  level,
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
    <div className="cl cl-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div className="wrap pg">
        <Crumbs items={[{ href: '/', label: 'Home' }, { href: '/words', label: 'Spanish Words' }, { label: breadcrumbName || title }]} />

        <div className="pg-head">
          <div>
            <h1 className="pg-h1">{title}</h1>
            <p className="lead">{intro}</p>
            <div className="cta-row">
              <Link className="btn btn-navy" href="/study">Start for free <Arrow /></Link>
              <Link className="btn btn-ghost" href="/workbook">Get the workbook</Link>
            </div>
          </div>
          <aside className="card facts">
            <div className="facts-top">
              <div>
                <div className="facts-num tab">{coverage}</div>
                <div className="facts-lbl">{level ? 'of everyday spoken Spanish' : 'ranked by frequency'}</div>
              </div>
              <span className="mono tab">{words.length.toLocaleString('en')} WORDS</span>
            </div>
            <CoverageBars level={level} />
            <p className="facts-note">Share of words in everyday spoken Spanish you’ll recognise after learning the top N.</p>
          </aside>
        </div>

        {siblings.length > 0 && (
          <nav className="sibs" aria-label="Related word lists">
            {siblings.map((s) => <Link key={s.href} href={s.href}>{s.label}</Link>)}
          </nav>
        )}

        <div className="card list-card wl">
          <div className="list-bar">
            <span className="wl-count tab">{words.length.toLocaleString('en')} words, most frequent first</span>
            <Link className="link" href="/words/most-common-spanish-words">Search and mark words as learned <Arrow /></Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Rank</th><th>Word</th><th>Type</th><th>Meaning</th>
                {showExamples && <th>Example</th>}
              </tr>
            </thead>
            <tbody>
              {words.map((w) => {
                const meanings = Array.isArray(w.meanings) ? w.meanings : [w.meanings]
                return (
                  <tr key={w.rank}>
                    <td className="rk tab">#{w.rank}</td>
                    <td className="w">{w.word}<span className="w-sub">{meanings[0]}</span></td>
                    <td className="pos">{POS_LABEL[w.pos] || w.pos}</td>
                    <td className="mn">{meanings.slice(0, 3).join(', ')}</td>
                    {showExamples && (
                      <td className="ex">
                        {w.example_es ? <><span className="es">{w.example_es}</span>{w.example_en && <small>{w.example_en}</small>}</> : null}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <section className="sec-sm">
          <div className="sec-head">
            <h2>Take the list offline</h2>
            <p className="lead">Get the top 1,000 as a free PDF, or work through all 1,500 words on paper with the workbook.</p>
          </div>
          <Offline source={slug} />
        </section>

        {faqs.length > 0 && <FaqSection faqs={faqs} />}

        <Closing />
      </div>
    </div>
  )
}
