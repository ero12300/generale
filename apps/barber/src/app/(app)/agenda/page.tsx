"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, Clock, Plus, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiGet, apiSend } from "@/lib/client-api";
import { formatDate, formatTime } from "@/lib/utils";
import type { Booking, BookingStatus, Client, Service, Staff } from "@/lib/types";

interface Catalog {
  services: Service[];
  staff: Staff[];
}

const statusLabels: Record<BookingStatus, { label: string; variant: "success" | "warning" | "secondary" | "danger" }> = {
  pending: { label: "Da confermare", variant: "warning" },
  confirmed: { label: "Confermato", variant: "success" },
  completed: { label: "Completato", variant: "secondary" },
  cancelled: { label: "Annullato", variant: "danger" },
};

export default function AgendaPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [catalog, setCatalog] = useState<Catalog>({ services: [], staff: [] });
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    const [bk, cat, cl] = await Promise.all([
      apiGet<Booking[]>("/api/bookings"),
      apiGet<Catalog>("/api/catalog"),
      apiGet<Client[]>("/api/clients"),
    ]);
    setBookings(bk);
    setCatalog(cat);
    setClients(cl);
  }

  useEffect(() => {
    reload()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function changeStatus(id: string, status: BookingStatus) {
    await apiSend(`/api/bookings/${id}`, "PATCH", { status });
    await reload();
  }

  const grouped = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of bookings) {
      const key = new Date(b.start).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(b);
    }
    return [...map.entries()];
  }, [bookings]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Agenda</h1>
          <p className="mt-1 text-zinc-400">Gestisci appuntamenti e conferme.</p>
        </div>
        <NewBookingDialog
          services={catalog.services}
          staff={catalog.staff}
          clients={clients}
          onCreated={reload}
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-600/40 bg-red-600/10 px-4 py-3 text-red-300">
          {error}
        </p>
      )}

      {loading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-zinc-800/60" />
      ) : grouped.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-zinc-500">
            Nessun appuntamento. Crea il primo con &ldquo;Nuovo appuntamento&rdquo;.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map(([day, list]) => (
            <div key={day}>
              <div className="mb-3 flex items-center gap-2 text-sm text-zinc-400">
                <CalendarDays className="h-4 w-4 text-gold-soft" />
                <span className="font-medium capitalize">{formatDate(new Date(day).toISOString())}</span>
                <span className="text-zinc-600">· {list.length} appuntamenti</span>
              </div>
              <div className="space-y-2">
                {list.map((b) => (
                  <Card key={b.id}>
                    <CardContent className="flex flex-wrap items-center gap-4 p-4">
                      <div className="flex flex-col items-center rounded-lg bg-[#c9a24b]/10 px-3 py-2 text-gold-soft">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-semibold">{formatTime(b.start)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium">{b.clientName}</p>
                          {b.source === "online" && (
                            <Badge variant="info">online</Badge>
                          )}
                        </div>
                        <p className="truncate text-sm text-zinc-500">
                          {b.serviceName}
                          {b.staffName ? ` · ${b.staffName}` : ""} · {b.durationMin} min
                        </p>
                      </div>
                      <Badge variant={statusLabels[b.status].variant}>
                        {statusLabels[b.status].label}
                      </Badge>
                      <div className="flex gap-2">
                        {b.status === "pending" && (
                          <Button size="sm" onClick={() => changeStatus(b.id, "confirmed")}>
                            <Check className="h-3.5 w-3.5" /> Conferma
                          </Button>
                        )}
                        {(b.status === "confirmed" || b.status === "pending") && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => changeStatus(b.id, "completed")}
                          >
                            Completa & incassa
                          </Button>
                        )}
                        {b.status !== "cancelled" && b.status !== "completed" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            aria-label="Annulla appuntamento"
                            onClick={() => changeStatus(b.id, "cancelled")}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NewBookingDialog({
  services,
  staff,
  clients,
  onCreated,
}: {
  services: Service[];
  staff: Staff[];
  clients: Client[];
  onCreated: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setClientName("");
    setClientPhone("");
    setClientId("");
    setServiceId("");
    setStaffId("");
    setDate("");
    setTime("");
    setNotes("");
    setError(null);
  }

  function pickClient(id: string) {
    setClientId(id);
    const c = clients.find((x) => x.id === id);
    if (c) {
      setClientName(c.name);
      setClientPhone(c.phone);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const start = new Date(`${date}T${time}`).toISOString();
      await apiSend("/api/bookings", "POST", {
        clientId: clientId || null,
        clientName,
        clientPhone,
        serviceId,
        staffId: staffId || null,
        start,
        source: "interno",
        notes,
      });
      await onCreated();
      reset();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Nuovo appuntamento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuovo appuntamento</DialogTitle>
          <DialogDescription>Aggiungi una prenotazione in agenda.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="existing">Cliente esistente (opzionale)</Label>
            <Select
              id="existing"
              value={clientId}
              onChange={(e) => pickClient(e.target.value)}
            >
              <option value="">Nuovo cliente / occasionale</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.phone}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefono</Label>
              <Input id="phone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="service">Servizio</Label>
            <Select id="service" value={serviceId} onChange={(e) => setServiceId(e.target.value)} required>
              <option value="">Seleziona…</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.durationMin} min · {s.price}€
                </option>
              ))}
            </Select>
          </div>
          {staff.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="staff">Operatore</Label>
              <Select id="staff" value={staffId} onChange={(e) => setStaffId(e.target.value)}>
                <option value="">Qualsiasi</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} — {s.role}</option>
                ))}
              </Select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Ora</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Note</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Preferenze, richieste…" />
          </div>
          {error && (
            <p className="rounded-lg border border-red-600/40 bg-red-600/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit" disabled={saving}>
              <User className="h-4 w-4" /> {saving ? "Salvataggio…" : "Crea appuntamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
