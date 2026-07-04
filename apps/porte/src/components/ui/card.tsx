import * as React from "react";
import { cn } from "./cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card", className)} {...props} />;
}

export function SectionTitle({
  icon,
  children,
  hint,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      {icon ? (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
          {icon}
        </span>
      ) : null}
      <div>
        <h2 className="text-base font-semibold leading-tight">{children}</h2>
        {hint ? (
          <p className="mt-0.5 text-sm text-[var(--color-muted)]">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
