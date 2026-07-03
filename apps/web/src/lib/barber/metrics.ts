import type {
  BarberBooking,
  BarberCampaign,
  BarberCustomer,
  BarberDashboardMetrics,
} from "@deal-desk/types";

const BILLABLE_STATUSES = new Set<BarberBooking["status"]>(["confirmed", "completed"]);

function isSameLocalDate(dateIso: string, comparison = new Date()) {
  const date = new Date(dateIso);
  return (
    date.getFullYear() === comparison.getFullYear() &&
    date.getMonth() === comparison.getMonth() &&
    date.getDate() === comparison.getDate()
  );
}

function isSameLocalMonth(dateIso: string, comparison = new Date()) {
  const date = new Date(dateIso);
  return date.getFullYear() === comparison.getFullYear() && date.getMonth() === comparison.getMonth();
}

export function calculateBarberDashboardMetrics({
  bookings,
  customers,
  campaigns,
  dailyCapacityMinutes = 8 * 60,
  now = new Date(),
}: {
  bookings: BarberBooking[];
  customers: BarberCustomer[];
  campaigns: BarberCampaign[];
  dailyCapacityMinutes?: number;
  now?: Date;
}): BarberDashboardMetrics {
  const todayBookings = bookings.filter((booking) => isSameLocalDate(booking.starts_at, now));
  const billableToday = todayBookings.filter((booking) => BILLABLE_STATUSES.has(booking.status));
  const billableMonth = bookings.filter(
    (booking) => BILLABLE_STATUSES.has(booking.status) && isSameLocalMonth(booking.starts_at, now)
  );
  const completedBookings = bookings.filter((booking) => booking.status === "completed");
  const completedRevenue = completedBookings.reduce((sum, booking) => sum + booking.price_cents, 0);
  const bookedMinutes = billableToday.reduce((sum, booking) => sum + booking.duration_minutes, 0);

  return {
    today_revenue_cents: billableToday.reduce((sum, booking) => sum + booking.price_cents, 0),
    month_revenue_cents: billableMonth.reduce((sum, booking) => sum + booking.price_cents, 0),
    confirmed_bookings_today: billableToday.length,
    average_ticket_cents:
      completedBookings.length > 0 ? Math.round(completedRevenue / completedBookings.length) : 0,
    occupancy_rate: dailyCapacityMinutes > 0 ? Math.min(bookedMinutes / dailyCapacityMinutes, 1) : 0,
    customers_total: customers.length,
    referral_customers: customers.filter((customer) => customer.referred_by_customer_id).length,
    active_campaigns: campaigns.filter((campaign) => campaign.active).length,
  };
}

export function estimateMonthlySubscriptionRevenue(planPriceCents: number, subscribers: number) {
  return Math.max(0, planPriceCents) * Math.max(0, subscribers);
}
