## Aggiornamento immagini complete — 08/11/2026

La hero e il manifesto usano nuove illustrazioni **intere**, esportate in WebP ad alta qualità e risoluzione originale 1448 × 1086 px. Asset: `assets/barto-hero-hd.webp`, `assets/cave-social-hd.webp`. CSS non distruttivo: `src/complete-images.css`, caricato dopo `fiducia.css`. `object-fit: contain`, proporzioni 4:3, senza `max-height` mobile, con sovrapposizioni eliminate. La scritta decorativa è già integrata nell'illustrazione ed è descritta anche nei testi alternativi; nessuna grafica è un ritaglio della schermata del sito. Barto resta cliccabile attraverso un bottone distinto sotto la foto.

# Barattivo — Il valore non è solo denaro

**Versione:** Barattivo Exchange 2.0 (Origins + Barto) · demo-first · 08/11/2026

Barattivo è un progetto digitale **a impatto sociale** di FLUSSIVO. Il nome `barattivo.com` risulta disponibile nella verifica Vercel dell’8/11/2026, ma non è stato acquistato/riservato. Il baratto rimane gratuito: le persone possono offrire oggetti, competenze, tempo e servizi e proporre scambi tramite una conversazione.

## Novità Exchange 2.0

- Tre percorsi **Oggetti / Servizi / Tempo e aiuto**, 20 categorie e sottocategorie specifiche: `src/taxonomy.mjs`.
- Form di annuncio con categoria/sottocategoria e modalità **in presenza / remoto / entrambe** (oggetti solo passaggio concordato tra persone). Ricerca e filtri per modalità.
- Profilo social con nome pubblico, tipo utente, città, biografia, competenze, desideri e **foto facoltativa**, in demo o Firebase. Nessun dato email pubblico.
- Esempi di scambio **consulenza fitness ↔ sessione yoga online**. Dialogo sui diversi modelli di scambio, crediti chiaramente indicati come *non attivi*.
- Firebase adapter, regole e Storage aggiornati per schema nuovi annunci/profili; saldo crediti negato a tutte le scritture client.
- **Scambio gratuito per tutti:** nessun pagamento nemmeno per le aziende quando utilizzano le funzioni essenziali; servizi professionali aziendali e sponsorizzazioni distinti e facoltativi.
- Il prodotto **non gestisce spedizioni, consegne, trasporti, incassi e wallet/token**.
- Documento categorie: `docs/CATEGORIE_E_SCAMBI.md`; DB: `docs/SCHEMA_FIRESTORE.md`; business: `docs/BUSINESS_SOCIALE.md`.

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

## Identità e fiducia — Origins Fiducia 3.0

Il sito include ora il nuovo design Barattivo con Barto illustrato e una sezione per **fiducia prima dell'incontro**. Il profilo mostra social facoltativi e dichiarati, biografia, città e informazioni generali; l'email resta privata. Nel frontend è presente la possibilità di bloccare e segnalare un profilo, e il backend Firebase è predisposto a gestire questi segnali con Security Rules.

In Firebase **l'email deve essere confermata** per pubblicare, scrivere post, aprire nuove chat e proporre scambi. Un link Instagram o un accesso Google collegato non certificano l'identità. `verified` resta un campo non modificabile dal client: non esiste ancora una procedura completa di verifica documentale, né si devono attribuire badge a dati demo. Vedere `docs/FIDUCIA_E_IDENTITA.md`.

**Stato:** demo deployabile su Vercel, ma non pronta a iscrizioni pubbliche senza Firebase TEST, Emulator Suite, moderazione, policy privacy/DSA, verifica anti-abuso e test browser. La parte social è gratuita, senza spedizioni né pagamenti.