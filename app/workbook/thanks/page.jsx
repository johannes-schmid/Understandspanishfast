import Link from 'next/link'
import WorkbookCover from '@/components/WorkbookCover'
import { getPaidSession } from '@/lib/stripe'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Thank you — your workbook is ready', robots: { index: false, follow: false } }

export default async function ThanksPage({ searchParams }) {
  const sessionId = searchParams?.session_id
  const session = await getPaidSession(sessionId)

  return (
    <div className="cl cl-home">
      <section className="hero wb-hero">
        <div className="wrap">
          {session ? (
            <div className="card study-done wb-thanks">
              <WorkbookCover />
              <div>
                <h1 className="h1 wb-h1">Your workbook is ready</h1>
                <p>Payment received{session.customer_details?.email ? <> for <b>{session.customer_details.email}</b></> : null}. Download the PDF below and keep this page bookmarked: the link keeps working.</p>
                <div className="cta-row">
                  <a className="btn btn-coral" href={`/api/workbook/download?session_id=${encodeURIComponent(sessionId)}`} download>Download the PDF · 4 MB</a>
                  <Link className="btn btn-ghost" href="/study">Hear the words with audio</Link>
                </div>
                <p className="fine wb-start">Start with the method pages (pp. 4–7), then do Unit 1 on day one.</p>
              </div>
            </div>
          ) : (
            <div className="card study-msg">
              <h1>We couldn't find that payment</h1>
              <p>If you just paid, wait a few seconds and reload this page. Still stuck? Reply to your Stripe receipt and we'll send the workbook.</p>
              <Link className="btn btn-navy" href="/workbook">Back to the workbook</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
