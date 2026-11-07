# F24 — Wireframe de baixa fidelidade (especificação)

- Prioridade: P1 / Área: Frontend / Sprint 01
- Autora: ESQUADRO (Design system e acessibilidade)
- Data: 2026-11-07
- Etapa da rota: BUSSOLA → CARTOGRAFO → **ESQUADRO (3/4)** → CRIVO
- Revisão 2026-11-07: incorporados os 6 gaps de navegação apontados por
  CARTOGRAFO em `docs/architecture/diagrams/navegacao-wireframe-f24.md`
  (seção 5 daquele mapa) — ver seção 4.6 e a linha "Navegação" em cada tela
  da seção 6.

## 1. Bloqueio de acesso ao Figma — RESOLVIDO em 2026-11-07

**Atualização 2026-11-07**: o bloqueio abaixo acabou. O MCP oficial
`figma-remote` (OAuth, sem `FIGMA_TOKEN`) respondeu a `whoami` sem erro, e o
arquivo Figma desta operação foi criado: **`OP-002 app-mecanica-sao-jorge`**,
link em `docs/design/figma.md`. As 24 telas desta especificação foram
transcritas para a página `F24 · Wireframe baixa fidelidade` desse arquivo —
94 frames (93 células da matriz da seção 7 + 1 frame extra, ver
`docs/design/figma.md`), cada tela nomeada `[nº] Nome da tela / Estado`,
incluindo a correção da tela 15 (seção 6.15 abaixo) já aplicada no frame
correspondente. **US-DES-01 a US-DES-06 agora têm artefato Figma real, não só
texto; US-DES-07/08 (aprovação) ficam para BUSSOLA revisar o arquivo.**

O relato original do bloqueio (histórico, mantido abaixo para rastreabilidade):

Não consegui gerar o arquivo Figma desta feature. Dois problemas, nesta ordem:

1. **Token ausente**: chamei `figma_whoami` e a ponte respondeu
   `FIGMA_TOKEN não está definido no ambiente do bridge`. Sem token válido não
   há leitura nem exportação possível nesta sessão.
2. **Não existe arquivo Figma referenciado no repositório**: busquei por
   `figma.com` e por qualquer menção a `figma` em todo `.md` do projeto e no
   `CHANGELOG.md` — nada encontrado. A feature pede "arquivo compartilhado por
   link com a pessoa dona do produto", mas esse link não está em nenhum
   documento que eu tenha acesso (PRD, ADRs, overview). Mesmo com token válido,
   eu teria ferramentas só de leitura (`figma_get_file`, `figma_get_nodes`,
   `figma_export_images`, `figma_get_design_system`) — eu não crio nem edito
   nós no Figma por essa ponte.

**Consequência**: US-DES-01 a US-DES-06 (estrutura e conteúdo do wireframe)
estão especificadas por completo abaixo, prontas para alguém com acesso de
edição transcrever em frames do Figma. US-DES-07 e US-DES-08 (aprovação
explícita da pessoa dona do produto sobre o arquivo Figma) **não podem ser
cumpridas por mim nesta etapa** — não existe artefato Figma para aprovar.

**Pendência para REGENTE/BUSSOLA**: (a) conseguir/gerar um `FIGMA_TOKEN` e
configurá-lo na ponte, (b) criar o arquivo Figma e compartilhar o link, ou (c)
decidir que esta especificação em texto/Markdown substitui o Figma nesta
operação (divergência de ferramenta a registrar, já que a Premissa 3 da F24
fixa Figma como ferramenta). Sem uma dessas três ações, a entrega da F24 fica
parada em "especificado, não transcrito, não aprovável".

## 2. Fonte de verdade usada

- Lista e nomes das 24 telas: seção "Telas cobertas (24)" da própria spec da
  F24 (não existe `UX-UI-MAPEAMENTO.md` no repositório — confirmado também
  pela BUSSOLA na entrega anterior desta rota).
- Checklist de estados por tela: checklist entregue pela BUSSOLA (reproduzido
  e fechado na seção 7).
- Campos e nomes de domínio: `apps/api/src/main/resources/db/migration/V2__criar_schema_oficina.sql`
  e `docs/architecture/overview.md` (lidos nesta sessão), não inventados.

## 3. Divergências entre os critérios de aceitação e o schema atual

Registro para CARTOGRAFO/BUSSOLA decidirem antes do protótipo de alta
fidelidade — usei os critérios de aceitação da F24 para não travar o
wireframe, mas os campos abaixo **não existem na tabela hoje**:

| Tela afetada | Campo pedido por US-DES-04 ou pela própria tela | Situação real no schema (V2) |
|---|---|---|
| Clientes (lista/detalhe/criar/editar) | CPF, endereço | `clientes` só tem `nome`, `telefone`, `email`, `created_at` — sem CPF nem endereço |
| Serviços (lista/criar/editar) | nome/descrição do serviço (indispensável para listar) | `servicos` só tem `valor_padrao_mao_obra`, `tempo_estimado_horas`, `ativo` — sem nome. O próprio comentário da migration V2 já avisa que isso é pendência da feature de Catálogo |
| Peças (lista/criar/editar) | nome/descrição da peça (indispensável para listar) | `pecas` tem `codigo`, `custo`, `preco_venda`, `quantidade_estoque`, `estoque_minimo`, `ativo` — sem nome/descrição, mesma pendência registrada na migration |
| Movimentação de estoque | quantidade movimentada | `movimentacoes_estoque` tem `peca_id`, `ordem_id`, `tipo`, `motivo` — sem coluna de quantidade |
| Ordens de Serviço (lista, detalhe, transição) | rótulos do status (ex.: "Aberta", "Em andamento") | `StatusOS` ainda não tem a lista fechada de valores (overview.md: "enum da Sprint 04") |

Como tratei cada uma no wireframe: mantive os campos/rótulos como placeholder
estrutural (ex.: "Nome do serviço", "[Status]"), e marquei explicitamente onde
o dado ainda não tem coluna. Isso cumpre o espírito de US-DES-01 a US-DES-06
(a tela existe, tem hierarquia e estados) sem fingir que o schema já suporta o
conteúdo. Nenhum desses placeholders deve virar implementação sem a migration
aditiva correspondente.

## 4. Convenções globais do wireframe

