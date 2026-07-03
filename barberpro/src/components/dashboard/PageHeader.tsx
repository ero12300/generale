import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl text-cream sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-cream/50">{subtitle}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 gap-2">{action}</div> : null}
    </div>
  );
}
