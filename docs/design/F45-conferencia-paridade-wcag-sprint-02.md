# F45 · Revisão da Sprint 02: paridade F26 × app e auditoria WCAG 2.2 AA do lado do design (ESQUADRO, 2026-11-20)

Etapa 4 de 6 (BUSSOLA > ESPRESSO > VIGIA > ESQUADRO > ORLA > CRIVO). Tarefas 7 e 8 da F45; insumo para as tarefas 10 e 13. Critérios que esta conferência alimenta: US-REV-02-07 a 11. Não avalio critério de aceitação: entrego achado, severidade, tamanho, dono e destino.

Nada foi alterado no Figma nem no código do app nesta rodada. Só este arquivo e o registro em `docs/design/figma.md` são novos.

## 0. Limites (leia primeiro)

- **Não há captura do app rodando.** Não existe PNG das telas de Clientes e Veículos do app em `docs/design` (só Login e Perfil, em `docs/design/f41-capturas/app-2026-11-16-orla`). Não há `adb`; os simuladores iOS existem, mas estão desligados, e rodar o app exigiria Expo, API e MySQL. Não tentei. A comparação "lado a lado" é, de novo, **estática**: valores lidos no Figma (`use_figma`, somente leitura) contra o código em `apps/mobile`. O que depende de renderização está marcado **[a conferir no aparelho]**.
- **Capturas do Figma:** as 44 de referência estão em `docs/design/f35-capturas/` (exportadas em 19/11). Não reexportei.
- **Leitor de tela real** (VoiceOver, TalkBack), **teclado externo** e **fonte ampliada**: não testados. O que digo sobre o que o leitor fala vem do código e das anotações do Figma.
- `get_figma_skill` e `figma-use` não estão disponíveis nesta sessão; usei `use_figma` só para leitura.
- `get_metadata` da seção F26 estourou o limite (130 filhos, 259 mil caracteres); a leitura foi por script, nó a nó.
- O texto das mensagens longas (`clientes.detalhe.erro.mensagem`, `.naoEncontrado.mensagem`, `clientes.formulario.privacidade`, `.erro.envio`, `.conflito`, `veiculos.detalhe.*.mensagem`) **não foi comparado palavra por palavra**.
- Sessão Figma desta rodada: `6d02d9a3-9142-4fde-841c-c791263c3366`. Arquivo `FPdB8RymAnN81pbKfizdzE`.

## 1. Cobertura: 7 telas × 4 estados

Verifiquei por `getNodeByIdAsync` que os 44 frames F26 existem, estão visíveis e nas posições registradas. A tabela é a da F35, sem mudança; as capturas estão nomeadas por nó em `docs/design/f35-capturas/`.

| Tela | Vazio | Carregando | Erro | Preenchido |
|---|---|---|---|---|
| Lista de clientes | L2 `106:2112`, L3 `106:2128` | L4 `109:2402` | L5 `109:2453` | L1 `106:2098`, L6 `106:2146`, L7 `119:779`, L8 `135:1182` |
| Detalhe do cliente | D6 `135:937` | D2 `109:2507` | D3 `109:2574`, D8 `135:1107` | D1 `106:2159`, D4 `109:2809`, D5 `109:2877`, D7 `135:1022` |
| Criar cliente | C1 `106:2277` | C2 `110:2535` | C3 `106:2409`, C4 `110:2576`, C5 `110:2625`, C6 `110:2674`, C7 `119:712` | **sem frame** |
| Editar cliente | **sem frame** | E2 `110:2718` | E3 `110:2762` | E1 `106:2300` |
| Detalhe do veículo | V2 `109:3030` | V3 `109:2651` | V4 `109:2723`, V6 `135:1144` | V1 `106:2214`, V5 `109:2959` |
| Criar veículo | N1 `106:2334` | N2 `111:2589` | N3 `106:2440`, N4 `111:2632`, N5 `111:2683` | **sem frame** |
| Editar veículo | **sem frame** | M2 `111:2729` | M3 `111:2775` | M1 `106:2368` |

Diálogo de descarte: X1 `119:905`, X2 `119:976`, X3 `119:1041`, X4 `119:1120`. Apoio: PF `117:2636`, folha de foco `113:2666`.

Lacunas de desenho (sem frame): "preenchido" em criar cliente e criar veículo; "vazio" em editar cliente e editar veículo; leitura inicial dos formulários (P-12); aviso de falha ao atualizar (P-13). Para o formulário, C1 e N1 são o vazio de criar.

