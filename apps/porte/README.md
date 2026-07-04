# PortaPronta — Configuratore porte per la produzione

App mobile-first per falegnamerie/serramentisti: dal **foro muro** alla **porta
pronta da produrre**. Inserisci le misure del vano, scegli il modello e gli
optional, e ottieni le misure dell'anta già calcolate, il senso di apertura, il
lato maniglia e una **scheda di produzione esportabile** (stampa / PDF).

## Cosa calcola

Partendo dal foro muro (o dalla luce desiderata per le scomparse):

- **Anta** da mandare in produzione (misura ridotta rispetto al foro)
- **Telaio** (ingombro) e **luce di passaggio** effettiva
- **Profondità telaio** consigliata in base allo spessore muro
- **Ingombro totale** (utile per scorrevoli e scomparse)
- **Verso di apertura** (cerniere DX/SX) e **lato maniglia** (opposto)
- **Spinge / tira** e altezza maniglia consigliata
- Optional: **compasso**, **anta fissa**, **vetro/vetrata**, **oblò** (tondo/ovale)

Le detrazioni sono basate sugli standard di mercato italiani (es. anta ≈ foro
muro − 100 mm in larghezza e − 50 mm in altezza per le battenti) e sono
**editabili** in `src/lib/models.ts` per adattarle al proprio sistema.

## Sistemi supportati

- Battente (classica, vetrata)
- A compasso (bagni / locali tecnici)
- Scorrevole esterno muro
- Scorrevole a scomparsa

## Sviluppo

```bash
pnpm install
pnpm --filter @porte/web dev      # http://localhost:3002
pnpm --filter @porte/web test     # test motore di calcolo
pnpm --filter @porte/web lint
pnpm --filter @porte/web typecheck
pnpm --filter @porte/web build
```

## Architettura

- `src/lib/types.ts` — tipi e schema dati (misure in **mm interi**, niente float)
- `src/lib/models.ts` — catalogo modelli e detrazioni tarabili
- `src/lib/calc.ts` — motore di calcolo geometrico + validazione `zod`
- `src/lib/calc.test.ts` — test unitari (vitest)
- `src/components/door-schematic.tsx` — schema tecnico SVG
- `src/components/scheda-produzione.tsx` — scheda stampabile (A4)
- `src/components/configuratore.tsx` — UI mobile-first

I dati degli ordini sono salvati in `localStorage` (nessun backend richiesto).
