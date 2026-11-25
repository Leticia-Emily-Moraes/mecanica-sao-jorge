# F35 — Recebido da F04: contrato de Veículos e chaves i18n

- Autor: ESPRESSO (Dev Java) · Data: 2026-11-18 · Tarefas 9 e 10 do card F04
- Estado: **registro para a F35. O card da F35 não foi editado e nenhuma tela foi feita na F04.** Conferir os critérios de tela de Veículos contra este contrato é trabalho da F35 (tarefa 10 fica como registro, não como conferência feita).
- Fonte: código em `apps/api` e `VeiculoIT`. Placas dos exemplos são fictícias.

## Rotas (todas exigem JWT; resposta com `Cache-Control: no-store`)

| Rota | Sucesso | Erros |
|---|---|---|
| `POST /api/v1/clientes/{clienteId}/veiculos` | 201 + `Location: /api/v1/veiculos/{id}` + `VeiculoResponse` | 400, 401, 404 (cliente), 409 (placa) |
| `GET /api/v1/clientes/{id}/veiculos` | 200, lista ordenada por placa, sem paginação (`[]` se vazia) | 401, 404 (cliente) |
| `GET /api/v1/veiculos/{id}` | 200 `VeiculoDetalheResponse` | 401, 404 (veículo) |
| `PUT /api/v1/veiculos/{id}` | 200 `VeiculoResponse` | 400, 401, 404 (veículo), 409 (placa) |

## Corpos

- Requisição (`POST` e `PUT`): `placa`, `marca`, `modelo`, `ano`, `cor` (opcional). Qualquer outro campo (`id`, `clienteId`, `cliente`, `quilometragem`) é ignorado: o dono e a quilometragem nunca mudam por essas rotas.
- `VeiculoResponse`: `id, clienteId, placa, marca, modelo, ano, cor`.
- Item da lista: `id, placa, marca, modelo`.
- Detalhe: `id, clienteId, clienteNome, placa, marca, modelo, ano, cor, historicoOs`. `historicoOs` é sempre `[]` até a feature de OS (item `{id, status, valorTotal}`, ADR-025).
- Placa: a API normaliza (maiúscula, sem espaço e sem hífen). O app pode enviar `abc-1d23`; recebe `ABC1D23`. Formato válido: `AAA9999` ou `AAA9A99`.
- Ano: de 1900 até o ano corrente + 1.

## Erros

Formato: `timestamp, status, erro, mensagem, path, erros[]`. `erros[]` está sempre presente, com um item `{campo, chave}` por campo inválido, ordenado por campo. O valor enviado nunca volta no corpo. Em 409 a placa também não aparece: o texto é `Placa ja cadastrada` e o item é `{campo: "placa", chave: "veiculo.form.placa.duplicada"}`. A tela deve resolver a mensagem pela `chave`, não por `mensagem`.

## Chaves i18n (`VeiculoChaves`)

| Chave | Campo | Quando |
|---|---|---|
| `veiculo.form.placa.obrigatoria` | placa | ausente ou em branco |
| `veiculo.form.placa.erro` | placa | formato inválido |
| `veiculo.form.placa.duplicada` | placa | 409 |
| `veiculo.form.marca.obrigatoria` | marca | ausente ou em branco |
| `veiculo.form.marca.tamanho` | marca | mais de 100 caracteres |
| `veiculo.form.modelo.obrigatorio` | modelo | ausente ou em branco |
| `veiculo.form.modelo.tamanho` | modelo | acima do limite |
| `veiculo.form.ano.obrigatorio` | ano | ausente |
| `veiculo.form.ano.faixa` | ano | fora de 1900..ano+1 |
| `veiculo.form.cor.tamanho` | cor | mais de 40 caracteres |

O contrato OpenAPI sai em `/v3/api-docs` (springdoc) e é conferido por `VeiculoIT.shouldDocumentFourRoutesWithI18nErrorsInOpenApi`. Os textos em português de cada chave são da F35; a API só devolve a chave.

## Para a F35 conferir

- Lista de veículos dentro do detalhe do cliente: usa `GET /api/v1/clientes/{id}/veiculos` (o detalhe do cliente não traz veículos, D-E do PRD).
- Mensagem de placa duplicada sem mostrar a placa de outro cliente.
- Seção "Histórico de OS" do veículo: vazia nesta entrega.
