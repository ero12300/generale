import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { availableSlots } from "@/lib/slots";
import { applyPercentOff } from "@/lib/money";
import { handleRouteError, jsonError } from "@/lib/api-helpers";

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  barberId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  clientName: z.string().min(2).max(80),
  clientPhone: z.string().min(6).max(20),
  clientEmail: z.string().email().optional().or(z.literal("")),
  discountCode: z.string().max(30).optional(),
  notes: z.string().max(300).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const input = bookingSchema.parse(await request.json());
    const store = await getStore();

    const [services, barbers, settings] = await Promise.all([
      store.listServices(),
      store.listBarbers(),
      store.getSettings(),
    ]);
    const service = services.find((s) => s.id === input.serviceId);
    const barber = barbers.find((b) => b.id === input.barberId);
    if (!service) return jsonError("Servizio non trovato", 404);
    if (!barber) return jsonError("Barbiere non trovato", 404);

    const appointments = await store.listAppointments(input.date);
    const slots = availableSlots(
      input.date,
      service.durationMin,
      input.barberId,
      appointments,
      settings,
    );
    if (!slots.includes(input.time)) {
      return jsonError("Orario non più disponibile, scegline un altro.", 409);
    }

    // Sconto: prima cerca una campagna con quel codice, poi un codice referral
    let discountCents = 0;
    let appliedCode: string | undefined;
    let referredBy: string | undefined;
    if (input.discountCode?.trim()) {
      const code = input.discountCode.trim().toUpperCase();
      const campaign = await store.findActiveCampaignByCode(code);
      if (campaign) {
        discountCents = applyPercentOff(service.priceCents, campaign.percentOff);
        appliedCode = campaign.code;
        await store.incrementCampaignUsage(campaign.id);
        if (campaign.type === "referral") referredBy = code;
      } else {
        const referrer = await store.findClientByReferralCode(code);
        if (referrer) {
          // "Porta un amico": 15% al nuovo cliente che usa il codice personale
          discountCents = applyPercentOff(service.priceCents, 15);
          appliedCode = referrer.referralCode;
          referredBy = referrer.referralCode;
        } else {
          return jsonError("Codice sconto non valido o scaduto.", 400);
        }
      }
    }

    let client = await store.findClientByPhone(input.clientPhone);
    if (!client) {
      client = await store.createClient({
        name: input.clientName,
        phone: input.clientPhone,
        email: input.clientEmail || undefined,
        notes: input.notes,
        referredBy,
      });
    }

    const appointment = await store.createAppointment({
      clientId: client.id,
      clientName: input.clientName,
      clientPhone: input.clientPhone,
      serviceId: service.id,
      serviceName: service.name,
      barberId: barber.id,
      barberName: barber.name,
      date: input.date,
      time: input.time,
      durationMin: service.durationMin,
      priceCents: service.priceCents,
      discountCents,
      discountCode: appliedCode,
    });

    return NextResponse.json(
      {
        appointment,
        referralCode: client.referralCode,
        totalCents: service.priceCents - discountCents,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
