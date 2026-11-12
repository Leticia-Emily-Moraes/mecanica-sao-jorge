---
status: aceito
date: 2026-11-12
decision-makers: [CARTOGRAFO (Arquiteto)]
consulted: [CRIVO (QA, evidência da F02)]
informed: [REGENTE, BUSSOLA, ESPRESSO, VIGIA, PERGAMINHO]
---

# Remover o template genérico do backend em vez de adaptá-lo

Histórico de status: o rascunho de 2026-11-11 (nunca commitado, arquivo
`ADR-012-remover-template-generico-e-adotar-script-sql-como-fonte-de-estrutura.md`)
juntava duas decisões e declarava `docs/script.sql` como "única fonte de
estrutura", em contradição com o commit `a1d2ddb`. Em 2026-11-12, antes do
primeiro commit, o rascunho foi dividido. Este ADR fica só com a remoção do
template. A fonte de verdade do schema passou para
[[ADR-013-adotar-migrations-flyway-como-fonte-unica-de-verdade-do-schema]].

## Contexto e problema

O repositório nasceu de um template genérico: entidades `Category`, `User`,
`Product` e **duas** classes `Itens` no mesmo pacote, com controllers,
services e repositories equivalentes e tabelas `Categories`, `users` e
`products` que não existem no domínio da oficina. A auditoria da F37
(`docs/product/F37-auditoria-sprint-01.md`) registrou que a `main` não
compilava e que o template vazava sob nomes de domínio. A F02 executou a
limpeza e a F38 revalida a Definição de Pronto. A pergunta é o que fazer com o
template: manter, adaptar ou remover?

## Fatores de decisão

* **Zero template remanescente** em `entity`, `controller`, `service`,
  `repository`, `mapper` e `dto`, verificável por grep (US-FUND-02-01).
* **Build limpa**: `mvn clean install` conclui sem erro (US-FUND-02-01).
* **`ddl-auto: validate` passa**: toda entidade mapeia uma tabela criada por
  migration e não existe tabela de template (US-FUND-02-02).
* **Custo de manutenção** proporcional a uma oficina de pequeno porte.

## Opções consideradas

* **Opção A**: remover o template por completo e escrever o domínio do zero,
  uma entidade por tabela das migrations.
* **Opção B**: manter como está (`Category`/`User`/`Product`/`Itens`) e
  construir as features por cima.
* **Opção C**: renomear e adaptar as classes de template (por exemplo
  `Category` para `Servico` e `Product` para `Peca`).

## Resultado da decisão

Opção escolhida: **"Opção A"**. É a única que zera o template, destrava a
build e faz `ddl-auto: validate` passar contra tabelas reais. As opções B e C
levariam conceitos genéricos (`Itens` duplicado, tabelas inexistentes) para
dentro do domínio, o que o briefing proíbe ("não escrever feature nova sobre o
que está lá").

O que fica em cada camada, conferido em 2026-11-12 com
`git ls-files apps/api/src/main/java`:

| Camada | Classes (todas de domínio) |
|---|---|
| `entity` | 12 entidades (`Usuario`, `Cliente`, `Veiculo`, `Servico`, `Peca`, `OrdemServico`, `OrdemServicoServico`, `OrdemServicoPeca`, `MovimentacaoEstoque`, `Parcela`, `Pagamento`, `Financeiro`) e 5 enums (`Perfil`, `StatusOS`, `FormaPagamento`, `TipoMovimentacao`, `TipoLancamento`) |
| `controller` | `AuthController` |
| `service` | `AuthService` |
| `repository` | `UsuarioRepository` |
| `mapper` | `UsuarioMapper` |
| `dto` | `LoginRequest`, `LoginResponse`, `UsuarioResumo` |

As 12 entidades existem porque `validate` exige uma entidade para cada tabela
que a aplicação usa. A lista das tabelas e a regra de qual artefato as define
estão no ADR-013. As demais camadas só têm o que o login (F02) precisa:
Clientes, Catálogo, OS e Financeiro são escopo das Sprints 02 a 05. As
fronteiras entre camadas não mudam
([[ADR-001-organizar-pacotes-por-camada]], [[ADR-007-nao-expor-entidade-na-api-dto-e-convencao-de-nomes]]).

### Consequências

* Bom, porque a build compila e `validate` sobe contra tabelas reais.
* Bom, porque nenhum conceito genérico contamina o domínio, e cada feature
  futura parte de um backend limpo.
* Neutro, porque escrever do zero custou mais que renomear, mas esse custo já
  foi pago na F02.
* Ruim, porque nada impede automaticamente alguém de reintroduzir uma classe de
  template. Só o grep na revisão pega (ver Confirmação).

### Confirmação

* **Verificado por CARTOGRAFO em 2026-11-12, por inspeção, sem build**: busca
  (sem diferenciar maiúsculas) por
  `class (Category|Product|User|Itens)\b|Categories|\busers\b|\bproducts\b|\bItens\b`
  em `apps/api/src` não achou nada. O inventário por camada bate com a tabela
  acima.
* **Evidência herdada da F02 (QA do CRIVO, mesmo código)**: `mvn clean install`
  deu `BUILD SUCCESS`, com 16 testes unitários e `FlywayMigrationIT` 3/3.
  **Não foi re-executado nesta branch**: isso fica com o ESPRESSO (etapa 3) e o
  CRIVO (etapa 7).
* **Daqui em diante**: todo PR passa pelo grep acima na revisão
  (CARTOGRAFO/CRIVO). Entidade sem tabela quebra `validate` no
  `FlywayMigrationIT` do CI ([[ADR-010-testes-de-integracao-com-testcontainers]]).

## Prós e contras das opções

### Opção A: remover e reescrever

* Bom, porque zera o template e destrava a build.
* Bom, porque o domínio reflete as tabelas reais das migrations.
* Neutro, porque exige escrever cada entidade do zero (custo já pago na F02).
* Ruim, porque descarta o esqueleto do template, que não tinha valor real a
  preservar.

### Opção B: manter como está

* Bom, porque não exige trabalho imediato.
* Ruim, porque a `main` continua sem compilar e com `Itens` duplicado.
* Ruim, porque viola o briefing ("não escrever feature nova sobre o que está
  lá").
* Ruim, porque `validate` quebra, já que as entidades apontam para tabelas que
  não existem.

### Opção C: renomear e adaptar

* Bom, porque reaproveitaria classes já escritas.
* Neutro, porque reduziria o esforço de digitação inicial.
* Ruim, porque traz para o domínio a semântica genérica (relacionamentos e
  nomes de campo do template), uma dívida difícil de rastrear.
* Ruim, porque a duplicata `Itens` não tem para onde ser renomeada sem
  ambiguidade.

## Mais informações

Complementa [[ADR-001-organizar-pacotes-por-camada]] e
[[ADR-007-nao-expor-entidade-na-api-dto-e-convencao-de-nomes]]. É complementado
por [[ADR-013-adotar-migrations-flyway-como-fonte-unica-de-verdade-do-schema]],
que define a fonte de verdade das tabelas. Origem:
`docs/product/F37-auditoria-sprint-01.md` e
`docs/product/F38-correcao-template-build-ui-popups-senha.md`
(US-FUND-02-01 e US-FUND-02-02).
