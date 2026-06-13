import type { PlanId } from "@/lib/types";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  monthlyPrice: number | null; // null = su preventivo
  setupFrom: number | null;
  maxEquipment: number | null; // null = illimitato
  highlighted: boolean;
  audience: string;
  features: string[];
  referralReward: string;
}

// Piani commerciali (sez. 8 documento strategico).
export const PLANS: Plan[] = [
  {
    id: "start",
    name: "RistoCare Start",
    tagline: "Per piccoli bar, take away e locali semplici.",
    monthlyPrice: 49,
    setupFrom: 300,
    maxEquipment: 10,
    highlighted: false,
    audience: "Bar, take away, locali semplici",
    features: [
      "Fino a 10 attrezzature",
      "Scheda digitale + QR code",
      "Archivio documenti, manuali e fatture",
      "Scadenza garanzia e promemoria base",
      "Apertura ticket e storico segnalazioni",
      "Area cliente e supporto email",
    ],
    referralReward: "50 €",
  },
  {
    id: "pro",
    name: "RistoCare Pro",
    tagline: "Per ristoranti, pizzerie, gelaterie, pasticcerie.",
    monthlyPrice: 99,
    setupFrom: 700,
    maxEquipment: 30,
    highlighted: true,
    audience: "Ristoranti, pizzerie, gelaterie",
    features: [
      "Fino a 30 attrezzature",
      "QR code per ogni macchina",
      "Ticket assistenza con priorità media",
      "Gestione ricambi e promemoria manutenzioni",
      "Report mensile e storico interventi",
      "Dashboard costi e gestione fornitori tecnici",
      "Assistente telefonico per apertura richiesta",
    ],
    referralReward: "100 €",
  },
  {
    id: "premium",
    name: "RistoCare Premium",
    tagline: "Per locali strutturati e ad alto volume.",
    monthlyPrice: 199,
    setupFrom: 1500,
    maxEquipment: 70,
    highlighted: false,
    audience: "Locali strutturati, alto volume",
    features: [
      "Fino a 70 attrezzature, multi-area",
      "Ticket prioritari e assistente dedicato",
      "Report mensile dettagliato e analisi costi",
      "Piano sostituzione attrezzature",
      "Supporto WhatsApp Business",
      "Fascicolo tecnico locale + export PDF",
      "Procedure operative per dipendenti",
    ],
    referralReward: "200 €",
  },
  {
    id: "enterprise",
    name: "RistoCare Enterprise",
    tagline: "Per catene, franchising e gruppi multi-sede.",
    monthlyPrice: null,
    setupFrom: null,
    maxEquipment: null,
    highlighted: false,
    audience: "Catene, franchising, multi-sede",
    features: [
      "Multi-sede e utenti illimitati",
      "Dashboard direzionale e confronto costi tra sedi",
      "SLA dedicato e account manager",
      "Listino ricambi personalizzato",
      "Gestione rete tecnici estesa",
      "Integrazione con software esterni",
    ],
    referralReward: "Accordo dedicato",
  },
];

export function getPlan(id: PlanId): Plan {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) {
    throw new Error(`Piano non trovato: ${id}`);
  }
  return plan;
}
