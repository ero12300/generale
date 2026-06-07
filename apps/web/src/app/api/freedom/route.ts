import { NextResponse } from "next/server";
import { withRepository } from "@/lib/api-repository";
import { validationError } from "@/lib/api-response";
import { freedomSnapshotSchema, parseBody } from "@/lib/validations/api";

export async function GET() {
  return withRepository(async (repo) => {
    const snapshot = await repo.getFreedomSnapshot();
    return NextResponse.json(snapshot);
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(freedomSnapshotSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  return withRepository(async (repo) => {
    const snapshot = await repo.saveFreedomSnapshot({
      snapshot_date: parsed.data.snapshot_date ?? new Date().toISOString().split("T")[0],
      active_income: parsed.data.active_income,
      passive_income: parsed.data.passive_income,
      fixed_expenses: parsed.data.fixed_expenses,
      liquidity: parsed.data.liquidity,
      reserves: parsed.data.reserves,
    });
    return NextResponse.json(snapshot);
  });
}
