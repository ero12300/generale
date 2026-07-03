import { NextResponse } from "next/server";
import Stripe from "stripe";

// Webhook Stripe: riceve gli eventi di abbonamento.
// In produzione qui va aggiornato il piano del negozio su Firestore
// (tramite Firebase Admin SDK) in base a checkout.session.completed
// e customer.subscription.deleted.
export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe non configurato" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Firma mancante" }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Firma non valida" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      console.log("Abbonamento Pro attivato:", event.data.object.id);
      break;
    case "customer.subscription.deleted":
      console.log("Abbonamento Pro disdetto:", event.data.object.id);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
