# RistoCare OS

> Il passaporto digitale delle attrezzature del tuo locale food.
> Brand dedicato di **Emotive S.r.l.** — mercato iniziale: Messina e provincia.

RistoCare OS è una web app SaaS (PWA-ready) per la gestione digitale delle attrezzature
professionali di ristoranti, bar, gelaterie, pizzerie e locali food: garanzie, manuali,
matricole, **QR code**, ticket di assistenza, manutenzioni, ricambi e interventi tecnici —
da un unico portale.

Questo MVP implementa i flussi principali descritti nel documento strategico
(`documento strategico`, sez. 33 e 46): sito pubblico, area cliente, centrale operativa
(admin) e landing QR.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — design premium Ho.Re.Ca (antracite, verde tecnico, accento oro)
- **zod** — validazione input
- **qrcode** — generazione QR code per attrezzatura
- **PWA** — `manifest.webmanifest` installabile su smartphone
- Predisposto per **Supabase** (DB Postgres, Auth, Storage, RLS) in fase 2

## Modalità demo

Senza variabili Supabase l'app usa uno **store in-memory** (`src/lib/demo-store.ts`) con
dati di esempio (un locale di Messina, 5 attrezzature, 3 ticket, 3 tecnici, 2 referral),
così si possono dimostrare UI e flussi end-to-end senza alcuna credenziale.
Vedi `docs/adr/0001-mvp-standalone-demo-store.md`.

## Avvio

```bash
cd ristocare-os
npm install
cp .env.example .env        # opzionale
npm run dev                 # http://localhost:3000
```

Altri comandi:

```bash
npm run build       # build di produzione
npm run start       # avvia la build
npm run lint        # ESLint (next/core-web-vitals + typescript)
npm run typecheck   # tsc --noEmit
```

## Mappa delle pagine

| Area | Route | Descrizione |
|------|-------|-------------|
| Pubblico | `/` | Home: hero, problema, soluzione, come funziona, pacchetti, FAQ, CTA |
| Pubblico | `/pacchetti` | Confronto piani Start/Pro/Premium/Enterprise + setup + offerta lancio |
| Pubblico | `/referral` | Programma referral + form segnalazione |
| Pubblico | `/contatti` | Form richiesta demo/preventivo/censimento |
| QR | `/q/[token]` | Landing pubblica QR attrezzatura → apertura ticket |
| Cliente | `/app` | Dashboard locale (KPI, ticket recenti, garanzie) |
| Cliente | `/app/attrezzature` | Lista attrezzature |
| Cliente | `/app/attrezzature/[id]` | Scheda + documenti + ticket + **QR code generato** |
| Cliente | `/app/ticket` · `/app/ticket/nuovo` · `/app/ticket/[id]` | Lista, apertura, dettaglio con timeline |
| Admin | `/admin` | Centrale operativa: coda ticket, margine pipeline, referral |
| Admin | `/admin/ticket/[id]` | Vista interna preventivo (**costo + margine**) + avanzamento stato |
| Admin | `/admin/tecnici` · `/admin/referral` | Rete tecnici (ranking privato) e lead referral |

## API

| Metodo | Endpoint | Funzione |
|--------|----------|----------|
| `GET`  | `/api/health` | Stato servizio + modalità (demo/supabase) |
| `GET/POST` | `/api/tickets` | Lista / apertura ticket (validato con zod) |
| `POST` | `/api/tickets/[id]/advance` | Avanzamento stato ticket |
| `POST` | `/api/referral` | Segnalazione referral |
| `POST` | `/api/contact` | Richiesta di contatto |

## Protezione del margine

La logica di prezzo è separata in due viste (sez. 29 del documento):
- **Vista cliente** (`/app/ticket/[id]`): mostra **solo** il prezzo finale.
- **Vista interna** (`/admin/ticket/[id]`): mostra costo tecnico e **margine**, mai esposti al cliente.

## Roadmap (dal documento)

1. **Fase 2 — Supabase**: persistenza reale, Auth con i 6 ruoli, Storage protetto, Row Level Security multi-tenant.
2. **Fase 3 — Automazioni**: email (Resend), WhatsApp Business API, Stripe, reminder e report automatici.
3. **Fase 4 — Espansione**: multi-sede, app mobile (Capacitor), marketplace ricambi, AI assistant.
