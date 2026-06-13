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
- Modalità demo senza Supabase

## Avvio rapido

```bash
cd ristocare-os
pnpm install
cp .env.example apps/web/.env.local   # opzionale
pnpm dev
```

Apri [http://localhost:3001](http://localhost:3001).

### Accesso demo

- **Cliente:** `/login` → "Entra in demo (cliente)"
- **Operatore RistoCare:** `/login` → "Entra in demo (operatore)"
- **Tecnico:** `/login` → "Entra in demo (tecnico)"

## Stack

- Next.js 15 + Tailwind CSS 4
- Supabase (PostgreSQL, Auth, Storage, RLS)
- Vercel (deploy)
- PWA installabile

## Licenza

Proprietario — Emotive S.r.l.
