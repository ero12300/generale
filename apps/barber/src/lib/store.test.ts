import { describe, expect, it } from "vitest";
import { BarberStore } from "./store";
import { canUseFeature, PLAN_FEATURES } from "./plan";

describe("BarberStore — incassi", () => {
  it("calcola un riepilogo incassi coerente", () => {
    const store = new BarberStore();
    const summary = store.revenueSummary();
    expect(summary.month).toBeGreaterThan(0);
    expect(summary.last7Days).toHaveLength(7);
    // La somma per metodo del mese non supera l'incasso mensile
    const byMethod =
      summary.byMethod.contanti + summary.byMethod.carta + summary.byMethod.altro;
    expect(byMethod).toBeCloseTo(summary.month, 2);
  });

  it("registra un incasso e aggiorna la spesa del cliente", () => {
    const store = new BarberStore();
    const client = store.listClients()[0];
    const spentBefore = client.totalSpent;
    const pointsBefore = client.loyaltyPoints;
    store.createRevenue({ amount: 25, method: "carta", clientId: client.id });
    const after = store.getClient(client.id)!;
    expect(after.totalSpent).toBeCloseTo(spentBefore + 25, 2);
    expect(after.loyaltyPoints).toBeGreaterThan(pointsBefore);
  });
});

describe("BarberStore — clienti e referral", () => {
  it("assegna punti al referrer quando si usa il suo codice", () => {
    const store = new BarberStore();
    const referrer = store.listClients()[0];
    const pointsBefore = referrer.loyaltyPoints;
    const { client } = store.createClient({
      name: "Nuovo Cliente",
      phone: "+39 000 0000000",
      referredByCode: referrer.referralCode,
    });
    expect(client?.referredBy).toBe(referrer.id);
    expect(store.getClient(referrer.id)!.loyaltyPoints).toBe(pointsBefore + 50);
  });

  it("blocca la creazione oltre il limite del piano Base", () => {
    const store = new BarberStore();
    store.setPlan("base");
    const limit = PLAN_FEATURES.base.maxClients;
    while (store.listClients().length < limit) {
      store.createClient({ name: "Tizio", phone: "+39 111 1111111" });
    }
    const res = store.createClient({ name: "Oltre Limite", phone: "+39 222 2222222" });
    expect(res.client).toBeUndefined();
    expect(res.error).toContain("limite");
  });
});

describe("BarberStore — prenotazioni", () => {
  it("completare una prenotazione genera un incasso e aggiorna il cliente", () => {
    const store = new BarberStore();
    const client = store.listClients()[0];
    const { booking } = store.createBooking({
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      serviceId: "svc-taglio",
      start: new Date().toISOString(),
      source: "interno",
    });
    const revenueBefore = store.listRevenue().length;
    const visitsBefore = store.getClient(client.id)!.totalVisits;

    store.setBookingStatus(booking!.id, "completed");

    expect(store.listRevenue().length).toBe(revenueBefore + 1);
    expect(store.getClient(client.id)!.totalVisits).toBe(visitsBefore + 1);
    // Non deve duplicare l'incasso se richiamato di nuovo
    store.setBookingStatus(booking!.id, "completed");
    expect(store.listRevenue().length).toBe(revenueBefore + 1);
  });
});

describe("BarberStore — campagne e piani", () => {
  it("blocca il referral sul piano Base e lo consente sul Pro", () => {
    const store = new BarberStore();
    store.setPlan("base");
    const blocked = store.createCampaign({
      name: "Amici",
      type: "referral",
      description: "Porta un amico",
    });
    expect(blocked.error).toBeTruthy();

    store.setPlan("pro");
    const allowed = store.createCampaign({
      name: "Amici",
      type: "referral",
      description: "Porta un amico",
    });
    expect(allowed.campaign).toBeDefined();
  });

  it("espone le feature corrette per piano", () => {
    expect(canUseFeature("base", "referralProgram")).toBe(false);
    expect(canUseFeature("pro", "referralProgram")).toBe(true);
    expect(canUseFeature("base", "onlineBooking")).toBe(true);
  });
});
