# F35 · Especificação das telas de Clientes e Veículos (ESQUADRO, 2026-11-19)

Etapa 3 de 6 da F35 (front mobile de Clientes e Veículos). Entrada para o ORLA.

**Como ler.** Tudo marcado como **[Figma]** foi lido do arquivo `FPdB8RymAnN81pbKfizdzE` (página `20:2132`, seção F26 `106:2097`) por `use_figma` e `get_screenshot`, em 19/11/2026. **[Código]** foi lido em `apps/mobile/src`. **[Proposta]** é decisão minha, sem desenho aprovado. **[Não lido]** é o que não consegui ler (seção 12).

Documentos de origem: `F26-prototipo-clientes-veiculos.md` (nós, decisões 1–20), `F40-componentes-base-especificacao.md`, ADR-029/030/031 (Proposto), `lgpd-registro-dados-pessoais.md`.

---

## 1. Mapa das telas

Todas as telas partem de frames de 362 × 742 (conteúdo de 360). Capturas em `docs/design/f35-capturas/` (44 PNGs de 410 × 790, camada de foco oculta para paridade; nome `figma-<f26|f35>-<ID>-<slug>-<nó>.png`).

| Tela | Rota proposta (ADR-029) | Carregando | Vazio | Erro | Sucesso | Outros |
|---|---|---|---|---|---|---|
| Lista de clientes | `clientes/index` | L4 `109:2402` | L2 `106:2112`; busca sem resultado L3 `106:2128` | L5 `109:2453` | L6 `106:2146` | L1 `106:2098` preenchido; L7 `119:779` contatos ausentes; L8 `135:1182` "Carregar mais" **[Proposta]** |
| Detalhe do cliente | `clientes/[id]` | D2 `109:2507` | D6 `135:937` sem veículos **[Proposta]** | D3 `109:2574`; D8 `135:1107` não encontrado **[Proposta]** | D4 `109:2809`; D5 `109:2877` | D1 `106:2159` preenchido; D7 `135:1022` "Não informado" **[Proposta]** |
| Criar/editar cliente | `clientes/novo`, `clientes/[id]/editar` | C2 `110:2535`; E2 `110:2718` | C1 `106:2277` | C3 `106:2409`, C4 `110:2576`, C5 `110:2625`, C6 `110:2674`, C7 `119:712`; E3 `110:2762` | (volta ao D4/L6) | E1 `106:2300`; X1 `119:905`, X2 `119:976` descarte |
| Criar/editar veículo | `clientes/[id]/veiculos/novo`, `…/[veiculoId]/editar` | N2 `111:2589`; M2 `111:2729` | N1 `106:2334` | N3 `106:2440`, N4 `111:2632`, N5 `111:2683`; M3 `111:2775` | (volta ao D5/V5) | M1 `106:2368`; X3 `119:1041`, X4 `119:1120` |
| Detalhe do veículo | `clientes/[id]/veiculos/[veiculoId]` | V3 `109:2651` | V2 `109:3030` histórico vazio | V4 `109:2723`; V6 `135:1144` não encontrado **[Proposta]** | V5 `109:2959` | V1 `106:2214` |

As 5 telas **[Proposta]** (D6, D7, D8, V6, L8) foram criadas por mim nesta etapa, na linha y=8900 da seção F26, para cobrir estados que o F26 não tinha. Dependem de aprovação. Não têm camada de foco desenhada; a ordem está nas anotações `136:888–897`.

> Correção de premissa: o card dizia que o F26 não tinha lista de veículos no detalhe do cliente. Tem (D1 `106:2185…2207`: título "Veículos (2)", dois cartões e "+ Veículo"). Faltavam os estados sem veículo, dados ausentes e não encontrado, que criei (D6, D7, D8).

---

## 2. Tokens

Fonte do código: `apps/mobile/src/theme/tokens.ts`. Variáveis do Figma têm nome automático (`color/cyan/18`); a tabela liga as duas.

| Papel | Figma | Hex | Token do código |
|---|---|---|---|
| Cabeçalho, texto principal | `cyan/18` | `#1E3A3F` | `color.surface.brand`, `color.text.primary` |
| Ação primária, erro | `red/47` | `#B5453D` | `color.action.primaryBackground`, `color.text.error`, `color.border.error` |
| Fundo da tela | `grey/96` | `#F7F5F2` | `color.surface.background` |
| Texto secundário, placeholder | `grey/42`, `text/placeholder` | `#6E6A66` | `color.text.secondary`, `color.text.placeholder` |
| Divisor, contorno de cartão | `orange/87` | `#E2DEDA` | `color.border.divider` |
| Avatar, ícone de veículo | `cyan/28` | `#33575D` | `color.surface.avatar` |
| Borda de campo | `border/default` | `#8C8780` | `color.border.default` |
| Campo bloqueado | `surface/skeleton` | `#F1F5F9` | `color.surface.skeleton` |
| Faixa de erro (fundo/borda/texto) | — | `#F6E7E5` / `#E2B5B0` / `#923631` | `surface.errorTint`, `border.errorBanner`, `text.errorOnBanner` |
| Aba selecionada / inativa | `text/tabSelected`, `grey/70` | `#EE8279` / `#B7B2AC` | `text.tabSelected`, `text.onBrandMuted` |
| **Aviso de sucesso (fundo)** | — | `#3E6E4A` | **ausente** |
| **Selo EM ANDAMENTO** | — | `#2C5258` | **ausente** |
| **Selo ENTREGUE** | — | `#3E6E4A` | **ausente** |

**Tokens novos a criar (ORLA), seguindo `<categoria>/<papel>/<estado>`:** `color/feedback/success` (`#3E6E4A`, aviso de sucesso e selo ENTREGUE), `color/status/inProgress` (`#2C5258`), mais `typography.avatarInitialsSmall` (Barlow Condensed SemiBold 17, avatar de 40) e `size.avatarSmall` (40). Os dois hex ainda não têm variável no Figma; só existem como cor solta nos frames **[Figma]**.

### Tipografia **[Figma]**

