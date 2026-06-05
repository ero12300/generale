"use client";

import Link from "next/link";
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

export function PipelineBoard({ deals, prices = {} }: PipelineBoardProps) {
  const activeStages = DEAL_STAGES.filter((s) => s.value !== "archived");

  return (
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
                <Link key={deal.id} href={`/deals/${deal.id}`} className="block group">
                  <Card className="group-hover:border-amber-600/40 transition-colors">
                    <CardHeader className="p-3 pb-1">
                      <CardTitle className="text-sm leading-snug line-clamp-2">
                        {deal.title}
                      </CardTitle>
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
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
