import { NextResponse } from "next/server";
import { ensureUserOrganization, getSupabaseClient } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { validationError } from "@/lib/api-response";
import { parseBody } from "@/lib/validations/api";
import { z } from "zod";

const onboardingSchema = z.object({
  orgName: z.string().trim().min(2, "Nome organizzazione troppo corto").max(120),
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const body = await request.json();
  const parsed = parseBody(onboardingSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const supabase = await getSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const { organizationId, organizationName } = await ensureUserOrganization(
    supabase,
    user.id,
    parsed.data.orgName
  );

  return NextResponse.json({
    organizationId,
    organizationName,
  });
}
