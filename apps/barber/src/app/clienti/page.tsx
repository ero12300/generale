import { AppShell } from "@/components/layout/app-shell";
import { ClientsPage } from "@/components/clients/clients-page";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell>
      <ClientsPage />
    </AppShell>
  );
}
