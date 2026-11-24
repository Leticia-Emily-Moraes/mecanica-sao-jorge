# F26 — Protótipo de alta fidelidade de Clientes e Veículos (Figma)

- Autor: ESQUADRO (etapa 2 de 3 da rota: BUSSOLA → ESQUADRO → CRIVO)
- Datas: entrega inicial 2026-11-17; revisão dos ajustes da revisão humana (14:33) em 2026-11-17
- Feature: F26, Sprint 02, critérios US-PROTO-CLV-01 a 19 (os 15 a 19 vêm do PRD da BUSSOLA)
- PRD: `docs/product/F26-prototipo-clientes-veiculos.md`
- Estado: **entregue ao Figma, AGUARDANDO APROVAÇÃO. Não aprovado.** Faltam a decisão da base (D8), o teste do link restrito e a aprovação da pessoa (seções 1, 12 e 13)

## 1. Base dos frames: a F39 não está aprovada (decisão D8, da pessoa)

A premissa 10 e o critério US-PROTO-CLV-07 dizem que a feature só inicia depois que o wireframe redesenhado da F39 estiver aprovado, e que ele é a base de cada frame.

O que verifiquei no repositório:

- O PRD da F39 não tem registro "Aprovado".
- O documento do ESQUADRO da F39 segue com estado "BLOQUEADO — nenhuma tela foi redesenhada".
- O PRD v3 da F39 registra que nenhum frame consta como editado e deixa D9 a D14 abertas.

**A tarefa 1 está reaberta.** Como o wireframe aprovado não existe, a base foi a referência `FPdB8RymAnN81pbKfizdzE` (a inspiração visual que o briefing fixa para baixa e alta fidelidade). Isso foi **escolha minha, não decisão da pessoa**. A BUSSOLA recomenda aceitar a referência como base e, quando a F39 for aprovada, comparar e refazer só os frames que divergirem (D8 do PRD).

Consequências, todas abertas:

- US-PROTO-CLV-05 (aprovação) e US-PROTO-CLV-07 (base) **não estão cumpridos**. A F35 **não deve começar**.
- Se a F39 mudar a estrutura de uma dessas telas, os frames da F26 precisam ser refeitos.
- Quem decide: a pessoa (aceitar a referência como base, ou esperar a F39).

## 2. Acesso ao Figma

`whoami` respondeu normalmente nesta sessão (conta com plano "Time Pessoal", assento Full, papel admin). Os identificadores da conta e da sessão **não são registrados aqui** (pedido da revisão humana, critério 14).

- `create_session` no arquivo `FPdB8RymAnN81pbKfizdzE` funcionou, e `get_metadata`, `get_screenshot` e `use_figma` também.
- A instrução `figma-use` **não pôde ser carregada** (esta sessão não tem `get_figma_skill` nem leitura de recurso de skill). Compensei com passos pequenos: leitura antes, escrita, conferência por `get_screenshot` e por leitura de volta.
- `download_assets` não foi usado. As capturas foram baixadas pela URL de `get_screenshot` e **não foram versionadas** (PNG; o registro é pelos ids dos nós).

## 3. Onde está o trabalho e por que neste arquivo

- Arquivo: `FPdB8RymAnN81pbKfizdzE` (o arquivo informado no briefing). Página `20:2132` "02 — Alta fidelidade".
- **Seção `106:2097`** "F26 — Clientes e Veículos — protótipo de alta fidelidade (aguardando aprovação)", em x 9900, y 0, agora com 2772 × 8800.
- Os frames são clones; os originais da referência continuam como estavam. Nenhum nó fora da seção foi alterado nesta revisão.
- Ponto de partida do fluxo: `L4` (`109:2402`), nome "F26 — Clientes e Veículos". Lido de volta no fim: é o único ponto de partida da página.

Por que não criei arquivo novo na pasta `681115069`: o briefing manda continuar no arquivo registrado, e a referência `FPdB8…` é onde vivem as variáveis `OP-002 Identidade v2`, os componentes (cabeçalho, busca, cartão, navegação inferior) e o indicador da F41. Responde à dúvida 2: **mesmo arquivo, seção nova** (a BUSSOLA confirma; falta a pessoa confirmar).

Observação: ao gravar as reações pela primeira vez o Figma criou sozinho um ponto "Flow 1" no L1; removi e deixei só o L4. Não consigo provar que não havia outro ponto antes (não li a lista antes de gravar).

