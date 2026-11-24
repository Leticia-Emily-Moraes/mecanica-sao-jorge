# Prompt — Wireframe e Protótipo de Alta Fidelidade do App Mecânica São Jorge

Prompt pronto para colar em uma nova sessão do Claude (ou reaproveitar nesta mesma). Pensado em duas etapas sequenciais: primeiro wireframe, depois alta fidelidade — não pule para a etapa 2 sem eu validar a etapa 1.

---

## Contexto do projeto

App mobile (React Native) de gestão para a oficina mecânica Mecânica São Jorge: controla clientes, veículos, ordens de serviço, catálogo de serviços/peças (com estoque) e financeiro (parcelas/pagamentos/lançamentos). Uso interno da oficina, sem distinção de permissão entre os perfis `ADMIN` e `FUNCIONARIO` por enquanto. Prioridade é organização de prazos, custos e uso rápido no dia a dia — não é um app consumer, é uma ferramenta de trabalho.

## Estrutura de navegação e telas

Login fora da navegação principal. Depois do login, tab bar com 4 abas: **Ordens de Serviço**, **Clientes**, **Catálogo**, **Financeiro**.

**Autenticação**
- Login: usuário/senha, botão entrar, mensagem de erro de credencial. Sem "esqueci a senha" no MVP.

**Clientes**
- Lista de Clientes: busca por nome/telefone/documento, botão "novo cliente".
- Detalhe do Cliente: dados de contato, lista de veículos do cliente, botões "novo veículo" e "nova OS", editar/excluir.
- Criar/Editar Cliente: nome, telefone, documento, endereço.
- Detalhe do Veículo (dentro do fluxo de cliente, sem tab própria): placa, modelo, ano, histórico de OS do veículo.
- Criar/Editar Veículo: placa, marca, modelo, ano, cor.

**Ordens de Serviço** (módulo central, mais atenção de fluxo)
- Lista de OS: filtro por status (`ABERTA`, `EM_ANALISE`, `AGUARDANDO_PECA`, `EM_ANDAMENTO`, `FINALIZADA`, `ENTREGUE`, `CANCELADA`), busca por cliente/veículo, badge de status colorido por card.
- Criar OS: selecionar cliente → veículo (ou criar na hora), descrição do problema.
- Detalhe da OS (tela mais usada): dados de cliente/veículo, status atual com botão de avançar/voltar (respeitando transições válidas), lista de serviços e peças adicionados com valor congelado, botões "adicionar serviço"/"adicionar peça", seção de parcelas/pagamentos, valor total.
- Selecionar Serviços/Peças: lista do catálogo com busca, quantidade (peça), preço editável na venda.
- Alterar Status da OS: mostra só as transições válidas a partir do status atual.
- Pontos de extensão a não bloquear no layout (não construir agora): "gerar link WhatsApp", "anexar foto", "gerar PDF" no Detalhe da OS.

**Catálogo**
- Lista de Serviços: busca, preço padrão, botão "novo serviço".
- Criar/Editar Serviço: nome, descrição, preço padrão.
- Lista de Peças: busca, quantidade em estoque com alerta visual se baixo, botão "nova peça".
- Detalhe da Peça: quantidade atual, histórico de movimentações de estoque, botão "registrar movimentação".
- Criar/Editar Peça: nome, preço, quantidade inicial.
- Registrar Movimentação de Estoque: tipo (entrada/saída/ajuste), quantidade, motivo.

**Financeiro**
- Parcelas em Aberto: lista com status calculado (`PENDENTE`/`PARCIAL`/`PAGO`/`ATRASADO`), filtro por status/vencimento, atalho para cliente/OS.
- Detalhe da Parcela / Registrar Pagamento: valor previsto vs. já pago, botão "registrar pagamento" (valor, forma, data).
- Lançamentos Financeiros: lista cronológica, filtro por período, botão "novo lançamento manual".
- Novo Lançamento Manual: descrição, valor, tipo (entrada/saída), data.

**Perfil**
- Perfil: nome, perfil (ADMIN/FUNCIONARIO, sem ação distinta ainda), botão sair.

Ordem de prioridade de construção: Login → Clientes/Veículos → Catálogo → Ordens de Serviço → Financeiro → Perfil. Dashboard, fotos, assinatura/PDF e WhatsApp ficam de fora por enquanto (backlog).

