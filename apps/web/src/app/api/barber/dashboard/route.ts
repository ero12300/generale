import { NextResponse } from "next/server";
import { getBarberRepository } from "@/lib/barber/repository";

export async function GET() {
  const repository = getBarberRepository();
  const data = await repository.getDashboardData();
  return NextResponse.json({ data });
}
