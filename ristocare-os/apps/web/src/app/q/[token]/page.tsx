import Link from "next/link";
import { notFound } from "next/navigation";
import { tryGetRepository } from "@/lib/auth/session";
import { DemoRepository } from "@/lib/data/demo-repository";
import { Logo } from "@/components/brand/logo";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/site-chrome";
import { MarketingPageShell } from "@/components/marketing/page-shell";
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
  const repo = (await tryGetRepository()) ?? new DemoRepository();
  const equipment = await repo.getEquipmentByQrToken(token);
  if (!equipment) notFound();

  return (
    <MarketingPageShell>
      <MarketingHeader />
      <main className="mx-auto max-w-lg w-full px-4 py-16 md:py-24">
        <div className="text-center mb-8">
          <Logo size="md" className="justify-center" />
          <p className="text-sm text-zinc-500 mt-4">Scheda rapida da QR code</p>
        </div>
        <Card className="glass-panel glow-emerald">
          <CardHeader>
            <CardTitle className="font-display text-2xl">{equipment.name}</CardTitle>
            <p className="text-sm text-zinc-500">{EQUIPMENT_CATEGORY_LABELS[equipment.category]}</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <WarrantyBadge status={equipment.warranty_status} />
            <p className="text-sm text-zinc-500">
              Matricola:{" "}
              <span className="font-mono text-zinc-800">{equipment.serial_number ?? "—"}</span>
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Accedi al portale per vedere manuali, documenti e storico interventi.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Button asChild className="w-full">
                <Link href="/login">Accedi e apri ticket</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/app/equipment/${equipment.id}`}>Vai alla scheda (demo)</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <MarketingFooter />
    </MarketingPageShell>
  );
}
