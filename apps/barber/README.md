# BarberPro — Gestionale Premium per Barbieri

SaaS completo per barbieri: prenotazioni online, gestione clienti, incassi, campagne marketing e abbonamenti Stripe.

## Stack

- **Frontend**: Next.js 15 + Tailwind CSS 4
- **Auth & Database**: Firebase (Auth + Firestore)
- **Deploy**: Vercel
- **Pagamenti**: Stripe Subscriptions (piani Starter / Pro / Elite)

## Funzionalità

| Modulo | Descrizione |
|--------|-------------|
| Prenotazioni | Pagina pubblica `/book/[slug]` con flusso a 3 step |
| Clienti | CRM con storico, referral code, punti fedeltà |
| Incassi | Registrazione contanti/carta/bonifico + report |
| Campagne | Sconti, Porta un Amico, programma fedeltà |
| Abbonamenti | Starter gratuito, Pro €29/mese, Elite €59/mese |

## Avvio rapido (modalità demo)

Senza configurare Firebase o Stripe, l'app funziona con dati demo in-memory:

```bash
pnpm install
pnpm --filter @barberpro/web dev
```

Apri http://localhost:3001

- **Dashboard**: `/dashboard`
- **Prenotazione demo**: `/book/fade-studio`
- **Login**: accedi direttamente (nessuna credenziale richiesta in demo)

## Configurazione produzione

### 1. Firebase

1. Crea un progetto su [Firebase Console](https://console.firebase.google.com)
2. Abilita Authentication (Email/Password)
3. Crea database Firestore
4. Copia le credenziali in `.env.local` da `.env.example`

### 2. Stripe

1. Crea account su [Stripe](https://stripe.com)
2. Crea prodotti/prezzi per Pro e Elite
3. Configura webhook: `POST /api/stripe/webhook`
4. Eventi: `checkout.session.completed`, `customer.subscription.deleted`

### 3. Vercel

```bash
cd apps/barber
vercel link
vercel env pull .env.local
vercel deploy
```

Imposta la root directory del progetto Vercel su `apps/barber`.

## Monetizzazione

Il modello SaaS prevede:

- **Starter** (gratis): fino a 50 clienti, prenotazioni base
- **Pro** (€29/mese): campagne, referral, analytics — target principale
- **Elite** (€59/mese): multi-barbiere, white-label, API

I pagamenti passano da Stripe Checkout. Il webhook aggiorna il piano nel database.

## Struttura

```
apps/barber/
  src/
    app/           # Pagine Next.js
    components/    # UI e pannelli dashboard
    lib/
      demo/        # Store in-memory per demo
      firebase/    # Client e Admin SDK
      stripe/      # Piani e checkout
```
