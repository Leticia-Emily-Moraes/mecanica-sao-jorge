// Testes de regressão do documento de design da F28.
// Só verificam o que está no repositório; não tocam o Figma.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const aqui = path.dirname(url.fileURLToPath(import.meta.url));
const ler = (relativo) => fs.readFileSync(path.join(aqui, relativo), 'utf8');

const doc = ler('F28-prototipo-os.md');
const figma = ler('figma.md');

const secao = (de, ate) => {
  const i = doc.indexOf(de);
  const f = ate ? doc.indexOf(ate) : doc.length;
  assert.ok(i >= 0, 'falta a seção ' + de);
  return doc.slice(i, f);
};

const linhasFrames = [...secao('## 5. Os frames', '## 6.').matchAll(/\| ([ODNTP]\d+) \| [^|]+\| `(\d+:\d+)`/g)]
  .map((m) => ({ codigo: m[1], id: m[2] }))
  .concat([...secao('## 5. Os frames', '## 6.').matchAll(/^\| \| ([ODNTP]\d+) \| [^|]+\| `(\d+:\d+)`/gm)].map((m) => ({ codigo: m[1], id: m[2] })));

const unicos = new Map(linhasFrames.map((l) => [l.codigo, l.id]));

test('should list the 44 frames with a node id each when reading section 5', () => {
  assert.equal(unicos.size, 44);
  for (const id of unicos.values()) assert.match(id, /^\d+:\d+$/);
});

test('should not repeat a node id when listing the frames', () => {
  const ids = [...unicos.values()];
  assert.equal(new Set(ids).size, ids.length);
});

test('should cover the five groups of screens when listing the codes', () => {
  const prefixos = new Set([...unicos.keys()].map((c) => c[0]));
  assert.deepEqual([...prefixos].sort(), ['D', 'N', 'O', 'P', 'T']);
  for (const c of ['O1', 'O5', 'N6', 'D13', 'T7', 'P13']) assert.ok(unicos.has(c), 'falta ' + c);
});

test('should cover the four states in the list screens when reading section 5', () => {
  const s = secao('## 5. Os frames', '## 6.');
  for (const estado of ['preenchida', 'vazio', 'carregando', 'erro ao carregar']) {
    assert.ok(s.includes(estado), 'falta o estado ' + estado);
  }
});

test('should keep the approval pending when the person has not approved', () => {
  assert.match(doc, /AGUARDANDO APROVAÇÃO\. Não aprovado\./);
  assert.match(secao('## 11.', '## 12.'), /Não aprovado\./);
  assert.doesNotMatch(doc, /\bAprovado em\b/);
});

test('should record that the F39 base is not approved when reading section 1', () => {
  const s = secao('## 1.', '## 2.');
  assert.match(s, /não tem registro "Aprovado"/);
  assert.match(s, /escolha minha, não decisão da pessoa/);
});

test('should forbid a detached copy of the payment form when reading the decisions', () => {
  assert.match(secao('## 6.', '## 7.'), /Sem detach, cópia nem variante criada na F28/);
  assert.match(secao('## 4.', '## 5.'), /não fazer detach/);
});

test('should register the T3 button labels from criterion 6 when reading the decisions', () => {
  const s = secao('## 6.', '## 7.');
  assert.match(s, /"Confirmar" e "Voltar"/);
});

test('should not keep a contrast failure unregistered when reading section 8', () => {
  const s = secao('## 8.', '## 9.');
  assert.match(s, /1,68:1/);
  assert.match(s, /4,97:1/);
  assert.match(s, /Leitor de tela real \(VoiceOver, TalkBack\): não testado/);
});

test('should declare the touch targets below 44 when reading section 8', () => {
  const s = secao('## 8.', '## 9.');
  assert.match(s, /3 abaixo de 44 × 44/);
  assert.match(s, /não a regra de 44 × 44 da casa/);
});

test('should state that the prototype was read from reactions and not run when reading section 7', () => {
  assert.match(secao('## 7.', '## 8.'), /não em modo Present/);
});

test('should not leak an email or an account id when scanning the document', () => {
  assert.doesNotMatch(doc, /[\w.+-]+@[\w-]+\.[\w.]+/);
  assert.doesNotMatch(doc, /team::\d+/);
  assert.doesNotMatch(doc, /\b681115069\b/);
});

test('should use only fictional data when scanning the document', () => {
  assert.doesNotMatch(doc, /\d{3}\.\d{3}\.\d{3}-\d{2}/);
  assert.doesNotMatch(doc, /\(\d{2}\) ?9\d{4}-\d{4}/);
});

test('should register the F28 section in figma.md when the document is linked', () => {
  assert.match(figma, /F28 · Protótipo de alta fidelidade das Ordens de Serviço/);
  assert.match(figma, /170:2912/);
  assert.match(figma, /docs\/design\/F28-prototipo-os\.md/);
});
