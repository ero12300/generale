# ✂️ BarberPro

**Il gestionale premium e SaaS di prenotazione per barbieri.**

Un'unica web app elegante per gestire il salone: prenotazioni online, database clienti,
incassi, campagne marketing e abbonamento a pagamento (Free / Pro) con Stripe.

Stack: **Next.js 15** (Vercel) · **Firebase** (Auth + Firestore) · **Stripe** (pagamenti) · **Tailwind CSS**.

---

## ✨ Cosa include

| Area | Funzioni |
|------|----------|
| **Landing premium** | Home, pagina prezzi, pagina prenotazione pubblica |
| **Prenotazioni** | Agenda interna + pagina pubblica dove i clienti prenotano da soli |
| **Clienti (CRM)** | Database con storico visite, spesa totale, note e codice referral |
| **Incassi** | Registro pagamenti, KPI, grafici andamento e analisi per servizio |
| **Campagne** | Sconti con codice e programma "porta un amico" (referral) |
| **Abbonamento** | Piani **Starter** (gratis) e **Pro** con Stripe Checkout + feature gating |

---

## 🚀 Provalo subito (modalità demo)

Non serve configurare nulla: senza chiavi Firebase/Stripe l'app parte in **modalità demo**
con dati di esempio salvati nel tuo browser.

```bash
cd barberpro
npm install
npm run dev
```

Apri <http://localhost:3000>, clicca **"Entra in modalità demo"** e prova tutto.

> La pagina pubblica di prenotazione è su <http://localhost:3000/book>.

---

## ⚙️ Configurazione reale (produzione)

Copia `.env.example` in `.env.local` e compila i valori.

### 1. Firebase (login + database)

1. Vai su <https://console.firebase.google.com> e crea un progetto.
2. Attiva **Authentication → Email/Password**.
3. Attiva **Firestore Database** (modalità produzione).
4. In *Impostazioni progetto → Le tue app*, aggiungi un'app **Web** e copia i valori in `.env.local`:
   `NEXT_PUBLIC_FIREBASE_API_KEY`, `..._AUTH_DOMAIN`, `..._PROJECT_ID`, `..._STORAGE_BUCKET`,
   `..._MESSAGING_SENDER_ID`, `..._APP_ID`.

Regola Firestore consigliata (ogni barbiere vede solo i propri dati):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /workspaces/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### 2. Stripe (abbonamento Pro)

1. Crea un account su <https://dashboard.stripe.com>.
2. Crea un **Prodotto** "BarberPro Pro" con un **prezzo ricorrente mensile** (es. 29 €/mese).
3. Copia in `.env.local`:
   - `STRIPE_SECRET_KEY` (da *Sviluppatori → Chiavi API*)
   - `STRIPE_PRICE_PRO` (l'ID del prezzo, inizia con `price_...`)
4. (Facoltativo) Configura un **webhook** verso `/api/stripe/webhook` e incolla `STRIPE_WEBHOOK_SECRET`.

Se Stripe non è configurato, il pulsante "Passa a Pro" attiva il piano in modalità demo
(senza pagamento reale), utile per dimostrazioni.

---

## ☁️ Deploy su Vercel

1. Carica il repository su GitHub.
2. Su <https://vercel.com> → *New Project* → importa il repo.
3. **Importante:** imposta **Root Directory = `barberpro`** (l'app è in questa sottocartella).
4. Aggiungi le variabili d'ambiente (le stesse di `.env.local`) in *Settings → Environment Variables*.
5. Deploy. Vercel rileva Next.js automaticamente.

---

## 💰 Come si monetizza

- **Modello SaaS ad abbonamento**: piano **Starter gratuito** (per acquisire utenti) e piano
  **Pro a pagamento** che sblocca clienti illimitati, campagne, prenotazione online e analisi.
- Il pagamento avviene con **Stripe Checkout**; la disdetta tramite il **portale clienti** Stripe.
- Il **feature gating** è centralizzato in `src/lib/plans.ts`: puoi aggiungere nuovi piani o
  limiti senza toccare la UI.

### Come renderlo scalabile

- Ogni salone ha un proprio *workspace* isolato (`workspaces/{uid}` su Firestore).
- Aggiungere un nuovo piano = aggiungere una voce in `PLANS` + un prezzo su Stripe.
- La logica dei dati è dietro un'astrazione (`WorkspaceProvider`), quindi puoi passare da
  documento singolo a collezioni separate quando i volumi crescono.

---

## 🗂️ Struttura

```
barberpro/
├─ src/app/                 # Pagine (App Router)
│  ├─ page.tsx              # Landing premium
│  ├─ pricing/              # Prezzi
│  ├─ book/                 # Prenotazione pubblica
│  ├─ login/                # Accesso / registrazione
│  ├─ dashboard/            # Gestionale (prenotazioni, clienti, incassi, campagne, impostazioni)
│  └─ api/stripe/           # Checkout, portal, webhook
├─ src/components/          # UI e componenti dashboard
└─ src/lib/                 # Tipi, store, analisi, Firebase, Stripe, piani
```

## 🧰 Comandi

```bash
npm run dev        # sviluppo (porta 3000)
npm run build      # build di produzione
npm run lint       # controllo qualità codice
npm run typecheck  # controllo tipi TypeScript
```

---

> ⚠️ **Nota**: gli importi monetari sono gestiti in **centesimi interi** per evitare errori di
> arrotondamento tipici dei numeri con la virgola.
