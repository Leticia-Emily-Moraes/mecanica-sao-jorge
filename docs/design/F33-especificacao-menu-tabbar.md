# F33 — Menu principal de navegação (tab bar) — especificação

- Prioridade: P1 / Área: Frontend / Sprint 01
- Autora: ESQUADRO (Design system e acessibilidade)
- Data: 2026-11-07
- Etapa da rota: BUSSOLA → **ESQUADRO (2/4)** → ORLA → CRIVO
- Entradas desta etapa: `docs/product/F33-menu-principal-navegacao.md` (PRD,
  BUSSOLA), página `F34 · Tab bar alta fidelidade` do Figma (`docs/design/figma.md:268-404`,
  já **Concluída e aprovada por CRIVO**), código real de `apps/mobile`.

## 1. O que eu verifiquei nesta sessão, de fato

- **Figma real**, não só o registro em `figma.md`: `whoami` sem bloqueio;
  `get_metadata` na página `39:2` confirmou os 3 frames (`39:3`, `39:31`,
  `39:58`) com a árvore de nós exatamente como `figma.md` descreve (pill,
  ícones, rótulos, anel de foco); `get_screenshot` da página inteira confirma
  visualmente fundo petro, pill primary no item ativo, 5 posições na ordem
  Perfil → Clientes e Veículos → Catálogo → Ordens de Serviço → Financeiro, e
  as 3 legendas de acessibilidade coerentes com o texto do doc.
- **Código real do app mobile** (`apps/mobile/app/` e `apps/mobile/src/`):
  - `app/index.tsx` já existe e já é o guard de sessão (US-LGN-FRONT-06 da
    F30): decide entre `/perfil` e `/login` a partir de `status.tipo`, com
    `ActivityIndicator` (estado carregando) e `ErrorRetryModal` (estado de
    erro de inicialização) — ambos já usando os tokens corretos
    (`color.text.primary`, `color.surface.default`).
  - `app/login.tsx:33-35` e `app/index.tsx:24-25` redirecionam para
    `/perfil` hoje — confirma literalmente o que o PRD aponta como estado
    atual a mudar.
  - `app/perfil.tsx:17-21` já tem seu próprio guard independente (redireciona
    a `/login` se `status.tipo` não for `autenticado`/`carregando`) — ou
    seja, o app já usa o padrão de "cada tela protegida confere a sessão de
    novo", não só a tela de entrada.
  - `src/api/http.ts`: existe `fetchAutenticado`/`SessaoExpiradaError`, mas
    **nenhuma tela chama isso ainda** — Perfil não tem endpoint próprio (F25
    PRD, Dúvida 1) e por isso nunca dispara 401. Mesmo gap que CRIVO já
    registrou na F30 (`US-LGN-FRONT-07 sem gatilho real no app hoje`).
  - `src/theme/tokens.ts`: os tokens que o PRD e a F34 citam
    (`color.surface.brand`, `color.action.primaryBackground`,
    `color.text.onBrand`, `color.text.onPrimaryAction`,
    `color.focus.ringOffset`) **já existem no código, com os mesmos nomes e
    valores** calculados na F25/F34. Nenhum token novo é necessário para a
    F33.
  - `src/i18n/strings.ts`: convenção confirmada — dicionário único por chave
    `area.componente.texto`, função `t(chave)`, tipo `ChaveTexto` fechado.

Não assumi nada do que está descrito abaixo sem checar o arquivo ou o código
correspondente; onde não pude verificar (interação real em teclado/leitor de
tela), digo isso explicitamente na seção 7.

## 2. Resposta à dúvida §10 do PRD (BUSSOLA): falta frame novo no Figma?

**Decisão: não falta frame novo.** O "instante de redirect" de US-MENU-08
(nenhum item do menu exibido antes do login aparecer) não é um estado visual
da tab bar — é o comportamento do guard que já existe em código,
`app/index.tsx`, que **nunca chega a montar a tab bar** enquanto decide o
destino. Esse guard:

- já está implementado (F30) e já usa os tokens certos (fundo
  `color.surface.default`, spinner `color.text.primary`, anúncio
  `sessao.inicializando.anuncio`);
- nunca foi desenhado como frame próprio em nenhuma página do Figma (nem a
  F25 tem um frame "splash/guard" — é tela interna, genérica, sem UI de
  produto além do spinner), então não há uma "ausência" a preencher, é
  consistente com o que já existe;
