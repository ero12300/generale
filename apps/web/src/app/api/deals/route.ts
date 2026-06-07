import { NextResponse } from "next/server";
import { withRepository } from "@/lib/api-repository";
import { validationError } from "@/lib/api-response";
import { createDealSchema, parseBody } from "@/lib/validations/api";

export async function GET() {
  return withRepository(async (repo) => {
    const deals = await repo.listDeals();
    return NextResponse.json(deals);
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createDealSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  return withRepository(async (repo) => {
    const deal = await repo.createDeal({
      title: parsed.data.title,
      strategy: parsed.data.strategy,
      source_url: parsed.data.source_url ?? null,
      stage: parsed.data.source_url ? "analysis" : "lead",
      notes: parsed.data.notes ?? null,
    });
    return NextResponse.json(deal, { status: 201 });
  });
}
