import fs from 'node:fs/promises'
import path from 'node:path'
import { getPaidSession, WORKBOOK } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const sessionId = new URL(request.url).searchParams.get('session_id')
  const session = await getPaidSession(sessionId)
  if (!session) return new Response('Payment not found. Use the link from your purchase confirmation.', { status: 403 })
  const pdf = await fs.readFile(path.join(process.cwd(), WORKBOOK.file))
  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${WORKBOOK.downloadName}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
