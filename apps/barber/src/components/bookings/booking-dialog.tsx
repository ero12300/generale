"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/components/providers/data-provider";
import { useToast } from "@/components/providers/toast-provider";
import { computeSlotsForDay } from "@/lib/slots";
import { addDays, addMinutes, formatDateIT, formatTimeIT, startOfDay } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange(v: boolean): void;
  initialDate?: Date;
}

export function BookingDialog({ open, onOpenChange, initialDate }: Props) {
  const store = useStore();
  const toast = useToast();
  const activeServices = store.shop.services.filter((s) => s.active);
  const [serviceId, setServiceId] = useState(activeServices[0]?.id ?? "");
  const [date, setDate] = useState<Date>(initialDate ?? new Date());
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [existingClientId, setExistingClientId] = useState<string | undefined>(undefined);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedSlot(null);
      setNote("");
      setName("");
      setPhone("");
      setEmail("");
      setExistingClientId(undefined);
      setServiceId(store.shop.services.filter((s) => s.active)[0]?.id ?? "");
      setDate(initialDate ? startOfDay(initialDate) : startOfDay(new Date()));
    }
  }, [open, initialDate, store.shop.services]);

  const service = activeServices.find((s) => s.id === serviceId);

  const daySlots = useMemo(() => {
    if (!service) return [];
    const dayBookings = store.bookings.filter((b) => {
      const d = new Date(b.startAt);
      return d.toDateString() === date.toDateString();
    });
    return computeSlotsForDay(date, service, store.shop, dayBookings);
  }, [service, date, store.bookings, store.shop]);

  const submit = async () => {
    if (!service || !selectedSlot) {
      toast.error("Seleziona servizio e orario");
      return;
    }
    setSaving(true);
    try {
      const client = existingClientId
        ? store.clients.find((c) => c.id === existingClientId)
        : undefined;
      const clientName = client ? `${client.firstName} ${client.lastName ?? ""}`.trim() : name;
      if (!clientName) {
        toast.error("Serve il nome del cliente");
        setSaving(false);
        return;
      }
      const end = addMinutes(selectedSlot, service.durationMin);
      await store.createBooking({
        clientId: client?.id,
        clientName,
        clientPhone: client?.phone ?? phone,
        clientEmail: client?.email ?? email,
        serviceId: service.id,
        serviceName: service.name,
        priceEur: service.priceEur,
        durationMin: service.durationMin,
        startAt: selectedSlot.toISOString(),
        endAt: end.toISOString(),
        note: note || undefined,
        status: "confirmed",
        source: "manual",
      });
      toast.success("Prenotazione creata", `${clientName} · ${formatTimeIT(selectedSlot)}`);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const days = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 14 }, (_, i) => addDays(today, i));
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nuova prenotazione</DialogTitle>
          <DialogDescription>Scegli servizio, giorno e orario. Il cliente riceverà il promemoria.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div>
            <Label>Servizio</Label>
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger>
                <SelectValue placeholder="Scegli servizio" />
              </SelectTrigger>
              <SelectContent>
                {activeServices.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} · {s.durationMin} min · €{s.priceEur}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Giorno</Label>
            <div className="marquee-mask overflow-x-auto">
              <div className="flex gap-2 pb-1">
                {days.map((d) => {
                  const active = d.toDateString() === date.toDateString();
                  return (
                    <button
                      key={d.toISOString()}
                      type="button"
                      onClick={() => { setDate(d); setSelectedSlot(null); }}
                      className={cn(
                        "flex min-w-[68px] flex-col items-center rounded-xl border px-3 py-2 transition",
                        active
                          ? "border-[color:var(--color-gold-300)]/50 bg-[color:var(--color-gold-500)]/15 text-white"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                      )}
                    >
                      <span className="text-[10px] uppercase tracking-widest text-white/50">
                        {d.toLocaleDateString("it-IT", { weekday: "short" })}
                      </span>
                      <span className="font-display text-lg">{d.getDate()}</span>
                      <span className="text-[10px] text-white/50">
                        {d.toLocaleDateString("it-IT", { month: "short" })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <Label>Orari liberi · {formatDateIT(date, { weekday: "long", day: "2-digit", month: "long" })}</Label>
            {daySlots.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-sm text-white/50">
                Nessuno slot disponibile in questo giorno.
              </div>
            ) : (
              <div className="grid max-h-40 grid-cols-4 gap-1.5 overflow-y-auto sm:grid-cols-6">
                {daySlots.map((s) => {
                  const active = selectedSlot?.getTime() === s.getTime();
                  return (
                    <button
                      key={s.toISOString()}
                      type="button"
                      onClick={() => setSelectedSlot(s)}
                      className={cn(
                        "rounded-lg border px-2 py-1.5 text-xs transition",
                        active
                          ? "border-[color:var(--color-gold-300)]/60 bg-[color:var(--color-gold-500)]/20 text-white"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                      )}
                    >
                      {formatTimeIT(s)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <Label>Cliente esistente</Label>
            <Select value={existingClientId ?? "__new"} onValueChange={(v) => setExistingClientId(v === "__new" ? undefined : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Scegli oppure nuovo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__new">➕ Nuovo cliente</SelectItem>
                {store.clients.slice(0, 30).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.firstName} {c.lastName ?? ""} {c.phone ? `· ${c.phone}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!existingClientId && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Nome</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Es. Marco B." />
              </div>
              <div>
                <Label>Telefono</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+39 …" />
              </div>
              <div className="sm:col-span-2">
                <Label>Email (opzionale)</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="cliente@email.it" />
              </div>
            </div>
          )}

          <div>
            <Label>Note (opzionale)</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Preferenze, note interne, promemoria…" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Annulla</Button>
          <Button variant="gold" onClick={submit} disabled={saving || !selectedSlot}>
            {saving ? "Salvataggio…" : "Conferma prenotazione"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
