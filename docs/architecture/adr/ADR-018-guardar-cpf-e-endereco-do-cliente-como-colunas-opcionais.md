---
status: proposto   # 2026-11-17 proposto (F03b, card F08)
date: 2026-11-17
decision-makers: [CARTOGRAFO (Arquiteto), pessoa dona do produto (D-B do PRD da F03b)]
consulted: [BUSSOLA (PRD F03b), VIGIA (política de dados do cliente, aprovação pendente), ESQUADRO (protótipo F26)]
informed: [ESPRESSO, ORLA, CRIVO, PERGAMINHO, REGENTE]
---

# Guardar CPF e endereço do cliente como colunas opcionais, com endereço em campo único

## Contexto e problema

A F03b (card F08, PRD `docs/product/F03b-clientes-detalhe.md`) é a primeira feature que lê CPF e endereço do cliente, mas as migrations da `main` (V1 a V3) não têm nenhuma das duas colunas. Conferi lendo `V2__criar_schema_oficina.sql` e `V3__fixar_collation_clientes.sql` em 2026-11-17, e nenhum ramo do repositório tem `V4`. A política de dados e o `overview.md` diziam que a F09 (F03c, criar) cria as colunas, mas a F09 depende da F08 no quadro. O card da F08 pede endereço estruturado (rua, número, bairro, cidade, UF, CEP) e afirma que ele "segue o schema", o que não é verdade. Política, `overview.md` e protótipo F26 usam um campo único. Onde e como guardar CPF e endereço, e qual feature cria as colunas?

## Fatores de decisão

* F1. Migration aditiva (ADR-003): aplicada em MySQL 8.4 sobre a base com V1 a V3 e com cliente já gravado, sem alterar nenhuma linha existente.
* F2. Quantidade de campos novos que contrato, formulários (F03c, F03d, F35) e protótipo (F26) precisam carregar: quanto menos, melhor.
* F3. CPF guardado só com 11 dígitos ASCII, garantido pelo banco mesmo quando a escrita vem de script manual.
* F4. Coleta mínima (LGPD, art. 6º, III): nenhum campo novo obrigatório; ausente é `NULL`.
* F5. Custo de evoluir depois, se a emissão de nota fiscal pedir endereço estruturado.
* F6. `ddl-auto: validate` continua subindo sem ajuste no mapeamento.
* F7. A F08 não pode esperar uma feature que depende dela.

## Opções consideradas

* A. Duas colunas opcionais na V4 da F08: `cpf VARCHAR(11) NULL` com `CHECK` de 11 dígitos e `endereco VARCHAR(255) NULL` em campo único.
* B. Endereço estruturado em seis colunas (`logradouro`, `numero`, `bairro`, `cidade`, `uf`, `cep`) mais `cpf`, na V4 da F08.
* C. Tabela `enderecos_cliente` (1:N) mais `cpf` em `clientes`.
* D. Manter como está: a F08 não cria colunas, a F09 cria (texto atual da política e do `overview.md`).

## Resultado da decisão

Opção escolhida: "A. Duas colunas opcionais na V4 da F08", porque é a única que atende F1, F3, F4, F6 e F7 sem acrescentar campo a contrato, formulário ou protótipo (F2). O custo de F5 só aparece se a emissão de nota fiscal entrar no escopo, o que hoje não está no briefing nem no backlog.

Especificação normativa da migration, para o ESPRESSO escrever como `V4__adicionar_cpf_e_endereco_em_clientes.sql`:

```sql
-- F03b (F08) / ADR-018: CPF e endereco do cliente, opcionais. Aditiva (ADR-003):
-- nao altera linha existente; cliente ja gravado fica com NULL nas duas colunas.
-- Base legal, retencao e descarte: docs/security/politica-dados-pessoais-cliente.md, secao 2.
ALTER TABLE clientes
    ADD COLUMN cpf      VARCHAR(11)  NULL AFTER email,
    ADD COLUMN endereco VARCHAR(255) NULL AFTER cpf,
    ADD CONSTRAINT ck_clientes_cpf_digitos CHECK (CHAR_LENGTH(cpf) = 11 AND cpf NOT REGEXP '[^0-9]');
```