- cobre tanto US-MENU-01 (pós-login) quanto US-MENU-08 (deep link/retomada
  sem sessão) com a mesma tela, só trocando o destino do `router.replace`.

Logo, o único trabalho de design que falta para isso é **mudar a navegação
além de Perfil**, não desenhar nada novo. Especificado na seção 4. Registro
esta decisão aqui como a resposta de ESQUADRO à pergunta §10 do PRD; não
precisa de sign-off adicional de REGENTE/PRUMO porque não é uma mudança de
escopo visual, é a confirmação de que o artefato já aprovado (F34) + o guard
já implementado (F30) somados cobrem a história.

## 3. Fluxo e hierarquia de navegação

```
Login (preenchido) ──Entrar──▶ index guard (carregando) ──autenticado──▶ Menu principal (tab: Perfil)
                                        │
                                        └──não autenticado──▶ Login

Retomada do app / deep link ──▶ index guard (carregando) ──autenticado──▶ Menu principal (tab: Perfil)
                                        │
                                        └──sem token / expirado──▶ Login

Menu principal (tab bar) ──toco em Perfil──▶ conteúdo do tab Perfil (mesma tela já existente)
Menu principal (tab bar) ──toco em item desabilitado──▶ nenhuma navegação (US-MENU-02)
```

Hierarquia de informação da tab bar: 5 posições fixas, mesma ordem sempre
(Perfil, Clientes e Veículos, Catálogo, Ordens de Serviço, Financeiro); dentro
de cada posição, ícone acima do rótulo, estado visual (preenchido/traço,
pill/sem pill, opacidade) é o único sinal de "disponível nesta sprint" além
do texto "indisponível nesta versão" no rótulo acessível — nunca só cor
(cumpre US-MENU-04/05 sem depender de percepção de cor).

## 4. O que muda no código existente (requisito de navegação, não implementação)

Isto é especificação de comportamento para ORLA decidir a implementação
técnica (Expo Router `Tabs` ou solução equivalente é a opção idiomática, mas
a escolha de API é de ORLA):

1. **`app/index.tsx`**: trocar o destino de `router.replace('/perfil')`
   (linha 25) para o destino do Menu principal com o tab Perfil ativo. O
   restante do componente (loading, erro, retry) não muda.
2. **`app/login.tsx`**: mesma troca na linha 34.
3. **Menu principal**: uma tela/layout novo que renderiza a tab bar (frames
   `39:3`/`39:31`/`39:58`) e, como conteúdo do tab Perfil, **reaproveita
   `app/perfil.tsx` tal como está** (título, campos, botão Sair, diálogo de
   confirmação) — não duplicar essa tela. Se a implementação usar Expo
   Router `Tabs`, isso tipicamente move `perfil.tsx` para dentro de um grupo
   de rotas (ex.: `app/(tabs)/perfil.tsx`), o que muda o caminho de import
   em `app/perfil.test.tsx` — sinalizo para ORLA não esquecer de ajustar o
   teste existente, não é regra de design, é efeito colateral de arquivo.
4. **Guard duplicado no nível do Menu**: `app/perfil.tsx:17-21` já confere a
   sessão de novo, independente do `index.tsx`. Esse padrão de defesa dupla
   deve se manter: o layout do Menu (ou cada tab) confere `status.tipo` e
   redireciona a `/login` se não for `autenticado`, **antes de exibir
   qualquer item** — é o que cobre US-MENU-08 no caso de alguém entrar direto
   numa rota do Menu sem passar pelo `index.tsx` (deep link direto para
   dentro do grupo de tabs).
