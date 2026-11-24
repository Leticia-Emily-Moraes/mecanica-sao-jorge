# Recebido da F06a (OS listar) para a F42 (front de Ordens de Serviço)

Escrito pela BUSSOLA em 2026-11-24. A F06a entrega **só a API**. Estes itens saíram do PRD dela e são da F42. Não li o card da F42 (não está no repositório); a US-OS-FRONT-01 só é citada pela instrução do comandante.

## O que a F42 recebe

- Tela de lista de OS, com os quatro estados: carregando, vazio, erro e preenchido.
- Chips de status e campo de busca com debounce.
- Textos pelo i18n, chaves `os.lista.*`. Datas e valores com `Intl`.
- "Sem previsão" quando `previsaoEntrega` vier `null`.
- Acessibilidade (rótulo, papel, foco, `aria-live` para a mudança de lista) e paridade com o Figma (F28).
- 401 na lista leva ao login como na F30, sem "Tentar novamente".

## O que a F42 pode contar da API (contrato em `docs/product/F06a-os-listar.md`, seção 6)

- Envelope `itens`, `pagina`, `tamanho`, `totalItens`, `totalPaginas` (o mesmo da F35).
- Item: `id`, `status`, `dataAbertura` (data e hora ISO-8601), `previsaoEntrega` (data ISO ou `null`), `valorTotal` (0.00 até a F19), `cliente {id, nome}`, `veiculo {id, placa, modelo}`.
- `status` só tem `ABERTA` e `EM_ANALISE` até a F20. A F42 não deve fixar a lista de chips sem ler o enum vigente.
- Erros no formato `{timestamp, status, erro, mensagem, path}`; a mensagem do 400 não traz o valor digitado.

## Pedido de renumeração

O card da F06a diz que os "critérios US-OS-LST-14 a 19 migram para a F42", mas na F06a o `US-OS-LST-14` é um critério de API (termo de busca fora do log). Recomendo que a F42 use `US-OS-FRONT-NN` para tudo o que receber.

## Dúvida que passa para a F42

Sobre o 401 na lista: levar ao login, sem "Tentar novamente", como na F30. Padrão adotado: igual à F30.
