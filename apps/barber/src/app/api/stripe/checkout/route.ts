import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  try {
    const { priceType, shopId } = await req.json()

    const priceId =
      priceType === 'yearly'
        ? process.env.STRIPE_PRICE_PRO_YEARLY
        : process.env.STRIPE_PRICE_PRO_MONTHLY

    if (!priceId) {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: { name: `BarberOS Pro ${priceType === 'yearly' ? 'Annuale' : 'Mensile'}` },
              unit_amount: priceType === 'yearly' ? 24900 : 2900,
              recurring: { interval: priceType === 'yearly' ? 'year' : 'month' },
            },
            quantity: 1,
          },
        ],
        metadata: { shopId: shopId ?? '' },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?tab=billing&success=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?tab=billing`,
      })
      return NextResponse.json({ url: session.url })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { shopId: shopId ?? '' },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?tab=billing&success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?tab=billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Stripe error' }, { status: 500 })
  }
}
