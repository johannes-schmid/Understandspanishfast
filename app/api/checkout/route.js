import { NextResponse } from 'next/server'
import { stripe, PRODUCTS, WORKBOOK } from '@/lib/stripe'

export async function POST(request) {
  const origin = new URL(request.url).origin
  let key = 'workbook-1500'
  try {
    const form = await request.formData()
    const requested = form.get('product')
    if (typeof requested === 'string' && PRODUCTS[requested]) key = requested
  } catch {}
  const product = PRODUCTS[key]

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        quantity: 1,
        price_data: {
          currency: WORKBOOK.currency,
          unit_amount: product.amount,
          product_data: { name: product.name, description: product.description },
        },
      }],
      metadata: { product: key },
      success_url: key === 'workbook-1500'
        ? `${origin}/workbook/thanks?session_id={CHECKOUT_SESSION_ID}`
        : `${origin}/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${product.page}`,
    })
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    console.error('checkout failed', key, err?.message)
    return NextResponse.redirect(`${origin}${product.page}?checkout=error`, 303)
  }
}