Os cinco frames propostos (D6, D7, D8, V6, L8) estão na **página errada**: ver N-07.

## 2. Divergências já registradas na F35: estado hoje

Reconferi no código: P-01 (`clientes/index.tsx:136-140`, botão `Cadastrar "termo"`), P-08 (`Button` com prop `icon`, `button.tsx:36`), P-09 (`list-row.tsx` e `vehicle-history-section.tsx` sem sombra), P-10 (token `shadow.detail` em `tokens.ts:282`). Não reconferi P-05 (leitura do CPF) nesta rodada. P-02, P-06, P-07 seguem sem mudança, aguardando aprovação; P-03 e P-04 dependem do contrato da API; P-11 a P-13 aguardam desenho; P-14 e P-16 são intencionais; P-15 aguarda aprovação para criar as variáveis. Detalhe em `docs/design/F35-paridade-figma-app.md`.

## 3. Divergências novas desta rodada

Severidade: Alta = quebra critério AA ou o usuário vê estrutura/texto diferente do aprovado; Média = diferença visível ou de leitura; Baixa = detalhe. Tamanho "pequeno" = cabe numa correção de menos de um dia, sem decisão de produto, sem mudar contrato.

| ID | Tela / estado | Figma (nó) | App (arquivo) | Token, texto ou estrutura | Sev. | Tam. | Dono | Destino |
|---|---|---|---|---|---|---|---|---|
| N-01 | Formulários, erro de campo (C3, C4, C5, C7, N3, N4) | Ícone 14 × 14 à esquerda e texto 13 px `#B5453D`, deslocado 20 (`106:2417`, texto `106:2419`) | Só texto, 12 px (`text-field.tsx`, `styles.error`, `typography.caption`) | Estrutura (ícone) e tipografia (12 em vez de 13) | Média | pequeno | ORLA | Corrigir na ORLA. O sentido já não depende só da cor: há texto e borda de 2 px |
| N-02 | Formulários, faixa de erro (C3, C6, E3, N3, N5, M3) | Faixa acima do botão Salvar, abaixo do último campo (`106:2435`, y 540); doc F26 item 12: "aviso-resumo acima do botão" | Faixa no **topo** do formulário, antes dos campos (`client-form-fields.tsx:115`, `vehicle-form-fields.tsx:111`) | Estrutura (posição) | Média | pequeno | Decisão da pessoa, depois ORLA | Decidir: seguir o desenho, ou manter no topo e ajustar o Figma. Contra mover: no topo o aviso é o primeiro a ser lido por quem navega por gestos. A favor de mover: quem tocou Salvar no fim do formulário vê o aviso junto do botão. **[a conferir no aparelho]** se o topo fica fora da tela com o teclado aberto |
| N-03 | Formulários, nome acessível do campo obrigatório com erro | Anotação C3 `112:2638`: "Nome completo, obrigatório, erro: Informe o nome do cliente." | `${label}, ${detalhe}` (`text-field.tsx:76`) com rótulo "Nome completo *": lê "Nome completo *, Informe o nome do cliente." Sem "obrigatório" e sem "erro:" | Texto (leitor de tela) | Média | pequeno | ORLA | Prop `required` no `TextField`, chaves `comum.campo.obrigatorio` e `comum.campo.erro`. Vale para Nome, Placa, Marca, Modelo. O que o leitor faz com o "*" é **[não testado]** |
| N-04 | Formulários, rótulo obrigatório | Asterisco em `#B5453D`, resto `#6E6A66` (fill misto em `106:2282`, `106:2341`, `106:2347`, `106:2352`) | Rótulo numa string só, tudo `color.text.secondary` (`strings.ts:145`, `:196`, `:198`, `:200`) | Token (`color.text.error` no asterisco) | Baixa | pequeno | ORLA | Junto com N-03: o `TextField` desenha o asterisco à parte, escondido do leitor |
| N-05 | Todas as telas com cabeçalho: Voltar, Editar, Perfil | Anel branco de 2 pt sobre o petro (folha `113:2666`, `113:2695` e `113:2706`) | `HeaderIconButton` não usa `useFocusRing`; o token `color.focus.ringOnBrand` existe e só a barra de abas o usa | Estrutura (foco visível). WCAG 2.4.7 | **Alta** | pequeno | ORLA | Aplicar o anel como no `Button`, com `ringOnBrand`. **[a conferir no aparelho]** com teclado externo |
| N-06 | Detalhe do cliente e do veículo, aviso de sucesso (D4, D5, V5) | Aviso 328 × 44. **Não li** se o frame desenha botão de fechar | Botão de fechar sem tamanho próprio (`styles.dismiss` só centraliza): ícone de 18 (`iconSize.appBar`) + `hitSlop` de 8 nas laterais e 2 acima e abaixo (`DISMISS_SLOP`, linhas 61-66), ou seja, área de toque calculada em 34 × 22 (`inline-notice.tsx:45-66`) | Estrutura (alvo de toque). WCAG 2.5.8 (24 × 24) e `minTouchTarget` 48 | Média | pequeno | ORLA | Subir o `hitSlop` vertical para 15 (ou `minHeight` 48 no botão). Valor inferido do código, não medido no aparelho |
| N-07 | Rastreabilidade do Figma | D6 `135:937`, D7 `135:1022`, D8 `135:1107`, V6 `135:1144`, L8 `135:1182` e anotações `136:888`–`136:897` estão na página `20:2131` "01 — Wireframes", em y 8900 | `docs/design/figma.md` e a F35 dizem "na seção F26 `106:2097`". A seção tem 130 filhos e nenhum `135:*` ou `136:*` | Registro | Média | pequeno | ESQUADRO | Mover os cinco frames e as anotações para a seção F26, ou corrigir o registro. Não movi nada: o pedido era só conferir |
| N-08 | Diálogo "Descartar alterações?" (X1 a X4) | Anotação `119:975`: foco inicial em "Continuar editando", foco preso no diálogo, voltar do sistema = Continuar editando | `Modal` com `accessibilityViewIsModal` e `onRequestClose={onCancel}` (ok). Sem foco inicial explícito (`confirm-dialog.tsx`) | Comportamento (foco) | Baixa | pequeno, se confirmado | CRIVO confirma, ORLA corrige | **[a conferir no aparelho]** onde o foco cai ao abrir |
| N-09 | Detalhe do veículo, "Cliente: nome" no formulário | `Cliente:` `#6E6A66` e nome `#1E3A3F` (`106:2338`); **não li o peso da fonte** | `ownerName` usa `fontWeight: '600'` (`vehicle-form-fields.tsx:181`) fora de `typography` | Token (peso) | Baixa | pequeno | ORLA | Usar `fontFamily` de `typography` (Inter SemiBold). Com fonte embutida o `fontWeight` solto pode não trocar a família: **[a conferir no aparelho]** |

