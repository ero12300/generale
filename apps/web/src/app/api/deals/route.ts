import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";
import { validationError } from "@/lib/api-response";
import { createDealSchema, parseBody } from "@/lib/validations/api";

export async function GET() {
  return NextResponse.json(demoStore.listDeals());
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createDealSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const deal = demoStore.createDeal({
    title: parsed.data.title,
    strategy: parsed.data.strategy,
    source_url: parsed.data.source_url ?? null,
    stage: parsed.data.source_url ? "analysis" : "lead",
    notes: parsed.data.notes ?? null,
  });
  return NextResponse.json(deal, { status: 201 });
}
