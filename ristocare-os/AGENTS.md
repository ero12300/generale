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

Senza variabili Supabase, l'app usa `demoStore` in-memory.

## Ruoli

`super_admin`, `operator`, `customer_admin`, `customer_staff`, `technician`, `referral_partner`
