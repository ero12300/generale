"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge, BOOKING_STATUS_OPTIONS } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { useWorkspace } from "@/lib/store/WorkspaceProvider";
import type { BookingStatus } from "@/lib/types";
import { formatCents, formatDateTime } from "@/lib/format";

const FILTERS: { value: "all" | "upcoming" | BookingStatus; label: string }[] = [
  { value: "upcoming", label: "Prossime" },
  { value: "all", label: "Tutte" },
  { value: "pending", label: "In attesa" },
  { value: "confirmed", label: "Confermate" },
  { value: "completed", label: "Completate" },
];

export default function BookingsPage() {
  const ws = useWorkspace();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming" | BookingStatus>("upcoming");

  const [clientName, setClientName] = useState("");
  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState(ws.services[0]?.id ?? "");
  const [start, setStart] = useState("");
  const [notes, setNotes] = useState("");

  const filtered = useMemo(() => {
    const now = Date.now();
    return ws.bookings
      .filter((b) => {
        if (filter === "all") return true;
        if (filter === "upcoming") return new Date(b.start).getTime() >= now && b.status !== "cancelled";
        return b.status === filter;
      })
      .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
  }, [ws.bookings, filter]);

  const resetForm = () => {
    setClientName("");
    setClientId("");
    setServiceId(ws.services[0]?.id ?? "");
    setStart("");
    setNotes("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const service = ws.services.find((s) => s.id === serviceId);
    if (!service) return toast("Seleziona un servizio", "error");
    if (!start) return toast("Seleziona data e ora", "error");
    const client = ws.clients.find((c) => c.id === clientId);
    const name = client ? `${client.firstName} ${client.lastName}` : clientName.trim();
    if (!name) return toast("Inserisci il nome del cliente", "error");

    ws.addBooking({
      clientId: client?.id,
      clientName: name,
      clientPhone: client?.phone,
      serviceId: service.id,
      serviceName: service.name,
      priceCents: service.priceCents,
      start: new Date(start).toISOString(),
      durationMin: service.durationMin,
      status: "confirmed",
      notes: notes.trim() || undefined,
      source: "internal",
    });
    toast("Prenotazione creata", "success");
    resetForm();
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Prenotazioni"
        subtitle="Gestisci l'agenda del salone"
        action={
          <button className="btn-gold" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Nuova
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={
              filter === f.value
                ? "badge border-gold/40 bg-gold/10 text-gold-soft"
                : "badge border-ink-line text-cream/60 hover:text-cream"
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card grid place-items-center gap-3 p-12 text-center">
          <CalendarClock className="h-10 w-10 text-cream/25" />
          <p className="text-cream/50">Nessuna prenotazione in questa vista.</p>
          <button className="btn-outline-gold" onClick={() => setOpen(true)}>
            Crea la prima prenotazione
          </button>
        </div>
      ) : (
        <div className="card divide-y divide-ink-line overflow-hidden">
          {filtered.map((b) => (
            <div key={b.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-cream">{b.clientName}</p>
                  <StatusBadge status={b.status} />
                </div>
                <p className="mt-0.5 text-sm text-cream/50">
                  {b.serviceName} · {formatDateTime(b.start)} · {formatCents(b.priceCents)}
                </p>
                {b.notes ? <p className="mt-0.5 text-xs text-cream/40">Note: {b.notes}</p> : null}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={b.status}
                  onChange={(e) => ws.setBookingStatus(b.id, e.target.value as BookingStatus)}
                  className="field w-auto py-2 text-xs"
                  aria-label={`Stato prenotazione ${b.clientName}`}
                >
                  {BOOKING_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    ws.removeBooking(b.id);
                    toast("Prenotazione eliminata", "info");
                  }}
                  className="rounded-lg p-2 text-cream/40 transition hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Elimina prenotazione"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nuova prenotazione"
        description="Aggiungi un appuntamento all'agenda"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setOpen(false)}>Annulla</button>
            <button className="btn-gold" form="booking-form" type="submit">Salva</button>
          </>
        }
      >
        <form id="booking-form" onSubmit={submit} className="space-y-4">
          <div>
            <label className="label" htmlFor="bk-client">Cliente esistente</label>
            <select
              id="bk-client"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="field"
            >
              <option value="">— Nuovo / occasionale —</option>
              {ws.clients.map((c) => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
              ))}
            </select>
          </div>
          {!clientId ? (
            <div>
              <label className="label" htmlFor="bk-name">Nome cliente</label>
              <input
                id="bk-name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="field"
                placeholder="Es. Mario Bianchi"
              />
            </div>
          ) : null}
          <div>
            <label className="label" htmlFor="bk-service">Servizio</label>
            <select id="bk-service" value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="field">
              {ws.services.filter((s) => s.active).map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {formatCents(s.priceCents)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="bk-start">Data e ora</label>
            <input id="bk-start" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="bk-notes">Note (facoltative)</label>
            <input id="bk-notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="field" placeholder="Preferenze, richieste..." />
          </div>
        </form>
      </Modal>
    </div>
  );
}