Regras que acompanham a migration:

1. **Nulidade.** As duas colunas aceitam `NULL` e não têm default. Cliente sem CPF ou sem endereço é o caso normal (política, seção 2: só se coleta CPF quando há nota fiscal).
2. **Formato do CPF.** Só os 11 dígitos, sem máscara. O `CHECK` barra qualquer outro formato, inclusive vindo de script. `NULL` passa no `CHECK`. O dígito verificador **não** é validado no banco: é regra de escrita da F09 (F03c), em Java. Por isso a fixture fictícia `12345678900` (dígito verificador inválido de propósito) é aceita pela coluna.
3. **Charset.** As colunas herdam `utf8mb4` e `utf8mb4_0900_ai_ci` do padrão da tabela, fixado pela V3 (ADR-017). Não há `COLLATE` explícito porque nenhuma busca usa essas colunas.
4. **Sem `UNIQUE` em `cpf` nesta migration.** Quem decide se CPF duplicado é erro é a F09 (F03c), primeira feature que escreve na coluna. Como nada grava antes dela, a F09 cria a restrição em migration própria sem custo de deduplicação. Atenção para a F09: o erro de chave duplicada do MySQL traz o valor na mensagem; o handler global já não loga `getMessage()` (política, seção 7), e a F09 não pode passar a logar.
5. **Entidade.** `Cliente` ganha `@Column(length = 11) private String cpf;` e `@Column(length = 255) private String endereco;`, só depois que a V4 existir (ADR-013). A entidade continua sem `@ToString` e sem `@Data`; se alguém acrescentar, `nome`, `cpf`, `telefone`, `email` e `endereco` ficam excluídos.
6. **Onde as colunas aparecem.** Só em `ClienteDetalheResponse` (F03b, ADR-019 para o 404) e nos DTOs de escrita da F03c e da F03d. Nunca em `ClienteListResponse`, na busca da F03a (`ClienteRepository.buscar` não consulta `cpf` nem `endereco`), em DTO de OS ou em log (política, seções 2 e 6).
7. **Condição de entrada.** O VIGIA aprova as linhas de `cpf` e `endereco` da política (seção 2) e do registro `docs/security/lgpd-registro-dados-pessoais.md` antes do merge da V4. A pessoa aceita este ADR (D-B) antes de o ESPRESSO abrir a migration, pela regra de que feature não começa sobre ADR `Proposto`.

Decisões de detalhe e alternativas descartadas, com o custo:

* `VARCHAR(11)` em vez de `CHAR(11)`. `CHAR(11)` descreve melhor um tamanho fixo, mas o Hibernate mapeia `String` para `VARCHAR`, e **não verifiquei** se o `ddl-auto: validate` da versão em uso aceita `CHAR` sem `@JdbcTypeCode(SqlTypes.CHAR)`. `VARCHAR(11)` com o `CHECK` garante o mesmo formato sem esse risco. Custo de `CHAR`: uma anotação a mais e um teste para provar o `validate`.
* `CHECK` com `CHAR_LENGTH` e `NOT REGEXP` sobre a classe de não dígitos, em vez de um padrão ancorado. O efeito é o mesmo e a cláusula fica legível no `information_schema`.
* `UNIQUE` já na V4: barato agora, mas tira da F09 uma decisão de produto (duplicado é erro ou não). Descartado sem custo, pelo item 4.

### Consequências

