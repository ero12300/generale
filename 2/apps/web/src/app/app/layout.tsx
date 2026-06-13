import { getAuthContext } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/utils";
import { demoStore } from "@/lib/demo-store";
import { CustomerShell } from "@/components/layout/customer-shell";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const auth = isSupabaseConfigured() ? await getAuthContext() : null;

  return (
    <CustomerShell
      orgName={auth?.organizationName ?? demoStore.orgName}
      demo={!auth}
    >
      {children}
    </CustomerShell>
  );
}
