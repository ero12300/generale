# PortaPro — Configuratore porte per la produzione

Web app mobile-first: inserisci il **foro muro** (vano), scegli il **modello di porta** e le opzioni, e ottieni la **scheda di produzione** con schema tecnico, misure anta già detratte, verso di apertura e posizione maniglia.

## Funzionalità

- **4 modelli**: battente classic (legno), filo muro (rasomuro), tagliafuoco REI 60 e REI 120, ognuno con le proprie detrazioni foro muro → luce telaio → anta, limiti dimensionali e opzioni ammesse.
- **1 o 2 ante**, con anta secondaria **a compasso (semifissa)** o **fissa** e ripartizione simmetrica/asimmetrica.
- **Verso di apertura DX/SX** (convenzione italiana: guardando dal lato a spingere, il verso è il lato cerniere; la maniglia è sul lato opposto), a spingere o a tirare.
- **Oblò** tondo oppure ovale e **vetrina/display**, con taglie e vincoli di bordo calcolati sull'anta (limite certificazione REI: oblò non ammesso a 1 anta con FM L > 1167 mm).
- **Controtelaio (opera morta)** calcolato con tolleranza di posa.
- **Schema tecnico SVG** con quote, cerniere, maniglia e arco di apertura.
- **Export**: stampa/PDF dal browser e download JSON per i sistemi di produzione.
- **Archivio commesse** in localStorage.

Tutte le misure sono in **millimetri interi** — nessun float.

## Comandi

```bash
pnpm install
pnpm --filter @porte/web dev      # http://localhost:3002
pnpm --filter @porte/web test     # unit test motore di calcolo
pnpm --filter @porte/web build
```

## Fonti tecniche (analisi web)

- Guide misure porte interne (Porte in kit, Ermetika, DoorSelf): luce passaggio ≈ FM − 100 mm (L) e − 50 mm (H).
- Manuale porte interne FederlegnoArredo: rilievo in 3 punti, pavimento finito, controtelaio.
- Cataloghi porte tagliafuoco (Ninz Univer/Proget, Ballan, Italserranda): anta semifissa con leva di sblocco, oblò tondi/rettangolari con vincoli di certificazione, chiudiporta consigliato con oblò.
- Convenzioni verso apertura DX/SX (Garofoli, Dako): destra a spingere = cerniere a destra, maniglia a sinistra.

> Le detrazioni dei modelli sono parametri di default modificabili in `src/domain/modelli.ts` per adattarli ai profili reali del proprio telaio.
