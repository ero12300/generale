import { NextResponse } from "next/server";
import { getBarberRepository } from "@/lib/barber";
import type { BarberRepository } from "@/lib/barber/repository";
import { UnauthorizedError } from "@/lib/data";

export async function withBarberRepository(
  handler: (repo: BarberRepository) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const repo = await getBarberRepository();
    return await handler(repo);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Errore interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
