import { Card, Section, Table } from "@/components/ui";
import { productionHistory } from "@/lib/demo-data";
import { suggestedProduction } from "@/lib/foodcost";

export const metadata = { title: "Produzione giornaliera" };

export default function ProduzionePage() {
  return (
    <>
      <Section
        title="Produzione consigliata per domani (sabato)"
        description="Basata sulle vendite dello stesso giorno della settimana scorsa, con margine di sicurezza del 15%"
      >
        <Table headers={["Prodotto", "Venduto sabato scorso", "Produzione consigliata"]}>
          {productionHistory.map((p) => (
            <tr key={p.recipeId}>
              <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
              <td className="px-4 py-3 tabular-nums">{p.soldSameDayLastWeek}</td>
              <td className="px-4 py-3 tabular-nums font-semibold text-profit">
                {suggestedProduction(p.soldSameDayLastWeek)}
              </td>
            </tr>
          ))}
        </Table>
      </Section>
      <Card>
        <p className="text-sm text-warmgray">
          In roadmap: il suggerimento terrà conto anche di meteo, festività,
          prenotazioni ed eventi locali. Esempio: «Sabato scorso hai venduto 48
          brioche. Per questo sabato produzione consigliata: 55 brioche.»
        </p>
      </Card>
    </>
  );
}
