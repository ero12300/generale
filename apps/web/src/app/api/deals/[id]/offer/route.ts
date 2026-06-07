import { NextResponse } from "next/server";
import { withRepository } from "@/lib/api-repository";
import { notFoundError, upstreamError, validationError } from "@/lib/api-response";
import { offerLetterSchema, parseBody } from "@/lib/validations/api";
import { generateOfferLetter } from "@/lib/analytics-client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = parseBody(offerLetterSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  return withRepository(async (repo) => {
    const deal = await repo.getDeal(id);
    const property = await repo.getProperty(id);
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

      const letter = await repo.saveOfferLetter(
        id,
        parsed.data.offered_price ?? (property?.price_asked ?? 0) * 0.92,
        result.commercial_text,
        result.legal_placeholders as Record<string, unknown>[]
      );

      return NextResponse.json({
        ...result,
        letter,
      });
    } catch (err) {
      return upstreamError(err instanceof Error ? err.message : "Generazione proposta non riuscita");
    }
  });
}
