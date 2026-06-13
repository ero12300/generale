# ADR 0001 — RistoCare OS come app standalone con demo store in-memory

- Stato: Accettato
- Data: 2026-06-12

## Contesto

Il documento strategico (sez. 22, 33, 46) richiede una web app SaaS RistoCare OS con stack
Next.js + Tailwind + Supabase. Il repository corrente ospita un prodotto diverso
(monorepo pnpm "Deal Desk Immobiliare"). La richiesta è creare un **nuovo programma e una
nuova cartella** a partire dal documento.

Servono due decisioni:

1. Dove collocare il codice di RistoCare OS.
2. Come renderlo eseguibile e verificabile senza credenziali Supabase.

## Decisione

1. **Cartella autonoma `ristocare-os/`** con il proprio `package.json` (gestita con npm), non
   inserita nel workspace pnpm esistente, per evitare conflitti con l'altro prodotto e
   mantenere il nuovo programma isolato e portabile.
2. **Demo store in-memory** (`src/lib/demo-store.ts`) come adapter dati predefinito quando
   mancano le variabili Supabase, coerente con la filosofia "modalità demo" già usata nel
   repository. I tipi di dominio (`src/lib/types.ts`) modellano lo schema MVP della sez. 24,
   così la migrazione a Supabase richiederà solo un nuovo adapter, non un refactor dell'UI.

## Conseguenze

- L'MVP gira con `npm install && npm run dev` senza alcun servizio esterno.
- La logica di prezzo separa vista cliente (solo prezzo finale) e vista interna (margine),
  rispettando la protezione del margine richiesta dal documento.
- Lo store in-memory **non è persistente**: i dati creati si azzerano al riavvio del server.
  È adeguato per demo e sviluppo, non per la produzione.
- Fase 2: introdurre un adapter Supabase con Auth a 6 ruoli e Row Level Security multi-tenant
  mantenendo invariata l'interfaccia dei tipi.
