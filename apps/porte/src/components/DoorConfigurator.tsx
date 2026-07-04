"use client";

import { useState, useCallback, useRef } from "react";
import type {
  WallMeasurements,
  DoorOptions,
  DoorCalculationResult,
  DoorType,
  OpeningDirection,
  OpeningVerse,
  HandleSide,
} from "@/lib/doorTypes";
import { DOOR_TYPE_LABELS, DOOR_TYPE_DESCRIPTIONS } from "@/lib/doorTypes";
import { calculateDoor, formatMm } from "@/lib/doorCalculations";
import { DoorSchematic } from "./DoorSchematic";

const STEPS = ["Misure", "Tipo", "Opzioni", "Schema"] as const;
type Step = 0 | 1 | 2 | 3;

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function ToggleChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "10px 18px",
        borderRadius: 8,
        border: active ? "2px solid #f59e0b" : "2px solid #3f3f46",
        background: active ? "#451a03" : "#18181b",
        color: active ? "#f59e0b" : "#a1a1aa",
        fontWeight: active ? 600 : 400,
        fontSize: 14,
        cursor: "pointer",
        transition: "all 0.15s",
        flex: "1 1 auto",
        minWidth: 80,
        textAlign: "center",
      }}
    >
      {children}
    </button>
  );
}

