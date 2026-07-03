import Stripe from "stripe";
import type { PlanId } from "./types";

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY non configurata");
  return new Stripe(key);
}

/** ID prezzo Stripe (ricorrente mensile) per ciascun piano. */
export function priceIdForPlan(plan: PlanId): string | undefined {
  switch (plan) {
    case "base":
      return process.env.STRIPE_PRICE_BASE;
    case "pro":
      return process.env.STRIPE_PRICE_PRO;
    default: {
      const _exhaustive: never = plan;
      return _exhaustive;
    }
  }
}
