# RistoCare OS

**Il passaporto digitale delle attrezzature del tuo ristorante.**

SaaS per la gestione digitale di attrezzature professionali in bar, ristoranti, gelaterie, pizzerie e locali food. Brand dedicato di **Emotive S.r.l.**

## Funzionalità MVP

- Sito pubblico commerciale (landing, pacchetti, contatti, referral)
- Area cliente (dashboard, attrezzature, ticket, documenti)
- Area admin RistoCare (ticket, tecnici, organizzazioni)
- Portale tecnico partner
- Area referral partner
- QR code per attrezzatura
- Modalità demo senza Supabase (o con cookie demo se Supabase attivo)
- Auth email/password Supabase + signup con onboarding org
- Upload documenti attrezzature (Storage)
- PDF preventivi e report mensili
- Email transazionali (Resend, opzionale)

## Avvio rapido

```bash
cd ristocare-os
pnpm install
cp .env.example apps/web/.env.local   # opzionale
pnpm dev
```

Apri [http://localhost:3001](http://localhost:3001).

### Supabase (produzione)

Copia le chiavi dal progetto Supabase `ristocare-os` in `apps/web/.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server)
- `RESEND_API_KEY` e `CONTACT_NOTIFY_EMAIL` (email)

### Accesso demo

- **Cliente / Operatore / Tecnico / Referral:** `/login` → "Entra in demo"

### Deploy Vercel

Il progetto è configurato in `apps/web/vercel.json`. Deploy:

```bash
cd apps/web && npx vercel --prod
```

## Stack

- Next.js 15 + Tailwind CSS 4
- Supabase (PostgreSQL, Auth, Storage, RLS)
- Vercel (deploy)
- PWA installabile

## Ruoli utente

`super_admin`, `operator`, `customer_admin`, `customer_staff`, `technician`, `referral_partner`

## Licenza

Proprietario — Emotive S.r.l.
