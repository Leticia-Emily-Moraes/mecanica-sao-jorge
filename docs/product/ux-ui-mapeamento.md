# Mapeamento de Telas e Fluxos — App Mecânica São Jorge (React Native)

Baseado no modelo de dados e nos módulos definidos em `CLAUDE.md` e `docs/architecture/arquitetura-backend.md`. Cobre o escopo atual do backend (Clientes, Veículos, Ordens de Serviço, Serviços, Peças/Estoque, Financeiro/Parcelas/Pagamentos, Autenticação). Itens do backlog (dashboard com indicadores, fotos antes/depois, assinatura digital, WhatsApp) aparecem só como pontos de extensão, sem tela detalhada — não fazem parte do MVP.

Perfis `ADMIN` e `FUNCIONARIO` não têm diferença de permissão ainda (decisão do `CLAUDE.md`), então não há telas distintas por perfil agora.

---

## 1. Navegação geral

Estrutura sugerida: login fora da navegação principal; depois do login, tab bar com 4 seções.

```
[Login]
   ↓
[Tab: Ordens de Serviço] [Tab: Clientes] [Tab: Catálogo] [Tab: Financeiro]
```

"Catálogo" agrupa Serviços e Peças/Estoque (são cadastros de apoio, não merecem tab própria cada um). Espaço reservado para um 5º tab "Início/Dashboard" quando o backlog de indicadores for implementado — não criar tab vazia agora.

---

## 2. Autenticação

| Tela | Propósito | Dados/ações principais | Entra a partir de |
|---|---|---|---|
| Login | Autenticar via JWT | Campos usuário/senha, botão entrar, mensagem de erro de credencial | Abertura do app (sem sessão ativa) |

Sem tela de "esqueci a senha" no MVP — funcionário só, sem self-service de cadastro de usuário previsto ainda.

---

## 3. Clientes

| Tela | Propósito | Dados/ações principais | Entra a partir de |
|---|---|---|---|
| Lista de Clientes | Buscar/listar clientes cadastrados | Busca por nome/telefone/documento, botão "novo cliente" | Tab Clientes |
| Detalhe do Cliente | Ver dados do cliente e seus veículos | Dados de contato, lista de veículos do cliente, botão "novo veículo", botão "nova OS" (pré-preenchendo cliente), editar/excluir cliente | Lista de Clientes |
| Criar/Editar Cliente | Cadastrar ou alterar dados | Nome, telefone, documento, endereço (campos conforme `docs/architecture/schema-referencia.sql`) | Lista de Clientes ou Detalhe do Cliente |

---

## 4. Veículos

Não tem tab própria — vive dentro do fluxo de Cliente, pois veículo sem cliente não existe no modelo.

| Tela | Propósito | Dados/ações principais | Entra a partir de |
|---|---|---|---|
| Detalhe do Veículo | Ver dados do veículo e suas OS | Placa, modelo, ano, histórico de OS do veículo | Detalhe do Cliente |
| Criar/Editar Veículo | Cadastrar ou alterar veículo | Placa, marca, modelo, ano, cor | Detalhe do Cliente |

---

## 5. Ordens de Serviço

Módulo central do app — recebe mais atenção de fluxo.

| Tela | Propósito | Dados/ações principais | Entra a partir de |
|---|---|---|---|
| Lista de OS | Visão geral das ordens, principal tela de trabalho do dia a dia | Filtro por status (`ABERTA`, `EM_ANALISE`, `AGUARDANDO_PECA`, `EM_ANDAMENTO`, `FINALIZADA`, `ENTREGUE`, `CANCELADA`), busca por cliente/veículo, badge de status colorido por card | Tab Ordens de Serviço |
| Criar OS | Abrir uma nova ordem | Selecionar cliente → veículo (ou criar na hora), descrição do problema relatado | Lista de OS, ou botão "nova OS" no Detalhe do Cliente |
| Detalhe da OS | Tela mais usada — gerenciar a ordem do início ao fim | Dados do cliente/veículo, status atual com botão de avançar/voltar status (respeitando transições válidas do backend), lista de serviços adicionados (com valor congelado), lista de peças adicionadas (com valor congelado), botão "adicionar serviço", botão "adicionar peça", seção de parcelas/pagamentos, valor total | Lista de OS |
| Selecionar Serviços/Peças | Adicionar itens do catálogo à OS | Lista do catálogo com busca, quantidade (peça), preço sugerido editável no momento da venda | Detalhe da OS |
| Alterar Status da OS | Confirmar mudança de status | Mostra só as transições válidas a partir do status atual (regra vem do backend) | Detalhe da OS |

