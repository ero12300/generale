import Link from "next/link";
import { QrCode } from "lucide-react";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
import { PortalPageHeader } from "@/components/portal/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EQUIPMENT_CATEGORY_LABELS } from "@ristocare/types";
import { WarrantyBadge } from "@/components/shared/status-badges";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Attrezzature" };

export default async function EquipmentListPage() {
  const session = await getSession();
  const repo = await getRepository();
  const orgId = session.orgId ?? "org-demo-001";
  const items = await repo.listEquipment(orgId);

  return (
    <PortalShell
      variant="customer"
      title="RistoCare OS"
      subtitle={session.orgName ?? "Il tuo locale"}
      mode={session.mode}
      email={session.email}
    >
      <div className="space-y-6">
        <PortalPageHeader title="Attrezzature" description={`${items.length} macchine censite`} />

        <div className="grid md:grid-cols-2 gap-4">
          {items.map((eq) => (
            <Link key={eq.id} href={`/app/equipment/${eq.id}`}>
              <Card className="hover:border-emerald-500/25 hover:from-emerald-500/[0.04] transition-all duration-300 h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{eq.name}</CardTitle>
                    <WarrantyBadge status={eq.warranty_status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-zinc-500">
                  <p>
                    {EQUIPMENT_CATEGORY_LABELS[eq.category]} · {eq.brand} {eq.model}
                  </p>
                  <p>Matricola: {eq.serial_number ?? "—"}</p>
                  <p>Area: {eq.area ?? "—"}</p>
                  {eq.warranty_end && <p>Garanzia fino: {formatDate(eq.warranty_end)}</p>}
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs pt-2">
                    <QrCode className="h-3.5 w-3.5" />
                    QR disponibile
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
