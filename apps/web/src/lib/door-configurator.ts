import { z } from "zod";

export const DOOR_MODELS = [
  {
    id: "compasso",
    label: "Porta a compasso (battente)",
    baseReductionWidthMm: 50,
    baseReductionHeightMm: 64,
    notes: "Regola pratica: vano muro circa +50 mm in larghezza e +64 mm in altezza rispetto al telaio.",
  },
  {
    id: "fisso",
    label: "Porta fissa",
    baseReductionWidthMm: 40,
    baseReductionHeightMm: 45,
    notes: "Modulo fisso senza apertura: riduzione inferiore rispetto al battente tradizionale.",
  },
  {
    id: "compasso_fisso",
    label: "Compasso + fisso laterale",
    baseReductionWidthMm: 80,
    baseReductionHeightMm: 64,
    notes: "Anta apribile con pannello fisso integrato: riduzione maggiore in larghezza.",
  },
] as const;

export type DoorModelId = (typeof DOOR_MODELS)[number]["id"];

const doorCalculationSchema = z.object({
  modelId: z.enum(["compasso", "fisso", "compasso_fisso"]),
  openingWidthMm: z.number().positive("La larghezza vano deve essere > 0"),
  openingHeightMm: z.number().positive("L'altezza vano deve essere > 0"),
  wallThicknessMm: z.number().positive("Lo spessore muro deve essere > 0"),
  deadWorkSideMm: z.number().min(0, "L'opera morta laterale non può essere negativa"),
  deadWorkTopMm: z.number().min(0, "L'opera morta superiore non può essere negativa"),
  deadWorkBottomMm: z.number().min(0, "L'opera morta inferiore non può essere negativa"),
  hingeSide: z.enum(["left", "right"]),
  openingMovement: z.enum(["pull", "push"]),
  hasVisionPanel: z.boolean(),
  hasOvalWindow: z.boolean(),
  hasFixedLeaf: z.boolean(),
  includeDisplay: z.boolean(),
});

export type DoorCalculationInput = z.input<typeof doorCalculationSchema>;

export interface DoorCalculationResult {
  modelId: DoorModelId;
  modelLabel: string;
  openingWidthMm: number;
  openingHeightMm: number;
  wallThicknessMm: number;
  productionWidthMm: number;
  productionHeightMm: number;
  totalReductionWidthMm: number;
  totalReductionHeightMm: number;
  deadWorkSideMm: number;
  deadWorkTopMm: number;
  deadWorkBottomMm: number;
  openingSideLabel: "destra" | "sinistra";
  handleSideLabel: "destra" | "sinistra";
  handingLabel: string;
  openingMovementLabel: "a tirare" | "a spingere";
  hasVisionPanel: boolean;
  hasOvalWindow: boolean;
  hasFixedLeaf: boolean;
  includeDisplay: boolean;
  technicalNotes: string;
}

export function calculateDoorConfiguration(input: DoorCalculationInput):
  | { ok: true; data: DoorCalculationResult }
  | { ok: false; errors: string[] } {
  const parsed = doorCalculationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((issue) => issue.message),
    };
  }

  const safeInput = parsed.data;
  const model = DOOR_MODELS.find((item) => item.id === safeInput.modelId);
  if (!model) {
    return { ok: false, errors: ["Modello porta non riconosciuto"] };
  }

  const extraFixedReduction = safeInput.hasFixedLeaf ? 30 : 0;
  const totalReductionWidthMm =
    model.baseReductionWidthMm + safeInput.deadWorkSideMm * 2 + extraFixedReduction;
  const totalReductionHeightMm =
    model.baseReductionHeightMm + safeInput.deadWorkTopMm + safeInput.deadWorkBottomMm;
  const productionWidthMm = Math.round(safeInput.openingWidthMm - totalReductionWidthMm);
  const productionHeightMm = Math.round(safeInput.openingHeightMm - totalReductionHeightMm);

  if (productionWidthMm <= 0 || productionHeightMm <= 0) {
    return {
      ok: false,
      errors: [
        "Le riduzioni impostate annullano le misure utili. Riduci opera morta o verifica il vano.",
      ],
    };
  }

  const openingSideLabel = safeInput.hingeSide === "right" ? "destra" : "sinistra";
  const handleSideLabel = safeInput.hingeSide === "right" ? "sinistra" : "destra";
  const openingMovementLabel = safeInput.openingMovement === "pull" ? "a tirare" : "a spingere";
  const handingLabel = `${openingSideLabel} ${openingMovementLabel}`;

  return {
    ok: true,
    data: {
      modelId: model.id,
      modelLabel: model.label,
      openingWidthMm: safeInput.openingWidthMm,
      openingHeightMm: safeInput.openingHeightMm,
      wallThicknessMm: safeInput.wallThicknessMm,
      productionWidthMm,
      productionHeightMm,
      totalReductionWidthMm,
      totalReductionHeightMm,
      deadWorkSideMm: safeInput.deadWorkSideMm,
      deadWorkTopMm: safeInput.deadWorkTopMm,
      deadWorkBottomMm: safeInput.deadWorkBottomMm,
      openingSideLabel,
      handleSideLabel,
      handingLabel,
      openingMovementLabel,
      hasVisionPanel: safeInput.hasVisionPanel,
      hasOvalWindow: safeInput.hasOvalWindow,
      hasFixedLeaf: safeInput.hasFixedLeaf,
      includeDisplay: safeInput.includeDisplay,
      technicalNotes: model.notes,
    },
  };
}

export function buildDoorExportText(result: DoorCalculationResult): string {
  return [
    "SCHEDA PRODUZIONE PORTA",
    "-----------------------",
    `Modello: ${result.modelLabel}`,
    `Vano muro (LxH): ${result.openingWidthMm} x ${result.openingHeightMm} mm`,
    `Spessore muro: ${result.wallThicknessMm} mm`,
    `Riduzione totale (LxH): ${result.totalReductionWidthMm} x ${result.totalReductionHeightMm} mm`,
    `Opera morta (lat/top/bot): ${result.deadWorkSideMm}/${result.deadWorkTopMm}/${result.deadWorkBottomMm} mm`,
    `Misura produzione (LxH): ${result.productionWidthMm} x ${result.productionHeightMm} mm`,
    `Verso apertura: ${result.handingLabel}`,
    `Lato cerniere: ${result.openingSideLabel}`,
    `Lato maniglia: ${result.handleSideLabel}`,
    `Compasso/fisso: ${result.hasFixedLeaf ? "Con modulo fisso" : "Solo anta principale"}`,
    `Vision panel: ${result.hasVisionPanel ? "Sì" : "No"}`,
    `Display: ${result.includeDisplay ? "Sì" : "No"}`,
    `Oblò ovale: ${result.hasOvalWindow ? "Sì" : "No"}`,
    "",
    `Nota tecnica: ${result.technicalNotes}`,
  ].join("\n");
}
