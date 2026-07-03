# BarberFlow — Gestionale premium per barbieri

Web app SaaS per barbieri: incassi, prenotazioni (interne e online), database
clienti con codici **Porta un Amico**, campagne sconto e abbonamento
**Base/Pro** monetizzato con Stripe.

Stack: **Next.js 15 (App Router) su Vercel + Firebase Firestore + Stripe**.

## Avvio rapido (modalità demo)

Senza credenziali l'app parte in modalità demo con dati in memoria:

```bash
pnpm install
pnpm --filter @barberflow/web dev   # http://localhost:3100
```

Pagine principali:

| Percorso | Descrizione |
|----------|-------------|
| `/` | Landing pubblica con piani e prezzi |
| `/app` | Dashboard incassi (oggi, 7 giorni, mese, grafico) |
| `/app/incassi` | Registrazione incassi + ultimi movimenti |
| `/app/prenotazioni` | Agenda interna, completamento/annullo |
| `/app/clienti` | Rubrica con storico visite e codici amico |
| `/app/campagne` | Campagne sconto e Porta un Amico (Pro) |
| `/app/abbonamento` | Cambio piano Base/Pro con Stripe |
| `/prenota` | Prenotazione online per i clienti (Pro) |

## Test

```bash
pnpm --filter @barberflow/web test        # unit test (vitest)
pnpm --filter @barberflow/web typecheck
pnpm --filter @barberflow/web lint
```

## Produzione: Firebase

1. Crea un progetto su [Firebase Console](https://console.firebase.google.com) e attiva **Firestore**.
2. Genera una chiave del service account (Impostazioni progetto → Account di servizio).
3. Imposta `FIREBASE_SERVICE_ACCOUNT` con il JSON completo (una riga) e, se vuoi, `BARBERFLOW_SHOP_ID` / `BARBERFLOW_SHOP_NAME`.

I dati vengono salvati in `shops/{shopId}/{services,clients,bookings,sales,campaigns}`.

## Produzione: Stripe (monetizzazione)

1. Crea un account su [Stripe](https://dashboard.stripe.com) e copia la chiave segreta in `STRIPE_SECRET_KEY`.
2. (Consigliato) Crea due prodotti ricorrenti mensili — Base 19€ e Pro 49€ — e imposta `STRIPE_PRICE_BASE` / `STRIPE_PRICE_PRO`. Senza price ID, i prezzi vengono creati al volo.
3. Configura un webhook verso `https://tuodominio/api/stripe/webhook` con gli eventi `checkout.session.completed` e `customer.subscription.deleted`, e imposta `STRIPE_WEBHOOK_SECRET`.

Il flusso: l'utente sceglie il piano → Stripe Checkout → il webhook aggiorna il
piano del salone su Firestore. Le funzioni Pro (campagne, prenotazione online,
clienti illimitati) si sbloccano automaticamente.

## Deploy su Vercel

1. Importa il repo su Vercel scegliendo `apps/barber` come Root Directory (il `vercel.json` incluso gestisce install e build del monorepo).
2. Aggiungi le variabili d'ambiente di Firebase e Stripe nelle impostazioni del progetto.
3. Imposta `NEXT_PUBLIC_APP_URL` con il dominio di produzione.

## Piani e limiti

| | Base 19€/mese | Pro 49€/mese |
|---|---|---|
| Incassi e agenda | ✔ | ✔ |
| Clienti | max 100 | illimitati |
| Prenotazioni/mese | max 150 | illimitate |
| Prenotazione online | — | ✔ |
| Campagne sconti / referral | — | ✔ |

I limiti sono definiti in `src/lib/plans.ts` e applicati lato server nelle
server actions (`src/app/actions.ts`).

## Note architetturali

- Tutti gli importi sono in **centesimi interi** (mai float): `src/lib/money.ts`.
- Il layer dati è un'interfaccia unica (`src/lib/store/types.ts`) con due
  implementazioni: `DemoStore` (in memoria) e `FirestoreStore` (firebase-admin).
- Validazione input con **zod** in tutte le server actions.
- Logica referral in `src/lib/referral.ts`, statistiche in `src/lib/stats.ts`.
