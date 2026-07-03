"use client";

import { useCallback, useEffect, useState } from "react";
import { CircleAlert, Loader2 } from "lucide-react";
import type { Appointment, AppointmentStatus, PaymentMethod } from "@/lib/types";
import { formatEuro } from "@/lib/money";
import { longDateLabel, todayISO } from "@/lib/dates";
import { cn } from "@/lib/cn";

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  in_attesa: "border-gold-dim/60 text-gold-soft",
  confermato: "border-sky-700 text-sky-300",
  completato: "border-emerald-800 text-success",
  annullato: "border-border text-muted line-through",
};

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  in_attesa: "In attesa",
  confermato: "Confermato",
  completato: "Completato",
  annullato: "Annullato",
};

export function AgendaView() {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/appointments")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => setAppointments(data.appointments))
      .catch(() => setError("Impossibile caricare l'agenda."));
  }, []);

  useEffect(load, [load]);

  async function updateStatus(
    id: string,
    status: AppointmentStatus,
    paymentMethod?: PaymentMethod,
  ) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, paymentMethod }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Operazione non riuscita.");
        return;
      }
      setPayingId(null);
      load();
    } catch {
      setError("Connessione non riuscita.");
    } finally {
      setBusyId(null);
    }
  }

  if (error && !appointments) {
    return (
      <p className="flex items-center gap-2 rounded-2xl border border-danger/40 bg-surface p-5 text-danger">
        <CircleAlert className="h-5 w-5" aria-hidden /> {error}
      </p>
    );
  }

  if (!appointments) {
    return (
      <p className="flex items-center gap-2 text-muted">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Caricamento
        agenda…
      </p>
    );
  }

  const today = todayISO();
  const upcoming = appointments.filter((a) => a.date >= today);
  const byDate = new Map<string, Appointment[]>();
  for (const a of upcoming) {
    byDate.set(a.date, [...(byDate.get(a.date) ?? []), a]);
  }

  if (upcoming.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-surface p-8 text-center text-muted">
        Nessun appuntamento in programma. Le nuove prenotazioni online
        appariranno qui.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <p className="flex items-center gap-2 rounded-xl border border-danger/40 bg-surface p-4 text-sm text-danger" role="alert">
          <CircleAlert className="h-4 w-4" aria-hidden /> {error}
        </p>
      )}
      {[...byDate.entries()].map(([date, list]) => (
        <section key={date} aria-label={`Appuntamenti del ${date}`}>
          <h2 className="font-display mb-3 text-lg font-semibold capitalize">
            {date === today ? "Oggi — " : ""}
            {longDateLabel(date)}
          </h2>
          <ul className="space-y-3">
            {list.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface p-4"
              >
                <span className="font-display w-14 text-xl font-bold tabular-nums text-gold-soft">
                  {a.time}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {a.clientName}{" "}
                    <span className="text-sm font-normal text-muted">
                      · {a.clientPhone}
                    </span>
                  </p>
                  <p className="text-sm text-muted">
                    {a.serviceName} · {a.durationMin} min · con {a.barberName}
                    {a.discountCode && (
                      <span className="text-gold-soft"> · codice {a.discountCode}</span>
                    )}
                  </p>
                </div>
                <span className="font-semibold text-gold-soft">
                  {formatEuro(a.priceCents - a.discountCents)}
                </span>
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold",
                    STATUS_STYLE[a.status],
                  )}
                >
                  {STATUS_LABEL[a.status]}
                </span>
                <div className="flex items-center gap-2">
                  {busyId === a.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted" aria-hidden />
                  ) : payingId === a.id ? (
                    <div className="flex items-center gap-1.5" role="group" aria-label="Metodo di incasso">
                      {(["contanti", "carta", "satispay"] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => updateStatus(a.id, "completato", m)}
                          className="rounded-full bg-gold px-3 py-1.5 text-xs font-bold capitalize text-background transition-colors hover:bg-gold-soft"
                        >
                          {m}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setPayingId(null)}
                        className="px-2 text-xs text-muted hover:text-foreground"
                      >
                        Annulla
                      </button>
                    </div>
                  ) : (
                    <>
                      {a.status === "in_attesa" && (
                        <ActionButton onClick={() => updateStatus(a.id, "confermato")}>
                          Conferma
                        </ActionButton>
                      )}
                      {(a.status === "in_attesa" || a.status === "confermato") && (
                        <>
                          <ActionButton primary onClick={() => setPayingId(a.id)}>
                            Completa e incassa
                          </ActionButton>
                          <ActionButton onClick={() => updateStatus(a.id, "annullato")}>
                            Annulla
                          </ActionButton>
                        </>
                      )}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
        primary
          ? "bg-gold text-background hover:bg-gold-soft"
          : "border border-border text-muted hover:border-gold-dim hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
