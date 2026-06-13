# RistoProfit OS

**Il cruscotto economico del ristoratore** — piattaforma SaaS di Emotive S.r.l.

## Avvio rapido

```bash
cd 2
pnpm install
cp .env.example apps/web/.env.local
# Compila apps/web/.env.local con chiavi Supabase e (opzionale) Stripe
pnpm dev
```

- **Demo senza account:** `/login` → modalità demo
- **Account reale:** `/signup` con Supabase configurato
- **Produzione DB:** schema `profit` su progetto Supabase `ristocare-os` (condiviso con RistoCare)

## Funzionalità Fase 2

| Modulo | Stato |
|--------|-------|
| Auth email Supabase | ✅ |
| Schema DB + RLS (schema `profit`) | ✅ |
| Upload fatture PDF/foto → Storage | ✅ |
| API ingredienti / ricette / dashboard | ✅ |
| Stripe Checkout abbonamenti | ✅ (richiede `STRIPE_SECRET_KEY`) |
| PWA installabile | ✅ |

## Variabili ambiente (`apps/web/.env.local`)

| Variabile | Obbligatoria | Descrizione |
|-----------|--------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Per auth reale | URL progetto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Per auth reale | Chiave anon |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Per Stripe.js (opzionale) | Chiave pubblica `pk_live_...` |
| `STRIPE_SECRET_KEY` | Per pagamenti | Chiave segreta `sk_live_...` (solo server) |
| `STRIPE_WEBHOOK_SECRET` | Per webhook | Secret endpoint `/api/stripe/webhook` |
| `NEXT_PUBLIC_APP_URL` | Deploy | URL pubblico app |

## Deploy Vercel

Root directory: `2/apps/web`

```bash
cd 2/apps/web
npx vercel --prod
```

Impostare le variabili ambiente nel dashboard Vercel (incluse `STRIPE_SECRET_KEY` e `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).

### Webhook Stripe (obbligatorio per attivare abbonamenti)

1. [Stripe Dashboard](https://dashboard.stripe.com/webhooks) → **Aggiungi endpoint**
2. URL: `https://TUO-DOMINIO/api/stripe/webhook`
3. Eventi: `checkout.session.completed`, `customer.subscription.deleted`
4. Copia il **Signing secret** (`whsec_...`) in `STRIPE_WEBHOOK_SECRET`

## Comandi

```bash
pnpm dev | build | test | typecheck | lint
```
