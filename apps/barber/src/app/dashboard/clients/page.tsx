import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ClientsPanel } from "@/components/dashboard/clients-panel";

export default function ClientsPage() {
  return (
    <DashboardShell>
      <ClientsPanel />
    </DashboardShell>
  );
}
