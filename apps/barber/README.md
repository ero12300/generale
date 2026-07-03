# BarberOS — Gestionale premium per barbershop

Web app **Next.js 15** (Vercel) + **Firebase Firestore** con monetizzazione SaaS via **Stripe**.

## Cosa include

| Area | Funzione |
|------|----------|
| Sito vetrina | Landing premium (nero + oro) con servizi e prezzi |
| Prenotazioni | Wizard pubblico in 3 step con disponibilità in tempo reale |
| Gestionale incassi | Dashboard con incasso giorno/settimana/mese, grafico 14 giorni, scontrino medio, registro incassi manuale |
| Agenda | Conferma, completa (con incasso automatico) o annulla appuntamenti |
| Database clienti | Ricerca, note, visite, codice referral personale per ogni cliente |
| Campagne | Codici sconto percentuali + programma "porta un amico" (piano Pro) |
| Abbonamento SaaS | Piani Base €19/mese e Pro €49/mese con Stripe Billing |

## Avvio rapido (modalità demo)

```bash
pnpm install
pnpm --filter @barber/web dev   # http://localhost:3100
```

Senza variabili d'ambiente l'app usa dati demo in-memory: puoi provare
subito prenotazioni, incassi, clienti, campagne e upgrade di piano.

## Configurazione produzione

Copia `.env.example` in `.env.local` e compila:

### Firebase (database reale)

1. Crea un progetto su [console.firebase.google.com](https://console.firebase.google.com)
2. Attiva **Firestore**
3. Project Settings → Service accounts → *Generate new private key*
4. Compila `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

Collezioni usate: `services`, `barbers`, `clients`, `appointments`,
`payments`, `campaigns`, `settings/shop`. Se `services`/`barbers` sono
vuote vengono usati i valori predefiniti — puoi personalizzarli da console.

### Stripe (abbonamenti Base/Pro)

1. Crea 2 prodotti ricorrenti mensili su [dashboard.stripe.com](https://dashboard.stripe.com):
   Base €19/mese e Pro €49/mese
2. Compila `STRIPE_SECRET_KEY`, `STRIPE_PRICE_BASE`, `STRIPE_PRICE_PRO`
3. Crea un webhook verso `https://tuodominio.com/api/stripe/webhook` con gli
   eventi `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted` e compila `STRIPE_WEBHOOK_SECRET`

Quando l'abbonamento viene pagato/aggiornato/cancellato, il webhook
sincronizza automaticamente il piano attivo (e le funzioni sbloccate).

## Deploy su Vercel

```bash
cd apps/barber && vercel deploy
```

Il file `vercel.json` è già configurato per il monorepo pnpm.
Imposta le variabili d'ambiente nel progetto Vercel (Settings → Environment
Variables) e `NEXT_PUBLIC_APP_URL` con il dominio finale.

## Modello di business (come lo monetizzi)

- Ogni barbiere che vuole BarberOS paga un abbonamento mensile con Stripe:
  **Base €19/mese** (prenotazioni, agenda, incassi, clienti) o
  **Pro €49/mese** (+ campagne sconto, referral, report avanzati).
- Il gating delle funzioni è lato server (`planHasCapability`): un piano
  scaduto o cancellato torna automaticamente a Base via webhook Stripe.
- Per scalare a più saloni: aggiungi un campo `shopId` alle collezioni e
  un login Firebase Auth per barbiere (architettura già predisposta con
  l'interfaccia `DataStore`).

## Test e qualità

```bash
pnpm --filter @barber/web test        # unit test (slot, sconti, stats, piani)
pnpm --filter @barber/web typecheck
pnpm --filter @barber/web lint
```
