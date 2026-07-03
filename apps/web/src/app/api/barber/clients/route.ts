import { NextResponse } from "next/server";
import { withBarberRepository } from "@/lib/barber/api-repository";
import { validationError } from "@/lib/api-response";
import { parseBody } from "@/lib/validations/api";
import { createBarberClientSchema } from "@/lib/validations/barber";

export async function GET() {
  return withBarberRepository(async (repo) => {
    const clients = await repo.listClients();
    return NextResponse.json(clients);
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(createBarberClientSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  return withBarberRepository(async (repo) => {
    const client = await repo.createClient(parsed.data);
    return NextResponse.json(client, { status: 201 });
  });
}
