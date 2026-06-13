"use client";

import { AppShell } from "@/components/layout/app-shell";
import { adminNav } from "@/lib/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      brand="RistoProfit Admin"
      subtitle="Emotive S.r.l."
      nav={adminNav}
      accent="amber"
      demo
    >
      {children}
    </AppShell>
  );
}
