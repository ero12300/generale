import type {
  DailySales,
  Ingredient,
  OrganizationSummary,
  Recipe,
  ReferralLead,
  SalesAgent,
  StaffShift,
  Supplier,
  SupplierInvoice,
} from "./types";

/**
 * Demo store in-memory: senza variabili Supabase l'app mostra
 * dati realistici di un locale pilota di Messina ("Trattoria del Porto").
 */

export const DEMO_ORG = {
  id: "org-demo",
  name: "Trattoria del Porto S.r.l.",
  location: "Messina — Via Garibaldi 12",
  plan: "pro" as const,
};

export const suppliers: Supplier[] = [
  { id: "sup-caseificio", name: "Caseificio Siciliano", city: "Messina" },
  { id: "sup-molino", name: "Molino Calabrese", city: "Villa San Giovanni" },
  { id: "sup-ortofrutta", name: "Ortofrutta Mercato MS", city: "Messina" },
  { id: "sup-bronte", name: "Pistacchi di Bronte SRL", city: "Bronte" },
  { id: "sup-carni", name: "Carni del Sud", city: "Catania" },
];

export const ingredients: Ingredient[] = [
  { id: "ing-farina", name: "Farina 00", unit: "kg", priceCents: 120, previousPriceCents: 120, supplierId: "sup-molino", stockQty: 18, minStockQty: 25 },
  { id: "ing-mozzarella", name: "Mozzarella fiordilatte", unit: "kg", priceCents: 872, previousPriceCents: 800, supplierId: "sup-caseificio", stockQty: 9, minStockQty: 6 },
  { id: "ing-bufala", name: "Mozzarella di bufala DOP", unit: "kg", priceCents: 1250, previousPriceCents: 1180, supplierId: "sup-caseificio", stockQty: 4, minStockQty: 3 },
  { id: "ing-pistacchio", name: "Pesto di pistacchio Bronte", unit: "kg", priceCents: 3920, previousPriceCents: 3500, supplierId: "sup-bronte", stockQty: 2, minStockQty: 2 },
  { id: "ing-passata", name: "Passata di pomodoro", unit: "l", priceCents: 210, previousPriceCents: 210, supplierId: "sup-ortofrutta", stockQty: 10, minStockQty: 15 },
  { id: "ing-mortadella", name: "Mortadella IGP", unit: "kg", priceCents: 1450, previousPriceCents: 1450, supplierId: "sup-carni", stockQty: 3, minStockQty: 2 },
  { id: "ing-manzo", name: "Hamburger di manzo 200g", unit: "pz", priceCents: 280, previousPriceCents: 245, supplierId: "sup-carni", stockQty: 24, minStockQty: 20 },
  { id: "ing-pane-burger", name: "Pane burger artigianale", unit: "pz", priceCents: 90, previousPriceCents: 90, supplierId: "sup-molino", stockQty: 30, minStockQty: 24 },
  { id: "ing-salumi", name: "Misto salumi e formaggi", unit: "kg", priceCents: 1980, previousPriceCents: 1950, supplierId: "sup-carni", stockQty: 5, minStockQty: 3 },
  { id: "ing-gamberi", name: "Gamberi rossi di Mazara", unit: "kg", priceCents: 4200, previousPriceCents: 4200, supplierId: "sup-ortofrutta", stockQty: 1.5, minStockQty: 2 },
  { id: "ing-spaghetti", name: "Spaghetti di Gragnano", unit: "kg", priceCents: 380, previousPriceCents: 380, supplierId: "sup-molino", stockQty: 14, minStockQty: 10 },
];

