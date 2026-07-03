import Stripe from "stripe";
import type { PlanId } from "./types";

const priceEnvByPlan: Record<PlanId, string> = {
  basic: "NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID",
  pro: "NEXT_PUBLIC_STRIPE_PRO_PRICE_ID",
};

export function getStripePriceId(plan: PlanId) {
  return process.env[priceEnvByPlan[plan]];
}

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  return new Stripe(secretKey);
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