## 4. Base lida na referência (ids lidos por `get_metadata` em 2026-11-17)

Alta fidelidade, página `20:2132`, seção `20:1067` "Clientes e Veículos":

| Frame da referência | Nó | Usado como base de |
|---|---|---|
| 1d Lista de Clientes | `10:1052` | L1, L4 (via L2), L7 |
| 1e Lista de Clientes — vazia | `10:1157` | L2, L4, L5 |
| 1f Busca sem resultado | `10:1214` | L3 |
| 1g Cliente criado, toast | `10:1269` | L6 e os avisos de sucesso |
| 1h Detalhe do Cliente | `10:1373` | D1 a D5 |
| 1i Novo Cliente | `10:1455` | C1, C2, C4 a C7 |
| 1j Editar Cliente | `10:1494` | E1 a E3 |
| 1k Novo Cliente — validação | `10:1535` | C3 |
| 1m Detalhe do Veículo | `10:1651` | V1 a V5 |
| 1n Novo Veículo | `10:1732` | N1, N2, N4, N5 |
| 1o Editar Veículo | `10:1778` | M1 a M3 |
| 1p Novo Veículo — validação | `10:1826` | N3 |
| 1l Excluir Cliente — confirmação | `10:1587` | **não usado** (exclusão fora do escopo) |
| 1av Perfil | `10:3847` | PF (destino do Voltar do L5) |
| 1aw Sair — confirmação | `10:3925` (camada do diálogo) | X1 a X4 (diálogo "Descartar alterações?", mesma estrutura de scrim e cartão) |

Estados reaproveitados da F41: `83:752`/`83:753` (carregando), `83:763` a `83:769` (erro), `83:815` (botão secundário), `82:2137` (indicador do "Salvando…").

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

## 5. Os frames

39 frames de tela (todos 362 × 742), a folha de foco `113:2666` e o frame de apoio PF. Nome no Figma: `F26-<código> <título>`. Acima de cada frame há o rótulo e abaixo a anotação de acessibilidade (ordem de foco, leitor de tela, alvo de toque).

| Linha | Código | Estado | Nó |
|---|---|---|---|
| Clientes · lista | L1 | preenchido | `106:2098` |
| | L2 | vazio (sem cadastros) | `106:2112` |
| | L3 | vazio de busca | `106:2128` |
| | L4 | carregando | `109:2402` |
| | L5 | erro ao carregar (Tentar novamente + Voltar) | `109:2453` |
| | L6 | sucesso (cliente cadastrado) | `106:2146` |
| Clientes · detalhe | D1 | preenchido | `106:2159` |
| | D2 | carregando | `109:2507` |
| | D3 | erro ao carregar | `109:2574` |
| | D4 | sucesso (alterações salvas) | `109:2809` |
| | D5 | sucesso (veículo cadastrado) | `109:2877` |
| Veículos · detalhe | V1 | preenchido, histórico de OS | `106:2214` |
| | V2 | histórico de OS vazio (estado real até a Sprint 04) | `109:3030` |
| | V3 | carregando | `109:2651` |
| | V4 | erro ao carregar | `109:2723` |
| | V5 | sucesso (alterações salvas) | `109:2959` |
| Clientes · criar | C1 | vazio, com aviso de privacidade | `106:2277` |
| | C2 | salvando, com aviso de privacidade | `110:2535` |
| | C3 | erro: campo obrigatório vazio e telefone incompleto | `106:2409` |
| | C4 | erro: CPF inválido | `110:2576` |
| | C5 | erro: CPF já cadastrado | `110:2625` |
| | C6 | erro: falha de envio | `110:2674` |
| Clientes · editar | E1 | preenchido | `106:2300` |
| | E2 | salvando | `110:2718` |
| | E3 | erro: falha de envio | `110:2762` |
| Veículos · criar | N1 | vazio | `106:2334` |
| | N2 | salvando | `111:2589` |
| | N3 | erro: obrigatório, placa inválida e ano inválido | `106:2440` |
| | N4 | erro: placa já cadastrada | `111:2632` |
| | N5 | erro: falha de envio | `111:2683` |
| Veículos · editar | M1 | preenchido | `106:2368` |
| | M2 | salvando | `111:2729` |
| | M3 | erro: falha de envio | `111:2775` |
| **Acrescentados na revisão** | L7 | lista com contatos ausentes (e-mail no lugar do telefone; "Sem contato cadastrado") | `119:779` |
| | C7 | erro: e-mail inválido | `119:712` |
| | X1 | diálogo "Descartar alterações?" sobre C3 (criar cliente) | `119:905` |
| | X2 | idem sobre E3 (editar cliente) | `119:976` |
| | X3 | idem sobre N3 (criar veículo) | `119:1041` |
| | X4 | idem sobre M3 (editar veículo) | `119:1120` |
| Apoio | PF | Perfil (cópia da 1av), destino do Voltar do L5 | `117:2636` |
| Folha de foco | F | estados de foco por tipo de controle | `113:2666` |

