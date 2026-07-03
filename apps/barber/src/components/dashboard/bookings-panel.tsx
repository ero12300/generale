"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dataStore } from "@/lib/data-store";
import type { Booking, BookingStatus } from "@/lib/types";
import { formatEuro, formatTime } from "@/lib/utils";

export function BookingsPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const shop = await dataStore.getShop();
      const b = await dataStore.getBookings(shop.id);
      setBookings(b);
      setLoading(false);
    }
    void load();
  }, []);

  async function updateStatus(id: string, status: BookingStatus) {
    setActionId(id);
    const updated = await dataStore.updateBookingStatus(id, status);
    if (updated) {
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    }
    setActionId(null);
  }

  const statusBadge = (status: BookingStatus) => {
    const map: Record<BookingStatus, { variant: "warning" | "success" | "secondary" | "destructive"; label: string }> = {
      pending: { variant: "warning", label: "In attesa" },
      confirmed: { variant: "success", label: "Confermata" },
      completed: { variant: "secondary", label: "Completata" },
      cancelled: { variant: "destructive", label: "Annullata" },
      no_show: { variant: "destructive", label: "No show" },
    };
    const s = map[status];
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  if (loading) {
    return <p className="text-cream/50">Caricamento prenotazioni...</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">Prenotazioni</h1>
        <p className="text-sm text-cream/50">Gestisci il calendario del salone</p>
      </div>

      {/* Mobile: card list */}
      <div className="space-y-3 lg:hidden">
        {bookings.map((b) => (
          <Card key={b.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{b.customerName}</p>
                  <p className="text-xs text-cream/50">{b.customerPhone}</p>
                </div>
                {statusBadge(b.status)}
              </div>
              <div className="text-sm text-cream/70 space-y-1">
                <p>{b.date} · {formatTime(b.time)}</p>
                <p>{b.serviceName} — <span className="text-gold">{formatEuro(b.priceCents)}</span></p>
              </div>
              <div className="flex gap-2 pt-1">
                {b.status === "pending" && (
                  <>
                    <Button
                      className="flex-1 min-h-[44px]"
                      variant="outline"
                      disabled={actionId === b.id}
                      onClick={() => void updateStatus(b.id, "confirmed")}
                    >
                      <Check className="h-4 w-4" />
                      Conferma
                    </Button>
                    <Button
                      className="min-h-[44px]"
                      variant="destructive"
                      disabled={actionId === b.id}
                      onClick={() => void updateStatus(b.id, "cancelled")}
                      aria-label="Annulla"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {b.status === "confirmed" && (
                  <Button
                    className="w-full min-h-[44px]"
                    disabled={actionId === b.id}
                    onClick={() => void updateStatus(b.id, "completed")}
                  >
                    Segna completata
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: table */}
      <Card className="hidden lg:block">
        <CardHeader>
          <CardTitle>Tutte le prenotazioni</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/10 text-cream/50 text-left">
                  <th className="pb-3 pr-4 font-medium">Data</th>
                  <th className="pb-3 pr-4 font-medium">Ora</th>
                  <th className="pb-3 pr-4 font-medium">Cliente</th>
                  <th className="pb-3 pr-4 font-medium">Servizio</th>
                  <th className="pb-3 pr-4 font-medium">Prezzo</th>
                  <th className="pb-3 pr-4 font-medium">Stato</th>
                  <th className="pb-3 font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-gold/5 hover:bg-white/2">
                    <td className="py-4 pr-4">{b.date}</td>
                    <td className="py-4 pr-4">{formatTime(b.time)}</td>
                    <td className="py-4 pr-4">
                      <div>
                        <p className="font-medium">{b.customerName}</p>
                        <p className="text-xs text-cream/40">{b.customerPhone}</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4">{b.serviceName}</td>
                    <td className="py-4 pr-4 text-gold">{formatEuro(b.priceCents)}</td>
                    <td className="py-4 pr-4">{statusBadge(b.status)}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        {b.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actionId === b.id}
                              onClick={() => void updateStatus(b.id, "confirmed")}
                              aria-label="Conferma"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={actionId === b.id}
                              onClick={() => void updateStatus(b.id, "cancelled")}
                              aria-label="Annulla"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <Button
                            size="sm"
                            disabled={actionId === b.id}
                            onClick={() => void updateStatus(b.id, "completed")}
                          >
                            Completa
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
