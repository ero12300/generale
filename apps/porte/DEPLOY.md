# Pubblicazione PortePro su Vercel + Firebase

## Deploy rapido su Vercel

👉 [**Pubblica PortePro su Vercel**](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fero12300%2Fgenerale&project-name=portepro&root-directory=apps%2Fporte)

1. Root Directory: `apps/porte`
2. Clicca **Deploy**
3. L'app funziona subito in **modalità demo** (localStorage, senza Firebase)

## Firebase (database progetti)

1. Crea un progetto su [console.firebase.google.com](https://console.firebase.google.com)
2. Abilita **Authentication** → metodo **Anonimo**
3. Crea database **Firestore** (modalità produzione)
4. Registra app Web e copia le credenziali
5. In Vercel → Settings → Environment Variables, aggiungi:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_APP_URL=https://tuo-dominio.vercel.app
```

6. Deploy regole Firestore:

```bash
cd apps/porte
firebase deploy --only firestore:rules
```

## GitHub Actions (CI)

Secrets richiesti:

| Secret | Descrizione |
|--------|-------------|
| `VERCEL_TOKEN` | Token da vercel.com/account/tokens |
| `VERCEL_ORG_ID` | ID team Vercel |
| `VERCEL_PROJECT_ID_PORTE` | ID progetto dopo il primo deploy |

Push su `main` → deploy automatico via `.github/workflows/deploy-porte-vercel.yml`.

## Struttura dati Firestore

```
users/{userId}/projects/{projectId}
  ├── id
  ├── createdAt
  ├── updatedAt
  ├── wallOpening { widthMm, heightMm, wallThicknessMm, label }
  ├── deadWork { widthMm, heightMm, floorClearanceMm }
  ├── modelId
  ├── openingDirection
  └── calculated { ... dimensioni e hardware }
```

Ogni dispositivo ottiene un `userId` tramite **auth anonima** Firebase. I progetti salvati in localStorage vengono migrati automaticamente al primo accesso con Firebase attivo.
