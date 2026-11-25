#!/usr/bin/env node
// Verificador de contraste WCAG 2.2 (US-WFR-10; ADR-014, regras 5 e 9).
// Le pares-contraste.csv (delimitador ;), calcula a razao de cada par pela
// formula de luminancia relativa do WCAG 2.2 e confere com o minimo e com o
// resultado esperado declarado na linha.
//
// Uso: node docs/design/f39-frames/contraste.mjs [arquivo.csv]
// Codigo de saida: 0 se todo par da o resultado esperado e nenhum par do
// conjunto v2 falha; 1 se algo diverge; 2 se o arquivo e invalido.
// Conjuntos: referencia (valor literal lido na referencia), v2 (par em uso na
// identidade v2; tem de passar) e proibido (par que falha e que a v2 veda; o
// ADR-014 registra a regra que impede o uso).
// Sem dependencia externa. So aceita cor opaca #RRGGBB: cor com transparencia
// entra no CSV ja composta sobre o fundo, com a composicao anotada na origem.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HEX_DIGITS = "0123456789abcdefABCDEF";
const CONJUNTOS = ["referencia", "v2", "proibido"];
const COLUMNS = ["id", "conjunto", "uso", "frente", "fundo", "minimo", "esperado", "origem"];

function isOpaqueHex(hex) {
  return typeof hex === "string" && hex.length === 7 && hex.startsWith("#") &&
    hex.slice(1).split("").every((ch) => HEX_DIGITS.includes(ch));
}

export function relativeLuminance(hex) {
  if (!isOpaqueHex(hex)) throw new Error("cor invalida: " + hex);
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground, background) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function fail(lineNumber, message) {
  throw new Error("linha " + lineNumber + ": " + message);
}

export function parsePairs(text) {
  const lines = text.split("\n").map((l) => l.replace("\r", "")).filter((l) => l.trim() !== "");
  if (lines.length < 2) throw new Error("CSV sem linhas de par");
  if (lines[0].trim() !== COLUMNS.join(";")) {
    throw new Error("cabecalho invalido; esperado: " + COLUMNS.join(";"));
  }
  return lines.slice(1).map((line, i) => {
    const n = i + 2;
    const cells = line.split(";");
    if (cells.length !== COLUMNS.length) fail(n, cells.length + " colunas, esperado " + COLUMNS.length);
    const row = Object.fromEntries(COLUMNS.map((c, j) => [c, cells[j].trim()]));
    row.minimo = Number(row.minimo);
    if (row.minimo !== 3 && row.minimo !== 4.5) fail(n, "minimo deve ser 3 ou 4.5");
    if (row.esperado !== "passa" && row.esperado !== "falha") fail(n, "esperado deve ser passa ou falha");
    if (!CONJUNTOS.includes(row.conjunto)) fail(n, "conjunto deve ser " + CONJUNTOS.join(", "));
    if (row.conjunto === "proibido" && row.esperado !== "falha") fail(n, "par proibido documenta uma falha: esperado deve ser falha");
    if (!isOpaqueHex(row.frente) || !isOpaqueHex(row.fundo)) fail(n, "cor deve ser #RRGGBB opaca");
    return row;
  });
}

export function evaluate(pairs) {
  return pairs.map((p) => {
    const ratio = contrastRatio(p.frente, p.fundo);
    const resultado = ratio >= p.minimo ? "passa" : "falha";
    const confere = resultado === p.esperado && !(p.conjunto === "v2" && resultado === "falha");
    return Object.assign({}, p, { ratio, resultado, confere });
  });
}

const fmt = (n) => n.toFixed(2).replace(".", ",");

function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const file = process.argv[2] ?? join(here, "pares-contraste.csv");
  let rows;
  try {
    rows = evaluate(parsePairs(readFileSync(file, "utf8")));
  } catch (err) {
    console.error("erro: " + err.message);
    process.exit(2);
  }
  for (const r of rows) {
    const flag = r.confere ? "ok     " : "DIVERGE";
    console.log(flag + " " + r.id + " (" + r.conjunto + ") " + r.uso + ": " + r.frente + " / " + r.fundo +
      " = " + fmt(r.ratio) + ":1 (min " + fmt(r.minimo) + ") " + r.resultado + ", esperado " + r.esperado);
  }
  const bad = rows.filter((r) => !r.confere);
  const v2 = rows.filter((r) => r.conjunto === "v2");
  const v2ok = v2.filter((r) => r.resultado === "passa").length;
  console.log("pares: " + rows.length + "; v2 que passam: " + v2ok + " de " + v2.length + "; divergentes: " + bad.length);
  console.log(bad.length === 0 ? "RESULTADO: confere" : "RESULTADO: diverge");
  process.exit(bad.length === 0 ? 0 : 1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
