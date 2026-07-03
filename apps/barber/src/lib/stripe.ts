import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('Missing STRIPE_SECRET_KEY')
    _stripe = new Stripe(key, { apiVersion: '2025-02-24.acacia' })
  }
  return _stripe
}

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceYearly: 0,
    limits: {
      bookingsPerMonth: 50,
      clients: 100,
      campaigns: 0,
      analytics: false,
    },
    features: [
      'Fino a 50 prenotazioni/mese',
      'Fino a 100 clienti',
      'Gestione incassi base',
      'Profilo salone pubblico',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 2900,
    priceYearly: 24900,
    limits: {
      bookingsPerMonth: -1,
      clients: -1,
      campaigns: -1,
      analytics: true,
    },
    features: [
      'Prenotazioni illimitate',
      'Clienti illimitati',
      'Campagne sconti e referral',
      'Analytics avanzate',
      'Esportazione dati CSV',
      'Promemoria automatici',
      'Supporto prioritario',
    ],
  },
} as const

export type PlanId = keyof typeof PLANS
