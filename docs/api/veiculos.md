# API de Veículos (F04)

Quatro rotas para cadastrar, editar, detalhar e listar os veículos de um cliente. Todas exigem usuário autenticado; ADMIN e FUNCIONARIO têm o mesmo acesso.

- **Base:** `/api/v1`
- **Contrato gerado:** `GET /v3/api-docs` (OpenAPI) e `/swagger-ui.html`
- **Decisões:** ADR-022 (placa), ADR-023 (`erros[]`), ADR-024 (rotas), ADR-025 (`historicoOs`), em `docs/architecture/adr/`
- **Chaves i18n para o app:** `docs/product/F35-recebido-da-F04-veiculos.md`

> **Como os exemplos foram obtidos.** Em 2026-11-19, recompilei o `apps/api/target/api.jar` com o código da branch e o subi contra um MySQL 8.4 descartável (Docker, removido ao fim), com um usuário e dois clientes fictícios inseridos à mão. Rodei as chamadas com `curl` e colei as respostas sem edição de conteúdo. O que mudei: tirei o token, recortei cabeçalhos irrelevantes e formatei o JSON onde indicado. Os `timestamp` mudam a cada chamada. Placas e nomes são fictícios.

## Resumo das rotas

| Método | Rota | Sucesso | Erros possíveis |
|---|---|---|---|
| `POST` | `/clientes/{clienteId}/veiculos` | `201` + `Location` | 400, 401, 404, 409, 415 |
| `GET` | `/clientes/{clienteId}/veiculos` | `200` (lista) | 400, 401, 404 |
| `GET` | `/veiculos/{id}` | `200` | 400, 401, 404 |
| `PUT` | `/veiculos/{id}` | `200` | 400, 401, 404, 409, 415 |

Os códigos da coluna "Erros possíveis" batem com o `/v3/api-docs` da API que subi (conferi rota a rota). Exemplos reais abaixo cobrem 400, 401, 404, 409 e 415.

## Autenticação

Peça o token em `POST /api/v1/auth/login` e envie `Authorization: Bearer <token>`. Sem token, ou com token inválido ou expirado, a resposta é 401.

```bash
curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@oficina.com","senha":"senha-do-usuario"}'
```

Nos exemplos abaixo, `$TOKEN` guarda o valor do campo `token` dessa resposta.

## Regras da placa

- A API normaliza antes de validar: remove espaço e hífen e passa `a`–`z` para maiúscula. `abc-1d23` e ` ABC1D23 ` são gravadas como `ABC1D23`.
- Formatos aceitos: padrão antigo `AAA9999` (ex.: `ABC1234`) e Mercosul `AAA9A99` (ex.: `ABC1D23`).
- Caracteres fora de letra ASCII, dígito, espaço e hífen reprovam a placa (por exemplo `ÍBC1D23`). Entrada com mais de 20 caracteres também reprova.
- A placa é única na base (índice `uk_veiculos_placa`, migration V7). A unicidade vale entre todos os clientes.
- A resposta de erro nunca repete o valor enviado.

## Campos do corpo (POST e PUT)

| Campo | Obrigatório | Regra |
|---|---|---|
| `placa` | sim | formatos acima |
| `marca` | sim | até 100 caracteres; espaço nas pontas é removido (`" Fiat "` grava `Fiat`) |
| `modelo` | sim | até 100 caracteres; espaço nas pontas é removido |
| `ano` | sim | **inteiro JSON** de 1900 até o ano corrente + 1. `2015.9`, `2015.0` e `"2015"` dão 400 |
| `cor` | não | até 40 caracteres; espaço nas pontas é removido; em branco grava vazio |

Qualquer outro campo é ignorado, inclusive `id`, `clienteId`, `cliente` e `quilometragem`.

## POST /clientes/{clienteId}/veiculos

Cria um veículo vinculado ao cliente do caminho.

### Requisição (placa no padrão antigo)

```bash
curl -i -X POST http://localhost:8080/api/v1/clientes/1/veiculos \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"placa":"ABC1234","marca":" Fiat ","modelo":"Uno","ano":2012,"cor":"Prata"}'
```

Repare que `marca` foi enviada como `" Fiat "`. A resposta traz `Fiat`, sem os espaços.

