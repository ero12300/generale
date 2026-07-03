import { NextResponse } from "next/server";
import { z } from "zod";
import { toggleCoupon } from "@/lib/data/repo";

const patchSchema = z.object({ active: z.boolean() });

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const updated = await toggleCoupon(id, parsed.data.active);
  if (!updated) return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  return NextResponse.json({ coupon: updated });
}
