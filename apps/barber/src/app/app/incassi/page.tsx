import { getStore } from "@/lib/store";
import { formatEuro } from "@/lib/money";
import { summarizeRevenue } from "@/lib/stats";
import { Badge, Card, CardTitle, StatCard } from "@/components/ui";
import { SaleForm } from "@/components/forms/SaleForm";

export const dynamic = "force-dynamic";

export default async function IncassiPage() {
  const store = await getStore();
  const [sales, services, clients, campaigns] = await Promise.all([
    store.listSales(),
    store.listServices(),
    store.listClients(),
    store.listCampaigns(),
  ]);
  const summary = summarizeRevenue(sales);
  const recent = sales.slice(0, 15);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-cream">Incassi</h1>
        <p className="mt-1 text-sm text-muted">
          Registra i servizi e tieni la cassa sotto controllo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Oggi" value={formatEuro(summary.todayCents)} />
        <StatCard label="Ultimi 7 giorni" value={formatEuro(summary.weekCents)} />
        <StatCard
          label="Questo mese"
          value={formatEuro(summary.monthCents)}
          hint={`Scontrino medio ${formatEuro(summary.averageTicketCents)}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardTitle>Nuovo incasso</CardTitle>
          <SaleForm
            services={services}
            clients={clients}
            campaigns={campaigns.filter((c) => c.active)}
          />
        </Card>

        <Card className="lg:col-span-3">
          <CardTitle>Ultimi movimenti</CardTitle>
          <ul className="divide-y divide-line">
            {recent.map((sale) => (
              <li key={sale.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-cream">
                    {sale.description}
                  </p>
                  <p className="text-xs text-muted">
                    {sale.date}
                    {sale.clientName ? ` · ${sale.clientName}` : ""}
                    {sale.discountCents > 0
                      ? ` · sconto ${formatEuro(sale.discountCents)}`
                      : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge tone="muted">{sale.method}</Badge>
                  <span className="font-display text-lg text-gold-bright">
                    {formatEuro(sale.amountCents)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