### Resposta `201`

```
HTTP/1.1 201
Location: /api/v1/veiculos/1
Content-Type: application/json

{"id":1,"clienteId":1,"placa":"ABC1234","marca":"Fiat","modelo":"Uno","ano":2012,"cor":"Prata"}
```

### Placa Mercosul digitada com máscara e espaços

Enviei `" abc-1d23 "`. A API gravou e devolveu `ABC1D23`:

```bash
curl -i -X POST http://localhost:8080/api/v1/clientes/1/veiculos \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"placa":" abc-1d23 ","marca":"Chevrolet","modelo":"Onix","ano":2021,"cor":"Branco"}'
```

```json
{"id":2,"clienteId":1,"placa":"ABC1D23","marca":"Chevrolet","modelo":"Onix","ano":2021,"cor":"Branco"}
```

### Erro `400`: vários campos inválidos

Enviei placa `ABC12D3`, marca só com espaço, modelo vazio e ano `1899`. Vem um item em `erros[]` por campo, ordenado por campo. A ordem das chaves em `mensagem` não é estável (mudou entre capturas): leia sempre `erros[]`.

```json
{
  "timestamp": "2026-11-19T08:42:21.924781-03:00",
  "status": 400,
  "erro": "Bad Request",
  "mensagem": "veiculo.form.ano.faixa; veiculo.form.placa.erro; veiculo.form.modelo.obrigatorio; veiculo.form.marca.obrigatoria",
  "path": "/api/v1/clientes/1/veiculos",
  "erros": [
    {"campo": "ano", "chave": "veiculo.form.ano.faixa"},
    {"campo": "marca", "chave": "veiculo.form.marca.obrigatoria"},
    {"campo": "modelo", "chave": "veiculo.form.modelo.obrigatorio"},
    {"campo": "placa", "chave": "veiculo.form.placa.erro"}
  ]
}
```

### Erro `400`: ano que não é inteiro

`"ano": 2015.9` e `"ano": "2015"` respondem o mesmo corpo, no POST e no PUT. Só `ano` aparece em `erros[]`: o parser para no primeiro erro de tipo, então outros campos inválidos só aparecem depois que o ano for corrigido. O valor enviado não volta no corpo.

```json
{
  "timestamp": "2026-11-19T08:42:21.948566-03:00",
  "status": 400,
  "erro": "Bad Request",
  "mensagem": "veiculo.form.ano.tipo",
  "path": "/api/v1/clientes/1/veiculos",
  "erros": [{"campo": "ano", "chave": "veiculo.form.ano.tipo"}]
}
```

Também dão essa resposta `2015.0`, booleano, objeto, array e inteiro grande demais (cobertos por `VeiculoIT`; à mão testei `2015.9` e `"2015"`).

### Erro `400`: JSON inválido ou tipo errado em outro campo

Corpo que não é JSON válido (`{"placa":`) responde 400 com `"mensagem": "Corpo da requisicao invalido"` e `"erros": []`. O mesmo vale para tipo errado em qualquer campo que não seja `ano` (testei `placa` como array): sem chave, porque a chave de tipo existe só para `ano`.

### Erro `409`: placa já cadastrada

Enviei `abc1d23` para o cliente 2, mas `ABC1D23` já existe no cliente 1. A resposta não traz a placa nem o dono do outro veículo:

```json
{
  "timestamp": "2026-11-19T08:42:22.015483-03:00",
  "status": 409,
  "erro": "Conflict",
  "mensagem": "Placa ja cadastrada",
  "path": "/api/v1/clientes/2/veiculos",
  "erros": [{"campo": "placa", "chave": "veiculo.form.placa.duplicada"}]
}
```

Dois cadastros simultâneos com a mesma placa: um recebe 201 e o outro 409, porque quem decide é o índice único do banco. Isso é coberto por `VeiculoIT` (ver seção "Evidência").

### Erro `404`: cliente inexistente

```json
{
  "timestamp": "2026-11-19T08:42:22.02819-03:00",
  "status": 404,
  "erro": "Not Found",
  "mensagem": "Cliente nao encontrado",
  "path": "/api/v1/clientes/999/veiculos",
  "erros": []
}
```

### Erro `401`: sem token

