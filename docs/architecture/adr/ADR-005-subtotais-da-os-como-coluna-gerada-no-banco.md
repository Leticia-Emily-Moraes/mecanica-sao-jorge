---
status: aceito
date: 2026-11-07
decision-makers: [CARTOGRAFO (Arquiteto)]
consulted: [ESPRESSO (Dev Java), CORRENTE (BD)]
informed: [REGENTE, CRIVO]
---

# Subtotais das junções da OS como coluna gerada no banco

## Contexto e problema

Cada Ordem de Serviço tem itens de serviço (`ordens_servico_servicos`) e itens
de peça (`ordens_servico_pecas`), cada item com quantidade e valor congelado no
momento da OS. O subtotal de cada item é `valor * quantidade`. O briefing
determina: "os subtotais das junções da OS são colunas geradas no banco e não
podem ser gravados pela aplicação". Onde e como calcular esse subtotal?

## Fatores de decisão

* Restrição do briefing (subtotal das junções é coluna gerada, não gravável).
* Impossibilidade de a aplicação gravar valor divergente de `valor * quantidade`.
* Consistência: o subtotal nunca pode ficar fora de sincronia com seus fatores.
* Clareza da fronteira: totais de nível OS (recalculados no service) vs. subtotais de item (no banco).

## Opções consideradas

* **Opção A — Coluna `GENERATED ALWAYS AS (valor * quantidade) STORED` no banco**, mapeada como somente leitura na entidade.
* **Opção B — Calcular o subtotal no service e gravar numa coluna comum.**
* **Opção C — Não persistir o subtotal; calcular sempre em runtime/consulta.**

## Resultado da decisão

Opção escolhida: **"Opção A — coluna gerada STORED"**, porque é a restrição
direta do briefing e a única que garante, no nível do banco, que o subtotal
jamais diverge de `valor * quantidade`, independentemente de bug ou caminho de
escrita da aplicação.

* `ordens_servico_servicos.subtotal = GENERATED ALWAYS AS (valor_cobrado * quantidade) STORED`
* `ordens_servico_pecas.subtotal = GENERATED ALWAYS AS (valor_unitario_cobrado * quantidade) STORED`
* Na entidade JPA: `@Column(insertable = false, updatable = false)` (opcionalmente `@org.hibernate.annotations.Generated`), para o Hibernate ler mas nunca tentar gravar.

**Fronteira explícita**: os totais de nível OS — `subtotal_servicos`,
`subtotal_pecas`, `desconto`, `valor_total` em `ordens_servico` — **não** são
colunas geradas; são **recalculados no service** (briefing: "totais
recalculados no service") e gravados normalmente. A coluna gerada vale só para o
subtotal de cada item de junção.

### Consequências

* Bom, porque o subtotal de item é correto por construção, mesmo que a aplicação erre.
* Bom, porque a aplicação não precisa de código para manter o subtotal de item.
* Neutro, porque obriga a entidade a marcar o campo como não-inserível/não-atualizável, senão o Hibernate quebra ao tentar gravá-lo.
* Ruim, porque acopla a regra `valor * quantidade` ao DDL (MySQL); mudá-la exige migration. Aceitável: é uma regra estável e simples.

### Confirmação

* Migration (ADR-010 / Testcontainers): inspecionar `INFORMATION_SCHEMA.COLUMNS` e confirmar `EXTRA` contém `STORED GENERATED` nas duas colunas `subtotal`.
* Teste: tentar gravar `subtotal` pela aplicação não tem efeito (valor persistido é sempre `valor * quantidade`).
* Critério US-FUND-02 (cenário "colunas geradas das junções da OS ficam somente leitura").

## Prós e contras das opções

### Opção A — Coluna gerada STORED
* Bom, porque garante consistência no nível do banco.
* Bom, porque cumpre o briefing e tira código da aplicação.
* Ruim, porque a fórmula vive no DDL (migration para alterar).

### Opção B — Calcular no service e gravar
* Bom, porque mantém a lógica em Java.
* Ruim, porque **viola o briefing** e permite subtotal divergente por bug.

### Opção C — Só em runtime
* Bom, porque nada a persistir.
* Ruim, porque o briefing pede coluna gerada; e relatórios/consultas diretas ao banco não teriam o subtotal materializado.

## Mais informações

Aplicada pela migration de [[ADR-003-versionar-schema-com-flyway-migrations-aditivas]]
e mapeada pelas entidades de [[ADR-007-nao-expor-entidade-na-api-dto-e-convencao-de-nomes]].
Relevante às features F19 (OS detalhe com itens) e F06x da Sprint 04.
