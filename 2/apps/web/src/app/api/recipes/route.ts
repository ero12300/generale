import { NextResponse } from "next/server";
import { requireAuthContext } from "@/lib/auth/session";
import { getProfitRepository } from "@/lib/data";

export async function GET() {
  try {
    const auth = await requireAuthContext();
    const repo = await getProfitRepository(auth);
    const recipes = await repo.listRecipes();
    const foodCosts = await repo.getFoodCosts();
    return NextResponse.json({ data: recipes, foodCosts });
  } catch {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuthContext();
    const repo = await getProfitRepository(auth);
    const body = await request.json();
    const recipe = await repo.createRecipe(body);
    return NextResponse.json({ data: recipe }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Errore";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
