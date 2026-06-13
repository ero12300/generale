/**
 * Dati demo in-memory di RistoProfit OS.
 *
 * Senza Supabase configurato, la piattaforma usa questi dati per dimostrare UI e
 * flussi (modalità demo). In produzione gli stessi dati arrivano da Postgres con
 * Row Level Security per tenant. Importi in CENTESIMI interi.
 */

import { type Recipe, computeFoodCost } from "./food-cost";
import { type MenuItemInput } from "./menu-engineering";
import { type Organization, type PriceTrend, type DailyKpi } from "./types";
import { toCents } from "./money";

export const DEMO_ORG: Organization = {
  id: "org-lumachina",
  name: "Ristorante La Lumachina S.r.l.",
  city: "Messina",
  planId: "pro",
  modules: { ristoprofit: true, ristocare: false },
};

export const DEMO_RECIPES: Recipe[] = [
  {
    id: "pizza-pistacchio",
    name: "Pizza Pistacchio",
    salePriceCents: toCents(13),
    portions: 1,
    ingredients: [
      { name: "Farina 00", packPriceCents: toCents(0.9), packSize: 1000, quantity: 260, unit: "g" },
      { name: "Mozzarella fiordilatte", packPriceCents: toCents(7.5), packSize: 1000, quantity: 150, unit: "g" },
      { name: "Crema di pistacchio", packPriceCents: toCents(22), packSize: 1000, quantity: 80, unit: "g", wastePct: 5 },
      { name: "Mortadella", packPriceCents: toCents(12), packSize: 1000, quantity: 60, unit: "g" },
      { name: "Granella di pistacchio", packPriceCents: toCents(30), packSize: 1000, quantity: 15, unit: "g" },
      { name: "Olio EVO", packPriceCents: toCents(8), packSize: 1000, quantity: 10, unit: "ml" },
    ],
  },
  {
    id: "pizza-bufala",
    name: "Pizza Bufala",
    salePriceCents: toCents(11),
    portions: 1,
    ingredients: [
      { name: "Farina 00", packPriceCents: toCents(0.9), packSize: 1000, quantity: 260, unit: "g" },
      { name: "Passata di pomodoro", packPriceCents: toCents(1.6), packSize: 1000, quantity: 120, unit: "g" },
      { name: "Mozzarella di bufala", packPriceCents: toCents(13), packSize: 1000, quantity: 150, unit: "g", wastePct: 8 },
      { name: "Basilico", packPriceCents: toCents(40), packSize: 1000, quantity: 5, unit: "g" },
      { name: "Olio EVO", packPriceCents: toCents(8), packSize: 1000, quantity: 10, unit: "ml" },
    ],
  },
  {
    id: "margherita",
    name: "Pizza Margherita",
    salePriceCents: toCents(7),
    portions: 1,
    ingredients: [
      { name: "Farina 00", packPriceCents: toCents(0.9), packSize: 1000, quantity: 260, unit: "g" },
      { name: "Passata di pomodoro", packPriceCents: toCents(1.6), packSize: 1000, quantity: 120, unit: "g" },
      { name: "Mozzarella fiordilatte", packPriceCents: toCents(7.5), packSize: 1000, quantity: 120, unit: "g" },
      { name: "Olio EVO", packPriceCents: toCents(8), packSize: 1000, quantity: 8, unit: "ml" },
    ],
  },
  {
    id: "burger-special",
    name: "Burger Special",
    salePriceCents: toCents(11),
    portions: 1,
    ingredients: [
      { name: "Pane burger", packPriceCents: toCents(0.5), packSize: 1, quantity: 1, unit: "pz" },
      { name: "Hamburger manzo 180g", packPriceCents: toCents(14), packSize: 1000, quantity: 180, unit: "g" },
      { name: "Cheddar", packPriceCents: toCents(11), packSize: 1000, quantity: 40, unit: "g" },
      { name: "Bacon", packPriceCents: toCents(13), packSize: 1000, quantity: 40, unit: "g" },
      { name: "Salse e contorni", packPriceCents: toCents(60), packSize: 100, quantity: 60, unit: "g" },
    ],
  },
  {
    id: "tagliere-aperitivo",
    name: "Tagliere Aperitivo",
    salePriceCents: toCents(16),
    portions: 2,
    ingredients: [
      { name: "Salumi misti", packPriceCents: toCents(18), packSize: 1000, quantity: 180, unit: "g" },
      { name: "Formaggi misti", packPriceCents: toCents(15), packSize: 1000, quantity: 160, unit: "g" },
      { name: "Confetture", packPriceCents: toCents(12), packSize: 1000, quantity: 50, unit: "g" },
      { name: "Pane / grissini", packPriceCents: toCents(3), packSize: 1000, quantity: 120, unit: "g" },
    ],
  },
  {
    id: "brioche-gelato",
    name: "Brioche col Tuppo",
    salePriceCents: toCents(2.5),
    portions: 1,
    ingredients: [
      { name: "Farina 00", packPriceCents: toCents(0.9), packSize: 1000, quantity: 90, unit: "g" },
      { name: "Burro", packPriceCents: toCents(9), packSize: 1000, quantity: 25, unit: "g" },
      { name: "Uova", packPriceCents: toCents(0.25), packSize: 1, quantity: 0.4, unit: "pz" },
      { name: "Zucchero", packPriceCents: toCents(1.2), packSize: 1000, quantity: 20, unit: "g" },
    ],
  },
];

