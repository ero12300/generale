import { store } from "@/lib/store";
import { notFoundError, ok } from "@/lib/api-response";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const campaign = store.toggleCampaign(id);
  if (!campaign) return notFoundError("Campagna non trovata");
  return ok(campaign);
}
