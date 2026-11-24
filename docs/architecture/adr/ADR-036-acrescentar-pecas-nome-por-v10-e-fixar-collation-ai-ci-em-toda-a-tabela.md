---
status: proposto
date: 2026-11-23
decision-makers: [CARTOGRAFO (Arquiteto), pessoa dona do produto (aceite)]
consulted: []
informed: [REGENTE, BUSSOLA, ESPRESSO, CRIVO, CORRENTE, PERGAMINHO]
---

# Acrescentar `pecas.nome` pela migration aditiva V10 e fixar a collation `utf8mb4_0900_ai_ci` em toda a tabela, incluindo `codigo`

Histórico de status:

* 2026-11-23: proposto (F17, etapa do CARTOGRAFO), ramo `docs/f17-adr-pecas-listar`. DDL provado em `mysql:8.4` (8.4.13) sobre V1 e V2 nesta data.

Vínculos: F17 (busca por nome e código, critérios 1 e 7, tarefas 2 e 3, dúvidas 2 e 4), F14 e F15 (escrita de `nome` e `codigo`), linha `pecas` da matriz "Reconciliação do schema com o script de referência" em `docs/architecture/overview.md`. Aplica o ADR-003, o ADR-005 e o ADR-013, a regra de collation do [ADR-017](ADR-017-padronizar-listagem-com-busca-e-paginacao.md) e o padrão do [ADR-033](ADR-033-acrescentar-servicos-nome-por-migration-aditiva-v9-sem-tocar-nas-colunas-geradas.md). Responde ao ponto que o [ADR-032](ADR-032-reaproveitar-contrato-de-listagem-do-adr-017-com-paginacao-extraida-no-service.md) deixou para a F17 (colisão de caixa e acento no índice `uq_pecas_codigo`). Usada pelo [ADR-034](ADR-034-listar-pecas-com-busca-em-nome-ou-codigo-sem-filtro-de-ativo-e-sem-custo.md).

## Contexto e problema

Dúvida 4 da F17, respondida lendo o arquivo `V2__criar_schema_oficina.sql` em 2026-11-23: `pecas` já tem `codigo VARCHAR(50) NOT NULL` com `uq_pecas_codigo UNIQUE`, `custo`, `preco_venda`, `quantidade_estoque`, `estoque_minimo` e `ativo`. **Falta só `nome`.** A matriz pede também `categoria`, `fabricante` e `unidade`, que a lista não usa.

A busca precisa ignorar caixa (critério 1: `pf-2` acha `PF-200`) sem `lower()` na consulta (ADR-017). Isso exige collation `_ci` explícita nas duas colunas buscadas. Fixar a collation da tabela inteira também muda a comparação do índice único de `codigo`: `FO-100` e `fo-100` passam a ser o mesmo código em qualquer servidor. Como acrescentar `nome` e que collation dar a `codigo`?

## Evidência (2026-11-23, `mysql:8.4` 8.4.13, `collation_server` `utf8mb4_0900_ai_ci`, cliente com `--default-character-set=utf8mb4`)

Base: V1 e V2 aplicadas pelo cliente `mysql`, mais 2 linhas em `pecas` sem nome (`FO-100` com 5/5, `PF-200` com 6/5), 1 OS e 1 linha em `ordens_servico_pecas` (`valor_unitario_cobrado` 25.00, `quantidade` 2). V5 a V9 não foram aplicadas: nenhuma delas toca `pecas`.

