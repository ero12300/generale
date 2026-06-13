# Setup produzione RistoCare OS

## Stato attuale (configurato automaticamente)

| Componente | Stato |
|------------|--------|
| Supabase `ristocare-os` | ✅ Attivo, schema + RLS + storage + seed |
| Migrazioni DB | ✅ Applicate |
| `.env.local` dev | ✅ Creato in `apps/web/` (gitignored) |
| Referral pubblici | ✅ Senza service role (RLS anon) |
| Build / test | ✅ Passano |

## Deploy Vercel (1 comando)

Aggiungi questi **secrets** nelle impostazioni Cloud Agent di Cursor (o esportali in shell):

| Secret | Dove ottenerlo |
|--------|----------------|
| `SUPABASE_ACCESS_TOKEN` | [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) |
| `VERCEL_TOKEN` | [vercel.com/account/settings/tokens](https://vercel.com/account/settings/tokens) |
| `RESEND_API_KEY` | (opzionale) [resend.com/api-keys](https://resend.com/api-keys) |

Poi esegui:

```bash
cd ristocare-os
pnpm provision
```

Lo script:
1. Configura redirect auth Supabase (`/auth/callback`)
2. Crea progetto Vercel `ristocare-os` (root `ristocare-os/apps/web`)
3. Imposta tutte le env (inclusa `SUPABASE_SERVICE_ROLE_KEY`)
4. Avvia deploy produzione su `https://ristocare-os.vercel.app`
5. Scrive `.vercel/project.json` e aggiorna `.env.local`

## GitHub Actions (alternativa)

Aggiungi secrets al repo `ero12300/generale`:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID` = `team_5SBu2hnGswyjDY2Ne8WVZ6fL`
- `VERCEL_PROJECT_ID_RISTOCARE` (dopo il primo `pnpm provision`)

Workflow: `.github/workflows/deploy-ristocare-vercel.yml`

## Supabase Auth (manuale se provision non usato)

Dashboard → Authentication → URL Configuration:

- **Site URL:** `https://ristocare-os.vercel.app`
- **Redirect URLs:**
  - `https://ristocare-os.vercel.app/auth/callback`
  - `http://localhost:3001/auth/callback`

## Operatore RistoCare

Dopo signup di un utente, in SQL Editor Supabase:

```sql
UPDATE memberships SET role = 'operator'
WHERE user_id = '<uuid-da-auth-users>';
```

## Email

Senza `RESEND_API_KEY` l'app funziona: le email vengono solo loggate in console.
Con Resend, usa `onboarding@resend.dev` in sandbox o verifica dominio `ristocare.it`.
