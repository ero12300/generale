import { NextResponse } from "next/server";
import { getStripe, stripeWebhookSecret } from "@/lib/stripe";

// Webhook Stripe: riceve gli eventi di pagamento/abbonamento.
// In produzione qui si aggiorna il piano dell'utente su Firestore
// (checkout.session.completed → plan "pro", subscription.deleted → "free").

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe || !stripeWebhookSecret) {
    return NextResponse.json({ received: true, demo: true });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Firma mancante" }, { status: 400 });
  }

  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: `Firma non valida: ${err instanceof Error ? err.message : "errore"}` },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed":
      // TODO: aggiornare il piano dell'utente a "pro" e salvare customerId.
      break;
    case "customer.subscription.deleted":
      // TODO: riportare il piano dell'utente a "free".
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
