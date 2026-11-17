# F26 — Protótipo de alta fidelidade de Clientes e Veículos (Figma)

- Autor: ESQUADRO (etapa 1 de 2 da rota: ESQUADRO → CRIVO)
- Data: 2026-11-17
- Feature: F26, Sprint 02, critérios US-PROTO-CLV-01 a 14
- Estado: **entregue ao Figma, AGUARDANDO APROVAÇÃO. Não aprovado e não aprovável ainda** (seção 1)

## 1. Bloqueio de aprovação: a F39 não está aprovada

A premissa 10 e o critério US-PROTO-CLV-07 da F26 dizem que a feature só inicia depois que o wireframe redesenhado da F39 estiver aprovado, e que esse wireframe é a base de cada frame.

O que verifiquei no repositório (leitura de `docs/design/F39-redesenho-wireframes-navegacao.md` e do PRD em `docs/product/F39-redesenho-wireframes-navegacao-figma.md`, e do ramo `docs/f39-wireframe-redesenho`):

- O PRD da F39 não tem nenhuma linha "Aprovado" (registro de execução vazio).
- O documento do ESQUADRO da F39 continua com estado "BLOQUEADO — nenhuma tela foi redesenhada".
- O PRD v3 registra "nenhum frame consta como editado" e deixa D9 a D14 abertas.

O comandante pediu para montar as 7 telas "a partir do wireframe da F39". Como esse wireframe aprovado não existe, **usei como base as telas de Clientes e Veículos da referência `FPdB8RymAnN81pbKfizdzE`** (a inspiração visual que o briefing já fixa para baixa e alta fidelidade): wireframes `1b`, `1c`, `1d`, `1e`, `1f`, `2f`, `2i`, `2j` da página `20:2131` e os frames de alta fidelidade `1d` a `1p` da página `20:2132` (seção 4). Isso é uma **suposição minha**, não uma decisão da pessoa.

Consequências, todas abertas:

- US-PROTO-CLV-05 (aprovação) e US-PROTO-CLV-07 (base aprovada) **não estão cumpridos**. O front do módulo (F35) **não deve começar**.
- Se a F39 mudar a estrutura de alguma dessas telas, os frames da F26 precisam ser refeitos.
- Decisão que cabe à pessoa: aceitar os frames da referência como base (e então aprovar a F26) ou esperar a F39.

## 2. Acesso ao Figma (pré-condição da regra de edição do ADR-014)

Saída real de `whoami` desta sessão (e-mail omitido de propósito):

```
{"whoami":{"user_id":"1126488233271433922","handle":"Leticia Moraes","plans":[{"name":"Time Pessoal","seat":"Full","tier":"student","key":"team::1274094162661077353","role":"admin","specs_enabled":true,"code_layers_enabled":true}]}}
```

- `create_session` no arquivo `FPdB8RymAnN81pbKfizdzE` devolveu a sessão `a0522956-7327-4d02-8be2-261f09336518`.
- `get_metadata`, `get_screenshot` e `use_figma` funcionaram sem erro de permissão.
- A instrução `figma-use` **não pôde ser carregada** (não há `get_figma_skill` nem leitura de recurso nesta sessão). Compensei com passos pequenos: leitura antes, escrita, `get_screenshot` depois.
- `download_assets` não foi usado. As capturas foram baixadas pela URL de `get_screenshot`.

## 3. Onde está o trabalho e por que neste arquivo

- Arquivo: `FPdB8RymAnN81pbKfizdzE` (o arquivo informado no briefing).
- Página `20:2132` "02 — Alta fidelidade".
- **Seção nova `106:2097`** "F26 — Clientes e Veículos — protótipo de alta fidelidade (aguardando aprovação)", em x 9900, y 0 (2772 × 7872). Foi criada ao lado das seções existentes. **Nenhum nó existente foi alterado.** Os frames são clones; os originais continuam como estavam.
- Ponto de partida do fluxo: `L4` (`109:2402`), com o nome "F26 — Clientes e Veículos". É o único ponto de partida da página (lido de volta no fim).

