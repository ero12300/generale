# AGENTS.md — Deal Desk Immobiliare

Guida per agenti che lavorano su questo repository.

## Prodotto

Gestionale web premium B2B per investimenti immobiliari in SRL: intake annunci da URL, analisi scenari, proposta acquisto, lista lavori, dashboard patrimoniale.

## Regole permanenti

- Pianifica prima di scrivere codice
- Lavora per feature piccole e verificabili
- Ogni nuova feature deve avere: schema dati, validazione input, test minimi, stati loading/error/success UI
- **Non usare scraping massivo** — solo URL forniti dall'utente
- **Non inserire logica fiscale nel frontend** — motore in `services/analytics`
- **Non usare float per importi monetari** — Decimal in Python
- Non duplicare tipi — usare `@deal-desk/types`
- Preferisci adapter e servizi invece di logica sparsa nei componenti
- Ogni pagina importante deve essere accessibile via tastiera
- Se una decisione è incerta, crea ADR in `docs/adr/`

## Struttura monorepo

```
apps/web/              → Next.js 15 frontend
services/analytics/    → FastAPI motore analisi
services/intake/       → Playwright parser URL
packages/types/        → Tipi TypeScript condivisi
supabase/migrations/   → Schema Postgres + RLS
```

## Comandi sviluppo

```bash
# Installazione
pnpm install
pip install -r services/analytics/requirements.txt

# Frontend (porta 3000)
pnpm dev

# Analytics API (porta 8000)
cd services/analytics && uvicorn app.main:app --reload --port 8000

# Intake API (porta 8001) — richiede Playwright
cd services/intake && pip install -r requirements.txt && playwright install chromium
uvicorn app.main:app --reload --port 8001

# Test analytics
pnpm test:analytics

# Lint / typecheck
pnpm lint && pnpm typecheck
```

## Modalità demo

Senza variabili Supabase, l'app usa `demoStore` in-memory per dimostrare UI e flussi. Configura `.env` da `.env.example` per Supabase reale.

## Multi-tenancy

- Ogni record ha `organization_id`
- RLS attivo su tutte le tabelle business (vedi migrazione Supabase)
- Non esporre dati cross-tenant

## Privacy

- Minimizzazione dati dagli annunci
- Snapshot interni solo per audit
- DPA con provider cloud/AI in produzione
- Disclaimer su proposte acquisto: bozza, non consulenza legale

## Cursor Cloud

| Servizio | Porta | Note |
|----------|-------|------|
| Web | 3000 | `pnpm dev` |
| PortaLab (configuratore porte) | 3002 | `pnpm dev:porte`, test `pnpm test:porte` |
| Analytics | 8000 | Richiesto per simulatore |
| Intake | 8001 | Opzionale, fallback manuale |
