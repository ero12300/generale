import type { ModelloPorta, TipoVetro } from "./types";

/**
 * Cataloghi statici usati dall'interfaccia.
 * Le regole di calcolo vivono in `calcolo-porta.ts`.
 */

export interface ModelloDescriptor {
  id: ModelloPorta;
  nome: string;
  descrizione: string;
  ambitiTipici: string[];
}

export const MODELLI: ModelloDescriptor[] = [
  {
    id: "battente",
    nome: "Battente",
    descrizione:
      "Porta classica con cerniere: telaio installato nel foro muro, coprifilo su entrambi i lati.",
    ambitiTipici: ["Camere", "Bagni", "Ambienti standard"],
  },
  {
    id: "filo-muro",
    nome: "Filo muro",
    descrizione:
      "Anta a filo con la parete, senza coprifilo visibile. Richiede controtelaio dedicato.",
    ambitiTipici: ["Ambienti design", "Ristrutturazioni premium"],
  },
  {
    id: "scorrevole-esterno",
    nome: "Scorrevole esterno muro",
    descrizione:
      "Anta che scorre lungo la parete con binario a vista. Non richiede opere murarie.",
    ambitiTipici: ["Cucine", "Ambienti piccoli", "Cabine armadio"],
  },
  {
    id: "scorrevole-interno-scomparsa",
    nome: "Scorrevole a scomparsa",
    descrizione:
      "Anta che scorre dentro un controtelaio murato: ingombro complessivo ≈ 2× luce di passaggio.",
    ambitiTipici: ["Ristrutturazioni", "Nuove costruzioni", "Bagni compatti"],
  },
];

export interface VetroDescriptor {
  id: TipoVetro;
  nome: string;
  descrizione: string;
}

export const VETRI: VetroDescriptor[] = [
  { id: "nessuno", nome: "Cieca", descrizione: "Anta piena senza inserti vetrati" },
  {
    id: "rettangolare",
    nome: "Vetro rettangolare",
    descrizione: "Inserto vetrato verticale al centro dell'anta",
  },
  {
    id: "ovale",
    nome: "Vetro ovale",
    descrizione: "Inserto ovale centrale, stile classico",
  },
  {
    id: "tondo",
    nome: "Oblò tondo",
    descrizione: "Inserto circolare, stile marina/moderno",
  },
];

/**
 * Spessori muro tipici in Italia (ECLISSE):
 * - Muri in intonaco: 108, 125, 150 mm
 * - Cartongesso: 100, 125, 150 mm
 * - Muri portanti: 250-300+ mm (richiedono bussola/imbotte)
 */
export const SPESSORI_MURO_TIPICI_CM = [10, 10.8, 12.5, 15, 20, 25, 30, 40];
