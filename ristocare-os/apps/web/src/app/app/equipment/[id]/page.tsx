import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { FileText, QrCode } from "lucide-react";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EQUIPMENT_CATEGORY_LABELS } from "@ristocare/types";
import { WarrantyBadge } from "@/components/shared/status-badges";
import { DocumentUpload } from "@/components/equipment/document-upload";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Scheda attrezzatura" };

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const repo = await getRepository();
  const equipment = await repo.getEquipment(id);
  if (!equipment) notFound();

  const documents = await repo.listDocuments(id);
  const tickets = (await repo.listTickets(equipment.organization_id)).filter((t) => t.equipment_id === id);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
  const qrUrl = `${appUrl}/q/${equipment.qr_token}`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl, { width: 200, margin: 2, color: { dark: "#16a34a" } });

  return (
    <PortalShell
      variant="customer"
      title="RistoCare OS"
      subtitle={session.orgName ?? "Il tuo locale"}
      mode={session.mode}
      email={session.email}
    >
      <div className="space-y-6 max-w-4xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link href="/app/equipment" className="text-sm text-zinc-500 hover:text-zinc-300">← Attrezzature</Link>
            <h1 className="text-2xl font-bold text-zinc-100 mt-2">{equipment.name}</h1>
            <p className="text-zinc-400 text-sm">{EQUIPMENT_CATEGORY_LABELS[equipment.category]}</p>
          </div>
          <WarrantyBadge status={equipment.warranty_status} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Dati tecnici</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><span className="text-zinc-500">Marca</span><p className="text-zinc-200">{equipment.brand ?? "—"}</p></div>
              <div><span className="text-zinc-500">Modello</span><p className="text-zinc-200">{equipment.model ?? "—"}</p></div>
              <div><span className="text-zinc-500">Matricola</span><p className="text-zinc-200 font-mono">{equipment.serial_number ?? "—"}</p></div>
              <div><span className="text-zinc-500">Fornitore</span><p className="text-zinc-200">{equipment.supplier ?? "—"}</p></div>
              <div><span className="text-zinc-500">Area</span><p className="text-zinc-200">{equipment.area ?? "—"}</p></div>
              <div><span className="text-zinc-500">Installazione</span><p className="text-zinc-200">{formatDate(equipment.installation_date)}</p></div>
              <div><span className="text-zinc-500">Garanzia fino</span><p className="text-zinc-200">{formatDate(equipment.warranty_end)}</p></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <QrCode className="h-4 w-4 text-emerald-500" />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt={`QR code per ${equipment.name}`} width={200} height={200} />
              <p className="text-xs text-zinc-500 text-center break-all">{qrUrl}</p>
              <Button size="sm" variant="secondary" asChild className="w-full">
                <Link href={`/app/tickets/new?equipment=${equipment.id}`}>Apri ticket</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documenti ({documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <p className="text-sm text-zinc-500">Nessun documento caricato.</p>
            ) : (
              <ul className="space-y-2">
                {documents.map((d) => (
                  <li key={d.id} className="flex items-center gap-2 text-sm text-zinc-300">
                    <FileText className="h-4 w-4 text-zinc-500" />
                    {d.file_name}
                    <span className="text-zinc-600 text-xs">({d.document_type})</span>
                  </li>
                ))}
              </ul>
            )}
            <DocumentUpload equipmentId={equipment.id} />
          </CardContent>
        </Card>

        {tickets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ticket collegati</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tickets.map((t) => (
                  <li key={t.id}>
                    <Link href={`/app/tickets/${t.id}`} className="text-sm text-emerald-400 hover:underline">
                      {t.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalShell>
  );
}
