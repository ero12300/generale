import { etichettaVerso } from "../domain/calcolo";
import type { SchedaProduzione } from "../domain/types";

/** Scarica la scheda come file JSON per l'integrazione con sistemi di produzione. */
export function esportaJson(scheda: SchedaProduzione, riferimento: string): void {
  const payload = {
    applicazione: "PortaPro",
    versioneSchema: 1,
    riferimento,
    generataIl: new Date().toISOString(),
    verso: etichettaVerso(scheda.input),
    unita: "mm",
    ...scheda,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `porta_${riferimento.replace(/[^a-z0-9-_]+/gi, "_") || "scheda"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Apre la finestra di stampa del browser: da mobile consente "Salva come PDF". */
export function stampaScheda(): void {
  window.print();
}
