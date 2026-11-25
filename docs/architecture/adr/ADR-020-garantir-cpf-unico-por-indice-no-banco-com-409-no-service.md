---
status: proposto   # 2026-11-17 proposto (F03c, card F09); 2026-11-18 momento decidido pelo VIGIA: entra na F09
date: 2026-11-17
decision-makers: [CARTOGRAFO (Arquiteto, o como), VIGIA (AppSec/LGPD, o quando, pela premissa 3 e dúvida 1 do card F09), pessoa dona do produto (aceite)]
consulted: [BUSSOLA (handoff da F09, D2)]
informed: [ESPRESSO, CRIVO, PERGAMINHO, ORLA, REGENTE]
---

# Garantir CPF único com índice no banco e traduzir a violação para 409 no service

## Contexto e problema

O VIGIA decidiu que o CPF do cliente é único quando preenchido. O CPF repetido bloqueia com 409 e a mensagem fixa `CPF ja cadastrado`, sem mostrar o valor nem o id do cadastro existente (política `docs/security/politica-dados-pessoais-cliente.md`, seção 2.1). A criação (F09, `POST /api/v1/clientes`) e a edição (F10, `PUT /api/v1/clientes/{id}`) escrevem o mesmo campo.

Hoje a coluna não tem índice. Conferi em 2026-11-17 lendo a V2 e a V4, e também no `information_schema` de um MySQL 8.4 com V1 a V4 aplicadas: `clientes.cpf` é `VARCHAR(11) NULL` com o `CHECK` `ck_clientes_cpf_digitos`, e a tabela não tem restrição além de `PRIMARY` e dos `CHECK`.

Duas fontes discordavam sobre **quando** a regra entra. O card (US-CLI-20.6), a revisão humana de 17/11 às 21:34 (critério 9: "ambos criados com 201") e a revisão 3 da política (2.1, item 1) diziam que a F09 ainda aceitava CPF repetido "até a decisão do VIGIA". O BUSSOLA propôs o 409 já na F09 (D2). Em 2026-11-18 o VIGIA decidiu que a regra entra na F09 (ver "Quando a regra entra"). Este ADR decide **como** a unicidade é garantida, de um jeito que vale para qualquer data. A pergunta: índice no banco, checagem no service ou as duas coisas?

## Fatores de decisão

* F1. Corrida: com 10 POST simultâneos e o mesmo CPF, exatamente 1 grava (US-CLI-20.9 do handoff BUSSOLA).
* F2. Nada vaza. Resposta, cabeçalhos e log do 409 não trazem o CPF nem o id existente. O MySQL **escreve o CPF** na mensagem de chave duplicada (provado em Mais informações), então nenhum caminho pode usar `getMessage()`.
* F3. Comandos SQL por escrita: quanto menos, melhor (1 `INSERT` contra `SELECT` mais `INSERT`).
* F4. A F10 reaproveita a regra sem escrever código de unicidade.
* F5. Migration aditiva (ADR-003), aplicável sobre a base existente, sem barrar vários clientes sem CPF.
* F6. Ligar a regra, em qualquer data, não pode exigir reescrever o service da F09 nem o da F10. O card deixou a data com o VIGIA (premissa 3 e dúvida 1), e a decisão saiu em 2026-11-18.

## Opções consideradas

* A. Índice único `uk_clientes_cpf` como única garantia. O service grava com `saveAndFlush` e traduz a violação **desse** índice para `CpfJaCadastradoException` (409).
* B. Só checagem no service (`existsByCpf` antes do `save`), sem índice.
* C. As duas: `existsByCpf` antes do `save` para responder cedo, e o índice como garantia.
* D. Manter como está: sem índice e sem checagem. O CPF repetido é aceito (comportamento provisório do card).

## Resultado da decisão

Opção escolhida: "A. Índice único como única garantia, com tradução no service", porque é a única que atende F1 e F3 ao mesmo tempo. O banco serializa as inserções concorrentes no próprio índice, com um comando só. O caminho que responde 409 é um só, o mesmo na corrida e no caso comum, então o teste de integração cobre de verdade o caminho que importa (F2). A F10 herda tudo pelo mesmo método privado (F4).

### Especificação normativa

A migration recebe o número livre na data em que for escrita. Hoje seria a V6, porque a V5 da F09 é o `CHECK` de telefone (ver `overview.md`, contrato da F03c). Nome: `V<n>__adicionar_indice_unico_cpf_em_clientes.sql`.

```sql
-- ADR-020: CPF unico quando preenchido (politica de dados do cliente, secao 2.1). Aditiva (ADR-003).
-- Varios NULL nao colidem num indice UNIQUE do MySQL: cliente sem CPF e cliente anonimizado passam.
-- Antes de aplicar sobre dado real, contar duplicados sem mostrar o CPF (politica 2.1, item 4).
ALTER TABLE clientes ADD CONSTRAINT uk_clientes_cpf UNIQUE (cpf);
```

