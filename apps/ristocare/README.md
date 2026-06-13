# RistoCare OS

Il passaporto digitale delle attrezzature del tuo locale food — brand dedicato di **Emotive S.r.l.** (Messina e provincia).

Web app SaaS multi-tenant generata dal documento strategico `docs/ristocare/RistoCare_OS_documento_strategico.md`: intake attrezzature, ticket assistenza con centrale operativa, preventivi con margine interno, QR code per macchina, referral partner.

## Cosa contiene l'MVP

| Area | Percorso | Descrizione |
|---|---|---|
| Sito pubblico | `/` | Hero, problema, soluzione, come funziona, 4 pacchetti (Start/Pro/Premium/Enterprise), CTA |
| Referral partner | `/referral` | Form segnalazione locale con premi per piano e regole |
| Area cliente | `/app` | Dashboard (KPI, garanzie in scadenza), attrezzature, scheda macchina, ticket |
| Apertura ticket | `/app/ticket/nuovo` | Form validato (zod) con urgenza e stato "macchina ferma" |
| QR pubblico | `/q/{token}` | Scheda ridotta non sensibile + apertura ticket rapida da QR code |
| Centrale operativa | `/admin` | Coda ticket con costo tecnico → prezzo cliente → margine, note interne |
| Tecnici partner | `/admin/tecnici` | Anagrafica con ranking interno riservato (mai visibile al cliente) |
| Referral admin | `/admin/referral` | Stato lead e premi |

## Principi implementati dal documento strategico

- **Nessun marketplace tecnici**: il cliente apre ticket verso RistoCare, la centrale sceglie il tecnico, applica margine e invia il preventivo brandizzato.
- **Doppia vista preventivo**: costo interno + margine solo lato admin; il cliente vede solo il prezzo finale (anche nello schema SQL, via vista `customer_quotes`).
- **Importi monetari senza float**: tutti i prezzi sono interi in centesimi (`src/lib/money.ts`), margine in punti base.
- **15 stati ticket** del flusso operativo (da "Nuovo" a "Annullato").
- **PWA-ready**: `manifest.webmanifest` per installazione su smartphone (fase 1 della strategia app).
- **Multi-tenant**: schema Supabase con `organization_id` ovunque e RLS per ruolo (`supabase/migrations/0001_ristocare_schema.sql`), ruoli `super_admin`, `operator`, `customer_admin`, `customer_staff`, `technician`, `referral_partner`.

## Avvio

```bash
pnpm install
pnpm --filter @ristocare/web dev   # porta 3100
```

Senza configurazione l'app gira in **modalità demo** con un store in-memory già popolato (Gelateria Lo Stretto, 4 attrezzature, 3 ticket, 3 tecnici, 2 preventivi). Per la produzione, applicare la migrazione SQL a un progetto Supabase dedicato e sostituire `demoStore` con un adapter Supabase.

## Test e qualità

```bash
pnpm --filter @ristocare/web test       # vitest: margini, validazione, garanzie
pnpm --filter @ristocare/web lint
pnpm --filter @ristocare/web typecheck
pnpm --filter @ristocare/web build
```

## Disclaimer

I preventivi generati sono bozze commerciali, non consulenza tecnica o legale. Le condizioni di garanzia e gli accordi con i tecnici partner vanno verificati con un legale.
