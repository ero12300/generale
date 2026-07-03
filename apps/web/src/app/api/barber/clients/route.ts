import { NextResponse } from "next/server";
import { validationError } from "@/lib/api-response";
import { getBarberRepository } from "@/lib/barber/repository";
import { createBarberCustomerSchema, parseBody } from "@/lib/validations/api";

export async function GET() {
  const repo = await getBarberRepository();
  return NextResponse.json(await repo.listCustomers());
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createBarberCustomerSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const repo = await getBarberRepository();
  const customer = await repo.createCustomer(parsed.data);
  return NextResponse.json(customer, { status: 201 });
}
