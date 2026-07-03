import { AppShell } from "@/components/layout/app-shell";
import { getAuthContext } from "@/lib/auth/session";
import { BARBER_DEMO_ORG_NAME } from "@/lib/barber/demo-data";
import { isDemoMode } from "@/lib/data";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let mode: "demo" | "supabase" = "demo";
  let orgName = BARBER_DEMO_ORG_NAME;
  let email: string | null = null;

  if (!isDemoMode()) {
    const context = await getAuthContext();
    if (context) {
      mode = "supabase";
      orgName = context.organizationName;
      email = context.email;
    }
  }

  return (
    <AppShell mode={mode} orgName={orgName} email={email}>
      {children}
    </AppShell>
  );
}
