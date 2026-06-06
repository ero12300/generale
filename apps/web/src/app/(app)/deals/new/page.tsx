"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEAL_STRATEGIES } from "@deal-desk/types";
import type { DealStrategy } from "@deal-desk/types";

export default function NewDealPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [strategy, setStrategy] = useState<DealStrategy>("fix_flip");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<Record<string, unknown> | null>(null);

  async function handleParse() {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "Errore durante l'estrazione.");
        return;
      }
      setParsed(data);
      if (!title && data.address) setTitle(String(data.address));
      else if (!title && data.page_title) setTitle(String(data.page_title).slice(0, 80));
    } catch {
      setError("Errore durante l'estrazione. Puoi inserire i dati manualmente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!title) {
      setError("Inserisci un titolo per il deal");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, strategy, source_url: url || null }),
      });
      const deal = await res.json();

      if (parsed) {
        await fetch(`/api/deals/${deal.id}/property`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price_asked: parsed.price_asked,
            surface_sqm: parsed.surface_sqm,
            address: parsed.address,
            zone: parsed.zone,
            city: parsed.city,
            rooms: parsed.rooms,
            description: parsed.description,
            media_urls: parsed.media_urls ?? [],
            raw_fields: parsed.raw_fields ?? parsed,
            status: "draft",
          }),
        });
      }

      router.push(`/deals/${deal.id}`);
    } catch {
      setError("Errore nella creazione del deal");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Nuovo deal</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Incolla il link dell&apos;annuncio per estrarre i dati, poi conferma
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Intake immobile</CardTitle>
          <CardDescription>
            Solo URL forniti da te — nessuno scraping automatico dei portali
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Link annuncio</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button type="button" variant="secondary" onClick={handleParse} disabled={loading || !url}>
                Estrai
              </Button>
            </div>
          </div>

          {parsed && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm space-y-1">
              <p className="text-zinc-400 text-xs uppercase">Dati estratti (bozza)</p>
              {parsed.extraction_method === "manual_fallback" ? (
                <p className="text-amber-300 text-xs">
                  {(parsed.raw_fields as Record<string, string> | undefined)?.notice ??
                    "Servizio intake non disponibile. Inserisci i dati manualmente."}
                </p>
              ) : (
                <>
                  {parsed.price_asked != null && (
                    <p>Prezzo: € {Number(parsed.price_asked).toLocaleString("it-IT")}</p>
                  )}
                  {parsed.surface_sqm != null && (
                    <p>Superficie: {String(parsed.surface_sqm)} m²</p>
                  )}
                  {parsed.rooms != null && <p>Locali: {String(parsed.rooms)}</p>}
                  {parsed.address != null && <p>Indirizzo: {String(parsed.address)}</p>}
                  {parsed.price_asked == null &&
                    parsed.surface_sqm == null &&
                    parsed.address == null && (
                      <p className="text-amber-300 text-xs">
                        Nessun campo estratto automaticamente. Inseriscili manualmente sotto.
                      </p>
                    )}
                </>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Titolo deal</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strategy">Strategia</Label>
            <select
              id="strategy"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as DealStrategy)}
              className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm"
            >
              {DEAL_STRATEGIES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-400" role="alert">{error}</p>}

          <Button onClick={handleCreate} disabled={loading} className="w-full">
            {loading ? "Creazione..." : "Crea deal e continua"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