* Sequência da migration normativa (abaixo): as 2 linhas ficaram `Peca sem nome #1` e `Peca sem nome #2`; `nome` e `codigo` ficaram com `IS_NULLABLE = NO` e `COLLATION_NAME = utf8mb4_0900_ai_ci`; `TABLE_COLLATION` `utf8mb4_0900_ai_ci`; existe `ck_pecas_nome_preenchido` com `` (char_length(trim(`nome`)) > 0) ``.
* Colunas geradas antes e depois: `` (`valor_unitario_cobrado` * `quantidade`) `` e `` (`valor_cobrado` * `quantidade`) ``, `STORED GENERATED`, iguais à V2. O `subtotal` da linha de teste continuou 50.00. O `CONVERT` não falhou por causa da FK de `ordens_servico_pecas`, que é numérica.
* Busca com a cláusula do ADR-034: `%filtro%` achou só `Filtro de Óleo`; `%pf-2%` achou só `Pastilha de freio` (pelo código `PF-200`); `%OLEO%` achou `Filtro de Óleo` (acento e caixa ignorados, responde à dúvida 2); `%!%%` e `%!_%` com `ESCAPE '!'` acharam 0 linhas.
* `INSERT` com `nome = '   '`: erro 3819, `Check constraint 'ck_pecas_nome_preenchido' is violated`.
* `INSERT` com `codigo = 'fo-100'` existindo `FO-100`: erro 1062, `Duplicate entry 'fo-100' for key 'pecas.uq_pecas_codigo'`.
* Tabela de prova `utf8mb4_bin` com `fo-100` e `FO-100` e índice único: `CONVERT TO ... utf8mb4_0900_ai_ci` falhou com erro 1062. Ou seja, num ambiente cuja tabela não seja `_ci`, a V10 falha alto em vez de juntar códigos.
* Neste servidor a V2 já criou `pecas` com `utf8mb4_0900_ai_ci` (herdado do padrão), então `codigo` já era insensível a caixa antes da V10. O `CONVERT` torna isso igual em qualquer servidor (achado A7 do ADR-017: com `latin1` o padrão seria outro).

O teste foi por cliente `mysql`, não por Flyway nem pela aplicação. A prova por Flyway é do IT da F17 (Confirmação).

## Fatores de decisão

* F1. Aditiva (ADR-003): nenhum arquivo de V1 a V9 alterado, nenhum dado apagado.
* F2. Nenhuma linha termina com `nome` `NULL`, vazio ou só de espaços, inclusive linhas anteriores à V10.
* F3. Busca por `nome` e `codigo` sem caixa e sem acento em qualquer servidor, sem `lower()` (ADR-017).
* F4. As colunas geradas `subtotal` das duas junções da OS ficam idênticas (ADR-005).
* F5. Unicidade de `codigo` coerente com a busca: se a busca acha `PF-200` por `pf-200`, o cadastro não aceita os dois como peças diferentes.
* F6. Custo: um arquivo, até quatro instruções, mesmo padrão já revisado no ADR-033.

## Opções consideradas

* N1. `nome` anulável, preenchimento provisório com o `id`, `NOT NULL` com `CHECK`, e `CONVERT` da tabela inteira para `utf8mb4_0900_ai_ci` (inclui `codigo`).
* N2. Igual a N1, mas depois do `CONVERT` devolver `codigo` para `utf8mb4_0900_as_ci` (caixa ignorada, acento distinguido).
* N3. Igual a N1, mas `codigo` em `utf8mb4_bin` (caixa e acento distinguidos), com `lower()` na busca por código.
* N4. Manter como está: `nome` só no DTO ou `ADD COLUMN nome ... NOT NULL` direto, sem fixar collation.

## Resultado da decisão

Opção escolhida: "N1", porque atende F1 a F6 com o padrão já provado na V9. N2 atende F3 e F5 em parte, mas acrescenta uma quinta instrução e uma segunda collation na mesma tabela para proteger códigos com acento, que não existem em código de peça (alfanumérico ASCII na prática). N3 falha em F3 (precisa de `lower()`, que o ADR-017 proíbe porque anula a collation) e em F5 (aceita `PF-200` e `pf-200` como peças distintas que a busca mostra juntas). N4 falha em F2 (o ADR-033 provou que `ADD COLUMN ... NOT NULL` grava `''` em silêncio) e em F3 num servidor `latin1`.

### Migration normativa

