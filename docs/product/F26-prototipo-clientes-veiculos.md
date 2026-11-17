# PRD — F26: Protótipo de alta fidelidade de Clientes e Veículos

- Prioridade: P1
- Área: Frontend
- Sprint: Sprint 02: Clientes e Veículos
- Dono da execução (Figma): ESQUADRO
- Autora: BUSSOLA (Product Owner)
- Data desta revisão: 2026-11-17 (revisão 2, depois da revisão humana de 17/11 14:33)
- Etapa da rota: **BUSSOLA (1/3)** → ESQUADRO → CRIVO
- Estado: **NÃO APROVADO.** Protótipo entregue ao Figma pelo ESQUADRO, com pendências (seção 3). A F35 **não abre**.

> **Como ler.** O que li e rodei está separado do que suponho. Onde a decisão cabe à Letícia, a seção diz "Decisão da pessoa" e traz a recomendação. Nada nesta revisão foi aprovado em nome dela. Não consegui abrir o Figma nesta etapa: não havia ferramenta do Figma disponível para mim. Tudo o que digo sobre o conteúdo dos frames vem de `docs/design/F26-prototipo-clientes-veiculos.md` (ESQUADRO) e precisa ser conferido por ele e pelo CRIVO.

## 1. Visão

Protótipo navegável de alta fidelidade das 7 telas de Clientes e Veículos, com os tokens petro (`#1E3A3F`) e primary (`#B5453D`), os quatro estados por tipo de tela e o fluxo sem beco sem saída. É o gate do ADR-007 para a F35 (front de Clientes e Veículos).

História 1. **Como** Product Owner que aprova o front, **quero** navegar Clientes e Veículos em alta fidelidade com os quatro estados, **para** aprovar o desenho antes de o Expo começar e evitar retrabalho.

História 2. **Como** atendente da oficina, **quero** que busca, cadastro e histórico do veículo sigam um fluxo sem becos sem saída, **para** achar o cliente no balcão e registrar o carro sem travar.

## 2. Escopo

### Dentro do escopo

- 7 telas, só smartphone: Clientes (lista com busca, detalhe, criar, editar) e Veículos (criar, editar, detalhe com histórico de OS).
- Lista: vazio, vazio de busca, carregando, erro com tentar novamente, preenchido.
- Detalhe: carregando, erro, preenchido; o detalhe do veículo também mostra o histórico de OS vazio e preenchido.
- Formulário: vazio (criar), preenchido (editar), salvando e erro (por campo e falha de envio).
- Estados de sucesso (L6, D4, D5, V5), acrescentados pelo ESQUADRO e **mantidos por decisão minha**: sem eles o atendente não sabe se salvou. São frames isolados, fáceis de remover se a Letícia preferir.
- Campos de dado pessoal que cada tela mostra e quais são obrigatórios, para a F09 e a F04 coletarem só o necessário (seção 6).
- Revisão das 7 telas contra os contratos de F03a, F08, F09, F10 e F04 (seção 5).

### Fora do escopo (fica para depois)

- Tablet e código do app (F35).
- Telas de OS (F28). O item do histórico não abre a OS. O botão "Nova OS" saiu das telas de cliente e de veículo e volta com a F28 e a F42 (seção 5.6).
- Exclusão ou inativação de cliente e veículo. A política de dados descarta por anonimização, não por exclusão.
- Qualquer dado real de cliente.
- Redesenho do wireframe, que é da F39.
- Estados de carregando e erro **da seção de histórico de OS** dentro do detalhe do veículo. Só existem quando o histórico tiver chamada própria, na Sprint 04; a feature que criar essa chamada desenha os frames (seção 5.5).
- CNPJ (D6).

## 3. Pendências depois da revisão humana (como cada ponto foi tratado)

Dono: **ESQUADRO** desenha no Figma; **Letícia** decide ou executa o que agente não alcança; **BUSSOLA** resolvi neste PRD.

