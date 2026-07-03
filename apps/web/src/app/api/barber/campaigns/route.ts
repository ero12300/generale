import { NextResponse } from "next/server";
import { createBarberCampaign, getBarberDashboard } from "@/lib/barber/repository";
import { canCreateCampaign } from "@/lib/barber/monetization";
import { validationError } from "@/lib/api-response";
import { parseBody } from "@/lib/validations/api";
import { createBarberCampaignSchema } from "@/lib/validations/barber";

export async function GET() {
  const dashboard = await getBarberDashboard();
  return NextResponse.json({
    campaigns: dashboard.campaigns,
    tier: dashboard.subscription_tier,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createBarberCampaignSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const dashboard = await getBarberDashboard();
  const activeCampaigns = dashboard.campaigns.filter((campaign) => campaign.enabled).length;
  if (!canCreateCampaign(dashboard.subscription_tier, activeCampaigns)) {
    return NextResponse.json(
      { error: "Nel piano Base puoi avere solo 1 campagna attiva. Passa a Pro per sbloccare." },
      { status: 403 }
    );
  }

  const campaign = await createBarberCampaign(parsed.data);
  return NextResponse.json({ campaign }, { status: 201 });
}
