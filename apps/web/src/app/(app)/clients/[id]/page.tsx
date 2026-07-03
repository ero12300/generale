import { notFound } from "next/navigation";
import { Gift, History, Phone, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getBarberClient,
  listBarberAppointments,
  listBarberPayments,
  listBarberServices,
} from "@/lib/barber-demo";
import { formatCurrency } from "@/lib/utils";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = getBarberClient(id);

  if (!client) {
    notFound();
  }

  const services = listBarberServices();
  const appointments = listBarberAppointments().filter((item) => item.client_id === client.id);
  const payments = listBarberPayments().filter((item) => item.client_id === client.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary">Scheda cliente</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">{client.full_name}</h1>
          <p className="text-sm text-zinc-400">
            {client.phone}
            {client.email ? ` - ${client.email}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {client.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          {client.consent_marketing && <Badge variant="success">Opt-in marketing</Badge>}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <StatCard title="Spesa totale" value={formatCurrency(client.total_spent)} icon={<Gift className="h-4 w-4 text-amber-400" />} />
        <StatCard title="Visite" value={String(client.total_visits)} icon={<History className="h-4 w-4 text-amber-400" />} />
        <StatCard title="Barbiere preferito" value={client.preferred_barber ?? "-"} icon={<UserRound className="h-4 w-4 text-amber-400" />} />
        <StatCard title="Referral code" value={client.referral_code} icon={<Phone className="h-4 w-4 text-amber-400" />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profilo e preferenze</CardTitle>
            <CardDescription>
              Informazioni utili per personalizzare l&apos;esperienza e aumentare retention.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Preferenze</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {client.preferences.map((preference) => (
                  <Badge key={preference} variant="secondary">
                    {preference}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Ultima visita</p>
              <p className="mt-2 text-sm text-zinc-300">
                {client.last_visit_at
                  ? new Date(client.last_visit_at).toLocaleString("it-IT")
                  : "Nessuna visita registrata"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Note operative</p>
              <p className="mt-2 text-sm text-zinc-300">{client.notes ?? "Nessuna nota"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storico appuntamenti</CardTitle>
            <CardDescription>Dettaglio servizi, stato e valore generato dal cliente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">
                      {new Date(appointment.starts_at).toLocaleString("it-IT", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {appointment.service_ids
                        .map((serviceId) => services.find((item) => item.id === serviceId)?.name ?? serviceId)
                        .join(" - ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={appointment.status === "completed" ? "success" : "secondary"}>
                      {appointment.status.replace(/_/g, " ")}
                    </Badge>
                    <p className="mt-2 text-sm text-amber-300">{formatCurrency(appointment.total_price)}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pagamenti registrati</CardTitle>
          <CardDescription>Storico cassa del cliente per verificare LTV e metodi preferiti.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {payments.map((payment) => (
            <div key={payment.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
              <p className="text-sm font-medium">{formatCurrency(payment.amount)}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
                {payment.method}
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                {new Date(payment.created_at).toLocaleString("it-IT")}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{title}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
