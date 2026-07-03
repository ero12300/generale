"use client";

import { type FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BarberService } from "@deal-desk/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface AppointmentFormProps {
  services: BarberService[];
}

const defaultStartAt = () => {
  const date = new Date();
  date.setHours(date.getHours() + 2, 0, 0, 0);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
};

export function AppointmentForm({ services }: AppointmentFormProps) {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([services[0]?.id ?? ""]);
  const [barberName, setBarberName] = useState("Marco");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(
    () =>
      selectedServices.reduce((sum, serviceId) => {
        const service = services.find((item) => item.id === serviceId);
        return sum + (service?.price ?? 0);
      }, 0),
    [selectedServices, services]
  );

  function toggleService(serviceId: string) {
    setSelectedServices((current) =>
      current.includes(serviceId)
        ? current.filter((item) => item !== serviceId)
        : [...current, serviceId]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);
    setMessage(null);
    setError(null);

    const startsAt = formData.get("starts_at");
    const payload = {
      client_name: String(formData.get("client_name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? "") || null,
      service_ids: selectedServices.filter(Boolean),
      barber_name: barberName,
      starts_at: startsAt ? new Date(String(startsAt)).toISOString() : "",
      notes: String(formData.get("notes") ?? "") || null,
      channel: String(formData.get("channel") ?? "app"),
      referral_code: String(formData.get("referral_code") ?? "") || null,
    };

    const response = await fetch("/api/barber/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(data.error ?? "Impossibile creare la prenotazione");
      setLoading(false);
      return;
    }

    setMessage(data.message ?? "Prenotazione inserita");
    setSelectedServices([services[0]?.id ?? ""]);
    setBarberName("Marco");
    event.currentTarget.reset();
    setLoading(false);
    router.refresh();
  }

  return (
    <Card id="new-booking" className="border-amber-500/20 bg-zinc-900/90">
      <CardHeader>
        <CardTitle>Nuova prenotazione</CardTitle>
        <CardDescription>
          Flusso demo con loading, errore e conferma. Pronto per essere collegato a Firebase.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {message && (
          <p
            role="status"
            className="rounded-lg border border-emerald-800/70 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-300"
          >
            {message}
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-800/70 bg-red-950/30 px-3 py-2 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-zinc-300">Nome cliente</span>
            <input
              name="client_name"
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm"
              placeholder="Es. Andrea Sala"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-zinc-300">Telefono</span>
            <input
              name="phone"
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm"
              placeholder="+39 333 123 4567"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-zinc-300">Email</span>
            <input
              name="email"
              type="email"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm"
              placeholder="cliente@email.it"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-zinc-300">Data e ora</span>
            <input
              name="starts_at"
              type="datetime-local"
              required
              defaultValue={defaultStartAt()}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-zinc-300">Operatore</span>
            <select
              value={barberName}
              onChange={(event) => setBarberName(event.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm"
            >
              <option value="Marco">Marco</option>
              <option value="Tony">Tony</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-zinc-300">Canale</span>
            <select
              name="channel"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm"
              defaultValue="app"
            >
              <option value="app">App / widget</option>
              <option value="instagram">Instagram</option>
              <option value="phone">Telefono</option>
              <option value="walk_in">Walk-in</option>
            </select>
          </label>

          <div className="space-y-3 lg:col-span-2">
            <span className="text-sm text-zinc-300">Servizi</span>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => {
                const checked = selectedServices.includes(service.id);
                return (
                  <label
                    key={service.id}
                    className={`rounded-2xl border p-4 transition ${
                      checked
                        ? "border-amber-500/60 bg-amber-500/10"
                        : "border-zinc-800 bg-zinc-950"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleService(service.id)}
                        className="mt-1"
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{service.name}</p>
                        <p className="text-xs text-zinc-500">
                          {service.duration_minutes} min - {formatCurrency(service.price)}
                        </p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <label className="space-y-2">
            <span className="text-sm text-zinc-300">Codice referral</span>
            <input
              name="referral_code"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm"
              placeholder="Es. LUCA10"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-zinc-300">Note</span>
            <textarea
              name="notes"
              rows={3}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm"
              placeholder="Preferenze, allergie, upsell..."
            />
          </label>

          <div className="lg:col-span-2 flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-zinc-400">Totale previsto</p>
              <p className="text-2xl font-semibold text-amber-300">{formatCurrency(total)}</p>
            </div>
            <Button type="submit" disabled={loading || selectedServices.length === 0}>
              {loading ? "Salvataggio..." : "Conferma prenotazione"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
