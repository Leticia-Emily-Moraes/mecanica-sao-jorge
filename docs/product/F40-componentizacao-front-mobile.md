# F40 — Componentização do front mobile e camada de serviço

PRD — dono: BUSSOLA (Product Owner). Revisão: 2026-11-13 (retorno da revisão humana das 14:41).
Rota da feature: BUSSOLA → ORLA → CRIVO. Implementação: ORLA. Especificação de componentes: `docs/design/F40-componentes-base-especificacao.md` (ESQUADRO).
Prioridade P1 · Frontend · Sprint 01: Fundação e Login (agrupamento, ver dúvida 3).

**Depende de:** [[F00]], [[F30]], [[F33]], [[F34]] e **[[F41]] (para o fechamento, não para a escrita de código; ver §3.1).**
**Bloqueia:** [[F35]], [[F36]], [[F42]], [[F43]].

> **Status:** em revisão. **Não está entregue.** Tem pendências abertas em US-COMP-01, 10, 11 e 12 (§8). O US-COMP-11 **não é aceito como parcial** (decisão em §3.1).

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

### 3.1 Quebra do pré-requisito e decisão sobre o US-COMP-11

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
8. **Regra sobre estilo (nova, decide R1):** arquivo de **tela** (`app/**`) não declara estilo nenhum. Arquivo de `components/<área>/` pode declarar apenas estilo de **contêiner de composição** (ex.: a barra e a área segura do `MenuTabBar`). Todo elemento que se repete ou que terá mais instâncias (item de aba, selo, campo) vira componente em `ui/`.
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
  Dado os arquivos de tela em app/**
  Quando busco por StyleSheet.create e por style com valor literal
  Então não há ocorrência
  E todo botão, campo, cabeçalho e estado de vazio, carregando ou erro vem do componente base correspondente

Cenário: item da tab bar é componente base
  Dado a tab bar do menu principal
  Quando reviso components/menu/menu-tab-bar.tsx
  Então o item (ícone, rótulo, estado selecionado e indisponível, anel de foco) vem do componente TabBarItem em components/ui
  E menu-tab-bar.tsx declara só o estilo de contêiner da barra e da área segura
  E TabBarItem não contém texto fixo nem importa i18n, hooks ou services

Cenário: tab bar preservada
  Dado o MenuTabBar recomposto com TabBarItem
  Quando rodo a suíte da F33 e abro o app
  Então a ordem de foco é Perfil, Clientes e Veículos, Catálogo, Ordens de Serviço, Financeiro
  E cada aba mantém papel tab, rótulo acessível e estado selected e disabled de hoje
  E a captura da tab bar (US-COMP-11, linha 11.12) é idêntica à de c815235

Cenário: teste do TabBarItem
  Dado o TabBarItem
  Quando rodo a suíte
  Então existe teste de componente com rótulo e papel, selecionado, indisponível (não dispara onPress) e anel de foco
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
  E as únicas imagens versionadas são as capturas do US-COMP-11, em docs/design/f40-capturas/, com o tamanho de cada uma registrado na entrega
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
```

Verificado nesta revisão por busca no código (Grep em `apps/mobile/{app,src}`): `tratarSessaoExpirada` e `SessaoExpiradaError` só têm consumidor em teste; `fetchAutenticado` só aparece em `http-client.test.ts` e `auth-service-logging.test.ts`. Não rodei a suíte.

#### US-COMP-11 — Aparência idêntica (reescrito, R3; alcance explícito)
**Como** Product Owner, **quero** prova visual de que a refatoração não mudou nada, **para** não aceitar na fé.

**Alcance:** todos os estados da matriz abaixo, antes (`c815235`) e depois (commit final da F40), no **mesmo aparelho ou simulador**, **contra a API real** (nada de stub: para erro de credencial a API real responde 401, e para erro de rede ela é derrubada), com ferramenta operável (dúvida 7).

**Situação atual:** o que existe, `login-vazio-antes-c815235.png` e `login-vazio-depois-a153494.png`, vale **só** para a linha 11.1 e com ressalva: foi feito com stub e o "depois" é `a153494`, não o commit final. A linha 11.1 também precisa ser refeita. Resultado: **0 de 13 linhas com valor de aceite.**

| ID | Estado | Tela |
|---|---|---|
| 11.1 | Vazio | Login |
| 11.2 | Foco no campo e-mail | Login |
| 11.3 | Foco no botão Entrar | Login |
| 11.4 | Erro de validação nos campos | Login |
| 11.5 | Preenchido | Login |
| 11.6 | Senha visível | Login |
| 11.7 | Carregando (latência controlada na API) | Login |
| 11.8 | Erro de credencial (aviso inline) | Login |
| 11.9 | Erro de rede (modal) | Login |
| 11.10 | Perfil preenchido | Perfil |
| 11.11 | Diálogo de confirmação de saída | Perfil |
| 11.12 | Tab bar (selecionada, indisponíveis e foco na aba selecionada) | Menu |
| 11.13 | Retorno ao login após o logout | Login |

```gherkin
Cenário: um estado, duas capturas, sem diferença
  Dado a linha N da matriz, a API real no ar e o mesmo aparelho nos dois commits
  Quando capturo o estado em c815235 e no commit final da F40
  Então a diferença de pixels, fora da barra de status, é zero
  E cada captura tem hash diferente das capturas dos outros estados
  E o par e o resultado ficam anexados em docs/design/f40-capturas/

Cenário: captura que não chegou ao estado é descartada
  Dado duas capturas de estados diferentes com o mesmo hash
  Quando comparo
  Então a comparação é inválida e o estado volta a "não provado"

Cenário: a feature só fecha com a matriz completa
  Dado que alguma linha da matriz está sem par de capturas válido
  Quando se pede o aceite do US-COMP-11
  Então o aceite é negado
  E a F40 permanece em revisão
```

Por que o segundo cenário existe: em 2026-11-13 uma comparação de foco e de erro deu "idêntico" porque as três fotos eram o mesmo arquivo (login vazio), registrado em `docs/design/F40-evidencia-paridade-visual.md`.

Fora do alcance e declarado **não coberto** (não vira critério): larguras de 360, 768 e 1280 px (a refatoração não altera largura; a spec registra que em 1280 o formulário já estica hoje); o aviso de sessão expirada no login (mesmo gap do US-COMP-10); o lado Figma (F41).

#### US-COMP-12 — Acessibilidade do componente de estado (reescrito, R4)
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

Cenário: validação em leitor de tela real
  Dado VoiceOver em aparelho iOS real, ou TalkBack em Android (aparelho ou emulador)
  Quando percorro Login, erro de rede, Perfil, diálogo de saída e tab bar
  Então o que foi anunciado é registrado na entrega, passo a passo
  E qualquer diferença da matriz da spec §5 é listada
  E sem aparelho disponível o cenário fica "não verificado" e a F40 não fecha (dúvida 8)
```

Nota para o CRIVO: o teste de componente prova que as props de acessibilidade existem; só o leitor real prova o que é anunciado. Os dois são exigidos.

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
2. [ ] Capturas "antes" em `c815235`: agora a matriz inteira do US-COMP-11, com API real
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
13. [ ] Buscas de verificação (fetch em tela, hex, tamanho fixo, texto literal, `StyleSheet.create` em `app/**`)
14. [ ] Capturas "depois" e comparação, listando mudança de anúncio
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
3. `grep -c "^| 11\." docs/product/F40-componentizacao-front-mobile.md` devolve 13 (a matriz do US-COMP-11).
4. `git diff --stat a153494 HEAD -- apps/mobile` sai vazio (premissa 10) enquanto o `TabBarItem` não for extraído.

README sem mudança: este commit só adiciona um PRD em `docs/product/`; não muda como instalar, rodar, testar ou configurar o projeto.
