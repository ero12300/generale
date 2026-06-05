import { PipelineBoard } from "@/components/deals/pipeline-board";
import { demoStore } from "@/lib/demo-store";

export default function DealsPage() {
  const deals = demoStore.listDeals().filter((d) => d.stage !== "archived");
  const prices: Record<string, number | null> = {};
  for (const deal of deals) {
    prices[deal.id] = demoStore.getProperty(deal.id)?.price_asked ?? null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pipeline Deal</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Dall&apos;opportunità alla decisione d&apos;investimento
        </p>
      </div>
      <PipelineBoard deals={deals} prices={prices} />
    </div>
  );
}