Regras de código, nos pacotes do ADR-001:

1. **Exceções.** `exception.ConflitoException` é abstrata e estende `RuntimeException`, com mensagem fixa dada pela subclasse e sem causa. `exception.CpfJaCadastradoException` estende `ConflitoException` com a mensagem exata `CPF ja cadastrado`. É o mesmo padrão do ADR-019 (`RecursoNaoEncontradoException` e a subclasse).
2. **Handler.** O `GlobalExceptionHandler` ganha `@ExceptionHandler(ConflitoException.class)`, que responde 409 no formato do ADR-011, com `ex.getMessage()` (o texto fixo da subclasse) e **sem log**. Isso acrescenta o 409 ao mapa de status do ADR-011, como o ADR-019 fez com o 404.
3. **Um ponto de gravação.** O `ClienteService` tem um único método privado de gravação, usado por `criar` (F09) e por `atualizar` (F10). Ele chama `clienteRepository.saveAndFlush(cliente)` dentro de um `try`. O `flush` é obrigatório. No `INSERT` com `IDENTITY` o Hibernate já executa na hora, mas o `UPDATE` da F10 só iria ao banco no commit, fora do `try`, e viraria 500.
4. **Tradução.** O `catch (DataIntegrityViolationException ex)` só lança `new CpfJaCadastradoException()` quando a violação é do índice `uk_clientes_cpf`. Qualquer outra violação (um `CHECK`, por exemplo) é relançada como está e cai no 500 do ADR-011, que loga só a classe e o caminho. A `CpfJaCadastradoException` **não** recebe `ex` como causa, porque a causa carrega `Duplicate entry '<cpf>'`, e um log de pilha no futuro vazaria o CPF.
5. **Como reconhecer o índice.** Percorrer a cadeia de causas até `org.hibernate.exception.ConstraintViolationException` e comparar `getConstraintName()` ignorando caixa e aceitando o prefixo da tabela. O MySQL 8.4 informa `clientes.uk_clientes_cpf`, não só `uk_clientes_cpf` (provado abaixo).
   * **Não verificado:** se o Hibernate da versão em uso (gerenciada pelo Spring Boot 4.1.2) preenche o nome para o erro 1062 do MySQL. O teste de integração prova.
   * Se o nome vier nulo, o ESPRESSO troca o critério pelo código de erro do fornecedor (`SQLException.getErrorCode() == 1062`). Nesta tabela esse erro só pode vir de `uk_clientes_cpf`, porque a PK é gerada pelo banco. O código mantém um critério só, e a troca fica registrada no histórico deste ADR.
6. **Sem consulta prévia.** Proibido `existsByCpf` ou `findByCpf` antes de gravar. O 409 não gera linha de log (política 6.5), e nunca se usa `getMessage()` da exceção de persistência.
7. **Comparação.** A unicidade vale sobre os 11 dígitos já normalizados (ADR-021), então `123.456.789-00` e `12345678900` colidem. O `CHECK` da V4 garante que nenhuma outra forma é gravada.

**Quando a regra entra (F6). Decisão do VIGIA em 2026-11-18: na própria F09, e a premissa 3 do card cai.** O código das regras 1 a 6 entra **junto** com a migration `V6__adicionar_indice_unico_cpf_em_clientes.sql`, na mesma PR do `POST /api/v1/clientes`, para não existir caminho de 409 sem índice e sem teste. Motivos (detalhe na política, 2.1, item 2):

* A premissa 3 e a dúvida 1 prendiam a ausência de checagem a uma política "ainda não definida". A regra está definida desde a revisão 3 da política. O US-CLI-20.6 se declara provisório "até a decisão do VIGIA", e a decisão é esta.
* A F09 é a primeira escrita de CPF. Um duplicado que entre antes do índice faz a migration falhar no boot, com o CPF no log do Flyway (Consequências).
* A trava alternativa, "antes do primeiro cliente real" (P10), depende de memória: o uso é interno e não há homologação entre o merge da F35 e o balcão.
* O teste de "dois 201" seria escrito para ser apagado. Com a regra agora, o teste de CPF repetido nasce definitivo, e a F10 herda o método único de gravação (F4).

Efeito no card: o US-CLI-20.6 deixa de valer. O critério 9 da revisão humana passa a provar o 409 (Confirmação, primeiro item do IT), e o teste de "dois 201" não é escrito. O texto final do critério é do BUSSOLA. O CPF continua opcional (P9 da política), e vários `NULL` não colidem.

