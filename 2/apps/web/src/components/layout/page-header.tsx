import { cn } from "@/lib/utils";

type Accent = "emerald" | "amber" | "blue";

const eyebrowClass: Record<Accent, string> = {
  emerald: "text-emerald-700",
  amber: "text-amber-700",
  blue: "text-blue-700",
};

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: React.ReactNode;
  accent?: Accent;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  accent = "emerald",
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-up",
        className
      )}
    >
      <div>
        {eyebrow && (
          <p
            className={cn(
              "text-xs uppercase tracking-widest font-medium mb-2",
              eyebrowClass[accent]
            )}
          >
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-stone-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-8 max-w-6xl", className)}>{children}</div>;
}
