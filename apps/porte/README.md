# PorteForge

Configuratore web (mobile-first) per porte da produzione — standard italiano.

Dal vano murario alla porta pronta per la produzione: calcolo automatico di controtelaio, luce di passaggio e anta; configurazione di bussola (fisso laterale), sopraluce (fisso superiore), specchiatura, ovale, mano e verso di apertura; esportazione in SVG, PNG e PDF con distinta di produzione.

## Comandi

```bash
# Dal root del monorepo
pnpm --filter @porteforge/web dev        # dev server su http://localhost:3002
pnpm --filter @porteforge/web build      # build produzione
pnpm --filter @porteforge/web test       # test unitari (Vitest)
pnpm --filter @porteforge/web lint
pnpm --filter @porteforge/web typecheck

# Alias comodi al root
pnpm dev:porte
pnpm build:porte
pnpm test:porte
```

## Formule di calcolo

Standard medio industria italiana per porte battenti interne:

```
CT_L = VM_L - 2 · gioco_posa_laterale       (default 2 · 10 = 20 mm)
CT_H = VM_H - gioco_posa_superiore          (default 10 mm)
LP_L = CT_L - 120 - fisso_laterale
LP_H = CT_H - 60  - fisso_superiore
A_L  = LP_L + 40                             (sormonto/battuta larghezza)
A_H  = LP_H + 10                             (sormonto/battuta altezza)
```

- **VM** = vano murario (larghezza × altezza), apertura grezza nel muro
- **CT** = controtelaio (ingombro esterno della struttura da murare)
- **LP** = luce di passaggio netta (attraversamento a porta installata)
- **A**  = anta grezza (misure di produzione del pannello porta)

Taglie standard di produzione (Italia): 600, 700, 750, 800, 850, 900, 1000 mm — H 2100 (standard), 2200, 2400.

## Sigla mano + verso (UNI EN 12519)

- **DT** — Destra Tirare (cerniere a destra, apre verso l'osservatore)
- **DS** — Destra Spingere
- **ST** — Sinistra Tirare
- **SS** — Sinistra Spingere

## Persistenza

I progetti sono salvati in `localStorage` del browser (chiave `porteforge.progetti.v1`). Non c'è backend richiesto per l'uso base.
