import { cookies } from "next/headers";
import type { UserRole } from "@ristocare/types";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export type DemoRole = "customer" | "operator" | "technician" | "referral";

export interface SessionInfo {
  mode: "demo" | "supabase";
  role: UserRole;
  email: string | null;
  orgId: string | null;
  orgName: string | null;
  technicianId: string | null;
}

const DEMO_ROLE_COOKIE = "ristocare_demo_role";

export async function getSession(): Promise<SessionInfo> {
  if (!isSupabaseConfigured()) {
    const cookieStore = await cookies();
    const demoRole = cookieStore.get(DEMO_ROLE_COOKIE)?.value as DemoRole | undefined;
    return demoSession(demoRole ?? "customer");
  }

  // Supabase session — placeholder per integrazione futura
  return demoSession("customer");
}

function demoSession(demoRole: DemoRole): SessionInfo {
  switch (demoRole) {
    case "operator":
      return {
        mode: "demo",
        role: "operator",
        email: "operatore@ristocare.it",
        orgId: null,
        orgName: "RistoCare OS",
        technicianId: null,
      };
    case "technician":
      return {
        mode: "demo",
        role: "technician",
        email: "mario.rossi@tecnico.it",
        orgId: null,
        orgName: null,
        technicianId: "tech-001",
      };
    case "referral":
      return {
        mode: "demo",
        role: "referral_partner",
        email: "partner@referral.it",
        orgId: null,
        orgName: null,
        technicianId: null,
      };
    default:
      return {
        mode: "demo",
        role: "customer_admin",
        email: "gelateria.demo@local.it",
        orgId: "org-demo-001",
        orgName: "Gelateria Demo Messina",
        technicianId: null,
      };
  }
}

export function demoRoleCookieValue(role: DemoRole): string {
  return role;
}

export const DEMO_ROLE_COOKIE_NAME = DEMO_ROLE_COOKIE;