| Uso | Fonte | Token existente |
|---|---|---|
| Título do cabeçalho | Barlow Condensed SemiBold 21 | `typography.appBarTitle` |
| Nome no cartão de detalhe | Barlow Condensed SemiBold 22 | **sem token** (propor `typography.detailName`) |
| Título de seção ("Veículos (2)", "Histórico de OS (3)") | Barlow Condensed SemiBold 15, maiúsculas visuais | **sem token** (propor `typography.sectionTitle`) |
| Rótulo de campo | Inter Medium 13 | `fieldLabel` |
| Texto digitado | Inter Regular 15 | `input` |
| Linha rótulo/valor | Inter 14 (valor Medium) | `rowLabel` / `rowValue` |
| Nome no cartão da lista | Inter SemiBold 15 | `button` (mesma métrica; criar `cardTitle`) |
| Subtítulo do cartão | Inter 13 | `subtitle` |
| Selo | Inter SemiBold 12 | `badge` |
| Aviso de sucesso | Inter Medium 14 | `rowValue` |
| Botão | Inter SemiBold 15 | `button` |
| Título do diálogo | Barlow Condensed Bold 22 | `dialogTitle` |
| Iniciais do avatar (40) | Barlow Condensed SemiBold 17 | **sem token** |

Maiúsculas dos títulos de seção: o texto no Figma é "Veículos (2)" e a caixa alta é visual. No app, aplicar `textTransform: 'uppercase'` sem mudar a string que o leitor lê.

---

## 3. Medidas comuns **[Figma]**

- Cabeçalho 56 de altura; botão do cabeçalho 36 × 36 (alvo transparente de 44 no F26; o código usa 48, que prevalece).
- Conteúdo com padding horizontal de 16 (x = 17 no frame de 362); largura útil 328.
- Campo 46 de altura, borda 1 px (2 px com foco ou erro), raio 8; rótulo 6 acima; espaço entre campos 16 (`TextField.container.marginBottom`).
- Campo Endereço: 76 de altura (multilinha).
- Botão 50 de altura, raio 8; Cancelar/Salvar lado a lado 159 × 50 (x = 17 e 186, intervalo de 10).
- Cartão de lista 66 de altura, espaço entre cartões 12; avatar 40 (raio 20); ícone de veículo em quadrado de 40, raio 8, fundo `#33575D`.
- Barra inferior 62 (abas de 90 × 62), só nas telas da lista. Detalhe e formulários não têm barra inferior.
- Aviso de sucesso 328 × 44, raio 8, x = 17, y = 681 (a 17 da base), ícone e texto brancos a x = 59.

---

## 4. Especificação por tela

Textos entre aspas são os do Figma, literais. Chaves i18n são **[Proposta]**, no formato `area.componente.texto`, seguindo as já existentes (`cabecalho.voltar.rotulo`, `cabecalho.usuario.rotulo`, `menu.tabbar.clientes.*`). Nada de texto fixo no código.

### 4.1 Lista de clientes (L1–L8)

**Fluxo.** Aba Clientes → lista → (toque no cartão) detalhe; (Novo cliente) formulário de criação; (cabeçalho) botão de usuário abre o Perfil.

**Hierarquia (L1 `106:2098`).** Cabeçalho `106:2099` "Clientes" + botão de usuário → campo de busca `106:2101` (328 × 46, ícone de lupa, "Buscar por nome, telefone ou e-mail") → cartões `106:2102…2106` → botão "Novo cliente" `106:2108` (328 × 50, y = 613, ícone +) → barra inferior `106:2111`.

**Cartão do cliente** (328 × 66): avatar de 40 com iniciais; nome (Inter SemiBold 15); contato (Inter 13, `#6E6A66`); seta à direita. O cartão inteiro é um alvo de toque.

**Regra do contato (L7 `119:779`).** Telefone; se não houver, e-mail; se não houver nenhum, "Sem contato cadastrado".

| Estado | Frame | Conteúdo e comportamento |
|---|---|---|
| Carregando | L4 | Indicador grande + "Carregando clientes…" no meio da área; a busca continua visível. |
| Vazio | L2 | Ícone de duas pessoas (círculo 72 `#EDE9E4`), "Nenhum cliente cadastrado", "Cadastre o primeiro cliente para abrir ordens de serviço.", botão "Novo cliente". |
| Vazio de busca | L3 | Campo preenchido ("Lauro"), "Nenhum resultado", "Nenhum cliente encontrado para "Lauro".", botão "Cadastrar "Lauro"". |
| Erro | L5 | Ícone de rede cortada, "Não foi possível carregar", "Verifique a internet da oficina e tente de novo.", "Tentar novamente" (primário) e "Voltar" (contorno). |
| Sucesso | L6 | Lista com aviso verde "Cliente "Otávio Neves" cadastrado." (332 × 44 em x = 15, y = 619, acima da barra). |
| Mais páginas **[Proposta]** | L8 | Botão de contorno "Carregar mais" (328 × 50, y = 521) abaixo do último cartão, acima de "Novo cliente". |

**Chaves.** `clientes.lista.titulo`, `clientes.lista.busca.placeholder`, `clientes.lista.busca.rotulo`, `clientes.lista.carregando`, `clientes.lista.vazio.titulo`, `clientes.lista.vazio.mensagem`, `clientes.lista.novo`, `clientes.lista.semResultado.titulo`, `clientes.lista.semResultado.mensagem` (com `{termo}`), `clientes.lista.semResultado.cadastrar` (com `{termo}`), `clientes.lista.erro.titulo`, `clientes.lista.erro.mensagem`, `clientes.lista.erro.tentar`, `clientes.lista.erro.voltar`, `clientes.lista.carregarMais`, `clientes.lista.semContato`, `clientes.lista.sucesso.criado` (com `{nome}`), `clientes.lista.item.rotulo`.

**Dado.** A busca dispara após 400 ms de pausa (ADR-031). A lista é paginada (`page`/`size`); o desenho original não tinha paginação, por isso L8 é proposta.

### 4.2 Detalhe do cliente (D1–D8)

