// Testes de regressão do PRD da F28 e do recebido da F29.
// Só verificam o que está no repositório; não tocam o Figma.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const aqui = path.dirname(url.fileURLToPath(import.meta.url));
const ler = (relativo) => fs.readFileSync(path.join(aqui, relativo), 'utf8');

const prd = ler('F28-prototipo-os.md');
const recebido = ler('F29-recebido-da-F28-registro-pagamento.md');
const v2 = ler('../../apps/api/src/main/resources/db/migration/V2__criar_schema_oficina.sql');

const blocos = [...prd.matchAll(/```gherkin\n([\s\S]*?)```/g)].map((m) => m[1]).join('\n');
const cenarios = blocos
  .split(/\n(?=# US-PROTO-OS-)/)
  .filter((c) => c.trim().startsWith('# US-PROTO-OS-'));

test('should list 26 scenarios when counting 01 to 25 with 14a and 14b', () => {
  assert.equal(cenarios.length, 26);
});

test('should have unique ids when listing the scenarios', () => {
  const ids = cenarios.map((c) => c.match(/^# (US-PROTO-OS-\d+[ab]?)/)[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const n of ['01', '13', '14a', '14b', '15', '16', '24', '25']) {
    assert.ok(ids.includes('US-PROTO-OS-' + n), 'falta US-PROTO-OS-' + n);
  }
});

test('should have Dado, Quando and Então in every scenario', () => {
  for (const c of cenarios) {
    assert.match(c, /^\s*Dado /m, c.split('\n')[0]);
    assert.match(c, /^\s*Quando /m, c.split('\n')[0]);
    assert.match(c, /^\s*Então /m, c.split('\n')[0]);
  }
});

test('should name F29 owner of the master and F28 owner of the entry point', () => {
  assert.match(prd, /\*\*F29\*\* \| A tela é do domínio Financeiro/);
  assert.match(prd, /\*\*F28\*\* \| A seção de parcelas é do detalhe da OS/);
});

test('should keep the person confirmation pending when nobody confirmed it', () => {
  const secao = prd.slice(prd.indexOf('### 3.5'), prd.indexOf('## 4.'));
  assert.match(secao, /Pendente\. Nada foi confirmado/);
});

test('should not register an approval when the execution table is read', () => {
  assert.match(prd.slice(prd.indexOf('## 13.')), /Não aprovado/);
});

test('should forbid a detached copy of the form in the F28', () => {
  assert.match(prd, /não há "detach", cópia nem variante criada na F28/);
});

test('should list D1 to D11 once each when reading the doubts table', () => {
  const secao = prd.slice(prd.indexOf('## 6.'), prd.indexOf('## 7.'));
  const ids = [...secao.matchAll(/^\| (D\d+) \|/gm)].map((m) => m[1]);
  const esperado = [];
  for (let i = 1; i <= 11; i++) esperado.push('D' + i);
  assert.deepEqual(ids, esperado);
});

test('should match the V2 CHECK constraint when listing the payment methods', () => {
  const check = v2.match(/ck_pagamento_forma CHECK \(forma_pagamento IN \(([^)]*)\)\)/)[1];
  const valores = [...check.matchAll(/'([A-Z]+)'/g)].map((m) => m[1]);
  assert.deepEqual(valores, ['DINHEIRO', 'PIX', 'CARTAO', 'BOLETO']);
  for (const v of valores) {
    assert.ok(prd.includes(v), 'PRD não cita ' + v);
    assert.ok(recebido.includes(v), 'recebido não cita ' + v);
  }
});

test('should have no date column in pagamentos when D9 says so', () => {
  const tabela = v2.match(/CREATE TABLE pagamentos \(([\s\S]*?)\) ENGINE/)[1];
  assert.doesNotMatch(tabela, /data/i);
});

test('should not contain CPF, e-mail or phone when scanning the docs', () => {
  const texto = prd + '\n' + recebido;
  assert.doesNotMatch(texto, /\d\d\d\.\d\d\d\.\d\d\d-\d\d/);
  assert.doesNotMatch(texto, /[\w.+-]+@[\w-]+\.[\w.]+/);
  assert.doesNotMatch(texto, /\(\d\d\)\s?\d\d\d\d\d?-\d\d\d\d/);
});

test('should register base legal and keep retention without invented term', () => {
  assert.match(prd, /art\. 7º, V/);
  assert.match(prd, /D8, sem prazo/);
});

test('should hand the master, D5 and D9 to the F29 when reading the handoff', () => {
  assert.match(recebido, /dona do componente mestre/);
  assert.match(recebido, /D5/);
  assert.match(recebido, /D9/);
  assert.match(recebido, /aguardando confirmação/);
});
