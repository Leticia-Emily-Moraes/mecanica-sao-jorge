# F27 · Conferência dos componentes do protótipo contra o código da F40

- Autora da conferência: ORLA (etapa 2 de 3: ESQUADRO → ORLA → CRIVO), 2026-11-24
- Pedido do comandante: conferir cada componente do protótipo contra os componentes base da F40 e apontar **o que já existe no código, o que pede variante e o que seria novo. Nada foi implementado.**
- Estado do protótipo: **não aprovado** (ver `F27-prototipo-catalogo-estoque.md`). Esta conferência não libera a F36.

## 1. Como li e o que não li

- **Código lido por inteiro** (`apps/mobile/`): `src/components/ui/{button,text-field,state-view,error-state,state-illustration,inline-alert,alert-icon,confirm-dialog,screen-header,header-icon-button,screen-container,tab-bar-item,inline-action-button}.tsx`, `src/components/perfil/{access-profile-badge,info-card}.tsx`, `src/components/menu/{menu-tab-bar,menu-shell}.tsx`, `src/theme/{tokens,use-focus-ring}.ts`, `src/i18n/strings.ts` (só as chaves `menu.tabbar.*`).
- **Protótipo:** li só a descrição em `F27-prototipo-catalogo-estoque.md` (seções 5 e 6). **Não abri o Figma**: esta sessão não tem ferramenta de Figma. Por isso nada abaixo foi comparado com o desenho pixel a pixel; onde a decisão depende de como o frame foi desenhado, está marcado **a confirmar no frame**.
- **Não rodei o app nem teste de componente.** Não há verificação em simulador ou aparelho nesta etapa.
- **A F40 do papel difere do código de hoje.** `F40-componentes-base-especificacao.md` descreve `ErrorRetryModal`, `ReadOnlyField` e `ScreenHeader` só com `title`/`align`. O código que a F41 deixou tem `ErrorState` de tela cheia, `InfoCard` e `ScreenHeader` petro com `back`/`user`; `ReadOnlyField` não existe. **Usei o código como verdade.**
- **O repositório não tem nenhuma lista**: não há `FlatList`, busca, seletor, `Switch` nem `Intl` em `apps/mobile/{app,src}`. A F36 será a primeira tela de lista do app.

## 2. Componentes reaproveitados no protótipo (6)

| Protótipo | Código hoje | Veredito | O que muda |
|---|---|---|---|
| Botão `174:3037` | `ui/button.tsx` (`primary`, `secondary`, `outlineAccent`; `loading`, `disabled`) | **Existe** | Estados "salvando" e "registrando" (S9, P9, M6) já são `loading` + `loadingLabel`. **A confirmar no frame:** os "botões compactos" de P10 e a ação "Movimentar estoque" do cartão. O `Button` tem altura fixa de 50 (`size.button`); se o compacto for menor, pede `size: 'default' \| 'compact'`, com alvo de toque mantido em 44/48 por `hitSlop`. |
| Campo de texto `174:3063` | `ui/text-field.tsx` (`errorMessage`, `invalid`, `editable`, `rightAccessory`, `keyboardType`) | **Pede variante** | (a) **Obrigatório com `*`**: hoje só dá para pôr o `*` dentro do `label`, o que o leitor de tela leria como "asterisco"; pede `required` que mostre `*` e exponha o estado. (b) **Ícone no erro**: o protótipo usa erro com ícone e texto; o `TextField` mostra só texto e borda. (c) **Texto de apoio** ("o saldo muda por movimentação", P10): não há `hint`. (d) **Campo só de leitura** ("Estoque atual", P10): `editable={false}` dá o fundo `surface.skeleton`; confirmar no frame se é isso ou uma linha de `InfoCard`. (e) **Máscara de moeda e horas decimais**: não é do componente; vai num formatador (seção 5). (f) O token proposto `color/text/placeholderError` só importa se o fundo do campo em erro mudar; no código o fundo é sempre `surface.default` e o placeholder é Flint 5,36:1. **A confirmar no frame antes de criar token.** |
| Banner | `ui/inline-alert.tsx` + `ui/alert-icon.tsx` | **Existe** (erro) · **pede variante** (sucesso) | Erro 400, 409 e conexão no topo do formulário cabem no `InlineAlert` atual. Os frames de sucesso (S13, M7) pedem tom de sucesso: ver seção 4. |
| Busca `20:1532` | nenhum | **Novo** | `SearchField` em `ui/`. O `TextField` não serve: tem rótulo visível acima e caixa de 46 sem ícone à esquerda; a busca tem ícone de lupa, botão de limpar e só nome acessível. Reaproveita `useFocusRing` e os tokens. O debounce e a consulta ficam em hook, não no componente. |
| Navegação inferior | `ui/tab-bar-item.tsx` + `menu/menu-tab-bar.tsx` | **Existe** (item) · **ligação pendente** (barra) | O `TabBarItem` já aceita `selected`, `unavailable` e `onPress`. O `MenuTabBar` hoje é estático: os 4 itens são `unavailable` e `selected={false}`. A ordem Ordens, Clientes, Catálogo, Financeiro **já coincide** com o protótipo (Catálogo é o 3º). Para a F36, Catálogo precisa ficar habilitado e navegar; as chaves `menu.tabbar.catalogo.indisponivel` e `.rotulo` ganham a forma "selecionada". Não é componente novo. |
| Cabeçalhos `20:1592` e `20:1516` | `ui/screen-header.tsx` + `ui/header-icon-button.tsx` | **Existe** | `title`, `back` e `user` cobrem lista (usuário) e formulário (voltar). **Divergência a medir:** o protótipo levou o botão a 44 × 44 pt; o código tem 36 visíveis com área de toque de 48 por `hitSlop`. Se o 44 do frame for tamanho visível, é diferença de paridade, não de toque. |

