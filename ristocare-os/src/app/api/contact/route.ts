import { NextResponse } from "next/server";
import { createContact } from "@/lib/demo-store";
import { createContactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = createContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dati non validi", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const contact = createContact(parsed.data);
  return NextResponse.json({ contact }, { status: 201 });
}
