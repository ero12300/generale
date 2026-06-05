import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(demoStore.listDeals());
  }
  // Supabase path — requires auth session in production
  return NextResponse.json(demoStore.listDeals());
}

export async function POST(request: Request) {
  const body = await request.json();
  const deal = demoStore.createDeal({
    title: body.title,
    strategy: body.strategy,
    source_url: body.source_url,
    stage: body.source_url ? "analysis" : "lead",
    notes: body.notes,
  });
  return NextResponse.json(deal, { status: 201 });
}
