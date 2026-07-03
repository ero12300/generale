import { DashboardShell } from "@/components/layout/dashboard-shell";
import { CampaignsPanel } from "@/components/dashboard/campaigns-panel";

export default function CampaignsPage() {
  return (
    <DashboardShell>
      <CampaignsPanel />
    </DashboardShell>
  );
}