5. **Os 4 itens desabilitados não navegam**: tocar neles não chama
   `router.push`/`replace` nenhum (US-MENU-02, cenário "toque em item
   desabilitado").

## 5. Estados da tela (carregando / vazio / erro / sucesso)

A tab bar em si **não tem estado de carregamento, vazio ou erro próprio** —
ela não busca dado de rede, as 5 posições são estáticas. Os quatro estados da
casa mapeiam assim para esta feature:

| Estado | Onde aparece | Status |
|---|---|---|
| Carregando | `app/index.tsx`, enquanto lê o SecureStore | Já implementado (F30), reaproveitado sem mudança visual |
| Vazio | Não se aplica — a tab bar sempre tem 5 posições fixas, nunca "nenhum item" | N/A, registrado para não virar pendência fantasma |
| Erro | `app/index.tsx` → `ErrorRetryModal` se a leitura do SecureStore falhar | Já implementado (F30), reaproveitado sem mudança visual |
| Sucesso | Menu principal renderizado, tab Perfil selecionado (frame `39:3`) | Especificado nesta feature + já desenhado na F34 |

Não desenhei um estado de "erro ao abrir o Menu" próprio porque não há
chamada de rede nova nesta feature — abrir o Menu é navegação local depois
que `index.tsx` já decidiu que a sessão é válida.

## 6. Contrato de acessibilidade (WCAG 2.2 AA)

Reaproveitado integralmente da F34 (`docs/design/figma.md:345-369`), sem
mudança — repito aqui como contrato de implementação para ORLA não precisar
voltar ao Figma:

| Item | role | accessibilityState | Rótulo anunciado |
|---|---|---|---|
| Perfil | tab | `selected: true`, `disabled: false` | "Perfil, aba selecionada" |
| Clientes e Veículos | tab | `selected: false`, `disabled: true` | "Clientes e Veículos, indisponível nesta versão" |
| Catálogo | tab | `disabled: true` | "Catálogo, indisponível nesta versão" |
| Ordens de Serviço | tab | `disabled: true` | "Ordens de Serviço, indisponível nesta versão" |
| Financeiro | tab | `disabled: true` | "Financeiro, indisponível nesta versão" |

- **Alvo de toque**: célula inteira por item, mínimo 44×44pt (iOS) / 48×48dp
  (Android) — o layout da F34 usa 72×64, folgado acima do mínimo; ver seção 8
  sobre como isso se adapta a larguras reais de tela.
- **Ordem de foco**: Perfil → Clientes e Veículos → Catálogo → Ordens de
  Serviço → Financeiro, sem travar em nenhum item.
- **Itens desabilitados permanecem alcançáveis por foco** (decisão já
  registrada na F34, reafirmada aqui): um controle desabilitado que anuncia
  seu próprio estado é padrão aceito em WCAG para pré-visualizar
  funcionalidade futura; diverge do hábito mais comum de excluir `disabled`
  da ordem de tabulação, mas é a opção que cumpre literalmente "indicador de
  foco visível em cada item" do critério. Se CRIVO discordar na revisão, é
  ajuste de uma linha (prop `accessible`/tabIndex), não mudança estrutural.
- **Anel de foco**: branco (`color.focus.ringOffset`), 2 px, visível sobre o
  fundo petro em qualquer item (contraste ≈12,1:1, calculado na F34).
- **Contraste**: fundo petro + texto/ícone `onBrand`/`onPrimaryAction` já
  validado em AA na F25/F34 (≈12,1:1 selecionado sem pill, ≈5,41:1 branco
  sobre o pill primary, ≈5,46:1 nos desabilitados a 60% de opacidade). Não
  recalculei de novo porque os tokens e os valores de opacidade não mudaram
  desde a F34 — só confirmei visualmente que a renderização bate com o
  calculado (seção 1).
- **Mudança dinâmica de estado** (ex.: sessão expira enquanto o Menu está em
  tela): usar `aria-live`/anúncio equivalente do leitor de tela ao
  redirecionar para Login, mesmo padrão de `sessao.inicializando.anuncio` já
  usado em `index.tsx` — não deixar o redirecionamento silencioso.

## 7. Textos e chaves i18n (nenhum texto fixo no código)

Convenção existente em `src/i18n/strings.ts` (`area.componente.texto`),
chaves novas propostas:

```
menu.tabbar.perfil.rotulo = "Perfil"
menu.tabbar.perfil.selecionado = "Perfil, aba selecionada"
menu.tabbar.clientesVeiculos.rotulo = "Clientes e Veículos"
menu.tabbar.clientesVeiculos.indisponivel = "Clientes e Veículos, indisponível nesta versão"
menu.tabbar.catalogo.rotulo = "Catálogo"
menu.tabbar.catalogo.indisponivel = "Catálogo, indisponível nesta versão"
menu.tabbar.ordensServico.rotulo = "Ordens de Serviço"
menu.tabbar.ordensServico.indisponivel = "Ordens de Serviço, indisponível nesta versão"
menu.tabbar.financeiro.rotulo = "Financeiro"
menu.tabbar.financeiro.indisponivel = "Financeiro, indisponível nesta versão"
```

Separei rótulo visível (texto curto, sob o ícone) de rótulo de acessibilidade
completo (frase anunciada), igual ao padrão que a F34 já usa — evita duplicar
string e permite que o rótulo visível e o anunciado evoluam separado (ex.: se
um dia o rótulo visível virar ícone sem texto, o anunciado continua
completo).

## 8. Comportamento responsivo (mobile first)

A F34 fixa o grid em 360×84 (base de referência), mas isso é mockup estático
— o app roda em telas de 320 a ~430 pt de largura (`app.config.ts`:
`orientation: portrait`, `ios.supportsTablet: false`, mas `web.bundler:
metro` existe, então não assumo só telefone). Adaptação necessária, não
coberta pelo Figma por ser mockup de largura fixa:

- **Colunas flexíveis, não 72px fixos**: cada item ocupa `flex: 1` dentro da
  barra (5 colunas iguais), para a barra preencher 100% da largura real do
  aparelho em vez de sobrar/faltar espaço nas bordas.
- **Faixa inferior por safe area, não 20px fixos**: a "faixa de área segura"
  de 20px da F34 é só a referência visual de um aparelho; usar o inset real
  do dispositivo (home indicator do iOS, barra de navegação do Android) como
  padding inferior da barra, para não cortar nem sobrar em aparelhos
  diferentes.
- **Telas muito largas (tablet Android, web)**: 5 colunas esticadas até
  768/1280px deixariam alvos de toque enormes e espaçados — decisão de
  design: limitar a largura útil da tab bar (ex.: máximo ~480pt) centralizada
  horizontalmente acima desse ponto, mantendo os itens compactos e próximos
  como numa barra de telefone. Registro isso como decisão minha, não
  verificada em dispositivo real (sem ambiente de teste em tablet/web nesta
  sessão) — CRIVO/ORLA podem ajustar o limite exato ao testar.
- Testada mentalmente contra 360 (base F34), 768 e 1280 (convenção da casa),
  não executada em dispositivo/emulador real nesta etapa — isso é tarefa da
  implementação (ORLA) e da verificação (CRIVO).

## 9. Gap que registro, não invento solução para ele

**US-MENU-07** (toco em item do menu com sessão expirada → redireciona) tem a
mesma lacuna estrutural que CRIVO já apontou na F30 para US-LGN-FRONT-07: tocar
em Perfil (ou em qualquer item futuro) é navegação local, não chama
`fetchAutenticado`, e Perfil não tem endpoint próprio hoje — não existe, no
momento, um evento real de rede que vire `SessaoExpiradaError` a partir de um
toque no menu. O que **pode** ser implementado hoje, com a infraestrutura que
já existe, é a parte reativa: se o `status` global (de `useAuth()`) virar
`naoAutenticado` com `sessaoExpirada: true` por qualquer motivo enquanto o
Menu está em tela, o mesmo guard da seção 4.4 redireciona a `/login` antes de
completar navegação pendente — mesmo padrão que `perfil.tsx` já usa. Isso
satisfaz a *reação* exigida pelo critério, mas não o *gatilho* ("ao tocar");
não inventei um fetch artificial só para ter o que disparar o 401. Deixo
registrado para CRIVO avaliar se isso é aceitável como "satisfeito
estruturalmente, sem cenário de ponta a ponta executável ainda" (mesma
linguagem que CRIVO usou para o caso idêntico da F30).

