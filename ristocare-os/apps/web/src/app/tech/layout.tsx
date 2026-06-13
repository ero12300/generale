import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function TechLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session.role !== "technician") redirect("/login");
  return <>{children}</>;
}
