import { DashboardShell } from "@/components/layout/dashboard-shell";
import { BookingsPanel } from "@/components/dashboard/bookings-panel";

export default function BookingsPage() {
  return (
    <DashboardShell>
      <BookingsPanel />
    </DashboardShell>
  );
}
