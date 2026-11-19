# API de Clientes: edição (F10, F03d)

Este documento cobre `PUT /api/v1/clientes/{id}` e as duas mudanças que a edição trouxe para o `POST /api/v1/clientes`. Lista, detalhe e criação seguem descritos no OpenAPI (`GET /v3/api-docs`, `/swagger-ui.html`).

Exige usuário autenticado. ADMIN e FUNCIONARIO têm o mesmo acesso.

- **Decisões:** ADR-019 (404), ADR-020 (CPF), ADR-021 (DTO), ADR-026 (email), ADR-027 (deadlock), em `docs/architecture/adr/`.
- **Política de dado pessoal:** `docs/security/politica-dados-pessoais-cliente.md`, revisão 6.
- **Contrato de arquitetura:** `docs/architecture/overview.md`, seção "Contrato de API — Clientes editar (F03d)".

> **Como os exemplos foram obtidos.** Em 2026-11-18 reconstruí o `apps/api/target/api.jar` a partir desta branch (`./mvnw -DskipTests package`) e o subi contra um MySQL 8.4 descartável (Docker, já removido). Inseri à mão um usuário e dois clientes fictícios (`Ana Antiga`, id 1; `Beto Exemplo`, id 2). Rodei as chamadas com `curl` e colei as respostas. Mudei só o seguinte: tirei o token, cortei cabeçalhos irrelevantes e a coluna `timestamp` muda a cada chamada. Todo dado é fictício.
>
> **O que mudou depois dessas chamadas.** O commit `0c78365` passou a aparar também espaços Unicode nas pontas do email (ver "Regras"). Os exemplos abaixo vieram de uma execução anterior a ele e continuam valendo: usam só espaço comum, e a mudança não altera status nem formato de resposta. Em 2026-11-19 tentei repetir as chamadas com `curl` e não consegui, porque o ambiente bloqueou subir a API em segundo plano. O aparo Unicode está verificado só por teste (ver "Pontos em aberto"), não por `curl`.

## Resumo

| Método | Rota | Sucesso | Erros |
|---|---|---|---|
| `PUT` | `/api/v1/clientes/{id}` | `200` com o detalhe do cliente | 400, 401, 404, 409, 415, 500 |

Os códigos batem com o `/v3/api-docs` que a API gerou (`200, 400, 401, 404, 409, 415, 500`). O 500 só está declarado: não o provoquei.

## Autenticação

Peça o token em `POST /api/v1/auth/login` e envie `Authorization: Bearer <token>`. Nos exemplos, `$TOKEN` guarda o valor do campo `token`.

## Regras

- **Substituição inteira.** O corpo troca todos os campos editáveis. Campo opcional (`email`, `endereco`) omitido ou em branco grava `null`. Não existe `PATCH`.
- **O `id` vem só do caminho.** `id`, `createdAt` ou qualquer campo desconhecido no corpo é ignorado.
- **Mesmas validações do `POST`.** O corpo é o mesmo `ClienteRequest`.
- **CPF** vale com ou sem máscara e é gravado só com dígitos. **Telefone** idem.
- **Email** perde os espaços das pontas e as letras `A` a `Z` viram minúsculas. Outras letras (acentos, por exemplo) não mudam. "Espaço" inclui o espaço sem quebra (NBSP, U+00A0), U+2007 e U+202F. **Caractere de largura zero (U+200B) não é aparado**, mas o índice único do MySQL o ignora na comparação: `"beto@example.com​"` colide com `beto@example.com` e responde `409`.
- **CPF e email são únicos entre clientes.** A comparação ignora o próprio cliente: reenviar o seu CPF ou email, com outra pontuação ou caixa, não gera conflito.
- **Última gravação vence.** Não há controle de concorrência otimista: duas edições do mesmo cliente não se avisam.
- **Nada do valor antigo é guardado** (log, coluna ou histórico).

### Campos do corpo

