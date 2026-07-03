"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCents } from "@/lib/money";

function defaultDateTime(): string {
  const d = new Date();
  d.setHours(d.getHours() + 1, 0, 0, 0);
  // formato per input datetime-local
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 16);
}

export function NewBookingDialog() {
  const { data, addBooking } = useStore();
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState<string>("");
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [serviceId, setServiceId] = useState(data.services[0]?.id ?? "");
  const [staffId, setStaffId] = useState(data.staff[0]?.id ?? "");
  const [startAt, setStartAt] = useState(defaultDateTime());
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const activeServices = data.services.filter((s) => s.active);
  const activeStaff = data.staff.filter((s) => s.active);

  function reset() {
    setClientId("");
    setManualName("");
    setManualPhone("");
    setServiceId(data.services[0]?.id ?? "");
    setStaffId(data.staff[0]?.id ?? "");
    setStartAt(defaultDateTime());
    setNotes("");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const client = data.clients.find((c) => c.id === clientId);
    const name = client?.name ?? manualName.trim();
    const phone = client?.phone ?? manualPhone.trim();
    if (!name) {
      setError("Seleziona un cliente o inserisci un nome.");
      return;
    }
    if (!serviceId || !staffId) {
      setError("Seleziona servizio e barbiere.");
      return;
    }
    addBooking({
      clientId: client?.id ?? null,
      clientName: name,
      clientPhone: phone,
      serviceId,
      staffId,
      startAt: new Date(startAt).toISOString(),
      notes,
      source: "internal",
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Nuova prenotazione
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuova prenotazione</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="bk-client">Cliente esistente</Label>
            <Select
              id="bk-client"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            >
              <option value="">— Nuovo cliente occasionale —</option>
              {data.clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.phone}
                </option>
              ))}
            </Select>
          </div>

          {!clientId && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="bk-name">Nome</Label>
                <Input
                  id="bk-name"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Mario Bianchi"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bk-phone">Telefono</Label>
                <Input
                  id="bk-phone"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="+39 ..."
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bk-service">Servizio</Label>
              <Select
                id="bk-service"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
              >
                {activeServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · {formatCents(s.priceCents)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bk-staff">Barbiere</Label>
              <Select
                id="bk-staff"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
              >
                {activeStaff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bk-datetime">Data e ora</Label>
            <Input
              id="bk-datetime"
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bk-notes">Note (opzionale)</Label>
            <Input
              id="bk-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Preferenze, richieste..."
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annulla
              </Button>
            </DialogClose>
            <Button type="submit">Salva prenotazione</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
