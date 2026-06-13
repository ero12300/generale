import { getSession } from "@/lib/auth/session";
import { repository } from "@/lib/data/repository";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EQUIPMENT_CATEGORY_LABELS } from "@ristocare/types";

export const metadata = { title: "Tecnici partner" };

export default async function TechniciansPage() {
  const session = await getSession();
  const technicians = repository.listTechnicians();

  return (
    <PortalShell variant="admin" title="RistoCare Admin" subtitle="Tecnici" mode={session.mode} email={session.email}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-zinc-100">Rete tecnici (interna)</h1>
        <p className="text-sm text-zinc-500">Ranking e dati visibili solo agli operatori RistoCare.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {technicians.map((t) => (
            <Card key={t.id}>
              <CardHeader>
                <CardTitle className="text-base flex justify-between">
                  {t.name}
                  <Badge variant="success">★ {t.rating_internal}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-400 space-y-2">
                <p>{t.company_name}</p>
                <p>{t.phone} · {t.city} ({t.province})</p>
                <p className="text-zinc-500">
                  {t.categories.map((c) => EQUIPMENT_CATEGORY_LABELS[c]).join(", ")}
                </p>
                {t.notes_internal && <p className="text-xs text-zinc-600 italic">{t.notes_internal}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
