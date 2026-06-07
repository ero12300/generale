"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Deal, DealStage } from "@deal-desk/types";
import { DEAL_STAGES } from "@deal-desk/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const stageVariant: Record<DealStage, "default" | "secondary" | "success" | "warning"> = {
  lead: "secondary",
  analysis: "default",
  offer: "warning",
  renovation: "warning",
  rental: "success",
  exit: "success",
  archived: "secondary",
};

interface PipelineBoardProps {
  deals: Deal[];
  prices?: Record<string, number | null>;
}

export function PipelineBoard({ deals: initialDeals, prices = {} }: PipelineBoardProps) {
  const router = useRouter();
  const [deals, setDeals] = useState(initialDeals);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeStages = DEAL_STAGES.filter((s) => s.value !== "archived");

  async function moveDeal(dealId: string, stage: DealStage) {
    setMovingId(dealId);
    setError(null);
    const previous = deals;
    setDeals((current) =>
      current.map((d) => (d.id === dealId ? { ...d, stage } : d))
    );

    const res = await fetch(`/api/deals/${dealId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });

    if (!res.ok) {
      setDeals(previous);
      const data = await res.json();
      setError(data.error ?? "Impossibile aggiornare lo stage");
    } else {
      router.refresh();
    }
    setMovingId(null);
  }

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="text-sm text-red-400 rounded-lg border border-red-900/40 bg-red-950/20 p-3">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {activeStages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.value);
          return (
            <div key={stage.value} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {stage.label}
                </h3>
                <Badge variant="secondary">{stageDeals.length}</Badge>
              </div>
              <div className="space-y-2 min-h-[120px]">
                {stageDeals.map((deal) => (
                  <Card
                    key={deal.id}
                    className="group hover:border-amber-600/40 transition-colors"
                  >
                    <CardHeader className="p-3 pb-1">
                      <Link href={`/deals/${deal.id}`}>
                        <CardTitle className="text-sm leading-snug line-clamp-2 hover:text-amber-300">
                          {deal.title}
                        </CardTitle>
                      </Link>
                    </CardHeader>
                    <CardContent className="p-3 pt-1 space-y-2">
                      {prices[deal.id] != null && (
                        <p className="text-xs text-amber-400 font-medium">
                          {formatCurrency(prices[deal.id])}
                        </p>
                      )}
                      <Badge variant={stageVariant[deal.stage]} className="text-[10px]">
                        {deal.strategy.replace(/_/g, " ")}
                      </Badge>
                      <label className="block">
                        <span className="sr-only">Cambia stage per {deal.title}</span>
                        <select
                          value={deal.stage}
                          disabled={movingId === deal.id}
                          onChange={(e) => moveDeal(deal.id, e.target.value as DealStage)}
                          className="w-full mt-1 rounded-md border border-zinc-700 bg-zinc-900 text-xs px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                        >
                          {DEAL_STAGES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
