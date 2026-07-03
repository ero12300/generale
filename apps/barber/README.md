# ✂️ BarberPro — Gestionale premium per barbieri

**Vercel + Firebase + Stripe.** Prenotazioni, clienti, incassi, referral e
abbonamento SaaS in un'unica web app pensata per barbershop moderni.

> ⚠️ **Per Eros e chi non programma:** questo README è pensato apposta per te.
> Nessun comando strano da imparare. Segui i 3 passi qui sotto e sei online.

---

## 1) Cosa fa

- 🌐 **Landing premium** che vende il tuo servizio (o il tuo software).
- 📅 **Prenotazioni online** — i clienti prenotano da soli su `/b/<tuo-nome>`.
- 👥 **Database clienti** con storico visite, spesa e note.
- 💰 **Gestione incassi** con grafici settimanali/mensili/annuali.
- 🎁 **Porta un amico** — ogni cliente ha un codice referral unico.
- 🏷️ **Codici sconto** — campagne per riempire le fasce vuote.
- 💳 **Abbonamento Stripe** — 3 piani (Starter/Pro/Business) già cablati.
- 🌙 **Modalità demo** — funziona subito, senza credenziali, con dati finti.

---

## 2) Prova subito in locale (5 minuti)

Serve solo [Node.js 20+](https://nodejs.org/) e [pnpm](https://pnpm.io/installation).
Poi apri il terminale nella cartella del progetto ed esegui:

```bash
pnpm install
pnpm --filter @deal-desk/barber dev
```

Apri il browser su **http://localhost:3100** — sei dentro.

L'app parte in **modalità demo**: dati finti realistici, tutto navigabile.
Puoi cliccare, prenotare, creare clienti, campagne — tutto viene salvato sul
tuo browser (localStorage) e ricaricato al refresh.

**Pagine da visitare subito:**

- `/` — landing marketing con listino
- `/dashboard` — il tuo gestionale
- `/b/barberia-del-corso` — la pagina pubblica di prenotazione
- `/accedi` e `/registrati` — auth (in demo mode passa dritto)

---

## 3) Metti online la tua versione reale

Ci sono **3 servizi** da attivare (sono tutti gratuiti per iniziare):

### a) Crea il progetto Firebase (5 min)

1. Vai su **https://console.firebase.google.com** e clicca **"Aggiungi progetto"**.
2. Chiama il progetto **BarberPro** (o come vuoi).
3. Dentro il progetto, in **Authentication** → **Sign-in method**, attiva:
   - Email/Password
   - Google
4. Vai in **Firestore Database** → **Crea database** → modalità produzione, regione europe-west.
5. In **Project Settings** ⚙️ → sezione **"Your apps"** → clicca l'icona web `</>` → nome "BarberPro Web".
6. Copia i valori del `firebaseConfig` (apiKey, authDomain, ecc.) — ti servono dopo.

### b) Crea l'account Stripe (5 min)

1. Vai su **https://dashboard.stripe.com/register** e crea un account.
2. Dopo la registrazione, in **Products** → **Create product** crea:
   - **BarberPro Pro** — prezzo ricorrente € 29,00/mese
   - **BarberPro Business** — prezzo ricorrente € 79,00/mese
3. Copia gli **ID Price** (iniziano con `price_...`) di entrambi i prodotti.
4. In **Developers** → **API keys** copia:
   - `Publishable key` (inizia con `pk_test_...`)
   - `Secret key` (inizia con `sk_test_...`)

> 💡 **In modalità test** Stripe ti dà carte di prova (es. `4242 4242 4242 4242`).
> Passa a **live mode** solo quando sei pronto a incassare davvero.

### c) Deploy su Vercel (5 min)

1. Vai su **https://vercel.com** e importa questo repository GitHub.
2. Come **Root Directory** scegli `apps/barber`.
3. Framework: **Next.js** (rilevato automaticamente).
4. In **Environment Variables** incolla i valori raccolti sopra (vedi la
   sezione successiva per la lista completa).
5. Clicca **Deploy**. In 2 minuti hai il tuo dominio `barberpro.vercel.app`.

Poi torna in **Stripe** → **Developers** → **Webhooks** → **Add endpoint**:
- URL: `https://TUODOMINIO.vercel.app/api/stripe/webhook`
- Eventi: `checkout.session.completed`, `customer.subscription.*`
- Copia il **Signing secret** che appare (inizia con `whsec_...`) e mettilo
  in `STRIPE_WEBHOOK_SECRET` su Vercel.

Redeploy → sei live. 🎉

---

## 4) Variabili di ambiente

Copia `.env.example` in `.env.local` (o mettile su Vercel):

```bash
# Firebase Web (dal firebaseConfig del punto 3a)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=barberpro-xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=barberpro-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=barberpro-xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234:web:abc...

# Stripe (dal punto 3b)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_BUSINESS_MONTHLY=price_...

# App
NEXT_PUBLIC_APP_URL=https://tuodominio.vercel.app
NEXT_PUBLIC_APP_NAME=BarberPro
```

Se **manca anche solo una** delle variabili Firebase, l'app cade
automaticamente in **modalità demo** — nessun crash, funziona tutto lo stesso
con dati finti.

---

## 5) Come monetizzare (piani suggeriti)

Il codice ha già cablato 3 piani. Puoi cambiarli in `src/lib/plans.ts`:

| Piano | Prezzo | Ideale per | Include |
|-------|--------|-----------|---------|
| **Starter** | Gratis | Barbieri appena partiti | 30 pren/mese, 1 barbiere, DB clienti |
| **Pro** | **€ 29/mese** ⭐ | Barbershop attivi | Illimitate, referral, report incassi, reminder SMS |
| **Business** | € 79/mese | Catene / franchise | Multi-sede, API, 20 barbieri, supporto prioritario |

**Come guadagni:**

1. Registri i tuoi colleghi barbieri sulla piattaforma (piano Free).
2. Loro provano, si innamorano, passano a Pro.
3. Ogni Pro paga € 29/mese → **10 clienti = € 290/mese ricorrenti**.
4. Con 100 barbershop attivi sei sopra i **€ 2.900/mese** in ricorrente.

Le funzioni "gate" dei piani sono già pronte in `PLANS`. Il webhook Stripe
aggiorna automaticamente il piano nel database.

---

## 6) Architettura tecnica (per te o per chi ti aiuta)

```
apps/barber/
├── src/
│   ├── app/
│   │   ├── page.tsx                    ← Landing marketing
│   │   ├── accedi/ & registrati/       ← Auth pages
│   │   ├── dashboard/                  ← Area riservata
│   │   │   ├── page.tsx                ← Panoramica + KPI
│   │   │   ├── prenotazioni/           ← Agenda
│   │   │   ├── clienti/                ← CRM
│   │   │   ├── incassi/                ← Report
│   │   │   ├── servizi/                ← Listino
│   │   │   ├── campagne/               ← Referral & sconti
│   │   │   └── abbonamento/            ← Stripe
│   │   ├── b/[slug]/                   ← Pagina pubblica prenotazione
│   │   └── api/stripe/                 ← Checkout + Webhook
│   ├── components/
│   │   ├── ui/                         ← Button, Card, Dialog, ecc.
│   │   ├── marketing/                  ← Hero, Features, Pricing…
│   │   ├── dashboard/                  ← Sidebar, TopBar, StatCard…
│   │   └── booking/                    ← Flusso di prenotazione
│   ├── lib/
│   │   ├── demo-store.ts               ← Dati finti (in-memory + localStorage)
│   │   ├── firebase/client.ts          ← Wiring Firebase (opzionale)
│   │   ├── stripe/server.ts            ← Wiring Stripe
│   │   ├── plans.ts                    ← Configurazione piani
│   │   └── utils.ts                    ← formatEuro, cn, initials…
│   ├── hooks/
│   │   └── use-shop-data.tsx           ← Hook unificato demo/Firebase
│   └── types/
│       └── index.ts                    ← Tipi dominio
├── .env.example                        ← Variabili da compilare
├── next.config.ts
├── tailwind (v4, tramite postcss)
└── package.json
```

**Stack:** Next.js 15 (App Router, Turbopack, React 19), Tailwind CSS 4,
Firebase 11, Stripe 17, Radix UI.

---

## 7) Prossimi passi (roadmap suggerita)

1. **Integrare veramente Firestore** al posto del demo store: sostituire i
   metodi di `demoStore.*` con `addDoc`/`getDocs`/`onSnapshot` di Firestore.
2. **Reminder SMS/WhatsApp**: integrare Twilio o WhatsApp Business API.
3. **Multi-tenant reale**: creare `shops/{shopId}` in Firestore, aggiungere
   `security rules` per isolamento cross-tenant (già previsto nell'architettura).
4. **Autenticazione barbieri collaboratori**: usare Firebase custom claims
   per ruoli (`owner`, `barber`).
5. **App mobile PWA**: già mobile-friendly, aggiungere `manifest.json` per
   installazione su home.

---

Ogni file è commentato in italiano. Se qualcosa non torna, apri un issue.
Buon business! 🍀

