import { store } from "@/lib/store";
import { ok, parseBody, validationError } from "@/lib/api-response";
import { createClientSchema } from "@/lib/validations";

export async function GET() {
  return ok(store.listClients());
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createClientSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const { client, error } = store.createClient({
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    notes: parsed.data.notes || null,
    referredByCode: parsed.data.referredByCode || null,
  });
  if (error) return validationError(error);
  return ok(client, 201);
}
