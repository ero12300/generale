# ✂️ BarberOS — Il gestionale premium per barbieri

Web app completa per il tuo barbershop, pensata per essere **venduta in abbonamento** ad altri barbieri (modello SaaS):

- **Vetrina premium** — landing page elegante nero/oro con i tuoi servizi
- **Prenotazioni online** — i clienti scelgono servizio, giorno e orario da soli
- **Registro incassi** — totali di oggi, settimana e mese, con storico movimenti
- **Database clienti** — rubrica con note, preferenze e codice "porta un amico" personale
- **Campagne sconto** — codici sconto e programma referral integrati nella prenotazione
- **Abbonamento Base / Pro** — limiti sul piano gratuito, upgrade a pagamento con **Stripe**

## Come funziona la monetizzazione

| | Base (gratis) | Pro (29€/mese) |
|---|---|---|
| Prenotazioni online | ✓ (max 60/mese) | ✓ illimitate |
| Registro incassi | ✓ | ✓ |
| Clienti in rubrica | max 50 | illimitati |
| Campagne sconto e referral | — | ✓ |

Il piano gratuito fa provare il prodotto; quando il salone cresce, i limiti spingono
all'upgrade. Il pagamento avviene con **Stripe Checkout** (abbonamento mensile
ricorrente): tu incassi automaticamente ogni mese.

## Modalità demo (zero configurazione)

Senza chiavi Firebase/Stripe l'app parte in **modalità demo**: i dati vengono
salvati nel browser e il pagamento Pro è simulato. Perfetta per provare tutto
subito:

```bash
cd barber-os
npm install
npm run dev
# apri http://localhost:3100
```

## Guida al deploy in produzione (passo-passo)

### 1. Firebase (database dei dati reali)

1. Vai su [console.firebase.google.com](https://console.firebase.google.com) e crea un progetto (es. "barber-os").
2. Menu **Build → Firestore Database → Crea database** (modalità produzione, region `europe-west`).
3. In **Impostazioni progetto → Le tue app → icona web `</>`** registra l'app e copia i valori di configurazione.
4. Incollali nel file `.env` (copia `.env.example` in `.env.local`).
5. In **Firestore → Regole** incolla il contenuto di `firestore.rules` e pubblica.

### 2. Stripe (per farti pagare l'abbonamento Pro)

1. Crea un account su [dashboard.stripe.com](https://dashboard.stripe.com).
2. **Catalogo prodotti → Aggiungi prodotto**: nome "BarberOS Pro", prezzo ricorrente 29€/mese. Copia l'**ID prezzo** (`price_...`) in `STRIPE_PRICE_PRO_MONTHLY`.
3. **Sviluppatori → Chiavi API**: copia la **chiave segreta** (`sk_...`) in `STRIPE_SECRET_KEY`.
4. **Sviluppatori → Webhook → Aggiungi endpoint**: URL `https://TUO-DOMINIO/api/stripe-webhook`, eventi `checkout.session.completed` e `customer.subscription.deleted`. Copia la **chiave segreta del webhook** (`whsec_...`) in `STRIPE_WEBHOOK_SECRET`.

### 3. Vercel (hosting)

1. Vai su [vercel.com](https://vercel.com), importa questo repository.
2. Imposta **Root Directory** = `barber-os`.
3. In **Settings → Environment Variables** inserisci tutte le variabili del file `.env.example`.
4. Deploy: in 2 minuti l'app è online con dominio `*.vercel.app` (puoi collegare il tuo dominio).

## Comandi

```bash
npm run dev        # sviluppo su http://localhost:3100
npm run build      # build di produzione
npm run typecheck  # controllo tipi TypeScript
```

## Struttura

```
src/app/               → pagine (landing, /prenota, /admin/*)
src/app/api/           → API Stripe (checkout + webhook)
src/components/        → componenti UI
src/lib/types.ts       → schema dati + validazione (zod)
src/lib/plans.ts       → piani Base/Pro e limiti
src/lib/store/         → data layer: demo (localStorage) o Firestore
firestore.rules        → regole di sicurezza Firestore
```

## Note importanti

- Gli importi sono gestiti **in centesimi** (interi), mai in virgola mobile.
- In produzione aggiungi **Firebase Authentication** per proteggere l'area `/admin`
  (attualmente pensata per uso interno del titolare).
- Il webhook Stripe è il punto dove attivare/disattivare il piano Pro sul database
  quando un abbonato paga o disdice.
