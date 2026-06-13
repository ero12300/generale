import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demoStore";
import { ticketCreateSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = ticketCreateSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Dati non validi";
    return NextResponse.json({ error: message }, { status: 422 });
  }

  const equipment = demoStore.getEquipment(parsed.data.equipmentId);
  if (!equipment) {
    return NextResponse.json({ error: "Attrezzatura non trovata" }, { status: 404 });
  }

  const ticket = demoStore.createTicket(parsed.data);
  return NextResponse.json({ ticket }, { status: 201 });
}

export async function GET() {
  return NextResponse.json({ tickets: demoStore.listTickets() });
}
