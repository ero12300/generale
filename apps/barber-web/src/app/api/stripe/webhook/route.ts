import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { ok: false, message: "Webhook Stripe non configurato" },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ ok: false, message: "Firma Stripe mancante" }, { status: 400 });
  }

  const payload = await request.text();
  const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

  return NextResponse.json({
    ok: true,
    received: event.type,
    note: "Collega qui l'aggiornamento del piano su Firestore dopo il primo deploy.",
  });
}
