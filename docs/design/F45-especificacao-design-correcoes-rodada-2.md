# F45 · Especificação de design para as correções e roteiro de verificação em aparelho (rodada 2, ESQUADRO, 2026-11-25)

Etapa 4 de 6. Leitor: MERIDIANO e ORLA (quem implementa), CRIVO (quem verifica). Consolida o que está espalhado em
`F45-conferencia-paridade-wcag-sprint-02.md` (N-xx), `F45-auditoria-codigo-i18n-tokens-a11y.md` (A-xx, PA-xx) e
`F45-correcoes-pequenas-app-sprint-02.md`, e fecha o que faltava do lado do design. **Não alterei código, Figma nem
tokens.** Não avalio critério de aceitação.

## 0. O que fiz, o que li e o que não consegui

| Item | Situação | Evidência |
|---|---|---|
| Abri as 8 capturas do app em `f45-capturas/` e procurei dado pessoal real | Feito (L1 foi aberta antes por TORRE; abri D1, E1, M1, V2, C1, L2 e N1 agora) | Seção 1 |
| Figma: leitura de D6 `135:937` | Feito (`get_metadata`, sessão `86f0a3f5-bb26-4238-8a5a-2d3522946e42`, sem escrita) | O nó existe, 362 × 742, x 60, y 8900. **O `get_metadata` não informa a página-pai**, então não reconfirmei N-07; vale a leitura de 20/11 (página `20:2131`) |
| Comentários do arquivo (aprovação da F26) | **Não consegui**: `get_comments` foi negado por permissão nesta sessão | Sem como confirmar nem negar aprovação registrada no Figma. Mantenho "aguardando aprovação" |
| Capturas em 360 × 740 | **Não consegui**: `adb` e `idb` não existem; os simuladores iOS são `iOS 26.1`, `26.5` e `27.0` e nenhum tem 360 × 740 dp; nenhum estava ligado | Seção 5 diz como fazer |
| Leitor de tela, teclado externo, contraste no app renderizado | **Não executado** (mesmo bloqueio) | Roteiros nas seções 4 e 5 |
| Nenhum frame novo foi desenhado | Decisão: F26 sem aprovação; desenhar estado novo agora cria mais frame sem aprovação | Seção 6 descreve o que desenhar depois |

## 1. Dado pessoal nas capturas versionadas

| Captura | O que aparece | Resultado |
|---|---|---|
| `app-L1` | Aberta por TORRE | Sem dado real |
| `app-L2` | Lista vazia, sem dado | Limpa |
| `app-C1` | Só placeholders ("Ex.: João da Silva", `nome@example.com`, `000.000.000-00`) | Limpa |
| `app-D1` | "Maria Souza Fictícia", `(11) 90000-0001`, `maria@exemplo.invalid`, CPF `***.*82.2**-**`, "Rua Exemplo, 100, Centro, Cidade Fictícia", placa `ABC1D23` | Fictício e mascarado |
| `app-E1` | Mesmos dados, **CPF inteiro `529.982.247-25`** no campo | Fictício, mas é CPF com dígito válido (ver 1.1) |
| `app-M1`, `app-N1`, `app-V2` | Placa `ABC1D23`, Fiat Uno, Prata, nome fictício | Limpas |
| `figma-ao-vivo-L1-...` | Frame do Figma ("Teodoro Lemos") | Não reabri: é o dado fictício do F26 |

Nenhuma captura mostra nome, telefone, e-mail ou endereço reais, nem dado de sessão (token, URL de API) visível. A barra de
status mostra só "09:41" fixo. Conferido a olho, imagem por imagem; não rodei OCR.

### 1.1 Duas observações que dependem de decisão, não de correção

1. **CPF completo na edição (E1) é a pendência D-C do F26.** Recomendação de design: manter completo na edição, mascarado só na leitura. Quem edita
   precisa ver o valor para corrigir um dígito; mascarar na edição obriga a redigitar os 11 números e aumenta o erro. A exposição é a do próprio
   titular do aparelho da oficina, e o log e a rota continuam sem CPF. A decisão final é do PO com VIGIA. Se for mascarar, vira desenho novo
   (E1 e E3) e feature própria. Para a **captura versionada**, a regra é outra e sem exceção: trocar o CPF da E1 por um valor com dígito
   **inválido** ou recapturar com o campo mascarado, para não versionar CPF que passa na validação (ver LG-05 e LG-06 da VIGIA).
2. **Máscara do CPF.** O app mostra `***.*82.2**-**` (3 dos 11 dígitos); o Figma D6 mostra `***.*56.7**-**` (também 3). Há **paridade**.
   Se o padrão de 3 dígitos visíveis é o que a política de dados quer, é decisão de VIGIA; do lado do design não há divergência.

