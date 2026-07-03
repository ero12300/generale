import { AppShell } from "@/components/shell/AppShell";
import { getShop, DEMO_SHOP_ID } from "@/lib/data/repo";
import type { ReactNode } from "react";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const shop = await getShop(DEMO_SHOP_ID);
  return (
    <AppShell shopName={shop?.name ?? "Il mio salone"} plan={shop?.plan ?? "free"}>
      {children}
    </AppShell>
  );
}
