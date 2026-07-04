# PortaLab — Configuratore porte per la produzione

App web **mobile-first** che, a partire dalla misura del **foro muro** (vano al morto),
calcola la porta pronta per la produzione: luce di passaggio, anta finita, verso di
apertura (mano cerniere / lato maniglia secondo DIN 107), sopraluce, anta fissa,
bussola e oblò/vetro. Genera uno **schema tecnico** esportabile in PDF, SVG, PNG e
una **scheda di produzione** in JSON.

## Come funziona il calcolo

1. **Foro muro** → si misura il vano grezzo (al morto) in millimetri.
2. **Luce di passaggio** = foro − deduzioni telaio/controtelaio del modello.
3. **Anta finita** = luce − giochi di posa (sempre più piccola del foro).
4. **Opzioni**: il sopraluce riduce l'altezza dell'anta, l'anta fissa/bussola
   riducono la larghezza disponibile per l'anta mobile.
5. **Verso**: la mano indica il lato cerniere; la maniglia è sul lato opposto.

I parametri di deduzione hanno default derivati dalle schede tecniche dei principali
produttori italiani e sono **modificabili** dall'utente esperto (override avanzato).

## Modelli inclusi

- Battente classica (telaio + coprifilo)
- Battente filo muro (telaio a scomparsa)
- Bussola vetrata con sopraluce
- Scorrevole esterno muro
- Scorrevole a scomparsa (controtelaio)

## Sviluppo

```bash
pnpm --filter @porte/web dev     # http://localhost:3002
pnpm --filter @porte/web test    # test motore di calcolo + schema
pnpm --filter @porte/web lint
pnpm --filter @porte/web typecheck
pnpm --filter @porte/web build
```

## Architettura

- `src/lib/types.ts` — tipi di dominio + validazione zod
- `src/lib/catalog.ts` — catalogo modelli e parametri di deduzione
- `src/lib/engine.ts` — motore di calcolo (foro → luce → anta)
- `src/lib/scheme.ts` — generatore schema tecnico SVG
- `src/lib/export.ts` — export SVG/PNG/JSON + stampa PDF
- `src/lib/storage.ts` — salvataggio schede su `localStorage`
- `src/components/configurator.tsx` — interfaccia del configuratore

> Misure in millimetri interi (nessun float) per evitare errori di arrotondamento.