* Bom, porque a V4 é uma única instrução aditiva, já provada em MySQL 8.4 sobre a base real (seção Mais informações), e clientes existentes saem com `cpf` e `endereco` nulos.
* Bom, porque o contrato do detalhe, os formulários da F03c e da F03d e o protótipo F26 já usam um campo de endereço; nada muda em produto nem em Figma.
* Bom, porque o formato do CPF fica garantido no banco, e o detalhe pode prometer "só dígitos" ao app sem depender de toda escrita passar pela API.
* Bom, porque a F08 deixa de depender da F09, que depende dela.
* Ruim, porque endereço em texto livre não serve direto para emissão de nota fiscal eletrônica nem para validar CEP e UF. Se isso entrar, a migração para campos estruturados exige revisão manual dos endereços já gravados.
* Ruim, porque as colunas ficam sem escrita até a F09: em produção o detalhe mostra "Não informado" para CPF e endereço até lá.
* Neutro, porque a política e o registro LGPD (donos: VIGIA) precisam trocar "a F09 cria" por "a V4 da F08 cria" antes do merge.

### Confirmação

* Teste de integração (Testcontainers, ADR-010) que aplica V1 a V3, grava um cliente só com `nome`, `telefone` e `email`, aplica a V4 e verifica: Flyway sem erro, colunas `cpf` e `endereco` com `IS_NULLABLE = YES` no `information_schema`, linha pré-existente inalterada e `GET /api/v1/clientes/{id}` com `cpf` e `endereco` nulos (US-CLI-DET-16).
* Teste de integração que tenta gravar `123.456.789-00`, `1234567890` e texto vazio em `cpf` por `JdbcTemplate` e recebe violação do `CHECK` `ck_clientes_cpf_digitos`, sem o valor na mensagem logada.
* O contexto de integração sobe com `ddl-auto: validate` depois da V4 (o próprio IT falha se a entidade divergir).
* `git grep -n "cpf\|endereco" -- apps/api/src/main/java/br/com/mecanicasaojorge/api/dto/ClienteListResponse.java apps/api/src/main/java/br/com/mecanicasaojorge/api/repository/` sem ocorrência.
* Revisão do CARTOGRAFO na PR da F08: a migration bate com a especificação acima, letra por letra, e a matriz de reconciliação do `overview.md` foi fechada no mesmo PR.

## Prós e contras das opções

### A. Duas colunas opcionais, endereço em campo único (escolhida)

* Bom, porque é uma instrução aditiva, sem tabela nova e sem mudança em contrato de outra feature (F1, F2).
* Bom, porque o `CHECK` garante CPF só com dígitos no banco (F3) e as duas colunas nascem `NULL` (F4).
* Bom, porque bate com política, `overview.md` e protótipo F26, que já usam campo único.
* Neutro, porque o tamanho de 255 é estimativa: um endereço brasileiro completo com complemento cabe com folga, e aumentar `VARCHAR` depois é migration aditiva barata.
* Ruim, porque texto livre não estrutura CEP, UF e cidade (F5): integração fiscal futura exige migration nova e limpeza manual.

### B. Endereço estruturado em seis colunas

* Bom, porque atende o texto do card e serve direto a uma integração fiscal futura (F5).
* Neutro, porque continua aditiva (F1) e opcional (F4).
* Ruim, porque são seis colunas, validação de CEP e de UF, seis campos em `ClienteDetalheResponse`, nos DTOs da F03c e da F03d e nos formulários da F35, e frames novos no Figma da F26, que já foi aprovado com campo único (F2). Estimo de 1 a 2 dias a mais somando backend, tela e Figma.
* Ruim, porque obriga o balcão a separar campos para um dado que hoje só serve para buscar e entregar o carro.

### C. Tabela `enderecos_cliente` (1:N)

* Bom, porque permite mais de um endereço por cliente (cobrança e entrega).
* Ruim, porque traz entidade, repositório, FK, regra de anonimização em outra tabela e um `JOIN` no detalhe, para uma necessidade que ninguém pediu (F2). É a opção mais cara de manter.
* Ruim, porque espalha dado pessoal em mais uma tabela, o que aumenta a superfície de descarte da política (seção 4).

### D. Manter como está (a F09 cria as colunas)

