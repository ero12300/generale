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
| `STRIPE_SECRET_KEY` | Per pagamenti | Chiave segreta Stripe |
| `STRIPE_WEBHOOK_SECRET` | Per webhook | Secret endpoint `/api/stripe/webhook` |
| `NEXT_PUBLIC_APP_URL` | Deploy | URL pubblico app |

## Deploy Vercel

Root directory: `2/apps/web`

```bash
cd 2/apps/web
npx vercel --prod
```

Impostare le variabili ambiente nel dashboard Vercel.

## Comandi

```bash
pnpm dev | build | test | typecheck | lint
```
