import { NextResponse } from "next/server";
import { generateOfferLetter } from "@/lib/analytics-client";
import { demoStore } from "@/lib/demo-store";
import { notFoundError, upstreamError, validationError } from "@/lib/api-response";
import { offerLetterSchema, parseBody } from "@/lib/validations/api";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = parseBody(offerLetterSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const deal = demoStore.getDeal(id);
  const property = demoStore.getProperty(id);
  if (!deal) return notFoundError("Deal non trovato");

  try {
    const result = await generateOfferLetter({
      property_address: property?.address ?? deal.title,
      offered_price: parsed.data.offered_price ?? (property?.price_asked ?? 0) * 0.92,
      asking_price: property?.price_asked ?? parsed.data.asking_price ?? 0,
      strategy: deal.strategy,
      key_points: parsed.data.key_points ?? [],
      closing_days: parsed.data.closing_days ?? 60,
    });
    return NextResponse.json(result);
  } catch (err) {
    return upstreamError(err instanceof Error ? err.message : "Generazione proposta non riuscita");
  }
}
