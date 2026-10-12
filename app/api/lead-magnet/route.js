import { NextResponse } from 'next/server'

const PDF_PATH = '/1000-most-common-spanish-words.pdf'
const SITE = 'https://mostcommonspanish.com'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const BUTTON = 'display:inline-block;background:#534AB7;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold'
const BUTTON_DARK = 'display:inline-block;background:#1C1A3A;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold'

function emailFor(source) {
  if (source === 'deck-unlock') {
    return {
      subject: 'Your 1,500-word Spanish deck is unlocked',
      html: `
        <h2 style="font-family:Georgia,serif">All 1,500 words are yours.</h2>
        <p>You cleared the first 100 words — the ones that cover about half of everyday Spanish. The next 1,400 take you to roughly 80%.</p>
        <p><a href="${SITE}/study" style="${BUTTON}">Keep studying</a></p>
        <p style="font-size:13px;color:#7d78a6">15 minutes a day is enough. Your progress is saved in the browser you study in.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:22px 0" />
        <p>Prefer paper? <a href="${SITE}${PDF_PATH}">Download the 1,000-word PDF</a>.</p>`,
    }
  }
  return {
    subject: 'Your free Spanish word list (1,000 most common words)',
    html: `
      <h2 style="font-family:Georgia,serif">Here's your word list.</h2>
      <p>The 1,000 most common Spanish words, ranked by real-world frequency — the fastest order to learn them in.</p>
      <p><a href="${SITE}${PDF_PATH}" style="${BUTTON}">Download the PDF</a></p>
      <p style="font-size:13px;color:#7d78a6">Tip: learn them top to bottom. The first 100 already cover ~50% of everyday Spanish.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:22px 0" />
      <p><strong>Want to actually remember them?</strong> Study the same words as spaced-repetition flashcards, with native audio. No account needed.</p>
      <p><a href="${SITE}/study" style="${BUTTON_DARK}">Start the flashcards</a></p>
      <p style="font-size:13px;color:#7d78a6"><a href="${SITE}/words">See all our frequency lists →</a></p>`,
  }
}

export async function POST(req) {
  let email, source
  try {
    ({ email, source } = await req.json())
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  email = (email || '').trim().toLowerCase()
  source = (source || 'unknown').slice(0, 120)
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('lead-magnet: RESEND_API_KEY missing, lead not stored', { source })
    return NextResponse.json({ ok: true, url: PDF_PATH })
  }

  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { error } = await resend.contacts.create({
      email,
      unsubscribed: false,
      ...(process.env.RESEND_SEGMENT_ID ? { segments: [{ id: process.env.RESEND_SEGMENT_ID }] } : {}),
    })
    if (error) console.error('lead-magnet: contact add failed', error.message)
  } catch (err) {
    console.error('lead-magnet: contact add failed', err?.message || err)
  }

  try {
    const { subject, html } = emailFor(source)
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Most Common Spanish <hola@mostcommonspanish.com>',
      to: [email],
      subject,
      html: `<div style="font-family:Helvetica,Arial,sans-serif;color:#1C1A3A;line-height:1.6;max-width:520px">${html}</div>`,
      tags: [{ name: 'campaign', value: source.replace(/[^a-zA-Z0-9_-]/g, '-') }],
    })
    if (error) console.error('lead-magnet: email failed', error.message)
  } catch (err) {
    console.error('lead-magnet: email failed', err?.message || err)
  }

  return NextResponse.json({ ok: true, url: PDF_PATH })
}
