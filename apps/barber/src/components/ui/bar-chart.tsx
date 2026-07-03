import { formatCurrencyShort } from "@/lib/utils";

interface BarChartProps {
  data: { label: string; amount: number }[];
}

export function BarChart({ data }: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.amount));
  return (
    <div className="flex h-40 items-end gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-[#a9822f] to-[#e3c680] transition-all"
              style={{ height: `${Math.max(4, (d.amount / max) * 100)}%` }}
              title={formatCurrencyShort(d.amount)}
              aria-label={`${d.label}: ${formatCurrencyShort(d.amount)}`}
            />
          </div>
          <span className="text-[10px] text-zinc-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