### 4.1 Grade e formato
Mobile first, frame único de 360×800 px (Android médio), sem versão tablet ou
desktop nesta etapa (premissa 1 da F24). Margem lateral de 16 px, espaçamento
vertical mínimo de 8 px entre blocos, alvo de toque mínimo 44×44 dp em todo
elemento tocável (botão, item de lista, ícone de ação).

### 4.2 Nomenclatura de frames no Figma
`[nº da tela] Nome da tela / Estado` — exemplo: `03 Clientes · lista / Vazio`,
`03 Clientes · lista / Carregando`. Isso cumpre US-DES-01 (identificável pelo
nome) sem depender de cor ou posição no canvas.

### 4.3 Convenção de estado (aplicada a todas as telas, com a delta de cada uma na seção 6)

- **Carregando**: blocos cinza (skeleton) no formato do conteúdo final (linha
  de texto, círculo de avatar, retângulo de card), nunca texto "lorem ipsum".
  Anúncio para leitor de tela ao entrar no estado: "Carregando [nome da
  tela]". Nenhum controle interativo além de voltar.
- **Vazio** (só nas telas marcadas na seção 7): ícone ilustrativo + frase
  explicando a ausência de dado + ação primária visível quando fizer sentido
  criar o primeiro registro (ex.: "Nenhum cliente cadastrado ainda" + botão
  "Cadastrar cliente").
- **Erro de rede ou carregamento** (todas as 24 telas — US-DES-05): ícone de
  alerta + título "Não foi possível carregar" + texto "Verifique sua conexão e
  tente novamente" + botão "Tentar novamente" com foco inicial nele. Anúncio
  de leitor de tela ao entrar no estado: "Erro ao carregar [nome da tela]".
- **Erro de validação de formulário** (só as 13 telas com formulário —
  US-DES-06): ícone + texto de erro abaixo de cada campo inválido (nunca só
  borda vermelha), foco movido para o primeiro campo inválido ao tentar
  enviar, anúncio de leitor de tela "Formulário com erros, revise os campos
  destacados". Erro de regra de negócio que não aponta campo (ex.: login com
  credencial inválida, que por desenho da API não indica qual campo errou —
  overview.md) aparece como banner de erro acima do botão de envio, não anexado
  a um campo específico.
- **Preenchido**: conteúdo real (fictício) completo, é o estado de referência
  para hierarquia de informação.

### 4.4 Ordem de foco e leitura
Topo → base, esquerda → direita, seguindo a ordem do DOM/da árvore de
componentes (sem `tabindex`/ordem customizada). Em formulários: título da tela
→ campos na ordem em que aparecem → ação secundária (cancelar) → ação primária
(salvar/enviar). Em listas: campo de busca (se houver) → filtro (se houver) →
itens da lista em ordem → ação de criar novo item (botão fixo ou fim da
lista).

### 4.5 Não depender só de cor
Todo estado (erro, sucesso, pendente, ativo/inativo) leva texto ou ícone com
rótulo, além de cor. Exemplo: badge de status de parcela nunca é só uma bolinha
colorida — é "● Paga" / "● Pendente" / "● Atrasada" com texto visível e também
lido pelo leitor de tela.

### 4.6 Tab bar e sub-navegação pós-login (fecha o Gap 2 do mapa do CARTOGRAFO)

A casa pós-login é `02 Perfil`, acessada pela tab bar inferior — roteador de
nível 0 que expõe o topo de cada módulo. Na Sprint 01 a tab bar só tem a aba
Perfil; as demais abas entram sprint a sprint (F33), mas o wireframe já
especifica a estrutura completa das 24 telas, então a tab bar aqui representa
o alvo final das 5 abas:

| Aba | Tela(s)-topo | Como as duas telas da aba ficam visíveis |
|---|---|---|
| Perfil | `02 Perfil` | única tela da aba |
| Clientes | `03 Clientes · lista` | única tela da aba |
| Catálogo | `10 Serviços · lista` e `13 Peças · lista` | segmented control no topo da tela ("Serviços" / "Peças"), ambos os rótulos sempre visíveis, sem depender de cor para indicar qual está ativo — o rótulo ativo leva sublinhado ou fundo preenchido **e** peso de fonte maior |
| Ordens de Serviço | `17 Ordens de Serviço · lista` | única tela da aba |
| Financeiro | `22 Financeiro · parcelas` e `24 Financeiro · lançamentos` | mesmo padrão de segmented control ("Parcelas" / "Lançamentos") |

Isso garante que `13 Peças · lista` e `24 Financeiro · lançamentos` — que
antes só apareciam como destino de outras telas — têm entrada própria e
visível a partir da raiz, fechando a lacuna 2 do mapa de navegação.

## 5. Dado fictício padrão (US-DES-04, reaproveitado em todas as telas)

Nenhum dado real da oficina. Mesmo conjunto fictício em todas as telas, para
dar consistência de revisão:

- Cliente: "Ana Beatriz Souza" · telefone "(11) 90000-0001" · e-mail
  "ana.souza@exemplo-ficticio.com.br". *(CPF e endereço não aparecem nos dados
  de exemplo porque o schema atual não tem essas colunas — ver seção 3; quando
  a migration trouxer esses campos, usar CPF de teste reservado — faixa
  `000.000.000-00` a `111.111.111-11` não corresponde a CPF real válido — e
  endereço fictício "Rua das Palmeiras, 123, Bairro Esperança, Taubaté - SP".)*
- Segundo cliente (para listas com 2+ itens): "Carlos Eduardo Lima" ·
  "(11) 90000-0002".
- Veículo: placa fictícia "FIC0A12" · marca "Fiat" · modelo "Uno" · ano 2015 ·
  cor "Branco" · quilometragem "52.000 km".
- Serviço: "Troca de óleo" (nome placeholder, ver seção 3) · valor padrão de
  mão de obra "R$ 80,00" · tempo estimado "1h".
- Peça: "Filtro de óleo" (nome placeholder, ver seção 3) · código "FO-1023" ·
  preço de venda "R$ 45,00" · estoque "12 un." · estoque mínimo "5 un.".
- Ordem de serviço: nº "OS-0001" · status placeholder "[Status]" (ver seção 3)
  · valor total "R$ 325,00".
