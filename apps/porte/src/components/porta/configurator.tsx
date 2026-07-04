"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  DoorOpen,
  Ruler,
  Sparkles,
  Layers,
  Circle,
  Square,
  ArrowLeft,
  ArrowRight,
  Save,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";

import {
  MODELLI,
  VETRI,
  SPESSORI_MURO_TIPICI_CM,
  type ModelloDescriptor,
} from "@/lib/modelli-porta";
import { calcolaPorta } from "@/lib/calcolo-porta";
import type {
  DimensioniInput,
  LatoCerniere,
  ModelloPorta,
  OpzioniPorta,
  RisultatoCalcolo,
  TipoCoprifilo,
  TipoVetro,
  VersoApertura,
} from "@/lib/types";
import { salvaOrdine } from "@/lib/store";
import { formatoCm, formatoMm } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelperText, Input, Label, Select, Textarea } from "@/components/ui/field";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SchemaPorta } from "./schema-svg";

interface Props {
  initialModello?: ModelloPorta;
}

const OPZIONI_INIZIALI: OpzioniPorta = {
  bussola: false,
  fisso: false,
  fissoLarghezzaCm: 40,
  sopraluce: false,
  sopraluceAltezzaCm: 30,
  vetro: "nessuno",
  maniglia: "destra",
  versoApertura: "spinta",
  coprifilo: "dritto",
};

