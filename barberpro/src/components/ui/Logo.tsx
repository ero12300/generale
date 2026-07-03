import { Scissors } from "lucide-react";
import { cn } from "@/lib/format";

export function Logo({ className, subtitle }: { className?: string; subtitle?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-gradient text-ink shadow-gold">
        <Scissors className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <div className="leading-tight">
        <span className="block font-display text-lg font-semibold tracking-tight text-cream">
          Barber<span className="text-gold-soft">Pro</span>
        </span>
        {subtitle ? <span className="block text-[10px] uppercase tracking-[0.2em] text-cream/40">{subtitle}</span> : null}
      </div>
    </div>
  );
}