## 10. O que não verifiquei

- Não testei VoiceOver/TalkBack reais sobre nenhum artefato — os rótulos e
  estados anunciados acima são a especificação de como devem se comportar,
  não uma gravação de teste real (mesma ressalva já registrada na F34).
- Não tenho emulador/dispositivo nesta sessão para validar o comportamento
  responsivo da seção 8 ao vivo.
- Não recalculei contraste do zero — reaproveitei os valores já calculados e
  verificados na F25/F34, conferindo apenas que o código (`tokens.ts`) usa
  exatamente esses valores.

## 11. Pendências que não são minhas para fechar

- §6.1 e §6.2 do PRD (quem acende o item de cada módulo novo; confirmação da
  reconciliação de escopo "5 itens, 1 habilitado") seguem pendentes de
  PRUMO/REGENTE — não bloqueiam ORLA começar pelo item Perfil (único
  navegável nesta sprint), mas devem ser fechadas antes da Sprint 02 tocar
  o item de Clientes/Veículos.
- §6.3/decisão de foco em item desabilitado (seção 6 acima): mantenho a
  decisão da F34, sujeita a revisão de CRIVO.

## 12. Próximo passo

Handoff para ORLA: implementar a navegação da seção 4, usando a tab bar da
F34 (tokens, estados e textos desta spec, seções 5 a 7) e a adaptação
responsiva da seção 8. CRIVO confere depois contra US-MENU-01 a 08 do PRD,
com atenção à ressalva da seção 9 (US-MENU-07) e à seção 8 (responsivo, sem
teste em dispositivo real nesta etapa).

