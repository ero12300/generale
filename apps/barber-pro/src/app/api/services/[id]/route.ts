import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteService, updateService } from "@/lib/data/repo";

const patchSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  priceCents: z.number().int().positive().optional(),
  durationMin: z.number().int().positive().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const updated = await updateService(id, parsed.data);
  if (!updated) return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  return NextResponse.json({ service: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ok = await deleteService(id);
  return NextResponse.json({ ok });
}
