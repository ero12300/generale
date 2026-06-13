import Link from "next/link";
import { PageHeader, StatCard } from "@/components/app/page-header";
import { TicketStatusBadge, WarrantyBadge } from "@/components/ui/status-badges";
import { getEquipmentList, getTickets } from "@/lib/demo-store";
import { CATEGORY_LABELS } from "@/lib/labels";
import { daysUntil, formatDate, warrantyStatusFrom } from "@/lib/utils";

const CLOSED = new Set(["chiuso", "annullato", "risolto"]);

export default function CustomerDashboard() {
  const equipment = getEquipmentList();
  const tickets = getTickets();

  const openTickets = tickets.filter((t) => !CLOSED.has(t.status));
  const waitingTickets = tickets.filter((t) =>
    ["in_attesa_tecnico", "in_attesa_ricambio", "richiesta_informazioni"].includes(t.status),
  );

  const warranties = equipment
    .map((e) => ({ e, status: warrantyStatusFrom(e.warrantyEnd), days: daysUntil(e.warrantyEnd) }))
    .filter((w) => w.status !== "scaduta")
    .sort((a, b) => a.days - b.days);
  const expiringSoon = warranties.filter((w) => w.status === "in_scadenza");

  const missingDocs = equipment.filter((e) => e.documents.length === 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Lo stato del tuo locale a colpo d'occhio."
        action={
          <Link
            href="/app/ticket/nuovo"
            className="inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-strong"
          >
            + Apri ticket
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Attrezzature" value={equipment.length} hint="Censite e attive" />
        <StatCard label="Ticket aperti" value={openTickets.length} tone={openTickets.length ? "amber" : "green"} hint={`${waitingTickets.length} in attesa`} />
        <StatCard label="Garanzie in scadenza" value={expiringSoon.length} tone={expiringSoon.length ? "amber" : "green"} hint="Entro 60 giorni" />
        <StatCard label="Documenti mancanti" value={missingDocs.length} tone={missingDocs.length ? "red" : "green"} hint="Da caricare" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Ticket recenti</h2>
            <Link href="/app/ticket" className="text-sm text-primary-strong hover:underline">Vedi tutti</Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {tickets.slice(0, 4).map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <Link href={`/app/ticket/${t.id}`} className="block truncate text-sm font-medium hover:text-primary-strong">
                    {t.title}
                  </Link>
                  <p className="text-xs text-muted">{t.code} · {formatDate(t.createdAt)}</p>
                </div>
                <TicketStatusBadge status={t.status} />
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Garanzie da monitorare</h2>
            <Link href="/app/attrezzature" className="text-sm text-primary-strong hover:underline">Attrezzature</Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {warranties.slice(0, 4).map(({ e, status, days }) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <Link href={`/app/attrezzature/${e.id}`} className="block truncate text-sm font-medium hover:text-primary-strong">
                    {e.name}
                  </Link>
                  <p className="text-xs text-muted">{CATEGORY_LABELS[e.category]} · scade tra {days} giorni</p>
                </div>
                <WarrantyBadge status={status} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
