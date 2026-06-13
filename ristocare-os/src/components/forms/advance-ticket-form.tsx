"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { inputClass } from "@/components/forms/field";
import { TICKET_STATUS_LABELS } from "@/lib/labels";
import type { TicketStatus } from "@/lib/types";

const STATUSES = Object.keys(TICKET_STATUS_LABELS) as TicketStatus[];

export function AdvanceTicketForm({
  ticketId,
  currentStatus,
}: {
  ticketId: string;
  currentStatus: TicketStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const res = await fetch(`/api/tickets/${ticketId}/advance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? "Errore durante l'aggiornamento.");
        setStatus("error");
        return;
      }
      setStatus("idle");
      event.currentTarget.reset();
      router.refresh();
    } catch {
      setErrorMsg("Impossibile contattare il server.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="status" className="mb-1.5 block text-sm font-medium">Nuovo stato</label>
        <select id="status" name="status" defaultValue={currentStatus} className={inputClass}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{TICKET_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="note" className="mb-1.5 block text-sm font-medium">Nota operativa</label>
        <textarea id="note" name="note" rows={2} className={inputClass} placeholder="Es. Inviata richiesta prezzo al tecnico…" />
      </div>
      {status === "error" && errorMsg ? (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{errorMsg}</p>
      ) : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-strong disabled:opacity-60"
      >
        {status === "loading" ? "Aggiornamento…" : "Aggiorna stato ticket"}
      </button>
    </form>
  );
}
