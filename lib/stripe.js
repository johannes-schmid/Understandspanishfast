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

export const READER_PACK = {
  pathname: 'paid/spanish-short-stories-level-1.zip',
  size: '50 MB',
}

export const READER_PACK_2 = {
  pathname: 'paid/spanish-short-stories-level-2.zip',
  size: '71 MB',
}

export const PAID_DECKS = {
  anki: { ...ANKI_DECK, entitlement: 'anki' },
  readers: { ...READER_PACK, entitlement: 'readers' },
  readers2: { ...READER_PACK_2, entitlement: 'readers2' },
}

export function deckFor(key) {
  const k = key ?? 'anki'
  return Object.hasOwn(PAID_DECKS, k) ? PAID_DECKS[k] : null
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
    page: '/bundle',
  },
  'readers-500': {
    name: 'Spanish Short Stories, Level 1 — 10 Graded Readers (Top 500 Words)',
    description: '10 short stories written only with the 500 most common Spanish words: PDF book with questions and answer key, plus a native-speaker MP3 for every story.',
    amount: 900,
    includes: ['readers'],
    page: '/spanish-short-stories-for-beginners',
  },
  'readers-1500': {
    name: 'Spanish Short Stories, Level 2 — 10 Graded Readers (Top 1,500 Words)',
    description: '10 longer short stories written with the 1,500 most common Spanish words: PDF book with questions and answer key, plus a native-speaker MP3 for every story.',
    amount: 900,
    includes: ['readers2'],
    page: '/spanish-short-stories-intermediate',
  },
}

const retrieveSession = (id) => stripe.checkout.sessions.retrieve(id)

export async function getPaidSession(sessionId, entitlement = 'workbook', retrieve = retrieveSession) {
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return null
  try {
    const session = await retrieve(sessionId)
    const product = PRODUCTS[session.metadata?.product]
    if (session.payment_status !== 'paid' || !product) return null
    if (entitlement && !product.includes.includes(entitlement)) return null
    return session
  } catch {
    return null
  }
}

export async function resolveDeckDownload(sessionId, deckKey, retrieve = retrieveSession) {
  const deck = deckFor(deckKey)
  if (!deck) return { status: 404 }
  const session = await getPaidSession(sessionId, deck.entitlement, retrieve)
  if (!session) return { status: 403 }
  return { status: 200, pathname: deck.pathname, session }
}
