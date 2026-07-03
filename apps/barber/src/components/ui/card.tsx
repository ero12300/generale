import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-lg font-semibold tracking-tight", className)}>{children}</h3>
  );
}

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
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 card-hover",
        accent
          ? "border-[var(--gold-deep)] bg-gradient-to-br from-[var(--gold)]/12 to-transparent"
          : "border-border bg-surface",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        {icon && <span className="text-[var(--gold)]">{icon}</span>}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </div>
  );
}
