"use client";

import { useState } from "react";
import { Field, inputClass } from "@/components/forms/field";
import type { ContactRequest } from "@/lib/types";

type RequestType = ContactRequest["requestType"];

const TYPE_OPTIONS: { value: RequestType; label: string }[] = [
  { value: "demo", label: "Richiesta demo" },
  { value: "preventivo", label: "Richiesta preventivo" },
  { value: "censimento", label: "Censimento / sopralluogo" },
  { value: "tecnico", label: "Diventare tecnico partner" },
  { value: "referral", label: "Diventare referral partner" },
];

export function ContactForm({ defaultType = "demo" }: { defaultType?: RequestType }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrors({});
    setErrorMsg("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
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
      <div role="status" className="rounded-2xl border border-primary/40 bg-primary/10 p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/20 text-primary-strong">✓</div>
        <h3 className="mt-4 text-lg font-semibold">Richiesta inviata</h3>
        <p className="mt-2 text-sm text-muted">
          Grazie! Il team RistoCare OS ti ricontatterà al più presto per organizzare il prossimo passo.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-2"
        >
          Invia un&apos;altra richiesta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome e cognome" htmlFor="name" required error={errors.name?.[0]}>
          <input id="name" name="name" className={inputClass} placeholder="Mario Rossi" />
        </Field>
        <Field label="Nome del locale" htmlFor="company" required error={errors.company?.[0]}>
          <input id="company" name="company" className={inputClass} placeholder="Trattoria del Porto" />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email?.[0]}>
          <input id="email" name="email" type="email" className={inputClass} placeholder="mario@locale.it" />
        </Field>
        <Field label="Telefono" htmlFor="phone" required error={errors.phone?.[0]}>
          <input id="phone" name="phone" className={inputClass} placeholder="+39 ..." />
        </Field>
        <Field label="Città" htmlFor="city" required error={errors.city?.[0]}>
          <input id="city" name="city" className={inputClass} placeholder="Messina" />
        </Field>
        <Field label="Tipo di richiesta" htmlFor="requestType" required error={errors.requestType?.[0]}>
          <select id="requestType" name="requestType" defaultValue={defaultType} className={inputClass}>
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Messaggio" htmlFor="message" error={errors.message?.[0]}>
        <textarea id="message" name="message" rows={4} className={inputClass} placeholder="Raccontaci del tuo locale e delle attrezzature..." />
      </Field>

      {status === "error" && errorMsg ? (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {errorMsg}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Invio in corso…" : "Invia richiesta"}
      </button>
    </form>
  );
}
