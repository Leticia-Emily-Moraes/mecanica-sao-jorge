# Rascunho do corpo da PR: F10 (F03d), `PUT /api/v1/clientes/{id}`

Proposto pelo VIGIA para substituir o rascunho do ESPRESSO, que não está versionado. A pessoa confirma qual corpo vale antes de abrir a PR.

**Base da PR: decisão da pessoa (a, b ou c).** Fato que pesa na escolha: o `03e7646` (com `Co-Authored-By`) é ancestral deste ramo. Ele também está em `feat/f03c-clientes-criar` e em `feat/f04-veiculos`, mas não está na `main`. Com qualquer uma dessas bases, ele acaba chegando à `main`. Para mantê-lo fora, é preciso reescrever o histórico (política de dados do cliente, 8.8, X1).

## O que mudou

* `PUT /api/v1/clientes/{id}` no `ClienteController`, fino: `@Positive` no id, `@Valid` no `ClienteRequest` (o mesmo DTO do POST, ADR-021) e `usuarioId` tirado do `sub` do JWT. A resposta é 200 com `ClienteDetalheResponse`, nunca a entidade.
* `ClienteService.atualizar`: faz `findById` (404) e depois copia os campos com MapStruct `@MappingTarget`, ignorando `id` e `createdAt`. CPF e email de outro cliente viram 409 pelo índice único, no ponto único de gravação (ADR-020 e ADR-026). Deadlock ou espera de lock vira 409 com mensagem fixa (ADR-027), e o service loga só `campo=concorrencia`.
* `V8__adicionar_indice_unico_email_em_clientes.sql`: `uk_clientes_email`, aceitando vários `NULL`.
* Email aparado nas pontas, incluindo NBSP, U+2007 e U+202F (`AparoUnicode`). Só as letras `A` a `Z` viram minúsculas.
* Documentação springdoc com 200, 400, 401, 404 e 409. Os exemplos são fictícios, com telefone de DDD 20.
* Testes: `ClienteAtualizarServiceTest`, `ClienteAtualizarControllerTest`, `AparoUnicodeTest` e `ClienteAtualizarIT` (33 testes, MySQL 8.4 via Testcontainers).

## Por quê

O atendente corrige telefone, email e endereço sem recriar o cadastro, e o vínculo com veículos e OS continua. A unicidade fica no índice, e não numa consulta prévia, para a corrida entre duas edições não gerar duplicado nem 500.

## Como verificar

```
apps/api/mvnw -f apps/api/pom.xml clean verify
apps/api/mvnw -f apps/api/pom.xml checkstyle:check
apps/api/mvnw -f apps/api/pom.xml spotless:check
```

Resultado em 2026-11-19, no `3caf42c`: 249 testes unitários e 142 de integração, 0 falhas. Checkstyle com 0 violações e spotless verde.

Antes de aplicar a V8 em base com dados, rode **só a contagem**. A consulta não lista email:

```sql
SELECT COUNT(*) FROM (SELECT email FROM clientes WHERE email IS NOT NULL GROUP BY email HAVING COUNT(*) > 1) d;
```

Com resultado diferente de 0, a V8 falha. Antes de aplicar, é preciso decidir quem fica com o email.

## Evidência de corrida (critério 8)

* Em `docs/product/F10-evidencia-corrida-100-rodadas.md`: 100 de 100 rodadas com um 200 e um 409, e nenhum 5xx. O teste era temporário e não está versionado (8.8, X6).
* A tabela do CRIVO registrou 99 de 100 numa execução anterior. Os dois números ficam aqui.
* **O deadlock real do MySQL não foi provado** (`lock_deadlocks=0`). O 409 de deadlock só foi testado com exceção simulada.

## Segurança e LGPD (VIGIA, política de dados do cliente 8.6 a 8.8)

| OWASP | Avaliação |
|---|---|
| A01 Controle de acesso | Todo token válido edita qualquer cliente, por desenho do briefing (U5). O risco ainda precisa do aceite da P8 antes do merge. O `id` do corpo é ignorado (US-CLI-30) |
| A02 Falhas criptográficas | HS256 com segredo de pelo menos 32 bytes, vindo de variável de ambiente. Os testes usam segredo fictício |
| A03 Injeção | Só Spring Data JPA, com parâmetros. Nenhuma SQL montada com entrada do usuário |
| A04 Desenho inseguro | O U+200B não é aparado: no conflito dá 409; sem conflito, é gravado (risco aceito, W5 e X3) |
| A05 Configuração | `PUBLIC_PATHS` só com login, documentação e health |
| A06 Componentes vulneráveis | A F10 não acrescenta dependência. O `osv-scanner` não rodou nesta máquina, então vale a varredura registrada na 8.1 |
| A07 Autenticação | 401 com token ausente, malformado, expirado com a chave correta, de outra chave e `alg: none`, com controle positivo do mesmo construtor de token (200). Nada é alterado e não há linha `clientes.editar` |
| A08 Integridade | Atribuição em massa bloqueada pelo mapper (`ReportingPolicy.ERROR`, `id` e `createdAt` ignorados) |
| A09 Log | As linhas do PUT carregam só `clienteId`, `usuarioId` e, no conflito, o nome do campo (`cpf`, `email` ou `concorrencia`). O 409 não repete o valor nem identifica o outro cliente |
| A10 SSRF | Não se aplica |

Dados pessoais: nome, CPF, telefone, email e endereço. A finalidade é manter o cadastro atualizado, com base na execução de contrato (art. 7º, V). A retenção segue a política, e o valor anterior nunca é guardado. O `gitleaks` não achou segredo nos commits da F10.

## Divergências para o aceite da pessoa

1. **Critério 11:** o log não traz valor algum, nem mascarado. É mais restritivo que o card, que pede CPF, telefone e email mascarados.
2. **Tarefa 4:** o card manda checar CPF e email em outro cliente antes de gravar. A implementação não faz consulta prévia: traduz a violação do índice único para 409 (ADR-026), e isso também cobre a corrida.
3. **Formatação:** o google-java-format (spotless) usa 2 espaços de indentação, e o guia pede 4. Vale o padrão do repositório.
4. **Lint:** na entrega anterior, não foi rodado isolado. Agora foi: checkstyle com 0 violações e spotless verde depois do `3caf42c`, que só formatou o `AparoUnicodeTest`.

## Pendências

* Pessoa: base da PR e o `03e7646` (X1); aceite do email único (P16); aceite dos riscos U5 e U8 (P8); se o email só com NBSP deve virar `null` (parecer do VIGIA: manter, como o email só com espaço ASCII, 8.8); contagem da V8 em base com dados; dúvida 1 do card ("cliente ativo" na retenção).
* F35: reenviar todos os campos no PUT, porque o PUT substitui tudo e um campo omitido vira `null`. Cobrir o pré-preenchimento pelo detalhe e a acessibilidade do formulário (premissa 5, antigas US-CLI-24 e US-CLI-26).
* Limpeza fora desta PR: fixtures de teste com DDD 11 (8.8, X5).
