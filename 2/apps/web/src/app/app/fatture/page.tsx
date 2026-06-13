import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function FatturePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Fatture fornitori</h1>
      <Card className="border-dashed border-2 border-zinc-700">
        <CardHeader className="text-center py-12">
          <Upload className="h-10 w-10 text-zinc-500 mx-auto mb-4" />
          <CardTitle>Carica fattura PDF o foto</CardTitle>
          <CardDescription className="mt-2">
            MVP: caricamento manuale. Fase 3: estrazione automatica con AI.
          </CardDescription>
          <Button className="mt-6 mx-auto" variant="secondary">
            Seleziona file
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
}
