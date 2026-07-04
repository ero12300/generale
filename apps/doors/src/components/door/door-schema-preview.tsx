import type { DoorPlan } from "@/lib/door-engine/types";
import { createDoorSvg } from "@/lib/door-engine/schema-export";

export function DoorSchemaPreview({ plan }: { plan: DoorPlan }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-panel shadow-2xl shadow-black/30">
      <div
        className="mx-auto max-w-[420px]"
        aria-label={`Schema ${plan.modelLabel} ${plan.frame.outerWidthMm} per ${plan.frame.outerHeightMm} millimetri`}
        dangerouslySetInnerHTML={{ __html: createDoorSvg(plan) }}
      />
    </div>
  );
}
