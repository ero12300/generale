import { NextResponse } from "next/server";
import { z } from "zod";
import { advanceTicket } from "@/lib/demo-store";

const advanceSchema = z.object({
  status: z.enum([
    "nuovo",
    "in_verifica",
    "richiesta_informazioni",
    "in_attesa_tecnico",
    "preventivo_ricevuto",
    "preventivo_inviato",
    "accettato",
    "programmato",
    "in_intervento",
    "in_attesa_ricambio",
    "risolto",
    "chiuso",
    "non_coperto_garanzia",
    "contestato",
    "annullato",
  ]),
  note: z.string().min(1, "Nota obbligatoria").max(500),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = advanceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dati non validi", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const ticket = advanceTicket(id, parsed.data.status, parsed.data.note);
  if (!ticket) {
    return NextResponse.json({ error: "Ticket non trovato" }, { status: 404 });
  }
  return NextResponse.json({ ticket });
}
