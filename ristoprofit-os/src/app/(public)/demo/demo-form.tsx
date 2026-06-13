"use client";

import { useState } from "react";
import { z } from "zod";

const demoSchema = z.object({
  business: z.string().min(2, "Inserisca il nome del locale"),
  contact: z.string().min(2, "Inserisca il nome di riferimento"),
  phone: z
    .string()
    .min(6, "Inserisca un numero di telefono valido")
    .regex(/^[+0-9 ()-]+$/, "Inserisca un numero di telefono valido"),
  city: z.string().min(2, "Inserisca la città"),
  type: z.enum(
    ["ristorante", "bar", "pizzeria", "gelateria", "pasticceria", "altro"],
    { message: "Selezioni il tipo di locale" },
  ),
});

type FormState = "idle" | "loading" | "success" | "error";

export function DemoForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = demoSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      setState("error");
      return;
    }
    setErrors({});
    setState("loading");
    // Demo mode: simula l'invio. In produzione: POST a Supabase / CRM.
    await new Promise((r) => setTimeout(r, 600));
    setState("success");
  }

  if (state === "success") {
    return (
      <div
        role="status"
        className="rounded-xl border border-green-200 bg-profit-soft p-6 text-center"
      >
        <p className="text-lg font-semibold text-green-900">
          Richiesta inviata correttamente
        </p>
        <p className="mt-1 text-sm text-green-800">
          La contatteremo entro 24 ore lavorative per fissare la demo.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-profit focus:outline-none focus:ring-2 focus:ring-profit-soft";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      {state === "error" && Object.keys(errors).length > 0 ? (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Controlli i campi evidenziati e riprovi.
        </p>
      ) : null}
      {(
        [
          { name: "business", label: "Nome del locale", type: "text" },
          { name: "contact", label: "Nome e cognome", type: "text" },
          { name: "phone", label: "Telefono", type: "tel" },
          { name: "city", label: "Città", type: "text" },
        ] as const
      ).map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-ink">
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            className={inputClass}
            aria-invalid={Boolean(errors[field.name])}
            aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
          />
          {errors[field.name] ? (
            <p id={`${field.name}-error`} className="mt-1 text-xs text-red-600">
              {errors[field.name]}
            </p>
          ) : null}
        </div>
      ))}
      <div>
        <label htmlFor="type" className="mb-1 block text-sm font-medium text-ink">
          Tipo di locale
        </label>
        <select id="type" name="type" className={inputClass} defaultValue="ristorante">
          <option value="ristorante">Ristorante</option>
          <option value="bar">Bar</option>
          <option value="pizzeria">Pizzeria</option>
          <option value="gelateria">Gelateria</option>
          <option value="pasticceria">Pasticceria</option>
          <option value="altro">Altro</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full rounded-lg bg-profit px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
      >
        {state === "loading" ? "Invio in corso…" : "Invia richiesta demo"}
      </button>
      <p className="text-xs text-warmgray">
        I dati sono usati solo per ricontattarLa. Nessuna newsletter automatica.
      </p>
    </form>
  );
}
