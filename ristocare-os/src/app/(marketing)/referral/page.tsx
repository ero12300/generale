import type { Metadata } from "next";
import { ReferralForm } from "@/components/forms/referral-form";

export const metadata: Metadata = {
  title: "Diventa partner",
  description:
    "Segnala locali interessati a RistoCare OS e ricevi un premio quando attivano un piano.",
};

const REWARDS = [
  ["Start", "50 €"],
  ["Pro", "100 €"],
  ["Premium", "200 €"],
  ["Enterprise", "Accordo dedicato"],
];

const RULES = [
  "Il premio viene riconosciuto solo se il cliente attiva un piano.",
  "Il premio viene pagato dopo l'incasso del setup o del primo canone.",
  "I lead già presenti nel database non danno diritto al premio.",
  "Il referral non può rappresentare RistoCare senza autorizzazione.",
  "Premi e percentuali possono variare per campagne specifiche.",
];

export default function ReferralPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Programma referral</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Diventa partner RistoCare</h1>
        <p className="mt-4 text-muted">
          Segnala ristoranti, bar, gelaterie e pizzerie interessati a digitalizzare la gestione delle
          proprie attrezzature. Se il cliente attiva il servizio, ricevi un premio.
        </p>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-lg font-semibold">Segnala un locale</h2>
          <p className="mt-1 text-sm text-muted">Compila il modulo: verifichiamo il lead e ti aggiorniamo sullo stato del premio.</p>
          <div className="mt-6">
            <ReferralForm />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-base font-semibold">Premi consigliati</h2>
            <table className="mt-4 w-full text-sm">
              <tbody>
                {REWARDS.map(([plan, reward]) => (
                  <tr key={plan} className="border-b border-border last:border-0">
                    <td className="py-2.5 text-muted">{plan}</td>
                    <td className="py-2.5 text-right font-medium text-gold">{reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-base font-semibold">Regole referral</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {RULES.map((r) => (
                <li key={r} className="flex gap-2"><span className="text-primary-strong">•</span>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
