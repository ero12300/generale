"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import type { AnalysisResult, Deal, NormalizedProperty, WorkItem } from "@deal-desk/types";
import { ScenarioPanel } from "@/components/deals/scenario-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

type ActionKind = "analysis" | "offer" | "works" | "confirm";

export default function DealDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [deal, setDeal] = useState<Deal | null>(null);
  const [property, setProperty] = useState<NormalizedProperty | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [offerText, setOfferText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<ActionKind | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [discount, setDiscount] = useState(5);
  const [capex, setCapex] = useState(40000);
  const [exitMonths, setExitMonths] = useState(12);
  const [monthlyRent, setMonthlyRent] = useState(0);

  const isRentalStrategy =
    deal?.strategy === "buy_renovate_rent" || deal?.strategy === "buy_hold_sell";

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`/api/deals/${id}`);
      if (!res.ok) {
        setLoadError("Impossibile caricare il deal.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setDeal(data.deal);
      setProperty(data.property);
      setAnalysis(data.analysis);
      setWorkItems(data.workItems ?? []);
      if (data.offerLetter?.commercial_text) {
        setOfferText(data.offerLetter.commercial_text);
      }
      if (data.property?.price_asked) {
        setMonthlyRent(Math.round(data.property.price_asked * 0.004));
      }
    } catch {
      setLoadError("Errore di rete durante il caricamento.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function runAction<T>(
    kind: ActionKind,
    url: string,
    body: Record<string, unknown>,
    onSuccess: (data: T) => void,
    successMessage: string
  ) {
    setActionLoading(kind);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error ?? "Operazione non riuscita. Verifica che il servizio analytics sia attivo.");
        return;
      }
      onSuccess(data as T);
      setActionSuccess(successMessage);
    } catch {
      setActionError("Errore di rete. Riprova tra qualche secondo.");
    } finally {
      setActionLoading(null);
    }
  }

  async function runAnalysis() {
    const asking = property?.price_asked ?? 200000;
    await runAction<AnalysisResult>(
      "analysis",
      `/api/deals/${id}/analyze`,
      {
        target_discount_pct: discount / 100,
        total_capex: capex,
        exit_month: exitMonths,
        expected_sale_price: asking * 1.35,
        monthly_rent: isRentalStrategy ? monthlyRent : 0,
      },
      (data) => setAnalysis(data),
      "Analisi scenari aggiornata."
    );
  }

  async function confirmProperty() {
    setActionLoading("confirm");
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(`/api/deals/${id}/property`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error ?? "Conferma non riuscita");
        return;
      }
      setProperty(data);
      setActionSuccess("Dati immobile confermati.");
    } catch {
      setActionError("Errore di rete durante la conferma.");
    } finally {
      setActionLoading(null);
    }
  }

  async function generateOffer() {
    const offered = (property?.price_asked ?? 0) * (1 - discount / 100);
    await runAction(
      "offer",
      `/api/deals/${id}/offer`,
      { offered_price: offered },
      (data) => setOfferText(String((data as { commercial_text?: string }).commercial_text ?? "")),
      "Bozza proposta generata."
    );
  }

  async function generateWorkList() {
    await runAction(
      "works",
      `/api/deals/${id}/work-list`,
      {},
      (data) => setWorkItems(((data as { items?: WorkItem[] }).items) ?? []),
      "Lista lavori generata."
    );
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse" aria-live="polite" aria-busy="true">
        <div className="h-8 w-64 bg-zinc-800 rounded" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="h-64 bg-zinc-900 rounded-xl border border-zinc-800" />
          <div className="xl:col-span-2 h-96 bg-zinc-900 rounded-xl border border-zinc-800" />
        </div>
      </div>
    );
  }

  if (loadError || !deal) {
    return (
      <div role="alert" className="rounded-lg border border-red-900/50 bg-red-950/30 p-4 text-red-300">
        {loadError ?? "Deal non trovato"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default">{deal.stage}</Badge>
            <Badge variant="secondary">{deal.strategy.replace(/_/g, " ")}</Badge>
          </div>
          <h1 className="text-2xl font-semibold">{deal.title}</h1>
          {deal.source_url && (
            <a
              href={deal.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-400 hover:underline mt-1 inline-block"
            >
              Vedi annuncio originale
            </a>
          )}
        </div>
        {property?.price_asked && (
          <div className="text-right">
            <p className="text-xs text-zinc-500">Prezzo richiesto</p>
            <p className="text-2xl font-semibold text-amber-400">
              {formatCurrency(property.price_asked)}
            </p>
          </div>
        )}
      </div>

      {(actionError || actionSuccess) && (
        <div
          role="alert"
          className={`rounded-lg border p-3 text-sm ${
            actionError
              ? "border-red-900/50 bg-red-950/30 text-red-300"
              : "border-emerald-900/50 bg-emerald-950/30 text-emerald-300"
          }`}
        >
          {actionError ?? actionSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Dati immobile</CardTitle>
            {property?.status === "confirmed" ? (
              <Badge variant="success">Confermato</Badge>
            ) : (
              <Badge variant="warning">Bozza</Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Indirizzo" value={property?.address} />
            <Row label="Zona" value={property?.zone} />
            <Row label="Città" value={property?.city} />
            <Row label="Superficie" value={property?.surface_sqm ? `${property.surface_sqm} m²` : null} />
            <Row label="Locali" value={property?.rooms?.toString()} />
            <Row label="Classe energetica" value={property?.energy_class} />
            <Row label="Stato" value={property?.condition} />
            <Row label="Spese condo." value={property?.condo_fees_monthly ? formatCurrency(property.condo_fees_monthly) + "/mese" : null} />
            {property?.description && (
              <p className="text-zinc-400 text-xs pt-2 border-t border-zinc-800">{property.description}</p>
            )}
            {property?.status !== "confirmed" && (
              <Button
                type="button"
                variant="secondary"
                className="w-full mt-3"
                disabled={actionLoading !== null}
                onClick={confirmProperty}
              >
                Conferma dati immobile
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="xl:col-span-2">
          <Tabs defaultValue="simulator">
            <TabsList>
              <TabsTrigger value="simulator">Simulatore</TabsTrigger>
              <TabsTrigger value="offer">Proposta</TabsTrigger>
              <TabsTrigger value="works">Lista lavori</TabsTrigger>
            </TabsList>

            <TabsContent value="simulator" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Leve operative</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="discount">Sconto acquisto (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      min={0}
                      max={30}
                    />
                  </div>
                  <div>
                    <Label htmlFor="capex">Capex ristrutturazione (€)</Label>
                    <Input
                      id="capex"
                      type="number"
                      value={capex}
                      onChange={(e) => setCapex(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label htmlFor="exit">Tempo exit (mesi)</Label>
                    <Input
                      id="exit"
                      type="number"
                      value={exitMonths}
                      onChange={(e) => setExitMonths(Number(e.target.value))}
                      min={3}
                      max={60}
                    />
                  </div>
                  {isRentalStrategy && (
                    <div className="md:col-span-3">
                      <Label htmlFor="rent">Canone mensile stimato (€)</Label>
                      <Input
                        id="rent"
                        type="number"
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(Number(e.target.value))}
                        min={0}
                      />
                      <p className="text-xs text-zinc-500 mt-1">
                        Usato per calcolare DSCR e cash flow nelle strategie con locazione.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Button onClick={runAnalysis} disabled={actionLoading !== null}>
                {actionLoading === "analysis" ? "Calcolo in corso..." : "Esegui analisi scenari"}
              </Button>
              {analysis && <ScenarioPanel analysis={analysis} strategy={deal.strategy} />}
            </TabsContent>

            <TabsContent value="offer" className="space-y-4">
              <Button onClick={generateOffer} disabled={actionLoading !== null}>
                {actionLoading === "offer" ? "Generazione..." : "Genera bozza proposta acquisto"}
              </Button>
              {offerText && (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-amber-400 mb-3 font-medium">
                      BOZZA — Revisione avvocato/notaio obbligatoria
                    </p>
                    <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-sans">
                      {offerText}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="works" className="space-y-4">
              <Button onClick={generateWorkList} disabled={actionLoading !== null}>
                {actionLoading === "works" ? "Generazione..." : "Genera WBS cantiere"}
              </Button>
              {workItems.length > 0 && (
                <Card>
                  <CardContent className="p-0">
                    <table className="w-full text-sm">
                      <caption className="sr-only">Lista lavori stimata per il cantiere</caption>
                      <thead>
                        <tr className="border-b border-zinc-800 text-zinc-500 text-xs">
                          <th scope="col" className="text-left p-3">Ambiente</th>
                          <th scope="col" className="text-left p-3">Descrizione</th>
                          <th scope="col" className="text-right p-3">Qtà</th>
                          <th scope="col" className="text-right p-3">Prezzo</th>
                          <th scope="col" className="text-center p-3">Permesso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workItems.map((item) => (
                          <tr key={item.id} className="border-b border-zinc-800/50">
                            <td className="p-3">{item.room}</td>
                            <td className="p-3">{item.description}</td>
                            <td className="p-3 text-right">{item.quantity} {item.unit}</td>
                            <td className="p-3 text-right">
                              {formatCurrency(item.quantity * item.unit_price)}
                            </td>
                            <td className="p-3 text-center" aria-label={item.requires_permit ? "Richiede permesso" : "Nessun permesso"}>
                              {item.requires_permit ? "Sì" : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="p-3 text-right font-medium text-amber-400">
                      Totale stimato:{" "}
                      {formatCurrency(
                        workItems.reduce((s, i) => s + i.quantity * i.unit_price, 0)
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-zinc-500">{label}</span>
      <span className="text-zinc-200 text-right">{value ?? "—"}</span>
    </div>
  );
}
