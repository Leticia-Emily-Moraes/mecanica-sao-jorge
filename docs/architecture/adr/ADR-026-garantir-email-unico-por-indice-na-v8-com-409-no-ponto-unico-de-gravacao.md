---
status: proposto   # 2026-11-18 proposto (F03d, card F10); depende do aceite da P16 pela pessoa
date: 2026-11-18
decision-makers: [CARTOGRAFO (Arquiteto, o como), VIGIA (AppSec/LGPD, a regra, revisão 6 da política), pessoa dona do produto (aceite da P16)]
consulted: [REGENTE (instrução: o contrato do POST da F03c não muda)]
informed: [ESPRESSO, CRIVO, PERGAMINHO, ORLA, BUSSOLA]
---

# Garantir email único com o índice `uk_clientes_email` na V8 e 409 no ponto único de gravação

## Contexto e problema

O card F10 pede 409 quando o email já pertence a outro cliente, com comparação sem caixa e sem espaço nas pontas (US-CLI-31 e US-CLI-32) e sem 500 na corrida (US-CLI-33). A premissa 6 do card pede a mesma regra na criação. O VIGIA deu parecer favorável na revisão 6 da política (seções 2.1 e 2.5), e a regra depende do aceite da pessoa (P16).

**Não existe constraint de email para reaproveitar.** Conferi em 2026-11-18 lendo as V2 a V7 e no `information_schema` de um MySQL 8.4 com V1 a V7 aplicadas. A V5 é só o `CHECK` de telefone (`ck_clientes_telefone_digitos`). A V6 é só o `uk_clientes_cpf` do [ADR-020](ADR-020-garantir-cpf-unico-por-indice-no-banco-com-409-no-service.md). A tabela `clientes` tem `PRIMARY`, `uk_clientes_cpf`, `ck_clientes_cpf_digitos` e `ck_clientes_telefone_digitos`, e nada sobre `email`. A pergunta: como garantir o 409 de email sem mudar o contrato do POST da F03c?

## Fatores de decisão

* F1. Corrida: com dois PUT simultâneos de clientes diferentes para o mesmo email, um responde 200, o outro 409 e nenhum 500 (US-CLI-33).
* F2. Nada vaza: o erro 1062 do MySQL escreve o email inteiro (provado abaixo). Nenhum caminho usa `getMessage()` nem propaga a causa.
* F3. O contrato do POST da F03c não muda (instrução do REGENTE). Ficam iguais: o `ClienteRequest` e as validações dele, o `ClienteDetalheResponse`, os status (201, 400, 401, 409, 415 e 500), o formato do erro (ADR-011) e o 409 de CPF byte a byte (`CPF ja cadastrado`, `erros: []`).
* F4. Um comando SQL por escrita, sem código para o PUT excluir o próprio id.
* F5. Migration aditiva (ADR-003) que aceita vários clientes sem email.
* F6. POST e PUT aplicam a mesma regra (premissa 6 do card), para o POST não gravar o duplicado que o PUT recusa.

## Opções consideradas

* A. Nova migration `V8` com o índice único `uk_clientes_email`, traduzido para 409 no mesmo método `gravar` do ADR-020, sem consulta prévia.
* B. Sem índice: `existsByEmailAndIdNot` no service, só no PUT.
* C. Índice da opção A mais uma consulta prévia `existsByEmailAndIdNot`, para responder antes do `flush`.
* D. Manter como está: email não único (revisão 3 da política).

## Resultado da decisão

Opção escolhida: "A. Índice `uk_clientes_email` na V8 e tradução no `gravar`". É a única opção que atende F1 e F4 juntas: o InnoDB serializa a corrida no próprio índice, com um comando só. O `UPDATE` da própria linha com o mesmo valor não viola o índice (provado), então o PUT não precisa se excluir da checagem. A F10 reaproveita o caminho de 409 que a F09 já prova para o CPF.

### Especificação normativa

