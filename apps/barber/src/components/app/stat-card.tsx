import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  accent?: "gold" | "emerald" | "rose";
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-white/50">{label}</div>
        {icon && (
          <div
            className={cn(
              "grid h-9 w-9 place-items-center rounded-lg",
              accent === "gold" && "bg-[color:var(--color-gold-500)]/15 text-[color:var(--color-gold-300)]",
              accent === "emerald" && "bg-emerald-500/15 text-emerald-300",
              accent === "rose" && "bg-rose-500/15 text-rose-300",
              !accent && "bg-white/10 text-white/80",
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="mt-2 font-display text-3xl text-white">{value}</div>
      {hint && <div className="mt-1 text-xs text-white/50">{hint}</div>}
    </div>
  );
}