Por que não criei arquivo novo na pasta `681115069`: o briefing manda continuar no arquivo já registrado quando houver um, e a referência `FPdB8…` é onde vivem as variáveis `OP-002 Identidade v2`, os componentes (cabeçalho, busca, cartão, navegação inferior) e o ícone/indicador da F41. Um arquivo novo perderia tudo isso. O arquivo histórico `DLqbSzzKRxiN2eyvXG73Lr` está com a identidade v1 e a regra da F41 diz que ele não é mais editado. Responde à dúvida 2 da feature: **mesmo arquivo da referência, seção nova**. Fica registrado como decisão para a pessoa confirmar.

Observação sobre o ponto de partida: ao gravar as reações, o Figma criou sozinho um ponto "Flow 1" apontando para o L1 (`106:2098`, nó meu). Removi esse e deixei só o L4. A página não tinha nenhum outro ponto de partida (não li a lista antes de criar as reações, então **não consigo provar** que não havia outro; o que li depois da criação só tinha o "Flow 1" automático e o meu).

## 4. Base lida na referência (ids lidos por `get_metadata` em 2026-11-17)

Alta fidelidade, página `20:2132`, seção `20:1067` "Clientes e Veículos":

| Frame da referência | Nó (tela) | Usado como base de |
|---|---|---|
| 1d Lista de Clientes | `10:1052` | L1, L4 (via L2) |
| 1e Lista de Clientes — vazia | `10:1157` | L2, L4, L5 |
| 1f Busca sem resultado | `10:1214` | L3 |
| 1g Cliente criado, toast | `10:1269` | L6 (e o aviso de sucesso) |
| 1h Detalhe do Cliente | `10:1373` | D1 a D5 |
| 1i Novo Cliente | `10:1455` | C1, C2, C4, C5, C6 |
| 1j Editar Cliente | `10:1494` | E1, E2, E3 |
| 1k Novo Cliente — validação | `10:1535` | C3 |
| 1m Detalhe do Veículo | `10:1651` | V1 a V5 |
| 1n Novo Veículo | `10:1732` | N1, N2, N4, N5 |
| 1o Editar Veículo | `10:1778` | M1, M2, M3 |
| 1p Novo Veículo — validação | `10:1826` | N3 |
| 1l Excluir Cliente — confirmação | `10:1587` | **não usado** (exclusão está fora do escopo) |

Estados do indicador e do erro reaproveitados da F41: `83:752` e `83:753` (carregando), `83:763` a `83:769` (círculo, ícone `83:764`, título e mensagem de erro), `83:815` (botão secundário), `82:2137` (indicador do botão "Salvando…").

Wireframes de baixa fidelidade equivalentes na página `20:2131`: `1:912` (1b), `1:970` (1c), `1:1020` (1d), `1:1053` (1e), `1:1096` (1f), `1:329` (2f), `1:452` (2i), `1:491` (2j).

Variáveis usadas (coleção `html.to.design` `1:2` e `OP-002 Identidade v2` `89:712`):

| Papel | Variável | Valor |
|---|---|---|
| petro | `color/cyan/18` `1:13` | `#1E3A3F` |
| primary | `color/red/47` `1:29` | `#B5453D` |
| fundo da tela | `color/grey/96` `1:25` | `#F7F5F2` |
| branco | `color/white/solid` `1:4` | `#FFFFFF` |
| texto secundário | `color/grey/42` `1:41` | `#6E6A66` |
| borda de cartão | `color/orange/87` `1:50` | `#E2DEDA` |
| placeholder (AA) | `color/text/placeholder` `89:716` | `#6E6A66` |
| borda de campo (AA) | `color/border/default` `89:717` | `#8C8780` |
| fundo bloqueado | `color/surface/skeleton` `98:713` | `#F1F5F9` |

## 5. Os 33 frames e a folha de foco

Todos 362 × 742, clonados e ajustados. Nome no Figma: `F26-<código> <título>`. Acima de cada frame há o rótulo `<código> · <título>` e abaixo a anotação de acessibilidade (ordem de foco, leitor de tela, alvo de toque).

