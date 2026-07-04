/**
 * Costanti di produzione ricavate dagli standard del settore porte interne
 * italiane (schede rilievo misure di produttori: FIP, Micheloni, PorteShop,
 * Ermetika, ECLISSE). Tutte le misure sono in millimetri.
 */

/** Battente: ingombro telaio in larghezza (40 mm per lato). */
export const TELAIO_LARGHEZZA = 80;
/** Battente: ingombro telaio in altezza (solo traverso superiore). */
export const TELAIO_ALTEZZA = 40;
/** Aria di posa in opera in larghezza (10 mm per lato). */
export const POSA_LARGHEZZA = 20;
/** Aria di posa in opera in altezza. */
export const POSA_ALTEZZA = 10;

/** Detrazione totale dal foro muro alla luce/anta: larghezza. */
export const DETRAZIONE_LARGHEZZA = TELAIO_LARGHEZZA + POSA_LARGHEZZA; // 100
/** Detrazione totale dal foro muro alla luce/anta: altezza. */
export const DETRAZIONE_ALTEZZA = TELAIO_ALTEZZA + POSA_ALTEZZA; // 50

/** Scorrevole a scomparsa: detrazione dal controtelaio (50 mm L e H). */
export const DETRAZIONE_SCORREVOLE = 50;
/** Scorrevole a scomparsa: extra larghezza ingombro controtelaio (2L + 110). */
export const EXTRA_INGOMBRO_SCOMPARSA = 110;
/** Scorrevole a scomparsa: extra altezza ingombro controtelaio. */
export const EXTRA_ALTEZZA_SCOMPARSA = 90;
/** Scorrevole esterno muro: sormonto dell'anta sul vano, per lato. */
export const SORMONTO_ESTERNO_MURO = 50;

/** Battuta centrale tra le due ante della bussola. */
export const BATTUTA_CENTRALE_BUSSOLA = 0;

/** Misure standard anta (larghezze) prodotte a magazzino. */
export const LARGHEZZE_STANDARD_ANTA = [600, 650, 700, 750, 800, 850, 900];
/** Altezze standard anta. */
export const ALTEZZE_STANDARD_ANTA = [2000, 2100];

/** Limiti di fabbricazione anta. */
export const ANTA_MIN_LARGHEZZA = 400;
export const ANTA_MAX_LARGHEZZA = 1200;
export const ANTA_MIN_ALTEZZA = 1800;
export const ANTA_MAX_ALTEZZA = 2700;

/** Spessori muro gestibili con telaio standard. */
export const MURO_MIN = 60;
export const MURO_STANDARD_MIN = 85;
export const MURO_STANDARD_MAX = 110;
/** Oltre questo spessore servono allargamenti dedicati (fino a 500 mm). */
export const MURO_MAX_ALLARGAMENTI = 500;

/** Quota maniglia standard dal pavimento. */
export const ALTEZZA_MANIGLIA_STANDARD = 900;
export const ALTEZZA_MANIGLIA_MIN = 850;
export const ALTEZZA_MANIGLIA_MAX = 1050;

/** Oblò: vincoli dimensionali e distanza minima dai bordi anta. */
export const OBLO_MIN = 200;
export const OBLO_MAX = 500;
export const OBLO_MARGINE_BORDO = 100;
export const OBLO_CENTRO_STANDARD = 1550;

/** Display / sopraluce vetrato. */
export const DISPLAY_MIN_ALTEZZA = 150;
export const DISPLAY_MAX_ALTEZZA = 600;

/** Fisso laterale. */
export const FISSO_MIN_LARGHEZZA = 200;
export const FISSO_MAX_LARGHEZZA = 1000;

/** Cerniere: 3 fino a 2200 mm di anta, 4 oltre. */
export const SOGLIA_QUARTA_CERNIERA = 2200;
