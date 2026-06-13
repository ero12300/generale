import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { PLANS } from "@/lib/plans";
import { formatEuro } from "@/lib/money";

export const metadata: Metadata = { title: "Prezzi" };

export default function PrezziPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-12">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold text-ink">Prezzi</h1>
        <p className="mx-auto max-w-2xl text-warmgray">
          Il prezzo ha due componenti: il <strong>setup iniziale</strong> (la
          configurazione del Suo locale: menu, ricette, ingredienti, fornitori,
          prezzi e primo report) e il <strong>canone mensile</strong> che
          mantiene attiva la piattaforma, i report e il supporto.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`flex flex-col rounded-xl border bg-white p-6 shadow-sm ${
              plan.highlighted ? "border-profit ring-2 ring-profit" : "border-stone-200"
            }`}
          >
            {plan.highlighted ? (
              <p className="mb-2 inline-block self-start rounded-full bg-profit-soft px-3 py-1 text-xs font-semibold text-green-800">
                Più scelto
              </p>
            ) : null}
            <h2 className="text-2xl font-bold text-ink">{plan.name}</h2>
            <p className="mt-1 text-sm text-warmgray">{plan.target}</p>
            <p className="mt-4 text-3xl font-bold text-ink">
              {plan.monthlyCents !== null ? formatEuro(plan.monthlyCents) : "Su preventivo"}
              {plan.monthlyCents !== null && (
                <span className="text-sm font-normal text-warmgray">/mese</span>
              )}
            </p>
            <p className="text-sm text-warmgray">
              {plan.setupCents !== null
                ? `Setup ${formatEuro(plan.setupCents)}`
                : "Setup da 3.000 €"}
            </p>
            <ul className="mt-4 flex-1 space-y-2 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-profit" aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
              {plan.notIncluded?.map((f) => (
                <li key={f} className="flex items-start gap-2 text-warmgray">
                  <X size={16} className="mt-0.5 shrink-0 text-stone-400" aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/demo"
              className="mt-6 rounded-lg bg-ink px-4 py-2 text-center text-sm font-semibold text-white hover:bg-ink-soft"
            >
              Richiedi demo
            </Link>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-bold text-ink">Offerta lancio Messina</h2>
        <p className="mt-2 text-sm text-warmgray">
          Per i primi 10 clienti a Messina: setup Pro a{" "}
          <strong className="text-ink">690 € invece di 990 €</strong>, canone Pro
          a <strong className="text-ink">99 €/mese per 12 mesi</strong>, report
          iniziale incluso e 30 giorni di affiancamento. I clienti Emotive che
          hanno già acquistato arredi o attrezzature hanno il 20% di sconto sul
          setup. Con pagamento annuale anticipato: 2 mesi gratuiti.
        </p>
        <p className="mt-4 rounded-lg bg-gold-soft p-4 text-sm font-medium text-ink">
          «Se il sistema Le permette di correggere anche solo 5 prodotti venduti
          male, recuperare sprechi o aumentare leggermente alcuni prezzi, il
          canone si ripaga facilmente.» Esempio: un piatto venduto 300 volte al
          mese aumentato di 1 € recupera 300 €/mese — più di due volte il canone Pro.
        </p>
      </section>
    </div>
  );
}
