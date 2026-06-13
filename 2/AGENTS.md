# AGENTS.md — RistoProfit OS

Piattaforma SaaS Emotive S.r.l. per controllo economico ristorazione.

## Comandi

```bash
cd 2 && pnpm install && pnpm dev
```

## Regole

- Importi in centesimi (integer), mai float per monetari
- Multi-tenant: ogni query filtra per `organization_id`
- Separato da RistoCare OS; struttura compatibile per RistoSuite
- Logica food cost in `apps/web/src/lib/food-cost/`
- Modalità demo senza Supabase (`demoStore`)

## Aree

- `/` marketing · `/app/*` cliente · `/admin/*` Emotive · `/sales/*` venditori · `/partner/*` referral
