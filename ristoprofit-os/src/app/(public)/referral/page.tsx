import type { Metadata } from "next";
import Link from "next/link";
import { formatEuro } from "@/lib/money";
import { REFERRAL_REWARDS_CENTS } from "@/lib/plans";

export const metadata: Metadata = { title: "Programma Referral" };

export default function ReferralPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold text-ink">Programma Referral</h1>
        <p className="text-warmgray">
          Consulenti HACCP, commercialisti, tecnici, fornitori food, agenti e
          professionisti locali: segnala un locale e ricevi un premio quando il
          cliente attiva RistoProfit OS.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {(["start", "pro", "premium"] as const).map((plan) => (
          <div key={plan} className="rounded-xl border border-stone-200 bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-warmgray">
              Piano {plan}
            </p>
            <p className="mt-2 text-3xl font-bold text-profit">
              {formatEuro(REFERRAL_REWARDS_CENTS[plan])}
            </p>
            <p className="mt-1 text-xs text-warmgray">per segnalazione andata a buon fine</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6 text-sm text-warmgray">
        <h2 className="text-lg font-semibold text-ink">Regole del programma</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            Il premio matura quando il cliente firma, paga il setup, attiva il
            canone e supera l&apos;eventuale periodo di prova.
          </li>
          <li>
            Se il cliente era già presente nel nostro CRM, la segnalazione non
            viene riconosciuta, salvo approvazione manuale.
          </li>
          <li>
            Ogni segnalazione protegge il partner per <strong>90 giorni</strong>:
            se entro 90 giorni il cliente non acquista, il lead torna libero.
          </li>
          <li>Per il piano Enterprise il compenso è definito con accordo dedicato.</li>
          <li>
            I partner commerciali che seguono il cliente fino alla vendita
            ricevono il 10% sul setup e il 10% del canone per 6 mesi.
          </li>
        </ul>
      </section>

      <div className="text-center">
        <Link
          href="/partner"
          className="inline-block rounded-lg bg-profit px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Accedi al portale partner
        </Link>
      </div>
    </div>
  );
}
