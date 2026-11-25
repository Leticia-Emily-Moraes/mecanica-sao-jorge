# F40 — Componentização do front mobile e camada de serviço

PRD — dono: BUSSOLA (Product Owner). Revisão: 2026-11-13 (retorno da revisão humana das 14:41; ajustes R6 a R10 da revisão das 20:44, aplicados por ORLA em §3.2).
Rota da feature: BUSSOLA → ORLA → CRIVO. Implementação: ORLA. Especificação de componentes: `docs/design/F40-componentes-base-especificacao.md` (ESQUADRO).
Prioridade P1 · Frontend · Sprint 01: Fundação e Login (agrupamento, ver dúvida 3).

**Depende de:** [[F00]], [[F30]], [[F33]], [[F34]] e **[[F41]] (para o fechamento, não para a escrita de código; ver §3.1).**
**Bloqueia:** [[F35]], [[F36]], [[F42]], [[F43]].

> **Status:** em revisão. **Não está entregue.** A rodada das 20:44 foi aplicada no código (US-COMP-01, 06) e nos critérios (US-COMP-10, 11, 12); falta o aceite do CRIVO e da pessoa. O US-COMP-11 foi **reescrito e não exige mais captura** (R8); o que vale de §3.1 é só a dependência da F41 no fechamento.

## 1. Visão

O app Expo já tem Login, Perfil e tab bar. Esta feature é uma refatoração sem mudança visual e sem mudança de comportamento, para que quem programar as próximas telas (F35, F36, F42, F43) herde botão, campo, cabeçalho, estados e camada de serviço prontos, em vez de copiar trecho visual entre telas. Valor para quem usa: nenhum visível hoje. Valor para quem mantém: alterar uma tela sem mexer nas outras, e acessibilidade herdada do componente.

## 2. Glossário

| Termo | Significado neste PRD |
|---|---|
| Componente base | Componente reutilizável em `src/components/ui/`, sem texto fixo, sem importar `i18n`, `hooks` ou `services`; todo texto chega por prop. |
| Estado de tela | Vazio, carregando ou erro, exibido pelo `StateView`. |
| Aviso inline | Mensagem de erro dentro do formulário que não troca a tela (`InlineAlert`). Não é estado de tela. |
| Antes / depois | `antes` = `c815235` (pai do primeiro commit da F40). `depois` = **o commit final da F40**, não necessariamente `a153494` (premissa 9). |
| Linha de base da F41 | Capturas lado a lado Figma × app que a F41 produz. **Não existe no repositório hoje** (§3.1). |
| Gatilho real | Ação do usuário no app que produz o evento de verdade (ex.: um 401 vindo de chamada autenticada disparada por toque). |

## 3. Decisões da revisão humana (13/11)

| # | Ponto da revisão | Decisão | Onde está tratado |
|---|---|---|---|
| R1 | Critério 1: item da tab bar declara estilo em `components/menu/menu-tab-bar.tsx` | **Extrair** o item para o componente base `TabBarItem` em `ui/`. Não registro exceção: a tab bar ganha itens habilitados a cada sprint, e é o elemento que mais vai se repetir. | US-COMP-01, tarefa 17 |
| R2 | Critério 10: sessão expirada sem gatilho no app | Registrar como **não verificável hoje**, com a reação coberta só por teste de unidade. O gatilho entra na **F35**, primeira feature de front que chama `fetchAutenticado` a partir de um toque. Mesmo tratamento de US-LGN-FRONT-07 (F30) e US-MENU-07 (F33). | US-COMP-10, dúvida 9 |
| R3 | Critério 11: só login vazio, com stub | **Reescrito** com matriz de estados, API real e ferramenta operável. **Aceite parcial rejeitado.** | US-COMP-11 |
| R4 | Critério 12 conflita com o modal | **Reescrito** em cenários separados (carregando sem mover foco; vazio; erro como modal aprovado em F30, que move o foco), mais validação em leitor de tela real. | US-COMP-12 |
| R5 | Quebra do pré-requisito da linha de base da F41 | Ver §3.1. | §3.1 |
| R6 | Revisão 20:44, critério 1: estilo no mesmo arquivo do JSX; pastas e telas | Estendido além das telas: nenhum componente de `ui/` nem o item da tab bar declara `StyleSheet` no arquivo do JSX; cada um tem `<nome>.styles.ts` na pasta do componente, lendo só do `tokens.ts`; telas em `src/screens`, `app/` só roteia. Estrutura em ADR-015 (CARTOGRAFO), imposta por lint e por teste. | US-COMP-01, §3.2 |
| R7 | Critério 6: mover arquivos só pode mudar import e renderização | Diff dos testes de F30 e F33 registrado em `docs/design/F40-evidencia-estrutura-ui.md`: só linhas de import. | US-COMP-06, §3.2 |
| R8 | Critério 11 obsoleto (design descartado em 13/11) | **Reescrito**: sem matriz de capturas; prova por suíte, árvore renderizada idêntica e fluxo real a cargo do CRIVO. Não bloqueia a entrega. | US-COMP-11, §3.2 |
| R9 | Critério 12: foco do modal e anúncio do carregando | Reescrito: modal de erro mantém o foco aprovado em F30; só o carregando exige anúncio sem mover o foco. VoiceOver e TalkBack seguem sem teste em aparelho. | US-COMP-12, §3.2 |
| R10 | Critério 10: sessão expirada sem gatilho | Registrado: o destino pós-expiração fica para a primeira feature que usar API autenticada (F35). `fetchAutenticado` continua sem chamador em produção; não liguei a chamada de propósito, para não inventar fluxo. | US-COMP-10, §3.2 |

