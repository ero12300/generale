import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass rounded-2xl p-10 text-center", className)}>
      {icon && (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full gold-border text-[color:var(--color-gold-300)]">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg text-white">{title}</h3>
      {description && <p className="mx-auto mt-1 max-w-md text-sm text-white/60">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
