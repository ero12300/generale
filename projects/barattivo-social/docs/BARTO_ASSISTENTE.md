# Barto — La guida del baratto

**Stato:** interfaccia e assistente locale pronti per demo; backend AI remoto NON implementato.

## Identità

Barto è un **sasso sorridente** dal tratto illustrato originale, non una caricatura o un personaggio di serie televisive. È un piccolo elemento di familiarità, non il soggetto dominante dell'interfaccia. La homepage e il catalogo rimangono fotografici, leggibili e adatti a privati e imprese.

**Tono:** semplice, incoraggiante, rispettoso. Niente infantilizzazione, pressioni pubblicitarie o tattiche per indurre l'utente a pagare.

## Esperienza attuale

Il chatbot si apre su esplicita richiesta, da pulsante fisso (mobile sopra la barra inferiore) o mini mascotte nella hero. Non compare da solo né intercetta messaggi privati.

| Intento | Risposta | Azione collegata |
| --- | --- | --- |
| «Cerco una bici» | Suggerisce ricerca per parola chiave | Aggiorna ricerca annunci reali, filtra risultati |
| «Voglio pubblicare» | Spiega cosa inserire | Apre pubblicazione (o accesso, se necessario) |
| «Come funziona?» | Tre passaggi del baratto | Collegamento sezione istruzioni |
| «È sicuro?» | Consigli di sicurezza realistici | Esplora annunci / istruzioni |
| «Chat» e «Proposte» | Spiega differenza assistente / chat tra utenti | Apre conversazioni personali, se autenticato |
| «Community» | Spiega la Piazza | Apre la Piazza |
| «Progetto sociale» | Illustra l'impatto desiderato | Apre il manifesto |
| «Costi e abbonamenti» | Conferma baratto base gratuito | Link progetto sociale |

Le risposte usano un sistema di regole in `src/barto-bot.js`, testabile senza API. L'assistente non ha accesso ai dati personali degli utenti o a conversazioni private. Non archivia i messaggi e non promette AI generativa.

## Guardrail

- UI con controlli da tastiera, `Escape` per chiudere, focus nel campo di testo, tastiera mobile e `aria-live` per risposte.
- Testo utente in DOM soltanto tramite `textContent`, non HTML; 280 caratteri massimo per domanda, nessuna API esterna.
- Non inventa annunci, recensioni, prezzi o disponibilità; non formula accordi al posto degli utenti.
- Non comunica con venditori, non legge documenti e non agisce senza un clic esplicito.
- Gli utenti non devono inserire credenziali, dati bancari, documenti o altri dati sensibili nella chat.
- Attualmente il sito è una demo: prima di lanciare utenti reali completare moderazione, privacy, sicurezza, Firebase Emulator Suite e test browser end-to-end.

## Evoluzione AI opzionale (non realizzata)

Solo dopo la validazione: Cloud Functions/Run -> endpoint server autenticato, con controlli antiabuso, limite di spesa e consenso per eventuali informazioni inviate al modello. Retrieval su annunci PUBBLICI, risposta con ID/link verificabili e supervisione umana dove opportuno. L'accesso ai messaggi privati è escluso di default e richiede un prodotto/procedura privacy separata.

## QA

```bash
node --test tests/barto.test.mjs
node tests/smoke.mjs
node scripts/build.mjs
```

Verificare manualmente su telefono e desktop: pulsante chatbot, ricerca contestuale, pubblicazione, chiusura con Esc, rapporto con la barra inferiore, leggibilità e contrasto.