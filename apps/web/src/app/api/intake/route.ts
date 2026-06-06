import { NextResponse } from "next/server";
import { validationError } from "@/lib/api-response";
import { intakeSchema, parseBody } from "@/lib/validations/api";

const INTAKE_URL =
  process.env.INTAKE_API_URL ?? process.env.NEXT_PUBLIC_INTAKE_API_URL ?? "http://localhost:8001";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(intakeSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const res = await fetch(`${INTAKE_URL}/v1/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: parsed.data.url }),
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Servizio intake non disponibile: ${text}`, fallback: true },
        { status: 502 }
      );
    }
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({
      source_url: parsed.data.url,
      price_asked: null,
      surface_sqm: null,
      address: null,
      description: "Servizio intake non disponibile. Inserisci i dati manualmente.",
      extraction_method: "manual_fallback",
      raw_fields: { notice: "Avvia il servizio intake su porta 8001" },
    });
  }
}
