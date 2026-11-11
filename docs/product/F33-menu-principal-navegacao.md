# F33 — Menu principal de navegação (tab bar)

PRD — dono: BUSSOLA (Product Owner). Data: 2026-11-07. Revisão: 2026-11-09.
Rota da feature: BUSSOLA → ESQUADRO → ORLA → CRIVO.
Depende de: [[F30]] (login/perfil mobile, infraestrutura de sessão) e
[[F34]] (protótipo de alta fidelidade da tab bar, já aprovado).

> **Status desta revisão (2026-11-09)**: REGENTE travou o escopo da Sprint 01
> em **item único navegável: Perfil**. A dúvida §6.2 da versão anterior desta
> PRD (pedido de confirmação sobre reconciliar "item único" com os 5 itens
> desenhados em F34) está **resolvida** — ver §5.2. Nesta data, ORLA já tinha
> implementado e CRIVO já tinha rodado QA real sobre exatamente essa leitura
> (ver evidência de código citada em §5.2 e §9); esta revisão alinha o texto
> da PRD ao que já está construído e testado, não abre implementação nova.

## 1. Visão

Hoje o login pousa direto na tela de Perfil (`app/login.tsx` e
`app/index.tsx` chamavam `router.replace('/perfil')` antes desta feature).
Esta feature introduz o Menu principal — uma tab bar inferior — como a casa
do app depois do login, para que cada sprint futura tenha onde "acender" o
item do módulo que entrega, sem reabrir a navegação de base a cada vez. Na
Sprint 01, só o módulo Perfil existe, então só o item Perfil é navegável; os
outros 4 módulos já aparecem na tab bar como posição reservada, visível e
desabilitada — não como ausência.

Valor para quem usa: o funcionário da oficina enxerga, desde a Sprint 01, a
estrutura final de navegação do app (os módulos que existirão), sem ficar
perdido quando um módulo novo é entregue — o item já está no lugar esperado,
só passa de desabilitado para habilitado.

## 2. Glossário

| Termo | Significado neste PRD |
|---|---|
| Menu principal / tab bar | Barra de navegação inferior fixa, exibida após o login, com uma posição por módulo do app. |
| Item de menu | Célula tocável da tab bar (ícone + rótulo) que representa um módulo, numa das 5 posições fixas. |
| Item único / item navegável | O único item que de fato navega ao toque nesta sprint: Perfil. "Item único" refere-se à contagem de itens **habilitados**, não ao total de posições exibidas — ver §5.2. |
| Item habilitado | Item cujo módulo já foi implementado nesta sprint; navega ao tocar, `accessibilityState.disabled: false`. |
| Item desabilitado / placeholder | Item de um módulo ainda não construído; visível, sem navegação, `accessibilityState.disabled: true`, anunciado como "indisponível nesta versão". |
| Sessão válida | Token JWT presente no SecureStore do aparelho e ainda não expirado/rejeitado pela API (infra de [[F30]]). |
| Guard de sessão | Verificação, antes de renderizar uma tela protegida, de que existe sessão válida; sem ela, redireciona ao login. |
| Retomada do app | Reabertura do app (cold start/foreground) com o processo já encerrado antes, sem passar pela tela de login na sessão atual. |
| Deep link | Abertura do app numa rota específica (ex.: menu) sem passar pela tela inicial. |

## 3. Escopo

### Dentro do escopo
- Tab bar inferior com tokens `color.surface.brand` (petro) no fundo e
  `color.action.primaryBackground` (primary) destacando, com um "pill", o
  item ativo — reaproveita a coleção de tokens já criada na F25/F34, nenhum
  token novo (confirmado em código, `apps/mobile/src/theme/tokens.ts`).
- Login bem-sucedido e retomada do app com sessão válida aterrissam no Menu
  principal, não mais direto no Perfil.
- A tab bar exibe 5 posições fixas, sempre na mesma ordem: Perfil →
  Clientes e Veículos → Catálogo → Ordens de Serviço → Financeiro. Nesta
  Sprint 01, **exatamente 1 item é habilitado e navegável (Perfil)**; os
  outros 4 são **visíveis e desabilitados** (ícone em traço, rótulo
  "indisponível nesta versão", sem navegação ao toque).
- Toque no item Perfil navega para a tela de Perfil ([[F30]]); toque em
  qualquer item desabilitado não navega.
- Rótulo acessível e alvo de toque mínimo de 44×44pt (iOS) / 48×48dp
  (Android) em cada item, habilitado ou desabilitado.
