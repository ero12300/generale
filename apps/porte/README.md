# PortePro — Gestione Porte da Foro Muro

App mobile-first per calcolare porte interne partendo dal foro muro e generare schemi tecnici per la produzione.

## Funzionalità

1. **Inserimento foro muro** — larghezza, altezza, spessore muro (luce netta vano)
2. **Lavoro morto** — margini configurabili (standard -10 cm larghezza, -5 cm altezza)
3. **Modelli porta** — battente, bussola, fissa, scorrevole; con/senza display, oblò ovale, anta fissa
4. **Senso apertura** — destra/sinistra, tirare/spingere; calcolo automatico posizione maniglia e cerniere
5. **Export produzione** — schema SVG con quote + JSON tecnico

## Calcoli

Basati su standard italiani (Federlegno, Micheloni Porte):

| Foro muro | Lavoro morto | Anta risultante |
|-----------|--------------|-----------------|
| 900 × 2150 mm | -100 / -50 mm | 800 × 2090 mm |

## Sviluppo

```bash
pnpm install
pnpm dev:porte    # porta 3002
pnpm test:porte   # test motore calcolo
```

## Stack

- Next.js 15 + React 19
- Tailwind CSS 4
- Vitest (test calcoli)
- localStorage per progetti salvati
