import Stripe from "stripe";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, {
    apiVersion: "2025-08-27.basil" as unknown as Stripe.LatestApiVersion,
    typescript: true,
  });
}

export const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

export function priceIdForTier(tier: string): string | null {
  if (tier === "pro") return process.env.STRIPE_PRICE_PRO ?? null;
  if (tier === "elite") return process.env.STRIPE_PRICE_ELITE ?? null;
  return null;
}
