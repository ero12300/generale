# RistoProfit OS

> Il cruscotto economico del ristoratore — di **Emotive S.r.l.** (Messina)

RistoProfit OS è una piattaforma SaaS che aiuta ristoranti, bar, pizzerie e
gelaterie a capire **quanto guadagnano davvero su ogni piatto**: food cost,
margini, menu engineering, fornitori, magazzino, personale e report giornalieri.

È un **programma separato** dall'app immobiliare presente nel resto del
repository e dal futuro `RistoCare OS` (assistenza/attrezzature). È però
progettato per integrarsi un domani nella suite `RistoSuite OS`.

---

## 1. Cosa c'è in questa cartella (per chi non programma)

Pensa a questa cartella come a una "scatola" che contiene tutto il programma.

| Cartella / file | A cosa serve |
|---|---|
| `src/app/` | Le **pagine** del sito e dell'area cliente |
| `src/components/` | I **pezzi riutilizzabili** dell'interfaccia (bottoni, schede, ecc.) |
| `src/lib/` | Il **motore di calcolo** (food cost, menu) e i dati di esempio |
| `public/` | Icone e file della **PWA** (l'app installabile sul telefono) |
| `docs/spec.md` | Il **documento operativo** completo (vendita, prezzi, referral, roadmap) |

Non devi modificare il codice per provarlo: bastano i comandi della sezione 3.

---

## 2. Cosa puoi già fare nella demo

- **Sito pubblico** (`/`): presentazione, problema, soluzione, prezzi.
- **Login demo** (`/login`): finto accesso (in produzione: Supabase Auth).
- **Dashboard** (`/dashboard`): incasso, margine, food cost, scorte, azioni.
- **Food Cost** (`/food-cost`): **calcolatore interattivo** — cambia gli
  ingredienti e vedi subito food cost %, margine e prezzo consigliato.
- **Ricette** (`/ricette`): elenco con food cost e margine di ogni piatto.
- **Menu Engineering** (`/menu`): classificazione Star / Puzzle / Cavallo / Dog.
- **Report giornaliero** (`/report`): il riepilogo serale del titolare.

La demo usa dati di esempio in memoria: nessun database richiesto.

---

## 3. Come avviarlo (passo-passo)

Requisiti: **Node.js 20+** e **pnpm** (o npm).

```bash
# 1. Entra nella cartella del programma
cd ristoprofit-os

# 2. Installa le dipendenze (una volta sola)
pnpm install

# 3. Avvia in modalità sviluppo (porta 3100)
pnpm dev
```

Poi apri il browser su **http://localhost:3100**.

> La porta è 3100 per non entrare in conflitto con l'altra app del repository
> (che usa la 3000).

---

## 4. Comandi utili

```bash
pnpm dev         # avvia in sviluppo (porta 3100)
pnpm build       # crea la versione di produzione
pnpm start       # avvia la versione di produzione
pnpm test        # esegue i test del motore di calcolo
pnpm typecheck   # controlla i tipi TypeScript
pnpm lint        # controlla lo stile del codice
```

---

## 5. Come funziona il calcolo (in breve)

- Tutti gli importi sono gestiti in **centesimi interi** (`src/lib/money.ts`),
  per evitare gli errori di arrotondamento della virgola mobile sui soldi.
- Il motore **Food Cost** (`src/lib/food-cost.ts`) calcola costo per porzione,
  food cost %, margine, prezzo minimo/ideale e uno **stato** (ottimo/buono/
  attenzione/critico) con relativo alert.
- Il motore **Menu Engineering** (`src/lib/menu-engineering.ts`) classifica i
  prodotti in Star, Puzzle, Cavallo da lavoro e Dog.
- Il **Report giornaliero** (`src/lib/report.ts`) unisce i dati del giorno in un
  riepilogo con azioni consigliate.

Questi motori sono **funzioni pure** e coperte da test: domani potranno essere
spostati in un servizio dedicato senza riscrivere l'interfaccia.

---

## 6. Stack tecnico

- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS 4** (tema scuro: antracite, verde profitto, oro)
- **PWA** installabile (`public/manifest.webmanifest`)
- **Vitest** per i test
- Pronto per **Supabase** (Postgres + Auth + Storage + RLS) e **Vercel** in
  produzione (vedi `docs/spec.md`, sez. 10–12).

---

## 7. Roadmap (sintesi)

1. **MVP** (questa demo): sito, login, dashboard, food cost, ricette, menu,
   report, PWA.
2. **Vendibile**: upload fatture, storico prezzi, magazzino, personale,
   provvigioni venditori, referral, notifiche email.
3. **Automazioni**: lettura fatture con AI, report automatico, WhatsApp, Stripe.
4. **Integrazione** con RistoCare OS dentro RistoSuite OS.

Il documento operativo completo (vendita, prezzi, referral, script venditori,
strategia di lancio a Messina) è in **[`docs/spec.md`](./docs/spec.md)**.

---

> «RistoProfit OS Le fa vedere dove guadagna, dove perde e cosa deve correggere
> per migliorare il risultato del Suo locale.»