1. **Migration** `apps/api/src/main/resources/db/migration/V8__adicionar_indice_unico_email_em_clientes.sql`. A V8 está livre em todas as branches (conferido por `git log --all`).

   ```sql
   -- F03d (F10) / ADR-026: email unico quando preenchido (politica de dados do cliente, 2.1 e 2.5).
   -- Aditiva (ADR-003). Varios NULL nao colidem. A collation da V3 (utf8mb4_0900_ai_ci) compara sem
   -- caixa e sem acento e nao ignora espaco final (NO PAD). Falha se ja existir email repetido:
   -- contar antes, sem mostrar valor (politica 2.5, duvida 2).
   ALTER TABLE clientes ADD CONSTRAINT uk_clientes_email UNIQUE (email);
   ```

   Antes de aplicar em banco que já tenha dado, rodar só a contagem da política: `SELECT COUNT(*) FROM (SELECT TRIM(email) e FROM clientes WHERE email IS NOT NULL GROUP BY e HAVING COUNT(*) > 1) d`. Nunca `SELECT email`. A migration não reescreve emails já gravados: não há dado real, e a collation já junta caixa.
2. **Exceção.** Criar `exception.EmailJaCadastradoException extends ConflitoException`, com `public static final String MENSAGEM = "Email ja cadastrado"` e o construtor `super(MENSAGEM)`. Ela sai com `erros: []`, no mesmo formato da `CpfJaCadastradoException`. **Nenhuma chave i18n nova em `erros[]`.** O 409 de CPF do POST sai com `erros: []`, e a F35 já o associa ao campo pela `mensagem` (R7 de `docs/product/F35-recebido-da-F03c-criar-cliente.md`). Uma chave só no email criaria dois padrões na mesma tela. Passar todos os erros de cliente para chave muda as mensagens de 400 do `ClienteRequest`, que é compartilhado (ADR-021), e portanto muda o contrato do POST (F3). Isso fica para uma decisão própria (Mais informações).
3. **Tradução.** O `ClienteService.gravar` continua sendo o único ponto de gravação. Ele percorre a cadeia de causas uma vez até a `org.hibernate.exception.ConstraintViolationException` e compara `getConstraintName()` em minúsculas pelo sufixo. `uk_clientes_cpf` vira `CpfJaCadastradoException`, `uk_clientes_email` vira `EmailJaCadastradoException`, e qualquer outra violação é relançada como está. Nenhuma das duas recebe `ex` como causa. O `toLowerCase(Locale.ROOT)` só se aplica ao nome da restrição, nunca ao email.
4. **Sem consulta prévia.** Proibidos `existsByEmail`, `findByEmail` e `existsByEmailAndIdNot`, como o ADR-020 (regra 6) faz com o CPF.
5. **Normalização na gravação (premissa 3, política 2.5, U4).** No `ClienteMapper`, o `email` troca o `@Named("aparado")` por um `@Named("emailNormalizado")`: `strip()` seguido de minúsculas **só nas letras `A` a `Z` ASCII**, por exemplo um laço sobre os `char` ou `replaceAll` por faixa. Proibido `String.toLowerCase`, com ou sem `Locale`. O mesmo método vale para o `toEntity` (POST) e para o método `@MappingTarget` do PUT. Esta regra substitui a linha `email` da tabela de normalização do [ADR-021](ADR-021-compartilhar-dto-de-entrada-clienterequest-entre-criar-e-editar.md), que continua valendo para os outros campos.
6. **Os dois campos em conflito.** A resposta aponta o primeiro índice que o MySQL recusar. O card só pede que a mensagem indique um campo.
7. **Log.** No POST, o 409 continua sem linha (política 6.5). No PUT, a linha é `clientes.editar.conflito clienteId={} usuarioId={} campo=email`, com o `campo` tirado do **tipo** da exceção (política 6.7).
8. **OpenAPI.** A descrição do 409 no POST e no PUT passa a ser "CPF ou email ja pertence a outro cliente", com exemplo só com as mensagens fixas. Só muda o texto da documentação; o esquema do contrato fica igual.

**O que o cliente da API percebe no POST (F3).** O formato não muda. Mudam duas respostas, que vêm da premissa 6 do card e da P16, e não desta escolha de mecanismo:

* um POST com o email de outro cliente, que hoje responde 201, passa a responder 409 `Email ja cadastrado`, um status que o POST já documenta;
* o eco do `email` no 201 vem com `A` a `Z` em minúsculas.

