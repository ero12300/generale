import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, stripeConfigured } from "@/lib/stripe";

/**
 * Webhook Stripe: fonte di verità per lo stato abbonamento.
 * Configura l'endpoint su https://dashboard.stripe.com/webhooks con gli
 * eventi checkout.session.completed e customer.subscription.*.
 *
 * In produzione qui si aggiorna lo stato del piano su Firestore
 * (shops/{shopId}/state/settings) tramite firebase-admin; il flusso
 * client-side gestisce comunque il redirect di successo dal Checkout.
 */
export async function POST(request: Request) {
  if (!stripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook Stripe non configurato" },
      { status: 501 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Firma mancante" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await request.text();
    event = getStripe().webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Firma non valida" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.info(
        `[stripe] abbonamento attivato: piano=${session.metadata?.plan} customer=${session.customer}`,
      );
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      console.info(
        `[stripe] abbonamento cancellato: customer=${subscription.customer}`,
      );
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