function OptionRow({
  label,
  description,
  active,
  onToggle,
  children,
}: {
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#18181b",
        borderRadius: 10,
        border: active ? "1.5px solid #f59e0b" : "1.5px solid #27272a",
        padding: "14px 16px",
        marginBottom: 10,
        transition: "border-color 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: "#fafafa" }}>{label}</div>
          <div style={{ fontSize: 12, color: "#71717a", marginTop: 2 }}>{description}</div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          style={{
            width: 48,
            height: 26,
            borderRadius: 13,
            background: active ? "#f59e0b" : "#27272a",
            border: "none",
            cursor: "pointer",
            position: "relative",
            transition: "background 0.2s",
            flexShrink: 0,
            marginLeft: 12,
          }}
          aria-pressed={active}
          aria-label={`Toggle ${label}`}
        >
          <span
            style={{
              position: "absolute",
              top: 3,
              left: active ? 25 : 3,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "white",
              transition: "left 0.2s",
            }}
          />
        </button>
      </div>
      {active && children && (
        <div style={{ marginTop: 12, borderTop: "1px solid #27272a", paddingTop: 12 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function NumberInput({
  label,
  unit,
  value,
  onChange,
  min,
  max,
  placeholder,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, color: "#a1a1aa", marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "12px 48px 12px 14px",
            background: "#27272a",
            border: "1.5px solid #3f3f46",
            borderRadius: 8,
            color: "#fafafa",
            fontSize: 16,
            outline: "none",
          }}
        />
        <span
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#71717a",
            fontSize: 13,
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

interface ResultRowProps {
  label: string;
  value: string;
  highlight?: boolean;
  sub?: boolean;
}

function ResultRow({ label, value, highlight, sub }: ResultRowProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: sub ? "6px 0 6px 12px" : "10px 0",
        borderBottom: sub ? "none" : "1px solid #27272a",
      }}
    >
      <span style={{ fontSize: sub ? 13 : 14, color: sub ? "#71717a" : "#a1a1aa" }}>{label}</span>
      <span
        style={{
          fontSize: sub ? 13 : 14,
          fontWeight: highlight ? 700 : 500,
          color: highlight ? "#f59e0b" : sub ? "#a1a1aa" : "#fafafa",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function DoorConfigurator() {
  const [step, setStep] = useState<Step>(0);
  const schematicRef = useRef<HTMLDivElement>(null);

  // Measurements state
  const [wallW, setWallW] = useState("");
  const [wallH, setWallH] = useState("");
  const [wallT, setWallT] = useState("100");

  // Door options
  const [doorType, setDoorType] = useState<DoorType>("battente");
  const [openDir, setOpenDir] = useState<OpeningDirection>("destra");
  const [openVerse, setOpenVerse] = useState<OpeningVerse>("interno");
  const [handleSide, setHandleSide] = useState<HandleSide>("destra");

  // Extra options
  const [hasFisso, setHasFisso] = useState(false);
  const [fissoSide, setFissoSide] = useState<"sinistra" | "destra">("destra");
  const [fissoWidth, setFissoWidth] = useState("300");
  const [hasMostra, setHasMostra] = useState(false);
  const [hasOvale, setHasOvale] = useState(false);
  const [hasBussola, setHasBussola] = useState(false);

  const [result, setResult] = useState<DoorCalculationResult | null>(null);

  const canProceedStep0 =
    wallW !== "" && wallH !== "" && wallT !== "" &&
    Number(wallW) > 400 && Number(wallH) > 1000 && Number(wallT) > 50;

  const canProceedStep2 = true;

  const measurements: WallMeasurements = {
    width: Number(wallW),
    height: Number(wallH),
    thickness: Number(wallT),
  };

  const options: DoorOptions = {
    hasFisso,
    fissoSide,
    fissoWidth: Number(fissoWidth) || 300,
    hasMostra,
    hasOvale,
    hasBussola,
    openingDirection: openDir,
    openingVerse: openVerse,
    handleSide,
    doorType,
  };

  const computeAndAdvance = useCallback(() => {
    if (!canProceedStep0) return;
    const r = calculateDoor(measurements, options);
    setResult(r);
    setStep(3);
  }, [measurements, options, canProceedStep0]);

  const handleExport = useCallback(() => {
    window.print();
  }, []);

  const handleCopyText = useCallback(() => {
    if (!result) return;
    const text = [
      "=== SCHEDA PORTA ===",
      `Luce muraria: ${result.luce_muraria_l} × ${result.luce_muraria_h} mm`,
      `Spessore muro: ${result.spessore_muro} mm`,
      `Tipo: ${DOOR_TYPE_LABELS[doorType]}`,
      `Apertura: ${openDir} · ${openVerse === "interno" ? "verso interno" : "verso esterno"}`,
      `Maniglia: ${handleSide}`,
      "",
      "--- ANTA (FOGLIO PORTA) ---",
      `Larghezza: ${result.anta_l} mm`,
      `Altezza: ${result.anta_h} mm`,
      "",
      "--- TELAIO ---",
      `Controtelaio: ${result.controtelaio_l} × ${result.controtelaio_h} mm`,
      `Luce netta: ${result.telaio_luce_netta_l} × ${result.telaio_luce_netta_h} mm`,
      `Coprifili: ${result.coprifilo_larghezza} mm`,
      "",
      "--- OPZIONI ---",
      `Fisso: ${hasFisso ? `SÌ — ${result.fisso_l} mm (lato ${fissoSide})` : "No"}`,
      `Mostra (vetro superiore): ${hasMostra ? "SÌ" : "No"}`,
      `Ovale: ${hasOvale ? "SÌ" : "No"}`,
      `Bussola: ${hasBussola ? "SÌ" : "No"}`,
      "",
      "--- TOLLERANZE APPLICATE ---",
      `Profilo telaio: ${result.profilo_telaio} mm per lato`,
      `Giunto morto lato: ${result.giunto_morto_lato} mm`,
      `Giunto morto alto: ${result.giunto_morto_alto} mm`,
      `Gap pavimento: ${result.giunto_pavimento} mm`,
    ].join("\n");
    navigator.clipboard.writeText(text);
  }, [result, doorType, openDir, openVerse, handleSide, hasFisso, fissoSide, hasMostra, hasOvale, hasBussola]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0f0f11",
        display: "flex",
        flexDirection: "column",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 20px 0",
          background: "#0f0f11",
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: step === 3 ? "none" : "1px solid #1c1c1f",
          paddingBottom: 16,
        }}
        className="no-print"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 22 }}>🚪</span>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fafafa" }}>Configuratore Porte</div>
            <div style={{ fontSize: 12, color: "#71717a" }}>Dal vano muro alla produzione</div>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 6 }}>
          {STEPS.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                if (i < step || (i === step)) setStep(i as Step);
                else if (i === 1 && canProceedStep0) setStep(1);
                else if (i === 2 && canProceedStep0) setStep(2);
                else if (i === 3 && result) setStep(3);
              }}
              style={{
                flex: 1,
                padding: "6px 0",
                borderRadius: 6,
                border: "none",
                background: i === step ? "#451a03" : i < step ? "#27272a" : "#18181b",
                color: i === step ? "#f59e0b" : i < step ? "#a1a1aa" : "#52525b",
                fontSize: 11,
                fontWeight: i === step ? 700 : 400,
                cursor: i <= step || (i === 1 && canProceedStep0) ? "pointer" : "default",
                borderBottom: i === step ? "2px solid #f59e0b" : "2px solid transparent",
              }}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        {/* STEP 0: MISURE */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "#fafafa" }}>
              Misure vano muro
            </h2>
            <p style={{ fontSize: 13, color: "#71717a", marginBottom: 20 }}>
              Inserisci le dimensioni del foro nella parete, misurate da muratura a muratura.
            </p>

            <div
              style={{
                background: "#18181b",
                borderRadius: 10,
                padding: 16,
                marginBottom: 16,
                border: "1px solid #27272a",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b", marginBottom: 12 }}>
                📐 Luce muraria
              </div>
              <NumberInput
                label="Larghezza vano"
                unit="mm"
                value={wallW}
                onChange={setWallW}
                min={400}
                max={3000}
                placeholder="es. 900"
              />
              <NumberInput
                label="Altezza vano"
                unit="mm"
                value={wallH}
                onChange={setWallH}
                min={1000}
                max={3500}
                placeholder="es. 2100"
              />
              <NumberInput
                label="Spessore muro"
                unit="mm"
                value={wallT}
                onChange={setWallT}
                min={50}
                max={500}
                placeholder="es. 100"
              />
            </div>

            {wallW !== "" && wallH !== "" && Number(wallW) > 400 && Number(wallH) > 1000 && (
              <div
                style={{
                  background: "#0c2a0a",
                  borderRadius: 8,
                  padding: "10px 14px",
                  border: "1px solid #16a34a",
                  marginBottom: 16,
                  fontSize: 13,
                  color: "#86efac",
                }}
              >
                ✓ Vano: {wallW} × {wallH} mm · Spessore {wallT} mm
              </div>
            )}

            <div
              style={{
                background: "#1a1a0e",
                borderRadius: 8,
                padding: "10px 14px",
                border: "1px solid #3f3f46",
                fontSize: 12,
                color: "#71717a",
              }}
            >
              💡 <strong style={{ color: "#a1a1aa" }}>Come misurare:</strong> misura la larghezza e l'altezza del
              foro grezzo nella parete, da muratura a muratura, senza intonaco finito.
            </div>
          </div>
        )}

        {/* STEP 1: TIPO PORTA */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "#fafafa" }}>
              Tipo di porta
            </h2>
            <p style={{ fontSize: 13, color: "#71717a", marginBottom: 20 }}>
              Seleziona il sistema di apertura.
            </p>

            {(["battente", "scorrevole", "complanare"] as DoorType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setDoorType(t)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "16px",
                  background: doorType === t ? "#451a03" : "#18181b",
                  border: doorType === t ? "2px solid #f59e0b" : "2px solid #27272a",
                  borderRadius: 10,
                  cursor: "pointer",
                  marginBottom: 10,
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 600, color: doorType === t ? "#f59e0b" : "#fafafa" }}>
                  {t === "battente" ? "🚪" : t === "scorrevole" ? "↔️" : "🔲"}{" "}
                  {DOOR_TYPE_LABELS[t]}
                </div>
                <div style={{ fontSize: 12, color: "#71717a", marginTop: 4 }}>
                  {DOOR_TYPE_DESCRIPTIONS[t]}
                </div>
              </button>
            ))}

            {/* Opening direction */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#a1a1aa", marginBottom: 10 }}>
                Senso di apertura
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <ToggleChip active={openDir === "sinistra"} onClick={() => setOpenDir("sinistra")}>
                  ← Sinistra
                </ToggleChip>
                <ToggleChip active={openDir === "destra"} onClick={() => setOpenDir("destra")}>
                  Destra →
                </ToggleChip>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <ToggleChip active={openVerse === "interno"} onClick={() => setOpenVerse("interno")}>
                  Verso interno
                </ToggleChip>
                <ToggleChip active={openVerse === "esterno"} onClick={() => setOpenVerse("esterno")}>
                  Verso esterno
                </ToggleChip>
              </div>
            </div>

            {/* Handle side */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#a1a1aa", marginBottom: 10 }}>
                Posizione maniglia
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <ToggleChip active={handleSide === "sinistra"} onClick={() => setHandleSide("sinistra")}>
                  ← Maniglia sinistra
                </ToggleChip>
                <ToggleChip active={handleSide === "destra"} onClick={() => setHandleSide("destra")}>
                  Maniglia destra →
                </ToggleChip>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: OPZIONI */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "#fafafa" }}>
              Opzioni porta
            </h2>
            <p style={{ fontSize: 13, color: "#71717a", marginBottom: 20 }}>
              Configura i componenti aggiuntivi.
            </p>

            <OptionRow
              label="Fisso"
              description="Pannello fisso non apribile affiancato alla porta"
              active={hasFisso}
              onToggle={() => setHasFisso(!hasFisso)}
            >
              <div style={{ fontSize: 13, color: "#a1a1aa", marginBottom: 8 }}>Lato del fisso</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <ToggleChip active={fissoSide === "sinistra"} onClick={() => setFissoSide("sinistra")}>
                  ← Sinistra
                </ToggleChip>
                <ToggleChip active={fissoSide === "destra"} onClick={() => setFissoSide("destra")}>
                  Destra →
                </ToggleChip>
              </div>
              <NumberInput
                label="Larghezza fisso (luce muraria)"
                unit="mm"
                value={fissoWidth}
                onChange={setFissoWidth}
                min={100}
                max={1000}
                placeholder="es. 300"
              />
            </OptionRow>

            <OptionRow
              label="Mostra (vetro superiore)"
              description="Pannello vetrato nella parte superiore dell'anta"
              active={hasMostra}
              onToggle={() => setHasMostra(!hasMostra)}
            />

            <OptionRow
              label="Ovale"
              description="Inserto decorativo ellittico sul pannello della porta"
              active={hasOvale}
              onToggle={() => setHasOvale(!hasOvale)}
            />

            <OptionRow
              label="Bussola (oblò)"
              description="Oblò / portellino circolare per visibilità o ventilazione"
              active={hasBussola}
              onToggle={() => setHasBussola(!hasBussola)}
            />
          </div>
        )}

        {/* STEP 3: SCHEMA + RISULTATI */}
        {step === 3 && result && (
          <div>
            {/* Schematic */}
            <div ref={schematicRef} style={{ marginBottom: 20 }}>
              <DoorSchematic result={result} options={options} />
            </div>

            {/* Results card */}
            <div
              style={{
                background: "#18181b",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                border: "1px solid #27272a",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b", marginBottom: 12 }}>
                🔧 Anta (foglio porta)
              </div>
              <ResultRow label="Larghezza" value={`${result.anta_l} mm`} highlight />
              <ResultRow label="Altezza" value={`${result.anta_h} mm`} highlight />
              <ResultRow
                label="Misura standard consigliata"
                value={`${result.standard_suggerita_l} × ${result.standard_suggerita_h} mm`}
                sub
              />
            </div>

            <div
              style={{
                background: "#18181b",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                border: "1px solid #27272a",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: "#3b82f6", marginBottom: 12 }}>
                📦 Telaio e controtelaio
              </div>
              <ResultRow label="Controtelaio L" value={`${result.controtelaio_l} mm`} />
              <ResultRow label="Controtelaio H" value={`${result.controtelaio_h} mm`} />
              <ResultRow label="Luce netta L" value={`${result.telaio_luce_netta_l} mm`} />
              <ResultRow label="Luce netta H" value={`${result.telaio_luce_netta_h} mm`} />
              <ResultRow label="Coprifili" value={`${result.coprifilo_larghezza} mm`} sub />
            </div>

            {result.fisso_l !== null && (
              <div
                style={{
                  background: "#18181b",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  border: "1px solid #27272a",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: "#22c55e", marginBottom: 12 }}>
                  🔒 Fisso (pannello fisso)
                </div>
                <ResultRow label="Larghezza fisso" value={`${result.fisso_l} mm`} highlight />
                <ResultRow label="Altezza fisso" value={`${result.fisso_h} mm`} />
                <ResultRow label="Lato" value={options.fissoSide} sub />
              </div>
            )}

            <div
              style={{
                background: "#18181b",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                border: "1px solid #27272a",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: "#a1a1aa", marginBottom: 12 }}>
                ⚙️ Tolleranze applicate
              </div>
              <ResultRow label="Profilo telaio" value={`${result.profilo_telaio} mm/lato`} sub />
              <ResultRow label="Giunto morto lato" value={`${result.giunto_morto_lato} mm`} sub />
              <ResultRow label="Giunto morto alto" value={`${result.giunto_morto_alto} mm`} sub />
              <ResultRow label="Gap pavimento" value={`${result.giunto_pavimento} mm`} sub />
            </div>

            <div
              style={{
                background: "#18181b",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                border: "1px solid #27272a",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: "#a1a1aa", marginBottom: 12 }}>
                📋 Riepilogo configurazione
              </div>
              <ResultRow label="Tipo" value={DOOR_TYPE_LABELS[options.doorType]} />
              <ResultRow label="Apertura" value={`${options.openingDirection}`} />
              <ResultRow label="Verso" value={options.openingVerse === "interno" ? "Verso interno" : "Verso esterno"} />
              <ResultRow label="Maniglia" value={options.handleSide} />
              <ResultRow label="Fisso" value={options.hasFisso ? `Sì (${options.fissoSide})` : "No"} sub />
              <ResultRow label="Mostra" value={options.hasMostra ? "Sì" : "No"} sub />
              <ResultRow label="Ovale" value={options.hasOvale ? "Sì" : "No"} sub />
              <ResultRow label="Bussola" value={options.hasBussola ? "Sì" : "No"} sub />
            </div>

            {/* Export buttons */}
            <div style={{ display: "flex", gap: 10, marginBottom: 40 }} className="no-print">
              <button
                type="button"
                onClick={handleExport}
                style={{
                  flex: 1,
                  padding: "14px 0",
                  background: "#f59e0b",
                  color: "#0f0f11",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🖨️ Stampa / PDF
              </button>
              <button
                type="button"
                onClick={handleCopyText}
                style={{
                  flex: 1,
                  padding: "14px 0",
                  background: "#27272a",
                  color: "#fafafa",
                  border: "1.5px solid #3f3f46",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📋 Copia testo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      {step < 3 && (
        <div
          className="no-print"
          style={{
            padding: "16px 20px",
            borderTop: "1px solid #1c1c1f",
            background: "#0f0f11",
            display: "flex",
            gap: 10,
          }}
        >
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as Step)}
              style={{
                padding: "14px 24px",
                background: "#18181b",
                border: "1.5px solid #3f3f46",
                borderRadius: 10,
                color: "#a1a1aa",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ← Indietro
            </button>
          )}

          {step < 2 && (
            <button
              type="button"
              disabled={step === 0 && !canProceedStep0}
              onClick={() => setStep((s) => (s + 1) as Step)}
              style={{
                flex: 1,
                padding: "14px 0",
                background: step === 0 && !canProceedStep0 ? "#27272a" : "#f59e0b",
                border: "none",
                borderRadius: 10,
                color: step === 0 && !canProceedStep0 ? "#52525b" : "#0f0f11",
                fontSize: 15,
                fontWeight: 700,
                cursor: step === 0 && !canProceedStep0 ? "not-allowed" : "pointer",
              }}
            >
              Avanti →
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={computeAndAdvance}
              style={{
                flex: 1,
                padding: "14px 0",
                background: "#f59e0b",
                border: "none",
                borderRadius: 10,
                color: "#0f0f11",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🚪 Genera schema →
            </button>
          )}
        </div>
      )}

      {step === 3 && (
        <div
          className="no-print"
          style={{
            padding: "16px 20px",
            borderTop: "1px solid #1c1c1f",
            background: "#0f0f11",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setResult(null);
              setWallW("");
              setWallH("");
              setWallT("100");
              setHasFisso(false);
              setHasMostra(false);
              setHasOvale(false);
              setHasBussola(false);
            }}
            style={{
              width: "100%",
              padding: "14px 0",
              background: "#18181b",
              border: "1.5px solid #3f3f46",
              borderRadius: 10,
              color: "#a1a1aa",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ↩️ Nuova configurazione
          </button>
        </div>
      )}
    </div>
  );
}
