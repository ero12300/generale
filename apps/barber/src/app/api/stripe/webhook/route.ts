import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getStripe } from '@/lib/stripe'
import { adminDb } from '@/lib/firebase/admin'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const shopId = session.metadata?.shopId
        if (shopId && session.subscription) {
          await adminDb.doc(`barbershops/${shopId}`).update({
            'subscription.tier': 'pro',
            'subscription.stripeCustomerId': session.customer,
            'subscription.stripeSubscriptionId': session.subscription,
          })
        }
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const snap = await adminDb
          .collection('barbershops')
          .where('subscription.stripeSubscriptionId', '==', sub.id)
          .limit(1)
          .get()
        if (!snap.empty) {
          await snap.docs[0].ref.update({ 'subscription.tier': 'free' })
        }
        break
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const snap = await adminDb
          .collection('barbershops')
          .where('subscription.stripeSubscriptionId', '==', sub.id)
          .limit(1)
          .get()
        if (!snap.empty) {
          const tier = sub.status === 'active' ? 'pro' : 'free'
          await snap.docs[0].ref.update({
            'subscription.tier': tier,
            'subscription.currentPeriodEnd': new Date(sub.current_period_end * 1000).toISOString(),
            'subscription.cancelAtPeriodEnd': sub.cancel_at_period_end,
          })
        }
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
