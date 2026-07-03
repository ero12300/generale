# BarberPro — Gestionale per Barbieri

App web premium per barbieri moderni: prenotazioni, clienti, cassa, campagne marketing e abbonamenti.

## Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- **Database**: Firebase Firestore
- **Auth**: Firebase Auth (Email + Google)
- **Pagamenti**: Stripe (Free/Pro)
- **Deploy**: Vercel

## Funzionalità

### Piano Free
- Dashboard con KPI giornalieri
- Gestione prenotazioni (fino a 30/mese)
- Database clienti (fino a 50)
- Cassa base

### Piano Pro (€29/mese o €199/anno)
- Tutto il piano Free +
- Clienti e prenotazioni illimitati
- Pagina prenotazioni online pubblica
- Campagne marketing (coupon, referral, loyalty)
- Report avanzati con grafici
- Export dati CSV
- Notifiche SMS
- Supporto prioritario
- 14 giorni di prova gratuita

## Setup

### 1. Firebase

1. Crea un progetto su [Firebase Console](https://console.firebase.google.com)
2. Abilita **Authentication** (Email/Password + Google)
3. Crea un database **Firestore** (mode: test o production con regole RLS)
4. Copia le credenziali nel `.env.local`

### 2. Stripe

1. Crea un account su [Stripe](https://stripe.com)
2. Crea 2 prezzi (mensile €29, annuale €199) per un prodotto "BarberPro"
3. Configura il webhook verso `/api/webhooks/stripe`
4. Copia le chiavi nel `.env.local`

### 3. Variabili d'ambiente

```bash
cp .env.example .env.local
# Compila con i tuoi valori
```

### 4. Avvio

```bash
pnpm dev       # Frontend su http://localhost:3001
```

## Deploy su Vercel

1. Collega il repo a Vercel
2. Set **Root Directory**: `apps/barbershop`
3. Aggiungi tutte le variabili d'ambiente
4. Deploy!

## Schema Firestore

### Collezioni

- `shops/{shopId}` — Info negozio, piano, impostazioni
- `clients/{clientId}` — Database clienti, punti fedeltà, codice referral
- `bookings/{bookingId}` — Prenotazioni con stato
- `transactions/{txId}` — Incassi con sconti applicati
- `campaigns/{campaignId}` — Campagne marketing e coupon

## Scalabilità SaaS

L'architettura è multi-tenant: ogni barberia ha il proprio `shopId`. Per aggiungere nuovi clienti (barbieri):
1. Si registrano → viene creato automaticamente il loro `shop`
2. Scelgono il piano Free o Pro
3. Stripe gestisce i pagamenti, il webhook aggiorna il piano su Firestore

## Prossimi step (roadmap)

- [ ] Pagina prenotazioni pubblica per i clienti (`/book/[shopId]`)
- [ ] Notifiche SMS via Twilio
- [ ] App mobile (React Native / Expo)
- [ ] Integrazione Google Calendar
- [ ] Multi-sede per catene