Arquivo `apps/api/src/main/resources/db/migration/V10__adicionar_nome_em_pecas.sql`, escrito pelo ESPRESSO na F17, com exatamente estas instruções, nesta ordem (a ordem provada em 2026-11-23):

```sql
-- F17 / ADR-036: nome da peca (matriz de reconciliacao do overview.md).
-- Aditiva (ADR-003). Linha criada antes desta migration recebe nome provisorio com o id,
-- corrigivel pela edicao (F15). Nao toca ordens_servico_pecas nem a coluna gerada
-- subtotal (ADR-005). Collation fixada na tabela inteira, inclusive codigo, para a busca
-- (ADR-017) e para a unicidade de codigo sem diferenciar caixa.
ALTER TABLE pecas ADD COLUMN nome VARCHAR(150) NULL AFTER id;
UPDATE pecas SET nome = CONCAT('Peca sem nome #', id) WHERE nome IS NULL;
ALTER TABLE pecas
    MODIFY COLUMN nome VARCHAR(150) NOT NULL,
    ADD CONSTRAINT ck_pecas_nome_preenchido CHECK (CHAR_LENGTH(TRIM(nome)) > 0);
ALTER TABLE pecas CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

Regras:

* `codigo` **não ganha coluna nova**: já existe na V2 como `VARCHAR(50) NOT NULL UNIQUE`. A V10 só fixa a collation dele pelo `CONVERT`. O pedido de "migration de nome e código" fica atendido assim.
* Número: V10 é o primeiro livre conferido em 2026-11-23 no histórico de todos os ramos locais (V5 a V8 em ramos da Sprint 02, V9 no ramo da F05a). Se outro ramo entrar antes com V10, a F17 usa o próximo livre e corrige este parágrafo, sem mudar o conteúdo.
* O texto provisório é ASCII de propósito (não depende do charset da sessão de quem roda).
* `CHECK` com `TRIM` só remove U+0020; o resto da regra de "só espaços" fica no `@NotBlank` do DTO da F14.
* Entidade: `Peca` ganha `@Column(nullable = false, length = 150) private String nome;`. Nenhuma outra entidade muda. `OrdemServicoPeca.subtotal` continua `@Column(insertable = false, updatable = false)`.
* Fora desta migration, cada um na feature dona: `categoria`, `fabricante` e `unidade` (F14/F15, se o formulário pedir; a lista não usa); formato de `codigo` (F14, recomendação: validar no DTO só caracteres ASCII imprimíveis, o que torna a colisão de acento impossível pela API); índice em `nome` (não entra: `LIKE '%x%'` não usa índice).
* Para a F14: código duplicado sem diferença de caixa (`fo-100` com `FO-100` gravado) dá erro 1062 em `uq_pecas_codigo`, que a F14 traduz para 409 no ponto de gravação, no padrão do ADR-020.

### Consequências

* Bom, porque nenhuma linha fica sem nome e o `CHECK` barra nome vazio vindo de fora da API.
* Bom, porque busca e unicidade de `codigo` usam a mesma regra de comparação: o que a busca junta, o cadastro não deixa duplicar.
* Bom, porque a busca ignora acento e caixa em qualquer servidor (dúvida 2 respondida: ignora acento).
* Ruim, porque `codigo` passa a tratar `ç` e `c` como iguais. Só afeta código com acento, que não é usual em código de peça.
* Ruim, porque são quatro instruções sem transação no MySQL; se falhar no meio, a recuperação é manual (desfazer e `flyway repair`), como na V9.
* Neutro, porque `MODIFY` e `CONVERT` reconstroem a tabela; com o catálogo de uma oficina o bloqueio é desprezível.

### Risco residual

* Ambiente com tabela `pecas` não `_ci` e dois códigos que só diferem em caixa ou acento faz a V10 falhar com 1062 (provado em tabela de prova). Mitigação: no checklist de deploy, antes da V10, `SELECT codigo COLLATE utf8mb4_0900_ai_ci c, COUNT(*) FROM pecas GROUP BY c HAVING COUNT(*) > 1` deve voltar vazio; se não voltar, a oficina decide qual código fica e corrige o outro antes.
* Nome provisório `Peca sem nome #N` é dado inventado até a F15 permitir editar. Mitigação: IT com linha pré-existente e `SELECT id FROM pecas WHERE nome LIKE 'Peca sem nome #%'` no checklist de deploy.
* Ordem do Flyway: a `main` tem V1 a V4; V5 a V9 estão em ramos abertos. Se a V10 for aplicada num banco antes de V5 a V9, o Flyway recusa as anteriores depois (`outOfOrder` não está ligado no `application.yml`). Mitigação: a F17 entra na `main` depois dos PRs que trazem V5 a V9, ou o ramo da F17 parte de cima deles.
* Script manual sem `--default-character-set=utf8mb4` grava `nome` com dupla codificação (ADR-017, eixo 4).

