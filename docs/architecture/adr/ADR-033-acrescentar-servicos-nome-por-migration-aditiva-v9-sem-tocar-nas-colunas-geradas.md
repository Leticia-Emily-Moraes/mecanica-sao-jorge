---
status: proposto
date: 2026-11-23
decision-makers: [CARTOGRAFO (Arquiteto), pessoa dona do produto (aceite)]
consulted: []
informed: [REGENTE, BUSSOLA, ESPRESSO, CRIVO, CORRENTE, PERGAMINHO]
---

# Acrescentar `servicos.nome` por migration aditiva V9 com preenchimento provisório, sem tocar nas colunas geradas da OS

Histórico de status:

* 2026-11-23: proposto (F05a, etapa do CARTOGRAFO), ramo `docs/f05a-adr-paginacao-e-nome-servico`. DDL provado em `mysql:8.4` (8.4.13) sobre V1 a V4 nesta data.

Vínculos: F05a (US-SRV-01 a US-SRV-04 dependem de `nome`), F11 e F12 (escrita de `nome`), linha `servicos` da matriz "Reconciliação do schema com o script de referência" em `docs/architecture/overview.md`. Aplica o ADR-003 (migration aditiva), o ADR-005 (subtotais como coluna gerada), o ADR-013 (Flyway como fonte do schema) e a regra de collation do [ADR-017](ADR-017-padronizar-listagem-com-busca-e-paginacao.md). Par do [ADR-032](ADR-032-reaproveitar-contrato-de-listagem-do-adr-017-com-paginacao-extraida-no-service.md), que usa a coluna na busca. Responde à dúvida D6 da BUSSOLA (linha existente ao acrescentar `nome NOT NULL`).

## Contexto e problema

A V2 criou `servicos` sem `nome` (só `valor_padrao_mao_obra`, `tempo_estimado_horas` e `ativo`), e a busca da F05a é por nome. A matriz de reconciliação pede `nome VARCHAR(150) NOT NULL`. A tabela é referenciada por `ordens_servico_servicos.servico_id`, que tem a coluna gerada `subtotal` (ADR-005), e essa coluna não pode ser gravada nem redefinida pela aplicação.

Nenhum endpoint grava serviço antes da F11, então o normal é a tabela estar vazia em todo ambiente. Mas isso não é garantido: um script manual ou um seed pode ter criado linhas. Como acrescentar `nome` obrigatório de modo que nenhuma linha fique com nome vazio, a busca ignore acento e caixa, e nada mude nas tabelas da OS?

## Evidência (2026-11-23, `mysql:8.4` 8.4.13, `sql_mode` padrão com `STRICT_TRANS_TABLES`)

Base: V1 a V4 aplicadas, mais 2 linhas em `servicos` e 1 linha em `ordens_servico_servicos` (`valor_cobrado` 100.00, `quantidade` 2).

* `ADD COLUMN nome VARCHAR(150) NOT NULL` direto, numa cópia da tabela com as 2 linhas: o MySQL aceitou e preencheu as duas com `''`, sem erro nem aviso visível. O modo estrito não pega isso no `ALTER TABLE`.
* Sequência da opção escolhida (abaixo) sobre a tabela real: as 2 linhas ficaram `Servico sem nome #1` e `Servico sem nome #2`; `nome` ficou `varchar(150)`, `NOT NULL`, collation `utf8mb4_0900_ai_ci`; a tabela ficou com `TABLE_COLLATION` `utf8mb4_0900_ai_ci`.
* Colunas geradas antes e depois: `ordens_servico_servicos.subtotal` com `GENERATION_EXPRESSION` `` (`valor_cobrado` * `quantidade`) `` e `ordens_servico_pecas.subtotal` com `` (`valor_unitario_cobrado` * `quantidade`) ``, as duas `STORED GENERATED`, iguais à V2. O `subtotal` da linha de teste continuou 200.00. O `CONVERT` em `servicos` não falhou por causa da FK de `ordens_servico_servicos`, que é numérica.
* `INSERT` com `nome = '   '`: erro 3819, `Check constraint 'ck_servicos_nome_preenchido' is violated`.
* Busca, com sessão `utf8mb4` (`--default-character-set=utf8mb4`): `LIKE '%oleo%' ESCAPE '!'` e `LIKE '%ÓLEO%' ESCAPE '!'` acharam `Troca de Óleo`; `LIKE '%!%%' ESCAPE '!'` não achou nada.
* Achado lateral, já previsto no ADR-017 (eixo 4): na primeira tentativa, sem `--default-character-set`, o cliente `mysql` do contêiner gravou `Óleo` com dupla codificação e a busca por `oleo` voltou vazia. A regra do ADR-017 para script manual vale também para `servicos`.

O teste foi feito por cliente `mysql`, não por Flyway nem pela aplicação. A prova por Flyway é do teste de integração da F05a (ver Confirmação).

