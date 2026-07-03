import { getStore } from "@/lib/store";
import { PLANS } from "@/lib/plans";
import { formatEuro } from "@/lib/money";
import { Badge, Card, CardTitle } from "@/components/ui";
import { ClientForm } from "@/components/forms/ClientForm";

export const dynamic = "force-dynamic";

export default async function ClientiPage() {
  const store = await getStore();
  const [clients, shop] = await Promise.all([
    store.listClients(),
    store.getShop(),
  ]);
  const maxClients = PLANS[shop.plan].limits.maxClients;
  const referredNames = new Map(clients.map((c) => [c.id, c.fullName]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-cream">Clienti</h1>
        <p className="mt-1 text-sm text-muted">
          {clients.length} clienti in rubrica
          {maxClients !== null ? ` (limite piano ${PLANS[shop.plan].name}: ${maxClients})` : ""}
          . Ogni cliente ha un codice Porta un Amico personale.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardTitle>Nuovo cliente</CardTitle>
          <ClientForm />
        </Card>

        <Card className="lg:col-span-3">
          <CardTitle>Rubrica</CardTitle>
          <ul className="divide-y divide-line">
            {clients.map((c) => (
              <li key={c.id} className="py-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-cream">{c.fullName}</p>
                    <p className="text-xs text-muted">
                      {c.phone}
                      {c.email ? ` · ${c.email}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="gold">{c.referralCode}</Badge>
                    <Badge tone="muted">
                      {c.visits} visite · {formatEuro(c.totalSpentCents)}
                    </Badge>
                  </div>
                </div>
                {c.referredById ? (
                  <p className="mt-1.5 text-xs text-emerald-300">
                    Portato da {referredNames.get(c.referredById) ?? "un amico"}
                  </p>
                ) : null}
                {c.notes ? (
                  <p className="mt-1 text-xs italic text-muted">{c.notes}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
