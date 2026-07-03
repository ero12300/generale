import { AppShell } from "@/components/layout/app-shell";
import { CampaignsPage } from "@/components/campaigns/campaigns-page";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell>
      <CampaignsPage />
    </AppShell>
  );
}
