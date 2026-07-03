"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Ban,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import { demoStore, DEMO_ORG_ID } from "@/lib/demo-store";
import { useToast } from "@/components/ui/toast";
import { cn, formatCurrency, formatTime, generateId, initials } from "@/lib/utils";
import type { Booking, Client, Service } from "@/types";

const STATUS_LABEL: Record<Booking["status"], string> = {
  pending: "In attesa",
  confirmed: "Confermato",
  in_progress: "In corso",
  completed: "Completato",
  cancelled: "Annullato",
  no_show: "No-show",
};

const STATUS_STYLES: Record<Booking["status"], string> = {
  pending: "amber",
  confirmed: "emerald",
  in_progress: "gold",
  completed: "blue",
  cancelled: "rose",
  no_show: "muted",
};

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

const HOURS_START = 9;
const HOURS_END = 20;

function localDatetimeString(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function BookingsPage() {
  const { push } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [presetSlot, setPresetSlot] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setBookings(demoStore.listBookings());
    setClients(demoStore.listClients());
    setServices(demoStore.listServices());
  }

  const weekDays = useMemo(() => {
    const days: Date[] = [];
    const start = addDays(selectedDate, -3);
    for (let i = 0; i < 7; i++) days.push(addDays(start, i));
    return days;
  }, [selectedDate]);

  const dayBookings = useMemo(() => {
    return bookings
      .filter((b) => isSameDay(new Date(b.startAt), selectedDate))
      .sort((a, b) => a.startAt.localeCompare(b.startAt));
  }, [bookings, selectedDate]);

  const hours = useMemo(() => {
    const arr: number[] = [];
    for (let h = HOURS_START; h < HOURS_END; h++) arr.push(h);
    return arr;
  }, []);

  function openNewBooking(slotIso?: string) {
    setEditing(null);
    setPresetSlot(slotIso ?? null);
    setOpenForm(true);
  }

  function openEdit(b: Booking) {
    setEditing(b);
    setPresetSlot(null);
    setOpenForm(true);
  }

  function handleDelete(id: string) {
    demoStore.deleteBooking(id);
    push("Prenotazione eliminata", "info");
    refresh();
  }

  function handleStatus(id: string, status: Booking["status"]) {
    demoStore.updateBookingStatus(id, status);
    push(`Stato aggiornato: ${STATUS_LABEL[status]}`, "success");
    refresh();
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Prenotazioni"
        description="Agenda in tempo reale. Trascina, clicca uno slot vuoto, gestisci lo stato."
        action={
          <Button onClick={() => openNewBooking()}>
            <Plus className="h-4 w-4" /> Nuova prenotazione
          </Button>
        }
      />

      {/* Week strip */}
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedDate((d) => addDays(d, -7))}
          aria-label="Settimana precedente"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-thin flex-1">
          {weekDays.map((d) => {
            const isSelected = isSameDay(d, selectedDate);
            const isToday = isSameDay(d, new Date());
            const count = bookings.filter((b) => isSameDay(new Date(b.startAt), d)).length;
            return (
              <button
                key={d.toISOString()}
                onClick={() => setSelectedDate(d)}
                className={cn(
                  "flex-1 min-w-[70px] rounded-xl border p-3 text-center transition-all",
                  isSelected
                    ? "border-gold-400/50 bg-gold-400/10 shadow-[0_0_0_1px_rgba(212,167,44,0.3)]"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                )}
              >
                <div className={cn("text-[10px] uppercase tracking-widest", isSelected ? "text-gold-300" : "text-ink-400")}>
                  {d.toLocaleDateString("it-IT", { weekday: "short" })}
                </div>
                <div className={cn("font-display text-2xl mt-1", isSelected ? "text-ink-50" : "text-ink-100")}>
                  {d.getDate()}
                </div>
                <div className="text-[10px] text-ink-400 mt-0.5">
                  {isToday ? "oggi" : d.toLocaleDateString("it-IT", { month: "short" })}
                </div>
                {count > 0 && (
                  <div className={cn(
                    "mt-1 inline-flex text-[10px] px-1.5 py-0.5 rounded-full",
                    isSelected ? "bg-gold-400/20 text-gold-100" : "bg-white/5 text-ink-300"
                  )}>
                    {count}
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedDate((d) => addDays(d, 7))}
          aria-label="Settimana successiva"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setSelectedDate(startOfDay(new Date()))}>
          Oggi
        </Button>
      </div>

      {/* Day view */}
      <div className="surface rounded-2xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-ink-100">
            <Calendar className="h-4 w-4 text-gold-300" />
            <span className="font-display text-xl">
              {selectedDate.toLocaleDateString("it-IT", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="text-sm text-ink-400">
            {dayBookings.length} prenotazioni · {formatCurrency(dayBookings.reduce((a, b) => a + b.price, 0))} atteso
          </div>
        </div>

        <div className="relative border-t border-white/5">
          {hours.map((h) => {
            const slotBookings = dayBookings.filter((b) => new Date(b.startAt).getHours() === h);
            return (
              <div key={h} className="grid grid-cols-[50px_1fr] gap-3 border-b border-white/5 min-h-[80px] py-2 group">
                <div className="text-xs text-ink-400 pt-1 tabular-nums">
                  {h.toString().padStart(2, "0")}:00
                </div>
                <div className="relative">
                  {slotBookings.length === 0 && (
                    <button
                      onClick={() => {
                        const d = new Date(selectedDate);
                        d.setHours(h, 0, 0, 0);
                        openNewBooking(d.toISOString());
                      }}
                      className="w-full h-full min-h-[76px] rounded-lg border border-dashed border-white/5 hover:border-gold-400/30 hover:bg-gold-400/[0.03] transition-colors flex items-center justify-center text-ink-500 hover:text-gold-300 group"
                    >
                      <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                  <div className="flex flex-col gap-1.5">
                    {slotBookings.map((b) => (
                      <BookingCard key={b.id} booking={b} onEdit={openEdit} onDelete={handleDelete} onStatus={handleStatus} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BookingForm
        open={openForm}
        onOpenChange={setOpenForm}
        editing={editing}
        presetSlot={presetSlot}
        clients={clients}
        services={services}
        onSaved={() => {
          setOpenForm(false);
          refresh();
        }}
      />
    </div>
  );
}

function BookingCard({
  booking,
  onEdit,
  onDelete,
  onStatus,
}: {
  booking: Booking;
  onEdit: (b: Booking) => void;
  onDelete: (id: string) => void;
  onStatus: (id: string, s: Booking["status"]) => void;
}) {
  const variant = STATUS_STYLES[booking.status] as
    | "amber"
    | "emerald"
    | "gold"
    | "blue"
    | "rose"
    | "muted";
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-lg border p-3 flex items-center gap-3 group",
        "bg-white/[0.03] border-white/10 hover:border-gold-400/30 hover:bg-white/[0.05]"
      )}
    >
      <div className="grid h-9 w-9 place-items-center rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-200 text-xs font-medium">
        {initials(booking.clientName)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-ink-50 font-medium truncate">{booking.clientName}</span>
          <Badge
            variant={variant === "amber" ? "gold" : variant === "gold" ? "gold" : variant === "emerald" ? "emerald" : variant === "blue" ? "blue" : variant === "rose" ? "rose" : "muted"}
            className="text-[10px] py-0"
          >
            {STATUS_LABEL[booking.status]}
          </Badge>
        </div>
        <div className="text-xs text-ink-400 truncate">
          {booking.serviceName} · {formatTime(booking.startAt)}–{formatTime(booking.endAt)} · {formatCurrency(booking.price)}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
        {booking.status !== "completed" && (
          <Button variant="ghost" size="icon" title="Segna completato" onClick={() => onStatus(booking.id, "completed")}>
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        )}
        {booking.status !== "in_progress" && booking.status !== "completed" && (
          <Button variant="ghost" size="icon" title="In corso" onClick={() => onStatus(booking.id, "in_progress")}>
            <Clock className="h-4 w-4" />
          </Button>
        )}
        {booking.status !== "cancelled" && (
          <Button variant="ghost" size="icon" title="Annulla" onClick={() => onStatus(booking.id, "cancelled")}>
            <Ban className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" title="Modifica" onClick={() => onEdit(booking)}>
          <Sparkles className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" title="Elimina" onClick={() => onDelete(booking.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

function BookingForm({
  open,
  onOpenChange,
  editing,
  presetSlot,
  clients,
  services,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Booking | null;
  presetSlot: string | null;
  clients: Client[];
  services: Service[];
  onSaved: () => void;
}) {
  const { push } = useToast();
  const [clientName, setClientName] = useState("");
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [clientPhone, setClientPhone] = useState("");
  const [serviceId, setServiceId] = useState<string>(services[0]?.id ?? "");
  const [startAt, setStartAt] = useState<string>(() =>
    presetSlot ? localDatetimeString(presetSlot) : localDatetimeString(new Date().toISOString())
  );
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Booking["status"]>("confirmed");

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setClientName(editing.clientName);
      setClientId(editing.clientId);
      setClientPhone(editing.clientPhone ?? "");
      setServiceId(editing.serviceId);
      setStartAt(localDatetimeString(editing.startAt));
      setNotes(editing.notes);
      setStatus(editing.status);
    } else {
      setClientName("");
      setClientId(undefined);
      setClientPhone("");
      setServiceId(services[0]?.id ?? "");
      setStartAt(presetSlot ? localDatetimeString(presetSlot) : localDatetimeString(new Date().toISOString()));
      setNotes("");
      setStatus("confirmed");
    }
  }, [open, editing, presetSlot, services]);

  const service = services.find((s) => s.id === serviceId);

  function selectClient(id: string) {
    if (id === "__new__") {
      setClientId(undefined);
      return;
    }
    const c = clients.find((x) => x.id === id);
    if (c) {
      setClientId(c.id);
      setClientName(c.fullName);
      setClientPhone(c.phone);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!service) {
      push("Seleziona un servizio", "error");
      return;
    }
    if (!clientName.trim()) {
      push("Inserisci il nome del cliente", "error");
      return;
    }
    const start = new Date(startAt);
    const end = new Date(start.getTime() + service.durationMin * 60_000);
    const now = new Date().toISOString();

    if (editing) {
      demoStore.upsertBooking({
        ...editing,
        clientName: clientName.trim(),
        clientId,
        clientPhone,
        serviceId: service.id,
        serviceName: service.name,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        price: service.price,
        notes,
        status,
      });
      push("Prenotazione aggiornata", "success");
    } else {
      demoStore.upsertBooking({
        id: generateId("bkg"),
        organizationId: DEMO_ORG_ID,
        clientName: clientName.trim(),
        clientId,
        clientPhone,
        serviceId: service.id,
        serviceName: service.name,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        price: service.price,
        status,
        notes,
        source: "internal",
        createdAt: now,
      });
      push("Prenotazione creata", "success");
    }
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Modifica prenotazione" : "Nuova prenotazione"}</DialogTitle>
          <DialogDescription>
            {editing ? "Aggiorna i dettagli dell'appuntamento." : "Inserisci i dati e conferma."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Cliente esistente</Label>
            <select
              value={clientId ?? "__new__"}
              onChange={(e) => selectClient(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/60"
            >
              <option value="__new__">— Nuovo cliente —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.fullName}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Nome</Label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} required />
            </div>
            <div>
              <Label>Telefono</Label>
              <Input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+39 ..." />
            </div>
          </div>
          <div>
            <Label>Servizio</Label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/60"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {s.durationMin} min — {formatCurrency(s.price)}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Data e ora</Label>
              <Input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} required />
            </div>
            <div>
              <Label>Stato</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Booking["status"])}
                className="flex h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/60"
              >
                {(Object.keys(STATUS_LABEL) as Booking["status"][]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label>Note</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Preferenze del cliente, richieste..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Annulla</Button>
            <Button type="submit">{editing ? "Aggiorna" : "Crea prenotazione"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