/** Unità vendute nel periodo, per prodotto (per il menu engineering). */
export const DEMO_UNITS_SOLD: Record<string, number> = {
  "pizza-pistacchio": 132,
  "pizza-bufala": 64,
  margherita: 118,
  "burger-special": 41,
  "tagliere-aperitivo": 22,
  "brioche-gelato": 210,
};

/** Costruisce gli input del menu engineering da ricette + vendite. */
export function buildMenuItems(): MenuItemInput[] {
  return DEMO_RECIPES.map((recipe) => {
    const fc = computeFoodCost(recipe);
    return {
      id: recipe.id,
      name: recipe.name,
      unitsSold: DEMO_UNITS_SOLD[recipe.id] ?? 0,
      marginCents: fc.grossMarginCents,
    };
  });
}

export const DEMO_PRICE_TRENDS: PriceTrend[] = [
  { ingredient: "Pistacchio", changeRatio: 0.12 },
  { ingredient: "Mozzarella di bufala", changeRatio: 0.08 },
  { ingredient: "Olio EVO", changeRatio: 0.05 },
  { ingredient: "Farina 00", changeRatio: -0.02 },
];

export const DEMO_LOW_STOCK = [
  { name: "Farina 00", qty: "8 kg", min: "15 kg" },
  { name: "Passata di pomodoro", qty: "6 L", min: "12 L" },
  { name: "Mozzarella di bufala", qty: "2 kg", min: "5 kg" },
];

export const DEMO_KPI_TODAY: DailyKpi = {
  date: new Date().toISOString().slice(0, 10),
  revenueCents: toCents(2430),
  covers: 86,
  staffCostCents: toCents(520),
  foodCostRatio: 0.31,
};

/** Storico incassi ultimi 7 giorni (centesimi). */
export const DEMO_REVENUE_7D: { day: string; revenueCents: number }[] = [
  { day: "Lun", revenueCents: toCents(1420) },
  { day: "Mar", revenueCents: toCents(1180) },
  { day: "Mer", revenueCents: toCents(1640) },
  { day: "Gio", revenueCents: toCents(1890) },
  { day: "Ven", revenueCents: toCents(2520) },
  { day: "Sab", revenueCents: toCents(2430) },
  { day: "Dom", revenueCents: toCents(2980) },
];
