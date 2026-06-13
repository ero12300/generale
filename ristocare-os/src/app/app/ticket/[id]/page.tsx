import Link from "next/link";
import { notFound } from "next/navigation";
import { TicketStatusBadge, UrgencyBadge, WarrantyBadge } from "@/components/ui/status-badges";
import { Badge } from "@/components/ui/badge";
import { getEquipment, getTicket } from "@/lib/demo-store";
import { TICKET_STATUS_LABELS } from "@/lib/labels";
import { formatDateTime, formatEuro } from "@/lib/utils";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = getTicket(id);
  if (!ticket) notFound();

  const equipment = getEquipment(ticket.equipmentId);
  const events = [...ticket.events].reverse();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/app/ticket" className="text-sm text-muted hover:text-foreground">← Ticket</Link>
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

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-base font-semibold">Descrizione</h2>
            <p className="mt-3 text-sm text-muted">{ticket.description}</p>
            {ticket.attachments.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {ticket.attachments.map((a) => (
                  <Badge key={a.id} tone="blue">📎 {a.fileName}</Badge>
                ))}
              </div>
            ) : null}
          </section>

          {ticket.quote ? (
            <section className="rounded-2xl border border-gold/30 bg-gold/5 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Preventivo</h2>
                <Badge tone="gold">{ticket.quote.status}</Badge>
              </div>
              {/* Vista cliente: SOLO prezzo finale, mai costo interno o margine. */}
              <p className="mt-4 text-3xl font-semibold text-gold">{formatEuro(ticket.quote.customerPrice)}</p>
              <p className="mt-1 text-xs text-muted">Valido fino al {new Date(ticket.quote.validUntil).toLocaleDateString("it-IT")}</p>
              {ticket.status === "preventivo_inviato" ? (
                <div className="mt-5 flex gap-3">
                  <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong">Accetta preventivo</button>
                  <button className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-2">Richiedi chiarimenti</button>
                </div>
              ) : null}
            </section>
          ) : null}

          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-base font-semibold">Cronologia</h2>
            <ol className="mt-5 space-y-5">
              {events.map((ev, i) => (
                <li key={ev.id} className="relative pl-7">
                  <span className={`absolute left-0 top-1 grid h-4 w-4 place-items-center rounded-full ${i === 0 ? "bg-primary" : "bg-surface-2 border border-border"}`}>
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
            <h2 className="text-base font-semibold">Dettagli</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Garanzia</dt>
                <dd>{ticket.warrantyCheck === "da_verificare" ? <Badge>Da verificare</Badge> : <WarrantyBadge status={ticket.warrantyCheck} />}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Aperto da</dt>
                <dd className="font-medium">{ticket.openedBy}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Apertura</dt>
                <dd className="font-medium">{formatDateTime(ticket.createdAt)}</dd>
              </div>
            </dl>
          </section>

          {equipment ? (
            <section className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-base font-semibold">Attrezzatura</h2>
              <p className="mt-3 text-sm font-medium">{equipment.name}</p>
              <p className="text-xs text-muted">{equipment.brand} {equipment.model}</p>
              <p className="mt-1 font-mono text-xs text-muted">{equipment.serialNumber}</p>
              <Link href={`/app/attrezzature/${equipment.id}`} className="mt-4 inline-flex text-sm text-primary-strong hover:underline">
                Vai alla scheda →
              </Link>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
