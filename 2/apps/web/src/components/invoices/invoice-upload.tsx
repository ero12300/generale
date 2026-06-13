"use client";

import { useCallback, useState } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface InvoiceRow {
  id: string;
  document_path: string | null;
  status: string;
  created_at: string;
}

export function InvoiceUpload({ initial }: { initial?: InvoiceRow[] }) {
  const [invoices, setInvoices] = useState<InvoiceRow[]>(initial ?? []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onUpload = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/invoices", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload fallito");
      setInvoices((prev) => [json.data, ...prev]);
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore upload");
    } finally {
      setUploading(false);
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-dashed border-2 border-emerald-500/20 bg-emerald-500/5" glow>
        <CardHeader className="text-center py-8">
          <Upload className="h-10 w-10 text-emerald-500/60 mx-auto mb-4" aria-hidden />
          <CardTitle>Carica fattura PDF o foto</CardTitle>
          <CardDescription className="mt-2">
            Max 10MB · PDF, JPEG, PNG, WebP
          </CardDescription>
          <label className="mt-6 inline-block">
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onUpload(file);
              }}
            />
            <Button variant="secondary" disabled={uploading} asChild>
              <span>{uploading ? "Caricamento..." : "Seleziona file"}</span>
            </Button>
          </label>
          {success && (
            <p className="text-sm text-emerald-400 mt-4 flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4" /> Fattura caricata
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-red-400 mt-4 flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}
        </CardHeader>
      </Card>

      {invoices.length > 0 && (
        <Card glow>
          <CardHeader>
            <CardTitle>Fatture caricate</CardTitle>
            <ul className="mt-4 space-y-2 text-sm">
              {invoices.map((inv) => (
                <li key={inv.id} className="flex justify-between text-zinc-400">
                  <span className="truncate max-w-[60%]">{inv.document_path ?? "—"}</span>
                  <span className="text-amber-400">{inv.status}</span>
                </li>
              ))}
            </ul>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
