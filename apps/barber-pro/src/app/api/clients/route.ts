import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createClient,
  createReferral,
  getClientByReferralCode,
  listClients,
  DEMO_SHOP_ID,
} from "@/lib/data/repo";
import { generateReferralCode } from "@/lib/utils";

export async function GET() {
  const clients = await listClients();
  return NextResponse.json({ clients });
}

const bodySchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
  vip: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  referrerCode: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const referrer = parsed.data.referrerCode
    ? await getClientByReferralCode(DEMO_SHOP_ID, parsed.data.referrerCode)
    : null;

  const created = await createClient({
    shopId: DEMO_SHOP_ID,
    name: parsed.data.name.trim(),
    phone: parsed.data.phone || undefined,
    email: parsed.data.email || undefined,
    notes: parsed.data.notes || undefined,
    tags: parsed.data.tags ?? [],
    vip: parsed.data.vip ?? false,
    referralCode: generateReferralCode(parsed.data.name),
    referredByClientId: referrer?.id ?? null,
    totalSpentCents: 0,
    visits: 0,
    loyaltyPoints: 0,
    createdAt: new Date().toISOString(),
  });

  if (referrer) {
    await createReferral({
      shopId: DEMO_SHOP_ID,
      referrerClientId: referrer.id,
      newClientId: created.id,
      status: "pending",
      createdAt: new Date().toISOString(),
      rewardCents: 500,
    });
  }

  return NextResponse.json({ client: created }, { status: 201 });
}