## 13. Confirmação pós-implementação (2026-11-09, ESQUADRO)

A PRD de BUSSOLA travou nesta data (ver `docs/product/F33-menu-principal-navegacao.md`
§5.2) e pediu, no handoff, que eu confirmasse esta spec contra o travamento e
revisasse a decisão de manter os 4 itens desabilitados alcançáveis por foco
(dúvida registrada na seção 6 acima). Verifiquei de novo, não assumi:

- **Figma real, reconferido nesta sessão**: `whoami` sem bloqueio (diferente
  do bloqueio que CRIVO relatou em sessões anteriores — registro a
  divergência, não escondo); `get_metadata` na página `39:2` confirma os 3
  frames (`39:3`, `39:31`, `39:58`) com a mesma árvore de nós, mesmos 5 itens
  na mesma ordem, descrita em `docs/design/figma.md:268-404` — nenhuma
  mudança desde a F34. A spec continua descrevendo o artefato real.
- **Código real, lido nesta sessão** (`apps/mobile/src/components/menu-tab-bar.tsx`,
  `apps/mobile/app/(menu)/_layout.tsx`): a implementação de ORLA bate
  exatamente com a seção 4 a 7 desta spec — 5 itens, 1 `disabled: false`, tab
  bar sobre `color.surface.brand`, pill com `color.action.primaryBackground`,
  chaves i18n de `src/i18n/strings.ts`, guard de sessão duplicado no layout do
  grupo `(menu)`. Nenhuma divergência entre o que especifiquei e o que foi
  construído.
- **Decisão sobre foco em item desabilitado — resolvida, não é mais dúvida
  aberta**: a PRD travada por BUSSOLA (US-MENU-06) agora exige literalmente
  "o foco nunca trava em nenhum item, incluindo os 4 desabilitados". Isso
  deixou de ser uma leitura minha a confirmar — é critério de aceitação
  escrito. Mantenho a decisão da F34/F33 (itens desabilitados alcançáveis por
  foco, anunciando "indisponível nesta versão") sem alteração: ela já cumpria
  exatamente isso antes de a PRD tornar explícito.

**Gap novo que registro para CRIVO, não decido eu**: o componente real usa
`disabled={!item.selecionado}` na `Pressable` (RN/Expo). Não tenho, nesta
sessão, dispositivo/simulador para confirmar se VoiceOver/TalkBack (ou
teclado externo, no build web via `react-native-web`) de fato alcança por
foco um elemento com `accessibilityState.disabled: true` nesta versão do RN —
é comportamento de plataforma, não algo que eu possa verificar lendo código
ou Figma. Se, na prática, a plataforma excluir elementos desabilitados da
ordem de foco (comportamento comum de `<button disabled>` na web), o
US-MENU-06 como escrito não seria satisfeito literalmente, e ORLA precisaria
de um ajuste pontual (ex.: trocar `disabled` por bloquear só o `onPress`,
mantendo `accessible`/foco ligados) — não uma mudança de design. Deixo como
item específico de verificação manual para CRIVO, não como suposição minha de
que "deve funcionar".

Conclusão: **a spec permanece válida, sem necessidade de reabrir nenhuma
seção** — a única pendência que eu teria reaberto (foco em item desabilitado)
já foi resolvida pela própria PRD travada, e a verificação que falta
(comportamento real de foco/leitor de tela) já estava listada na seção 10
como não verificada antes, continua assim agora.