| # | Ponto da revisão | Resolução nesta revisão | Dono do que falta | Fechado? |
|---|---|---|---|---|
| T1 | Tarefa 1 marcada feita sem a F39 aprovada | **Reaberta.** Conferi: no ramo `docs/f39-wireframe-redesenho` o PRD da F39 não tem registro "Aprovado", e o último QA do CRIVO diz que o redesenho não foi entregue. Isso contradiz o status "Concluída" do quadro (pedido ao REGENTE na seção 12) | Letícia (D8) | Não |
| C1 | Contar 33 frames em `106:2097`, amostrar variável e estilo, refazer a contagem de cores ligadas depois do religamento dos 7 indicadores | **Não consegui executar** (sem Figma). O ESQUADRO repete a contagem e o CRIVO reproduz. O critério 1 passa a exigir o número novo registrado | ESQUADRO, CRIVO | Não |
| C3a | Voltar no erro da lista (L5) | Já decidido pela Letícia como pendência do ESQUADRO. **Defini o destino:** "Voltar" em L5 leva ao **Perfil**, tela de pouso do app (F33). Motivo: L5 é raiz de aba, não há tela anterior de Clientes, e o Perfil é a única aba sempre habilitada. Se o ESQUADRO não conseguir ligar esse destino fora da seção, devolve o bloqueio | ESQUADRO | Não |
| C3b | Percorrer em modo Present a partir de L4 | O Present não é acionável pelo MCP. Escrevi o **roteiro de cliques** (seção 8.1) para a Letícia ou o CRIVO percorrerem e registrarem a saída | Letícia ou CRIVO | Não |
| C4a | Anel de foco em cada controle de cada frame | Já decidido pela Letícia como pendência do ESQUADRO (não vale só a folha `113:2666`). O critério 4 exige o foco **visível por controle**. A forma (variante de foco por componente, frames por passo da ordem) é do ESQUADRO. Se estourar 3 dias, vale a premissa 8 (dividir) | ESQUADRO | Não |
| C4b | Reproduzir contraste 4,68:1 e 3,56:1 | Precisa de Figma. CRIVO reproduz | CRIVO | Não |
| C5 | Criar o PRD com a linha de aprovação | **Feito aqui**, seção 10. A linha de aprovação está **vazia** de propósito: não há aprovação | Letícia | Não |
| C7 | Base: FPdB8 ou esperar a F39 | **Decisão da pessoa (D8).** Recomendação na seção 7 (D8) e critério alternativo no critério 7 | Letícia | Não |
| C8a | CPF `123.456.789-09` tem dígitos verificadores válidos | **Confirmei o cálculo à mão:** os dígitos verificadores de 123.456.789 são 0 e 9, então `-09` é válido e `-00` é inválido. Trocar por `-00` em todos os frames, inclusive o C5 (nota na seção 8.2). A política do VIGIA (seção 6.2) usa `-09` como exemplo; peço a troca, que não altera a máscara porque ela só mostra os 3 dígitos do meio | ESQUADRO, VIGIA | Não |
| C8b | Provar que nomes e placas não são de cadastro real | **Reescrevi o critério 8.** Provar que algo não existe no mundo não é possível; o que se prova é a origem. Decisão: **trocar** nomes, placas, endereço e valores e datas do histórico por valores inventados e registrar que a origem é inventada | ESQUADRO | Não |
| C10 | Link restrito nunca testado | Só a Letícia consegue (permissão do arquivo). Roteiro na seção 8.3 | Letícia | Não |
| C12 | Reproduzir medição de alvo de toque | CRIVO reproduz, com atenção aos botões de cabeçalho (36 visual, 44 de toque) e aos cartões. Requisito para o código (F35) no critério 12 | CRIVO | Não |
| C14a | Remover `user_id` e id de sessão do doc (linhas 31 e 34) | Dono ESQUADRO. **Atenção:** a branch `docs/f26-prototipo-clientes-veiculos` existe só local (conferi: não há ramo remoto). Apagar as linhas num commit novo deixa o identificador no histórico local. Para tirá-lo do histórico, é preciso reescrever os 2 commits **antes** do primeiro push (D12) | ESQUADRO, Letícia | Não |
| C14b | Link do protótipo e data de aprovação no doc | Só existem depois da aprovação | ESQUADRO, após Letícia | Não |
| C14c | Fechar as dúvidas 4 e 6 | **Fechadas por mim**, seção 7 (D4 e D6), com padrão reversível | ESQUADRO registra no doc | Decidido |
| — | Tarefas 10, 11 e 13 | Seção 11 | — | Não |

## 4. Glossário

- **Cliente**: pessoa atendida pela oficina. Só o nome é obrigatório (política de dados, seção 2).
- **Veículo**: sempre pertence a um cliente. Placa, marca e modelo obrigatórios.
- **Histórico de OS**: lista de ordens de serviço de um veículo. Só passa a existir de verdade na Sprint 04.
- **Estado**: vazio, vazio de busca, carregando, erro, preenchido (e salvando, nos formulários).
- **Frame**: tela do Figma. Os códigos L, D, V, C, E, N e M vêm do doc do ESQUADRO (tabela da seção 5 dele).
- **Referência**: o arquivo Figma `FPdB8RymAnN81pbKfizdzE`, fixado pelo briefing como inspiração visual.
- **Folha de foco**: frame `113:2666`, especificação do anel de foco por tipo de controle.

## 5. Revisão das 7 telas contra os contratos (instrução do comandante)

### 5.1 O que li e o limite da revisão

Li de fato:

- `ClienteListResponse`, `ClienteController`, entidades `Cliente` e `Veiculo` e migrations V1 a V3 no ramo `feat/f03a-clientes-listar` (493016c). O código da F03a **não está na base desta branch**: a base só tem V1, V2 e o `AuthController`.
- ADR-017 (contrato da listagem), política de dados do cliente (VIGIA), `ux-ui-mapeamento.md` e o doc do ESQUADRO.

**Não consegui ler o texto completo das features F08, F09, F10 e F04.** Só tenho os trechos que o panorama traz, cortados no meio da frase, e esses textos não estão no repositório. Por isso a coluna "Resultado" marca o que é código verificado, o que é trecho do panorama e o que é "não verificado". Quem tem o texto inteiro (Letícia ou REGENTE) deve conferir as linhas marcadas.

Também não li os frames. O que as telas mostram vem do doc do ESQUADRO e do `ux-ui-mapeamento.md`. O ESQUADRO confirma campo por campo no Figma (seção 12).

### 5.2 Matriz tela, campo e endpoint

Estado dos endpoints hoje: F03a existe em código e está em revisão; F08, F09, F10 e F04 estão **Bloqueadas e sem nenhum código**.

