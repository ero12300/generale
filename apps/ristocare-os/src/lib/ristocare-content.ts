export type CommercialPlan = {
  name: string;
  price: string;
  setup: string;
  audience: string;
  equipmentLimit: string;
  includes: string[];
};

export type ProductHighlight = {
  title: string;
  description: string;
};

export type WorkflowStep = {
  label: string;
  title: string;
  description: string;
};

export const productHighlights: ProductHighlight[] = [
  {
    title: "QR code per ogni attrezzatura",
    description:
      "Ogni macchina apre scheda, manuale, matricola, garanzia e ticket in pochi secondi.",
  },
  {
    title: "Ticket tecnico centralizzato",
    description:
      "Il cliente parla con RistoCare; la centrale qualifica, coordina tecnico e preventivo.",
  },
  {
    title: "Archivio documenti e garanzie",
    description:
      "Manuali, fatture, foto etichetta e scadenze restano ordinati per locale e macchina.",
  },
  {
    title: "Manutenzione preventiva",
    description:
      "Reminder, report mensili e criticita aiutano a ridurre fermi macchina e urgenze.",
  },
];

export const commercialPlans: CommercialPlan[] = [
  {
    name: "RistoCare Start",
    price: "49 euro/mese",
    setup: "Setup da 300 euro",
    audience: "Piccoli bar, take away e locali semplici.",
    equipmentLimit: "Fino a 10 attrezzature",
    includes: ["QR code", "Archivio documenti", "Apertura ticket", "Supporto email"],
  },
  {
    name: "RistoCare Pro",
    price: "99 euro/mese",
    setup: "Setup da 700 euro",
    audience: "Ristoranti, pizzerie, gelaterie e pasticcerie.",
    equipmentLimit: "Fino a 30 attrezzature",
    includes: [
      "Gestione ricambi",
      "Report mensile",
      "Alert scadenze",
      "Centrale tecnica RistoCare",
    ],
  },
  {
    name: "RistoCare Premium",
    price: "199 euro/mese",
    setup: "Setup da 1.500 euro",
    audience: "Locali strutturati e ad alto volume.",
    equipmentLimit: "Fino a 70 attrezzature",
    includes: [
      "Ticket prioritari",
      "Dashboard avanzata",
      "Procedure operative",
      "Analisi costi",
    ],
  },
  {
    name: "RistoCare Enterprise",
    price: "Su preventivo",
    setup: "Setup dedicato",
    audience: "Catene, franchising e gruppi multi-sede.",
    equipmentLimit: "Multi-sede",
    includes: [
      "SLA dedicato",
      "Dashboard direzionale",
      "Account manager",
      "Integrazioni esterne",
    ],
  },
];

export const ticketStatuses = [
  "Nuovo",
  "In verifica",
  "Richiesta informazioni",
  "In attesa tecnico",
  "Preventivo ricevuto",
  "Preventivo inviato al cliente",
  "Accettato",
  "Programmato",
  "In intervento",
  "In attesa ricambio",
  "Risolto",
  "Chiuso",
  "Non coperto da garanzia",
  "Contestato",
  "Annullato",
];

export const userRoles = [
  "Super Admin RistoCare",
  "Operatore RistoCare",
  "Admin Cliente",
  "Dipendente Cliente",
  "Tecnico Partner",
  "Referral Partner",
];

export const workflowSteps: WorkflowStep[] = [
  {
    label: "01",
    title: "Digitalizzi il locale",
    description:
      "Censimento attrezzature, foto matricole, documenti, garanzie e QR code.",
  },
  {
    label: "02",
    title: "Il cliente apre ticket",
    description:
      "Da portale, QR, WhatsApp Business o assistente telefonico con foto e urgenza.",
  },
  {
    label: "03",
    title: "RistoCare qualifica",
    description:
      "Verifica garanzia, categoria guasto, dati macchina e informazioni mancanti.",
  },
  {
    label: "04",
    title: "Preventivo e intervento",
    description:
      "Tecnico partner, prezzo interno, margine RistoCare e preventivo cliente.",
  },
];

export const launchOffer = {
  name: "RistoCare Launch Messina",
  description:
    "Per i primi 10 locali: setup agevolato, QR code inclusi, report iniziale e Start incluso per i clienti Emotive.",
  primaryAction: "Richiedi una demo",
  secondaryAction: "Digitalizza il tuo locale",
};
