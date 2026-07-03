import { NextResponse } from "next/server";
import { createSubscriptionCheckout } from "@/lib/barber/stripe";
import { validationError } from "@/lib/api-response";
import { parseBody } from "@/lib/validations/api";
import { createBarberCheckoutSchema } from "@/lib/validations/barber";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createBarberCheckoutSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const session = await createSubscriptionCheckout({
    planId: parsed.data.plan_id,
    customerEmail: parsed.data.customer_email,
  });

  return NextResponse.json(session);
}
