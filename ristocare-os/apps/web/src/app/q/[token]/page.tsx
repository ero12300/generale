import Link from "next/link";
import { notFound } from "next/navigation";
import { repository } from "@/lib/data/repository";
import { MarketingHeader } from "@/components/marketing/site-chrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EQUIPMENT_CATEGORY_LABELS } from "@ristocare/types";
import { WarrantyBadge } from "@/components/shared/status-badges";

export const metadata = { title: "Attrezzatura" };

export default async function QrEquipmentPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const equipment = repository.getEquipmentByQrToken(token);
  if (!equipment) notFound();

  return (
    <div className="min-h-screen bg-[#0c0f0e]">
      <MarketingHeader />
      <main className="mx-auto max-w-lg px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>{equipment.name}</CardTitle>
            <p className="text-sm text-zinc-500">{EQUIPMENT_CATEGORY_LABELS[equipment.category]}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <WarrantyBadge status={equipment.warranty_status} />
            <p className="text-sm text-zinc-400">Matricola: <span className="font-mono text-zinc-200">{equipment.serial_number}</span></p>
            <p className="text-sm text-zinc-500">Accedi al portale per vedere manuali, documenti e storico interventi.</p>
            <div className="flex flex-col gap-2 pt-4">
              <Button asChild>
                <Link href={`/login`}>Accedi e apri ticket</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/app/equipment/${equipment.id}`}>Vai alla scheda (demo cliente)</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
