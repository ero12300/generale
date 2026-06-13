import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { TicketStatusBadge, UrgencyBadge } from "@/components/ui/status-badges";
import { getEquipment, getTickets } from "@/lib/demo-store";
import { formatEuro } from "@/lib/utils";

export default function AdminTicketList() {
  const tickets = getTickets();

  return (
    <div className="space-y-8">
      <PageHeader title="Ticket" description="Vista interna con margini e assegnazioni." />

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <ul className="divide-y divide-border">
          {tickets.map((t) => {
            const equipment = getEquipment(t.equipmentId);
            return (
              <li key={t.id}>
                <Link href={`/admin/ticket/${t.id}`} className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-surface-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted">{t.code}</span>
                      <TicketStatusBadge status={t.status} />
                    </div>
                    <p className="mt-1 truncate text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-muted">{equipment?.name ?? "—"} · {t.openedBy}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {t.quote ? (
                      <span className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-primary-strong">
                        Margine {formatEuro(t.quote.margin)}
                      </span>
                    ) : null}
                    <UrgencyBadge urgency={t.urgency} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