- Parcela: "Parcela 1 de 3" · valor previsto "R$ 108,33" · vencimento
  "15/12/2026" · status calculado "Pendente".
- Pagamento: forma "PIX" · valor "R$ 108,33".
- Lançamento financeiro: tipo "Entrada" · valor "R$ 108,33" · origem "OS-0001".

## 6. Especificação por tela

Cada tela traz: hierarquia de informação, controles com rótulo, ordem de foco
e a delta de conteúdo por estado (além do padrão da seção 4.3). "N/A" marca
estado que não se aplica, conforme checklist da BUSSOLA (seção 7).

### 01 — Login
*Sem navegação inferior. Vazio: N/A (tela de ação, não de listagem).*
- Navegação: entra sem origem (raiz do app); sai para 02 Perfil ao autenticar
  com sucesso.
- Hierarquia: nome do app → campo "E-mail" (teclado de e-mail) → campo "Senha"
  (oculta por padrão, com botão "Mostrar senha"/"Ocultar senha", alvo 44×44) →
  botão "Entrar".
- Ordem de foco: e-mail → senha → mostrar/ocultar senha → entrar.
- Carregando: ao tocar "Entrar", botão mostra indicador + texto "Entrando...",
  campos desabilitados (mantendo o rótulo visível, não escondido).
- Erro de rede: banner acima do botão "Não foi possível conectar. Verifique
  sua conexão e tente novamente", valores digitados preservados, botão
  "Entrar" dobra como nova tentativa.
- Erro de validação: campo vazio → mensagem própria ("Informe seu e-mail" /
  "Informe sua senha") abaixo do campo, foco no primeiro inválido. Credencial
  incorreta (401 da API) → banner geral acima do botão "E-mail ou senha
  incorretos" (não aponta qual campo, pois a API também não aponta —
  overview.md).
- Preenchido: campos com "ana.souza@exemplo-ficticio.com.br" e senha mascarada,
  prontos para envio.

### 02 — Perfil
*Vazio: N/A (sempre há usuário logado). Erro de validação: N/A (sem
formulário).*
- Navegação: entra pela tab bar (aba Perfil) ou por 01 ao autenticar com
  sucesso; sai para 01 ao tocar "Sair" (logout).
- Hierarquia: nome do usuário → e-mail → perfil (badge "ADMIN" ou
  "FUNCIONARIO", com texto, não só cor) → botão "Sair".
- Ordem de foco: nome/e-mail/perfil (somente leitura, sem foco interativo) →
  botão "Sair".
- Carregando: skeleton no lugar de nome, e-mail e badge.
- Erro de rede: padrão da seção 4.3; botão "Sair" continua acessível mesmo com
  erro ao carregar o perfil (segurança: usuário precisa conseguir sair mesmo
  se o GET de perfil falhar).
- Preenchido: "Ana Beatriz Souza" · "ana.souza@exemplo-ficticio.com.br" ·
  badge "ADMIN".

### 03 — Clientes · lista
- Navegação: entra pela tab bar (aba Clientes); botão "Novo cliente" leva a
  05, tocar um item leva a 04.
- Hierarquia: título "Clientes" → campo de busca "Buscar cliente" → lista de
  itens (nome + telefone) → botão fixo "Novo cliente".
- Ordem de foco: busca → itens da lista (cada um navega para o detalhe) →
  novo cliente.
- Vazio: "Nenhum cliente cadastrado ainda" + botão "Cadastrar cliente".
- Carregando: skeleton de 3 itens de lista.
- Preenchido: "Ana Beatriz Souza — (11) 90000-0001" e "Carlos Eduardo Lima —
  (11) 90000-0002".

### 04 — Clientes · detalhe
*Vazio: N/A (só se acessa com um cliente existente). Erro de validação: N/A.*
- Navegação: entra de 03 (toca item); botão "Editar cliente" leva a 06, botão
  "Adicionar veículo" leva a 07 (fecha o Gap 1 apontado por CARTOGRAFO — antes
  não havia ação declarada para chegar a `07 Veículos · criar`), tocar um
  veículo da lista leva a 09.
- Hierarquia: nome do cliente → telefone → e-mail → lista "Veículos" (placa +
  modelo, cada item navega ao detalhe do veículo) → botão "Adicionar veículo"
  → botão "Editar cliente".
- Ordem de foco: dados do cliente (leitura) → lista de veículos → adicionar
  veículo → editar cliente.
- Carregando: skeleton dos dados + skeleton da lista de veículos.
- Preenchido: "Ana Beatriz Souza", "(11) 90000-0001",
  "ana.souza@exemplo-ficticio.com.br", veículo "FIC0A12 — Fiat Uno".

### 05 — Clientes · criar
*Vazio: N/A.*
- Navegação: entra de 03 ("Novo cliente"); "Salvar" leva a 04 (do cliente
  criado), "Cancelar" volta a 03.
- Hierarquia: título "Novo cliente" → campo "Nome completo" → campo
  "Telefone" → campo "E-mail" → botão "Cancelar" (secundário) → botão "Salvar"
  (primário).
- Ordem de foco: nome → telefone → e-mail → cancelar → salvar.
- Carregando: ao tocar "Salvar", botão mostra "Salvando...", campos
  desabilitados.
- Erro de rede: banner "Não foi possível salvar. Verifique sua conexão e
  tente novamente" + "Tentar novamente", dados do formulário preservados.
- Erro de validação: "Informe o nome do cliente" (nome vazio), "Informe um
  telefone válido" (formato), "Informe um e-mail válido" (formato, campo
  opcional no schema mas validado se preenchido).
- Preenchido: campos com "Ana Beatriz Souza" / "(11) 90000-0001" /
  "ana.souza@exemplo-ficticio.com.br", prontos para salvar.

### 06 — Clientes · editar
Mesma estrutura da tela 05, com campos pré-preenchidos com os dados atuais do
cliente (estado inicial = "preenchido"). Diferença: título "Editar cliente" e
botão primário "Salvar alterações".
- Navegação: entra de 04 ("Editar cliente"); "Salvar alterações" e "Cancelar"
  voltam a 04.

### 07 — Veículos · criar
*Vazio: N/A.*
- Navegação: entra de 04, ao tocar "Adicionar veículo" (Gap 1 fechado — ver
  nota em 04); "Salvar" leva a 04 (ou a 09, do veículo recém-criado), "Cancelar"
  volta a 04.