## 4. Textos e tokens: o que bateu

- Figma × `strings.ts`, conferido por leitura: títulos, buscas, estados vazios, erros de tela, botões, rótulos e placeholders dos formulários (inclusive "Nome completo *", "Telefone (opcional)", "E-mail (opcional)", "CPF (opcional)", "Endereço (opcional)", "Placa *", "Marca *", "Modelo *", "Ano (opcional)", "Cor (opcional)"), faixas de erro singular e plural, diálogo de descarte, "Veículos ({quantidade})", "Histórico de OS ({quantidade})", "Não informado". Igual ao registrado na F35.
- Cores do app contra o Figma: `tokens.ts` repete os 14 valores lidos (`#1E3A3F`, `#B5453D`, `#F7F5F2`, `#6E6A66`, `#E2DEDA`, `#33575D`, `#8C8780`, `#F1F5F9`, `#F6E7E5`, `#E2B5B0`, `#923631`, `#EE8279`, `#B7B2AC`, `#3E6E4A`, `#2C5258`). Nenhuma diferença de valor.
- Variáveis ausentes no Figma: `#3E6E4A` e `#2C5258` (P-15); as três cores AA aprovadas em 16/11 (placeholder, borda de campo, aba selecionada) existem como `color/text/placeholder` `89:716` e `color/border/default` `89:717`; a aba `#EE8279` eu não confirmei como variável.

## 5. Componentização, tokens e i18n no app (US-REV-02-10)

Verificado por busca (padrões simples; não substitui revisão de código):

