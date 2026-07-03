import type { PlanId } from "./types";

export interface PlanInfo {
  id: PlanId;
  name: string;
  priceLabel: string;
  priceCents: number;
  tagline: string;
  highlighted: boolean;
  features: string[];
  cta: string;
}

export const PLANS: PlanInfo[] = [
  {
    id: "base",
    name: "Base",
    priceLabel: "Gratis",
    priceCents: 0,
    tagline: "Per iniziare a organizzare il salone",
    highlighted: false,
    features: [
      "1 postazione / barbiere",
      "Agenda prenotazioni interna",
      "Database clienti illimitato",
      "Registro incassi giornaliero",
      "1 campagna sconto attiva",
    ],
    cta: "Inizia gratis",
  },
  {
    id: "pro",
    name: "Pro",
    priceLabel: "29€",
    priceCents: 2900,
    tagline: "Tutto ciò che serve per far crescere il business",
    highlighted: true,
    features: [
      "Fino a 10 barbieri",
      "Prenotazioni online per i clienti",
      "Campagne sconto & Porta un Amico illimitate",
      "Analytics incassi avanzate",
      "Programma fedeltà a punti",
      "Report e statistiche clienti",
      "Supporto prioritario",
    ],
    cta: "Passa a Pro",
  },
];

export function getPlan(id: PlanId): PlanInfo {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}
