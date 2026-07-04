# PortaPro — Configuratore porte su misura

App web **mobile-first** per falegnami/serramentisti: dal **foro muro** calcola tutte le
misure della porta (controtelaio, telaio, luce di passaggio, anta) riducendo stadio per
stadio fino a far entrare la porta nell'opera muraria, e genera una **scheda pronta per la
produzione**.

## Cosa fa

- **Input**: foro muro (larghezza × altezza), spessore muro, sistema di apertura
  (battente, scorrevole esterno, scorrevole a scomparsa).
- **Verso e maniglia**: lato cerniere → **DIN SX/DX** (norma DIN 107), maniglia sul lato
  opposto, verso a tirare/spingere.
- **Opzioni modello**: anta fissa laterale, sopraluce, specchiatura vetrata, oblò
  (ovale / tondo / rettangolare).
- **Output**: schema in vista prospetto (SVG con cerniere, maniglia, simbolo di apertura),
  distinta di produzione in mm, misura standard più vicina, avvisi (fuori misura,
  spessore muro oltre standard), export **Stampa/PDF** e **copia scheda** testuale.

## Motore di calcolo

Catena dimensionale (millimetri interi, nessun float):

```
foro muro → controtelaio → telaio esterno → luce passaggio → anta
```

I giochi e gli spessori sono parametri **configurabili** (default coerenti con il mercato
italiano: telaio 40 mm/lato, giochi muratura/telaio/anta standard). Il codice del motore è
in `src/lib/door/engine.ts` con test in `src/lib/door/engine.test.ts`.

## Sviluppo

```bash
# dalla root del monorepo
pnpm install
pnpm dev:porte      # http://localhost:3002
pnpm build:porte
pnpm test:porte     # test motore (vitest)
```

> Nota: le convenzioni di calcolo (giochi/spessori) sono modificabili in
> `src/lib/door/types.ts` → `PARAMETRI_DEFAULT` e dalla sezione "Parametri avanzati"
> dell'app, per adattarle al proprio fornitore/sistema.
