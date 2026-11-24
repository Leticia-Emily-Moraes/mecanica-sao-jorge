---
status: proposto
date: 2026-11-24
decision-makers: [CARTOGRAFO (Arquiteto), pessoa dona do produto (aceite)]
consulted: [BUSSOLA (PRD F06a, decisão D6)]
informed: [REGENTE, PRUMO, ESPRESSO, VIGIA, CRIVO, ANCORA]
---

# Criar `data_abertura` e `data_previsao_entrega` da OS pela migration aditiva V11 da F06a, tirando as duas da F18

Histórico de status:

* 2026-11-24: proposto (F06a, etapa do CARTOGRAFO), ramo `docs/f06a-cartografo-adrs`.

Vínculos: F06a ([PRD](../../product/F06a-os-listar.md), decisão D6), F18 (criar OS), F20 (fechar OS), política de dados do cliente (regra R1, achado A6). Aplica o ADR-003 e o ADR-013 (migration aditiva, fonte única do schema). Usado pelo [ADR-037](ADR-037-listar-ordens-de-servico-com-filtro-de-status-e-busca-por-nome-do-cliente-ou-placa-com-join-fetch.md) (ordenação e campos da lista); o tipo Java e o fuso seguem o [ADR-039](ADR-039-representar-data-e-hora-na-api-como-instant-utc-com-fuso-da-conexao-fixado.md).

## Contexto e problema

A F06a ordena por data de abertura e devolve `dataAbertura` e `previsaoEntrega`, mas a tabela `ordens_servico` da V2 não tem coluna de data (conferido no arquivo V2 e em `entity/OrdemServico.java` em 2026-11-24). A matriz de reconciliação do `overview.md` (linha das colunas ausentes de `ordens_servico`) dá `data_abertura` e `data_previsao_entrega` para a F18, e a F18 depende da F06: do jeito que está, nenhuma das duas fecha. Quem cria as colunas, com que tipo e default?

## Fatores de decisão

* F1: a F06a entrega os critérios de ordenação e de campos (US-OS-LST-01, 01b e 13 do PRD) sem esperar outra feature.
* F2: migration aditiva, sem reescrever nem apagar coluna (ADR-003, ADR-013), com `ddl-auto: validate` passando.
* F3: `data_abertura` sustenta o prazo de retenção R1 (achado A6): nunca nula.
* F4: escopo mínimo: a F06a não cria coluna que não lê.

## Opções consideradas

* A: a F06a cria as duas colunas na V11; a F18 fica com `descricao_problema`, `diagnostico` e `data_fechamento` (a F20 usa esta).
* B: manter como está: a F18 cria as colunas e a F06a ordena só por `id` até lá.
* C: a F06a cria todas as colunas de `ordens_servico` que o script de referência prevê e a V2 não tem.

## Resultado da decisão

Opção escolhida: **A**, porque é a única que atende F1 sem trazer para a F06a colunas que ela não lê (F4).

Migration `apps/api/src/main/resources/db/migration/V11__adicionar_datas_em_ordens_servico.sql` (próximo número livre: as V5 a V8 da F04 e as V9 e V10 da F05a e da F17 já existem em outros ramos; conferido com `git log --all` em 2026-11-24):

```sql
ALTER TABLE ordens_servico
  ADD COLUMN data_abertura TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN data_previsao_entrega DATE NULL;
```

* `TIMESTAMP` e não `DATETIME`: é o tipo do script de referência e da linha da matriz que define o default; o MySQL guarda em UTC e converte pelo fuso da sessão, que o ADR-039 fixa em UTC.
* `NOT NULL DEFAULT CURRENT_TIMESTAMP`: como a matriz já define para a coluna (F3). Linhas que existirem na hora da migration recebem a data da migration, não a real. Não há endpoint de criação de OS na `main` hoje (a F18 não foi feita), então só existiriam linhas inseridas à mão; isso é suposição, não conferi o banco de nenhum ambiente.
* `data_previsao_entrega DATE NULL`: é só dia, informado pela pessoa ao abrir a OS (F18); nula até lá.
* Sem índice (ver ADR-037, Mais informações).

Entidade `OrdemServico`:

* `OffsetDateTime dataAbertura` com `@Column(name = data_abertura, nullable = false, insertable = false, updatable = false)`: na F06a a coluna é só lida e o banco preenche. O mesmo par de tipos (`OffsetDateTime` e `TIMESTAMP`) já passa no `validate` em `Cliente.createdAt`.
* `LocalDate dataPrevisaoEntrega` com `@Column(name = data_previsao_entrega)`.
* A F18 decide como gravar na criação (manter o default do banco e reler com `@Generated`, ou gravar o instante do relógio da aplicação); se mudar o mapeamento acima, registra no próprio ADR.

Testes da F06a inserem OS por SQL (`JdbcTemplate` ou script de teste) com `data_abertura` explícita, porque ainda não há endpoint de criação.

### Consequências

* Bom, porque a F06a fica independente da F18 e a dependência circular F06 e F18 some.
* Bom, porque R1 ganha a coluna de que precisa (achado A6) antes de existir OS real.
* Ruim, porque o dono das colunas muda na matriz e o PRUMO precisa ajustar o escopo da F18 (menos duas colunas).
* Ruim, porque `TIMESTAMP` do MySQL vai só até 2038-01-19 03:14:07 UTC. Para data de abertura é longe, mas a migração para `DATETIME` um dia é uma migration de reconstrução da tabela.
* Ruim, porque a V11 entra num histórico em que V5 a V8 ainda não estão na `main`; se a V9 a V11 chegarem antes, um banco já migrado recusa a V5 a V8 depois (Flyway sem `outOfOrder`). Risco de ordem de merge, com o ANCORA e o PRUMO.

### Confirmação

* Teste de integração com Testcontainers (ADR-010) rodando todas as migrations do zero e o contexto com `ddl-auto: validate`.
* Teste que insere uma OS sem `data_abertura` e lê a coluna não nula.
* Revisão de PR: a V11 só tem `ADD COLUMN`; a matriz do `overview.md` mostra as duas colunas como da F06a.

## Prós e contras das opções

### A: F06a cria as duas (escolhida)

* Bom, porque fecha F1 e F3 com duas colunas e nenhuma regra nova.
* Neutro, porque a F18 continua dona do resto de `ordens_servico`.
* Ruim, porque mexe no plano de outra feature (aviso ao PRUMO) e cria colunas que só a F18 vai gravar de fato.

### B: manter como está (F18 cria)

* Bom, porque não muda dono nem escopo de ninguém.
* Ruim, porque a F06a não cumpre ordenação nem campos (F1) e a F18 depende da F06: as duas travam.
* Custo de adotar: a F06a entrega pela metade ordenando por `id`, e depois um segundo PR muda contrato e ordem.

### C: F06a cria todas as colunas do script

* Bom, porque fecha a linha inteira da matriz de uma vez.
* Ruim, porque `descricao_problema`, `diagnostico` e `data_fechamento` têm regra (texto livre com possível dado pessoal, fechamento pela F20) que a F06a não define nem testa (F4).
* Custo de adotar: decidir agora tamanho, nulidade e LGPD de texto livre sem a história que os usa, e um PR maior para revisar.

## Mais informações

* Avisar o PRUMO: F18 perde `data_abertura` e `data_previsao_entrega` do escopo; a F06a passa a depender do merge da F04 (ADR-037).
* Avisar o ANCORA: ordem de merge das migrations V5 a V11 (consequência acima).
* Revisitar se a F18 decidir gravar `data_abertura` pela aplicação, ou ao se aproximar de 2038.