- Hierarquia: título "Novo veículo" → indicação do cliente dono (somente
  leitura, ex.: "Cliente: Ana Beatriz Souza") → campo "Placa" → campo "Marca"
  → campo "Modelo" → campo "Ano" (numérico) → campo "Cor" (opcional) → campo
  "Quilometragem" (opcional, numérico) → "Cancelar" → "Salvar".
- Ordem de foco: placa → marca → modelo → ano → cor → quilometragem →
  cancelar → salvar.
- Erro de validação: "Informe a placa", "Informe a marca", "Informe o
  modelo" (campos obrigatórios no schema); ano e cor e quilometragem são
  opcionais, sem erro de obrigatoriedade.
- Preenchido: "FIC0A12" / "Fiat" / "Uno" / "2015" / "Branco" / "52000".

### 08 — Veículos · editar
Mesma estrutura da tela 07, campos pré-preenchidos, título "Editar veículo",
botão "Salvar alterações".
- Navegação: entra de 09 ("Editar veículo"); "Salvar alterações" e "Cancelar"
  voltam a 09.

### 09 — Veículos · detalhe com histórico de OS
- Navegação: entra de 04 (toca um veículo) ou de 07/08 (após salvar); botão
  "Editar veículo" leva a 08; tocar um item do histórico de OS leva a 19 OS ·
  detalhe (fecha o Gap 4 do mapa do CARTOGRAFO — o item do histórico é
  tocável e navega, não é só leitura).
- Hierarquia: placa + marca/modelo → dados complementares (ano, cor,
  quilometragem) → dono (nome do cliente) → lista "Histórico de ordens de
  serviço" (nº da OS, status, valor total, data, cada item tocável) → botão
  "Editar veículo".
- Ordem de foco: dados do veículo → histórico de OS → editar.
- Vazio: aqui "vazio" se refere só ao histórico de OS, não ao veículo —
  "Nenhuma ordem de serviço registrada para este veículo ainda" dentro da
  lista, mantendo os dados do veículo visíveis acima.
- Preenchido: "FIC0A12 — Fiat Uno", item de histórico "OS-0001 — [Status] —
  R$ 325,00 — 10/11/2026".

### 10 — Serviços · lista
- Navegação: entra pela tab bar (aba Catálogo, sub-aba "Serviços" — seção
  4.6); botão "Novo serviço" leva a 11; tocar um item da lista leva a 12
  (fecha o Gap 3 do mapa do CARTOGRAFO — Serviços não tem tela de detalhe, o
  toque no item vai direto para a edição).
- Hierarquia: título "Serviços" → campo de busca "Buscar serviço" → lista
  (nome do serviço + valor padrão de mão de obra, cada item tocável) → botão
  fixo "Novo serviço".
- Vazio: "Nenhum serviço cadastrado ainda" + botão "Cadastrar serviço".
- Preenchido: "Troca de óleo — R$ 80,00".

### 11 — Serviços · criar
- Navegação: entra de 10 ("Novo serviço"); "Salvar" e "Cancelar" voltam a 10.
- Hierarquia: título "Novo serviço" → campo "Nome do serviço" (placeholder de
  schema, ver seção 3) → campo "Valor padrão de mão de obra" (moeda) → campo
  "Tempo estimado (horas)" (opcional) → "Cancelar" → "Salvar".
- Erro de validação: "Informe o nome do serviço", "Informe o valor da mão de
  obra" / "Informe um valor válido" (deve ser maior que zero).
- Preenchido: "Troca de óleo" / "R$ 80,00" / "1".

### 12 — Serviços · editar
Mesma estrutura da 11, pré-preenchida, título "Editar serviço". Campo extra:
alternância "Ativo"/"Inativo" (coluna `ativo` já existe no schema), com rótulo
textual visível nos dois estados, não só a posição do switch.
- Navegação: entra de 10 (toca item); "Salvar alterações" e "Cancelar" voltam
  a 10.

### 13 — Peças · lista
- Navegação: entra pela tab bar (aba Catálogo, sub-aba "Peças" — seção 4.6);
  botão "Nova peça" leva a 14; tocar um item da lista leva a 15 (fecha o
  Gap 3 — Peças também não tem tela de detalhe); cada item tem uma ação
  secundária "Movimentar estoque" que leva a 16 (fecha o Gap 5 do mapa do
  CARTOGRAFO — antes `16 Movimentação de estoque` não tinha entrada
  declarada e ficava órfã).
- Hierarquia: título "Peças" → busca "Buscar peça" → lista (nome placeholder +
  código + estoque atual, com alerta textual "Estoque baixo" quando
  `quantidade_estoque <= estoque_minimo`; cada item tocável para editar e com
  ação secundária "Movimentar estoque") → botão fixo "Nova peça".
- Ordem de foco: busca → itens da lista, e dentro de cada item: área principal
  (editar) → botão "Movimentar estoque" → próximo item → nova peça.
- Vazio: "Nenhuma peça cadastrada ainda" + botão "Cadastrar peça".
- Preenchido: "Filtro de óleo — FO-1023 — 12 un.", segundo item fictício
  "Pastilha de freio — PF-2045 — 3 un. — Estoque baixo" (texto, não só cor,
  acompanhado de ícone de alerta).

### 14 — Peças · criar
- Navegação: entra de 13 ("Nova peça"); "Salvar" e "Cancelar" voltam a 13.
- Hierarquia: título "Nova peça" → campo "Nome da peça" (placeholder, seção 3)
  → campo "Código" → campo "Custo" (moeda) → campo "Preço de venda" (moeda) →
  campo "Quantidade em estoque" → campo "Estoque mínimo" → "Cancelar" →
  "Salvar".
- Erro de validação: "Informe o nome da peça", "Informe o código", "Código já
  cadastrado" (unicidade, erro de regra de negócio e não só de formato),
  "Informe um custo válido", "Informe um preço de venda válido".
- Preenchido: "Filtro de óleo" / "FO-1023" / "R$ 30,00" / "R$ 45,00" / "12" /
  "5".

