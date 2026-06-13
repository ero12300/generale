import Link from "next/link";
import { cn } from "@/lib/utils";

interface PortalPageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  action?: React.ReactNode;
  variant?: "customer" | "admin";
}

export function PortalPageHeader({
  title,
  description,
  backHref,
  backLabel = "Indietro",
  action,
  variant = "customer",
}: PortalPageHeaderProps) {
  const backColor = variant === "admin" ? "hover:text-amber-300" : "hover:text-emerald-400";

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        {backHref && (
          <Link href={backHref} className={cn("text-sm text-zinc-500 transition-colors", backColor)}>
            ← {backLabel}
          </Link>
        )}
        <h1 className={cn("font-display text-2xl md:text-3xl font-semibold text-zinc-50", backHref && "mt-2")}>
          {title}
        </h1>
        {description && <p className="text-zinc-500 text-sm mt-1.5">{description}</p>}
      </div>
      {action}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  variant?: "customer" | "admin";
}

export function StatCard({ label, value, icon: Icon, href, variant = "customer" }: StatCardProps) {
  const accent = variant === "admin" ? "amber" : "emerald";
  const content = (
    <div
      className={cn(
        "rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition-all duration-300 h-full",
        href && (accent === "amber" ? "hover:border-amber-500/25 hover:from-amber-500/[0.06]" : "hover:border-emerald-500/25 hover:from-emerald-500/[0.06]")
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">{label}</p>
          <p className="font-display text-3xl font-semibold text-zinc-100 mt-1">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl border",
            accent === "amber"
              ? "bg-amber-500/10 border-amber-500/15"
              : "bg-emerald-500/10 border-emerald-500/15"
          )}
        >
          <Icon className={cn("h-5 w-5", accent === "amber" ? "text-amber-400/80" : "text-emerald-400/80")} />
        </div>
      </div>
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-16 px-6 text-center">
      <p className="font-display text-lg text-zinc-300">{title}</p>
      {description && <p className="text-sm text-zinc-500 mt-2 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
