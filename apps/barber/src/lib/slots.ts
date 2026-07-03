import type { Booking, ShopSettings } from "./types";

export interface Slot {
  iso: string;
  label: string;
  available: boolean;
}

// Genera gli slot disponibili per un barbiere in un dato giorno,
// escludendo quelli occupati o passati.
export function generateSlots(
  settings: ShopSettings,
  bookings: Booking[],
  barberId: string,
  dateISO: string,
  serviceDurationMin: number,
): Slot[] {
  const day = new Date(dateISO);
  const dow = day.getDay();
  if (!settings.workingDays.includes(dow)) return [];

  const slots: Slot[] = [];
  const now = new Date();

  const busy = bookings
    .filter(
      (b) =>
        b.barberId === barberId &&
        b.status !== "annullata" &&
        new Date(b.start).toDateString() === day.toDateString(),
    )
    .map((b) => {
      const start = new Date(b.start).getTime();
      return { start, end: start + b.durationMin * 60000 };
    });

  for (let h = settings.openHour; h < settings.closeHour; h++) {
    for (let m = 0; m < 60; m += settings.slotMinutes) {
      const slot = new Date(day);
      slot.setHours(h, m, 0, 0);
      const slotStart = slot.getTime();
      const slotEnd = slotStart + serviceDurationMin * 60000;

      // non oltre l'orario di chiusura
      const closing = new Date(day);
      closing.setHours(settings.closeHour, 0, 0, 0);
      if (slotEnd > closing.getTime()) continue;

      const isPast = slotStart < now.getTime();
      const overlaps = busy.some((b) => slotStart < b.end && slotEnd > b.start);

      slots.push({
        iso: slot.toISOString(),
        label: slot.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }),
        available: !isPast && !overlaps,
      });
    }
  }
  return slots;
}
