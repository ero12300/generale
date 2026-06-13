"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, inputClass } from "@/components/forms/field";
import { URGENCY_LABELS } from "@/lib/labels";
import type { TicketUrgency } from "@/lib/types";

interface EquipmentOption {
  id: string;
  label: string;
}

const URGENCIES: TicketUrgency[] = ["bassa", "media", "alta", "bloccante"];

export function OpenTicketForm({
  equipmentOptions,
  defaultEquipmentId,
  defaultOpenedBy = "",
}: {
  equipmentOptions: EquipmentOption[];
  defaultEquipmentId?: string;
  defaultOpenedBy?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrors({});
    setErrorMsg("");

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const res = await fetch("/api/tickets", {
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
      router.push(`/app/ticket/${json.ticket.id}`);
      router.refresh();
    } catch {
      setErrorMsg("Impossibile contattare il server. Riprova.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field label="Attrezzatura" htmlFor="equipmentId" required error={errors.equipmentId?.[0]}>
        <select id="equipmentId" name="equipmentId" defaultValue={defaultEquipmentId ?? ""} className={inputClass}>
          <option value="" disabled>Seleziona un&apos;attrezzatura…</option>
          {equipmentOptions.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Titolo del problema" htmlFor="title" required error={errors.title?.[0]}>
        <input id="title" name="title" className={inputClass} placeholder="Es. Frigo non raffredda" />
      </Field>

      <Field label="Descrizione" htmlFor="description" required error={errors.description?.[0]}>
        <textarea
          id="description"
          name="description"
          rows={4}
          className={inputClass}
          placeholder="Descrivi il problema: da quando accade, rumori, errori sul display, temperatura rilevata…"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Urgenza" htmlFor="urgency" required error={errors.urgency?.[0]}>
          <select id="urgency" name="urgency" defaultValue="media" className={inputClass}>
            {URGENCIES.map((u) => (
              <option key={u} value={u}>{URGENCY_LABELS[u]}</option>
            ))}
          </select>
        </Field>
        <Field label="Aperto da" htmlFor="openedBy" required error={errors.openedBy?.[0]}>
          <input id="openedBy" name="openedBy" defaultValue={defaultOpenedBy} className={inputClass} placeholder="Nome di chi apre il ticket" />
        </Field>
      </div>

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
        {status === "loading" ? "Apertura ticket…" : "Apri ticket"}
      </button>
    </form>
  );
}
