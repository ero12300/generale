import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const eur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

/** Formatta un importo in centesimi come valuta EUR. */
export function formatCents(cents: number): string {
  return eur.format((cents ?? 0) / 100);
}

/** Converte una stringa "25,00" o "25.00" o "25" in centesimi interi. */
export function parseEuroToCents(input: string): number {
  const normalized = String(input).trim().replace(/\./g, "").replace(",", ".");
  const value = Number.parseFloat(normalized);
  if (Number.isNaN(value)) return 0;
  return Math.round(value * 100);
}

export function centsToEuroInput(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

const dateFmt = new Intl.DateTimeFormat("it-IT", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const dateTimeFmt = new Intl.DateTimeFormat("it-IT", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const timeFmt = new Intl.DateTimeFormat("it-IT", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return dateTimeFmt.format(new Date(iso));
}

export function formatTime(iso: string): string {
  return timeFmt.format(new Date(iso));
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function genId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function genReferralCode(firstName: string): string {
  const base = firstName.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 4) || "AMICO";
  return `${base}${Math.floor(1000 + Math.random() * 9000)}`;
}
