const DISCLAIMER =
  "BOZZA GENERATA AUTOMATICAMENTE — Non costituisce consulenza legale o fiscale. " +
  "Revisione obbligatoria da parte di avvocato/notaio prima dell'invio.";

const STRATEGY_LABELS: Record<string, string> = {
  fix_flip: "acquisto con finalità di riqualificazione e successiva vendita",
  buy_renovate_rent: "acquisto con ristrutturazione e locazione",
  buy_hold_sell: "acquisto con gestione patrimoniale e exit programmata",
};

export interface OfferLetterRequest {
  property_address: string;
  offered_price: number;
  asking_price: number;
  strategy: string;
  key_points?: string[];
  requested_documents?: string[];
  closing_days?: number;
  deposit_pct?: number;
}

export interface OfferLetterResponse {
  commercial_text: string;
  legal_placeholders: Array<{ key: string; text: string }>;
  disclaimer: string;
}

function formatMoney(value: number): string {
  return value.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function generateOfferLetter(req: OfferLetterRequest): OfferLetterResponse {
  const askingPrice = req.asking_price;
  const offeredPrice = req.offered_price;
  const discount =
    askingPrice > 0 ? ((askingPrice - offeredPrice) / askingPrice) * 100 : 0;
  const depositPct = req.deposit_pct ?? 0.05;
  const deposit = offeredPrice * depositPct;
  const closingDays = req.closing_days ?? 60;

  const pointsText =
    req.key_points && req.key_points.length > 0
      ? req.key_points.map((p) => `  • ${p}`).join("\n")
      : "  • Prezzo coerente con analisi di mercato e stato dell'immobile\n" +
        "  • Tempistiche definite per perizia e accesso tecnico";

  const docs =
    req.requested_documents ?? [
      "Visura catastale",
      "Planimetria catastale",
      "Atto di provenienza",
      "APE",
      "Conformità urbanistica",
    ];
  const docsText = docs.map((d) => `  • ${d}`).join("\n");

  const commercial = `PROPOSTA DI ACQUISTO — BOZZA COMMERCIALE

Oggetto: Immobile sito in ${req.property_address}

Gentile Venditore,

con la presente formuliamo proposta irrevocabile per ${closingDays} giorni
per l'acquisto dell'immobile in oggetto, alle seguenti condizioni economiche:

  Prezzo richiesto:     € ${formatMoney(askingPrice)}
  Prezzo offerto:       € ${formatMoney(offeredPrice)} (sconto circa ${discount.toFixed(1)}%)
  Caparra confirmatoria: € ${formatMoney(deposit)} (${(depositPct * 100).toFixed(0)}% del prezzo offerto)

Finalità dell'acquisto: ${STRATEGY_LABELS[req.strategy] ?? "investimento immobiliare"}.

Motivazione sintetica:
${pointsText}

Documentazione richiesta prima del rogito:
${docsText}

Tempistiche proposte:
  • Accettazione proposta: entro ${Math.floor(closingDays / 3)} giorni
  • Perizia tecnica e verifiche documentali: entro ${Math.floor(closingDays / 2)} giorni
  • Rogito: entro ${closingDays} giorni dall'accettazione

Restiamo a disposizione per un sopralluogo tecnico e per approfondire
ogni aspetto dell'operazione.

Cordiali saluti,
[SOCIETÀ ACQUIRENTE — da compilare]
`;

  return {
    commercial_text: commercial,
    legal_placeholders: [
      {
        key: "CLAUSOLA_SOSPENSIVA",
        text: "[INSERIRE clausole sospensive: mutuo, conformità urbanistica, assenza vincoli]",
      },
      {
        key: "CLAUSOLA_PENALE",
        text: "[INSERIRE penale per inadempimento — revisione legale obbligatoria]",
      },
      {
        key: "CLAUSOLA_PROPRIETÀ",
        text: "[INSERIRE dichiarazioni sullo stato di fatto e di diritto dell'immobile]",
      },
      {
        key: "CLAUSOLA_PRIVACY",
        text: "[INSERIRE informativa trattamento dati personali]",
      },
      {
        key: "FIRMA",
        text: "[FIRMA LEGALE RAPPRESENTANTE + TIMBRO SOCIETÀ]",
      },
    ],
    disclaimer: DISCLAIMER,
  };
}
