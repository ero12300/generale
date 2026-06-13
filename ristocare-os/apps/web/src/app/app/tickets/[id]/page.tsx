import Link from "next/link";
import { notFound } from "next/navigation";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
import { PortalPageHeader } from "@/components/portal/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketStatusBadge, UrgencyBadge } from "@/components/shared/status-badges";
import { formatDate, formatCurrency } from "@/lib/utils";

export const metadata = { title: "Dettaglio ticket" };

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const repo = await getRepository();
  const ticket = await repo.getTicket(id);
  if (!ticket) notFound();

  const equipment = ticket.equipment_id ? await repo.getEquipment(ticket.equipment_id) : null;
  const quotes = await repo.listQuotes(id);

  return (
    <PortalShell
      variant="customer"
      title="RistoCare OS"
      subtitle={session.orgName ?? "Il tuo locale"}
      mode={session.mode}
      email={session.email}
    >
      <div className="max-w-3xl space-y-6">
        <PortalPageHeader
          backHref="/app/tickets"
          backLabel="Ticket"
          title={ticket.title}
          description={`Aperto il ${formatDate(ticket.created_at)}`}
          action={
            <div className="flex gap-2">
              <UrgencyBadge urgency={ticket.urgency} />
              <TicketStatusBadge status={ticket.status} />
            </div>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stato pratica</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-emerald-600 font-medium">{ticket.customer_visible_status ?? "In gestione"}</p>
            <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{ticket.description}</p>
            {equipment && (
              <p className="text-sm text-zinc-500 mt-4">
                Attrezzatura:{" "}
                <Link href={`/app/equipment/${equipment.id}`} className="text-emerald-600 hover:text-emerald-700 transition-colors">
                  {equipment.name}
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        {quotes.filter((q) => q.status === "sent").map((q) => (
          <Card key={q.id} className="border-amber-500/20 from-amber-500/[0.04]">
            <CardHeader>
              <CardTitle className="text-base">Preventivo RistoCare</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-semibold text-zinc-900">{formatCurrency(q.customer_price)}</p>
              <p className="text-sm text-zinc-500 mt-1">Valido fino al {formatDate(q.valid_until)}</p>
              <p className="text-xs text-zinc-600 mt-4">
                Per accettare il preventivo contatta la centrale operativa RistoCare.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}
