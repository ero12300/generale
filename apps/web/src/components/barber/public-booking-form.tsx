"use client";

import { type FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Smartphone } from "lucide-react";
import { barberServices } from "@/lib/barber-data";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const slotOptions = ["09:30", "11:00", "13:00", "15:30", "17:30", "19:00"];

export function PublicBookingForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState(barberServices[0]?.id ?? "");
  const [slot, setSlot] = useState(slotOptions[1]);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedService = useMemo(
    () => barberServices.find((service) => service.id === serviceId) ?? barberServices[0],
    [serviceId]
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fullName.trim() || !phone.trim() || !selectedService) return;
    setSuccess(
      `${fullName} prenotato per ${selectedService.name} alle ${slot}. Conferma inviata via WhatsApp.`
    );
    setFullName("");
    setPhone("");
    setServiceId(barberServices[0]?.id ?? "");
    setSlot(slotOptions[1]);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="border-amber-500/20 bg-zinc-900/85">
        <CardHeader>
          <CardTitle>Prenota il tuo slot</CardTitle>
          <CardDescription>
            Link pubblico pronto per Vercel, sincronizzabile con Firebase e campagne retention.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="text-zinc-300">Nome cliente</span>
                <Input
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Mario Rossi"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-zinc-300">Telefono</span>
                <Input
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+39 333 123 4567"
                />
              </label>
            </div>

            <label className="space-y-2 text-sm block">
              <span className="text-zinc-300">Servizio</span>
              <select
                value={serviceId}
                onChange={(event) => setServiceId(event.target.value)}
                className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              >
                {barberServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} · {service.duration_minutes} min · {formatCurrency(service.price)}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm block">
              <span className="text-zinc-300">Slot disponibile</span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {slotOptions.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSlot(value)}
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                      slot === value
                        ? "border-amber-400 bg-amber-500/15 text-amber-200"
                        : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </label>

            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{selectedService?.name}</p>
                  <p className="text-xs text-zinc-500">
                    {selectedService?.duration_minutes} min · conferma smart via mobile
                  </p>
                </div>
                <p className="text-lg font-semibold text-amber-300">
                  {formatCurrency(selectedService?.price)}
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Conferma prenotazione demo
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock3 className="h-4 w-4 text-amber-400" aria-hidden />
              Cosa automatizza
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-300">
            <p>Riduce i messaggi manuali con uno slot picker chiaro e premium.</p>
            <p>Spinge gli upgrade ai pacchetti ad alto margine direttamente dal booking.</p>
            <p>Prepara la raccolta clienti per CRM, reminder e porta un amico.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Smartphone className="h-4 w-4 text-emerald-400" aria-hidden />
              Esito demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4" aria-hidden />
                  <p>{success}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-400">
                Compila il form per vedere la conferma istantanea della prenotazione.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
