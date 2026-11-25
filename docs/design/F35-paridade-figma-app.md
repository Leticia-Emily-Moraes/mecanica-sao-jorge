# F35 · Conferência de paridade: Figma F26 × telas do app (ESQUADRO, 2026-11-20)

Etapa 1 de 3 (ESQUADRO > ORLA > CRIVO). Instrução do comandante: exportar as capturas dos 7 frames nos quatro estados e apontar cada divergência de estrutura, texto, token ou ícone contra a tela do app, **sem alterar o protótipo aprovado**. Nada foi alterado no Figma nem no código do app.

## 0. Limite desta conferência (leia primeiro)

- **Não há captura do app rodando.** Não havia simulador nem aparelho disponível. A comparação é **estática**: valores do Figma lidos por `use_figma` somente leitura (arquivo `FPdB8RymAnN81pbKfizdzE`, seção F26 `106:2097`, sessão `39ddc523-a287-41b4-904f-e77dccf0a1f8`) contra o código em `apps/mobile` (telas, componentes, `tokens.ts`, `strings.ts`). O que depende de renderização (quebra de linha, fonte real no Android, sombra, foco) está marcado **[a conferir no aparelho]**.
- **Capturas do Figma:** os 44 PNGs de referência já estavam em `docs/design/f35-capturas/` (exportados em 19/11, commit `dea962b`). Conferi só que os 44 arquivos existem (Glob); **não reexportei** nem reabri um por um nesta rodada. A tabela da seção 1 liga cada tela e estado ao PNG.
- O F26 e os frames D6, D7, D8, V6, L8 seguem **sem aprovação registrada** no arquivo. Os frames propostos não têm camada de foco.
- Ícones: o Figma não traz o nome do ícone (instâncias `Component 1` com variantes numeradas). Toda comparação de ícone é por captura, não por nome.

## 1. Cobertura: 7 telas × 4 estados

Estados: vazio · carregando · erro · preenchido. Nos formulários, "carregando" é "salvando" e "preenchido" é o formulário com dados (só a edição o desenha).

| Tela | Vazio | Carregando | Erro | Preenchido |
|---|---|---|---|---|
| Lista de clientes | L2 `106:2112`, L3 `106:2128` | L4 `109:2402` | L5 `109:2453` | L1 `106:2098`, L6, L7, L8 |
| Detalhe do cliente | D6 `135:937` (proposto) | D2 `109:2507` | D3 `109:2574`, D8 (proposto) | D1 `106:2159`, D4, D5, D7 (proposto) |
| Criar cliente | C1 `106:2277` | C2 `110:2535` | C3 a C7 | **sem frame** |
| Editar cliente | **sem frame** | E2 `110:2718` | E3 `110:2762` | E1 `106:2300` |
| Detalhe do veículo | V2 `109:3030` (histórico vazio) | V3 `109:2651` | V4 `109:2723`, V6 (proposto) | V1 `106:2214`, V5 |
| Criar veículo | N1 `106:2334` | N2 `111:2589` | N3 a N5 | **sem frame** |
| Editar veículo | **sem frame** | M2 `111:2729` | M3 `111:2775` | M1 `106:2368` |

Lacunas de desenho: "preenchido" em criar (cliente e veículo) e "vazio" em editar (cliente e veículo) não existem. Para o formulário, o estado "vazio" de criar (C1, N1) é o equivalente.

## 2. Divergências

Severidade: **Alta** = o usuário vê texto, fluxo ou estrutura diferente do desenho aprovado; **Média** = diferença visível de medida, posição ou leitura; **Baixa** = detalhe fino. "Quem" = quem age. O Figma só muda com aprovação.

### 2.1 Texto