| Linha | Código | Estado | Nó |
|---|---|---|---|
| Clientes · lista | L1 | preenchido | `106:2098` |
| | L2 | vazio (sem cadastros) | `106:2112` |
| | L3 | vazio de busca | `106:2128` |
| | L4 | carregando | `109:2402` |
| | L5 | erro ao carregar | `109:2453` |
| | L6 | sucesso (cliente cadastrado) | `106:2146` |
| Clientes · detalhe | D1 | preenchido | `106:2159` |
| | D2 | carregando | `109:2507` |
| | D3 | erro ao carregar | `109:2574` |
| | D4 | sucesso (alterações salvas) | `109:2809` |
| | D5 | sucesso (veículo cadastrado) | `109:2877` |
| Veículos · detalhe | V1 | preenchido, histórico de OS | `106:2214` |
| | V2 | histórico de OS vazio | `109:3030` |
| | V3 | carregando | `109:2651` |
| | V4 | erro ao carregar | `109:2723` |
| | V5 | sucesso (alterações salvas) | `109:2959` |
| Clientes · criar | C1 | vazio | `106:2277` |
| | C2 | salvando | `110:2535` |
| | C3 | erro: campo obrigatório vazio (+ telefone incompleto) | `106:2409` |
| | C4 | erro: CPF inválido | `110:2576` |
| | C5 | erro: CPF já cadastrado | `110:2625` |
| | C6 | erro: falha de envio | `110:2674` |
| Clientes · editar | E1 | preenchido | `106:2300` |
| | E2 | salvando | `110:2718` |
| | E3 | erro: falha de envio | `110:2762` |
| Veículos · criar | N1 | vazio | `106:2334` |
| | N2 | salvando | `111:2589` |
| | N3 | erro: obrigatório e placa inválida | `106:2440` |
| | N4 | erro: placa já cadastrada | `111:2632` |
| | N5 | erro: falha de envio | `111:2683` |
| Veículos · editar | M1 | preenchido | `106:2368` |
| | M2 | salvando | `111:2729` |
| | M3 | erro: falha de envio | `111:2775` |
| Folha de foco | F | estados de foco por tipo de controle | `113:2666` |

Os sucessos (L6, D4, D5, V5) existem porque a regra da casa pede os quatro estados com "sucesso"; a lista de estados da F26 não os cita, então são **acréscimo meu**, fácil de remover.

## 6. Decisões de design e divergências em relação à referência

Cada linha é uma escolha minha que a pessoa pode reverter.

