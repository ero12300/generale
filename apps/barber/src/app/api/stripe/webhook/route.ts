import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe/config";
import type Stripe from "stripe";

// Webhook Stripe: aggiorna lo stato abbonamento quando arrivano eventi di billing.
// In produzione qui va scritto lo stato su Firestore (subscription del negozio).
export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ received: true, demo: true });
  }

  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhook non configurato" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature ?? "", secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Firma non valida";
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated":
      // TODO(prod): persistere plan=pro + stato su Firestore usando metadata/customer id
      break;
    case "customer.subscription.deleted":
      // TODO(prod): riportare il negozio al piano free
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
