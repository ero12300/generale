import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function handleRouteError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    const first = error.errors[0];
    return jsonError(
      `Dati non validi: ${first?.path.join(".") ?? ""} ${first?.message ?? ""}`.trim(),
      400,
    );
  }
  console.error("[api] errore imprevisto", error);
  return jsonError("Errore interno, riprova tra poco.", 500);
}
