import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!["customer_admin", "customer_staff"].includes(session.role)) {
    redirect("/login");
  }
  return <>{children}</>;
}
