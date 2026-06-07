import { NextResponse } from "next/server";
import { withRepository } from "@/lib/api-repository";
import { notFoundError, validationError } from "@/lib/api-response";
import { parseBody, updateDealSchema } from "@/lib/validations/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withRepository(async (repo) => {
    const detail = await repo.getDealDetail(id);
    if (!detail) return notFoundError("Deal non trovato");
    return NextResponse.json({
      deal: detail.deal,
      property: detail.property,
      analysis: detail.analysis,
      workItems: detail.workItems,
      offerLetter: detail.offerLetter,
    });
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = parseBody(updateDealSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  return withRepository(async (repo) => {
    const deal = await repo.updateDeal(id, parsed.data);
    if (!deal) return notFoundError("Deal non trovato");
    return NextResponse.json(deal);
  });
}
