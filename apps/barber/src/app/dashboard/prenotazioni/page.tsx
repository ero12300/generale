"use client";

import * as React from "react";
import { CheckCircle2, XCircle, PlayCircle, Trash2, Plus, Search } from "lucide-react";
import { useShopData } from "@/hooks/use-shop-data";
import { demoStore } from "@/lib/demo-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatEuro, formatDateIt, cn } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";
import { NewBookingDialog } from "@/components/dashboard/new-booking-dialog";
import type { Booking } from "@/types";

type Filter = "all" | "today" | "upcoming" | "past";

export default function BookingsPage() {
  const { bookings } = useShopData();
  const [filter, setFilter] = React.useState<Filter>("upcoming");
  const [query, setQuery] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 86400000);

  const filtered = bookings
    .filter((b) => {
      const d = new Date(b.startsAt);
      if (filter === "today") return d >= startOfDay && d < endOfDay;
      if (filter === "upcoming") return d >= now && b.status !== "cancelled";
      if (filter === "past") return d < now || b.status === "completed";
      return true;
    })
    .filter((b) =>
      query
        ? [b.clientName, b.serviceName, b.clientPhone ?? ""].some((s) =>
            s.toLowerCase().includes(query.toLowerCase())
          )
        : true
    )
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  function updateStatus(id: string, status: Booking["status"]) {
    demoStore.updateBooking(id, { status });
    const map: Record<Booking["status"], string> = {
      confirmed: "confermata",
      completed: "completata",
      cancelled: "annullata",
      pending: "in attesa",
      no_show: "no show",
    };
    toast({
      title: `Prenotazione ${map[status]}`,
      variant: status === "completed" ? "success" : "info",
    });
  }

  function remove(id: string) {
    demoStore.deleteBooking(id);
    toast({ title: "Prenotazione eliminata", variant: "info" });
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["upcoming", "today", "past", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs border transition-colors",
                filter === f
                  ? "bg-[color:var(--color-gold-500)]/15 border-[color:var(--color-gold-500)]/40 text-[color:var(--color-gold-300)]"
                  : "border-white/10 text-ink-300 hover:border-white/20"
              )}
            >
              {f === "upcoming"
                ? "Prossime"
                : f === "today"
                  ? "Oggi"
                  : f === "past"
                    ? "Passate"
                    : "Tutte"}
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <Input
              placeholder="Cerca cliente o servizio"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" /> Nuova
          </Button>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-ink-400">
            <p className="mb-2 font-medium text-ink-200">Nessuna prenotazione</p>
            <p className="text-sm">
              Aggiungi una prenotazione manualmente o attendi che i tuoi clienti
              prenotino dalla pagina pubblica.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/5 bg-black/20">
                <tr className="text-left text-[10px] uppercase tracking-widest text-ink-500">
                  <th className="px-4 py-3">Data e ora</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Servizio</th>
                  <th className="px-4 py-3">Prezzo</th>
                  <th className="px-4 py-3">Stato</th>
                  <th className="px-4 py-3">Origine</th>
                  <th className="px-4 py-3 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-ink-100">
                      {formatDateIt(b.startsAt, { withTime: true })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink-100">{b.clientName}</div>
                      {b.clientPhone && (
                        <div className="text-xs text-ink-500">{b.clientPhone}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-200">{b.serviceName}</td>
                    <td className="px-4 py-3 text-ink-100">
                      {formatEuro(b.priceCents - (b.discountCents ?? 0))}
                      {b.discountCents ? (
                        <div className="text-[10px] text-[color:var(--color-gold-300)]">
                          −{formatEuro(b.discountCents)}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3">
                      <SourceBadge source={b.source} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {b.status === "pending" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Conferma"
                            onClick={() => updateStatus(b.id, "confirmed")}
                          >
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          </Button>
                        )}
                        {b.status !== "completed" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Completa"
                            onClick={() => updateStatus(b.id, "completed")}
                          >
                            <PlayCircle className="h-4 w-4 text-[color:var(--color-gold-400)]" />
                          </Button>
                        )}
                        {b.status !== "cancelled" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Annulla"
                            onClick={() => updateStatus(b.id, "cancelled")}
                          >
                            <XCircle className="h-4 w-4 text-red-400" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Elimina"
                          onClick={() => remove(b.id)}
                        >
                          <Trash2 className="h-4 w-4 text-ink-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewBookingDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  const map: Record<Booking["status"], { label: string; variant: "gold" | "success" | "warning" | "default" | "danger" | "info" }> = {
    pending: { label: "In attesa", variant: "warning" },
    confirmed: { label: "Confermata", variant: "success" },
    completed: { label: "Completata", variant: "gold" },
    cancelled: { label: "Annullata", variant: "danger" },
    no_show: { label: "No show", variant: "default" },
  };
  const m = map[status];
  return <Badge variant={m.variant} className="text-[10px]">{m.label}</Badge>;
}

function SourceBadge({ source }: { source: Booking["source"] }) {
  const map = {
    internal: { label: "Manuale", variant: "default" as const },
    public: { label: "Online", variant: "info" as const },
    referral: { label: "Referral", variant: "gold" as const },
  };
  const m = map[source];
  return <Badge variant={m.variant} className="text-[10px]">{m.label}</Badge>;
}
