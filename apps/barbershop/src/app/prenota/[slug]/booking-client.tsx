"use client";

import { useState } from "react";
import {
  Scissors,
  Clock,
  Check,
  CalendarCheck,
  ChevronRight,
  User,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCents } from "@/lib/money";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

function defaultDateTime(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

export function BookingClient() {
  const { data, addBooking } = useStore();
  const [step, setStep] = useState<1 | 2 | 3 | "done">(1);
  const [serviceId, setServiceId] = useState<string>("");
  const [staffId, setStaffId] = useState<string>(data.staff[0]?.id ?? "");
  const [startAt, setStartAt] = useState(defaultDateTime());
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const services = data.services.filter((s) => s.active);
  const staff = data.staff.filter((s) => s.active);
  const selectedService = services.find((s) => s.id === serviceId);

  function confirm() {
    if (!name.trim() || !phone.trim()) {
      setError("Inserisci nome e telefono.");
      return;
    }
    addBooking({
      clientId: null,
      clientName: name.trim(),
      clientPhone: phone.trim(),
      serviceId,
      staffId,
      startAt: new Date(startAt).toISOString(),
      source: "online",
    });
    setError("");
    setStep("done");
  }

  return (
    <div className="min-h-screen bg-premium text-zinc-100">
      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 text-zinc-950">
            <Scissors className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-bold">{data.organization.name}</h1>
            <p className="text-xs text-zinc-500">{data.organization.address}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-8">
        {step !== "done" && (
          <div className="mb-8 flex items-center gap-2 text-xs text-zinc-500">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                    step >= (s as 1 | 2 | 3)
                      ? "bg-amber-500 text-zinc-950"
                      : "bg-zinc-800 text-zinc-500"
                  )}
                >
                  {s}
                </span>
                {s < 3 && <span className="h-px w-8 bg-zinc-800" />}
              </div>
            ))}
            <span className="ml-2">
              {step === 1 ? "Servizio" : step === 2 ? "Barbiere e orario" : "I tuoi dati"}
            </span>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold">Scegli il servizio</h2>
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setServiceId(s.id);
                  setStep(2);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-left transition hover:border-amber-500/50 hover:bg-zinc-900"
              >
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="flex items-center gap-1 text-sm text-zinc-500">
                    <Clock className="h-3.5 w-3.5" /> {s.durationMin} min
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-300">{formatCents(s.priceCents)}</span>
                  <ChevronRight className="h-4 w-4 text-zinc-600" />
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Barbiere e orario</h2>
            <div>
              <Label>Barbiere</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {staff.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStaffId(s.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border p-3 text-left transition",
                      staffId === s.id
                        ? "border-amber-500/60 bg-amber-500/10"
                        : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                    )}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: s.color + "33", color: s.color }}>
                      <User className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-zinc-500">{s.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pub-datetime">Giorno e ora</Label>
              <Input
                id="pub-datetime"
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Indietro
              </Button>
              <Button className="flex-1" onClick={() => setStep(3)}>
                Continua
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">I tuoi dati</h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm">
              <p className="font-medium">{selectedService?.name}</p>
              <p className="text-zinc-500">
                {data.staff.find((s) => s.id === staffId)?.name} · {formatDateTime(new Date(startAt).toISOString())}
              </p>
              <p className="mt-1 font-semibold text-amber-300">
                {formatCents(selectedService?.priceCents ?? 0)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pub-name">Nome</Label>
                <Input id="pub-name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pub-phone">Telefono</Label>
                <Input id="pub-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Indietro
              </Button>
              <Button className="flex-1" onClick={confirm}>
                <CalendarCheck className="h-4 w-4" /> Prenota ora
              </Button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="py-12 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
              <Check className="h-8 w-8" />
            </span>
            <h2 className="mt-6 text-2xl font-bold">Prenotazione inviata!</h2>
            <p className="mt-2 text-zinc-400">
              Grazie {name}. La tua richiesta per <strong>{selectedService?.name}</strong> è
              stata inviata al salone e verrà confermata a breve.
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {formatDateTime(new Date(startAt).toISOString())}
            </p>
            <Button
              className="mt-8"
              variant="secondary"
              onClick={() => {
                setStep(1);
                setServiceId("");
                setName("");
                setPhone("");
              }}
            >
              Prenota un altro appuntamento
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
