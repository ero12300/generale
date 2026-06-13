"use client";

import { useState } from "react";

const PARTNER_TYPES = [
  "Tecnico",
  "Commercialista",
  "Consulente HACCP",
  "Agente di commercio",
  "Agente caffè",
  "Rappresentante bevande",
  "Architetto / geometra",
  "Cliente RistoCare",
  "Altro",
];

export function ReferralForm() {
  const [state, setState] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setState("submitting");

    const form = new FormData(event.currentTarget);
    const payload = {
      partnerName: String(form.get("partnerName") ?? ""),
      partnerType: String(form.get("partnerType") ?? ""),
      referredCompany: String(form.get("referredCompany") ?? ""),
      referredContact: String(form.get("referredContact") ?? ""),
      city: String(form.get("city") ?? ""),
      consent: form.get("consent") === "on",
    };

    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Errore durante l'invio della segnalazione.");
        setState("idle");
        return;
      }
      setState("success");
    } catch {
      setError("Errore di rete. Riprova.");
      setState("idle");
    }
  }

  if (state === "success") {
    return (
      <p
        role="status"
        className="rounded-xl bg-tech-soft px-5 py-4 font-medium text-tech"
      >
        Segnalazione ricevuta. Ti contatteremo dopo la verifica del lead: il premio viene
        riconosciuto solo se il cliente attiva un piano.
      </p>
    );
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-tech focus:outline-none focus:ring-2 focus:ring-tech/30";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error && (
        <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          {error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="partnerName" className="block text-sm font-medium">
            Il tuo nome
          </label>
          <input id="partnerName" name="partnerName" type="text" required minLength={2} className={inputClass} />
        </div>
        <div>
          <label htmlFor="partnerType" className="block text-sm font-medium">
            Tipo partner
          </label>
          <select id="partnerType" name="partnerType" required defaultValue={PARTNER_TYPES[0]} className={inputClass}>
            {PARTNER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="referredCompany" className="block text-sm font-medium">
            Nome del locale segnalato
          </label>
          <input id="referredCompany" name="referredCompany" type="text" required minLength={2} className={inputClass} />
        </div>
        <div>
          <label htmlFor="referredContact" className="block text-sm font-medium">
            Nome referente
          </label>
          <input id="referredContact" name="referredContact" type="text" required minLength={2} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium">
          Città
        </label>
        <input id="city" name="city" type="text" required minLength={2} defaultValue="Messina" className={inputClass} />
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-tech"
        />
        Confermo di essere autorizzato a segnalare questo contatto e autorizzo RistoCare OS a
        contattare il locale indicato.
      </label>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-ink-soft disabled:opacity-60"
      >
        {state === "submitting" ? "Invio in corso…" : "Invia segnalazione"}
      </button>
    </form>
  );
}
