import { repository } from "@/lib/data/repository";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quotes = repository.listQuotes();
  const draft = quotes.find((q) => q.id === id) ?? quotes.find((q) => q.status === "draft");
  if (!draft) return jsonError("Preventivo non trovato", 404);
  const sent = repository.sendQuote(draft.id);
  return jsonOk(sent);
}
