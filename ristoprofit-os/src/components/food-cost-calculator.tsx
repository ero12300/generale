"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  computeFoodCost,
  type Recipe,
  type Unit,
  type FoodCostStatus,
} from "@/lib/food-cost";
import { formatCents, formatRatio, toCents } from "@/lib/money";
import { DEMO_RECIPES } from "@/lib/demo-data";

interface Row {
  name: string;
  packPriceEuro: number;
  packSize: number;
  quantity: number;
  unit: Unit;
  wastePct: number;
}

const UNITS: Unit[] = ["g", "kg", "ml", "l", "pz"];

const STATUS_VARIANT: Record<FoodCostStatus, "ottimo" | "buono" | "attenzione" | "critico"> = {
  ottimo: "ottimo",
  buono: "buono",
  attenzione: "attenzione",
  critico: "critico",
};

function recipeToState(recipe: Recipe) {
  return {
    name: recipe.name,
    salePriceEuro: recipe.salePriceCents / 100,
    portions: recipe.portions,
    rows: recipe.ingredients.map<Row>((i) => ({
      name: i.name,
      packPriceEuro: i.packPriceCents / 100,
      packSize: i.packSize,
      quantity: i.quantity,
      unit: i.unit,
      wastePct: i.wastePct ?? 0,
    })),
  };
}

export function FoodCostCalculator() {
  const initial = recipeToState(DEMO_RECIPES[0]);
  const [name, setName] = useState(initial.name);
  const [salePriceEuro, setSalePriceEuro] = useState(initial.salePriceEuro);
  const [portions, setPortions] = useState(initial.portions);
  const [rows, setRows] = useState<Row[]>(initial.rows);

  function loadRecipe(id: string) {
    const recipe = DEMO_RECIPES.find((r) => r.id === id);
    if (!recipe) return;
    const s = recipeToState(recipe);
    setName(s.name);
    setSalePriceEuro(s.salePriceEuro);
    setPortions(s.portions);
    setRows(s.rows);
  }

  function updateRow(index: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { name: "", packPriceEuro: 0, packSize: 1000, quantity: 0, unit: "g", wastePct: 0 },
    ]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  const result = useMemo(() => {
    const recipe: Recipe = {
      id: "live",
      name,
      salePriceCents: toCents(salePriceEuro || 0),
      portions: portions || 1,
      ingredients: rows.map((r) => ({
        name: r.name,
        packPriceCents: toCents(r.packPriceEuro || 0),
        packSize: r.packSize || 1,
        quantity: r.quantity || 0,
        unit: r.unit,
        wastePct: r.wastePct || 0,
      })),
    };
    return computeFoodCost(recipe);
  }, [name, salePriceEuro, portions, rows]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      {/* Editor ricetta */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Ricetta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-end gap-2">
              <span className="text-xs text-zinc-500">Carica esempio:</span>
              {DEMO_RECIPES.map((r) => (
                <Button
                  key={r.id}
                  size="sm"
                  variant="secondary"
                  onClick={() => loadRecipe(r.id)}
                >
                  {r.name}
                </Button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <Label htmlFor="recipe-name">Nome piatto</Label>
                <Input
                  id="recipe-name"
                  className="mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sale-price">Prezzo vendita (€)</Label>
                <Input
                  id="sale-price"
                  className="mt-1"
                  type="number"
                  min={0}
                  step="0.5"
                  value={salePriceEuro}
                  onChange={(e) => setSalePriceEuro(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="portions">Porzioni prodotte</Label>
                <Input
                  id="portions"
                  className="mt-1"
                  type="number"
                  min={1}
                  step="1"
                  value={portions}
                  onChange={(e) => setPortions(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingredienti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="hidden grid-cols-[1.6fr_0.9fr_0.8fr_0.8fr_0.7fr_0.7fr_auto] gap-2 px-1 text-xs text-zinc-500 md:grid">
              <span>Ingrediente</span>
              <span>Prezzo conf. €</span>
              <span>Q.tà conf.</span>
              <span>Usata</span>
              <span>Unità</span>
              <span>Scarto %</span>
              <span />
            </div>
            {rows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-2 rounded-lg border border-zinc-800 p-2 md:grid-cols-[1.6fr_0.9fr_0.8fr_0.8fr_0.7fr_0.7fr_auto] md:border-0 md:p-0"
              >
                <Input
                  aria-label="Nome ingrediente"
                  placeholder="Ingrediente"
                  className="col-span-2 md:col-span-1"
                  value={row.name}
                  onChange={(e) => updateRow(i, { name: e.target.value })}
                />
                <Input
                  aria-label="Prezzo confezione"
                  type="number"
                  min={0}
                  step="0.1"
                  value={row.packPriceEuro}
                  onChange={(e) => updateRow(i, { packPriceEuro: Number(e.target.value) })}
                />
                <Input
                  aria-label="Quantità confezione"
                  type="number"
                  min={0}
                  step="1"
                  value={row.packSize}
                  onChange={(e) => updateRow(i, { packSize: Number(e.target.value) })}
                />
                <Input
                  aria-label="Quantità usata"
                  type="number"
                  min={0}
                  step="1"
                  value={row.quantity}
                  onChange={(e) => updateRow(i, { quantity: Number(e.target.value) })}
                />
                <select
                  aria-label="Unità"
                  className="h-10 rounded-lg border border-zinc-700 bg-zinc-950/60 px-2 text-sm"
                  value={row.unit}
                  onChange={(e) => updateRow(i, { unit: e.target.value as Unit })}
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <Input
                  aria-label="Scarto percentuale"
                  type="number"
                  min={0}
                  max={99}
                  step="1"
                  value={row.wastePct}
                  onChange={(e) => updateRow(i, { wastePct: Number(e.target.value) })}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Rimuovi ingrediente"
                  onClick={() => removeRow(i)}
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="h-4 w-4" /> Aggiungi ingrediente
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Risultato live */}
      <div className="space-y-4 lg:sticky lg:top-8 lg:self-start">
        <Card className="border-emerald-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Food cost</CardTitle>
              <Badge variant={STATUS_VARIANT[result.status]}>
                {result.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-5xl font-bold text-emerald-400">
                {formatRatio(result.foodCostRatio)}
              </p>
              <p className="text-xs text-zinc-500">food cost</p>
            </div>
            <dl className="space-y-2 text-sm">
              <Stat label="Costo per porzione" value={formatCents(result.costPerPortionCents)} />
              <Stat label="Prezzo di vendita" value={formatCents(result.salePriceCents)} />
              <Stat
                label="Margine lordo"
                value={`${formatCents(result.grossMarginCents)} (${formatRatio(result.grossMarginRatio)})`}
                strong
              />
              <Stat label="Prezzo minimo" value={formatCents(result.suggestedMinPriceCents)} />
              <Stat
                label="Prezzo ideale"
                value={formatCents(result.suggestedIdealPriceCents)}
                strong
              />
            </dl>
            {result.alert && (
              <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-200">
                {result.alert}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dettaglio costi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-sm">
            {result.breakdown.map((b, i) => (
              <div key={i} className="flex justify-between gap-2">
                <span className="truncate text-zinc-400">{b.name || "—"}</span>
                <span>{formatCents(b.costCents)}</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t border-zinc-800 pt-2 font-semibold">
              <span>Totale ingredienti</span>
              <span>{formatCents(result.totalIngredientsCents)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-zinc-400">{label}</dt>
      <dd className={strong ? "font-semibold text-emerald-300" : ""}>{value}</dd>
    </div>
  );
}