### 3.2 Rodada de 13/11 20:44 (R6 a R10): o que mudou e onde
Ordem seguida: CARTOGRAFO registrou a estrutura no ADR-015 (status **proposto**) e só então a ORLA moveu os arquivos, em ramo próprio a partir da ponta da F41 (`1490234`). Nenhum texto de interface, valor de token ou comportamento foi alterado; a única mudança de contrato foi `ScreenContainer.topSpacing`, que passou de número para variante `'default' | 'form'` (valores 24 e 30, os mesmos de antes), porque a tela não pode mais importar token. Evidência (comandos, saídas e diff dos testes) em `docs/design/F40-evidencia-estrutura-ui.md`.

### 3.1 Quebra do pré-requisito e decisão sobre o US-COMP-11
*(Item 3 da decisão abaixo, que negava o aceite parcial do US-COMP-11, foi superado por R8. O restante, inclusive F41 como dependência de fechamento, segue valendo.)*

**O que foi verificado** (leitura do repositório em 2026-11-13; não rodei o app):
- Não existe arquivo de F41 em `docs/`, e nenhum commit do histórico a cita. A F41 está "Pronta", sem execução.
- A única origem da exigência é `docs/design/F40-componentes-base-especificacao.md` §2, item 6: "o PRUMO reteve a F40 até a F41 aprovar a linha de base". É afirmação de ESQUADRO sobre decisão do PRUMO, **sem documento de origem**. Consultado, o PRUMO disse não ter registro verificável de tê-la exigido nesses termos.
- O código da F40 já existe (`cb00d7b` a `a057e66`) e `c815235` é o pai do primeiro commit dela, então o "antes" é um estado limpo.

**O que isto significa:** a F40 foi codificada sem que a F41 tivesse produzido uma linha de base, e a ordem prevista não foi respeitada. Registro a quebra como fato. Não registro que "o PO exigiu o documento", porque não há fonte.

**Decisão:**
1. **F41 passa a "Depende de" da F40, só para o fechamento.** O código já existe, então a dependência não bloqueia mais a escrita. A F40 só é marcada entregue depois que a F41 aprovar a sua linha de base. As duas medem coisas diferentes: a F41 confere Figma × código; a F40 confere código × código.
2. **O "antes" da F40 continua sendo `c815235`.** Exigir um "antes" pós-F41 mediria a F41, não a refatoração. A F40 reproduz o código de hoje e deixa a troca visual (faixa petro, subtítulo, avatar, ícone de olho) para a F41.
3. **O US-COMP-11 não é aceito como parcial.** Só o login vazio foi comparado, e com stub. Aceitar isso repetiria o padrão que a auditoria da F37 e o QA da F39 já apontaram: fechar com evidência de um estado e declarar o resto. A feature fica **em revisão** até a matriz do US-COMP-11 estar completa. Isto não afeta o calendário de F35, F36, F42 e F43: elas já esperam os protótipos F26 a F29, que seguem bloqueados pela F39 (leitura do panorama, não conferi com o PRUMO).
4. **A F40 não é quebrada em duas.** Já está codificada; quebrar criaria itens de papel. Os critérios ficam em blocos (a), (b) e (c), só para rastrear o commit de cada um.

