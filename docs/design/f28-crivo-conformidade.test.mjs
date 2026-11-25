// Testes de conformidade da F28 escritos pelo CRIVO (QA).
// Só verificam o repositório (documentos e V2). Não tocam o Figma:
// o conteúdo dos 44 frames NÃO é verificado por este arquivo.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const aqui = path.dirname(url.fileURLToPath(import.meta.url));
const raiz = path.join(aqui, '..', '..');
const ler = (...partes) => fs.readFileSync(path.join(raiz, ...partes), 'utf8');

const design = ler('docs', 'design', 'F28-prototipo-os.md');
const prd = ler('docs', 'product', 'F28-prototipo-os.md');
const f39 = ler('docs', 'product', 'F39-redesenho-wireframes-navegacao-figma.md');
const v2 = ler('apps', 'api', 'src', 'main', 'resources', 'db', 'migration', 'V2__criar_schema_oficina.sql');

// Razão de contraste WCAG 2.2 (luminância relativa).
const canal = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luz = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * canal((n >> 16) & 255) + 0.7152 * canal((n >> 8) & 255) + 0.0722 * canal(n & 255);
};
const razao = (a, b) => {
  const [x, y] = [luz(a), luz(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const arredonda = (n) => Math.round(n * 100) / 100;

test('should reproduce the documented 4,97:1 when measuring primary on the screen background', () => {
  assert.equal(arredonda(razao('#B5453D', '#F7F5F2')), 4.97);
});

test('should reproduce the documented 1,68:1 when measuring the old error border', () => {
  assert.equal(arredonda(razao('#E2B5B0', '#F7F5F2')), 1.68);
});

test('should keep the normal field border above 3:1 when measuring it on the screen background', () => {
  assert.ok(razao('#8C8780', '#F7F5F2') >= 3);
  assert.equal(arredonda(razao('#8C8780', '#F7F5F2')), 3.28);
});

test('should reproduce the documented lowest text ratios when measuring the two tightest pairs', () => {
  assert.equal(arredonda(razao('#EE8279', '#1E3A3F')), 4.68);
  assert.equal(arredonda(razao('#6E6A66', '#F7F5F2')), 4.93);
});

test('should reproduce the documented focus ring ratios when measuring petro', () => {
  assert.equal(arredonda(razao('#1E3A3F', '#F7F5F2')), 11.14);
  assert.equal(arredonda(razao('#1E3A3F', '#FFFFFF')), 12.12);
});

test('should keep the documented ratios in the design doc when reading section 8', () => {
  for (const r of ['4,97:1', '1,68:1', '3,28:1', '4,68:1', '4,93:1', '11,14:1', '12,12:1']) {
    assert.ok(design.includes(r), 'falta a razão ' + r);
  }
});

test('should list the same payment methods as the V2 CHECK when reading the design doc', () => {
  const m = v2.match(/ck_pagamento_forma CHECK \(forma_pagamento IN \(([^)]*)\)\)/);
  assert.ok(m, 'CHECK da V2 não encontrado');
  const formas = [...m[1].matchAll(/'([A-Z]+)'/g)].map((x) => x[1]);
  assert.deepEqual(formas, ['DINHEIRO', 'PIX', 'CARTAO', 'BOLETO']);
  assert.ok(design.includes(formas.join(', ')), 'o documento de design não lista as formas da V2');
});

test('should not offer a payment date field when pagamentos has no date column', () => {
  const tabela = v2.slice(v2.indexOf('CREATE TABLE pagamentos'), v2.indexOf('CREATE TABLE financeiro'));
  assert.doesNotMatch(tabela, /\bdata\w*\s+(DATE|DATETIME|TIMESTAMP)/i);
  assert.match(design, /Sem campo de data no pagamento/);
});

test('should not store the installment status when reading the V2 parcelas table', () => {
  const tabela = v2.slice(v2.indexOf('CREATE TABLE parcelas'), v2.indexOf('CREATE TABLE pagamentos'));
  assert.doesNotMatch(tabela, /\bstatus\b/i);
  assert.match(design, /Status da parcela é calculado/);
});

test('should agree with the F39 PRD about the missing approval when comparing both documents', () => {
  const secao11 = f39.slice(f39.indexOf('## 11.'), f39.indexOf('## 12.'));
  const f39Aprovada = /\|\s*Aprovad[oa]\s*\|/i.test(secao11);
  const designDizNaoAprovada = /não tem registro "Aprovado"/.test(design);
  assert.equal(designDizNaoAprovada, !f39Aprovada, 'documento de design e PRD da F39 divergem sobre a aprovação');
});

test('should state the F39 gate in the PRD and the design doc when criterion 23 applies', () => {
  assert.match(prd, /US-PROTO-OS-23/);
  assert.match(design, /A tarefa 1 está reaberta/);
});

test('should keep the master outside the F28 ownership when criterion 16 and 25 apply', () => {
  assert.match(design, /mestre provisório/);
  assert.match(design, /Sem detach, cópia nem variante criada na F28/);
  assert.match(prd, /US-PROTO-OS-25/);
});

test('should register the deviation from premise 1 when the detail opens a separate parcel list', () => {
  assert.match(design, /desvio da premissa 1/);
});

test('should keep the figma.md frame count equal to the design doc when comparing both', () => {
  const figma = ler('docs', 'design', 'figma.md');
  assert.match(figma, /44 frames/);
  assert.match(design, /44 frames de tela/);
  assert.match(figma, /118 reações/);
  assert.match(design, /118 reações em 44 frames/);
});

test('should keep the terminal statuses without options when reading the PRD transition table', () => {
  const linha = prd.split('\n').find((l) => l.startsWith('| ENTREGUE, CANCELADA'));
  assert.ok(linha, 'linha de terminais não encontrada');
  assert.match(linha, /nenhuma \(terminais\)/);
  const aberta = prd.split('\n').find((l) => l.startsWith('| ABERTA |'));
  assert.match(aberta, /EM_ANALISE, CANCELADA/);
  assert.doesNotMatch(aberta, /FINALIZADA|ENTREGUE|EM_ANDAMENTO|AGUARDANDO_PECA/);
});

test('should never offer ENTREGUE or CANCELADA as a source of cancellation when reading the PRD table', () => {
  const linhas = prd.split('\n').filter((l) => /^\| (ABERTA|EM_ANALISE|AGUARDANDO_PECA|EM_ANDAMENTO|FINALIZADA) \|/.test(l));
  assert.equal(linhas.length, 5);
  for (const l of linhas) assert.match(l, /CANCELADA/);
});

test('should keep the design doc free of e-mail, CPF and phone when scanning', () => {
  assert.doesNotMatch(design, /[\w.+-]+@[\w-]+\.[\w.]+/);
  assert.doesNotMatch(design, /\d{3}\.\d{3}\.\d{3}-\d{2}/);
  assert.doesNotMatch(design, /\(?\d{2}\)? ?9?\d{4}-\d{4}/);
});
