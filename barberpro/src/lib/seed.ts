import type { WorkspaceData } from "./types";
import { genId, genReferralCode } from "./format";

function isoDaysFromNow(days: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(11, 0, 0, 0);
  return d.toISOString();
}

/** Genera un workspace demo ricco per dimostrare tutte le funzioni. */
export function buildSeedData(): WorkspaceData {
  const svcCut = { id: genId("svc"), name: "Taglio classico", description: "Taglio su misura con rifinitura", priceCents: 2000, durationMin: 30, active: true, createdAt: isoDaysAgo(120) };
  const svcBeard = { id: genId("svc"), name: "Taglio + Barba", description: "Taglio completo e modellatura barba", priceCents: 3000, durationMin: 45, active: true, createdAt: isoDaysAgo(120) };
  const svcShave = { id: genId("svc"), name: "Rasatura tradizionale", description: "Rasatura con panno caldo e rasoio", priceCents: 2500, durationMin: 40, active: true, createdAt: isoDaysAgo(120) };

  const services = [svcCut, svcBeard, svcShave];

  const clientsRaw = [
    { firstName: "Marco", lastName: "Rossi", phone: "+39 320 1112233", email: "marco.rossi@email.it" },
    { firstName: "Luca", lastName: "Bianchi", phone: "+39 333 4455667", email: "luca.b@email.it" },
    { firstName: "Andrea", lastName: "Verdi", phone: "+39 348 9988776" },
    { firstName: "Simone", lastName: "Conti", phone: "+39 366 5544332", email: "simone.conti@email.it" },
    { firstName: "Giuseppe", lastName: "Ferrari", phone: "+39 380 1231234" },
  ];

  const clients = clientsRaw.map((c, i) => ({
    id: genId("cli"),
    ...c,
    notes: i === 0 ? "Preferisce sfumatura bassa" : undefined,
    referralCode: genReferralCode(c.firstName),
    referredBy: undefined as string | undefined,
    createdAt: isoDaysAgo(90 - i * 10),
  }));

  clients[3].referredBy = clients[0].id;
  clients[4].referredBy = clients[1].id;

  const bookings = [
    { clientIdx: 0, svc: svcCut, start: isoDaysFromNow(0, 10, 0), status: "confirmed" as const },
    { clientIdx: 1, svc: svcBeard, start: isoDaysFromNow(0, 11, 30), status: "confirmed" as const },
    { clientIdx: 2, svc: svcShave, start: isoDaysFromNow(1, 16, 0), status: "pending" as const },
    { clientIdx: 3, svc: svcCut, start: isoDaysFromNow(2, 9, 30), status: "confirmed" as const },
    { clientIdx: 4, svc: svcBeard, start: isoDaysFromNow(3, 17, 0), status: "pending" as const },
  ].map((b) => {
    const client = clients[b.clientIdx];
    return {
      id: genId("bkg"),
      clientId: client.id,
      clientName: `${client.firstName} ${client.lastName}`,
      clientPhone: client.phone,
      serviceId: b.svc.id,
      serviceName: b.svc.name,
      priceCents: b.svc.priceCents,
      start: b.start,
      durationMin: b.svc.durationMin,
      status: b.status,
      source: "internal" as const,
      createdAt: isoDaysAgo(1),
    };
  });

  // Incassi degli ultimi 45 giorni per riempire i grafici.
  const payments = [];
  const svcPool = [svcCut, svcBeard, svcShave];
  for (let d = 45; d >= 0; d--) {
    const nPerDay = (d % 7 === 0 || d % 7 === 6) ? 0 : 2 + (d % 3);
    for (let k = 0; k < nPerDay; k++) {
      const svc = svcPool[(d + k) % svcPool.length];
      const client = clients[(d + k) % clients.length];
      const discount = (d + k) % 6 === 0 ? Math.round(svc.priceCents * 0.1) : 0;
      const dt = new Date();
      dt.setDate(dt.getDate() - d);
      dt.setHours(10 + k, 0, 0, 0);
      payments.push({
        id: genId("pay"),
        clientId: client.id,
        clientName: `${client.firstName} ${client.lastName}`,
        description: svc.name,
        amountCents: svc.priceCents,
        discountCents: discount,
        method: (["cash", "card", "card", "transfer"] as const)[(d + k) % 4],
        date: dt.toISOString(),
        createdAt: dt.toISOString(),
      });
    }
  }

  const campaigns = [
    {
      id: genId("cmp"),
      name: "Porta un amico",
      type: "referral" as const,
      active: true,
      discountPct: 20,
      description: "Il cliente che invita e l'amico ricevono il 20% di sconto sul prossimo taglio.",
      createdAt: isoDaysAgo(30),
    },
    {
      id: genId("cmp"),
      name: "Sconto studenti",
      type: "discount" as const,
      active: true,
      discountPct: 15,
      code: "STUDENTI15",
      description: "15% di sconto per studenti dal lunedì al giovedì.",
      createdAt: isoDaysAgo(20),
    },
  ];

  return {
    services,
    clients,
    bookings,
    payments,
    campaigns,
    settings: {
      shopName: "Fade & Co. Barbershop",
      ownerName: "Eros",
      address: "Via Roma 42, Milano",
      phone: "+39 02 1234567",
      openTime: "09:00",
      closeTime: "19:00",
      workingDays: [1, 2, 3, 4, 5, 6],
      slotStepMin: 30,
      plan: "pro",
    },
  };
}