## 4. Escopo

### Dentro do escopo
- Componentes base: botão, campo de formulário, cabeçalho de tela, `StateView` (vazio, carregando, erro) e os que a spec justifica por tirar estilo de dentro de tela: `InlineAlert`, `InlineActionButton`, `ReadOnlyField`, `ScreenContainer`, `AccessProfileBadge`. **Novo nesta revisão: `TabBarItem`** (R1).
- Camada de serviço e hooks fora do JSX (chamada à API, token, conversão de dados), sem log de dado sensível.
- Tokens: acrescentar `borderWidth`, `opacity`, `iconSize`, `layout`, `glyph` e `focusRingRadius` com os valores que o código já usa.
- Acessibilidade herdada do componente base. Texto só por chave de i18n `area.componente.texto`.
- Teste de componente, de serviço e de hook. Prova de "sem mudança visual" (US-COMP-11) e validação em leitor de tela real (US-COMP-12).

### Fora do escopo
- Card de lista e badge de status genérico: entram na F35.
- Tela nova, mudança de layout, de fluxo ou de endpoint.
- Paridade com o Figma (faixa petro, subtítulo, avatar, ícone de olho, largura máxima em tela larga): F41.
- Estrutura de pastas do app: já decidida pelo CARTOGRAFO; mudança vira ADR.
- Qualquer mudança de status, escopo ou critério de F30, F33 e F34.
- Migração de identidade v1 para v2 (ADR-014): a F40 fica na v1.
- Gatilho real de sessão expirada: entra com a F35 (R2).

## 5. Premissas

1. Refatoração pura: resultado visual e comportamento de Login, logout com confirmação e aterrissagem no menu ficam idênticos ao aprovado em F30, F33 e F34.
2. `tokens.ts` já tinha `spacing`, `radius`, `typography`, `minTouchTarget`, `focusRingWidth` e `focusRingOffset` (confirmado pela spec §3). Os tokens novos têm o valor que o código já usava, sem alterar nenhum.
3. As buscas de verificação (hex, tamanho fixo, `fetch`, texto literal) valem para arquivos de tela e de componente e excluem o próprio `tokens.ts`.
4. Ajustes nos testes existentes de F30 e F33 limitam-se a import e a renderização; o que eles verificam não muda.
5. Dado pessoal: ver §6.
6. A acessibilidade herdada pode manter ou melhorar o que o F30 aprovou, nunca piorar. Toda mudança de anúncio é listada na entrega. Já há uma declarada na spec: o carregando da sessão (`app/index.tsx`) passa a ter região viva e `announceForAccessibility`.
7. O estado vazio é validado só por teste de componente: nenhuma tela atual o exibe. Decisão da pessoa, porque a F35 o usa na primeira lista.
8. **Regra sobre estilo (decide R1, estendida por R6):** nenhum arquivo `.tsx` (tela, layout ou componente) declara estilo; o estilo de cada componente fica em `<nome>.styles.ts`, na pasta do componente, e `app/` só roteia. *(Texto anterior permitia estilo de contêiner de composição no `.tsx` de `components/<área>/`; revogado por R6.)* Todo elemento que se repete ou que terá mais instâncias (item de aba, selo, campo) vira componente.
9. **O "depois" do US-COMP-11 é o commit final da F40.** Como R1 muda código em `apps/mobile` depois de `a153494`, as capturas "depois" só valem se tiradas depois da extração do `TabBarItem`. Capturar em `a153494` e depois mudar a tab bar invalidaria a prova.
10. Verificado em 2026-11-13: `git diff --stat a153494 HEAD -- apps/mobile` sai vazio, ou seja, `apps/mobile` não mudou desde `a153494`.

## 6. Dados pessoais (LGPD)

A F40 não coleta dado novo, não exibe dado novo e não muda finalidade, base legal ou retenção já registradas na F30 (`docs/product/F30-appsec-lgpd-login-perfil.md`, seção de LGPD).

