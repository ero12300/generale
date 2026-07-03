# Barber Desk

Web app premium per barbieri, pronta per Vercel, Firebase e Stripe.

## Cosa include

- Landing SaaS con posizionamento premium.
- Gestionale interno demo: prenotazioni, clienti, incassi, campagne sconto e referral.
- Form prenotazione con validazione e stati loading/error/success.
- Piani Basic/Pro con endpoint Stripe Checkout.
- Configurazione Firebase web app e regole Firestore tenant-ready.

## Comandi

```bash
pnpm --filter @barber-desk/web dev
pnpm --filter @barber-desk/web lint
pnpm --filter @barber-desk/web typecheck
pnpm --filter @barber-desk/web test
pnpm --filter @barber-desk/web build
```

## Variabili ambiente

Copia `.env.example` in `.env.local` e compila:

- `NEXT_PUBLIC_FIREBASE_*` per Firebase Auth/Firestore.
- `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` per Stripe.
- `NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID` e `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` per i prezzi subscription.
- `NEXT_PUBLIC_APP_URL` con l'URL Vercel di produzione.

Senza variabili, l'app resta in modalità demo e mostra dati fittizi.

## Schema Firestore consigliato

```text
barbershops/{tenantId}
  clients/{clientId}
  bookings/{bookingId}
  payments/{paymentId}
  campaigns/{campaignId}
  subscriptions/{subscriptionId}
```

Ogni documento business deve includere `tenantId`, `createdAt` e `updatedAt`.
Gli importi vanno salvati in centesimi interi (`amountCents`, `priceCents`).

## Monetizzazione

Piano Basic:

- Prenotazioni online.
- Database clienti fino a 150 clienti.
- Gestionale incassi.
- Campagne manuali.

Piano Pro:

- Clienti illimitati.
- Referral “porta un amico”.
- Report avanzati.
- Automazioni retention e promemoria.

Stripe Checkout crea l'abbonamento; il webhook è pronto per ricevere eventi e va collegato
all'aggiornamento del piano su Firestore dopo il primo deploy.
