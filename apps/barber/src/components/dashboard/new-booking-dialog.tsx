"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { demoStore } from "@/lib/demo-store";
import { useShopData } from "@/hooks/use-shop-data";
import { toast } from "@/components/ui/toaster";

export function NewBookingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { services, clients } = useShopData();
  const [clientName, setClientName] = React.useState("");
  const [clientPhone, setClientPhone] = React.useState("");
  const [serviceId, setServiceId] = React.useState(services[0]?.id ?? "");
  const [date, setDate] = React.useState(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    return d.toISOString().slice(0, 16);
  });
  const [notes, setNotes] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  function reset() {
    setClientName("");
    setClientPhone("");
    setNotes("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!serviceId || !clientName) return;
    setSaving(true);
    const svc = services.find((s) => s.id === serviceId);
    if (!svc) {
      setSaving(false);
      return;
    }
    const start = new Date(date);
    const end = new Date(start.getTime() + svc.durationMinutes * 60_000);

    // Auto-crea o riusa cliente
    let existing = clients.find(
      (c) => c.name.toLowerCase() === clientName.toLowerCase()
    );
    if (!existing) {
      existing = demoStore.createClient({
        name: clientName,
        phone: clientPhone || undefined,
        tags: ["Nuovo"],
      });
    }

    demoStore.createBooking({
      clientId: existing.id,
      clientName,
      clientPhone: clientPhone || undefined,
      serviceId: svc.id,
      serviceName: svc.name,
      priceCents: svc.priceCents,
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
      status: "confirmed",
      source: "internal",
      notes: notes || undefined,
    });

    toast({
      title: "Prenotazione creata",
      description: `${clientName} · ${svc.name}`,
      variant: "success",
    });
    setSaving(false);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuova prenotazione</DialogTitle>
          <DialogDescription>
            Aggiungi manualmente un appuntamento in agenda.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cname">Cliente</Label>
              <Input
                id="cname"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nome cognome"
                required
                list="clients-list"
              />
              <datalist id="clients-list">
                {clients.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cphone">Telefono</Label>
              <Input
                id="cphone"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+39 ..."
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="svc">Servizio</Label>
            <select
              id="svc"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full h-11 rounded-md bg-black/30 border border-white/10 px-3 text-sm text-ink-100 focus:border-[color:var(--color-gold-500)]/60 outline-none"
              required
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.durationMinutes}min · {(s.priceCents / 100).toFixed(2)}€
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="date">Data e ora</Label>
            <Input
              id="date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Note (opzionale)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Preferenze, allergie, dettagli..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Annulla
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvo..." : "Crea prenotazione"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
