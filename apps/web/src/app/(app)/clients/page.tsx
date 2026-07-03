import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { clients, getServiceName } from "@/lib/barber-data";
import { formatCurrencyFromCents } from "@/lib/utils";

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge className="border-white/10 bg-white/10 text-white">CRM barber</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Database clienti</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          Segmentazione pronta per VIP, dormienti, referral e follow-up automatici.
        </p>
      </div>

      <Card className="border-white/10 bg-white/5 backdrop-blur">
        <CardHeader>
          <CardTitle>Clienti ad alto valore</CardTitle>
          <CardDescription>Storico visite, LTV, preferenze e possibilità di riattivazione.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className="grid gap-3 rounded-3xl border border-white/10 bg-black/20 p-4 lg:grid-cols-[1fr_0.8fr_0.8fr_1fr_0.6fr]"
            >
              <div>
                <p className="text-sm font-medium text-white">{client.full_name}</p>
                <p className="mt-1 text-sm text-zinc-400">{client.phone}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Servizio preferito</p>
                <p className="mt-1 text-sm text-white">
                  {client.preferred_service_id ? getServiceName(client.preferred_service_id) : "N/D"}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">LTV</p>
                <p className="mt-1 text-sm text-white">{formatCurrencyFromCents(client.lifetime_value_cents)}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Referral / note</p>
                <p className="mt-1 text-sm text-white">{client.referred_by ?? "Diretto"}</p>
                <p className="mt-1 text-xs text-zinc-500">{client.notes}</p>
              </div>
              <div className="flex justify-start lg:justify-end">
                <Badge variant={client.segment === "vip" ? "default" : client.segment === "inactive" ? "warning" : "secondary"}>
                  {client.segment}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
