import { NextResponse } from "next/server";

const INTAKE_URL =
  process.env.INTAKE_API_URL ?? process.env.NEXT_PUBLIC_INTAKE_API_URL ?? "http://localhost:8001";

function manualFallback(url: string, notice: string) {
  return {
    source_url: url,
    price_asked: null,
    surface_sqm: null,
    address: null,
    description: "Servizio intake non disponibile. Inserisci i dati manualmente.",
    extraction_method: "manual_fallback" as const,
    raw_fields: { notice },
  };
}

function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body JSON non valido" },
      { status: 400 },
    );
  }
  const url = (body as { url?: unknown })?.url;
  if (typeof url !== "string" || !url.trim()) {
    return NextResponse.json({ error: "URL richiesto" }, { status: 400 });
  }
  if (!isValidHttpUrl(url)) {
    return NextResponse.json(
      { error: "Inserisci un URL http(s) valido" },
      { status: 400 },
    );
  }

  try {
    // Timeout esplicito: evita di bloccare la UI se il servizio è lento.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45_000);
    const res = await fetch(`${INTAKE_URL}/v1/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      // Servizio raggiunto ma estrazione fallita → fallback manuale (200)
      // così la UI può proseguire con inserimento dati a mano.
      return NextResponse.json(
        manualFallback(
          url,
          `Estrazione non riuscita (HTTP ${res.status}). Inserisci i dati manualmente.`,
        ),
      );
    }
    return NextResponse.json(await res.json());
  } catch (err) {
    const reason =
      err instanceof Error && err.name === "AbortError"
        ? "Estrazione interrotta per timeout. Riprova o inserisci i dati a mano."
        : "Servizio intake non raggiungibile sulla porta 8001.";
    return NextResponse.json(manualFallback(url, reason));
  }
}