| ID | Tela / estado | Figma | App | Sev. | Quem |
|---|---|---|---|---|---|
| P-01 | Lista, vazio de busca (L3) | Botão `Cadastrar "Lauro"` | Botão "Novo cliente" (`clientes.lista.novo`, `clientes/index.tsx:122`). A chave `clientes.lista.semResultado.cadastrar` não existe | Alta | ORLA, depois da decisão: o botão leva ao formulário com o nome preenchido? (pendência 6 da especificação) |
| P-02 | Lista, sucesso (L6) | Aviso na lista: `Cliente "Otávio Neves" cadastrado.` | Após criar, `router.replace` para o detalhe com "Cliente cadastrado." (`clientes/novo.tsx:21`, `clientes.detalhe.sucesso.criado`). A lista não renderiza aviso e a chave `clientes.lista.sucesso.criado` não existe | Alta | Decisão (PO/comandante): o desenho manda voltar à lista; o app vai ao detalhe. Depois, ORLA ou ESQUADRO (desenho) |
| P-03 | Detalhe do cliente, cartão de veículo (D1, D5, D6) | Título `RTK4M81 · Honda Civic`, subtítulo `2018 · Preto`; leitor: "RTK4M81, Honda Civic, 2018" | Título "RTK4M81", subtítulo "Honda Civic"; leitor: "RTK4M81, Honda Civic". `VeiculoResumo` só traz `id, placa, marca, modelo` (`vehicles-types.ts:4`) | Alta | Dependência de API: sem ano e cor no contrato a paridade não fecha. BUSSOLA/ESPRESSO decidem; senão o desenho muda |
| P-04 | Detalhe do veículo, histórico (V1) | `OS #0207 · Troca de pastilhas`, `09/11/2026 · R$ 455,00`, rótulo "Exemplo" e selo | `OS #{id}`, valor e selo. Sem título, sem data, sem "Exemplo" | Alta (esperada) | O rótulo "Exemplo" é do protótipo e não vai ao app. Título e data dependem da API (`HistoricoOsItem` = `id, status, valorTotal`) e da decisão do PO |
| P-05 | Detalhe do cliente, CPF (D1, D4, D5) | Leitor: "CPF parcialmente oculto" | "CPF: parcialmente oculto, dígitos visíveis: {dígitos}" (`clientes.detalhe.cpf.valorAcessivel` + `InfoCard`) | Média | ORLA alinha ao Figma (critério 29). Ler os dígitos visíveis não está no desenho |

Textos conferidos e **iguais** ao Figma (chaves `clientes.*`, `veiculos.*`, `comum.*`): títulos, buscas, vazios, erros, "Tentar novamente", "Voltar", rótulos e placeholders dos formulários, "Salvar cliente", "Salvar alterações", "Salvando…", faixas singular e plural, diálogo de descarte, "Veículos ({n})", "Histórico de OS ({n})", "Não informado". Mensagens longas (`clientes.detalhe.erro.mensagem`, `clientes.formulario.erro.envio`, `.conflito`, `.privacidade`, `veiculos.detalhe.*.mensagem`) tiveram a leitura truncada no grep: **[não comparadas palavra por palavra]**.

### 2.2 Estrutura e posição

