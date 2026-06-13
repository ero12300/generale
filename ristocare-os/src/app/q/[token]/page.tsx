import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { WarrantyBadge } from "@/components/ui/status-badges";
import { getEquipmentByToken } from "@/lib/demo-store";
import { CATEGORY_LABELS } from "@/lib/labels";
import { warrantyStatusFrom } from "@/lib/utils";

// Landing pubblica raggiunta scansionando il QR code di un'attrezzatura.
// Mostra solo informazioni non sensibili e consente di aprire un ticket.
export default async function QrLandingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const equipment = getEquipmentByToken(token);
  if (!equipment) notFound();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gradient-hero px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8">
        <div className="flex justify-center"><Logo /></div>
        <div className="mt-6 rounded-2xl border border-border bg-surface-2 p-5 text-center">
          <p className="text-xs uppercase tracking-wide text-muted">{CATEGORY_LABELS[equipment.category]}</p>
          <h1 className="mt-1 text-xl font-semibold">{equipment.name}</h1>
          <p className="mt-1 text-sm text-muted">{equipment.brand} {equipment.model}</p>
          <div className="mt-3 flex justify-center">
            <WarrantyBadge status={warrantyStatusFrom(equipment.warrantyEnd)} />
          </div>
        </div>

        <div className="mt-6 space-y-2.5">
          <Link
            href={`/app/ticket/nuovo?equipment=${equipment.id}`}
            className="block rounded-xl bg-primary px-5 py-3 text-center text-sm font-semibold text-white hover:bg-primary-strong"
          >
            Segnala un problema / Apri ticket
          </Link>
          <Link
            href={`/app/attrezzature/${equipment.id}`}
            className="block rounded-xl border border-border px-5 py-3 text-center text-sm font-semibold hover:bg-surface-2"
          >
            Accedi alla scheda completa
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Per consultare manuali, documenti e storico interventi è necessario l&apos;accesso all&apos;area cliente.
        </p>
      </div>
    </div>
  );
}