| Dado | Finalidade | Base legal | Retenção |
|---|---|---|---|
| E-mail, senha, token e dados de perfil já tratados em F30 | Autenticar o funcionário e exibir o próprio perfil | Execução de contrato (art. 7, V), **proposta, a confirmar pelo controlador/DPO** (registro da F30) | Token e dados de perfil ficam no `SecureStore` até logout, 401 ou desinstalação; token com TTL de 7 dias |

Regras desta feature: senha, token e e-mail em claro **não vão para log**, inclusive na camada de serviço (US-COMP-15). Dado pessoal em teste e em captura usa valor fictício, e **o token não aparece em nenhuma captura anexada ao repositório**. Dado pessoal fica mascarado em log e em ambiente de teste.

## 7. Dúvidas em aberto

Resolvidas (mantidas para rastreio):
1. ~~Como provar "sem mudança visual"?~~ **Resolvida:** capturas antes/depois com a matriz do US-COMP-11, contra a API real.
2. ~~`tokens.ts` já tem tipografia e espaçamento?~~ **Resolvida:** sim (premissa 2).
3. ~~A Sprint 01 reabre?~~ **Resolvida por suposição do PRUMO:** o rótulo é agrupamento, a sprint não reabre; a pendência de evidência é rastreada nesta feature. *Julgamento do PRUMO, não fato verificado.*
4. ~~Estado vazio entra agora?~~ **Resolvida:** sim (premissa 7).
5. ~~Ordem F40 × F41?~~ **Resolvida:** F41 é dependência de fechamento (§3.1).
6. ~~Quebrar a F40?~~ **Resolvida:** não (§3.1, item 4).

Abertas:
7. **Ferramenta das capturas.** A sessão anterior não conseguiu tocar nem digitar no simulador (`cliclick` instável, ver `docs/design/F40-evidencia-paridade-visual.md`). Opções: simulador iOS operável, Maestro ou `idb`. Maestro e `idb` são ferramentas de teste fora do app; se entrarem no repositório (script, dependência), mudam como testar e exigem atualização do README principal. **Decide: a pessoa, com ORLA e CRIVO.** Recomendação: Maestro com fluxo versionado em texto, porque a mesma automação repete a prova depois da F41.
8. **Aparelho para leitor de tela.** US-COMP-12 exige VoiceOver ou TalkBack. Suponho que o simulador iOS não roda VoiceOver (não verifiquei); aparelho iOS real ou emulador Android com TalkBack resolvem. **Quem fornece o aparelho?** Sem ele o US-COMP-12 fica não verificado e a F40 não fecha.
9. **Onde entra o gatilho de sessão expirada.** Recomendo que a F35 inclua um critério "lista de clientes recebe 401, volta ao login com aviso". A F35 foi refinada à mão pela pessoa e **não alterei**; fica como pedido a ela.
10. **Variáveis de Figma para os tokens novos.** A regra do projeto diz que token novo entra "nos dois lados ao mesmo tempo". A F40 acrescentou tokens no código (`1b1939d`) e, pelo que a spec §3 registra, **nenhuma variável foi criada no Figma** (não conferi o arquivo). A spec adiou isso para depois da F41 (ADR-014, D3 aberta). Isto é uma quebra da regra que a revisão humana não citou. **Recomendação:** ESQUADRO cria as variáveis numéricas no fechamento da F40 (proposto como US-COMP-16). **Decide a pessoa:** aceitar o adiamento para a F41 exige registro explícito.
11. **Prova complementar sem aparelho (opcional).** Um teste que compare a árvore renderizada, com estilos achatados, em `c815235` e no commit final provaria equivalência estrutural sem simulador. Não substitui as capturas (não vê pixel, fonte nem sombra). Vale fazer? **Decide a pessoa.**

## 8. Histórias e critérios de aceitação

Formato `US-COMP-NN`, Gherkin em português. **Bloco (a)**: componentes base e tokens (commits `1b1939d`, `9a8d6a5`, `a5d7822`, `030797a`). **Bloco (b)**: serviço e hooks (`9a8d6a5`, `5241d05`). **Bloco (c)**: provas transversais.

### Bloco (a) — componentes base e tokens

#### US-COMP-01 — Telas compõem componentes base (revisado, R1)
**Como** pessoa que mantém o app, **quero** que as telas só componham componentes base, **para** alterar um elemento em um lugar só.

