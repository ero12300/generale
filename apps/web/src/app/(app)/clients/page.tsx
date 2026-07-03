import type { ComponentType } from "react";
import { Gift, Star, Users } from "lucide-react";
import { barberClients } from "@/lib/barber-data";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Clienti</h1>
        <p className="mt-1 text-sm text-zinc-400">
          CRM semplice ma premium: storico valore cliente, loyalty, segmenti e referral.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard icon={Users} label="Clienti attivi" value={String(barberClients.length)} />
        <SummaryCard icon={Star} label="LTV medio" value={formatCurrency(660)} />
        <SummaryCard icon={Gift} label="Referral attivati" value={String(6)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database clienti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {barberClients.map((client) => (
            <div key={client.id} className="rounded-2xl border border-zinc-800 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-medium">{client.full_name}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {client.phone} · Servizio preferito: {client.preferred_service}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {client.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-zinc-300 md:grid-cols-4">
                <Metric label="Spesa totale" value={formatCurrency(client.total_spent)} />
                <Metric label="Visite" value={String(client.visit_count)} />
                <Metric label="Punti loyalty" value={String(client.loyalty_points)} />
                <Metric label="Amici portati" value={String(client.referred_friends)} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
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
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </div>
          <Icon className="h-5 w-5 text-amber-400" aria-hidden />
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 font-medium text-zinc-100">{value}</p>
    </div>
  );
}
