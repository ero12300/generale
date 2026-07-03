import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Tone = "default" | "gold" | "emerald" | "rose" | "amber" | "violet";

const tones: Record<Tone, string> = {
  default: "bg-white/5 text-ink-300 border-white/10",
  gold: "bg-[color:var(--color-gold-500)]/10 text-[color:var(--color-gold-300)] border-[color:var(--color-gold-500)]/30",
  emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  rose: "bg-rose-500/10 text-rose-300 border-rose-500/30",
  amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  violet: "bg-violet-500/10 text-violet-300 border-violet-500/30",
};

export function Badge({
  tone = "default",
  className,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border",
        tones[tone],
        className,
      )}
      {...rest}
    />
  );
}
