# Deal Desk Immobiliare

Piattaforma operativa per analisi e gestione di investimenti immobiliari in SRL.

## Funzionalità MVP

- **Intake immobile** — incolla URL annuncio, estrazione campi, revisione manuale
- **Pipeline deal** — kanban per stage operativi
- **Simulatore scenari** — base / prudent / stress con LTV, DSCR, NPV, IRR
- **Proposta acquisto** — bozza commerciale con placeholder legali
- **Lista lavori** — WBS cantiere generata da template
- **Indice Libertà Finanziaria** — dashboard patrimoniale

## Stack

- Next.js 15 + shadcn/ui + Tailwind
- Supabase (Postgres, Auth, RLS, Storage)
- Python FastAPI (motore analitico)
- Playwright (intake URL singolo)
- PostGIS + pgvector (schema migrato)

## Avvio rapido

```bash
# Dipendenze
pnpm install
pip install -r services/analytics/requirements.txt

# Copia env
cp .env.example .env

# Terminale 1 — frontend
pnpm dev

# Terminale 2 — analytics
cd services/analytics && uvicorn app.main:app --reload --port 8000
```

Apri [http://localhost:3000](http://localhost:3000)

## Documentazione

- [architecture.md](./architecture.md) — architettura sistema
- [docs/er-schema.md](./docs/er-schema.md) — schema entità
- [docs/mvp-backlog.md](./docs/mvp-backlog.md) — backlog tecnico
- [AGENTS.md](./AGENTS.md) — regole per agenti AI

## Supabase

Applica le migrazioni al tuo progetto Supabase:

```bash
supabase db push
# oppure esegui supabase/migrations/20250605000000_initial_schema.sql
```

## Test

```bash
pnpm test:analytics
```

## Note legali

- Nessuno scraping massivo dei portali
- Parametri fiscali SRL configurabili — non consulenza professionale
- Proposte acquisto = bozze da revisionare con avvocato/notaio