Os sucessos (L6, D4, D5, V5) são acréscimo do ESQUADRO que a BUSSOLA manteve (D7).

## 6. Decisões de design e divergências em relação à referência

Cada linha é reversível. As marcadas "BUSSOLA" já têm decisão no PRD.

1. **Telefone, e-mail, CPF e endereço são opcionais; só o nome é obrigatório.** Motivo: política de dados do VIGIA (`docs/security/politica-dados-pessoais-cliente.md`) e V2 com `NULL`. A referência marcava o telefone como obrigatório. Fechada pela BUSSOLA (D5); falta confirmar com o texto da F09.
2. **Campo de e-mail acrescentado** (a referência não tinha). A coluna existe na V2.
3. **Rótulo "CPF" em vez de "CPF / CNPJ".** Dúvida 6 **fechada pela BUSSOLA (D6)**: só CPF por enquanto; se a oficina atender empresa, reabre (rótulo "CPF/CNPJ", validação e base legal próprias).
4. **Ajuda do CPF:** "Só preencha se o cliente pedir nota fiscal."
5. **CPF mascarado no detalhe:** `***.*56.7**-**`, mesma máscara da política (6.2). No formulário de edição o CPF aparece inteiro. Na lista o CPF não aparece. A BUSSOLA mantém (D3), sujeita à G3 (a F08 precisa devolver o CPF inteiro; a máscara da política é de log, a pessoa confirma se vale para a tela).
6. **Cartão da lista sem "N veículos"** (o contrato da lista não traz a contagem). **Novo:** o cartão mostra o e-mail quando não há telefone, e "Sem contato cadastrado" quando não há nenhum dos dois, sem mudar altura nem área de toque (L7, critério 16).
7. **Busca:** placeholder "Buscar por nome, telefone ou e-mail" (o ADR-017 não busca por documento).
8. **Removidos "+ Nova OS" (cliente e veículo)**: leva à tela de OS da F28. Volta com a F28 e a F42.
9. **Removido "Excluir cliente"** e o diálogo `1l`: exclusão fora do escopo.
10. **Mensagens de duplicidade não revelam outro cliente.**
11. **Histórico de OS:** cada item tem o rótulo visível "Exemplo" e não abre a OS. O V1 é só demonstração; **o V2 (vazio) é o único estado real até a Sprint 04** e está anotado assim.
12. **Erro de formulário** com ícone, texto junto ao campo e rótulo visível. Aviso-resumo acima do botão.
13. **Alvo de toque de 44 × 44 pt nos botões de cabeçalho** (frame transparente por cima do visual de 36 pt).
14. **"Salvando…"** com o indicador de 16 pt da F41 e campos em `color/surface/skeleton`.
15. **Erro de detalhe (D3, V4)** tem "Tentar novamente" e "Voltar". **Erro da lista (L5), alterado nesta revisão:** agora também tem "Voltar" (botão de contorno), que leva ao **Perfil** (PF), tela de pouso do app, como a BUSSOLA definiu (C3a). O PF é uma cópia da tela 1av dentro da seção, porque a 1av está aninhada em outro quadro e não pode ser destino de navegação; a cópia não tem reações próprias, exceto a seta do cabeçalho, que volta ao L1 só no protótipo.
16. **Placeholder e borda de campo** em `color/text/placeholder` e `color/border/default` (regra 16 do ADR-014).
17. **Novo, D4 fechada pela BUSSOLA: confirmar ao sair com alteração.** Voltar e Cancelar dos formulários com dado digitado (C3, E3, N3, M3) abrem "Descartar alterações?" (X1 a X4), com "Continuar editando" (botão primário, foco inicial) e "Descartar". Sem alteração, sai direto. Os botões ficam empilhados (a largura de 133 pt da referência não comporta "Continuar editando").
18. **Novo: aviso de privacidade** (rascunho da BUSSOLA, sem caixa de aceite) acima do botão Salvar em C1 e C2. Nos frames de erro o espaço pertence ao aviso de erro; no app o texto rola junto e fica em todos os estados.
19. **Novo: dica da placa cita os dois padrões** ("Placa inválida. Use ABC1D23 ou ABC1234.").
20. **Novo: e-mail inválido** (C7, "Informe um e-mail válido."). O "ano inválido" já existia no N3.