| Campo | Obrigatório | Regra |
|---|---|---|
| `nome` | sim | até 120 caracteres |
| `cpf` | sim | 11 dígitos, separadores aceitos: ponto, hífen, espaço |
| `telefone` | sim | 10 ou 11 dígitos, separadores aceitos: parênteses, ponto, hífen, espaço |
| `email` | não | até 120 caracteres, formato de email |
| `endereco` | não | até 255 caracteres |

## Sucesso: `200`

Requisição, com CPF pontuado, email com espaço e maiúsculas e um `id` no corpo (ignorado):

```bash
curl -i -X PUT http://localhost:8080/api/v1/clientes/1 \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"nome":"Ana Nova","cpf":"111.111.111-11","telefone":"(11) 3456-7890","email":"  Ana.Nova@Example.com ","endereco":"Rua Nova, 2","id":999}'
```

Resposta:

```
HTTP/1.1 200
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Content-Type: application/json

{"id":1,"nome":"Ana Nova","cpf":"11111111111","telefone":"1134567890","email":"ana.nova@example.com","endereco":"Rua Nova, 2"}
```

Repare: `id` continua 1, CPF e telefone voltam só com dígitos e o email voltou normalizado. `GET /api/v1/clientes/1` devolveu o mesmo corpo logo depois.

## Erros

Todos seguem o formato do handler global: `timestamp`, `status`, `erro`, `mensagem`, `path`, `erros[]`. Nenhuma mensagem repete o valor enviado.

### `400` campo inválido

Enviei CPF com letra e email sem arroba:

```bash
curl -i -X PUT http://localhost:8080/api/v1/clientes/1 -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana Nova","cpf":"1234567890A","telefone":"(11) 3456-7890","email":"sem-arroba"}'
```

```json
{"timestamp":"2026-11-18T20:39:17.566993-03:00","status":400,"erro":"Bad Request","mensagem":"cpf deve ter 11 digitos; email invalido","path":"/api/v1/clientes/1","erros":[{"campo":"cpf","chave":null},{"campo":"email","chave":null}]}
```

`erros[].chave` vem `null` nos erros de cliente. A F10 não criou chave de mensagem para o app (mudaria o 400 do `POST`). O app lê `campo`.

Campo obrigatório em branco (`"nome":"  "`) responde `"mensagem":"nome e obrigatorio"` com `erros:[{"campo":"nome","chave":null}]`. Nada é alterado.

`id` não positivo (`/clientes/0`) também é 400:

```json
{"timestamp":"2026-11-18T20:39:17.715978-03:00","status":400,"erro":"Bad Request","mensagem":"Parametro invalido: id","path":"/api/v1/clientes/0","erros":[]}
```

### `401` sem token

```json
{"timestamp":"2026-11-18T20:39:17.688251-03:00","status":401,"erro":"Unauthorized","mensagem":"Nao autenticado","path":"/api/v1/clientes/1","erros":[]}
```

### `404` cliente inexistente

```bash
curl -i -X PUT http://localhost:8080/api/v1/clientes/987654 -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana Nova","cpf":"11111111111","telefone":"11912345678"}'
```

```json
{"timestamp":"2026-11-18T20:39:17.591961-03:00","status":404,"erro":"Not Found","mensagem":"Cliente nao encontrado","path":"/api/v1/clientes/987654","erros":[]}
```

### `409` CPF de outro cliente

Editei o cliente 1 enviando o CPF do cliente 2 (`222.222.222-22`):

```json
{"timestamp":"2026-11-18T20:39:17.648647-03:00","status":409,"erro":"Conflict","mensagem":"CPF ja cadastrado","path":"/api/v1/clientes/1","erros":[]}
```

### `409` email de outro cliente

Enviei `" BETO@example.com "` (caixa e espaços diferentes do gravado para o cliente 2):

```json
{"timestamp":"2026-11-18T20:39:17.668733-03:00","status":409,"erro":"Conflict","mensagem":"Email ja cadastrado","path":"/api/v1/clientes/1","erros":[]}
```

Nos dois 409, o cliente 1 ficou como estava. A resposta não traz o valor nem o id do outro cliente. O app distingue CPF de email pela `mensagem`; `erros[]` fica vazio.

