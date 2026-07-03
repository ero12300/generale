export const SUBSCRIPTION_PLANS = {
  starter: {
    id: "starter",
    name: "Starter",
    price: 0,
    priceLabel: "Gratis",
    period: "per sempre",
    description: "Perfetto per iniziare con il tuo salone",
    stripePriceId: null as string | null,
    features: [
      "Prenotazioni online",
      "Fino a 50 clienti",
      "Gestione incassi base",
      "Pagina prenotazione pubblica",
      "1 barbiere",
    ],
    highlighted: false,
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 29,
    priceLabel: "€29",
    period: "/mese",
    description: "Il gestionale completo per far crescere il salone",
    stripePriceId: process.env.STRIPE_PRICE_PRO ?? null,
    features: [
      "Clienti illimitati",
      "Campagne sconti",
      "Programma Porta un Amico",
      "Analytics avanzate",
      "Export incassi",
      "Supporto prioritario",
    ],
    highlighted: true,
  },
  elite: {
    id: "elite",
    name: "Elite",
    price: 59,
    priceLabel: "€59",
    period: "/mese",
    description: "Per saloni multi-sede e team in crescita",
    stripePriceId: process.env.STRIPE_PRICE_ELITE ?? null,
    features: [
      "Tutto di Pro",
      "Multi-barbiere / multi-sede",
      "API integrazioni",
      "White-label booking",
      "Account manager dedicato",
      "SLA garantito",
    ],
    highlighted: false,
  },
} as const;

export type SubscriptionPlanId = keyof typeof SUBSCRIPTION_PLANS;

export function getStripe(): import("stripe").default | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Stripe = require("stripe").default;
  return new Stripe(key, { apiVersion: "2025-04-30.basil" });
}
