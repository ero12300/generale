# Barber Suite

Gestionale web **premium** per barbershop: prenotazioni online, database clienti,
gestione incassi e campagne sconti / porta un amico. Pensato come **SaaS scalabile**
con abbonamento (piano Base gratuito + piano Pro) e monetizzazione via **Stripe**.

Stack: **Next.js 15** (App Router) + **Tailwind CSS v4**, deploy su **Vercel**,
persistenza opzionale su **Firebase** (Auth + Firestore), pagamenti con **Stripe**.

## Funzionalità

- **Landing marketing** con listino prezzi Base/Pro.
- **Dashboard**: incasso di oggi / 30 giorni, scontrino medio, grafico incassi,
  agenda del giorno, clienti top.
- **Prenotazioni**: agenda interna + conferma delle richieste online, cambio stato
  (in attesa → confermata → completata / annullata / no show).
- **Clienti**: anagrafica, storico spesa, punti fedeltà, codice invito personale.
- **Incassi**: registro pagamenti (contanti/carta/bonifico), ripartizione per metodo.
  Al completamento di una prenotazione l'incasso viene generato automaticamente.
- **Campagne**: sconti (% o importo fisso) e programma **Porta un Amico** con classifica referral.
- **Abbonamento**: upgrade a Pro tramite Stripe Checkout (con limiti di piano, es. numero barbieri).
- **Prenotazione pubblica** (`/prenota/[slug]`): pagina cliente in 3 step.

## Modalità Demo (default)

Senza variabili d'ambiente l'app parte in **Modalità Demo**: i dati (clienti,
prenotazioni, incassi, campagne) sono precaricati e salvati nel `localStorage` del
browser. Perfetta per provare l'app senza configurare nulla. Il pulsante
"Ripristina demo" in *Impostazioni* riporta i dati di esempio.

## Regole di progetto

- **Importi monetari sempre in centesimi interi** (`src/lib/money.ts`) — mai float.
- Logica di calcolo incassi isolata in `src/lib/analytics.ts` (funzioni pure e testate).
- Tipi di dominio centralizzati in `src/lib/types.ts`.

## Comandi

```bash
# dal root del monorepo
pnpm install
pnpm --filter @barber/app dev        # http://localhost:3000
pnpm --filter @barber/app build
pnpm --filter @barber/app lint
pnpm --filter @barber/app typecheck
pnpm --filter @barber/app test
```

## Configurazione produzione (Firebase + Stripe)

Copia `.env.example` in `.env.local` e compila:

1. **Firebase** — crea un progetto su [console.firebase.google.com](https://console.firebase.google.com),
   attiva Authentication e Firestore, e inserisci le chiavi `NEXT_PUBLIC_FIREBASE_*`
   (client) e `FIREBASE_*` (Admin, per le API server).
2. **Stripe** — crea un prodotto ricorrente mensile per il piano Pro, copia il
   `price_...` in `STRIPE_PRICE_PRO`, e imposta `STRIPE_SECRET_KEY`,
   `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
   Il webhook Stripe punta a `/api/stripe/webhook`.

Quando Stripe non è configurato, l'upgrade a Pro avviene in **modalità simulata**
(nessun addebito reale), utile per demo e sviluppo.

## Deploy su Vercel

Il file `vercel.json` è già configurato per il monorepo pnpm
(`pnpm --filter @barber/app build`). Aggiungi le variabili d'ambiente nel
progetto Vercel e collega il webhook Stripe all'URL di produzione.
