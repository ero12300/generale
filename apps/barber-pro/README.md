# BarberPro

Gestionale premium per barbershop. Prenotazioni online, CRM clienti, incassi,
campagne referral e abbonamento Stripe. Stack: Next.js 15 · React 19 · Tailwind 4 · Firebase · Stripe.

## Cosa fa

- **Landing page premium** con pricing 3 tier (Starter · Pro · Business) e link demo.
- **Dashboard** con KPI incassi giornalieri / mensili, prossime prenotazioni, top clienti.
- **Agenda prenotazioni** con colonne per barbiere, drag-free UX, modal per creare o chiudere una prenotazione.
- **Pagina pubblica di prenotazione** (`/book/[slug]`) mobile-first, 4 step (servizio → barbiere → data → contatti) con supporto codici sconto e referral.
- **CRM clienti** con storico, VIP, note, codice referral univoco per ogni cliente.
- **Incassi** con metodi (contanti, POS, bonifico, altro), export CSV, chiusura automatica prenotazioni completate.
- **Servizi** e **Team** configurabili.
- **Campagne**: coupon sconto + programma "porta un amico" (gated per piano Pro).
- **Abbonamento**: Stripe Checkout + Billing Portal + webhook.

## Modalità demo (senza Firebase e senza Stripe)

Se non configuri le env, l'app parte in modalità demo:

- Auth locale (localStorage) con dati precaricati.
- Store in-memory con salone, servizi, staff, clienti, prenotazioni, incassi.
- Upgrade piano "simulato" (aggiorna solo lo stato locale).

Perfetto per esplorare l'app prima di configurare i provider reali.

## Comandi

```bash
# Installazione (dal root del monorepo)
pnpm install

# Sviluppo
pnpm --filter @barber-pro/web dev
# → http://localhost:3100

# Build produzione
pnpm --filter @barber-pro/web build
pnpm --filter @barber-pro/web start

# Lint / typecheck
pnpm --filter @barber-pro/web lint
pnpm --filter @barber-pro/web typecheck
```

## Setup Firebase (produzione)

1. Crea un progetto su https://console.firebase.google.com.
2. Abilita **Authentication → Email/Password**.
3. Crea un database **Firestore** in modalità produzione.
4. Da _Impostazioni progetto → Le tue app_, aggiungi un'app **Web** e copia il config: valorizza le `NEXT_PUBLIC_FIREBASE_*` in `.env.local`.
5. Da _Impostazioni progetto → Service accounts_, genera un JSON e incollalo (una riga o base64) in `FIREBASE_SERVICE_ACCOUNT_JSON`.

> Nota: l'adapter Firestore lato server è predisposto (`src/lib/firebase/admin.ts`). Il repository (`src/lib/data/repo.ts`) usa lo store demo per default; puoi estenderlo per leggere/scrivere su Firestore quando `isFirebaseConfigured()` è `true`.

## Setup Stripe (monetizzazione)

1. Su https://dashboard.stripe.com/test/products crea 2 prodotti ricorrenti:
   - **Pro** (€ 29/mese) → copia il `price_...`
   - **Business** (€ 79/mese) → copia il `price_...`
2. Valorizza `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_BUSINESS_MONTHLY` in `.env.local`.
3. Su https://dashboard.stripe.com/test/webhooks aggiungi un endpoint verso `https://<il-tuo-dominio>/api/stripe/webhook` (eventi: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`) e copia lo `Signing secret` in `STRIPE_WEBHOOK_SECRET`.
4. Localmente puoi usare `stripe listen --forward-to localhost:3100/api/stripe/webhook`.

## Deploy su Vercel

1. Push del branch su GitHub.
2. Su https://vercel.com/new importa il repo e come **root** seleziona `apps/barber-pro`.
3. Aggiungi tutte le variabili di `.env.example` nel dashboard Vercel.
4. Deploy.

## Architettura

```
src/
├── app/                          # App Router
│   ├── (auth)/                   # Login, signup
│   ├── (app)/                    # Area autenticata (shell condiviso)
│   │   ├── dashboard/
│   │   ├── prenotazioni/
│   │   ├── clienti/
│   │   ├── incassi/
│   │   ├── servizi/
│   │   ├── campagne/
│   │   ├── abbonamento/
│   │   └── impostazioni/
│   ├── book/[slug]/              # Pagina pubblica di prenotazione
│   └── api/                      # Route handlers Next
├── components/
│   ├── ui/                       # Design system (Button, Card, Modal, ...)
│   ├── shell/                    # AppShell (sidebar + topbar)
│   ├── bookings/                 # Vista agenda
│   ├── clients/                  # CRM
│   ├── payments/                 # Incassi
│   ├── services/                 # Servizi
│   ├── campaigns/                # Coupon + referral
│   ├── settings/                 # Staff manager
│   ├── subscription/             # Azioni Stripe
│   └── booking/                  # Public form
├── lib/
│   ├── auth/                     # AuthProvider (Firebase + fallback demo)
│   ├── firebase/                 # Client + admin
│   ├── stripe/                   # SDK server-side
│   ├── data/repo.ts              # Repository unificato (demo/Firestore)
│   ├── demo/                     # Store in-memory + seed
│   ├── plans.ts                  # Definizione piani + limiti
│   ├── types.ts                  # Domain model
│   └── utils.ts                  # Formattatori, helper
└── ...
```

## Monetizzazione

Modello attuale: **abbonamento mensile**.

| Piano       | Prezzo  | Chi | Limiti principali |
|-------------|---------|-----|-------------------|
| Starter     | Gratis  | Barbiere singolo che prova l'app | 50 clienti, 40 prenotazioni/mese, 1 postazione |
| **Pro**     | €29 / mese | Salone medio (il target) | Illimitato, 5 postazioni, campagne, referral, export |
| Business    | €79 / mese | Catene/franchising | Postazioni illimitate, priority support, multi-sede (roadmap) |

Ulteriori leve di monetizzazione future:

- **Fee su prenotazioni pubbliche** (opzionale, 1-2%).
- **SMS/WhatsApp promemoria** (add-on 9€/mese o pay-per-use).
- **Multi-sede** su Business con upgrade separato.
- **Marketplace** di temi/pagine di prenotazione personalizzate.

## Prossimi passi consigliati

1. Configurare Firebase reale e implementare l'adapter Firestore in `src/lib/data/repo.ts`.
2. Legare `Shop.ownerUid` all'utente Firebase autenticato per multi-tenancy vera.
3. Aggiungere reminder SMS / WhatsApp (Twilio).
4. Analytics avanzata: heatmap prenotazioni, retention, LTV per cliente.
5. Multi-sede per Business.
