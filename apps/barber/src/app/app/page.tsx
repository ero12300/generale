import Link from "next/link";
import { getStore } from "@/lib/store";
import { summarizeRevenue } from "@/lib/stats";
import { formatEuro } from "@/lib/money";
import { Badge, Card, CardTitle, StatCard } from "@/components/ui";

export const dynamic = "force-dynamic";

const DAY_LABELS = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

export default async function DashboardPage() {
  const store = await getStore();
  const [sales, bookings, clients] = await Promise.all([
    store.listSales(),
    store.listBookings(),
    store.listClients(),
  ]);
  const summary = summarizeRevenue(sales);
  const today = new Date().toISOString().slice(0, 10);
  const todayBookings = bookings.filter(
    (b) => b.date === today && b.status === "confermata"
  );
  const maxDay = Math.max(...summary.last7Days.map((d) => d.totalCents), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-cream">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          La fotografia del salone, oggi e nell&apos;ultimo mese.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Incasso oggi" value={formatEuro(summary.todayCents)} />
        <StatCard
          label="Ultimi 7 giorni"
          value={formatEuro(summary.weekCents)}
        />
        <StatCard
          label="Questo mese"
          value={formatEuro(summary.monthCents)}
          hint={`${summary.salesCountMonth} servizi registrati`}
        />
        <StatCard
          label="Scontrino medio"
          value={formatEuro(summary.averageTicketCents)}
          hint={`Sconti concessi: ${formatEuro(summary.totalDiscountMonthCents)}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Andamento ultimi 7 giorni</CardTitle>
          <div className="flex h-40 items-end gap-3" role="img" aria-label="Grafico incassi ultimi 7 giorni">
            {summary.last7Days.map((day) => (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] text-muted">
                  {formatEuro(day.totalCents)}
                </span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-gold/60 to-gold-bright"
                  style={{
                    height: `${Math.max((day.totalCents / maxDay) * 100, 3)}%`,
                  }}
                />
                <span className="text-[10px] uppercase text-muted">
                  {DAY_LABELS[new Date(day.date).getDay()]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Appuntamenti di oggi</CardTitle>
          {todayBookings.length === 0 ? (
            <p className="text-sm text-muted">
              Nessun appuntamento confermato per oggi.{" "}
              <Link href="/app/prenotazioni" className="text-gold-bright underline">
                Aggiungine uno
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-3">
              {todayBookings.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between rounded-xl border border-line bg-panel-2 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-cream">
                      {b.time} — {b.clientName}
                    </p>
                    <p className="text-xs text-muted">{b.serviceName}</p>
                  </div>
                  <Badge tone={b.source === "online" ? "gold" : "muted"}>
                    {b.source}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Clienti in rubrica"
          value={String(clients.length)}
          hint="Con storico visite e spesa"
        />
        <StatCard
          label="Incassi in carta (mese)"
          value={formatEuro(summary.byMethod["carta"] ?? 0)}
        />
        <StatCard
          label="Incassi in contanti (mese)"
          value={formatEuro(summary.byMethod["contanti"] ?? 0)}
        />
      </div>
    </div>
  );
}
