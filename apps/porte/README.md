# PortePro — Gestione Porte da Foro Muro

App mobile-first per calcolare porte interne partendo dal foro muro e generare schemi tecnici per la produzione.

**Deploy:** Vercel · **Database:** Firebase Firestore

## Funzionalità

1. **Inserimento foro muro** — larghezza, altezza, spessore muro (luce netta vano)
2. **Lavoro morto** — margini configurabili (standard -10 cm larghezza, -5 cm altezza)
3. **Modelli porta** — battente, bussola, fissa, scorrevole; con/senza display, oblò ovale, anta fissa
4. **Senso apertura** — destra/sinistra, tirare/spingere; calcolo automatico posizione maniglia e cerniere
5. **Export produzione** — schema SVG con quote + JSON tecnico
6. **Persistenza cloud** — progetti salvati su Firebase (auth anonima), fallback localStorage in demo

## Sviluppo locale

```bash
pnpm install
cp apps/porte/.env.example apps/porte/.env.local   # opzionale, per Firebase
pnpm dev:porte    # http://localhost:3002
pnpm test:porte   # test motore calcolo
pnpm build:porte
```

Senza variabili Firebase l'app usa **localStorage** (modalità demo).

## Deploy Vercel + Firebase

Vedi [DEPLOY.md](./DEPLOY.md) per istruzioni complete.

```bash
pnpm provision:porte   # deploy automatico su Vercel (richiede VERCEL_TOKEN)
```

## Struttura dati Firestore

```
users/{userId}/projects/{projectId}
```

## Stack

- Next.js 15 + React 19
- Tailwind CSS 4
- Firebase Auth (anonima) + Firestore
- Vercel (hosting)
- Vitest (test calcoli)
