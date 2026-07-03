"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { RevenuePoint } from "@/lib/analytics";
import { formatCents } from "@/lib/format";

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const chartData = data.map((p) => ({ ...p, euro: p.net / 100 }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a227" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#c9a227" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#26262c" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "#8a8a92", fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "#26262c" }}
          minTickGap={24}
        />
        <YAxis
          tick={{ fill: "#8a8a92", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(v: number) => `€${v}`}
        />
        <Tooltip
          contentStyle={{
            background: "#16161a",
            border: "1px solid #26262c",
            borderRadius: 12,
            color: "#f5f1e6",
          }}
          labelStyle={{ color: "#e4c76a" }}
          formatter={(value: number) => [formatCents(Math.round(value * 100)), "Incasso"]}
        />
        <Area
          type="monotone"
          dataKey="euro"
          stroke="#e4c76a"
          strokeWidth={2}
          fill="url(#goldFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
