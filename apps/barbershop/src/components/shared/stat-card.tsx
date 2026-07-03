import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
          <p className="mt-0.5 text-xl font-bold text-zinc-100">{value}</p>
          {hint && <p className="text-xs text-zinc-500">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
