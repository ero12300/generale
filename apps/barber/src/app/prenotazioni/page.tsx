import { AppShell } from "@/components/layout/app-shell";
import { BookingsPage } from "@/components/bookings/bookings-page";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell>
      <BookingsPage />
    </AppShell>
  );
}
