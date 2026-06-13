import { Badge, Kpi, Section, Table, statusTone } from "@/components/ui";
import { agents, organizations } from "@/lib/demo-data";
import { formatEuro } from "@/lib/money";
import { PLANS } from "@/lib/plans";

export const metadata = { title: "Admin Emotive" };

export default function AdminDashboard() {
  const active = organizations.filter((o) => o.status === "attivo");
  const trial = organizations.filter((o) => o.status === "in_prova");
  const setup = organizations.filter((o) => o.status === "setup");
  const expired = organizations.filter((o) => o.status === "scaduto");
  const mrr = organizations.reduce((s, o) => s + o.mrrCents, 0);
  const agentMap = new Map(agents.map((a) => [a.id, a.name]));
  const planName = new Map(PLANS.map((p) => [p.id, p.name]));

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="MRR mensile" value={formatEuro(mrr)} tone="good" />
        <Kpi label="Clienti attivi" value={String(active.length)} hint={`${trial.length} in prova · ${setup.length} in setup`} />
        <Kpi label="Abbonamenti scaduti" value={String(expired.length)} tone={expired.length > 0 ? "bad" : "good"} hint="da richiamare" />
        <Kpi
          label="Setup venduti (anno)"
          value={formatEuro(agents.reduce((s, a) => s + a.setupSoldCents, 0))}
          tone="gold"
        />
      </div>

      <Section title="Clienti" description="Organizzazioni, piani e stato abbonamento">
        <div id="clienti">
          <Table headers={["Cliente", "Città", "Piano", "Stato", "MRR", "Venditore"]}>
            {organizations.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-medium text-ink">{o.name}</td>
                <td className="px-4 py-3 text-warmgray">{o.city}</td>
                <td className="px-4 py-3">{planName.get(o.plan)}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone(o.status)}>{o.status.replace("_", " ")}</Badge>
                </td>
                <td className="px-4 py-3 tabular-nums">{formatEuro(o.mrrCents)}</td>
                <td className="px-4 py-3 text-warmgray">{o.agentId ? agentMap.get(o.agentId) : "—"}</td>
              </tr>
            ))}
          </Table>
        </div>
      </Section>

      <Section title="Alert" description="Clienti critici e opportunità">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <strong>Lounge Marettimo</strong> — abbonamento Start scaduto da 12
            giorni. Da richiamare per rinnovo o disdetta.
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <strong>Pasticceria Irrera 1910</strong> — setup Pro pagato, mancano
            32 ricette da caricare. Opportunità: proporre Analisi Food Cost
            iniziale (490 €).
          </div>
        </div>
      </Section>
    </>
  );
}
