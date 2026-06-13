# RistoProfit OS

**Il cruscotto economico del ristoratore** — piattaforma SaaS di Emotive S.r.l.

RistoProfit OS aiuta ristoranti, bar, pizzerie e gelaterie a controllare food cost, margini, menu, magazzino, personale e report giornalieri.

> Separato da **RistoCare OS** (assistenza/attrezzature), progettato per integrazione futura in **RistoSuite OS**.

## Stack

- **Frontend:** Next.js 15, Tailwind CSS, PWA
- **Backend:** Supabase (PostgreSQL, Auth, Storage, RLS)
- **Hosting:** Vercel

## Avvio rapido

```bash
cd 2
pnpm install
cp .env.example apps/web/.env.local
pnpm dev
```

Apri [http://localhost:3000](http://localhost:3000).

Senza variabili Supabase l'app usa **modalità demo** con dati di esempio (pizzeria Messina).

## Aree applicative

| Area | Percorso | Ruolo |
|------|----------|-------|
| Sito pubblico | `/` | Marketing |
| Cliente | `/app/*` | Titolare, manager, staff |
| Admin Emotive | `/admin/*` | super_admin, admin_emotive |
| Venditori | `/sales/*` | sales_agent |
| Referral | `/referral/*` | referral_partner |

## Comandi

```bash
pnpm dev          # sviluppo (porta 3000)
pnpm build        # build produzione
pnpm lint         # ESLint
pnpm typecheck    # TypeScript
pnpm test         # Vitest (food cost, menu engineering)
```

## Database

Migrazione iniziale: `supabase/migrations/20250613000000_ristoprofit_initial.sql`

```bash
supabase db push   # con Supabase CLI collegato al progetto
```

## Piani commerciali

| Piano | Canone | Setup |
|-------|--------|-------|
| Start | 59 €/mese | 490 € |
| Pro | 129 €/mese | 990 € |
| Premium | 249 €/mese | 1.990 € |
| Enterprise | su preventivo | da 3.000 € |

## Mercato

Lancio: **Messina e provincia** → Sicilia → Sud Italia.
