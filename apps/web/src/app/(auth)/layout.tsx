import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    redirect("/dashboard");
  }
  return <>{children}</>;
}