## Fatores de decisão

* F1. Aditiva (ADR-003): nenhum arquivo de V1 a V8 é alterado, e nenhum dado existente é apagado.
* F2. Nenhuma linha termina com `nome` `NULL`, vazio ou só de espaços, inclusive linhas criadas antes da V9. Medido por consulta depois da migration.
* F3. As colunas geradas `subtotal` das duas junções da OS ficam idênticas. Medido por `information_schema.COLUMNS.GENERATION_EXPRESSION` antes e depois, e por nenhuma instrução da V9 citar `ordens_servico`.
* F4. Busca sem acento e sem caixa em qualquer servidor, sem `lower()` na consulta (regra do ADR-017).
* F5. `ddl-auto: validate` continua passando com `Servico.nome` mapeado como `@Column(nullable = false, length = 150)`.
* F6. Custo: um arquivo de migration, até cinco instruções, sem dado inventado em produção que alguém não consiga achar e corrigir.

## Opções consideradas

* M1. `ADD COLUMN nome VARCHAR(150) NOT NULL` direto.
* M2. Coluna anulável, preenchimento provisório identificável, depois `NOT NULL`, `CHECK` de preenchimento e collation fixada.
* M3. `ADD COLUMN nome VARCHAR(150) NOT NULL DEFAULT 'Sem nome'`.
* M4. Manter `nome` anulável no banco e exigir só no DTO.
* M5. Recriar a tabela `servicos`.

## Resultado da decisão

Opção escolhida: "M2", porque é a única que atende F2 com linha pré-existente sem esconder o problema: a linha fica com um nome provisório que cita o próprio `id`, aparece na lista e pode ser corrigida pela F12. M1 falha em F2 (provado: grava `''` em silêncio). M3 passa em F2 no momento da migration, mas o `DEFAULT` fica para sempre e um `INSERT` manual sem `nome` volta a gravar "Sem nome" sem erro. M4 falha em F2 para qualquer gravação fora da API. M5 falha em F1 e quebraria a FK de `ordens_servico_servicos`.

### Migration normativa

Arquivo `apps/api/src/main/resources/db/migration/V9__adicionar_nome_em_servicos.sql`, escrito pelo ESPRESSO na F05a, com exatamente estas instruções, nesta ordem (a mesma ordem provada em 2026-11-23):

```sql
-- F05a / ADR-033: nome do servico (matriz de reconciliacao do overview.md).
-- Aditiva (ADR-003). Linha criada antes desta migration recebe nome provisorio com o id,
-- corrigivel pela edicao (F12). Nao toca ordens_servico_servicos nem a coluna gerada
-- subtotal (ADR-005). Collation fixada para a busca (ADR-017).
ALTER TABLE servicos ADD COLUMN nome VARCHAR(150) NULL AFTER id;
UPDATE servicos SET nome = CONCAT('Servico sem nome #', id) WHERE nome IS NULL;
ALTER TABLE servicos
    MODIFY COLUMN nome VARCHAR(150) NOT NULL,
    ADD CONSTRAINT ck_servicos_nome_preenchido CHECK (CHAR_LENGTH(TRIM(nome)) > 0);
ALTER TABLE servicos CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

Regras:

* Número: V9 é o primeiro livre conferido em 2026-11-23 em todos os ramos locais (V5 da F03c, V6 do ADR-020, V7 da F04 e V8 da F10 já estão reservados em ramos abertos). Se outra feature entrar antes com V9, a F05a usa o próximo número livre e corrige este parágrafo, sem mudar o conteúdo (ADR-003).
* O texto provisório é ASCII de propósito: não depende do charset da sessão de quem roda a migration.
* `CHECK` usa `TRIM`, que no MySQL só remove o espaço U+0020. A regra de "só espaços" completa (tabulação, U+00A0) fica no DTO da F11 com `@NotBlank`; o `CHECK` é a segunda linha de defesa contra script manual.
* Fora desta migration, cada um na feature dona: `descricao VARCHAR(255)` (F11, se o formulário pedir), `UNIQUE` em `nome` (F11, só se a D4 decidir que o nome é único), índice em `nome` (não entra: `LIKE '%x%'` não usa índice e o volume é de oficina), `pecas.nome` e a collation de `pecas` (F17, próxima migration livre, hoje V10, no mesmo padrão).
* Entidade: `Servico` ganha `@Column(nullable = false, length = 150) private String nome;`. Nenhuma outra entidade muda. `OrdemServicoServico.subtotal` continua `@Column(insertable = false, updatable = false)` (ADR-005).

### Consequências

* Bom, porque nenhuma linha fica sem nome, nem as criadas por script antes da V9, e o `CHECK` barra nome vazio vindo de fora da API.
* Bom, porque a busca da F05a ignora acento e caixa em qualquer servidor, com a mesma técnica já provada em `clientes` (V3).
* Bom, porque as tabelas da OS e as colunas geradas não aparecem em nenhuma instrução, e a prova por `information_schema` faz parte do teste.
* Ruim, porque uma linha antiga pode aparecer na lista como `Servico sem nome #N` até alguém editar. Hoje se espera zero linhas assim.
* Ruim, porque são quatro instruções DDL/DML no MySQL, que não faz DDL em transação. Se a terceira falhar, a coluna fica criada e anulável, e o Flyway marca a V9 como falha. A recuperação é manual (desfazer o que foi aplicado e `flyway repair`).
* Neutro, porque `CONVERT TO` e `MODIFY` reconstroem a tabela; com o volume de catálogo de uma oficina, o bloqueio é desprezível.