- Nenhum hex nem `rgba()` fora de `tokens.ts` em `apps/mobile/app` e `apps/mobile/src/components`, excluídos os testes.
- Nenhum texto de interface fixo em JSX (`<Text>texto</Text>`, `title="…"`, `label="…"`, `placeholder="…"`, `accessibilityLabel="…"`) nesses dois diretórios, excluídos os testes. Todo texto passa por `t('area.componente.texto')`.
- Nenhuma chamada de rede (`fetch`, `axios`, `services/`) nas telas de `apps/mobile/app/(menu)/clientes`; as telas usam hooks (`useClientList`, `useClientDetail`, `useClientVehicles`, `useVehicleDetail`, `useRouteNotice`).
- Espaçamento, tamanho e tipografia dos arquivos de Clientes e Veículos vêm de `tokens.ts`. Única exceção: `fontWeight: '600'` em `vehicle-form-fields.tsx:181` (N-09).
- Reuso: lista, detalhe e formulários usam `ScreenHeader`, `ScreenContainer`, `StateView`, `NotFoundState`, `ListRow`, `InfoCard`, `TextField`, `Button`, `InlineAlert`, `InlineNotice`, `ConfirmDialog`, `StatusBadge`, `SectionTitle`, `EmptyCard`. Não encontrei componente duplicado entre cliente e veículo; os formulários repetem a lógica de foco no primeiro campo inválido e `textoDaFaixa` em `client-form-fields.tsx` e `vehicle-form-fields.tsx`. Isso é duplicação de código, não de componente visual: candidato a extrair (pequeno, ORLA, baixa).
- Não li `novo.tsx`, `editar.tsx`, `veiculos/novo.tsx`, `vehicle-form-view.tsx`, `state-view.tsx`, `error-state.tsx` nem os hooks; a busca por hex, texto fixo e rede os cobre, o resto não.

## 6. Auditoria WCAG 2.2 AA do lado do design

Fonte: leitura do Figma por `use_figma` nesta rodada (textos, fills, bordas, tamanhos, anotações `112:2617`–`112:2682` e `119:897`–`119:1186`, folha `113:2666`) e a medição do ESQUADRO de 17/11 (`F26-prototipo-clientes-veiculos.md`, seção 8). Razões calculadas por mim com a fórmula de luminância do WCAG 2.2.

### 6.1 Contraste de texto (1.4.3)

Nenhum texto lido abaixo de 4,5:1 (3:1 nos textos grandes). Pares principais:

| Par | Razão |
|---|---|
| `#6E6A66` sobre branco / sobre `#F7F5F2` | 5,36:1 / 4,93:1 |
| `#1E3A3F` sobre branco | 12,12:1 |
| Branco sobre `#B5453D` (botão primário) | 5,41:1 |
| `#EE8279` sobre `#1E3A3F` (aba selecionada) | 4,68:1 |
| `#B7B2AC` sobre `#1E3A3F` (aba inativa) | 5,76:1 |
| Branco sobre `#3E6E4A` (aviso de sucesso, ENTREGUE) | 5,94:1 |
| Branco sobre `#2C5258` (EM ANDAMENTO) | 8,6:1 |
| `#923631` sobre `#F6E7E5` (faixa de erro) | 6,3:1 |
| `#B5453D` sobre `#F7F5F2` (erro de campo) | 5,0:1 |

Menor razão: 4,68:1. A medição de 17/11 (544 trechos) dá o mesmo mínimo.

### 6.2 Contraste de não texto (1.4.11)

- Borda de campo `#8C8780`: 3,28:1 sobre `#F7F5F2` e 3,56:1 sobre branco. Passa. Com erro ou foco, 2 px `#B5453D`: 4,97:1 sobre o fundo, 5,41:1 sobre branco.
- Contorno do botão "Cancelar" `#1E3A3F`: 11,15:1.
- Cartões com borda `#E2DEDA` (1,23:1): a borda não é o único limite do componente; o cartão tem texto e seta. Interpretação do ESQUADRO de 17/11, **a conferir pelo CRIVO**. O chevron do cartão usa `#6E6A66` (5,36:1 sobre branco).
- Borda do campo Endereço no E1 `106:2327`: `#E2DEDA`, reprova. É P-14; o app já usa `#8C8780`.
- Borda `#E2B5B0` da faixa de erro (1,68:1): decorativa; o texto tem 6,3:1.
- Ícones: menor razão 3,56:1 na medição de 17/11 (240 traços). Não refiz.

### 6.3 Alvo de toque (2.5.8, e 48 do projeto)