export function ConfiguratorPorta({ initialModello = "battente" }: Props) {
  const router = useRouter();
  const [modello, setModello] = React.useState<ModelloPorta>(initialModello);
  const [dimensioni, setDimensioni] = React.useState<DimensioniInput>({
    foroLarghezzaCm: 90,
    foroAltezzaCm: 215,
    spessoreMuroCm: 12.5,
  });
  const [opzioni, setOpzioni] = React.useState<OpzioniPorta>(OPZIONI_INIZIALI);
  const [cliente, setCliente] = React.useState("");
  const [riferimento, setRiferimento] = React.useState("");
  const [ambiente, setAmbiente] = React.useState("");
  const [note, setNote] = React.useState("");
  const [salvataggio, setSalvataggio] = React.useState<"idle" | "salvando" | "salvato">("idle");
  const [errore, setErrore] = React.useState<string | null>(null);

  const calcolo: RisultatoCalcolo = React.useMemo(
    () => calcolaPorta(modello, dimensioni, opzioni),
    [modello, dimensioni, opzioni],
  );

  const modelloAttivo = MODELLI.find((m) => m.id === modello) as ModelloDescriptor;
  const hasErrori = calcolo.avvertenze.some((a) => a.livello === "errore");

  const aggiornaDim = (patch: Partial<DimensioniInput>) => {
    setDimensioni((prev) => ({ ...prev, ...patch }));
  };
  const aggiornaOpz = <K extends keyof OpzioniPorta>(key: K, value: OpzioniPorta[K]) => {
    setOpzioni((prev) => ({ ...prev, [key]: value }));
  };

  async function onSalva() {
    setErrore(null);
    if (!cliente.trim() || !riferimento.trim()) {
      setErrore("Inserisci cliente e riferimento porta prima di salvare.");
      return;
    }
    if (hasErrori) {
      setErrore("Ci sono errori di validazione: correggili prima di salvare.");
      return;
    }
    setSalvataggio("salvando");
    try {
      const ordine = salvaOrdine(
        {
          cliente: cliente.trim(),
          riferimento: riferimento.trim(),
          ambiente: ambiente.trim() || undefined,
          modello,
          dimensioni,
          opzioni,
          note: note.trim() || undefined,
        },
        calcolo,
      );
      setSalvataggio("salvato");
      router.push(`/ordini/${ordine.id}`);
    } catch (e) {
      setSalvataggio("idle");
      setErrore(e instanceof Error ? e.message : "Errore imprevisto durante il salvataggio");
    }
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Anteprima schema (sticky su mobile in cima) */}
      <div className="sticky top-0 z-20 -mx-4 border-b border-slate-800 bg-slate-950/85 px-4 pb-3 pt-3 backdrop-blur-md sm:mx-0 sm:static sm:border-none sm:bg-transparent sm:p-0">
        <div className="mx-auto max-w-md sm:max-w-none">
          <SchemaPorta
            dimensioni={dimensioni}
            opzioni={opzioni}
            calcolo={calcolo}
            className="mx-auto max-h-[42vh] w-full max-w-md rounded-xl border border-slate-800"
            scala="estesa"
          />
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
            <span>
              Luce netta:{" "}
              <strong className="text-slate-100">{formatoCm(calcolo.luceNettaCm)}</strong>
            </span>
            <span>
              Anta:{" "}
              <strong className="text-slate-100">
                {calcolo.anta.larghezzaCm}×{calcolo.anta.altezzaCm}
              </strong>{" "}
              cm
            </span>
            <span>
              Sp. {formatoMm(calcolo.anta.spessoreMm)}
            </span>
          </div>
        </div>
      </div>

      {/* Sezione 1: Modello */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-brand-500/15 p-2 text-brand-300">
              <DoorOpen size={22} />
            </div>
            <div>
              <CardTitle>1 · Modello porta</CardTitle>
              <CardDescription>Come vuoi aprire la porta</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleGroup<ModelloPorta>
            ariaLabel="Modello porta"
            columns={2}
            value={modello}
            onChange={setModello}
            options={MODELLI.map((m) => ({ value: m.id, label: m.nome }))}
          />
          <p className="text-xs text-slate-400 leading-relaxed">{modelloAttivo.descrizione}</p>
        </CardContent>
      </Card>

      {/* Sezione 2: Dimensioni foro muro */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-brand-500/15 p-2 text-brand-300">
              <Ruler size={22} />
            </div>
            <div>
              <CardTitle>2 · Foro muro</CardTitle>
              <CardDescription>
                Misure del vano grezzo · luce netta e anta vengono calcolate automaticamente
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="foroL">Larghezza (cm)</Label>
              <Input
                id="foroL"
                type="number"
                inputMode="decimal"
                min={40}
                max={200}
                step={0.5}
                value={dimensioni.foroLarghezzaCm}
                onChange={(e) =>
                  aggiornaDim({ foroLarghezzaCm: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label htmlFor="foroH">Altezza (cm)</Label>
              <Input
                id="foroH"
                type="number"
                inputMode="decimal"
                min={180}
                max={300}
                step={0.5}
                value={dimensioni.foroAltezzaCm}
                onChange={(e) =>
                  aggiornaDim({ foroAltezzaCm: Number(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="foroSp">Spessore muro finito (cm)</Label>
            <div className="flex gap-2">
              <Input
                id="foroSp"
                type="number"
                inputMode="decimal"
                min={5}
                max={60}
                step={0.5}
                value={dimensioni.spessoreMuroCm}
                onChange={(e) =>
                  aggiornaDim({ spessoreMuroCm: Number(e.target.value) || 0 })
                }
              />
              <Select
                aria-label="Preset spessore muro"
                value=""
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v > 0) aggiornaDim({ spessoreMuroCm: v });
                }}
                className="max-w-[120px]"
              >
                <option value="">Preset</option>
                {SPESSORI_MURO_TIPICI_CM.map((s) => (
                  <option key={s} value={s}>
                    {s} cm
                  </option>
                ))}
              </Select>
            </div>
            <HelperText>
              Standard italiano: intonaco 10.8-15 cm, cartongesso 10-15 cm, muri portanti oltre 25 cm.
            </HelperText>
          </div>
        </CardContent>
      </Card>

      {/* Sezione 3: Struttura */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-brand-500/15 p-2 text-brand-300">
              <Layers size={22} />
            </div>
            <div>
              <CardTitle>3 · Struttura</CardTitle>
              <CardDescription>Bussola, fisso, sopraluce, coprifilo</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Switch
            checked={opzioni.bussola}
            onCheckedChange={(v) => aggiornaOpz("bussola", v)}
            label="Sistema bussola"
            description="Imbotte su tutto lo spessore del muro. Consigliato per muri portanti oltre 15 cm."
          />
          <Switch
            checked={opzioni.fisso}
            onCheckedChange={(v) => aggiornaOpz("fisso", v)}
            label="Pannello fisso laterale"
            description="Aggiunge un fisso a lato della porta con la stessa altezza dell'anta."
          />
          {opzioni.fisso && (
            <div className="ml-2 border-l-2 border-brand-500/40 pl-3">
              <Label htmlFor="fissoL">Larghezza fisso (cm)</Label>
              <Input
                id="fissoL"
                type="number"
                inputMode="decimal"
                min={20}
                max={120}
                step={1}
                value={opzioni.fissoLarghezzaCm ?? 40}
                onChange={(e) =>
                  aggiornaOpz("fissoLarghezzaCm", Number(e.target.value) || 0)
                }
              />
            </div>
          )}
          <Switch
            checked={opzioni.sopraluce}
            onCheckedChange={(v) => aggiornaOpz("sopraluce", v)}
            label="Sopraluce"
            description="Pannello vetrato fisso sopra la porta per aumentare la luce naturale."
          />
          {opzioni.sopraluce && (
            <div className="ml-2 border-l-2 border-brand-500/40 pl-3">
              <Label htmlFor="sopraH">Altezza sopraluce (cm)</Label>
              <Input
                id="sopraH"
                type="number"
                inputMode="decimal"
                min={15}
                max={100}
                step={1}
                value={opzioni.sopraluceAltezzaCm ?? 30}
                onChange={(e) =>
                  aggiornaOpz("sopraluceAltezzaCm", Number(e.target.value) || 0)
                }
              />
            </div>
          )}
          <div className="pt-2">
            <Label>Coprifilo</Label>
            <ToggleGroup<TipoCoprifilo>
              columns={3}
              ariaLabel="Tipo coprifilo"
              value={opzioni.coprifilo}
              onChange={(v) => aggiornaOpz("coprifilo", v)}
              options={[
                { value: "dritto", label: "Dritto" },
                { value: "telescopico", label: "Telescopico" },
                { value: "nessuno", label: "Nessuno" },
              ]}
            />
            <HelperText>
              Il coprifilo telescopico si adatta a spessori muro non standard senza rifiniture aggiuntive.
            </HelperText>
          </div>
        </CardContent>
      </Card>

      {/* Sezione 4: Estetica */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-brand-500/15 p-2 text-brand-300">
              <Sparkles size={22} />
            </div>
            <div>
              <CardTitle>4 · Vetro / Oblò</CardTitle>
              <CardDescription>Anta cieca o con inserto vetrato</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleGroup<TipoVetro>
            columns={4}
            ariaLabel="Tipo vetro"
            value={opzioni.vetro}
            onChange={(v) => aggiornaOpz("vetro", v)}
            options={VETRI.map((vt) => ({
              value: vt.id,
              label: vt.nome,
              icon:
                vt.id === "ovale" ? (
                  <Circle size={14} />
                ) : vt.id === "tondo" ? (
                  <Circle size={14} />
                ) : vt.id === "rettangolare" ? (
                  <Square size={14} />
                ) : undefined,
            }))}
          />
          <p className="text-xs text-slate-400 leading-relaxed">
            {VETRI.find((v) => v.id === opzioni.vetro)?.descrizione}
          </p>
        </CardContent>
      </Card>

      {/* Sezione 5: Apertura */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-brand-500/15 p-2 text-brand-300">
              <ArrowLeft size={22} />
            </div>
            <div>
              <CardTitle>5 · Apertura e maniglia</CardTitle>
              <CardDescription>Lato maniglia e verso di apertura</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Maniglia</Label>
            <ToggleGroup<LatoCerniere>
              columns={2}
              ariaLabel="Lato maniglia"
              value={opzioni.maniglia}
              onChange={(v) => aggiornaOpz("maniglia", v)}
              options={[
                {
                  value: "sinistra",
                  label: "Sinistra (SX)",
                  icon: <ArrowLeft size={16} />,
                  sublabel: "cerniere a destra",
                },
                {
                  value: "destra",
                  label: "Destra (DX)",
                  icon: <ArrowRight size={16} />,
                  sublabel: "cerniere a sinistra",
                },
              ]}
            />
          </div>
          <div>
            <Label>Verso apertura</Label>
            <ToggleGroup<VersoApertura>
              columns={2}
              ariaLabel="Verso apertura"
              value={opzioni.versoApertura}
              onChange={(v) => aggiornaOpz("versoApertura", v)}
              options={[
                { value: "spinta", label: "Spinta", sublabel: "spinge via" },
                { value: "tira", label: "Tira", sublabel: "tira verso" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sezione 6: Anagrafica ordine */}
      <Card>
        <CardHeader>
          <CardTitle>6 · Ordine</CardTitle>
          <CardDescription>Dati per la scheda di produzione</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="cliente">Cliente *</Label>
            <Input
              id="cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Es. Ing. Rossi"
              autoComplete="name"
            />
          </div>
          <div>
            <Label htmlFor="rif">Riferimento porta *</Label>
            <Input
              id="rif"
              value={riferimento}
              onChange={(e) => setRiferimento(e.target.value)}
              placeholder="Es. P-01 Camera Matrimoniale"
            />
          </div>
          <div>
            <Label htmlFor="amb">Ambiente</Label>
            <Input
              id="amb"
              value={ambiente}
              onChange={(e) => setAmbiente(e.target.value)}
              placeholder="Es. Bagno, Camera, Ripostiglio…"
            />
          </div>
          <div>
            <Label htmlFor="nt">Note produzione</Label>
            <Textarea
              id="nt"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Finitura, essenza, ferramenta, dettagli montaggio…"
            />
          </div>
        </CardContent>
      </Card>

      {/* Avvertenze */}
      {calcolo.avvertenze.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Avvertenze</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {calcolo.avvertenze.map((av, i) => {
              const Icon =
                av.livello === "errore"
                  ? AlertTriangle
                  : av.livello === "attenzione"
                    ? AlertTriangle
                    : Info;
              const color =
                av.livello === "errore"
                  ? "text-red-400 border-red-500/40 bg-red-500/10"
                  : av.livello === "attenzione"
                    ? "text-amber-300 border-amber-500/40 bg-amber-500/10"
                    : "text-brand-200 border-brand-500/40 bg-brand-500/10";
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${color}`}
                >
                  <Icon size={18} className="mt-0.5 shrink-0" />
                  <span>{av.messaggio}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {errore && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {errore}
        </div>
      )}

      {/* Barra azioni fissa in basso */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-slate-950/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="flex-1 text-xs text-slate-400 leading-tight">
            {salvataggio === "salvato" ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 size={14} /> Salvato
              </span>
            ) : (
              <>
                <div className="font-medium text-slate-200">
                  {modelloAttivo.nome} · {calcolo.anta.larghezzaCm}×{calcolo.anta.altezzaCm} cm
                </div>
                <div>
                  Maniglia {opzioni.maniglia === "destra" ? "DX" : "SX"} ·{" "}
                  {opzioni.versoApertura === "spinta" ? "spinta" : "tira"}
                </div>
              </>
            )}
          </div>
          <Button
            onClick={onSalva}
            size="lg"
            disabled={salvataggio === "salvando" || hasErrori}
            className="min-w-[130px]"
          >
            <Save size={18} />
            {salvataggio === "salvando" ? "Salvo…" : "Salva ordine"}
          </Button>
        </div>
      </div>
    </div>
  );
}
