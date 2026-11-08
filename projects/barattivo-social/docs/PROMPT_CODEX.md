# Prompt pronto per Codex / Cursor — merge Barattivo Social ↔ Barattivo MVP locale

Agisci come lead full-stack engineer, product designer e security reviewer del progetto Barattivo di FLUSSIVO. Obiettivo: integrare la nuova UI `barattivo-social` con l'MVP preesistente nel mio PC, preservandone funzionalità e dati. Prima leggi Notion «Barattivo — Marketplace per lo scambio di servizi» e i file `README.md`, `docs/STRATEGIA_E_MODELLO.md`, `docs/INTEGRAZIONE_MVP.md`, `firestore.rules`, `storage.rules` del nuovo progetto. Trova in locale `Flussivo/barattivo - Brand/web` e `GUIDA.md`.

REGOLE NON NEGOZIABILI:
- Non sovrascrivere il codice storico; crea branch, fai backup e audit dei cambiamenti.
- Non esportare mai token, account di servizio, password, file `.env` o dati personali in Git.
- Prima mappa il data model e scrivi un piano di migrazione reversibile e idempotente.
- Riutilizza le funzioni realmente operative di login, matching, proposte/controproposte, milestone, recensioni, concierge e notifiche, se testate.
- Mantieni gratuito il baratto base per privati; monetizza solo opzioni accessorie, business e partner etici.
- Non usare personaggi o asset protetti dei Flintstones: soltanto grafiche preistoriche ORIGINALI e accenti visivi, non elementi infantili invasivi.
- Firebase Auth/Firestore/Storage a livello Group solo dopo audit tenant e privacy. Non migrare automaticamente dati privati in CRM.
- Test con Emulator Suite (rules autorizzazioni), unit e Playwright end-to-end, mobile 360/390/768/1440.
- Verifica le prestazioni, l'accessibilità, la moderazione, i contenuti vietati, la gestione GDPR e gli obblighi fiscali prima della produzione.

AZIONI:
0. Mantieni e integra Barto (`src/barto-bot.js`): chat di orientamento, search e pubblicazione, nessuna lettura di chat private o simulazione di AI. Testa con `node --test tests/barto.test.mjs`.
1. Inventario repository, stack, dipendenze, database, env, deploy Vercel e domini.
2. Diagramma architettura as-is → to-be, feature parity checklist e rischi.
3. Copia la nuova UI consumer, la community e l'adapter in feature branch; risolvi incongruenze senza perdere backend esistente.
4. Implementa feed sociale e chat real time, gruppo locale con access control, notifiche opt-in, profili e reputazione verificata **solo** dopo scambi conclusi.
5. Allestisci dashboard di moderazione, segnalazioni, blocchi, anti-spam, rate limit, App Check, account deletion, policy privacy.
6. Distribuisci su Vercel preview, collega il progetto Firebase con environment PUBLIC WEB CONFIG (mai service account nel client), pubblica regole dopo test, configura alert costi.
7. Fai QA end-to-end e documenta screenshot, test pass/fail, bug e rollback plan.
8. Aggiorna Notion con commit, preview URL, decisioni, costi e roadmap.

OUTPUT ATTESO: PR ordinata, demo verificabile, backend verificato in test, documentazione completa e nessuna credenziale esposta.