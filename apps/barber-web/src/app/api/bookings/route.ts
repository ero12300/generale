import { NextResponse } from "next/server";
import { bookingRequestSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bookingRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Dati prenotazione non validi",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    bookingId: `demo-${Date.now()}`,
    mode: "demo",
    message: "Richiesta ricevuta. In produzione viene salvata su Firebase Firestore.",
  });
}