**Hierarquia (D1 `106:2159`).** Cabeçalho `[voltar] "Teodoro Lemos" [editar]` → cartão `106:2162` (328 × 178) com avatar de 40 + nome (BC 22) e linhas Telefone, E-mail, CPF, Endereço → título "Veículos (2)" `106:2185` → cartões de veículo `106:2186`, `106:2196` (328 × 66; ícone de carro, "RTK4M81 · Honda Civic", "2018 · Preto", seta) → botão de contorno "+ Veículo" `106:2207` (328 × 50).

| Estado | Frame | Conteúdo e comportamento |
|---|---|---|
| Carregando | D2 | Cabeçalho "Cliente" + indicador + "Carregando cliente…". |
| Erro | D3 | "Não foi possível carregar", "Não foi possível abrir este cliente. Verifique a internet da oficina e tente de novo.", "Tentar novamente", "Voltar". |
| Não encontrado **[Proposta]** | D8 | "Cliente não encontrado", "Este cliente não existe mais ou foi removido. Volte para a lista de clientes.", "Voltar para clientes". Sem "Tentar novamente": repetir não resolve um 404. |
| Sem veículos **[Proposta]** | D6 | "Veículos (0)" + cartão "Nenhum veículo cadastrado" / "Cadastre o primeiro veículo deste cliente."; "+ Veículo" continua. |
| Dados ausentes **[Proposta]** | D7 | Cada linha sem dado mostra "Não informado" em `#6E6A66`. |
| Sucesso | D4 (editado), D5 (veículo criado) | Aviso verde "Alterações salvas." / "Veículo cadastrado."; D5 mostra "Veículos (3)". |

**CPF.** Mostrado mascarado `***.*56.7**-**` (decisão D-C do F26; ver pendência na seção 10). CPF nunca vai para rota nem para log (LGPD).

**Chaves.** `clientes.detalhe.titulo`, `clientes.detalhe.editar.rotulo`, `clientes.detalhe.telefone`, `clientes.detalhe.email`, `clientes.detalhe.cpf`, `clientes.detalhe.endereco`, `clientes.detalhe.naoInformado`, `clientes.detalhe.veiculos.titulo` (com `{quantidade}`), `clientes.detalhe.veiculos.vazio.titulo`, `clientes.detalhe.veiculos.vazio.mensagem`, `clientes.detalhe.veiculos.novo`, `clientes.detalhe.carregando`, `clientes.detalhe.erro.*`, `clientes.detalhe.naoEncontrado.titulo`, `clientes.detalhe.naoEncontrado.mensagem`, `clientes.detalhe.naoEncontrado.voltar`, `clientes.detalhe.sucesso.editado`, `clientes.detalhe.sucesso.veiculoCriado`.

### 4.3 Criar e editar cliente (C1–C7, E1–E3, X1, X2)

**Campos, em ordem (C1 `106:2277`).**

| # | Rótulo | Placeholder | Teclado / tipo | Observação |
|---|---|---|---|---|
| 1 | "Nome completo *" | "Ex.: João da Silva" | texto, capitaliza palavras | Único obrigatório no F26. |
| 2 | "Telefone (opcional)" | "(11) 90000-0000" | telefônico | |
| 3 | "E-mail (opcional)" | "nome@example.com" | e-mail, sem capitalizar | |
| 4 | "CPF (opcional)" | "000.000.000-00" | numérico | Ajuda: "Só preencha se o cliente pedir nota fiscal." |
| 5 | "Endereço (opcional)" | "Rua, número, bairro, cidade" | texto, multilinha (76) | |

Acima do botão, aviso de privacidade (13 px, 328 × 64): "Usamos seu nome, telefone e e-mail só para atender seu veículo e avisar sobre orçamento e serviço. CPF e endereço só se você pedir nota fiscal. Para corrigir ou apagar seus dados, fale com a oficina." Botão "Salvar cliente" (328 × 50, y = 621). Na edição (E1), o aviso sai e os botões viram "Cancelar" (contorno) + "Salvar alterações".

| Estado | Frame | Conteúdo e comportamento |
|---|---|---|
| Vazio | C1 | Campos limpos, placeholders visíveis. |
| Salvando | C2, E2 | Campos em `#F1F5F9` e não editáveis; botão "Salvando…" com indicador de 16; Cancelar fica desabilitado (E2). |
| Erro de validação | C3 | Erro sob o campo: "Informe o nome do cliente.", "Telefone incompleto. Use (11) 90000-0000."; borda de 2 px `#B5453D`; faixa de erro `106:2435` (328 × 66) "Corrija os 2 campos destacados para salvar.". |
| CPF inválido | C4 | "CPF inválido. Confira os 11 números." + faixa "Corrija o campo destacado para salvar." |
| CPF duplicado | C5 | "Já existe um cliente com este CPF." + faixa singular. |
| E-mail inválido | C7 | "Informe um e-mail válido." + faixa singular. |
| Falha de envio | C6, E3 | Faixa "Não foi possível salvar. Verifique a internet da oficina e tente de novo." sem campo marcado; o texto digitado permanece. |
| Sucesso | — | Volta ao detalhe (D4) ou lista (L6) com aviso verde. |
| Descartar | X1, X2 | Diálogo 316 × 246, raio 10, fundo escurecido `cyan/18` a 55%. "Descartar alterações?" / "O que você digitou neste formulário será perdido." Botões **empilhados** 276 × 50: "Continuar editando" (primário, foco inicial) e "Descartar" (contorno). |

**Regras.** Validar ao tocar em salvar, não a cada tecla. A faixa de erro usa singular/plural conforme a contagem. Em erro, o foco vai para o primeiro campo inválido. O gesto de voltar do sistema abre o diálogo de descarte se houver alteração (ADR-029: `beforeRemove`, `gestureEnabled: false`).