## Identidade visual

Estilo industrial/robusto, cores referenciando o nome da oficina (São Jorge: branco e vermelho) combinadas com azul petróleo como base escura — tons dessaturados, nada agressivo.

**Cores de marca**
- `primary` (vermelho São Jorge): `#B5453D` — ações primárias, botão principal, ícone ativo da tab bar.
- `primary-dark`: `#923631` — estado pressed.
- `petro` (azul petróleo): `#1E3A3F` — header, tab bar, base escura.
- `petro-light`: `#33575D` — variante de superfície escura.

**Neutros**
- `background`: `#F7F5F2` (fundo das telas)
- `surface`: `#FFFFFF` (cards, inputs, modais)
- `border`: `#E2DEDA`
- `text-primary`: `#1E3A3F`
- `text-secondary`: `#6E6A66`
- `text-disabled`: `#A8A39D`

**Status de Ordem de Serviço** (badge colorido no card)
`ABERTA` `#8C8780` · `EM_ANALISE` `#33575D` · `AGUARDANDO_PECA` `#BF8B3D` · `EM_ANDAMENTO` `#2C5258` · `FINALIZADA` `#5C8C68` · `ENTREGUE` `#3E6E4A` · `CANCELADA` `#B5453D` (todos com texto branco)

**Status de Parcela**
`PENDENTE` `#8C8780` · `PARCIAL` `#BF8B3D` · `PAGO` `#5C8C68` · `ATRASADO` `#B5453D` (todos com texto branco)

**Tipografia**
- Títulos/headers: **Barlow Condensed** (SemiBold/Bold).
- Corpo, labels, inputs: **Inter** (Regular/Medium).
- Valores monetários: Inter SemiBold, algarismos tabulares.
- Escala: display 28px, heading 20px, body 15px, caption 13px, badge 12px.

**Componentes**
- Botão primário: fundo `primary`, texto branco, cantos 8px.
- Botão secundário: transparente, borda `petro`, texto `petro`.
- Botão destrutivo: mesma cor do primário (não criar um vermelho extra).
- Cards: fundo `surface`, borda `border` 1px, cantos 8px, leve sombra.
- Badges de status: pill, padding 10px/4px, cor da tabela de status.
- Inputs: fundo `surface`, borda `border`, borda `primary` 2px no foco.
- Tab bar: fundo `petro`, ativo em `primary`, inativo em cinza claro `#B7B2AC`.
- Header: fundo `petro`, texto branco.

**Logo/ícone**: escudo branco com listra vermelha, contorno petro, com engrenagem/chave estilizada sobreposta. Ícone do app: só a engrenagem/chave branca sobre fundo petro sólido.

---

## O que eu quero que você produza

### Etapa 1 — Wireframe (fazer primeiro, sozinho, sem a etapa 2)

Gere wireframes de baixa fidelidade de todas as telas listadas acima, mobile (largura ~360px cada), focados só em **estrutura e hierarquia de layout**: posição de header, listas, cards, botões, campos — sem aplicar cor de marca, sem tipografia definida, sem ícone/logo. Use tons de cinza neutro (2–3 tons) e placeholders (retângulos, linhas) no lugar de conteúdo real de texto/imagem. Objetivo: eu validar fluxo e organização de cada tela antes de qualquer decisão visual.

Entregue como um artifact HTML único, com as telas lado a lado ou navegáveis (like protótipo clicável), agrupadas por módulo (Autenticação, Clientes, Ordens de Serviço, Catálogo, Financeiro, Perfil), na mesma ordem de prioridade de construção listada acima.

Pare depois desta etapa e aguarde minha validação antes de seguir.

### Etapa 2 — Protótipo de alta fidelidade (só depois de eu aprovar o wireframe)

Usando os wireframes aprovados como base de estrutura, gere um protótipo navegável de alta fidelidade aplicando toda a identidade visual descrita acima (cores exatas, tipografia, componentes, badges de status, logo). Deve ser clicável: login leva à tab bar, os 4 tabs trocam de conteúdo, itens de lista abrem tela de detalhe, botão voltar funciona. Entregue como artifact HTML único, mobile frame.
