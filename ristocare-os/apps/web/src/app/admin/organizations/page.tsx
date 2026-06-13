import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { PLAN_LABELS } from "@ristocare/types";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Clienti" };

export default async function OrganizationsPage() {
  const session = await getSession();
  const repo = await getRepository();
  const orgs = await repo.listOrganizations();
  const orgRows = await Promise.all(
    orgs.map(async (org) => ({
      org,
      eqCount: (await repo.listEquipment(org.id)).length,
      ticketCount: (await repo.listTickets(org.id)).length,
    }))
  );

  return (
    <PortalShell variant="admin" title="RistoCare Admin" subtitle="Clienti" mode={session.mode} email={session.email}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-zinc-100">Organizzazioni clienti</h1>
        <div className="space-y-3">
          {orgRows.map(({ org, eqCount, ticketCount }) => (
            <Card key={org.id}>
              <CardContent className="py-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-zinc-200">{org.name}</p>
                  <p className="text-sm text-zinc-500">{org.city} ({org.province}) · {org.phone}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Badge>{PLAN_LABELS[org.plan]}</Badge>
                  <span className="text-zinc-500">{eqCount} attrezzature</span>
                  <span className="text-zinc-500">{ticketCount} ticket</span>
                  <Badge variant={org.status === "active" ? "success" : "default"}>{org.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
