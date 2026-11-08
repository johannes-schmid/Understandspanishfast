import { NextResponse } from 'next/server'
import { stripe, WORKBOOK } from '@/lib/stripe'

export async function POST(request) {
  const origin = new URL(request.url).origin
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        quantity: 1,
        price_data: {
          currency: WORKBOOK.currency,
          unit_amount: WORKBOOK.amount,
          product_data: { name: WORKBOOK.name, description: '119-page printable PDF. 30 units, exercises, review tests and answer key.' },
        },
      }],
      metadata: { product: 'workbook-1500' },
      success_url: `${origin}/workbook/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/workbook`,
    })
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    console.error('checkout failed', err?.message)
    return NextResponse.redirect(`${origin}/workbook?checkout=error`, 303)
  }
}
