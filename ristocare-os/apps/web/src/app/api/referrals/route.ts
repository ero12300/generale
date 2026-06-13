import { repository } from "@/lib/data/repository";
import { referralFormSchema } from "@/lib/validations/api";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function GET() {
  return jsonOk(repository.listReferrals());
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = referralFormSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.errors[0]?.message ?? "Dati non validi");

  const referral = repository.createReferral({
    partner_name: parsed.data.partner_name,
    partner_type: parsed.data.partner_type,
    phone: parsed.data.phone,
    email: parsed.data.email,
    referred_company: parsed.data.referred_company,
    referred_contact: parsed.data.referred_contact ?? null,
  });
  return jsonOk(referral, 201);
}
