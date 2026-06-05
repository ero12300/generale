# ADR-001: Intake URL-only (no crawler massivo)

## Stato
Accettato

## Contesto
I portali immobiliari (es. Idealista) vietano scraping non autorizzato. La direttiva UE sulle banche dati tutela contro estrazione sistematica.

## Decisione
L'utente incolla manualmente l'URL. Il sistema estrae solo i campi necessari, salva snapshot interno e richiede conferma umana.

## Conseguenze
- Nessun discovery automatico di annunci
- Pipeline Playwright per singolo URL on-demand
- Rischio legale ridotto, audit trail migliorato
