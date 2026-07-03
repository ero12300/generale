# BarberOS — Gestionale Premium per Barbieri

App web premium per barbieri con prenotazioni online, gestione incassi, CRM clienti e campagne marketing.

## Stack Tecnologico

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication (Email + Google)
- **Pagamenti**: Stripe (abbonamenti Free/Pro)
- **Deploy**: Vercel
- **UI**: Tailwind CSS v4 + Radix UI + dark gold theme

## Funzionalità

### Piano Free (€0/mese)
- Fino a 50 prenotazioni/mese
- Fino a 100 clienti nel CRM
- Gestione incassi base
- Pagina prenotazione pubblica

### Piano Pro (€29/mese o €249/anno)
- Prenotazioni e clienti illimitati
- Campagne sconti e referral "Porta un Amico"
- Analytics avanzate con grafici
- Esportazione dati CSV
- Promemoria automatici
- Supporto prioritario

## Setup Rapido

### 1. Installa dipendenze

```bash
pnpm install
```

### 2. Configura variabili ambiente

```bash
cp .env.example .env.local
```

Compila con le tue credenziali Firebase e Stripe.

### 3. Firebase Setup

1. Crea un progetto su [console.firebase.google.com](https://console.firebase.google.com)
2. Attiva **Authentication** (Email/Password + Google)
3. Crea un database **Firestore** in modalità produzione
4. Copia le credenziali SDK Web in `.env.local`
5. Genera una Service Account key per Firebase Admin
6. Carica le regole Firestore: `firebase deploy --only firestore:rules,firestore:indexes`

### 4. Stripe Setup

1. Crea un account su [stripe.com](https://stripe.com)
2. Crea due prodotti/prezzi:
   - **BarberOS Pro Mensile** — €29/mese → ricopia l'ID in `STRIPE_PRICE_PRO_MONTHLY`
   - **BarberOS Pro Annuale** — €249/anno → ricopia l'ID in `STRIPE_PRICE_PRO_YEARLY`
3. Configura il webhook su `https://tuodominio.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`
4. Copia il webhook secret in `STRIPE_WEBHOOK_SECRET`

### 5. Avvia in sviluppo

```bash
pnpm dev
```

App disponibile su [http://localhost:3001](http://localhost:3001)

### 6. Deploy su Vercel

```bash
vercel deploy
```

Aggiungi tutte le variabili ambiente nel pannello Vercel.

## Struttura Progetto

```
src/
├── app/
│   ├── page.tsx                    # Landing page pubblica
│   ├── login/                      # Autenticazione
│   ├── dashboard/                  # Area gestionale (richiede auth)
│   │   ├── page.tsx               # Dashboard principale
│   │   ├── bookings/              # Prenotazioni
│   │   ├── clients/               # CRM clienti
│   │   ├── revenue/               # Incassi e analytics
│   │   ├── campaigns/             # Campagne marketing
│   │   └── settings/              # Impostazioni salone
│   ├── book/[slug]/               # Prenotazione pubblica per clienti
│   └── api/
│       └── stripe/
│           ├── checkout/          # Crea sessione Stripe
│           └── webhook/           # Gestisce eventi Stripe
├── components/
│   ├── ui/                        # Componenti base (Button, Card, etc.)
│   └── dashboard/                 # Componenti dashboard (Sidebar)
├── hooks/
│   ├── useAuth.tsx                # Contesto autenticazione + shop
│   └── useToast.ts                # Sistema notifiche
├── lib/
│   ├── firebase/
│   │   ├── client.ts              # Firebase SDK client
│   │   ├── admin.ts               # Firebase Admin SDK
│   │   └── firestore.ts           # Helpers Firestore
│   ├── stripe.ts                  # Stripe + piani
│   └── utils.ts                   # Utilities
└── types/
    └── index.ts                   # Tipi TypeScript condivisi
```

## Sicurezza

- RLS (Row Level Security) via Firestore Security Rules
- Multi-tenancy: ogni salone è isolato tramite `ownerId`
- Stripe webhook con verifica firma
- No dati sensibili esposti al client

## Personalizzazione

Per aggiungere nuovi servizi, modifica il profilo del salone in:
`Dashboard → Impostazioni → Servizi`

Il link di prenotazione pubblica è:
`https://tuodominio.com/book/[slug-salone]`