**Chaves.** `clientes.formulario.tituloNovo`, `clientes.formulario.tituloEditar`, `clientes.formulario.nome.rotulo`, `…nome.placeholder`, `clientes.formulario.telefone.rotulo`, `…telefone.placeholder`, `clientes.formulario.email.*`, `clientes.formulario.cpf.rotulo`, `…cpf.placeholder`, `…cpf.ajuda`, `clientes.formulario.endereco.*`, `clientes.formulario.privacidade`, `clientes.formulario.salvarNovo`, `clientes.formulario.salvarEdicao`, `clientes.formulario.cancelar`, `clientes.formulario.salvando`, `clientes.formulario.erro.nomeObrigatorio`, `…telefoneIncompleto`, `…cpfInvalido`, `…cpfDuplicado`, `…emailInvalido`, `clientes.formulario.erro.faixaPlural` (com `{quantidade}`), `…faixaSingular`, `clientes.formulario.erro.envio`, `clientes.descartar.titulo`, `clientes.descartar.mensagem`, `clientes.descartar.continuar`, `clientes.descartar.confirmar`.

### 4.4 Criar e editar veículo (N1–N5, M1–M3, X3, X4)

**Campos (N1 `106:2334`).** Linha informativa "Cliente: Teodoro Lemos" (texto, não campo; a parte "Cliente:" em cinza e o nome em destaque) → "Placa *" (placeholder "AAA0A00", maiúsculas automáticas) → "Marca *" ("Ex.: Fiat") e "Modelo *" ("Ex.: Uno") lado a lado, 159 × 46 cada (x = 17 e 186) → "Ano (opcional)" ("2020", numérico) e "Cor (opcional)" ("Ex.: Prata") lado a lado → "Salvar veículo" `106:2367`. Na edição, Cancelar + "Salvar alterações" (M1 `106:2368`).

| Estado | Frame | Conteúdo |
|---|---|---|
| Vazio | N1 | Placeholders visíveis. |
| Salvando | N2, M2 | Campos bloqueados, "Salvando…". |
| Erro de validação | N3 | "Placa inválida. Use ABC1D23 ou ABC1234.", "Informe o modelo.", "Ano inválido." + faixa "Corrija os 3 campos destacados para salvar." |
| Placa duplicada | N4 | "Esta placa já está cadastrada." + faixa singular. |
| Falha de envio | N5, M3 | Faixa "Não foi possível salvar. Verifique a internet da oficina e tente de novo." |
| Sucesso | — | Volta ao detalhe do cliente (D5) ou do veículo (V5) com aviso verde. |
| Descartar | X3, X4 | Mesmo diálogo do cliente. |

**Chaves.** `veiculos.formulario.tituloNovo`, `…tituloEditar`, `veiculos.formulario.cliente` (com `{nome}`), `veiculos.formulario.placa.rotulo`, `…placa.placeholder`, `veiculos.formulario.marca.*`, `…modelo.*`, `…ano.*`, `…cor.*`, `veiculos.formulario.salvarNovo`, `…salvarEdicao`, `…cancelar`, `…salvando`, `veiculos.formulario.erro.placaInvalida`, `…placaDuplicada`, `…modeloObrigatorio`, `…marcaObrigatoria`, `…anoInvalido`, `…faixaPlural`, `…faixaSingular`, `…envio`. O diálogo de descarte reusa `clientes.descartar.*` movido para `comum.descartar.*` **[Proposta]**.

> O Figma não desenha o erro de "Marca" vazia (N3 só mostra "Informe o modelo."). A mensagem `…marcaObrigatoria` é minha, no mesmo padrão. **[Proposta]**

### 4.5 Detalhe do veículo (V1–V6)

**Hierarquia (V1 `106:2214`).** Cabeçalho `[voltar] "RTK4M81" [editar]` → cartão `106:2223` (328 × 153): ícone de carro, "Honda Civic" (BC 22), nome do cliente ("Teodoro Lemos"), linhas Placa, Ano, Cor → título "Histórico de OS (3)" `106:2249` → cartões de OS (`106:2250`, `106:2258`, `106:2266`): título "OS #0207 · Troca de pastilhas", "09/11/2026 · R$ 455,00", rótulo "Exemplo" (contorno) e selo "EM ANDAMENTO" (`#2C5258`) ou "ENTREGUE" (`#3E6E4A`).

| Estado | Frame | Conteúdo |
|---|---|---|
| Carregando | V3 | "Carregando veículo…" |
| Histórico vazio | V2 | "Histórico de OS (0)", "Nenhuma OS neste veículo", "As ordens de serviço deste veículo vão aparecer aqui." |
| Erro | V4 | "Não foi possível abrir este veículo. Verifique a internet da oficina e tente de novo." + "Tentar novamente" + "Voltar" |
| Não encontrado **[Proposta]** | V6 | "Veículo não encontrado", "Este veículo não existe mais ou foi removido. Volte para o cliente.", "Voltar para o cliente" |
| Sucesso | V5 | Aviso verde "Alterações salvas." |

**Histórico de OS.** O desenho usa número, título e data que a API não devolve (a API traz `{id, status, valorTotal}`). O rótulo "Exemplo" sinaliza isso no protótipo e **não vai para o app**. No app, o cartão mostra o que o contrato tem: `OS #{id}` (sugestão; o número de exibição fica a definir), valor em `Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'})` e o selo. Decisão do PO pendente (seção 10).

Só dois selos foram desenhados (EM ANDAMENTO e ENTREGUE). Os outros status do fluxo da OS (ABERTA, EM_ANALISE, AGUARDANDO_PECA, FINALIZADA, CANCELADA) **não existem no Figma** **[Não lido]**; devem ser desenhados antes de entrar no app, ou cair num selo neutro com o nome do status.

**Chaves.** `veiculos.detalhe.titulo`, `…editar.rotulo`, `veiculos.detalhe.placa`, `…ano`, `…cor`, `veiculos.detalhe.historico.titulo` (com `{quantidade}`), `…historico.vazio.titulo`, `…vazio.mensagem`, `veiculos.detalhe.carregando`, `veiculos.detalhe.erro.*`, `veiculos.detalhe.naoEncontrado.*`, `veiculos.detalhe.sucesso.editado`, `veiculos.status.emAndamento`, `veiculos.status.entregue`.

---

