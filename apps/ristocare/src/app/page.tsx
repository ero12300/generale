import Link from "next/link";
import {
  QrCode,
  Ticket,
  ShieldCheck,
  FileText,
  Wrench,
  Bell,
  ArrowRight,
  Check,
} from "lucide-react";

const PLANS = [
  {
    id: "start",
    name: "RistoCare Start",
    price: "49 €/mese",
    setup: "Setup da 300 €",
    target: "Piccoli bar, take away, locali semplici",
    features: [
      "Fino a 10 attrezzature",
      "Scheda digitale + QR code",
      "Archivio documenti, manuali, fatture",
      "Scadenza garanzia e promemoria base",
      "Apertura ticket e storico segnalazioni",
      "Supporto email",
    ],
    highlighted: false,
  },
  {
    id: "pro",
    name: "RistoCare Pro",
    price: "99 €/mese",
    setup: "Setup da 700 €",
    target: "Ristoranti, pizzerie, gelaterie, pasticcerie",
    features: [
      "Fino a 30 attrezzature",
      "QR code per ogni macchina",
      "Ticket assistenza con priorità media",
      "Gestione ricambi e promemoria manutenzioni",
      "Report mensile e dashboard costi",
      "Assistente telefonico per apertura richiesta",
      "Gestione fornitori tecnici da centrale RistoCare",
    ],
    highlighted: true,
  },
  {
    id: "premium",
    name: "RistoCare Premium",
    price: "199 €/mese",
    setup: "Setup da 1.500 €",
    target: "Locali strutturati e ad alto volume",
    features: [
      "Fino a 70 attrezzature, multi-area",
      "Ticket prioritari e assistente dedicato",
      "Report mensile dettagliato e analisi costi",
      "Piano sostituzione attrezzature",
      "Supporto WhatsApp Business",
      "Fascicolo tecnico locale + esportazione PDF",
      "Procedure operative per dipendenti",
    ],
    highlighted: false,
  },
  {
    id: "enterprise",
    name: "RistoCare Enterprise",
    price: "Su preventivo",
    setup: "Multi-sede",
    target: "Catene, franchising, gruppi con più locali",
    features: [
      "Multi-sede e utenti illimitati",
      "Dashboard direzionale",
      "Confronto costi tra sedi",
      "SLA dedicato e account manager",
      "Listino ricambi personalizzato",
      "Integrazione con software esterni",
    ],
    highlighted: false,
  },
];

const SOLUTION_POINTS = [
  { icon: Ticket, text: "Apri un ticket in pochi secondi" },
  { icon: FileText, text: "Trovi manuale e matricola" },
  { icon: ShieldCheck, text: "Controlli la garanzia" },
  { icon: Wrench, text: "Richiedi ricambi" },
  { icon: Bell, text: "Programmi manutenzioni" },
  { icon: QrCode, text: "Conservi lo storico interventi" },
];

const STEPS = [
  "Digitalizziamo il tuo locale",
  "Censiamo le attrezzature",
  "Creiamo i QR code",
  "Attiviamo il portale",
  "Gestiamo ticket, ricambi e manutenzioni",
];

const TARGETS = [
  "Bar",
  "Ristoranti",
  "Gelaterie",
  "Pizzerie",
  "Pasticcerie",
  "Locali food",
  "Catene",
];

