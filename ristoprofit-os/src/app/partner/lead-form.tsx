"use client";

import { useState } from "react";
import { z } from "zod";
import { Card } from "@/components/ui";

const leadSchema = z.object({
  customerName: z.string().min(2, "Inserisca il nome del locale"),
  phone: z
    .string()
    .min(6, "Inserisca un telefono valido")
    .regex(/^[+0-9 ()-]+$/, "Inserisca un telefono valido"),
  city: z.string().min(2, "Inserisca la città"),
});

type FormState = "idle" | "loading" | "success" | "error";

export function LeadForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = leadSchema.safeParse(data);
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
    // Demo mode: in produzione il lead viene salvato su Supabase con codice partner.
    await new Promise((r) => setTimeout(r, 500));
    setState("success");
  }

  if (state === "success") {
    return (
      <Card>
        <p role="status" className="text-sm font-semibold text-green-800">
          Lead inserito. Stato: <span className="rounded-full bg-profit-soft px-2 py-0.5">Nuovo</span> —
          protezione attiva per 90 giorni.
        </p>
      </Card>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-profit focus:outline-none focus:ring-2 focus:ring-profit-soft";

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-3">
        {(
          [
            { name: "customerName", label: "Nome locale" },
            { name: "phone", label: "Telefono" },
            { name: "city", label: "Città" },
          ] as const
        ).map((f) => (
          <div key={f.name}>
            <label htmlFor={`lead-${f.name}`} className="mb-1 block text-sm font-medium text-ink">
              {f.label}
            </label>
            <input
              id={`lead-${f.name}`}
              name={f.name}
              className={inputClass}
              aria-invalid={Boolean(errors[f.name])}
            />
            {errors[f.name] ? (
              <p className="mt-1 text-xs text-red-600">{errors[f.name]}</p>
            ) : null}
          </div>
        ))}
        <div className="sm:col-span-3">
          <button
            type="submit"
            disabled={state === "loading"}
            className="rounded-lg bg-profit px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {state === "loading" ? "Invio…" : "Invia segnalazione"}
          </button>
        </div>
      </form>
    </Card>
  );
}
