# AGENTS.md

Guida per agenti che lavorano su questo repository.

## Stato del repository

Al momento **generale** è un repository placeholder: contiene solo `README.md` (titolo `# generale`). Non ci sono:

- Codice applicativo
- Manifest delle dipendenze (`package.json`, `pyproject.toml`, `requirements.txt`, ecc.)
- Script di build, test o avvio
- `docker-compose`, `Makefile`, CI o configurazione `.devcontainer`

Non è possibile eseguire lint, test o un'applicazione finché non viene aggiunto codice e documentazione di setup.

## Cursor Cloud specific instructions

### Ambiente VM

La VM Cloud Agent include già:

- **Node.js** (v22 via nvm) con `npm` e `pnpm`
- **Python 3.12** con `pip3`
- **Git**

Non sono richiesti comandi di installazione all'avvio finché il repository resta vuoto. Lo script di update VM è un no-op (`true`).

### Servizi

| Servizio | Stato | Note |
|----------|--------|------|
| Applicazione | Assente | Nessun entrypoint definito |
| Database / Redis | Assente | Nessuna configurazione nel repo |
| Docker | Non verificato | Aggiungere `docker-compose` se servono servizi locali |

### Quando verrà aggiunto codice

1. Aggiornare lo **update script** VM con i comandi di refresh dipendenze (es. `npm install`, `pip install -r requirements.txt`) — **non** includere avvio server, migrazioni o build.
2. Documentare in `README.md` come avviare l'app in dev (comando, porta, variabili d'ambiente).
3. Aggiornare questa sezione con servizi obbligatori/opzionali e eventuali gotcha (es. hot-reload che non rileva nuove dipendenze).

### Lint / test / run

Finché non esistono script nel repo, non ci sono comandi standard. Dopo l'aggiunta del codice, fare riferimento a `package.json` scripts, `Makefile` o `README.md`.

### Git

- Branch principale: `main`
- Per nuovi branch agent: `cursor/<nome-descrittivo>-bb46`
