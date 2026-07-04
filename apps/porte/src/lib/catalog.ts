import type { DoorModel, DoorModelId } from "@/lib/types";

export const doorModels: DoorModel[] = [
  {
    id: "classic-battente",
    name: "Classic battente",
    description: "Porta battente standard per produzione rapida con anta singola.",
    frameReductionWidthMm: 140,
    frameReductionHeightMm: 90,
    leafReductionHeightMm: 10,
    clearPassageWidthLossMm: 110,
    clearPassageHeightLossMm: 40,
    minWallThicknessMm: 90,
    fixedPanelWidthMm: 320,
    minLeafWidthMm: 680,
    supportedGlass: ["none", "slit"],
    supportsOvalWindow: false,
    notes: [
      "Tolleranze di posa gia incluse nella riduzione telaio.",
      "Ideale per aperture interne standard.",
    ],
  },
  {
    id: "glass-suite",
    name: "Glass Suite",
    description: "Porta moderna con opzione vetrata e pannello fisso laterale.",
    frameReductionWidthMm: 140,
    frameReductionHeightMm: 95,
    leafReductionHeightMm: 10,
    clearPassageWidthLossMm: 120,
    clearPassageHeightLossMm: 45,
    minWallThicknessMm: 100,
    fixedPanelWidthMm: 360,
    minLeafWidthMm: 720,
    supportedGlass: ["none", "slit", "full"],
    supportsOvalWindow: false,
    notes: [
      "Pannello fisso consigliato per vani larghi e ambienti di rappresentanza.",
      "La versione vetrata richiede verifica estetica della traversa.",
    ],
  },
  {
    id: "atelier-oval",
    name: "Atelier ovale",
    description: "Porta di design con feritoia o oblo ovale integrato.",
    frameReductionWidthMm: 160,
    frameReductionHeightMm: 100,
    leafReductionHeightMm: 10,
    clearPassageWidthLossMm: 125,
    clearPassageHeightLossMm: 45,
    minWallThicknessMm: 100,
    fixedPanelWidthMm: 340,
    minLeafWidthMm: 700,
    supportedGlass: ["none", "slit"],
    supportsOvalWindow: true,
    notes: [
      "Modello adatto a commesse custom con scheda tecnica dedicata.",
      "Oblo ovale disponibile solo sui modelli predisposti.",
    ],
  },
];

export async function loadDoorModels(): Promise<DoorModel[]> {
  return doorModels;
}

export function getDoorModelById(modelId: DoorModelId): DoorModel {
  const model = doorModels.find((entry) => entry.id === modelId);
  if (!model) {
    throw new Error("Modello porta non trovato");
  }
  return model;
}
