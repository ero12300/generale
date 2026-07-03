import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  cta,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  cta?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-14 px-6", className)}>
      {icon ? (
        <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-4 text-[color:var(--color-gold-400)]">
          {icon}
        </div>
      ) : null}
      <h3 className="text-lg font-display text-ink-100">{title}</h3>
      {description ? <p className="text-sm text-ink-400 mt-1.5 max-w-md">{description}</p> : null}
      {cta ? <div className="mt-5">{cta}</div> : null}
    </div>
  );
}