```gherkin
Cenário: telas sem estilo próprio
  Dado os arquivos de tela em src/screens/** e src/layouts/** (R6: antes viviam em app/**)
  Quando busco por StyleSheet.create e por style com valor literal
  Então não há ocorrência
  E todo botão, campo, cabeçalho e estado de vazio, carregando ou erro vem do componente base correspondente

Cenário: item da tab bar é componente base
  Dado a tab bar do menu principal
  Quando reviso components/menu/menu-tab-bar.tsx
  Então o item (ícone, rótulo, estado selecionado e indisponível, anel de foco) vem do componente TabBarItem em components/ui
  E menu-tab-bar.tsx não declara estilo: o contêiner da barra e a área segura vêm de menu-tab-bar.styles.ts (R6)
  E TabBarItem não contém texto fixo nem importa i18n, hooks ou services

Cenário: tab bar preservada
  Dado o MenuTabBar recomposto com TabBarItem
  Quando rodo a suíte da F33 e abro o app
  Então a ordem de foco é Perfil, Clientes e Veículos, Catálogo, Ordens de Serviço, Financeiro
  E cada aba mantém papel tab, rótulo acessível e estado selected e disabled de hoje
  E a árvore renderizada da tab bar é idêntica à da ponta da F41 (US-COMP-11, R8)

Cenário: teste do TabBarItem
  Dado o TabBarItem
  Quando rodo a suíte
  Então existe teste de componente com rótulo e papel, selecionado, indisponível (não dispara onPress) e anel de foco

Cenário: estilo fora do arquivo do JSX (R6, ADR-015)
  Dado qualquer componente de src/components, inclusive ui/ e o item da tab bar
  Quando busco StyleSheet.create e objeto de estilo inline no .tsx
  Então não há ocorrência, e o estilo está em <nome>.styles.ts na pasta do componente
  E o .tsx não importa @/theme/tokens; o .styles.ts importa só StyleSheet, tipos de estilo e tokens
  E npm run lint falha, com mensagem própria, quando uma dessas regras é violada de propósito

Cenário: app/ só roteia (R6, ADR-015)
  Dado os arquivos de app/
  Quando os leio
  Então cada um contém só export { default } from "@/screens/..." ou "@/layouts/..."
  E as telas estão em src/screens e os layouts em src/layouts
  E não há teste nem estilo dentro de app/
```

#### US-COMP-03 — Tokens centralizados
```gherkin
Cenário: sem valor fixo fora do tokens.ts
  Dado os arquivos de tela e de componente
  Quando busco hex de cor, fontSize, borderWidth, opacity e espaçamento literais fora de tokens.ts
  Então não há ocorrência
  E o comando de busca e a saída real constam da entrega
```

#### US-COMP-04 — TypeScript estrito e lint
```gherkin
Cenário: tsc e lint verdes
  Dado o app com componentes, hooks e serviços novos
  Quando rodo tsc em modo estrito e o lint
  Então ambos terminam sem erro
  E comando e saída real constam da entrega
```

#### US-COMP-05 — Teste de componente
```gherkin
Cenário: um teste por componente
  Dado cada componente criado ou alterado, inclusive TabBarItem
  Quando rodo a suíte
  Então há teste de componente executado, com comando e saída real
  E o StateView tem teste de vazio, de carregando e de erro
```

#### US-COMP-08 — Acessibilidade de botão e campo
```gherkin
Cenário: botão e campo herdam acessibilidade
  Dado o Button e o TextField base
  Quando os uso sem configurar acessibilidade extra
  Então expõem rótulo e papel acessível
  E mostram foco visível com anel duplo
  E, no campo, a mensagem de erro é anunciada ao leitor de tela, sempre com texto e nunca só por cor
```

#### US-COMP-13 — Sem texto fixo
```gherkin
Cenário: texto só por chave
  Dado os componentes base e as telas recompostas
  Quando busco texto de interface literal fora do tokens.ts e dos arquivos de teste
  Então não há ocorrência
  E todo texto vem de chave no formato area.componente.texto
```

### Bloco (b) — camada de serviço e hooks

#### US-COMP-02 — Sem chamada de API na tela
```gherkin
Cenário: tela sem fetch
  Dado os arquivos de tela
  Quando busco por fetch ou chamada HTTP direta
  Então não há ocorrência
  E API, token e conversão de dados vivem em src/services e src/hooks
```

