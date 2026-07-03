# ADR 004 — Barber Suite: app SaaS separata con Firebase + Stripe, demo-first

## Stato

Accettata

## Contesto

Richiesta di un prodotto nuovo e distinto dal gestionale immobiliare: una web app
**premium per barbershop** con prenotazioni online, database clienti, gestione
incassi, campagne sconti / porta un amico, e monetizzazione ad abbonamento
(Base/Pro) tramite Stripe. Stack richiesto: **Vercel + Firebase**.

## Decisione

1. **Nuova app nel monorepo**: `apps/barbershop` (`@barber/app`), senza toccare
   `apps/web` (immobiliare). Riusa le convenzioni esistenti (Next.js 15, Tailwind v4,
   componenti UI in stile shadcn, tema scuro con accenti ambra).
2. **Demo-first**: l'app funziona senza credenziali usando uno store client
   (React Context) persistito su `localStorage`, con dati di esempio realistici.
   Coerente con la "Modalità demo" già adottata nel monorepo.
3. **Firebase opzionale**: moduli `firebase/client.ts` e `firebase/admin.ts`
   attivi solo se le env sono configurate (`isFirebaseConfigured`).
4. **Stripe opzionale**: `/api/stripe/checkout` crea una sessione Checkout reale se
   `STRIPE_SECRET_KEY` + `STRIPE_PRICE_PRO` sono presenti, altrimenti risponde
   `{ simulated: true }` e l'upgrade viene applicato localmente. Webhook su
   `/api/stripe/webhook`.
5. **Denaro in centesimi interi**: mai float (`src/lib/money.ts`). Logica incassi
   isolata e testata (`src/lib/analytics.ts`).
6. **Piani con limiti**: `PLAN_LIMITS` in `types.ts` (es. Base = 1 barbiere,
   Pro = fino a 10 + prenotazioni online + campagne illimitate + analytics).

## Conseguenze

- L'app è immediatamente dimostrabile e testabile senza segreti.
- Il passaggio a produzione richiede solo la compilazione di `.env` (Firebase/Stripe)
  e il collegamento dello store dati verso Firestore (interfaccia già isolata nello store).
- Nota: in modalità demo i dati sono locali al browser; la persistenza multi-utente
  e multi-tenant reale arriva con Firestore + regole di sicurezza per `organizationId`.
