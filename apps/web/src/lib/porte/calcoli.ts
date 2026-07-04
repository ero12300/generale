import type {
  ConfigurazionePorta,
  DimensioniPorta,
} from "./types";
import {
  ALTEZZE_STANDARD_ANTA,
  LARGHEZZE_STANDARD_ANTA,
} from "./types";

// Tolleranze standard italiani (mm)
const RIDUZIONE_LARGHEZZA_CONTROTELAIO = 20; // 10mm per lato tra vano e controtelaio
const RIDUZIONE_ALTEZZA_CONTROTELAIO = 20;   // in basso non si riduce (pavimento), in alto 20mm

const RIDUZIONE_LARGHEZZA_LUCE = 60;  // 30mm per lato: controtelaio + telaio
const RIDUZIONE_ALTEZZA_LUCE = 40;    // sopra

const GIOCO_ANTA_LATERALE = 3;        // 3mm per lato tra anta e telaio
const GIOCO_ANTA_SOPRA = 3;           // 3mm sopra
const GIOCO_ANTA_PAVIMENTO = 6;       // 6mm sotto (senza guarnizione)

const MONTANTE_CENTRALE_DOPPIA = 40;  // spessore montante per porta doppia battente

// Spessore telaio in base allo spessore del muro (mm)
function calcolaSpessoreTelaio(spessoreMuro: number): number {
  if (spessoreMuro <= 80) return 80;
  if (spessoreMuro <= 100) return 100;
  if (spessoreMuro <= 120) return 120;
  if (spessoreMuro <= 150) return 150;
  if (spessoreMuro <= 200) return 200;
  return spessoreMuro;
}

function antaStandardPiuVicina(larghezza: number): number {
  let piuVicina = LARGHEZZE_STANDARD_ANTA[0] * 10;
  let minDiff = Math.abs(larghezza - piuVicina);
  for (const std of LARGHEZZE_STANDARD_ANTA) {
    const stdMm = std * 10;
    const diff = Math.abs(larghezza - stdMm);
    if (diff < minDiff) {
      minDiff = diff;
      piuVicina = stdMm;
    }
  }
  return piuVicina;
}

function altezzaStandardPiuVicina(altezza: number): number {
  let piuVicina = ALTEZZE_STANDARD_ANTA[0] * 10;
  let minDiff = Math.abs(altezza - piuVicina);
  for (const std of ALTEZZE_STANDARD_ANTA) {
    const stdMm = std * 10;
    const diff = Math.abs(altezza - stdMm);
    if (diff < minDiff) {
      minDiff = diff;
      piuVicina = stdMm;
    }
  }
  return piuVicina;
}