## 3. Componentes novos do protótipo (7)

| Protótipo | Código hoje | Veredito | Proposta |
|---|---|---|---|
| Badge de catálogo `191:4124` | `perfil/access-profile-badge.tsx` (pílula petro, só texto, sem ícone) | **Novo, genérico** | `ui/badge.tsx` com `tone` (alerta primary, ativo, inativo) e `icon` opcional. O próprio `AccessProfileBadge` registra que deve ser trocado quando nascer o badge genérico: a F36 fecha essa dívida. Texto e ícone sempre juntos (US-PROTO-CAT-03 e 12). **Contraste do texto sobre o fundo do selo: medir** (não medi). |
| Card de serviço `192:4154` | `perfil/info-card.tsx` (cartão de leitura, sem toque) | **Novo** | `ui/list-card.tsx` (base pressionável: borda `border.divider`, `shadow.card`, `radius.sm`, anel de foco) + `catalogo/service-card.tsx` (nome, valor, tempo, badge). Reaproveita só tokens do `InfoCard`. |
| Card de peça `192:4185` | idem | **Novo** | `catalogo/part-card.tsx` sobre o mesmo `ListCard`. **Regra do handoff:** "Movimentar estoque" é **irmã** do corpo pressionável, nunca botão dentro de botão. Ou seja, o contêiner não é `Pressable`; são dois controles com dois pontos de foco. |
| Seletor segmentado `193:4158` | nenhum | **Novo** | `ui/segmented-control.tsx`. Dois usos com papéis diferentes: aba Serviços/Peças (papel `tab`, `selected`) e Tipo da movimentação (grupo de `radio`, `checked`). Uma peça visual, prop `kind`. Evitar biblioteca nativa (preferir o que o Expo já traz). Estado selecionado por texto/peso, além da cor. |
| Alternância Ativo-Inativo `198:4357` | nenhum (RN tem `Switch`, não usado) | **Novo** | **Decisão a tomar:** `Switch` do RN dá o papel e o estado certos, mas renderiza diferente em iOS e Android e não casa com o desenho; a regra de paridade pede idêntico. Recomendo `ui/toggle-row.tsx` sobre `Pressable` com `accessibilityRole="switch"` e `checked`, texto "Ativo/Inativo" visível, anel de foco e alvo mínimo. O toque **não muda o valor sozinho**: abre o diálogo (S12) e o valor muda após confirmar. |
| Diálogo de confirmação `198:4358` | `ui/confirm-dialog.tsx` (`title`, `message`, `cancelLabel`, `confirmLabel`) | **Existe** | O código já trata o diálogo como genérico (o doc da F27 o descreve como específico da F26). "Inativar" e "Voltar" cabem nas props de hoje. Nenhuma mudança prevista. Mapear o `198:4358` para o `ConfirmDialog` no Figma evita duplicar. |
| Linha de movimentação `202:5048` | `info-card` (linha rótulo/valor) | **Novo** | `catalogo/movement-row.tsx`: tipo, quantidade com sinal, motivo e data. Lida como um item só no leitor ("Entrada, mais 10 unidades, motivo, data"). O sinal `+`/`−` vai no texto, não só na cor. Vai dentro de `FlatList` (histórico pode crescer). |

