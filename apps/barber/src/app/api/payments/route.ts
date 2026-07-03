import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { todayISO } from "@/lib/dates";
import { handleRouteError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const store = await getStore();
    const payments = await store.listPayments();
    return NextResponse.json({ payments: payments.slice(0, 100) });
  } catch (error) {
    return handleRouteError(error);
  }
}

const paymentSchema = z.object({
  clientName: z.string().min(1).max(80),
  serviceName: z.string().min(1).max(80),
  /** Importo in centesimi, sempre intero */
  amountCents: z.number().int().positive().max(100_000_00),
  method: z.enum(["contanti", "carta", "satispay"]),
});

export async function POST(request: NextRequest) {
  try {
    const input = paymentSchema.parse(await request.json());
    const store = await getStore();
    const payment = await store.createPayment({
      ...input,
      date: todayISO(),
    });
    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
