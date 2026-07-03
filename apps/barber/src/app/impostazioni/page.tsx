import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SettingsPage } from "@/components/settings/settings-page";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell>
      <Suspense fallback={null}>
        <SettingsPage />
      </Suspense>
    </AppShell>
  );
}