#### US-COMP-14 — Serviço e hooks testados
```gherkin
Cenário: sucesso e três falhas
  Dado a camada de serviço e cada hook novo
  Quando rodo a suíte
  Então há teste executado de sucesso, de credencial inválida, de erro de conexão e de sessão expirada (a reação, ver US-COMP-10)
  E comando e saída real constam da entrega
```

#### US-COMP-15 — Log sem dado sensível
```gherkin
Cenário: erro sem vazamento
  Dado a camada de serviço
  Quando ocorre erro de login ou de rede
  Então nenhum log contém senha, token ou e-mail em claro
  E o teste usa e-mail e senha fictícios
```

### Bloco (c) — provas transversais

#### US-COMP-06 — Suíte existente preservada
```gherkin
Cenário: F30 e F33 passam sem mudar o que verificam
  Dado a suíte de F30 e F33
  Quando a rodo depois da refatoração
  Então passa
  E o diff dos testes antigos mostra só import e renderização (premissa 4)
  E o diff vem registrado na entrega (R7): em F30 e F33 só mudaram linhas de import
```

#### US-COMP-07 — Fluxo principal idêntico
```gherkin
Cenário: login, perfil, logout, login
  Dado a refatoração concluída e a API real no ar
  Quando faço login válido, abro o Perfil, confirmo o logout e volto ao login
  Então cada passo se comporta como aprovado em F30 e F33
  E o login pousa no menu principal
```

#### US-COMP-09 — Árvore limpa
```gherkin
Cenário: git status limpo
  Dado a feature pronta para ser marcada como entregue
  Quando rodo git status
  Então não há pendência
  E nenhum arquivo gerado, segredo ou binário grande está versionado
  E esta rodada não versiona imagem nova (R8: sem captura)
```

#### US-COMP-10 — Erros preservados (revisado, R2)
```gherkin
Cenário: credencial inválida
  Dado a API real no ar e um usuário fictício cadastrado
  Quando entro com senha errada
  Então a mensagem é "E-mail ou senha incorretos." sem indicar o campo
  E o destino continua sendo a tela de login

Cenário: sem conexão com a API
  Dado a API real derrubada de propósito
  Quando tento entrar
  Então aparece o modal de erro de rede aprovado em F30, com as ações de tentar de novo e a secundária
  E o destino continua sendo a tela de login

Cenário: sessão expirada, a reação (verificável hoje só por teste de unidade)
  Dado fetchAutenticado recebendo 401
  Quando o erro SessaoExpiradaError chega a tratarSessaoExpirada
  Então a sessão local é apagada
  E o status vira naoAutenticado com sessaoExpirada verdadeiro
  E o login mostra o aviso de login.sessaoExpirada.mensagem

Cenário: sessão expirada, o gatilho real (NÃO VERIFICÁVEL HOJE)
  Dado que nenhum código de produção chama fetchAutenticado nem tratarSessaoExpirada
  Quando se pergunta se o destino da navegação foi exercitado de ponta a ponta
  Então a resposta registrada na entrega é "não verificável hoje"
  E o gatilho passa a existir na F35 (dúvida 9)
  E o mesmo gap já é aceito em US-LGN-FRONT-07 (F30) e US-MENU-07 (F33)
  E o destino pós-expiração fica registrado aqui para a primeira feature que usar API autenticada (R10)
```

Verificado nesta revisão por busca no código (Grep em `apps/mobile/{app,src}`): `tratarSessaoExpirada` e `SessaoExpiradaError` só têm consumidor em teste; `fetchAutenticado` só aparece em `http-client.test.ts` e `auth-service-logging.test.ts`. Não rodei a suíte.

#### US-COMP-11 — Aparência idêntica (reescrito, R8: prova sem captura)
**Como** Product Owner, **quero** prova de que a refatoração de estrutura não mudou nada do que o app mostra, **para** não aceitar na fé.

**Retirada a matriz de 13 capturas.** Em 13/11 a pessoa descartou o design atual: Login, Perfil e tab bar serão redesenhados na F39 e reprogramados depois da F41. Capturar os 12 estados restantes mediria um visual que vai ser trocado, e a F41 já fixou a linha de base visual em `docs/design/F41-conferencia-paridade.md` (8 capturas e md5). O critério deixa de exigir captura e **não bloqueia a entrega**.