## 2. Decisões de design pendentes: recomendação do ESQUADRO

O PO decide. Eu não tenho como perguntar nesta sessão, então registro a recomendação e o que muda em cada escolha.

| ID | Pergunta | Recomendação | Por quê | Prazo proposto |
|---|---|---|---|---|
| N-02 | Faixa de erro do formulário: acima do Salvar (Figma) ou no topo (app)? | **Tendência: acima do Salvar, como no frame; sem recomendação firme até conferir em aparelho** | A favor do frame: quem tocou Salvar vê o aviso ao lado do botão, e a A-03 (anúncio explícito mais foco no primeiro campo inválido) cobre a ordem de leitura por gestos. A favor do topo: some o risco de o teclado cobrir o aviso. **Não verificado em aparelho**: falta conferir se o teclado aberto cobre a faixa acima do Salvar e se o topo sai da tela com o teclado aberto. O frame do F26 ainda não foi aprovado, então "paridade" é com uma proposta, não com decisão fechada | 2026-11-28 |
| N-07 | Mover D6, D7, D8, V6, L8 e anotações `136:888`–`136:897` para a seção F26? | **Não mover; manter o registro corrigido** | São propostas sem aprovação; mover mexe em frames que ainda podem mudar. Mover só depois da aprovação | 2026-11-28 |
| PA-04 | Botões ancorados no rodapé (Figma E1, M1, N1) ou em fluxo (app e C1)? | **Em fluxo; ajusto o Figma** depois da aprovação | Rodapé fixo cobre campo com teclado aberto e com fonte a 200% (WCAG 2.4.11), e o C1 do próprio Figma já está em fluxo | 2026-11-28 |
| D-C | CPF completo ou mascarado na edição | Seção 1.1 | | 2026-11-28 |
| F26 | Aprovação | Sem registro; `get_comments` negado | Pedir ao PO que registre a aprovação (ou as correções) em `docs/product/F26-*` | 2026-11-28 |

## 3. Especificação para quem implementa

Todas ficam como **feature de correção** (limite de 5 correções pequenas esgotado). Cada uma traz token, texto e o teste de regressão esperado.
Texto de interface sempre por chave `area.componente.texto`; cor, tamanho e espaçamento só de `tokens.ts`.

### FC-A · `TextField`: erro de campo e obrigatório (N-01, N-03, N-04)

- **Componente:** `ui/text-field.tsx` (um componente, vale para os 4 campos obrigatórios e todos os erros). Variante nova: prop `required?: boolean`.
- **Erro (N-01):** ícone de alerta 14 × 14 à esquerda e mensagem a 13 px, ambos `color.text.error` (`#B5453D`, 5,0:1 sobre Pampas), com 6 de intervalo
  (texto deslocado 20, nós `106:2417` e `106:2419`). O espaço entre o campo e a mensagem **não li**: a ORLA copia de `106:2409`–`106:2419` por `get_metadata`.
  O ícone é decorativo (escondido do leitor); o sentido não depende de cor (ícone, texto e borda de 2 px).
- **Obrigatório (N-04):** o asterisco sai da string do rótulo e é desenhado à parte, em `color.text.error`, escondido do leitor
  (`accessibilityElementsHidden` no iOS, `importantForAccessibility="no"` no Android). O rótulo visível passa a ser, por exemplo, "Nome completo".
  Quem enxerga reconhece obrigatório pelo asterisco e opcional pelo "(opcional)", como no desenho; não criar legenda nova.
- **Nome acessível (N-03):** montado pelo componente, na ordem do frame C3 (anotação `112:2638`):

  | Estado | Nome falado |
  |---|---|
  | Obrigatório, sem erro | "Nome completo, obrigatório" |
  | Obrigatório, com erro | "Nome completo, obrigatório, erro: Informe o nome do cliente." |
  | Opcional, com erro | "Telefone (opcional), erro: Telefone inválido." |
  | Com ajuda (CPF) | rótulo + erro quando houver; a ajuda segue em `accessibilityHint` |

- **Chaves novas:** `comum.campo.obrigatorio` = "obrigatório"; `comum.campo.erro` = "erro". Tirar o "*" de `clientes.formulario.nome.rotulo`,
  `veiculos.formulario.placa.rotulo`, `.marca.rotulo` e `.modelo.rotulo`.
- **Tamanho:** passa de 2 arquivos de produto (componente, `strings.ts`, quatro formulários), por isso não coube na definição de pequeno.
- **Testes de regressão (devem falhar antes):** (1) com `required` o nome acessível termina em "obrigatório"; (2) com erro termina em "erro: <mensagem>";
  (3) o asterisco não está na árvore de acessibilidade; (4) o ícone aparece com erro e não aparece sem; (5) o texto de erro tem 13.
