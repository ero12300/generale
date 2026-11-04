import { describe, expect, it } from "vitest";
import {
  createDealSchema,
  doorBatchSchema,
  doorConfigurationSchema,
  updateDealSchema,
} from "@/lib/validations/api";

describe("createDealSchema", () => {
  it("accetta un deal valido", () => {
    const result = createDealSchema.safeParse({
      title: "Trilocale Milano",
      strategy: "fix_flip",
    });
    expect(result.success).toBe(true);
  });

  it("rifiuta titolo vuoto", () => {
    const result = createDealSchema.safeParse({ title: "   " });
    expect(result.success).toBe(false);
  });
});

describe("updateDealSchema", () => {
  it("accetta cambio stage", () => {
    const result = updateDealSchema.safeParse({ stage: "offer" });
    expect(result.success).toBe(true);
  });

  it("rifiuta body vuoto", () => {
    const result = updateDealSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("doorConfigurationSchema", () => {
  const validInput = {
    roomName: "Camera 1",
    model: "hinged_single",
    openingDirection: "right",
    wallOpening: {
      widthTopMm: 900,
      widthMiddleMm: 898,
      widthBottomMm: 899,
      heightLeftMm: 2150,
      heightRightMm: 2149,
      wallDepthMm: 110,
      finishedFloor: true,
    },
    accessories: {
      hasDisplay: false,
      hasOvalWindow: false,
      hasFixedPanel: false,
    },
  };

  it("accetta una configurazione porta valida", () => {
    const result = doorConfigurationSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rifiuta misure foro muro non producibili", () => {
    const result = doorConfigurationSchema.safeParse({
      ...validInput,
      wallOpening: {
        ...validInput.wallOpening,
        widthMiddleMm: 250,
      },
    });

    expect(result.success).toBe(false);
  });

  it("richiede il fisso laterale per il modello con opera morta", () => {
    const result = doorConfigurationSchema.safeParse({
      ...validInput,
      model: "hinged_with_fixed_panel",
      accessories: {
        ...validInput.accessories,
        hasFixedPanel: false,
      },
    });

    expect(result.success).toBe(false);
  });

  it("accetta un ordine con piu porte", () => {
    const result = doorBatchSchema.safeParse({
      projectName: "Cantiere Milano",
      doors: [validInput, { ...validInput, roomName: "Camera 2" }],
    });

    expect(result.success).toBe(true);
  });

  it("rifiuta ordini senza porte", () => {
    const result = doorBatchSchema.safeParse({
      projectName: "Cantiere Milano",
      doors: [],
    });

    expect(result.success).toBe(false);
  });

  it("rifiuta il fisso laterale su modelli non dedicati", () => {
    const result = doorConfigurationSchema.safeParse({
      ...validInput,
      model: "sliding_external",
      accessories: {
        ...validInput.accessories,
        hasFixedPanel: true,
      },
    });

    expect(result.success).toBe(false);
  });
});
