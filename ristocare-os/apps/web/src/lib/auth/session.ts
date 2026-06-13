import { cookies } from "next/headers";
import type { UserRole } from "@ristocare/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { DemoRepository } from "@/lib/data/demo-repository";
import { SupabaseRepository, type AuthContext } from "@/lib/data/supabase-repository";
import type { DataRepository } from "@/lib/data/repository";
import { mapRole } from "@/lib/data/mappers";

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
const OPERATOR_ROLES: UserRole[] = ["super_admin", "operator"];

export async function getSupabaseClient() {
  const client = await createClient();
  if (!client) throw new Error("Supabase non configurato");
  return client;
}

async function ensureCustomerOrganization(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  email: string | null
) {
  if (!supabase) throw new Error("No supabase");

  const { data: memberships, error: memError } = await supabase
    .from("memberships")
    .select("organization_id, role, organizations(name)")
    .eq("user_id", userId);

  if (memError) throw memError;
  if (memberships && memberships.length > 0) {
    const primary = memberships[0];
    const org = primary.organizations as { name: string } | { name: string }[] | null;
    const orgName = Array.isArray(org) ? org[0]?.name : org?.name;
    return {
      orgId: primary.organization_id as string,
      orgName: orgName ?? null,
      role: mapRole(primary.role as string),
      technicianId: null as string | null,
      isOperator: OPERATOR_ROLES.includes(mapRole(primary.role as string)),
    };
  }

  const orgName = email ? `Locale di ${email.split("@")[0]}` : "Il mio locale";
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({
      name: orgName,
      billing_email: email,
      city: "Messina",
      province: "ME",
      status: "trial",
      plan: "start",
    })
    .select("*")
    .single();
  if (orgError) throw orgError;

  const { data: location, error: locError } = await supabase
    .from("locations")
    .insert({
      organization_id: org.id,
      name: "Sede principale",
      address: "Da completare",
      city: "Messina",
      province: "ME",
    })
    .select("*")
    .single();
  if (locError) throw locError;

  const { error: linkError } = await supabase.from("memberships").insert({
    organization_id: org.id,
    user_id: userId,
    role: "customer_admin",
    location_id: location.id,
  });
  if (linkError) throw linkError;

  return {
    orgId: org.id as string,
    orgName: org.name as string,
    role: "customer_admin" as UserRole,
    technicianId: null,
    isOperator: false,
  };
}

async function resolveSupabaseSession(): Promise<SessionInfo & { auth?: AuthContext }> {
  const supabase = await createClient();
  if (!supabase) return demoSession("customer");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return demoSession("customer");

  const { data: tech } = await supabase
    .from("technicians")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (tech?.id) {
    return {
      mode: "supabase",
      role: "technician",
      email: user.email ?? null,
      orgId: null,
      orgName: null,
      technicianId: tech.id as string,
      auth: {
        mode: "supabase",
        userId: user.id,
        email: user.email ?? null,
        role: "technician",
        orgId: null,
        orgName: null,
        technicianId: tech.id as string,
        isOperator: false,
      },
    };
  }

  const profile = await ensureCustomerOrganization(supabase, user.id, user.email ?? null);

  return {
    mode: "supabase",
    role: profile.role,
    email: user.email ?? null,
    orgId: profile.orgId,
    orgName: profile.orgName,
    technicianId: profile.technicianId,
    auth: {
      mode: "supabase",
      userId: user.id,
      email: user.email ?? null,
      role: profile.role,
      orgId: profile.orgId,
      orgName: profile.orgName,
      technicianId: null,
      isOperator: profile.isOperator,
    },
  };
}

export async function getSession(): Promise<SessionInfo> {
  if (!isSupabaseConfigured()) {
    const cookieStore = await cookies();
    const demoRole = cookieStore.get(DEMO_ROLE_COOKIE)?.value as DemoRole | undefined;
    return demoSession(demoRole ?? "customer");
  }

  const session = await resolveSupabaseSession();
  if (session.mode === "supabase" && session.auth) {
    return session;
  }
  const cookieStore = await cookies();
  const demoRole = cookieStore.get(DEMO_ROLE_COOKIE)?.value as DemoRole | undefined;
  if (demoRole) return demoSession(demoRole);
  return session;
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

export class UnauthorizedError extends Error {
  constructor() {
    super("UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export async function getRepository(): Promise<DataRepository> {
  if (!isSupabaseConfigured()) {
    return new DemoRepository();
  }

  const supabase = await createClient();
  if (!supabase) return new DemoRepository();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const cookieStore = await cookies();
    if (cookieStore.get(DEMO_ROLE_COOKIE)?.value) {
      return new DemoRepository();
    }
    throw new UnauthorizedError();
  }

  const session = await resolveSupabaseSession();
  if (!session.auth) throw new UnauthorizedError();

  return new SupabaseRepository(supabase, session.auth);
}

export async function tryGetRepository(): Promise<DataRepository | null> {
  try {
    return await getRepository();
  } catch (err) {
    if (err instanceof UnauthorizedError) return null;
    throw err;
  }
}

export function isDemoMode(): boolean {
  return !isSupabaseConfigured();
}

export const DEMO_ROLE_COOKIE_NAME = DEMO_ROLE_COOKIE;
