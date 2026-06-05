# Deal Desk Immobiliare — Architettura

Piattaforma B2B premium per analisi e gestione operativa di investimenti immobiliari in SRL.

## Principi guida

1. **Intake controllato**: solo URL incollati dall'utente, nessuno scraping massivo.
2. **Multi-tenant rigoroso**: isolamento per società via Row Level Security (RLS).
3. **Fisco parametrico**: aliquote e regimi configurabili, mai hardcoded nel frontend.
4. **Audit trail**: numeri versionati, decisioni tracciabili.
5. **Separazione responsabilità**: UI in TypeScript, calcoli in Python, dati in Postgres.

## Stack tecnologico

| Layer | Tecnologia | Ruolo |
|-------|------------|-------|
| Frontend | Next.js 15 App Router + TypeScript | UI premium, Server Actions, routing |
| UI | shadcn/ui + Tailwind CSS | Design system proprietario |
| Auth / DB / Storage | Supabase (PostgreSQL) | Auth, RLS, file storage, realtime |
| Geodati | PostGIS | Zone, distanze, comparables territoriali |
| Ricerca semantica | pgvector | Embeddings su documenti e note |
| Motore analitico | Python FastAPI + Pydantic | Formule finanziarie, scenari, parsing |
| Ingestion listing | Playwright (Python) | Estrazione campi da URL fornito |
| AI ibrida | Transformers.js / HF / OpenRouter | Estrazione, draft, ragionamento |

## Struttura monorepo

```
deal-desk/
├── apps/
│   └── web/                    # Next.js frontend
├── services/
│   ├── analytics/              # FastAPI — motore analisi
│   └── intake/                 # Playwright — parser listing
├── packages/
│   └── types/                  # Tipi TypeScript condivisi
├── supabase/
│   ├── migrations/             # Schema + RLS + estensioni
│   └── seed.sql
├── docs/
│   ├── er-schema.md
│   ├── mvp-backlog.md
│   └── adr/
├── architecture.md
├── AGENTS.md
└── docker-compose.yml
```

## Moduli funzionali

### 1. Property Link Intake
- Input: URL annuncio
- Pipeline: Playwright → JSON canonico → snapshot strutturato → revisione utente
- Output: `normalized_property` confermato

### 2. Investment Analysis
- Input: property + assunzioni (acquisto, capex, finanziamento, locazione, vendita, fisco SRL)
- Output: base_case / prudent_case / stress_case con LTV, DSCR, NPV, IRR, margini
- Engine: `services/analytics` (Decimal, test unitari)

### 3. Offer Letter Generator
- Draft commerciale in italiano + placeholder legali
- Versioning, export HTML/PDF
- Disclaimer: non consulenza legale

### 4. Work List (WBS Cantiere)
- Righe per ambiente/categoria con quantità, costi, stato, allegati
- Flag verifica edilizia/fiscale

### 5. Rental Management
- Canoni, spese, vacancy, scadenze contratti
- Regime ordinario registrazione (no cedolare secca SRL)

### 6. Freedom Coverage Report
- Entrate attive/passive, uscite, liquidità, indice di copertura
- Dashboard permanente (non PDF statico)

## Flusso dati principale

```
URL incollato
    → intake service (Playwright)
    → normalized_property (draft)
    → revisione utente
    → deal creato
    → analisi scenari (FastAPI)
    → proposta acquisto / lista lavori
    → cantiere + documenti
    → dashboard patrimoniale
```

## Multi-tenancy e sicurezza

- Ogni record appartiene a `organization_id`
- RLS su tutte le tabelle business
- `auth.uid()` → `organization_members` → policy per SELECT/INSERT/UPDATE/DELETE
- Storage bucket segregato per org
- Logging accessi e retention policy documentata

## API boundaries

| Endpoint | Owner | Note |
|----------|-------|------|
| `/api/deals/*` | Next.js Server Actions | CRUD deal via Supabase client |
| `/api/intake/*` | Next.js → intake service | Proxy verso Playwright |
| `/api/analysis/*` | Next.js → analytics service | Proxy verso FastAPI |
| Analytics `/v1/*` | FastAPI | Formule, scenari, generatori |

## Estensioni PostgreSQL

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
```

## Strategia AI (costo quasi zero)

| Tier | Uso | Provider |
|------|-----|----------|
| Locale | Embedding, tagging, coerenza | Transformers.js |
| Lab | Test modelli, task leggeri | Hugging Face (crediti free) |
| Produzione | Proposte, memo, scenari complessi | OpenRouter (ZDR quando disponibile) |

## Deployment target

- **Frontend**: Vercel
- **Database/Auth**: Supabase Cloud
- **Analytics + Intake**: Render / Railway (container Docker)
- **CI**: GitHub Actions (lint, test, typecheck)

## Decisioni architetturali (ADR)

Vedi `docs/adr/` per decisioni su:
- ADR-001: Intake URL-only vs crawler
- ADR-002: Motore fiscale parametrico
- ADR-003: Separazione frontend/backend analitico
