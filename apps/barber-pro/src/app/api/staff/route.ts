import { NextResponse } from "next/server";
import { z } from "zod";
import { createStaff, listStaff, DEMO_SHOP_ID } from "@/lib/data/repo";

export async function GET() {
  const staff = await listStaff();
  return NextResponse.json({ staff });
}

const bodySchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  color: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const created = await createStaff({
    shopId: DEMO_SHOP_ID,
    name: parsed.data.name.trim(),
    role: parsed.data.role,
    color: parsed.data.color ?? "#c9a24a",
    active: true,
  });
  return NextResponse.json({ staff: created }, { status: 201 });
}
