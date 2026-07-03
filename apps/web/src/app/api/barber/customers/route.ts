import { NextResponse } from "next/server";
import { getBarberDashboard, createBarberCustomer } from "@/lib/barber/repository";
import { validationError } from "@/lib/api-response";
import { parseBody } from "@/lib/validations/api";
import { createBarberCustomerSchema } from "@/lib/validations/barber";

export async function GET() {
  const dashboard = await getBarberDashboard();
  return NextResponse.json({ customers: dashboard.customers });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createBarberCustomerSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const customer = await createBarberCustomer(parsed.data);
  return NextResponse.json({ customer }, { status: 201 });
}
