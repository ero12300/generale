const BASE_RATES: Record<string, number> = {
  demolition: 25,
  masonry: 80,
  electrical: 45,
  plumbing: 50,
  hvac: 35,
  windows: 350,
  drywall: 30,
  flooring: 40,
  tiling: 45,
  painting: 12,
  bathroom: 4500,
  kitchen: 6000,
  doors: 250,
  lighting: 800,
  furnishing: 0,
  disposal: 500,
  inspection: 300,
};

export interface WorkItemTemplate {
  room: string;
  category: string;
  description: string;
  unit: string;
  quantity: number;
  unit_price: number;
  requires_permit?: boolean;
}

export interface WorkListRequest {
  surface_sqm: number;
  rooms?: number;
  condition?: string;
  include_kitchen?: boolean;
  include_bathrooms?: number;
}

export interface WorkListResponse {
  items: WorkItemTemplate[];
  total_estimated: number;
  notes: string[];
}

export function generateWorkList(req: WorkListRequest): WorkListResponse {
  const sqm = req.surface_sqm;
  const rooms = req.rooms ?? 3;
  const condition = req.condition ?? "da_ristrutturare";
  const includeBathrooms = req.include_bathrooms ?? 1;
  const items: WorkItemTemplate[] = [];
  const notes: string[] = [];

  if (condition === "da_ristrutturare" || condition === "pessimo" || condition === "ruin") {
    items.push({
      room: "Generale",
      category: "demolition",
      description: "Demolizioni selettive e rimozione finiture esistenti",
      unit: "mq",
      quantity: roundMoney(sqm * 0.3),
      unit_price: BASE_RATES.demolition,
      requires_permit: false,
    });
  }

  items.push(
    {
      room: "Generale",
      category: "masonry",
      description: "Opere murarie e rasature",
      unit: "mq",
      quantity: sqm,
      unit_price: BASE_RATES.masonry,
    },
    {
      room: "Generale",
      category: "electrical",
      description: "Rifacimento impianto elettrico a norma",
      unit: "mq",
      quantity: sqm,
      unit_price: BASE_RATES.electrical,
      requires_permit: true,
    },
    {
      room: "Generale",
      category: "plumbing",
      description: "Rifacimento impianto idrico-sanitario",
      unit: "mq",
      quantity: sqm,
      unit_price: BASE_RATES.plumbing,
      requires_permit: true,
    },
    {
      room: "Generale",
      category: "hvac",
      description: "Climatizzazione (split o centralizzato)",
      unit: "mq",
      quantity: sqm,
      unit_price: BASE_RATES.hvac,
    },
    {
      room: "Generale",
      category: "windows",
      description: "Sostituzione infissi",
      unit: "cad",
      quantity: Math.max(rooms + 1, 4),
      unit_price: BASE_RATES.windows,
    },
    {
      room: "Generale",
      category: "flooring",
      description: "Pavimentazione",
      unit: "mq",
      quantity: sqm,
      unit_price: BASE_RATES.flooring,
    },
    {
      room: "Generale",
      category: "painting",
      description: "Tinteggiatura pareti e soffitti",
      unit: "mq",
      quantity: sqm * 3.5,
      unit_price: BASE_RATES.painting,
    },
    {
      room: "Generale",
      category: "disposal",
      description: "Smaltimento macerie e trasporto",
      unit: "cad",
      quantity: 1,
      unit_price: BASE_RATES.disposal,
    },
    {
      room: "Generale",
      category: "inspection",
      description: "Collaudo impianti e certificazioni",
      unit: "cad",
      quantity: 1,
      unit_price: BASE_RATES.inspection,
      requires_permit: true,
    }
  );

  for (let i = 0; i < includeBathrooms; i += 1) {
    items.push({
      room: `Bagno ${i + 1}`,
      category: "bathroom",
      description: "Rifacimento completo bagno",
      unit: "cad",
      quantity: 1,
      unit_price: BASE_RATES.bathroom,
      requires_permit: true,
    });
  }

  if (req.include_kitchen !== false) {
    items.push({
      room: "Cucina",
      category: "kitchen",
      description: "Rifacimento cucina (impianti + mobili base)",
      unit: "cad",
      quantity: 1,
      unit_price: BASE_RATES.kitchen,
    });
  }

  const total = roundMoney(
    items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
  );

  const permitItems = items.filter((item) => item.requires_permit);
  if (permitItems.length > 0) {
    notes.push(`${permitItems.length} voci richiedono verifica titoli edilizi/permessi.`);
  }
  notes.push("Importi indicativi. Validare con preventivi d'impresa prima dell'impegno.");
  notes.push("Verificare agevolazioni fiscali applicabili con il commercialista.");

  return { items, total_estimated: total, notes };
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