export const recipes: Recipe[] = [
  {
    id: "rec-pizza-pistacchio",
    name: "Pizza Pistacchio",
    category: "Pizze",
    items: [
      { ingredientId: "ing-farina", quantity: 250, wastePct: 0 },
      { ingredientId: "ing-mozzarella", quantity: 110, wastePct: 5 },
      { ingredientId: "ing-pistacchio", quantity: 55, wastePct: 0 },
      { ingredientId: "ing-mortadella", quantity: 60, wastePct: 3 },
    ],
    packagingCents: 25,
    salePriceCents: 1300,
    vatPct: 10,
    portions: 1,
    soldLast30: 412,
  },
  {
    id: "rec-pizza-bufala",
    name: "Pizza Bufala",
    category: "Pizze",
    items: [
      { ingredientId: "ing-farina", quantity: 250, wastePct: 0 },
      { ingredientId: "ing-passata", quantity: 90, wastePct: 0 },
      { ingredientId: "ing-bufala", quantity: 130, wastePct: 8 },
    ],
    packagingCents: 25,
    salePriceCents: 1050,
    vatPct: 10,
    portions: 1,
    soldLast30: 365,
  },
  {
    id: "rec-burger-special",
    name: "Burger Special",
    category: "Cucina",
    items: [
      { ingredientId: "ing-manzo", quantity: 1, wastePct: 0 },
      { ingredientId: "ing-pane-burger", quantity: 1, wastePct: 0 },
      { ingredientId: "ing-mozzarella", quantity: 80, wastePct: 5 },
      { ingredientId: "ing-salumi", quantity: 40, wastePct: 0 },
    ],
    packagingCents: 35,
    salePriceCents: 1100,
    vatPct: 10,
    portions: 1,
    soldLast30: 298,
  },
  {
    id: "rec-tagliere",
    name: "Tagliere Aperitivo",
    category: "Antipasti",
    items: [
      { ingredientId: "ing-salumi", quantity: 180, wastePct: 2 },
      { ingredientId: "ing-pane-burger", quantity: 2, wastePct: 0 },
    ],
    packagingCents: 15,
    salePriceCents: 1600,
    vatPct: 10,
    portions: 1,
    soldLast30: 105,
  },
  {
    id: "rec-spaghetti-gamberi",
    name: "Spaghetti ai gamberi rossi",
    category: "Primi",
    items: [
      { ingredientId: "ing-spaghetti", quantity: 120, wastePct: 0 },
      { ingredientId: "ing-gamberi", quantity: 140, wastePct: 25 },
      { ingredientId: "ing-passata", quantity: 40, wastePct: 0 },
    ],
    packagingCents: 0,
    salePriceCents: 1800,
    vatPct: 10,
    portions: 1,
    soldLast30: 62,
  },
  {
    id: "rec-bruschette",
    name: "Bruschette classiche",
    category: "Antipasti",
    items: [
      { ingredientId: "ing-pane-burger", quantity: 2, wastePct: 0 },
      { ingredientId: "ing-passata", quantity: 60, wastePct: 0 },
    ],
    packagingCents: 10,
    salePriceCents: 450,
    vatPct: 10,
    portions: 1,
    soldLast30: 48,
  },
];

export const invoices: SupplierInvoice[] = [
  {
    id: "ft-2026-0412",
    supplierId: "sup-caseificio",
    date: "2026-06-10",
    totalCents: 41850,
    status: "verificata",
    items: [
      { ingredientId: "ing-mozzarella", quantity: 30, unitPriceCents: 872 },
      { ingredientId: "ing-bufala", quantity: 12, unitPriceCents: 1250 },
    ],
  },
  {
    id: "ft-2026-0398",
    supplierId: "sup-bronte",
    date: "2026-06-08",
    totalCents: 19600,
    status: "verificata",
    items: [{ ingredientId: "ing-pistacchio", quantity: 5, unitPriceCents: 3920 }],
  },
  {
    id: "ft-2026-0421",
    supplierId: "sup-carni",
    date: "2026-06-11",
    totalCents: 30640,
    status: "da_verificare",
    items: [
      { ingredientId: "ing-manzo", quantity: 80, unitPriceCents: 280 },
      { ingredientId: "ing-salumi", quantity: 4, unitPriceCents: 1980 },
    ],
  },
];

export const todayShifts: StaffShift[] = [
  { staffId: "st-1", name: "Giuseppe R.", role: "Pizzaiolo", hours: 8, hourlyCostCents: 1400 },
  { staffId: "st-2", name: "Maria C.", role: "Cucina", hours: 7, hourlyCostCents: 1250 },
  { staffId: "st-3", name: "Antonio L.", role: "Sala", hours: 8, hourlyCostCents: 1100 },
  { staffId: "st-4", name: "Francesca P.", role: "Sala", hours: 6, hourlyCostCents: 1100 },
  { staffId: "st-5", name: "Salvo M.", role: "Banco/Cassa", hours: 8, hourlyCostCents: 1150 },
];

export const todaySales: DailySales = {
  date: "2026-06-12",
  revenueCents: 243000,
  covers: 86,
};

export const last7DaysSales: DailySales[] = [
  { date: "2026-06-06", revenueCents: 281500, covers: 102 },
  { date: "2026-06-07", revenueCents: 312000, covers: 118 },
  { date: "2026-06-08", revenueCents: 168000, covers: 61 },
  { date: "2026-06-09", revenueCents: 175500, covers: 64 },
  { date: "2026-06-10", revenueCents: 198000, covers: 73 },
  { date: "2026-06-11", revenueCents: 221000, covers: 79 },
  { date: "2026-06-12", revenueCents: 243000, covers: 86 },
];

