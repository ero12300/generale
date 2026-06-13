import { createClient } from "@/lib/supabase/server";
import { getRepository } from "@/lib/auth/session";
import { mapReferral } from "@/lib/data/mappers";
import { referralFormSchema } from "@/lib/validations/api";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function GET() {
  const repo = await getRepository();
  return jsonOk(await repo.listReferrals());
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = referralFormSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.errors[0]?.message ?? "Dati non validi");

  const payload = {
    partner_name: parsed.data.partner_name,
    partner_type: parsed.data.partner_type,
    phone: parsed.data.phone,
    email: parsed.data.email,
    referred_company: parsed.data.referred_company,
    referred_contact: parsed.data.referred_contact ?? null,
    status: "lead" as const,
    reward_status: "pending" as const,
  };

  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase.from("referrals").insert(payload).select("*").single();
    if (!error && data) return jsonOk(mapReferral(data), 201);
    if (error) return jsonError(error.message, 500);
  }

  const repo = await getRepository();
  const referral = await repo.createReferral({
    partner_name: payload.partner_name,
    partner_type: payload.partner_type,
    phone: payload.phone,
    email: payload.email,
    referred_company: payload.referred_company,
    referred_contact: payload.referred_contact,
  });
  return jsonOk(referral, 201);
}
