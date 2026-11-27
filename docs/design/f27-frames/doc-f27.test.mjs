// Testes de regressão do documento da F27 (US-PROTO-CAT-04, 10 e 11).
// Só verificam o que está no repositório; não tocam o Figma.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const lerDoc = (relativo) =>
  readFileSync(fileURLToPath(new URL(relativo, import.meta.url)), 'utf8');

const designDoc = lerDoc('../F27-prototipo-catalogo-estoque.md');
const figmaDoc = lerDoc('../figma.md');
const secaoFigma = figmaDoc.slice(figmaDoc.indexOf('### F27'));

describe('tabela de frames do doc da F27', () => {
  const secao4 = designDoc.slice(
    designDoc.indexOf('## 4. Os frames'),
    designDoc.indexOf('## 5.'),
  );
  const linhas = secao4.split('\n').filter((l) => /^\|/.test(l) && /`\d+:\d+`/.test(l));
  const codigos = linhas.map((l) => l.match(/^\|\s*([SPM]\d+)\s*\|/)?.[1]);

  it('should list 36 screen frames when counting the table rows', () => {
    assert.equal(linhas.length, 36);
    assert.ok(codigos.every(Boolean), 'toda linha precisa de código S, P ou M');
  });

  it('should have unique node ids and unique codes when listing the frames', () => {
    const ids = linhas.map((l) => l.match(/`(\d+:\d+)`/)[1]);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal(new Set(codigos).size, codigos.length);
  });

  it('should split the frames into 13 services, 15 parts and 8 movements when grouping by code', () => {
    const conta = (p) => codigos.filter((c) => c.startsWith(p)).length;
    assert.equal(conta('S'), 13);
    assert.equal(conta('P'), 15);
    assert.equal(conta('M'), 8);
  });
});

describe('dados fictícios e privacidade no doc da F27', () => {
  const texto = `${designDoc}\n${secaoFigma}`;

  it('should not contain CPF, e-mail or phone when scanning the docs', () => {
    assert.doesNotMatch(texto, /\d{3}\.\d{3}\.\d{3}-\d{2}/);
    assert.doesNotMatch(texto, /[\w.-]+@[\w.-]+\.[a-z]+/i);
    assert.doesNotMatch(texto, /\(\d{2}\) \d{4,5}-\d{4}/);
  });

  it('should not contain Figma account identifiers when scanning the docs', () => {
    assert.doesNotMatch(texto, /user_id/i);
    assert.doesNotMatch(texto, /team::|organization::/);
    assert.doesNotMatch(texto, /\b\d{17,}\b/);
  });
});

describe('estado de aprovação no doc da F27', () => {
  it('should state that the prototype is not approved when reading the header', () => {
    assert.match(designDoc, /Não aprovado/);
    assert.match(designDoc, /a F36 \(front\) não deve começar/);
  });

  it('should link the figma.md section to the F27 doc and to the section node', () => {
    assert.match(secaoFigma, /191:4113/);
    assert.match(secaoFigma, /F27-prototipo-catalogo-estoque\.md/);
  });
});
