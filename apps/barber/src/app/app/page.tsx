"use client";

import { TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Badge, Card, EmptyState, SectionHeading, Spinner } from "@/components/ui";
import {
  computeRevenueKpi,
  dailyRevenueSeries,
  salesInRange,
  toIsoDate,
} from "@/lib/logic";
import { formatEuro } from "@/lib/money";
import { useStore } from "@/lib/store/provider";

export default function OverviewPage() {
  const { state, loading } = useStore();

  const data = useMemo(() => {
    if (!state) return null;
    const today = toIsoDate(new Date());
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 29);

    const todaySales = salesInRange(state.sales, today, today);
    const weekSales = salesInRange(state.sales, toIsoDate(weekAgo), today);
    const monthSales = salesInRange(state.sales, toIsoDate(monthAgo), today);

    return {
      today: computeRevenueKpi(todaySales),
      week: computeRevenueKpi(weekSales),
      month: computeRevenueKpi(monthSales),
      series: dailyRevenueSeries(state.sales, 14),
      upcoming: state.bookings.filter(
        (b) => b.status === "confermata" && b.date >= today,
      ).length,
    };
  }, [state]);

  if (loading || !state || !data) {
    return <Spinner label="Carico gli incassi…" />;
  }

  const maxDay = Math.max(...data.series.map((d) => d.totalCents), 1);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Panoramica"
        title={`Bentornato, ${state.settings.name}`}
        subtitle="Il quadro degli incassi e degli appuntamenti a colpo d'occhio."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Incasso oggi" value={formatEuro(data.today.totalCents)} />
        <KpiCard
          label="Ultimi 7 giorni"
          value={formatEuro(data.week.totalCents)}
        />
        <KpiCard
          label="Ticket medio (30gg)"
          value={formatEuro(data.month.averageTicketCents)}
        />
        <KpiCard
          label="Appuntamenti futuri"
          value={String(data.upcoming)}
        />
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg text-cream">
            Andamento incassi — ultimi 14 giorni
          </h3>
          <Badge tone="gold">
            <TrendingUp className="mr-1 h-3 w-3" aria-hidden />
            {formatEuro(data.series.reduce((a, d) => a + d.totalCents, 0))}
          </Badge>
        </div>
        <div
          className="flex h-40 items-end gap-1.5"
          role="img"
          aria-label="Grafico a barre degli incassi giornalieri degli ultimi 14 giorni"
        >
          {data.series.map((day) => (
            <div
              key={day.date}
              className="group relative flex-1"
              title={`${day.date}: ${formatEuro(day.totalCents)}`}
            >
              <div
                className="w-full rounded-t bg-gold-500/70 transition group-hover:bg-gold-400"
                style={{
                  height: `${Math.max((day.totalCents / maxDay) * 100, 2)}%`,
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-cream/30">
          <span>{data.series[0]?.date}</span>
          <span>{data.series[data.series.length - 1]?.date}</span>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="font-display mb-4 text-lg text-cream">
            Incassi per barbiere (30gg)
          </h3>
          {Object.keys(data.month.byBarber).length === 0 ? (
            <EmptyState title="Nessun incasso registrato" />
          ) : (
            <ul className="space-y-3">
              {Object.entries(data.month.byBarber)
                .sort(([, a], [, b]) => b - a)
                .map(([barberName, cents]) => (
                  <li
                    key={barberName}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-cream/70">{barberName}</span>
                    <span className="font-semibold text-gold-300">
                      {formatEuro(cents)}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </Card>
        <Card>
          <h3 className="font-display mb-4 text-lg text-cream">
            Metodi di pagamento (30gg)
          </h3>
          {Object.keys(data.month.byMethod).length === 0 ? (
            <EmptyState title="Nessun incasso registrato" />
          ) : (
            <ul className="space-y-3">
              {Object.entries(data.month.byMethod)
                .sort(([, a], [, b]) => b - a)
                .map(([method, cents]) => (
                  <li
                    key={method}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="capitalize text-cream/70">{method}</span>
                    <span className="font-semibold text-gold-300">
                      {formatEuro(cents)}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-widest text-cream/40">
        {label}
      </p>
      <p className="font-display text-3xl text-gold-300">{value}</p>
    </Card>
  );
}
