import Link from "next/link";
import { notFound } from "next/navigation";
import { EquipmentStatusBadge, TicketStatusBadge, WarrantyBadge } from "@/components/ui/status-badges";
import { Badge } from "@/components/ui/badge";
import { getEquipment, getTicketsForEquipment } from "@/lib/demo-store";
import { CATEGORY_LABELS, DOCUMENT_TYPE_LABELS } from "@/lib/labels";
import { formatDate, warrantyStatusFrom } from "@/lib/utils";
import { equipmentQrUrl, qrDataUrl } from "@/lib/qrcode";

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const equipment = getEquipment(id);
  if (!equipment) notFound();

  const tickets = getTicketsForEquipment(id);
  const qrUrl = equipmentQrUrl(equipment.qrToken);
  const qrImage = await qrDataUrl(qrUrl);

  const fields: [string, string][] = [
    ["Marca", equipment.brand],
    ["Modello", equipment.model],
    ["Matricola", equipment.serialNumber],
    ["Categoria", CATEGORY_LABELS[equipment.category]],
    ["Fornitore", equipment.supplier],
    ["Area", equipment.area],
    ["Data acquisto", formatDate(equipment.purchaseDate)],
    ["Data consegna", formatDate(equipment.deliveryDate)],
    ["Installazione", formatDate(equipment.installationDate)],
    ["Inizio garanzia", formatDate(equipment.warrantyStart)],
    ["Fine garanzia", formatDate(equipment.warrantyEnd)],
  ];

  return (
    <div className="space-y-8">
      <div>
        <Link href="/app/attrezzature" className="text-sm text-muted hover:text-foreground">← Attrezzature</Link>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{equipment.name}</h1>
            <p className="mt-1 text-sm text-muted">{equipment.brand} {equipment.model}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <EquipmentStatusBadge status={equipment.status} />
            <WarrantyBadge status={warrantyStatusFrom(equipment.warrantyEnd)} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-base font-semibold">Scheda tecnica</h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {fields.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 border-b border-border/60 pb-2">
                  <dt className="text-sm text-muted">{label}</dt>
                  <dd className="text-right text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            {equipment.notes ? (
              <p className="mt-4 rounded-lg border border-border bg-surface-2 p-3 text-sm text-muted">
                <span className="font-medium text-foreground">Note: </span>{equipment.notes}
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-base font-semibold">Documenti</h2>
            {equipment.documents.length ? (
              <ul className="mt-4 space-y-2">
                {equipment.documents.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{d.fileName}</p>
                      <p className="text-xs text-muted">Caricato da {d.uploadedBy} · {formatDate(d.createdAt)}</p>
                    </div>
                    <Badge tone="blue">{DOCUMENT_TYPE_LABELS[d.documentType]}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-lg border border-dashed border-border p-4 text-sm text-muted">
                Nessun documento caricato. Manuale e fattura risultano mancanti.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Ticket collegati</h2>
              <Link
                href={`/app/ticket/nuovo?equipment=${equipment.id}`}
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-strong"
              >
                + Apri ticket
              </Link>
            </div>
            {tickets.length ? (
              <ul className="mt-4 divide-y divide-border">
                {tickets.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <Link href={`/app/ticket/${t.id}`} className="block truncate text-sm font-medium hover:text-primary-strong">{t.title}</Link>
                      <p className="text-xs text-muted">{t.code} · {formatDate(t.createdAt)}</p>
                    </div>
                    <TicketStatusBadge status={t.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">Nessun ticket per questa attrezzatura.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-border bg-surface p-6 text-center">
            <h2 className="text-base font-semibold">QR code attrezzatura</h2>
            <p className="mt-1 text-xs text-muted">Stampa e applica sulla macchina.</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrImage}
              alt={`QR code per ${equipment.name}`}
              width={200}
              height={200}
              className="mx-auto mt-4 rounded-xl border border-border bg-white p-2"
            />
            <p className="mt-3 break-all rounded-lg bg-surface-2 px-3 py-2 font-mono text-[11px] text-muted">{qrUrl}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
