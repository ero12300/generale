import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RevenuePanel } from "@/components/dashboard/revenue-panel";

export default function RevenuePage() {
  return (
    <DashboardShell>
      <RevenuePanel />
    </DashboardShell>
  );
}
