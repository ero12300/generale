# PortaLab — Configuratore porte per produzione

App web mobile-first per trasformare il rilievo del **foro muro (vano vuoto)** in una porta pronta
per la produzione.

## Cosa fa

1. Inserisci il **foro muro**: larghezza, altezza, spessore muro (in millimetri).
2. Scegli il **modello**: battente 1 anta, bussola 2 ante (anta apribile + semifissa), scorrevole a
   scomparsa, scorrevole esterno muro, va e vieni (ventola).
3. Imposta il **verso di apertura** (destra/sinistra, a spingere/a tirare): l'app deriva lato
   cerniere e lato maniglia.
4. Aggiungi le **opzioni**: pannello fisso laterale, display (sopraluce vetrato), oblò tondo o
   quadro.
5. L'app **calcola le misure** di produzione: anta, luce netta di passaggio, esterno telaio,
   controtelaio (opera morta), taglio vetro, numero cerniere, quota maniglia — con avvisi su misure
   fuori standard ed errori bloccanti se la porta non è producibile.
6. Genera la **scheda di produzione** con prospetto e pianta quotati (SVG), esportabile in
   **stampa/PDF** o **JSON**.
7. **Archivio commesse** locale (localStorage) per salvare e riaprire le configurazioni.

## Regole di calcolo (standard di settore porte interne)

Tutte le misure sono in **millimetri interi** (mai float).

| Grandezza | Regola |
|---|---|
| Luce passaggio / anta (battente) | foro muro − 100 mm in L (80 telaio + 20 posa), − 50 mm in H (40 telaio + 10 posa) |
| Esterno telaio | foro muro − aria di posa (− 20 L, − 10 H) |
| Controtelaio (opera morta) | = foro muro |
| Bussola 2 ante | luce totale divisa tra anta apribile e semifissa |
| Scorrevole a scomparsa | anta = luce + 50 mm (sormonto); ingombro controtelaio = 2·L + 110, H + 90 |
| Scorrevole esterno muro | anta = foro muro + 50 mm di sormonto per lato |
| Cerniere | 3 fino a 2200 mm di anta, 4 oltre |
| Maniglia | lato opposto ai cardini, quota standard 900 mm |
| Oblò | Ø/lato 200–500 mm, margine minimo 100 mm dai bordi anta |
| Muro | telaio standard 85–110 mm, oltre servono allargamenti |

Verso di apertura (convenzione italiana, guardando la porta dal lato a spingere): cardini a destra =
**porta destra**, cardini a sinistra = **porta sinistra**; movimento **a spingere** o **a tirare**.

## Sviluppo

```bash
pnpm install
pnpm --filter @portelab/web dev    # http://localhost:3002
pnpm --filter @portelab/web test   # test motore di calcolo (vitest)
pnpm --filter @portelab/web lint
pnpm --filter @portelab/web typecheck
```

> Le misure calcolate seguono gli standard più diffusi del settore (detrazione 100/50 mm): prima
> della messa in produzione verificare sempre le detrazioni specifiche del proprio sistema
> telaio/controtelaio.
