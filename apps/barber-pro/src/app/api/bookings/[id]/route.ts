import { NextResponse } from "next/server";
import { z } from "zod";
import { createPayment, getBooking, updateBooking } from "@/lib/data/repo";

const patchSchema = z.object({
  status: z.enum(["confirmed", "completed", "cancelled", "no_show"]).optional(),
  notes: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = patchSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  const existing = await getBooking(id);
  if (!existing) return NextResponse.json({ error: "Non trovata" }, { status: 404 });
  const updated = await updateBooking(id, body.data);
  // Se passa a completed, registra automaticamente un pagamento (metodo "cash" default, l'utente può poi modificarlo)
  if (body.data.status === "completed" && existing.status !== "completed" && updated) {
    await createPayment({
      shopId: existing.shopId,
      bookingId: existing.id,
      clientId: existing.clientId,
      amountCents: existing.priceCents - (existing.discountCents ?? 0),
      method: "cash",
      createdAt: new Date().toISOString(),
    });
  }
  return NextResponse.json({ booking: updated });
}
