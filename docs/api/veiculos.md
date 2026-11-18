# API de Veículos (F04)

Quatro rotas para cadastrar, editar, detalhar e listar os veículos de um cliente. Todas exigem usuário autenticado; ADMIN e FUNCIONARIO têm o mesmo acesso.

- **Base:** `/api/v1`
- **Contrato gerado:** `GET /v3/api-docs` (OpenAPI) e `/swagger-ui.html`
- **Decisões:** ADR-022 (placa), ADR-023 (`erros[]`), ADR-024 (rotas), ADR-025 (`historicoOs`), em `docs/architecture/adr/`
- **Chaves i18n para o app:** `docs/product/F35-recebido-da-F04-veiculos.md`

> **Como os exemplos foram obtidos.** Em 2026-11-18, subi o `apps/api/target/api.jar` contra um MySQL 8.4 descartável (Docker, já removido), com um usuário e dois clientes fictícios inseridos à mão. Rodei as chamadas com `curl` e colei as respostas sem edição. O que mudei: tirei o token e recortei cabeçalhos irrelevantes. Os `timestamp` mudam a cada chamada. Placas e nomes são fictícios.

## Resumo das rotas

| Método | Rota | Sucesso | Erros possíveis |
|---|---|---|---|
| `POST` | `/clientes/{clienteId}/veiculos` | `201` + `Location` | 400, 401, 404, 409, 415 |
| `GET` | `/clientes/{clienteId}/veiculos` | `200` (lista) | 400, 401, 404 |
| `GET` | `/veiculos/{id}` | `200` | 400, 401, 404 |
| `PUT` | `/veiculos/{id}` | `200` | 400, 401, 404, 409, 415 |

Os códigos da coluna "Erros possíveis" batem com o `/v3/api-docs` da API que subi. Exemplos reais abaixo cobrem 400, 401, 404 e 409. O **415** está declarado no OpenAPI, mas **não o exercitei** nesta captura.

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
| `marca` | sim | até 100 caracteres |
| `modelo` | sim | até 100 caracteres |
| `ano` | sim | de 1900 até o ano corrente + 1 |
| `cor` | não | até 40 caracteres |

Qualquer outro campo é ignorado, inclusive `id`, `clienteId`, `cliente` e `quilometragem`.

## POST /clientes/{clienteId}/veiculos

Cria um veículo vinculado ao cliente do caminho.

### Requisição (placa no padrão antigo)

```bash
curl -i -X POST http://localhost:8080/api/v1/clientes/1/veiculos \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"placa":"ABC1234","marca":"Fiat","modelo":"Uno","ano":2012,"cor":"Prata"}'
```

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

Enviei placa `ABC12D3`, marca com espaço, modelo vazio e ano `1899`. Vem um item em `erros[]` por campo, ordenado por campo:

```json
{
  "timestamp": "2026-11-18T19:59:58.35741-03:00",
  "status": 400,
  "erro": "Bad Request",
  "mensagem": "veiculo.form.marca.obrigatoria; veiculo.form.modelo.obrigatorio; veiculo.form.placa.erro; veiculo.form.ano.faixa",
  "path": "/api/v1/clientes/1/veiculos",
  "erros": [
    {"campo": "ano", "chave": "veiculo.form.ano.faixa"},
    {"campo": "marca", "chave": "veiculo.form.marca.obrigatoria"},
    {"campo": "modelo", "chave": "veiculo.form.modelo.obrigatorio"},
    {"campo": "placa", "chave": "veiculo.form.placa.erro"}
  ]
}
```

Corpo que não é JSON válido (`{"placa":`) responde 400 com `"mensagem": "Corpo da requisicao invalido"` e `"erros": []`.

### Erro `409`: placa já cadastrada

Enviei `abc1d23` para o cliente 2, mas `ABC1D23` já existe no cliente 1. A resposta não traz a placa nem o dono do outro veículo:

```json
{
  "timestamp": "2026-11-18T19:59:58.37338-03:00",
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
  "timestamp": "2026-11-18T19:59:58.385232-03:00",
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
  "timestamp": "2026-11-18T19:59:58.397148-03:00",
  "status": 401,
  "erro": "Unauthorized",
  "mensagem": "Nao autenticado",
  "path": "/api/v1/clientes/1/veiculos",
  "erros": []
}
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

### Mesma placa e sem `cor`

Repetir a própria placa não gera conflito. Como `cor` foi omitida, voltou `null`:

```json
{"id":1,"clienteId":1,"placa":"ABC1D24","marca":"Fiat","modelo":"Uno","ano":2012,"cor":null}
```

### Erro `409`: placa de outro veículo

Troquei a placa do veículo 1 por `ABC1D23`, que é do veículo 2. O veículo 1 manteve a placa anterior:

```json
{
  "timestamp": "2026-11-18T19:59:58.532552-03:00",
  "status": 409,
  "erro": "Conflict",
  "mensagem": "Placa ja cadastrada",
  "path": "/api/v1/veiculos/1",
  "erros": [{"campo": "placa", "chave": "veiculo.form.placa.duplicada"}]
}
```

### Outros erros

- `400` com `erros[]`: mesmo formato do POST.
- `404` com `"mensagem": "Veiculo nao encontrado"` quando o id não existe (testei `999`).

## Formato de erro

Todo erro da API traz `timestamp`, `status`, `erro`, `mensagem`, `path` e `erros[]`. Desde a F04, `erros[]` está **sempre** presente (`[]` quando não há erro por campo), inclusive em erros de outros módulos, como o 401 do login. `mensagem` continua existindo.

- O app deve resolver o texto pela `chave` de cada item, não por `mensagem`.
- As mensagens de erro de cliente (F03a a F03c) ainda não são chaves: nelas `chave` pode vir nula até a F10 (ADR-023).

Chaves de veículo (texto em português é da F35; a API devolve só a chave):

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
| `veiculo.form.cor.tamanho` | cor | mais de 40 caracteres |

## Dado pessoal e log (LGPD)

- A placa pode identificar o titular de forma indireta. Base legal: execução de contrato (LGPD art. 7º, V). Retenção: a do cliente dono, pendente da validação jurídica registrada em `docs/security/`.
- O log mostra só os 3 últimos caracteres: `****D23` (Mercosul) e `****234` (padrão antigo). Conferi na saída real da API acima: **nenhuma linha de log contém `ABC1`**, e as linhas de criar, editar, detalhar e 409 trazem a placa mascarada.
- Quando o cliente é descartado, a placa dos veículos dele vira `ANON<id>` (política do VIGIA). Isso é regra do descarte, e **o descarte não está implementado nesta feature**.
- O 409 confirma a qualquer usuário autenticado que a placa existe na base (risco aceito pela política; veja a pendência P13 do VIGIA para carro vendido).

## Evidência

Em 2026-11-18, `./apps/api/mvnw -f apps/api/pom.xml verify`: `BUILD SUCCESS`, 217 testes unitários e web, 108 de integração, 0 falhas. `VeiculoIT` (38) usa MySQL 8.4 real via Testcontainers, com V1 a V7 aplicadas pelo Flyway. Inclui o cadastro simultâneo com a mesma placa.

## Não verificado

- Resposta `415` (Content-Type diferente de JSON): consta no OpenAPI, sem chamada real minha.
- Cabeçalho `Cache-Control: no-store`: `VeiculoIT` verifica, mas filtrei cabeçalhos na minha captura e não o conferi à mão.
- Rate limit ou proteção contra enumeração de placa por força bruta: não existe nesta feature.
