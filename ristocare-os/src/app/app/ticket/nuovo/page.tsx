import Link from "next/link";
import { OpenTicketForm } from "@/components/forms/open-ticket-form";
import { getEquipmentList } from "@/lib/demo-store";
import { CATEGORY_LABELS } from "@/lib/labels";

export default async function NewTicketPage({
  searchParams,
}: {
  searchParams: Promise<{ equipment?: string }>;
}) {
  const { equipment } = await searchParams;
  const options = getEquipmentList().map((e) => ({
    id: e.id,
    label: `${e.name} — ${CATEGORY_LABELS[e.category]} (${e.serialNumber})`,
  }));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/app/ticket" className="text-sm text-muted hover:text-foreground">← Ticket</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Apri un nuovo ticket</h1>
        <p className="mt-1 text-sm text-muted">
          Compila i dati: la centrale operativa RistoCare qualificherà la richiesta e ti aggiornerà.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <OpenTicketForm
          equipmentOptions={options}
          defaultEquipmentId={equipment}
          defaultOpenedBy="Salvatore Currò"
        />
      </div>
    </div>
  );
}
