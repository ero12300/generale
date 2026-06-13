/**
 * Motore Menu Engineering di RistoProfit OS.
 *
 * Classifica i prodotti del menu in base a popolarità (quanto vendono) e
 * redditività (margine lordo per unità), nelle 4 categorie classiche:
 *
 *  - star            → vende tanto e margina bene  → spingere
 *  - puzzle          → margina bene ma vende poco  → migliorare foto/descrizione
 *  - cavallo         → vende tanto ma margina poco → aumentare prezzo / ridurre costo
 *  - dog             → vende poco e margina poco   → eliminare o sostituire
 *
 * Funzioni pure: nessun side effect. Importi in CENTESIMI interi.
 */

import { type Cents } from "./money";

export type MenuCategory = "star" | "puzzle" | "cavallo" | "dog";

export interface MenuItemInput {
  id: string;
  name: string;
  /** Unità vendute nel periodo. */
  unitsSold: number;
  /** Margine lordo per unità, in centesimi. */
  marginCents: Cents;
}

export interface MenuItemResult extends MenuItemInput {
  category: MenuCategory;
  /** Quota di popolarità sul totale unità vendute (0..1). */
  popularityShare: number;
  /** Margine lordo totale generato dal prodotto, in centesimi. */
  totalMarginCents: Cents;
  action: string;
  /** True se popolarità sopra la soglia. */
  highPopularity: boolean;
  /** True se margine sopra la media. */
  highMargin: boolean;
}

export interface MenuEngineeringResult {
  items: MenuItemResult[];
  /** Quota media di popolarità (1 / numero prodotti). */
  averagePopularityShare: number;
  /** Soglia di popolarità usata per la classificazione (0..1). */
  popularityThreshold: number;
  /** Margine medio per unità, in centesimi. */
  averageMarginCents: Cents;
  counts: Record<MenuCategory, number>;
}

const ACTIONS: Record<MenuCategory, string> = {
  star: "Spingere: in evidenza nel menu, nelle combo e nei suggerimenti.",
  puzzle:
    "Migliorare descrizione e foto, riposizionare nel menu o proporre in upselling.",
  cavallo:
    "Aumentare leggermente il prezzo o ridurre il costo: vende ma margina poco.",
  dog: "Eliminare o sostituire: vende poco e margina poco.",
};

function classify(highPopularity: boolean, highMargin: boolean): MenuCategory {
  if (highPopularity && highMargin) return "star";
  if (!highPopularity && highMargin) return "puzzle";
  if (highPopularity && !highMargin) return "cavallo";
  return "dog";
}

/**
 * Esegue la classificazione menu engineering.
 *
 * Convenzione standard del settore: la soglia di popolarità è il 70% della
 * quota media (1/N). Un prodotto è "popolare" se la sua quota di vendite supera
 * questa soglia. È "redditizio" se il suo margine per unità è >= margine medio.
 */
export function computeMenuEngineering(
  items: MenuItemInput[],
  popularityFactor = 0.7,
): MenuEngineeringResult {
  const emptyCounts: Record<MenuCategory, number> = {
    star: 0,
    puzzle: 0,
    cavallo: 0,
    dog: 0,
  };

  if (items.length === 0) {
    return {
      items: [],
      averagePopularityShare: 0,
      popularityThreshold: 0,
      averageMarginCents: 0,
      counts: emptyCounts,
    };
  }

  const totalUnits = items.reduce((s, i) => s + i.unitsSold, 0);
  const totalMargin = items.reduce((s, i) => s + i.marginCents, 0);
  const averageMarginCents = Math.round(totalMargin / items.length);
  const averagePopularityShare = 1 / items.length;
  const popularityThreshold = averagePopularityShare * popularityFactor;

  const counts: Record<MenuCategory, number> = { ...emptyCounts };

  const results: MenuItemResult[] = items.map((item) => {
    const popularityShare = totalUnits > 0 ? item.unitsSold / totalUnits : 0;
    const highPopularity = popularityShare >= popularityThreshold;
    const highMargin = item.marginCents >= averageMarginCents;
    const category = classify(highPopularity, highMargin);
    counts[category] += 1;
    return {
      ...item,
      popularityShare,
      totalMarginCents: item.marginCents * item.unitsSold,
      category,
      action: ACTIONS[category],
      highPopularity,
      highMargin,
    };
  });

  return {
    items: results,
    averagePopularityShare,
    popularityThreshold,
    averageMarginCents,
    counts,
  };
}

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  star: "Star",
  puzzle: "Puzzle",
  cavallo: "Cavallo da lavoro",
  dog: "Dog",
};
