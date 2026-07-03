import { createSession, destroySession } from "@/lib/session";
import { ok, parseBody, validationError } from "@/lib/api-response";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(loginSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const name = parsed.data.name || parsed.data.email.split("@")[0];
  await createSession({ email: parsed.data.email, name });
  return ok({ email: parsed.data.email, name });
}

export async function DELETE() {
  await destroySession();
  return ok({ success: true });
}