* Bom, porque não exige mudar política nem `overview.md`.
* Ruim, porque trava a F08: a F09 depende da F08 no quadro, então nenhuma das duas começa (F7).
* Ruim, porque o detalhe nasceria sem `cpf` e `endereco`, e a F03d e a F35 precisariam de um segundo contrato quando as colunas chegassem.

## Mais informações

**Evidência (CARTOGRAFO, 2026-11-17).** Contêiner descartável `mysql:8.4`, com V1, V2 e V3 da `main` aplicadas pelo cliente `mysql --default-character-set=utf8mb4`. Gravei o cliente "Ana Exemplo" (fictício) antes da V4 e apliquei a V4 desta especificação. Saída real resumida:

```text
antes da V4  | 1 | Ana Exemplo | 11912345678 | ana@example.com | 2026-11-17 22:23:10
depois da V4 | 1 | Ana Exemplo | 11912345678 | ana@example.com | NULL | NULL | 2026-11-17 22:23:10
cpf      | varchar(11)  | YES | utf8mb4 | utf8mb4_0900_ai_ci
endereco | varchar(255) | YES | utf8mb4 | utf8mb4_0900_ai_ci
ck_clientes_cpf_digitos | ((char_length(cpf) = 11) and (not(regexp_like(cpf, [^0-9]))))
aceitos: 12345678900; NULL
ERROR 1406 (22001): Data too long for column cpf                         <- 123.456.789-00
ERROR 3819 (HY000): Check constraint ck_clientes_cpf_digitos is violated  <- 1234567890
ERROR 3819 (HY000): Check constraint ck_clientes_cpf_digitos is violated  <- vazio
ERROR 3819 (HY000): Check constraint ck_clientes_cpf_digitos is violated  <- abcdefghijk
ERROR 3819 (HY000): Check constraint ck_clientes_cpf_digitos is violated  <- 11 dígitos de largura cheia
ERROR 3819 (HY000): Check constraint ck_clientes_cpf_digitos is violated  <- 10 dígitos e um espaço
```

Crases e aspas da saída removidas na transcrição. Nenhuma mensagem de erro do MySQL trouxe o valor rejeitado. O `Data too long` depende do `sql_mode` estrito, que é o padrão do 8.4; em modo não estrito o MySQL truncaria e o `CHECK` ainda barraria. **Não verificado:** o comportamento pelo Flyway e pelo Hibernate `validate` (é o IT da F08 que prova) e o MySQL de produção, que ainda não existe.

**Risco residual.**

* Endereço em texto livre não serve a integração fiscal sem retrabalho (F5).
* CPF com dígito verificador inválido pode ser gravado por script direto no banco; a API da F09 barra, o banco não.
* Enquanto a política e o registro LGPD disserem "a F09 cria", a regra de coleta (seção 2 da política) fica contraditória; o VIGIA corrige antes do merge da V4.

**Vínculos.** PRD `docs/product/F03b-clientes-detalhe.md` (decisões D-B e D-D, critério US-CLI-DET-16). Card F08 (F03b); afeta F09 (F03c), F10 (F03d), F35 e o protótipo F26. Complementa o ADR-003 (migration aditiva), o ADR-007 (DTO e nomes), o ADR-013 (Flyway como fonte do schema) e o ADR-017 (collation da V3). O 404 do detalhe está no ADR-019. Política `docs/security/politica-dados-pessoais-cliente.md`, seções 2, 4 e 7.

**Revisitar quando:** a emissão de nota fiscal eletrônica entrar no escopo; a oficina atender empresa (CNPJ, decisão D6 da F26); ou a F09 decidir a regra de CPF duplicado.

## Histórico

| Data | Status | Mudança |
|---|---|---|
| 2026-11-17 | Proposto | Criação na F03b (CARTOGRAFO), com DDL provado em MySQL 8.4. Aguarda aceite da pessoa (D-B) e aprovação do VIGIA às linhas de `cpf` e `endereco` |
