import { AppShell } from "@/components/layout/app-shell";
import { TransactionsPage } from "@/components/transactions/transactions-page";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell>
      <TransactionsPage />
    </AppShell>
  );
}
