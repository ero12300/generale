# AGENTS.md — RistoCare OS

Guida per agenti che lavorano su questo repository.

## Prodotto

SaaS B2B per ristoratori (Ho.Re.Ca.): gestione attrezzature, garanzie, ticket assistenza, manutenzioni, ricambi e centrale operativa RistoCare. Brand di Emotive S.r.l.

## Regole permanenti

- Pianifica prima di scrivere codice
- Lavora per feature piccole e verificabili
- Ogni nuova feature: schema dati, validazione input, test minimi, stati loading/error/success UI
- Non duplicare tipi — usare `@ristocare/types`
- Il cliente non sceglie il tecnico: centrale operativa RistoCare
- Non esporre prezzi interni tecnici al cliente
- Multi-tenancy: ogni record ha `organization_id`, RLS attivo
- PWA-first, pronta per Capacitor in fase 2

## Struttura

```
apps/web/           → Next.js 15 (sito pubblico + portali)
packages/types/     → Tipi TypeScript condivisi
supabase/migrations/ → Schema Postgres + RLS
```

## Comandi

```bash
pnpm install
pnpm dev          # porta 3001
pnpm build
pnpm lint && pnpm typecheck
pnpm test
```

## Modalità demo

Senza variabili Supabase, l'app usa `demoStore` in-memory. Con Supabase configurato puoi comunque usare la demo da `/login` (cookie `ristocare_demo_role`).

## Supabase

Progetto cloud: `ristocare-os` (eu-west-1). Migrazioni in `supabase/migrations/`.

Variabili in `apps/web/.env.local` (vedi `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — referral pubblici e upload admin
- `RESEND_API_KEY` / `CONTACT_NOTIFY_EMAIL` — email transazionali

### Operatore RistoCare

Dopo signup, assegna ruolo operatore con SQL (Dashboard Supabase):

```sql
UPDATE memberships SET role = 'operator'
WHERE user_id = '<uuid-utente>' AND organization_id IS NOT NULL;
```

Per accesso cross-tenant admin, usa `super_admin` su membership dedicata.

## Deploy Vercel

Root directory: `apps/web`. `vercel.json` include env pubbliche Supabase.

```bash
cd apps/web && npx vercel --prod
```

Imposta in Vercel: `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CONTACT_NOTIFY_EMAIL`.


`super_admin`, `operator`, `customer_admin`, `customer_staff`, `technician`, `referral_partner`
