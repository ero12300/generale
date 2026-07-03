import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/session";
import { dataMode } from "@/lib/firebase";
import { store } from "@/lib/store";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const org = store.getOrg();

  return (
    <AppShell
      mode={dataMode()}
      orgName={org.name}
      plan={org.plan}
      email={session.email}
    >
      {children}
    </AppShell>
  );
}
