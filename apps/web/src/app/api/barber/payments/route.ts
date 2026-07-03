import { NextResponse } from "next/server";
import { withBarberRepository } from "@/lib/barber/api-repository";
import { validationError } from "@/lib/api-response";
import { parseBody } from "@/lib/validations/api";
import { createBarberPaymentSchema } from "@/lib/validations/barber";

export async function GET() {
  return withBarberRepository(async (repo) => {
    const payments = await repo.listPayments();
    return NextResponse.json(payments);
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createBarberPaymentSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  return withBarberRepository(async (repo) => {
    const payment = await repo.createPayment(parsed.data);
    return NextResponse.json(payment, { status: 201 });
  });
}
