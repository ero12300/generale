import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatta importi in EUR con 2 decimali. Non usa float sensibili: solo display. */
export function formatEuro(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

/** Formatta una data in formato italiano (es: "mar 15 apr, 14:30"). */
export function formatDateIt(iso: string, opts: { withTime?: boolean } = {}) {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(d);
  if (!opts.withTime) return date;
  const time = new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return `${date}, ${time}`;
}

/** Slug urlsafe da una stringa qualsiasi. */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Genera iniziali (es. "Marco Rossi" -> "MR"). */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