## 7. Navegação (modo Prototype)

Fluxo iniciado em L4. **40 frames de navegação (39 telas e o PF), 110 reações lidas de volta**: 92 de clique, 11 de tempo e 7 de tecla. Lido por script: **todos alcançáveis a partir de L4, nenhum sem saída, todos com caminho até L1.**

| De | Ação | Para |
|---|---|---|
| L4 | automático em 1,5 s | L1 |
| L1 | cartão de cliente | D2 → D1 (automático) |
| L1 | busca | L3 |
| L1 | Novo cliente | C1 |
| L1 | tecla 2 / 3 / 4 (só no protótipo) | L2 / L5 / L7 |
| L7 | tecla 1 (só no protótipo) | L1 |
| L2, L3 | Novo cliente / Cadastrar "Lauro" | C1 |
| L5 | Tentar novamente | L4 |
| **L5** | **Voltar (novo)** | **PF (Perfil)** |
| PF | seta do cabeçalho (só protótipo) | L1 |
| L6 | automático em 3 s | L1 |
| D1 | Voltar / Editar / veículo 1 / veículo 2 / + Veículo | L1 / E1 / V3 → V1 / V2 / N1 |
| D1 | tecla 3 (só no protótipo) | D3 |
| D3 | Tentar novamente / Voltar | D2 / L1 |
| D4, D5 | automático em 3 s | D1 |
| V1, V2, V5 | Voltar / Editar | D1 / M1 |
| V1 | tecla 3 (só no protótipo) | V4 |
| V4 | Tentar novamente / Voltar | V3 / D1 |
| C1 → C3 → **C7** → C4 → C5 → C6 → C2 | Salvar cliente (sequência demonstrativa dos erros) | próximo da cadeia; C2 vai a L6 em 1,5 s |
| E1 → E3 → E2 | Salvar alterações | E2 vai a D4 em 1,5 s |
| N1 → N3 → N4 → N5 → N2 | Salvar veículo (sequência demonstrativa) | N2 vai a D5 em 1,5 s |
| M1 → M3 → M2 | Salvar alterações | M2 vai a V5 em 1,5 s |
| C1, E1, N1, M1 | Voltar ou Cancelar | tela de origem |
| **C3, E3, N3, M3** | **Voltar / Cancelar (novo)** | **X1 / X2 / X3 / X4** |
| X1 / X2 / X3 / X4 | Continuar editando | C3 / E3 / N3 / M3 |
| X1 / X2 / X3 / X4 | Descartar | L1 / D1 / D1 / V1 |

Sem destino de propósito: abas Ordens, Catálogo e Financeiro, itens do histórico de OS (F28) e o botão do perfil no cabeçalho da lista (L1 a L7).

O caminho do critério 3 (lista, detalhe do cliente, criar veículo, editar cliente, detalhe do veículo com histórico, editar veículo) existe no grafo: L1 → D1 → N1 → D1 → E1 → D1 → V1 → M1. **Percorri o caminho só pelo grafo de reações, não em modo Present** (o MCP não aciona o Present). O roteiro de cliques para quem for percorrer está na seção 8.1 do PRD.

## 8. Acessibilidade (medição repetida em 2026-11-17, depois das alterações)

Medido por script no arquivo, fórmula de luminância relativa do WCAG 2.2, sobre os 39 frames de tela (sem a camada de foco e sem o PF e a folha F). Nos frames do diálogo (X) só foram medidos os textos e ícones do diálogo, porque o resto fica sob o escurecimento.