- Design: a medição de 17/11 deu 0 nós abaixo de 44 × 44 em 91 nós com reação. Nesta rodada vi só o alvo `112:2746` (44 × 44, Voltar em C3). As quatro abas (90 × 62) não foram medidas como controle.
- App, pelo código: `Button` 50 de altura; `TextField` 46 com `hitSlop` até 48; `ListRow` com 66 de mínimo; `HeaderIconButton` 36 com `hitSlop` até 48. O botão de fechar do aviso fica abaixo (N-06).

### 6.4 Foco visível e ordem (2.4.7, 2.4.3, 2.4.11)

- Padrão do Figma (folha `113:2666`): botão e cartão com anel petro de 2 pt e respiro branco de 2 pt; campo com borda `#B5453D` de 2 pt; cabeçalho e abas com anel branco de 2 pt. Razões: petro sobre o fundo 11,14:1; branco sobre petro 12,12:1.
- App: `Button`, `ListRow`, `TextField`, `SearchField` e `TabBarItem` usam `useFocusRing`. **`HeaderIconButton` não usa** (N-05).
- Ordem de foco: anotada abaixo de cada frame. Em C3 li os anéis: 1 cabeçalho, 2 a 5 campos, 6 botão, na ordem da leitura. O app segue a ordem do JSX; a faixa de erro está no topo no app e abaixo no Figma (N-02).
- Os frames propostos D6, D7, D8, V6, L8 não têm camada de foco (já dito na F35).

### 6.5 Rótulo, nome e leitor de tela (1.3.1, 3.3.1, 3.3.2, 4.1.2)

- `TextField`: rótulo visível acima, `accessibilityLabel` com rótulo e detalhe, mensagem de erro com `accessibilityRole="alert"` e região viva. Falta "obrigatório" e "erro:" (N-03).
- `Button`: `accessibilityRole="button"`, estado `busy` e `disabled`; o ícone do botão é escondido do leitor.
- `ListRow`: um único alvo com "título, subtítulo"; seta escondida. O Figma anota, em L1: "Teodoro Lemos, (11) 90000-0001, botão".
- Cartão de OS (`vehicle-history-section.tsx`): `accessible` com rótulo único; o status vai por texto no selo.
- Erro e sucesso: `InlineAlert` e `InlineNotice` são `alert` com região viva `polite`; o aviso de sucesso também usa `announceForAccessibility` e não rouba o foco (4.1.3).
- Pesquisa: anúncio do número de resultados por `useAnnounce` (`clientes/index.tsx:52`), conforme a anotação do L1.
- Diálogo: `accessibilityViewIsModal`, `alert` assertivo, título como `header`. Foco inicial: N-08.

### 6.6 Cor não é o único sinal (1.4.1)

Erro de campo: texto mais borda de 2 px (o ícone do Figma falta no app, N-01). Obrigatório: asterisco e, no Figma, "obrigatório" na anotação. Status de OS: texto no selo. Sucesso: ícone e texto. Selo neutro: contorno e nome do status.

### 6.7 Tempo e movimento (2.2.1)

O aviso de sucesso do app some sozinho depois de `NOTICE_DURATION_MS` = 5000 ms (`config/notice.ts:2`, `hooks/use-auto-dismiss.ts`, chamado em `hooks/use-route-notice.ts:24`), ou antes, se a pessoa tocar em fechar. Atende no limite o "no mínimo 5 s" da anotação `112:2654`, sem folga. Como o prazo é exatamente o mínimo, e a 2.2.1 pede controle do tempo, o botão de fechar com alvo pequeno (N-06) pesa mais: quem precisa de mais tempo não tem como pausar. Não verifiquei se o temporizador pausa quando o leitor de tela está lendo o aviso. A volta em 3 s do protótipo é só do protótipo.

### 6.8 Não avaliado

Reflow e zoom a 200% e fonte ampliada (1.4.4, 1.4.10); orientação; teclado externo; leitor de tela real; alvos das abas; tablet (768 e 1280) além do que a F35 especifica. Nada disso foi medido.

## 7. Histórico de OS do veículo (US-REV-02-11)

Cobertura parcial até a F06 (Sprint 04). Estado real hoje: V2 (histórico vazio, "Nenhuma OS…") e `VehicleHistorySection` com `EmptyCard`; lista vazia por padrão. V1 existe só como demonstração (rótulo "Exemplo", título, data e valor inventados) e diverge do app em P-04, por dependência da API. Selos: Figma só desenha EM ANDAMENTO e ENTREGUE; os outros cinco status caem no selo neutro (P-11). Não é defeito do app: é desenho que falta.

