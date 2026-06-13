import Link from "next/link";
import { notFound } from "next/navigation";
import { AdvanceTicketForm } from "@/components/forms/advance-ticket-form";
import { Badge } from "@/components/ui/badge";
import { TicketStatusBadge, UrgencyBadge, WarrantyBadge } from "@/components/ui/status-badges";
import { getEquipment, getTechnician, getTicket } from "@/lib/demo-store";
import { TICKET_STATUS_LABELS } from "@/lib/labels";
import { formatDateTime, formatEuro } from "@/lib/utils";

export default async function AdminTicketDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = getTicket(id);
  if (!ticket) notFound();

  const equipment = getEquipment(ticket.equipmentId);
  const technician = getTechnician(ticket.assignedTechnicianId);
  const events = [...ticket.events].reverse();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/ticket" className="text-sm text-muted hover:text-foreground">← Ticket</Link>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted">{ticket.code}</span>
              <TicketStatusBadge status={ticket.status} />
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">{ticket.title}</h1>
          </div>
          <UrgencyBadge urgency={ticket.urgency} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-base font-semibold">Descrizione cliente</h2>
            <p className="mt-3 text-sm text-muted">{ticket.description}</p>
          </section>

          {/* Vista interna preventivo: costo tecnico + margine (mai visibile al cliente). */}
          {ticket.quote ? (
            <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Preventivo — vista interna</h2>
                <Badge tone="green">{ticket.quote.status}</Badge>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-border bg-surface p-3">
                  <dt className="text-xs text-muted">Costo tecnico</dt>
                  <dd className="mt-1 text-lg font-semibold">{formatEuro(ticket.quote.internalCost)}</dd>
                </div>
                <div className="rounded-xl border border-primary/40 bg-primary/10 p-3">
                  <dt className="text-xs text-muted">Margine</dt>
                  <dd className="mt-1 text-lg font-semibold text-primary-strong">{formatEuro(ticket.quote.margin)}</dd>
                </div>
                <div className="rounded-xl border border-gold/40 bg-gold/10 p-3">
                  <dt className="text-xs text-muted">Prezzo cliente</dt>
                  <dd className="mt-1 text-lg font-semibold text-gold">{formatEuro(ticket.quote.customerPrice)}</dd>
                </div>
              </dl>
            </section>
          ) : (
            <section className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-muted">
              Nessun preventivo: qualifica la richiesta e contatta un tecnico partner.
            </section>
          )}

          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-base font-semibold">Cronologia</h2>
            <ol className="mt-5 space-y-5">
              {events.map((ev, i) => (
                <li key={ev.id} className="relative pl-7">
                  <span className={`absolute left-0 top-1 grid h-4 w-4 place-items-center rounded-full ${i === 0 ? "bg-primary" : "border border-border bg-surface-2"}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-background" />
                  </span>
                  {i !== events.length - 1 ? <span className="absolute left-[7px] top-5 h-full w-px bg-border" /> : null}
                  <p className="text-sm font-medium">{TICKET_STATUS_LABELS[ev.status]}</p>
                  <p className="text-xs text-muted">{ev.note}</p>
                  <p className="mt-0.5 text-[11px] text-muted/70">{ev.author} · {formatDateTime(ev.createdAt)}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-base font-semibold">Avanza pratica</h2>
            <p className="mt-1 text-xs text-muted">Aggiorna lo stato e registra una nota.</p>
            <div className="mt-4">
              <AdvanceTicketForm ticketId={ticket.id} currentStatus={ticket.status} />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-base font-semibold">Dettagli</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Garanzia</dt>
                <dd>{ticket.warrantyCheck === "da_verificare" ? <Badge>Da verificare</Badge> : <WarrantyBadge status={ticket.warrantyCheck} />}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Tecnico</dt>
                <dd className="font-medium">{technician ? technician.companyName : "Non assegnato"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Attrezzatura</dt>
                <dd className="font-medium">{equipment?.name ?? "—"}</dd>
              </div>
            </dl>
            {equipment ? (
              <Link href={`/app/attrezzature/${equipment.id}`} className="mt-4 inline-flex text-sm text-primary-strong hover:underline">Scheda attrezzatura →</Link>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}