Com qualquer índice, a única outra resposta possível para o primeiro caso seria um 500. Se o REGENTE ou a pessoa entenderem que "o contrato do POST não muda" quer dizer que o POST continua aceitando email repetido, a opção A fica impossível. Nesse caso vale a D para o email nos dois endpoints, e os critérios 6, 7 e a parte de email do 8 caem (Mais informações, D).

### Consequências

* Bom, porque a corrida é resolvida no índice, sem lock na aplicação e sem `SELECT ... FOR UPDATE` (provado com duas sessões: a segunda recebe 1062).
* Bom, porque o PUT que mantém o próprio email, inclusive em outra caixa, não colide consigo mesmo (provado). US-CLI-32 passa sem código.
* Bom, porque o código novo cabe em uma migration de uma linha, uma exceção, um `if` a mais no `gravar` e um método `@Named`. O handler do 409 não muda.
* Ruim, porque a collation `ai_ci` também junta acento: `joão@` e `joao@` contam como o mesmo email. É risco aceito pelo VIGIA (U3) e o efeito é só o segundo cadastro ir sem email.
* Ruim, porque a tradução depende do nome da restrição que o Hibernate extrai. A F09 já prova isso para `uk_clientes_cpf`; para `uk_clientes_email` a prova é o IT da F10.
* Ruim, porque três escritas concorrentes podem dar deadlock (1213) em vez de 1062 (provado abaixo). Fica com o [ADR-027](ADR-027-responder-409-a-deadlock-na-gravacao-sem-nova-tentativa.md).
* Neutro, porque a migration falha se já houver email repetido, e aí o Flyway escreve o email no log do boot. A contagem prévia da regra 1 evita isso.

### Confirmação

* IT com Testcontainers (ADR-010): o Flyway aplica V1 a V8 e o contexto sobe com `ddl-auto: validate`.
* PUT de A com o email de B em outra caixa e com espaço nas pontas: 409 com `mensagem` exatamente `Email ja cadastrado` e `erros: []`. Corpo e cabeçalhos sem o email nas duas formas e sem o id de B. Os cinco campos de A ficam iguais, conferidos pelo `JdbcTemplate`.
* PUT de A com o próprio email em outra caixa: 200, e o `JdbcTemplate` mostra o email em minúsculas.
* POST com o email de um cliente existente: 409 `Email ja cadastrado`. Dois POST sem email: 201 e 201. O teste do 409 de CPF da F09 continua passando sem alteração.
* Corrida: PUT simultâneos para o mesmo email: um 200, o resto 409, nenhum 500.
* Teste U4 do mapper com U+212A, U+0130 e U+00A0: o valor gravado é igual ao enviado fora do ASCII, ou a resposta é 400, e nunca 500.
* `git grep -nE "existsByEmail|findByEmail" -- apps/api/src/main` sem ocorrência.
* `git grep -n "toLowerCase" -- apps/api/src/main/java/br/com/mecanicasaojorge/api/mapper` sem ocorrência.
* Revisão do CARTOGRAFO na PR: a V8 bate com a regra 1, e o `overview.md` (matriz e contrato) foi atualizado no mesmo PR.

## Prós e contras das opções

### A. Índice na V8 e tradução no `gravar` (escolhida)

* Bom, porque atende F1 e F4: atômico no banco, um comando, sem exclusão do próprio id.
* Bom, porque atende F6: o POST e o PUT passam pelo mesmo `gravar`, e um script direto no banco também respeita a regra.
* Bom, porque atende F2 e F3: um caminho só de 409, no formato que o POST já tem.
* Ruim, porque depende do nome da restrição na exceção do Hibernate, que é detalhe do fornecedor.
* Ruim, porque o 409 só se prova com MySQL real. Custo: casos novos no IT que já existe.

### B. Só checagem no service do PUT

* Bom, porque o POST fica literalmente igual e o código é explícito.
* Ruim, porque não atende F1: duas edições simultâneas passam pela consulta, e as duas gravam.
* Ruim, porque não atende F6: o POST grava o duplicado que o PUT recusa, e o pedido do titular acha um cadastro só (política 2.1).
* Ruim, porque soma um `SELECT` a cada PUT (F4), e a comparação tem de rodar no banco, nunca em memória (U3).
* Custo de manter: um método de repositório e um teste a mais, com a corrida sem cobertura possível.

### C. Índice e consulta prévia

