"use client";

import { useMemo, useState } from "react";
import { Check, X, CircleCheck, Globe, Store, Clock } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/shared/page-header";
import { NewBookingDialog } from "@/components/bookings/new-booking-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingStatusBadge } from "@/components/shared/status";
import { formatCents } from "@/lib/money";
import { formatTime, formatDay } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/lib/types";

type Filter = "upcoming" | "all" | "pending";

export default function PrenotazioniPage() {
  const { data, updateBookingStatus } = useStore();
  const [filter, setFilter] = useState<Filter>("upcoming");

  const filtered = useMemo(() => {
    const now = Date.now();
    let list = [...data.bookings];
    if (filter === "upcoming") {
      list = list.filter(
        (b) => new Date(b.startAt).getTime() >= now - 3600_000 && b.status !== "cancelled"
      );
    } else if (filter === "pending") {
      list = list.filter((b) => b.status === "pending");
    }
    return list.sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );
  }, [data.bookings, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of filtered) {
      const key = new Date(b.startAt).toISOString().slice(0, 10);
      const arr = map.get(key) ?? [];
      arr.push(b);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div>
      <PageHeader
        title="Prenotazioni"
        subtitle="Gestisci l'agenda del salone e conferma gli appuntamenti online."
        action={<NewBookingDialog />}
      />

      <div className="mb-5 flex gap-2">
        {(
          [
            ["upcoming", "In arrivo"],
            ["pending", "Da confermare"],
            ["all", "Tutte"],
          ] as [Filter, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={
              "rounded-lg px-3 py-1.5 text-sm transition " +
              (filter === key
                ? "bg-amber-500/15 font-medium text-amber-300"
                : "text-zinc-400 hover:bg-zinc-800")
            }
          >
            {label}
          </button>
        ))}
      </div>

      {grouped.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-zinc-500">
            <Clock className="mx-auto mb-3 h-8 w-8 opacity-50" />
            Nessuna prenotazione in questa vista.
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {grouped.map(([day, items]) => (
          <div key={day}>
            <h2 className="mb-2 text-sm font-semibold capitalize text-zinc-400">
              {formatDay(items[0].startAt)}
            </h2>
            <Card>
              <CardContent className="divide-y divide-zinc-800 p-0">
                {items.map((b) => (
                  <BookingRow key={b.id} booking={b} onStatus={updateBookingStatus} />
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingRow({
  booking,
  onStatus,
}: {
  booking: Booking;
  onStatus: (id: string, s: BookingStatus) => void;
}) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="w-14 text-center">
          <p className="text-lg font-bold text-amber-300">{formatTime(booking.startAt)}</p>
          <p className="text-[10px] text-zinc-500">{booking.durationMin} min</p>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium">{booking.clientName}</p>
            {booking.source === "online" ? (
              <Badge variant="info">
                <Globe className="h-3 w-3" /> Online
              </Badge>
            ) : (
              <Badge variant="neutral">
                <Store className="h-3 w-3" /> Salone
              </Badge>
            )}
          </div>
          <p className="truncate text-sm text-zinc-500">
            {booking.serviceName} · {booking.staffName} · {formatCents(booking.priceCents)}
          </p>
          {booking.notes && (
            <p className="truncate text-xs text-zinc-600">Nota: {booking.notes}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <BookingStatusBadge status={booking.status} />
        {booking.status === "pending" && (
          <Button size="sm" variant="secondary" onClick={() => onStatus(booking.id, "confirmed")}>
            <Check className="h-3.5 w-3.5" /> Conferma
          </Button>
        )}
        {(booking.status === "confirmed" || booking.status === "pending") && (
          <>
            <Button size="sm" onClick={() => onStatus(booking.id, "completed")}>
              <CircleCheck className="h-3.5 w-3.5" /> Completa
            </Button>
            <Button
              size="sm"
              variant="ghost"
              aria-label="Annulla prenotazione"
              onClick={() => onStatus(booking.id, "cancelled")}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
