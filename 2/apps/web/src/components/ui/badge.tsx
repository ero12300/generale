import { cn } from "@/lib/utils";
import type { FoodCostStatus } from "@ristoprofit/types";

const statusStyles: Record<FoodCostStatus, string> = {
  excellent: "bg-emerald-50 text-emerald-800 border-emerald-200",
  good: "bg-emerald-50/80 text-emerald-700 border-emerald-200/80",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  critical: "bg-red-50 text-red-700 border-red-200",
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
    default: "bg-emerald-50 text-emerald-800 border-emerald-200",
    gold: "bg-amber-50 text-amber-800 border-amber-200",
    muted: "bg-stone-100 text-stone-600 border-stone-200",
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
