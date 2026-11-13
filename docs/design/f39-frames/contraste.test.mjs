// Teste do verificador de contraste. Rodar: node --test docs/design/f39-frames/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { contrastRatio, parsePairs, evaluate } from "./contraste.mjs";

const HEADER = "id;conjunto;uso;frente;fundo;minimo;esperado;origem";
const csv = (...rows) => [HEADER, ...rows].join("\n");

test("razao nos extremos da formula WCAG: preto/branco 21 e cor igual 1", () => {
  assert.equal(Number(contrastRatio("#000000", "#FFFFFF").toFixed(2)), 21);
  assert.equal(contrastRatio("#B5453D", "#B5453D"), 1);
});

test("razao e simetrica e bate com o valor publicado na spec (branco/Crail 5,41)", () => {
  assert.equal(contrastRatio("#FFFFFF", "#B5453D").toFixed(2), "5.41");
  assert.equal(contrastRatio("#B5453D", "#FFFFFF"), contrastRatio("#FFFFFF", "#B5453D"));
});

test("par v2 que falha nunca confere, mesmo declarado como falha", () => {
  const [row] = evaluate(parsePairs(csv("X1;v2;placeholder Dawn;#A8A39D;#FFFFFF;4.5;falha;teste")));
  assert.equal(row.resultado, "falha");
  assert.equal(row.confere, false);
});

test("resultado diferente do esperado nao confere", () => {
  const [row] = evaluate(parsePairs(csv("X2;referencia;petro/branco;#1E3A3F;#FFFFFF;4.5;falha;teste")));
  assert.equal(row.confere, false);
});

test("limite: 4,5 exato passa (Crail sobre Pot Pourri)", () => {
  const [row] = evaluate(parsePairs(csv("X3;referencia;limite;#B5453D;#F6E7E5;4.5;passa;teste")));
  assert.equal(row.resultado, "passa");
});

test("entrada invalida e recusada", () => {
  assert.throws(() => parsePairs("id;cor\nX;#FFFFFF"), /cabecalho invalido/);
  assert.throws(() => parsePairs(csv("X4;v2;cor curta;#FFF;#000000;4.5;passa;teste")), /RRGGBB/);
  assert.throws(() => parsePairs(csv("X5;v2;alfa;#FFFFFF80;#000000;4.5;passa;teste")), /RRGGBB/);
  assert.throws(() => parsePairs(csv("X6;v2;minimo;#FFFFFF;#000000;7;passa;teste")), /minimo/);
  assert.throws(() => parsePairs(csv("X7;outro;conjunto;#FFFFFF;#000000;3;passa;teste")), /conjunto/);
  assert.throws(() => parsePairs(csv("X8;proibido;nao falha;#FFFFFF;#000000;3;passa;teste")), /proibido/);
  assert.throws(() => parsePairs(csv("X9;v2;colunas;#FFFFFF;#000000;3;passa")), /colunas/);
  assert.throws(() => parsePairs(HEADER), /sem linhas/);
});

test("pares-contraste.csv versionado confere por inteiro", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const rows = evaluate(parsePairs(readFileSync(join(here, "pares-contraste.csv"), "utf8")));
  const divergentes = rows.filter((r) => !r.confere).map((r) => r.id);
  assert.deepEqual(divergentes, []);
  assert.ok(rows.filter((r) => r.conjunto === "v2").length >= 26);
});
