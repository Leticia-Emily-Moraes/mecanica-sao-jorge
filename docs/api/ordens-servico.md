# API de Ordens de Serviço

Referência dos endpoints de ordens de serviço (OS). Hoje existe um só: a listagem (F06a).

Os exemplos abaixo vêm de execução real: a API (`api.jar` gerado do ramo `docs/f06a-cartografo-adrs`) contra um MySQL 8.4 descartável em Docker, com dados fictícios. Os valores de `dataAbertura` foram gravados direto no banco para o exemplo ser estável.

Decisões de projeto: ADR-037 (contrato), ADR-038 (colunas de data) e ADR-039 (data e hora em UTC). Envelope de paginação: ADR-017.

## GET /api/v1/ordens-servico

Lista as OS, da mais recente para a mais antiga, com filtro por status e busca por cliente ou placa.

**Autenticação:** obrigatória. Envie `Authorization: Bearer <token>` (token de `POST /api/v1/auth/login`). Qualquer usuário autenticado acessa; não há distinção entre `ADMIN` e `FUNCIONARIO`.

### Parâmetros (query string, todos opcionais)

| Nome | Tipo | Padrão | Regra |
|---|---|---|---|
| `status` | texto | sem filtro | Nome exato de um valor de `StatusOS`, em maiúsculas (ex.: `ABERTA`). Hoje existem `ABERTA` e `EM_ANALISE`. Minúsculas dão 400. |
| `q` | texto | sem busca | Trecho do nome do cliente ou da placa. Até 100 caracteres. Não diferencia maiúsculas. Na placa, hífen e espaço são ignorados. `%`, `_` e `!` valem como texto comum. |
| `page` | inteiro | `0` | Base 0. Mínimo 0. |
| `size` | inteiro | `20` | De 1 a 100. |

Regras de combinação:

- `status` e `q` juntos valem com **E**.
- A busca é por trecho (contém), não por prefixo.
- `q` em branco equivale a não buscar.
- A ordem é fixa: `dataAbertura` decrescente e, no empate, `id` decrescente. Não há parâmetro de ordenação.
- Página além do fim devolve 200 com `itens` vazio e o total real.

### Resposta 200

| Campo | Tipo | Observação |
|---|---|---|
| `itens[].id` | número | |
| `itens[].status` | texto | Valor de `StatusOS`. |
| `itens[].dataAbertura` | texto | Instante em UTC, formato ISO-8601 com `Z`. |
| `itens[].previsaoEntrega` | texto ou `null` | Data (`AAAA-MM-DD`). O campo sempre aparece; vem `null` sem previsão. |
| `itens[].valorTotal` | número | Lido da coluna `valor_total`. Vem `0.00` enquanto a OS não tem itens (itens entram na F06c). |
| `itens[].cliente` | objeto | Só `id` e `nome`. CPF, telefone, e-mail e endereço não saem. |
| `itens[].veiculo` | objeto | Só `id`, `placa` e `modelo`. |
| `pagina` | número | Página devolvida (base 0). |
| `tamanho` | número | Tamanho pedido. |
| `totalItens` | número | Total que casa com o filtro, em todas as páginas. |
| `totalPaginas` | número | |

Os nomes do envelope seguem o ADR-017 (`itens`, `pagina`, `tamanho`, `totalItens`, `totalPaginas`). No card da F06a eles aparecem como `content`, `page`, `size`, `totalElements` e `totalPages`: é o mesmo conteúdo com outro nome.

### Exemplo 1: listagem padrão

```bash
curl -s "http://localhost:18080/api/v1/ordens-servico" \
  -H "Authorization: Bearer $TOKEN"
```

Resposta `200` (formatada para leitura; o item `id: 2`, do cliente de fixture "João Lima", foi omitido aqui para encurtar. O total real é 3):

```json
{
  "itens": [
    {
      "id": 3,
      "status": "EM_ANALISE",
      "dataAbertura": "2026-11-22T09:15:00Z",
      "previsaoEntrega": null,
      "valorTotal": 0.00,
      "cliente": { "id": 1, "nome": "Maria Souza" },
      "veiculo": { "id": 1, "placa": "ABC1234", "modelo": "Gol" }
    },
    {
      "id": 1,
      "status": "ABERTA",
      "dataAbertura": "2026-11-20T10:00:00Z",
      "previsaoEntrega": "2026-12-01",
      "valorTotal": 0.00,
      "cliente": { "id": 1, "nome": "Maria Souza" },
      "veiculo": { "id": 1, "placa": "ABC1234", "modelo": "Gol" }
    }
  ],
  "pagina": 0,
  "tamanho": 20,
  "totalItens": 3,
  "totalPaginas": 1
}
```

