# Filo — Barber Suite

Suite premium SaaS per barber shop: prenotazioni online, cassa, CRM clienti, campagne referral e abbonamento Stripe.

- **Stack**: Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion
- **Backend**: Firebase (Auth + Firestore) con fallback demo in-memory
- **Pagamenti**: Stripe (Checkout + Billing Portal + Webhook)
- **Deploy**: Vercel

## Sviluppo

```bash
# dalla root del monorepo
pnpm install
pnpm --filter @deal-desk/barber dev
# → http://localhost:3100
```

## Modalità demo

Se non sono configurate le variabili Firebase, l'app entra automaticamente in **modalità demo**: dati seed di un barber shop realistico salvati in `localStorage`. Perfetto per esplorare le funzionalità e presentare al cliente.

Riavvia lo stato con **Impostazioni → Ripristina dati demo**.

## Piani abbonamento

| Piano | Prezzo | Caratteristiche |
|-------|--------|-----------------|
| **Starter** | Gratis | 1 barbiere, 30 prenotazioni/mese, 100 clienti |
| **Pro** | €29/mese | Illimitato, campagne, analytics, reminder |
| **Elite** | €79/mese | Multi-sede, branding custom, WhatsApp, priority |

## Firebase — configurazione

1. Crea un progetto Firebase → abilita **Authentication (Email/Password)** e **Firestore**.
2. Copia le variabili `NEXT_PUBLIC_FIREBASE_*` da Console → Project Settings → SDK config.
3. Copia le variabili `FIREBASE_ADMIN_*` da Console → Service Accounts (per operazioni server).

## Stripe — configurazione

1. Crea due Product in Stripe Dashboard con prezzo mensile ricorrente:
   - **Filo Pro** — €29/mese → `STRIPE_PRICE_PRO`
   - **Filo Elite** — €79/mese → `STRIPE_PRICE_ELITE`
2. Copia `STRIPE_SECRET_KEY` e `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Configura webhook su `/api/stripe/webhook` con eventi:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copia `STRIPE_WEBHOOK_SECRET`.

Senza queste variabili, l'upgrade è **simulato** in demo (nessuna carta reale).

## Struttura

```
apps/barber/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Landing marketing
│   │   ├── login/, signup/          # Auth
│   │   ├── dashboard/               # Cruscotto
│   │   ├── prenotazioni/            # Calendario
│   │   ├── clienti/                 # CRM
│   │   ├── incassi/                 # Cassa
│   │   ├── campagne/                # Sconti + referral
│   │   ├── impostazioni/            # Servizi, orari, sub
│   │   ├── book/[slug]/             # Pagina prenotazione pubblica
│   │   └── api/stripe/              # Checkout, Webhook, Portal
│   ├── components/                  # UI + moduli
│   ├── lib/
│   │   ├── firebase-*.ts            # Firebase client + config
│   │   ├── stripe.ts                # Stripe helpers
│   │   ├── auth-context.tsx         # AuthProvider
│   │   ├── demo-store.ts            # Store localStorage
│   │   └── utils.ts
│   └── types/                       # Zod schemas condivisi
├── package.json
├── tsconfig.json
├── next.config.ts
└── vercel.json
```

## Deploy su Vercel

1. Collega il repo a Vercel; scegli come Root Directory `apps/barber`.
2. Framework preset: **Next.js**.
3. Aggiungi le variabili d'ambiente Firebase + Stripe.
4. Vercel usa `vercel.json` con `installCommand` e `buildCommand` monorepo-aware.

## Scripts

```bash
pnpm --filter @deal-desk/barber dev         # dev server (porta 3100)
pnpm --filter @deal-desk/barber build       # build produzione
pnpm --filter @deal-desk/barber typecheck   # tsc
pnpm --filter @deal-desk/barber lint        # eslint
pnpm --filter @deal-desk/barber test        # vitest
```

## Roadmap

- [ ] Integrazione notifiche SMS/WhatsApp (Twilio, MessageBird)
- [ ] Sync Google Calendar per il barbiere
- [ ] Report contabili PDF mensili
- [ ] App mobile (PWA installabile)
- [ ] Multi-lingua (EN, ES)
