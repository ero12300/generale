import type { DayHours, OpeningHours } from "@/lib/types";

export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_LABELS: Record<DayKey, string> = {
  mon: "Lunedì",
  tue: "Martedì",
  wed: "Mercoledì",
  thu: "Giovedì",
  fri: "Venerdì",
  sat: "Sabato",
  sun: "Domenica",
};

const JS_DAY_TO_KEY: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function getDayKeyFromDate(dateStr: string): DayKey {
  const date = new Date(`${dateStr}T12:00:00`);
  return JS_DAY_TO_KEY[date.getDay()];
}

export function getDayHoursForDate(hours: OpeningHours, dateStr: string): DayHours {
  const key = getDayKeyFromDate(dateStr);
  return hours[key];
}

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Genera slot ogni 30 minuti in base agli orari del salone per la data scelta */
export function generateTimeSlots(
  hours: OpeningHours,
  dateStr: string,
  intervalMinutes = 30
): string[] {
  const dayHours = getDayHoursForDate(hours, dateStr);

  if (dayHours.closed) return [];

  const open = parseTimeToMinutes(dayHours.open);
  const close = parseTimeToMinutes(dayHours.close);

  if (close <= open) return [];

  const slots: string[] = [];
  for (let t = open; t < close; t += intervalMinutes) {
    slots.push(minutesToTime(t));
  }
  return slots;
}

export function formatDayHours(day: DayHours): string {
  if (day.closed) return "Chiuso";
  return `${day.open} – ${day.close}`;
}
