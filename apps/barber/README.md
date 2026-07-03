# Lama d'Oro — Gestionale premium per barbershop

App web premium (Next.js 15 + Vercel + Firebase) pensata per barbieri: **prenotazioni
online**, **gestione incassi**, **database clienti**, **campagne fedeltà / porta un
amico** e **abbonamenti Base/Pro monetizzati con Stripe**.

> Pensata per scalare: piano **Base gratuito** per iniziare, piano **Pro** in abbonamento
> per sbloccare referral, multi-operatore, clienti illimitati e report avanzati.

## Cosa include

| Area | Funzione |
|------|----------|
| Landing | Vetrina premium con prezzi e call-to-action |
| Prenotazioni | Pagina pubblica `/prenota` per i clienti + agenda interna |
| Incassi | Registro movimenti, report giornalieri/settimanali/mensili, ticket medio |
| Clienti | CRM con storico, spesa, punti fedeltà e codici referral |
| Campagne | Sconti e programma "Porta un amico" (referral) |
| Abbonamento | Piani Base/Pro con checkout Stripe |

## Avvio in locale (modalità demo)

Dalla root del monorepo:

```bash
pnpm install
pnpm --filter @barber/web dev
# App su http://localhost:3001
```

Senza variabili d'ambiente l'app parte in **modalità demo**: i dati sono in memoria e
puoi provare tutte le funzioni (login con una email qualsiasi, es. `demo@lamadoro.it`).

## Test

```bash
pnpm --filter @barber/web test        # test unitari (store, piani, incassi)
pnpm --filter @barber/web lint         # eslint
pnpm --filter @barber/web typecheck    # controllo tipi
```

## Passare da demo a produzione (Firebase + Stripe)

1. **Firebase**: crea un progetto su [console.firebase.google.com](https://console.firebase.google.com),
   attiva **Authentication** (Email/Password) e **Firestore**. Copia le chiavi dell'app Web.
2. **Stripe**: crea un account su [stripe.com](https://stripe.com), prendi la *Secret Key*
   e (facoltativo) crea un prezzo ricorrente per il piano Pro.
3. Copia `.env.example` in `.env.local` e compila i valori.

```bash
cp apps/barber/.env.example apps/barber/.env.local
```

Quando le variabili `NEXT_PUBLIC_FIREBASE_*` sono presenti, l'app passa automaticamente
alla **modalità Firebase**; con `STRIPE_SECRET_KEY` il checkout diventa un pagamento reale.

## Deploy su Vercel

1. Importa il repo su [vercel.com](https://vercel.com).
2. Imposta la root del progetto su `apps/barber` (il file `vercel.json` è già configurato).
3. Aggiungi le variabili d'ambiente (Firebase + Stripe) nelle *Project Settings*.
4. Deploy. La pagina pubblica di prenotazione sarà su `https://tuo-dominio/prenota`.

## Architettura

- **Interfaccia dati unica** (`src/lib/store.ts`): in demo usa uno store in memoria; la
  stessa interfaccia va implementata con Firestore per la produzione, senza toccare UI/API.
- **API Route** (`src/app/api/*`): clienti, prenotazioni, incassi, campagne, auth, billing.
- **Piani** (`src/lib/plan.ts`): feature e limiti di Base/Pro, applicati lato server.
- **Stripe** (`src/app/api/billing/checkout`): crea la sessione di pagamento; in demo
  simula l'upgrade per mostrare il flusso.

## Privacy

Dati clienti minimizzati, trattati nel rispetto del GDPR. In produzione firma un DPA con i
provider (Firebase/Stripe) e pubblica una privacy policy.
