import { NextResponse } from "next/server";
import { z } from "zod";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function validationError(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFoundError(message = "Risorsa non trovata") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function unauthorizedError(message = "Non autorizzato") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function parseBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(body);
  if (!result.success) {
    const first = result.error.issues[0];
    return { success: false, error: first?.message ?? "Dati non validi" };
  }
  return { success: true, data: result.data };
}
