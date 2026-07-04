import type { ModelloPorta } from "./types";

/**
 * Catalogo modelli porte per interni.
 *
 * I parametri di deduzione traducono il foro muro (misura al morto) nella
 * luce di passaggio e nell'anta finita. I valori di default derivano dalle
 * regole di posa piu' diffuse in Italia (telaio + controtelaio a battente,
 * ingombro doppio per gli scorrevoli a scomparsa) e sono modificabili
 * dall'utente esperto tramite l'override avanzato nell'interfaccia.
 *
 * Riferimenti tecnici (schede produttori Eclisse / Ermetika / Garofoli):
 * - battente filo muro: foro = luce + ~120 mm larghezza, + ~60 mm altezza
 * - telaio tradizionale con coprifilo: deduzioni leggermente maggiori
 * - scorrevole a scomparsa: ingombro larghezza ~= 2 x luce di passaggio
 */
export const CATALOGO: ModelloPorta[] = [
  {
    id: "battente-classica",
    nome: "Battente classica (telaio + coprifilo)",
    tipologia: "battente",
    descrizione:
      "Porta a battente ad una anta con telaio tradizionale e coprifilo. La soluzione piu' comune per gli ambienti interni.",
    deduzioni: {
      telaioLarghezza: 150,
      telaioAltezza: 75,
      giocoAntaLarghezza: 8,
      giocoAntaAltezza: 8,
    },
    opzioni: { sopraluce: true, antaFissa: true, bussola: true, oblo: true },
  },
  {
    id: "battente-filomuro",
    nome: "Battente filo muro (telaio a scomparsa)",
    tipologia: "battente",
    descrizione:
      "Anta a battente a raso parete con telaio a scomparsa, senza coprifilo. Estetica minimale, deduzioni ridotte.",
    deduzioni: {
      telaioLarghezza: 120,
      telaioAltezza: 60,
      giocoAntaLarghezza: 6,
      giocoAntaAltezza: 6,
    },
    opzioni: { sopraluce: true, antaFissa: true, bussola: false, oblo: true },
  },
  {
    id: "bussola-vetrata",
    nome: "Bussola vetrata con sopraluce",
    tipologia: "battente",
    descrizione:
      "Struttura a bussola con fianchi/sopraluce fissi vetrati e anta a battente centrale. Tipica di ingressi e disimpegni.",
    deduzioni: {
      telaioLarghezza: 140,
      telaioAltezza: 70,
      giocoAntaLarghezza: 8,
      giocoAntaAltezza: 8,
    },
    opzioni: { sopraluce: true, antaFissa: true, bussola: true, oblo: true },
  },
  {
    id: "scorrevole-esterno",
    nome: "Scorrevole esterno muro",
    tipologia: "scorrevole_esterno",
    descrizione:
      "Anta scorrevole su binario esterno alla parete. L'anta copre la luce e richiede spazio laterale libero pari alla sua larghezza.",
    deduzioni: {
      telaioLarghezza: 100,
      telaioAltezza: 55,
      giocoAntaLarghezza: -60,
      giocoAntaAltezza: -20,
    },
    opzioni: { sopraluce: false, antaFissa: false, bussola: false, oblo: true },
  },
  {
    id: "scorrevole-scomparsa",
    nome: "Scorrevole a scomparsa (controtelaio)",
    tipologia: "scorrevole_scomparsa",
    descrizione:
      "Anta che scompare dentro la parete in un controtelaio. Ingombro complessivo in larghezza circa doppio della luce di passaggio.",
    deduzioni: {
      telaioLarghezza: 110,
      telaioAltezza: 90,
      giocoAntaLarghezza: -50,
      giocoAntaAltezza: -20,
      ingombroFattore: 2,
      ingombroExtra: 110,
    },
    opzioni: { sopraluce: false, antaFissa: false, bussola: false, oblo: true },
  },
];

export function getModello(id: string): ModelloPorta | undefined {
  return CATALOGO.find((m) => m.id === id);
}
