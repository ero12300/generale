import { NextResponse } from "next/server";
import { z } from "zod";
import { updateClient } from "@/lib/data/repo";

const patchSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  notes: z.string().optional(),
  vip: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = patchSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  const updated = await updateClient(id, body.data);
  if (!updated) return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  return NextResponse.json({ client: updated });
}
