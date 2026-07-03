"use client";

import Link from "next/link";
import {
  CalendarCheck2,
  Users,
  Wallet,
  Gift,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useShopData } from "@/hooks/use-shop-data";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatEuro, formatDateIt, initials } from "@/lib/utils";

export default function DashboardOverview() {
  const { bookings, clients, payments, campaigns, shop } = useShopData();

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const todaysBookings = bookings.filter((b) => {
    const d = new Date(b.startsAt);
    return d >= today && d < new Date(today.getTime() + 86400000);
  });

  const upcoming = bookings
    .filter((b) => new Date(b.startsAt) >= now && b.status !== "cancelled")
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, 5);

  const monthPayments = payments.filter((p) => new Date(p.createdAt) >= monthStart);
  const monthRevenue = monthPayments.reduce((s, p) => s + p.amountCents, 0);
  const monthBookings = bookings.filter(
    (b) => new Date(b.startsAt) >= monthStart && b.status !== "cancelled"
  ).length;

  const referralRedemptions = campaigns
    .filter((c) => c.type === "referral")
    .reduce((s, c) => s + c.redemptions, 0);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-ink-400 text-sm">
            Ecco cosa succede oggi da{" "}
            <span className="text-ink-100 font-medium">{shop.name}</span>.
          </p>
        </div>
        <Badge variant="gold">
          <Sparkles className="h-3 w-3" />
          Buona giornata
        </Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Prenotazioni oggi"
          value={String(todaysBookings.length)}
          hint={`${monthBookings} nel mese`}
          icon={<CalendarCheck2 className="h-4 w-4" />}
        />
        <StatCard
          label="Incassi mese"
          value={formatEuro(monthRevenue)}
          hint={`${monthPayments.length} pagamenti registrati`}
          icon={<Wallet className="h-4 w-4" />}
          accent
        />
        <StatCard
          label="Clienti totali"
          value={String(clients.length)}
          hint="Database attivo"
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Referral riscossi"
          value={String(referralRedemptions)}
          hint="Porta un amico"
          icon={<Gift className="h-4 w-4" />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-xl text-ink-50">Prossimi appuntamenti</h2>
              <p className="text-xs text-ink-400">
                Le prime {upcoming.length} prenotazioni confermate.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/prenotazioni">
                Vedi agenda <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {upcoming.length === 0 ? (
            <div className="text-center py-10 text-ink-400 text-sm">
              Nessuna prenotazione in arrivo. Condividi il link di
              prenotazione per riempire l'agenda!
            </div>
          ) : (
            <ul className="space-y-2">
              {upcoming.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center gap-4 rounded-lg p-3 bg-black/30 border border-white/5"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--color-gold-500)]/15 text-[color:var(--color-gold-300)] text-sm font-medium">
                    {initials(b.clientName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink-50 truncate">
                      {b.clientName}
                    </div>
                    <div className="text-xs text-ink-400 truncate">
                      {b.serviceName} · {formatDateIt(b.startsAt, { withTime: true })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-ink-100">
                      {formatEuro(b.priceCents)}
                    </div>
                    <StatusPill status={b.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="font-display text-xl text-ink-50 mb-1">Referral attivi</h2>
          <p className="text-xs text-ink-400 mb-4">
            Chi porta un amico, guadagna. Attiva altre campagne per moltiplicare.
          </p>

          <div className="space-y-3">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-[color:var(--color-gold-500)]/20 bg-[color:var(--color-gold-500)]/5 p-3"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="text-sm font-medium text-ink-50">
                    {c.name}
                  </div>
                  <Badge variant={c.active ? "gold" : "default"} className="text-[10px]">
                    {c.active ? "Attiva" : "In pausa"}
                  </Badge>
                </div>
                <div className="text-xs text-ink-400">
                  {c.redemptions}
                  {c.maxRedemptions ? `/${c.maxRedemptions}` : ""} riscossioni
                </div>
              </div>
            ))}
          </div>

          <Button asChild variant="secondary" size="sm" className="w-full mt-4">
            <Link href="/dashboard/campagne">
              Gestisci campagne <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <RevenueChart />
        <TopServices />
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: "gold" | "success" | "warning" | "default" }> = {
    pending: { label: "In attesa", variant: "warning" },
    confirmed: { label: "Confermata", variant: "success" },
    completed: { label: "Completata", variant: "default" },
    cancelled: { label: "Annullata", variant: "default" },
    no_show: { label: "No show", variant: "default" },
  };
  const m = map[status] ?? map.pending;
  return (
    <Badge variant={m.variant} className="text-[10px]">
      {m.label}
    </Badge>
  );
}

function RevenueChart() {
  const { payments } = useShopData();
  const now = new Date();

  const days: { label: string; cents: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setDate(d.getDate() + 1);
    const cents = payments
      .filter((p) => {
        const t = new Date(p.createdAt);
        return t >= d && t < end;
      })
      .reduce((s, p) => s + p.amountCents, 0);
    days.push({
      label: new Intl.DateTimeFormat("it-IT", { weekday: "short" }).format(d),
      cents,
    });
  }
  const max = Math.max(1, ...days.map((d) => d.cents));

  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-5">
        <h2 className="font-display text-xl text-ink-50">Incassi ultimi 14 giorni</h2>
        <p className="text-xs text-ink-400">
          Un colpo d'occhio per capire quando lavori davvero.
        </p>
      </div>
      <div className="flex items-end gap-1.5 h-40">
        {days.map((d, i) => {
          const h = Math.max(2, Math.round((d.cents / max) * 100));
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-gradient-to-t from-[color:var(--color-gold-500)]/60 to-[color:var(--color-gold-400)]/90 transition-all"
                style={{ height: `${h}%` }}
                title={formatEuro(d.cents)}
              />
              <div className="text-[10px] text-ink-500">{d.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopServices() {
  const { bookings } = useShopData();
  const counts = new Map<string, { name: string; count: number; revenue: number }>();
  for (const b of bookings) {
    if (b.status === "cancelled") continue;
    const cur = counts.get(b.serviceId) ?? {
      name: b.serviceName,
      count: 0,
      revenue: 0,
    };
    cur.count += 1;
    cur.revenue += b.priceCents;
    counts.set(b.serviceId, cur);
  }
  const rows = Array.from(counts.entries())
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const maxRev = Math.max(1, ...rows.map((r) => r.revenue));

  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-5">
        <h2 className="font-display text-xl text-ink-50">Servizi più redditizi</h2>
        <p className="text-xs text-ink-400">
          Su cosa investire e cosa promuovere di più.
        </p>
      </div>
      <div className="space-y-3">
        {rows.map((r) => {
          const pct = Math.round((r.revenue / maxRev) * 100);
          return (
            <div key={r.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-ink-100">{r.name}</span>
                <span className="text-ink-400">
                  {r.count}× · {formatEuro(r.revenue)}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[color:var(--color-gold-500)] to-[color:var(--color-gold-300)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
        {rows.length === 0 && (
          <div className="text-center text-sm text-ink-400 py-6">
            Nessun dato ancora. Aggiungi servizi e prenotazioni per iniziare.
          </div>
        )}
      </div>
      <Button asChild variant="ghost" size="sm" className="w-full mt-4">
        <Link href="/dashboard/servizi">
          Gestisci servizi <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
}
