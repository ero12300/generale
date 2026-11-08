# Barattivo — Firestore schema, permessi e migrazione (08/11/2026)

**Stato:** schema implementato nella UI/demo e nel client Firebase per le entità MVP; sicurezza configurata come BOZZA da provare con Emulator Suite prima di pubblicare in produzione. I crediti sono solo tabelle progettate e regole che ne **vietano** l'emissione da client.

## Collezioni MVP

| Percorso | Campi principali | Lettura | Scrittura |
| --- | --- | --- | --- |
| `profiles/{uid}` | displayName, type (`person/professional/company`), city, bio, skills, interests, avatarUrl, verified:false, createdAt | pubblica, solo campi non sensibili | owner, campi whitelist; verified mai modificabile dal client |
| `profiles/{uid}/favorites/{listingId}` | createdAt | owner | owner |
| `listings/{listingId}` | title, type, category, subcategory, deliveryMode, want, city, description, image, ownerId, status, createdAt | pubblicate | owner; campi whitelist |
| `posts/{postId}` | authorId, authorName, avatar, text, tag, createdAt | pubblica | autore solo crea, staff modera/rimuove |
| `chats/{chatId}` | participants[2], listingId, listingTitle, timestamps, lastMessage | solo partecipanti | partecipanti e condizioni validate nelle rules |
| `chats/{chatId}/messages/{msgId}` | senderId, text, createdAt | partecipanti | partecipanti autenticati, immutabili |
| `chats/{chatId}/proposals/{proposalId}` | senderId, receiverId, terms, status, timestamps | partecipanti | invio mittente; accetta/rifiuta destinatario; ritira mittente |
| `reports/{id}` | listingId, reason, reporterId, status, createdAt | solo admin | invia chi è autenticato; admin gestisce |
| `users/{uid}/listings/{file}` (Storage) | immagine 4MB max JPG/PNG/WEBP | pubblico | owner |
| `users/{uid}/avatar/{file}` (Storage) | avatar 2MB max JPG/PNG/WEBP | pubblico | owner |

L'email di login resta in Firebase Auth e non viene copiata nel profilo pubblico. I documenti d'identità e i dati di contatto privati non vanno nei profili pubblici.

## Categoria e modalità

Canonical taxonomy in `src/taxonomy.mjs`, con `kind` (`object`, `service`, `time`), `category` slug e `subcategory` testuale; campo `deliveryMode` tra `in_person`, `remote`, `either`. Gli oggetti ammettono solo `in_person`; ciò indica il passaggio diretto concordato, **non un servizio logistico**. Il vecchio dataset viene reso compatibile in lettura dalla funzione `normalizeCategory`, ma non modificato.

**Esempio:**

```json
{
  "type": "service", "category": "benessere", "subcategory": "Yoga",
  "deliveryMode": "remote", "title": "Sessione di yoga online",
  "want": "Consulenza di allenamento", "city": "Messina", "status": "published"
}
```

## Collezioni FUTURE — NON ABILITATE

- `exchange_agreements`: proposte versionate, consenso bilaterale, prove di completamento e dispute.
- `social_follows`: relazioni volontarie tra profili, con blocchi e preferenze privacy.
- `communities`: moderatori e gruppi tematici/territoriali, visibilità membri e abusi.
- `notifications`: solo dopo consenso/policy, scadenze e retention.
- `organizations`: team e ruoli aziendali, tenant separati, riferimenti a Boncordo CRM solo con permessi e consensi.
- `credit_accounts/{uid}`: documento di saldo leggibile dal titolare, NON creabile/modificabile dal client.
- `credit_ledger/{entryId}`: movimenti immutabili leggibili solo dalle parti interessate, NON creabili/modificabili dal client; in progetto con server trusted e ledger bilanciato.
- `impact_metrics`: aggregazioni anonime e verificabili, senza vendita di dati personali.

## Piano di integrazione non distruttivo

1. Audit MVP locale storico (`Flussivo/barattivo - Brand/web`) con inventario Auth, DB, annunci, chat, match e scambi.
2. Backup dati e snapshot codice; costruzione tabella di mapping `legacy_id -> canonical_id`.
3. Migrazione nella **staging Firebase** e confronto conteggi, referenze e accessi.
4. Eseguire Firebase Emulator Suite e test negazione: utente A non legge chat di B, non cambia verified, non modifica saldo, non scrive profilo altrui.
5. Eseguire test funzionali A→annuncio→chat→proposta→accettazione con 2 account demo isolati e prova di annullamento.
6. Deploy graduale e reversibile; non eliminare vecchio backend né sostituire credenziali senza conferma.

**Nota:** l'inserimento di `deliveryMode` e nuove categorie richiede una migrazione controllata quando si aggiorna un database reale esistente. Il frontend supporta la lettura delle vecchie categorie tramite normalizzazione; non assumere che i record preesistenti rispettino le nuove rules in scrittura.