import Stripe from "stripe";
import { PLANS } from "./plans";
import type { PlanId } from "./types";

/**
 * Integrazione Stripe per gli abbonamenti Base/Pro.
 * Con STRIPE_SECRET_KEY configurata crea vere Checkout Session;
 * senza chiave l'app resta in modalità demo (upgrade simulato).
 */

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY non configurata");
  return new Stripe(key);
}

/** Price ID Stripe per piano, da env (creati nel dashboard Stripe). */
function priceIdFor(plan: PlanId): string | undefined {
  if (plan === "base") return process.env.STRIPE_PRICE_BASE;
  if (plan === "pro") return process.env.STRIPE_PRICE_PRO;
  return undefined;
}

export async function createCheckoutSession(params: {
  plan: PlanId;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}): Promise<{ url: string }> {
  const stripe = getStripe();
  const priceId = priceIdFor(params.plan);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: priceId
      ? [{ price: priceId, quantity: 1 }]
      : [
          {
            price_data: {
              currency: "eur",
              recurring: { interval: "month" },
              unit_amount: PLANS[params.plan].priceMonthlyCents,
              product_data: {
                name: `BarberFlow ${PLANS[params.plan].name}`,
                description: PLANS[params.plan].tagline,
              },
            },
            quantity: 1,
          },
        ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
    metadata: { plan: params.plan },
    subscription_data: { metadata: { plan: params.plan } },
  });

  if (!session.url) throw new Error("Stripe non ha restituito un URL di checkout");
  return { url: session.url };
}

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET non configurata");
  return getStripe().webhooks.constructEvent(payload, signature, secret);
}
