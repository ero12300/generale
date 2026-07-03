import { store } from "@/lib/store";
import { ok, parseBody, validationError } from "@/lib/api-response";
import { createCampaignSchema } from "@/lib/validations";

export async function GET() {
  return ok(store.listCampaigns());
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createCampaignSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const { campaign, error } = store.createCampaign({
    name: parsed.data.name,
    type: parsed.data.type,
    description: parsed.data.description,
    discountPercent: parsed.data.discountPercent,
  });
  if (error) return validationError(error);
  return ok(campaign, 201);
}
