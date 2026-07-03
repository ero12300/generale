# BarberSuite — Gestionale premium per barberie

Web app Next.js 15 pensata per Vercel + Firebase + Stripe. Include:

- **Landing premium** con listino servizi e piani di abbonamento
- **Prenotazione online** (`/prenota`): wizard in 3 passi con slot per barbiere,
  codici sconto e codici porta-un-amico
- **Gestionale interno** (`/app`):
  - Panoramica incassi (oggi / 7 giorni / 30 giorni, grafico, per barbiere e metodo)
  - Agenda prenotazioni con chiusura appuntamento → incasso automatico
  - Cassa: registrazione incassi manuali + export CSV (Pro)
  - Database clienti con codice referral personale
  - Campagne sconto (percentuale, fisso, referral) — funzione Pro
- **Monetizzazione SaaS**: piani Base (19 €/mese) e Pro (49 €/mese) con Stripe
  Checkout in modalità abbonamento

## Avvio rapido (demo, zero credenziali)

```bash
pnpm install
pnpm --filter @deal-desk/barber dev   # http://localhost:3100
```

Senza variabili d'ambiente l'app gira in **modalità demo**: i dati sono salvati
in `localStorage` del browser con dati d'esempio precaricati. Perfetto per
provare tutti i flussi.

## Collegare Firebase (produzione)

1. Crea un progetto su [console.firebase.google.com](https://console.firebase.google.com)
2. Aggiungi una web app e abilita **Cloud Firestore**
3. Copia le chiavi in `.env` (vedi `.env.example`, prefisso `NEXT_PUBLIC_FIREBASE_*`)
4. Imposta `NEXT_PUBLIC_SHOP_ID` (un ID per negozio: è la base multi-tenant)

I dati vengono salvati in `shops/{shopId}/state/{chiave}` (un documento per
collezione: servizi, clienti, prenotazioni, incassi, campagne). Vedi
`docs/adr/0001-barber-suite.md` per la motivazione.

> Nota sicurezza: per il lancio configura le security rules di Firestore e
> Firebase Auth per limitare l'accesso all'area `/app` al solo titolare.

## Collegare Stripe (monetizzazione)

1. Crea due prodotti ricorrenti mensili su [dashboard.stripe.com/products](https://dashboard.stripe.com/products)
   (es. "BarberSuite Base" 19 €/mese e "BarberSuite Pro" 49 €/mese)
2. Copia in `.env`:
   - `STRIPE_SECRET_KEY` (chiave segreta)
   - `STRIPE_PRICE_BASE` / `STRIPE_PRICE_PRO` (Price ID, iniziano con `price_`)
3. Configura il webhook su `https://<tuo-dominio>/api/stripe/webhook` con gli
   eventi `checkout.session.completed` e `customer.subscription.*`, e copia
   `STRIPE_WEBHOOK_SECRET`

Senza chiavi Stripe l'attivazione dei piani è **simulata** (utile in demo).

## Deploy su Vercel

1. Importa il repository su Vercel
2. Imposta **Root Directory** = `apps/barber`
3. Aggiungi le variabili d'ambiente di `.env.example`
4. Deploy: Vercel rileva Next.js automaticamente (vedi `vercel.json`)

## Comandi

```bash
pnpm --filter @deal-desk/barber dev        # sviluppo (porta 3100)
pnpm --filter @deal-desk/barber build      # build produzione
pnpm --filter @deal-desk/barber test       # test vitest (denaro, sconti, slot, KPI)
pnpm --filter @deal-desk/barber lint       # eslint
pnpm --filter @deal-desk/barber typecheck  # tsc --noEmit
```

## Struttura

```
src/lib/money.ts        # importi SEMPRE in centesimi interi (mai float)
src/lib/logic.ts        # sconti, referral, KPI incassi, slot prenotazione
src/lib/validation.ts   # schemi zod per ogni form
src/lib/store/          # stato app + adapter localStorage / Firestore
src/app/                # landing, /prenota, /app/*, /api/stripe/*
```
