# F41 — PRD revisado: paridade com o Figma `FPdB8RymAnN81pbKfizdzE`

PRD — dono: BUSSOLA (Product Owner). Data: 2026-11-16. Rota: BUSSOLA → CARTOGRAFO → ESQUADRO → ORLA → CRIVO.
Prioridade P1 · Frontend · Sprint 01.
Base: `main` em `348a43e` (F40 já mergeada pela PR #10).

**Depende de:** [[F25]], [[F30]], [[F33]], [[F34]], [[F40]] (já na `main`).
**Altera por decisão da pessoa (16/11):** [[F33]] (US-MENU-01, 02 e 03; ver §6).

Este documento **substitui**, para a F41, o PRD da rodada de 13/11 (referência no arquivo `DLqbSzzKRxiN2eyvXG73Lr`), os critérios US-PAR-03, 06 e 10 e as premissas 7 e 8 da feature. Os demais critérios valem como estão na feature, com os ajustes de §5.

Nada foi corrigido em código nem no Figma nesta etapa. Só decisão e escopo.

## 1. Contexto corrigido

1. **A F40 já está na `main`** (PR #10, merge `5ba3106`). A linha de base do "antes" é a `main` atual, `348a43e`, e não mais `c815235`. Ela traz a refatoração em componentes (`src/components/ui`, `src/components/menu`, `src/hooks`, `src/services`) e o desenho **antigo** (Login e Perfil sem faixa petro, avatar e subtítulo; tab bar com 5 itens).
2. **As correções de paridade da rodada anterior não estão na `main`.** A branch `feat/f41-paridade-correcoes` (último commit `1490234`: triângulo de alerta cheio, barra de status clara, faixa de erro com 44 de altura) foi feita contra o arquivo antigo e **não é ancestral da `main`** (verificado com `git merge-base --is-ancestor`). É insumo, não base: o ORLA decide o que reaproveita depois da lista decidida (R-02, R-03 e A-01 são reconferidos contra o arquivo novo, ver US-PAR-06).
3. **Os documentos F41 anteriores só existem em branches** (`docs/f41-rodada-figma-fpdb8`, `f2833aa`: `F41-conferencia-paridade-referencias.md`, `F41-rodada-figma-fpdb8.md`, planilha antiga). Nenhum está na `main`. A planilha antiga (R-01 a R-15) foi feita contra o arquivo antigo e **não vale mais**.
4. **A ordem F41 → F40 ficou invertida.** A F40 fechou antes, então "linha de base para a F40" (US-PAR-13) perde o sentido. A F41 passa a ser a **nova linha de base** para as features de tela seguintes (F35, F36, F42, F43). A prova de "sem mudança visual" da F40 (US-COMP-11) continua sendo sobre `c815235`; a F41 muda o visual de propósito e não a refaz.
5. **Esta feature é a "feature de código posterior à F41"** que o briefing previa para Login, Perfil, logout e tab bar. Resolvo a sobreposição: a F41 corrige direto contra o arquivo novo. A exceção temporária "redesenho aguardando código" do briefing **deixa de ter efeito para essas quatro telas** (§6, item 3).

## 2. Decisões da pessoa registradas (16/11/2026)

| # | Decisão | Fonte |
|---|---|---|
| D-01 | `FPdB8RymAnN81pbKfizdzE` é a **referência definitiva** de alta fidelidade da F41. O arquivo `DLqbSzzKRxiN2eyvXG73Lr` deixa de ser referência de paridade. | Revisão humana, critério 1 |
| D-02 | **O Figma manda em tudo**; o código se ajusta. Toda diferença de estrutura, hierarquia, texto, token, fonte e ícone é divergência **real**. Só barra de status, fonte do sistema e tamanho de aparelho são "só de plataforma". | Observação geral |
| D-03 | Rótulo do campo de login passa a **"Usuário"** (N-01). O campo **continua enviando e-mail**; `POST /api/v1/auth/login` segue o único endpoint. | Observação geral, critério 10 |
| D-04 | **Versão do app** no Perfil, lida da configuração do app (N-10). | Observação geral |
| D-05 | **Perfil sai da tab bar** e vira botão de usuário no cabeçalho, com seta de voltar, nome acessível e ordem de foco coerente (N-12). Tab bar com **4 itens, na ordem do Figma**. | Critério 3 |
| D-06 | Estado que existe no código e não tem frame (carregando, erro de rede, sessão expirada, foco, desabilitado) é **divergência real**. O ESQUADRO propõe o frame no estilo do arquivo novo e a pessoa aprova, ou registra "não se aplica" com justificativa. **Nada é marcado sem ver o frame.** | Critério 2 |
| D-07 | Placeholder (2,50:1) e tab selecionada (2,24:1) **reprovam AA**. O ESQUADRO propõe cor que passe; a pessoa aprova antes de mudar nos dois lados. Valor do Figma que reprova AA nunca entra como está. | Critérios 7 e 15 |
| D-08 | Aparelho do protocolo e local das capturas **seguem com a pessoa** (§7, P-02 e P-03). | Observação geral |
| D-09 | Texto sempre em chave de i18n (`area.componente.texto`), nunca fixo no componente. | Critério 6 |

**Correção de fato na D-04:** a decisão diz "lida do `app.json`". O repositório **não tem `app.json`**: a configuração do Expo é `apps/mobile/app.config.ts` (`version: '0.1.0'`, verificado). `expo-constants ~18.0.14` já é dependência. Registro a fonte como **"a configuração do Expo do app"**, lida por `expo-constants`. Consequência visível: o app mostra **0.1.0**, não o "1.0.0" do frame (dado de exemplo). É diferença de **dado**, não de texto nem de estrutura. Se a pessoa quiser "1.0.0" na tela, a versão muda no `app.config.ts` (P-07).

## 3. Escopo

### Dentro do escopo
- Conferência de Login, Perfil, diálogo de confirmação de logout, cabeçalho com botão de usuário e tab bar contra o arquivo novo, com **imagem composta lado a lado** (Figma à esquerda, app à direita) por estado, não só dois arquivos soltos.
- Planilha de divergências refeita do zero (N-01 a N-15 e as que a leitura por nó acrescentar), todas reais exceto plataforma.
- Frames propostos pelo ESQUADRO, no estilo do arquivo novo, para estados que o código tem e o Figma não.
- Diff de `tokens.ts` contra as variáveis do arquivo novo, com o Figma como fonte, e contraste AA recalculado (incluindo X do alerta e avatar).
- Correção do código, incluindo as três mudanças de comportamento decididas (D-03, D-04, D-05) e os testes de menu da F33.
- Disponibilidade de Barlow Condensed e do escudo confirmada pelo ORLA antes de codar (P-05).
- Testes de componente ajustados: `alert-icon`, `inline-alert`, `screen-header` e os de menu da F33.
- Repetição do fluxo contra a API local depois das correções.

### Fora do escopo
- Telas novas e módulos de negócio (Clientes, Catálogo, Ordens, Financeiro). Exceção única, só se a pessoa decidir em P-01: o estado vazio da tela inicial pós-login.
- Mudança de **endpoint** ou de contrato da API: nenhuma. `POST /api/v1/auth/login` segue igual, corpo com e-mail.
- Foco de teclado e leitor de tela **em aparelho** (US-MENU-06): continua pendência, registrada como **não alcançável sem aparelho**.
- Componentes novos sem uso.
- Backlog (dashboard, fotos, PDF, WhatsApp).

> **Substitui** a premissa 7 anterior ("a feature não altera comportamento nem endpoint, só aparência e estrutura") e o fora do escopo "qualquer mudança de comportamento". O que **não muda** é o endpoint e o contrato de login. O que **muda** por decisão da pessoa: rótulo do campo, origem da versão e a navegação até o Perfil.

## 4. Premissas (numeradas)

1. O arquivo `FPdB8RymAnN81pbKfizdzE` é a referência; o código se ajusta (D-01, D-02).
2. **Relação com a F39 (verificada em documentos, não no Figma nesta sessão):** o arquivo é a **inspiração externa** da F39 (briefing de 13/11) e a origem da identidade v2 do ADR-014 (Proposto, na branch `docs/f44-pr2a-adr014-mapa-telas`; não está na `main`). **A F39 não editou nenhum nó** do `DLqbSzzKRxiN2eyvXG73Lr` (registro em `docs/design/figma.md`). Logo, ele **não é "a v2 editada pela F39"**; passa a ser a referência de alta fidelidade da F41 **por decisão da pessoa**.
3. **Os ids do briefing não são frames de alta fidelidade** (leitura do ESQUADRO em 14/11, a reconferir por nó): `20:2131` é a página "01 — Wireframes" e `20:968` é um rótulo de texto. A referência de trabalho são os frames de §8, a confirmar por nó pelo ESQUADRO.
4. Token novo ou alterado entra nos dois lados juntos: `tokens.ts` e variáveis do Figma. Valor do Figma que reprova AA vira divergência real e passa pela pessoa antes de mudar (D-07).
5. Estado que o frame prevê e o código não tem é divergência real. Estado que o código tem e o frame não tem também (D-06). Só estado que **não existe em nenhum dos lados** é "não se aplica", com justificativa.
6. Plataforma: barra de status, renderização de fonte do sistema e tamanho de aparelho não contam.
7. Capturas do app só com dados fictícios, em usuário criado só para o teste, ambiente local, senha mascarada. Sem token, notificação ou dado real. **LGPD:** finalidade = provar paridade visual; base legal = não aplicável (sem dado pessoal real); retenção = até o fechamento da F41, depois só a linha de base. O Perfil continua exibindo o e-mail do usuário logado como já exibe hoje (dado do próprio usuário, sem coleta nova); nas capturas e nos logs ele aparece fictício ou mascarado. A versão do app não é dado pessoal.
8. Perfil fora da tab bar altera o PRD da F33 (§6). Registro a alteração; **não reescrevo** o PRD da F33 nem os critérios dela.
9. Protocolo de captura: aparelho único e fixo, com modelo, versão do sistema, resolução, escala de fonte, tema, retrato e modo de execução registrados. A rodada anterior usou simulador iPhone 17 (iOS 27.0) como desvio. Trocar de aparelho obriga refazer as capturas afetadas. **Aparelho segue com a pessoa (D-08).**

## 5. Critérios de aceitação (Gherkin)

Reescritos: US-PAR-03, 06, 10. Ajustados: US-PAR-01, 02, 05, 07, 08, 09, 13, 15. Novos: US-PAR-16, 17, 18. Os demais (04, 11, 12, 14) valem como estão na feature. Os IDs `US-PAR-NN` rastreiam até teste.

### US-PAR-01 — Cobertura de telas (ajustado)
- **Dado** Login, Perfil, diálogo de confirmação de logout, cabeçalho com botão de usuário e tab bar do arquivo `FPdB8RymAnN81pbKfizdzE`,
- **Quando** a conferência termina,
- **Então** cada um tem uma **imagem composta** (Figma à esquerda, app à direita, mesma escala, com legenda do nó e do commit) por estado, anexada à entrega,
- **E** o link em `docs/design/figma.md:4` e a referência em `F41-conferencia-paridade-referencias.md:37` apontam para o arquivo novo.

### US-PAR-02 — Cobertura dos estados (ajustado)
- **Dado** Login (vazio, carregando, erro de credencial, erro de conexão, preenchido, sessão expirada) e Perfil (carregando, erro, preenchido),
- **Quando** reviso as capturas,
- **Então** todo estado do código **sem frame** está na planilha como **divergência real**, com frame proposto pelo ESQUADRO e aprovado pela pessoa, **ou** registrado como "não se aplica" com justificativa,
- **E** nenhum estado é marcado como coberto sem que o frame tenha sido visto.

### US-PAR-03 — Tab bar e acesso ao Perfil (reescrito)
**Cenário A, tab bar**
- **Dado** a tab bar do arquivo novo, com 4 itens e **sem Perfil**,
- **Quando** o app roda e comparo com o frame,
- **Então** os itens aparecem na ordem do Figma (**Ordens, Clientes, Catálogo, Financeiro**), com rótulos do Figma vindos de chaves de i18n, barra de 62, ícone de 22, rótulo de 10,5 e item selecionado em vermelho sem pílula,
- **E** não existe item Perfil na barra.

**Cenário B, botão de usuário**
- **Dado** uma sessão autenticada,
- **Quando** olho o cabeçalho,
- **Então** há um botão de usuário (36 × 36 no frame) no canto direito, com **nome acessível "Perfil"** (chave de i18n) e papel de botão,
- **E** tocá-lo abre o Perfil, que mostra a **seta de voltar** (nome acessível próprio, papel de botão),
- **E** a ordem de foco é: título, botão de usuário, conteúdo, tab bar; no Perfil: seta de voltar, título, conteúdo.

**Cenário C, estados da tab bar**
- **Dado** os estados padrão e selecionado,
- **Quando** o app é capturado depois da correção, com o botão de usuário em estado padrão e o item selecionado,
- **Então** os pares lado a lado não mostram diferença (P-01 define **como** o estado selecionado é alcançável),
- **E** foco e desabilitado, que o Figma não tem, entram pela US-PAR-02.

**Cenário D, foco em aparelho**
- **Dado** o foco de teclado e o leitor de tela,
- **Quando** a pendência é revisada,
- **Então** ela permanece em US-MENU-06 como **"não alcançável sem aparelho"**, sem prova inventada.

### US-PAR-05 — Classificação (ajustado)
- **Dado** cada diferença entre frame e tela,
- **Quando** é registrada na planilha **refeita do zero**,
- **Então** é "só de plataforma" apenas se for barra de status, fonte do sistema ou tamanho de aparelho; **qualquer outra** (estrutura, hierarquia, texto, token, fonte, ícone, estado) é "real", com a evidência da captura.

### US-PAR-06 — Correção de divergência real (reescrito)
- **Dado** uma divergência real,
- **Quando** ela é tratada,
- **Então** o **código se ajusta ao Figma** (D-02), inclusive nas três que mudam comportamento: rótulo **Usuário** (N-01), **Versão do app** (N-10) e **Perfil fora da tab bar** (N-12),
- **E** a decisão e o lado corrigido ficam registrados por linha,
- **E** todo texto corrigido está em chave de i18n, nunca fixo no componente,
- **E** R-02 (ícone de alerta vira círculo com `!`), R-03 e A-01 foram **reconferidos contra o arquivo novo**, não herdados do arquivo antigo,
- **E** o Figma só muda por decisão registrada da pessoa (frame novo para estado sem frame, ou item que ela decidir manter no código).

### US-PAR-07 — Tokens (ajustado)
- **Dado** o arquivo novo como fonte,
- **Quando** o diff de `tokens.ts` é refeito contra as variáveis dele,
- **Então** cada diferença (placeholder, tab selecionada, borda de campo, erro, `inlineAlertMinHeight`, fundo Pampas, texto secundário Flint, avatar Spectra, scrim, fontes, alturas) está listada,
- **E** valor do Figma que reprova AA **não entra como está**: vira divergência real e passa pela pessoa antes de mudar nos dois lados,
- **E** token aprovado entra em `tokens.ts` e nas variáveis do Figma **na mesma entrega**, com valores iguais.

### US-PAR-08 — Paridade final (ajustado)
- **Dado** a planilha e as capturas **novas**,
- **Quando** as capturas finais são feitas no aparelho do protocolo,
- **Então** a planilha não tem **nenhuma divergência real em aberto**,
- **E** a exceção temporária do briefing e a linha 37 do arquivo de referências apontam para o arquivo novo,
- **E** sem planilha e capturas novas a feature não fecha.

### US-PAR-09 — Teste de componente (ajustado)
- **Dado** os componentes ajustados,
- **Quando** a entrega fecha,
- **Então** `alert-icon.test`, `inline-alert.test` e `screen-header.test` (ícone, altura mínima, StatusBar, faixa do login) e os testes de menu da F33 estão ajustados ao desenho novo,
- **E** a **suíte inteira** rodou, com comando e saída reais e o que ficou sem cobertura declarado.

### US-PAR-10 — Comportamento e endpoints (reescrito)
- **Dado** as correções aplicadas e a API local no ar,
- **Quando** executo: login válido, login inválido, Perfil pelo botão do cabeçalho, **Cancelar** no diálogo e **Sair** confirmado,
- **Então** o **único** endpoint chamado no login é `POST /api/v1/auth/login`, com o **e-mail** no corpo mesmo com o rótulo "Usuário", e nenhum endpoint novo é chamado,
- **E** o resultado de cada passo é registrado com comando e saída reais,
- **E** a **tela inicial pós-login** é confirmada, já que a tab bar fica sem item habilitado (P-01).

### US-PAR-13 — Linha de base (ajustado)
- **Dado** as capturas finais aprovadas,
- **Quando** as features de tela seguintes (F35, F36, F42, F43) começarem,
- **Então** as capturas estão no local decidido em P-03, com o protocolo registrado, como **nova linha de base**; a F40 já fechou e deixa de ser o destino.

### US-PAR-15 — Contraste AA (ajustado)
- **Dado** as cores do arquivo novo em texto, ícones e bordas de controle (incluindo **X do alerta** e **avatar**),
- **Quando** o contraste é recalculado sobre o fundo de cada uso,
- **Então** texto atinge 4,5:1 e ícone e borda de controle atingem 3:1,
- **E** os pares abaixo disso (**placeholder 2,50:1**, **tab selecionada 2,24:1** e os que a leitura por nó confirmar: borda de campo em repouso, texto na caixa de erro) são divergência real; o ESQUADRO **propõe cor que passe** e a pessoa aprova; aprovada, o Figma e o `tokens.ts` mudam na mesma entrega.

### US-PAR-16 — Rótulo "Usuário" envia e-mail (novo)
- **Dado** a tela de login com o rótulo "Usuário" (chave de i18n),
- **Quando** informo um e-mail válido e senha e confirmo,
- **Então** o corpo enviado a `POST /api/v1/auth/login` contém o campo de e-mail com o valor digitado e o login segue como hoje.
- **Dado** o campo vazio,
- **Quando** confirmo,
- **Então** a validação de campo aparece no formato do frame, sem chamar a API.
- **Dado** credencial inválida,
- **Quando** a API responde 401,
- **Então** a mensagem é a do frame ("Usuário ou senha incorretos. Confira os dados e tente novamente."), **genérica, sem indicar qual campo errou**, e as duas bordas de campo mudam.
- **Dado** o leitor de tela,
- **Então** o campo é anunciado como "Usuário" e o teclado é o de e-mail.

### US-PAR-17 — Versão do app no Perfil (novo)
- **Dado** o Perfil preenchido,
- **Quando** o cartão é exibido,
- **Então** a linha "Versão do app" mostra o valor lido da configuração do Expo por `expo-constants` (hoje `0.1.0`), sem texto fixo no componente.
- **Dado** a configuração sem versão,
- **Quando** o Perfil é aberto,
- **Então** a linha mostra um valor neutro definido em i18n e a tela não quebra (formato: P-07).

### US-PAR-18 — Tela inicial pós-login sem item habilitado (novo)
- **Dado** um login bem-sucedido ou sessão retomada,
- **Quando** o app aterrissa,
- **Então** a tela exibida é a definida em P-01, com cabeçalho e botão de usuário, e a tab bar mostra os 4 itens do Figma,
- **E** nenhum fluxo cai em tela sem saída (grafo de navegação sem órfão).
- **Dado** sessão inválida ou ausente,
- **Então** o app vai ao Login, como hoje.
- **Dado** o logout confirmado,
- **Então** o token é removido e o app volta ao Login.

## 6. Efeito sobre outras features e documentos

1. **[[F33]]:** US-MENU-01 ("aterrissa no Menu com Perfil selecionado"), US-MENU-02 ("1 habilitado e 4 desabilitados") e US-MENU-03 deixam de valer como escritos. A F33 está "Concluída" e eu **não reescrevo** o PRD dela: registro a alteração aqui e peço ao ORLA que ajuste `menu-tab-bar.test`, `(menu)/_layout.test` e `menu-routing.test`. O gap de US-MENU-06 permanece.
2. **[[F34]]:** os frames de tab bar de 5 itens (`39:3`, `39:31`, `39:58`, arquivo antigo) deixam de ser referência. Não são apagados.
3. **Briefing, exceção temporária:** o trecho "redesenho aguardando código" para Login, Perfil, logout e tab bar fica **sem efeito**, porque a F41 leva essas telas ao arquivo novo. O texto do briefing é da pessoa/REGENTE; **não o editei**. O ESQUADRO atualiza `figma.md:4` e a linha 37 do arquivo de referências (que vive na branch `docs/f41-rodada-figma-fpdb8`, não na `main`).
4. **[[F39]]:** a F39 redesenha o wireframe de **baixa** de todas as telas. O alta de Login, Perfil, logout e tab bar, que o briefing atribuía à F39, já existe no arquivo novo e é tratado aqui. Para não duplicar escopo, **a F39 não edita esses quatro frames de alta**; a baixa continua com ela. A propagação baixa → alta dessas quatro telas passa a ser desta feature. **A confirmar pela pessoa**, por tocar escopo de outra feature.
5. **[[F40]] (variáveis de Figma para tokens novos):** a pendência de variáveis numéricas no Figma é fechada aqui, pela US-PAR-07, quando o token for aprovado.
6. **README:** entra dependência nova (pacote de fonte, por exemplo) ou comando novo? Se sim, atualizar o README principal na mesma entrega (`docs(readme)`); se não, registrar "README sem mudança" com o motivo. Nesta etapa (só documentação): README sem mudança.

## 7. Dúvidas em aberto (da pessoa)

| # | Dúvida | O que bloqueia | Recomendação |
|---|---|---|---|
| **P-01** | **Qual é a tela inicial pós-login**, já que a tab bar fica com 4 itens sem nenhum habilitado e o Perfil sai dela? E como o app alcança o estado **"item selecionado"** que a pessoa pediu capturar? Hoje não existe tela de Ordens (F42 bloqueada). | Tab bar, US-PAR-03 C, US-PAR-10, US-PAR-18 | **Opção A (recomendada):** aterrissagem no shell já existente, com cabeçalho (botão de usuário), `StateView` em estado vazio (texto em chave i18n, por exemplo "os módulos chegam nas próximas versões") e tab bar com os 4 itens desabilitados e nenhum selecionado. O estado selecionado é provado por captura **do componente isolado** (render de teste), declarado como tal. Reaproveita componente existente, sem tela nova. **Opção B:** criar tela "Ordens" placeholder selecionada: cria tela nova e contradiz o fora do escopo. Sem resposta, **o ORLA não mexe na tab bar nem no Perfil**; Login e diálogo de logout avançam. |
| **P-02** | Aparelho do protocolo (modelo, sistema, resolução, escala de fonte, tema) e modo (Expo Go ou build de desenvolvimento). A rodada anterior usou simulador, desvio da premissa 9. | Tarefas 3, 7, 9, 11, 19 | Fixar um único aparelho antes da primeira captura final. |
| **P-03** | Onde as capturas finais ficam e o limite por arquivo. | Tarefas 4 e 20; US-PAR-13 | PNGs otimizados em `docs/design/f41-capturas/`, teto de 100 KB por arquivo (valor sugerido, não medido contra restrição do repositório). Anexo de PR não garante a linha de base depois do merge. |
| **P-04** | Alturas do Figma (campo 46, botão 50, tab 62) são **menores** que os tokens da casa (`minTouchTarget` 48, botão 52, tab 64). 46 passa o AA 2.2 (alvo mínimo 24), mas fica abaixo do token interno. | N-04, N-14 | Seguir o Figma (D-02), com o ESQUADRO confirmando que a área de toque efetiva continua ≥ 44. A pessoa confirma. |
| **P-05** | **Barlow Condensed** e o **escudo** (84 × 96): o repositório não tem pasta `assets/` nem pacote de fonte (só `expo-font`). Quem fornece o arquivo do escudo e qual a origem e licença da fonte? | N-02, N-06, N-08, N-09 | O ORLA confirma antes de codar; sem o ativo, a correção fica bloqueada e **registrada, não substituída por improviso**. |
| **P-06** | **N-05 botão "Mostrar senha":** o código tem e o frame não. Pela D-06, entra como divergência real. | N-05 | Manter o controle (acessibilidade e usabilidade) e o ESQUADRO propõe o frame; remover seria mudança de comportamento não decidida. |
| **P-07** | Se a versão exibida deve ser `0.1.0` (real) ou "1.0.0" (frame), e o formato quando a configuração não traz valor. | US-PAR-17 | Exibir o valor real e tratar "1.0.0" como dado de exemplo do frame. |

**Resolvidas por esta rodada:** link do Figma e versão de referência (D-01), Usuário vs e-mail (D-03), tab bar sem Perfil (D-05), Versão do app (D-04), estados sem frame (D-06), contraste (D-07).

## 8. Frames de referência (a confirmar por nó pelo ESQUADRO)

Arquivo `FPdB8RymAnN81pbKfizdzE`, página "02 — Alta fidelidade" (`20:2132`). Fonte: leitura do ESQUADRO em 14/11 (branch `docs/f41-rodada-figma-fpdb8`). **Eu não li o Figma nesta etapa**, então os ids não foram verificados por mim.

| Tela | Frame | Id |
|---|---|---|
| Login, estado inicial | 1a — Login | `10:895` |
| Login, credencial inválida | 1b — Login — erro de credencial | `10:936` |
| Sem conexão (padrão global; tela Ordens) | 1c | `10:981` |
| Perfil | 1av — Perfil | `10:3842` |
| Diálogo de logout | 1aw — Sair — confirmação | `10:3886` |
| Tab bar, Ordens ativa | símbolo | `20:1102` |
| Tab bar, Clientes ativa | símbolo | `20:1340` |

Estados sem frame (D-06, a propor): Login carregando, preenchido, erro de conexão no login e sessão expirada; Perfil carregando e erro; tab bar foco e desabilitado.

## 9. Divergências a tratar (lista inicial, todas reais por D-02)

Base: leitura do ESQUADRO em 14/11 contra `0c82d49`, **não revalidada por mim** e **sem captura do app**. N-01 a N-15 e D-AA-1 a D-AA-4 estão detalhadas em `F41-rodada-figma-fpdb8.md` (branch `docs/f41-rodada-figma-fpdb8`). A planilha final é refeita do zero pelo ESQUADRO sobre a `main` `348a43e`.

Já decididas: **N-01** Usuário (D-03), **N-10** Versão do app (D-04), **N-12** Perfil fora da tab bar (D-05) e, por consequência, **N-07** (seta de voltar no Perfil) e **N-13** (rótulos "Ordens" e "Clientes"). Pendentes de P-01, P-04, P-05 e P-06: N-02, N-04, N-05, N-14, N-15 e os estados sem frame.

## 10. Verificado × não verificado

**Verificado por mim nesta etapa (leitura do repositório):**
- `main` em `348a43e`, árvore limpa no início, com PR #10 (F40) e PR #15 (F03a) mergeadas.
- `feat/f41-paridade-correcoes` não é ancestral da `main`.
- `apps/mobile` não tem `app.json`; tem `app.config.ts` com `version: '0.1.0'`; `expo-constants ~18.0.14` e `expo-font ~14.0.12` estão em `package.json`; **não há** pacote de fonte nem pasta `assets/`.
- `strings.ts` da `main` tem a tab bar com chaves `menu.tabbar.perfil.*` e as quatro desabilitadas, com rótulos "Clientes e Veículos" e "Ordens de Serviço".
- ADR-014 e ADR-015 **não estão na `main`**.

**Não verificado por mim:**
- Nenhum nó do Figma (nenhuma chamada ao MCP nesta etapa). Frames, medidas e contrastes de §8 e §9 são do ESQUADRO em 14/11.
- Nenhum teste rodado e nenhuma captura do app nesta etapa.
- O estado do Figma em 16/11.

## 11. Tarefas novas e ajustes (a numeração continua a da feature)

Mantêm-se as tarefas 1 a 22, com estes ajustes:
- **T1** passa a: confirmar o acesso ao arquivo **novo** via MCP e registrar a saída real (US-PAR-11).
- **T2** (a F39 altera a F34?) fica **respondida** por D-01 e §6, itens 2 a 4; falta só a pessoa confirmar o item 4.
- **T23.** ESQUADRO: atualizar `docs/design/figma.md:4`, a linha 37 de `F41-conferencia-paridade-referencias.md` e propor o texto da exceção do briefing (§6, item 3).
- **T24.** ESQUADRO: refazer a planilha do zero, propor frames para os estados sem frame e a cor que passe AA para placeholder e tab selecionada.
- **T25.** ORLA: confirmar disponibilidade de Barlow Condensed e do escudo (P-05) e a leitura da versão (US-PAR-17) antes de codar.
- **T26.** ORLA: implementar US-PAR-16, 17 e 18 e o botão de usuário no cabeçalho; ajustar os testes de menu da F33.
- **T27.** ORLA: atualizar o README principal se entrar dependência ou comando, ou registrar "README sem mudança" com o motivo.
- **T28.** CRIVO: repetir o fluxo contra a API local (login válido e inválido, Perfil pelo botão, Cancelar, Sair) e registrar os endpoints chamados.

## 12. Riscos

| # | Risco | Impacto | Mitigação |
|---|---|---|---|
| R1 | Sem item habilitado e sem tela inicial definida (P-01), o app pós-login fica sem destino claro. | Alto | Responder P-01 antes de o ORLA tocar na tab bar. |
| R2 | Escudo e fonte não existem no repositório (P-05). | Médio | O ORLA confirma antes; sem o ativo, a feature fica aguardando e registra. |
| R3 | O Figma novo não tem frame de vários estados reais. | Médio | D-06: nada marcado sem ver o frame. |
| R4 | Alterar a tab bar e o Perfil quebra testes e a aprovação da F33. | Médio | T26 ajusta os testes; registro em §6, item 1. |
| R5 | Correções antigas de `feat/f41-paridade-correcoes` foram feitas contra outro arquivo e podem ser reaproveitadas por engano. | Médio | Reconferência de R-02, R-03 e A-01 (US-PAR-06). |
| R6 | Capturas em simulador, não em aparelho (P-02), enfraquecem a prova do protocolo. | Médio | A pessoa fixa o aparelho; trocar obriga refazer. |
| R7 | O Figma pode ficar bloqueado por sessão no CRIVO (já ocorreu). | Alto | US-PAR-11: registrar a saída real e deixar a feature aguardando. |