1. **Telefone, e-mail, CPF e endereço são opcionais; só o nome é obrigatório.** Motivo: `docs/security/politica-dados-pessoais-cliente.md` (VIGIA, vigente) diz que telefone é opcional e que CPF e endereço só se coletam quando a nota fiscal exigir; a V2 tem `telefone` e `email` com `NULL`. A referência marcava o telefone como obrigatório (`Telefone *`). Isso contradiz a política, então segui a política. **Confirmar com a pessoa e BUSSOLA.**
2. **Campo de e-mail acrescentado** (a referência não tinha). Motivo: a coluna existe na V2 e a F26 pede que o protótipo defina "CPF, telefone, email, endereço".
3. **Rótulo "CPF" em vez de "CPF / CNPJ".** A F26 e a política falam só de CPF. Se a oficina atende empresas, falta decidir CNPJ (dúvida nova abaixo).
4. **Ajuda do CPF:** "Só preencha se o cliente pedir nota fiscal." (a referência dizia "Usado em recibos e notas."), alinhada à regra de não coletar "por garantia".
5. **CPF mascarado no detalhe:** `***.*56.7**-**`, mesma máscara da seção 6.2 da política. Adota a sugestão da dúvida 3 da feature, **ainda sem decisão da pessoa**. No formulário de edição o CPF aparece inteiro, porque é preciso editá-lo. Na lista o CPF não aparece, como manda a política.
6. **Cartão da lista mostra só o telefone**, sem "N veículos". Motivo: o `ClienteListResponse` real (ADR-017) traz id, nome, telefone e e-mail, sem contagem de veículos. Mostrar a contagem exigiria mudar o contrato.
7. **Busca:** placeholder "Buscar por nome, telefone ou e-mail" (a referência dizia "ou documento"). O ADR-017 busca por nome, e-mail e telefone; CPF fica fora.
8. **Removi "+ Nova OS" (detalhe do cliente) e "+ Nova OS para este veículo" (detalhe do veículo).** Motivo: leva a uma tela de OS que só existe na F28; deixar o botão sem destino seria beco sem saída (US-PROTO-CLV-03). Volta quando a F28 desenhar a criação de OS.
9. **Removi "Excluir cliente" e o diálogo `1l`.** Exclusão está fora do escopo da F26.
10. **Mensagens de erro de duplicidade não revelam outro cliente.** A referência dizia "Esta placa já está cadastrada para Fernanda Souza." Troquei por "Esta placa já está cadastrada." e "Já existe um cliente com este CPF." Motivo: a mensagem exibiria dado pessoal de outra pessoa (política, seções 2 e 6).
11. **Histórico de OS:** cada item ganhou um rótulo visível "Exemplo" (contorno petro, texto petro) e não tem reação, então não abre a OS (US-PROTO-CLV-09).
12. **Datas e valores do histórico** (`12/11/2026 · R$ 380,00` etc.) vêm da referência. São fictícios, mas **não confirmei que a referência os tenha tirado de dado real**.
13. **Erro de formulário** tem ícone, texto junto ao campo e o rótulo continua visível. Quando há erro, um aviso-resumo "Corrija o campo destacado para salvar." fica acima do botão (padrão do `1k`). O N3 ganhou esse aviso (o `1p` não tinha).
14. **Botões do cabeçalho de 36 pt ganharam alvo de toque de 44 × 44 pt** (frame transparente `Alvo de toque 44×44 — Voltar/Editar/Perfil`, posicionado por cima). O visual de 36 pt continua igual ao da referência.
15. **Ações de salvar "Salvando…"** usam o botão detachado com o indicador de 16 pt da F41 (`82:2137`) e os campos com fundo `color/surface/skeleton` (mesmo tratamento do L2 de Login).
16. **Estados de erro de detalhe (D3, V4)** têm "Tentar novamente" e "Voltar" (botão), além da seta do cabeçalho. **O erro da lista (L5) só tem "Tentar novamente"**: a lista é raiz da aba e a saída é a barra de abas. O critério 3 fala em "tentar novamente e voltar" para qualquer erro; interpretei assim e **fica para o CRIVO e a pessoa confirmarem**.
17. Placeholder e borda de campo em repouso usam `color/text/placeholder` e `color/border/default` (regra 16 do ADR-014). A referência usava `#A8A39D` (2,5:1 sobre branco) e `#E2DEDA` (1,2:1), que não passam. Ícones de seta e lupa em `#A8A39D` também foram religados a `color/border/default` (3,5:1).

## 7. Navegação (modo Prototype)

Fluxo iniciado em L4. 33 telas, 90 reações lidas de volta. Verificado por script: **33 de 33 telas alcançáveis a partir de L4, nenhuma sem saída, todas com caminho até L1**.

| De | Ação | Para |
|---|---|---|
| L4 | automático em 1,5 s | L1 |
| L1 | cartão de cliente | D2 → D1 (automático) |
| L1 | busca | L3 |
| L1 | Novo cliente | C1 |
| L1 | tecla 2 / tecla 3 (só no protótipo) | L2 / L5 |
| L2, L3 | Novo cliente / Cadastrar "Gustavo" | C1 (campos não são pré-preenchidos) |
| L5 | Tentar novamente | L4 |
| L6 | automático em 3 s | L1 |
| D1 | Voltar / Editar / veículo 1 / veículo 2 / + Veículo | L1 / E1 / V3 → V1 / V2 / N1 |
| D1 | tecla 3 (só no protótipo) | D3 |
| D3 | Tentar novamente / Voltar | D2 / L1 |
| D4, D5 | automático em 3 s | D1 |
| V1, V2, V5 | Voltar / Editar | D1 / M1 |
| V1 | tecla 3 (só no protótipo) | V4 |
| V4 | Tentar novamente / Voltar | V3 / D1 |
| C1 → C3 → C4 → C5 → C6 → C2 | Salvar cliente (sequência demonstrativa dos erros) | próximo da cadeia; C2 vai a L6 em 1,5 s |
| E1 → E3 → E2 | Salvar alterações | E2 vai a D4 em 1,5 s; Cancelar volta a D1 |
| N1 → N3 → N4 → N5 → N2 | Salvar veículo (sequência demonstrativa) | N2 vai a D5 em 1,5 s |
| M1 → M3 → M2 | Salvar alterações | M2 vai a V5 em 1,5 s; Cancelar volta a V1 |
| qualquer formulário | seta Voltar | tela de origem |

