import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthContext } from "@deal-desk/types";
import { createClient } from "@/lib/supabase/server";

export async function getSupabaseClient(): Promise<SupabaseClient> {
  return createClient();
}

export async function ensureUserOrganization(
  supabase: SupabaseClient,
  userId: string,
  defaultOrgName = "Il mio barber shop"
): Promise<{ organizationId: string; organizationName: string }> {
  const { data: membership, error: memberError } = await supabase
    .from("organization_members")
    .select("organization_id")
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
    };
  }

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({ name: defaultOrgName })
    .select("id, name")
    .single();

  if (orgError) throw orgError;

  const { error: linkError } = await supabase.from("organization_members").insert({
    organization_id: org.id,
    user_id: userId,
    role: "owner",
  });
  if (linkError) throw linkError;

  const { error: taxError } = await supabase.from("tax_profiles").insert({
    organization_id: org.id,
    name: "Profilo barber default",
    is_default: true,
  });
  if (taxError) throw taxError;

  return { organizationId: org.id, organizationName: org.name };
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = await getSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { organizationId, organizationName } = await ensureUserOrganization(supabase, user.id);

  return {
    mode: "supabase",
    userId: user.id,
    email: user.email ?? null,
    organizationId,
    organizationName,
  };
}

export async function requireAuthContext(): Promise<AuthContext> {
  const context = await getAuthContext();
  if (!context) {
    throw new Error("UNAUTHORIZED");
  }
  return context;
}
