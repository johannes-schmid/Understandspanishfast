import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const PDF_PATH = '/1000-most-common-spanish-words.pdf'
const SITE = 'https://mostcommonspanish.com'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req) {
  let email, source
  try {
    ({ email, source } = await req.json())
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  email = (email || '').trim().toLowerCase()
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })
  }

  // Capture the lead. Never block the download on a storage error.
  try {
    const supabase = createAdminClient()
    await supabase
      .from('pdf_leads')
      .upsert(
        { email, source: (source || 'unknown').slice(0, 120), created_at: new Date().toISOString() },
        { onConflict: 'email' }
      )
  } catch (err) {
    console.error('lead-magnet: capture failed', err?.message || err)
  }

  // Add to the mailing list + email the PDF if Resend is configured. Optional —
  // the response already returns the URL so the download works regardless.
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Add the downloader to the Resend audience (mailing list) so they can be
    // nurtured toward creating an account. audienceId is optional in Resend v6
    // (contacts are managed globally); pass it when configured.
    try {
      await resend.contacts.create({
        email,
        unsubscribed: false,
        ...(process.env.RESEND_AUDIENCE_ID ? { audienceId: process.env.RESEND_AUDIENCE_ID } : {}),
      })
    } catch (err) {
      console.error('lead-magnet: audience add failed', err?.message || err)
    }

    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'Most Common Spanish <hola@mostcommonspanish.com>',
        to: [email],
        subject: 'Your free Spanish word list (1,000 most common words)',
        html: `
          <div style="font-family:Helvetica,Arial,sans-serif;color:#1C1A3A;line-height:1.6;max-width:520px">
            <h2 style="font-family:Georgia,serif">Here's your word list.</h2>
            <p>The 1,000 most common Spanish words, ranked by real-world frequency — the fastest order to learn them in.</p>
            <p><a href="${SITE}${PDF_PATH}" style="display:inline-block;background:#534AB7;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold">Download the PDF</a></p>
            <p style="font-size:13px;color:#7d78a6">Tip: learn them top to bottom. The first 100 already cover ~50% of everyday Spanish.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:22px 0" />
            <p><strong>Want to actually remember them?</strong> A free account turns this list into spaced-repetition practice, tracks your comprehension %, and picks up where you left off — no card required.</p>
            <p><a href="${SITE}/get-started" style="display:inline-block;background:#1C1A3A;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold">Create your free account</a></p>
            <p style="font-size:13px;color:#7d78a6"><a href="${SITE}/words">See all our frequency lists →</a></p>
          </div>`,
        tags: [{ name: 'campaign', value: 'lead-magnet-pdf' }],
      })
    } catch (err) {
      console.error('lead-magnet: email failed', err?.message || err)
    }
  }

  return NextResponse.json({ ok: true, url: PDF_PATH })
}
