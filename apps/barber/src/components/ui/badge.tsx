import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "default" | "gold" | "success" | "danger" | "warn" | "muted";

export function Badge({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  const tones: Record<BadgeTone, string> = {
    default: "bg-white/10 text-white/80 border border-white/10",
    gold: "text-[color:var(--color-gold-200)] border border-[color:var(--color-gold-300)]/30 bg-[color:var(--color-gold-500)]/10",
    success: "text-emerald-300 border border-emerald-500/25 bg-emerald-500/10",
    danger: "text-rose-300 border border-rose-500/25 bg-rose-500/10",
    warn: "text-amber-300 border border-amber-500/25 bg-amber-500/10",
    muted: "bg-white/5 text-white/50 border border-white/10",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
