import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const WORKBOOK = {
  name: 'The Top 1,500 Spanish Words — Printable Workbook',
  amount: 500,
  currency: 'eur',
  file: 'workbook/out/top-1500-spanish-words-workbook.pdf',
  downloadName: 'top-1500-spanish-words-workbook.pdf',
}

export async function getPaidSession(sessionId) {
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return null
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return session.payment_status === 'paid' && session.metadata?.product === 'workbook-1500' ? session : null
  } catch {
    return null
  }
}
