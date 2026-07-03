import { NextResponse } from "next/server";
import { getBarberDashboard } from "@/lib/barber/repository";

export async function GET() {
  const dashboard = await getBarberDashboard();
  return NextResponse.json(dashboard);
}