export default function HomePage() {
  return (
    <div>
      <header className="bg-ink text-white">
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
          aria-label="Principale"
        >
          <Link href="/" className="text-lg font-semibold tracking-tight">
            RistoCare <span className="text-gold">OS</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <a href="#pacchetti" className="hidden text-stone-300 hover:text-white sm:block">
              Pacchetti
            </a>
            <Link href="/referral" className="hidden text-stone-300 hover:text-white sm:block">
              Diventa partner
            </Link>
            <Link
              href="/app"
              className="rounded-full bg-gold px-4 py-2 font-medium text-ink hover:bg-gold/90"
            >
              Area cliente
            </Link>
          </div>
        </nav>

        <div className="mx-auto max-w-6xl px-6 pb-24 pt-16">
          <p className="mb-4 inline-flex rounded-full border border-stone-600 px-3 py-1 text-xs uppercase tracking-widest text-stone-300">
            Brand dedicato di Emotive S.r.l. — Messina e provincia
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Il passaporto digitale delle attrezzature del tuo ristorante
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-stone-300">
            Con RistoCare OS gestisci garanzie, manuali, matricole, ticket, manutenzioni,
            ricambi e interventi tecnici da un unico portale.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contatti"
              className="inline-flex items-center gap-2 rounded-full bg-tech px-6 py-3 font-medium text-white hover:bg-tech/90"
            >
              Richiedi una demo <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="#contatti"
              className="inline-flex items-center gap-2 rounded-full border border-stone-500 px-6 py-3 font-medium text-white hover:border-white"
            >
              Digitalizza il tuo locale
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20" aria-labelledby="problema">
        <h2 id="problema" className="max-w-2xl text-3xl font-semibold tracking-tight">
          Quando una macchina si ferma, il problema non è solo il guasto. È il caos.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-warmgray">
          Manuali introvabili, garanzie scadute, matricole mancanti, foto su WhatsApp,
          tecnici da chiamare, preventivi da rincorrere e dipendenti che non sanno cosa fare.
        </p>
      </section>

      <section className="bg-white py-20" aria-labelledby="soluzione">
        <div className="mx-auto max-w-6xl px-6">
          <h2 id="soluzione" className="text-3xl font-semibold tracking-tight">
            Con RistoCare OS ogni attrezzatura ha il suo QR code
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTION_POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-4 rounded-xl border border-stone-200 p-5">
                <span className="rounded-lg bg-tech-soft p-2 text-tech">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="font-medium">{text}</span>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-lg font-medium text-ink">
            Meno caos. Meno fermi macchina. Più controllo. Più ordine nella gestione tecnica del tuo locale.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20" aria-labelledby="come-funziona">
        <h2 id="come-funziona" className="text-3xl font-semibold tracking-tight">
          Come funziona
        </h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, i) => (
            <li key={step} className="rounded-xl bg-white p-5 shadow-sm">
              <span className="text-sm font-semibold text-gold">0{i + 1}</span>
              <p className="mt-2 font-medium">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-ink py-20 text-white" aria-labelledby="pacchetti">
        <div className="mx-auto max-w-6xl px-6">
          <h2 id="pacchetti" className="text-3xl font-semibold tracking-tight">
            Pacchetti
          </h2>
          <p className="mt-2 text-stone-400">
            Il portale è incluso. Interventi tecnici, ricambi e attività fuori garanzia sono preventivati separatamente.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={
                  plan.highlighted
                    ? "rounded-2xl border-2 border-gold bg-ink-soft p-6"
                    : "rounded-2xl border border-stone-700 bg-ink-soft p-6"
                }
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-2xl font-semibold text-gold">{plan.price}</p>
                <p className="text-sm text-stone-400">{plan.setup}</p>
                <p className="mt-3 text-sm text-stone-300">{plan.target}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-tech" aria-hidden />
                      <span className="text-stone-200">{f}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20" aria-labelledby="per-chi">
        <h2 id="per-chi" className="text-3xl font-semibold tracking-tight">
          Per chi è
        </h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {TARGETS.map((t) => (
            <li
              key={t}
              className="rounded-full border border-stone-300 bg-white px-5 py-2 font-medium"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-gold-soft py-20" aria-labelledby="contatti" id="contatti">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 id="contatti-titolo" className="text-3xl font-semibold tracking-tight">
            Vuoi sapere quanto costa digitalizzare il tuo locale?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-warmgray">
            Sopralluogo, censimento attrezzature, QR code e attivazione del portale.
            Offerta lancio per i primi 10 locali di Messina.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:info@ristocare.it?subject=Richiesta%20preventivo%20RistoCare%20OS"
              className="rounded-full bg-ink px-6 py-3 font-medium text-white hover:bg-ink-soft"
            >
              Richiedi preventivo
            </a>
            <a
              href="mailto:info@ristocare.it?subject=Prenotazione%20sopralluogo"
              className="rounded-full border border-ink px-6 py-3 font-medium text-ink hover:bg-white"
            >
              Prenota sopralluogo
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-ink py-10 text-sm text-stone-400">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6">
          <p>
            RistoCare OS — Brand dedicato di Emotive S.r.l. · Messina
          </p>
          <div className="flex gap-6">
            <Link href="/referral" className="hover:text-white">
              Referral partner
            </Link>
            <Link href="/app" className="hover:text-white">
              Area cliente
            </Link>
            <Link href="/admin" className="hover:text-white">
              Centrale operativa
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