| ID | Tela / estado | Figma | App | Sev. | Quem |
|---|---|---|---|---|---|
| P-06 | Aviso de sucesso (L6, D4, D5, V5) | Faixa 328 × 44 **ancorada na base**, a 17 do fim (D4 `109:2809`: x 17, y 681) | `InlineNotice` é o primeiro item do `ScrollView`: fica no topo e rola com o conteúdo (`clientes/[clienteId]/index.tsx:105`, `veiculos/[veiculoId]/index.tsx:89`) | Média | ORLA, ou aprovar o topo no desenho. Se ancorar embaixo, não pode cobrir "+ Veículo" nem o último cartão (WCAG 2.4.11) |
| P-07 | Lista, vazio e erro (L2, L5) | Botões de **288** de largura (x 37 de 362); ilustração, texto e botões formam **um grupo centralizado** na área (L5: ícone y 251, "Voltar" termina y 543, área 131 a 663) | Vazio: botão até 320 (`layout.dialogMaxWidth`). Erro: botões até 328 (`stateActionsMaxWidth`) **ancorados na base** (`error-state.tsx`) | Média | Os dois desenhos aprovados divergem: P2 (F33) usa 328 e base; o F26 usa 288 e grupo centralizado. Decisão antes de mexer. Depois ORLA |
| P-08 | Lista, botão "Novo cliente" (L1) | Ícone "+" de 18 × 18 antes do texto | `Button` não tem ícone: só o texto | Média | ORLA (prop de ícone no `Button`), ou aprovar sem ícone |
| P-09 | Cartões de lista (L1, D1) e de OS (V1) | Sem sombra (`effects` vazio em `106:2102`, `106:2186`, `106:2250`) | `ListRow` e `OsCard` aplicam `shadow.card` | Baixa | ORLA: remover a sombra desses dois |
| P-10 | Cartão de dados (D1, V1) | Sombra 0 / 1 / 2, α 0,06 (`106:2162`) | `shadow.card` com raio 1; o comentário de `tokens.ts` diz "0 1 1" | Baixa | ORLA: raio 2 no `InfoCard`. O comentário também está desatualizado |
| P-11 | Selos de status (V1) | Só EM ANDAMENTO e ENTREGUE | Os outros cinco status viram selo neutro (fundo branco, borda `#8C8780`, texto petro), sem desenho | Média | ESQUADRO desenha após a aprovação do F26; ORLA aplica |
| P-12 | Formulários, leitura inicial | Sem frame para "carregando o cliente" (`clientes.formulario.carregando`), nem para o carregando, o erro e o não encontrado do veículo no formulário | Existem e reaproveitam `StateView` e `NotFoundState` | Média | ESQUADRO desenha (sem alterar o F26 aprovado: em quadro novo, com aprovação) |
| P-13 | Aviso de falha ao atualizar (lista, detalhes) | Sem frame (`InlineAlert`: `clientes.lista.falhaAtualizar`, `clientes.detalhe.falhaAtualizar`, `veiculos.detalhe.falhaAtualizar`) | Existe | Baixa | ESQUADRO desenha |

### 2.3 Token

| ID | Item | Figma | App | Sev. | Quem |
|---|---|---|---|---|---|
| P-14 | Borda do campo Endereço no E1 | `#E2DEDA` (1,34:1, reprova 1.4.11) | `#8C8780` (`color.border.default`, 3,56:1) | Média | **Divergência intencional do app.** O Figma só se corrige com aprovação |
| P-15 | `#3E6E4A` (aviso de sucesso, ENTREGUE) e `#2C5258` (EM ANDAMENTO) | Cor solta, sem variável | `color.feedback.success`, `color.status.inProgress` | Baixa | ESQUADRO cria as variáveis após a aprovação |
| P-16 | Botão do cabeçalho | 36 × 36 (alvo transparente de 44) | 48 de alvo (`minTouchTarget`), 36 visível | Baixa | **Divergência intencional** (alvo AA), já registrada na especificação |

Tokens conferidos e iguais: `#1E3A3F`, `#B5453D`, `#F7F5F2`, `#6E6A66`, `#E2DEDA` (divisor), `#33575D`, `#8C8780`; tipografia dos cartões (Inter SemiBold 15 e Regular 13, Barlow 22 no nome, Inter 14 nas linhas), medidas do cartão de lista (66, avatar 40, gap 12), do campo (46) e do botão (50).

### 2.4 Ícone

Todos **[não confirmados]**, só inferidos por captura (seção 13.3 da especificação). O que o app usa: `people-outline` (lista vazia), `search-outline` (busca sem resultado e 404), `cloud-offline-outline` (erro), `chevron-forward` (cartão), `create-outline` (editar), `checkmark-circle-outline` (aviso de sucesso). A comparação visual com o PNG do Figma fica para o aparelho. Sem divergência de ícone **comprovada**; a única comprovada é o "+" do P-08.

## 3. Para conferir no aparelho (não feito)

- Critérios 14, 18, 23, 24 e 26 (exigem aparelho).
- Quebra de linha e altura do cartão de lista com fonte ampliada.
- Campo "Cliente:" do formulário de veículo: `vehicle-form-fields.tsx` usa `fontWeight: '600'` sobre a família regular. Com fontes do `expo-font`, o peso pode não aplicar no Android. **[hipótese, não verificada]**
- Leitura do VoiceOver e do TalkBack (rótulos e anúncios).
- Sombra no Android (`elevation` só aproxima).

