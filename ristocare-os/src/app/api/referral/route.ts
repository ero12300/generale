import { NextResponse } from "next/server";
import { createReferral } from "@/lib/demo-store";
import { createReferralSchema } from "@/lib/validations";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = createReferralSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dati non validi", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const referral = createReferral(parsed.data);
  return NextResponse.json({ referral }, { status: 201 });
}