## 5. Ícones

Os ícones no Figma não têm nome; os de Ionicons abaixo foram **inferidos por screenshot**, não lidos. ORLA confirma na hora de montar.

| Uso | Ícone sugerido (Ionicons) | Observação |
|---|---|---|
| Voltar | `chevron-back` | já usado em `ScreenHeader` |
| Usuário (cabeçalho da lista) | `person-outline` | já usado |
| Editar (cabeçalho do detalhe) | `create-outline` ou `pencil-outline` | `ScreenHeader` hoje só aceita `person-outline` |
| Busca | `search-outline` | |
| Seta do cartão | `chevron-forward` | decorativo |
| Veículo | `car-sport-outline` | quadrado `#33575D`, ícone branco |
| Novo (+) | `add` | |
| Estado vazio da lista | `people-outline` | o código usa `document-text-outline` fixo; **diverge do Figma** |
| Estado de erro | `cloud-offline-outline` | já em `ErrorState`; o Figma mostra rede cortada |
| Aviso de sucesso | `checkmark-circle-outline` | **[Não lido]**: o ícone da faixa verde não foi identificado |

Ícones decorativos ficam fora da árvore de acessibilidade (`accessibilityElementsHidden` / `importantForAccessibility="no"`).

---

## 6. Componentes: reuso da F40 e o que é novo

| Necessidade | Componente | Situação | Ajuste necessário |
|---|---|---|---|
| Botões primário, secundário e de contorno | `ui/button` | **Reusado** | Nenhum. "Carregar mais" e "+ Veículo" são `variant="secondary"` (contorno). |
| Cabeçalho com voltar | `ui/screen-header` | **Reusado com ajuste** | A ação da direita é fixa em `person-outline`. Generalizar (ícone + rótulo + `onPress`) para o lápis de editar. |
| Botão de ícone do cabeçalho | `ui/header-icon-button` | **Reusado** | Nenhum. |
| Campo de texto | `ui/text-field` | **Reusado com ajuste** | Faltam `multiline` (Endereço, 76), texto de ajuda (CPF), `maxLength` e `autoComplete`/`inputMode`. O erro e o foco já cumprem (`accessibilityRole="alert"`). |
| Faixa de erro do formulário | `ui/inline-alert` | **Reusado** | Nenhum. |
| Diálogo de descarte | `ui/confirm-dialog` | **Reusado com ajuste** | Hoje: botões lado a lado, `cancelLabel` à esquerda e `onRequestClose = onCancel`. O desenho pede botões empilhados e o primário como ação **segura** ("Continuar editando"). Sem ajuste, o botão voltar do Android descartaria. Adicionar modo empilhado e `onRequestClose` = continuar. |
| Carregando, vazio, erro de tela | `ui/state-view`, `ui/error-state`, `ui/state-illustration` | **Reusado com ajuste** | `EmptyState` usa ícone fixo; expor `icon`. O erro 404 (D8, V6) usa `StateIllustration` com outro ícone e sem "Tentar novamente". |
| Contêiner de tela | `ui/screen-container` | **Reusado** | Nenhum. |
| Cartão com linhas rótulo/valor | `perfil/info-card` | **Reusado com ajuste** | Falta o cabeçalho com avatar + nome e o valor "Não informado". Mover para `ui/` ou criar variante. |
| Avatar | `perfil/avatar` (84) | **Novo** (variante de 40) | Tamanho e fonte das iniciais diferentes; mesma lógica de iniciais. |
| Barra inferior | `menu/*` | **Reusado** | Nenhum; a aba Clientes já existe. |
| **Cartão de cliente da lista** | — | **Novo** | Nenhum componente existente combina avatar, dois textos e seta numa linha tocável. |
| **Cartão de veículo** | — | **Novo** | Mesma estrutura do cartão de cliente, com ícone em vez de avatar. Pode ser o mesmo componente (`ListRow`) com `leading` configurável: recomendo um só. |
| **Selo de status da OS** | — | **Novo** | Não existe selo; precisa dos tokens `#2C5258` e `#3E6E4A`. |
| **Aviso de sucesso** | — | **Novo** | `InlineAlert` é só erro (cores e ícone). Criar `ui/inline-notice` com variante `success`. |
| **Campo de busca** | — | **Novo** | Lupa, botão de limpar e papel `search`. |

Justificativa para os novos: nenhum componente da F40 cobre linha tocável, selo ou aviso de sucesso. Cartão de cliente e de veículo devem ser **um único componente** para não duplicar.

---

## 7. Comportamento responsivo (360 / 768 / 1280)

O Figma só desenha 360. Os dois outros tamanhos são **[Proposta]**, sem frame desenhado.

- **360:** como desenhado; coluna única, largura útil 328 (padding 16), nada de largura fixa em contêiner (os 328 vêm de `100%` menos o padding).
- **768:** coluna única centralizada, largura máxima 560 (formulários e detalhe) para os campos não esticarem; a lista usa a mesma coluna. Campos lado a lado (Marca/Modelo, Ano/Cor) permanecem. Botões Cancelar/Salvar ficam lado a lado.
- **1280:** mesma coluna de 560 centralizada. Sem layout de duas colunas: o app é de uso interno em celular e a complexidade não se justifica.
- **Teclado aberto:** o formulário rola (`ScrollView` com `keyboardShouldPersistTaps="handled"`); o botão Salvar não pode ficar coberto; o campo com foco é rolado para a vista.
- **Fonte ampliada (até 200%):** textos quebram em vez de cortar; cartão de 66 vira altura mínima, não fixa; "Marca/Modelo" empilham quando a largura de cada campo for menor que ~140.
- **Orientação:** não desenhada **[Não lido]**.

---

## 8. Acessibilidade (WCAG 2.2 AA)

### 8.1 Contraste (calculado por script, 19/11/2026)

