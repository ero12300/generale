import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { FileText, QrCode } from "lucide-react";
import { getRepository, getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";
import { PortalPageHeader } from "@/components/portal/page-header";
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
        <PortalPageHeader
          backHref="/app/equipment"
          backLabel="Attrezzature"
          title={equipment.name}
          description={EQUIPMENT_CATEGORY_LABELS[equipment.category]}
          action={<WarrantyBadge status={equipment.warranty_status} />}
        />

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Dati tecnici</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><span className="text-zinc-500">Marca</span><p className="text-zinc-800 mt-0.5">{equipment.brand ?? "—"}</p></div>
              <div><span className="text-zinc-500">Modello</span><p className="text-zinc-800 mt-0.5">{equipment.model ?? "—"}</p></div>
              <div><span className="text-zinc-500">Matricola</span><p className="text-zinc-800 font-mono mt-0.5">{equipment.serial_number ?? "—"}</p></div>
              <div><span className="text-zinc-500">Fornitore</span><p className="text-zinc-800 mt-0.5">{equipment.supplier ?? "—"}</p></div>
              <div><span className="text-zinc-500">Area</span><p className="text-zinc-800 mt-0.5">{equipment.area ?? "—"}</p></div>
              <div><span className="text-zinc-500">Installazione</span><p className="text-zinc-800 mt-0.5">{formatDate(equipment.installation_date)}</p></div>
              <div><span className="text-zinc-500">Garanzia fino</span><p className="text-zinc-800 mt-0.5">{formatDate(equipment.warranty_end)}</p></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <QrCode className="h-4 w-4 text-emerald-700" />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt={`QR code per ${equipment.name}`} width={200} height={200} className="rounded-xl" />
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
              <FileText className="h-4 w-4 text-emerald-700" />
              Documenti ({documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <p className="text-sm text-zinc-500">Nessun documento caricato.</p>
            ) : (
              <ul className="space-y-2 mb-4">
                {documents.map((d) => (
                  <li key={d.id} className="flex items-center gap-2 text-sm text-zinc-700 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                    <FileText className="h-4 w-4 text-zinc-500 shrink-0" />
                    <span className="truncate">{d.file_name}</span>
                    <span className="text-zinc-600 text-xs ml-auto shrink-0">({d.document_type})</span>
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
                    <Link
                      href={`/app/tickets/${t.id}`}
                      className="block text-sm text-emerald-600 hover:text-emerald-700 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 transition-colors"
                    >
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
