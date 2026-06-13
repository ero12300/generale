"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/textarea";

interface DocumentUploadProps {
  equipmentId: string;
}

export function DocumentUpload({ equipmentId }: DocumentUploadProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    form.set("equipment_id", equipmentId);
    try {
      const res = await fetch("/api/documents/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setStatus("success");
      setMessage("Documento caricato");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Errore upload");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-white/5 pt-4 mt-4">
      <p className="text-sm font-medium text-zinc-300 flex items-center gap-2">
        <Upload className="h-4 w-4 text-emerald-400/80" />
        Carica documento
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="document_type">Tipo</Label>
          <Select id="document_type" name="document_type">
            <option value="manual">Manuale</option>
            <option value="invoice">Fattura</option>
            <option value="photo">Foto</option>
            <option value="label_photo">Foto etichetta</option>
            <option value="certificate">Certificato</option>
            <option value="other">Altro</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="file">File</Label>
          <input
            id="file"
            name="file"
            type="file"
            required
            accept=".pdf,image/*"
            className="block w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-white file:text-sm file:font-medium hover:file:bg-emerald-500 transition-colors"
          />
        </div>
      </div>
      <Button type="submit" size="sm" disabled={status === "loading"}>
        {status === "loading" ? "Caricamento..." : "Carica"}
      </Button>
      {message && (
        <p className={`text-xs ${status === "error" ? "text-red-400" : "text-emerald-400"}`}>{message}</p>
      )}
    </form>
  );
}
