import "server-only";
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function stripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (_stripe) return _stripe;
  _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // Nessun apiVersion pinning → usa la default della SDK
  } as Stripe.StripeConfig);
  return _stripe;
}

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function priceIdForPlan(plan: "pro" | "business"): string | undefined {
  if (plan === "pro") return process.env.STRIPE_PRICE_PRO_MONTHLY;
  if (plan === "business") return process.env.STRIPE_PRICE_BUSINESS_MONTHLY;
  return undefined;
}
