import { NextResponse } from "next/server";
import { intakeSchema, parseBody } from "@/lib/validation";

const INTAKE_URL =
  process.env.INTAKE_API_URL ?? process.env.NEXT_PUBLIC_INTAKE_API_URL ?? "http://localhost:8001";

export async function POST(request: Request) {
  const { data, error } = await parseBody(request, intakeSchema);
  if (error) return error;
  const { url } = data;

  try {
    const res = await fetch(`${INTAKE_URL}/v1/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Intake service unavailable: ${text}`, fallback: true },
        { status: 502 }
      );
    }
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({
      source_url: url,
      price_asked: null,
      surface_sqm: null,
      address: null,
      description: "Servizio intake non disponibile. Inserisci i dati manualmente.",
      extraction_method: "manual_fallback",
      raw_fields: { notice: "Avvia il servizio intake su porta 8001" },
    });
  }
}
