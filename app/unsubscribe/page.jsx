import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Unsubscribe', robots: { index: false, follow: false } }

const CARD = {
  background: 'var(--white-matter)',
  border: '1px solid rgba(28,26,58,.07)',
  borderRadius: '14px',
  padding: '34px 32px',
}

const H1 = {
  fontFamily: 'var(--font-fraunces), serif', fontWeight: 700,
  fontSize: '26px', color: 'var(--deep-mind)', lineHeight: 1.25, marginBottom: '10px',
}

const BODY = { color: 'var(--cortex)', fontSize: '15px', lineHeight: 1.65, marginBottom: '22px' }

// This page never mutates — the opt-out happens on POST to /api/unsubscribe, so
// that link scanners and prefetchers cannot unsubscribe anyone by following a link.
export default async function UnsubscribePage({ searchParams }) {
  const params = await searchParams
  const token = params?.token ?? ''
  const status = params?.status

  if (status) {
    const copy = {
      unsubscribed: {
        title: 'Unsubscribed',
        body: 'No more emails from us. Your progress and your review queue are untouched.',
      },
      resubscribed: {
        title: 'You are back on the list',
        body: 'You will get the rest of the sequence as normal.',
      },
      invalid: {
        title: 'Link not recognised',
        body: 'This unsubscribe link is invalid or has already been replaced.',
      },
      error: {
        title: 'Something went wrong',
        body: 'We could not update your preferences just now. Please try again in a moment.',
      },
    }[status] ?? { title: 'Unknown', body: 'Something unexpected happened.' }

    return (
      <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '76px' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={CARD}>
            <h1 style={H1}>{copy.title}</h1>
            <p style={BODY}>{copy.body}</p>

            <Link href="/study" className="btn-primary" style={{ textDecoration: 'none' }}>
              Back to studying
            </Link>

            {status === 'unsubscribed' && (
              <form action="/api/unsubscribe" method="POST" style={{ marginTop: '20px' }}>
                <input type="hidden" name="token" value={token} />
                <input type="hidden" name="resubscribe" value="true" />
                <p style={{ fontSize: '13px', color: 'var(--sand)' }}>
                  Changed your mind?{' '}
                  <button type="submit" style={{
                    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                    font: 'inherit', color: 'var(--synapse)', textDecoration: 'underline',
                  }}>
                    Resubscribe
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '76px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={CARD}>
          <h1 style={H1}>Stop these emails?</h1>
          <p style={BODY}>
            You will stop receiving the learning emails. Your account, your saved words and your
            review queue all stay exactly as they are.
          </p>

          <form action="/api/unsubscribe" method="POST">
            <input type="hidden" name="token" value={token} />
            <button type="submit" className="btn-primary" style={{ cursor: 'pointer', border: 'none' }}>
              Unsubscribe
            </button>
          </form>

          <p style={{ fontSize: '13px', color: 'var(--sand)', marginTop: '20px' }}>
            <Link href="/study" style={{ color: 'var(--synapse)' }}>Never mind, take me back</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
