import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createBooking,
  createClient,
  createReferral,
  getClientByReferralCode,
  getCouponByCode,
  listClients,
  listServices,
  listStaff,
} from "@/lib/data/repo";
import { addMinutes, generateReferralCode } from "@/lib/utils";

const bodySchema = z.object({
  shopId: z.string().min(1),
  serviceId: z.string().min(1),
  staffId: z.string().min(1),
  startAt: z.string().min(1),
  client: z.object({
    name: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    notes: z.string().optional(),
  }),
  couponCode: z.string().optional(),
  referralCode: z.string().optional(),
});

function normalizePhone(p?: string) {
  if (!p) return undefined;
  return p.replace(/\s+/g, "");
}

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { shopId, serviceId, staffId, startAt, client, couponCode, referralCode } = parsed.data;

  const [services, staff, existingClients] = await Promise.all([
    listServices(shopId),
    listStaff(shopId),
    listClients(shopId),
  ]);
  const svc = services.find((s) => s.id === serviceId);
  const stf = staff.find((s) => s.id === staffId);
  if (!svc || !stf) return NextResponse.json({ error: "Servizio o barbiere non trovato" }, { status: 404 });

  const normalizedPhone = normalizePhone(client.phone);
  const existing = existingClients.find(
    (c) =>
      (normalizedPhone && normalizePhone(c.phone) === normalizedPhone) ||
      (client.email && c.email && c.email.toLowerCase() === client.email.toLowerCase()),
  );

  let clientId = existing?.id;
  if (!clientId) {
    const referrer = referralCode ? await getClientByReferralCode(shopId, referralCode) : null;
    const created = await createClient({
      shopId,
      name: client.name.trim(),
      phone: normalizedPhone,
      email: client.email || undefined,
      notes: client.notes || undefined,
      tags: [],
      vip: false,
      referralCode: generateReferralCode(client.name),
      referredByClientId: referrer?.id ?? null,
      totalSpentCents: 0,
      visits: 0,
      loyaltyPoints: 0,
      createdAt: new Date().toISOString(),
    });
    clientId = created.id;
    if (referrer) {
      await createReferral({
        shopId,
        referrerClientId: referrer.id,
        newClientId: created.id,
        status: "pending",
        createdAt: new Date().toISOString(),
        rewardCents: 500,
      });
    }
  }

  let discountCents = 0;
  if (couponCode) {
    const coupon = await getCouponByCode(shopId, couponCode);
    if (coupon) {
      if (coupon.discountPercent) {
        discountCents = Math.round((svc.priceCents * coupon.discountPercent) / 100);
      } else if (coupon.discountCents) {
        discountCents = Math.min(coupon.discountCents, svc.priceCents);
      }
    }
  }

  const start = new Date(startAt);
  const end = addMinutes(start, svc.durationMin);
  const booking = await createBooking({
    shopId,
    clientId: clientId!,
    staffId,
    serviceId,
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    status: "confirmed",
    priceCents: svc.priceCents,
    couponCode: couponCode?.toUpperCase(),
    discountCents,
    createdAt: new Date().toISOString(),
    source: "public",
  });

  return NextResponse.json({ booking });
}
