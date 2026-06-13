import { NextResponse } from "next/server";
import { requireAuthContext } from "@/lib/auth/session";
import { getProfitRepository } from "@/lib/data";

export async function GET() {
  try {
    const auth = await requireAuthContext();
    const repo = await getProfitRepository(auth);
    const dashboard = await repo.getCustomerDashboard();
    return NextResponse.json({ data: dashboard });
  } catch {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }
}
