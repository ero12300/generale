import { store } from "@/lib/store";
import { ok, parseBody, validationError } from "@/lib/api-response";
import { createRevenueSchema } from "@/lib/validations";

export async function GET() {
  return ok({
    entries: store.listRevenue(),
    summary: store.revenueSummary(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createRevenueSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const entry = store.createRevenue({
    amount: parsed.data.amount,
    method: parsed.data.method,
    serviceName: parsed.data.serviceName || null,
    clientId: parsed.data.clientId || null,
    note: parsed.data.note || null,
  });
  return ok(entry, 201);
}