Pontos que **não** têm destino neste protótipo, de propósito: botão do perfil no cabeçalho da lista, abas Ordens, Catálogo e Financeiro (outros módulos), itens do histórico de OS (F28). As teclas 2 e 3 existem só para alcançar vazio e erro na apresentação; não são comportamento do app. A sequência de erros dos formulários também é demonstrativa: no app real cada erro depende do que o usuário digitou.

Caminho pedido pelo critério 3 (lista, detalhe do cliente, criar veículo, editar cliente, detalhe do veículo com histórico, editar veículo): L1 → D1 → N1 → (voltar) D1 → E1 → (voltar) D1 → V1 → M1. Percorri o caminho só pelo grafo de reações, **não em modo Present**.

## 8. Acessibilidade

Medido por script no arquivo (fórmula de luminância relativa do WCAG 2.2), sobre as 33 telas:

- **Texto:** 405 textos de cor única medidos contra o fundo efetivo; **menor razão 4,68:1**, nenhum abaixo de 4,5:1. Os 40 textos "de duas cores" (rótulo com `*` obrigatório e "Cliente: Roberto Alves") medidos por trecho: 4,93:1 e 4,97:1 no rótulo e no asterisco; 11,14:1 no nome.
- **Borda de campo:** todos os campos de texto, a busca e o campo Endereço usam `#8C8780` (3,5:1 sobre branco, 3:1 ou mais sobre o fundo). Corrigi o campo Endereço, que a primeira medição achou em 1,23:1.
- **Ícones:** a primeira medição achou ícones em `#A8A39D` (2,5:1 sobre branco, as setas e a lupa). Religados 27 a `#8C8780`. Medição repetida depois: 222 ícones, **menor razão 3,56:1, nenhum abaixo de 3:1**.
- **Bordas de cartão** (lista, cartões de veículo, avisos, estado vazio do histórico) ficam em 1,23:1 a 1,6:1. Entendi como decorativas: o cartão é identificado pelo texto e pela seta, não pela borda. É uma interpretação minha de WCAG 1.4.11; **o CRIVO deve conferir**.
- **Foco visível:** folha `113:2666` define o foco por tipo de controle (botão: anel petro 2 pt com respiro branco 2 pt; campo: borda primary 2 pt; cartão: anel petro; botão do cabeçalho: anel branco 2 pt). Razões calculadas: petro sobre o fundo 11,14:1; branco sobre primary 5,41:1; branco sobre petro 12,12:1; borda primary 4,97:1 sobre o fundo e 5,41:1 sobre branco. **Os frames das telas não mostram o anel desenhado em cada controle**; o foco está especificado na folha, e as telas trazem a ordem de foco anotada.
- **Ordem de foco, leitura e alvo** anotados abaixo de cada um dos 33 frames (texto do que o leitor de tela anuncia, inclusive "obrigatório" e "opcional" e o erro por campo).
- **Alvo de toque:** todo nó com reação mede ao menos 44 × 44 pt (cartões 66, botões 50, busca 46, alvos dos botões do cabeçalho 44). Medido por script, 0 abaixo de 44.
- **Cor não é o único sinal:** erro tem ícone e texto; obrigatório tem `*` e a anotação diz "obrigatório"; "Exemplo" é texto; estado de linha da OS tem texto (EM ANDAMENTO, ENTREGUE).

## 9. Tokens e tipografia

- 1.134 preenchimentos e traços sólidos nas 33 telas; **1.127 ligados a variável**. Os 7 restantes eram os indicadores de carregamento clonados da F41; religados depois a petro e branco (**não reli a contagem depois do religamento**).
- Textos: 427 com estilo de texto existente; 11 textos novos receberam estilo; **8 rótulos de duas cores** (campo com `*`) ficam sem estilo único porque têm duas cores numa linha, como no original.
- Cores `petro` e `primary` aparecem por variável (`1:13`, `1:29`). **Não criei variável nem estilo novo.**
- Cuidado conhecido: ao religar uma cor a variável pela API, o Figma guarda o valor antigo da cor. Corri uma passada que alinha o valor guardado ao valor real da variável (8 correções).

