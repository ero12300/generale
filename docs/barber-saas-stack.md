# Barber SaaS Stack — Vercel + Firebase + Stripe

Base moderna per un barber shop premium con possibilità di rivendita in abbonamento.

## Cosa include

- Frontend Next.js 15 deployabile su Vercel
- Firebase pronto per:
  - Authentication
  - Firestore
  - eventuali Cloud Functions / automazioni
- Stripe pronto per:
  - abbonamenti Basic / Pro / Multi-location
  - depositi prenotazioni
  - promo code / sconti

## Moduli prodotto

- **Dashboard premium** — KPI operativi giornalieri
- **Prenotazioni** — widget booking con validazione e stato loading/error/success
- **CRM clienti** — segmenti VIP / loyal / inactive / new
- **Campagne** — referral, sconti, riattivazione
- **Incassi** — lordo, retail, tips, occupazione
- **Growth** — monetizzazione SaaS e pricing
- **Setup** — checklist env per Vercel/Firebase/Stripe

## Env richieste

### Firebase client

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Firebase server

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

### Stripe

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_APP_URL`

## Strategia monetizzazione consigliata

### Basic
- agenda online
- CRM base
- incassi giornalieri

### Pro
- automazioni WhatsApp / SMS
- referral evoluto
- no-show protection con depositi
- dashboard staff / marginalità

### Multi-location
- più sedi
- reporting consolidato
- white-label opzionale

## Note implementative

- Se Stripe non è configurato, l’API checkout torna in modalità preview invece di fallire brutalmente.
- Se Firebase non è configurato, l’app resta navigabile in demo mode.
- I dati demo servono a validare UX e storytelling commerciale prima del collegamento a database reale.
