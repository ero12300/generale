import { clsx } from "clsx";
import type { ReactNode } from "react";

export function Kpi({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "good" | "warn" | "bad" | "gold";
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-warmgray">
        {label}
      </p>
      <p
        className={clsx("mt-1 text-2xl font-semibold tabular-nums", {
          "text-ink": tone === "neutral",
          "text-profit": tone === "good",
          "text-amber-600": tone === "warn",
          "text-red-600": tone === "bad",
          "text-gold": tone === "gold",
        })}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-warmgray">{hint}</p> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "good" | "warn" | "bad" | "gold";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-stone-100 text-stone-700": tone === "neutral",
          "bg-profit-soft text-green-800": tone === "good",
          "bg-amber-100 text-amber-800": tone === "warn",
          "bg-red-100 text-red-800": tone === "bad",
          "bg-gold-soft text-yellow-900": tone === "gold",
        },
      )}
    >
      {children}
    </span>
  );
}

export function statusTone(
  status: string,
): "neutral" | "good" | "warn" | "bad" | "gold" {
  switch (status) {
    case "ottimo":
    case "ok":
    case "attivo":
    case "verificata":
    case "Chiuso vinto":
    case "Premio pagato":
      return "good";
    case "attenzione":
    case "in_prova":
    case "da_verificare":
    case "setup":
    case "Demo fissata":
    case "In trattativa":
    case "Preventivo inviato":
      return "warn";
    case "critico":
    case "scaduto":
    case "Chiuso perso":
    case "Non valido":
      return "bad";
    case "buono":
    case "Premio maturato":
      return "gold";
    default:
      return "neutral";
  }
}

export function Section({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          {description ? (
            <p className="text-sm text-warmgray">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-stone-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Table({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50 text-left">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-warmgray"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">{children}</tbody>
      </table>
    </div>
  );
}
