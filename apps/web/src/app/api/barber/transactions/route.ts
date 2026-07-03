import { NextResponse } from "next/server";
import { createBarberTransaction, getBarberDashboard } from "@/lib/barber/repository";
import { validationError } from "@/lib/api-response";
import { parseBody } from "@/lib/validations/api";
import { createBarberTransactionSchema } from "@/lib/validations/barber";

export async function GET() {
  const dashboard = await getBarberDashboard();
  return NextResponse.json({ transactions: dashboard.transactions });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createBarberTransactionSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const transaction = await createBarberTransaction(parsed.data);
  return NextResponse.json({ transaction }, { status: 201 });
}
