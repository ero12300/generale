import type { Metadata } from "next";
import { DemoForm } from "./demo-form";

export const metadata: Metadata = { title: "Richiedi una demo" };

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-ink">Richiedi una demo</h1>
        <p className="text-warmgray">
          Compili il modulo: un consulente Emotive La contatterà per mostrarLe
          quanto guadagna davvero su ogni piatto.
        </p>
      </div>
      <DemoForm />
    </div>
  );
}