- Rótulo do item usa chave i18n (`menu.tabbar.<item>.rotulo` /
  `menu.tabbar.<item>.indisponivel` / `menu.tabbar.perfil.selecionado`), sem
  texto fixo no código — chaves já existentes em
  `apps/mobile/src/i18n/strings.ts`.
- Acesso direto ao menu sem sessão válida (deep link ou retomada do app sem
  token) redireciona para login antes de exibir qualquer item.

### Fora do escopo
- Navegação real ou conteúdo carregado para os 4 itens de módulo ainda não
  construído — eles existem só como placeholder visual desabilitado. A
  lógica de habilitação dinâmica por sprint é tarefa de cada feature de
  front do módulo correspondente (dúvida §6.1, ainda pendente).
- Overview ou indicador de pedidos em aberto no menu: conteúdo de dashboard
  (fora do escopo do projeto) e depende de Ordens de Serviço (Sprint 04).
  Candidato a incremento após a Sprint 04.
- Ícone final de produção para qualquer item — os ícones atuais
  (`@expo/vector-icons`/Ionicons) são placeholder; ícone definitivo é decisão
  de design futura, sem item de backlog aberto ainda.
- Diferença de item por perfil (ADMIN/FUNCIONARIO): fora de escopo do
  projeto inteiro (perfis ainda sem diferença de permissão, conforme
  briefing).

## 4. Premissas

1. Nesta fase (Sprint 01), das 5 posições fixas da tab bar, **só Perfil está
   habilitado** (1 item navegável); os outros 4 são placeholder desabilitado,
   não ausente.
2. A habilitação de cada item novo acompanha a ordem das sprints que entregam
   o módulo correspondente; a feature de front daquele módulo passa a incluir
   a tarefa de habilitar seu item no menu (troca de ícone traço→preenchido,
   remoção do estado `disabled`, ligação da rota real).
3. Dado pessoal: esta feature não introduz dado pessoal novo. Ela só lê o
   token de sessão já existente (governado pela tabela de ciclo de vida de
   dado pessoal de [[F30]] — finalidade "manter sessão autenticada no
   aparelho", base legal proposta art. 7º V/IX da LGPD, retenção até
   logout/401/desinstalação) para decidir redirecionar ou não; não exibe
   nome, e-mail nem CPF de ninguém. Nenhuma finalidade, base legal ou prazo
   de retenção novos a registrar aqui.
4. O fluxo de sessão expirada e o guard de rota sem sessão reusam a mesma
   infraestrutura de autenticação de [[F30]] (`auth-context.tsx`,
   `tratarSessaoExpirada`, `SecureStore`), não uma implementação paralela —
   confirmado em código: `apps/mobile/app/(menu)/_layout.tsx` usa
   `useAuth()` do mesmo contexto.
5. Retomada do app com sessão válida também aterrissa no Menu principal
   (`app/index.tsx` e `app/login.tsx` apontam para a rota do menu, não mais
   para `/perfil` isolado).

## 5. Decisão de escopo: item único navegável + 5 posições fixas

### 5.1 Histórico do conflito (contexto, já superado)

O recorte de F33 recebido originalmente trazia, em "Fora do escopo": "item
de menu para módulo ainda não construído" — lido à primeira vista como "zero
item visível" para os 4 módulos futuros. O protótipo de alta fidelidade
[[F34]] (Concluída, aprovada por CRIVO, `docs/design/figma.md:268-404`)
desenha 5 itens visíveis (Perfil habilitado + 4 desabilitados com ícone em
traço e rótulo "indisponível nesta versão"). Na revisão anterior desta PRD eu
registrei isso como um conflito e pedi confirmação explícita de REGENTE/PRUMO
antes de ORLA implementar (dúvida §6.2 da versão de 2026-11-07).

### 5.2 Decisão final (confirmada por REGENTE, 2026-11-09)

**"Item único" significa exatamente 1 item *navegável/habilitado*** — não 1
item total na tab bar. A tab bar continua mostrando as 5 posições fixas
desenhadas e aprovadas em F34; 4 delas permanecem desabilitadas nesta sprint.
Isso fecha a dúvida §6.2 sem descartar o trabalho de design já pago,
testado e aceito em F34.

Evidência de que esta é a leitura já em uso, não uma mudança de
implementação a partir de hoje:
- `apps/mobile/src/components/menu-tab-bar.tsx:20-23` — comentário explícito:
  "Único item navegável na Sprint 01 (US-MENU-02); os outros 4 são o
  placeholder visual já aprovado na F34, desabilitados e sem navegação."
- `apps/mobile/src/components/menu-tab-bar.test.tsx` — testes unitários já
  verificam 5 `tab` renderizados, 1 com `disabled: false` e 4 com
  `disabled: true`.
