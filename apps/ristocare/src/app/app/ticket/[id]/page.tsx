import Link from "next/link";
import { notFound } from "next/navigation";
import { demoStore } from "@/lib/demoStore";
import { TicketStatusBadge, UrgencyBadge } from "@/components/StatusBadge";
import { formatEuroCents } from "@/lib/money";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = demoStore.getTicket(id);
  if (!ticket) notFound();

  const eq = demoStore.getEquipment(ticket.equipmentId);
  const quote = demoStore.getQuoteForTicket(ticket.id);

  return (
    <div className="max-w-3xl">
      <Link href="/app/ticket" className="text-sm text-warmgray hover:underline">
        ← Ticket
      </Link>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{ticket.title}</h1>
        <TicketStatusBadge status={ticket.status} />
        <UrgencyBadge urgency={ticket.urgency} />
      </div>
      <p className="mt-1 text-sm text-warmgray">
        {ticket.id} · aperto da {ticket.openedBy} il{" "}
        {new Date(ticket.createdAt).toLocaleString("it-IT")}
      </p>

      <section className="mt-6 rounded-xl bg-white p-6 shadow-sm" aria-labelledby="descrizione">
        <h2 id="descrizione" className="text-lg font-semibold">
          Descrizione del problema
        </h2>
        <p className="mt-2 whitespace-pre-line text-sm text-stone-700">{ticket.description}</p>
        {ticket.machineDown && (
          <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800">
            La macchina è ferma: il problema blocca il servizio.
          </p>
        )}
      </section>

      {eq && (
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm" aria-labelledby="macchina">
          <h2 id="macchina" className="text-lg font-semibold">
            Attrezzatura
          </h2>
          <p className="mt-2 text-sm">
            <Link href={`/app/attrezzature/${eq.id}`} className="font-medium hover:underline">
              {eq.name}
            </Link>{" "}
            — {eq.brand} {eq.model} · matricola{" "}
            <span className="font-mono text-xs">{eq.serialNumber}</span>
          </p>
        </section>
      )}

      {quote && (
        <section className="mt-6 rounded-xl border border-gold/40 bg-gold-soft p-6" aria-labelledby="preventivo">
          <h2 id="preventivo" className="text-lg font-semibold">
            Preventivo RistoCare
          </h2>
          <p className="mt-2 text-3xl font-semibold">{formatEuroCents(quote.customerPriceCents)}</p>
          <p className="mt-1 text-sm text-warmgray">
            Valido fino al {new Date(quote.validUntil).toLocaleDateString("it-IT")} · stato:{" "}
            <span className="font-medium capitalize text-ink">{quote.status}</span>
          </p>
          <p className="mt-3 text-xs text-warmgray">
            Il preventivo è una bozza commerciale gestita dalla centrale operativa RistoCare e non
            costituisce consulenza tecnica o legale. L&apos;intervento è eseguito da professionista incaricato.
          </p>
        </section>
      )}
    </div>
  );
}