- **Texto:** 544 trechos de texto medidos contra o fundo efetivo (empilhando as cores de fundo dos ancestrais); **menor razão 4,68:1, nenhum abaixo do mínimo** (4,5:1; 3:1 nos 4 trechos de texto grande). O resultado repete o relato anterior.
- **Ícones e traços de vetor:** 240 medidos; **menor razão 3,56:1, nenhum abaixo de 3:1**. Repete o relato anterior.
- **Bordas de cartão** (1,23:1 a 1,6:1) tratadas como decorativas: o cartão é identificado por texto e seta. Interpretação minha de WCAG 1.4.11, **a conferir pelo CRIVO**.
- **Foco visível por controle (novo).** Cada frame tem a camada "Foco por controle (sobreposição de especificação; ocultar para paridade)", com um anel em cada controle navegável e um selo numerado com a ordem de foco. Padrão da folha `113:2666`: botão e cartão com anel petro de 2 pt e respiro branco de 2 pt; campo com borda primary de 2 pt; botão de cabeçalho e aba com anel branco de 2 pt. Selo: branco sobre primary (5,41:1). Nos estados bloqueados (C2, E2, N2, M2: só Salvar; D2 e V3: só Voltar; L4: só a busca) a camada mostra só o controle que recebe foco. **A camada fica visível por padrão; para capturar o frame sem foco (paridade com o app), oculte-a.** As razões das cores de anel vêm dos cálculos da folha (petro sobre o fundo 11,14:1; branco sobre petro 12,12:1; borda primary 4,97:1 sobre o fundo e 5,41:1 sobre branco); não as remedi nesta rodada, só nos textos e ícones acima.
- **Ordem de foco, leitura e alvo** anotados abaixo de cada frame. A ordem numérica dos selos segue a leitura de cima para baixo e da esquerda para a direita, igual à anotação.
- **Alvo de toque:** 91 nós com reação nos 39 frames; **0 abaixo de 44 × 44 pt** (cartões 66, botões 50, busca 46, alvos do cabeçalho 44, diálogo 50). Os cartões e os botões do cabeçalho foram medidos pelo mesmo script. Pendência: as 4 abas da barra inferior medem 90 × 62, mas só têm reação onde a aba leva a algum lugar; as abas sem destino não entram nessa contagem e **não foram medidas como controle** (o foco desenhado cobre as 4).
- **Cor não é o único sinal:** erro tem ícone e texto; obrigatório tem `*` e a anotação diz "obrigatório"; "Exemplo" é texto; estado de OS tem texto.
- **Leitor de tela real:** não testado (VoiceOver, TalkBack). As anotações descrevem o que deve ser anunciado.

## 9. Tokens e tipografia (contagem repetida em 2026-11-17)

- **1.450 preenchimentos e traços sólidos visíveis nos 39 frames de tela, 1.450 ligados a variável (0 soltos).** A contagem anterior (1.127 de 1.134, com 7 indicadores soltos) foi refeita depois do religamento dos indicadores. Contei fundos, traços e as cores de cada trecho de texto; a camada de foco, o PF e a folha F ficaram de fora.
- **565 textos, 565 com estilo de texto** (contando cada trecho nos rótulos de duas cores).
- `petro` e `primary` entram por variável (`1:13`, `1:29`). **Não criei variável nem estilo novo.**
- Cuidado conhecido: ao religar uma cor por variável pela API, o Figma guarda o valor antigo da cor; uma passada anterior alinhou o valor guardado ao valor real.
- Frames novos desta revisão (L7, C7, X1 a X4) são clones de frames existentes e herdam os vínculos.
- **Para conferir por amostragem** (critério 1): abrir a seção `106:2097`, conferir a contagem de 39 telas mais a folha F e o PF, e clicar em alguns textos e cartões para ver a variável ou o estilo no painel de propriedades.

## 10. Dados fictícios (US-PROTO-CLV-08)

Todos os dados pessoais dos frames são **inventados** nesta revisão; nenhum valor vem de planilha ou cadastro real da oficina. Não é possível provar que um nome ou uma placa inventados não existem no mundo; o que se registra é a origem (inventada).

- Nomes: Teodoro Lemos, Cecília Barros, Otávio Neves, Iara Montenegro, Dário Cavalcanti. Termo de busca de exemplo: "Lauro". Iniciais dos avatares atualizadas.
- Telefones `(11) 90000-0001` a `(11) 90000-0005`; placeholder `(11) 90000-0000`.
- E-mails `teodoro.lemos@example.com`, `otavio.neves@example.com`, placeholder `nome@example.com`; o C7 mostra `otavio.neves.example.com` (sem arroba, como exemplo de e-mail inválido).
- **CPF com dígito verificador inválido** em todos os frames: `123.456.789-00`; o C4 (CPF inválido) usa `123.456.789-10`; placeholder `000.000.000-00`. O C5 (CPF já cadastrado) usa o mesmo valor `-00` e a anotação avisa que, na API, a duplicidade só é checada depois da validação do dígito.
- Placas inventadas no padrão Mercosul: `RTK4M81`, `NHP7C20`, `BVD5F39`. As dicas de formato citam `ABC1D23` e `ABC1234` apenas como exemplo de padrão. Marca e modelo (Honda Civic, Chevrolet Onix, Fiat Argo) são nomes públicos de produto.
- Endereço inventado ("Rua Modelo, 100 · Jardim Exemplo"); histórico de OS com número, data e valor inventados.
- Nomes de camada dos cartões renomeados para as iniciais novas; conferi por script que nenhum texto nem nome de camada da seção guarda os valores antigos (0 sobras).

