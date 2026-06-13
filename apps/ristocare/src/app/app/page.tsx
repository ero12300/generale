import Link from "next/link";
import { demoStore } from "@/lib/demoStore";
import { warrantyStatus } from "@/lib/warranty";
import { TicketStatusBadge } from "@/components/StatusBadge";
import { Plus } from "lucide-react";

const OPEN_STATUSES = new Set([
  "nuovo",
  "in_verifica",
  "richiesta_informazioni",
  "in_attesa_tecnico",
  "preventivo_ricevuto",
  "preventivo_inviato",
  "accettato",
  "programmato",
  "in_intervento",
  "in_attesa_ricambio",
]);

export default function CustomerDashboard() {
  const equipment = demoStore.listEquipment();
  const tickets = demoStore.listTickets();
  const openTickets = tickets.filter((t) => OPEN_STATUSES.has(t.status));
  const expiring = equipment.filter((e) => warrantyStatus(e.warrantyEnd) === "in_scadenza");

  const stats = [
    { label: "Attrezzature censite", value: equipment.length },
    { label: "Ticket aperti", value: openTickets.length },
    { label: "Garanzie in scadenza (90 gg)", value: expiring.length },
    {
      label: "Documenti archiviati",
      value: equipment.reduce((acc, e) => acc + demoStore.listDocuments(e.id).length, 0),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <Link
          href="/app/ticket/nuovo"
          className="inline-flex items-center gap-2 rounded-full bg-tech px-5 py-2.5 text-sm font-medium text-white hover:bg-tech/90"
        >
          <Plus className="h-4 w-4" aria-hidden /> Apri ticket
        </Link>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-white p-5 shadow-sm">
            <dt className="text-sm text-warmgray">{s.label}</dt>
            <dd className="mt-1 text-3xl font-semibold">{s.value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10" aria-labelledby="ultimi-ticket">
        <h2 id="ultimi-ticket" className="text-lg font-semibold">
          Ultimi ticket
        </h2>
        <ul className="mt-4 divide-y divide-stone-200 rounded-xl bg-white shadow-sm">
          {tickets.slice(0, 5).map((t) => {
            const eq = demoStore.getEquipment(t.equipmentId);
            return (
              <li key={t.id}>
                <Link
                  href={`/app/ticket/${t.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-stone-50"
                >
                  <div>
                    <p className="font-medium">{t.title}</p>
                    <p className="text-sm text-warmgray">
                      {eq?.name} · {new Date(t.createdAt).toLocaleDateString("it-IT")}
                    </p>
                  </div>
                  <TicketStatusBadge status={t.status} />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {expiring.length > 0 && (
        <section className="mt-10" aria-labelledby="garanzie">
          <h2 id="garanzie" className="text-lg font-semibold">
            Garanzie in scadenza
          </h2>
          <ul className="mt-4 space-y-2">
            {expiring.map((e) => (
              <li key={e.id} className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm">
                <Link href={`/app/attrezzature/${e.id}`} className="font-medium hover:underline">
                  {e.name}
                </Link>{" "}
                — scade il {new Date(e.warrantyEnd).toLocaleDateString("it-IT")}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
