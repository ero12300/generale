import type { ComponentType } from "react";
import { Crown, UserRoundPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBarberRepository } from "@/lib/barber/repository";
import { formatCurrencyCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

const segmentVariant = {
  new: "secondary",
  regular: "default",
  vip: "success",
  at_risk: "warning",
  referred: "default",
} as const;

export default async function ClientsPage() {
  const repo = await getBarberRepository();
  const customers = await repo.listCustomers();
  const vipCustomers = customers.filter((customer) => customer.segment === "vip").length;
  const referralCustomers = customers.filter((customer) => customer.referred_by_customer_id).length;

  return (
    <div className="space-y-6">
      <div>
        <Badge>CRM barber</Badge>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Database clienti</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Segmenti, spesa, visite e codici referral per campagne mirate.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MiniStat icon={UserRoundPlus} label="Clienti totali" value={String(customers.length)} />
        <MiniStat icon={Crown} label="Clienti VIP" value={String(vipCustomers)} />
        <MiniStat icon={UserRoundPlus} label="Da referral" value={String(referralCustomers)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista clienti</CardTitle>
          <CardDescription>Pronta per filtri avanzati, esportazione e automazioni WhatsApp.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-2">
          {customers.map((customer) => (
            <div key={customer.id} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{customer.full_name}</p>
                  <p className="mt-1 text-sm text-zinc-500">{customer.phone}</p>
                </div>
                <Badge variant={segmentVariant[customer.segment]}>{customer.segment}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-zinc-500">Spesa</p>
                  <p className="font-medium text-amber-300">{formatCurrencyCents(customer.total_spent_cents)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Visite</p>
                  <p className="font-medium">{customer.visits_count}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Codice</p>
                  <p className="font-medium">{customer.referral_code}</p>
                </div>
              </div>
              {customer.notes && <p className="mt-3 text-xs text-zinc-500">{customer.notes}</p>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
        <Icon className="h-5 w-5 text-amber-400" />
      </CardContent>
    </Card>
  );
}