**Prova que o substitui**, sobre a mudança de estrutura do ADR-015 (pasta por componente, `*.styles.ts`, `src/screens`):

```gherkin
Cenário: suíte inteira verde depois da mudança
  Dado a suíte do app antes da mudança de estrutura (30 suítes, 170 testes, ponta da F41)
  Quando a rodo depois, no mesmo ramo
  Então passa com o mesmo número de testes ou mais (31 suítes, 176 testes)
  E os testes de F30 e F33 só mudam o caminho de import (US-COMP-06)

Cenário: a árvore renderizada não mudou
  Dado Login (vazio e com erro de validação), reidratação de sessão, tab bar, Perfil e diálogo de saída
  Quando renderizo cada estado na ponta da F41 (1490234) e no commit final, com o mesmo harness
  Então o JSON da árvore (elementos, estilos achatados e props de acessibilidade) é byte a byte idêntico
  E o hash dos dois arquivos é o mesmo

Cenário: fluxo real contra a API (a cargo do CRIVO)
  Dado a API real no ar e um usuário fictício
  Quando faço login válido, abro o Perfil, confirmo o logout e volto ao login
  Então cada passo se comporta como aprovado em F30 e F33
```

Declarado **não coberto**: captura de pixels em simulador ou aparelho; fluxo real contra a API (não executado pela ORLA nesta entrega, fica com o CRIVO); o lado Figma (F41). O resultado e o método estão em `docs/design/F40-evidencia-estrutura-ui.md`.

#### US-COMP-12 — Acessibilidade do componente de estado (reescrito, R4 e R9)
**Como** pessoa que usa leitor de tela, **quero** ser avisada de carregando e de erro sem perder o contexto onde não precisa, **para** usar o app sem ver a tela.

O texto anterior ("entrada em carregando ou erro anunciada sem o foco sair do lugar") conflitava com o modal de erro aprovado em F30 (US-DES-13), que por definição move o foco para o diálogo. Fica assim:

```gherkin
Cenário: carregando anuncia sem mover o foco
  Dado o StateView em carregando
  Quando ele entra na tela
  Então o texto de loadingLabel é legível e o papel é exposto
  E o carregando é anunciado por região viva polite e por announceForAccessibility
  E o foco do leitor não é movido por causa do carregando

Cenário: vazio é legível e a ação é um botão
  Dado o StateView em vazio com título, mensagem e ação
  Quando o leitor percorre o componente
  Então lê título e mensagem em ordem
  E a ação é anunciada como botão e dispara onAction
  E o ícone decorativo fica escondido do leitor

Cenário: erro mantém o modal aprovado em F30
  Dado o StateView em erro com visible verdadeiro
  Quando o diálogo aparece
  Então o foco do leitor vai para o diálogo (accessibilityViewIsModal)
  E o diálogo é anunciado como alerta assertivo, com título e mensagem
  E os botões de tentar de novo e secundário têm papel e rótulo
  E o glifo de aviso fica escondido do leitor
  E o comportamento é idêntico ao do ErrorRetryModal da F30

Cenário: nenhum anúncio de F30 piorou
  Dado a matriz da spec §5 (docs/design/F40-componentes-base-especificacao.md)
  Quando comparo o que o leitor anuncia em Login, Perfil, diálogo de saída, aviso inline e tab bar
  Então o anúncio é igual ou melhor
  E cada mudança fica listada na entrega

Cenário: leitor de tela real (R9: segue sem teste em aparelho)
  Dado que não há VoiceOver em aparelho iOS real nem TalkBack em Android disponíveis para esta entrega
  Quando se pergunta o que o leitor anuncia de fato
  Então a resposta registrada é "não verificado em aparelho": só as props de acessibilidade são provadas, por teste de componente
  E quando houver aparelho, percorro Login, erro de rede, Perfil, diálogo de saída e tab bar, registro o anunciado passo a passo e listo diferenças da matriz da spec §5
```

Nota para o CRIVO: o teste de componente prova que as props de acessibilidade existem; só o leitor real prova o que é anunciado. Nesta entrega só o primeiro foi feito (R9); a F40 não declara o segundo como verificado.

