# F28 — Protótipo de alta fidelidade das Ordens de Serviço (Figma)

- Autor: ESQUADRO (etapa 2 de 3 da rota: BUSSOLA → ESQUADRO → CRIVO)
- Data: 2026-11-24
- Feature: F28, critérios US-PROTO-OS-01 a 25 do PRD da BUSSOLA
- PRD: `docs/product/F28-prototipo-os.md`; recebido da F29: `docs/product/F29-recebido-da-F28-registro-pagamento.md`
- Estado: **entregue ao Figma, AGUARDANDO APROVAÇÃO. Não aprovado.** Falta a aprovação da pessoa e a decisão da base (F39). Seções 1, 11 e 12.

## 1. Base dos frames: a F39 não está aprovada

O briefing manda partir do wireframe da F39 e a feature só começa com ele aprovado. O que verifiquei no repositório: a F39 não tem registro "Aprovado" (mesma situação registrada na F26, `docs/design/F26-prototipo-clientes-veiculos.md`, seção 1).

**A tarefa 1 está reaberta.** A base foi a referência `FPdB8RymAnN81pbKfizdzE` (componentes, variáveis e a página `20:2132`). Isso foi **escolha minha, não decisão da pessoa**. Se a F39 mudar a estrutura de alguma tela, os frames correspondentes precisam ser refeitos. Quem decide: a pessoa.

## 2. Acesso ao Figma

`create_session`, `get_screenshot` e `use_figma` funcionaram no arquivo `FPdB8RymAnN81pbKfizdzE`. A instrução `figma-use` não foi carregada nesta sessão; compensei com passos pequenos (leitura, escrita, conferência por captura e por leitura de volta). Identificadores de conta e de sessão não são registrados aqui. Capturas não foram versionadas (o registro é pelos ids dos nós).

## 3. Onde está o trabalho

- Arquivo `FPdB8RymAnN81pbKfizdzE`, página `20:2132` "02 — Alta fidelidade", **seção `170:2912`** (3000 × 13251 depois da reorganização desta rodada).
- 44 frames de tela, 11 componentes (seção 4) e, abaixo de cada frame, a anotação de acessibilidade e i18n (`Anotação de acessibilidade — <código>`, um cartão por frame, 44 no total).
- Cada frame tem, dentro dele, a camada `Camada de foco (selos numerados, ocultável)`.
- Nenhum nó fora da seção foi alterado.

## 4. Componentes da seção

| Componente | Nó |
|---|---|
| Badge de status | `170:2935` |
| Cartão de OS | `172:2925` |
| Cabeçalho | `174:3018` |
| Botão | `174:3037` |
| Campo de texto (variante `Estado=Erro` com borda primary, ver seção 8) | `174:3063` |
| Banner / Aviso | `174:3084` |
| Linha de item | `178:3281` |
| Opção de status | `182:3643` |
| Cartão de parcela | `184:3829` |
| Chip | `184:3834` |
| **Formulário de pagamento** (mestre provisório para a F29 adotar; não fazer detach) | `184:3835` |

Variáveis usadas (coleção `html.to.design` `1:2` e `OP-002 Identidade v2` `89:712`): petro `1:13` `#1E3A3F`, primary `1:29` `#B5453D`, fundo `1:25` `#F7F5F2`, branco `1:4`, texto secundário `1:41` `#6E6A66`, borda de cartão `1:50`, placeholder `89:716`, borda de campo `89:717` `#8C8780`, esqueleto `98:713`. Não criei variável nem estilo novo.

## 5. Os frames

Tamanho 362 × 772 (os frames de detalhe e parcelas crescem com o conteúdo: de 644 a 1087). Nome no Figma: `<código> — <título>`. Os dados são **fictícios** (seção 9).

