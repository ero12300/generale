"use client";

import { useState } from "react";
import { Field, inputClass } from "@/components/forms/field";

export function ReferralForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrors({});
    setErrorMsg("");

    const form = event.currentTarget;
    const raw = new FormData(form);
    const data = {
      ...Object.fromEntries(raw),
      consent: raw.get("consent") === "on",
    };

    try {
      const res = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors(json.issues ?? {});
        setErrorMsg(json.error ?? "Si è verificato un errore.");
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setErrorMsg("Impossibile contattare il server. Riprova.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-2xl border border-gold/40 bg-gold/10 p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold/20 text-gold">✓</div>
        <h3 className="mt-4 text-lg font-semibold">Segnalazione ricevuta</h3>
        <p className="mt-2 text-sm text-muted">
          Grazie per la segnalazione. Verificheremo il lead e ti aggiorneremo sullo stato del premio.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-2"
        >
          Segnala un altro locale
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome partner" htmlFor="partnerName" required error={errors.partnerName?.[0]}>
          <input id="partnerName" name="partnerName" className={inputClass} placeholder="Il tuo nome / azienda" />
        </Field>
        <Field label="Tipo partner" htmlFor="partnerType" required error={errors.partnerType?.[0]}>
          <input id="partnerType" name="partnerType" className={inputClass} placeholder="Tecnico, commercialista, agente..." />
        </Field>
        <Field label="Telefono" htmlFor="phone" required error={errors.phone?.[0]}>
          <input id="phone" name="phone" className={inputClass} placeholder="+39 ..." />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email?.[0]}>
          <input id="email" name="email" type="email" className={inputClass} placeholder="email@dominio.it" />
        </Field>
        <Field label="Locale segnalato" htmlFor="referredCompany" required error={errors.referredCompany?.[0]}>
          <input id="referredCompany" name="referredCompany" className={inputClass} placeholder="Nome del locale" />
        </Field>
        <Field label="Referente" htmlFor="referredContact" required error={errors.referredContact?.[0]}>
          <input id="referredContact" name="referredContact" className={inputClass} placeholder="Nome del referente" />
        </Field>
        <Field label="Città" htmlFor="city" required error={errors.city?.[0]}>
          <input id="city" name="city" className={inputClass} placeholder="Messina" />
        </Field>
      </div>
      <Field label="Note" htmlFor="notes" error={errors.notes?.[0]}>
        <textarea id="notes" name="notes" rows={3} className={inputClass} placeholder="Informazioni utili sul locale segnalato..." />
      </Field>

      <label className="flex items-start gap-2.5 text-sm text-muted">
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4 rounded border-border" />
        <span>
          Autorizzo RistoCare OS a contattare il locale segnalato e dichiaro di avere il consenso del referente.
          {errors.consent?.[0] ? <span className="block text-xs text-red-300">{errors.consent[0]}</span> : null}
        </span>
      </label>

      {status === "error" && errorMsg ? (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {errorMsg}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-[#1a1407] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Invio in corso…" : "Invia segnalazione"}
      </button>
    </form>
  );
}
