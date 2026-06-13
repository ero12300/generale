"use client";

import { AppShell } from "@/components/layout/app-shell";
import { referralNav } from "@/lib/navigation";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      brand="Portale Referral"
      subtitle="Partner Emotive"
      nav={referralNav}
      accent="emerald"
      demo
    >
      {children}
    </AppShell>
  );
}
