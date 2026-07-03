"use client";

import { useEffect, useMemo, useState } from "react";
import type { BarberBooking, BarberClient, BarberService } from "@deal-desk/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

interface BookingFormState {
  client_id: string;
  service_id: string;
  barber_name: string;
  starts_at: string;
  ends_at: string;
  price_amount: string;
  deposit_amount: string;
}

const initialForm: BookingFormState = {
  client_id: "",
  service_id: "",
  barber_name: "",
  starts_at: "",
  ends_at: "",
  price_amount: "",
  deposit_amount: "0",
};

function toIsoDateTime(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const localPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  if (!localPattern.test(trimmed)) return null;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

const statusSequence: BarberBooking["status"][] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
];

export function BookingsManager() {
  const [clients, setClients] = useState<BarberClient[]>([]);
  const [services, setServices] = useState<BarberService[]>([]);
  const [bookings, setBookings] = useState<BarberBooking[]>([]);
  const [form, setForm] = useState<BookingFormState>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clientMap = useMemo(
    () => Object.fromEntries(clients.map((client) => [client.id, client.full_name])),
    [clients]
  );
  const serviceMap = useMemo(
    () => Object.fromEntries(services.map((service) => [service.id, service.name])),
    [services]
  );

  async function loadAll() {
    setIsLoading(true);
    setError(null);
    try {
      const [clientsRes, servicesRes, bookingsRes] = await Promise.all([
        fetch("/api/barber/clients"),
        fetch("/api/barber/services"),
        fetch("/api/barber/bookings"),
      ]);
      const [clientsData, servicesData, bookingsData] = await Promise.all([
        clientsRes.json(),
        servicesRes.json(),
        bookingsRes.json(),
      ]);
      if (!clientsRes.ok) throw new Error(clientsData.error ?? "Errore caricamento clienti");
      if (!servicesRes.ok) throw new Error(servicesData.error ?? "Errore caricamento servizi");
      if (!bookingsRes.ok) throw new Error(bookingsData.error ?? "Errore caricamento prenotazioni");
      setClients(clientsData);
      setServices(servicesData);
      setBookings(bookingsData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Errore caricamento dati");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  useEffect(() => {
    if (!form.service_id) return;
    const selected = services.find((service) => service.id === form.service_id);
    if (!selected) return;
    setForm((current) => ({ ...current, price_amount: String(selected.price_amount) }));
  }, [form.service_id, services]);

  async function createBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const startsAtIso = toIsoDateTime(form.starts_at);
      const endsAtIso = toIsoDateTime(form.ends_at);
      if (!startsAtIso || !endsAtIso) {
        throw new Error("Usa formato data: YYYY-MM-DDTHH:mm");
      }
      const payload = {
        client_id: form.client_id,
        service_id: form.service_id,
        barber_name: form.barber_name || null,
        starts_at: startsAtIso,
        ends_at: endsAtIso,
        price_amount: Number(form.price_amount),
        deposit_amount: Number(form.deposit_amount || "0"),
      };
      const response = await fetch("/api/barber/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Errore creazione prenotazione");
      setBookings((current) => [data, ...current]);
      setForm(initialForm);
      setSuccess("Prenotazione creata con successo.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Errore salvataggio prenotazione");
    } finally {
      setIsSaving(false);
    }
  }

  async function cycleStatus(booking: BarberBooking) {
    const currentIndex = statusSequence.indexOf(booking.status);
    const nextStatus = statusSequence[(currentIndex + 1) % statusSequence.length];
    const response = await fetch(`/api/barber/bookings/${booking.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Errore aggiornamento stato");
      return;
    }
    setBookings((current) => current.map((item) => (item.id === booking.id ? data : item)));
  }

  return (
    <div className="grid xl:grid-cols-[1.1fr,1fr] gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuova prenotazione</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createBooking} className="space-y-3">
            <select
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
              value={form.client_id}
              onChange={(event) => setForm((current) => ({ ...current, client_id: event.target.value }))}
              required
            >
              <option value="">Seleziona cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.full_name}
                </option>
              ))}
            </select>
            <select
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
              value={form.service_id}
              onChange={(event) => setForm((current) => ({ ...current, service_id: event.target.value }))}
              required
            >
              <option value="">Seleziona servizio</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} ({service.duration_minutes} min)
                </option>
              ))}
            </select>
            <Input
              placeholder="Barbiere assegnato"
              value={form.barber_name}
              onChange={(event) => setForm((current) => ({ ...current, barber_name: event.target.value }))}
            />
            <Input
              type="text"
              inputMode="numeric"
              placeholder="2026-07-05T15:00"
              value={form.starts_at}
              onChange={(event) => setForm((current) => ({ ...current, starts_at: event.target.value }))}
              required
            />
            <Input
              type="text"
              inputMode="numeric"
              placeholder="2026-07-05T15:45"
              value={form.ends_at}
              onChange={(event) => setForm((current) => ({ ...current, ends_at: event.target.value }))}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Prezzo"
                value={form.price_amount}
                onChange={(event) => setForm((current) => ({ ...current, price_amount: event.target.value }))}
                required
              />
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Acconto"
                value={form.deposit_amount}
                onChange={(event) => setForm((current) => ({ ...current, deposit_amount: event.target.value }))}
              />
            </div>
            <Button type="submit" disabled={isSaving || clients.length === 0 || services.length === 0} className="w-full">
              {isSaving ? "Salvataggio..." : "Crea prenotazione"}
            </Button>
            {success && <p className="text-xs text-emerald-400">{success}</p>}
            {error && <p className="text-xs text-rose-400">{error}</p>}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Agenda prenotazioni</CardTitle>
          <Button variant="outline" size="sm" onClick={() => void loadAll()} disabled={isLoading}>
            Aggiorna
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading && <p className="text-sm text-zinc-500">Caricamento agenda...</p>}
          {!isLoading &&
            bookings.map((booking) => (
              <button
                type="button"
                key={booking.id}
                onClick={() => void cycleStatus(booking)}
                className="w-full text-left rounded-lg border border-zinc-800 p-3 hover:border-amber-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{clientMap[booking.client_id] ?? "Cliente"}</p>
                  <Badge variant="secondary" className="capitalize">
                    {booking.status}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {serviceMap[booking.service_id] ?? "Servizio"} · {new Date(booking.starts_at).toLocaleString("it-IT")}
                </p>
                <p className="text-xs text-amber-400 mt-1">{formatCurrency(booking.price_amount)}</p>
              </button>
            ))}
          {!isLoading && bookings.length === 0 && (
            <p className="text-sm text-zinc-500">Nessuna prenotazione registrata.</p>
          )}
          <p className="text-xs text-zinc-500">Suggerimento: clicca su una card per cambiare stato rapidamente.</p>
        </CardContent>
      </Card>
    </div>
  );
}
