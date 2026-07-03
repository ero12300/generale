import Stripe from "stripe";

// Utility server-side per Stripe. Se le chiavi non sono configurate,
// l'app resta in "modalità demo" e simula l'attivazione del piano Pro.

export const stripeSecret = process.env.STRIPE_SECRET_KEY;
export const stripePricePro = process.env.STRIPE_PRICE_PRO;
export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const stripeEnabled = Boolean(stripeSecret && stripePricePro);

let client: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!stripeSecret) return null;
  if (!client) client = new Stripe(stripeSecret);
  return client;
}

export function siteUrl(reqUrl: string): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  try {
    return new URL(reqUrl).origin;
  } catch {
    return "http://localhost:3000";
  }
}
