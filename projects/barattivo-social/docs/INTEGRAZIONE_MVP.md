# Integrare Barattivo Social con l'MVP già esistente — senza perdere dati

L'MVP storico è documentato in Notion (04/09/2026) nella cartella locale `Flussivo/barattivo - Brand/web` e disponeva di autenticazione, bacheca Offro/Cerco, matching, proposte/controproposte, chat, milestone, recensioni, concierge B2B, SMTP, Telegram e spiegazioni AI OpenRouter. Questa versione di Barattivo Social sviluppa invece una nuova UX consumer, una community e un adapter Firebase. **Nessun codice del precedente MVP è stato letto o sostituito durante questa operazione.**

## Strategia di migrazione

1. Fare backup del progetto locale e del database storico e identificare framework, ORM, schemi, credenziali in uso (senza esportare segreti nei log).
2. Testare l'MVP storico e congelare una baseline con screenshot, test e dati fittizi.
3. Conservare i moduli funzionanti (match AI, milestone, storico proposta, concierge) come feature candidate, non riscriverli per principio.
4. Adottare **un unico modello di dominio**: profile, listing, conversation, message, proposal, agreement, milestone, review, community post, report. Mappare le chiavi esistenti con ID legacy.
5. Stabilire **una fonte autorevole per ogni dato**; per le nuove funzioni usare Auth + Firestore dopo una migrazione reversibile. Non eseguire dual-write senza gestione di conflitti e deduplicazione.
6. Attivare import idempotente per vecchi utenti/annunci; verificare proprietario, allegati, permessi, integrità referenziale e timestamp.
7. Mantenere il frontend Vinted-like + elementi cartoon originali con test su mobile. Migrare gli endpoint gradualmente tramite facade `src/service.js`.
8. Approvazione security/privacy/fisco e beta privata prima della pubblicazione nazionale.

## Integrazione con l'ecosistema

- FLUSSIVO resta brand/studio digitale di riferimento.
- Boncordo Group CRM può ricevere soltanto lead aziendali con consenso, senza trasferire automaticamente le anagrafiche dei privati.
- SNODO può proporre servizi di aziende partner su esplicita richiesta dell'utente.
- SEGNALA/SEGNALE può supportare marketing, non ha accesso automatico alle chat private.
- Notion contiene roadmap, procedure e decisioni; Firestore contiene dati applicativi e chat. Non usare Notion come database operativo per i messaggi.
- Drive conserva asset di progetto (licenze, manuali, export) e NON i messaggi personali senza base giuridica.

## Strategia di codice Git

Versione nuova **isolata** sotto `projects/barattivo-social/` su un branch dedicato finché il codice storico non è stato confrontato. Non eseguire merge sul ramo principale senza revisione. La root può essere importata in Vercel come directory del progetto. La PR consente confronto e cherry-pick successivi.

## Test di accettazione minimi

- Utente A crea annuncio reale e carica foto, B lo vede senza autenticarsi.
- B crea account e chat con A, ma C non può leggere chat né le proposte.
- B crea proposta, solo A la accetta/rifiuta e solo B può ritirarla.
- Utente malevolo non può cambiare il badge verificato, il proprietario degli annunci, né leggere segnalazioni.
- Upload non immagini e file maggiori di 4 MB rifiutati; regole testate con Emulator Suite.
- Pubblicazioni demo non sono trasferite nel database reale.
- Il downgrade Free non blocca chat e scambi.