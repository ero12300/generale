"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Topbar } from "@/components/app/topbar";
import { useOpenNav } from "@/app/app/nav-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/components/providers/data-provider";
import { useToast } from "@/components/providers/toast-provider";
import { BookingDialog } from "@/components/bookings/booking-dialog";
import { addDays, formatDateIT, formatEUR, formatTimeIT, isSameDay, initials, startOfDay, startOfWeek } from "@/lib/utils";
import { CalendarClock, Check, X, User, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types";
import { EmptyState } from "@/components/ui/empty-state";

const STATUS_META: Record<BookingStatus, { label: string; tone: "success" | "muted" | "warn" | "danger" | "gold" }> = {
  confirmed: { label: "Confermata", tone: "gold" },
  pending: { label: "In attesa", tone: "warn" },
  completed: { label: "Completata", tone: "success" },
  cancelled: { label: "Annullata", tone: "muted" },
  no_show: { label: "No-show", tone: "danger" },
};

export default function PrenotazioniPageWrapper() {
  return (
    <Suspense fallback={null}>
      <PrenotazioniPage />
    </Suspense>
  );
}

function PrenotazioniPage() {
  const store = useStore();
  const openNav = useOpenNav();
  const toast = useToast();
  const search = useSearchParams();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [dialog, setDialog] = useState<{ open: boolean; date?: Date }>({ open: false });

  useEffect(() => {
    if (search.get("new")) setDialog({ open: true });
  }, [search]);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const weekBookings = useMemo(() => {
    const start = startOfDay(days[0]).getTime();
    const end = addDays(days[6], 1).getTime();
    return store.bookings
      .filter((b) => {
        const t = new Date(b.startAt).getTime();
        return t >= start && t < end;
      })
      .sort((a, b) => a.startAt.localeCompare(b.startAt));
  }, [store.bookings, days]);

  return (
    <>
      <Topbar
        title="Prenotazioni"
        subtitle="Vista settimanale e gestione stati."
        onOpenNav={openNav}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setWeekStart(startOfWeek(new Date()))}>Oggi</Button>
            <Button variant="gold" onClick={() => setDialog({ open: true })}>
              <Sparkles className="h-4 w-4" /> Nuova
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-white/60">
          {formatDateIT(days[0])} — {formatDateIT(days[6])}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setWeekStart(addDays(weekStart, -7))} aria-label="Settimana precedente">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setWeekStart(addDays(weekStart, 7))} aria-label="Settimana successiva">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-7">
        {days.map((d) => {
          const dayBookings = weekBookings.filter((b) => isSameDay(new Date(b.startAt), d));
          const today = isSameDay(d, new Date());
          const revenue = dayBookings
            .filter((b) => b.status === "completed" || b.status === "confirmed")
            .reduce((s, b) => s + b.priceEur, 0);
          return (
            <Card
              key={d.toISOString()}
              className={cn("min-h-[280px] p-4", today && "gold-border")}
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">
                    {d.toLocaleDateString("it-IT", { weekday: "short" })}
                  </div>
                  <div className="font-display text-2xl text-white">{d.getDate()}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/60">{dayBookings.length} appt</div>
                  <div className="text-xs text-[color:var(--color-gold-200)]">{formatEUR(revenue)}</div>
                </div>
              </div>

              {dayBookings.length === 0 ? (
                <button
                  onClick={() => setDialog({ open: true, date: d })}
                  className="grid h-24 w-full place-items-center rounded-xl border border-dashed border-white/10 text-xs text-white/40 hover:border-[color:var(--color-gold-300)]/40 hover:text-white/60 transition"
                >
                  + aggiungi
                </button>
              ) : (
                <ul className="space-y-1.5">
                  {dayBookings.map((b) => {
                    const meta = STATUS_META[b.status];
                    return (
                      <li
                        key={b.id}
                        className={cn(
                          "group rounded-lg border p-2 text-xs transition",
                          b.status === "completed" && "border-emerald-500/20 bg-emerald-500/5",
                          b.status === "cancelled" && "border-white/5 bg-white/5 opacity-60",
                          b.status === "no_show" && "border-rose-500/20 bg-rose-500/5",
                          (b.status === "confirmed" || b.status === "pending") && "border-white/10 bg-white/5 hover:border-[color:var(--color-gold-300)]/30",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-mono text-white/80">{formatTimeIT(b.startAt)}</div>
                          <Badge tone={meta.tone as any}>{meta.label}</Badge>
                        </div>
                        <div className="mt-0.5 truncate text-white">{b.clientName}</div>
                        <div className="truncate text-white/60">{b.serviceName} · {formatEUR(b.priceEur)}</div>
                        {(b.status === "confirmed" || b.status === "pending") && (
                          <div className="mt-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                            <button
                              onClick={async () => {
                                await store.updateBooking(b.id, { status: "completed" });
                                toast.success("Prenotazione completata", `+${formatEUR(b.priceEur)} nel registro incassi`);
                              }}
                              className="flex-1 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-emerald-300 hover:bg-emerald-500/20"
                              title="Segna come completata (aggiunge incasso)"
                            >
                              <Check className="mx-auto h-3 w-3" />
                            </button>
                            <button
                              onClick={async () => {
                                await store.updateBooking(b.id, { status: "cancelled" });
                                toast.info("Prenotazione annullata");
                              }}
                              className="flex-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-white/70 hover:bg-white/10"
                              title="Annulla"
                            >
                              <X className="mx-auto h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Elenco settimana</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {weekBookings.length === 0 ? (
              <EmptyState
                icon={<CalendarClock className="h-6 w-6" />}
                title="Nessuna prenotazione in questa settimana"
                description="Aggiungi la prima manualmente o condividi il link pubblico."
                action={<Button variant="gold" onClick={() => setDialog({ open: true })}><Sparkles className="h-4 w-4" /> Nuova prenotazione</Button>}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-widest text-white/40">
                    <tr>
                      <th className="pb-3 pr-4">Quando</th>
                      <th className="pb-3 pr-4">Cliente</th>
                      <th className="pb-3 pr-4">Servizio</th>
                      <th className="pb-3 pr-4">Prezzo</th>
                      <th className="pb-3 pr-4">Stato</th>
                      <th className="pb-3">Fonte</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {weekBookings.map((b) => {
                      const meta = STATUS_META[b.status];
                      return (
                        <tr key={b.id} className="text-white/85">
                          <td className="py-2.5 pr-4">
                            <div className="font-medium text-white">{formatTimeIT(b.startAt)}</div>
                            <div className="text-xs text-white/50">{formatDateIT(b.startAt, { weekday: "short", day: "2-digit", month: "short" })}</div>
                          </td>
                          <td className="py-2.5 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="grid h-7 w-7 place-items-center rounded-full gold-border text-xs text-[color:var(--color-gold-200)]">
                                {initials(b.clientName)}
                              </span>
                              <div>
                                <div className="text-white">{b.clientName}</div>
                                <div className="text-xs text-white/50">{b.clientPhone ?? ""}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 pr-4">{b.serviceName}</td>
                          <td className="py-2.5 pr-4">{formatEUR(b.priceEur)}</td>
                          <td className="py-2.5 pr-4">
                            <Badge tone={meta.tone as any}>{meta.label}</Badge>
                          </td>
                          <td className="py-2.5">
                            <span className="inline-flex items-center gap-1 text-xs text-white/60">
                              {b.source === "public" ? (
                                <>
                                  <User className="h-3 w-3" /> Cliente online
                                </>
                              ) : (
                                <>Manuale</>
                              )}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BookingDialog open={dialog.open} onOpenChange={(v) => setDialog({ open: v, date: dialog.date })} initialDate={dialog.date} />
    </>
  );
}
