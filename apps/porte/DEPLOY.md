# Configuratore Porte — Deploy Vercel

App mobile-first per configurare ordini porte da foro muro e export produzione.

## Import rapido (1 click)

👉 [**Pubblica Configuratore Porte su Vercel**](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fero12300%2Fgenerale&project-name=configuratore-porte&root-directory=apps%2Fporte&teamSlug=eros-projects-1943e19f)

1. Root Directory: `apps/porte`
2. Clicca **Deploy**
3. L'app è online senza login

## URL attesi

| Ambiente | URL |
|----------|-----|
| Produzione | https://configuratore-porte.vercel.app |

## Sviluppo locale

```bash
pnpm install
pnpm dev:porte
# http://localhost:3002
```

## Deploy automatico (CI)

Workflow: `.github/workflows/deploy-porte-vercel.yml`

Secrets GitHub richiesti:

| Secret | Descrizione |
|--------|-------------|
| `VERCEL_TOKEN` | Token da vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `team_5SBu2hnGswyjDY2Ne8WVZ6fL` |
| `VERCEL_PROJECT_ID_PORTE` | Opzionale — creato automaticamente dal workflow |

Oppure da terminale:

```bash
export VERCEL_TOKEN=xxx
pnpm provision:porte
```
