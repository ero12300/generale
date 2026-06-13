import Link from "next/link";
import { demoStore } from "@/lib/demoStore";
import { TicketStatusBadge, UrgencyBadge } from "@/components/StatusBadge";
import { Plus } from "lucide-react";

export default function TicketListPage() {
  const tickets = demoStore.listTickets();
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ticket</h1>
          <p className="mt-1 text-sm text-warmgray">
            Apri una segnalazione e la centrale operativa RistoCare gestisce la pratica.
          </p>
        </div>
        <Link
          href="/app/ticket/nuovo"
          className="inline-flex items-center gap-2 rounded-full bg-tech px-5 py-2.5 text-sm font-medium text-white hover:bg-tech/90"
        >
          <Plus className="h-4 w-4" aria-hidden /> Apri ticket
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-stone-200 rounded-xl bg-white shadow-sm">
        {tickets.map((t) => {
          const eq = demoStore.getEquipment(t.equipmentId);
          return (
            <li key={t.id}>
              <Link
                href={`/app/ticket/${t.id}`}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-stone-50"
              >
                <div>
                  <p className="font-medium">
                    <span className="mr-2 font-mono text-xs text-warmgray">{t.id}</span>
                    {t.title}
                  </p>
                  <p className="text-sm text-warmgray">
                    {eq?.name} · aperto da {t.openedBy} ·{" "}
                    {new Date(t.createdAt).toLocaleDateString("it-IT")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <UrgencyBadge urgency={t.urgency} />
                  <TicketStatusBadge status={t.status} />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
