import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
import { PortalPageHeader } from "@/components/portal/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EQUIPMENT_CATEGORY_LABELS } from "@ristocare/types";

export const metadata = { title: "Tecnici partner" };

export default async function TechniciansPage() {
  const session = await getSession();
  const repo = await getRepository();
  const technicians = await repo.listTechnicians();

  return (
    <PortalShell variant="admin" title="RistoCare Admin" subtitle="Tecnici" mode={session.mode} email={session.email}>
      <div className="space-y-6">
        <PortalPageHeader
          title="Rete tecnici"
          description="Ranking e dati visibili solo agli operatori RistoCare."
          variant="admin"
        />
        <div className="grid md:grid-cols-2 gap-4">
          {technicians.map((t) => (
            <Card key={t.id} className="hover:border-amber-500/20 transition-colors">
              <CardHeader>
                <CardTitle className="text-base flex justify-between items-center gap-2">
                  <span>{t.name}</span>
                  <Badge variant="success">★ {t.rating_internal}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-500 space-y-2">
                <p className="text-zinc-600">{t.company_name}</p>
                <p>
                  {t.phone} · {t.city} ({t.province})
                </p>
                <p className="text-xs">{t.categories.map((c) => EQUIPMENT_CATEGORY_LABELS[c]).join(", ")}</p>
                {t.notes_internal && <p className="text-xs text-zinc-600 italic border-t border-zinc-200 pt-2">{t.notes_internal}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
