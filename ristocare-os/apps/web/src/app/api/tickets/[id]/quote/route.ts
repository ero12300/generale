import { repository } from "@/lib/data/repository";
import { quoteFormSchema } from "@/lib/validations/api";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = quoteFormSchema.safeParse({ ...body, ticket_id: id });
  if (!parsed.success) return jsonError("Dati preventivo non validi");

  const quote = repository.createQuote({
    ticket_id: id,
    internal_cost: parsed.data.internal_cost,
    margin: parsed.data.margin,
  });
  return jsonOk(quote, 201);
}
