export function formatCurrency(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function formatTime(time: string): string {
  return time;
}

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

export function generateTimeSlots(from: string, to: string, slotMinutes: number): string[] {
  const slots: string[] = [];
  let current = from;
  while (current < to) {
    slots.push(current);
    current = addMinutesToTime(current, slotMinutes);
  }
  return slots;
}
