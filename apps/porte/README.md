# PortePro — Configuratore porte interne

App web mobile-first per configurare porte interne partendo dal foro muro e
generare la scheda di produzione stampabile.

## Cosa fa

1. Inserisci le misure del **foro muro** (larghezza × altezza) e lo **spessore del muro finito**.
2. Scegli il **modello** (battente, filo muro, scorrevole esterno, scorrevole a scomparsa).
3. Configura le opzioni: **bussola**, **pannello fisso**, **sopraluce**, **vetro** (nessuno, rettangolare, ovale, oblò tondo), **coprifilo** (dritto, telescopico, nessuno).
4. Definisci **lato maniglia** (DX/SX) e **verso apertura** (spinta/tira).
5. L&apos;app calcola in tempo reale **anta**, **telaio**, **coprifilo**, **luce netta di passaggio** e disegna lo **schema tecnico** con quotature, cerniere, maniglia e arco di apertura.
6. Salva l&apos;ordine ed esporta la **scheda di produzione** in A4 (stampa/PDF via browser).

## Standard tecnici utilizzati

Basato su:

- **DM 236/1989** (luce netta minima 75 cm interni, 80 cm ingresso).
- Convenzioni produttori italiani (Eclisse, Pivato, Bertolotto): telaio 33 mm, battuta 12 mm, anta spessore 44 mm, coprifilo dritto 70 mm, coprifilo telescopico passo 15 mm fino a 580 mm.
- Formule: foro muro larghezza ≈ anta + 10 cm, altezza ≈ anta + 5 cm.

## Comandi

```bash
# Install (dalla root del monorepo)
pnpm install

# Dev (porta 3002)
pnpm --filter @portepro/web dev

# Build
pnpm --filter @portepro/web build

# Lint / typecheck
pnpm --filter @portepro/web lint
pnpm --filter @portepro/web typecheck
```

## Persistenza

Gli ordini sono salvati in `localStorage` sul dispositivo (chiave `portepro.ordini.v1`).
Non è previsto un backend: l&apos;app è pensata per l&apos;uso rapido in cantiere.

Per aggiungere sincronizzazione multi-dispositivo o multi-utente, integrare
Supabase / Firebase seguendo il pattern delle altre app del monorepo.

## Roadmap possibile

- Sincronizzazione cloud multi-utente (Supabase con RLS per organization).
- Catalogo modelli/finiture del produttore selezionato.
- Export CSV per gestionale.
- Foto del cantiere allegate all&apos;ordine.
- Doppia anta e ante &quot;bugnate&quot; personalizzate.
- Autenticazione + ruoli (venditore / produzione).
