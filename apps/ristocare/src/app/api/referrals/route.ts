import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demoStore";
import { referralCreateSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = referralCreateSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Dati non validi";
    return NextResponse.json({ error: message }, { status: 422 });
  }

  const { partnerName, partnerType, referredCompany, referredContact, city } = parsed.data;
  const referral = demoStore.createReferral({
    partnerName,
    partnerType,
    referredCompany,
    referredContact,
    city,
  });
  return NextResponse.json({ referral }, { status: 201 });
}
