# @deal-desk/porte — Configuratore Porte per Produzione

Web app mobile-first per il calcolo dimensionale e la generazione di schede tecniche di porte interne, pronte per la produzione.

## Cosa fa

Dato il **foro muro** (vano grezzo nella parete), l'app calcola in automatico le dimensioni di:

- **Controtelaio** (dove previsto)
- **Telaio** (cornice fissa)
- **Anta / battente** (la porta vera e propria)
- **Luce di passaggio** (l'apertura netta effettiva)
- **Sopraluce** e **fisso laterale** (opzionali)

Genera lo **schema tecnico** SVG e la **scheda di produzione** stampabile / esportabile in PDF (via stampa browser).

## Tipologie supportate

- Porta a **battente** (una anta, con o senza controtelaio)
- Porta **scorrevole esterno muro** (con binario in vista)
- Porta **scorrevole a scomparsa** (con controtelaio metallico interno al muro)
- Porta **filo muro**
- Porta **pieghevole / a libro**

## Opzioni configurabili

- **Verso apertura** — Destra / Sinistra × Spingere / Tirare (convenzione DIN)
- **Posizione maniglia** — DX / SX (derivata dal verso, sovrascrivibile)
- **Sopraluce** — altezza personalizzabile (30 / 40 / 50 / 60 cm)
- **Fisso laterale** — a destra o a sinistra, larghezza personalizzabile
- **Oblò** — tondo o ovale
- **Controtelaio** — con / senza (solo battente e filo muro)

## Convenzioni tecniche

Basate su schede tecniche pubbliche di Eclisse, Ermetika, Garofoli, FIP Porte:

- Battente: `foro_muro_L ≈ anta_L + 100 mm`, `foro_muro_H ≈ anta_H + 60 mm`
- Scorrevole a scomparsa: `parete_L ≈ 2·anta_L + 110 mm`
- Verso apertura DIN: cerniere a destra = **DX**, cerniere a sinistra = **SX**

## Come si usa

```bash
# Da root del monorepo
pnpm install

# Dev server
pnpm --filter @deal-desk/porte dev
# apre su http://localhost:3002

# Test unitari (calcoli dimensioni)
pnpm --filter @deal-desk/porte test

# Build produzione
pnpm --filter @deal-desk/porte build
```

## Struttura

```
src/
├── app/              # Next.js App Router
│   ├── page.tsx      # configuratore mobile
│   └── scheda/       # scheda tecnica stampabile
├── components/
│   ├── porte/        # form + schema SVG
│   └── ui/           # bottoni, input, select
└── lib/porte/        # dominio: types, calcoli, presets
    ├── types.ts
    ├── calc.ts       # funzioni pure
    ├── calc.test.ts
    └── presets.ts
```

## Note

- I calcoli sono **regole di massima** valide per la maggior parte dei produttori italiani.
- Per commesse specifiche verificare sempre la scheda tecnica del produttore scelto.
- Le misure sono tutte in **millimetri** internamente; UI accetta cm o mm.
