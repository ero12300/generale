import type { Appointment, ShopSettings } from "./types";

/** Converte "HH:mm" in minuti dalla mezzanotte. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/**
 * Calcola gli slot disponibili per una data, escludendo gli orari
 * occupati da appuntamenti non annullati (considerando la durata).
 */
export function availableSlots(
  date: string,
  serviceDurationMin: number,
  barberId: string,
  appointments: Appointment[],
  settings: ShopSettings,
): string[] {
  const weekday = new Date(`${date}T12:00:00`).getDay();
  if (settings.closedWeekdays.includes(weekday)) return [];

  const open = settings.openingHour * 60;
  const close = settings.closingHour * 60;

  const busy = appointments
    .filter(
      (a) => a.date === date && a.barberId === barberId && a.status !== "annullato",
    )
    .map((a) => {
      const start = timeToMinutes(a.time);
      return { start, end: start + a.durationMin };
    });

  const slots: string[] = [];
  for (let t = open; t + serviceDurationMin <= close; t += settings.slotMinutes) {
    const end = t + serviceDurationMin;
    const overlaps = busy.some((b) => t < b.end && end > b.start);
    if (!overlaps) slots.push(minutesToTime(t));
  }
  return slots;
}