```json
{
  "timestamp": "2026-11-19T08:42:22.037536-03:00",
  "status": 401,
  "erro": "Unauthorized",
  "mensagem": "Nao autenticado",
  "path": "/api/v1/clientes/1/veiculos",
  "erros": []
}
```

### Erro `415`: Content-Type que não é JSON

Enviei `Content-Type: text/plain`:

```json
{"timestamp":"2026-11-19T08:42:22.047508-03:00","status":415,"erro":"Unsupported Media Type","mensagem":"Tipo de conteudo nao suportado","path":"/api/v1/clientes/1/veiculos","erros":[]}
```

## GET /clientes/{clienteId}/veiculos

Lista os veículos do cliente, ordenada por placa, sem paginação. Cliente sem veículos devolve `200` com `[]`.

```bash
curl -s http://localhost:8080/api/v1/clientes/1/veiculos -H "Authorization: Bearer $TOKEN"
```

```json
[
  {"id": 1, "placa": "ABC1234", "marca": "Fiat", "modelo": "Uno"},
  {"id": 2, "placa": "ABC1D23", "marca": "Chevrolet", "modelo": "Onix"}
]
```

(A API devolve o JSON numa linha só; formatei para leitura.)

Cliente sem veículos (cliente 2): `200` com `[]`. Cliente inexistente: `404` com `"mensagem": "Cliente nao encontrado"`.

## GET /veiculos/{id}

Detalhe com dados cadastrais, dono e histórico de OS.

```bash
curl -s http://localhost:8080/api/v1/veiculos/1 -H "Authorization: Bearer $TOKEN"
```

```json
{
  "id": 1,
  "clienteId": 1,
  "clienteNome": "Ana Exemplo",
  "placa": "ABC1234",
  "marca": "Fiat",
  "modelo": "Uno",
  "ano": 2012,
  "cor": "Prata",
  "historicoOs": []
}
```

- `historicoOs` está sempre presente e vazio até existir a feature de Ordens de Serviço. Nunca vem `null` nem ausente.
- `cor` vem `null` quando não foi informada.
- Veículo inexistente: `404` com `"mensagem": "Veiculo nao encontrado"`.
- `id` zero, negativo ou não numérico: `400` com `"mensagem": "Parametro invalido: id"` e `"erros": []` (testei `id` = `0`).

## PUT /veiculos/{id}

Substitui placa, marca, modelo, ano e cor. É uma edição total: campo opcional omitido volta a `null`. Não existe `PATCH`.

### Requisição que também tenta trocar o dono

Enviei `"clienteId": 2` no corpo. A API ignorou e manteve `clienteId` 1:

```bash
curl -s -X PUT http://localhost:8080/api/v1/veiculos/1 \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"placa":"ABC1D24","marca":"Fiat","modelo":"Uno Mille","ano":2012,"cor":"Cinza","clienteId":2}'
```

```json
{"id":1,"clienteId":1,"placa":"ABC1D24","marca":"Fiat","modelo":"Uno Mille","ano":2012,"cor":"Cinza"}
```

### Sem `cor`, com a própria placa

O veículo tinha cor `Cinza`. Reenviei sem `cor`. Repetir a própria placa não gera conflito. A cor voltou `null`, e conferi no banco que a coluna ficou `NULL` (não texto vazio). `cor` em branco tem o mesmo efeito (coberto por `VeiculoIT`; não repeti à mão):

```json
{"id":1,"clienteId":1,"placa":"ABC1D24","marca":"Fiat","modelo":"Uno","ano":2012,"cor":null}
```

### Erro `409`: placa de outro veículo

Troquei a placa do veículo 1 por `ABC1D23`, que é do veículo 2. O veículo 1 manteve a placa anterior:

```json
{
  "timestamp": "2026-11-19T08:42:22.208924-03:00",
  "status": 409,
  "erro": "Conflict",
  "mensagem": "Placa ja cadastrada",
  "path": "/api/v1/veiculos/1",
  "erros": [{"campo": "placa", "chave": "veiculo.form.placa.duplicada"}]
}
```

### Outros erros

- `400` com `erros[]`: mesmo formato do POST, inclusive `veiculo.form.ano.tipo` para `"ano":2015.9` (testei no PUT; o registro não muda).
- `404` com `"mensagem": "Veiculo nao encontrado"` quando o id não existe (testei `999`).