| Tela | Campo ou ação | Contrato | Resultado |
|---|---|---|---|
| Lista (L1 a L6) | nome | `GET /api/v1/clientes` devolve `nome` (código verificado) | OK |
| Lista | telefone | devolve `telefone` só com dígitos, pode ser `null` (código) | OK para o dado; o cartão **não prevê cliente sem telefone** (G1) |
| Lista | e-mail | o DTO devolve `email`; **a tela não mostra** | Endpoint sem campo na tela (G1) |
| Lista | busca de até 100 caracteres | `q` com `@Size(max=100)`, 400 acima disso (ADR-017) | OK; a tela limita o campo a 100 |
| Lista | "N veículos" | não existe no DTO | A tela já tirou (decisão 6 do ESQUADRO). OK |
| Lista | rolagem além de 20 itens | resposta traz `pagina`, `tamanho`, `totalItens`, `totalPaginas`; `size` até 100 | **Tela sem estado de "carregar mais"** (G2) |
| Lista | vazio e vazio de busca | `itens` vazio nos dois; a tela distingue pela presença de `q` (ADR-017) | OK; `q` só com espaços conta como "sem busca" |
| Lista | erro | 400 e 500 no formato do handler; 401 sem token | OK para rede e 500. Sessão expirada (401) não é o L5: é assunto de F30 e F35 |
| Detalhe do cliente (D1 a D5) | nome, telefone, e-mail | `GET /clientes/{id}` (F08, **sem código**; só o trecho "cliente existente com CPF 12345678900, abro o detalhe pelo id") | Não verificado |
| Detalhe do cliente | CPF mascarado | Coluna `cpf` **não existe** (a F09 cria). A política só deixa o CPF aparecer no detalhe | Máscara de tela contra edição (G3) |
| Detalhe do cliente | endereço | Coluna não existe (F09 cria); campo único de texto | Não verificado |
| Detalhe do cliente | lista de veículos | **Nenhuma feature lida diz de onde vem** | G4 |
| Detalhe do cliente | + Veículo | F04 (**sem código**, caminho desconhecido) | Não verificado |
| Criar cliente (C1 a C6) | só nome obrigatório | Política e V2: telefone e e-mail aceitam `NULL`. O trecho da F09 ("nome, CPF, telefone, email e endereço válidos") **não diz** quais são obrigatórios | Possível conflito (D5) |
| Criar cliente | telefone incompleto | Política: 10 ou 11 dígitos, validado na F09 | OK |
| Criar cliente | CPF inválido e CPF já cadastrado | F09, sem código | Não verificado |
| Criar cliente | e-mail inválido | Coluna `email` existe; validação de formato é esperada na F09 | **Falta frame** (G5) |
| Criar cliente | aviso de privacidade | Política, pendência P4: texto é da BUSSOLA, tela é da F03c e F35 | **Falta no protótipo** (G6) |
| Editar cliente (E1 a E3) | CPF inteiro no prefill | Depende de a F08 devolver o CPF inteiro | G3 |
| Editar cliente | salvar | `PUT /clientes/{id}` (F10, sem código). Esvaziar um campo opcional vira `NULL` ou erro? | Não verificado; pergunta para a F10 |
| Criar veículo (N1 a N5) | placa, marca, modelo | `placa` NOT NULL (10), `modelo` NOT NULL (100), `marca` NOT NULL (100) na V2 e na entidade (código) | OK |
| Criar veículo | ano, cor | Colunas existem e aceitam `NULL` (código) | OK |
| Criar veículo | quilometragem | Coluna existe e aceita `NULL` (código); **a tela não tem** | Endpoint sem campo; D14: fica fora |
| Criar veículo | placa nos dois padrões | F04, trecho `US-VEI-01`: placa `ABC1234` (padrão antigo). O protótipo mostra só o Mercosul (`ABC1D23`) | G7 |
| Criar veículo | ano inválido | Faixa de ano é validação esperada na F04 | **Falta frame** (G5) |
| Criar veículo | placa já cadastrada | **A V2 não tem `UNIQUE` em `veiculos.placa`** (código verificado) | G8, o achado mais grave |
| Detalhe do veículo (V1 a V5) | placa, marca, modelo, ano, cor | F04, sem código | Não verificado |
| Detalhe do veículo | nome do dono ("Cliente: ...") | O contrato do veículo não está lido | G9 |
| Detalhe do veículo | histórico de OS | **Não existe endpoint de OS** nem filtro por veículo | G10 e seção 5.5 |
| Editar veículo (M1 a M3) | trocar o dono | A tela não permite trocar o cliente | Decisão minha: `clienteId` imutável na edição (premissa 13). Confirmar na F04 |

### 5.3 Endpoints sem campo na tela, em resumo

1. `email` na lista: a busca casa e-mail, a tela não mostra.
2. `quilometragem` do veículo: fica fora do protótipo e da primeira entrega da F04 (D14); a coluna segue `NULL`.
3. `createdAt` do cliente: não é exposto (política) e nenhuma tela o pede. OK.

### 5.4 Lacunas e a decisão que proponho

| ID | Lacuna | Decisão ou pergunta | Dono |
|---|---|---|---|
| G1 | Telefone é opcional, mas o cartão só mostra telefone; cliente sem telefone quebra o cartão | **Decisão minha** (critério 16): mostrar o e-mail; se não houver nenhum dos dois, "Sem contato cadastrado". O DTO já devolve os dois | ESQUADRO desenha |
| G2 | Lista sem "carregar mais" nem "erro ao carregar mais" | **Decisão da pessoa** (D10) | Letícia |
| G3 | O detalhe mostra o CPF mascarado, mas a edição precisa do CPF inteiro. Se a F08 devolver o CPF já mascarado, a F10 não consegue pré-preencher | **Recomendo** (D11): a F08 devolve o CPF inteiro (a política já permite CPF no detalhe), o app mascara na exibição e mostra inteiro só na edição. Atenção: a máscara `***.*56.7**-**` é a **máscara de log** da política (6.2); para tela, o ESQUADRO e a Letícia confirmam se querem a mesma regra | CARTOGRAFO e VIGIA; Letícia aprova |
| G4 | Origem da lista de veículos no detalhe do cliente | O detalhe já traz os veículos ou a tela faz segunda chamada? Muda o "carregando" do detalhe (D13) | CARTOGRAFO ou ESPRESSO |
| G5 | Faltam frames de erro de **e-mail inválido** (cliente) e **ano inválido** (veículo) | **Decisão minha:** acrescentar ao C3 e ao N3, ou frames novos. Textos: "Informe um e-mail válido." e "Informe um ano válido." | ESQUADRO |
| G6 | Falta o aviso de privacidade (LGPD art. 9º, P4 da política) | **Decisão minha:** texto curto acima do botão, **sem caixa de aceite**, porque a base legal é execução de contrato e não consentimento. Texto na seção 6 | ESQUADRO desenha |
| G7 | Só o padrão Mercosul aparece | A dica ("ABC1D23 ou ABC1234") e a mensagem de placa inválida citam os dois padrões | ESQUADRO |
| G8 | **Placa única.** (a) A V2 não tem `UNIQUE`. (b) A política (seção 4, passo 3) anonimiza **todas** as placas com o **mesmo** texto `ANONIMO`, o que quebraria um `UNIQUE`. (c) O carro revendido volta com a mesma placa para outro cliente, e o bloqueio "placa já cadastrada" impede o novo dono de cadastrá-lo, sem saída na tela | **Decisão da pessoa (D9).** Opção 1: placa única global, com texto de anonimização único por veículo e orientação de falar com o ADMIN. Opção 2: unicidade só dentro do mesmo cliente. **Recomendo a 2**, para o balcão não travar; ela muda o critério 13 e a regra da F04. Em qualquer opção a F04 precisa de migration ou regra de service | Letícia decide; VIGIA e CARTOGRAFO ajustam |
| G9 | Nome do dono no cabeçalho do veículo | Na resposta do veículo, `clienteId` basta; o nome vem do detalhe do cliente já carregado | ESPRESSO e ORLA |
| G10 | Histórico de OS sem endpoint nem filtro por veículo | Seção 5.5 | REGENTE e PRUMO |
| G11 | A F04 reúne criar, editar e detalhe de veículo numa feature, e a regra de modularização da casa divide feature com mais de uma operação de escrita (F03a a F03d é o exemplo). Não li o escopo da F04 para confirmar | Só aponto (D15). Reescrever feature escrita à mão é com a pessoa | Letícia e REGENTE |
| G12 | Não consigo ver no quadro se a F26 declara dependência da F39 (premissa 10) | Conferir o campo de dependências da F26 | PRUMO |