export function calcolaDimensioniPorta(
  cfg: ConfigurazionePorta
): DimensioniPorta {
  const { vano, tipologia, apertura, versoApertura, tipoVetro, posizioneManigliaPorta } = cfg;
  const avvisi: string[] = [];

  const { larghezzaVano, altezzaVano, spessoreMuro } = vano;

  // Controtelaio
  const larghezzaControtelaio = larghezzaVano - RIDUZIONE_LARGHEZZA_CONTROTELAIO;
  const altezzaControtelaio = altezzaVano - RIDUZIONE_ALTEZZA_CONTROTELAIO;

  // Luce telaio (apertura netta interna al telaio)
  const larghezzaLuce = larghezzaControtelaio - RIDUZIONE_LARGHEZZA_LUCE;
  const altezzaLuce = altezzaControtelaio - RIDUZIONE_ALTEZZA_LUCE;

  const spessoreTelaio = calcolaSpessoreTelaio(spessoreMuro);

  // Dimensioni anta
  let larghezzaAntaCalcolata: number;
  let altezzaAntaCalcolata: number;

  if (tipologia === "battente" || tipologia === "battente_sopraluce") {
    larghezzaAntaCalcolata = larghezzaLuce - GIOCO_ANTA_LATERALE * 2;
    altezzaAntaCalcolata = (tipologia === "battente_sopraluce"
      ? (cfg.altezzaAntaPersonalizzata ?? altezzaStandardPiuVicina(altezzaLuce - 100))
      : altezzaLuce - GIOCO_ANTA_SOPRA - GIOCO_ANTA_PAVIMENTO
    );
  } else if (tipologia === "battente_fisso" || tipologia === "battente_fisso_sopraluce") {
    // Anta standard, fisso prende il resto
    const antaStd = cfg.larghezzaAntaPersonalizzata
      ?? antaStandardPiuVicina(larghezzaLuce * 0.6);
    larghezzaAntaCalcolata = antaStd - GIOCO_ANTA_LATERALE * 2;
    altezzaAntaCalcolata = (tipologia === "battente_fisso_sopraluce"
      ? (cfg.altezzaAntaPersonalizzata ?? altezzaStandardPiuVicina(altezzaLuce - 100))
      : altezzaLuce - GIOCO_ANTA_SOPRA - GIOCO_ANTA_PAVIMENTO
    );
  } else if (tipologia === "doppia_battente") {
    const semiLarghezza = (larghezzaLuce - MONTANTE_CENTRALE_DOPPIA) / 2;
    larghezzaAntaCalcolata = semiLarghezza - GIOCO_ANTA_LATERALE * 2;
    altezzaAntaCalcolata = altezzaLuce - GIOCO_ANTA_SOPRA - GIOCO_ANTA_PAVIMENTO;
  } else {
    larghezzaAntaCalcolata = larghezzaLuce - GIOCO_ANTA_LATERALE * 2;
    altezzaAntaCalcolata = altezzaLuce - GIOCO_ANTA_SOPRA - GIOCO_ANTA_PAVIMENTO;
  }

  // Override manuale se specificato
  if (cfg.larghezzaAntaPersonalizzata && tipologia === "battente") {
    larghezzaAntaCalcolata = cfg.larghezzaAntaPersonalizzata - GIOCO_ANTA_LATERALE * 2;
  }
  if (cfg.altezzaAntaPersonalizzata && tipologia === "battente") {
    altezzaAntaCalcolata = cfg.altezzaAntaPersonalizzata - GIOCO_ANTA_SOPRA - GIOCO_ANTA_PAVIMENTO;
  }

  // Fisso laterale
  let larghezzaFisso: number | undefined;
  let altezzaFisso: number | undefined;
  const MONTANTE_FISSO = 40; // spessore montante divisore anta/fisso
  if (tipologia === "battente_fisso" || tipologia === "battente_fisso_sopraluce") {
    larghezzaFisso = larghezzaLuce - larghezzaAntaCalcolata - GIOCO_ANTA_LATERALE * 2 - MONTANTE_FISSO;
    altezzaFisso = altezzaAntaCalcolata;
    if (larghezzaFisso < 100) {
      avvisi.push("⚠️ Il fisso laterale calcolato è molto stretto (<100mm). Verifica le dimensioni.");
    }
  }

  // Sopraluce
  let larghezzaSopraluce: number | undefined;
  let altezzaSopraluce: number | undefined;
  const TRAVERSA_SOPRALUCE = 40; // spessore traversa divisore anta/sopraluce
  if (tipologia === "battente_sopraluce" || tipologia === "battente_fisso_sopraluce") {
    larghezzaSopraluce = larghezzaLuce;
    altezzaSopraluce = altezzaLuce - altezzaAntaCalcolata - GIOCO_ANTA_SOPRA - TRAVERSA_SOPRALUCE;
    if (altezzaSopraluce < 100) {
      avvisi.push("⚠️ Il sopraluce calcolato è molto basso (<100mm). Verifica le dimensioni.");
    }
  }

  const antaStandardSuggerita = altezzaStandardPiuVicina(altezzaAntaCalcolata);
  const larghezzaStandardSuggerita = antaStandardPiuVicina(larghezzaAntaCalcolata);

  // Avvisi dimensioni
  if (larghezzaVano < 700) {
    avvisi.push("⚠️ Il vano è molto stretto. Verificare normative di accessibilità.");
  }
  if (larghezzaAntaCalcolata < 550) {
    avvisi.push("⚠️ L'anta risulta inferiore a 60cm. Valutare un vano più ampio.");
  }
  if (altezzaVano < 2100) {
    avvisi.push("⚠️ Il vano ha altezza non standard. Dimensioni minori di 210cm.");
  }
  if (spessoreMuro > spessoreTelaio) {
    avvisi.push(`ℹ️ Muro spessore ${spessoreMuro}mm: verificare la disponibilità di telaio adatto.`);
  }

  return {
    larghezzaVano,
    altezzaVano,
    spessoreMuro,
    larghezzaControtelaio,
    altezzaControtelaio,
    larghezzaLuce,
    altezzaLuce,
    larghezzaAnta: Math.round(larghezzaAntaCalcolata),
    altezzaAnta: Math.round(altezzaAntaCalcolata),
    larghezzaFisso: larghezzaFisso !== undefined ? Math.round(larghezzaFisso) : undefined,
    altezzaFisso: altezzaFisso !== undefined ? Math.round(altezzaFisso) : undefined,
    larghezzaSopraluce: larghezzaSopraluce !== undefined ? Math.round(larghezzaSopraluce) : undefined,
    altezzaSopraluce: altezzaSopraluce !== undefined ? Math.round(altezzaSopraluce) : undefined,
    spessoreTelaio,
    apertura,
    versoApertura,
    posizioneManigliaPorta,
    tipologia,
    tipoVetro,
    antaStandardSuggerita,
    larghezzaStandardSuggerita,
    avvisi,
  };
}

export function descrizioneTipologia(tipologia: ConfigurazionePorta["tipologia"]): string {
  switch (tipologia) {
    case "battente": return "Porta battente singola";
    case "battente_fisso": return "Porta battente con fisso laterale";
    case "battente_sopraluce": return "Porta battente con sopraluce";
    case "battente_fisso_sopraluce": return "Porta battente con fisso e sopraluce";
    case "doppia_battente": return "Porta doppia battente";
    default: {
      const _exhaustive: never = tipologia;
      return _exhaustive;
    }
  }
}

export function descrizioneVetro(tipoVetro: ConfigurazionePorta["tipoVetro"]): string {
  switch (tipoVetro) {
    case "nessuno": return "Senza vetro (cieco)";
    case "intero": return "Vetro intero (light)";
    case "ovale": return "Inserto ovale decorativo";
    case "parziale": return "Vetro parziale (pannello)";
    default: {
      const _exhaustive: never = tipoVetro;
      return _exhaustive;
    }
  }
}