| Par | Razão | Critério | Resultado |
|---|---|---|---|
| Branco sobre `#2C5258` (selo EM ANDAMENTO) | 8,55 | 1.4.3 | passa |
| Branco sobre `#3E6E4A` (selo ENTREGUE e aviso de sucesso) | 5,94 | 1.4.3 | passa |
| `#923631` sobre `#F6E7E5` (faixa de erro) | 6,26 | 1.4.3 | passa |
| `#B5453D` sobre `#F7F5F2` (erro de campo) | 4,97 | 1.4.3 | passa |
| `#6E6A66` sobre `#F7F5F2` | 4,93 | 1.4.3 | passa |
| `#6E6A66` sobre branco | 5,36 | 1.4.3 | passa |
| `#6E6A66` sobre `#F1F5F9` (placeholder em campo bloqueado) | 4,89 | 1.4.3 | passa |
| `#1E3A3F` sobre `#F1F5F9` | 11,07 | 1.4.3 | passa |
| `#8C8780` sobre branco (borda de campo) | 3,56 | 1.4.11 | passa |
| **`#E2DEDA` sobre branco (borda do campo Endereço no E1)** | **1,34** | 1.4.11 | **reprova** |
| `#1E3A3F` sobre branco (rótulo "Exemplo") | 12,12 | 1.4.3 | passa |
| `#33575D` sobre branco (ícone do veículo) | 7,89 | 1.4.11 | passa |
| Branco sobre `#B5453D` (botão primário) | 5,41 | 1.4.3 | passa |
| `#EE8279` sobre `#1E3A3F` (aba selecionada) | 4,68 | 1.4.3 | passa |

**Defeito no desenho (E1 `106:2300`):** a borda do campo Endereço está em `#E2DEDA` (1,34:1) em vez de `border/default` (`#8C8780`). Não corrigi o frame (é do F26, aguardando aprovação); o app usa `TextField`, que já aplica `#8C8780`. Registrar como divergência intencional do código em relação ao Figma.

Não depender só de cor: o erro traz ícone + texto (não só borda vermelha); o selo traz o texto do status; o sucesso traz texto.

### 8.2 Ordem de foco (teclado e leitor de tela)

Segue a ordem visual, de cima para baixo. Nas 39 telas do F26 a ordem numerada está na camada "Foco por controle" de cada frame; as 5 telas novas têm a ordem nas anotações `136:888–897`. Eu não reli selo por selo da camada de foco das 39 telas **[Não lido]**; a ordem abaixo vem do F26 §8 e da árvore.

| Tela | Ordem |
|---|---|
| Lista | usuário → busca → cartões (em ordem) → "Carregar mais" → "Novo cliente" → abas |
| Detalhe do cliente | voltar → editar → cartão de dados (um nó) → cartões de veículo → "+ Veículo" |
| Formulário | voltar → campos 1 a 5 → Cancelar (se houver) → Salvar |
| Detalhe do veículo | voltar → editar → cartão de dados → cartões de OS |
| Diálogo | "Continuar editando" (foco inicial) → "Descartar"; foco preso dentro; ao fechar, volta ao controle que abriu |
| Erro | foco inicial no título; depois "Tentar novamente" → "Voltar" |

### 8.3 Alvos, rótulos e anúncios

- **Alvo de toque:** mínimo 48 (`minTouchTarget`). Cartões de 66 e botões de 50 já cumprem; botão de cabeçalho de 36 ganha `hitSlop` até 48.
- **Campos:** o rótulo visível é o nome acessível; "(opcional)" faz parte dele; "*" é lido como "obrigatório" (`accessibilityLabel` "Nome completo, obrigatório"). Com erro, o rótulo traz a mensagem (`TextField` já faz: `"{rótulo}, {erro}"`). A ajuda do CPF é lida junto do campo (`accessibilityHint`).
- **Cartão de cliente:** `accessibilityRole="button"`, rótulo "Teodoro Lemos, (11) 90000-0001". Avatar, iniciais e seta ficam ocultos. Dica: "Abre os dados do cliente".
- **Cartão de veículo:** "RTK4M81, Honda Civic, 2018, Preto". Role `button`.
- **Selo:** lido junto do cartão da OS ("OS 207, em andamento, 455 reais"); a caixa alta é visual.
- **Botão de editar:** "Editar cliente" / "Editar veículo" (não "lápis"). Voltar: `cabecalho.voltar.rotulo`.
- **Título de seção:** `accessibilityRole="header"`.
- **Anúncios dinâmicos:**
  - Carregando: `progressbar` com "Carregando clientes…", região viva `polite` (já no `StateView`).
  - Erro de campo: `alert` + `polite` (já no `TextField`).
  - Faixa de erro do formulário: anunciada ao aparecer ("Corrija os 2 campos destacados para salvar."), e o foco vai ao primeiro campo inválido.
  - Salvando: anunciar "Salvando…"; botão com `busy`.
  - Sucesso: o aviso verde é região viva `polite`, some depois de ~5 s **e** pode ser dispensado; a mensagem não pode ser a única forma de confirmar (a tela de destino já mostra o dado).
  - Lista atualizada pela busca: anunciar "N clientes encontrados" ou "Nenhum resultado".
- **Teclado:** todos os controles alcançáveis; sem armadilha de foco; o diálogo prende o foco de propósito e libera ao fechar.
- **Movimento:** o indicador de carregamento é o nativo; nenhuma animação própria desenhada.
- **WCAG 2.2 novos critérios:** 2.4.11 (foco não encoberto: o botão Salvar não pode ficar sob o teclado nem sob a barra), 2.5.8 (alvo mínimo, atendido), 3.3.7 (entrada redundante: o app não pede o mesmo dado duas vezes; o formulário de veículo traz o cliente do contexto).

---

## 9. Dados e privacidade nas telas (LGPD)

- Telas só com dados fictícios: nomes de exemplo, telefones `(11) 90000-000x`, e-mails `@example.com`, CPF `123.456.789-00`/`***.*56.7**-**`.
- CPF e telefone fora de log, de rota e de armazenamento persistente; o ID é o único parâmetro de rota (ADR-029).
- Coleta mínima: só o nome é obrigatório no desenho; o aviso de privacidade (C1/C2) informa a finalidade e como corrigir ou apagar. Base legal e retenção por campo estão em `lgpd-registro-dados-pessoais.md`; não alterei.
- Texto de erro não repete o dado digitado (ex.: não ecoa o CPF).

