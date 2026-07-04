/**
 * Test smoke del motore di calcolo porta.
 * Eseguibile con: `node --experimental-strip-types --test src/lib/calcolo-porta.test.ts`
 */

import { strict as assert } from "node:assert";
import { test } from "node:test";
import { calcolaPorta } from "./calcolo-porta.ts";
import type { OpzioniPorta } from "./types.ts";

const OPZ_DEFAULT: OpzioniPorta = {
  bussola: false,
  fisso: false,
  sopraluce: false,
  vetro: "nessuno",
  maniglia: "destra",
  versoApertura: "spinta",
  coprifilo: "dritto",
};

test("battente standard 90x215 → anta 80x210", () => {
  const r = calcolaPorta("battente", {
    foroLarghezzaCm: 90,
    foroAltezzaCm: 215,
    spessoreMuroCm: 12.5,
  }, OPZ_DEFAULT);
  assert.equal(r.anta.larghezzaCm, 80);
  assert.equal(r.anta.altezzaCm, 210);
  assert.equal(r.telaio.battutaMm, 12);
  assert.ok(r.luceNettaCm >= 75, `luce netta ${r.luceNettaCm} < 75`);
});

test("battente 87x213 → anta 77x210 (larghezza puntuale, altezza allo standard)", () => {
  const r = calcolaPorta("battente", {
    foroLarghezzaCm: 87,
    foroAltezzaCm: 213,
    spessoreMuroCm: 10.8,
  }, OPZ_DEFAULT);
  // 87-10=77 (fuori tolleranza 1.5 dagli standard 75/80): rimane puntuale.
  assert.equal(r.anta.larghezzaCm, 77);
  // 213-5=208 (entro tolleranza 2.5 da 210): arrotondato a standard.
  assert.equal(r.anta.altezzaCm, 210);
});

test("battente 91x215 → anta 81x210 → arrotondato a 80x210 (entro tolleranza)", () => {
  const r = calcolaPorta("battente", {
    foroLarghezzaCm: 91,
    foroAltezzaCm: 215,
    spessoreMuroCm: 12.5,
  }, OPZ_DEFAULT);
  assert.equal(r.anta.larghezzaCm, 80);
  assert.equal(r.anta.altezzaCm, 210);
});

test("errore su foro troppo stretto (anta < 40)", () => {
  const r = calcolaPorta("battente", {
    foroLarghezzaCm: 45,
    foroAltezzaCm: 210,
    spessoreMuroCm: 12,
  }, OPZ_DEFAULT);
  assert.ok(
    r.avvertenze.some((a) => a.livello === "errore"),
    "atteso almeno un errore",
  );
});

test("errore su luce netta < 75 cm", () => {
  const r = calcolaPorta("battente", {
    foroLarghezzaCm: 75,
    foroAltezzaCm: 210,
    spessoreMuroCm: 12,
  }, OPZ_DEFAULT);
  assert.ok(
    r.avvertenze.some((a) => a.messaggio.includes("Luce netta")),
    "atteso warning luce netta",
  );
});

test("attenzione spessore muro fuori standard senza bussola/telescopico", () => {
  const r = calcolaPorta("battente", {
    foroLarghezzaCm: 90,
    foroAltezzaCm: 215,
    spessoreMuroCm: 25,
  }, OPZ_DEFAULT);
  assert.ok(
    r.avvertenze.some((a) => a.messaggio.includes("Spessore muro")),
    "atteso warning spessore muro",
  );
});

test("bussola + coprifilo telescopico → nessun warning spessore", () => {
  const r = calcolaPorta("battente", {
    foroLarghezzaCm: 90,
    foroAltezzaCm: 215,
    spessoreMuroCm: 25,
  }, { ...OPZ_DEFAULT, bussola: true, coprifilo: "telescopico" });
  assert.ok(
    !r.avvertenze.some((a) => a.messaggio.includes("Spessore muro")),
    "non atteso warning spessore quando ho bussola + telescopico",
  );
  assert.equal(r.coprifilo.tipo, "telescopico");
  assert.ok(r.coprifilo.telescopicoRangeMm, "range telescopico definito");
});

test("scorrevole scomparsa → ingombro totale ≈ 2× foro", () => {
  const r = calcolaPorta("scorrevole-interno-scomparsa", {
    foroLarghezzaCm: 80,
    foroAltezzaCm: 210,
    spessoreMuroCm: 12.5,
  }, OPZ_DEFAULT);
  assert.equal(r.ingombroTotaleLarghezzaCm, 160);
});

test("fisso su porta con maniglia DX → fisso posizionato a SX", () => {
  const r = calcolaPorta("battente", {
    foroLarghezzaCm: 90,
    foroAltezzaCm: 215,
    spessoreMuroCm: 12.5,
  }, { ...OPZ_DEFAULT, fisso: true, fissoLarghezzaCm: 40, maniglia: "destra" });
  assert.ok(r.fisso);
  assert.equal(r.fisso?.larghezzaCm, 40);
});

test("filo muro con coprifilo produce warning info", () => {
  const r = calcolaPorta("filo-muro", {
    foroLarghezzaCm: 87,
    foroAltezzaCm: 213,
    spessoreMuroCm: 12.5,
  }, { ...OPZ_DEFAULT, coprifilo: "dritto" });
  assert.ok(
    r.avvertenze.some((a) => a.livello === "info" && a.messaggio.includes("filo muro")),
    "atteso info su filo muro + coprifilo",
  );
});
