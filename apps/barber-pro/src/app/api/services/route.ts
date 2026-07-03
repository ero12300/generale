import { NextResponse } from "next/server";
import { z } from "zod";
import { createService, listServices, DEMO_SHOP_ID } from "@/lib/data/repo";

export async function GET() {
  const services = await listServices();
  return NextResponse.json({ services });
}

const bodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  priceCents: z.number().int().positive(),
  durationMin: z.number().int().positive(),
  active: z.boolean().optional(),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const created = await createService({
    shopId: DEMO_SHOP_ID,
    name: parsed.data.name,
    description: parsed.data.description,
    priceCents: parsed.data.priceCents,
    durationMin: parsed.data.durationMin,
    active: parsed.data.active ?? true,
  });
  return NextResponse.json({ service: created }, { status: 201 });
}
