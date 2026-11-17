# F41 — PRD revisado (v4): paridade com o Figma `FPdB8RymAnN81pbKfizdzE`

PRD — dono: BUSSOLA (Product Owner). Data: 2026-11-16. Rota: BUSSOLA → ESQUADRO → ORLA → CRIVO.
Prioridade P1 · Frontend · Sprint 01.

**v4 (BUSSOLA, 2026-11-16, depois da revisão humana das 22:28):** aplica as decisões da pessoa.
- **D-20 revertida:** o Início **entra no aceite**, por valor (frame I1 `89:971`, aprovado pela pessoa).
- **D-21 revertida:** o escudo **entra no aceite**, por exportação do ESQUADRO e programação do ORLA (novo US-PAR-19).
- **P-01 fechada** como "não se aplica ainda" (US-PAR-03 E, §7).
- **R-15** (campo em carregamento do L2) decidida a favor do código; **O-1, O-2 e O-3** decididas (§2, D-24 e D-25).
- **D-22 substituída:** os 6 `par-*.png` antigos saem do repositório (§2).
- US-PAR-01 a 08 ganham o bloco "**Estado em 16/11 · Prova**", que aponta o estado real e o arquivo que o sustenta.
- US-PAR-09, 10, 12, 13, 15 e 18 mudam só onde §5 diz; **US-PAR-19 é novo**.

**v4.1 (BUSSOLA, 2026-11-17):** instrução do comandante: levar S-1 e S-2 à pessoa, reescrever o critério 3 e dar a cada US-PAR estado e prova esperada, sem abrir escopo.
- **S-1 e S-2 seguem abertas.** Não tenho canal direto com a pessoa nesta sessão e **não há resposta dela no material que recebi**. As perguntas estão em §7.1, em forma de resposta fechada, com o campo "Resposta literal da pessoa" **vazio**. Nada foi preenchido por suposição; a leitura adotada da S-1 continua marcada como leitura minha, não como decisão.
- **Critério 3 (US-PAR-03) reescrito** como texto único e autossuficiente, com o bloco "Texto para o quadro" que substitui o enunciado antigo (Perfil na tab bar em padrão, selecionado e foco; ordem Clientes/Veículos, Catálogo, Ordens de Serviço, Financeiro; "nos dois lados" por captura). As decisões que o sustentam (D-05, D-19, D-23) já existiam; **nenhum cenário novo e nenhum escopo novo**.
- **Estado e prova esperada** escritos nos critérios que ainda não tinham o bloco (US-PAR-09, 10, 11, 14, 15, 16, 17) e consolidados em §5.1 para os 19.
- **Conferido contra o repositório em 17/11** (§10): suíte e contraste rodados por mim; PNG do L2 alterado e não commitado na árvore; os 4 `F44-*.md` não rastreados.
- **Dúvida nova S-3** (foco da tab bar: T1 desenha foco em item selecionado e o app só tem item desabilitado). Registrada, não bloqueia.

**v4.2 (BUSSOLA, 2026-11-17, depois da revisão humana das 12:24 e da instrução do comandante):** aplica a decisão da pessoa sobre o protocolo e fecha o quadro de pendências, sem reabrir nada da v4.
- **Protocolo de captura (critério 4):** a pessoa decidiu em 17/11 que **não precisa de captura em aparelho físico** e que o protocolo de **simulador (iPhone 17, iOS 27.0)** de `docs/design/F41-capturas-app-orla.md` vale como linha de base. Novo **D-26** (§2); a **premissa 13** (§4) reescreve a premissa 9 da feature; **US-PAR-04** reescrito (§5). As tarefas **5, 11 e 19** fecham como **dispensadas por decisão da pessoa**, sem refazer captura (§11).
- **Critério 3 (US-PAR-03):** o "Texto para o quadro" ganhou a cláusula do Início (a tab bar vive em `/inicio`, que está no aceite por valor contra o frame I1, D-20) e a remissão ao escudo (US-PAR-19). Nenhum cenário novo, nenhuma decisão nova.
- **S-1, S-2, S-3 e o destino dos 4 `F44-*.md` (R6): nenhuma resposta literal da pessoa chegou.** Os campos da §7.1 seguem vazios e nada foi preenchido por mim. A observação geral de 17/11 ("critério 8 segue aberto só pelo escudo (S-2) e o critério 14 pelos 4 arquivos `docs/product/F44-*`") é registrada como **indício favorável à leitura A da S-1**, não como resposta literal. O quadro **decidida × aberta** está na **§7.2**.
- **Estado conferido hoje por mim, em `c721983`:** `npm --prefix apps/mobile test -- --silent` deu 37 suítes e **292 testes** passando (eram 289; entrou o teste da cor do campo desabilitado, `c21436c`); `python3 -I docs/design/F41-contraste.py` deu "OK: todos os pares obrigatórios atingem o alvo"; `git log main..HEAD --format=%B | grep -ci co-authored-by` deu 0; `git status --short` mostra só os 4 `F44-*.md` não rastreados. **Escudo:** exportado (PNG 1x, 2x e 3x e SVG em `docs/design/f41-ativos/escudo/`, commit `0c0f1b4`) e **não programado** (`apps/mobile` não tem pasta `assets`, e `brand-header.tsx` comenta que o escudo "ainda não entra"). Consequências no §5.1.

**Conflito de instrução, exposto para o REGENTE:** a instrução desta etapa pedia "D-20 e D-21 fora do aceite, com o motivo". A revisão humana das 22:28 decidiu o contrário (critério 8 e observação geral). A decisão da pessoa é mais recente e prevalece; o motivo original **continua escrito** em §2 (linhas D-20 e D-21), para o rastro não se perder. A observação geral diz "D-20 confirmada" e o critério 8 diz "PRD v4 reverte a D-20": li como a mesma decisão (a D-20 cai e o Início entra por valor), o que bate com `docs/design/F41-valores-fpdb8.md` §17.3 ("aprovado pela pessoa em 16/11; D-20 cai"). Se a leitura estiver errada, é a dúvida **S-1** (§7), com o caminho de volta descrito.

