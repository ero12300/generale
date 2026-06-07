import { PipelineBoard } from "@/components/deals/pipeline-board";
import { getDataRepository } from "@/lib/data";

export default async function DealsPage() {
  const repo = await getDataRepository();
  const deals = (await repo.listDeals()).filter((d) => d.stage !== "archived");
  const prices = await repo.listPropertyPrices(deals.map((d) => d.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pipeline Deal</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Dall&apos;opportunità alla decisione d&apos;investimento — trascina o usa il menu per cambiare stage
        </p>
      </div>
      <PipelineBoard deals={deals} prices={prices} />
    </div>
  );
}
