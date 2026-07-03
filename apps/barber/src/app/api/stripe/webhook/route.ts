import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook Stripe per aggiornare lo stato abbonamento del barbershop.
 * In produzione si scriverebbe su Firestore/Firebase Admin.
 *
 * Setup:
 *   1. In Stripe Dashboard -> Developers -> Webhooks
 *   2. Aggiungi endpoint: https://TUODOMAIN/api/stripe/webhook
 *   3. Eventi: customer.subscription.*, checkout.session.completed
 *   4. Copia il "Signing secret" in STRIPE_WEBHOOK_SECRET
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json(
      { ok: false, reason: "stripe not configured" },
      { status: 501 }
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    return NextResponse.json(
      { error: `signature verification failed: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const plan = session.metadata?.plan;
      const customerId = session.customer as string | null;
      const subscriptionId = session.subscription as string | null;
      // TODO: persistere su Firestore -> shops/{shopId} { plan, stripeCustomerId, stripeSubscriptionId }
      console.info("[stripe] checkout.completed", { plan, customerId, subscriptionId });
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      // TODO: downgradare il negozio a free
      console.info("[stripe] subscription.deleted", sub.id);
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;
      const plan = sub.metadata?.plan;
      console.info("[stripe] subscription.updated", sub.id, "plan:", plan);
      // TODO: aggiornare piano
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