Duplicidade: não encontrei sobreposição de escopo da F26 com F35 (código), F39 (baixa fidelidade) ou F28 (telas de OS). A F09 diz que a tela de criação fica na F35, e a F26 desenha essa mesma tela: é o protótipo que a F35 implementa, não duplicação.

### 5.5 Histórico de OS: estado antes da Sprint 04

**Confirmado** (código e quadro):

- Há entidade `OrdemServico` e tabela `ordens_servico`. **Não há** repositório, service, controller nem endpoint de OS (`controller/` só tem `AuthController` e `ClienteController`).
- F06 (lista), F18, F19, F20, F21 e F42 (front) estão **Bloqueadas**. F28 (protótipo de OS) está Pronta.
- Logo, até a Sprint 04 nenhum veículo tem OS: **o histórico do detalhe do veículo é sempre vazio** nas Sprints 02 e 03.

**Consequências:**

1. O frame **V2 (histórico vazio) é o único estado real** até a Sprint 04. O V1 (preenchido, com "Exemplo") é só demonstração do protótipo e **nunca** vai para o app como está: a etiqueta "Exemplo" não vira componente.
2. A F35 mostra o vazio **sem chamar endpoint nenhum**. Isso evita 404 e evita um estado de erro que não existe.
3. A F35 **não consegue provar o histórico preenchido contra API real**, só por teste de componente com dado de teste. A prova real é da feature que entregar o histórico.
4. O V1 mostra data, valor e status. `ordens_servico` na V2 tem `valor_total` e `status`, mas **não tem coluna de data** (achado A6 da política). Se o item mostra título ou descrição, também não há coluna (o mapeamento fala em "descrição do problema relatado"). Quem entregar o histórico precisa de migration aditiva.
5. A busca da F06a "por cliente ou veículo" parece ser por texto livre. Montar o histórico com a placa como termo traria OS de placas parecidas e poria a placa na query string, que a política restringe. **Recomendo** filtro por `veiculoId` na listagem de OS. Não alterei a F06 (feature escrita à mão).
6. Quem entrega o histórico de verdade **não está definido**: a F42 cobre só lista e criação de OS. Peço ao REGENTE e ao PRUMO uma fatia na Sprint 04 (seção 12). Não criei a feature, porque ela precisa do refinamento da Sprint 01.

### 5.6 Itens que saíram das telas e precisam de dono depois

- "Nova OS" a partir do cliente e do veículo (o `ux-ui-mapeamento.md` pede). Fica para F28 e F42, e o frame de detalhe volta a ter o botão. Divergência consciente do mapeamento.
- "Excluir cliente": fica fora; o descarte é por anonimização (política, seção 4), sem tela hoje (P2 da política).

## 6. LGPD: dados pessoais que as telas tocam

O protótipo usa só dado fictício. A coleta real começa na F03c e na F04. A tabela resume a política vigente (`docs/security/politica-dados-pessoais-cliente.md`, seções 2 a 4). Prazos e base legal são **hipótese do VIGIA**, a validar com a oficina (P1 da política); não os trato como definitivos.

| Campo | Aparece em | Obrigatório | Finalidade | Base legal (art. 7º) | Retenção (hipótese) |
|---|---|---|---|---|---|
| Nome | lista, detalhe, formulário | Sim | Identificar o cliente na OS e achá-lo no balcão | V (execução de contrato e etapas preliminares) | 5 anos após o último evento se houver OS; 12 meses se nunca houver OS |
| Telefone | lista, detalhe, formulário | Não | Avisar orçamento, valor final e veículo pronto | V | igual ao nome |
| E-mail | detalhe, formulário e, sem telefone, o cartão da lista (critério 16) | Não | igual ao telefone | V | igual |
| CPF | detalhe (mascarado) e edição | Não. Só quando o cliente pedir nota fiscal | Documento fiscal | II (obrigação legal) quando há nota; sem nota, não se coleta | igual ao cliente |
| Endereço | detalhe e formulário | Não | Nota fiscal, ou busca e entrega do veículo | II ou V | igual ao cliente |
| Placa | detalhe do cliente, detalhe e formulário do veículo | Sim | Identificar o veículo atendido (identifica o dono de forma indireta) | V | igual ao cliente |
| Marca, modelo, ano, cor | formulário e detalhe do veículo | marca e modelo sim; ano e cor não | Execução do serviço | V | mantidos na anonimização |

Regras da política que valem para as telas (seções 6 e 7):

