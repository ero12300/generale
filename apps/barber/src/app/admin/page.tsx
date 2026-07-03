import Link from "next/link";
import { Lock } from "lucide-react";
import { getStore } from "@/lib/store";
import { computeStats } from "@/lib/stats";
import { planHasCapability } from "@/lib/plans";
import { formatEuro } from "@/lib/money";
import { longDateLabel, todayISO } from "@/lib/dates";
import { BarChart } from "@/components/bar-chart";
import { QuickPaymentForm } from "./quick-payment-form";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const store = await getStore();
  const [payments, appointments, clients, settings] = await Promise.all([
    store.listPayments(),
    store.listAppointments(),
    store.listClients(),
    store.getSettings(),
  ]);
  const stats = computeStats(payments, appointments, clients);
  const hasAdvanced = planHasCapability(settings.plan, "report_avanzati");
  const recent = payments.slice(0, 8);

  const cards = [
    { label: "Incasso oggi", value: formatEuro(stats.todayCents) },
    { label: "Ultimi 7 giorni", value: formatEuro(stats.weekCents) },
    { label: "Mese corrente", value: formatEuro(stats.monthCents) },
    { label: "Scontrino medio", value: formatEuro(stats.avgTicketCents) },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard incassi</h1>
          <p className="mt-1 text-sm capitalize text-muted">
            {longDateLabel(todayISO())}
          </p>
        </div>
        <QuickPaymentForm />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {card.label}
            </p>
            <p className="font-display mt-2 text-3xl font-bold text-gold-soft">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          [stats.todayAppointments, "Appuntamenti oggi"],
          [stats.pendingAppointments, "Da confermare"],
          [`${stats.totalClients}`, "Clienti totali"],
        ].map(([value, label]) => (
          <div
            key={label as string}
            className="rounded-2xl border border-border bg-surface p-4 text-center"
          >
            <p className="font-display text-2xl font-bold">{value}</p>
            <p className="text-xs uppercase tracking-wider text-muted">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <BarChart
          title="Incassi ultimi 14 giorni"
          data={stats.revenueByDay.map((d) => ({
            label: d.label,
            amountCents: d.amountCents,
          }))}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
            Top servizi del mese
          </h3>
          {hasAdvanced ? (
            <ul className="space-y-3">
              {stats.topServices.map((s, i) => (
                <li key={s.serviceName} className="flex items-center gap-3">
                  <span className="font-display w-6 text-lg font-bold text-gold">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{s.serviceName}</p>
                    <p className="text-xs text-muted">{s.count} servizi</p>
                  </div>
                  <span className="font-semibold text-gold-soft">
                    {formatEuro(s.amountCents)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <UpgradePrompt feature="I report avanzati sui servizi" />
          )}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
            Metodi di pagamento (mese)
          </h3>
          {hasAdvanced ? (
            <ul className="space-y-3">
              {stats.methodBreakdown.map((m) => {
                const total = stats.methodBreakdown.reduce(
                  (acc, x) => acc + x.amountCents,
                  0,
                );
                const pct =
                  total > 0 ? Math.round((m.amountCents / total) * 100) : 0;
                return (
                  <li key={m.method}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="capitalize">{m.method}</span>
                      <span className="text-gold-soft">
                        {formatEuro(m.amountCents)} · {pct}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-gold-dim to-gold"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <UpgradePrompt feature="La ripartizione per metodo di pagamento" />
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface">
        <h3 className="border-b border-border px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted">
          Ultimi incassi registrati
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-3 font-semibold">Data</th>
                <th className="px-6 py-3 font-semibold">Cliente</th>
                <th className="px-6 py-3 font-semibold">Servizio</th>
                <th className="px-6 py-3 font-semibold">Metodo</th>
                <th className="px-6 py-3 text-right font-semibold">Importo</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-6 py-3 tabular-nums text-muted">{p.date}</td>
                  <td className="px-6 py-3 font-medium">{p.clientName}</td>
                  <td className="px-6 py-3 text-muted">{p.serviceName}</td>
                  <td className="px-6 py-3 capitalize text-muted">{p.method}</td>
                  <td className="px-6 py-3 text-right font-semibold text-gold-soft">
                    {formatEuro(p.amountCents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UpgradePrompt({ feature }: { feature: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gold-dim/50 p-6 text-center">
      <Lock className="h-6 w-6 text-gold" aria-hidden />
      <p className="text-sm text-muted">
        {feature} sono disponibili con il piano{" "}
        <strong className="text-gold-soft">Pro</strong>.
      </p>
      <Link
        href="/admin/abbonamento"
        className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-background transition-colors hover:bg-gold-soft"
      >
        Passa a Pro
      </Link>
    </div>
  );
}