## 10. Dados fictícios (US-PROTO-CLV-08)

- Telefones `(11) 90000-0001` a `(11) 90000-0005` no padrão pedido; placeholders `(11) 90000-0000`.
- E-mails `roberto.alves@example.com`, `marcos.lima@example.com`, placeholder `nome@example.com`.
- CPF `123.456.789-09` (o valor fictício que a política usa) e `123.456.789-00`; nenhum é de pessoa real.
- Nomes (Roberto Alves, Fernanda Souza, Marcos Lima, Ana Paula Ribeiro, José Carlos Mendes), placas (ABC1D23, XYZ9K88, QWE4R56) e endereço vêm da referência. **Não consegui provar que não foram copiados de cadastro real**; assumo que a referência já era fictícia. A única placa criada por mim é `QWE4R56` (veículo extra do D5), inventada.
- Os nomes das camadas dos cartões da lista foram renomeados para "Cartão de cliente · <iniciais>", sem telefone antigo no nome.

## 11. Dúvidas da feature

| # | Dúvida | Estado |
|---|---|---|
| 1 | Link do Figma de referência que destrava a F39 | Reaberta: o link existe (`FPdB8…`), mas o wireframe **aprovado** da F39 não existe; ver seção 1 |
| 2 | Página nova no mesmo arquivo ou arquivo novo | **Proposta e feita:** seção nova no arquivo da referência (seção 3). Confirmar |
| 3 | CPF completo ou mascarado | **Proposta e feita:** fora da lista, mascarado no detalhe, inteiro só ao editar. Confirmar |
| 4 | Sair do formulário com alteração pede confirmação | **Não decidido.** Voltar e Cancelar descartam sem perguntar; a anotação do E1 cita a dúvida |
| 5 (nova) | Telefone opcional contra a referência obrigatória | Segui a política do VIGIA. Confirmar com BUSSOLA |
| 6 (nova) | CNPJ: a oficina atende empresa? | Não decidido |
| 7 (nova) | Sucesso, "Nova OS" e exclusão | Acrescentei sucesso; removi Nova OS e exclusão (itens 8 e 9 da seção 6) |

## 12. O que não consegui fazer ou verificar

- **Aprovação da pessoa** (US-05) e registro no PRD: não aconteceu.
- **Link restrito à equipe** (US-10): o MCP não altera nem lê as permissões de compartilhamento. Não testei o acesso sem permissão. **Pendente para a pessoa**.
- **Modo Present / clique real:** não abri o protótipo em reprodução. O que afirmo é o que li das reações gravadas (grafo por script).
- **Leitor de tela real** (VoiceOver, TalkBack): não testado; as anotações descrevem o que deve ser anunciado.
- **Zoom em todas as telas:** olhei de perto L4, D1, D3, D5, V1, V2, C2, C3, C4, E1, E3, N3 e a folha de foco, e a seção inteira em baixa resolução. As demais (L1, L2, L3, L5, L6, D2, D4, V3, V4, V5, C1, C5, C6, E2, N1, N2, N4, N5, M1, M2, M3) só foram vistas na captura geral e medidas por script.
- **Capturas no repositório:** não versionei PNG (a captura da seção inteira tinha 667 KB). O registro é pelos ids dos nós; as capturas podem ser refeitas com `get_screenshot`.
- **Regra de captura "antes" do ADR-014:** como só criei nós novos (clones), não alterei nenhum frame aprovado e a captura do antes não se aplica.
- **Tablet, código do app, telas de OS:** fora do escopo.
- Conferência contra `docs/product/ux-ui-mapeamento.md` (tarefa 2): as 7 telas existem lá (linhas 33 a 50). O mapeamento diz "botão nova OS" e "editar/excluir cliente" no detalhe do cliente; **divergi** (itens 8 e 9 da seção 6). Também diz "documento" onde uso "CPF".

## 13. Próximo passo

1. A pessoa decide se aceita a referência `FPdB8…` como base da F26 enquanto a F39 não é aprovada (seção 1).
2. CRIVO confere os frames, o grafo e as medições (seção 8) e os pontos marcados "confirmar".
3. A pessoa revisa, restringe o link à equipe, aprova ou aponta pendência, e BUSSOLA registra no PRD.
4. Só depois a F35 pode abrir.
