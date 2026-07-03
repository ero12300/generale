import { NextResponse } from "next/server";
import { withBarberRepository } from "@/lib/barber/api-repository";
import { validationError } from "@/lib/api-response";
import { parseBody } from "@/lib/validations/api";
import { createBarberCampaignSchema } from "@/lib/validations/barber";

export async function GET() {
  return withBarberRepository(async (repo) => {
    const campaigns = await repo.listCampaigns();
    return NextResponse.json(campaigns);
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createBarberCampaignSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  return withBarberRepository(async (repo) => {
    const campaign = await repo.createCampaign(parsed.data);
    return NextResponse.json(campaign, { status: 201 });
  });
}
