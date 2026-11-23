import { issueSignedToken, presignUrl } from '@vercel/blob'
import { resolveDeckDownload } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

const LINK_TTL_MS = 15 * 60 * 1000

export async function GET(request) {
  const params = new URL(request.url).searchParams
  const { status, pathname } = await resolveDeckDownload(params.get('session_id'), params.get('deck'))
  if (status === 404) return new Response('Unknown deck.', { status: 404 })
  if (status !== 200) return new Response('Payment not found. Use the link from your purchase confirmation.', { status: 403 })

  try {
    const validUntil = Date.now() + LINK_TTL_MS
    const token = await issueSignedToken({ pathname, operations: ['get'], validUntil })
    const { presignedUrl } = await presignUrl(token, {
      operation: 'get',
      pathname,
      access: 'private',
      validUntil,
    })
    return new Response(null, { status: 303, headers: { Location: presignedUrl, 'Cache-Control': 'private, no-store' } })
  } catch (err) {
    console.error('anki download failed', err?.message)
    return new Response('The download could not start. Please reload the page and try again.', { status: 502 })
  }
}