## 11. Dúvidas da feature

| # | Dúvida | Estado |
|---|---|---|
| 1 | Link do Figma de referência que destrava a F39 | O link existe (`FPdB8…`); o wireframe **aprovado** da F39 não existe. Depende da D8 |
| 2 | Página nova no mesmo arquivo ou arquivo novo | Feita: seção nova no arquivo da referência. A pessoa confirma |
| 3 | CPF completo ou mascarado | Feita: mascarado no detalhe, inteiro só ao editar. A pessoa confirma, sujeita à G3 do PRD |
| 4 | Sair do formulário com alteração pede confirmação | **Fechada (BUSSOLA, D4): sim.** Desenhado em X1 a X4; sem alteração sai direto |
| 5 | Telefone opcional contra a referência obrigatória | Fechada (BUSSOLA, D5); confirmar com o texto da F09 |
| 6 | CNPJ: a oficina atende empresa? | **Fechada com padrão reversível (BUSSOLA, D6): só CPF por enquanto.** Reabre se a oficina atender empresa |
| 7 | Sucesso, "Nova OS" e exclusão | Fechada (BUSSOLA, D7): sucesso mantido; "Nova OS" volta com a F28/F42; exclusão fora |

## 12. O que não consegui fazer ou verificar

- **Aprovação da pessoa e registro no PRD** (US-05): não aconteceu. A seção 10 do PRD está vazia, de propósito.
- **Decisão da base (D8):** pendente (seção 1).
- **Link restrito à equipe** (US-10): o MCP não altera nem lê as permissões de compartilhamento. **Nenhum teste de acesso sem permissão foi feito.** Roteiro na seção 8.3 do PRD, para a pessoa executar.
- **Modo Present / clique real:** não aberto. O que afirmo é o que li das reações gravadas.
- **Leitor de tela real:** não testado.
- **Zoom em todas as telas:** olhei com `get_screenshot` L5, L7, C1, C7, N1, N3, X1 e X4 depois das alterações. As demais só foram medidas por script e vistas na rodada anterior; **os anéis de foco foram conferidos visualmente só em L1, L7 e N1**.
- **A camada de foco não foi vista nas telas de formulário de erro e nas de detalhe** (conferida por script: contagem e tipo de controle por frame; ordem numerada conforme a leitura).
- **Capturas no repositório:** não versionei PNG. As capturas da F35 podem ser refeitas com `get_screenshot`.
- **Reação do botão de perfil do cabeçalho da lista:** sem destino (o PF só serve ao L5).
- **Regra de captura "antes" do ADR-014:** só criei nós novos (clones) e mexi no texto de clones da própria seção; nenhum frame aprovado da referência foi alterado.
- **Tablet, código do app, telas de OS:** fora do escopo.
- **Conferência contra `docs/product/ux-ui-mapeamento.md`** (tarefa 2): as 7 telas existem lá (linhas 33 a 50). O mapeamento diz "botão nova OS" e "editar/excluir cliente" no detalhe do cliente; divergi (itens 8 e 9 da seção 6). Também diz "documento" onde uso "CPF".
- **Nada foi comparado com a F39**, porque ela não tem wireframe aprovado.

## 13. Próximo passo

1. A pessoa decide a D8 (referência `FPdB8…` como base ou esperar a F39).
2. A pessoa restringe o link à equipe e executa o teste da seção 8.3 do PRD; registra neste documento a data e os três resultados, sem e-mail nem identificador de conta.
3. A pessoa (ou o CRIVO) percorre o roteiro 8.1 do PRD em modo Present.
4. O CRIVO reproduz as contagens e as medições da seção 8 e 9.
5. Com tudo isso, a pessoa aprova ou aponta pendência, e a BUSSOLA registra no PRD (seção 10). Só então a F35 pode abrir. Quando a aprovação existir, acrescentar aqui o link do protótipo aprovado e a data (critério 14).
