"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { applyDiscount, parseEuroToCents } from "@/lib/money";
import { canAddBooking, canAddClient, planAllows } from "@/lib/plans";
import { getStore } from "@/lib/store";
import { createCheckoutSession, isStripeConfigured } from "@/lib/stripe";
import type { PlanId } from "@/lib/types";

export interface ActionResult {
  ok: boolean;
  message: string;
}

// ---------------------------------------------------------------- Incassi

const saleSchema = z.object({
  serviceId: z.string().optional(),
  clientId: z.string().optional(),
  description: z.string().min(1, "Descrizione obbligatoria").max(200),
  amount: z.string().min(1, "Importo obbligatorio"),
  method: z.enum(["contanti", "carta", "altro"]),
  campaignId: z.string().optional(),
});

export async function registerSale(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = saleSchema.safeParse({
    serviceId: formData.get("serviceId") || undefined,
    clientId: formData.get("clientId") || undefined,
    description: formData.get("description"),
    amount: formData.get("amount"),
    method: formData.get("method"),
    campaignId: formData.get("campaignId") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.errors[0].message };
  }

  let amountCents: number;
  try {
    amountCents = parseEuroToCents(parsed.data.amount);
  } catch {
    return { ok: false, message: "Importo non valido (es. 25,00)" };
  }

  const store = await getStore();
  let discountCents = 0;
  let finalCents = amountCents;

  if (parsed.data.campaignId) {
    const campaigns = await store.listCampaigns();
    const campaign = campaigns.find(
      (c) => c.id === parsed.data.campaignId && c.active
    );
    if (campaign) {
      const result = applyDiscount(amountCents, {
        discountPercent: campaign.discountPercent,
        discountCents: campaign.discountCents,
      });
      finalCents = result.finalCents;
      discountCents = result.discountCents;
      await store.incrementCampaignRedemptions(campaign.id);
    }
  }

  let clientName: string | undefined;
  if (parsed.data.clientId) {
    const clients = await store.listClients();
    clientName = clients.find((c) => c.id === parsed.data.clientId)?.fullName;
  }

  await store.createSale({
    shopId: (await store.getShop()).id,
    clientId: parsed.data.clientId,
    clientName,
    serviceId: parsed.data.serviceId,
    description: parsed.data.description,
    amountCents: finalCents,
    discountCents,
    method: parsed.data.method,
    campaignId: parsed.data.campaignId,
    date: new Date().toISOString().slice(0, 10),
  });

  if (parsed.data.clientId) {
    await store.recordClientVisit(parsed.data.clientId, finalCents);
  }

  revalidatePath("/app", "layout");
  return { ok: true, message: "Incasso registrato" };
}

// ---------------------------------------------------------------- Clienti

const clientSchema = z.object({
  fullName: z.string().min(2, "Nome troppo corto").max(100),
  phone: z.string().min(6, "Telefono non valido").max(30),
  email: z
    .string()
    .email("Email non valida")
    .optional()
    .or(z.literal("")),
  notes: z.string().max(500).optional(),
  referredByCode: z.string().max(20).optional(),
});

export async function createClient(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = clientSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email") || "",
    notes: formData.get("notes") || undefined,
    referredByCode: formData.get("referredByCode") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.errors[0].message };
  }

  const store = await getStore();
  const shop = await store.getShop();
  const clients = await store.listClients();

  if (!canAddClient(shop.plan, clients.length)) {
    return {
      ok: false,
      message:
        "Limite clienti del piano Base raggiunto. Passa a Pro per clienti illimitati.",
    };
  }

  let referredById: string | undefined;
  if (parsed.data.referredByCode) {
    const referrer = await store.getClientByReferralCode(
      parsed.data.referredByCode
    );
    if (!referrer) {
      return { ok: false, message: "Codice amico non trovato" };
    }
    referredById = referrer.id;
  }

  await store.createClient({
    shopId: shop.id,
    fullName: parsed.data.fullName,
    phone: parsed.data.phone,
    email: parsed.data.email || undefined,
    notes: parsed.data.notes,
    referredById,
  });

  revalidatePath("/app", "layout");
  return { ok: true, message: "Cliente aggiunto alla rubrica" };
}

// ---------------------------------------------------------------- Prenotazioni

const bookingSchema = z.object({
  clientName: z.string().min(2, "Nome obbligatorio").max(100),
  clientPhone: z.string().min(6, "Telefono non valido").max(30),
  serviceId: z.string().min(1, "Scegli un servizio"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data non valida"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Orario non valido"),
});