- Dado só em memória no app; nada em disco; limpar no logout.
- Campo de busca sem histórico de teclado (`autoComplete="off"`, `autoCorrect` desligado).
- Mensagens de duplicidade não revelam outro cliente (já assim no protótipo).
- Capturas e fixtures só com dado inventado.

**Aviso de privacidade (P4 da política), texto proposto por mim, rascunho a validar:**

> "Usamos seu nome, telefone e e-mail só para atender seu veículo e avisar sobre orçamento e serviço. CPF e endereço só se você pedir nota fiscal. Para corrigir ou apagar seus dados, fale com a oficina."

O texto não cita prazo de retenção, porque o prazo ainda é hipótese. O canal do titular (P3 da política) continua pendente da Letícia. Revisão jurídica do texto não bloqueia a F26: o frame leva o rascunho, e a F03c e a F35 usam o texto final.

## 7. Premissas e dúvidas

### Premissas

1. Todo dado pessoal nas telas é fictício. Padrão: e-mails em `@example.com`, telefones `(11) 90000-0000`, CPF **com dígito verificador inválido** (`123.456.789-00`).
2. O histórico de OS usa dados fictícios com a etiqueta "Exemplo", porque o módulo de OS só nasce na Sprint 04. Até lá o único estado real é o vazio (seção 5.5).
3. A aprovação segue o rito de F25 e F34 (ADR-007): revisão e aprovação explícita antes de o front começar.
4. O link do Figma é compartilhável só com a equipe do projeto.
5. Só viewport de smartphone.
6. Quem aprova é a Product Owner (Letícia), sem outra aprovação.
7. Mensagens de erro de negócio (CPF, placa) seguem F09 e F04. Se divergirem, o ajuste vira correção em uma das duas.
8. Se a estimativa passar de 3 dias, a feature se divide em Clientes (4 telas) e Veículos (3 telas). O foco desenhado em todos os controles (C4a) é o item que mais pode estourar.
9. Se o MCP do Figma estiver bloqueado, o bloqueio é registrado com a saída real e a feature não é dada como pronta.
10. A feature espera a F39 (decisão anterior da Letícia). A D8 reabre essa premissa.
11. O telefone é **opcional**, como manda a política do VIGIA e a V2 (`telefone NULL`). A referência marcava como obrigatório; o protótipo segue a política.
12. A quilometragem do veículo fica fora desta entrega (D14).
13. `clienteId` do veículo não muda na edição.

### Dúvidas em aberto e decisões

D1 a D7 seguem a numeração do doc do ESQUADRO; D8 em diante são novas.

| # | Pergunta | Estado | Decisão ou recomendação | Quem decide |
|---|---|---|---|---|
| D1 | Quem entrega o link de referência | **Fechada** | O link existe (`FPdB8RymAnN81pbKfizdzE`). Resta a aprovação da F39 (D8) | — |
| D2 | Seção no mesmo arquivo ou arquivo novo | **Aberta** (feita: seção `106:2097` no mesmo arquivo) | Confirmo a sugestão: mesmo arquivo, porque tokens e componentes vivem lá | Letícia confirma |
| D3 | CPF completo ou mascarado | **Aberta** (feita: mascarado no detalhe, inteiro só na edição) | Confirmo a sugestão, sujeita à G3 | Letícia confirma |
| D4 | Sair do formulário com alteração pede confirmação? | **Fechada por BUSSOLA** | **Sim.** Com alteração, a seta Voltar e o Cancelar abrem "Descartar alterações?" com "Continuar editando" (primário, foco inicial) e "Descartar". Sem alteração, sai direto. Motivo: no balcão o atendente é interrompido e perderia o que digitou. Critério 17 | ESQUADRO registra no doc |
| D5 | Telefone opcional contra a referência obrigatória | **Fechada por BUSSOLA**, falta confirmar com a F09 | Opcional, pela política e pela V2. **Risco aceito:** cliente sem telefone e sem e-mail não pode ser avisado. Pergunta: o texto da F09 (que não li inteiro) diz o mesmo? | Quem tem a F09 |
| D6 | CNPJ: a oficina atende empresa? | **Fechada com padrão reversível** | F26 e F09 ficam **só com CPF**. CNPJ exige campo, validação e base legal próprios. Se a oficina responder "sim", reabre: o rótulo vira "CPF/CNPJ" e F09 e F26 mudam | Letícia pergunta no balcão |
| D7 | Sucesso, "Nova OS" e exclusão | **Fechada por BUSSOLA** | Sucesso mantido; "Nova OS" sai e volta com F28 e F42 (seção 5.6); exclusão fora | — |
| D8 | **Base dos frames: FPdB8 ou esperar a F39?** | **Aberta, decisão da pessoa** | **Recomendo aceitar a FPdB8** com condição: quando a F39 for aprovada, o ESQUADRO compara o baixa de Clientes e Veículos com os 33 frames e refaz **só** os que divergirem. Motivo: F39 e F26 seguem a mesma inspiração e esperar trava a F35 sem data. **Risco:** se a F39 mudar muito, o retrabalho cai nos 33 frames. Sem essa decisão a F26 não pode ser aprovada | Letícia |
| D9 | Placa única: global, por cliente ou sem unicidade? E o carro revendido? | **Aberta, decisão da pessoa** | Ver G8. Recomendo unicidade **por cliente** | Letícia; VIGIA e CARTOGRAFO implementam |
| D10 | Lista: "carregar mais" | **Aberta, decisão da pessoa** | Recomendo rolagem infinita com dois estados de rodapé (carregando mais; erro com tentar novamente), 2 frames novos. Alternativa: `size=100` fixo e aviso "refine a busca" quando houver mais de 100 | Letícia |
| D11 | CPF no detalhe: a API devolve inteiro e o app mascara? | **Aberta** | Recomendo que sim (G3) | CARTOGRAFO e VIGIA |
| D12 | O identificador do Figma está no histórico git local. Reescrever os 2 commits antes do primeiro push, ou só apagar as linhas? | **Aberta, decisão da pessoa** | Recomendo reescrever: a branch não foi publicada e é grátis agora | Letícia |
| D13 | A lista de veículos do cliente vem no detalhe (F08) ou de chamada própria (F04)? | **Aberta** | Muda o "carregando" do detalhe do cliente só se for chamada separada | CARTOGRAFO ou ESPRESSO |
| D14 | Quilometragem do veículo | **Fechada por BUSSOLA** | Fora do protótipo e da primeira entrega da F04; a coluna fica sem uso | — |
| D15 | A F04 deve ser fatiada (criar, editar, detalhe)? | **Aberta** | Só aponto (G11) | Letícia e REGENTE |
| D16 | Quem entrega o histórico de OS preenchido e o "Nova OS"? | **Aberta** | Fatia nova na Sprint 04 (seções 5.5 e 12) | REGENTE e PRUMO |