Se a pessoa recusar o momento no aceite deste ADR, vale a opção D na F09 (dois 201, só com dado fictício), a P10 da política volta a bloquear o primeiro cliente real, e o PR perde só a migration, o `catch` e o handler do 409. O método único de gravação da regra 3 fica de qualquer jeito.

### Consequências

* Bom, porque a corrida é resolvida pelo InnoDB no índice, sem lock na aplicação e sem `SELECT ... FOR UPDATE`.
* Bom, porque cada escrita tem um comando SQL só, e a F10 não precisa de `existsByCpfAndIdNot` para se excluir da checagem: o próprio registro não colide com ele mesmo no índice.
* Bom, porque script direto no banco também respeita a regra.
* Ruim, porque a tradução depende do nome da restrição que o Hibernate extrai da mensagem do MySQL. Uma troca de versão pode mudar isso sem erro de compilação, e só o teste de integração pega.
* Ruim, porque a migration do índice falha se já houver CPF repetido, e aí o Flyway escreve o CPF no log do boot. Mitigação: aplicar antes do primeiro cliente real e rodar antes a contagem da política (2.1, item 4).
* Neutro, porque o `INSERT` recusado consome um valor do `AUTO_INCREMENT` e deixa um buraco nos ids. Nenhum contrato promete ids sem buraco.

### Confirmação

* Teste de integração (Testcontainers, ADR-010) com as migrations até a do índice:
  * POST com `12345678900` e depois com `123.456.789-00`: 201 e 409, com `mensagem` exatamente `CPF ja cadastrado`. Corpo e cabeçalhos do 409 sem o CPF nas duas formas e sem o id do primeiro. `COUNT(*)` igual a 1.
  * 10 POST simultâneos com o mesmo CPF: um 201, nove 409 e nenhum 500.
  * Dois POST sem CPF: os dois respondem 201.
  * O Flyway aplica V1 a V6 sobre o banco vazio, e o contexto sobe com `ddl-auto: validate` (premissa 6 do card).
  * Na F10: PUT para o CPF de outro cliente responde 409 e não altera nada. PUT mantendo o próprio CPF responde 200.
* Captura de log no 409: nenhuma linha `clientes.criar`, nenhum nível ERROR e nenhuma ocorrência do CPF.
* `git grep -nE "existsByCpf|findByCpf" -- apps/api/src/main` sem ocorrência.
* `git grep -n "getMessage" -- apps/api/src/main/java/br/com/mecanicasaojorge/api/service/ClienteService.java` sem ocorrência.
* Nenhum teste da suíte afirma 201 para CPF repetido.
* Revisão do CARTOGRAFO na PR que liga a regra: a migration bate com a especificação, e o `overview.md` (matriz e contrato) foi atualizado no mesmo PR.

## Prós e contras das opções

### A. Índice único como única garantia (escolhida)

* Bom, porque atende F1 (atômico no banco), F3 (um comando) e F5 (vários `NULL` passam, provado).
* Bom, porque há um caminho só de 409, exercitado pelo teste de integração (F2).
* Bom, porque a F10 herda sem código novo (F4), e ligar a regra é uma migration mais um `catch` num método (F6).
* Ruim, porque depende de reconhecer a restrição na exceção do Hibernate (regra 5), que é detalhe de fornecedor.
* Ruim, porque o 409 só se prova com MySQL real. MockMvc com repositório simulado não prova nada aqui. Custo: um IT a mais, na infraestrutura que já existe (ADR-010).

### B. Só checagem no service

* Bom, porque é código explícito, sem depender da mensagem do banco.
* Ruim, porque não atende F1: duas requisições simultâneas passam pela consulta e as duas gravam. Com o duplicado, o pedido de eliminação do titular acha só um cadastro e deixa uma cópia viva (política 2.1).
* Ruim, porque soma um `SELECT` a cada escrita (F3), e a F10 precisa de outra consulta que exclua o próprio id (F4).
* Ruim, porque script direto no banco não passa pela regra.

### C. Checagem no service e índice

* Bom, porque atende F1 pelo índice e responde cedo no caso comum.
* Ruim, porque são dois caminhos que produzem o mesmo 409, e o que importa (a corrida) é o que quase nunca roda. Um defeito nele só aparece em produção, sob concorrência.
* Ruim, porque soma um `SELECT` a cada escrita (F3) e uma consulta `existsByCpfAndIdNot` na F10 (F4), sem nenhum ganho para quem usa: a resposta é idêntica.
* Custo de manter: dois métodos de repositório e dois testes a mais, além do mesmo IT da opção A.

### D. Manter como está

Rejeitada para a F09 pelo VIGIA em 2026-11-18 (ver "Quando a regra entra"). Volta a valer só se a pessoa recusar o momento no aceite.

