"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TICKET_URGENCY_LABELS, TicketUrgency } from "@/lib/types";

interface EquipmentOption {
  id: string;
  name: string;
}

export function TicketForm({
  equipmentOptions,
  defaultEquipmentId,
  redirectBase = "/app/ticket",
}: {
  equipmentOptions: EquipmentOption[];
  defaultEquipmentId?: string;
  redirectBase?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      equipmentId: String(form.get("equipmentId") ?? ""),
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? ""),
      urgency: String(form.get("urgency") ?? "media") as TicketUrgency,
      machineDown: form.get("machineDown") === "on",
      openedBy: String(form.get("openedBy") ?? ""),
    };

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Errore durante l'apertura del ticket.");
        setSubmitting(false);
        return;
      }
      router.push(`${redirectBase}/${data.ticket.id}`);
    } catch {
      setError("Errore di rete. Riprova.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error && (
        <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="equipmentId" className="block text-sm font-medium">
          Attrezzatura
        </label>
        <select
          id="equipmentId"
          name="equipmentId"
          required
          defaultValue={defaultEquipmentId ?? ""}
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-tech focus:outline-none focus:ring-2 focus:ring-tech/30"
        >
          <option value="" disabled>
            Seleziona attrezzatura…
          </option>
          {equipmentOptions.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Titolo del problema
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={3}
          maxLength={120}
          placeholder="Es. La vetrina non raffredda"
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-tech focus:outline-none focus:ring-2 focus:ring-tech/30"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Descrizione (da quando accade, errori display, rumori, temperatura…)
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          placeholder="Descrivi il problema con più dettagli possibili."
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-tech focus:outline-none focus:ring-2 focus:ring-tech/30"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="urgency" className="block text-sm font-medium">
            Urgenza
          </label>
          <select
            id="urgency"
            name="urgency"
            defaultValue="media"
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-tech focus:outline-none focus:ring-2 focus:ring-tech/30"
          >
            {Object.entries(TICKET_URGENCY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="openedBy" className="block text-sm font-medium">
            Il tuo nome
          </label>
          <input
            id="openedBy"
            name="openedBy"
            type="text"
            required
            minLength={2}
            maxLength={80}
            placeholder="Nome e ruolo"
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-tech focus:outline-none focus:ring-2 focus:ring-tech/30"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="machineDown" className="h-4 w-4 rounded border-stone-300 accent-tech" />
        La macchina è ferma / il problema blocca il servizio
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-full bg-tech px-6 py-3 text-sm font-medium text-white hover:bg-tech/90 disabled:opacity-60"
      >
        {submitting ? "Invio in corso…" : "Apri ticket"}
      </button>
    </form>
  );
}