## 8. Roteiros

### 8.1 Percurso do critério 3 (modo Present)

O doc do ESQUADRO diz que o grafo foi lido por script e que ninguém percorreu em Present. Quem percorrer registra, por passo, a tela que realmente abriu.

| Passo | Ação | Esperado |
|---|---|---|
| 1 | Present a partir de L4 | Carregando e, **sozinho**, L1 em cerca de 1,5 s |
| 2 | L1: cartão de um cliente | D2 (carregando) e depois D1 sozinho |
| 3 | D1: "+ Veículo" | N1 (formulário vazio) |
| 4 | N1: seta Voltar | D1 |
| 5 | D1: "Editar" | E1 (preenchido) |
| 6 | E1: Voltar ou Cancelar | D1 |
| 7 | D1: primeiro veículo | V3 (carregando) e depois V1 (histórico preenchido, com "Exemplo") |
| 8 | V1: "Editar" | M1 |
| 9 | M1: Voltar ou Cancelar | V1 |
| 10 | D1: segundo veículo | V3 e depois V2 (histórico vazio) |
| 11 | D1: tecla 3 | D3 (erro) com "Tentar novamente" e "Voltar" |
| 12 | L1: tecla 3 | L5 (erro) com "Tentar novamente" (vai a L4) e "Voltar" (vai ao Perfil, após a correção) |
| 13 | Em cada tela visitada | Há caminho de volta. Sem destino por decisão: botão do perfil no cabeçalho da lista, abas de outros módulos e itens do histórico de OS |

### 8.2 CPF nos frames (critério 8)

- Todos os frames: `123.456.789-00` (dígito verificador inválido).
- C4 (CPF inválido): outro valor inválido, por exemplo `123.456.789-10`.
- C5 (CPF já cadastrado): a anotação do frame diz que o valor é de exemplo e que, na API, a duplicidade só é checada **depois** da validação do dígito. Sem essa nota o frame contradiz a regra de validação. É limitação do protótipo, aceita.
- A máscara de tela não muda: `***.*56.7**-**` mostra os mesmos 3 dígitos do meio.

### 8.3 Teste de link restrito (critério 10), para a Letícia

1. No Figma, ajustar o acesso do arquivo para só pessoas convidadas e copiar o link de visualização do protótipo.
2. Abrir em **janela anônima**, sem login. Registrar o que apareceu (esperado: pedido de login ou de acesso, sem ver os frames).
3. Abrir com **uma conta que não é da equipe**. Mesmo registro.
4. Abrir com uma conta da equipe. Esperado: abre.
5. Gravar no doc da F26 a data e os três resultados em texto, **sem e-mail nem identificador de conta**. Pergunta aberta: quantas pessoas formam "a equipe do projeto"? Basta a contagem.

## 9. Critérios de aceitação (Gherkin)

Os IDs 1 a 14 são os da feature, com a intenção mantida e o que a revisão mostrou impreciso apertado. Os critérios 15 a 19 são novos. O que depende de decisão da Letícia está marcado.

**US-PROTO-CLV-01 · Cobertura de telas e tokens**

```gherkin
Cenário: as 7 telas existem com tokens aplicados
  Dado as 7 telas de Clientes e Veículos
  Quando o protótipo é entregue
  Então cada tela tem frame de alta fidelidade
  E cor e tipografia vêm de variável ou estilo do arquivo, com petro e primary por variável
  E o doc registra a contagem de frames da seção 106:2097 e a contagem de cores ligadas a variável, refeita depois do religamento dos indicadores
```

**US-PROTO-CLV-02 · Quatro estados**

```gherkin
Cenário: estados por tipo de tela
  Dado uma tela do protótipo
  Quando reviso seus estados
  Então a lista mostra vazio, vazio de busca, carregando, erro e preenchido
  E o detalhe mostra carregando, erro e preenchido, e o detalhe do veículo também o histórico vazio e preenchido
  E o formulário mostra vazio (criar), preenchido (editar), salvando e erro
```

**US-PROTO-CLV-03 · Navegação sem beco sem saída**

```gherkin
Cenário: percurso completo
  Dado o protótipo publicado
  Quando percorro em modo Present, a partir de L4, o roteiro da seção 8.1
  Então cada ação leva à tela correta
  E toda tela tem caminho de volta
  E o carregando avança sozinho
  E todo estado de erro oferece "Tentar novamente" e "Voltar"
  E o registro traz a tela que realmente abriu em cada passo, inclusive o que não abriu

Cenário: erro da lista
  Dado o frame L5 (erro ao carregar a lista)
  Quando toco em "Voltar"
  Então vou ao Perfil
  E "Tentar novamente" continua indo a L4
```

**US-PROTO-CLV-04 · Contraste e foco**

```gherkin
Cenário: contraste
  Dado uma tela do protótipo
  Quando meço os textos e os componentes
  Então texto normal tem 4,5:1 ou mais
  E texto grande e componentes de interface têm 3:1 ou mais
  E quem tem acesso ao Figma reproduz a medição (relato do ESQUADRO: texto 4,68:1, ícone 3,56:1)

Cenário: foco visível por controle
  Dado cada controle navegável de cada frame
  Quando abro o frame
  Então existe o estado de foco desenhado para aquele controle, no padrão da folha 113:2666
  E a ordem de foco está anotada no frame
```

