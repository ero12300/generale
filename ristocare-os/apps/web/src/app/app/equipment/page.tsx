import Link from "next/link";
import { QrCode } from "lucide-react";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
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
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Attrezzature</h1>
          <p className="text-zinc-400 text-sm mt-1">{items.length} macchine censite</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {items.map((eq) => (
            <Link key={eq.id} href={`/app/equipment/${eq.id}`}>
              <Card className="hover:border-emerald-600/30 transition-colors h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{eq.name}</CardTitle>
                    <WarrantyBadge status={eq.warranty_status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-zinc-400">
                  <p>{EQUIPMENT_CATEGORY_LABELS[eq.category]} · {eq.brand} {eq.model}</p>
                  <p>Matricola: {eq.serial_number ?? "—"}</p>
                  <p>Area: {eq.area ?? "—"}</p>
                  {eq.warranty_end && <p>Garanzia fino: {formatDate(eq.warranty_end)}</p>}
                  <div className="flex items-center gap-1 text-emerald-500 text-xs pt-2">
                    <QrCode className="h-3 w-3" />
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