Base do documento: ramo `feat/f41-paridade-fpdb8-codigo`, código em `12c5e78`, sobre a `main` em `348a43e` (F40 já mergeada pela PR #10). A tab bar de 4 itens vem de `361989a`.


**Depende de:** [[F25]], [[F30]], [[F33]], [[F34]], [[F40]] (já na `main`).
**Altera por decisão da pessoa (16/11):** [[F33]] (US-MENU-01, 02 e 03; ver §6).

Este documento **substitui** o PRD v2 da F41 (commit `00f1f17`) e, para a F41, os critérios US-PAR-01 a 18 da feature, exceto US-PAR-14, que vale como está. As dúvidas P-01 a P-07 do v2 estão fechadas em §7; resta só a **S-2** (licença do escudo, que é da pessoa) e a **S-1** (leitura da D-20), esta com a leitura adotada e sem bloquear nada; a v4.1 acrescenta a **S-3** (foco da tab bar), também sem bloquear.

Nada foi corrigido em código nem no Figma nesta etapa. Só decisão, escopo e critério.

## 1. Contexto

1. **A F40 já está na `main`.** A F41 é a **nova linha de base** das features de tela seguintes (F35, F36, F42, F43). A prova de "sem mudança visual" da F40 (US-COMP-11) continua sendo sobre `c815235`; a F41 muda o visual de propósito.
2. **Esta feature é a "feature de código posterior à F41"** que o briefing previa para Login, Perfil, logout e tab bar. A F41 corrige direto contra o arquivo novo, e a exceção temporária "redesenho aguardando código" **deixa de ter efeito** para essas quatro telas.
3. **O código já foi corrigido em grande parte** no ramo `feat/f41-paridade-fpdb8-codigo` (commits `388ac14` a `c627ac6`: tokens v2, Login, Perfil, diálogo, tab bar de 4 itens, botão de usuário, fontes Barlow Condensed e Inter, versão do app, cores AA). O que resta está em §5, US-PAR-08.
4. **A planilha de divergências e a planilha de valores já existem:** `docs/design/F41-planilha-fpdb8.md` (ESQUADRO, refeita do zero) e `docs/design/F41-valores-fpdb8.md` (uma linha por valor, com o teste que o trava). Elas são a **prova de paridade** desta feature (D-19 abaixo). A planilha de 13/11, feita contra o arquivo `DLqb…`, não vale mais.
5. **Acesso ao Figma nesta sessão:** `mcp__figma-remote__whoami`, chamado por mim em 2026-11-16, voltou `Claude requested permissions to use mcp__figma-remote__whoami, but you haven't granted it yet.` Não li nenhum nó e não contornei. Efeito: US-PAR-11 (§5).
6. **Material novo desde a v3.1:** capturas do Figma em `docs/design/f41-capturas/final-2026-11-16/` (15 PNGs, só lado Figma; `F41-valores-fpdb8.md` §17.5); capturas do app no simulador e pares em `docs/design/f41-capturas/app-2026-11-16-orla/` (22 arquivos; `F41-capturas-app-orla.md`); releituras do ESQUADRO em `F41-valores-fpdb8.md` §17 a §19. **Nesta etapa não tenho a ferramenta `mcp__figma-remote__*`** (ferramenta ausente, não login negado): nada do Figma foi lido por mim, tudo o que digo do Figma vem da planilha do ESQUADRO.

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
| **D-20** | **Início entra no aceite, por valor (v4; reverte a D-20 da v3).** A rota `/inicio` (cabeçalho, botão de usuário, estado vazio "Em breve" e tab bar de 4 itens desabilitados) tem paridade contra o frame I1 `89:971`, aprovado pela pessoa em 16/11. A prova é a planilha (`F41-valores-fpdb8.md` §17.3 e §19.2) e os testes (`inicio.test`, `menu-tab-bar.test`); as capturas são apoio (D-19). Estado: só o vazio existe; carregando, erro e preenchido são "não se aplica" (a tela é estática e não chama API). **Motivo da v3 (histórico):** eu não aceitava paridade de uma tela sem frame aprovado pela pessoa. O frame foi criado e aprovado, então o motivo caiu. | pessoa (revisão humana 16/11, 22:28) |
| **D-21** | **Escudo entra no aceite (v4; reverte a D-21 da v3).** O ESQUADRO exporta o nó do escudo 84 × 96 de `10:895` e registra origem e licença; o ORLA programa em PNG 1x, 2x e 3x (o app não tem `react-native-svg`, verificado em `apps/mobile/package.json`) e cobre com teste. **O registro de origem e licença continua sendo o portão** (US-PAR-19 A, dúvida S-2): sem ele o ativo não entra e nada é improvisado. **Motivo da v3 (histórico):** a D2 (titularidade e licença da imagem) estava sem resposta e eu não aceitava ativo sem licença. A pessoa decidiu que a exportação resolve a parte técnica; a parte jurídica segue registrada em S-2. | pessoa (revisão humana 16/11, 22:28) |
| D-22 | **Capturas: os 6 `par-*.png` antigos saem do repositório** (`par-cabecalho-10-981`, `par-login-erro-10-936`, `par-login-vazio-10-895`, `par-logout-10-3886`, `par-perfil-10-3842`, `par-tabbar-20-1102`; nenhum documento os cita, e são de 11:20, anteriores às capturas finais). Eles enganam: parecem prova de paridade final e não são. Saem com `git rm`; o histórico do git os guarda. **Ficam como referência** `docs/design/f41-capturas/final-2026-11-16/` (15 PNGs do Figma) e `docs/design/f41-capturas/app-2026-11-16-orla/` (22 arquivos do app e pares); os 12 `figma-fpdb8-*.png` da raiz ficam como histórico "antes", sem valor de prova. Um `LEIA-ME.md` na pasta diz qual é qual. Substitui o "nada é removido" da v3. | REGENTE confirma a D-19 sobre a pasta (revisão 16/11); a escolha entre remover e marcar é minha (PO) |
| D-23 | **P-01, estado selecionado da tab bar: "não se aplica ainda".** As 4 abas estão desabilitadas e nenhuma navega, então não há rota para ficar selecionada. O ESQUADRO anota em `20:1102` e `20:1340` que o estado é futuro. **Reabre quando uma aba for habilitada.** É a única exceção à premissa 5 (estado só no frame normalmente é divergência real), por decisão da pessoa, e tem gatilho. | pessoa (revisão humana 16/11) |
| D-24 | **R-15: campo em carregamento do L2 `82:2024`.** O código desenha o campo desabilitado em cinza (`inputRowDisabled`, `color.surface.skeleton`, `text-field.tsx`); a decisão é a favor do **código**, então o **Figma muda**: o ESQUADRO atualiza o L2 para a cor do skeleton, ligada à variável, reexporta o PNG e registra em `docs/design/F41-contraste.py` que campo desabilitado é isento. O ORLA adiciona o teste que trava a cor do campo desabilitado (hoje `text-field.test` só cobre `editable` e `accessibilityState`). | pessoa (revisão humana 16/11) |
| D-25 | **O-1, O-2 e O-3.** **O-1** (ícone do círculo do P2: wifi cortado no frame, `cloud-offline-outline` no app): real, **coberta pela exceção D-10**; Ionicons mantidos, nada muda. **O-2** (frame `10:936` sem "Mostrar" no campo Senha): o frame é antigo; decidido a favor do **código**, então o ESQUADRO atualiza `10:936` com "Mostrar" e reexporta o PNG. **O-3** (anel do P1 `83:712` contra `ActivityIndicator` nativo): **só de plataforma** (ADR-014:216); nada muda. O ESQUADRO registra a classificação na planilha de valores com o par que prova. | pessoa (revisão humana 16/11) |
| **D-26** | **Protocolo de captura = simulador, sem aparelho físico (v4.2).** O protocolo registrado em `docs/design/F41-capturas-app-orla.md` (simulador iPhone 17, iOS 27.0, Expo Go com Metro na 8082, tema claro, texto `large`, retrato, 1206 × 2622 px) **vale como linha de base**. **Nenhuma captura nova** é exigida; as tarefas 5, 11 e 19 ficam **dispensadas**. A D-19 continua valendo: a prova de aceite é a planilha mais os testes, e as capturas são a linha de base visual de apoio. Lacuna que o protocolo declara: a versão do Expo Go não foi lida. | pessoa (revisão humana 17/11, critério 4) |

**Rastro das reversões (v4):** a D-20 e a D-21 nasceram na v3 como instrução do comandante (o risco R2 já previa que a discordância da pessoa viraria v4). A pessoa decidiu o contrário em 16/11, na revisão das 22:28, e esta versão a aplica. A instrução desta etapa pedia manter as duas fora do aceite; **não segui essa parte**, porque a decisão da pessoa é mais recente, e deixei os motivos originais escritos nas linhas D-20 e D-21. Se o REGENTE quiser o contrário, a decisão é dele com a pessoa, e o texto da v3.1 está no git em `361989a` (US-PAR-08 e US-PAR-18 voltam a ele).

## 3. Escopo

### Dentro do escopo
- Login (vazio, preenchido, carregando, erro de credencial, erro de conexão, sessão expirada), Perfil (carregando, erro, preenchido), diálogo de logout, cabeçalho com botão de usuário e tab bar (padrão, selecionado, foco e desabilitado) contra o arquivo `FPdB8`.
- Planilha de valores com uma linha por valor, cada uma com **teste que trava texto, token e medida do frame**.
- **Início** (rota `/inicio`, frame I1 `89:971`), por valor: cabeçalho, estado vazio e tab bar de 4 itens desabilitados (D-20).
- **Escudo** 84 × 96 do Login: exportação pelo ESQUADRO com origem e licença registradas, programação pelo ORLA em PNG 1x, 2x e 3x e teste (D-21, US-PAR-19).
- Atualização no Figma, pelo ESQUADRO: L2 `82:2024` com o campo em carregamento na cor do skeleton (D-24) e `10:936` com "Mostrar" no campo Senha (D-25), com os PNGs reexportados.
- Releitura de L2, L3 e L4 no Figma pelo ESQUADRO, com o valor lido registrado em cada linha (V-L14 e V-L19).
- As três variáveis de cor no Figma (placeholder, borda de campo, aba selecionada), o ajuste do P2 `83:754` e o T1 `83:817` religado ao coral `#EE8279`.
- Diff de `tokens.ts` contra as variáveis do arquivo, com o Figma como fonte, e contraste AA recalculado (`docs/design/F41-contraste.py`).
- Testes de componente ajustados e a **suíte inteira** rodada.
- Repetição do fluxo contra a API local depois das correções.

### Fora do escopo
- Tela ou estado novo de Início além do I1 (carregando, erro e preenchido não existem: a tela é estática).
- Qualquer ativo exportado do Figma **além do escudo** (fotos, outros ícones: os Ionicons seguem, D-10).
- **Captura do app e pares lado a lado como prova de aceite** (D-19). As que existem ficam como apoio.
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
5. Estado que existe só em um dos lados é divergência real. Só estado que não existe em nenhum dos lados é "não se aplica", com justificativa. **Única exceção, por decisão da pessoa:** o estado selecionado da tab bar (D-23), com gatilho de reabertura.
6. Plataforma: barra de status (conteúdo), renderização de fonte do sistema e tamanho de aparelho. Glifo nativo é plataforma; sombra é real (D-16).
7. **Dados pessoais (LGPD).** O Perfil exibe o **e-mail do usuário logado** sob o rótulo "Usuário" (D-13), como já exibia antes sob "E-mail". Finalidade: identificar na tela o usuário autenticado. Base legal: a registrada em `docs/product/F30-appsec-lgpd-login-perfil.md` (art. 7º, V, execução de contrato, com apoio no art. 7º, IX), cuja confirmação é do controlador e não é alterada por esta feature. Retenção: no SecureStore do aparelho até logout, 401 ou desinstalação (mesmo documento); nenhuma coleta nova. Nenhum e-mail, senha ou token em log; em teste, só dado fictício. A versão do app não é dado pessoal.
8. Como a captura foi dispensada como prova de aceite (D-19), o que existe é **apoio**: as capturas do app no simulador (`app-2026-11-16-orla`: dados fictícios `Maria Teste` e `maria.teste@exemplo.invalid`, senha mascarada em 14 pontos, sem rede nem token, segundo `F41-capturas-app-orla.md`) e as do Figma (`final-2026-11-16`: dados fictícios do próprio arquivo, segundo `F41-valores-fpdb8.md` §17.5). Finalidade: apoiar a conferência visual. Base legal: não aplicável, sem dado pessoal real. Retenção: ficam no repositório como histórico (D-22). **Não abri nenhuma imagem nesta etapa**; conferir que só há dado fictício é do CRIVO (US-PAR-12).
9. Perfil fora da tab bar altera o PRD da F33 (§6). Registro; **não reescrevo** o PRD nem os critérios da F33.
10. Alturas do Figma (campo 46, botão 50, tab bar 62) valem sobre os tokens da casa (48, 52, 64). A área de toque efetiva continua ≥ 48 por `hitSlop` (coberto por `header-icon-button.test` e `text-field.test`; o Jest não mede toque real, ver US-PAR-09).
11. **Escudo (D-21).** Ativo de marca, sem dado pessoal; finalidade: identidade visual da tela de Login. Base legal e retenção: não se aplicam. O que pesa é a **licença**: sem registro de origem e de permissão de uso, o ativo não entra no repositório. Formato: o app não tem `react-native-svg` nem pasta `assets` (verificado), então o padrão é PNG 1x, 2x e 3x; vetor só se o ORLA justificar a dependência nova, e dependência nova atualiza o README.
12. **Tamanho do escudo (proposta minha, sem resposta da pessoa):** cada PNG até 50 KB, dentro do padrão da casa de não versionar binário grande. Se o ESQUADRO exportar acima disso, ele registra o motivo.
13. **Protocolo de captura (v4.2, reescreve a premissa 9 da feature, D-26).** Decisão da pessoa em 17/11: **sem aparelho físico**; vale o protocolo de **simulador iPhone 17, iOS 27.0** de `docs/design/F41-capturas-app-orla.md` (Expo Go, Metro na 8082, tema claro, texto `large`, retrato, 1206 × 2622 px, barra de status em 9:41), como **linha de base** das features de tela seguintes. Sem captura nova. Trocar de simulador ou de configuração obriga refazer as capturas afetadas. As capturas existentes usam só dado fictício (`Maria Teste`, `maria.teste@exemplo.invalid`, senha mascarada em 14 pontos, sem rede, sem token). **Limites declarados:** (a) a versão do Expo Go não foi lida; (b) as capturas vêm de uma rota temporária apagada que compõe os componentes reais, então provam aparência de componente, não a tela de `app/*.tsx` nem o fluxo contra a API; (c) o briefing chama esta linha de base de "da F40", mas a F40 já está na `main` (§1), então na prática ela serve às features seguintes (US-PAR-13). Finalidade e retenção: as da premissa 8.

## 5. Critérios de aceitação (Gherkin)

Reescritos na v4: US-PAR-01 a 08 (todos ganham o bloco **Estado em 16/11 · Prova**; 02 C, 03 E, 05, 06, 07 e 08 têm conteúdo novo), 12, 13 e 18. Ajustados: 09, 10 e 15. **Novo: US-PAR-19.** Vale como na feature: US-PAR-14. Sem alteração: 11, 16 e 17. Os IDs `US-PAR-NN` rastreiam até teste. **Na v4 (16/11) nenhum teste foi rodado por mim**: os arquivos de teste citados tiveram a existência conferida por listagem, não a execução. **Na v4.1 (17/11) rodei a suíte inteira e o script de contraste (§10).** Os blocos "Estado em 16/11" são da v4; os "Estado em 17/11 · Prova esperada" são da v4.1. **Na v4.2 o estado vigente de cada critério é o do §5.1**, que é a leitura atual; onde um bloco antigo diz "aberto" e o §5.1 diz "feito", vale o §5.1 (o commit que fechou está citado lá).

### US-PAR-01 — Cobertura de telas e prova
- **Dado** Login, Perfil, diálogo de confirmação de logout, cabeçalho com botão de usuário, tab bar e **Início** do arquivo `FPdB8RymAnN81pbKfizdzE`,
- **Quando** a conferência termina,
- **Então** cada tela tem em `docs/design/F41-valores-fpdb8.md` uma linha por valor, com o nó do frame, o valor lido, o valor do código e o **teste que o trava**,
- **E** nenhuma linha está marcada "FALTA" no campo do teste,
- **E** `docs/design/figma.md:4` e `docs/design/F41-conferencia-paridade-referencias.md:4` apontam para o arquivo novo (verificado por mim em 16/11),
- **E** não é exigida imagem composta nem captura do app para o aceite (D-19); as que existem são apoio.

**Estado em 16/11 · Prova**
- **Estado: parcial.** Login, Perfil, diálogo, cabeçalho, tab bar e Início têm linhas em `F41-valores-fpdb8.md` §4 e §17 a §19; o Início (I1) foi lido por valor em §17.3 e §19.2. **Aberto 1:** a palavra "FALTA" ainda aparece 22 vezes na planilha (contagem por `grep`); as marcas da §4 são anteriores à §14 e à §16 do ORLA, que dizem ter coberto as lacunas da §6, e **ninguém reconciliou** as duas coisas. É tarefa T32. **Aberto 2:** o escudo (US-PAR-19) ainda não tem linha com valor lido nem teste.
- **Prova de apoio, Figma:** `docs/design/f41-capturas/final-2026-11-16/` (15 PNGs: `login-*`, `perfil-*`, `dialogo-logout-10-3886`, `tabbar-*`, `inicio-vazio-I1-89-971`).
- **Prova de apoio, app:** `docs/design/f41-capturas/app-2026-11-16-orla/` (`app-*.png` e `lado-a-lado-*.png`: Login em 6 estados, Perfil em 3, diálogo e Início). A tab bar do app aparece em `lado-a-lado-inicio.png`. Protocolo em `F41-capturas-app-orla.md`.
- **Limite:** as capturas do app vêm de uma rota temporária (apagada) que compõe os componentes reais com props fixas; provam aparência de componente, **não** a tela de `app/*.tsx` nem o fluxo contra a API (`F41-capturas-app-orla.md`, "Como as capturas foram feitas").

### US-PAR-02 — Cobertura dos estados
**Cenário A — cada estado trava texto, token e medida**
- **Dado** Login (vazio `10:895`, preenchido L1 `82:1990`, carregando L2 `82:2024`, erro de credencial `10:936`, erro de conexão L3 `82:2058`, sessão expirada L4 `82:2098`), Perfil (carregando P1 `83:712`, erro P2 `83:754`, preenchido `10:3842`) e Início (vazio I1 `89:971`),
- **Quando** reviso a planilha de valores e a suíte,
- **Então** cada estado tem pelo menos um teste que trava o **texto** (chave de i18n), o **token** de cor e a **medida** do frame, e o teste falha se o valor mudar,
- **E** o que não existe nos dois lados está como "não se aplica" com justificativa: Início carregando, erro e preenchido, porque a tela é estática e não chama API.

**Cenário B — releitura de L2, L3 e L4 (feita)**
- **Dado** que V-L14 (L2: "Entrando…" e opacidade do botão) e V-L19 (L4: texto da sessão expirada) estavam "a conferir",
- **Quando** o ESQUADRO reabriu o arquivo `FPdB8` e releu L2, L3 e L4,
- **Então** o valor lido de cada linha está registrado em `F41-valores-fpdb8.md` §17.2 e §19.2 (texto "Entrando…", opacidade 100%, caixas de L3 e L4),
- **E** o código e o teste correspondente foram ajustados ao valor lido (R-1, R-2 e R-11),
- **E** se o Figma estiver inacessível numa releitura futura, vale US-PAR-11.

**Cenário C — L2 com campo em carregamento (R-15) e `10:936` com "Mostrar" (O-2) — v4**
- **Dado** que o código desenha o campo em carregamento em cinza (`color.surface.skeleton`) e que o L2 `82:2024` ainda não o desenha assim,
- **Quando** o ESQUADRO atualiza o L2 para a cor do skeleton, ligada à variável, e reexporta `login-carregando-L2-82-2024.png`,
- **Então** o L2 e o código mostram a mesma cor, o `get_variable_defs` do L2 devolve o mesmo hex do token, e existe teste de componente que trava a cor do campo desabilitado,
- **E** `10:936` desenha "Mostrar" no campo Senha e `login-erro-credencial-10-936.png` foi reexportado.

**Estado em 16/11 · Prova**
- **A: sustentado por teste, não executado por mim.** Arquivos conferidos por listagem: `app/login.test.tsx`, `app/perfil.test.tsx`, `app/(menu)/inicio.test.tsx`, `text-field.test`, `error-state.test`, `state-view.test`. A coluna "Trava" da planilha tem as marcas FALTA de US-PAR-01.
- **B: feito**, valores em `F41-valores-fpdb8.md` §17.2 e §19.2.
- **C: aberto.** A atualização do L2 e do `10:936` é do ESQUADRO e o teste da cor é do ORLA; **nenhum dos dois foi feito até esta etapa** (tarefas T29 e T31).
- **Prova de apoio:** `app-2026-11-16-orla/lado-a-lado-login-{vazio,preenchido,carregando,credencial,rede,expirada}.png`, `lado-a-lado-perfil-{carregando,erro}.png`, `lado-a-lado-perfil.png`, `lado-a-lado-inicio.png`; lado Figma em `final-2026-11-16/`.

### US-PAR-03 — Tab bar de 4 itens desabilitados, sem Perfil (reescrito na v3.1; cenário E fechado na v4; texto para o quadro na v4.1; Início e escudo no texto na v4.2)

**Texto para o quadro (substitui o enunciado antigo do critério 3 na feature):**

> **US-PAR-03 Cenário cobertura da tab bar:** **Dado** a tab bar do arquivo `FPdB8RymAnN81pbKfizdzE` renderizada em `/inicio`, **Quando** reviso o código, os testes e os frames `20:1102`, `20:1340`, `83:817` e `83:844`, **Então** há 4 itens, sem Perfil, na ordem Ordens, Clientes, Catálogo, Financeiro, todos desabilitados a 50% de opacidade, anunciados como indisponíveis e sem navegação, **E** o anel de foco é branco de 2 px e vive no `TabBarItem`, provado por teste isolado, **E** o estado selecionado é "não se aplica ainda" (D-23) e reabre quando a primeira aba for habilitada, **E** o Perfil abre pelo botão de usuário do cabeçalho e não aparece na tab bar, **E** a tab bar vive em `/inicio`, que **está no aceite da F41** por valor contra o frame I1 `89:971` (D-20, US-PAR-18), **E** o escudo do Login também **está no aceite**, pelo US-PAR-19 (D-21), fora deste cenário. A prova é a planilha de valores mais os testes, não captura (D-19).

**O que mudou em relação ao enunciado antigo (e por quê):**

| Enunciado antigo | Agora | Origem |
|---|---|---|
| Perfil aparece na tab bar em padrão, selecionado e foco | **Não existe item Perfil na tab bar**; o Perfil abre pelo botão de usuário do cabeçalho | D-05 (pessoa) |
| Desabilitados na ordem Clientes/Veículos, Catálogo, Ordens de Serviço, Financeiro | Ordem **Ordens, Clientes, Catálogo, Financeiro**, com rótulos curtos do frame | D-05; frames `20:1102` e `20:1340` |
| Perfil habilitado e 4 desabilitados (premissa 8 da feature, travada em 09/11) | 4 desabilitados e nenhum habilitado; a premissa 8 fica superada | D-05 (16/11, mais recente que o travamento de 09/11) |
| Estado selecionado exigido nos dois lados | **Não se aplica ainda**: nenhuma aba navega, então não há rota para ficar selecionada; gatilho de reabertura no cenário E | D-23 (pessoa) |
| Conferência "nos dois lados" por captura lado a lado | Conferência por valor (planilha) mais teste; captura é só apoio | D-19 (pessoa) |
| Enunciado sem menção a Início nem a escudo | A tab bar é provada em `/inicio`, que está no aceite (US-PAR-18); o escudo está no aceite pelo US-PAR-19 | D-20 e D-21 (pessoa, v4) |

Nenhuma linha da tabela abre escopo: cada uma só alinha o texto do critério a uma decisão já registrada em §2.

Escrito sobre o que `MenuTabBar` (`apps/mobile/src/components/menu/menu-tab-bar.tsx`) renderiza hoje e sobre os frames do arquivo `FPdB8` (símbolos `20:1102` Ordens ativa e `20:1340` Clientes ativa; T1 `83:817` e T2 `83:844` aprovados). A tab bar só existe dentro de `MenuShell`, ou seja, **só na rota `/inicio`**; o Perfil (`app/perfil.tsx`) fica fora do grupo `(menu)` e não a mostra. Os valores do lado Figma vêm da planilha do ESQUADRO (`F41-valores-fpdb8.md` §4.4), não de leitura minha (ver §10).

**Cenário A — itens, ordem e rótulos**
- **Dado** um usuário autenticado que chega a `/inicio`,
- **Quando** a tab bar é exibida,
- **Então** há exatamente **4** abas (papel `tab`, dentro de um `tablist`), na ordem **Ordens, Clientes, Catálogo, Financeiro**,
- **E** os rótulos visíveis vêm das chaves `menu.tabbar.ordens.rotulo`, `menu.tabbar.clientes.rotulo`, `menu.tabbar.catalogo.rotulo` e `menu.tabbar.financeiro.rotulo` ("Ordens", "Clientes", "Catálogo", "Financeiro"; **não** "Ordens de Serviço" nem "Clientes e Veículos"),
- **E** a barra mede **62** de altura, o ícone **22**, o rótulo é Inter Medium **11** e há **4** entre ícone e rótulo,
- **E** **não existe item Perfil** na barra.

**Cenário B — desabilitado e anunciado**
- **Dado** que nenhum módulo está programado,
- **Quando** olho ou percorro a tab bar com leitor de tela,
- **Então** os 4 itens estão com ícone e rótulo a **50%** de opacidade (T2 `83:844`), com `selected: false` e `disabled: true`,
- **E** cada um é anunciado como "<nome>, indisponível nesta versão" (chaves `menu.tabbar.<item>.indisponivel`), de modo que o estado não depende só de opacidade ou cor,
- **E** tocar num item não navega nem chama nenhum endpoint.

**Cenário C — foco**
- **Dado** o foco entrando num item,
- **Quando** ele está focado,
- **Então** aparece um anel **branco de 2 px, com respiro de 2 px e raio 10** (T1 `83:817`, anel `84:786`), só enquanto focado, e **não** o anel petro, que some sobre a barra petro,
- **E** a prova é o teste de `TabBarItem` isolado; o foco real de teclado e de leitor de tela em aparelho continua em **US-MENU-06**, "não alcançável sem aparelho", sem prova inventada.

**Cenário D — sem sessão (erro e borda)**
- **Dado** sessão ausente, inválida ou expirada,
- **Quando** o app tenta abrir `/inicio`,
- **Então** a tab bar **não é renderizada** e o app vai ao Login (`(menu)/_layout.tsx` devolve `null` e chama `replace('/login')`),
- **E** o logout confirmado também leva ao Login (US-PAR-18).

**Cenário E — estado selecionado: "não se aplica ainda" (decidido pela pessoa em 16/11, P-01 e D-23)**
- **Dado** que o frame tem item ativo (`20:1102` e `20:1340`: ícone e rótulo `#EE8279`, SemiBold 11, sem pílula) e que `menu-tab-bar.tsx:62` fixa `selected={false}` em todos os itens,
- **Quando** o app roda,
- **Então** o estado selecionado não é renderizado, e isso **não é divergência aberta**: as 4 abas estão desabilitadas e nenhuma navega, então **não há rota para ficar selecionada**,
- **E** o estado existe só dentro de `TabBarItem`, travado por `tab-bar-item.test` isolado, e nos frames `20:1102` e `20:1340`, que o ESQUADRO anota como "estado futuro" (anotação ainda por fazer, T29),
- **E** este é o **único** caso em que estado presente no frame e ausente no código fica como "não se aplica" (exceção à premissa 5, por decisão da pessoa),
- **E** **gatilho de reabertura:** quando uma feature de módulo (F35, F36, F42 ou F43) habilitar a primeira aba, o selecionado vira critério dela e este cenário reabre.


**Cenário F — cabeçalho com botão de usuário (fora da tab bar, mantido do v3)**
- **Dado** uma sessão autenticada,
- **Quando** olho o cabeçalho,
- **Então** há botão de usuário 36 × 36, raio 8, fundo branco a 12%, ícone de pessoa 18, nome acessível "Perfil" (`cabecalho.usuario.rotulo`), papel de botão e área de toque ≥ 48 por `hitSlop`,
- **E** tocá-lo abre o Perfil, que mostra a seta de voltar com nome acessível próprio (`cabecalho.voltar.rotulo` = "Voltar"),
- **E** a ordem de foco no cabeçalho é: título, botão de usuário, conteúdo, tab bar; no Perfil: seta de voltar, título, conteúdo.

**Sem cobertura (declarado):** pixel renderizado, área de toque real, Android e aparelho. Não localizei teste que trave a opacidade do **ícone** (o teste de 50% lê só o rótulo), a cor de fundo petro da barra (V-T04 "FALTA" na planilha) nem a largura máxima de 480; ficam como lacuna para o ORLA decidir se cobre.

**Estado em 16/11 · Prova**
- **A, B, D e F: sustentados por leitura de código (v3.1) e por teste, não executado por mim.** Arquivos conferidos por listagem: `components/menu/menu-tab-bar.test.tsx`, `tab-bar-item.test`, `app/(menu)/_layout.test.tsx`, `header-icon-button.test`. O código atual ainda tem `selected={false}` na linha 62 de `menu-tab-bar.tsx` (verificado por `grep` hoje).
- **C (foco):** só por teste de `TabBarItem` isolado; **sem captura do app**, porque o simulador sem teclado nem toque não produz foco (`F41-capturas-app-orla.md`, "Não capturado"). Foco real continua em US-MENU-06.
- **E: não se aplica ainda** (D-23). Não há mais "divergência aberta" de tab bar.
- **Prova de apoio, Figma:** `final-2026-11-16/tabbar-desabilitada-T2-83-844.png`, `tabbar-foco-T1-83-817.png`, `tabbar-ordens-selecionado-20-1102.png`, `tabbar-clientes-selecionado-20-1340.png`. **App:** `app-2026-11-16-orla/lado-a-lado-inicio.png` (4 abas a 50%, nenhuma selecionada).
- **Perfil sem tab bar:** o frame `10:3842` não desenha tab bar (leitura do ESQUADRO, `F41-valores-fpdb8.md` §19.4) e `perfil.test` tem o caso "without a tab bar".
- **Estado em 17/11 · Prova esperada (BUSSOLA).** `npm --prefix apps/mobile test -- --silent`, rodado por mim em `454a67b`: 37 suítes e 289 testes, todos verdes (inclui `menu-tab-bar.test`, `tab-bar-item.test`, `(menu)/_layout.test`, `perfil.test` e `integration/menu-routing.test`). `menu-tab-bar.tsx` tem 4 `ENTRIES` na ordem ordens, clientes, catalogo, financeiro e `selected={false}` na linha 62 (`grep`). O código em `apps/` não mudou desde `c242b6f` (`git diff --stat c242b6f HEAD -- apps` sem saída). **Para o critério fechar, a prova esperada é:** (1) a suíte acima verde na entrega final; (2) a anotação "estado futuro" em `20:1102` e `20:1340`, feita pelo ESQUADRO (T29, ainda não feita); (3) a linha V-T da planilha de valores sem "FALTA" (T32). **Estado: A, B, D, E e F sustentados por teste; falta só a anotação do Figma e a reconciliação das marcas.**
- **Lacuna registrada, S-3 (§7, não bloqueia):** o frame T1 `83:817` desenha o anel de foco sobre item **selecionado** (instância de `20:1340`); o app só tem item **desabilitado**, e o teste do anel usa o item "Clientes" desabilitado. A paridade provada no cenário C é só a do **anel** (cor, 2 px, respiro, raio); não afirmo paridade de T1 inteiro nem que um item desabilitado receba foco em aparelho (US-MENU-06).

### US-PAR-04 — Protocolo de captura: simulador como linha de base (reescrito na v4.2, D-26)
- **Dado** o protocolo de simulador registrado em `docs/design/F41-capturas-app-orla.md` (iPhone 17, iOS 27.0, Expo Go com Metro na 8082, tema claro, texto `large`, retrato, 1206 × 2622 px),
- **Quando** as capturas do app em `docs/design/f41-capturas/app-2026-11-16-orla/` são consultadas,
- **Então** todas foram tiradas nesse mesmo simulador e nessa configuração, só com dado fictício, senha mascarada e sem notificação, token ou dado real visível,
- **E** o protocolo consta como **linha de base** das features de tela seguintes (US-PAR-13),
- **E** **não há captura em aparelho físico** e **nenhuma captura nova é exigida**, por decisão da pessoa em 17/11 (D-26),
- **E** trocar de simulador ou de configuração obriga refazer as capturas afetadas,
- **E** as lacunas estão declaradas: a versão do Expo Go não foi lida; as capturas vêm de uma rota temporária que compõe os componentes reais, então provam aparência de componente e não a tela de `app/*.tsx` nem o fluxo contra a API.

**Estado em 17/11 · Prova (v4.2)**
- **Decidido (D-26).** Conferi o arquivo `F41-capturas-app-orla.md`: a tabela do protocolo tem dispositivo, modo do app, tema e texto, orientação e resolução, barra de status e versão do Expo Go ("não lida nesta sessão"). **Não abri as imagens e não repeti o simulador.** O código visual do app não mudou depois das capturas: de `454a67b` a `c721983` só entraram testes em `apps/` (`git diff --stat 454a67b HEAD` lista apenas `text-field.test.tsx` e `tokens.test.ts` em `apps/`).
- **Prova esperada:** o CRIVO abre `F41-capturas-app-orla.md`, confirma os itens do protocolo e confere nas imagens só dado fictício (US-PAR-12). Tarefas 5, 11 e 19 dispensadas.

### US-PAR-05 — Classificação
- **Dado** cada diferença entre frame e tela,
- **Quando** é registrada na planilha,
- **Então** é "só de plataforma" apenas se for barra de status (conteúdo), renderização de fonte do sistema, tamanho de aparelho ou elemento que o sistema desenha e o app não estiliza, como a forma do `ActivityIndicator` nativo (ADR-014:216); **todo o resto** (estrutura, hierarquia, texto, token, família de fonte, ícone, estado, sombra) é "real", com o valor lido e o valor do código no lugar da captura.

**Estado em 16/11 · Prova** (classificação decidida pela pessoa; o **registro na planilha de valores é do ESQUADRO**, tarefa T29, ainda não feito)

| # | Diferença | Classe | Lado e decisão | Par que prova |
|---|---|---|---|---|
| O-1 | P2 `83:754`, ícone do círculo: wifi cortado no frame, `cloud-offline-outline` no app | real, **coberta pela exceção D-10** | Ionicons mantidos; nada muda | `app-2026-11-16-orla/lado-a-lado-perfil-erro.png` |
| O-2 | `10:936` sem "Mostrar" no campo Senha; app com "Mostrar" | real | frame antigo; a favor do **código**; Figma atualizado (D-25) | `lado-a-lado-login-credencial.png` |
| O-3 | P1 `83:712`, anel contínuo no frame; `ActivityIndicator` nativo no app | **só de plataforma** | nada muda | `lado-a-lado-perfil-carregando.png` |

As demais diferenças dos pares (moldura de aparelho, barra de status, largura 402 contra 360 do frame, quebra de linha do L4) o ORLA já classificou como só de plataforma em `F41-capturas-app-orla.md`; o escudo aparece como diferença em todos os Logins até o US-PAR-19 fechar.

### US-PAR-06 — Correção de divergência real
- **Dado** uma divergência real dentro do escopo,
- **Quando** ela é tratada,
- **Então** o código se ajusta ao Figma (D-02), inclusive as três que mudam comportamento (rótulo "Usuário", "Versão do app" e Perfil fora da tab bar),
- **E** a decisão e o lado corrigido ficam registrados por linha,
- **E** todo texto corrigido está em chave de i18n,
- **E** o Figma só muda por decisão registrada: P2 ajustado, T1 religado, R-11, **L2 (R-15)** e **`10:936` (O-2)**, ou item que a pessoa decidir manter no código,
- **E** o escudo (L-02) é divergência real **dentro do aceite** e fecha pelo US-PAR-19, não por decisão de deixar de fora.

**Estado em 16/11 · Prova** (lado corrigido por item)

| Item | Decisão | Lado corrigido | Estado |
|---|---|---|---|
| R-1 a R-10 | ao Figma (D-02) | código | corrigidas (`F41-valores-fpdb8.md` §16, §17.4) |
| R-11 (indicador a 6 contra 6,5) | aceitar 6 | **Figma** (indicador movido, §19.3) | feito pelo ESQUADRO |
| R-12 a R-14 (P2: gaps 16 e 10, botões na base, gap 12) | ao Figma | código | corrigidas em `c242b6f`; testes em `error-state.test.tsx` (não executei) |
| **R-15** (L2, campo em carregamento cinza) | a favor do **código** | **Figma** | **aberto**. Em 17/11 o PNG do L2 está alterado e sem commit e mostra os campos em cinza-azulado (abri a imagem), mas **não há registro do ESQUADRO** da variável ligada nem do `get_variable_defs`; só conta como feito com esse registro e o commit. O teste da cor é do ORLA e não existe |
| O-1 | exceção D-10 | nenhum | decidida |
| **O-2** (`10:936` sem "Mostrar") | a favor do **código** | **Figma** | **aberto** (ESQUADRO atualiza `10:936` e PNG) |
| O-3 | só de plataforma | nenhum | decidida |
| P-01 (selecionado) | não se aplica ainda | nenhum | decidida (D-23) |
| L-02 (escudo) | ao Figma, com licença | código | **aberto** (US-PAR-19) |

### US-PAR-07 — Tokens e variáveis do Figma
**Cenário A — código**
- **Dado** as três cores aprovadas (D-17),
- **Quando** `tokens.ts` é lido,
- **Então** placeholder = Flint `#6E6A66`, borda de campo = `#8C8780` e aba selecionada = `#EE8279`, sem comentário PROVISÓRIO, travados por `tokens.test.ts` com o literal.

**Cenário B — Figma**
- **Dado** o acesso ao Figma liberado (`whoami` responde e `create_session` abre sessão no arquivo `FPdB8`),
- **Quando** o ESQUADRO cria as variáveis e religa os frames afetados (inclusive T1 em `#EE8279`),
- **Então** `get_variable_defs` devolve o **mesmo hex ou valor** do `tokens.ts` para cada uma, com a saída real registrada,
- **E** a feature só fecha com valor idêntico nos dois lados.

**Cenário C — valor do Figma que reprova AA**
- **Dado** um valor do arquivo que reprova AA,
- **Quando** ele é tratado,
- **Então** não entra como está e passa pelo cálculo do `F41-contraste.py` antes de virar token.

**Cenário D — cor do campo em carregamento (R-15) — v4**
- **Dado** que o L2 passa a usar a cor do skeleton,
- **Quando** o ESQUADRO liga o preenchimento do campo a uma variável,
- **Então** o valor dessa variável é idêntico a `color.surface.skeleton` de `tokens.ts`, lido de volta por `get_variable_defs`, e nenhum token novo é criado sem variável.

**Estado em 16/11 · Prova**
- **A: feito**, segundo `F41-valores-fpdb8.md` §14 (`tokens.test`); não executei.
- **B: feito** para os tokens que a F41 criou ou alterou: 16 variáveis na coleção `OP-002 Identidade v2`, valor lido de volta, §17.1 e §19.1 (**"US-PAR-07 fecha"**, §19.8). Leitura do ESQUADRO; eu não li o Figma.
- **C: feito**, `python3 -I docs/design/F41-contraste.py` com saída 0 registrada em §19.6 (ESQUADRO).
- **D: aberto**, depende do L2 atualizado (T29).

### US-PAR-08 — Paridade final (sem pares lado a lado como prova)
**Cenário A — zero divergência real aberta**
- **Dado** a planilha de divergências e a planilha de valores,
- **Quando** a conferência final é feita,
- **Então** **nenhuma divergência real está aberta** no escopo da F41, e cada linha está **corrigida no código** ou **com o frame atualizado por decisão registrada**,
- **E** **não há item "fora do aceite"**: o Início (D-20) e o escudo (D-21) estão dentro, e nenhum outro item foi retirado,
- **E** são condições de fechamento, sem exceção: (1) L2 `82:2024` na cor do skeleton, PNG reexportado (R-15); (2) `10:936` com "Mostrar", PNG reexportado (O-2); (3) escudo exportado com origem e licença registradas e programado com teste (US-PAR-19); (4) teste que trava a cor do campo desabilitado; (5) isenção do campo desabilitado registrada em `F41-contraste.py`, com saída 0; (6) anotação "estado futuro" em `20:1102` e `20:1340`; (7) marcas FALTA da planilha reconciliadas ou justificadas (US-PAR-01); (8) os registros O-1, O-2 e O-3 na planilha de valores.

**Cenário B — sem imagem como prova**
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

**Cenário E — PR em rascunho**
- **Dado** o US-PAR-08 aberto,
- **Quando** alguém tenta mesclar,
- **Então** a PR #16 continua em rascunho até as 8 condições do cenário A fecharem.

**Estado em 16/11 · Prova: ABERTO** (não fecha)

| Condição | Estado | Quem | Prova |
|---|---|---|---|
| P2 `83:754` ao desenho aprovado; T1 `83:817` em `#EE8279`; variáveis; V-L14 e V-L19 relidos; R-11 | **feito** | ESQUADRO | `F41-valores-fpdb8.md` §17, §19 |
| R-12 a R-14 no código | **feito** | ORLA | `c242b6f`; `error-state.test.tsx` (não executei) |
| Início I1 contra o código | **feito por valor** | ESQUADRO + ORLA | §17.3, §19.2, `3c8df54`, `inicio.test`; `lado-a-lado-inicio.png` |
| 1 L2 e 2 `10:936` no Figma | **aberto** | ESQUADRO | nada exportado depois da decisão |
| 3 escudo | **aberto** | ESQUADRO, ORLA, pessoa (S-2) | `apps/mobile` sem `assets` nem `react-native-svg` |
| 4 teste da cor do campo desabilitado | **aberto** | ORLA | `text-field.test` só cobre `editable` e `accessibilityState` |
| 5 isenção em `F41-contraste.py` | **aberto** | ESQUADRO | — |
| 6 anotação em `20:1102` e `20:1340` | **aberto** | ESQUADRO | — |
| 7 marcas FALTA | **aberto** | ESQUADRO e ORLA | 22 ocorrências de "FALTA" por `grep` |
| 8 registros O-1 a O-3 | **aberto** | ESQUADRO | classificação no US-PAR-05 deste PRD |

### US-PAR-09 — Teste de componente (ajustado)
- **Dado** os componentes ajustados,
- **Quando** a entrega fecha,
- **Então** os testes de `tokens`, `text-field`, `inline-action-button`, `inline-alert`, `state-view`, `tab-bar-item`, `header-icon-button`, `get-initials`, `login`, `perfil`, `index`, `confirm-dialog`, `inicio` e os de menu estão ajustados ao desenho novo, **mais os dois novos da v4**: cor do campo desabilitado (D-24) e escudo (US-PAR-19),
- **E** a suíte inteira rodou, com **comando e saída reais** e o que ficou sem cobertura declarado (pixel, toque real, Android, aparelho),
- **E** na v4 (16/11) nenhum teste foi rodado por mim; na v4.1 (17/11) rodei a suíte (bloco abaixo).

**Estado em 17/11 · Prova esperada**
- **Estado: parcial.** A suíte atual passa (rodei em `454a67b`: 37 suítes, 289 testes, 0 falhas), mas os **dois testes novos da v4 não existem**: a cor do campo desabilitado (D-24; `text-field.test.tsx` só tem o caso de `editable={false}`, linhas 92 a 98) e o escudo (US-PAR-19 B).
- **Prova esperada:** `npm --prefix apps/mobile test -- --silent` terminando em `Test Suites: N passed, N total` e `Tests: M passed, M total`, com N maior ou igual a 37 e M maior que 289 (os dois testes novos), mais `npm --prefix apps/mobile run typecheck` e `npm --prefix apps/mobile run lint` sem erro. Typecheck e lint **não foram rodados por mim** nesta etapa.
- **Sem cobertura declarada:** pixel renderizado, área de toque real, Android e aparelho. Quem: ORLA escreve, CRIVO reexecuta.

### US-PAR-10 — Comportamento e endpoints
- **Dado** as correções aplicadas e a API local no ar,
- **Quando** executo: login válido, login inválido, abrir o Perfil pelo botão do cabeçalho, **Cancelar** no diálogo e **Sair** confirmado,
- **Então** o **único** endpoint chamado no login é `POST /api/v1/auth/login`, com o e-mail no campo `email` do corpo, mesmo com o rótulo "Usuário", e nenhum endpoint novo é chamado,
- **E** o resultado de cada passo é registrado com comando e saída reais,
- **E** o destino pós-login é `/inicio`, agora **com paridade por valor** (US-PAR-18).

**Estado em 17/11 · Prova esperada**
- **Estado: não repetido por mim.** Última prova real: o CRIVO, rodada 8 (em `12c5e78`), subiu a API em contêiner e viu só 2 chamadas de rede (`POST /api/v1/auth/login`), login errado, login certo, 4 abas desabilitadas, Perfil sem tab bar, Cancelar mantendo o token e Sair limpando (relato do CRIVO; não reproduzi). O código em `apps/` não mudou desde `c242b6f`, então a prova segue válida para o código de hoje, **mas o escudo e o teste da cor (US-PAR-19, D-24) ainda vão mexer em `apps/mobile`**.
- **Prova esperada:** repetir o fluxo contra a API local depois do último commit de código da F41, com comando e saída reais: único endpoint `POST /api/v1/auth/login` com `email` no corpo, nenhuma chamada nova, controle negativo (com a API parada o teste falha) e nenhum e-mail, senha ou token no log. Quem: CRIVO (T28). `auth-service.test.ts` e `auth-service-logging.test.ts` seguram o contrato no nível de unidade.

### US-PAR-11 — Figma inacessível
- **Dado** o MCP do Figma bloqueado na sessão,
- **Quando** a conferência é tentada,
- **Então** a **saída real** da tentativa é colada no relatório da etapa, sem contornar o bloqueio,
- **E** a feature fica aguardando, sem ser marcada como pronta,
- **E** a pessoa é avisada de que precisa rodar `claude mcp login figma-remote` em sessão interativa.

**Registro desta etapa (BUSSOLA, 2026-11-16):** `mcp__figma-remote__whoami` → `Claude requested permissions to use mcp__figma-remote__whoami, but you haven't granted it yet.` O `whoami` do ESQUADRO numa sessão anterior de 16/11 respondeu com o plano "Time Pessoal" (`F41-planilha-fpdb8.md` §1); em sessões posteriores ORLA e esta voltaram negadas. O acesso varia por sessão.

**Cada agente que precisar do Figma:** ESQUADRO e CRIVO repetem o `whoami` e colam a saída; o CRIVO declara no relatório se **leu o Figma** ou só a planilha do ESQUADRO.

**Estado em 17/11 · Prova esperada**
- **Estado: aplicável hoje, sem prova de acesso minha.** No conjunto de ferramentas do BUSSOLA nesta sessão não existe nenhuma `mcp__figma-remote__*`: é ferramenta **ausente**, não login negado; nenhuma chamada foi feita e nada do Figma foi lido por mim. Tudo do lado Figma vem da planilha do ESQUADRO e dos PNGs.
- **Prova esperada:** o ESQUADRO cola na entrega a saída real de `whoami` e de `get_variable_defs` do L2 `82:2024`; se vier negado, cola o texto exato e a feature fica aguardando. O CRIVO declara se leu o Figma ou só a planilha. Enquanto L2, `10:936` e as anotações dependerem desse acesso, o US-PAR-08 não fecha.

### US-PAR-12 — Dados fictícios nas imagens versionadas
- **Dado** as imagens de `docs/design/f41-capturas/` depois da remoção dos 6 `par-*` (12 `figma-fpdb8-*` na raiz, 15 em `final-2026-11-16`, 22 em `app-2026-11-16-orla`: 49 arquivos),
- **Quando** o CRIVO as abre,
- **Então** só há dado fictício (Figma: "João da Silva" e o que o arquivo traz; app: `Maria Teste`, `maria.teste@exemplo.invalid`), senha mascarada e nenhum token, notificação ou dado real,
- **E** novas capturas, se alguém as tirar, seguem a mesma regra.

**Estado em 16/11 · Prova:** **não verificado por mim**. Não abri nenhuma das imagens; as fontes das afirmações são `F41-capturas-app-orla.md` (app) e `F41-valores-fpdb8.md` §17.5 (Figma, onde o ESQUADRO diz ter aberto 3 de 15). A conferência é do CRIVO.

### US-PAR-13 — Linha de base para as features de tela seguintes
- **Dado** a F41 fechada,
- **Quando** a F35, F36, F42 ou F43 começar,
- **Então** a linha de base é `F41-valores-fpdb8.md` mais os testes travados e o `tokens.ts`,
- **E** as imagens de `final-2026-11-16` (Figma) e `app-2026-11-16-orla` (app e pares) são a **referência visual de apoio**, e os 12 `figma-fpdb8-*` da raiz são só histórico (D-22),
- **E** os 6 `par-*.png` antigos **não existem mais** no repositório, para ninguém tomá-los por referência.

**Estado em 16/11 · Prova:** **feito em `454a67b`**: a raiz de `docs/design/f41-capturas/` não tem mais nenhum `par-*.png` (`ls` em 17/11) e `LEIA-ME.md` está presente. **Em 17/11 o PNG `final-2026-11-16/login-carregando-L2-82-2024.png` aparece como modificado e não commitado** (mtime 16/11 22:39, depois da revisão humana); ver R-15 em US-PAR-06 e §10. A linha de base só vale depois do US-PAR-08 fechar.

### US-PAR-14 — Higiene de git (vale como na feature)
- **Dado** a feature concluída,
- **Quando** verifico o repositório,
- **Então** os commits são pequenos, em Conventional Commits, sem trailer de coautor, o `git status` não tem pendência e nenhum arquivo gerado, segredo ou binário grande foi versionado.

**Estado em 17/11 · Prova esperada**
- **Estado: aberto.** `git status --short` em 17/11, em `454a67b`: uma linha ` M` no PNG `final-2026-11-16/login-carregando-L2-82-2024.png` e quatro `??` em `docs/product/F44-*.md`. `git log main..HEAD --format=%B | grep -ci co-authored-by` devolveu 0 (nenhum trailer de coautor).
- **Prova esperada:** `git status --short` sem nenhuma linha; o mesmo `grep` com 0; commits em Conventional Commits; nenhum arquivo gerado, segredo ou binário grande novo. O PNG do L2 só sai do status se o ESQUADRO o validar e commitar (R-15). Os 4 `F44-*.md` seguem o caminho de R6 (§9), que depende da pessoa.

### US-PAR-15 — Contraste AA com os valores finais
- **Dado** as cores em texto, ícones e bordas de controle de Login, Perfil, diálogo e tab bar,
- **Quando** `python3 -I docs/design/F41-contraste.py` roda,
- **Então** texto atinge 4,5:1 e ícone e borda de controle atingem 3:1: placeholder Flint 5,36:1 sobre branco; borda `#8C8780` 3,56:1 sobre branco e 3,28:1 sobre Pampas; aba selecionada `#EE8279` 4,68:1 sobre petro; "Sair da conta" Crail 4,97:1 sobre Pampas,
- **E** os itens desabilitados (Tide a 50% sobre petro, 2,58:1) são **isentos** por serem inativos, e as bordas Westar do botão "Sair da conta" e do cartão (1,23:1) são **decorativas** (WCAG 1.4.11), ambos por D-18,
- **E** o campo desabilitado em carregamento (cor do skeleton, R-15) também é **isento**, por ser inativo, e o `F41-contraste.py` registra isso (tarefa T29, ainda não feita),
- **E** a saída do script, com código de saída 0, fica registrada na entrega.

**Estado em 17/11 · Prova esperada**
- **Estado: os pares obrigatórios passam hoje.** `python3 -I docs/design/F41-contraste.py` em 17/11 imprime "OK: todos os pares obrigatórios atingem o alvo", com código de saída 0 (medido sem pipe). **Pendente:** o script ainda não registra a isenção do campo desabilitado (T29).
- **Prova esperada:** o mesmo comando, saída "OK..." e código 0, com a isenção do campo em carregamento escrita no script. Quem: ESQUADRO (script) e CRIVO (reexecuta).

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

**Estado em 17/11 · Prova esperada**
- **Estado: sustentado por teste; passou na suíte de 17/11.** Existem `app/login.test.tsx`, `src/services/auth-service.test.ts`, `src/services/auth-service-logging.test.ts` e `src/hooks/use-login.test.tsx`; **não li o conteúdo de cada um**, só confirmei por `grep` que `auth-service.test.ts` cita `email` e `auth/login`.
- **Prova esperada:** `npm --prefix apps/mobile test -- app/login.test.tsx src/services/auth-service.test.ts src/services/auth-service-logging.test.ts src/hooks/use-login.test.tsx --silent` verde, com asserção no corpo `{ email, senha }`, nas mensagens "Informe seu usuário" e "Informe sua senha" e no log sem dado pessoal; mais o fluxo real do CRIVO (T28).

### US-PAR-17 — Versão do app no Perfil
- **Dado** o Perfil preenchido,
- **Quando** o cartão é exibido,
- **Então** a linha "Versão do app" mostra o valor lido da configuração do Expo por `expo-constants` (hoje `0.1.0`), sem texto fixo no componente, e a diferença para o "1.0.0" do frame é **dado**, não desenho (D-12).
- **Dado** a configuração sem versão,
- **Quando** o Perfil abre,
- **Então** a linha mostra "Não informada" (chave `perfil.versaoIndisponivel`) e a tela não quebra.

**Estado em 17/11 · Prova esperada**
- **Estado: sustentado por teste.** `app/perfil.test.tsx` (linha 70: "Versão do app: 0.1.0"; linha 98: "Versão do app: Não informada"), `src/config/app-version.test.ts` e `src/components/perfil/info-card.test.tsx`; `apps/mobile/app.config.ts` linha 7 tem a versão 0.1.0. Passaram na suíte de 17/11.
- **Prova esperada:** `npm --prefix apps/mobile test -- app/perfil.test.tsx src/config/app-version.test.ts src/components/perfil/info-card.test.tsx --silent` verde; o teste de leitura continua lendo a configuração do Expo e não um texto fixo.

### US-PAR-18 — Início, destino pós-login, com paridade por valor (reescrito na v4, D-20)
- **Dado** um login bem-sucedido ou uma sessão retomada,
- **Quando** o app aterrissa,
- **Então** a tela é `/inicio`, com cabeçalho "Início", botão de usuário, estado vazio e tab bar de 4 itens desabilitados,
- **E** o estado vazio tem círculo de 72 em `#EDE9E4`, ícone de documento de 32 em Spectra `#33575D`, título "Em breve" em Barlow Condensed SemiBold 20 a 16 do círculo, e a mensagem "Os módulos da oficina chegam nas próximas versões." em Inter 14 / 21, Flint, com 289 de largura, a 10 do título, o bloco centrado entre o cabeçalho e a tab bar (I1 `89:971`; `F41-valores-fpdb8.md` §17.3 e §19.2),
- **E** o desenho do ícone de documento é Ionicons (exceção D-10),
- **E** o Início tem **um** estado, o vazio; carregando, erro e preenchido são "não se aplica" (a tela é estática e não chama API),
- **E** nenhum fluxo cai em tela sem saída: o botão de usuário leva ao Perfil e a seta do Perfil volta.
- **Dado** sessão inválida ou ausente,
- **Então** o app vai ao Login.
- **Dado** o logout confirmado,
- **Então** o token é removido e o app volta ao Login.

**Estado em 16/11 · Prova**
- **Início: feito por valor, não executado por mim.** Valores lidos nos dois lados em §17.3 e §19.2 (ESQUADRO); código em `3c8df54` (I-1 a I-6) e `7f9db9f`; testes `app/(menu)/inicio.test.tsx` e `menu-tab-bar.test.tsx` (existência conferida). **Não medido em aparelho** (centralização vertical, V-I06).
- **Prova de apoio:** `final-2026-11-16/inicio-vazio-I1-89-971.png` e `app-2026-11-16-orla/lado-a-lado-inicio.png`.
- **Sessão inválida e logout:** cobertos por `(menu)/_layout.test` e `perfil.test` (existência conferida); o fluxo contra a API é do CRIVO (T28).

### US-PAR-19 — Escudo da marca no Login (novo na v4, D-21)
**Cenário A — exportação e licença**
- **Dado** o escudo de 84 × 96 do frame `10:895`, acima do título e centralizado,
- **Quando** o ESQUADRO exporta o nó,
- **Então** o arquivo e a **origem e a licença de uso** ficam registrados em `F41-valores-fpdb8.md` (nó, formato, dimensão, md5, quem forneceu a imagem e sob que permissão),
- **E** sem esse registro o ativo não entra no repositório e **nada é improvisado no lugar**: o escudo continua como divergência real aberta (L-02) e o US-PAR-08 não fecha.

**Cenário B — programação**
- **Dado** o ativo liberado,
- **Quando** o ORLA programa o escudo no Login,
- **Então** ele aparece em 84 × 96, centralizado acima do título, em PNG 1x, 2x e 3x (o app não tem `react-native-svg`), cada arquivo até 50 KB, sem texto fixo no componente,
- **E** o teste de componente trava a dimensão 84 × 96, a posição acima do título e a alternativa de texto,
- **E** o escudo aparece em todos os estados de Login em que o frame o desenha.

**Cenário C — acessibilidade**
- **Dado** o leitor de tela percorrendo o Login,
- **Quando** o foco chega ao bloco da marca,
- **Então** o escudo é **decorativo** (fora da árvore de acessibilidade, se o nome da marca já estiver no título) ou tem rótulo significativo, e a escolha e a justificativa ficam na planilha; ele nunca recebe foco de teclado.

**Cenário D — borda de largura**
- **Dado** telas de 320 e de 430 de largura,
- **Quando** o Login é renderizado,
- **Então** o escudo mantém 84 × 96 e os campos e o botão seguem sem largura fixa (o teste `find-fixed-widths` do Login continua passando).

**Estado em 16/11 · Prova: ABERTO.** Nada exportado nem programado. Verificado hoje: `apps/mobile` não tem pasta `assets` nem `react-native-svg` no `package.json`. A licença depende da pessoa (S-2). Sem dado pessoal.


### 5.1 Quadro de estado e prova esperada por critério (v4.1, atualizado na v4.2 em 2026-11-17)

Resumo de uma linha por critério; o detalhe e a evidência estão no bloco "Estado" de cada US-PAR acima. "Prova esperada" é o que o CRIVO deve conseguir reexecutar ou abrir, sem tradução.

| ID | Estado em 17/11 (v4.2, `c721983`) | Prova esperada | Quem |
|---|---|---|---|
| US-PAR-01 | **quase fechado**: as marcas "FALTA" foram reconciliadas (`F41-valores-fpdb8.md` §20.7: 13 cobertas por teste, 9 lacunas declaradas); a palavra só aparece hoje em prosa, nas linhas 704 e 736; escudo ainda sem linha de teste | planilha com uma linha por estado, nó, valor lido, valor do código e teste ou lacuna declarada; linha do escudo depois de programado | ESQUADRO, ORLA |
| US-PAR-02 | A sustentado por teste; B feito; **C feito**: L2 e `10:936` atualizados no Figma (valores §20.1 e §20.2, `5b7858a`) e teste da cor do campo desabilitado em `text-field.test.tsx:101` (`c21436c`) | suíte verde; `get_variable_defs` do L2 colado pelo ESQUADRO; CRIVO confere | CRIVO |
| US-PAR-03 | sustentado por teste; **anotação "estado futuro" feita** em `20:1102` e `20:1340` (valores §20.3); texto do critério reescrito com Início e escudo (v4.2) | suíte verde; CRIVO confere a anotação nos dois nós | CRIVO |
| US-PAR-04 | **decidido (D-26)**: protocolo de simulador é a linha de base; sem captura nova; tarefas 5, 11 e 19 dispensadas | CRIVO abre `F41-capturas-app-orla.md` e confirma os itens do protocolo | CRIVO |
| US-PAR-05 | **feito**: O-1, O-2 e O-3 registradas com classe, lado e par que prova (valores §20.2) | linhas O-1 a O-3 na planilha | CRIVO |
| US-PAR-06 | R-1 a R-15, O-1 a O-3 e P-01 **fechados**; **só L-02 (escudo) aberto** | cada item com lado e decisão; L-02 fecha pelo US-PAR-19 | ORLA, pessoa |
| US-PAR-07 | A, B, C e **D feitos** (`get_variable_defs` do L2 devolveu `color/surface/skeleton: #f1f5f9`, valores §20.1; `tokens.test.ts` com `#F1F5F9`) | `tokens.test.ts` verde; saída do ESQUADRO colada | CRIVO |
| US-PAR-08 | **aberto só pelo escudo**: das 8 condições, 1, 2, 4, 5, 6, 7 e 8 estão feitas; falta a **3** (escudo exportado, mas **licença sem registro (S-2)** e **sem programação**). Coerente com a observação da pessoa em 17/11 ("segue aberto só pelo escudo (S-2)") | as 8 condições fechadas, suíte verde e PR #16 fora de rascunho | pessoa (S-2), ORLA |
| US-PAR-09 | **parcial**: suíte atual 37 suítes e 292 testes passando (rodei); o teste da cor do campo existe; **falta o teste do escudo** (US-PAR-19 B); typecheck e lint não rodei | suíte com N maior ou igual a 37 e M maior que 292 depois do escudo, mais typecheck e lint sem erro | ORLA, CRIVO |
| US-PAR-10 | não repetido por mim; última prova real é a rodada 8 do CRIVO; o escudo ainda vai mexer em `apps/mobile` | fluxo real depois do último commit de código, só `POST /api/v1/auth/login` | CRIVO |
| US-PAR-11 | ESQUADRO registrou `whoami` real em 17/11 (valores §20); `download_assets` negado, contornado por `get_screenshot` e `exportAsync`. BUSSOLA segue sem ferramenta Figma | CRIVO declara se leu o Figma ou só a planilha | CRIVO |
| US-PAR-12 | não verificado por mim; 2 pares remontados em 17/11 pelo ORLA | CRIVO abre as imagens e confirma só dado fictício | CRIVO |
| US-PAR-13 | imagens e `LEIA-ME.md` feitos; linha de base vale depois do US-PAR-08 | `ls` sem `par-*`, planilha e testes travados | CRIVO |
| US-PAR-14 | **aberto só pelos 4 `docs/product/F44-*.md`** (`git status --short` hoje; o PNG do L2 já está commitado em `5b7858a`); trailer de coautor: 0 | `git status --short` vazio e 0 trailers; os 4 arquivos dependem da decisão da pessoa (R6, §7.2) | pessoa, ORLA |
| US-PAR-15 | **feito**: script com "OK" e código 0 rodado por mim hoje; isenção do campo desabilitado registrada em `F41-contraste.py` (`a5c4232`) | mesmo comando, CRIVO reexecuta | CRIVO |
| US-PAR-16 | sustentado por teste (suíte verde hoje) | testes citados verdes mais o fluxo real | CRIVO |
| US-PAR-17 | sustentado por teste (suíte verde hoje) | testes citados verdes | CRIVO |
| US-PAR-18 | feito por valor; leitura A da S-1 adotada, com indício da pessoa em 17/11 | `inicio.test`, `menu-tab-bar.test`, `(menu)/_layout.test` e o fluxo real | CRIVO, pessoa (S-1) |
| US-PAR-19 | **aberto**: A feita no lado técnico (PNG 1x, 2x, 3x de 3,1 KB, 5,5 KB e 8,2 KB e SVG, `0c0f1b4`), **licença sem registro (S-2)**; B a D não feitos | origem e licença registradas pela pessoa; escudo programado com teste de 84 × 96, posição e alternativa de texto | pessoa, ESQUADRO, ORLA |

## 6. Efeito sobre outras features e documentos

1. **[[F33]]:** US-MENU-01 (aterrissa no Menu com Perfil selecionado), US-MENU-02 ("1 habilitado e 4 desabilitados") e US-MENU-03 deixam de valer como escritos. Não reescrevo o PRD da F33; registro aqui, e o ORLA ajusta `menu-tab-bar.test`, `(menu)/_layout.test` e `menu-routing.test`. O gap de US-MENU-06 permanece.
2. **[[F34]]:** os frames de tab bar de 5 itens (`39:3`, `39:31`, `39:58`, arquivo antigo) deixam de ser referência. Não são apagados.
3. **Briefing, exceção temporária:** o trecho "redesenho aguardando código" para Login, Perfil, logout e tab bar fica **sem efeito**. O texto do briefing é da pessoa e do comandante; **não o editei**. O texto proposto pelo ESQUADRO está em `F41-planilha-fpdb8.md` §7.
4. **[[F39]]:** a F39 redesenha o wireframe de **baixa**. Ela **não edita** os quatro frames de alta desta feature; a propagação baixa → alta dessas quatro telas é desta feature.
5. **[[F40]]:** a pendência de variáveis numéricas no Figma para tokens novos é fechada aqui, pela US-PAR-07 B.
6. **README:** o ORLA já registrou fontes e rota inicial no README principal (`5659cc9`, `2b1825f`). Esta etapa é só documentação: **README sem mudança**, porque não altera instalação, execução, teste, configuração nem funcionalidade. A feature que entrar com dependência ou comando novo atualiza o README na mesma entrega.

## 7. Dúvidas em aberto

**Três em aberto (v4.1): S-1, S-2 e S-3. Nenhuma bloqueia código, mas a S-2 bloqueia o fechamento (US-PAR-19 A e US-PAR-08).** As perguntas estão em §7.1 com o campo de resposta literal vazio. As dúvidas P-01 a P-07 do PRD v2 estão fechadas.

| # | Dúvida | Fechamento | Origem |
|---|---|---|---|
| P-01 | Estado **selecionado** da tab bar | **FECHADA em 16/11: "não se aplica ainda"** (D-23, US-PAR-03 E). As 4 abas estão desabilitadas e nenhuma navega, então não há rota para ficar selecionada. Reabre quando uma aba for habilitada. | pessoa |
| P-02 | Aparelho e modo de execução | Sem aparelho físico; captura dispensada (D-19, US-PAR-04 não se aplica) | pessoa |
| P-03 | Onde as capturas ficam e o limite | Ficam onde estão, como histórico, abaixo de 100 KB cada (D-22) | PO |
| P-04 | Alturas 46/50/62 contra 48/52/64 | Segue o Figma, com `hitSlop` ≥ 48 (premissa 10) | pessoa (aprovação dos frames) |
| P-05 | Barlow Condensed e escudo | Fontes entraram (OFL-1.1, `@expo-google-fonts/*`); escudo **dentro do aceite na v4** (D-21, US-PAR-19), com a licença em S-2 | pessoa |
| P-06 | "Mostrar senha" | Mantido; texto visível "Mostrar"/"Ocultar" (D-11 do ESQUADRO) | pessoa |
| P-07 | Versão exibida | Valor real `0.1.0`; "Não informada" sem valor (US-PAR-17) | pessoa |
| P-11 (do ESQUADRO) | O contorno de 2 px Crail no campo é o foco? | Vale como foco do campo, travado por teste. O ESQUADRO registra na releitura (US-PAR-02 B) o que `10:895` mostra; se divergir, o código se ajusta ao Figma (D-02) | PO (aplicação de D-02) |
| S-1 | A observação geral da revisão diz "D-20 confirmada" e o critério 8 diz "PRD v4 reverte a D-20". | **Li como a mesma decisão:** a D-20 cai e o Início entra no aceite por valor (bate com `F41-valores-fpdb8.md` §17.3). **Caminho de volta, se a leitura estiver errada:** restaurar a D-20 e a US-PAR-18 do commit `361989a` e tirar o Início das condições do US-PAR-08. Não bloqueia nada. | pessoa (confirmar) |
| S-2 | De quem é o escudo 84 × 96 e sob que licença ele pode ficar no repositório? (a D2 do ADR-014) | **Aberta.** O ESQUADRO consegue registrar de onde o arquivo saiu do Figma, mas a licença de uso é informação da pessoa. Sem resposta, o US-PAR-19 A não fecha e o US-PAR-08 também não. Não escolho por ela. | pessoa |
| S-3 | O frame T1 `83:817` (instância de `20:1340`) desenha o anel de foco sobre item **selecionado**; o app só tem item **desabilitado** e prova o anel num item desabilitado. A paridade de T1 vale só para o anel? | **Aberta.** Registrada pela BUSSOLA em 17/11; não decido. Sem resposta, o cenário C do US-PAR-03 afirma só a paridade do anel e o foco real fica em US-MENU-06. Reabre junto com o estado selecionado (D-23). | ESQUADRO e pessoa |

### 7.1 Perguntas levadas à pessoa em 17/11 e resposta literal

**Como foi feito.** O BUSSOLA não tem canal direto com a pessoa nesta sessão: as perguntas seguem no relatório de handoff desta etapa. **Regra de registro:** quem receber a resposta a cola **literalmente** no campo correspondente, com data e com quem colou; o PRD só muda de leitura depois disso. Campo vazio significa dúvida aberta, e nada é decidido por mim.

**S-1 — O Início entra no aceite?** Responda A ou B.
- **A.** O Início **entra** no aceite, por valor, contra o frame I1 `89:971` (a D-20 original, que o deixava fora, cai).
- **B.** O Início fica **fora** do aceite (a D-20 original vale). Efeito: restaurar a D-20 e a US-PAR-18 de `361989a` e tirar o Início do escopo e das condições do US-PAR-08.
- **Leitura adotada até a resposta (minha, não decisão):** A, porque o critério 8 diz "PRD v4 reverte a D-20" e `F41-valores-fpdb8.md` §17.3 registra "aprovado pela pessoa em 16/11; D-20 cai". A frase ambígua é "D-20 confirmada", da observação geral.
- **Resposta literal da pessoa:** _(vazio; nenhuma resposta recebida até 2026-11-17)_

**S-2 — De quem é o escudo e sob que licença ele fica no repositório?** (a D2 do ADR-014)
1. Quem criou ou forneceu o desenho do escudo 84 × 96 do frame `10:895`?
2. Sob que permissão ele pode ser versionado (por exemplo: ativo próprio da oficina; ativo contratado com cessão de uso; banco de imagens com licença nomeada; outra)? Indique o documento ou o nome da licença.
3. Pode ser versionado como PNG 1x, 2x e 3x de até 50 KB cada (premissa 12)? Responda sim, não ou outro limite.
- **Efeito da resposta:** o ESQUADRO registra nó, formato, md5, origem e licença (T30) e só então o ORLA programa (T31). Sem resposta, o escudo continua divergência real aberta, o US-PAR-19 A não fecha e a F41 não fecha. Nada é improvisado no lugar.
- **Resposta literal da pessoa:** _(vazio; nenhuma resposta recebida até 2026-11-17)_

**S-3 — A paridade de T1 vale só para o anel de foco?** (nova, não bloqueia) Responda A ou B.
- **A.** Vale só o anel; o item desabilitado com foco no app é aceito até a primeira aba ser habilitada (D-23).
- **B.** T1 passa a mostrar item desabilitado com foco, por decisão da pessoa a favor do código, e o ESQUADRO ajusta o frame (o código já desenha o anel no item desabilitado). Sem essa decisão, D-02 faz o Figma mandar.
- **Resposta literal da pessoa:** _(vazio)_

### 7.2 Quadro decidida × aberta (v4.2, 2026-11-17)

Regra de leitura: **decidida** só quando há decisão registrada da pessoa; **aberta** quando falta a resposta dela, mesmo que eu tenha uma leitura. Nenhuma linha abaixo foi preenchida por suposição minha.

| Pendência | Estado | Base | Efeito e quem |
|---|---|---|---|
| Protocolo de captura (critério 4) | **decidida** | D-26, revisão humana de 17/11 | simulador iPhone 17, iOS 27.0 é a linha de base; sem aparelho físico; US-PAR-04 e premissa 13 reescritos |
| Tarefas 5, 11 e 19 | **decidida** (dispensadas) | D-26 | não se executam; nenhuma captura nova |
| Início no aceite (D-20 revertida) | **decidida** | D-20 da v4, decisão da pessoa em 16/11 | I1 `89:971` por valor, US-PAR-18 |
| S-1: confirmar a leitura "A" | **aberta, não bloqueia** | campo da §7.1 vazio; a observação de 17/11 ("critério 8 segue aberto só pelo escudo") é **compatível com A** mas **não é resposta literal** | pessoa responde A ou B; se B, caminho de volta descrito na S-1 |
| Escudo no aceite (D-21 revertida) | **decidida** | D-21 da v4, decisão da pessoa em 16/11 | US-PAR-19 |
| **S-2: origem e licença do escudo** | **ABERTA, bloqueia** | campo da §7.1 vazio; valores §20.4: "sem registro no arquivo" | sem resposta, US-PAR-19 A e US-PAR-08 não fecham; é o **único** item que segura o critério 8 |
| S-3: paridade de T1 só no anel | **aberta, não bloqueia** | campo da §7.1 vazio | pessoa responde A ou B |
| Destino dos 4 `docs/product/F44-*.md` (R6) | **ABERTA, bloqueia o critério 14** | R6 (§9); `git status --short` hoje lista os 4 | pessoa escolhe (a) apagar as cópias locais, (b) ignorar em `.git/info/exclude`, (c) comparar e levar a cópia local; eu não commitei nem apaguei nada |
| 9 lacunas de teste da planilha (V-L06, V-L08, V-L11, V-L12, V-P01, V-P11, V-P13, V-T04, V-T09) | **decidida por mim (PO)** | a condição 7 da v4 diz "reconciliadas **ou justificadas**"; valores §20.7 as declara como "igual por leitura, sem trava de teste" | aceitas como lacuna declarada, sem bloquear. **Recomendação ao ORLA**, por valor: cobrir V-T04 (fundo petro da tab bar, ligada ao critério 3) e V-L06 e V-L08 (rótulo e texto digitado do campo), que são asserções de uma linha. V-L11 (largura 304) o Jest não mede; V-T09 é a exceção D-10 |
| Ativo do escudo versionado sem licença | **aberta (aviso)** | `0c0f1b4` versionou os PNGs e o SVG em `docs/design/f41-ativos/escudo/`, e o US-PAR-19 A diz que sem registro "o ativo não entra no repositório" | **leitura minha:** o portão vale para entrar em `apps/mobile`; o que está em `docs/design` é exportação técnica. **O ORLA não deve copiar nada para `apps/mobile` antes da S-2.** Se a pessoa negar a licença, os 4 arquivos saem com `git rm`. Se a pessoa ou o REGENTE preferir outra leitura, a decisão é deles |
| P-01, O-1, O-2, O-3, R-15 | **decididas e fechadas** | D-23 a D-25; valores §20.1 a §20.3 | nada a fazer |

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
| R2 | A D-20 e a D-21 da v3 foram fixadas pelo comandante e a pessoa decidiu o contrário. | Médio | **Materializado e tratado na v4** (§2, rastro das reversões). Resta a dúvida S-1 sobre a leitura de "D-20 confirmada". |
| R3 | O Jest não mede pixel, toque nem Android: "um teste por linha" prova estilo declarado, não o renderizado. | Médio | Declarado em US-PAR-08 B e US-PAR-09. |
| R4 | O estado "selecionado" da tab bar não aparece no app em execução e o frame o desenha. | Baixo | Fechado como "não se aplica ainda" (D-23). Reabre com a primeira aba habilitada; só o `TabBarItem` isolado o trava até lá. |
| R5 | Ionicons diferem do desenho do arquivo. | Baixo | Exceção registrada (D-10). |
| R6 | Os 4 arquivos `docs/product/F44-*.md` não rastreados, **de outra feature**, sujam o `git status` da F41 (US-PAR-14). | Médio | Conferi: a branch `docs/f44-evidencias` (`df3d66a`, já no `origin`) **já tem os 4**. Três são idênticos aos da F41 (mesmo hash de blob) e o quarto, `F44-pr-seguranca-boot-sha-rascunho.md`, **está mais novo na branch da F44** (tem a seção "Hipótese de CVE" que a cópia da F41 não tem). Nada precisa ser commitado de novo. As 4 cópias não rastreadas continuam na pasta da F41, sem apagar nem commitar, e ainda aparecem como `??` em `git status`; quem decide removê-las ou ignorá-las localmente é a pessoa. **Atualização de 17/11 (a revisão humana, critério 14, pede commitar os 4 no worktree da F44):** reconferi por hash. Três dos quatro (`F44-pr1a-rascunho-descricao-e-provas`, `F44-qa-crivo-2026-11-16` e `F44-revalidacao-main-348a43e`) já estão em `docs/f44-evidencias` (`df3d66a`) com o mesmo hash de blob. O quarto, `F44-pr-seguranca-boot-sha-rascunho.md`, **difere**: a branch tem a seção "Hipotese de CVE a confirmar" (linhas 101 a 104) que a cópia local não tem. Commitar a cópia local por cima **regrediria** o arquivo, e os worktrees da F44 ficam em pastas de scratchpad de outras sessões, **fora da pasta desta operação**; por isso **não commitei nada nem apaguei**. **Decisão da pessoa:** (a) apagar as 4 cópias locais (nada se perde, estão na branch); (b) ignorá-las localmente em `.git/info/exclude`, sem versionar; (c) levar a cópia local depois de comparar a diferença. Até lá o `git status` da F41 não fica limpo (US-PAR-14). |
| R7 | O PRD da F33 e os testes de menu ainda descrevem a tab bar de 5 itens. | Médio | §6 item 1; o ORLA ajusta os testes. |
| R8 | As capturas do ORLA em `app-2026-11-16-orla` chegam a 233 KB (`app-dialogo.png`), acima do teto de 100 KB que a D-22 da v3 fixava para as antigas. | Baixo | Recomendo manter: são apoio e histórico, e 233 KB não é binário grande. Se a pessoa preferir o teto, o ORLA recorta as capturas e refaz os pares. |
| R9 | O escudo pode não ter licença registrável, e a F41 não fecha sem ele. | Alto | S-2; nenhum substituto improvisado (US-PAR-19 A). |

## 10. Verificado × não verificado (esta etapa)

**Verificado por mim (leitura do repositório e uma chamada de MCP):**
- `mcp__figma-remote__whoami` voltou negado (texto exato em US-PAR-11).
- `tokens.ts` tem `flint` `#6E6A66`, `stone` `#8C8780`, `coral` `#EE8279`, `ringOnBrand` branco, `unavailable` 0,5 e nenhum comentário PROVISÓRIO.
- `strings.ts` tem "Usuário", "Seu usuário", "Informe seu usuário", "Informe sua senha", "Mostrar"/"Ocultar", a mensagem de rede, "Não informada", "Sair da conta?" e os quatro rótulos da tab bar (Ordens, Clientes, Catálogo, Financeiro).
- `auth-service.ts` envia `{ email, senha }`; `login.tsx` usa `keyboardType="email-address"`.
- `app/(menu)/inicio.tsx` existe.
- `docs/design/f41-capturas/`: 18 arquivos, 864 KB, maior com 94.742 bytes.
- `figma.md:4` e `F41-conferencia-paridade-referencias.md:4` apontam para o arquivo novo.

**Verificado na v3.1 (leitura do código, 2026-11-16, ramo `feat/f41-paridade-fpdb8-codigo`):** `menu-tab-bar.tsx` tem 4 `ENTRIES` na ordem ordens, clientes, catalogo, financeiro, `selected={false}` na linha 62 e `unavailable`; `strings.ts` tem os 4 rótulos curtos e os 4 "indisponível nesta versão"; `tokens.ts` tem `tabBar` 62, `iconSize.tab` 22, `tabLabel` 11, `unavailable` 0,5; `MenuTabBar` só é usada por `MenuShell`, que só envolve o grupo `(menu)` (hoje só `inicio`); `(menu)/_layout.tsx` devolve `null` sem sessão autenticada. Li `menu-tab-bar.test.tsx` e `tab-bar-item.test.tsx` (não os executei). **Figma:** a ferramenta `mcp__figma-remote__*` não está no meu conjunto de ferramentas nesta sessão (ferramenta ausente, não login negado); nenhum nó foi lido por mim.

**Verificado na v4 (2026-11-16, ramo `feat/f41-paridade-fpdb8-codigo` em `12c5e78`; leitura e listagem, nenhum teste rodado):**
- `docs/design/f41-capturas/` tem 12 `figma-fpdb8-*.png` e 6 `par-*.png` na raiz, 15 arquivos em `final-2026-11-16` e 22 em `app-2026-11-16-orla`; nenhum documento cita os `par-*` (busca por texto).
- `apps/mobile` não tem pasta `assets`, e o `package.json` não tem `react-native-svg` nem `expo-image`.
- `text-field.tsx` define `inputRowDisabled` com `color.surface.skeleton`; `text-field.test.tsx` só tem o caso de `editable={false}` (linhas 92 a 98), sem teste de cor.
- `menu-tab-bar.tsx:62` ainda tem `selected={false}`; `(menu)/inicio.tsx` e `inicio.test.tsx` existem.
- `F41-valores-fpdb8.md` tem 22 ocorrências de "FALTA".
- A branch `docs/f44-evidencias` tem os 4 arquivos F44 (3 idênticos por hash de blob, 1 mais novo na branch).
- **Figma:** não tenho ferramenta `mcp__figma-remote__*` nesta sessão (ausente); nada foi lido. **Imagens:** nenhuma aberta.


**Verificado na v4.1 (2026-11-17, ramo `feat/f41-paridade-fpdb8-codigo` em `454a67b`; comandos rodados por mim):**
- `npm --prefix apps/mobile test -- --silent`: `Test Suites: 37 passed, 37 total` e `Tests: 289 passed, 289 total`.
- `python3 -I docs/design/F41-contraste.py`: "OK: todos os pares obrigatórios atingem o alvo", código de saída 0 (medido sem pipe).
- `git diff --stat c242b6f HEAD -- apps`: sem saída (o código de `apps/` não mudou desde `c242b6f`).
- `git log main..HEAD --format=%B | grep -ci co-authored-by`: 0.
- `git status --short`: um PNG modificado (L2) e quatro `??` de `docs/product/F44-*.md`.
- `menu-tab-bar.tsx`: 4 `ENTRIES` (ordens, clientes, catalogo, financeiro) e `selected={false}` na linha 62; `tab-bar-item.tsx` usa `useFocusRing({ onBrand: true })` e `disabled={unavailable}`.
- Abri `login-carregando-L2-82-2024.png` (modificado): campos Usuário e Senha em cinza-azulado claro e "Entrando…" no botão. **Isso não prova** que o frame do Figma foi alterado nem que a variável está ligada.
- Hashes dos 4 `F44-*.md` contra `docs/f44-evidencias`: 3 iguais e 1 diferente (R6).
- Raiz de `docs/design/f41-capturas/` sem `par-*.png`; `LEIA-ME.md` presente.
- Nenhuma ferramenta `mcp__figma-remote__*` neste conjunto; nada do Figma foi lido.
- **Não rodei:** `typecheck`, `lint`, `format:check` nem o fluxo contra a API.

**Verificado na v4.2 (2026-11-17, ramo `feat/f41-paridade-fpdb8-codigo` em `c721983`; comandos rodados por mim):**
- `npm --prefix apps/mobile test -- --silent`: `Test Suites: 37 passed, 37 total` e `Tests: 292 passed, 292 total`.
- `python3 -I docs/design/F41-contraste.py`: "OK: todos os pares obrigatórios atingem o alvo".
- `git log main..HEAD --format=%B | grep -ci co-authored-by`: 0. `git status --short`: só os 4 `docs/product/F44-*.md` com `??`.
- `grep -n "F1F5F9"` em `text-field.test.tsx` (linhas 101 e 107) e `tokens.test.ts` (linha 25): o teste da cor do campo desabilitado existe.
- `git diff --stat 454a67b HEAD`: em `apps/` só `text-field.test.tsx` e `tokens.test.ts` (código visual do app sem mudança desde as capturas de 16/11).
- `apps/mobile/assets` não existe; `brand-header.tsx` linha 13 diz que o escudo "ainda não entra".
- `F41-capturas-app-orla.md`: tabela do protocolo lida (simulador iPhone 17, iOS 27.0, Expo Go, Metro 8082, tema claro, texto `large`, retrato 1206 × 2622 px, barra de status 9:41, versão do Expo Go "não lida").
- **Não rodei:** `typecheck`, `lint`, `format:check`, o fluxo contra a API. **Não abri nenhuma imagem.** Nenhuma ferramenta `mcp__figma-remote__*` neste conjunto; nada do Figma foi lido por mim, tudo vem de `F41-valores-fpdb8.md` §20 (ESQUADRO).

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
- **T29** (ESQUADRO): atualizar o L2 `82:2024` para a cor do skeleton, ligada à variável, e reexportar o PNG (D-24); atualizar `10:936` com "Mostrar" e reexportar (D-25); anotar "estado futuro" em `20:1102` e `20:1340` (D-23); registrar O-1, O-2 e O-3 na planilha de valores; registrar em `F41-contraste.py` que campo desabilitado é isento.
- **T30** (ESQUADRO): exportar o nó do escudo 84 × 96, registrar nó, formato, md5, origem e licença (US-PAR-19 A); depende da S-2.
- **T31** (ORLA): teste que trava a cor do campo desabilitado (D-24); programar o escudo em PNG 1x, 2x e 3x com teste (US-PAR-19 B a D), depois da T30.
- **T32** (ESQUADRO e ORLA): reconciliar as 22 marcas FALTA de `F41-valores-fpdb8.md` com o que a §14 e a §16 já cobrem (US-PAR-01).
- **T33** (BUSSOLA, **feito nesta etapa**): este PRD v4; registro do P-01 na planilha (`F41-planilha-fpdb8.md` §11); remoção dos 6 `par-*.png` e `LEIA-ME.md` da pasta de capturas.
- **T5, T6 a T11, T19 e T20** seguem "não se aplicam ao aceite"; as capturas que existem são apoio (D-19, D-22).
- **T34** (BUSSOLA, **feito na v4.1**): S-1 e S-2 levadas à pessoa como pergunta fechada (§7.1), **sem resposta recebida**; critério 3 reescrito com texto para o quadro; estado e prova esperada dos 19 critérios (§5.1). **Pendente da pessoa:** S-1, S-2, S-3 e o destino dos 4 `F44-*.md` (R6).
- **T35** (BUSSOLA, **feito na v4.2**): D-26 e premissa 13; US-PAR-04 reescrito; texto do critério 3 com Início e escudo; §5.1 atualizado contra `c721983`; §7.2 com cada pendência marcada como decidida ou aberta. **Dispensadas por decisão da pessoa em 17/11 (D-26):** T5 (preparar usuário e aparelho em Não Perturbe), T11 (capturar a tab bar no aparelho) e T19 (refazer capturas finais no aparelho). **T12** está atendida pela planilha de valores (§20.2, classificação por item) e pelos pares existentes. **T14** está cumprida pelo registro das decisões em §2 e pela observação de 17/11. **T22** segue aberta só por R6 (os 4 `F44-*.md`). **Abertas e dependentes da pessoa:** S-1 (confirmação), **S-2 (bloqueia)**, S-3 e R6.