- `apps/mobile/src/integration/menu-routing.test.tsx` — teste de roteamento
  real (Expo Router, sem mock de `expo-router`) confirma 5 `tab` após login
  com sessão existente.
- `apps/mobile/src/integration/qa-f33-real-api.test.tsx` — QA de CRIVO
  rodado contra API real (login real, token real) confirma 5 itens, 1
  habilitado com rótulo "Perfil, aba selecionada", 4 desabilitados. Este
  arquivo está marcado "TESTE TEMPORÁRIO DE QA — NÃO SERÁ COMMITADO" e segue
  como pendência de limpeza (ver §10).

Isso **não** é uma decisão nova de produto tomada agora — é a confirmação
formal, pedida na revisão anterior, de uma leitura que ESQUADRO e ORLA já
haviam adotado e CRIVO já havia verificado. Fica registrado para que não haja
dúvida futura sobre se foi decisão deliberada ou desvio silencioso.

## 6. Dúvidas em aberto

1. Quando a Sprint 02 entregar Clientes/Veículos, a tarefa de "ligar" o item
   correspondente (ícone preenchido + rota real) entra na feature do próprio
   módulo ou numa fatia nova desta feature de Menu? Recomendo entrar na
   feature do módulo (ex.: F35), reaproveitando o placeholder visual já
   aprovado em F34. **Ainda pendente** de confirmação de PRUMO/REGENTE antes
   do fechamento da Sprint 02 — não bloqueia o fechamento da F33 em si.
2. Os 4 itens desabilitados ficam alcançáveis por foco de teclado/leitor de
   tela (anunciando "indisponível nesta versão"), decisão registrada por
   ESQUADRO em F34/F33-spec, mantida em US-MENU-06. Se CRIVO/REGENTE
   preferirem excluir os 4 itens futuros da ordem de tabulação no futuro, é
   ajuste de uma prop, não mudança estrutural — não bloqueia esta entrega.
3. US-MENU-07 (sessão expirada ao tocar em item do menu) continua sem
   gatilho real de rede no app hoje: nenhuma tela do menu chama
   `fetchAutenticado` a partir de um toque (Perfil não tem endpoint próprio).
   Mesmo gap já aceito em US-LGN-FRONT-07 (F30). O critério abaixo descreve
   a *reação* (o que o guard faz quando o status muda para não-autenticado),
   que é o que pode ser testado hoje; não é um cenário de ponta a ponta
   disparado por um toque real. Decisão de CRIVO/REGENTE: aceitar como
   "satisfeito estruturalmente" (mesma linguagem já usada na F30) ou exigir
   um gatilho real antes de outra feature de módulo existir.

## 7. Histórias de usuário e critérios de aceitação

### US-MENU-01 — Aterrissagem pós-login e pós-retomada no menu

**Como** funcionário autenticado da oficina, **quero** cair no Menu principal
assim que entro no app, **para** ter um ponto único de partida para qualquer
módulo, hoje e nas próximas sprints.

```gherkin
Cenário: aterrissagem após login bem-sucedido
  Dado que informei e-mail e senha válidos na tela de login
  E a API respondeu 200 com token e dados do usuário
  Quando a autenticação é concluída
  Então o app navega para a rota do Menu principal
  E não navega diretamente para a tela de Perfil isolada
  E a tab bar é exibida com 5 itens, o item "Perfil, aba selecionada" com
    accessibilityState.selected = true

Cenário: aterrissagem após retomada do app com sessão válida
  Dado um token de sessão válido já armazenado no SecureStore do aparelho
  Quando o app é reaberto (cold start) ou volta ao primeiro plano
  Então o app navega para a rota do Menu principal
  E não navega diretamente para a tela de Perfil isolada

Cenário de erro: sessão inválida na retomada
  Dado nenhum token válido armazenado no SecureStore do aparelho
  Quando o app é reaberto
  Então o app navega para a tela de login, não para o Menu principal
```
Cobertura já verificada: `menu-routing.test.tsx` (sessão válida → 5 tabs,
Perfil selecionado) e `_layout.test.tsx` (sessão inválida → `/login`, zero
`tab` renderizado).

### US-MENU-02 — Composição da tab bar na Sprint 01: 1 habilitado, 4 desabilitados

**Como** funcionário autenticado, **quero** ver todos os módulos previstos no
menu, mesmo os que ainda não existem, **para** entender a estrutura completa
do app e não estranhar quando um item novo for habilitado em sprint futura.

