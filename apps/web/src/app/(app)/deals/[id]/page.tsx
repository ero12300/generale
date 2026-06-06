"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Archive, CheckCircle2, Copy, Trash2 } from "lucide-react";
import type { AnalysisResult, Deal, NormalizedProperty, WorkItem } from "@deal-desk/types";
import { ScenarioPanel } from "@/components/deals/scenario-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [deal, setDeal] = useState<Deal | null>(null);
  const [property, setProperty] = useState<NormalizedProperty | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [offerText, setOfferText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [discount, setDiscount] = useState(5);
  const [capex, setCapex] = useState(40000);
  const [exitMonths, setExitMonths] = useState(12);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const load = useCallback(async () => {
    const res = await fetch(`/api/deals/${id}`);
    const data = await res.json();
    setDeal(data.deal);
    setProperty(data.property);
    setAnalysis(data.analysis);
    setWorkItems(data.workItems ?? []);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function runAnalysis() {
    setActionLoading(true);
    const res = await fetch(`/api/deals/${id}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target_discount_pct: discount / 100,
        total_capex: capex,
        exit_month: exitMonths,
        expected_sale_price: (property?.price_asked ?? 200000) * 1.35,
      }),
    });
    const data = await res.json();
    if (res.ok) setAnalysis(data);
    setActionLoading(false);
  }

  async function generateOffer() {
    setActionLoading(true);
    const offered = (property?.price_asked ?? 0) * (1 - discount / 100);
    const res = await fetch(`/api/deals/${id}/offer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offered_price: offered }),
    });
    const data = await res.json();
    if (res.ok) setOfferText(data.commercial_text);
    setActionLoading(false);
  }

  async function generateWorkList() {
    setActionLoading(true);
    const res = await fetch(`/api/deals/${id}/work-list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (res.ok) setWorkItems(data.items);
    setActionLoading(false);
  }

  async function confirmProperty() {
    setActionLoading(true);
    const res = await fetch(`/api/deals/${id}/property`, { method: "POST" });
    if (res.ok) {
      const updated = await res.json();
      setProperty(updated);
      showToast("Immobile confermato");
    }
    setActionLoading(false);
  }

  async function archiveDeal() {
    setActionLoading(true);
    const res = await fetch(`/api/deals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: "archived" }),
    });
    if (res.ok) {
      const updated = await res.json();
      setDeal(updated);
      showToast("Deal archiviato");
    }
    setActionLoading(false);
  }

  async function deleteDeal() {
    if (!confirm("Eliminare definitivamente questo deal? L'operazione è irreversibile.")) {
      return;
    }
    setActionLoading(true);
    const res = await fetch(`/api/deals/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/deals");
    } else {
      setActionLoading(false);
    }
  }

  async function copyOffer() {
    if (!offerText) return;
    try {
      await navigator.clipboard.writeText(offerText);
      showToast("Bozza copiata negli appunti");
    } catch {
      showToast("Impossibile copiare: usa la selezione manuale");
    }
  }

  if (loading) {
    return <p className="text-zinc-400">Caricamento...</p>;
  }

  if (!deal) {
    return <p className="text-red-400">Deal non trovato</p>;
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 rounded-lg border border-amber-600/50 bg-zinc-900 px-4 py-2 text-sm text-amber-200 shadow-lg"
        >
          {toast}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default">{deal.stage}</Badge>
            <Badge variant="secondary">{deal.strategy.replace(/_/g, " ")}</Badge>
            {property?.status === "confirmed" && (
              <Badge variant="success">Immobile confermato</Badge>
            )}
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
        <div className="flex flex-col items-end gap-3">
          {property?.price_asked && (
            <div className="text-right">
              <p className="text-xs text-zinc-500">Prezzo richiesto</p>
              <p className="text-2xl font-semibold text-amber-400">
                {formatCurrency(property.price_asked)}
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-2 justify-end">
            {property && property.status !== "confirmed" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={confirmProperty}
                disabled={actionLoading}
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                Conferma immobile
              </Button>
            )}
            {deal.stage !== "archived" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={archiveDeal}
                disabled={actionLoading}
              >
                <Archive className="h-4 w-4" aria-hidden />
                Archivia
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteDeal}
              disabled={actionLoading}
              aria-label="Elimina deal"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Elimina
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Dati immobile</CardTitle>
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
                    <Label>Sconto acquisto (%)</Label>
                    <Input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      min={0}
                      max={30}
                    />
                  </div>
                  <div>
                    <Label>Capex ristrutturazione (€)</Label>
                    <Input
                      type="number"
                      value={capex}
                      onChange={(e) => setCapex(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label>Tempo exit (mesi)</Label>
                    <Input
                      type="number"
                      value={exitMonths}
                      onChange={(e) => setExitMonths(Number(e.target.value))}
                      min={3}
                      max={60}
                    />
                  </div>
                </CardContent>
              </Card>
              <Button onClick={runAnalysis} disabled={actionLoading}>
                {actionLoading ? "Calcolo..." : "Esegui analisi scenari"}
              </Button>
              {analysis && <ScenarioPanel analysis={analysis} />}
            </TabsContent>

            <TabsContent value="offer" className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={generateOffer} disabled={actionLoading}>
                  Genera bozza proposta acquisto
                </Button>
                {offerText && (
                  <Button variant="secondary" onClick={copyOffer} disabled={actionLoading}>
                    <Copy className="h-4 w-4" aria-hidden />
                    Copia bozza
                  </Button>
                )}
              </div>
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
              <Button onClick={generateWorkList} disabled={actionLoading}>
                Genera WBS cantiere
              </Button>
              {workItems.length > 0 && (
                <Card>
                  <CardContent className="p-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-800 text-zinc-500 text-xs">
                          <th className="text-left p-3">Ambiente</th>
                          <th className="text-left p-3">Descrizione</th>
                          <th className="text-right p-3">Qtà</th>
                          <th className="text-right p-3">Prezzo</th>
                          <th className="text-center p-3">Permesso</th>
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
                            <td className="p-3 text-center">
                              {item.requires_permit ? "⚠️" : "—"}
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
