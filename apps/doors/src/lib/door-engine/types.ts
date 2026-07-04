export type DoorModel = "hinged" | "compass" | "fixed";
export type DoorSide = "left" | "right";
export type SwingDirection = "in" | "out";
export type FixedPanelMode = "auto" | "forced" | "none";
export type HandleSide = DoorSide | "none";

export type DoorCalculationInput = {
  roughOpening: {
    widthMm: number;
    heightMm: number;
    wallThicknessMm: number;
  };
  model: DoorModel;
  hingeSide: DoorSide;
  swing: SwingDirection;
  options: {
    hasDisplay: boolean;
    hasOvalWindow: boolean;
    fixedPanel: FixedPanelMode;
  };
};

export type DoorPlan = {
  model: DoorModel;
  modelLabel: string;
  frame: {
    outerWidthMm: number;
    outerHeightMm: number;
    depthMm: number;
    profileMm: number;
  };
  activeLeaf: {
    widthMm: number;
    heightMm: number;
    thicknessMm: number;
  };
  deadWork: {
    side: DoorSide | "none";
    widthMm: number;
    reason: string;
  };
  handing: {
    hingeSide: DoorSide;
    handleSide: HandleSide;
    swing: SwingDirection;
    openingLabel: string;
  };
  accessories: {
    hasDisplay: boolean;
    hasOvalWindow: boolean;
  };
  hardware: string[];
  productionNotes: string[];
};
