// Testes de regressão do documento da F26 (US-PROTO-CLV-08 e 14).
// Só verificam o que está no repositório; não tocam o Figma.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const lerDoc = (relativo) =>
  readFileSync(fileURLToPath(new URL(relativo, import.meta.url)), 'utf8');

const designDoc = lerDoc('../F26-prototipo-clientes-veiculos.md');
const figmaDoc = lerDoc('../figma.md');
const secaoFigma = figmaDoc.slice(figmaDoc.indexOf('### F26'));

function digitoVerificador(digitos, tamanho) {
  let soma = 0;
  for (let i = 0; i < tamanho; i++) soma += digitos[i] * (tamanho + 1 - i);
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

function cpfValido(texto) {
  const d = texto.replace(/\D/g, '').split('').map(Number);
  if (d.length !== 11 || d.every((x) => x === d[0])) return false;
  return digitoVerificador(d, 9) === d[9] && digitoVerificador(d, 10) === d[10];
}

describe('dados fictícios do doc da F26', () => {
  it('should reject every CPF written in the design doc when checking verifier digits', () => {
    const cpfs = designDoc.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/g) ?? [];
    assert.ok(cpfs.length >= 3, 'esperava ao menos 3 CPFs de exemplo no doc');
    const validos = cpfs.filter(cpfValido);
    assert.deepEqual(validos, []);
  });

  it('should flag the old valid CPF when the checker is wired correctly', () => {
    assert.equal(cpfValido('123.456.789-09'), true);
    assert.equal(cpfValido('123.456.789-00'), false);
  });

  it('should end every e-mail with @example.com when the doc lists e-mails', () => {
    const emails = designDoc.match(/[\w.-]+@[\w.-]+\.[a-z]+/gi) ?? [];
    assert.ok(emails.length > 0);
    const fora = emails.filter((e) => !e.endsWith('@example.com'));
    assert.deepEqual(fora, []);
  });

  it('should follow the (11) 90000-000N pattern when the doc lists phones', () => {
    const telefones = designDoc.match(/\(\d{2}\) \d{5}-\d{4}/g) ?? [];
    assert.ok(telefones.length > 0);
    const fora = telefones.filter((t) => !/^\(11\) 90000-000\d$/.test(t));
    assert.deepEqual(fora, []);
  });
});

describe('identificadores de conta nos docs da F26 (US-PROTO-CLV-14)', () => {
  it('should not contain Figma account identifiers when scanning the design doc and figma.md section', () => {
    const texto = `${designDoc}\n${secaoFigma}`;
    assert.doesNotMatch(texto, /user_id/i);
    assert.doesNotMatch(texto, /team::/);
    assert.doesNotMatch(texto, /\b\d{17,}\b/);
  });
});

describe('tabela de frames do doc da F26', () => {
  const secao5 = designDoc.slice(
    designDoc.indexOf('## 5. Os frames'),
    designDoc.indexOf('## 6.'),
  );
  const linhas = secao5.split('\n').filter((l) => /^\|/.test(l) && /`\d+:\d+`/.test(l));
  const telas = linhas.filter((l) => /\|\s*(L|D|V|C|E|N|M|X)\d\s*\|/.test(l));

  it('should list 39 screen frames when counting the table rows', () => {
    assert.equal(telas.length, 39);
  });

  it('should have unique node ids and unique codes when listing the frames', () => {
    const ids = linhas.map((l) => l.match(/`(\d+:\d+)`/)[1]);
    assert.equal(new Set(ids).size, ids.length);
    const codigos = telas.map((l) => l.match(/\|\s*([LDVCENMX]\d)\s*\|/)[1]);
    assert.equal(new Set(codigos).size, codigos.length);
  });
});
