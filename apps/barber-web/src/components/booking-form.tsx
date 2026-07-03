"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { services } from "@/lib/demo-data";
import { bookingRequestSchema } from "@/lib/validations";
import { formatCurrencyFromCents } from "@/lib/format";

type Status =
  | { type: "idle"; message: string }
  | { type: "loading"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function BookingForm() {
  const [status, setStatus] = useState<Status>({
    type: "idle",
    message: "Scegli servizio, giorno e orario: la richiesta viene validata prima del salvataggio.",
  });
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");

  const selectedService = useMemo(
    () => services.find((service) => service.id === serviceId) ?? services[0],
    [serviceId]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      serviceId,
      preferredDate: String(formData.get("preferredDate") ?? ""),
      preferredTime: String(formData.get("preferredTime") ?? ""),
      referralCode: String(formData.get("referralCode") ?? ""),
    };
    const parsed = bookingRequestSchema.safeParse(payload);

    if (!parsed.success) {
      setStatus({ type: "error", message: parsed.error.issues[0]?.message ?? "Controlla i dati" });
      return;
    }

    setStatus({ type: "loading", message: "Sto controllando lo slot e preparo la conferma..." });

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const data = (await response.json()) as { ok: boolean; message?: string };

    if (!response.ok || !data.ok) {
      setStatus({ type: "error", message: data.message ?? "Prenotazione non riuscita" });
      return;
    }

    setStatus({
      type: "success",
      message: "Prenotazione demo confermata: in produzione finisce nel calendario Firebase.",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-amber-400/20 bg-stone-950/75 p-5 shadow-2xl shadow-black/40 backdrop-blur"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">Booking live</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Prenota un appuntamento</h2>
        </div>
        <Sparkles className="h-6 w-6 text-amber-300" aria-hidden />
      </div>

      <div className="grid gap-3">
        <label className="grid gap-2 text-sm text-stone-300">
          Nome cliente
          <input
            name="fullName"
            placeholder="Es. Marco Rossi"
            className="rounded-2xl border border-stone-700 bg-stone-900/80 px-4 py-3 text-white placeholder:text-stone-500"
          />
        </label>
        <label className="grid gap-2 text-sm text-stone-300">
          Telefono
          <input
            name="phone"
            placeholder="+39 333 000 0000"
            className="rounded-2xl border border-stone-700 bg-stone-900/80 px-4 py-3 text-white placeholder:text-stone-500"
          />
        </label>
        <label className="grid gap-2 text-sm text-stone-300">
          Servizio
          <select
            value={serviceId}
            onChange={(event) => setServiceId(event.target.value)}
            className="rounded-2xl border border-stone-700 bg-stone-900/80 px-4 py-3 text-white"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} · {service.durationMinutes} min ·{" "}
                {formatCurrencyFromCents(service.priceCents)}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-2 text-sm text-stone-300">
            Data
            <input
              name="preferredDate"
              type="date"
              className="rounded-2xl border border-stone-700 bg-stone-900/80 px-4 py-3 text-white"
            />
          </label>
          <label className="grid gap-2 text-sm text-stone-300">
            Orario
            <input
              name="preferredTime"
              type="time"
              className="rounded-2xl border border-stone-700 bg-stone-900/80 px-4 py-3 text-white"
            />
          </label>
        </div>
        <label className="grid gap-2 text-sm text-stone-300">
          Codice amico o sconto
          <input
            name="referralCode"
            placeholder="MARCO20"
            className="rounded-2xl border border-stone-700 bg-stone-900/80 px-4 py-3 text-white placeholder:text-stone-500"
          />
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-400/15 bg-amber-400/10 p-4 text-sm text-amber-50">
        <p className="font-medium">{selectedService?.name}</p>
        <p className="mt-1 text-amber-100/70">
          {selectedService?.durationMinutes} minuti · {formatCurrencyFromCents(selectedService?.priceCents ?? 0)}
        </p>
      </div>

      <button
        type="submit"
        disabled={status.type === "loading"}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-300 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status.type === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Conferma richiesta
      </button>

      <p
        className={`mt-4 flex items-start gap-2 text-sm ${
          status.type === "error"
            ? "text-red-300"
            : status.type === "success"
              ? "text-emerald-300"
              : "text-stone-400"
        }`}
        role={status.type === "error" ? "alert" : "status"}
      >
        {status.type === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : null}
        {status.message}
      </p>
    </form>
  );
}
