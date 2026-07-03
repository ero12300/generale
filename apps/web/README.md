# Royal Fade OS

Web app premium per barber shop: landing pubblica, booking cliente, dashboard interna,
CRM, incassi, campagne referral/sconti e piani SaaS monetizzabili con Stripe.

## Getting Started

Run the development server from the repository root:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Vercel environment

The app works in demo mode without secrets. Add these variables on Vercel to enable production integrations:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

STRIPE_SECRET_KEY=
STRIPE_PRICE_BASIC=
STRIPE_PRICE_PRO=
STRIPE_PRICE_ELITE=
```

## Production notes

- Firebase: use Auth for staff login, Firestore for customers, appointments and campaigns.
- Stripe: `/api/billing/checkout` creates subscription checkout sessions when price IDs are configured.
- Money values in the demo model are stored in integer cents.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```
