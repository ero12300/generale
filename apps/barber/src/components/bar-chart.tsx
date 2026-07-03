import { formatEuro } from "@/lib/money";

interface BarChartProps {
  data: { label: string; amountCents: number }[];
  title: string;
}

/** Grafico a barre SVG-free (solo div), senza dipendenze esterne. */
export function BarChart({ data, title }: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.amountCents));
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
        {title}
      </h3>
      <div className="flex items-end gap-1.5 h-40" role="img" aria-label={title}>
        {data.map((d) => {
          const pct = Math.max(3, Math.round((d.amountCents / max) * 100));
          return (
            <div
              key={d.label}
              className="flex-1 flex flex-col items-center gap-1.5 group min-w-0"
            >
              <span className="text-[10px] text-gold-soft opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {formatEuro(d.amountCents)}
              </span>
              <div
                className="w-full rounded-t-sm bg-gradient-to-t from-gold-dim to-gold transition-all group-hover:from-gold group-hover:to-gold-soft"
                style={{ height: `${pct}%` }}
                title={`${d.label}: ${formatEuro(d.amountCents)}`}
              />
              <span className="text-[10px] text-muted truncate w-full text-center">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
