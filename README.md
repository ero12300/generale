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

## Programmi nel monorepo

- `apps/web` — Deal Desk Immobiliare
- `apps/ristocare-os` — RistoCare OS, landing/MVP Ho.Re.Ca. da documento strategico

## Avvio rapido

```bash
# Dipendenze
pnpm install
pip install -r services/analytics/requirements.txt

# Copia env
cp .env.example .env

# Terminale 1 — frontend
pnpm dev

# Terminale 1b — RistoCare OS su porta 3001
pnpm dev:ristocare

# Terminale 2 — analytics
cd services/analytics && uvicorn app.main:app --reload --port 8000
```

Apri [http://localhost:3000](http://localhost:3000)

## Documentazione

- [architecture.md](./architecture.md) — architettura sistema
- [docs/er-schema.md](./docs/er-schema.md) — schema entità
- [docs/mvp-backlog.md](./docs/mvp-backlog.md) — backlog tecnico
- [AGENTS.md](./AGENTS.md) — regole per agenti AI

## Deploy produzione (automatico)

### 1. Secrets richiesti

Aggiungi nei **Cursor Cloud Agent secrets** (o in `.env.provision` locale):

| Variabile | Dove ottenerla |
|-----------|----------------|
| `SUPABASE_ACCESS_TOKEN` | [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) |
| `VERCEL_TOKEN` | [vercel.com/account/settings/tokens](https://vercel.com/account/settings/tokens) |
| `VERCEL_TEAM_ID` | `team_5SBu2hnGswyjDY2Ne8WVZ6fL` (team eros' projects) |

Autentica anche **Supabase MCP** in Cursor (Settings → MCP → Supabase → Connect).

### 2. Stato attuale (già configurato)

| Risorsa | Stato |
|---------|--------|
| **Supabase** | Progetto `deal-desk-immobiliare` attivo — ref `fppdfqieorixaduolnzn` |
| **Database** | Migrazione iniziale applicata (13 tabelle + RLS) |
| **GitHub** | Branch `main` aggiornato con tutto il codice |
| **Vercel** | Da importare (un click, vedi sotto) |

**Import Vercel (1 click):** [Importa da GitHub](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fero12300%2Fgenerale&project-name=deal-desk-immobiliare&root-directory=apps%2Fweb&teamSlug=eros-projects-1943e19f)

Dopo l'import, in **Supabase → Authentication → URL Configuration** imposta:
- Site URL: `https://deal-desk-immobiliare.vercel.app`
- Redirect URLs: `https://deal-desk-immobiliare.vercel.app/auth/callback`

Le variabili `NEXT_PUBLIC_SUPABASE_*` sono già in `apps/web/vercel.json`.

### 3. Provisioning automatico (alternativa)

```bash
pnpm provision   # richiede SUPABASE_ACCESS_TOKEN + VERCEL_TOKEN
```

### 4. Analytics su Render (simulatore finanziario)

Il motore Python non gira su Vercel. Deploy su Render:

**Opzione A — Blueprint (consigliata, ~2 minuti)**

1. [Dashboard Render](https://dashboard.render.com) → **New** → **Blueprint**
2. Collega il repo `ero12300/generale` (branch `main`)
3. Conferma `render.yaml` e clicca **Deploy Blueprint**
4. Al termine copia l'URL del servizio `deal-desk-analytics` (es. `https://deal-desk-analytics-xxxx.onrender.com`)

**Opzione B — Automatica con API key**

```bash
export RENDER_API_KEY=rnd_...   # da dashboard.render.com → Account Settings → API Keys
export VERCEL_TOKEN=...         # opzionale: aggiorna ANALYTICS_API_URL su Vercel
pnpm provision:render
```

Poi su Vercel imposta `ANALYTICS_API_URL` = URL Render (se non usi lo script).

### 5. CI/CD GitHub

- `ci.yml` — test su ogni push
- `deploy-vercel.yml` — deploy produzione (richiede secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`)

## Supabase (manuale)

Applica le migrazioni al tuo progetto Supabase:

```bash
supabase db push
# oppure esegui supabase/migrations/20250605000000_initial_schema.sql nell'SQL Editor
```

## Test

```bash
pnpm test:analytics
```

## Note legali

- Nessuno scraping massivo dei portali
- Parametri fiscali SRL configurabili — non consulenza professionale
- Proposte acquisto = bozze da revisionare con avvocato/notaio