### Risco residual

* Se já houver linhas reais em algum ambiente, o nome provisório é dado inventado até a F12 permitir a edição. Mitigação: o teste de integração com linha pré-existente e uma consulta `SELECT id FROM servicos WHERE nome LIKE 'Servico sem nome #%'` no checklist de deploy.
* Script manual rodado sem `--default-character-set=utf8mb4` grava `servicos.nome` com dupla codificação (observado em 2026-11-23). Mitigação: a regra do ADR-017, eixo 4, que já vale para todo script manual.
* `TRIM` do `CHECK` não pega nome só de tabulação ou U+00A0. Mitigação: `@NotBlank` no DTO da F11.

### Confirmação

* `FlywayMigrationIT` (já existe) ganha asserções depois do `migrate` do zero: `servicos.nome` é `varchar(150)`, `IS_NULLABLE = 'NO'`, `COLLATION_NAME = 'utf8mb4_0900_ai_ci'`; existe `ck_servicos_nome_preenchido` em `information_schema.CHECK_CONSTRAINTS`; a `GENERATION_EXPRESSION` das duas colunas `subtotal` é igual à da V2.
* Teste de integração com linha pré-existente: Flyway configurado com `target` na migration anterior à V9, `INSERT` de uma linha em `servicos`, `migrate` até o fim, e a linha passa a ter `nome = 'Servico sem nome #<id>'`.
* `grep -n "ordens_servico" apps/api/src/main/resources/db/migration/V9__adicionar_nome_em_servicos.sql` não acha nada.
* `ddl-auto: validate` sobe com `Servico.nome` mapeado (qualquer teste `@SpringBootTest` com Testcontainers prova isso).
* A linha `servicos` da matriz de reconciliação do `overview.md` é atualizada no mesmo PR da V9.

## Prós e contras das opções

### M1. `ADD COLUMN ... NOT NULL` direto

* Bom, porque é uma instrução só, a mais simples de ler.
* Bom, porque em tabela vazia, o caso esperado, o resultado é correto.
* Ruim, porque com linha pré-existente grava `''` sem erro (provado em 2026-11-23), e o nome vazio aparece no topo da lista ordenada por nome (falha F2).
* Custo do descarte: três instruções a mais na V9.

### M2. Anulável, preenchimento provisório, `NOT NULL`, `CHECK` e collation (escolhida)

* Bom, porque atende F1 a F5 e deixa a linha antiga visível e corrigível.
* Bom, porque o `CHECK` protege contra gravação fora da API.
* Ruim, porque são quatro instruções sem transação no MySQL, com recuperação manual se falhar no meio.
* Ruim, porque o nome provisório é dado que ninguém digitou.

### M3. `NOT NULL DEFAULT 'Sem nome'`

* Bom, porque é uma instrução só e nunca deixa vazio.
* Ruim, porque o `DEFAULT` fica no schema e esconde para sempre um `INSERT` manual sem `nome`.
* Ruim, porque todas as linhas antigas ficam com o mesmo nome, sem `id` para distinguir na lista.
* Custo do descarte: nenhum além das instruções a mais da M2.

### M4. `nome` anulável, obrigatório só no DTO

* Bom, porque é a migration mais simples e nunca falha.
* Ruim, porque contraria a matriz (`NOT NULL`) e permite `NULL` vindo de script ou de outra feature (falha F2).
* Ruim, porque `NULL` ordena antes de todo nome e quebra a expectativa da lista ordenada.
* Custo do descarte: nenhum.

### M5. Recriar `servicos`

* Bom, porque o `CREATE TABLE` final ficaria limpo, com a ordem de colunas ideal.
* Ruim, porque não é aditiva (falha F1), exige copiar dados e derrubar e recriar a FK de `ordens_servico_servicos`, o que encosta na tabela da coluna gerada (falha F3).
* Custo do descarte: nenhum.

## Mais informações

* D6 da BUSSOLA respondida aqui (M2). D4 (nome único) continua aberta e não muda esta migration.
* Revisitar se a F12 precisar de `descricao` obrigatória ou se a D4 pedir `UNIQUE`, cada uma em migration nova.
* Pela regra da casa, a V9 só é escrita depois do aceite deste ADR.
