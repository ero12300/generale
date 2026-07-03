import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStore } from "@/lib/store";
import { constructWebhookEvent } from "@/lib/stripe";
import type { PlanId } from "@/lib/types";

/**
 * Webhook Stripe: mantiene sincronizzato il piano del salone con
 * lo stato reale dell'abbonamento.
 *
 * Eventi gestiti:
 * - checkout.session.completed → attiva il piano acquistato
 * - customer.subscription.deleted → torna al piano Base
 */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Firma mancante" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await request.text();
    event = constructWebhookEvent(payload, signature);
  } catch {
    return NextResponse.json({ error: "Firma non valida" }, { status: 400 });
  }

  const store = await getStore();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const plan = (session.metadata?.plan ?? "pro") as PlanId;
    await store.setPlan(plan, {
      customerId:
        typeof session.customer === "string" ? session.customer : undefined,
      subscriptionId:
        typeof session.subscription === "string"
          ? session.subscription
          : undefined,
    });
  }

  if (event.type === "customer.subscription.deleted") {
    await store.setPlan("base");
  }

  return NextResponse.json({ received: true });
}