### Confirmação

* `FlywayMigrationIT` ganha asserções depois do `migrate` do zero: `pecas.nome` `varchar(150)`, `IS_NULLABLE = 'NO'`; `COLLATION_NAME = 'utf8mb4_0900_ai_ci'` em `nome` e `codigo`; existe `ck_pecas_nome_preenchido`; a `GENERATION_EXPRESSION` das duas colunas `subtotal` é igual à da V2.
* IT com linha pré-existente (Flyway com `target` na migration anterior à V10, `INSERT` em `pecas`, `migrate` até o fim): a linha passa a ter `nome = 'Peca sem nome #<id>'`, no mesmo formato do `ServicoNomeMigrationIT`.
* `grep -n "ordens_servico" apps/api/src/main/resources/db/migration/V10__adicionar_nome_em_pecas.sql` não acha nada.
* `ddl-auto: validate` sobe com `Peca.nome` mapeado (qualquer `@SpringBootTest` com Testcontainers).
* A linha `pecas` da matriz de reconciliação e a linha `Peca` do modelo de dados do `overview.md` são atualizadas no mesmo PR da V10.

## Prós e contras das opções

### N1. Anulável, provisório, `NOT NULL` + `CHECK`, `CONVERT` da tabela inteira (escolhida)

* Bom, porque atende F1 a F6 e repete um padrão já revisado (V9).
* Bom, porque `codigo` fica com a mesma regra na busca e no índice único.
* Ruim, porque `ç` e `c` colidem no índice de `codigo`.
* Ruim, porque são quatro instruções sem transação.

### N2. N1 com `codigo` em `utf8mb4_0900_as_ci`

* Bom, porque distingue acento no código e mantém a caixa ignorada na busca.
* Ruim, porque duas collations na mesma tabela e uma instrução a mais para um caso (código com acento) que não aparece na prática.
* Custo do descarte: se a oficina usar código com acento, uma migration nova faz o `MODIFY` sem perda de dado.

### N3. N1 com `codigo` em `utf8mb4_bin` e `lower()` na busca

* Bom, porque o índice único fica exato, byte a byte.
* Ruim, porque `lower()` na consulta contraria o ADR-017 e não resolve acento (falha F3).
* Ruim, porque aceita `PF-200` e `pf-200` como peças diferentes que aparecem juntas na busca (falha F5).
* Custo do descarte: nenhum.

### N4. Manter como está

* Bom, porque é a migration mais simples ou nenhuma.
* Ruim, porque `ADD COLUMN ... NOT NULL` direto grava `''` em linha existente (provado no ADR-033), e sem `CONVERT` a busca depende da collation padrão de cada servidor (falha F2, F3).
* Custo do descarte: três instruções a mais.

## Mais informações

* Dúvida 4 da F17 respondida aqui (só `nome` falta). Dúvida 2 respondida: a busca ignora acento, provado em 2026-11-23 e a fixar no IT.
* Revisitar se a oficina usar código com acento (N2) ou se a F14 pedir `categoria`, `fabricante` ou `unidade`.
* Pela regra da casa, a V10 só é escrita depois do aceite deste ADR.