* Bom, porque atende F1 pelo índice.
* Ruim, porque são dois caminhos para o mesmo 409, e o da corrida é o que quase nunca roda. O ADR-020 rejeitou o mesmo arranjo para o CPF.
* Ruim, porque soma um `SELECT` por escrita (F4) sem mudar a resposta para quem usa.
* Custo de manter: dois métodos de repositório e dois testes a mais, além do IT da A.

### D. Manter como está

* Bom, porque não custa nada e o POST fica literalmente igual (F3).
* Ruim, porque derruba os critérios 6, 7 e a parte de email do 8, e contraria a revisão 6 da política.
* Volta a valer só se a pessoa recusar a P16. Nesse caso não entram a V8, a exceção, o `if` no `gravar` nem a normalização de caixa.

## Mais informações

**Evidência (CARTOGRAFO, 2026-11-18).** Contêiner `mysql:8.4` descartável, sem rede, removido no fim. Apliquei pelo cliente `mysql --default-character-set=utf8mb4` as V1 a V7 deste ramo, inseri clientes fictícios (`@example.com`) e criei o índice da regra 1. Saída real, resumida:

```text
contagem previa (regra 1):                      duplicados_email_antes 0
restricoes de clientes:                         ck_clientes_cpf_digitos CHECK | ck_clientes_telefone_digitos CHECK | PRIMARY | uk_clientes_cpf UNIQUE | uk_clientes_email UNIQUE
coluna email:                                   utf8mb4_0900_ai_ci | NULL | 190
UPDATE da propria linha com o mesmo email:      ROW_COUNT 1 (aceito)
UPDATE da propria linha, 'ANA@Example.com':     ROW_COUNT 1 (aceito)
UPDATE de A para o email de B:                  ERROR 1062 (23000): Duplicate entry 'bia@example.com' for key 'clientes.uk_clientes_email'
UPDATE de A para 'BIA@example.com':             ERROR 1062 (23000): Duplicate entry 'BIA@example.com' for key 'clientes.uk_clientes_email'
clientes com email NULL convivendo:             nulls_email 4
corrida, 2 sessoes, mesmo email (T1 segura 3s): T2 recebe 1062 depois do commit de T1; T1 grava
```

**Não verificado:** o Flyway aplicando a V8, o Hibernate preenchendo `getConstraintName()` para `uk_clientes_email` e o `@Email` com caracteres fora do ASCII. Essas provas são do IT do ESPRESSO.

**Risco residual.**

* Deadlock (1213) com três escritas concorrentes ou com valores cruzados: provado, tratado no ADR-027.
* O 409 confirma a quem tem token que aquele email é de cliente da oficina (U8). Risco a aceitar na P8.
* Família ou empresa que divide email cadastra o segundo cliente sem email. Proibido inventar email (U7, texto do BUSSOLA na F35).
* Divergência registrada: `docs/api/veiculos.md` diz que a `chave` dos erros de cliente "pode vir nula até a F10" (ADR-023). A F10 não migra os erros de cliente para chave (regra 2). O ADR-023 citado no código e nessa referência **não existe em nenhuma branch** (`git log --all`), assim como o ADR-022, o 024 e o 025. A numeração 022 a 025 fica reservada para a F04 materializar.

**Vínculos.** Card F10 (F03d): premissas 2, 3 e 6, tarefas 1, 2, 4 e 5, critérios 6 a 8. Política, revisão 6: 2.1, 2.5, 6.7, seção 7 ("API, edição"), 8.6 (U2, U3, U4, U6) e P16. Complementa o ADR-003, o ADR-011 e o ADR-020 (mesmo padrão), e substitui só a linha `email` da normalização do ADR-021.

**Revisitar quando:** a collation de `clientes` mudar (um `_bin` ou `_as_cs` deixa de juntar caixa e acento, e a normalização ASCII passa a ser a única defesa de caixa); a pessoa decidir migrar os erros de cliente para chave i18n; ou o produto aceitar email compartilhado entre clientes.

## Histórico

| Data | Status | Mudança |
|---|---|---|
| 2026-11-18 | Proposto | Criação na F03d (CARTOGRAFO), com o DDL e a corrida provados em MySQL 8.4. Aguarda o aceite da P16 pela pessoa e a confirmação do REGENTE sobre a leitura de "contrato do POST" (F3) |
