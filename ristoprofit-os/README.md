# RistoProfit OS

**Il cruscotto economico del ristoratore** — Emotive S.r.l.

Piattaforma SaaS multi-tenant per ristoranti, bar, pizzerie, gelaterie, pasticcerie e locali food: food cost, margini, menu engineering, fatture fornitori, magazzino, produzione, personale e report giornalieri.

Separata da **RistoCare OS** (assistenza, attrezzature, ticket, ricambi), ma progettata con struttura dati compatibile per la futura integrazione in **RistoSuite OS**.

## Avvio rapido

```bash
pnpm install
pnpm --filter @ristoprofit/web dev   # http://localhost:3002
```

Senza variabili Supabase l'app gira in **modalità demo** con dati in-memory di un locale pilota di Messina ("Trattoria del Porto"). I form (richiesta demo, nuovo lead referral) simulano l'invio.

## Comandi

```bash
pnpm --filter @ristoprofit/web dev        # dev server porta 3002
pnpm --filter @ristoprofit/web build      # build produzione
pnpm --filter @ristoprofit/web test       # test motore food cost (vitest)
pnpm --filter @ristoprofit/web lint       # eslint
pnpm --filter @ristoprofit/web typecheck  # tsc --noEmit
```

## Aree dell'applicazione

| Percorso | Area |
|----------|------|
| `/` | Sito pubblico (home, come funziona, prezzi, referral, demo) |
| `/login` | Selezione area (demo) — in produzione: Supabase Auth |
| `/app` | Area cliente: dashboard, food cost, ingredienti, ricette, menu engineering, fatture, magazzino, produzione, personale, report |
| `/admin` | Pannello Emotive: MRR, clienti, abbonamenti, alert |
| `/venditori` | Dashboard venditore: clienti, provvigioni, classifica |
| `/partner` | Portale referral: segnalazioni, premi, nuovo lead |

## Architettura

- **Frontend**: Next.js 15 (App Router) + Tailwind CSS 4, PWA installabile (`manifest.webmanifest`), mobile first.
- **Motore di calcolo**: `src/lib/foodcost.ts` — food cost, margini, prezzi consigliati, menu engineering (Star / Puzzle / Cavallo da lavoro / Dog), incidenza personale, produzione consigliata. Tutti gli importi in **centesimi interi**, mai float.
- **Database**: `supabase/migrations/0001_ristoprofit_schema.sql` — schema PostgreSQL completo (organizations, ingredients, recipes, supplier_invoices, sales_daily, staff_shifts, daily_reports, sales_agents, referrals, ecc.) con Row Level Security multi-tenant e ruoli (`super_admin`, `admin_emotive`, `sales_agent`, `customer_owner`, `referral_partner`, ...).
- **Deploy previsto**: Vercel (web) + Supabase (DB/auth/storage). Evoluzione mobile: PWA → Capacitor → store.

## Roadmap (dal documento operativo)

1. **MVP** — sito pubblico, login, food cost, dashboard cliente/admin, PWA, aree venditori e referral base *(questa versione)*
2. **Vendibile** — upload fatture, storico prezzi, magazzino, report giornaliero automatico, notifiche email
3. **Automazioni** — lettura fatture AI, WhatsApp Business, Stripe, abbonamenti
4. **RistoSuite OS** — integrazione con RistoCare OS: login unico, dashboard suite, pacchetti combinati

Vedi `docs/adr/0001-ristoprofit-piattaforma-separata.md` per le decisioni architetturali.