**US-PROTO-CLV-05 · Aprovação**

```gherkin
Cenário: aprovação registrada
  Dado o protótipo completo e as pendências da seção 3 fechadas
  Quando a Letícia revisa e aprova explicitamente
  Então a data, o link aprovado e a decisão da D8 ficam na seção 10 deste PRD
  E o front do módulo (F35) pode começar
```

**US-PROTO-CLV-06 · Reprovação**

```gherkin
Cenário: pendência impede a aprovação
  Dado o protótipo com tela, estado ou token pendente
  Quando a Letícia revisa
  Então a entrega não é aprovada
  E a F35 não inicia até a reapresentação ser aprovada
```

**US-PROTO-CLV-07 · Base dos frames (depende da D8)**

```gherkin
# Versão original: vale se a Letícia decidir esperar a F39
Cenário: bloqueio sem base aprovada
  Dado que o redesenho da F39 não está aprovado
  Quando o protótipo é iniciado
  Então a feature fica bloqueada até a F39 ser aprovada
  E as telas de Clientes e Veículos do wireframe aprovado são a base de cada frame

# Versão alternativa: vale se a Letícia aceitar a FPdB8 como base
Cenário: base na referência com conferência posterior
  Dado que a Letícia aceitou a referência FPdB8 como base em <data>
  Quando o protótipo é montado a partir dela
  Então a decisão está registrada neste PRD e no doc de design
  E, quando a F39 for aprovada, o ESQUADRO compara o baixa de Clientes e Veículos com os frames
  E refaz somente os frames que divergirem, registrando a lista
```

**US-PROTO-CLV-08 · Dado fictício**

```gherkin
Cenário: dados inventados
  Dado qualquer tela com nome, CPF, telefone, e-mail ou endereço
  Quando reviso o conteúdo
  Então todos os e-mails terminam em @example.com
  E todos os telefones seguem o padrão (11) 90000-0000
  E nenhum CPF tem dígito verificador válido (123.456.789-00 e variações)
  E nomes, placas, endereços e valores do histórico foram substituídos por valores inventados
  E o doc registra que a origem é inventada, sem listar o valor antigo
```

**US-PROTO-CLV-09 · Histórico de OS de exemplo**

```gherkin
Cenário: itens do histórico
  Dado o detalhe do veículo com histórico preenchido
  Quando reviso os itens
  Então cada item é fictício, tem o rótulo visível "Exemplo" e não abre a OS
  E a anotação do frame diz que a etiqueta "Exemplo" existe só no protótipo
```

**US-PROTO-CLV-10 · Link restrito**

```gherkin
Cenário: acesso sem ser da equipe
  Dado o link de visualização do protótipo restrito à equipe
  Quando abro em janela anônima e com uma conta fora da equipe
  Então não consigo acessar o arquivo
  E o doc registra a data e o resultado dos dois testes e o de uma conta da equipe, sem e-mail nem identificador de conta
```

**US-PROTO-CLV-11 · Erro de formulário acessível**

```gherkin
Cenário: erro por campo
  Dado um campo inválido em criar ou editar
  Quando o erro é exibido
  Então há texto da mensagem junto ao campo e ícone
  E o rótulo do campo continua visível
  E o frame anota que o erro é anunciado por leitor de tela
```

**US-PROTO-CLV-12 · Alvo de toque**

```gherkin
Cenário: área de toque
  Dado qualquer controle interativo
  Quando meço a área de toque
  Então ela tem no mínimo 44 x 44 pt
  E a medição é reproduzida no Figma, com atenção aos botões de cabeçalho (visual de 36 pt) e aos cartões da lista
```

Requisito para o código (F35): o botão de cabeçalho de 36 pt precisa de área de toque de 44 pt (`hitSlop` ou equivalente), porque o frame transparente do protótipo não existe no app.

**US-PROTO-CLV-13 · Erros de negócio nos formulários**

```gherkin
Cenário: erros desenhados
  Dado o formulário de cliente e o de veículo
  Quando reviso os estados de erro
  Então estão desenhados: campo obrigatório vazio, telefone incompleto, e-mail inválido, CPF inválido, CPF já cadastrado
  E, no veículo: placa inválida citando os dois padrões, ano inválido e placa já cadastrada (regra da placa depende da D9)
  E o editar anota que reaproveita as mesmas mensagens
```

**US-PROTO-CLV-14 · Registro no repositório**

```gherkin
Cenário: documento e histórico limpos
  Dado a entrega concluída
  Quando consulto o repositório
  Então o doc em docs/design traz o link, a data de aprovação e as decisões das dúvidas 4 e 6
  E o doc não traz user_id nem identificador de sessão do Figma
  E git log --format=%B na branch não retorna linha com Co-authored-by
```

**US-PROTO-CLV-15 · Aviso de privacidade (novo)**

```gherkin
Cenário: aviso no cadastro
  Dado o formulário de criar cliente
  Quando abro o frame vazio
  Então o texto do aviso da seção 6 aparece abaixo dos campos e acima do botão
  E não há caixa de aceite
  E o texto tem contraste de 4,5:1 e a ordem de foco e leitura o coloca antes do botão salvar
```

**US-PROTO-CLV-16 · Cartão sem telefone (novo)**

```gherkin
Cenário: cliente com e-mail e sem telefone
  Dado um cliente sem telefone e com e-mail
  Quando vejo o cartão na lista
  Então o cartão mostra o e-mail no lugar do telefone

Cenário: cliente sem telefone nem e-mail
  Dado um cliente sem os dois contatos
  Quando vejo o cartão na lista
  Então o cartão mostra o texto "Sem contato cadastrado"
  E a altura e a área de toque do cartão não mudam
```

