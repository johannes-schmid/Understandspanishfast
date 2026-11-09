import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const WORKBOOK = {
  name: 'The Top 1,500 Spanish Words — Printable Workbook',
  amount: 500,
  currency: 'eur',
  file: 'workbook/out/top-1500-spanish-words-workbook.pdf',
  downloadName: 'top-1500-spanish-words-workbook.pdf',
}

export const ANKI_DECK = {
  pathname: 'paid/top-1500-spanish-words.apkg',
  size: '152 MB',
}

export const PRODUCTS = {
  'workbook-1500': {
    name: WORKBOOK.name,
    description: '119-page printable PDF. 30 units, exercises, review tests and answer key.',
    amount: 500,
    includes: ['workbook'],
    page: '/workbook',
  },
  'anki-1500': {
    name: 'The Top 1,500 Spanish Words — Anki Deck',
    description: '1,500 frequency-ranked notes with native audio, example sentences and pictures (.apkg).',
    amount: 900,
    includes: ['anki'],
    page: '/anki-spanish-deck',
  },
  'bundle-1500': {
    name: 'The Top 1,500 Spanish Words — Workbook + Anki Deck',
    description: 'The printable workbook PDF and the 1,500-word Anki deck.',
    amount: 1200,
    includes: ['workbook', 'anki'],
    page: '/anki-spanish-deck',
  },
}

export async function getPaidSession(sessionId, entitlement = 'workbook') {
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return null
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const product = PRODUCTS[session.metadata?.product]
    if (session.payment_status !== 'paid' || !product) return null
    if (entitlement && !product.includes.includes(entitlement)) return null
    return session
  } catch {
    return null
  }
}