### Exemplo 2: status e cliente combinados

`GET /api/v1/ordens-servico?status=ABERTA&q=souza` → `200`:

```json
{
  "itens": [
    {
      "id": 1,
      "status": "ABERTA",
      "dataAbertura": "2026-11-20T10:00:00Z",
      "previsaoEntrega": "2026-12-01",
      "valorTotal": 0.00,
      "cliente": { "id": 1, "nome": "Maria Souza" },
      "veiculo": { "id": 1, "placa": "ABC1234", "modelo": "Gol" }
    }
  ],
  "pagina": 0,
  "tamanho": 20,
  "totalItens": 1,
  "totalPaginas": 1
}
```

### Exemplo 3: busca por placa com hífen

`GET /api/v1/ordens-servico?q=abc-12` → `200` com as 2 OS do veículo `ABC1234` (ids 3 e 1), `totalItens: 2`.

### Exemplo 4: paginação

`GET /api/v1/ordens-servico?page=1&size=2` → `200`. Com 3 OS, a segunda página traz só a mais antiga:

```json
{
  "itens": [
    {
      "id": 1,
      "status": "ABERTA",
      "dataAbertura": "2026-11-20T10:00:00Z",
      "previsaoEntrega": "2026-12-01",
      "valorTotal": 0.00,
      "cliente": { "id": 1, "nome": "Maria Souza" },
      "veiculo": { "id": 1, "placa": "ABC1234", "modelo": "Gol" }
    }
  ],
  "pagina": 1,
  "tamanho": 2,
  "totalItens": 3,
  "totalPaginas": 2
}
```

### Exemplo 5: sem resultado

`GET /api/v1/ordens-servico?q=zzzz` → `200`, sem erro:

```json
{ "itens": [], "pagina": 0, "tamanho": 20, "totalItens": 0, "totalPaginas": 0 }
```

### Erros

Todos no formato padrão do handler global: `timestamp`, `status`, `erro`, `mensagem`, `path`. A mensagem nunca repete o valor enviado, porque `q` pode ter nome de pessoa.

**400, `status` fora do enum** (`?status=XYZ&q=souza`; note que `q` não aparece na resposta):

```json
{
  "timestamp": "2026-11-24T08:49:02.867165-03:00",
  "status": 400,
  "erro": "Bad Request",
  "mensagem": "Parametro invalido: status",
  "path": "/api/v1/ordens-servico"
}
```

**400, `size` fora de 1 a 100** (`?size=101`): mesma forma, com `"mensagem": "Parametro invalido: size"`.

**400, `page` negativa** (`?page=-1`): mesma forma, com `"mensagem": "Parametro invalido: page"`.

**401, sem token ou token inválido:**

```json
{
  "timestamp": "2026-11-24T08:49:02.903483-03:00",
  "status": 401,
  "erro": "Unauthorized",
  "mensagem": "Nao autenticado",
  "path": "/api/v1/ordens-servico"
}
```

**500:** `{"mensagem": "Erro interno inesperado", ...}`, sem stack trace. Está no código (`GlobalExceptionHandler`) e não foi provocado nesta execução.

### Comportamentos que valem saber

Observados no teste de integração `OrdemServicoListagemIT` (relato do ESPRESSO; não reexecutei esse teste nesta etapa):

- `status=` (vazio) lista todas as OS.
- `status` repetido na URL usa o primeiro valor.
- `status=aberta` (minúsculas) dá 400.

### Dados pessoais e log

- A lista devolve `cliente.nome` e `veiculo.placa`, ambos dado pessoal. Base legal: execução de contrato (LGPD, art. 7º, V). Retenção: a da OS, igual à do cadastro do cliente.
- O termo `q`, o nome e a placa não vão para log. A linha de log é `ordens-servico.listar qLen=… status=… page=… size=… total=… usuarioId=…`. Conferi no log desta execução: a linha traz só o tamanho de `q`.
- A resposta traz `Cache-Control: no-cache, no-store, max-age=0, must-revalidate` (visto na execução; nenhum teste automatizado afirma isso).

### Não verificado

- Desempenho de `like %termo%` com muitas OS: sem teste de carga. O ADR-037 diz quando criar índice.
- A busca por placa depende de a F04 (V7) gravar a placa em maiúsculas e sem hífen. Neste ramo a V7 não existe: a fixture usou placas já nesse formato.
- Os exemplos usam `-03:00` no `timestamp` de erro porque o servidor local roda nesse fuso. Só `dataAbertura` é garantido em UTC.
- Os dados de teste foram inseridos por SQL com cliente de linha de comando. O nome "João Lima" saiu com acento corrompido na resposta (efeito da codificação da carga de teste, não investigado), por isso o exemplo 1 não o mostra.
