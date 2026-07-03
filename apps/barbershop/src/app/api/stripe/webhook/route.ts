import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

/**
 * Webhook Stripe: aggiorna lo stato abbonamento in Firestore quando l'evento
 * di pagamento va a buon fine. In produzione collega qui la scrittura su
 * getAdminDb(). Senza chiavi Stripe la route risponde 200 senza fare nulla.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ received: true, mode: "demo" });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ received: true, mode: "demo" });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Firma mancante" }, { status: 400 });
  }

  const payload = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("Firma webhook non valida", err);
    return NextResponse.json({ error: "Firma non valida" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated":
      // TODO produzione: aggiornare subscription.plan = "pro" su Firestore
      // usando getAdminDb() e l'organizationId salvato nei metadata Stripe.
      break;
    case "customer.subscription.deleted":
      // TODO produzione: riportare subscription.plan = "base".
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
