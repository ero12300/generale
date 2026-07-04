# PortaPro — Configuratore porte da produzione

App web mobile-first per trasformare le misure del **foro muro** (vano grezzo) in una
**porta pronta per la produzione**: anta, telaio, luce netta, mano di apertura e scheda
tecnica esportabile.

## Come funziona il calcolo

Tutte le misure sono in **millimetri**. Dal foro muro l'app detrae l'"opera morta":

```
Esterno telaio  = foro muro − aria di posa (10 mm/lato, regolabile)
Luce netta      = esterno telaio − montanti/traversi del telaio − eventuali fissi/sopraluce
Anta            = luce netta + battute (larghezza) + battuta − gioco pavimento (altezza)
```

I parametri (aria di posa, sezioni telaio, battuta, gioco pavimento) sono preimpostati per
porte **interne** e **d'ingresso** e regolabili nella sezione "Opera morta (avanzate)".

## Convenzione mano di apertura (DIN)

Ci si posiziona sul lato dal quale si vedono le **cerniere**:

- cerniere a destra → **mano destra**, maniglia a sinistra
- cerniere a sinistra → **mano sinistra**, maniglia a destra

Il verso (a **spingere** / a **tirare**) completa l'etichetta commerciale, es. "Destra a spingere".

## Funzioni

- Modello porta: interna / ingresso (detrazioni e spessore anta dedicati)
- Composizione: fisso laterale (sx / dx / entrambi), sopraluce fisso o **a compasso**
- Anta: display vetrato verticale, oblò ovale
- Avvisi automatici: luce netta minima DM 236/1989 (750/800 mm), anta pesante,
  telaio fuori standard, foro insufficiente
- Riconoscimento misure commerciali standard (60/70/80/90 × 200/210 cm)
- Anteprima in scala con quote, arco di apertura, cerniere e maniglia
- **Scheda di produzione**: stampa/PDF, export JSON, export disegno SVG
- Archivio locale sul dispositivo (localStorage)

## Sviluppo

```bash
pnpm install
pnpm dev:porte      # http://localhost:3002
pnpm test:porte     # test motore di calcolo (vitest)
```

## Struttura

```
src/lib/door-engine/   → tipi, validazione (zod), motore di calcolo + test
src/components/        → configuratore, schema SVG, scheda di produzione
src/lib/archivio.ts    → persistenza locale
```

> Le misure generate sono un supporto tecnico: verificare sempre in cantiere prima
> della messa in produzione.
