import { NextResponse } from "next/server";
import { z } from "zod";
import { createCoupon, listCoupons, DEMO_SHOP_ID } from "@/lib/data/repo";

export async function GET() {
  const coupons = await listCoupons();
  return NextResponse.json({ coupons });
}

const bodySchema = z
  .object({
    code: z.string().min(3),
    discountPercent: z.number().int().min(1).max(100).optional(),
    discountCents: z.number().int().positive().optional(),
    maxRedemptions: z.number().int().positive().optional(),
    expiresAt: z.string().optional(),
  })
  .refine((v) => v.discountPercent || v.discountCents, {
    message: "Serve discountPercent o discountCents",
  });

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const created = await createCoupon({
    shopId: DEMO_SHOP_ID,
    code: parsed.data.code,
    discountPercent: parsed.data.discountPercent,
    discountCents: parsed.data.discountCents,
    maxRedemptions: parsed.data.maxRedemptions,
    active: true,
    redemptions: 0,
    expiresAt: parsed.data.expiresAt ?? null,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ coupon: created }, { status: 201 });
}
