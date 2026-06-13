import Link from "next/link";
import { notFound } from "next/navigation";
import { demoStore } from "@/lib/demoStore";
import { EQUIPMENT_CATEGORY_LABELS } from "@/lib/types";
import { warrantyStatus, WARRANTY_LABELS } from "@/lib/warranty";
import { TicketForm } from "@/components/TicketForm";
import { QrCode } from "lucide-react";

export default async function QrPublicPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const eq = demoStore.getEquipmentByQrToken(token);
  if (!eq) notFound();

  const ws = warrantyStatus(eq.warrantyEnd);

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-ink py-4 text-white">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-6">
          <QrCode className="h-5 w-5 text-gold" aria-hidden />
          <span className="font-semibold tracking-tight">
            RistoCare <span className="text-gold">OS</span>
          </span>
          <span className="ml-auto text-xs text-stone-400">Accesso rapido da QR code</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="text-2xl font-semibold tracking-tight">{eq.name}</h1>
        <dl className="mt-4 space-y-2 rounded-xl bg-white p-5 text-sm shadow-sm">
          <div className="flex justify-between">
            <dt className="text-warmgray">Categoria</dt>
            <dd className="font-medium">{EQUIPMENT_CATEGORY_LABELS[eq.category]}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-warmgray">Marca / modello</dt>
            <dd className="font-medium">
              {eq.brand} {eq.model}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-warmgray">Garanzia</dt>
            <dd className="font-medium">{WARRANTY_LABELS[ws]}</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-warmgray">
          Da QR pubblico vedi solo informazioni non sensibili. Per matricola, documenti e storico
          completo <Link href="/app" className="underline">accedi all&apos;area cliente</Link>.
        </p>

        <section className="mt-8" aria-labelledby="apri-ticket">
          <h2 id="apri-ticket" className="text-lg font-semibold">
            Segnala un problema su questa macchina
          </h2>
          <div className="mt-4 rounded-xl bg-white p-6 shadow-sm">
            <TicketForm
              equipmentOptions={[{ id: eq.id, name: eq.name }]}
              defaultEquipmentId={eq.id}
              redirectBase="/app/ticket"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
