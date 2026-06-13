import Link from "next/link";
import { notFound } from "next/navigation";
import { demoStore } from "@/lib/demoStore";
import { EQUIPMENT_CATEGORY_LABELS } from "@/lib/types";
import { warrantyStatus, WARRANTY_LABELS } from "@/lib/warranty";
import { TicketStatusBadge } from "@/components/StatusBadge";
import { FileText, QrCode, Plus } from "lucide-react";

const DOC_LABELS = {
  manuale: "Manuale",
  fattura: "Fattura",
  certificato: "Certificato",
  foto_etichetta: "Foto etichetta",
  altro: "Altro",
} as const;

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eq = demoStore.getEquipment(id);
  if (!eq) notFound();

  const documents = demoStore.listDocuments(eq.id);
  const tickets = demoStore.listTicketsForEquipment(eq.id);
  const ws = warrantyStatus(eq.warrantyEnd);

  const fields: Array<[string, string]> = [
    ["Categoria", EQUIPMENT_CATEGORY_LABELS[eq.category]],
    ["Marca", eq.brand],
    ["Modello", eq.model],
    ["Matricola", eq.serialNumber],
    ["Fornitore", eq.supplier],
    ["Data acquisto", new Date(eq.purchaseDate).toLocaleDateString("it-IT")],
    ["Fine garanzia", new Date(eq.warrantyEnd).toLocaleDateString("it-IT")],
    ["Stato garanzia", WARRANTY_LABELS[ws]],
    ["Ubicazione", eq.area],
  ];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/app/attrezzature" className="text-sm text-warmgray hover:underline">
            ← Attrezzature
          </Link>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{eq.name}</h1>
        </div>
        <Link
          href={`/app/ticket/nuovo?equipment=${eq.id}`}
          className="inline-flex items-center gap-2 rounded-full bg-tech px-5 py-2.5 text-sm font-medium text-white hover:bg-tech/90"
        >
          <Plus className="h-4 w-4" aria-hidden /> Apri ticket per questa macchina
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2" aria-labelledby="scheda">
          <h2 id="scheda" className="text-lg font-semibold">
            Scheda tecnica
          </h2>
          <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {fields.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-stone-100 pb-2 text-sm">
                <dt className="text-warmgray">{label}</dt>
                <dd className="font-medium text-right">{value}</dd>
              </div>
            ))}
          </dl>
          {eq.notes && (
            <p className="mt-4 rounded-lg bg-stone-50 p-3 text-sm text-stone-600">{eq.notes}</p>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-xl bg-white p-6 shadow-sm" aria-labelledby="qr">
            <h2 id="qr" className="flex items-center gap-2 text-lg font-semibold">
              <QrCode className="h-5 w-5 text-tech" aria-hidden /> QR code
            </h2>
            <p className="mt-2 text-sm text-warmgray">
              Stampato sulla macchina, apre la pagina pubblica per ticket rapidi.
            </p>
            <Link
              href={`/q/${eq.qrToken}`}
              className="mt-3 inline-block rounded-lg bg-stone-100 px-3 py-2 font-mono text-xs hover:bg-stone-200"
            >
              /q/{eq.qrToken}
            </Link>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm" aria-labelledby="documenti">
            <h2 id="documenti" className="text-lg font-semibold">
              Documenti
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {documents.length === 0 && (
                <li className="text-warmgray">Nessun documento caricato.</li>
              )}
              {documents.map((d) => (
                <li key={d.id} className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-warmgray" aria-hidden />
                  <span className="font-medium">{DOC_LABELS[d.documentType]}</span>
                  <span className="truncate text-warmgray">{d.fileName}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section className="mt-6 rounded-xl bg-white p-6 shadow-sm" aria-labelledby="storico">
        <h2 id="storico" className="text-lg font-semibold">
          Storico ticket
        </h2>
        <ul className="mt-3 divide-y divide-stone-100 text-sm">
          {tickets.length === 0 && <li className="py-3 text-warmgray">Nessun ticket per questa attrezzatura.</li>}
          {tickets.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <Link href={`/app/ticket/${t.id}`} className="font-medium hover:underline">
                {t.title}
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-warmgray">{new Date(t.createdAt).toLocaleDateString("it-IT")}</span>
                <TicketStatusBadge status={t.status} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