## 4. Estados de tela e itens que o protótipo pede além da lista

| Item | Código hoje | Veredito | Observação |
|---|---|---|---|
| Vazio (S2, P2, P13) | `ui/state-view.tsx`, `state="empty"`, ícone fixo `document-text-outline` | **Pede variante** | Falta `icon` por prop. Busca sem resultado (S5, P5) é outro vazio: texto e ação diferentes ("limpar busca"); cabe no mesmo componente com o `icon` e as strings por prop. |
| Carregando (S3, P3, P14) | `state="loading"`: spinner e texto centrados, anuncia ao leitor | **Existe** · **a confirmar no frame** | Se os frames mostram esqueleto de lista (e não spinner), há `color.surface.skeleton` e `border.skeleton`, mas **nenhum componente** `ListSkeleton`: seria novo. |
| Erro de carregamento (S4, P4, P15) | `ui/error-state.tsx` (tela cheia, ícone sem conexão, tentar de novo e secundária) | **Existe** | P15 "Tentar novamente / Voltar" casa com `retryLabel` e `secondaryLabel`. Ícone fixo de sem conexão serve a falha de rede; para erro de servidor, `icon` por prop. |
| Sucesso (S13, M7) | nada | **Novo (variante)** | O `InlineAlert` é só de erro (fundo `errorTint`, ícone `!`). Pede `tone: 'error' \| 'success'` ou componente à parte. **Não existe token de sucesso** no código; o Figma usa a primitiva `color/spring green/34` sem token semântico (F27 §6). Cor, texto e ícone entram nos dois lados juntos. |
| Campo só de leitura "Estoque atual" | `InfoCard`, ou `TextField editable={false}` | **Existe** | `ReadOnlyField` da especificação F40 **não foi criado**. |
| Contêiner de tela | `ui/screen-container.tsx` | **Existe** | Fundo Pampas e margem de 16. |

## 5. O que não é componente, mas a F36 vai precisar

- **Formatação pt-BR:** não há `Intl` no app. `R$ 1.234,50`, `1,5 hora` e quantidades precisam de `format-currency`/`format-hours` em `src/i18n/` (funções puras, com teste) e do caminho inverso para ler o que a pessoa digita. **Não verifiquei** se o `Intl.NumberFormat` do Hermes traz `pt-BR` completo em iOS e Android; verificar em aparelho antes de depender dele.
- **Chaves de texto:** `strings.ts` só tem `menu.tabbar.*` de catálogo. As `catalogo.<componente>.<texto>` propostas pelo ESQUADRO não existem ainda.
- **Camada de serviço e hooks** de serviços, peças e movimentação: nada existe além de `http-client.ts` e `auth-service.ts`.
- **Lista virtualizada** e regras de rede ruim (gravar local, fila idempotente): primeira lista do app; decisão de arquitetura fora desta conferência.

## 6. Resumo

| Veredito | Itens |
|---|---|
| **Existe, sem mudança** | `ConfirmDialog`, `ScreenHeader`, `ErrorState`, `ScreenContainer`, `TabBarItem`, `InlineAlert` (erro) |
| **Pede variante** | `TextField` (obrigatório, ícone no erro, apoio), `StateView` vazio (`icon`), `InlineAlert` (sucesso), `Button` (compacto, a confirmar), `MenuTabBar` (ligar Catálogo, não é componente) |
| **Novo** | `Badge` (generaliza `AccessProfileBadge`), `ListCard` + `ServiceCard` + `PartCard`, `SegmentedControl`, `ToggleRow`, `MovementRow`, `SearchField`; `ListSkeleton` só se o frame for esqueleto |
| **Token novo, nos dois lados** | cor de sucesso; `placeholderError` só se o fundo do campo em erro mudar |

## 7. Pendências para decidir

1. Confirmar no Figma (ESQUADRO): botão compacto, carregando (spinner ou esqueleto), "Estoque atual" (campo ou linha), ícone no erro do campo, tamanho visível do botão de cabeçalho.
2. A pessoa decide `Switch` nativo ou `ToggleRow` próprio (recomendo o próprio, pela paridade).
3. A F36 só começa com a aprovação do protótipo (ADR-007); esta conferência não a substitui.
