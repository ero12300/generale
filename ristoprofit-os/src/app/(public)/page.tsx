import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  ChefHat,
  FileText,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { PLANS } from "@/lib/plans";
import { formatEuro } from "@/lib/money";

const SOLUTION_POINTS = [
  { icon: Wallet, label: "Calcolo food cost" },
  { icon: TrendingUp, label: "Margine per piatto" },
  { icon: BarChart3, label: "Menu engineering" },
  { icon: ChefHat, label: "Prezzi consigliati" },
  { icon: FileText, label: "Report giornaliero" },
  { icon: AlertTriangle, label: "Alert ingredienti" },
  { icon: Users, label: "Controllo personale" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ink px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Il cruscotto economico del ristoratore
          </p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Scopri quanto guadagni davvero{" "}
            <span className="text-profit">su ogni piatto</span>
          </h1>
          <p className="text-lg text-stone-300">
            RistoProfit OS è il cruscotto economico per ristoranti, bar, pizzerie
            e gelaterie. Calcola food cost, margini, prezzi consigliati, sprechi,
            fornitori e report giornalieri.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/demo"
              className="rounded-lg bg-profit px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Richiedi una demo
            </Link>
            <Link
              href="/app/food-cost"
              className="rounded-lg border border-stone-600 px-6 py-3 font-semibold text-white hover:bg-ink-soft"
            >
              Calcola il tuo food cost
            </Link>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <h2 className="text-3xl font-bold text-ink">
            Vendere tanto non significa guadagnare bene
          </h2>
          <p className="text-lg text-warmgray">
            Ingredienti in aumento, menu non aggiornati, piatti con margini bassi
            e personale costoso possono ridurre il profitto del locale senza che
            il titolare se ne accorga.
          </p>
        </div>
      </section>

      {/* Soluzione */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <h2 className="text-center text-3xl font-bold text-ink">
            RistoProfit OS trasforma ricette, fatture e vendite in decisioni
          </h2>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {SOLUTION_POINTS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl border border-stone-200 bg-paper p-4"
              >
                <Icon className="shrink-0 text-profit" size={20} aria-hidden />
                <span className="text-sm font-medium text-ink">{label}</span>
              </li>
            ))}
          </ul>
          <blockquote className="mx-auto max-w-3xl rounded-xl border-l-4 border-gold bg-gold-soft p-6 text-lg font-medium text-ink">
            «Non è un gestionale in più. È il sistema che Le dice dove sta
            guadagnando e dove sta perdendo soldi.»
          </blockquote>
        </div>
      </section>

      {/* Pacchetti */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl space-y-8">
          <h2 className="text-center text-3xl font-bold text-ink">Pacchetti</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`flex flex-col rounded-xl border bg-white p-6 shadow-sm ${
                  plan.highlighted ? "border-profit ring-2 ring-profit" : "border-stone-200"
                }`}
              >
                <h3 className="text-xl font-bold text-ink">{plan.name}</h3>
                <p className="mt-1 text-sm text-warmgray">{plan.target}</p>
                <p className="mt-4 text-3xl font-bold text-ink">
                  {plan.monthlyCents !== null
                    ? `${formatEuro(plan.monthlyCents)}`
                    : "Su preventivo"}
                  {plan.monthlyCents !== null && (
                    <span className="text-sm font-normal text-warmgray">/mese</span>
                  )}
                </p>
                <p className="text-sm text-warmgray">
                  {plan.setupCents !== null
                    ? `Setup ${formatEuro(plan.setupCents)}`
                    : "Setup da 3.000 €"}
                </p>
                <Link
                  href="/prezzi"
                  className="mt-4 rounded-lg border border-stone-300 px-4 py-2 text-center text-sm font-semibold text-ink hover:bg-stone-50"
                >
                  Dettagli piano
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="bg-ink px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Vuole sapere quali prodotti Le fanno guadagnare davvero?
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/demo"
              className="rounded-lg bg-profit px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Prenota analisi iniziale
            </Link>
            <Link
              href="/demo"
              className="rounded-lg border border-stone-600 px-6 py-3 font-semibold text-white hover:bg-ink-soft"
            >
              Richiedi demo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
