import Stripe from "stripe";

let cached: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    cached = null;
    return null;
  }
  cached = new Stripe(key, {
    // Stripe SDK gestisce la versione; lasciamo l'account default.
    typescript: true,
  });
  return cached;
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** Ritorna l'ID Price di Stripe per un dato piano. */
export function getPriceIdForPlan(
  tier: "pro" | "business"
): string | undefined {
  if (tier === "pro") return process.env.STRIPE_PRICE_PRO_MONTHLY;
  return process.env.STRIPE_PRICE_BUSINESS_MONTHLY;
}
