import Link from 'next/link'
import { BrandMark } from '@/components/NavbarClient'

const COLS = [
  { h: 'Study', links: [['/study', 'Free sample'], ['/level-test', 'Vocabulary test'], ['/shop', 'Shop'], ['/workbook', 'Workbook'], ['/anki-spanish-deck', 'Anki deck'], ['/vs-duolingo', 'Duolingo alternative'], ['/vs-anki', 'Anki alternative']] },
  { h: 'Word lists', links: [['/words/top-100-spanish-words', 'Top 100'], ['/words/top-500-spanish-words', 'Top 500'], ['/words/most-common-spanish-verbs', 'Most common verbs'], ['/words/spanish-frequency-list', 'Frequency list'], ['/words/most-common-spanish-words-pdf', 'Free PDF']] },
  { h: 'About', links: [['/about', 'About'], ['/blog', 'Blog'], ['/privacy', 'Privacy'], ['/terms', 'Terms']] },
]

export default function Footer() {
  return (
    <footer className="cl cl-footer">
      <div className="wrap">
        <div className="foot">
          <div>
            <Link className="brand" href="/"><BrandMark />Most Common Spanish</Link>
            <p style={{ marginTop: 14, maxWidth: '34ch' }}>The most common Spanish words, ranked by real-world frequency.</p>
          </div>
          {COLS.map((c) => (
            <div key={c.h}>
              <h4>{c.h}</h4>
              <ul>{c.links.map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="legal"><span>© 2026 Most Common Spanish · Built in Barcelona</span><span className="mono">mostcommonspanish.com</span></div>
      </div>
    </footer>
  )
}
