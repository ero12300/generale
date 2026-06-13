import { cn } from "@/lib/utils";
import type { FoodCostStatus } from "@ristoprofit/types";

const statusStyles: Record<FoodCostStatus, string> = {
  excellent: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  good: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  critical: "bg-red-500/15 text-red-400 border-red-500/30",
};

const statusLabels: Record<FoodCostStatus, string> = {
  excellent: "Ottimo",
  good: "Buono",
  warning: "Attenzione",
  critical: "Critico",
};

export function FoodCostBadge({
  status,
  className,
}: {
  status: FoodCostStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gold" | "muted";
}) {
  const variants = {
    default: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    gold: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    muted: "bg-zinc-800 text-zinc-400 border-zinc-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
