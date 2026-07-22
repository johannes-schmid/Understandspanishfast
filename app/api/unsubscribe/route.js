import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function setOptOut(token, optOut) {
  if (!token || !UUID.test(token)) return 'invalid'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data, error } = await supabase
    .from('profiles')
    .update({ email_opt_out: optOut })
    .eq('unsubscribe_token', token)
    .select('id')

  if (error) return 'error'
  return data?.length ? 'ok' : 'invalid'
}

// Handles both the RFC 8058 one-click POST from mail clients and the confirm
// form on /unsubscribe. Mutation lives on POST only, so an email link scanner
// following the GET link cannot unsubscribe someone by accident.
export async function POST(request) {
  const url = new URL(request.url)
  let token = url.searchParams.get('token')
  let resubscribe = url.searchParams.get('resubscribe') === 'true'

  const contentType = request.headers.get('content-type') || ''
  if (contentType.includes('form')) {
    const form = await request.formData()
    token = form.get('token') || token
    resubscribe = form.get('resubscribe') === 'true' || resubscribe
  }

  const status = await setOptOut(token, !resubscribe)

  // A browser form post gets a redirect back to the page; a mail client's
  // one-click POST just needs a 200.
  if (contentType.includes('form')) {
    const done = resubscribe ? 'resubscribed' : 'unsubscribed'
    return NextResponse.redirect(
      new URL(`/unsubscribe?token=${token}&status=${status === 'ok' ? done : status}`, url.origin),
      { status: 303 }
    )
  }

  if (status === 'invalid') return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  if (status === 'error') return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