```gherkin
Cenário: cinco posições fixas, exatamente uma habilitada
  Dado o app na versão da Sprint 01
  Quando o Menu principal é exibido
  Então a tab bar renderiza exatamente 5 controles com accessibilityRole "tab"
  E a ordem da esquerda para a direita é Perfil, Clientes e Veículos,
    Catálogo, Ordens de Serviço, Financeiro
  E exatamente 1 item tem accessibilityState.disabled = false (Perfil)
  E os outros 4 itens têm accessibilityState.disabled = true

Cenário: toque em item desabilitado não navega
  Dado o Menu principal exibido com o item "Catálogo" desabilitado
    (accessibilityState.disabled = true)
  Quando toco nesse item
  Então nenhuma chamada de navegação ocorre
  E o app permanece na tela atual
```
Cobertura já verificada: `menu-tab-bar.test.tsx` (5 tabs, 1
`disabled:false` + 4 `disabled:true`; toque em item desabilitado não aciona
navegação).

### US-MENU-03 — Navegação para Perfil

**Como** funcionário autenticado, **quero** tocar no item Perfil da tab bar,
**para** ver e gerenciar meus próprios dados de sessão.

```gherkin
Cenário: navegação ao tocar no item Perfil
  Dado o Menu principal exibido com o item Perfil habilitado
  Quando toco no item com accessibilityLabel "Perfil, aba selecionada"
  Então o app exibe o conteúdo da tela de Perfil
  E a tab bar permanece visível com o item Perfil marcado como selecionado

Cenário: Perfil chega selecionado por ser a única aba habilitada
  Dado o Menu principal exibido na Sprint 01
  Quando nenhum outro item foi tocado ainda
  Então o item Perfil aparece com accessibilityState.selected = true por
    padrão
```
Cobertura já verificada: `qa-f33-real-api.test.tsx` (QA real contra API em
`localhost:8080`: login real → nome e e-mail do usuário exibidos sob o item
Perfil selecionado).

### US-MENU-04 — Identidade visual da tab bar

**Como** funcionário autenticado, **quero** reconhecer visualmente a
identidade da oficina no menu, **para** confiar que estou no app correto.

```gherkin
Cenário: cores da tab bar
  Dado o Menu principal exibido
  Quando verifico o estilo computado da barra
  Então o fundo usa o token color.surface.brand (petro)
  E o item selecionado exibe um "pill" de fundo color.action.primaryBackground
    atrás do ícone e do rótulo
  E nenhum item usa primary como cor direta de texto/ícone sobre o fundo
    petro (contraste insuficiente nessa combinação, ≈2,24:1)
```

### US-MENU-05 — Acessibilidade de rótulo e alvo de toque

**Como** funcionário usando leitor de tela ou com baixa destreza motora,
**quero** que cada item do menu anuncie seu estado e tenha área de toque
suficiente, **para** conseguir operar o app com segurança.

```gherkin
Cenário: rótulo e estado anunciados
  Dado o Menu principal exibido
  Quando um leitor de tela percorre os 5 itens
  Então o item Perfil anuncia "Perfil, aba selecionada"
  E cada um dos outros 4 itens anuncia "<Nome do módulo>, indisponível
    nesta versão"
  E nenhum item depende só de cor para comunicar seu estado

Cenário: alvo de toque mínimo
  Dado o Menu principal exibido
  Quando meço a área tocável de cada um dos 5 itens
  Então cada item mede ao menos 44×44pt (iOS) / 48×48dp (Android)
```
Cobertura já verificada: `menu-tab-bar.test.tsx` confirma os rótulos
acessíveis e a contagem de 5 `tab`; a medida de pixel do alvo de toque não
tem teste automatizado (depende de `minTouchTarget` do design system,
verificação visual/manual pendente — ver §10).

### US-MENU-06 — Navegação por teclado externo / leitor de tela

**Como** funcionário usando teclado externo ou leitor de tela, **quero**
percorrer os itens do menu em ordem lógica com foco visível, **para**
navegar sem depender de toque na tela.

```gherkin
Cenário: ordem de foco sem travamento
  Dado o Menu principal em foco
  Quando navego entre os itens usando Tab (teclado externo) ou gestos de
    leitor de tela
  Então o foco visita Perfil, Clientes e Veículos, Catálogo, Ordens de
    Serviço, Financeiro, nessa ordem
  E o foco nunca trava em nenhum item, incluindo os 4 desabilitados
  E cada item em foco exibe um anel de foco visível (branco,
    color.focus.ringOffset)
```
**Não verificado nesta revisão**: não há teste automatizado de navegação por
Tab/leitor de tela real sobre este componente; ESQUADRO já registrou a mesma
ressalva na spec de design. Pendência de verificação manual/E2E antes do
fechamento final de CRIVO (ver §10).