/** Vendite per prodotto dello stesso giorno della settimana scorsa, per la produzione consigliata. */
export const productionHistory: { recipeId: string; name: string; soldSameDayLastWeek: number }[] = [
  { recipeId: "rec-pizza-pistacchio", name: "Pizza Pistacchio", soldSameDayLastWeek: 18 },
  { recipeId: "rec-pizza-bufala", name: "Pizza Bufala", soldSameDayLastWeek: 15 },
  { recipeId: "rec-burger-special", name: "Burger Special", soldSameDayLastWeek: 11 },
  { recipeId: "rec-tagliere", name: "Tagliere Aperitivo", soldSameDayLastWeek: 6 },
  { recipeId: "rec-spaghetti-gamberi", name: "Spaghetti ai gamberi rossi", soldSameDayLastWeek: 4 },
];

export const organizations: OrganizationSummary[] = [
  { id: "org-demo", name: "Trattoria del Porto S.r.l.", city: "Messina", plan: "pro", status: "attivo", mrrCents: 9900, agentId: "ag-1" },
  { id: "org-2", name: "Gelateria Zanclea", city: "Messina", plan: "premium", status: "attivo", mrrCents: 24900, agentId: "ag-1" },
  { id: "org-3", name: "Bar Duomo", city: "Messina", plan: "start", status: "attivo", mrrCents: 5900, agentId: "ag-2" },
  { id: "org-4", name: "Pizzeria Stretto", city: "Villafranca Tirrena", plan: "pro", status: "in_prova", mrrCents: 0, agentId: "ag-2" },
  { id: "org-5", name: "Pasticceria Irrera 1910", city: "Messina", plan: "pro", status: "setup", mrrCents: 0, agentId: "ag-1" },
  { id: "org-6", name: "Lounge Marettimo", city: "Milazzo", plan: "start", status: "scaduto", mrrCents: 0 },
];

export const agents: SalesAgent[] = [
  {
    id: "ag-1",
    name: "Davide Costantino",
    level: "senior",
    activeClients: 7,
    mrrCents: 84600,
    setupSoldCents: 567000,
    demosDone: 14,
    commissionsAccruedCents: 121300,
    commissionsPaidCents: 86500,
  },
  {
    id: "ag-2",
    name: "Serena Aliquò",
    level: "base",
    activeClients: 3,
    mrrCents: 31700,
    setupSoldCents: 247000,
    demosDone: 9,
    commissionsAccruedCents: 49800,
    commissionsPaidCents: 31200,
  },
];

export const referralLeads: ReferralLead[] = [
  {
    id: "ref-1",
    partnerId: "pt-haccp",
    customerName: "Ristorante La Lumachina",
    city: "Messina",
    phone: "+39 090 000001",
    createdAt: "2026-05-02",
    status: "Premio pagato",
    plan: "pro",
    rewardCents: 10000,
    rewardPaid: true,
  },
  {
    id: "ref-2",
    partnerId: "pt-haccp",
    customerName: "Gastronomia Tre Archi",
    city: "Messina",
    phone: "+39 090 000002",
    createdAt: "2026-05-28",
    status: "Demo fissata",
  },
  {
    id: "ref-3",
    partnerId: "pt-haccp",
    customerName: "Bar Stazione Centrale",
    city: "Messina",
    phone: "+39 090 000003",
    createdAt: "2026-06-04",
    status: "Premio maturato",
    plan: "start",
    rewardCents: 5000,
    rewardPaid: false,
  },
  {
    id: "ref-4",
    partnerId: "pt-haccp",
    customerName: "Pizzeria Il Faro",
    city: "Reggio Calabria",
    phone: "+39 0965 000004",
    createdAt: "2026-06-09",
    status: "Nuovo",
  },
  {
    id: "ref-5",
    partnerId: "pt-haccp",
    customerName: "Trattoria del Porto",
    city: "Messina",
    phone: "+39 090 000005",
    createdAt: "2026-04-15",
    status: "Già presente",
  },
];

export const DEMO_PARTNER = {
  id: "pt-haccp",
  name: "Studio HACCP Consulting",
  code: "HACCP-ME-01",
  referralLink: "https://ristoprofit.emotive.it/r/HACCP-ME-01",
};
