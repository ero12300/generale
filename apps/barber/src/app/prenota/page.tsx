"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Check, Clock, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiGet, apiSend } from "@/lib/client-api";
import { formatCurrencyShort } from "@/lib/utils";
import type { Organization, Service, Staff } from "@/lib/types";

interface Catalog {
  services: Service[];
  staff: Staff[];
  org: Organization;
}

export default function PrenotaPage() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    apiGet<Catalog>("/api/catalog")
      .then(setCatalog)
      .catch((e) => setError(e.message));
  }, []);

  const selectedService = catalog?.services.find((s) => s.id === serviceId);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const start = new Date(`${date}T${time}`).toISOString();
      await apiSend("/api/bookings", "POST", {
        clientName: name,
        clientPhone: phone,
        serviceId,
        staffId: staffId || null,
        start,
        source: "online",
        notes,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-premium text-zinc-100">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-[#e3c680] to-[#c9a24b] text-zinc-950">
            <Scissors className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold gold-gradient-text">
            {catalog?.org.name ?? "Lama d'Oro"}
          </span>
        </div>
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">
          Sito
        </Link>
      </header>

      <main className="mx-auto max-w-2xl px-5 pb-16">
        {done ? (
          <div className="mt-10 rounded-3xl border border-emerald-600/40 bg-emerald-600/10 p-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-300">
              <Check className="h-7 w-7" />
            </span>
            <h1 className="mt-5 font-display text-2xl font-semibold">Richiesta inviata!</h1>
            <p className="mt-2 text-zinc-300">
              Grazie {name.split(" ")[0]}, abbiamo ricevuto la tua richiesta di prenotazione.
              Ti confermeremo l&apos;appuntamento al più presto.
            </p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => {
                setDone(false);
                setServiceId("");
                setStaffId("");
                setDate("");
                setTime("");
                setName("");
                setPhone("");
                setNotes("");
              }}
            >
              Prenota un altro servizio
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-6 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/40 bg-[#c9a24b]/10 px-4 py-1.5 text-xs text-gold-soft">
                <CalendarCheck className="h-3.5 w-3.5" /> Prenotazione online
              </span>
              <h1 className="mt-4 font-display text-3xl font-bold">Prenota il tuo appuntamento</h1>
              <p className="mt-2 text-zinc-400">
                Scegli il servizio e l&apos;orario. Ti bastano 30 secondi.
              </p>
            </div>

            <form
              onSubmit={submit}
              className="mt-8 space-y-5 rounded-3xl border border-zinc-800 bg-[#17171a]/80 p-6 card-ring"
            >
              <div className="space-y-2">
                <Label htmlFor="p-service">Servizio</Label>
                <Select id="p-service" value={serviceId} onChange={(e) => setServiceId(e.target.value)} required>
                  <option value="">Seleziona un servizio…</option>
                  {catalog?.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.durationMin} min · {formatCurrencyShort(s.price)}
                    </option>
                  ))}
                </Select>
                {selectedService && (
                  <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Clock className="h-3.5 w-3.5" /> Durata {selectedService.durationMin} minuti ·{" "}
                    {formatCurrencyShort(selectedService.price)}
                  </p>
                )}
              </div>

              {catalog && catalog.staff.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="p-staff">Barbiere (opzionale)</Label>
                  <Select id="p-staff" value={staffId} onChange={(e) => setStaffId(e.target.value)}>
                    <option value="">Nessuna preferenza</option>
                    {catalog.staff.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} — {s.role}</option>
                    ))}
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="p-date">Data</Label>
                  <Input id="p-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-time">Ora</Label>
                  <Input id="p-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="p-name">Nome e cognome</Label>
                  <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-phone">Telefono</Label>
                  <Input id="p-phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="p-notes">Note (opzionale)</Label>
                <Textarea id="p-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Preferenze, richieste particolari…" />
              </div>

              {error && (
                <p className="rounded-lg border border-red-600/40 bg-red-600/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={saving}>
                {saving ? "Invio in corso…" : "Richiedi appuntamento"}
              </Button>
              <p className="text-center text-xs text-zinc-500">
                Riceverai conferma dal salone. I tuoi dati sono trattati nel rispetto della privacy.
              </p>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
