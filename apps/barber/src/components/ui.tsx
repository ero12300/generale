import { clsx } from "clsx";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "rounded-2xl border border-line bg-panel p-6",
        className
      )}
    >
      {children}
    </section>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-lg text-cream tracking-wide mb-4">
      {children}
    </h2>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl text-gold-bright">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "gold",
}: {
  children: ReactNode;
  tone?: "gold" | "green" | "red" | "muted";
}) {
  const tones = {
    gold: "border-gold/40 bg-gold/10 text-gold-bright",
    green: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    red: "border-red-500/40 bg-red-500/10 text-red-300",
    muted: "border-line bg-panel-2 text-muted",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line bg-panel-2 px-3 py-2 text-sm text-cream placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-gold/60";

export const labelClass =
  "block text-xs uppercase tracking-[0.14em] text-muted mb-1.5";

export const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-bright focus:outline-none focus:ring-2 focus:ring-gold-bright disabled:opacity-50 cursor-pointer";

export const buttonGhost =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-cream transition hover:border-gold/50 hover:text-gold-bright focus:outline-none focus:ring-2 focus:ring-gold/60 disabled:opacity-50 cursor-pointer";