#### US-COMP-16 — Tokens novos também no Figma (proposto, depende da dúvida 10)
```gherkin
Cenário: variável de Figma para cada token novo
  Dado os tokens borderWidth, opacity, iconSize, layout e focusRingRadius acrescentados no tokens.ts
  Quando abro a coleção de variáveis do arquivo de alta fidelidade
  Então existe variável numérica com o mesmo valor para cada um
  E o nome do token e o da variável estão registrados lado a lado na entrega

Cenário: Figma inacessível
  Dado que o MCP do Figma está bloqueado ou sem link do arquivo na sessão
  Quando tento criar as variáveis
  Então a saída real da tentativa é registrada
  E a F40 fica aguardando, sem ser marcada como pronta só com o lado do código
```

## 9. Tarefas

Marcação: o código das tarefas 1 a 16 existe em commits, mas a revisão humana de 13/11 as devolveu como não aceitas. **Nenhuma é marcada aqui**; quem marca é o CRIVO, depois da evidência.

1. [ ] Verificar no `tokens.ts` o que existe e completar sem mudar valores (commit `1b1939d`)
2. [ ] ~~Capturas "antes"~~ **Obsoleta (R8):** substituída pelo dump da árvore renderizada na ponta da F41 (`1490234`), comparado com o commit final
3. [ ] Componente de botão
4. [ ] Componente de campo
5. [ ] Componente de cabeçalho
6. [ ] Componente de estado (vazio, carregando, erro)
7. [ ] Camada de serviço e hooks sem log sensível
8. [ ] Recompor Login, Perfil e tab bar, com i18n
9. [ ] Tokens no lugar de valores fixos
10. [ ] Teste de componente para cada componente
11. [ ] Teste de serviço e de hooks
12. [ ] tsc estrito, lint e suíte de F30 e F33, com saída real
13. [ ] Buscas de verificação (fetch em tela, hex, tamanho fixo, texto literal, `StyleSheet.create` fora de `*.styles.ts`)
14. [ ] ~~Capturas "depois"~~ **Obsoleta (R8):** comparação das árvores renderizadas e lista de mudança de anúncio (nenhuma: as props de acessibilidade estão idênticas no dump)
15. [ ] Commits pequenos em Conventional Commits, sem trailer de coautor
16. [ ] `git status` limpo no fechamento
17. [ ] **(novo, R1)** Extrair `TabBarItem` para `components/ui/`, com teste de componente; `MenuTabBar` passa a compô-lo. Alinhar com ESQUADRO a seção 4.10 da spec, que hoje diz que o `MenuTabBar` só troca valores fixos. **Fazer antes das tarefas 2 e 14.**
18. [ ] **(novo, R2)** Registrar na entrega a sessão expirada como "não verificável hoje" e o pedido à pessoa sobre a F35 (dúvida 9)
19. [ ] **(novo, R4)** Validar anúncios em VoiceOver ou TalkBack e listar as diferenças em relação à spec §5
20. [ ] **(novo, R5)** Manter a F40 fora de "entregue" até a F41 aprovar a sua linha de base
21. [ ] **(novo, condicional à dúvida 10)** Variáveis de Figma para os tokens novos (US-COMP-16)
22. [ ] **(novo)** README principal: registrar "README sem mudança" com o motivo, ou atualizar se a dúvida 7 trouxer Maestro ou `idb` ao repositório

## 10. O que fica para depois
- `Badge` genérico e card de lista: F35. Quando o `Badge` existir, o `AccessProfileBadge` deve ser substituído por ele (dívida consciente da spec).
- Faixa petro, subtítulo, avatar, ícone de olho, largura máxima em tela larga: F41.
- Migração v1 para v2 dos tokens: feature própria (ADR-014, D3).
- Nova linha de base visual depois da migração v2: F41.

## 11. Como validar este PRD

1. `git log --oneline -- docs/product/F40-componentizacao-front-mobile.md` mostra o commit deste texto.
2. `grep -n "F41" docs/product/F40-componentizacao-front-mobile.md` mostra a dependência no cabeçalho e em §3.1.
3. `grep -c "^| 11\." docs/product/F40-componentizacao-front-mobile.md` devolve 0 (a matriz do US-COMP-11 foi retirada em R8).
4. `git diff --stat a153494 HEAD -- apps/mobile` sai vazio (premissa 10) enquanto o `TabBarItem` não for extraído.

README sem mudança: este commit só adiciona um PRD em `docs/product/`; não muda como instalar, rodar, testar ou configurar o projeto.
