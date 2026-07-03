"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import type { BarberBooking, BarberService } from "@deal-desk/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrencyCents } from "@/lib/utils";

interface BookingFormProps {
  services: BarberService[];
  compact?: boolean;
}

function defaultDateTimeValue() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(10, 0, 0, 0);
  return date.toISOString().slice(0, 16);
}

export function BookingForm({ services, compact = false }: BookingFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [startsAt, setStartsAt] = useState(defaultDateTimeValue);
  const [referralCode, setReferralCode] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<BarberBooking | null>(null);

  const selectedService = useMemo(
    () => services.find((service) => service.id === serviceId),
    [serviceId, services]
  );

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setCreatedBooking(null);

    const response = await fetch("/api/public/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: customerName,
        customer_phone: customerPhone,
        service_id: serviceId,
        starts_at: new Date(startsAt).toISOString(),
        referral_code: referralCode || null,
        notes: notes || null,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Prenotazione non riuscita");
      setLoading(false);
      return;
    }

    setCreatedBooking(data);
    setCustomerName("");
    setCustomerPhone("");
    setReferralCode("");
    setNotes("");
    setLoading(false);
  }

  return (
    <form onSubmit={submitBooking} className="space-y-4">
      {createdBooking && (
        <div role="status" className="rounded-lg border border-emerald-700/50 bg-emerald-950/30 p-3 text-sm text-emerald-200">
          Richiesta ricevuta per {createdBooking.service_name}. Codice: {createdBooking.id}
        </div>
      )}
      {error && (
        <div role="alert" className="rounded-lg border border-red-800/60 bg-red-950/30 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className={compact ? "grid gap-3" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-2">
          <Label htmlFor="customer_name">Nome cliente</Label>
          <Input
            id="customer_name"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Mario Rossi"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer_phone">Telefono</Label>
          <Input
            id="customer_phone"
            value={customerPhone}
            onChange={(event) => setCustomerPhone(event.target.value)}
            placeholder="+39 333 1234567"
            required
          />
        </div>
      </div>

      <div className={compact ? "grid gap-3" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-2">
          <Label htmlFor="service_id">Servizio</Label>
          <select
            id="service_id"
            value={serviceId}
            onChange={(event) => setServiceId(event.target.value)}
            className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
            required
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {formatCurrencyCents(service.price_cents)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="starts_at">Data e ora</Label>
          <Input
            id="starts_at"
            type="datetime-local"
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
            required
          />
        </div>
      </div>

      <div className={compact ? "grid gap-3" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-2">
          <Label htmlFor="referral_code">Codice porta un amico</Label>
          <Input
            id="referral_code"
            value={referralCode}
            onChange={(event) => setReferralCode(event.target.value)}
            placeholder="MARCO20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Note</Label>
          <Input
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Taglio sfumato, barba corta..."
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-zinc-500">
          {selectedService
            ? `${selectedService.duration_minutes} min - ${formatCurrencyCents(selectedService.price_cents)}`
            : "Seleziona un servizio"}
        </p>
        <Button type="submit" disabled={loading || services.length === 0}>
          {loading ? "Invio in corso..." : "Richiedi prenotazione"}
        </Button>
      </div>
    </form>
  );
}