Pontos de extensão futuros (não construir agora, só não desenhar fluxo que os impeça): botão de "gerar link WhatsApp" e "anexar foto" no Detalhe da OS; botão de "gerar PDF" quando a OS for finalizada.

---

## 6. Catálogo (Serviços e Peças)

| Tela | Propósito | Dados/ações principais | Entra a partir de |
|---|---|---|---|
| Lista de Serviços | Ver/gerenciar catálogo de serviços | Busca, preço padrão, botão "novo serviço" | Tab Catálogo |
| Criar/Editar Serviço | Cadastrar serviço do catálogo | Nome, descrição, preço padrão | Lista de Serviços |
| Lista de Peças | Ver/gerenciar catálogo + estoque atual | Busca, quantidade em estoque com alerta visual se baixo, botão "nova peça" | Tab Catálogo |
| Detalhe da Peça | Ver histórico de estoque | Quantidade atual, histórico de `MovimentacoesEstoque` (entrada/saída/ajuste), botão "registrar movimentação" | Lista de Peças |
| Criar/Editar Peça | Cadastrar peça do catálogo | Nome, preço, quantidade inicial | Lista de Peças |
| Registrar Movimentação de Estoque | Entrada/saída/ajuste manual (fora do fluxo de OS) | Tipo de movimentação, quantidade, motivo | Detalhe da Peça |

---

## 7. Financeiro

| Tela | Propósito | Dados/ações principais | Entra a partir de |
|---|---|---|---|
| Parcelas em Aberto | Visão de cobrança — o que falta receber | Lista de parcelas com status calculado (`PENDENTE`/`PARCIAL`/`PAGO`/`ATRASADO`), filtro por status/vencimento, atalho para o cliente/OS | Tab Financeiro |
| Detalhe da Parcela / Registrar Pagamento | Registrar um recebimento real | Valor previsto vs. já pago, botão "registrar pagamento" (valor, forma de pagamento, data) | Parcelas em Aberto, ou Detalhe da OS |
| Lançamentos Financeiros | Ver entradas/saídas, incluindo despesas manuais | Lista cronológica, filtro por período, botão "novo lançamento manual" (para despesas sem OS) | Tab Financeiro |
| Novo Lançamento Manual | Registrar despesa/receita sem OS associada | Descrição, valor, tipo (entrada/saída), data | Lançamentos Financeiros |

Indicadores de faturamento/lucro do backlog (dashboard, gráfico) ficam fora — esta tela é operacional (registrar e listar), não analítica.

---

## 8. Perfil / Configurações

| Tela | Propósito | Dados/ações principais | Entra a partir de |
|---|---|---|---|
| Perfil | Dados do usuário logado e logout | Nome, perfil (ADMIN/FUNCIONARIO, sem ação distinta ainda), botão sair | Ícone de perfil na tab bar ou header |

---

## 9. Resumo de telas por prioridade de implementação

Sugestão de ordem de construção, seguindo a mesma lógica do backend (módulo que desbloqueia os outros primeiro):

1. Login
2. Clientes (lista, detalhe, criar/editar) + Veículos
3. Catálogo (Serviços, Peças) — precisa existir antes da OS poder usar itens
4. Ordens de Serviço (lista, criar, detalhe, alterar status, adicionar serviço/peça)
5. Financeiro (parcelas, registrar pagamento, lançamentos manuais)
6. Perfil

Dashboard, fotos, assinatura/PDF e WhatsApp entram depois, como o `CLAUDE.md` já define no backlog — não bloqueiam o MVP.
