"use client";

import { AppShell } from "@/components/layout/app-shell";
import { customerNav } from "@/lib/navigation";
import { demoStore } from "@/lib/demo-store";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      brand="RistoProfit OS"
      subtitle={demoStore.orgName}
      nav={customerNav}
      accent="emerald"
      demo
    >
      {children}
    </AppShell>
  );
}
