# ABITAURA | Interior Design & Valorizzazione

Sito premium mobile-first pubblicato su https://abitaura.vercel.app. Codice nella cartella `abitaura/` del repository `ero12300/generale`.

## Architettura decisa (04/11/2026)

- **Vercel**: sito statico e API serverless in Node.js 22+.
- **Firebase Firestore**: target ufficiale, progetto esistente **BONCORDO GROUP**. Le richieste ABITAURA sono eventi unici in `crmOutbox`, con brand `ABITAURA`, stato `PENDING` e idempotency key.
- **Firebase Admin SDK 14.5.0**: credenziali esclusivamente lato server.
- **Firebase Authentication**: previsto per accesso amministratori del CRM; nessuna dashboard admin pubblica implementata.
- **Notion**: documentazione e processi; **non** database duplicato.
- **Legacy temporaneo Supabase**: continua a ricevere lead fino a disponibilità delle credenziali Firebase e collaudo. Non cancellare il database prima di migrazione validata.

## Configurare Firebase Group in Vercel

Nel progetto Vercel `abitaura` aprire Settings → Environment Variables e compilare con il **progetto Firebase Group già approvato**:

```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
LEAD_STORAGE_MODE=auto
```

`FIREBASE_PRIVATE_KEY` è una credenziale **segreta** da inserire solo in Vercel / vault autorizzato: non copiarla nel repository, in chat o in Notion. Impostare tutte le variabili anche per i deployment di produzione. Se il segreto contiene `\n` letterali, il codice ricostruisce le interruzioni di riga.

`LEAD_STORAGE_MODE=auto` usa Firebase quando le tre variabili Firebase sono complete; fino ad allora lascia attivo il vecchio backend Supabase. `LEAD_STORAGE_MODE=firebase` forza Firebase e fallisce con 503 se le credenziali sono assenti. **Non abilitare il cutover senza test end-to-end.** Nessun fallback automatico dopo errori Firebase: evita biforcazioni e dati incoerenti.

## Firestore

- Collezione: `crmOutbox`.
- Documento: `ABITAURA_<sha256>`, ID ripetibile per invii identici nella stessa finestra di 10 minuti.
- Campi: `eventType`, `brand`, `source`, `status`, `createdAt`, `idempotencyKey`, `lead`, `consent`.
- Il worker CRM Connector Hub dovrà gestire PENDING → ACK/ERROR, merge prudente su anagrafica unica e più pratiche per persona, senza duplicare automaticamente i contatti.
- `firestore.rules.example` è un **frammento**, non sostituire il ruleset centrale. Il server Admin SDK bypassa le regole client; i visitatori non devono poter leggere la coda.
- Le chiavi Firebase service-account sono accessibili solo al server.

## Test di accettazione prima del cutover

1. Verificare che Firestore sia attivo nel progetto corretto del gruppo.
2. Verificare credenziali in Vercel e permessi minimi dell'account di servizio.
3. Eseguire invio simulato dal sito su ambiente di test, osservare **un solo** documento in `crmOutbox`.
4. Ripetere lo stesso invio entro 10 minuti: niente duplicati.
5. Verificare `brand=ABITAURA`, tutti i campi, consenso, PENDING.
6. Confermare che il worker CRM abbia elaborato l'evento senza duplicare anagrafica Notion.
7. Verificare errori, rollback e campo `LEAD_STORAGE_MODE`.
8. Prima di pubblicità: privacy GDPR definitiva, rate limiting persistente, CAPTCHA/App Check e dominio del brand.

## API

- `POST /api/leads`: validate → Firebase CRM outbox se configurato, altrimenti legacy temporaneo.
- `POST /api/chat`: assistente guidato gratuito, non generativo.
- `GET /api/health`: disponibilità API e configurazione backend (**non certifica** connessione Firestore).

## Stato reale alla consegna

Frontend e API già pubblicati nella versione precedente. La versione Firebase è nel codice GitHub ma il **progetto Firebase Group e le credenziali non sono stati collegati con successo tramite il connettore Vercel** (creazione env negata da permessi 403). Non dichiarare l'integrazione Firestore operativa prima della configurazione e del test di scrittura. Il CRM master rimane la fonte unica prevista in Notion.
