import { test } from 'node:test'
import assert from 'node:assert/strict'

process.env.STRIPE_SECRET_KEY ||= 'sk_test_dummy'
const { getPaidSession, deckFor, resolveDeckDownload, PRODUCTS } = await import('../lib/stripe.js')

const ID = 'cs_test_abc123'
const fakeRetrieve = (session) => async (id) => {
  if (id !== ID) throw new Error('No such checkout session')
  return session
}
const paid = (product) => fakeRetrieve({ id: ID, payment_status: 'paid', metadata: { product } })
const unpaid = (product) => fakeRetrieve({ id: ID, payment_status: 'unpaid', metadata: { product } })

test('readers-500 is a €9 product with the readers entitlement', () => {
  assert.equal(PRODUCTS['readers-500'].amount, 900)
  assert.deepEqual(PRODUCTS['readers-500'].includes, ['readers'])
})

test('existing products are unchanged', () => {
  assert.deepEqual(PRODUCTS['anki-1500'].includes, ['anki'])
  assert.equal(PRODUCTS['bundle-1500'].amount, 1200)
  assert.deepEqual(PRODUCTS['bundle-1500'].includes, ['workbook', 'anki'])
})

test('getPaidSession grants readers to a paid readers session', async () => {
  const s = await getPaidSession(ID, 'readers', paid('readers-500'))
  assert.equal(s?.id, ID)
})

test('getPaidSession refuses readers to an anki-only session', async () => {
  assert.equal(await getPaidSession(ID, 'readers', paid('anki-1500')), null)
})

test('getPaidSession refuses readers to the bundle', async () => {
  assert.equal(await getPaidSession(ID, 'readers', paid('bundle-1500')), null)
})

test('getPaidSession rejects an unpaid session', async () => {
  assert.equal(await getPaidSession(ID, 'readers', unpaid('readers-500')), null)
})

test('getPaidSession rejects a malformed session id without calling Stripe', async () => {
  let called = false
  const r = await getPaidSession('nope', 'readers', async () => { called = true })
  assert.equal(r, null)
  assert.equal(called, false)
})

test('deckFor maps decks to private blob pathnames', () => {
  assert.equal(deckFor('readers').pathname, 'paid/spanish-short-stories-level-1.zip')
  assert.equal(deckFor('readers').entitlement, 'readers')
  assert.equal(deckFor('anki').pathname, 'paid/top-1500-spanish-words.apkg')
  assert.equal(deckFor(null).pathname, 'paid/top-1500-spanish-words.apkg')
})

test('deckFor rejects unknown decks', () => {
  assert.equal(deckFor('workbook'), null)
  assert.equal(deckFor('../secret'), null)
  assert.equal(deckFor('toString'), null)
})

test('resolveDeckDownload: paid readers session gets the reader pack', async () => {
  const r = await resolveDeckDownload(ID, 'readers', paid('readers-500'))
  assert.equal(r.status, 200)
  assert.equal(r.pathname, 'paid/spanish-short-stories-level-1.zip')
})

test('resolveDeckDownload: anki-only session cannot get the reader pack', async () => {
  const r = await resolveDeckDownload(ID, 'readers', paid('anki-1500'))
  assert.equal(r.status, 403)
  assert.equal(r.pathname, undefined)
})

test('resolveDeckDownload: anki session still gets the word deck by default', async () => {
  const r = await resolveDeckDownload(ID, null, paid('anki-1500'))
  assert.equal(r.status, 200)
  assert.equal(r.pathname, 'paid/top-1500-spanish-words.apkg')
})

test('resolveDeckDownload: readers-only session cannot get the word deck', async () => {
  const r = await resolveDeckDownload(ID, 'anki', paid('readers-500'))
  assert.equal(r.status, 403)
})

test('resolveDeckDownload: unpaid session rejected', async () => {
  const r = await resolveDeckDownload(ID, 'readers', unpaid('readers-500'))
  assert.equal(r.status, 403)
})

test('resolveDeckDownload: unknown deck rejected before Stripe is called', async () => {
  let called = false
  const r = await resolveDeckDownload(ID, 'premium', async () => { called = true })
  assert.equal(r.status, 404)
  assert.equal(called, false)
})

test('readers-1500 is a €9 product with the readers2 entitlement', () => {
  assert.equal(PRODUCTS['readers-1500'].amount, 900)
  assert.deepEqual(PRODUCTS['readers-1500'].includes, ['readers2'])
  assert.equal(PRODUCTS['readers-1500'].page, '/spanish-short-stories-intermediate')
})

test('deckFor(readers2) is the level 2 pack', () => {
  assert.equal(deckFor('readers2').pathname, 'paid/spanish-short-stories-level-2.zip')
  assert.equal(deckFor('readers2').entitlement, 'readers2')
})

test('resolveDeckDownload: level 2 buyer gets level 2, not level 1', async () => {
  const ok = await resolveDeckDownload(ID, 'readers2', paid('readers-1500'))
  assert.equal(ok.status, 200)
  assert.equal(ok.pathname, 'paid/spanish-short-stories-level-2.zip')
  assert.equal((await resolveDeckDownload(ID, 'readers', paid('readers-1500'))).status, 403)
})

test('resolveDeckDownload: level 1 buyer cannot get level 2', async () => {
  assert.equal((await resolveDeckDownload(ID, 'readers2', paid('readers-500'))).status, 403)
})