---

## 10. Divergências e decisões pendentes

1. **Obrigatoriedade.** A API exige nome, CPF e telefone; o F26 só exige nome. Os formulários desenhados vão receber erro da API para CPF/telefone vazios. Decisão do PO/arquiteto: alinhar o desenho (marcar os três com "*") ou a API. Não alterei nada.
2. **Máscara do CPF (D-C).** O detalhe mostra `***.*56.7**-**`; a edição (E1) mostra o CPF inteiro. Confirmar se a edição deve exibir o CPF completo (E3 idem) ou mascarar e pedir redigitação.
3. **Histórico de OS** sem número, título e data na API. O desenho mostra os três. Decidir o que o cartão mostra.
4. **Selos de status.** Só 2 de 7 desenhados.
5. **Paginação (L8)** e **"Carregar mais"**: proposta; o F26 não previa.
6. **L3 "Cadastrar "Lauro"".** O botão leva ao formulário com o nome preenchido? Há também a US-19 sobre "limpar busca". Decisão aberta; recomendo oferecer os dois (Cadastrar como primário, "Limpar busca" como secundário).
7. **Ícone do vazio** da lista: código `document-text-outline` vs. Figma (duas pessoas).
8. **Nomes de camada desatualizados** na L1 (ex.: "Buscar por nome, telefone ou documento"): o texto visível está correto.
9. **Largura do aviso de sucesso:** L6 usa 332 em x = 15; D4, D5 e V5 usam 328 em x = 17. Seguir 328 / x = 17.
10. **Aprovação:** o F26 e as 5 telas novas aguardam aprovação (US-PROTO-CLV-07).
11. **Contagem de veículos no cartão da lista:** a anotação não pede e o contrato da lista não traz; não incluí.

---

## 11. Mapa das capturas de referência

44 arquivos em `docs/design/f35-capturas/` (tamanho de 51 a 110 KB; X1–X4 têm ~107 KB, acima de 100 KB). Os frames F26 foram exportados com a camada de foco oculta, depois restaurada (39/39 visíveis na mesma execução). Os 5 frames F35 não têm essa camada. Nome de arquivo = `figma-<f26|f35>-<ID>-<slug>-<nó com hífen>.png`; a coluna "Tela" da seção 1 traz o nó de cada ID. Servem de base para a conferência de paridade do ORLA e do CRIVO.

---

## 13. Leitura complementar de 20/11/2026 (somente leitura, nada no Figma foi alterado)

Fecha o que a seção 12 deixou aberto sobre foco e anotações. Lido por `use_figma` (só leitura) nos 39 frames F26 da seção `106:2097`, mais `get_metadata` de D1 `106:2159`, da folha de foco `113:2666` e de D6 `135:937`, e `get_variable_defs` de D1. Esta etapa seguiu a instrução do comandante: **não alterei o protótipo**. O título da seção no Figma continua "aguardando aprovação"; não há registro de aprovação no arquivo (**não verifiquei a aprovação por outra via**).

### 13.1 Aparência do foco **[Figma]** (folha `113:2666`)

| Controle | Foco |
|---|---|
| Botão primário e de contorno | anel de 2 px petro (`#1E3A3F`) por fora, com 2 px de respiro branco entre o botão e o anel (caixa externa 330 × 58 para botão de 322 × 50) |
| Cartão de cliente, de veículo | igual ao botão (caixa 330 × 74 para cartão de 322 × 66) |
| Campo de texto | borda de 2 px `primary` (`#B5453D`), **sem anel externo** |
| Botão do cabeçalho (voltar, editar, usuário) | anel branco de 2 px sobre o fundo petro, em volta do alvo de 44 × 44 |
| Aba da barra inferior | anel branco de 2 px |

Contrastes que o Figma registra (não medi de novo): anel petro sobre o fundo 11,14:1; respiro branco sobre o primário 5,41:1; anel branco sobre petro 12,12:1; borda primária do campo 4,97:1 sobre o fundo e 5,41:1 sobre branco. **[Código]** `tokens.ts` já tem `focusRingWidth = 2`, `focusRingOffset = 2` e `color.focus.*`; o ORLA só confere que os valores batem com esta tabela.

### 13.2 Ordem de foco e leitura por frame **[Figma]** (anotação abaixo de cada frame)

Número entre parênteses = quantidade de selos de foco na camada do frame. Controles que **não** recebem foco de teclado, mas são lidos pelo leitor de tela: cartão de dados do cliente e do veículo e cartões de OS.