## 8. Insumo para as tarefas 10 e 13: severidade, tamanho, dono e destino

| Achado | Sev. | Tam. | Dono | Destino |
|---|---|---|---|---|
| N-05 anel de foco no cabeçalho | Alta | pequeno | ORLA | Corrigir agora |
| N-01 ícone e 13 px no erro de campo | Média | pequeno | ORLA | Corrigir agora |
| N-03 e N-04 nome acessível e asterisco | Média / Baixa | pequeno | ORLA | Corrigir agora, juntos |
| N-06 alvo do botão de fechar do aviso | Média | pequeno | ORLA | Corrigir agora; medir no aparelho |
| N-09 `fontWeight` solto | Baixa | pequeno | ORLA | Corrigir agora |
| N-02 posição da faixa de erro | Média | pequeno | Pessoa decide | Decisão, depois ORLA |
| N-07 frames na página errada | Média | pequeno | ESQUADRO | Mover ou corrigir registro |
| N-08 foco inicial do diálogo | Baixa | pequeno | CRIVO, depois ORLA | Verificar no aparelho |
| P-02, P-06, P-07 | Alta / Média | não pequeno (decisão) | Pessoa e comandante | Decisão registrada |
| P-03, P-04 | Alta | não pequeno | ESPRESSO e BUSSOLA | Contrato da API |
| P-11, P-12, P-13, P-15 | Média / Baixa | não pequeno | ESQUADRO | Desenhar após aprovação do F26 |
| Duplicação de `textoDaFaixa` e foco no primeiro erro | Baixa | pequeno | ORLA | Backlog |
| Captura das telas no aparelho | Média | não pequeno | ORLA | Ver seção 9 |

## 9. Handoff para a ORLA (React Native / Expo)

Correções pequenas, nesta ordem, cada uma com teste escrito e rodado:

1. `src/components/ui/header-icon-button.tsx`: usar `useFocusRing` e `color.focus.ringOnBrand` (anel branco de 2 pt, respiro como no `Button`). Teste: o anel aparece com foco e some sem foco.
2. `src/components/ui/text-field.tsx`: ícone de 14 antes da mensagem de erro (reaproveitar o desenho do `AlertIcon`, em tamanho 14), texto a 13 (`typography.subtitle` ou token novo `fieldError`); prop `required` com asterisco em `color.text.error`, escondido do leitor; nome acessível "{rótulo}, obrigatório, erro: {mensagem}". Chaves novas em `strings.ts`: `comum.campo.obrigatorio`, `comum.campo.erro`. Tirar o "*" das chaves de rótulo (`clientes.formulario.nome.rotulo`, `veiculos.formulario.placa.rotulo`, `.marca.`, `.modelo.`).
3. `src/components/ui/inline-notice.tsx`: área de toque do botão de fechar de pelo menos 48 de altura sem crescer o aviso visível (`hitSlop` vertical de 15).
4. `src/components/veiculos/vehicle-form-fields.tsx:181`: trocar `fontWeight: '600'` por `fontFamily` de `typography`.
5. Depois da decisão da pessoa: posição da faixa de erro (N-02).

Capturas que faltam e que a ORLA precisa produzir para fechar a comparação lado a lado (sem dado real; só os dados fictícios do F26: Teodoro Lemos, Otávio Neves, placa `RTK4M81`): L1, L2, L3, L4, L5; D1, D2, D3; V1 (ou V2), V3, V4; C1, C2, C3; E1, E3; N1, N3; M1, M3; X1; D4 com o aviso de sucesso. Em 360 × 740, fonte padrão. Nomear como `app-2026-11-NN-orla-<código>.png` na pasta `docs/design/f45-capturas/`. Com a camada de foco do Figma oculta para a comparação.

## 10. O que não consegui ler ou fazer

- Captura das telas do app (seção 0).
- Se o aviso de sucesso do Figma (D4 `109:2809`) desenha botão de fechar: a leitura do nó não o localizou; não afirmo nem nego.
- Peso da fonte de "Cliente: nome" no Figma (`106:2338`).
- Comparação palavra por palavra das mensagens longas.
- Se a aba selecionada `#EE8279` e as outras duas cores AA têm variável no FPdB8.
- Foco inicial do diálogo, leitor de tela, teclado externo, fonte ampliada.
- Anotações `112:26xx` lidas por completo: L1, L2, C3, D3, D4, X1. As demais não foram abertas; a medição de 17/11 as descreve.