- **Não testado:** o que VoiceOver e TalkBack realmente falam; ordem "obrigatório" antes de "erro" no aparelho.

### FC-B · Alvo e foco de "Limpar busca" e "Fechar aviso" (A-01, A-02)

- **Limpar busca (`search-field.tsx`, `search-field.styles.ts:14-19`):** área tocável de 48 × 48 (hoje cerca de 34 × 20, calculada do `hitSlop`). Ícone continua 18.
  Anel de foco igual ao dos botões do cabeçalho sobre fundo claro: `useFocusRing`, 2 px petro com respiro branco de 2 (12,12:1 sobre branco).
- **Fechar aviso (`inline-notice.tsx`):** já tem 48 depois da N-06. Falta o anel: aviso é verde `#3E6E4A` com texto branco, então o anel é **branco**
  (`color.focus.ringOnBrand`), como no cabeçalho. Contraste do anel sobre o verde: 5,94:1 (par do texto), acima de 3:1.
- **Testes:** o de A-01 mede o **botão** (não o campo) e hoje daria 20; o de A-02 segue o padrão da N-05 (`header-icon-button.test.tsx`).

### FC-C · Anúncio de erro e foco do diálogo (A-03, N-08)

- **A-03, regra de comportamento:**
  1. Erro de **campo**: foco vai ao primeiro campo inválido (já existe) e o nome do campo traz "erro: …". Nesse caso o `InlineAlert` da faixa **não** usa
     região viva no Android (evita leitura dupla); anuncia uma vez.
  2. Erro de **conexão ou conflito geral** (`erroConexao`, `conflitoGeral`): a faixa chama `announceForAccessibility(mensagem)` ao aparecer, como o
     `InlineNotice` faz, **sem roubar o foco** (WCAG 4.1.3, mensagem de status). A ação "Tentar de novo" continua no `Button` do formulário.
  3. Falha ao carregar mais na lista: mesma regra do item 2.
- **N-08, diálogo "Descartar alterações?" (X1 a X4, anotação `119:975`):** foco inicial em "Continuar editando"; foco preso dentro do diálogo; botão
  voltar do sistema = "Continuar editando". O app já tem `accessibilityViewIsModal` e `onRequestClose`; falta o foco inicial explícito
  (`AccessibilityInfo.setAccessibilityFocus` no iOS; no Android, o primeiro foco do modal). **Não verificado onde o foco cai hoje.**
- **Teste:** só valida props e a chamada do anúncio. A confirmação de que o leitor fala uma vez é em aparelho (seção 4).

### FC-D · Paridade visual (PA-01, PA-02, PA-03)

Já especificadas, com medidas e nós, em `F45-auditoria-codigo-i18n-tokens-a11y.md`, seção 7.5. Resumo para conferência:
PA-01 `SectionTitle` em Flint `#6E6A66` com letter-spacing 0,9 (4,93:1 sobre Pampas, passa AA); PA-02 ícone `pencil` 18 no cabeçalho do veículo
(glifo do Figma **não confirmado**); PA-03 texto centralizado no cartão "Nenhuma OS neste veículo" (25 acima e abaixo, 6 entre título e apoio, 21 nas laterais).
Antes de PA-01: `grep -rn "SectionTitle\|sectionTitle" apps/mobile/src apps/mobile/app` e conferir Início e Perfil, que não comparei.

### FC-E · Duplicação nos formulários (baixa, sem especificação visual)

`textoDaFaixa` e o foco no primeiro campo inválido repetidos em `client-form-fields.tsx` e `vehicle-form-fields.tsx`: extrair um hook. Sem mudança
de aparência. Fazer junto da FC-C, que mexe nos mesmos arquivos.

## 4. Roteiro de leitor de tela (US-REV-02-07): o que deve ser anunciado

A coluna "Esperado" **vem da leitura do código e das anotações do Figma, não de áudio**. A coluna "Ouvido" fica para quem rodar VoiceOver (iOS) ou
TalkBack (Android). Dado só fictício. Registrar plataforma, versão e se o teste foi com dedo ou teclado.

