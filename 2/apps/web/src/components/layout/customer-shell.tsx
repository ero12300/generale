"use client";

import { AppShell } from "@/components/layout/app-shell";
import { customerNav } from "@/lib/navigation";

interface CustomerShellProps {
  children: React.ReactNode;
  orgName: string;
  demo: boolean;
}

export function CustomerShell({ children, orgName, demo }: CustomerShellProps) {
  return (
    <AppShell
      brand="RistoProfit OS"
      subtitle={orgName}
      nav={customerNav}
      accent="emerald"
      demo={demo}
    >
      {children}
    </AppShell>
  );
}
