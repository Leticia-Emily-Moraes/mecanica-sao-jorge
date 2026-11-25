# Recebido da F28 (protótipo de OS) para a F29 (protótipo de Financeiro)

Escrito pela BUSSOLA em 2026-11-24. **Proposta aguardando confirmação da Letícia** (PRD da F28, seção 3.5). Não li o card nem o PRD da F29 (não estão no repositório).

## O que a F29 recebe

A F29 é **dona do componente mestre do formulário de pagamento** (wireframe 23 da F24, "Financeiro · pagamento"). A F28 só o usa como instância.

1. **Mestre único** no Figma, com campos, estados e mensagens. A F28 não cria cópia, "detach" nem variante.
2. **Estados do formulário:** vazio, preenchido (valor pré-preenchido com o previsto, como no wireframe 23), salvando, erro de campo e erro de envio, cada um com mensagem em texto, foco no primeiro campo inválido e aria-live.
3. **Duas origens, mesmo componente:** tela de parcelas do Financeiro (wireframe 22) e seção de parcelas do detalhe da OS (F28). A origem muda só o retorno: volta à tela de onde veio.
4. **Dados da parcela em somente leitura:** número/total, valor previsto, vencimento. É a única parte que a F28 sobrescreve.
5. **Mensagens de referência do wireframe:** "Informe um valor válido" e "Selecione a forma de pagamento". A F29 as fixa; a F28 mostra as mesmas.
6. **Formas de pagamento:** DINHEIRO, PIX, CARTAO, BOLETO (V2, `ck_pagamento_forma`), rótulos "Dinheiro", "PIX", "Cartão", "Boleto". Mudar exige migration.
7. **Chaves de i18n** no formato `area.componente.texto` (sugestão de área: `financeiro.pagamento.*`).

## Dúvidas que passam para a F29

- **D5, valor maior que o saldo:** padrão adotado, **bloqueia** com mensagem em texto no campo valor. Decisão final da Letícia e da F22.
- **D9, data do pagamento:** o `ux-ui-mapeamento.md` lista "data"; `pagamentos` não tem coluna e o wireframe 23 não tem o campo. Padrão: sem campo.
- **Ordem:** a F28 passa a depender da F29 (só do componente). A F29 não depende da F28.

## O que a F29 não precisa fazer

Seção de parcelas dentro do detalhe da OS, botão por parcela e retorno ao detalhe: são da F28.

## Se a Letícia escolher o contrário

A F28 vira dona do mestre, a F29 vira consumidora e a dependência se inverte. Este arquivo deixa de valer e a F29 recebe o mestre da F28 (PRD da F28, seção 3.4).