| Tela / ação | Esperado | Ouvido |
|---|---|---|
| Lista, abrir | "Clientes", cabeçalho; "Perfil", botão; "Buscar clientes", campo de busca; cada linha "Nome, contato, botão" | |
| Lista, digitar na busca | Ao fim da busca: "N clientes encontrados" ou "Nenhum cliente encontrado" | |
| Lista, tocar em "Limpar busca" | "Limpar busca, botão" | |
| Detalhe do cliente | "Voltar"; título (cabeçalho); "Editar cliente <nome>"; linhas "Telefone: …"; CPF por nome próprio, **sem soletrar asteriscos**; "Veículos (n)", cabeçalho de seção | |
| Detalhe, após salvar | Aviso de sucesso anunciado uma vez, sem mover o foco; "Fechar aviso, botão" | |
| Criar cliente, campos | "Nome completo, obrigatório"; "Telefone (opcional)"; "CPF (opcional)" com a ajuda; botão "Salvar cliente" | |
| Criar cliente, salvar vazio | Foco no Nome; fala "Nome completo, obrigatório, erro: Informe o nome do cliente."; faixa lida **uma vez** | |
| Editar cliente, voltar com alteração | Diálogo "Descartar alterações?", foco inicial em "Continuar editando" | |
| Detalhe do veículo | "Editar veículo <placa>"; linhas "Placa: …"; "Histórico de OS (0)"; "Nenhuma OS neste veículo" | |
| Criar/editar veículo, salvar vazio | Foco em Placa; erro anunciado como no cliente | |
| Qualquer tela, API desligada | Erro de conexão anunciado; "Tentar de novo, botão" alcançável | |

Teclado externo (Tab, Shift+Tab, Enter/Espaço): ordem esperada na E1: 1 Voltar, 2 Nome, 3 Telefone, 4 E-mail, 5 CPF, 6 Endereço, 7 Cancelar,
8 Salvar alterações (camada `120:1706`). Conferir o anel branco nos botões do cabeçalho (N-05) e no "Limpar busca" e "Fechar aviso" (FC-B).
Nenhum controle pode prender o foco; o diálogo prende por desenho.

## 5. Como capturar em 360 × 740 e medir contraste no app renderizado

- **Aparelho de captura:** Android Virtual Device com tela de 360 × 740 dp (1080 × 2220 a 3x) ou aparelho físico com essa largura. iPhone não serve para
  paridade (402 × 874 pt, barra de status e ilha). Capturas de iPhone valem como evidência de estado, não de paridade.
- **Ambiente:** fonte do sistema padrão, tema claro, relógio fixo, só dado fictício (`@exemplo.invalid`, `(11) 90000-000x`, CPF **inválido**).
- **Estados por tela (US-REV-02-08):** preenchido, vazio, carregando (atrasar a API), erro de rede (API desligada), e nos formulários também erro de campo
  e diálogo de descarte. Nomear `app-<frame>-<estado>-android-360x740.png`; manter cada arquivo ≤ 300 KB (regra proposta no ADR-041 pelo CARTOGRAFO,
  **ainda não gravado no repositório**).
- **Contraste no renderizado:** amostrar a cor do pixel do texto, da borda e do ícone na captura (por exemplo, Digital Color Meter do macOS em sRGB sobre
  a captura) e calcular com a fórmula de `F41-contraste.py`. Medir ao menos: rótulo `#6E6A66`, placeholder, borda de campo, erro `#B5453D`, aba selecionada
  `#EE8279` sobre petro (o menor valor, 4,68:1), anel de foco. Comparar com os valores dos tokens; qualquer diferença vira achado.
- **Com a camada de foco do Figma oculta** (`120:1449`, `120:1706` e equivalentes) ao exportar o frame para o lado a lado.

## 6. Lacunas de desenho (para desenhar depois da aprovação da F26)

Descrição do que falta; nenhum frame foi criado.

| Lacuna | Como deve ficar |
|---|---|
| Criar cliente e criar veículo, **preenchido** | C1/N1 com valores; botão "Salvar cliente"/"Salvar veículo" habilitado; sem faixa nem erro |
| Editar cliente e editar veículo, **vazio** | E1/M1 com um obrigatório apagado, **sem** erro até o primeiro Salvar; depois o erro é o do E3/M3 |
| P-12 (leitura inicial do formulário), P-13 (aviso de falha ao atualizar) | Pendentes desde a F35 |
| P-11 (selos dos 5 status de OS que faltam) | Fica para a F06, que traz as OS |
| Variáveis `#3E6E4A` e `#2C5258` (P-15) | Criar com nome `color/<papel>/<estado>` ao aprovar |

## 7. Pendências por dono

| Quem | O quê | Prazo proposto |
|---|---|---|
| PO | Decidir N-02, N-07, PA-04, D-C; registrar a aprovação do F26 | 2026-11-28 |
| VIGIA | Trocar o CPF da captura E1 e dos testes por valor sem dígito válido; decidir a máscara de 3 dígitos | 2026-11-28 |
| ORLA | FC-A a FC-E como features de correção, com os testes da seção 3 | por prioridade da BUSSOLA |
| CRIVO / ORLA | Roteiro da seção 4 e capturas da seção 5 em AVD ou aparelho | quando houver ambiente |
| ESQUADRO | Mover ou corrigir registro (N-07) e desenhar lacunas da seção 6 | depois da aprovação do F26 |