### `409` gravação simultânea

Se o MySQL derrubar uma das gravações por deadlock ou espera de lock, a resposta é 409 com `"mensagem":"Conflito de gravacao simultanea, tente novamente"` (ADR-027). **Não capturei essa resposta numa chamada real.** Ela está coberta por teste unitário com `CannotAcquireLockException` simulada; nos testes de corrida (dois e seis PUTs simultâneos) o MySQL não chegou a produzir deadlock. Quem recebe esse 409 reenvia o pedido: a API não repete sozinha.

### `415` tipo de conteúdo

```json
{"timestamp":"2026-11-18T20:39:17.70209-03:00","status":415,"erro":"Unsupported Media Type","mensagem":"Tipo de conteudo nao suportado","path":"/api/v1/clientes/1","erros":[]}
```

## Mudanças no `POST /api/v1/clientes`

A edição mudou a criação em dois pontos. Ambos foram vistos na mesma execução:

1. **Email de outro cliente: 409.** Antes era 201.

   ```json
   {"timestamp":"2026-11-18T20:39:17.731822-03:00","status":409,"erro":"Conflict","mensagem":"Email ja cadastrado","path":"/api/v1/clientes","erros":[]}
   ```

2. **Email volta normalizado.** `"Carla@EXAMPLE.com"` virou `"carla@example.com"` no 201.

   ```json
   {"id":4,"nome":"Carla","cpf":"33333333333","telefone":"11912345678","email":"carla@example.com","endereco":null}
   ```

Também vale para o `POST`: espaços nas pontas do email (inclusive NBSP) são aparados antes da validação de formato.

## Log

A edição escreve só estas linhas, sem nenhum dado pessoal (nem mascarado), copiadas do log da execução acima:

```
clientes.editar clienteId=1 usuarioId=1
clientes.editar.naoEncontrado clienteId=987654 usuarioId=1
clientes.editar.conflito clienteId=1 usuarioId=1 campo=cpf
clientes.editar.conflito clienteId=1 usuarioId=1 campo=email
```

O card pedia CPF, telefone e email mascarados no log. Vale a política do VIGIA, mais restritiva: valor nenhum.

## OpenAPI gerado × este texto

Conferi o `/v3/api-docs` da execução:

| Item | Resultado |
|---|---|
| Códigos do `PUT` | `200, 400, 401, 404, 409, 415, 500`: bate |
| Parâmetro | `id` no caminho: bate |
| Corpo | `application/json`, `ClienteRequest`: bate |
| Campos obrigatórios do `ClienteRequest` | `cpf`, `nome`, `telefone`: bate |
| **Divergência** | A `description` do `POST` ainda diz só "CPF repetido responde 409". O 409 de email já está na descrição da resposta 409, mas não no texto geral. É texto de código (`ClienteController.criar`), que não alterei. |
| **Divergência** | O 409 do `PUT` documenta um exemplo só (email). O 409 de CPF e o de gravação simultânea estão só na descrição. |

## Pontos em aberto

- **P16 (pessoa):** aceite do email único no `POST` e no `PUT`. Sem ele, o 409 de email e a normalização caem.
- **Base com dados:** a V8 falha se já houver email repetido (ver o `CHANGELOG.md`). Não testei contra base com dados.
- **Verificado só por teste (2026-11-19):** `AparoUnicodeTest` (7 testes) e `ClienteAtualizarIT` (25) e `ClienteCriarIT` (30), com MySQL 8.4 em Testcontainers: 0 falhas. Cobrem NBSP nas pontas do email no `PUT` e no `POST`. Não há chamada `curl` com NBSP.
- **U+200B (largura zero):** não é aparado, mas agora tem teste de caracterização no `ClienteAtualizarIT`: no fim de um email que já é de outro cliente, o `PUT` responde `409`, porque o índice do MySQL o ignora.
- **Não verificado:** comportamento do `@Email` com caracteres fora do ASCII e o 500 do `PUT`.
