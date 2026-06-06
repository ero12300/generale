import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createDealSchema, parseBody } from "@/lib/validation";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(demoStore.listDeals());
  }
  // Supabase path — requires auth session in production
  return NextResponse.json(demoStore.listDeals());
}

export async function POST(request: Request) {
  const { data, error } = await parseBody(request, createDealSchema);
  if (error) return error;

  const deal = demoStore.createDeal({
    title: data.title,
    strategy: data.strategy,
    source_url: data.source_url ?? null,
    stage: data.stage ?? (data.source_url ? "analysis" : "lead"),
    notes: data.notes ?? null,
  });
  return NextResponse.json(deal, { status: 201 });
}
