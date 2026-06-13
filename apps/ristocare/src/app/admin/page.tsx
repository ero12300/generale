import Link from "next/link";
import { demoStore } from "@/lib/demoStore";
import { TicketStatusBadge, UrgencyBadge } from "@/components/StatusBadge";
import { formatEuroCents, marginCents } from "@/lib/money";

export default function AdminDashboard() {
  const tickets = demoStore.listTickets();
  const quotes = demoStore.listQuotes();
  const org = demoStore.getOrganization();

  const urgent = tickets.filter(
    (t) => t.urgency === "blocco_servizio" && !["chiuso", "risolto", "annullato"].includes(t.status)
  );
  const totalMargin = quotes
    .filter((q) => q.status === "accettato")
    .reduce((acc, q) => acc + marginCents(q.customerPriceCents, q.internalCostCents), 0);

  const stats = [
    { label: "Ticket totali", value: String(tickets.length) },
    { label: "Urgenze attive", value: String(urgent.length) },
    { label: "Preventivi inviati", value: String(quotes.filter((q) => q.status === "inviato").length) },
    { label: "Margine incassato", value: formatEuroCents(totalMargin) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Centrale operativa</h1>
      <p className="mt-1 text-sm text-warmgray">
        Il cliente apre ticket verso RistoCare: qualifica, tecnico, margine e preventivo passano da qui.
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-white p-5 shadow-sm">
            <dt className="text-sm text-warmgray">{s.label}</dt>
            <dd className="mt-1 text-2xl font-semibold">{s.value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10" aria-labelledby="coda-ticket">
        <h2 id="coda-ticket" className="text-lg font-semibold">
          Coda ticket — {org.name}
        </h2>
        <div className="mt-4 overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 text-warmgray">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Ticket</th>
                <th scope="col" className="px-5 py-3 font-medium">Urgenza</th>
                <th scope="col" className="px-5 py-3 font-medium">Stato</th>
                <th scope="col" className="px-5 py-3 font-medium">Tecnico</th>
                <th scope="col" className="px-5 py-3 font-medium">Preventivo (interno → cliente)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {tickets.map((t) => {
                const tech = t.assignedTechnicianId
                  ? demoStore.getTechnician(t.assignedTechnicianId)
                  : undefined;
                const quote = demoStore.getQuoteForTicket(t.id);
                return (
                  <tr key={t.id} className="align-top hover:bg-stone-50">
                    <td className="px-5 py-4">
                      <p className="font-medium">{t.title}</p>
                      <p className="text-xs text-warmgray">
                        {t.id} · {demoStore.getEquipment(t.equipmentId)?.name}
                      </p>
                      {t.internalNotes && (
                        <p className="mt-1 rounded bg-amber-50 px-2 py-1 text-xs text-amber-900">
                          Nota interna: {t.internalNotes}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <UrgencyBadge urgency={t.urgency} />
                    </td>
                    <td className="px-5 py-4">
                      <TicketStatusBadge status={t.status} />
                    </td>
                    <td className="px-5 py-4">
                      {tech ? (
                        <>
                          <p className="font-medium">{tech.name}</p>
                          <p className="text-xs text-warmgray">{tech.companyName}</p>
                        </>
                      ) : (
                        <span className="text-warmgray">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {quote ? (
                        <>
                          <p>
                            <span className="text-warmgray">{formatEuroCents(quote.internalCostCents)}</span>
                            {" → "}
                            <span className="font-medium">{formatEuroCents(quote.customerPriceCents)}</span>
                          </p>
                          <p className="text-xs text-tech">
                            Margine {formatEuroCents(marginCents(quote.customerPriceCents, quote.internalCostCents))}
                          </p>
                        </>
                      ) : (
                        <span className="text-warmgray">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-warmgray">
          Costo tecnico e margine sono visibili solo agli operatori RistoCare; il cliente vede solo il
          preventivo finale. <Link href="/admin/tecnici" className="underline">Gestisci tecnici partner →</Link>
        </p>
      </section>
    </div>
  );
}
