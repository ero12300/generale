import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export interface AuthContext {
  mode: "supabase" | "demo";
  userId: string;
  email: string | null;
  organizationId: string;
  organizationName: string;
  locationId: string | null;
  role: string;
}

export async function getSupabaseClient(): Promise<SupabaseClient> {
  return createClient();
}

export async function ensureProfitOrganization(
  supabase: SupabaseClient,
  userId: string,
  defaultOrgName = "Il mio ristorante"
): Promise<{ organizationId: string; organizationName: string; locationId: string | null }> {
  const { data: membership, error: memberError } = await supabase
    .from("memberships")
    .select("organization_id, location_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (memberError) throw memberError;

  if (membership?.organization_id) {
    const { data: org, error: orgReadError } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", membership.organization_id)
      .single();
    if (orgReadError) throw orgReadError;
    return {
      organizationId: membership.organization_id,
      organizationName: org.name,
      locationId: membership.location_id,
    };
  }

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({
      name: defaultOrgName,
      status: "trial",
      plan: "start",
    })
    .select("id, name")
    .single();

  if (orgError) throw orgError;

  const { data: location, error: locError } = await supabase
    .from("locations")
    .insert({
      organization_id: org.id,
      name: "Sede principale",
      city: "Messina",
      province: "ME",
    })
    .select("id")
    .single();

  if (locError) throw locError;

  const { error: linkError } = await supabase.from("memberships").insert({
    organization_id: org.id,
    user_id: userId,
    role: "customer_admin",
    location_id: location.id,
  });
  if (linkError) throw linkError;

  const { data: proPlan } = await supabase
    .schema("profit")
    .from("plans")
    .select("id")
    .eq("tier", "pro")
    .single();

  if (proPlan?.id) {
    await supabase.schema("profit").from("subscriptions").insert({
      organization_id: org.id,
      plan_id: proPlan.id,
      status: "trial",
    });
  }

  return { organizationId: org.id, organizationName: org.name, locationId: location.id };
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = await getSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const orgName =
    (user.user_metadata?.org_name as string | undefined) ?? "Il mio ristorante";

  const { organizationId, organizationName, locationId } = await ensureProfitOrganization(
    supabase,
    user.id,
    orgName
  );

  const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .eq("organization_id", organizationId)
    .maybeSingle();

  return {
    mode: "supabase",
    userId: user.id,
    email: user.email ?? null,
    organizationId,
    organizationName,
    locationId,
    role: membership?.role ?? "customer_admin",
  };
}

export async function requireAuthContext(): Promise<AuthContext> {
  const context = await getAuthContext();
  if (!context) throw new Error("UNAUTHORIZED");
  return context;
}
