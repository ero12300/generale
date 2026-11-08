# Barattivo — Il valore non è solo denaro

**Versione:** Barattivo Origins con Barto · social marketplace MVP · demo-first · 08/11/2026

Barattivo è un progetto digitale **a impatto sociale** di FLUSSIVO. Il baratto rimane gratuito: le persone possono offrire oggetti, competenze, tempo e servizi e proporre scambi tramite una conversazione.

## Avvio immediato senza dipendenze

```bash
python3 -m http.server 8080
# apri http://localhost:8080
```

Nella root è disponibile `config.js` con `null`: la pagina mostra la dicitura **ANTEPRIMA DIMOSTRATIVA**. I dati aggiunti vengono salvati soltanto in `sessionStorage` del browser. Non creare account reali né caricare contenuti riservati in questa modalità.

Per un build statico di produzione:

```bash
node scripts/build.mjs
# la cartella dist/ è pronta per Vercel
```

## Barto, la guida contestuale con mascotte originale

- **Dove appare:** pulsante discreto in basso a destra (sopra la navigazione mobile), e pulsante-mascotte nella foto della homepage.
- **Come aiuta:** orientamento contestuale nelle sezioni mercato/community/azienda, domande rapide, assistenza alla ricerca, apertura pubblicazione annunci, accesso chat personali, spiegazione accordi e sicurezza.
- **Come funziona oggi:** FAQ e routing locale (`src/barto-bot.js`) **senza intelligenza artificiale generativa**. La ricerca opera sugli annunci realmente disponibili nel contesto corrente; non inventa persone o scambi.
- **Privacy:** le domande non sono inviate al backend, né salvate in Firestore/Storage, Analytics o nella cronologia del browser. La chat con Barto è separata dalle chat private tra utenti. Nessun dato privato viene letto dall'assistente.
- **UX:** apertura manuale, nessun popup automatico, suggerimenti contestuali, chiusura con Esc, testo adattabile, focus esplicito e opzione rispetta-movimento-ridotto.
- **Fase AI futura (non inclusa):** Cloud Functions/Run con API lato server, autenticazione e App Check, controlli antiabuso e limite di spesa, autorizzazione esplicita per inviare dati; ricerca su contenuti pubblici; escalation umana. Mai passare messaggi privati all'AI senza consenso e base giuridica.

## Configurazione backend Firebase

1. Crea o seleziona un **progetto Firebase di test**. Attiva **Authentication > Email/Password**, **Firestore** e **Storage**. Configura anche i domini autorizzati nell'Authentication.
2. Copia i valori della configurazione **Firebase Web App**, non le credenziali amministrative, nelle variabili ambiente mostrate in `.env.example` su Vercel.
3. Configura il tool Firebase CLI separatamente e, dopo test con Emulator Suite, pubblica `firebase deploy --only firestore:rules,firestore:indexes,storage --project YOUR_PROJECT_ID` dalla root.
4. Esegui `node scripts/build.mjs` con le variabili `FIREBASE_*` configurate, poi distribuisci `dist/` su Vercel. Se nessuna variabile è presente, si vedrà solo la demo, **non** un backend attivo.
5. Prima di utenti reali attiva **App Check**, protezione anti-spam e moderazione, policy privacy/cookie, termini di servizio, gestione contenziosi, cancellazione account e procedura di segnalazione.

## Stato delle funzionalità

| Funzione | Demo | Firebase con configurazione valida |
| --- | --- | --- |
| Catalogo, ricerca, categorie, filtri | sì | sì |
| Autenticazione | sessione simulata | Firebase Auth email/password |
| Pubblicazione annunci e foto | sì, foto nella sessione | Firestore + Cloud Storage |
| Preferiti | sì | profili/favorites |
| Conversazioni private | sì | Firestore chats/messages |
| Proposte e risposta | sì | Firestore chats/proposals |
| Community, post | sì | Firestore posts |
| Segnalazioni | sì | Firestore reports, lettura staff con claim admin |
| Verifica reale identità, recensioni, pagamenti, algoritmo AI | non implementate | roadmap, non attive |

**Limitazioni:** chat con refresh su invio/apertura (non ancora push real-time), moderazione e antiabuso base, mancano notifiche e recupero password UI; la gestione dei messaggi e proposte deve essere validata tramite test end-to-end e simulatori di sicurezza prima del lancio. Le prime inserzioni e conversazioni demo non sono utenti veri e non devono diventare testimonial pubblici.

## Architettura

- `index.html`: accessibilità, contenuti, struttura responsive.
- `src/styles.css`: design system teal/crema, cards fotografiche e piccoli inserti cartoon originali.
- `src/demo.js`: dati di esempio chiaramente etichettati.
- `src/service.js`: facade tra demo e Firebase.
- `src/firebase-adapter.js`: SDK modulare Firebase, auth/Firestore/Storage.
- `src/main.js`: UI e interazioni.
- `src/barto-bot.js`, `src/barto.css`: assistente locale, avatar originale e navigazione contestuale.
- `src/origins.css`, `assets/origins-symbol.svg`: identità 85% marketplace e 15% accenti illustrati originali.
- `firestore.rules`, `storage.rules`: permessi per profili, inserzioni, chat, proposte, community, segnalazioni e immagini.
- `docs/`: missione sociale, operatività, monetizzazione, criteri di integrazione con l'MVP precedente e guida dedicata a Barto (`docs/BARTO_ASSISTENTE.md`).

## Privacy e sicurezza: non negoziabili

- Mai pubblicare chiavi server, token amministrativi, file di account di servizio o password demo in GitHub.
- Le regole Firestore sono l'effettiva barriera di accesso. Le verifiche UI **non** costituiscono sicurezza.
- Il prodotto è destinato agli adulti nella prima versione. Valutare policy dedicate ai minori prima di aprire loro l'accesso.
- Bloccare scambi di beni o servizi vietati, pericolosi o soggetti a regimi regolati in mancanza di verifica appropriata.
- Mai chiedere documenti personali, indirizzi di domicilio o dati bancari nelle chat.
- Non dichiarare che un utente è «verificato» senza un processo reale di verifica.

## Integrazione con il vecchio Barattivo

Il progetto è un **nuovo frontend/backend di riferimento separato**: non sovrascrive l'MVP locale. Vedere `docs/INTEGRAZIONE_MVP.md` e `docs/PROMPT_CODEX.md` per audit, mapping e migrazione reversibile.