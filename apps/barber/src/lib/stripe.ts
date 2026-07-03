import Stripe from "stripe";
import type { PlanId } from "./types";

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_PRICE_BASE &&
      process.env.STRIPE_PRICE_PRO,
  );
}

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }
  return stripeInstance;
}

export function priceIdForPlan(plan: PlanId): string {
  return plan === "pro"
    ? (process.env.STRIPE_PRICE_PRO as string)
    : (process.env.STRIPE_PRICE_BASE as string);
}

/**
 * Crea una sessione Stripe Checkout per l'abbonamento SaaS (Base o Pro).
 * Restituisce l'URL a cui reindirizzare il barbiere.
 */
export async function createSubscriptionCheckout(
  plan: PlanId,
  appUrl: string,
): Promise<string | null> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceIdForPlan(plan), quantity: 1 }],
    success_url: `${appUrl}/admin/abbonamento?esito=successo&piano=${plan}`,
    cancel_url: `${appUrl}/admin/abbonamento?esito=annullato`,
    metadata: { plan },
    subscription_data: { metadata: { plan } },
  });
  return session.url;
}
