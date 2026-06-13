import { NextResponse } from "next/server";
import { createTicket, getTickets } from "@/lib/demo-store";
import { createTicketSchema } from "@/lib/validations";

export function GET() {
  return NextResponse.json({ tickets: getTickets() });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = createTicketSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dati non validi", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  try {
    const ticket = createTicket(parsed.data);
    return NextResponse.json({ ticket }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore interno";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
