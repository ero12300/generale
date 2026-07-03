# BarberOS Atelier

Web app premium per barber shop: landing, prenotazioni integrate, CRM clienti, incassi,
campagne sconto/referral e monetizzazione SaaS con Stripe.

## Stack

- Next.js 15 su Vercel
- Firebase Firestore per booking, clienti, pagamenti e campagne
- Stripe Checkout per abbonamenti Basic e Pro
- Tailwind CSS per UI premium dark/gold

## Avvio locale

```bash
pnpm install
pnpm dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Firebase

Configura le variabili `NEXT_PUBLIC_FIREBASE_*` in `.env` o su Vercel. Se mancano,
il form prenotazione usa una demo locale in `localStorage`.

Collection previste:

- `barber_bookings`
- `barber_customers`
- `barber_payments`
- `barber_campaigns`

## Stripe

1. Crea due prodotti ricorrenti in Stripe: Basic e Pro.
2. Copia i Price ID in `STRIPE_PRICE_BASIC` e `STRIPE_PRICE_PRO`.
3. Aggiungi `STRIPE_SECRET_KEY` solo come variabile server-side su Vercel.
4. I bottoni pricing chiamano `POST /api/billing/checkout`.

## Deploy Vercel

Usa `apps/web` come root directory e imposta le variabili indicate in `.env.example`.
