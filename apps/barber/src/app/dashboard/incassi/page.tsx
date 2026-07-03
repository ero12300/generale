"use client";

import * as React from "react";
import { Wallet, CreditCard, Banknote, TrendingUp } from "lucide-react";
import { useShopData } from "@/hooks/use-shop-data";
import { formatEuro, formatDateIt } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";

type Range = "week" | "month" | "year";

export default function RevenuePage() {
  const { payments, bookings } = useShopData();
  const [range, setRange] = React.useState<Range>("month");

  const now = new Date();
  const from = React.useMemo(() => {
    const d = new Date(now);
    if (range === "week") d.setDate(now.getDate() - 7);
    if (range === "month") d.setMonth(now.getMonth() - 1);
    if (range === "year") d.setFullYear(now.getFullYear() - 1);
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const inRange = payments.filter((p) => new Date(p.createdAt) >= from);
  const total = inRange.reduce((s, p) => s + p.amountCents, 0);
  const cash = inRange.filter((p) => p.method === "cash").reduce((s, p) => s + p.amountCents, 0);
  const card = inRange.filter((p) => p.method === "card").reduce((s, p) => s + p.amountCents, 0);
  const avg = inRange.length ? Math.round(total / inRange.length) : 0;

  // Somma per giorno per grafico
  const byDay = new Map<string, number>();
  for (const p of inRange) {
    const day = new Date(p.createdAt).toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + p.amountCents);
  }
  const days = Array.from(byDay.entries()).sort();
  const max = Math.max(1, ...Array.from(byDay.values()));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex gap-2">
        {(["week", "month", "year"] as Range[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${
              range === r
                ? "bg-[color:var(--color-gold-500)]/15 border-[color:var(--color-gold-500)]/40 text-[color:var(--color-gold-300)]"
                : "border-white/10 text-ink-300"
            }`}
          >
            {r === "week"
              ? "Ultima settimana"
              : r === "month"
                ? "Ultimo mese"
                : "Ultimo anno"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Totale incassato"
          value={formatEuro(total)}
          hint={`${inRange.length} pagamenti`}
          icon={<Wallet className="h-4 w-4" />}
          accent
        />
        <StatCard
          label="Contanti"
          value={formatEuro(cash)}
          hint={`${Math.round((cash / (total || 1)) * 100)}% del totale`}
          icon={<Banknote className="h-4 w-4" />}
        />
        <StatCard
          label="Carte / POS"
          value={formatEuro(card)}
          hint={`${Math.round((card / (total || 1)) * 100)}% del totale`}
          icon={<CreditCard className="h-4 w-4" />}
        />
        <StatCard
          label="Scontrino medio"
          value={formatEuro(avg)}
          hint="Per prestazione"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <div className="glass rounded-xl p-6">
        <div className="mb-5 flex justify-between items-center">
          <div>
            <h2 className="font-display text-xl text-ink-50">Andamento giornaliero</h2>
            <p className="text-xs text-ink-400">
              Somma degli incassi per ogni giorno nel periodo selezionato.
            </p>
          </div>
          <Badge variant="gold">{range === "week" ? "7gg" : range === "month" ? "30gg" : "365gg"}</Badge>
        </div>
        <div className="flex items-end gap-1 h-48 overflow-x-auto">
          {days.map(([day, cents]) => {
            const h = Math.max(2, Math.round((cents / max) * 100));
            return (
              <div
                key={day}
                className="flex flex-col items-center gap-1 min-w-[24px] flex-1"
              >
                <div
                  className="w-full rounded-t bg-gradient-to-t from-[color:var(--color-gold-500)]/60 to-[color:var(--color-gold-400)]/90"
                  style={{ height: `${h}%` }}
                  title={`${day}: ${formatEuro(cents)}`}
                />
              </div>
            );
          })}
          {days.length === 0 && (
            <div className="w-full text-center text-sm text-ink-500 py-8">
              Nessun pagamento nel periodo.
            </div>
          )}
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="font-display text-xl text-ink-50">Ultimi pagamenti</h2>
          <p className="text-xs text-ink-400">
            Registro dettagliato per la contabilità.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/20">
              <tr className="text-left text-[10px] uppercase tracking-widest text-ink-500">
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Servizio</th>
                <th className="px-4 py-3">Metodo</th>
                <th className="px-4 py-3 text-right">Importo</th>
              </tr>
            </thead>
            <tbody>
              {inRange
                .slice()
                .reverse()
                .slice(0, 30)
                .map((p) => {
                  const b = bookings.find((x) => x.id === p.bookingId);
                  return (
                    <tr key={p.id} className="border-b border-white/5 last:border-b-0">
                      <td className="px-4 py-3 text-ink-100 whitespace-nowrap">
                        {formatDateIt(p.createdAt, { withTime: true })}
                      </td>
                      <td className="px-4 py-3 text-ink-200">
                        {b?.clientName ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-ink-300">
                        {b?.serviceName ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="default" className="text-[10px]">
                          {p.method === "cash"
                            ? "Contanti"
                            : p.method === "card"
                              ? "Carta"
                              : "Altro"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-ink-50">
                        {formatEuro(p.amountCents)}
                      </td>
                    </tr>
                  );
                })}
              {inRange.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-500">
                    Nessun pagamento nel periodo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