| Grupo | Código | Estado | Nó |
|---|---|---|---|
| Lista | O1 | preenchida | `172:2928` |
| | O2 | vazio (nenhuma OS) | `175:2996` |
| | O3 | carregando | `175:3120` |
| | O4 | erro ao carregar | `175:3238` |
| | O5 | filtro sem resultado | `175:3367` |
| Criar | N1 | preenchido | `177:3397` |
| | N2 | validação (3 campos) | `177:3549` |
| | N3 | salvando | `177:3706` |
| | N4 | erro ao salvar | `177:3855` |
| | N5 | sucesso | `177:4007` |
| | N6 | cliente sem veículo | `177:4153` |
| Detalhe | D1 | preenchido (em andamento) | `179:3257` |
| | D4 | vazio (aberta, sem itens) | `179:3487` |
| | D6 | entregue (somente leitura) | `179:3655` |
| | D7 | cancelada (somente leitura) | `179:3845` |
| | D2 | carregando | `181:3392` |
| | D3 | erro ao carregar | `181:3525` |
| | D5 | remover item (confirmação) | `181:3664` |
| | D8 | erro ao remover item | `181:3732` |
| | D9 | adicionar serviço | `181:3796` |
| | D10 | finalizada (3 parcelas) | `225:5316` |
| | D11 | editar desconto | `226:5374` |
| | D12 | desconto inválido | `226:5437` |
| | D13 | exemplo de totais | `226:5496` |
| Status | T1 | escolher próximo | `182:3644` |
| | T2 | OS em status final | `182:3800` |
| | T3 | cancelar OS (confirmação com motivo) | `182:3935` |
| | T4 | salvando | `182:4077` |
| | T5 | erro ao salvar | `182:4235` |
| | T6 | sucesso (detalhe após alterar) | `182:4396` |
| | T7 | matriz de transições (referência provisória, não é tela do app) | `182:4468` |
| Parcelas e pagamento | P1 | lista preenchida (OS #0204) | `185:3819` |
| | P2 | gerar parcelas | `185:3944` |
| | P3 | vazio (sem parcelamento) | `185:4096` |
| | P4 | carregando | `185:4135` |
| | P5 | erro ao carregar | `185:4161` |
| | P6 | registrar pagamento, preenchido | `185:4192` |
| | P7 | valor acima do saldo | `185:4342` |
| | P8 | registrando | `185:4500` |
| | P9 | erro ao registrar | `185:4653` |
| | P11 | erro ao gerar parcelas | `185:4808` |
| | P10 | pagamento registrado (sucesso) | `185:4965` |
| | P12 | parcelas da OS finalizada (3 parcelas) | `225:5413` |
| | P13 | valor vazio e sem forma | `227:5437` (instância do formulário `227:5445`) |

## 6. Decisões de design (todas reversíveis)

1. **Parcelas no detalhe como seção.** O detalhe mostra um resumo e o botão "Ver parcelas (N)", que abre a lista cheia (P1, P12). É **desvio da premissa 1 do briefing, decisão minha, a confirmar**.
2. **Registro de pagamento = instância do mestre `184:3835`.** Sem detach, cópia nem variante criada na F28. O mestre é provisório até a F29 adotá-lo. Mensagens e chave `financeiro.pagamento.*` seguem o recebido da F29. Propriedade booleana de componente liga a mensagem de erro de "forma não selecionada" (só o P13 a ativa).
3. **Sem campo de data no pagamento** (D9 do PRD: `pagamentos` não tem coluna de data).
4. **Pagamento acima do saldo bloqueia** (D5): "O valor não pode ser maior que o saldo da parcela (R$ 62,50)."
5. **Parcelas só existem para OS FINALIZADA ou ENTREGUE.** Nos demais status o detalhe mostra o aviso "As parcelas ficam disponíveis quando a OS for finalizada."
6. **Status da parcela é calculado** (PENDENTE, PARCIAL, PAGO, ATRASADO), mostrado em texto e cor. Hoje no protótipo: 24/11/2026.
7. **Formas de pagamento:** DINHEIRO, PIX, CARTAO, BOLETO (V2). "Cartão" não separa débito e crédito.
8. **Transições de status** só com as opções válidas, pela tabela do PRD (D2), desenhada em T7. ENTREGUE e CANCELADA são terminais (T2, D6, D7).
9. **Confirmação de cancelamento (T3, critério 6):** botões "Confirmar" e "Voltar", com nome acessível longo (por exemplo "Confirmar cancelamento da OS #0207"). Alterei esta rodada os rótulos que estavam como "Confirmar cancelamento" e "Manter a OS".
10. **Itens com valor congelado** (ícone de cadeado), desconto em reais que não passa da soma de serviços e peças (D11, D12) e totais (D13).
11. **D10 (OS finalizada) com itens somente leitura.** Suposição minha: o PRD não diz isso de forma explícita.
12. **Cabeçalho do detalhe** tem botão Voltar de 44 × 44; o cabeçalho da lista (O1 a O5) tem um ícone de pessoa de 36 × 36 cuja função não consta no arquivo (seção 8).

## 7. Navegação (modo Prototype)

Lido por script nesta rodada: **118 reações em 44 frames (112 de clique, 6 de tempo)**. **25 de 44 frames são alcançáveis pelo clique a partir de O1.** Os demais são estados alternativos (validação, erro, carregamento, confirmações), por isso têm **pontos de partida de fluxo próprios: 19 da F28 e mais 1 que é da F27** (não alterei o da F27).

- Ponto principal: "F28 — Fluxo principal (lista → detalhe → status → parcelas → pagamento)" em O1.
- Único frame sem saída: T7 (tabela de referência).
- Limitações conhecidas: N5 → D4, P2 → P12 e P6 → P8 → P10 são caminhos **genéricos** (mostram um resultado, não dependem do dado digitado); só 2 cartões da lista navegam; erros e carregamentos são visitados pelos pontos de partida, não pelo clique do fluxo principal.
- **Percorri o caminho só pelo grafo de reações, não em modo Present** (o MCP não aciona o Present).

## 8. Acessibilidade (medição de 2026-11-24, por script no arquivo)

- **Texto:** 823 trechos medidos contra o fundo efetivo (fórmula de luminância relativa do WCAG 2.2, empilhando as cores de fundo dos ancestrais). **Nenhum abaixo do mínimo** (4,5:1; 3:1 para texto grande). Menor razão **4,68:1** (rótulo "Ordens" da navegação inferior, `#EE8279` sobre `#1E3A3F`); a seguinte é 4,93:1 (`#6E6A66` sobre `#F7F5F2`).
- **Borda de campo (WCAG 1.4.11, 3:1): defeito encontrado e corrigido.** A variante `Estado=Erro` do campo (`174:3052`) tinha borda `#E2B5B0` (**1,68:1**). Troquei por primary `#B5453D` ligada à variável `1:29` (**4,97:1** sobre `#F7F5F2`). Relido: N2, P7, D12 e P13 com 4,97:1. Campos normais: 3,28:1 (`#8C8780`). Campos desabilitados em N3 e N6 (1,23:1) ficam fora do critério (controle inativo).
- **Anel de foco** (calculado, não é remedição de nó): petro sobre `#F7F5F2` 11,14:1; petro sobre branco 12,12:1; branco sobre petro (cabeçalho) 12,12:1; borda primary de campo 4,97:1.
- **Camada de foco:** 44 camadas (uma por frame), selos numerados na ordem de leitura, anel petro de 2 pt com respiro branco de 2 pt nos botões, cartões e grupos; borda primary de 2 pt nos campos; anel branco no botão Voltar do cabeçalho. Em grupos de opções (filtro, próximo status, forma de pagamento, navegação inferior) a camada marca o grupo com um selo e a anotação diz que as setas mudam a opção. **A camada está OCULTA por padrão**, ao contrário da F26: com ela visível, o clique do protótipo seria interceptado. Para ver a ordem de foco, ligue a camada no painel de camadas. Conferi visualmente só O1 e P7.
- **Anotação abaixo de cada frame:** ordem de foco (derivada dos controles do frame), o que o leitor de tela deve anunciar, `aria-live` (assertive para erro, polite para sucesso e carregamento, `aria-busy` nos carregamentos), chaves i18n `area.componente.texto` (avisos com a chave e o texto lido do frame), formatação pt-BR (moeda `R$ 1.234,56` e data `dd/mm/aaaa` via `Intl`) e alvo de toque medido.
- **Alvo de toque (nós com reação):** 3 abaixo de 44 × 44: **filtros do O1 (Em andamento) e do O5 (Todas), com 32 de altura, e o ícone de 36 × 36 do cabeçalho da lista**. Atendem o mínimo de 24 × 24 do WCAG 2.2 AA (2.5.8), mas **não a regra de 44 × 44 da casa**. Não corrigi: exige redesenhar o chip (ou uma área de toque maior) e decidir a função do ícone. Os demais controles medem 44 × 44 ou mais.
- **Cor não é o único sinal:** erro tem ícone e texto; o status da OS e da parcela tem texto.
- **Leitor de tela real (VoiceOver, TalkBack): não testado.** As anotações descrevem o que deve ser anunciado.

## 9. Tokens, tipografia e dados fictícios

- **1.996 preenchimentos e traços sólidos visíveis nos 44 frames, 1.996 ligados a variável (0 soltos). 823 textos, 823 com estilo de texto** (sem contar a camada de foco nem a identificação da tela).
- Dados inventados: clientes Otávio Neves, Cecília Barros, Teodoro Lemos, Valéria Antunes; placas JQP9C07, FNG2H45, MBR3F21, RTK4M81; OS de #0203 a #0213. Não é possível provar que não existem no mundo; registra-se a origem (inventada). O mapeamento OS ↔ cliente ↔ veículo é fictício.
- Nenhum CPF, telefone ou e-mail aparece nos frames.

## 10. Dúvidas do PRD (nada foi decidido em nome da pessoa)

| # | Estado nesta entrega |
|---|---|
| D1 (dono do registro de pagamento) | Padrão proposto aplicado: mestre da F29, ponto de entrada da F28. **Não confirmada** |
| D2 (transições) | Tabela do PRD desenhada (T1, T7). Aberta; a F20 fecha |
| D3 (tela de adicionar/remover item e desconto) | Desenhei D5, D8, D9, D11, D12 pelo padrão adotado. Aberta |
| D4 (gerar parcelas) | Desenhei P2 e P11. Aberta |
| D5 (pagamento acima do saldo) | Bloqueia (P7). Aberta |
| D9 (data do pagamento) | Sem campo. Aberta |
| D10, D11 | D11: estado vazio de parcelas em P3, com a ação de gerar. D10: só apontado |

## 11. O que não consegui fazer ou verificar

- **Aprovação da pessoa (tarefa 13): não houve. Não aprovado.**
- **F39 não aprovada** (seção 1).
- Modo Present e clique real não foram abertos; só o grafo de reações foi lido.
- Leitor de tela real não testado.
- Link restrito à equipe: o MCP não lê nem altera permissões de compartilhamento.
- Capturas conferidas visualmente: O1 e P7 (com a camada de foco), mais as de rodadas anteriores. O restante foi medido por script.
- **Função do ícone de 36 × 36 do cabeçalho da lista:** não identificada no arquivo.
- **Alvo de 44 × 44 nos chips de filtro e no ícone do cabeçalho:** aberto (seção 8).
- O botão "Nova OS" do O1 não tinha nome de camada; renomeei o frame `172:2998` para `Botão — Nova OS` e o incluí na camada de foco.
- Em N3 e N6 as bordas dos campos desabilitados ficam abaixo de 3:1 por serem controles inativos; interpretação minha de 1.4.11, **a conferir pelo CRIVO**.
- Código, telas de Financeiro (F29), edição e estorno de pagamento, PDF, assinatura, WhatsApp e gateway: fora do escopo.

## 12. Próximo passo

1. A pessoa aprova (ou pede ajustes) e decide a base (F39) e as dúvidas D1 a D5, D9 e D11.
2. O CRIVO confere o protótipo contra os critérios 01 a 25.
3. A F29 adota o mestre `184:3835` sem detach.
4. Decidir os chips de 32 pt e o ícone do cabeçalho.
