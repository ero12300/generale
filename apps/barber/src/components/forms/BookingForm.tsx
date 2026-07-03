"use client";

import { useActionState } from "react";
import {
  createBooking,
  createPublicBooking,
  type ActionResult,
} from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";
import { buttonPrimary, inputClass, labelClass } from "@/components/ui";
import { formatEuro } from "@/lib/money";
import type { Service } from "@/lib/types";

export function BookingForm({
  services,
  variant,
}: {
  services: Service[];
  variant: "interno" | "online";
}) {
  const [result, action, pending] = useActionState<ActionResult | null, FormData>(
    variant === "online" ? createPublicBooking : createBooking,
    null
  );
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="booking-name" className={labelClass}>
          Nome cliente
        </label>
        <input
          id="booking-name"
          name="clientName"
          className={inputClass}
          placeholder="Es. Mario Verdi"
          required
        />
      </div>
      <div>
        <label htmlFor="booking-phone" className={labelClass}>
          Telefono
        </label>
        <input
          id="booking-phone"
          name="clientPhone"
          className={inputClass}
          placeholder="+39 333 000 0000"
          required
        />
      </div>
      <div>
        <label htmlFor="booking-service" className={labelClass}>
          Servizio
        </label>
        <select id="booking-service" name="serviceId" className={inputClass} required>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {formatEuro(s.priceCents)} · {s.durationMin} min
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="booking-date" className={labelClass}>
            Data
          </label>
          <input
            id="booking-date"
            name="date"
            type="date"
            min={today}
            defaultValue={today}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label htmlFor="booking-time" className={labelClass}>
            Orario
          </label>
          <input
            id="booking-time"
            name="time"
            type="time"
            min="09:00"
            max="19:30"
            step={1800}
            defaultValue="10:00"
            className={inputClass}
            required
          />
        </div>
      </div>

      <ActionMessage result={result} />

      <button type="submit" className={`${buttonPrimary} w-full`} disabled={pending}>
        {pending
          ? "Invio…"
          : variant === "online"
            ? "Prenota il tuo posto"
            : "Aggiungi prenotazione"}
      </button>
    </form>
  );
}