### 15 — Peças · editar
Mesma estrutura da 14, pré-preenchida, título "Editar peça", mais alternância
"Ativo"/"Inativo" (mesma observação de rótulo textual da tela 12). Campo
"Código" fica somente leitura na edição (unicidade já validada na criação) —
sinalizado visualmente como não editável, com explicação textual "O código não
pode ser alterado depois do cadastro".
- Navegação: entra de 13 (toca item); "Salvar alterações" e "Cancelar" voltam
  a 13.
- Erro de validação: "Informe o nome da peça", "Informe um custo válido",
  "Informe um preço de venda válido" — **sem** "Informe o código" nem "Código
  já cadastrado": o campo "Código" é somente leitura nesta tela (ver acima) e
  por isso não participa da validação de formulário na edição.

### 16 — Movimentação de estoque
*Vazio: N/A.*
- Navegação: entra de 13, pelo botão "Movimentar estoque" do item da peça
  (fecha o Gap 5 — ver nota em 13); "Confirmar" e "Cancelar" voltam a 13.
- Hierarquia: título "Movimentar estoque" → indicação da peça (somente
  leitura, "Peça: Filtro de óleo — FO-1023") → campo "Tipo" (seleção:
  "Entrada" / "Saída" / "Ajuste", rótulo textual sempre visível) → campo
  "Quantidade" (placeholder de schema, ver seção 3) → campo "Motivo"
  (opcional) → "Cancelar" → "Confirmar".
- Erro de validação: "Selecione o tipo de movimentação", "Informe a
  quantidade" / "Informe um valor maior que zero".
- Preenchido: tipo "Saída" / quantidade "2" / motivo "Uso em OS-0001".

### 17 — Ordens de Serviço · lista
- Navegação: entra pela tab bar (aba Ordens de Serviço); botão "Nova OS" leva
  a 18; tocar um item leva a 19.
- Hierarquia: título "Ordens de serviço" → filtro por status (seleção com
  rótulo textual, não só cor) → lista (nº da OS, cliente, veículo, status,
  valor total) → botão fixo "Nova OS".
- Vazio: "Nenhuma ordem de serviço registrada ainda" + botão "Nova OS".
- Preenchido: "OS-0001 — Ana Beatriz Souza — FIC0A12 — [Status] — R$ 325,00".

### 18 — Ordens de Serviço · criar
- Navegação: entra de 17 ("Nova OS"), consumindo 03/04 (seleção de cliente e
  veículo) e 10/13 (seleção de serviços e peças) como origem de dados, não
  como navegação de tela cheia; "Criar OS" leva a 19 (da OS recém-criada),
  "Cancelar" volta a 17.
*Formulário mais longo da operação — tratado como um fluxo em seções dentro
da mesma tela, sem paginação, para manter a ordem de foco linear.*
- Hierarquia: título "Nova ordem de serviço" → seção "Cliente e veículo"
  (seleção de cliente existente → seleção de veículo do cliente) → seção
  "Serviços" (lista de serviços adicionados + botão "Adicionar serviço", cada
  item com nome, valor cobrado e quantidade) → seção "Peças" (mesma estrutura
  da seção de serviços) → campo "Desconto" (opcional) → resumo somente leitura
  (subtotal de serviços, subtotal de peças, desconto, valor total — os
  subtotais e o total **não são editáveis diretamente**, pois vêm de coluna
  gerada/cálculo do service, conforme ADR-005) → "Cancelar" → "Criar OS".
- Ordem de foco: cliente → veículo → adicionar serviço (repete por item) →
  adicionar peça (repete por item) → desconto → criar OS.
- Erro de validação: "Selecione um cliente", "Selecione um veículo",
  "Adicione ao menos um serviço ou uma peça" (regra de negócio, não só
  formato).
- Preenchido: cliente "Ana Beatriz Souza", veículo "FIC0A12", serviço "Troca
  de óleo — R$ 80,00 — 1x", peça "Filtro de óleo — R$ 45,00 — 1x", desconto
  "R$ 0,00", total "R$ 125,00".

### 19 — Ordens de Serviço · detalhe
*Erro de validação: N/A.*
- Navegação: entra de 17 (toca item), de 09 (toca item do histórico — ver
  nota em 09) ou de 18 (após criar); botão "Alterar status" leva a 20, link
  de parcelas leva a 21.
- Hierarquia: nº da OS + status (texto, não só cor) → cliente e veículo →
  lista de serviços cobrados → lista de peças cobradas → resumo financeiro
  (subtotal de serviços, subtotal de peças, desconto, valor total) → lista de
  parcelas resumida (link para a tela 21) → botão "Alterar status" (leva à
  tela 20).
- Vazio: N/A para os dados da própria OS; a seção de parcelas pode aparecer
  vazia antes de o parcelamento ser configurado — "Parcelamento ainda não
  definido".
- Preenchido: "OS-0001 — [Status]", "Ana Beatriz Souza — FIC0A12", "Troca de
  óleo — R$ 80,00", "Filtro de óleo — R$ 45,00", total "R$ 125,00".

### 20 — Ordens de Serviço · transição de status
*Vazio e erro de validação: N/A (seleção fechada de opções, não texto livre).*
- Navegação: entra de 19 ("Alterar status"); "Confirmar transição" e
  "Cancelar" (implícito, voltar) retornam a 19.
- Hierarquia: status atual (somente leitura) → lista de próximos status
  possíveis (seleção única, rótulo textual) → botão "Confirmar transição".
- Ordem de foco: lista de opções → confirmar.
- Erro de rede: padrão da seção 4.3 — importante aqui porque é uma ação que
  muda estado de negócio; o botão "Tentar novamente" reenvia a mesma
  transição escolhida, sem perder a seleção.
- Preenchido: status atual "[Status A]" → opção selecionada "[Status B]"
  (rótulos reais dependem do enum `StatusOS`, ainda não fechado — ver seção
  3).

### 21 — Ordens de Serviço · parcelas
- Navegação: entra de 19 (link de parcelas); botão "Registrar pagamento" por
  parcela leva a 23.
- Hierarquia: título "Parcelas da OS-0001" → lista de parcelas (nº da
  parcela/total, valor previsto, vencimento, status calculado — texto, não só
  cor) → botão "Configurar parcelamento" (quando ainda não existe) ou
  "Registrar pagamento" por parcela (leva à tela 23).
- Vazio: "Esta OS ainda não tem parcelamento definido" + botão "Configurar
  parcelamento".
