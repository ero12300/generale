# MVP Backlog — Deal Desk Immobiliare

## Epic 1: Fondamenta (Sprint 0) ✅

| ID | Ticket | Priorità | Stato |
|----|--------|----------|-------|
| E1-01 | Monorepo scaffold (pnpm, apps/web, services/analytics) | P0 | Done |
| E1-02 | Migrazioni Supabase + RLS multi-tenant | P0 | Done |
| E1-03 | architecture.md + ER schema + ADR | P0 | Done |
| E1-04 | AGENTS.md + README setup dev | P0 | Done |
| E1-05 | docker-compose per servizi locali | P1 | Done |

## Epic 2: Auth e Tenant (Sprint 1)

| ID | Ticket | Priorità | Criteri accettazione |
|----|--------|----------|----------------------|
| E2-01 | Login/signup Supabase Auth | P0 | Email magic link o password |
| E2-02 | Onboarding organizzazione | P0 | Creazione org al primo accesso |
| E2-03 | Invito membri (owner/admin) | P1 | Role-based access |
| E2-04 | Middleware protezione route | P0 | Redirect se non autenticato |
| E2-05 | Test RLS isolation | P0 | Utente A non vede dati org B |

## Epic 3: Deal Pipeline (Sprint 1-2)

| ID | Ticket | Priorità | Criteri accettazione |
|----|--------|----------|----------------------|
| E3-01 | CRUD deal | P0 | Create, list, update stage, archive |
| E3-02 | Vista pipeline kanban | P0 | Colonne per stage, drag opzionale |
| E3-03 | Scheda deal split-view | P0 | Annuncio / dati / analisi / note |
| E3-04 | Audit stage history | P1 | Log cambi stage |
| E3-05 | Filtri e ricerca deal | P1 | Per stage, strategia, zona |

## Epic 4: Property Intake (Sprint 2)

| ID | Ticket | Priorità | Criteri accettazione |
|----|--------|----------|----------------------|
| E4-01 | Form paste URL | P0 | Validazione URL |
| E4-02 | Parser Playwright generico | P0 | Estrae campi da pagina JS |
| E4-03 | Schema normalized_property | P0 | Pydantic + Zod allineati |
| E4-04 | UI revisione dati estratti | P0 | Edit + conferma |
| E4-05 | Snapshot strutturato | P0 | JSON + screenshot interno |
| E4-06 | Adapter portali specifici | P2 | idealista, immobiliare.it |

## Epic 5: Analisi Investimento (Sprint 2-3)

| ID | Ticket | Priorità | Criteri accettazione |
|----|--------|----------|----------------------|
| E5-01 | Formula engine Python | P0 | Decimal, no float |
| E5-02 | Scenari base/prudent/stress | P0 | Tre output completi |
| E5-03 | Metriche LTV DSCR NPV IRR | P0 | Test unitari per formula |
| E5-04 | Tax profile configurabile | P0 | IRES, IRAP, registro |
| E5-05 | UI simulatore 3 leve | P0 | Sconto, capex, tempo |
| E5-06 | Sensitivity summary | P1 | Segnali verde/ambra/rosso |
| E5-07 | Versioning analysis_runs | P0 | Storico numeri |

## Epic 6: Proposta Acquisto (Sprint 3)

| ID | Ticket | Priorità | Criteri accettazione |
|----|--------|----------|----------------------|
| E6-01 | Template draft italiano | P0 | Testo commerciale + placeholder |
| E6-02 | Versioning offer_letters | P0 | Diff tra versioni |
| E6-03 | Export HTML | P1 | Preview stampabile |
| E6-04 | Export PDF | P2 | Puppeteer o react-pdf |
| E6-05 | Disclaimer non-consulenza | P0 | Banner visibile |

## Epic 7: Lista Lavori (Sprint 3)

| ID | Ticket | Priorità | Criteri accettazione |
|----|--------|----------|----------------------|
| E7-01 | CRUD work_items | P0 | Per deal |
| E7-02 | Generatore WBS da template | P1 | Categorie standard |
| E7-03 | Totale capex stimato | P0 | Somma righe |
| E7-04 | Flag permesso edilizio | P0 | requires_permit |
| E7-05 | Stato avanzamento | P1 | planned → done |

## Epic 8: Locazioni (Sprint 4)

| ID | Ticket | Priorità | Criteri accettazione |
|----|--------|----------|----------------------|
| E8-01 | CRUD rental_contracts | P1 | Per immobile in affitto |
| E8-02 | Calcolo rendimento netto | P1 | Vacancy, spese |
| E8-03 | Reminder scadenze | P2 | Notifiche |

## Epic 9: Freedom Coverage (Sprint 4)

| ID | Ticket | Priorità | Criteri accettazione |
|----|--------|----------|----------------------|
| E9-01 | Dashboard 5 blocchi | P0 | Attive, passive, uscite, liquidità, indice |
| E9-02 | Calcolo coverage ratio | P0 | passive / fixed_expenses |
| E9-03 | Snapshot storico | P1 | freedom_snapshots |
| E9-04 | Impatto singolo deal | P2 | "Quanto sposta la libertà" |

## Epic 10: Documenti e AI (Sprint 4+)

| ID | Ticket | Priorità | Criteri accettazione |
|----|--------|----------|----------------------|
| E10-01 | Upload documenti Supabase Storage | P1 | Per deal/org |
| E10-02 | Embedding pgvector | P2 | Ricerca semantica |
| E10-03 | Integrazione OpenRouter | P2 | Proposte AI |
| E10-04 | OMI data enrichment | P2 | Import quotazioni |

## Definition of Done (globale)

- [ ] Schema dati definito e migrato
- [ ] Validazione input (Zod frontend, Pydantic backend)
- [ ] Test minimi (unit per formule, integration per API)
- [ ] Stati UI loading/error/success
- [ ] RLS verificato per la feature
- [ ] Nota privacy/multi-tenancy in PR
