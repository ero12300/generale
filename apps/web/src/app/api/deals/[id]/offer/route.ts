import { NextResponse } from "next/server";
import { generateOfferLetter } from "@/lib/analytics-client";
import { demoStore } from "@/lib/demo-store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const deal = demoStore.getDeal(id);
  const property = demoStore.getProperty(id);
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const result = await generateOfferLetter({
      property_address: property?.address ?? deal.title,
      offered_price: body.offered_price ?? (property?.price_asked ?? 0) * 0.92,
      asking_price: property?.price_asked ?? body.asking_price ?? 0,
      strategy: deal.strategy,
      key_points: body.key_points ?? [],
      closing_days: body.closing_days ?? 60,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Offer generation failed" },
      { status: 502 }
    );
  }
}
