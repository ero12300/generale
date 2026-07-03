import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStore } from "@/lib/store";
import { getStripe } from "@/lib/stripe";
import { jsonError } from "@/lib/api-helpers";
import type { PlanId } from "@/lib/types";

/**
 * Webhook Stripe: mantiene sincronizzato il piano del negozio
 * con lo stato reale dell'abbonamento.
 * Configura su Stripe: checkout.session.completed,
 * customer.subscription.updated, customer.subscription.deleted.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return jsonError("Webhook non configurato", 501);

  const signature = request.headers.get("stripe-signature");
  if (!signature) return jsonError("Firma mancante", 400);

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = await getStripe().webhooks.constructEventAsync(
      body,
      signature,
      secret,
    );
  } catch {
    return jsonError("Firma non valida", 400);
  }

  const store = await getStore();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const plan = (session.metadata?.plan ?? "base") as PlanId;
      await store.updateSettings({
        plan,
        stripeCustomerId:
          typeof session.customer === "string" ? session.customer : undefined,
        stripeSubscriptionId:
          typeof session.subscription === "string"
            ? session.subscription
            : undefined,
      });
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const plan = (subscription.metadata?.plan ?? "base") as PlanId;
      if (subscription.status === "active" || subscription.status === "trialing") {
        await store.updateSettings({ plan });
      }
      break;
    }
    case "customer.subscription.deleted": {
      // Abbonamento cancellato: si torna al piano Base
      await store.updateSettings({ plan: "base" });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
