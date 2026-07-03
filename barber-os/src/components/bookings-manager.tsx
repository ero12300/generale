"use client";

import { useEffect, useMemo, useState } from "react";
import { getStore, generateId } from "@/lib/store";
import type { Booking, BookingStatus, Service, Transaction } from "@/lib/types";
import { formatEuro, todayISO } from "@/lib/types";

type Status = "loading" | "ready" | "error";

const STATUS_STYLES: Record<BookingStatus, string> = {
  confermata: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  completata: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  annullata: "border-red-400/40 bg-red-400/10 text-red-300",
};

export function BookingsManager() {
  const [status, setStatus] = useState<Status>("loading");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [filter, setFilter] = useState<"future" | "all">("future");

  useEffect(() => {
    const store = getStore();
    Promise.all([store.listBookings(), store.listServices()])
      .then(([books, svcs]) => {
        setBookings(books);
        setServices(svcs);
        setStatus("ready");
      })
      .catch(() => {
        setErrorMsg("Impossibile caricare le prenotazioni.");
        setStatus("error");
      });
  }, []);

  const visible = useMemo(() => {
    const today = todayISO();
    const list =
      filter === "future"
        ? bookings.filter((b) => b.date >= today && b.status !== "annullata")
        : bookings;
    return [...list].sort((a, b) =>
      `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)
    );
  }, [bookings, filter]);

  function serviceName(id: string): string {
    return services.find((s) => s.id === id)?.name ?? "Servizio";
  }

  async function updateStatus(booking: Booking, next: BookingStatus) {
    setErrorMsg("");
    const updated = { ...booking, status: next };
    try {
      const store = getStore();
      await store.saveBooking(updated);
      // Completare una prenotazione registra automaticamente l'incasso
      if (next === "completata" && booking.status !== "completata") {
        const tx: Transaction = {
          id: generateId(),
          date: todayISO(),
          amountCents: updated.finalPriceCents,
          method: "contanti",
          description: `${serviceName(updated.serviceId)} — ${updated.customerName}`,
          bookingId: updated.id,
        };
        await store.saveTransaction(tx);
      }
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    } catch {
      setErrorMsg("Errore durante l'aggiornamento.");
    }
  }

  if (status === "loading") {
    return <div className="card animate-pulse text-cream-dim">Caricamento agenda…</div>;
  }
  if (status === "error") {
    return <div className="card border-red-500/40 text-red-300">{errorMsg}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Agenda prenotazioni</h1>
          <p className="mt-1 text-cream-dim">
            Completa una prenotazione per registrare automaticamente l&apos;incasso.
          </p>
        </div>
        <div role="group" aria-label="Filtro prenotazioni" className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilter("future")}
            aria-pressed={filter === "future"}
            className={filter === "future" ? "btn-gold !px-4 !py-2" : "btn-outline !px-4 !py-2"}
          >
            In arrivo
          </button>
          <button
            type="button"
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
            className={filter === "all" ? "btn-gold !px-4 !py-2" : "btn-outline !px-4 !py-2"}
          >
            Tutte
          </button>
        </div>
      </div>

      {errorMsg && (
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMsg}
        </p>
      )}

      {visible.length === 0 ? (
        <div className="card text-center text-cream-dim">
          Nessuna prenotazione {filter === "future" ? "in arrivo" : "registrata"}. Le
          prenotazioni fatte dai clienti dalla pagina pubblica compaiono qui.
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((booking) => (
            <li key={booking.id} className="card flex flex-wrap items-center gap-4 !py-4">
              <div className="min-w-24 text-center">
                <p className="text-2xl font-bold text-gold">{booking.time}</p>
                <p className="text-xs text-cream-dim">
                  {new Date(booking.date + "T00:00:00").toLocaleDateString("it-IT", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{booking.customerName}</p>
                <p className="text-sm text-cream-dim">
                  {serviceName(booking.serviceId)} · {booking.phone}
                  {booking.discountCode && (
                    <span className="ml-2 rounded bg-gold/15 px-2 py-0.5 text-xs text-gold">
                      {booking.discountCode}
                    </span>
                  )}
                </p>
              </div>
              <p className="font-bold text-gold">{formatEuro(booking.finalPriceCents)}</p>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${STATUS_STYLES[booking.status]}`}
              >
                {booking.status}
              </span>
              {booking.status === "confermata" && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn-gold !px-4 !py-2 !text-xs"
                    onClick={() => updateStatus(booking, "completata")}
                  >
                    Completa
                  </button>
                  <button
                    type="button"
                    className="btn-outline !border-red-400/50 !px-4 !py-2 !text-xs !text-red-300 hover:!bg-red-500/10"
                    onClick={() => updateStatus(booking, "annullata")}
                  >
                    Annulla
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
