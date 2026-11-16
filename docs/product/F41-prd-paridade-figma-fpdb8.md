# F41 — PRD revisado (v3): paridade com o Figma `FPdB8RymAnN81pbKfizdzE`

PRD — dono: BUSSOLA (Product Owner). Data: 2026-11-16. Rota: BUSSOLA → CARTOGRAFO → ESQUADRO → ORLA → CRIVO.
Prioridade P1 · Frontend · Sprint 01.
Base do documento: ramo `feat/f41-paridade-fpdb8-codigo`, código em `c627ac6`, sobre a `main` em `348a43e` (F40 já mergeada pela PR #10).

**Depende de:** [[F25]], [[F30]], [[F33]], [[F34]], [[F40]] (já na `main`).
**Altera por decisão da pessoa (16/11):** [[F33]] (US-MENU-01, 02 e 03; ver §6).

Este documento **substitui** o PRD v2 da F41 (commit `00f1f17`) e, para a F41, os critérios US-PAR-01 a 18 da feature, exceto US-PAR-14, que vale como está. Esta versão **fecha todas as dúvidas que o v2 deixava abertas** (P-01 a P-07) e as quatro decisões que o comandante pediu para fechar: US-PAR-08, rótulo "Usuário" × e-mail, tab bar sem Perfil e D2 fora do aceite. O §7 não tem pergunta pendente.

Nada foi corrigido em código nem no Figma nesta etapa. Só decisão, escopo e critério.

## 1. Contexto

1. **A F40 já está na `main`.** A F41 é a **nova linha de base** das features de tela seguintes (F35, F36, F42, F43). A prova de "sem mudança visual" da F40 (US-COMP-11) continua sendo sobre `c815235`; a F41 muda o visual de propósito.
2. **Esta feature é a "feature de código posterior à F41"** que o briefing previa para Login, Perfil, logout e tab bar. A F41 corrige direto contra o arquivo novo, e a exceção temporária "redesenho aguardando código" **deixa de ter efeito** para essas quatro telas.
3. **O código já foi corrigido em grande parte** no ramo `feat/f41-paridade-fpdb8-codigo` (commits `388ac14` a `c627ac6`: tokens v2, Login, Perfil, diálogo, tab bar de 4 itens, botão de usuário, fontes Barlow Condensed e Inter, versão do app, cores AA). O que resta está em §5, US-PAR-08.
4. **A planilha de divergências e a planilha de valores já existem:** `docs/design/F41-planilha-fpdb8.md` (ESQUADRO, refeita do zero) e `docs/design/F41-valores-fpdb8.md` (uma linha por valor, com o teste que o trava). Elas são a **prova de paridade** desta feature (D-19 abaixo). A planilha de 13/11, feita contra o arquivo `DLqb…`, não vale mais.
5. **Acesso ao Figma nesta sessão:** `mcp__figma-remote__whoami`, chamado por mim em 2026-11-16, voltou `Claude requested permissions to use mcp__figma-remote__whoami, but you haven't granted it yet.` Não li nenhum nó e não contornei. Efeito: US-PAR-11 (§5).

## 2. Decisões registradas (16/11/2026), com a origem de cada uma

**Origem:** "pessoa" = decisão registrada da pessoa (D-01 a D-09 do PRD v2; D-10 a D-19 em `F41-valores-fpdb8.md` §10 e na revisão humana de 16/11). "comandante" = instrução do comandante a esta etapa, **não** resposta da pessoa; está marcada assim para o rastro não ficar falso.

| # | Decisão | Origem |
|---|---|---|
| D-01 | `FPdB8RymAnN81pbKfizdzE` é a **referência definitiva** de alta fidelidade. O arquivo `DLqbSzzKRxiN2eyvXG73Lr` deixa de ser referência. | pessoa |
| D-02 | **O Figma manda**; o código se ajusta. Só barra de status (conteúdo), fonte do sistema e tamanho de aparelho são "só de plataforma". | pessoa |
| D-03 | Rótulo do campo de login = **"Usuário"**. O campo **continua enviando e-mail**; `POST /api/v1/auth/login` segue o único endpoint, com o corpo `{ email, senha }`. | pessoa |
| D-04 | **Versão do app** no Perfil, lida da configuração do Expo por `expo-constants`. O repositório não tem `app.json`; a fonte é `apps/mobile/app.config.ts` (`version: '0.1.0'`). | pessoa (a correção de fonte é minha, verificada) |
| D-05 | **Perfil sai da tab bar.** Perfil é aberto por botão de usuário no cabeçalho, com seta de voltar no Perfil. Tab bar com **4 itens, na ordem do Figma**: Ordens, Clientes, Catálogo, Financeiro. | pessoa |
| D-06 | Estado que existe no código e não tem frame é divergência real: o ESQUADRO propõe o frame e a pessoa aprova, ou registra "não se aplica" com justificativa. Nada é marcado sem ver o frame. | pessoa |
| D-07 | Cor do Figma que reprova AA nunca entra como está; o ESQUADRO propõe e a pessoa aprova. | pessoa |
| D-08 | Aparelho do protocolo: **sem aparelho físico** (ver D-19). | pessoa |
| D-09 | Todo texto em chave de i18n (`area.componente.texto`). | pessoa |
| D-10 a D-18 | Ionicons como exceção; "Mostrar senha" mantido; versão real 0.1.0; e-mail sob "Usuário" no Perfil; iniciais ignoram da/de/do/dos/das; "Funcionário" no selo; glifo nativo é plataforma e sombra é real; cores AA (placeholder Flint `#6E6A66`, borda de campo `#8C8780`, aba selecionada `#EE8279`); bordas decorativas isentas. Texto completo em `F41-valores-fpdb8.md` §10. | pessoa |
| D-19 | **Captura e pares lado a lado dispensados; sem aparelho físico.** A prova é a planilha de valores mais os testes de componente. | pessoa |
| D-19a | **Aprovados e viram referência:** L1 `82:1990`, L2 `82:2024`, L3 `82:2058`, L4 `82:2098`, P1 `83:712`, P2 `83:754` (com "Tentar novamente" **cheio** e "Entrar novamente" em **contorno**), T1 `83:817` e T2 `83:844`. | pessoa |
| **D-20** | **Início fica fora do aceite da F41.** A rota técnica `/inicio` (cabeçalho, botão de usuário, estado vazio, tab bar de 4 itens desabilitados) permanece como destino pós-login, mas **não tem paridade nem frame nesta feature**. Frame de Início e sua paridade viram feature própria, sob a regra "Início só vale depois de a pessoa aprovar o frame". Tela ou estado novo fica fora do escopo. | pessoa (regra "Início só vale depois da aprovação do frame", revisão de 16/11) + comandante (escopo) |
| **D-21** | **D2 fora do aceite da F41.** O escudo 84 × 96 e qualquer vetor ou imagem exportado do arquivo de referência **não entram** na F41 nem a bloqueiam. A correção L-02 fica registrada como "fora do aceite", com portão: só entra quando a D2 (titularidade e licença da imagem) for respondida, em feature própria. Sem substituto improvisado. Coerente com o ADR-014, em que a D2 já deixou de ser condição para `Aceito` e ficou só como portão do escudo. | comandante |
| **D-22** | As capturas que já estão em `docs/design/f41-capturas/` (18 arquivos, 864 KB no total, maior com 94.742 bytes, todos abaixo de 100 KB) **ficam no repositório como histórico**, sem valor de prova (D-19). Nada é removido. Fecha o condicional de `F41-valores-fpdb8.md` D-19. | PO (escopo) |

**Aviso de rastro, não pergunta:** D-20 e D-21 retiram do fechamento dois itens que a lista da revisão humana de 16/11 ainda citava como abertos para o critério 8 ("frame Início aprovado" e "escudo exportado"). A origem é a instrução do comandante, não uma resposta nova da pessoa. Se a pessoa discordar, a mudança entra como revisão deste PRD (v4) e reabre a US-PAR-08; este documento não depende de resposta para ser lido nem implementado.

## 3. Escopo

### Dentro do escopo
- Login (vazio, preenchido, carregando, erro de credencial, erro de conexão, sessão expirada), Perfil (carregando, erro, preenchido), diálogo de logout, cabeçalho com botão de usuário e tab bar (padrão, selecionado, foco e desabilitado) contra o arquivo `FPdB8`.
- Planilha de valores com uma linha por valor, cada uma com **teste que trava texto, token e medida do frame**.
- Releitura de L2, L3 e L4 no Figma pelo ESQUADRO, com o valor lido registrado em cada linha (V-L14 e V-L19).
- As três variáveis de cor no Figma (placeholder, borda de campo, aba selecionada), o ajuste do P2 `83:754` e o T1 `83:817` religado ao coral `#EE8279`.
- Diff de `tokens.ts` contra as variáveis do arquivo, com o Figma como fonte, e contraste AA recalculado (`docs/design/F41-contraste.py`).
- Testes de componente ajustados e a **suíte inteira** rodada.
- Repetição do fluxo contra a API local depois das correções.

### Fora do escopo
- **Início** (frame, paridade e qualquer estado ou tela nova). D-20.
- **Escudo** e qualquer ativo exportado do Figma. D-21.
- **Captura do app e pares lado a lado** como prova. D-19.
- Módulos de negócio (Clientes, Catálogo, Ordens, Financeiro).
- Mudança de **endpoint** ou de contrato da API.
- Foco de teclado e leitor de tela **em aparelho** (US-MENU-06): continua pendência "não alcançável sem aparelho".
- Android (sombra por `elevation` aceita e registrada, D-16) e escala de fonte do sistema.
- Componentes novos sem uso e backlog (dashboard, fotos, PDF, WhatsApp).

> **Substitui** a premissa 7 da feature ("não altera comportamento nem endpoint"). O que **não muda** é o endpoint e o contrato de login. O que **muda** por decisão da pessoa: rótulo do campo, origem da versão e o acesso ao Perfil por botão no cabeçalho.

## 4. Premissas (numeradas)

1. O arquivo `FPdB8RymAnN81pbKfizdzE` é a referência; o código se ajusta (D-01, D-02).
2. O arquivo é a inspiração externa da F39 e **não é "a v2 editada pela F39"**: a F39 não editou nenhum nó. A F39 (Concluída) **não edita** os quatro frames de alta desta feature; a baixa fidelidade continua com ela. A tarefa 2 fica resolvida por isso.
3. Os ids `20:2131` e `20:968` do briefing **não são frames de alta**: `20:2131` é a página "01 — Wireframes" e `20:968` é um rótulo de texto (`get_metadata` do ESQUADRO em 16/11). A referência de trabalho são os frames de §8.
4. Token novo ou alterado entra nos dois lados juntos: `tokens.ts` e variáveis do Figma. Os três valores aprovados já estão em `tokens.ts` (verificado por mim: `flint` `#6E6A66`, `stone` `#8C8780`, `coral` `#EE8279`, `ringOnBrand` branco, `unavailable` 0,5, sem comentário PROVISÓRIO). **O lado Figma não foi feito** (acesso negado).
5. Estado que existe só em um dos lados é divergência real. Só estado que não existe em nenhum dos lados é "não se aplica", com justificativa.
6. Plataforma: barra de status (conteúdo), renderização de fonte do sistema e tamanho de aparelho. Glifo nativo é plataforma; sombra é real (D-16).
7. **Dados pessoais (LGPD).** O Perfil exibe o **e-mail do usuário logado** sob o rótulo "Usuário" (D-13), como já exibia antes sob "E-mail". Finalidade: identificar na tela o usuário autenticado. Base legal: a registrada em `docs/product/F30-appsec-lgpd-login-perfil.md` (art. 7º, V, execução de contrato, com apoio no art. 7º, IX), cuja confirmação é do controlador e não é alterada por esta feature. Retenção: no SecureStore do aparelho até logout, 401 ou desinstalação (mesmo documento); nenhuma coleta nova. Nenhum e-mail, senha ou token em log; em teste, só dado fictício. A versão do app não é dado pessoal.
8. Como a captura foi dispensada (D-19), **não há captura de tela do app a proteger nesta feature**. As imagens já versionadas (D-22) usam só dado fictício (`joao.silva`), o que o CRIVO confere uma vez (US-PAR-12).
9. Perfil fora da tab bar altera o PRD da F33 (§6). Registro; **não reescrevo** o PRD nem os critérios da F33.
10. Alturas do Figma (campo 46, botão 50, tab bar 62) valem sobre os tokens da casa (48, 52, 64). A área de toque efetiva continua ≥ 48 por `hitSlop` (coberto por `header-icon-button.test` e `text-field.test`; o Jest não mede toque real, ver US-PAR-09).

## 5. Critérios de aceitação (Gherkin)

Reescritos: US-PAR-01, 02, 03, 04, 06, 07, 08, 10, 11, 12, 13, 15, 16, 17, 18. Ajustados: US-PAR-05 e 09. Vale como na feature: US-PAR-14. Os IDs `US-PAR-NN` rastreiam até teste.

### US-PAR-01 — Cobertura de telas e prova
- **Dado** Login, Perfil, diálogo de confirmação de logout, cabeçalho com botão de usuário e tab bar do arquivo `FPdB8RymAnN81pbKfizdzE`,
- **Quando** a conferência termina,
- **Então** cada tela tem em `docs/design/F41-valores-fpdb8.md` uma linha por valor, com o nó do frame, o valor lido, o valor do código e o **teste que o trava**,
- **E** nenhuma linha está marcada "FALTA" no campo do teste,
- **E** `docs/design/figma.md:4` e `docs/design/F41-conferencia-paridade-referencias.md:4` apontam para o arquivo novo (verificado por mim em 16/11),
- **E** não é exigida imagem composta nem captura do app (D-19).

### US-PAR-02 — Cobertura dos estados
**Cenário A — cada estado trava texto, token e medida**
- **Dado** Login (vazio `10:895`, preenchido L1 `82:1990`, carregando L2 `82:2024`, erro de credencial `10:936`, erro de conexão L3 `82:2058`, sessão expirada L4 `82:2098`) e Perfil (carregando P1 `83:712`, erro P2 `83:754`, preenchido `10:3842`),
- **Quando** reviso a planilha de valores e a suíte,
- **Então** cada estado tem pelo menos um teste que trava o **texto** (chave de i18n), o **token** de cor e a **medida** do frame, e o teste falha se o valor mudar,
- **E** estado sem frame nos dois lados (por exemplo, Início carregando e Início erro) está como "não se aplica" com justificativa: a tela não chama API.

**Cenário B — releitura de L2, L3 e L4**
- **Dado** que V-L14 (L2: "Entrando…" e opacidade do botão) e V-L19 (L4: texto da sessão expirada) estão "a conferir",
- **Quando** o ESQUADRO reabre o arquivo `FPdB8` e relê L2, L3 e L4,
- **Então** o **valor lido em cada linha** (texto exato, opacidade, cor, medida) fica registrado na planilha com a saída real da leitura,
- **E** o código e o teste correspondente são ajustados ao valor lido,
- **E** se o Figma estiver inacessível, vale US-PAR-11 e V-L14 e V-L19 continuam abertas.

### US-PAR-03 — Tab bar e acesso ao Perfil
**Cenário A — itens e ordem**
- **Dado** a tab bar do arquivo novo, com 4 itens e sem Perfil,
- **Quando** o app roda,
- **Então** os itens aparecem na ordem **Ordens, Clientes, Catálogo, Financeiro**, com rótulos vindos de `menu.tabbar.*.rotulo`, barra de 62, ícone de 22 e rótulo Inter de **11** (não 10,5),
- **E** não existe item Perfil na barra.

**Cenário B — desabilitado e foco**
- **Dado** que nenhum módulo existe nesta fase,
- **Quando** olho a tab bar,
- **Então** os 4 itens estão a **50%** de opacidade (T2 `83:844`), nenhum selecionado, cada um anunciado como "<nome>, indisponível nesta versão",
- **E** o foco é um anel **branco de 2 px com respiro de 2 px** (T1 `83:817`).

**Cenário C — selecionado**
- **Dado** o estado selecionado (ícone e rótulo `#EE8279`, SemiBold 11, sem pílula, anunciado "selecionado"),
- **Quando** o teste do `TabBarItem` isolado roda,
- **Então** o estilo é travado pelo teste, e a prova é **só esse teste**, declarada como tal, porque nenhum item é navegável no app em execução.

**Cenário D — botão de usuário**
- **Dado** uma sessão autenticada,
- **Quando** olho o cabeçalho,
- **Então** há botão de usuário 36 × 36, raio 8, fundo branco a 12%, ícone de pessoa 18, nome acessível "Perfil" (chave de i18n), papel de botão e área de toque ≥ 48 por `hitSlop`,
- **E** tocá-lo abre o Perfil, que mostra a seta de voltar com nome acessível próprio,
- **E** a ordem de foco no cabeçalho é: título, botão de usuário, conteúdo, tab bar; no Perfil: seta de voltar, título, conteúdo.

**Cenário E — foco em aparelho**
- **Dado** o foco de teclado e o leitor de tela,
- **Quando** a pendência é revisada,
- **Então** ela permanece em US-MENU-06 como "não alcançável sem aparelho", sem prova inventada.

### US-PAR-04 — Protocolo de captura (não se aplica ao aceite)
- **Dado** que a pessoa dispensou captura e pares lado a lado (D-19) e não há aparelho físico,
- **Quando** a feature fecha,
- **Então** o protocolo de aparelho **não é exigido** para o aceite e o item fica como "não se aplica", com a justificativa D-19,
- **E** o que existir de captura é identificado como **conferência do ORLA em simulador** (iPhone 17, iOS 27.0, Expo Go, retrato), sem valor de prova.

### US-PAR-05 — Classificação (ajustado)
- **Dado** cada diferença entre frame e tela,
- **Quando** é registrada na planilha,
- **Então** é "só de plataforma" apenas se for barra de status (conteúdo), renderização de fonte do sistema ou tamanho de aparelho; **todo o resto** (estrutura, hierarquia, texto, token, família de fonte, ícone, estado, sombra) é "real", com o valor lido e o valor do código no lugar da captura.

### US-PAR-06 — Correção de divergência real
- **Dado** uma divergência real dentro do escopo,
- **Quando** ela é tratada,
- **Então** o código se ajusta ao Figma (D-02), inclusive as três que mudam comportamento (rótulo "Usuário", "Versão do app" e Perfil fora da tab bar),
- **E** a decisão e o lado corrigido ficam registrados por linha,
- **E** todo texto corrigido está em chave de i18n,
- **E** o Figma só muda por decisão registrada (frame P2 ajustado e T1 religado, que são ajustes decididos em 16/11; ou item que a pessoa decidir manter no código),
- **E** a divergência do escudo (L-02) aparece como "fora do aceite (D-21)", com o portão D2, e **não** como corrigida.

### US-PAR-07 — Tokens e variáveis do Figma
**Cenário A — código**
- **Dado** as três cores aprovadas (D-17),
- **Quando** `tokens.ts` é lido,
- **Então** placeholder = Flint `#6E6A66`, borda de campo = `#8C8780` e aba selecionada = `#EE8279`, sem comentário PROVISÓRIO, travados por `tokens.test.ts` com o literal.

**Cenário B — Figma**
- **Dado** o acesso ao Figma liberado (`whoami` responde e `create_session` abre sessão no arquivo `FPdB8`),
- **Quando** o ESQUADRO cria as três variáveis e religa os frames afetados (inclusive T1 em `#EE8279`),
- **Então** `get_variable_defs` devolve o **mesmo hex** do `tokens.ts` para cada uma, com a saída real registrada,
- **E** a feature só fecha com valor idêntico nos dois lados.

**Cenário C — valor do Figma que reprova AA**
- **Dado** um valor do arquivo que reprova AA,
- **Quando** ele é tratado,
- **Então** não entra como está e passa pelo cálculo do `F41-contraste.py` antes de virar token.

### US-PAR-08 — Paridade final (sem pares lado a lado)
**Cenário A — zero divergência real aberta**
- **Dado** a planilha de divergências e a planilha de valores,
- **Quando** a conferência final é feita,
- **Então** **nenhuma divergência real está aberta** no escopo da F41, e cada linha está **corrigida no código** ou **com o frame atualizado por decisão registrada**,
- **E** os únicos itens não corrigidos são os **fora do aceite** declarados: escudo (L-02, D-21) e Início (T-11, D-20), cada um com dono e portão, e **não contam como abertos**,
- **E** são condições de fechamento, sem exceção: P2 `83:754` ajustado ao desenho aprovado, T1 `83:817` em `#EE8279`, as três variáveis criadas (US-PAR-07 B), V-L14 e V-L19 relidos (US-PAR-02 B) e L-09, L-16 a L-19, P-12, P-13, T-09 e T-10 conferidos contra o frame aprovado.

**Cenário B — sem imagem**
- **Dado** D-19,
- **Quando** a paridade é declarada,
- **Então** a evidência é a planilha de valores com um teste por linha e a saída real da suíte, **não** imagem composta,
- **E** o que o Jest não mede (pixel renderizado, área de toque, Android, foco em aparelho) está declarado como "sem cobertura".

**Cenário C — Figma inacessível**
- **Dado** o Figma bloqueado,
- **Quando** tento fechar,
- **Então** a feature **não fecha**: aplica-se US-PAR-11.

**Cenário D — o que dá para fechar sem o Figma**
- **Dado** o Figma bloqueado,
- **Quando** o ORLA corrige o que já está decidido e travado por teste,
- **Então** isso pode ser entregue, mas a feature continua "aguardando", sem ser marcada como pronta com apenas um lado atualizado.

### US-PAR-09 — Teste de componente (ajustado)
- **Dado** os componentes ajustados,
- **Quando** a entrega fecha,
- **Então** os testes de `tokens`, `text-field`, `inline-action-button`, `inline-alert`, `state-view`, `tab-bar-item`, `header-icon-button`, `get-initials`, `login`, `perfil`, `index`, `confirm-dialog` e os de menu estão ajustados ao desenho novo,
- **E** a suíte inteira rodou, com **comando e saída reais** e o que ficou sem cobertura declarado (pixel, toque real, Android, aparelho),
- **E** nesta etapa **nenhum teste foi rodado por mim** (só documentação).

### US-PAR-10 — Comportamento e endpoints
- **Dado** as correções aplicadas e a API local no ar,
- **Quando** executo: login válido, login inválido, abrir o Perfil pelo botão do cabeçalho, **Cancelar** no diálogo e **Sair** confirmado,
- **Então** o **único** endpoint chamado no login é `POST /api/v1/auth/login`, com o e-mail no campo `email` do corpo, mesmo com o rótulo "Usuário", e nenhum endpoint novo é chamado,
- **E** o resultado de cada passo é registrado com comando e saída reais,
- **E** o destino pós-login é a rota técnica `/inicio` (D-20), sem exigência de paridade.

### US-PAR-11 — Figma inacessível
- **Dado** o MCP do Figma bloqueado na sessão,
- **Quando** a conferência é tentada,
- **Então** a **saída real** da tentativa é colada no relatório da etapa, sem contornar o bloqueio,
- **E** a feature fica aguardando, sem ser marcada como pronta,
- **E** a pessoa é avisada de que precisa rodar `claude mcp login figma-remote` em sessão interativa.

**Registro desta etapa (BUSSOLA, 2026-11-16):** `mcp__figma-remote__whoami` → `Claude requested permissions to use mcp__figma-remote__whoami, but you haven't granted it yet.` O `whoami` do ESQUADRO numa sessão anterior de 16/11 respondeu com o plano "Time Pessoal" (`F41-planilha-fpdb8.md` §1); em sessões posteriores ORLA e esta voltaram negadas. O acesso varia por sessão.

**Cada agente que precisar do Figma:** ESQUADRO e CRIVO repetem o `whoami` e colam a saída; o CRIVO declara no relatório se **leu o Figma** ou só a planilha do ESQUADRO.

### US-PAR-12 — Dados fictícios nas imagens já versionadas
- **Dado** os 18 arquivos de `docs/design/f41-capturas/`,
- **Quando** o CRIVO os abre,
- **Então** só há dado fictício (`joao.silva`, `0.1.0`), senha mascarada e nenhum token, notificação ou dado real,
- **E** novas capturas, se alguém as tirar, seguem a mesma regra.

### US-PAR-13 — Linha de base para as features de tela seguintes
- **Dado** a F41 fechada,
- **Quando** a F35, F36, F42 ou F43 começar,
- **Então** a linha de base é `F41-valores-fpdb8.md` mais os testes travados e o `tokens.ts`, **não** imagens,
- **E** as imagens de `docs/design/f41-capturas/` ficam como histórico (D-22).

### US-PAR-14 — Higiene de git (vale como na feature)
- **Dado** a feature concluída,
- **Quando** verifico o repositório,
- **Então** os commits são pequenos, em Conventional Commits, sem trailer de coautor, o `git status` não tem pendência e nenhum arquivo gerado, segredo ou binário grande foi versionado.

### US-PAR-15 — Contraste AA com os valores finais
- **Dado** as cores em texto, ícones e bordas de controle de Login, Perfil, diálogo e tab bar,
- **Quando** `python3 -I docs/design/F41-contraste.py` roda,
- **Então** texto atinge 4,5:1 e ícone e borda de controle atingem 3:1: placeholder Flint 5,36:1 sobre branco; borda `#8C8780` 3,56:1 sobre branco e 3,28:1 sobre Pampas; aba selecionada `#EE8279` 4,68:1 sobre petro; "Sair da conta" Crail 4,97:1 sobre Pampas,
- **E** os itens desabilitados (Tide a 50% sobre petro, 2,58:1) são **isentos** por serem inativos, e as bordas Westar do botão "Sair da conta" e do cartão (1,23:1) são **decorativas** (WCAG 1.4.11), ambos por D-18,
- **E** a saída do script, com código de saída 0, fica registrada na entrega.

### US-PAR-16 — Rótulo "Usuário" envia e-mail
**Cenário A — caminho feliz**
- **Dado** a tela de login com o rótulo `login.campoEmail.rotulo` = "Usuário", placeholder "Seu usuário" e teclado de e-mail,
- **Quando** informo um e-mail válido e a senha e confirmo,
- **Então** o corpo enviado a `POST /api/v1/auth/login` é `{ "email": <valor digitado>, "senha": <valor> }` e o login segue como antes.

**Cenário B — validação de entrada**
- **Dado** o campo Usuário vazio,
- **Quando** confirmo,
- **Então** aparece "Informe seu usuário" (chave `login.campoEmail.erroVazio`), sem chamar a API,
- **E** com a senha vazia, aparece "Informe sua senha".

**Cenário C — credencial inválida**
- **Dado** credencial inválida,
- **Quando** a API responde 401,
- **Então** aparece "Usuário ou senha incorretos. Confira os dados e tente novamente." na caixa entre a senha e o botão, **genérica, sem indicar qual campo errou**, e os **dois** campos ficam com borda de 2 px Crail.

**Cenário D — acessibilidade e privacidade**
- **Dado** o leitor de tela,
- **Quando** o foco chega ao campo,
- **Então** ele é anunciado como "Usuário",
- **E** nenhum e-mail, senha ou token aparece em log (`auth-service-logging.test`).

**Cenário E — Perfil**
- **Dado** um usuário logado,
- **Quando** o Perfil abre,
- **Então** a linha `perfil.rotuloUsuario` = "Usuário" mostra o **e-mail** do usuário (a API não devolve nome de usuário separado, D-13).

### US-PAR-17 — Versão do app no Perfil
- **Dado** o Perfil preenchido,
- **Quando** o cartão é exibido,
- **Então** a linha "Versão do app" mostra o valor lido da configuração do Expo por `expo-constants` (hoje `0.1.0`), sem texto fixo no componente, e a diferença para o "1.0.0" do frame é **dado**, não desenho (D-12).
- **Dado** a configuração sem versão,
- **Quando** o Perfil abre,
- **Então** a linha mostra "Não informada" (chave `perfil.versaoIndisponivel`) e a tela não quebra.

### US-PAR-18 — Destino pós-login sem item habilitado (sem paridade, D-20)
- **Dado** um login bem-sucedido ou sessão retomada,
- **Quando** o app aterrissa,
- **Então** a tela é `/inicio`, com cabeçalho "Início", botão de usuário, estado vazio "Em breve" e tab bar de 4 itens desabilitados,
- **E** nenhum fluxo cai em tela sem saída: o botão de usuário leva ao Perfil e a seta do Perfil volta.
- **Dado** sessão inválida ou ausente,
- **Então** o app vai ao Login.
- **Dado** o logout confirmado,
- **Então** o token é removido e o app volta ao Login.
- **E** nenhuma medida, cor ou texto de `/inicio` é cobrada contra frame nesta feature.

## 6. Efeito sobre outras features e documentos

1. **[[F33]]:** US-MENU-01 (aterrissa no Menu com Perfil selecionado), US-MENU-02 ("1 habilitado e 4 desabilitados") e US-MENU-03 deixam de valer como escritos. Não reescrevo o PRD da F33; registro aqui, e o ORLA ajusta `menu-tab-bar.test`, `(menu)/_layout.test` e `menu-routing.test`. O gap de US-MENU-06 permanece.
2. **[[F34]]:** os frames de tab bar de 5 itens (`39:3`, `39:31`, `39:58`, arquivo antigo) deixam de ser referência. Não são apagados.
3. **Briefing, exceção temporária:** o trecho "redesenho aguardando código" para Login, Perfil, logout e tab bar fica **sem efeito**. O texto do briefing é da pessoa e do comandante; **não o editei**. O texto proposto pelo ESQUADRO está em `F41-planilha-fpdb8.md` §7.
4. **[[F39]]:** a F39 redesenha o wireframe de **baixa**. Ela **não edita** os quatro frames de alta desta feature; a propagação baixa → alta dessas quatro telas é desta feature.
5. **[[F40]]:** a pendência de variáveis numéricas no Figma para tokens novos é fechada aqui, pela US-PAR-07 B.
6. **README:** o ORLA já registrou fontes e rota inicial no README principal (`5659cc9`, `2b1825f`). Esta etapa é só documentação: **README sem mudança**, porque não altera instalação, execução, teste, configuração nem funcionalidade. A feature que entrar com dependência ou comando novo atualiza o README na mesma entrega.

## 7. Dúvidas em aberto

**Nenhuma.** As dúvidas do PRD v2 estão fechadas:

| # | Dúvida | Fechamento | Origem |
|---|---|---|---|
| P-01 | Tela inicial pós-login e como alcançar "selecionado" | Rota técnica `/inicio` (opção A) como destino; Início **sem paridade** (D-20); selecionado provado só pelo `TabBarItem` isolado (US-PAR-03 C) | pessoa (opção A implementada) + comandante (escopo) |
| P-02 | Aparelho e modo de execução | Sem aparelho físico; captura dispensada (D-19, US-PAR-04 não se aplica) | pessoa |
| P-03 | Onde as capturas ficam e o limite | Ficam onde estão, como histórico, abaixo de 100 KB cada (D-22) | PO |
| P-04 | Alturas 46/50/62 contra 48/52/64 | Segue o Figma, com `hitSlop` ≥ 48 (premissa 10) | pessoa (aprovação dos frames) |
| P-05 | Barlow Condensed e escudo | Fontes entraram (OFL-1.1, `@expo-google-fonts/*`); escudo fora do aceite (D-21) | pessoa (fonte) + comandante (escudo) |
| P-06 | "Mostrar senha" | Mantido; texto visível "Mostrar"/"Ocultar" (D-11 do ESQUADRO) | pessoa |
| P-07 | Versão exibida | Valor real `0.1.0`; "Não informada" sem valor (US-PAR-17) | pessoa |
| P-11 (do ESQUADRO) | O contorno de 2 px Crail no campo é o foco? | Vale como foco do campo, travado por teste. O ESQUADRO registra na releitura (US-PAR-02 B) o que `10:895` mostra; se divergir, o código se ajusta ao Figma (D-02) | PO (aplicação de D-02) |

## 8. Frames de referência

Arquivo `FPdB8RymAnN81pbKfizdzE`, página "02 — Alta fidelidade" (`20:2132`). Ids lidos pelo ESQUADRO em 16/11 (`get_metadata`); **não reli nesta etapa**.

| Tela | Frame | Id |
|---|---|---|
| Login, estado inicial | 1a — Login | `10:895` |
| Login, credencial inválida | 1b | `10:936` |
| Sem conexão (padrão global) | 1c | `10:981` |
| Perfil | 1av | `10:3842` |
| Diálogo de logout | 1aw | `10:3886` |
| Tab bar, Ordens ativa / Clientes ativa | símbolos | `20:1102` / `20:1340` |
| Cabeçalho com botão de usuário | — | `20:1079` |
| **Aprovados em 16/11 (seção `82:1989`)** | L1, L2, L3, L4 | `82:1990`, `82:2024`, `82:2058`, `82:2098` |
| | P1, P2 | `83:712`, `83:754` |
| | T1, T2 | `83:817`, `83:844` |
| | C1 cores AA | `85:744` |

A seção `62:1529` "Complementos de fluxo" **não** é referência da F41.

## 9. Riscos

| # | Risco | Impacto | Mitigação |
|---|---|---|---|
| R1 | O Figma volta negado por sessão (já ocorreu com ORLA, CRIVO e comigo). US-PAR-07 B, P2, T1 e a releitura de L2 a L4 dependem dele. | Alto | US-PAR-11: saída real, feature aguardando; a pessoa roda `claude mcp login figma-remote`. |
| R2 | D-20 e D-21 foram fixadas pelo comandante e retiram da lista de fechamento dois itens que a revisão humana ainda citava. | Médio | Rastro explícito em §2; se a pessoa discordar, v4 e a US-PAR-08 reabre. |
| R3 | O Jest não mede pixel, toque nem Android: "um teste por linha" prova estilo declarado, não o renderizado. | Médio | Declarado em US-PAR-08 B e US-PAR-09. |
| R4 | O estado "selecionado" da tab bar não aparece no app em execução. | Baixo | Provado só pelo `TabBarItem` isolado, declarado (US-PAR-03 C). |
| R5 | Ionicons diferem do desenho do arquivo. | Baixo | Exceção registrada (D-10). |
| R6 | Árvore de trabalho: há 4 arquivos `docs/product/F44-*.md` não rastreados, **de outra feature**. Podem sujar o `git status` no fechamento (US-PAR-14). | Baixo | Não são da F41 e não os toquei; o dono da F44 decide. |
| R7 | O PRD da F33 e os testes de menu ainda descrevem a tab bar de 5 itens. | Médio | §6 item 1; o ORLA ajusta os testes. |

## 10. Verificado × não verificado (esta etapa)

**Verificado por mim (leitura do repositório e uma chamada de MCP):**
- `mcp__figma-remote__whoami` voltou negado (texto exato em US-PAR-11).
- `tokens.ts` tem `flint` `#6E6A66`, `stone` `#8C8780`, `coral` `#EE8279`, `ringOnBrand` branco, `unavailable` 0,5 e nenhum comentário PROVISÓRIO.
- `strings.ts` tem "Usuário", "Seu usuário", "Informe seu usuário", "Informe sua senha", "Mostrar"/"Ocultar", a mensagem de rede, "Não informada", "Sair da conta?" e os quatro rótulos da tab bar (Ordens, Clientes, Catálogo, Financeiro).
- `auth-service.ts` envia `{ email, senha }`; `login.tsx` usa `keyboardType="email-address"`.
- `app/(menu)/inicio.tsx` existe.
- `docs/design/f41-capturas/`: 18 arquivos, 864 KB, maior com 94.742 bytes.
- `figma.md:4` e `F41-conferencia-paridade-referencias.md:4` apontam para o arquivo novo.

**Não verificado por mim:**
- Qualquer nó, variável ou medida do Figma (acesso negado). Tudo de §8 e a releitura de L2 a L4 vêm do ESQUADRO.
- Nenhum teste rodado nesta etapa. Os nomes e a cobertura dos testes citados vêm das planilhas do ESQUADRO e do ORLA; não reproduzi os 256 testes citados por outros agentes.
- O conteúdo visual das 18 imagens (não as abri); a conformidade de "só dado fictício" é do CRIVO (US-PAR-12).
- A mensagem exata de credencial inválida no `strings.ts` (a linha continua na seguinte) e o texto das respostas P-01 a P-16 da pessoa: não estão no material que recebi, só as decisões que a planilha de valores e a revisão humana citam.

## 11. Tarefas (a numeração continua a da feature)

Mantêm-se as tarefas 1 a 22, com estes ajustes:
- **T2** resolvida: a F39 não edita os quatro frames de alta (premissa 2, §6 item 4).
- **T5, T6 a T11, T19 e T20** (preparar usuário, capturar nos dois lados, anexar capturas): **não se aplicam ao aceite** por D-19. A prova é a planilha de valores e os testes (US-PAR-08 B).
- **T12** passa a ser a planilha de divergências e a de valores, sem pares lado a lado.
- **T14** (apresentar à pessoa) fica cumprida pelo registro das decisões em §2.
- **T17** (tokens e variáveis) só fecha com US-PAR-07 B.
- **T23** (ESQUADRO): links em `figma.md:4` e nas referências (feito, verificado), texto da exceção do briefing (proposto em `F41-planilha-fpdb8.md` §7).
- **T24** (ESQUADRO): reabrir o `FPdB8`, registrar o `whoami` real, criar as 3 variáveis, ajustar P2, religar T1, reler L2 a L4 com o valor lido por linha.
- **T25** (ORLA): ajustar V-L14 e V-L19 conforme a releitura.
- **T26** (ORLA): ajustar os testes de menu da F33.
- **T27** (ORLA): README principal, ou "README sem mudança" com o motivo.
- **T28** (CRIVO): repetir o fluxo contra a API local, registrar os endpoints chamados, declarar se leu o Figma ou só a planilha, e conferir US-PAR-12.