- Preenchido: "Parcela 1 de 3 — R$ 108,33 — vence 15/12/2026 — ● Pendente",
  "Parcela 2 de 3 — R$ 108,33 — vence 15/01/2027 — ● Pendente".

### 22 — Financeiro · parcelas
- Navegação: entra pela tab bar (aba Financeiro, sub-aba "Parcelas" — seção
  4.6); cada parcela pendente ou atrasada tem botão "Registrar pagamento" que
  leva a 23 (fecha o Gap 6 do mapa do CARTOGRAFO — antes o pagamento só era
  alcançável a partir de 21, dentro do fluxo de uma OS específica; uma
  parcela paga não mostra essa ação).
- Hierarquia: título "Parcelas" → filtro por status (textual) → lista de
  parcelas de todas as OS (nº da OS, nº da parcela, cliente, valor, vencimento,
  status calculado, com botão "Registrar pagamento" nas parcelas pendentes ou
  atrasadas).
- Vazio: "Nenhuma parcela encontrada para este filtro".
- Preenchido: mesmo exemplo da tela 21, com a coluna extra "OS-0001" e
  "Ana Beatriz Souza".

### 23 — Financeiro · pagamento
*Vazio: N/A.*
- Navegação: entra de 21 ou de 22 (botão "Registrar pagamento", nos dois
  casos — Gap 6 fechado); "Confirmar pagamento" e "Cancelar" voltam para a
  tela de origem (21 ou 22, conforme de onde a pessoa veio).
- Hierarquia: indicação da parcela (somente leitura: nº, valor previsto,
  vencimento) → campo "Valor pago" (moeda, pré-preenchido com o valor
  previsto, editável) → campo "Forma de pagamento" (seleção: "Dinheiro" /
  "PIX" / "Cartão" / "Boleto", rótulo textual) → "Cancelar" → "Confirmar
  pagamento".
- Erro de validação: "Informe um valor válido" (maior que zero), "Selecione a
  forma de pagamento".
- Preenchido: "Parcela 1 de 3 — R$ 108,33" / valor pago "R$ 108,33" / forma
  "PIX".

### 24 — Financeiro · lançamentos (inclui lançamento manual)
*Vazio aplica-se à lista; o formulário de lançamento manual é uma ação dentro
da mesma tela (ex.: botão "Novo lançamento" abre o formulário).*
- Navegação: entra pela tab bar (aba Financeiro, sub-aba "Lançamentos" —
  seção 4.6, fecha o Gap 2 junto com 13); botão "Novo lançamento" abre o
  formulário na própria tela; "Salvar" e "Cancelar" fecham o formulário e
  voltam para a lista, sem sair da tela 24.
- Hierarquia (lista): título "Lançamentos financeiros" → filtro por tipo
  ("Entrada"/"Saída") → lista (tipo, valor, origem — nº da OS/pagamento ou
  "Lançamento manual" —, data) → botão fixo "Novo lançamento".
- Hierarquia (formulário de lançamento manual): título "Novo lançamento" →
  campo "Tipo" (seleção "Entrada"/"Saída") → campo "Valor" (moeda) → campo
  "Descrição" (texto livre, já que um lançamento manual não tem `ordem_id`
  nem `pagamento_id` de origem) → "Cancelar" → "Salvar".
- Vazio (lista): "Nenhum lançamento encontrado para este filtro".
- Erro de validação (formulário): "Selecione o tipo", "Informe um valor
  válido", "Informe uma descrição".
- Preenchido (lista): "Entrada — R$ 108,33 — OS-0001 — 15/12/2026", "Saída —
  R$ 45,00 — Lançamento manual — 10/11/2026".
- Preenchido (formulário): tipo "Saída" / valor "R$ 45,00" / descrição
  "Compra de peça avulsa".

## 7. Checklist de cobertura (fechado)

Reaproveito o checklist da BUSSOLA, com as 11 lacunas de "—" confirmadas nesta
etapa (não encontrei nenhum caso em que um "—" devesse virar estado real; cada
um está justificado na seção 6 da tela correspondente).

| # | Tela | Vazio | Carregando | Erro de rede | Erro de validação | Preenchido |
|---|------|:---:|:---:|:---:|:---:|:---:|
| 1 | Login | — | ✅ | ✅ | ✅ | ✅ |
| 2 | Perfil | — | ✅ | ✅ | — | ✅ |
| 3 | Clientes · lista | ✅ | ✅ | ✅ | — | ✅ |
| 4 | Clientes · detalhe | — | ✅ | ✅ | — | ✅ |
| 5 | Clientes · criar | — | ✅ | ✅ | ✅ | ✅ |
| 6 | Clientes · editar | — | ✅ | ✅ | ✅ | ✅ |
| 7 | Veículos · criar | — | ✅ | ✅ | ✅ | ✅ |
| 8 | Veículos · editar | — | ✅ | ✅ | ✅ | ✅ |
| 9 | Veículos · detalhe com histórico | ✅ | ✅ | ✅ | — | ✅ |
| 10 | Serviços · lista | ✅ | ✅ | ✅ | — | ✅ |
| 11 | Serviços · criar | — | ✅ | ✅ | ✅ | ✅ |
| 12 | Serviços · editar | — | ✅ | ✅ | ✅ | ✅ |
| 13 | Peças · lista | ✅ | ✅ | ✅ | — | ✅ |
| 14 | Peças · criar | — | ✅ | ✅ | ✅ | ✅ |
| 15 | Peças · editar | — | ✅ | ✅ | ✅ | ✅ |
| 16 | Movimentação de estoque | — | ✅ | ✅ | ✅ | ✅ |
| 17 | Ordens de Serviço · lista | ✅ | ✅ | ✅ | — | ✅ |
| 18 | Ordens de Serviço · criar | — | ✅ | ✅ | ✅ | ✅ |
| 19 | Ordens de Serviço · detalhe | — | ✅ | ✅ | — | ✅ |
| 20 | Ordens de Serviço · transição | — | ✅ | ✅ | — | ✅ |
| 21 | Ordens de Serviço · parcelas | ✅ | ✅ | ✅ | — | ✅ |
| 22 | Financeiro · parcelas | ✅ | ✅ | ✅ | — | ✅ |
| 23 | Financeiro · pagamento | — | ✅ | ✅ | ✅ | ✅ |
| 24 | Financeiro · lançamentos | ✅ | ✅ | ✅ | ✅ | ✅ |

