/**
 * Integrazione Stripe per la monetizzazione (abbonamento Pro).
 * Se STRIPE_SECRET_KEY non è configurata, il checkout gira in modalità simulata
 * (l'upgrade viene applicato localmente senza pagamento reale).
 */
import Stripe from "stripe";

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

let stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!isStripeConfigured()) return null;
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return stripe;
}
