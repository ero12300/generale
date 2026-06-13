/**
 * Piani commerciali di RistoProfit OS (vedi documento operativo, sez. 13).
 * Importi in centesimi interi.
 */

import { type Plan } from "./types";
import { toCents } from "./money";

export const PLANS: Plan[] = [
  {
    id: "start",
    name: "Start",
    monthlyCents: toCents(59),
    setupCents: toCents(490),
    target: "Piccoli bar, take away, locali semplici con pochi prodotti.",
    features: [
      "1 locale",
      "Fino a 30 ricette",
      "Fino a 100 ingredienti",
      "Food cost base",
      "Dashboard",
      "Report settimanale",
      "Caricamento fatture manuale",
      "1 utente titolare",
      "Supporto email",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyCents: toCents(129),
    setupCents: toCents(990),
    target: "Ristoranti, pizzerie, gelaterie, pasticcerie con menu strutturato.",
    highlighted: true,
    features: [
      "1 locale",
      "Fino a 100 ricette",
      "Ingredienti illimitati",
      "Food cost avanzato",
      "Menu engineering",
      "Report giornaliero",
      "Fatture fornitori + storico prezzi",
      "Magazzino semplice e lista riordino",
      "Suggerimenti prezzo",
      "3 utenti",
      "Supporto prioritario",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    monthlyCents: toCents(249),
    setupCents: toCents(1990),
    target: "Locali strutturati, cucine complesse, controllo manageriale.",
    features: [
      "Tutto il piano Pro",
      "Fino a 10 utenti",
      "Report WhatsApp / Telegram",
      "Controllo personale",
      "Produzione giornaliera consigliata",
      "AI advisor",
      "Analisi menu mensile",
      "Confronto fornitori",
      "Report PDF mensile",
      "Call mensile di controllo",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyCents: null,
    setupCents: toCents(3000),
    priceLabel: "Su preventivo",
    target: "Catene, franchising, più punti vendita.",
    features: [
      "Multi-sede",
      "Utenti illimitati",
      "Report direzionale",
      "Confronto tra sedi",
      "Dashboard di gruppo",
      "Account manager dedicato",
      "Integrazioni personalizzate",
    ],
  },
];

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