async function createBookingInternal(
  formData: FormData,
  source: "interno" | "online"
): Promise<ActionResult> {
  const parsed = bookingSchema.safeParse({
    clientName: formData.get("clientName"),
    clientPhone: formData.get("clientPhone"),
    serviceId: formData.get("serviceId"),
    date: formData.get("date"),
    time: formData.get("time"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.errors[0].message };
  }

  const store = await getStore();
  const shop = await store.getShop();

  const monthPrefix = new Date().toISOString().slice(0, 7);
  const bookings = await store.listBookings();
  const bookingsThisMonth = bookings.filter((b) =>
    b.date.startsWith(monthPrefix)
  ).length;
  if (!canAddBooking(shop.plan, bookingsThisMonth)) {
    return {
      ok: false,
      message:
        "Limite prenotazioni mensili del piano Base raggiunto. Passa a Pro.",
    };
  }

  const services = await store.listServices();
  const service = services.find((s) => s.id === parsed.data.serviceId);
  if (!service) return { ok: false, message: "Servizio non trovato" };

  const conflict = bookings.find(
    (b) =>
      b.date === parsed.data.date &&
      b.time === parsed.data.time &&
      b.status === "confermata"
  );
  if (conflict) {
    return { ok: false, message: "Orario già occupato, scegline un altro" };
  }

  await store.createBooking({
    shopId: shop.id,
    clientName: parsed.data.clientName,
    clientPhone: parsed.data.clientPhone,
    serviceId: service.id,
    serviceName: service.name,
    date: parsed.data.date,
    time: parsed.data.time,
    status: "confermata",
    source,
  });

  revalidatePath("/app", "layout");
  revalidatePath("/prenota");
  return { ok: true, message: "Prenotazione confermata" };
}

export async function createBooking(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  return createBookingInternal(formData, "interno");
}

export async function createPublicBooking(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const store = await getStore();
  const shop = await store.getShop();
  if (!planAllows(shop.plan, "onlineBooking")) {
    return {
      ok: false,
      message:
        "La prenotazione online è disponibile con il piano Pro. Contatta il salone per prenotare.",
    };
  }
  return createBookingInternal(formData, "online");
}

export async function setBookingStatus(
  bookingId: string,
  status: "completata" | "annullata"
): Promise<ActionResult> {
  const store = await getStore();
  const updated = await store.updateBookingStatus(bookingId, status);
  if (!updated) return { ok: false, message: "Prenotazione non trovata" };
  revalidatePath("/app", "layout");
  return { ok: true, message: `Prenotazione ${status}` };
}

// ---------------------------------------------------------------- Campagne

const campaignSchema = z
  .object({
    kind: z.enum(["sconto", "referral"]),
    name: z.string().min(3, "Nome campagna troppo corto").max(100),
    discountPercent: z.coerce.number().min(0).max(100).optional(),
    discountEuro: z.string().optional(),
    referrerRewardEuro: z.string().optional(),
  })
  .refine(
    (data) =>
      data.kind === "referral" ||
      (data.discountPercent ?? 0) > 0 ||
      (data.discountEuro ?? "").length > 0,
    { message: "Indica una percentuale o un importo di sconto" }
  );

export async function createCampaign(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const store = await getStore();
  const shop = await store.getShop();
  if (!planAllows(shop.plan, "campaigns")) {
    return {
      ok: false,
      message: "Le campagne sono una funzione Pro. Passa a Pro per attivarle.",
    };
  }

  const parsed = campaignSchema.safeParse({
    kind: formData.get("kind"),
    name: formData.get("name"),
    discountPercent: formData.get("discountPercent") || undefined,
    discountEuro: formData.get("discountEuro") || undefined,
    referrerRewardEuro: formData.get("referrerRewardEuro") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.errors[0].message };
  }

  let discountCents: number | undefined;
  let referrerRewardCents: number | undefined;
  try {
    if (parsed.data.discountEuro)
      discountCents = parseEuroToCents(parsed.data.discountEuro);
    if (parsed.data.referrerRewardEuro)
      referrerRewardCents = parseEuroToCents(parsed.data.referrerRewardEuro);
  } catch {
    return { ok: false, message: "Importo non valido (es. 10,00)" };
  }

  await store.createCampaign({
    shopId: shop.id,
    kind: parsed.data.kind,
    name: parsed.data.name,
    discountPercent: parsed.data.discountPercent || undefined,
    discountCents,
    referrerRewardCents,
    active: true,
  });

  revalidatePath("/app", "layout");
  return { ok: true, message: "Campagna creata e attiva" };
}

export async function toggleCampaign(
  campaignId: string,
  active: boolean
): Promise<ActionResult> {
  const store = await getStore();
  const updated = await store.toggleCampaign(campaignId, active);
  if (!updated) return { ok: false, message: "Campagna non trovata" };
  revalidatePath("/app", "layout");
  return {
    ok: true,
    message: active ? "Campagna attivata" : "Campagna disattivata",
  };
}

// ---------------------------------------------------------------- Abbonamento

export async function startCheckout(plan: PlanId): Promise<ActionResult> {
  const store = await getStore();

  if (!isStripeConfigured()) {
    // Modalità demo: upgrade immediato senza pagamento reale
    await store.setPlan(plan);
    revalidatePath("/app", "layout");
    return {
      ok: true,
      message: `Piano ${plan === "pro" ? "Pro" : "Base"} attivato in modalità demo. Configura STRIPE_SECRET_KEY per i pagamenti reali.`,
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3100";
  const { url } = await createCheckoutSession({
    plan,
    successUrl: `${baseUrl}/app/abbonamento?esito=ok`,
    cancelUrl: `${baseUrl}/app/abbonamento?esito=annullato`,
  });
  redirect(url);
}