**US-PROTO-CLV-17 · Descartar alterações (novo, D4)**

```gherkin
Cenário: sair com alteração
  Dado um formulário de criar ou editar com alteração não salva
  Quando toco em Voltar ou em Cancelar
  Então abre o diálogo "Descartar alterações?" com "Continuar editando" e "Descartar"
  E o foco inicial está em "Continuar editando"
  E "Descartar" volta à tela de origem e "Continuar editando" fecha o diálogo

Cenário: sair sem alteração
  Dado um formulário sem alteração
  Quando toco em Voltar
  Então volto à tela de origem sem diálogo
```

O diálogo é um componente único, com uma cópia por origem (C, E, N e M) para o destino de "Descartar" ficar correto no protótipo. Basta ligar a partir de um quadro com dado digitado por formulário (C3, E3, N3, M3).

**US-PROTO-CLV-18 · Histórico vazio é o estado real até a Sprint 04 (novo)**

```gherkin
Cenário: anotação do estado real
  Dado o frame V2 (histórico de OS vazio)
  Quando reviso as anotações
  Então o frame diz que é o único estado real até a Sprint 04 e que o app não chama endpoint de OS
  E o vazio não oferece "Nova OS" enquanto a F28 não existir no app
```

**US-PROTO-CLV-19 · Aviso de sucesso anunciado (novo)**

```gherkin
Cenário: sucesso nos frames L6, D4, D5 e V5
  Dado o aviso de sucesso depois de salvar
  Quando o aviso aparece
  Então tem texto e ícone, sem depender só da cor
  E a anotação diz que o leitor de tela o anuncia sem mover o foco
  E a anotação diz que, no app, o aviso fica visível por no mínimo 5 segundos ou até ser dispensado
```

A volta automática em 3 s é só do protótipo e não vira regra do app.

## 10. Registro de aprovação

**Vazio de propósito.** Nenhuma aprovação foi dada e nenhuma foi registrada em nome da Letícia.

| Item | Valor |
|---|---|
| Data da aprovação | — |
| Link do protótipo aprovado | — (preencher só após a aprovação; link restrito à equipe, critério 10) |
| Quem aprovou | — |
| Decisão da D8 (base) | — |
| Decisões das D9, D10, D11 e D12 | — |
| Teste de link restrito (critério 10) | — |
| Percurso em modo Present (seção 8.1) | — |

Enquanto a tabela estiver vazia, a F35 **não abre**.

## 11. Tarefas

| # | Tarefa | Estado depois desta revisão |
|---|---|---|
| 1 | Confirmar a F39 aprovada | **Reaberta**: não está aprovada (T1) |
| 2 a 9 | Conferência, montagem, estados, fluxo, dados fictícios, contraste | Feitas pelo ESQUADRO segundo o relato dele, **sujeitas** a C1, C3a, C4a, C8a e C8b. Não verifiquei no Figma |
| 10 | Restringir o link e testar | Aberta; Letícia (seção 8.3) |
| 11 | Registrar link, data e decisões em docs/design | Aberta; ESQUADRO, depois da aprovação. As decisões D4 e D6 já estão fechadas aqui |
| 12 | Commits em Conventional Commits sem coautor | Feita até aqui. Conferi: 0 linhas `Co-authored-by` em `git log main..docs/f26-prototipo-clientes-veiculos` |
| 13 | Apresentar à Letícia e registrar aprovação ou pendência | Pendência **registrada** (seções 3 e 10); a apresentação aguarda a resposta dela |

## 12. Pedidos a outros donos (sem criar feature em nome deles)

- **ESQUADRO:** (1) tudo o que o critério 1 a 19 pede de novo, em ordem de custo: CPF `-00`, nomes e placas inventados, remoção das linhas 31 e 34 do doc, "Voltar" no L5, e-mail e ano inválidos, aviso de privacidade, cartão sem telefone, diálogo de descarte, anotação do V2 e do sucesso, foco por controle; (2) refazer a contagem de cores ligadas; (3) **confirmar no Figma a lista de campos de cada uma das 7 telas**, porque a matriz da seção 5.2 foi feita sem abrir o Figma; (4) registrar D4 e D6 no doc.
- **CRIVO:** reproduzir no Figma a contagem de 33 frames, o contraste (4,68:1 e 3,56:1) e o alvo de toque de 44 x 44 pt; conferir o roteiro 8.1 se a Letícia não o fizer.
- **REGENTE e PRUMO:** rascunho de objetivo para uma fatia nova na Sprint 04, a refinar no padrão da Sprint 01: "Histórico de OS no detalhe do veículo e atalho Nova OS". Cobre filtro por `veiculoId` na listagem de OS, data de abertura em migration aditiva (A6), front do histórico com carregando e erro da seção, link do item para o detalhe da OS (frame da F28) e o botão "Nova OS" nos detalhes de cliente e veículo. Depende de F06, F18, F28 e F35.
- **REGENTE:** corrigir o status da F39 no quadro ("Concluída" sem aprovação registrada no PRD) e responder à D15.
- **PRUMO:** conferir se a F26 declara dependência da F39 (G12).
- **VIGIA:** trocar o CPF de exemplo `123.456.789-09` por `123.456.789-00` na seção 6.2 da política e opinar sobre G3 e G8.
- **CARTOGRAFO e ESPRESSO:** responder D11 e D13; confirmar a D5 contra o texto da F09.
- **README principal:** sem mudança. Esta entrega só altera documentos em `docs/` e não muda como instalar, rodar, testar ou configurar o projeto.

## 13. Registro desta revisão

| Data | Autor | O quê |
|---|---|---|
| 2026-11-17 | BUSSOLA | PRD criado a partir da revisão humana das 14:33. Revisão contra os contratos. Decisões D4, D5, D6, D7 e D14. Critérios 15 a 19 novos. **Sem acesso ao Figma nesta etapa:** nenhuma contagem, medição ou texto de frame foi conferido por mim |
