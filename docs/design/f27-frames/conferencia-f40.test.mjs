// Testes de regressão do documento de conferência F27 x F40.
// Só verificam o repositório: caminhos citados existem e o documento mantém suas ressalvas.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const daRaiz = (relativo) => fileURLToPath(new URL(`../../../${relativo}`, import.meta.url));
const doc = readFileSync(daRaiz('docs/design/F27-conferencia-componentes-f40.md'), 'utf8');

describe('conferência F27 x F40: caminhos de código citados', () => {
  const lidos = doc.slice(doc.indexOf('Código lido por inteiro'), doc.indexOf('Protótipo:'));
  const caminhos = [...doc.matchAll(/`((?:ui|perfil|menu)\/[a-z-]+\.tsx)`/g)].map((m) => m[1]);

  it('should cite at least the components compared when scanning the tables', () => {
    for (const nome of ['button', 'text-field', 'state-view', 'confirm-dialog', 'tab-bar-item']) {
      assert.ok(caminhos.some((c) => c.endsWith(`${nome}.tsx`)), `falta citar ${nome}`);
    }
  });

  it('should point to files that exist in apps/mobile when they are existing components', () => {
    const existentes = new Set(
      [...lidos.matchAll(/`src\/components\/([^`]+)`/g)].flatMap((m) => {
        const bloco = m[1];
        const chaves = bloco.match(/^(\w+)\/\{(.+)\}\.tsx$/);
        return chaves
          ? chaves[2].split(',').map((n) => `${chaves[1]}/${n}.tsx`)
          : [bloco];
      }),
    );
    assert.ok(existentes.size >= 10);
    for (const rel of existentes) {
      assert.ok(
        existsSync(daRaiz(`apps/mobile/src/components/${rel}`)),
        `não existe: ${rel}`,
      );
    }
  });

  it('should list as nonexistent only the files marked as new when reading verdicts', () => {
    for (const novo of ['ui/badge.tsx', 'ui/list-card.tsx', 'ui/segmented-control.tsx']) {
      assert.ok(doc.includes(novo), `proposta ausente: ${novo}`);
      assert.equal(existsSync(daRaiz(`apps/mobile/src/components/${novo}`)), false);
    }
  });
});

describe('conferência F27 x F40: honestidade do documento', () => {
  it('should state that nothing was implemented when reading the header', () => {
    assert.match(doc, /Nada foi implementado/);
  });

  it('should state that Figma was not opened and nothing was run when reading section 1', () => {
    assert.match(doc, /Não abri o Figma/);
    assert.match(doc, /Não rodei o app nem teste de componente/);
  });

  it('should keep the prototype as not approved when reading the header', () => {
    assert.match(doc, /não aprovado/);
  });

  it('should not contain personal data when scanning the text', () => {
    assert.doesNotMatch(doc, /\d{3}\.\d{3}\.\d{3}-\d{2}/);
    assert.doesNotMatch(doc, /[\w.-]+@[\w.-]+\.[a-z]+/i);
  });
});
