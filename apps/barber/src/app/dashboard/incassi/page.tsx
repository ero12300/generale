"use client";

import { useMemo, useState } from "react";
import { Banknote, CreditCard, Smartphone, TrendingUp, Wallet } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shell";
import { Card, CardTitle, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RevenueBars } from "@/components/dashboard/bar-chart";
import { useStore } from "@/lib/store/store-context";
import { eur } from "@/lib/money";
import { isRevenue, netCents, last7DaysRevenue } from "@/lib/analytics";
import { PAYMENT_LABEL } from "@/lib/labels";
import type { Booking, PaymentMethod } from "@/lib/types";
import { formatDateTime, startOfDay, addDays, cn } from "@/lib/utils";

type Range = "oggi" | "settimana" | "mese";

export default function IncassiPage() {
  const { state } = useStore();
  const [range, setRange] = useState<Range>("mese");

  const { from, to } = useMemo(() => {
    const now = new Date();
    if (range === "oggi") return { from: startOfDay(now), to: now };
    if (range === "settimana") return { from: startOfDay(addDays(now, -6)), to: now };
    return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
  }, [range]);

  const transactions = useMemo(
    () =>
      state.bookings
        .filter((b) => isRevenue(b) && new Date(b.start) >= from && new Date(b.start) <= to)
        .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()),
    [state.bookings, from, to],
  );

  const total = transactions.reduce((s, b) => s + netCents(b), 0);
  const discounts = transactions.reduce((s, b) => s + b.discountCents, 0);

  const byMethod = useMemo(() => {
    const map: Record<PaymentMethod, number> = { contanti: 0, carta: 0, app: 0, non_pagato: 0 };
    for (const b of transactions) map[b.paymentMethod] += netCents(b);
    return map;
  }, [transactions]);

  const outstanding = useMemo(
    () =>
      state.bookings
        .filter((b) => b.status === "confermata" && b.paymentMethod === "non_pagato")
        .reduce((s, b) => s + netCents(b), 0),
    [state.bookings],
  );

  const chart = useMemo(() => last7DaysRevenue(state.bookings), [state.bookings]);

  const ranges: { id: Range; label: string }[] = [
    { id: "oggi", label: "Oggi" },
    { id: "settimana", label: "Ultimi 7 giorni" },
    { id: "mese", label: "Questo mese" },
  ];

  return (
    <div className="p-5 md:p-8">
      <PageHeader title="Incassi" subtitle="Tieni sotto controllo la cassa della tua barberia." />

      <div className="mb-5 flex flex-wrap gap-2">
        {ranges.map((r) => (
          <button
            key={r.id}
            onClick={() => setRange(r.id)}
            className={cn(
              "rounded-xl border px-3.5 py-2 text-sm font-medium transition",
              range === r.id ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold-soft)]" : "border-border bg-surface text-muted hover:text-foreground",
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Incasso periodo" value={eur(total)} icon={<Wallet size={18} />} accent hint={`${transactions.length} transazioni`} />
        <StatCard label="Da incassare" value={eur(outstanding)} icon={<TrendingUp size={18} />} hint="Appuntamenti confermati" />
        <StatCard label="Sconti applicati" value={eur(discounts)} icon={<TrendingUp size={18} />} hint="Nel periodo" />
        <StatCard label="Ticket medio" value={eur(transactions.length ? Math.round(total / transactions.length) : 0)} icon={<TrendingUp size={18} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle className="mb-4">Andamento ultimi 7 giorni</CardTitle>
          <RevenueBars data={chart} />
        </Card>

        <Card>
          <CardTitle className="mb-4">Metodi di pagamento</CardTitle>
          <div className="space-y-3">
            <MethodRow icon={<Banknote size={16} />} label={PAYMENT_LABEL.contanti} cents={byMethod.contanti} total={total} />
            <MethodRow icon={<CreditCard size={16} />} label={PAYMENT_LABEL.carta} cents={byMethod.carta} total={total} />
            <MethodRow icon={<Smartphone size={16} />} label={PAYMENT_LABEL.app} cents={byMethod.app} total={total} />
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardTitle className="mb-4">Transazioni</CardTitle>
        {transactions.length === 0 ? (
          <p className="py-10 text-center text-muted">Nessun incasso registrato nel periodo selezionato.</p>
        ) : (
          <div className="divide-y divide-border">
            {transactions.map((b) => (
              <TransactionRow key={b.id} booking={b} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function MethodRow({ icon, label, cents, total }: { icon: React.ReactNode; label: string; cents: number; total: number }) {
  const pct = total ? Math.round((cents / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-muted">{icon} {label}</span>
        <span className="font-medium">{eur(cents)}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full gold-gradient" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function TransactionRow({ booking }: { booking: Booking }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm font-medium">{booking.clientName}</div>
        <div className="text-xs text-muted">{booking.serviceName} · {formatDateTime(booking.start)}</div>
      </div>
      <div className="flex items-center gap-3">
        <Badge tone="gray">{PAYMENT_LABEL[booking.paymentMethod]}</Badge>
        <span className="font-semibold text-[var(--gold-soft)]">{eur(netCents(booking))}</span>
      </div>
    </div>
  );
}
