import Link from 'next/link'
import { getPaidSession, PRODUCTS, ANKI_DECK } from '@/lib/stripe'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Thank you — your download is ready', robots: { index: false, follow: false } }

export default async function ThanksPage({ searchParams }) {
  const sessionId = searchParams?.session_id
  const session = await getPaidSession(sessionId, null)
  const includes = session ? PRODUCTS[session.metadata.product].includes : []
  const q = encodeURIComponent(sessionId || '')

  return (
    <div className="cl cl-home">
      <section className="hero wb-hero">
        <div className="wrap">
          {session ? (
            <div className="card study-msg thanks-card">
              <h1>Your download is ready</h1>
              <p>Payment received{session.customer_details?.email ? <> for <b>{session.customer_details.email}</b></> : null}. Keep this page bookmarked: the download links keep working.</p>
              <div className="cta-row">
                {includes.includes('anki') && (
                  <a className="btn btn-coral" href={`/api/anki/download?session_id=${q}`}>Download the Anki deck · {ANKI_DECK.size}</a>
                )}
                {includes.includes('workbook') && (
                  <a className="btn btn-navy" href={`/api/workbook/download?session_id=${q}`} download>Download the workbook PDF · 4 MB</a>
                )}
              </div>
              {includes.includes('anki') && (
                <p className="fine wb-start">Open the .apkg file in Anki on your computer (double-click it), then sync to your phone. New cards start at word #1. Already imported the free sample? Your progress on the first 100 words carries over.</p>
              )}
            </div>
          ) : (
            <div className="card study-msg">
              <h1>We couldn&rsquo;t find that payment</h1>
              <p>If you just paid, wait a few seconds and reload this page. Still stuck? Reply to your Stripe receipt and we&rsquo;ll send your files.</p>
              <Link className="btn btn-navy" href="/anki-spanish-deck">Back to the shop</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
