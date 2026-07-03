import { NextResponse } from "next/server";
import { z } from "zod";
import { createPayment, listPayments, DEMO_SHOP_ID } from "@/lib/data/repo";

export async function GET() {
  const payments = await listPayments();
  return NextResponse.json({ payments });
}

const bodySchema = z.object({
  amountCents: z.number().int().positive(),
  method: z.enum(["cash", "card", "transfer", "other"]),
  clientId: z.string().optional(),
  bookingId: z.string().optional(),
  note: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const created = await createPayment({
    shopId: DEMO_SHOP_ID,
    amountCents: parsed.data.amountCents,
    method: parsed.data.method,
    clientId: parsed.data.clientId,
    bookingId: parsed.data.bookingId,
    note: parsed.data.note,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ payment: created }, { status: 201 });
}
