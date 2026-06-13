"use client";

import { AppShell } from "@/components/layout/app-shell";
import { salesNav } from "@/lib/navigation";

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      brand="Area Venditori"
      subtitle="Emotive Sales"
      nav={salesNav}
      accent="blue"
      demo
    >
      {children}
    </AppShell>
  );
}