## Formato de erro

Todo erro da API traz `timestamp`, `status`, `erro`, `mensagem`, `path` e `erros[]`. Desde a F04, `erros[]` está **sempre** presente (`[]` quando não há erro por campo), inclusive em erros de outros módulos, como o 401 do login. `mensagem` continua existindo.

- **Quando existe chave (N4):** só no 400 de validação de campo de veículo (`veiculo.form.*`) e no 409 de placa. Erros de rota (400 de parâmetro, 404, 405, 415, JSON malformado) seguem com texto fixo em `mensagem` e `erros: []`. Eles **viram chave se a F35 pedir**, o que exige ADR novo.
- O app deve resolver o texto pela `chave` de cada item, não por `mensagem`.
- As mensagens de erro de cliente (F03a a F03c) ainda não são chaves: nelas `chave` pode vir nula até a F10 (ADR-023).

São 11 chaves de veículo (texto em português é da F35; a API devolve só a chave):

| Chave | Campo | Quando |
|---|---|---|
| `veiculo.form.placa.obrigatoria` | placa | ausente ou em branco |
| `veiculo.form.placa.erro` | placa | formato inválido |
| `veiculo.form.placa.duplicada` | placa | 409 |
| `veiculo.form.marca.obrigatoria` | marca | ausente ou em branco |
| `veiculo.form.marca.tamanho` | marca | mais de 100 caracteres |
| `veiculo.form.modelo.obrigatorio` | modelo | ausente ou em branco |
| `veiculo.form.modelo.tamanho` | modelo | mais de 100 caracteres |
| `veiculo.form.ano.obrigatorio` | ano | ausente |
| `veiculo.form.ano.faixa` | ano | fora de 1900..ano+1 |
| `veiculo.form.ano.tipo` | ano | não é inteiro JSON (`2015.9`, `"2015"`, booleano, objeto, array, número grande demais) |
| `veiculo.form.cor.tamanho` | cor | mais de 40 caracteres |

## Dado pessoal e log (LGPD)

- A placa pode identificar o titular de forma indireta. Base legal: execução de contrato (LGPD art. 7º, V). Retenção: a do cliente dono, pendente da validação jurídica registrada em `docs/security/`.
- O log mostra só os 3 últimos caracteres: `****D23` (Mercosul) e `****234` (padrão antigo). Conferi na saída real da API acima: **nenhuma linha de log contém `ABC1`**, e as linhas de criar, editar, detalhar e 409 trazem a placa mascarada.
- Quando o cliente é descartado, a placa dos veículos dele vira `ANON<id>` (política do VIGIA). Isso é regra do descarte, e **o descarte não está implementado nesta feature**.
- O 409 confirma a qualquer usuário autenticado que a placa existe na base (risco aceito pela política; veja a pendência P13 do VIGIA para carro vendido).

## Evidência

Em 2026-11-19, `./apps/api/mvnw -f apps/api/pom.xml verify` (inclui Checkstyle e Spotless): `BUILD SUCCESS`, 242 testes unitários e web e 140 de integração, 0 falhas. `VeiculoIT` (49 casos) usa MySQL 8.4 real via Testcontainers, com as migrations aplicadas pelo Flyway. Inclui o cadastro simultâneo com a mesma placa, o ano não inteiro em POST e PUT, o aparo de `marca`, `modelo` e `cor` e o PUT sem `cor` gravando `NULL`.

## Não verificado

- ADR-022 a 025 e 028 continuam "Proposto": o contrato aqui descrito segue o código, mas o aceite formal é da pessoa dona do produto.
- A V7 não foi testada contra dados reais: se a base tiver placa repetida ou fora do formato, a migration falha ao subir.
- Tipo errado em `marca`, `modelo` e `cor` (ex.: `"marca": 123`) não gera 400: continua gravando como texto. Não é regressão, mas o app não deve depender disso.
- Cabeçalho `Cache-Control: no-store`: `VeiculoIT` verifica, mas filtrei cabeçalhos na minha captura e não o conferi à mão.
- Rate limit ou proteção contra enumeração de placa por força bruta: não existe nesta feature.
