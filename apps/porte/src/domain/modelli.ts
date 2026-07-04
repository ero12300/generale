import type { DefinizioneModello, ModelloId } from "./types";

/**
 * Catalogo modelli porta.
 *
 * I valori di detrazione derivano dalle convenzioni di produzione italiane:
 * - porte interne a battente: luce passaggio ≈ foro muro − 100 mm (L) e − 50 mm (H)
 *   (fonte: guide misure Porte in kit, Ermetika, manuale FederlegnoArredo)
 * - porte tagliafuoco (tipo Univer/Proget): telaio angolare in acciaio con
 *   detrazioni maggiori e oblò non ammesso su 1 anta con foro muro L > 1167 mm
 *   (fonte: catalogo Ninz/Univer REI 120)
 */
export const MODELLI: Record<ModelloId, DefinizioneModello> = {
  "battente-classic": {
    id: "battente-classic",
    nome: "Battente Classic (legno)",
    descrizione:
      "Porta interna a battente con telaio in legno e coprifili. Uso residenziale.",
    detrazioneTelaioL: 100,
    detrazioneTelaioH: 50,
    battutaLaterale: 12,
    battutaSuperiore: 12,
    giocoLaterale: 3,
    giocoPavimento: 7,
    spessoreAnta: 44,
    sormontoCentrale: 30,
    minL1: 630,
    maxL1: 1030,
    minL2: 1160,
    maxL2: 2060,
    minH: 1980,
    maxH: 2450,
    consenteDueAnte: true,
    consenteOblo: true,
    consenteVetrina: true,
    maxL1ConOblo: null,
    tolleranzaPosa: 5,
  },
  "filo-muro": {
    id: "filo-muro",
    nome: "Filo Muro (rasomuro)",
    descrizione:
      "Porta a battente complanare alla parete, telaio in alluminio a scomparsa, senza coprifili.",
    detrazioneTelaioL: 120,
    detrazioneTelaioH: 60,
    battutaLaterale: 0,
    battutaSuperiore: 0,
    giocoLaterale: 4,
    giocoPavimento: 7,
    spessoreAnta: 48,
    sormontoCentrale: 0,
    minL1: 600,
    maxL1: 1000,
    minL2: 1200,
    maxL2: 2000,
    minH: 1500,
    maxH: 2700,
    consenteDueAnte: true,
    consenteOblo: false,
    consenteVetrina: true,
    maxL1ConOblo: null,
    tolleranzaPosa: 3,
  },
  "rei-60": {
    id: "rei-60",
    nome: "Tagliafuoco REI 60 (acciaio)",
    descrizione:
      "Porta metallica tagliafuoco EI2 60, telaio angolare in acciaio zincato, autochiudente.",
    detrazioneTelaioL: 106,
    detrazioneTelaioH: 53,
    battutaLaterale: 15,
    battutaSuperiore: 15,
    giocoLaterale: 4,
    giocoPavimento: 8,
    spessoreAnta: 60,
    sormontoCentrale: 60,
    minL1: 700,
    maxL1: 1350,
    minL2: 1200,
    maxL2: 2540,
    minH: 1900,
    maxH: 2670,
    consenteDueAnte: true,
    consenteOblo: true,
    consenteVetrina: false,
    maxL1ConOblo: 1167,
    tolleranzaPosa: 5,
  },
  "rei-120": {
    id: "rei-120",
    nome: "Tagliafuoco REI 120 (acciaio)",
    descrizione:
      "Porta metallica tagliafuoco EI2 120, doppia lamiera coibentata, autochiudente.",
    detrazioneTelaioL: 106,
    detrazioneTelaioH: 53,
    battutaLaterale: 15,
    battutaSuperiore: 15,
    giocoLaterale: 4,
    giocoPavimento: 8,
    spessoreAnta: 60,
    sormontoCentrale: 60,
    minL1: 700,
    maxL1: 1350,
    minL2: 1200,
    maxL2: 2540,
    minH: 1900,
    maxH: 2670,
    consenteDueAnte: true,
    consenteOblo: true,
    consenteVetrina: false,
    maxL1ConOblo: 1167,
    tolleranzaPosa: 5,
  },
};

export const LISTA_MODELLI: DefinizioneModello[] = Object.values(MODELLI);
