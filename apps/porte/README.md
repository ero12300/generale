# PortaCalc — Configuratore porte per la produzione

App web mobile-first che, partendo dal **foro muro** (il vano vuoto), calcola tutte le
misure di produzione di una porta: controtelaio, luce di passaggio e **anta finita**,
determina il **verso di apertura** (destra/sinistra, cerniere e maniglia) e genera uno
**schema esportabile** pronto per la produzione.

## Funzioni

- **Input foro muro**: larghezza, altezza, spessore muro (mm).
- **Sistemi porta**: battente standard, battente filo muro, scorrevole esterno muro,
  scorrevole a scomparsa. Ogni sistema ha le proprie deduzioni configurabili.
- **Catena di calcolo**: `foro muro → controtelaio → luce controtelaio → luce di
  passaggio → anta`. L'anta risulta sempre più piccola del foro (entra nell'opera morta).
- **Verso di apertura**: lato cerniere + senso (tiro/spinta) → maniglia sul lato opposto,
  convenzione DIN e indicazione "Porta destra/sinistra".
- **Accessori**: bussola (doppia anta), fisso laterale, sopraluce, anta vetrata, ovale.
- **Schema SVG**: prospetto con quote, cerniere, maniglia, verso e accessori.
- **Export**: JSON della commessa e **scheda di produzione** stampabile in PDF (A4).
- **Progetti**: salvataggio locale (localStorage) di più commesse.

## Sviluppo

```bash
# dalla root del monorepo
pnpm install
pnpm dev:porte        # http://localhost:3002

# oppure
pnpm --filter @porte/web dev
```

## Qualità

```bash
pnpm --filter @porte/web typecheck
pnpm --filter @porte/web lint
pnpm --filter @porte/web test     # test del motore di calcolo (vitest)
```

## Note tecniche

- Il motore di calcolo (`src/lib/door/engine.ts`) è composto da funzioni pure e testate.
- Le misure sono in **millimetri interi** (`Math.round`).
- Le deduzioni di default sono basate sulle prassi di posa comuni per porte interne;
  vanno verificate con le schede tecniche del produttore e sono personalizzabili per
  sistema in `src/lib/door/systems.ts`.
