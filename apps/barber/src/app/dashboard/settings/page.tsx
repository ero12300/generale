import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SettingsPanel } from "@/components/dashboard/settings-panel";

export default function SettingsPage() {
  return (
    <DashboardShell>
      <SettingsPanel />
    </DashboardShell>
  );
}
