import { NextResponse } from "next/server";
import { getDataRepository, UnauthorizedError } from "@/lib/data";
import type { DataRepository } from "@/lib/data/repository";

export async function withRepository(
  handler: (repo: DataRepository) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const repo = await getDataRepository();
    return await handler(repo);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }
    const message = err instanceof Error ? err.message : "Errore interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
