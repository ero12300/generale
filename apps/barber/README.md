# BarberOS ✂️

Il gestionale **premium** per barbieri: prenotazioni online, gestione incassi, database clienti (CRM) e campagne di fidelizzazione. Pensato come **SaaS scalabile** con piani ad abbonamento (Start gratuito e Pro) monetizzati tramite **Stripe**.

Stack: **Next.js 15 (App Router) + React 19 + Tailwind CSS 4**, backend opzionale **Firebase** (Auth + Firestore), pagamenti **Stripe**. Deploy consigliato su **Vercel**.

## Funzionalità

| Modulo | Descrizione |
|--------|-------------|
| 🏠 Landing | Pagina marketing premium con listino prezzi |
| 📅 Prenotazioni online | Flusso pubblico `/prenota`: servizio → barbiere → data/ora → dati → conferma |
| 🗓️ Agenda / gestione | Conferma richieste, no-show, incasso, nuovo appuntamento interno |
| 💰 Incassi | Cassa giornaliera/settimanale/mensile, metodi di pagamento, transazioni |
| 👥 Clienti (CRM) | Storico spesa, visite, punti fedeltà, tier VIP, codice invito |
| 🎁 Campagne | Codici sconto + programma "Porta un amico" (Pro) |
| 💳 Abbonamento | Piani Start/Pro con checkout Stripe (fallback demo) |
| ⚙️ Impostazioni | Dati negozio, orari, listino servizi |

## Modalità demo

Senza variabili d'ambiente l'app parte in **modalità demo**: dati di esempio precaricati e salvati nel `localStorage` del browser, upgrade a Pro simulato. Perfetto per provare tutto subito.

## Sviluppo

```bash
# dalla root del monorepo
pnpm install
pnpm --filter @barberos/web dev      # http://localhost:3001
```

Altri comandi:

```bash
pnpm --filter @barberos/web test       # test unitari (vitest)
pnpm --filter @barberos/web typecheck  # controllo tipi
pnpm --filter @barberos/web lint       # eslint
pnpm --filter @barberos/web build      # build produzione
```

## Andare in produzione

1. **Firebase**: crea un progetto, attiva Authentication + Firestore e compila le variabili `NEXT_PUBLIC_FIREBASE_*`.
2. **Stripe**: crea un prodotto ricorrente per il piano Pro, copia il *Price ID* in `STRIPE_PRICE_PRO_MONTHLY`, imposta `STRIPE_SECRET_KEY` e configura il webhook (`STRIPE_WEBHOOK_SECRET`) verso `/api/stripe/webhook`.
3. **Vercel**: importa il repo, root `apps/barber`, aggiungi le variabili d'ambiente (vedi `.env.example`).

Vedi `.env.example` per l'elenco completo.

## Note architetturali

- **Importi monetari sempre in centesimi (interi)** — mai float — vedi `src/lib/money.ts`.
- Logica di business isolata in `src/lib` (store, analytics, slot, piani) e coperta da test.
- UI a stati (loading/empty/success) e navigazione accessibile da tastiera.