### US-MENU-07 — Sessão expirada ao interagir com o menu

**Como** sistema, **quero** encerrar a sessão local e redirecionar ao login
quando a sessão se torna inválida enquanto o usuário está no Menu principal,
**para** não permitir uso do app com token expirado.

```gherkin
Cenário: sessão vira não-autenticada enquanto o Menu está em tela
  Dado o Menu principal exibido com sessão previamente válida
  Quando o status de autenticação (useAuth().status.tipo) muda para
    "naoAutenticado"
  Então o app chama a mesma limpeza local de token usada em [[F30]]
    (tratarSessaoExpirada / SecureStore)
  E o app redireciona para a tela de login
  E nenhum item do menu permanece visível após o redirecionamento

Cenário de borda: toque em item não completa navegação durante a transição
  Dado a sessão acabou de ser invalidada (status mudando para
    "naoAutenticado")
  Quando toco em um item do menu antes do redirecionamento terminar
  Então a navegação para esse item não se completa
  E o redirecionamento para login prevalece
```
**Ressalva registrada (não é falha de implementação)**: hoje não existe, no
app, uma chamada de rede disparada por um toque no menu que produza um 401
real — o cenário acima testa a *reação* do guard a uma mudança de `status`,
não um gatilho de ponta a ponta "toco e a API responde 401". Mesma lacuna
estrutural aceita em US-LGN-FRONT-07 (F30). Ver dúvida §6.3.

## 8. Priorização e o que fica para depois

As 8 histórias (US-MENU-01 a 08) são P1. US-MENU-01 a 07 estão detalhadas
acima com critério executável; US-MENU-08 (acesso direto sem sessão) segue
coberta pelo mesmo guard de `app/(menu)/_layout.tsx`, já com teste automatizado
(`_layout.test.tsx`, `menu-routing.test.tsx`) — não repetida aqui a pedido do
comandante de focar 01 a 07, mas não removida do PRD nem da implementação.

Fica para depois, sem item de backlog aberto ainda:
- Habilitação dinâmica dos 4 itens futuros (cada feature de módulo cuida do
  próprio, dúvida §6.1).
- Overview/dashboard no menu (depende de Sprint 04, ver §3 Fora do escopo).
- Ícone final de produção (ver §3 Fora do escopo).
- Verificação manual/E2E de navegação por teclado externo e leitor de tela
  real (US-MENU-06) e medição de alvo de toque em dispositivo real
  (US-MENU-05) — pendências de teste, não de escopo.

## 9. Como validar esta PRD

Diferente da revisão anterior, **já existe código e teste rodado** a
conferir, não apenas especificação:
- `apps/mobile/app/(menu)/_layout.tsx` — guard de sessão + `MenuTabBar`.
- `apps/mobile/src/components/menu-tab-bar.tsx` — os 5 itens, 1 habilitado.
- `apps/mobile/src/components/menu-tab-bar.test.tsx`,
  `apps/mobile/app/(menu)/_layout.test.tsx`,
  `apps/mobile/src/integration/menu-routing.test.tsx` — testes unitários e
  de integração (Expo Router real) já escritos.
- `apps/mobile/src/integration/qa-f33-real-api.test.tsx` — QA de CRIVO
  contra API real; marcado para não ser commitado, ainda presente no
  `git status` (pendência de limpeza, não desta PRD).
- `apps/mobile/src/i18n/strings.ts:38-47` — chaves i18n do menu já
  cadastradas, sem texto fixo no componente.
- `apps/mobile/src/theme/tokens.ts` — tokens de cor/foco já existentes,
  nenhum token novo necessário.

Eu (BUSSOLA) li esses arquivos nesta revisão; não executei a suíte de testes
— isso é verificação de CRIVO, não desta etapa de PO.

## 10. Próximo passo

Handoff para ESQUADRO: confirmar que a especificação de design
(`docs/design/F33-especificacao-menu-tabbar.md`) permanece válida com esta
PRD travada (ela já assume 5 posições/1 habilitado, então não espero mudança
de spec) e revisar a ressalva de foco em item desabilitado (dúvida §6.2) à
luz da decisão final de hoje. Pendências a carregar para o fechamento de
CRIVO: (a) remover ou mover `qa-f33-real-api.test.tsx` do estado "temporário,
não commitado" para uma decisão explícita (commitar como teste de integração
real ou apagar); (b) verificação manual de navegação por teclado/leitor de
tela (US-MENU-06) e alvo de toque em dispositivo real (US-MENU-05); (c)
decisão de REGENTE/PRUMO sobre dúvida §6.1 antes do fechamento da Sprint 02.
