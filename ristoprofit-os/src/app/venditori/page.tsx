import { Badge, Card, Kpi, Section, Table } from "@/components/ui";
import { agents, organizations } from "@/lib/demo-data";
import { formatEuro } from "@/lib/money";

export const metadata = { title: "Area venditori" };

const COMMISSION_PLAN: [string, string][] = [
  ["Analisi Food Cost 490 €", "50 €"],
  ["Setup Start 490 €", "75 €"],
  ["Setup Pro 990 €", "150 €"],
  ["Setup Premium 1.990 €", "300 €"],
  ["Canone Start", "10% per 6 mesi"],
  ["Canone Pro", "10% per 12 mesi"],
  ["Canone Premium", "10% per 12 mesi"],
];

const BONUS: [string, string][] = [
  ["5 clienti attivi nel trimestre", "300 €"],
  ["10 clienti attivi nel trimestre", "800 €"],
  ["15 clienti attivi nel trimestre", "1.500 €"],
  ["25 clienti attivi nel trimestre", "3.000 €"],
];

export default function VenditoriPage() {
  const me = agents[0];
  const myClients = organizations.filter((o) => o.agentId === me.id);
  const leaderboard = [...agents].sort((a, b) => b.mrrCents - a.mrrCents);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Clienti attivi" value={String(me.activeClients)} hint={me.level === "senior" ? "Livello senior: 20% sul setup" : "Livello base"} />
        <Kpi label="MRR generato" value={formatEuro(me.mrrCents)} tone="good" />
        <Kpi label="Provvigioni maturate" value={formatEuro(me.commissionsAccruedCents)} tone="gold" hint={`pagate ${formatEuro(me.commissionsPaidCents)}`} />
        <Kpi label="Demo fatte (trimestre)" value={String(me.demosDone)} />
      </div>

      <Section title="I miei clienti" description="Vede solo i clienti assegnati">
        <Table headers={["Cliente", "Città", "Piano", "Stato", "MRR"]}>
          {myClients.map((o) => (
            <tr key={o.id}>
              <td className="px-4 py-3 font-medium text-ink">{o.name}</td>
              <td className="px-4 py-3 text-warmgray">{o.city}</td>
              <td className="px-4 py-3 capitalize">{o.plan}</td>
              <td className="px-4 py-3">
                <Badge tone={o.status === "attivo" ? "good" : "warn"}>{o.status.replace("_", " ")}</Badge>
              </td>
              <td className="px-4 py-3 tabular-nums">{formatEuro(o.mrrCents)}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section title="Classifica venditori" description="Gamification: venditore del mese per MRR generato">
        <div id="classifica">
          <Table headers={["#", "Venditore", "Livello", "Clienti attivi", "MRR", "Setup venduti"]}>
            {leaderboard.map((a, i) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-semibold">{i === 0 ? "🏆 1" : i + 1}</td>
                <td className="px-4 py-3 font-medium text-ink">{a.name}</td>
                <td className="px-4 py-3 capitalize">{a.level}</td>
                <td className="px-4 py-3 tabular-nums">{a.activeClients}</td>
                <td className="px-4 py-3 tabular-nums">{formatEuro(a.mrrCents)}</td>
                <td className="px-4 py-3 tabular-nums">{formatEuro(a.setupSoldCents)}</td>
              </tr>
            ))}
          </Table>
        </div>
      </Section>

      <Section title="Piano provvigioni" description="Provvigione riconosciuta solo se il cliente paga regolarmente ed era registrato nel CRM prima della trattativa">
        <div id="provvigioni" className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-2 font-semibold text-ink">Venditore base</h3>
            <ul className="divide-y divide-stone-100 text-sm">
              {COMMISSION_PLAN.map(([k, v]) => (
                <li key={k} className="flex justify-between py-2">
                  <span className="text-warmgray">{k}</span>
                  <span className="font-medium text-ink">{v}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="mb-2 font-semibold text-ink">Bonus trimestrale</h3>
            <ul className="divide-y divide-stone-100 text-sm">
              {BONUS.map(([k, v]) => (
                <li key={k} className="flex justify-between py-2">
                  <span className="text-warmgray">{k}</span>
                  <span className="font-medium text-profit">{v}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 rounded-lg bg-gold-soft p-3 text-sm text-ink">
              Venditore senior (da 5 clienti attivi): 20% sul setup, 10% canone
              per 12 mesi, bonus 300 € ogni 5 clienti Pro/Premium.
            </p>
          </Card>
        </div>
      </Section>
    </>
  );
}
