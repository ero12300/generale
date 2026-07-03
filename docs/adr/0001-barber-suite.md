# ADR 0001 — BarberSuite: architettura app barberia (Vercel + Firebase + Stripe)

## Stato

Accettata — 2026-07-03

## Contesto

Richiesta: web app premium per barberia con gestionale incassi, prenotazioni
online, database clienti, campagne sconto/porta-un-amico e monetizzazione SaaS
(piani Base/Pro) tramite Stripe, deployabile su Vercel con Firebase come
backend dati. Il riferimento di stile (link AI Studio) non è accessibile senza
login Google: si adotta un'estetica premium da barberia (dark, oro, serif).

## Decisioni

1. **App separata nel monorepo** (`apps/barber`, package `@deal-desk/barber`,
   porta 3100): prodotto indipendente da Deal Desk, ma riusa toolchain
   (pnpm workspace, Next 15, Tailwind 4, vitest, eslint). Deploy Vercel con
   Root Directory `apps/barber`.

2. **Importi in centesimi interi** (`src/lib/money.ts`): la regola repo "mai
   float per il denaro" è applicata in TypeScript usando interi (es. 24,50 € =
   2450). Parsing input utente con validazione, formattazione con `Intl`.

3. **Persistenza a doppio adapter** (`src/lib/store/`):
   - `localAdapter` (demo): stato in `localStorage`, seed automatico — l'app è
     dimostrabile senza credenziali, coerente con la "modalità demo" del repo.
   - `firebaseAdapter` (produzione): Firestore, un documento per chiave di
     stato in `shops/{shopId}/state/{chiave}`. Per i volumi di una barberia
     (centinaia di record) il pattern documento-array è semplice, atomico per
     collezione e ben sotto il limite di 1 MB/documento. Se un negozio supera
     ~2000 clienti si migra a collezioni per-record.
   - `NEXT_PUBLIC_SHOP_ID` prepara il multi-tenant: un negozio = un sottoalbero.

4. **Slot di prenotazione calcolati client-side** (`availableSlots`): funzione
   pura testata; il conflitto è ricontrollato al salvataggio per ridurre le
   collisioni. Con Firestore reale andrà aggiunta una transazione.

5. **Monetizzazione con Stripe Checkout (subscription mode)**: route
   `/api/stripe/checkout` crea la sessione con Price ID mensili
   (`STRIPE_PRICE_BASE/PRO`); `/api/stripe/webhook` verifica la firma ed è il
   punto di estensione per aggiornare Firestore via firebase-admin. Senza
   chiavi Stripe l'attivazione piani è simulata (demo). Gating funzioni:
   Base = 100 clienti/2 barbieri, senza campagne; Pro = illimitato + campagne
   + referral + export CSV.

6. **Fiscalità fuori dal frontend**: l'app registra incassi lordi e non calcola
   imposte; la regola repo "niente logica fiscale nel frontend" resta valida.

## Conseguenze

- Demo end-to-end senza setup; produzione attivabile con sole variabili d'ambiente.
- Il webhook Stripe non persiste ancora lo stato piano su Firestore
  (serve firebase-admin + service account): documentato nel README.
- L'area `/app` non è protetta da autenticazione in demo; per il lancio si
  aggiunge Firebase Auth (documentato nel README).
