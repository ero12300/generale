"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Booking, Client, Service, Staff, BookingStatus } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatEUR, formatDate, formatTime, sameDay } from "@/lib/utils";
import { CalendarPlus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, X, CircleAlert } from "lucide-react";

const statusTone: Record<BookingStatus, "default" | "gold" | "emerald" | "rose" | "amber"> = {
  confirmed: "gold",
  completed: "emerald",
  cancelled: "rose",
  no_show: "amber",
};

const statusLabel: Record<BookingStatus, string> = {
  confirmed: "Confermata",
  completed: "Completata",
  cancelled: "Annullata",
  no_show: "No-show",
};

interface Props {
  initialBookings: Booking[];
  clients: Client[];
  services: Service[];
  staff: Staff[];
}

export function BookingsView({ initialBookings, clients, services, staff }: Props) {
  const router = useRouter();
  const [day, setDay] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const { push } = useToast();

  const dayBookings = useMemo(
    () =>
      bookings
        .filter((b) => sameDay(new Date(b.startAt), day))
        .sort((a, b) => a.startAt.localeCompare(b.startAt)),
    [bookings, day],
  );

  const byStaff = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const s of staff) map.set(s.id, []);
    for (const b of dayBookings) {
      const arr = map.get(b.staffId) ?? [];
      arr.push(b);
      map.set(b.staffId, arr);
    }
    return map;
  }, [dayBookings, staff]);

  function shiftDay(delta: number) {
    const d = new Date(day);
    d.setDate(d.getDate() + delta);
    setDay(d);
  }

  async function refresh() {
    const res = await fetch("/api/bookings", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { bookings: Booking[] };
      setBookings(data.bookings);
    }
    router.refresh();
  }

  async function changeStatus(id: string, status: BookingStatus) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      push({ kind: "success", title: `Prenotazione ${statusLabel[status].toLowerCase()}` });
      await refresh();
    } else {
      push({ kind: "error", title: "Errore aggiornamento" });
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => shiftDay(-1)} aria-label="Giorno precedente">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="glass rounded-lg px-3 py-2 text-sm min-w-[220px] text-center inline-flex items-center gap-2 justify-center">
            <CalendarIcon className="w-4 h-4 text-[color:var(--color-gold-400)]" />
            {formatDate(day)}
          </div>
          <Button variant="secondary" size="sm" onClick={() => shiftDay(1)} aria-label="Giorno successivo">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDay(new Date())}>
            Oggi
          </Button>
        </div>
        <Button onClick={() => setOpen(true)}>
          <CalendarPlus className="w-4 h-4" />
          Nuova prenotazione
        </Button>
      </div>

      {staff.length === 0 ? (
        <EmptyState
          icon={<CircleAlert className="w-6 h-6" />}
          title="Nessun barbiere configurato"
          description="Aggiungi almeno un barbiere in Impostazioni per iniziare a ricevere prenotazioni."
        />
      ) : dayBookings.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon className="w-6 h-6" />}
          title="Nessuna prenotazione in questo giorno"
          description="Usa il pulsante in alto a destra per aggiungerne una."
          cta={<Button onClick={() => setOpen(true)}><CalendarPlus className="w-4 h-4" />Nuova prenotazione</Button>}
        />
      ) : (
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${staff.length}, minmax(0, 1fr))` }}>
          {staff.map((s) => (
            <div key={s.id} className="rounded-xl border border-white/5 bg-white/[0.02] min-h-[200px]">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: s.color ?? "#c9a24a" }}
                />
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs text-ink-500 ml-auto">{byStaff.get(s.id)?.length ?? 0}</div>
              </div>
              <div className="p-2 space-y-2">
                {(byStaff.get(s.id) ?? []).map((b) => {
                  const cli = clients.find((c) => c.id === b.clientId);
                  const svc = services.find((sv) => sv.id === b.serviceId);
                  return (
                    <div key={b.id} className="glass glass-hover rounded-lg p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs text-[color:var(--color-gold-400)] font-medium">
                          {formatTime(b.startAt)} — {formatTime(b.endAt)}
                        </div>
                        <Badge tone={statusTone[b.status]}>{statusLabel[b.status]}</Badge>
                      </div>
                      <div className="text-sm text-ink-100 mt-1 truncate">{cli?.name ?? "—"}</div>
                      <div className="text-xs text-ink-400 truncate">{svc?.name ?? "—"} · {formatEUR(b.priceCents / 100)}</div>
                      {b.status === "confirmed" ? (
                        <div className="mt-2 flex items-center gap-1">
                          <button
                            className="text-[11px] px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 inline-flex items-center gap-1"
                            onClick={() => changeStatus(b.id, "completed")}
                          >
                            <Check className="w-3 h-3" /> Completa
                          </button>
                          <button
                            className="text-[11px] px-2 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 inline-flex items-center gap-1"
                            onClick={() => changeStatus(b.id, "cancelled")}
                          >
                            <X className="w-3 h-3" /> Annulla
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
                {(byStaff.get(s.id)?.length ?? 0) === 0 ? (
                  <div className="text-xs text-ink-500 p-3 text-center">Nessun appuntamento</div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      <NewBookingModal
        open={open}
        onClose={() => setOpen(false)}
        clients={clients}
        services={services}
        staff={staff}
        defaultDate={day}
        onCreated={async () => {
          setOpen(false);
          await refresh();
        }}
      />
    </div>
  );
}

function NewBookingModal({
  open,
  onClose,
  clients,
  services,
  staff,
  defaultDate,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  clients: Client[];
  services: Service[];
  staff: Staff[];
  defaultDate: Date;
  onCreated: () => Promise<void>;
}) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [staffId, setStaffId] = useState(staff[0]?.id ?? "");
  const isoDay = defaultDate.toISOString().slice(0, 10);
  const [date, setDate] = useState(isoDay);
  const [time, setTime] = useState("10:00");
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const svc = services.find((s) => s.id === serviceId);
      if (!svc) throw new Error("Servizio non valido");
      const startAt = new Date(`${date}T${time}:00`).toISOString();
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ clientId, serviceId, staffId, startAt }),
      });
      if (!res.ok) throw new Error(await res.text());
      push({ kind: "success", title: "Prenotazione creata" });
      await onCreated();
    } catch (err: unknown) {
      push({ kind: "error", title: "Errore", description: err instanceof Error ? err.message : "" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Nuova prenotazione" size="md">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Cliente">
          <Select value={clientId} onChange={(e) => setClientId(e.target.value)} required>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Servizio">
          <Select value={serviceId} onChange={(e) => setServiceId(e.target.value)} required>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {formatEUR(s.priceCents / 100)} · {s.durationMin}′
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Barbiere">
          <Select value={staffId} onChange={(e) => setStaffId(e.target.value)} required>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Data">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </Field>
          <Field label="Ora">
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </Field>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Annulla</Button>
          <Button type="submit" loading={loading}>Conferma</Button>
        </div>
      </form>
    </Modal>
  );
}
