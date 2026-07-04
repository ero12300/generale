# Porte Pro — Configuratore porte da produzione

Web app mobile-first: dal rilievo del vano murario (foro grezzo) alla porta pronta per la produzione.

## Cosa fa

1. **Rilievo**: inserisci larghezza, altezza e spessore muro del vano.
2. **Modello e tipologia**: battente singola (bussola), doppia anta, battente + fianco fisso, scorrevole a scomparsa, scorrevole esterno muro.
3. **Verso di apertura**: lato cerniere destra/sinistra, a spingere o a tirare. La maniglia viene posizionata automaticamente sul lato opposto alle cerniere (convenzione: si guarda la porta dal lato in cui si apre verso di sé).
4. **Dotazioni**: sopraluce (vetrato/cieco), specchiatura vetrata, oblò.
5. **Calcolo**: anta/e, falso telaio ("opera morta"), telaio, luce di passaggio, ingombro controtelaio per le scorrevoli, con controllo dei range del modello e segnalazione delle misure standard (600/700/800/900 × 2100).
6. **Export**: scheda di produzione stampabile (PDF dal browser), schema SVG quotato con prospetto e pianta, dati JSON. Archivio locale delle commesse sul dispositivo.

## Comandi

```bash
pnpm --filter @porte/web dev        # http://localhost:3002
pnpm --filter @porte/web test       # test motore di calcolo (vitest)
pnpm --filter @porte/web lint
pnpm --filter @porte/web typecheck
pnpm --filter @porte/web build
```

## Struttura

```
src/lib/door/types.ts      # schema dati (misure in mm interi)
src/lib/door/models.ts     # catalogo modelli con detrazioni di produzione
src/lib/door/calc.ts       # motore di calcolo vano → scheda produzione
src/lib/door/validate.ts   # validazione input (zod)
src/lib/archive.ts         # archivio locale commesse (localStorage)
src/components/DoorDrawing.tsx  # schema SVG quotato (prospetto + pianta)
```

Le detrazioni di default seguono le convenzioni del mercato italiano (vano ≈ anta + 80 mm in
larghezza e + 45÷50 mm in altezza; scorrevole a scomparsa ≈ 2·L + 110 / H + 90) e sono definite
per modello in `models.ts`: adattale ai tuoi fornitori reali prima dell'uso in produzione.
