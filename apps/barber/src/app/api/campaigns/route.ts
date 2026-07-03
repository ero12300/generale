import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { planHasCapability } from "@/lib/plans";
import { handleRouteError, jsonError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const store = await getStore();
    const [campaigns, settings] = await Promise.all([
      store.listCampaigns(),
      store.getSettings(),
    ]);
    return NextResponse.json({
      campaigns,
      locked: !planHasCapability(settings.plan, "campagne"),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

const campaignSchema = z.object({
  type: z.enum(["sconto", "referral"]),
  name: z.string().min(2).max(60),
  code: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[A-Za-z0-9-]+$/, "solo lettere, numeri e trattini"),
  percentOff: z.number().int().min(1).max(100),
  validUntil: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const input = campaignSchema.parse(await request.json());
    const store = await getStore();

    const settings = await store.getSettings();
    if (!planHasCapability(settings.plan, "campagne")) {
      return jsonError("Le campagne richiedono il piano Pro.", 403);
    }

    const existing = await store.findActiveCampaignByCode(input.code);
    if (existing) return jsonError("Esiste già una campagna con questo codice.", 409);

    const campaign = await store.createCampaign({ ...input, active: true });
    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

const patchSchema = z.object({
  id: z.string().min(1),
  active: z.boolean(),
});

export async function PATCH(request: NextRequest) {
  try {
    const input = patchSchema.parse(await request.json());
    const store = await getStore();
    const campaign = await store.updateCampaign(input.id, {
      active: input.active,
    });
    if (!campaign) return jsonError("Campagna non trovata", 404);
    return NextResponse.json({ campaign });
  } catch (error) {
    return handleRouteError(error);
  }
}