"✅" = conteúdo e estrutura especificados na seção 6, prontos para virar frame
no Figma. Nenhuma célula representa um frame já criado — ver bloqueio na
seção 1.

### 7.1 Cobertura de fluxo (gaps do mapa do CARTOGRAFO, fechados)

A matriz acima cobre **estado por tela**; o mapa de navegação de CARTOGRAFO
(`docs/architecture/diagrams/navegacao-wireframe-f24.md`) cobre **fluxo entre
telas** e apontou 6 lacunas (2 telas órfãs + 4 arestas implícitas). As seis
foram fechadas nesta revisão com ação e rótulo explícitos declarados na linha
"Navegação" de cada tela afetada, na seção 6:

| Gap do CARTOGRAFO | Aresta fechada | Onde foi declarada |
|---|---|---|
| 1 — `07 Veículos · criar` órfã | `04 → 07` via botão "Adicionar veículo" | Seção 6, telas 04 e 07 |
| 2 — Catálogo/Financeiro sem entrada visível para a segunda tela da aba | tab bar com segmented control por aba (Catálogo: Serviços/Peças; Financeiro: Parcelas/Lançamentos) | Seção 4.6; seção 6, telas 10, 13, 22, 24 |
| 3 — `12 Serviços · editar` / `15 Peças · editar` só alcançáveis por "tocar item" | `10 → 12` e `13 → 15` declaradas | Seção 6, telas 10, 12, 13, 15 |
| 4 — `09 → 19` não confirmado | item do histórico de OS em 09 é tocável e leva a 19 | Seção 6, telas 09 e 19 |
| 5 — `16 Movimentação de estoque` órfã | `13 → 16` via ação "Movimentar estoque" no item da peça | Seção 6, telas 13 e 16 |
| 6 — `22 → 23` não confirmado | `22` também tem "Registrar pagamento" por parcela, levando a 23 | Seção 6, telas 22 e 23 |

Todas as 24 telas agora têm pelo menos uma entrada declarada a partir da raiz
(`01 Login` → `02 Perfil` → tab bar) e pelo menos uma saída declarada. Nenhuma
tela ficou sem caminho de volta (convenção 4.4 já previa cancelar/voltar em
todo formulário e detalhe).

## 8. Rastreamento dos critérios de aceitação

- **US-DES-01** (cobertura das 24 telas, nome identificável): **cumprido** —
  transcrito para o arquivo Figma único `OP-002 app-mecanica-sao-jorge`
  (`docs/design/figma.md`), 94 frames, cada um nomeado `[nº] Nome / Estado`.
- **US-DES-02** (quatro estados por tela): cumprido no texto (seção 6/7); nas
  11 telas sem "vazio" e nas 11 sem "erro de validação" o "—" está justificado
  por tela, não omitido.
- **US-DES-03** (acessibilidade estrutural): cada tela na seção 6 lista rótulo
  de controle, ordem de foco, navegação de entrada/saída e nenhum estado
  depende só de cor (convenção 4.5 e exemplos de badge/alerta textual).
- **Cobertura de fluxo** (critério técnico adicional recomendado por
  CARTOGRAFO, não um US formal, mas pré-condição de US-DES-07): os 6 gaps do
  mapa de navegação foram fechados — ver seção 7.1.
- **US-DES-04** (dado fictício): glossário único na seção 5; divergência de
  CPF/endereço de Clientes e nome de Serviços/Peças registrada na seção 3.
- **US-DES-05** (erro de rede com mensagem e nova tentativa): convenção 4.3,
  aplicada às 24 telas.
- **US-DES-06** (erro de validação por campo, foco no primeiro inválido):
  convenção 4.3 + detalhe por campo nas 13 telas com formulário (seção 6).
- **US-DES-07 / US-DES-08** (aprovação ou reprovação sobre o arquivo Figma):
  arquivo Figma agora existe e está pronto para revisão — aprovação explícita
  ainda depende de BUSSOLA/pessoa dona do produto abrir o link e decidir.

## 9. Pendências

1. Acesso ao Figma: `FIGMA_TOKEN` ausente na ponte + nenhum arquivo Figma
   referenciado no repositório. Preciso que REGENTE resolva uma das três
   opções listadas na seção 1 antes que US-DES-07/08 possam ser cumpridas.
2. Confirmar com CARTOGRAFO/BUSSOLA os campos ausentes da seção 3 (CPF e
   endereço em Clientes; nome/descrição em Serviços e Peças; quantidade em
   Movimentação de estoque) antes de qualquer migration aditiva dessas
   tabelas — o wireframe assume que esses campos vão existir, mas isso é uma
   decisão de produto/arquitetura, não uma decisão de design.
3. Confirmar se "Financeiro · lançamentos" continua como uma tela só (lista +
   formulário de lançamento manual) — mesma dúvida já registrada pela
   BUSSOLA, mantive a interpretação dela para fechar a contagem em 24. Se
   virar duas telas, as arestas de entrada/saída de 24 na seção 7.1 e no
   mapa de CARTOGRAFO mudam e precisam ser republicadas.
4. Confirmar com CARTOGRAFO se o botão "Movimentar estoque" dentro do item de
   `13 Peças · lista` (seção 6, tela 13) é a affordance definitiva, ou se a
   decisão correta é criar uma tela de detalhe de peça — o próprio mapa de
   navegação aponta essa alternativa (seção 7 do mapa). Optei pela ação no
   item por não exigir tela nova além das 24 já fechadas, mas é uma decisão
   de design que registro aqui para revisão, não um fato indiscutível.

## 10. Handoff para CRIVO

**O que foi feito**: especificação textual completa das 24 telas da F24, com
hierarquia de informação, controles e rótulos, ordem de foco, os cinco estados
por tela (vazio, carregando, erro de rede, erro de validação, preenchido, cada
um só onde se aplica) e, nesta revisão, a navegação de entrada e saída de cada
tela — fechando os 6 gaps de fluxo (2 telas órfãs + 4 arestas implícitas) que
CARTOGRAFO apontou em `docs/architecture/diagrams/navegacao-wireframe-f24.md`.
Dado fictício consistente, sem nenhum dado real da oficina. Divergências entre
os critérios de aceitação e o schema atual (`V2__criar_schema_oficina.sql`)
seguem checadas e registradas uma a uma, em vez de inventar colunas que não
existem.

