import { Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl gold-gradient text-[#0b0b0f] shadow-lg shadow-[#c9a349]/20">
        <Scissors size={18} strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="text-lg font-semibold tracking-tight">
          Barber<span className="text-gradient-gold">OS</span>
        </span>
      )}
    </span>
  );
}
