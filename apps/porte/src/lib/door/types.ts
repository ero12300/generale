// Tipi di dominio per il configuratore porte.
// Tutte le misure lineari sono espresse in millimetri interi.

export type Tipologia = "battente" | "scorrevole_esterno" | "scorrevole_scomparsa";

export type Lato = "sinistra" | "destra";

// Verso di apertura rispetto all'osservatore posto sul lato maniglia:
// "tiro" = l'anta si apre verso di te; "spinta" = l'anta si apre lontano da te.
export type SensoApertura = "tiro" | "spinta";

export interface DeduzioniSistema {
  /** Gioco di posa per lato tra controtelaio e muratura (mm). */
  giocoPosaLato: number;
  /** Gioco di posa superiore tra controtelaio e architrave (mm). */
  giocoPosaSuperiore: number;
  /** Spessore montante del controtelaio per lato (mm). */
  spessoreControtelaio: number;
  /** Ingombro del telaio/battuta per lato che riduce la luce (mm). */
  ingombroTelaioLato: number;
  /** Ingombro del telaio/traverso superiore (mm). */
  ingombroTelaioSuperiore: number;
  /** Sormonto dell'anta sulla battuta per lato (mm). */
  sormontoAnta: number;
  /** Gioco funzionale dell'anta per lato (mm). */
  giocoAnta: number;
  /** Montante intermedio tra anta e fisso laterale (mm). */
  montanteIntermedio: number;
  /** Traverso intermedio sotto il sopraluce (mm). */
  traversoIntermedio: number;
  /** Gioco centrale tra le due ante (bussola / doppia anta) (mm). */
  giocoCentraleBussola: number;
  /** Ricopertura per lato dell'anta scorrevole esterno muro (mm). */
  ricoperturaScorrevole: number;
}

export interface SistemaPorta {
  id: string;
  nome: string;
  descrizione: string;
  tipologia: Tipologia;
  deduzioni: DeduzioniSistema;
  /** Spessore muro minimo richiesto (mm), es. porte a scomparsa. */
  spessoreMuroMin?: number;
}

export interface AccessoriPorta {
  /** Bussola / doppia anta a battente. */
  bussola: boolean;
  /** Fisso laterale a fianco dell'anta. */
  fissoLaterale: boolean;
  /** Luce del fisso laterale (mm). */
  larghezzaFisso: number;
  /** Sopraluce (imposta/lunetta) sopra la porta. */
  sopraluce: boolean;
  /** Luce del sopraluce in altezza (mm). */
  altezzaSopraluce: number;
  /** Anta vetrata (specchiatura in vetro). */
  vetro: boolean;
  /** Oblò/inserto ovale decorativo. */
  ovale: boolean;
}

export interface ForoMuro {
  /** Larghezza del foro muro / luce vano (mm). */
  larghezza: number;
  /** Altezza del foro muro dal pavimento finito (mm). */
  altezza: number;
  /** Spessore del muro comprensivo di rivestimenti (mm). */
  spessoreMuro: number;
}

export interface ConfigurazionePorta {
  sistemaId: string;
  foroMuro: ForoMuro;
  latoCerniere: Lato;
  sensoApertura: SensoApertura;
  accessori: AccessoriPorta;
  /** Override puntuale delle deduzioni del sistema. */
  deduzioniOverride?: Partial<DeduzioniSistema>;
}

export interface Dimensione {
  larghezza: number;
  altezza: number;
}

export interface ManoPorta {
  latoCerniere: Lato;
  latoManiglia: Lato;
  sensoApertura: SensoApertura;
  din: "DIN sinistra" | "DIN destra";
  verso: "destra" | "sinistra";
  descrizione: string;
}

export interface RisultatoCalcolo {
  tipologia: Tipologia;
  sistemaNome: string;
  foroMuro: ForoMuro;
  /** Controtelaio consigliato per l'ordine (misura esterna). */
  controtelaio: Dimensione;
  /** Luce interna del controtelaio. */
  luceControtelaio: Dimensione;
  /** Luce di passaggio netta a porta aperta. */
  lucePassaggio: Dimensione;
  /** Anta finita pronta per la produzione. */
  anta: Dimensione;
  numeroAnte: number;
  /** Seconda anta (bussola / doppia anta). */
  antaSecondaria?: Dimensione;
  /** Fisso laterale. */
  fisso?: Dimensione;
  /** Sopraluce. */
  sopraluce?: Dimensione;
  mano: ManoPorta;
  /** Spazio libero necessario sulla parete (scorrevole esterno muro). */
  ingombroParete?: number;
  /** Ingombro totale del controtelaio a scomparsa. */
  ingombroScomparsa?: Dimensione;
  avvisi: string[];
  deduzioni: DeduzioniSistema;
  accessori: AccessoriPorta;
}

export interface Progetto {
  id: string;
  nome: string;
  cliente: string;
  note: string;
  configurazione: ConfigurazionePorta;
  creatoIl: string;
}
