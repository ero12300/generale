import type { Metadata } from "next";
import Link from "next/link";
import { PLANS } from "@/lib/plans";
import { formatEuro } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pacchetti",
  description: "Confronta i pacchetti RistoCare OS: Start, Pro, Premium ed Enterprise.",
};

const SETUP_TABLE = [
  ["Piccolo bar", "300 – 500 €"],
  ["Bar / gelateria", "600 – 1.000 €"],
  ["Ristorante / pizzeria", "900 – 1.500 €"],
  ["Locale grande", "1.500 – 3.000 €"],
  ["Catena / multi-sede", "Su preventivo"],
];

export default function PacchettiPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Pacchetti</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Scegli il piano del tuo locale</h1>
        <p className="mt-4 text-muted">
          Tutti i piani includono scheda digitale, QR code, archivio documenti e apertura ticket.
          Cambi piano quando il locale cresce.
        </p>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border bg-surface p-6 ${
              plan.highlighted ? "border-primary/60 ring-1 ring-primary/30" : "border-border"
            }`}
          >
            {plan.highlighted ? (
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-white">
                Più scelto
              </span>
            ) : null}
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="mt-1 text-xs text-muted">{plan.tagline}</p>
            <div className="mt-4">
              {plan.monthlyPrice !== null ? (
                <p className="text-3xl font-semibold">
                  {formatEuro(plan.monthlyPrice)}
                  <span className="text-sm font-normal text-muted">/mese</span>
                </p>
              ) : (
                <p className="text-2xl font-semibold">Su preventivo</p>
              )}
              <p className="mt-1 text-xs text-muted">
                {plan.setupFrom !== null ? `Setup da ${formatEuro(plan.setupFrom)}` : "Setup dedicato"}
                {" · "}
                {plan.maxEquipment !== null ? `${plan.maxEquipment} attrezzature` : "Attrezzature illimitate"}
              </p>
            </div>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-muted">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-primary-strong">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1.5 text-center text-xs text-gold">
              Premio referral: {plan.referralReward}
            </p>
            <Link
              href={`/contatti?tipo=preventivo&piano=${plan.id}`}
              className={`mt-4 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                plan.highlighted
                  ? "bg-primary text-white hover:bg-primary-strong"
                  : "border border-border text-foreground hover:bg-surface-2"
              }`}
            >
              Richiedi preventivo
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Setup iniziale consigliato</h2>
          <p className="mt-1 text-sm text-muted">
            Include sopralluogo, censimento, foto matricole, caricamento documenti, QR code,
            configurazione utenti e prima formazione.
          </p>
          <table className="mt-5 w-full text-sm">
            <tbody>
              {SETUP_TABLE.map(([type, price]) => (
                <tr key={type} className="border-b border-border last:border-0">
                  <td className="py-2.5 text-muted">{type}</td>
                  <td className="py-2.5 text-right font-medium">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-surface to-surface-2 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Offerta lancio Messina</p>
          <h2 className="mt-2 text-lg font-semibold">Per i primi 10 locali</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li className="flex gap-2"><span className="text-gold">★</span> Censimento attrezzature: 490 € invece di 900 €</li>
            <li className="flex gap-2"><span className="text-gold">★</span> Piano Start incluso per 12 mesi (clienti Emotive)</li>
            <li className="flex gap-2"><span className="text-gold">★</span> QR code e report iniziale inclusi</li>
            <li className="flex gap-2"><span className="text-gold">★</span> Upgrade Pro a 79 €/mese invece di 99 €/mese</li>
          </ul>
          <Link
            href="/contatti?tipo=preventivo"
            className="mt-6 inline-flex rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-[#1a1407] hover:opacity-90"
          >
            Approfitta dell&apos;offerta
          </Link>
        </div>
      </div>
    </div>
  );
}