**Arquivos**:
- Alterado: `docs/design/F24-wireframe-baixa-fidelidade.md` (este arquivo) —
  acrescentada a seção 4.6 (tab bar e sub-navegação), a linha "Navegação" em
  cada uma das 24 telas da seção 6, a seção 7.1 (tabela dos 6 gaps fechados) e
  esta seção de handoff.
- Nenhum outro arquivo do repositório foi alterado nesta etapa.
- Não foi criado nem alterado nenhum arquivo em `apps/mobile` — esta etapa é
  de especificação, não de implementação de tela.

**O que eu verifiquei de verdade** (vs. o que supus):
- Li por completo `docs/architecture/diagrams/navegacao-wireframe-f24.md` —
  os 6 gaps e a tabela de entrada/saída das 24 telas (seções 4 e 5 daquele
  mapa) são a fonte usada para cada aresta que fechei nesta revisão; não
  inventei nenhuma navegação fora do que o mapa levantou.
- Reconferi, tela a tela, que todas as 24 agora têm "Navegação" declarada na
  seção 6 (entrada e saída), checando contra a tabela da seção 4 do mapa do
  CARTOGRAFO linha por linha.
- Não executei nenhuma ferramenta nova desta vez (sem acesso ao Figma, como
  já registrado na seção 1) — esta revisão foi só do texto da especificação.

**Decisões**:
- Representei "Catálogo" e "Financeiro" como abas com segmented control
  interno (duas sub-telas visíveis por aba), em vez de criar duas tabs extras
  na tab bar — motivo: a F24 fixa 5 módulos (Clientes, Catálogo, OS,
  Financeiro, Perfil) e dividir Catálogo/Financeiro em tabs separadas mudaria
  a contagem de abas sem pedido de produto para isso; registrei a alternativa
  como decisão revisável, não como fato.
- Para `16 Movimentação de estoque`, escolhi uma ação "Movimentar estoque" no
  item de `13 Peças · lista` em vez de criar uma tela nova de detalhe de
  peça — mantém as 24 telas fechadas, mas é uma escolha de design, não a
  única possível (pendência 4 da seção 9).
- Mantive a leitura já registrada da BUSSOLA/CARTOGRAFO para as demais
  decisões de produto/schema (seções 3 e 9) — não reabri nenhuma delas.

**Pendências**: as quatro da seção 9. Destaque para a 1 (Figma) e a 4 (decisão
de design sobre `16`), que CRIVO deveria revisar com atenção redobrada por não
serem fatos verificáveis, e sim escolhas que fiz para fechar o fluxo sem travar
a entrega.

**Próximo passo**: CRIVO confere **estado por tela** (matriz da seção 7) **e**
**fluxo entre telas** (tabela da seção 7.1, contra o mapa original de
CARTOGRAFO) como os dois critérios técnicos da aprovação, conforme recomendado
por CARTOGRAFO na seção 6.1 do mapa de navegação. REGENTE segue decidindo como
destravar o acesso ao Figma (token, link do arquivo, ou aceitar este Markdown
como artefato de aprovação substituto, com registro formal da divergência de
ferramenta).

## 11. Atualização 2026-11-07 — Arquivo Figma criado (ESQUADRO)

**O que foi feito**: confirmado `whoami` do MCP `figma-remote` (OAuth, sem
bloqueio), criado o arquivo Figma único da operação
(`OP-002 app-mecanica-sao-jorge`, ver `docs/design/figma.md` para o link e os
detalhes de organização) e transcritas as 24 telas desta especificação para a
página `F24 · Wireframe baixa fidelidade`, com 94 frames cobrindo as 93
células `✅` da matriz da seção 7 (mais 1 frame extra desdobrando
"24 · Preenchido" em lista/formulário). A correção da tela 15 (seção 6, já
presente neste documento) foi aplicada também no frame do Figma. Nenhuma
célula "—" da matriz virou frame.

**Como foi construído**: via `use_figma` (API de plugin do Figma, código
JavaScript), em lotes de 3–4 telas por chamada, com uma biblioteca de helpers
reaproveitada entre as chamadas (título, campo com rótulo e erro, botão,
lista, estado vazio, erro de rede padrão, legenda de acessibilidade,
segmented control). Validado visualmente por amostragem com `get_screenshot`
em 8 frames de tipos diferentes (login, formulário longo multi-seção, lista
com segmented control e alerta de estoque baixo, erro de validação de
seleção, detalhe com histórico vazio) e por conferência estrutural de todos
os 94 nomes de frame via `get_metadata`, contra a lista de nomes esperada
pela seção 6 e a matriz da seção 7.

**O que verifiquei de verdade** (vs. o que não cobri): vi os 94 frames
nomeados corretamente (script Python sobre o XML de `get_metadata`, não
inspeção visual de cada um); vi 8 telas renderizadas sem sobreposição ou
corte de texto. **Não** abri as 94 telas uma a uma em zoom alto — amostragem,
não cobertura total, registrado para o CRIVO revisar com atenção adicional se
quiser conferir alguma tela específica fora da amostra.

**Decisão de versionamento (divergência registrada)**: este commit segue na
branch `fix/f02-appsec-login` (branch atual da sessão), não em uma branch
dedicada à F24 — mesmo desvio já registrado no commit `2108fdc` desta mesma
spec, mantido por consistência com o precedente da operação em vez de
bifurcar o histórico desta spec em duas branches.

**Pendências**: as quatro pendências da seção 9 continuam de pé (são
decisões de produto/arquitetura, não afetadas pela criação do arquivo
Figma). Nova pendência: aprovação explícita de BUSSOLA/pessoa dona do produto
sobre o arquivo Figma (US-DES-07/08) — o link está em `docs/design/figma.md`.

**Próximo passo**: BUSSOLA/pessoa dona do produto abre
`docs/design/figma.md`, revisa o arquivo Figma e aprova ou reprova com
pendência nomeada (tela + tipo de estado). CRIVO confere a entrega contra a
matriz da seção 7 e a tabela de fluxo da seção 7.1, agora com o arquivo real
disponível em vez de só o texto desta spec.
