import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "destructive" | "gold" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-[var(--accent)] text-[var(--muted-foreground)] border border-[var(--border)]",
    success: "bg-green-900/30 text-green-400 border border-green-900/50",
    warning: "bg-yellow-900/30 text-yellow-400 border border-yellow-900/50",
    destructive: "bg-red-900/30 text-red-400 border border-red-900/50",
    gold: "bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30",
    outline: "bg-transparent text-[var(--muted)] border border-[var(--border)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function BookingStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    pending: { label: "In attesa", variant: "warning" },
    confirmed: { label: "Confermata", variant: "success" },
    completed: { label: "Completata", variant: "default" },
    cancelled: { label: "Annullata", variant: "destructive" },
    no_show: { label: "Non presentato", variant: "destructive" },
  };
  const { label, variant } = map[status] ?? { label: status, variant: "default" as BadgeVariant };
  return <Badge variant={variant}>{label}</Badge>;
}
