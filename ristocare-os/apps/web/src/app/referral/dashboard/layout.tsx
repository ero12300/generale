import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function ReferralDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session.role !== "referral_partner") redirect("/login");
  return <>{children}</>;
}
