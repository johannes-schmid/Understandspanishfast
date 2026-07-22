import { Resend } from 'resend'
import { SITE } from './layout'

const FROM = process.env.EMAIL_FROM || 'Comprendo <hola@mostcommonspanish.com>'

let client = null
function resend() {
  if (!client) {
    if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set')
    client = new Resend(process.env.RESEND_API_KEY)
  }
  return client
}

// Shown in the footer of every email — lands on a confirm page, never mutates.
export function unsubscribeUrl(token) {
  return `${SITE}/unsubscribe?token=${token}`
}

// RFC 8058 one-click target for the List-Unsubscribe header. POST only.
export function oneClickUnsubscribeUrl(token) {
  return `${SITE}/api/unsubscribe?token=${token}`
}

// One send per call. Deliberately not using /emails/batch: it drops per-message
// idempotency keys, and volume here is far too low to need it.
export async function sendEmail({ to, subject, html, userId, emailKey, unsubToken }) {
  const oneClick = oneClickUnsubscribeUrl(unsubToken)

  const { data, error } = await resend().emails.send({
    from: FROM,
    to: [to],
    subject,
    html,
    headers: {
      // Second line of defence behind the email_sends primary key. Resend holds
      // these for 24h, which covers any same-day cron retry.
      'Idempotency-Key': `${userId}:${emailKey}`,
      // Required for bulk senders; also keeps complaints off the spam button.
      'List-Unsubscribe': `<${oneClick}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
    tags: [{ name: 'campaign', value: emailKey }],
  })

  if (error) throw new Error(`Resend: ${error.message || JSON.stringify(error)}`)
  return data
}
