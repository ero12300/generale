import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { TicketStatusBadge, UrgencyBadge } from "@/components/ui/status-badges";
import { getEquipment, getTickets } from "@/lib/demo-store";
import { formatDate } from "@/lib/utils";

export default function TicketListPage() {
  const tickets = getTickets();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Ticket"
        description="Tutte le richieste di assistenza del tuo locale."
        action={
          <Link
            href="/app/ticket/nuovo"
            className="inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-strong"
          >
            + Apri ticket
          </Link>
        }
      />

      <ul className="space-y-3">
        {tickets.map((t) => {
          const equipment = getEquipment(t.equipmentId);
          return (
            <li key={t.id}>
              <Link
                href={`/app/ticket/${t.id}`}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 transition-colors hover:bg-surface-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted">{t.code}</span>
                    <TicketStatusBadge status={t.status} />
                  </div>
                  <p className="mt-1.5 truncate text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted">
                    {equipment?.name ?? "—"} · aperto da {t.openedBy} · {formatDate(t.createdAt)}
                  </p>
                </div>
                <UrgencyBadge urgency={t.urgency} />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