| Frame | Ordem de foco (Figma) | Leitor de tela (texto do Figma) |
|---|---|---|
| L1, L7 (12) | Perfil → Busca → cartões → Novo cliente → abas | Cartão: "Teodoro Lemos, (11) 90000-0001, botão". Busca: "Buscar por nome, telefone ou e-mail, campo de busca". L7: sem telefone lê o e-mail; sem nenhum, "Iara Montenegro, sem contato cadastrado, botão". |
| L2 (7) | Perfil → Busca → Novo cliente → abas | Ao entrar: "Nenhum cliente cadastrado. Cadastre o primeiro cliente para abrir ordens de serviço." |
| L3 (7) | Perfil → Busca → Cadastrar "Lauro" → abas | "Nenhum resultado. Nenhum cliente encontrado para Lauro." como status, sem tirar o foco da busca. |
| L4 (1) | foco fica na busca; nada mais é focável | "Carregando clientes" (polida); ao terminar, "5 clientes". |
| L5 (8) | Perfil → Busca → Tentar novamente → Voltar → abas | Alerta: "Não foi possível carregar. Verifique a internet da oficina e tente de novo." "Voltar" leva ao Perfil (tela de pouso, F33). |
| L6 (11) | Perfil → Busca → cartões → abas | Status: "Cliente Otávio Neves cadastrado". Não move o foco. |
| D1 (5), D4 (5), D5 (5) | Voltar → Editar → veículos → + Veículo | Voltar: "Voltar para clientes". Editar: "Editar cliente Teodoro Lemos". **CPF lido como "CPF parcialmente oculto"** (resolve o rótulo acessível da D-C: não soletra asteriscos). Veículo: "RTK4M81, Honda Civic, 2018, botão". |
| D2, V3 (1) | Voltar é o único focável | "Carregando cliente" / "Carregando veículo" (polida). |
| D3, V4 (3) | Voltar → Tentar novamente → Voltar (botão) | Alerta: "Não foi possível abrir este cliente/veículo. Verifique a internet da oficina e tente de novo." |
| V1, V5, V2 (2) | Voltar → Editar veículo | Item de OS: "OS 142, troca de pastilhas, em andamento, exemplo". Itens não abrem a OS (F28). V2: "Histórico de OS, nenhuma. Nenhuma OS neste veículo." |
| C1 (6) | Voltar → Nome → Telefone → E-mail → CPF → Endereço → Salvar cliente | Nome: "Nome completo, obrigatório, campo de texto"; demais "…, opcional". Ajuda do CPF lida junto. O aviso de privacidade é lido antes do Salvar. |
| E1 (8) | Voltar → campos 1 a 5 → Cancelar → Salvar alterações | Campos lidos com o valor atual. Voltar/Cancelar com alteração abrem X2; sem alteração saem direto. |
| N1 (7), M1 (8) | Voltar → Placa → Marca → Modelo → Ano → Cor → (Cancelar) → Salvar | "Cliente: Teodoro Lemos" é lido antes do formulário. Placa, Marca e Modelo "obrigatório"; Ano e Cor "opcional". |
| C3, N3 | foco vai ao primeiro campo com erro | Alerta "Corrija os 2 (C3) / 3 (N3) campos destacados"; depois "Nome completo, obrigatório, erro: Informe o nome do cliente." |
| C4, C5, C7, N4 | foco vai ao campo com erro (CPF, CPF, E-mail, Placa) | "CPF, erro: CPF inválido. Confira os 11 números." / "…Já existe um cliente com este CPF." / "E-mail, erro: Informe um e-mail válido." / "Placa, erro: Esta placa já está cadastrada." A mensagem de duplicidade não revela de quem é o dado. |
| C6, E3, N5, M3 | foco vai ao aviso e depois ao Salvar | Alerta: "Não foi possível salvar. Verifique a internet da oficina e tente de novo." Dados mantidos. |
| C2, E2, N2, M2 (1) | campos e botões bloqueados; foco fica em Salvar | "Salvando cliente / alterações / veículo" (aria-busy); botão lido como "Salvando, indisponível". |
| X1 a X4 (2) | "Continuar editando" (inicial) → "Descartar"; foco preso; Esc ou voltar do sistema = Continuar editando | "Descartar alterações? O que você digitou neste formulário será perdido. Continuar editando, botão. Descartar, botão." Descartar volta: X1 à lista (L1); X2, X3 ao detalhe do cliente (D1); X4 ao detalhe do veículo (V1). |

**Ajustes na seção 8.2 e 8.3, que a leitura corrige:** (a) o cartão de dados não entra na ordem de foco de teclado, só na leitura; (b) os cartões de OS não são focáveis; (c) o rótulo de Editar é "Editar cliente {nome}" e o de Voltar no detalhe do cliente é "Voltar para clientes" (no detalhe do veículo o Voltar leva ao cliente, mas o Figma não traz esse texto: **[Proposta]** "Voltar para o cliente"); (d) o aviso de sucesso no protótipo some em 3 s, o app mantém no mínimo 5 s ou até dispensar (anotação do próprio Figma).

### 13.3 Ícones **[Figma]**

Os ícones são instâncias anônimas do componente "Component 1", com variantes numeradas (`variant=17`, `24`, `47`, `50` a `53`, `64` a `66`). **Nenhum traz nome do ícone**, então a tabela da seção 5 segue como inferência por captura. Variantes lidas: busca/setas e ícone de veículo 20 × 20 (`variant=50`, `52`), seta do cartão 18 × 18 (`51`, `53`), "+" do botão Novo cliente 18 × 18 (`17`), ícones de estado 32 × 32 (`24` no vazio, `5` no erro) e o ícone do aviso de sucesso 18 × 18 (`variant=47`, no D4 `109:2874`). Continua sem nome definitivo: ORLA confirma cada um contra as capturas.

### 13.4 Variáveis do Figma em D1 **[Figma]**

`get_variable_defs` confirma: `color/cyan/18` `#1E3A3F`, `color/cyan/28` `#33575D`, `color/grey/42` `#6E6A66`, `color/orange/87` `#E2DEDA`, `color/border/default` `#8C8780`, `color/red/47` `#B5453D`, `color/grey/96` `#F7F5F2`, `color/white/solid`; raios 8, 10, 20; espaçamentos 12, 14 e 3; fontes Barlow Condensed SemiBold (22 e 15 com espaçamento de letra 0,9) e Inter Regular, Medium e SemiBold (13, 14, 15). Bate com a seção 2. Nenhuma variável para `#3E6E4A` e `#2C5258` (seguem soltas).

---

## 12. O que não consegui ler ou verificar

- **Nomes dos ícones** do Figma: a camada traz só variantes numeradas (seção 13.3); inferidos por screenshot.
- **Ordem de foco** de cada selo: **lida em 20/11/2026** (seção 13.2); as 5 telas propostas (D6, D7, D8, V6, L8) não têm camada de foco, só anotações.
- **Leitor de tela real** (VoiceOver/TalkBack): nenhum teste feito; os anúncios acima são especificação.
- **Link do Figma** com acesso restrito: não testei abertura por outra conta.
- **Variáveis do Figma** para `#3E6E4A` e `#2C5258`: não existem; os frames usam a cor solta.
- **Telas em 768 e 1280, paisagem e fonte ampliada:** não existem no Figma.
- **Selos dos demais status de OS**: não desenhados.
- **Interações do protótipo** (setas de fluxo): li a estrutura e os textos; não executei o protótipo.
