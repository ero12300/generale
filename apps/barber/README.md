# Rasoio — Barber OS

**Il gestionale premium del barbiere.** Prenotazioni online 24/7, registro incassi, database clienti (CRM) e campagne referral. Stack: Next.js 15 su Vercel + Firebase (Auth + Firestore) + Stripe.

> Progettato per essere pronto in 60 secondi in modalità demo (senza carta) e attivabile in produzione solo aggiungendo le variabili d'ambiente.

## Cosa include

| Modulo | Descrizione |
|---|---|
| **Landing** | Hero, features, pricing 3-tier, testimonial, FAQ, footer |
| **Auth** | Firebase Auth (Google + Email) con fallback demo automatico |
| **Dashboard** | KPI oggi/settimana/mese, grafico 7 giorni, prossime prenotazioni, top servizi |
| **Prenotazioni** | Vista settimanale drag-free, gestione stati, creazione manuale + pagina pubblica `/book/<slug>` |
| **Clienti** | CRM con tag, storico visite, spesa totale, codice referral univoco, export CSV |
| **Incassi** | Registro cassa con contanti/carta/bonifico, mance, report giorno/settimana/mese, export CSV |
| **Campagne** | Codici sconto (%, €, spesa minima, scadenza) e programma porta-un-amico con reward |
| **Impostazioni** | Anagrafica shop, orari settimanali, listino servizi (durata/prezzo), reset demo |
| **Abbonamento** | Stripe Checkout, Billing Portal, feature gating Free/Base/Pro |

## Piani (già cablati)

- **Free — €0** · fino a 30 clienti, prenotazioni manuali, 1 barbiere
- **Base — €19/mese** · clienti illimitati, link pubblico, sconti, report
- **Pro — €39/mese** · tutto Base + referral porta-un-amico + multi-postazione + white-label

Modifica prezzi e feature in `src/lib/plans.ts`.

## Avvio rapido (demo, senza chiavi)

```bash
cd /workspace
pnpm install
pnpm --filter @barber/web dev
```

Apri http://localhost:3000. Clicca **Prova la demo (nessuna carta)** dalla home o da `/signup`.

I dati vivono in `localStorage`. Nessuna chiave richiesta.

## Attivazione Firebase (produzione)

1. Vai su [console.firebase.google.com](https://console.firebase.google.com) e crea un progetto.
2. **Authentication** → Sign-in method: abilita **Email/Password** e **Google**.
3. **Firestore Database** → Create database (region europe-west).
4. **Project Settings** → **Your apps** → Web → copia le 6 variabili `NEXT_PUBLIC_FIREBASE_*` in `.env.local`.
5. Per il webhook Stripe server-side: **Project Settings** → **Service accounts** → **Generate new private key** → converti il JSON in base64:
   ```bash
   base64 -w 0 firebase-adminsdk.json   # Linux
   base64 -i firebase-adminsdk.json     # macOS
   ```
   Mettila in `FIREBASE_SERVICE_ACCOUNT_BASE64`.

Regole Firestore consigliate (multi-tenant per `uid`):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      match /{sub=**}/{doc} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }
    match /public_shops/{slug} {
      allow read: if true;
      allow write: if request.auth != null && resource.data.ownerUid == request.auth.uid;
    }
  }
}
```

## Attivazione Stripe

1. [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) → copia `sk_...` in `STRIPE_SECRET_KEY` e `pk_...` in `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. **Products** → New product → crea:
   - "Rasoio Base" · ricorrenza mensile · €19 → copia il **price id** in `STRIPE_PRICE_BASE_MONTHLY`
   - "Rasoio Pro"  · ricorrenza mensile · €39 → copia il **price id** in `STRIPE_PRICE_PRO_MONTHLY`
3. **Webhooks** → Add endpoint:
   - URL: `https://<il-tuo-dominio>/api/stripe/webhook`
   - Eventi: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copia il **Signing secret** in `STRIPE_WEBHOOK_SECRET`.

Il webhook aggiorna `users/<uid>.plan` in Firestore. Le funzioni Pro (referral, multi-staff, export) usano `hasFeature()` in `src/lib/plans.ts`.

## Deploy su Vercel (1 minuto)

```bash
# 1. Push su GitHub
git add . && git commit -m "feat: rasoio barber os" && git push

# 2. Su Vercel
```

- [vercel.com/new](https://vercel.com/new) → Import repo
- **Root Directory**: `apps/barber`
- **Framework preset**: Next.js
- **Environment Variables**: incolla tutto quello in `.env.local`
- **Deploy**

Dopo il primo deploy, imposta `NEXT_PUBLIC_APP_URL` = URL Vercel definitivo e aggiorna l'URL del webhook Stripe.

## Struttura codice

```
apps/barber/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # Landing
│   │   ├── (auth)/           # login, signup
│   │   ├── app/              # gestionale (auth-guarded)
│   │   ├── book/[slug]/      # pagina pubblica prenotazione
│   │   └── api/stripe/       # checkout, portal, webhook
│   ├── components/
│   │   ├── marketing/        # hero, features, pricing…
│   │   ├── app/              # sidebar, topbar, stat card
│   │   ├── bookings/         # dialog nuova prenotazione
│   │   ├── providers/        # Auth, Data, Toast context
│   │   └── ui/               # button, card, dialog, input, tabs…
│   ├── lib/
│   │   ├── firebase/         # client + admin
│   │   ├── store/            # data store (demo + Firebase adapter)
│   │   ├── demo/data.ts      # dataset dimostrativo
│   │   ├── plans.ts          # piani Free/Base/Pro + feature gating
│   │   ├── slots.ts          # calcolo slot orari
│   │   ├── stripe.ts         # SDK Stripe
│   │   └── utils.ts
│   └── types/                # tipi TS
└── .env.example              # tutte le variabili commentate
```

## Estendibilità

- **Multi-tenant**: `users/{uid}/clients`, `users/{uid}/bookings`, `users/{uid}/revenues` – regole Firestore già proposte.
- **Multi-barbiere (Pro)**: aggiungi un campo `staffId` a `Booking` e `Revenue`, esponi selettore in `settings/servizi`.
- **Notifiche**: aggiungi Twilio/Resend chiamati dal webhook di prenotazione creata.
- **Notifiche push**: Firebase Cloud Messaging → registra il token in `users/{uid}/tokens`.

## Comandi utili

```bash
pnpm --filter @barber/web dev       # dev server (porta 3000)
pnpm --filter @barber/web build     # build produzione
pnpm --filter @barber/web lint      # eslint
pnpm --filter @barber/web typecheck # tsc --noEmit
```

## Licenza

Progetto interno · non ridistribuire senza autorizzazione.