* Bom, porque não custa nada e é o que o card e a revisão humana pedem para a F09.
* Ruim, porque contraria a política (2.1) e só é aceitável com dado fictício. Enquanto esta opção valer, a P10 bloqueia o primeiro cliente real.

## Mais informações

**Evidência (CARTOGRAFO, 2026-11-17).** Usei um contêiner descartável `mysql:8.4`, sem volume, removido no fim. Apliquei V1 a V4 deste ramo com `mysql --default-character-set=utf8mb4` e gravei dois clientes fictícios: um com CPF `12345678900` e telefone `20912345678`, outro sem CPF e sem telefone. Depois apliquei o `CHECK` de telefone da F09 e o índice desta especificação. Saída real, resumida (as crases do MySQL foram removidas na transcrição):

```text
contagens previas, sem mostrar valor:  telefone_fora_formato = 0 | cpf_duplicados = 0
restricoes de clientes:                ck_clientes_cpf_digitos CHECK | ck_clientes_telefone_digitos CHECK | PRIMARY | uk_clientes_cpf UNIQUE
linhas pre-existentes, intactas:       1 Ana Exemplo 20912345678 12345678900 | 2 Bia Exemplo NULL NULL
INSERT do cpf 12345678900 de novo:     ERROR 1062 (23000): Duplicate entry '12345678900' for key 'clientes.uk_clientes_cpf'
INSERT de dois clientes com cpf NULL:  aceitos
```

A mensagem 1062 traz o CPF, e é essa prova que sustenta F2 e a regra 4.

**Não verificado nesta etapa:** a migration rodando pelo Flyway, o `ddl-auto: validate` depois dela e a extração do nome da restrição pelo Hibernate. Essas provas são do teste de integração do ESPRESSO.

**Evidência (VIGIA, 2026-11-18): índice contra a anonimização.** Contêiner `mysql:8.4` (8.4.13) descartável, sem rede e removido no fim. Apliquei pelo cliente `mysql` as V1 a V5 deste ramo (a V5 ainda sem commit) e o índice desta especificação. A contagem prévia deu `cpf_duplicados 0`. Um cliente fictício anonimizado por completo (CPF NULL) foi recadastrado com o mesmo CPF (`inseridas 1`). Um anonimizado em parte (CPF retido) não foi: `ERROR 1062 (23000) at line 1: Duplicate entry '98765432100' for key 'clientes.uk_clientes_cpf'`. Dois cadastros com CPF NULL conviveram (`linhas_cpf_null 2`). O detalhe está na política, seções 2.3 e 8.4. Continuam sem verificação o Flyway aplicando a V6 e o nome da restrição extraído pelo Hibernate, que ficam com o IT do ESPRESSO.

**Risco residual.**

* Se três transações inserem o mesmo CPF e a primeira faz rollback em vez de commit, o InnoDB pode devolver deadlock (1213) para as outras, e isso vira 500. No fluxo da F09 a primeira faz commit, então o risco é baixo. O IT de corrida é a medida.
* O 409 confirma, a quem tem token válido, que aquele CPF já está na base. É risco aceito na política (2.1, item 6), coberto pela P8.
* O titular anonimizado em parte (CPF retido dentro de R1, política seção 5) que volta como cliente recebe 409. Não é defeito: a conduta é reusar o cadastro retido pela edição (política 2.3, achado E9).

**Vínculos.** Card F09 (F03c): US-CLI-20.6, tarefa 7 e dúvida 1. Card F10 (F03d). Handoff BUSSOLA da F09: D2, US-CLI-20.9, US-CLI-20.10 e o US-CLI-27 proposto. Política, seções 2.1, 6.5 e 7 (achado E7, pendência P10). Complementa o ADR-003 (migration aditiva), o ADR-011 (acrescenta o 409) e o ADR-018 (colunas). Segue o padrão de exceção do ADR-019 e usa o formato normalizado do ADR-021.

**Revisitar quando:** a oficina atender empresa (CNPJ no mesmo campo ou em outro, decisão D6 da F26); o banco ou a versão maior do Hibernate mudar; ou a pessoa decidir que CPF repetido só deve gerar alerta; ou a anonimização parcial (política, seção 5) deixar de reter o CPF, o que muda a 2.3 da política.

## Histórico

| Data | Status | Mudança |
|---|---|---|
| 2026-11-17 | Proposto | Criação na F03c (CARTOGRAFO), com DDL provado em MySQL 8.4. Aguarda o aceite da pessoa e a decisão D2 (data em que a regra entra) |
| 2026-11-18 | Proposto | O VIGIA decide o momento: a regra entra na F09 e a premissa 3 do card cai ("Quando a regra entra"; política, revisão 4, 2.1). Opção D rejeitada para a F09. Interação com a anonimização provada em MySQL 8.4 (Mais informações). Status segue Proposto até o aceite da pessoa |
