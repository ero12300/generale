import { NextResponse } from "next/server";
import { withBarberRepository } from "@/lib/barber/api-repository";

export async function GET() {
  return withBarberRepository(async (repo) => {
    const services = await repo.listServices();
    return NextResponse.json(services);
  });
}