## 4. Decisões que não são minhas

1. P-01 e P-02: destino e texto do cadastro e da busca sem resultado.
2. P-03 e P-04: o que o contrato de API entrega (ano e cor no veículo, título e data na OS).
3. P-07: qual medida vale nos estados de tela (P2 ou F26).
4. Aprovação do F26 e dos frames D6, D7, D8, V6, L8; mensagens de campo obrigatório (F-1, F-2); lint em `use-menu-tabs.ts` (F-5).

## 5. Resolução no código (ORLA, 2026-11-20)

Verificação: testes de Jest (react-native-testing-library) por arquivo alterado. Nada foi visto em simulador ou aparelho; as sombras e o ícone "+" **não foram comparados com o Figma renderizado**, só com os valores lidos na seção 2.

| ID | Situação | O que mudou |
|---|---|---|
| P-05 | Corrigido | O leitor de tela lê "CPF parcialmente oculto" (`InfoRow.accessibilityLabel`, chave `clientes.detalhe.cpf.rotuloAcessivel`). Removidos `digitosVisiveisDoCpf` e `accessibleValue`, que ficaram sem uso |
| P-08 | Corrigido na lista (L1) | `Button` ganhou a prop `icon` (decorativa, escondida do leitor). "Novo cliente" da lista preenchida usa `add`. Os botões "Novo cliente" dos estados vazio e de busca sem resultado não levam ícone: o ESQUADRO só mediu o L1 |
| P-09 | Corrigido | `ListRow` e o cartão de OS não têm mais sombra |
| P-10 | Corrigido | Token `shadow.detail` (raio 2) e `InfoCard elevation="detail"` nos detalhes de cliente e veículo. O Perfil segue em `shadow.card` (raio 1, V-P06) |
| P-01 | Implementado, decisão do PO é recomendação | A busca sem resultado mostra `Cadastrar "termo"` e leva o termo ao formulário, preenchido e editável. Termo com "@" ou só dígitos e pontuação de telefone mantém "Novo cliente" e formulário vazio. O termo passa por variável em memória (`navigation/new-client-name.ts`), nunca por rota ou log, cortado em 100 caracteres. O nome sugerido não conta como alteração para o diálogo de descarte |
| P-02 | **Sem mudança, aguarda aprovação escrita** | BUSSOLA recomenda manter o app: criar leva ao detalhe com "Cliente cadastrado." (critério 7). Contraria o L6 aprovado: o dono do Figma e o comandante precisam aprovar e o ESQUADRO ajusta o L6 |
| P-06 | **Sem mudança, aguarda aprovação escrita** | BUSSOLA recomenda aviso no topo do scroll (risco de cobrir "+ Veículo" na base, WCAG 2.4.11) |
| P-07 | **Sem mudança, aguarda aprovação escrita** | BUSSOLA recomenda a medida do P2 (328, base). Precisa de aprovação do dono do Figma e de conferir qual documento é mais recente |
| P-03, P-04 | **Fora do front** | Ano, cor, título e data da OS dependem do contrato da API. BUSSOLA recomenda aceitar a divergência até o contrato existir. Mínimo do histórico para o critério 12 (recomendação): número de exibição, status em selo com texto e `valorTotal`; data só quando a API trouxer |
| P-11 a P-13 | Sem mudança | Desenho que falta é do ESQUADRO, depois da aprovação do F26 |
| P-14, P-16 | Sem mudança | Intencionais |

Critério 1 (revisão humana): BUSSOLA recomenda **ajustar o critério**: a lista mostra o nome e **uma** linha de contato (telefone; sem telefone, e-mail; sem nenhum, "Sem contato cadastrado"), como no L1/L7 aprovado e com menos dado pessoal na lista. O e-mail segue na busca e no detalhe. O teste que só caracterizava o comportamento virou asserção (`client-row.test.tsx`: com telefone e e-mail, o e-mail não aparece). Falta a confirmação escrita de quem pediu a revisão.
