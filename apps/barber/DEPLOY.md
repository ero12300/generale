# Pubblicazione BarberPro su Vercel

## App live

**Produzione:** https://barberpro-seven.vercel.app

| Pagina | URL |
|--------|-----|
| Homepage | https://barberpro-seven.vercel.app |
| Dashboard | https://barberpro-seven.vercel.app/dashboard |
| Backoffice orari/prezzi | https://barberpro-seven.vercel.app/dashboard/settings |
| Prenotazione clienti | https://barberpro-seven.vercel.app/book/fade-studio |

## Opzione A — Import rapido (1 click) ⚡

**Clicca qui per pubblicare su Vercel:**

👉 [**Pubblica BarberPro su Vercel**](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fero12300%2Fgenerale&project-name=barberpro&root-directory=apps%2Fbarber&teamSlug=eros-projects-1943e19f)

1. Si apre Vercel con il repo già configurato
2. Root Directory: `apps/barber` (precompilata)
3. Clicca **Deploy**
4. In ~2 minuti l'app è online

L'app funziona subito in **modalità demo** (senza Firebase/Stripe).

## Opzione B — GitHub Actions (CI)

Aggiungi questi secrets nel repository GitHub:

| Secret | Valore |
|--------|--------|
| `VERCEL_TOKEN` | Token da vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `team_5SBu2hnGswyjDY2Ne8WVZ6fL` |
| `VERCEL_PROJECT_ID_BARBER` | ID progetto dopo il primo deploy |

Push su `main` → deploy automatico via `.github/workflows/deploy-barber-vercel.yml`.

## Variabili d'ambiente (produzione)

Dopo il primo deploy, in Vercel → Settings → Environment Variables:

### Firebase (obbligatorio per dati persistenti)
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### Stripe (abbonamenti Pro/Elite)
```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_PRO
STRIPE_PRICE_ELITE
NEXT_PUBLIC_APP_URL=https://tuo-dominio.vercel.app
```

### Firebase Admin (webhook Stripe)
```
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
```

## Firebase Firestore

1. Crea progetto su [console.firebase.google.com](https://console.firebase.google.com)
2. Abilita **Authentication** (Email/Password)
3. Crea database **Firestore**
4. Deploy regole: `firebase deploy --only firestore:rules` (da `apps/barber/`)
5. Incolla le credenziali web in Vercel

## URL utili dopo il deploy

| Pagina | Path |
|--------|------|
| Homepage | `/` |
| Dashboard | `/dashboard` |
| Backoffice orari/prezzi | `/dashboard/settings` |
| Prenotazione clienti | `/book/fade-studio` |
