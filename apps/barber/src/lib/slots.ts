import type { Booking, BarbershopProfile, Service, WeeklyHours } from "@/types";
import { addMinutes, isSameDay } from "@/lib/utils";

const DAY_KEYS: (keyof WeeklyHours)[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(mins: number, base: Date): Date {
  const d = new Date(base);
  d.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
  return d;
}

export function getDayHours(day: Date, hours: WeeklyHours) {
  const idx = day.getDay(); // 0=Sun
  const key = DAY_KEYS[idx];
  return hours[key];
}

export function computeSlotsForDay(
  day: Date,
  service: Service,
  shop: BarbershopProfile,
  existing: Booking[],
): Date[] {
  const hours = getDayHours(day, shop.hours);
  if (!hours.open) return [];
  const openMin = toMinutes(hours.from);
  const closeMin = toMinutes(hours.to);
  const step = shop.slotMinutes;
  const now = new Date();

  const slots: Date[] = [];
  for (let t = openMin; t + service.durationMin <= closeMin; t += step) {
    const start = fromMinutes(t, day);
    const end = addMinutes(start, service.durationMin);
    if (isSameDay(day, now) && start <= now) continue;

    const overlaps = existing.some((b) => {
      if (b.status === "cancelled" || b.status === "no_show") return false;
      const bStart = new Date(b.startAt);
      const bEnd = new Date(b.endAt);
      return start < bEnd && end > bStart;
    });
    if (!overlaps) slots.push(start);
  }
  return slots;
}
