# BARATTIVO — Fiducia, identità e sicurezza tra persone

**Release:** Origins Fiducia 3.0 — anteprima tecnica, 8 novembre 2026.
**Missione:** proteggere le relazioni senza richiedere denaro, pubblicare documenti personali o penalizzare persone con meno risorse.

## Principio fondamentale
La fiducia NON deve essere una grafica di marketing. I badge devono raccontare soltanto verifiche effettivamente completate, non autocertificazioni o risultati inventati.

| Segnale | Significato effettivo | Implementazione | Può diventare «Identità verificata»? |
| --- | --- | --- | --- |
| Email confermata | Si controlla quell'account email | Firebase `sendEmailVerification`, `reload`, claim `email_verified` in Rules | NO |
| Google collegato | Il profilo Firebase Auth può essere collegato a un account Google | `linkWithPopup` disponibile se il provider Google è configurato | NO |
| Social dichiarati | L'utente sceglie di mostrare link pubblici a Instagram/Facebook/LinkedIn/TikTok | URL HTTPS normalizzati, host verificati e resi cliccabili con `rel=nofollow noopener noreferrer` | NO |
| Foto profilo | Foto facoltativa caricata dal titolare | Firebase Storage (quando configurato) | NO |
| Identità verificata | Risultato di processo affidabile di identificazione con attestazione server-side, scadenza e revoca | **NON ATTIVO**; flag `verified` non modificabile dal client | SÌ, solo dopo audit reale |
| Scambio concluso | Due parti confermano un accordo ed esito | **DA IMPLEMENTARE** con backend privilegiato; oggi proposta in chat ≠ completamento | Non equivale a identità |
| Recensione verificata | Feedback solo su scambio completato e documentato | **NON ATTIVO** | Non equivale a identità |

## Funzioni aggiunte alla demo e predisposte in Firebase

1. Nella scheda dell'annuncio compare il collegamento al profilo dell'inserzionista; se il profilo demo non esiste viene esplicitato che è un esempio.
2. Nel profilo pubblico: nome, zona/città, biografia, attività offerte/richieste, avatar facoltativo e social dichiarati. Email, indirizzi privati, contatti personali e documenti **non sono pubblicati**.
3. Le schede distinguono chiaramente «Identità non verificata» e «Identità verificata dalla piattaforma»; il secondo badge si mostra soltanto su campo server-managed. Nessun dato demo riceve tale badge.
4. Registrazione Firebase email/password con link di conferma, reinvio e refresh stato. Prima di pubblicare, chattare, proporre o scrivere post si richiede email confermata **anche lato Rules**.
5. Collegamento facoltativo del provider Google all'account login: solo se Firebase Console è configurata; non è prova d'identità.
6. Profilo: link a Instagram, Facebook, LinkedIn, TikTok tramite URL HTTPS con host allowlist, senza query di tracciamento e senza garantire proprietà del profilo; un link non è una «verifica social».
7. Blocco profili via `blocks/{ownerUid}/users/{targetUid}`. Le Security Rules impediscono nuovi messaggi/proposte tra due utenti se uno ha bloccato l'altro; la cronologia resta leggibile dai partecipanti per eventuale contestazione.
8. Segnalazione profilo via `profile_reports`, separata dalle segnalazioni annunci; leggibile solo da admin. La lavorazione concreta delle segnalazioni richiede dashboard staff e organizzazione operativa.
9. Prima di incontrarsi: checklist pratica (luogo pubblico, chat interna, condizioni scritte, no documenti o pagamenti, blocco/segnalazione). Barto ricorda questi principi.
10. Le regole impediscono la manipolazione client di `verified` e richiedono che autore/nome annuncio coincidano con il profilo Firebase corrispondente.

## Ulteriori controlli P0 prima di utenti reali

- [ ] Configurare Firebase in ambiente TEST e domini autorizzati per Auth, email verification e provider Google; non attivare Google finché consensi e trattamento dati non sono stati verificati.
- [ ] Implementare Firebase App Check, throttling server-side, controlli antifrode su velocità iscrizioni, annunci ripetuti, richieste chat e segnalazioni. Valutare captcha e limitazioni progressive, senza escludere utenti con barriere tecnologiche.
- [ ] Testare Rules in Emulator Suite: anonimo, utente non verificato, email confermata, owner, destinatario, terzo, bloccato, admin. Controllare subcollection path, query e `socialLinks` malicious input.
- [ ] Implementare moduli per flag, sospensione, abuso/ricorso, policy e tempi operativi per intervenire su report di impersonificazione.
- [ ] Integrazione reale di verifica identità opzionale: scegliere provider serio con documento/eIDAS/CIE/SPID in base a fattibilità e valutazione giuridica. Processare la verifica su server, NON salvare fotocopie di documenti in Firestore o profili pubblici; conservare soltanto attestazione, tipo, validità e riferimento audit con retention proporzionata. Considerare opzione di verifica aziende tramite registri pubblici e partita IVA.
- [ ] Mantenere distinzione esplicita fra `emailVerified`, social dichiarati e `identityVerified`, evitando un punteggio artificiale che discrimini persone senza account social.
- [ ] Scambi realmente conclusi: workflow bilaterale, recensioni per scambio, audit e gestione contestazioni, anti-collusione; non mostrare «4.9 stelle» su dati finti.
- [ ] Privacy, GDPR, diritto di cancellazione/portabilità, retention chat/abusi e valutazione DSA/moderazione con consulente.
- [ ] Proteggere media dai metadati EXIF/localizzazione e dalle immagini con contenuti sensibili; sanitizzazione dei nomi file e scansione contenuti dove appropriato.

## Regole UX e copy

**Da usare:** «Email confermata», «Collegamento social dichiarato», «Profilo completo», «Identità non verificata», «Segnala» e «Blocca».

**Da non usare senza prova:** «Utente verificato», «Sicuro al 100%», «Nessuna truffa», «Account autentico garantito», rating finti, «Social verificato» ottenuto solo incollando un URL.

Il servizio si limita a connettere persone; per gli oggetti non gestisce spedizioni o incassi. Ogni incontro resta una decisione dei partecipanti; la trasparenza riduce i rischi ma non può eliminarli.

## Test e limiti dichiarati
- 20 test Node superati + build statica/smoke test superati nella sessione; test browser locale fallito per blocco della navigazione localhost (ambiente), non per un errore applicativo accertato.
- Rules/identity provider **non testati con Emulator Suite / Firebase reale**. Non abilitare utenti pubblici sulla sola base della compilazione statica.
- Nessuna verifica documentale o certificazione automatica implementata; non è disponibile un provider scelto e configurato.

## Riferimenti
- https://firebase.google.com/docs/auth/web/manage-users
- https://firebase.google.com/docs/reference/js/auth
- https://firebase.google.com/docs/firestore/security/test-rules-emulator
- https://eur-lex.europa.eu/eli/reg/2022/2065