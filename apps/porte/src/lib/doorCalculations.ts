import type {
  WallMeasurements,
  DoorOptions,
  DoorCalculationResult,
  DoorType,
} from "./doorTypes";
import { STANDARD_WIDTHS, STANDARD_HEIGHTS } from "./doorTypes";

interface ToleranceProfile {
  profiloTelaio: number;        // mm — frame profile width per side
  giuntoMortoLato: number;      // mm — dead gap between leaf and frame (sides)
  giuntoMortoAlto: number;      // mm — dead gap top
  giuntoPavimento: number;      // mm — floor clearance
  coprifilolarghezza: number;   // mm — visible cover strip width
  controtelaioTolleranza: number; // mm — rough frame tolerance per side
}

const TOLERANCES: Record<DoorType, ToleranceProfile> = {
  battente: {
    profiloTelaio: 40,
    giuntoMortoLato: 3,
    giuntoMortoAlto: 3,
    giuntoPavimento: 10,
    coprifilolarghezza: 60,
    controtelaioTolleranza: 5,
  },
  scorrevole: {
    profiloTelaio: 35,
    giuntoMortoLato: 5,
    giuntoMortoAlto: 5,
    giuntoPavimento: 5,
    coprifilolarghezza: 55,
    controtelaioTolleranza: 5,
  },
  complanare: {
    profiloTelaio: 44,
    giuntoMortoLato: 2,
    giuntoMortoAlto: 2,
    giuntoPavimento: 5,
    coprifilolarghezza: 70,
    controtelaioTolleranza: 3,
  },
};

function nearestStandard(value: number, standards: number[]): number {
  return standards.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

export function calculateDoor(
  measurements: WallMeasurements,
  options: DoorOptions
): DoorCalculationResult {
  const { width: lm_l, height: lm_h, thickness: sm } = measurements;
  const tol = TOLERANCES[options.doorType];

  // Controtelaio (rough frame = wall hole size, minus small tolerance)
  const ct_l = lm_l - 2 * tol.controtelaioTolleranza;
  const ct_h = lm_h - 2 * tol.controtelaioTolleranza;

  // Telaio esterno (cover strips extend beyond the wall opening)
  const telaio_l_esterno = lm_l + 2 * tol.coprifilolarghezza;
  const telaio_h_esterno = lm_h + tol.coprifilolarghezza;

  // Luce netta telaio (clear opening of the frame)
  const telaio_luce_netta_l = ct_l - 2 * tol.profiloTelaio;
  const telaio_luce_netta_h = ct_h - tol.profiloTelaio;

  // Anta (door leaf dimensions for production)
  let anta_l: number;
  let anta_h: number;

  if (options.doorType === "scorrevole") {
    // Sliding door: anta is slightly wider than the opening
    anta_l = telaio_luce_netta_l + 2 * tol.profiloTelaio - 10; // overlap
    anta_h = telaio_luce_netta_h - tol.giuntoPavimento - tol.giuntoMortoAlto;
  } else {
    // Battente & complanare: anta fits within the frame luce netta
    anta_l =
      telaio_luce_netta_l - 2 * tol.giuntoMortoLato;
    anta_h =
      telaio_luce_netta_h - tol.giuntoMortoAlto - tol.giuntoPavimento;
  }

  // Fisso panel calculations
  let fisso_l: number | null = null;
  let fisso_h: number | null = null;

  if (options.hasFisso && options.fissoWidth > 0) {
    fisso_l = options.fissoWidth - 2 * tol.giuntoMortoLato;
    fisso_h = anta_h;
  }

  // Nearest standard recommendation
  const standard_l = nearestStandard(anta_l, STANDARD_WIDTHS);
  const standard_h = nearestStandard(anta_h, STANDARD_HEIGHTS);

  return {
    luce_muraria_l: lm_l,
    luce_muraria_h: lm_h,
    spessore_muro: sm,
    controtelaio_l: ct_l,
    controtelaio_h: ct_h,
    telaio_l_esterno: telaio_l_esterno,
    telaio_h_esterno: telaio_h_esterno,
    telaio_luce_netta_l: Math.round(telaio_luce_netta_l),
    telaio_luce_netta_h: Math.round(telaio_luce_netta_h),
    anta_l: Math.round(anta_l),
    anta_h: Math.round(anta_h),
    fisso_l: fisso_l !== null ? Math.round(fisso_l) : null,
    fisso_h: fisso_h !== null ? Math.round(fisso_h) : null,
    coprifilo_larghezza: tol.coprifilolarghezza,
    standard_suggerita_l: standard_l,
    standard_suggerita_h: standard_h,
    profilo_telaio: tol.profiloTelaio,
    giunto_morto_lato: tol.giuntoMortoLato,
    giunto_morto_alto: tol.giuntoMortoAlto,
    giunto_pavimento: tol.giuntoPavimento,
  };
}

export function formatMm(value: number): string {
  return `${value} mm`;
}

export function formatCm(value: number): string {
  return `${(value / 10).toFixed(1).replace(".0", "")} cm`;
}
