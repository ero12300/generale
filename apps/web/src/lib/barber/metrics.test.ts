import { describe, expect, it } from "vitest";
import type { BarberBooking, BarberCampaign, BarberCustomer } from "@deal-desk/types";
import {
  calculateBarberDashboardMetrics,
  estimateMonthlySubscriptionRevenue,
} from "@/lib/barber/metrics";

const now = new Date("2026-07-03T10:00:00.000Z");

const bookings: BarberBooking[] = [
  {
    id: "b1",
    organization_id: "org",
    customer_id: "c1",
    customer_name: "Cliente 1",
    customer_phone: "+39 333",
    service_id: "svc",
    service_name: "Taglio",
    starts_at: "2026-07-03T09:00:00.000Z",
    duration_minutes: 60,
    price_cents: 5000,
    status: "completed",
    referral_code: null,
    notes: null,
    created_at: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "b2",
    organization_id: "org",
    customer_id: "c2",
    customer_name: "Cliente 2",
    customer_phone: "+39 334",
    service_id: "svc",
    service_name: "Barba",
    starts_at: "2026-07-03T11:00:00.000Z",
    duration_minutes: 30,
    price_cents: 3000,
    status: "confirmed",
    referral_code: "AMICO10",
    notes: null,
    created_at: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "b3",
    organization_id: "org",
    customer_id: "c3",
    customer_name: "Cliente 3",
    customer_phone: "+39 335",
    service_id: "svc",
    service_name: "VIP",
    starts_at: "2026-07-03T14:00:00.000Z",
    duration_minutes: 90,
    price_cents: 12000,
    status: "cancelled",
    referral_code: null,
    notes: null,
    created_at: "2026-07-01T09:00:00.000Z",
  },
];

const customers: BarberCustomer[] = [
  {
    id: "c1",
    organization_id: "org",
    full_name: "Cliente 1",
    phone: "+39 333",
    email: null,
    segment: "vip",
    referral_code: "C1",
    referred_by_customer_id: null,
    total_spent_cents: 5000,
    visits_count: 1,
    last_visit_at: null,
    notes: null,
    created_at: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "c2",
    organization_id: "org",
    full_name: "Cliente 2",
    phone: "+39 334",
    email: null,
    segment: "referred",
    referral_code: "C2",
    referred_by_customer_id: "c1",
    total_spent_cents: 3000,
    visits_count: 1,
    last_visit_at: null,
    notes: null,
    created_at: "2026-07-01T09:00:00.000Z",
  },
];

const campaigns: BarberCampaign[] = [
  {
    id: "camp1",
    organization_id: "org",
    name: "Referral",
    type: "referral",
    audience: "all",
    incentive: "10%",
    message: "Porta un amico",
    active: true,
    expected_redemptions: 10,
    revenue_target_cents: 30000,
    created_at: "2026-07-01T09:00:00.000Z",
  },
];

describe("calculateBarberDashboardMetrics", () => {
  it("calcola solo prenotazioni confermate o completate", () => {
    const metrics = calculateBarberDashboardMetrics({
      bookings,
      customers,
      campaigns,
      dailyCapacityMinutes: 180,
      now,
    });

    expect(metrics.today_revenue_cents).toBe(8000);
    expect(metrics.month_revenue_cents).toBe(8000);
    expect(metrics.confirmed_bookings_today).toBe(2);
    expect(metrics.average_ticket_cents).toBe(5000);
    expect(metrics.occupancy_rate).toBe(0.5);
    expect(metrics.referral_customers).toBe(1);
    expect(metrics.active_campaigns).toBe(1);
  });
});

describe("estimateMonthlySubscriptionRevenue", () => {
  it("stima ricavi SaaS senza importi float", () => {
    expect(estimateMonthlySubscriptionRevenue(7900, 25)).toBe(197500);
    expect(estimateMonthlySubscriptionRevenue(-100, 25)).toBe(0);
  });
});
