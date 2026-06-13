import Link from "next/link";
import { PageHeader, StatCard } from "@/components/app/page-header";
import { TicketStatusBadge, UrgencyBadge } from "@/components/ui/status-badges";
import { getReferrals, getTechnicians, getTickets } from "@/lib/demo-store";
import { formatEuro } from "@/lib/utils";

const OPEN = new Set([
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

export default function AdminDashboard() {
  const tickets = getTickets();
  const technicians = getTechnicians();
  const referrals = getReferrals();

  const openTickets = tickets.filter((t) => OPEN.has(t.status));
  const newTickets = tickets.filter((t) => t.status === "nuovo" || t.status === "in_verifica");
  const quotesToSend = tickets.filter((t) => t.status === "preventivo_ricevuto");

  // Margine potenziale dai preventivi attivi (vista interna).
  const pipelineMargin = tickets
    .filter((t) => t.quote && t.quote.status !== "rifiutato")
    .reduce((sum, t) => sum + (t.quote?.margin ?? 0), 0);

  const activeReferrals = referrals.filter((r) => r.status !== "perso");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Centrale operativa"
        description="Coordina ticket, tecnici, preventivi e margini."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Ticket aperti" value={openTickets.length} tone="amber" hint={`${newTickets.length} da qualificare`} />
        <StatCard label="Preventivi da inviare" value={quotesToSend.length} tone={quotesToSend.length ? "gold" : "green"} />
        <StatCard label="Margine in pipeline" value={formatEuro(pipelineMargin)} tone="green" hint="Da preventivi attivi" />
        <StatCard label="Tecnici attivi" value={technicians.filter((t) => t.active).length} hint="Rete partner" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Coda ticket</h2>
            <Link href="/admin/ticket" className="text-sm text-primary-strong hover:underline">Gestisci tutti</Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {openTickets.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <Link href={`/admin/ticket/${t.id}`} className="block truncate text-sm font-medium hover:text-primary-strong">{t.title}</Link>
                  <p className="text-xs text-muted">{t.code} · {t.openedBy}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <UrgencyBadge urgency={t.urgency} />
                  <TicketStatusBadge status={t.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Referral attivi</h2>
            <Link href="/admin/referral" className="text-sm text-primary-strong hover:underline">Vedi</Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {activeReferrals.map((r) => (
              <li key={r.id} className="py-3">
                <p className="text-sm font-medium">{r.referredCompany}</p>
                <p className="text-xs text-muted">da {r.partnerName} · {r.city}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
