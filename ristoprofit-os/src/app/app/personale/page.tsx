import { Badge, Kpi, Section, Table, statusTone } from "@/components/ui";
import { todaySales, todayShifts } from "@/lib/demo-data";
import { laborIncidence } from "@/lib/foodcost";
import { formatEuro, formatPct } from "@/lib/money";

export const metadata = { title: "Personale" };

export default function PersonalePage() {
  const labor = laborIncidence(todayShifts, todaySales.revenueCents, todaySales.covers);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Costo personale oggi" value={formatEuro(labor.laborCostCents)} />
        <Kpi
          label="Incidenza su incasso"
          value={formatPct(labor.laborPct)}
          tone={labor.status === "ok" ? "good" : labor.status === "attenzione" ? "warn" : "bad"}
          hint={labor.status === "attenzione" ? "Attenzione: incidenza elevata" : labor.status === "critico" ? "Critico: rivedere i turni" : "Sotto la soglia del 30%"}
        />
        <Kpi label="Costo per coperto" value={formatEuro(labor.costPerCoverCents)} hint={`${todaySales.covers} coperti`} />
        <Kpi label="Incasso di oggi" value={formatEuro(todaySales.revenueCents)} tone="good" />
      </div>

      <Section
        title="Turni di oggi"
        description="Costo orario stimato — non è un software paghe, serve a leggere la produttività"
      >
        <Table headers={["Dipendente", "Ruolo", "Ore", "Costo orario", "Costo turno", "Stato"]}>
          {todayShifts.map((s) => (
            <tr key={s.staffId}>
              <td className="px-4 py-3 font-medium text-ink">{s.name}</td>
              <td className="px-4 py-3 text-warmgray">{s.role}</td>
              <td className="px-4 py-3 tabular-nums">{s.hours}</td>
              <td className="px-4 py-3 tabular-nums">{formatEuro(s.hourlyCostCents)}</td>
              <td className="px-4 py-3 tabular-nums">{formatEuro(Math.round(s.hours * s.hourlyCostCents))}</td>
              <td className="px-4 py-3">
                <Badge tone={statusTone(labor.status)}>{labor.status}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      </Section>
    </>
  );
}
