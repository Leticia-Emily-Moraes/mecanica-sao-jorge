# PRD — F03b: Clientes, detalhe (card F08)

- Prioridade: P1
- Área no card: Full-stack. **Se a decisão D-A for confirmada, passa a Backend** (a tela vai para a F35).
- Sprint: Sprint 02: Clientes e Veículos
- Autora: BUSSOLA (Product Owner)
- Data: 2026-11-17
- Etapa da rota: **BUSSOLA (1/5)** → CARTOGRAFO → VIGIA → ESPRESSO → CRIVO
- Depende de: F00, F02, F03a (card F03, já na `main`). Bloqueia: F03c (card F09), F03d (card F10), F35.
- Estado: **PRD fechado para a rota, com 5 decisões abertas da pessoa (seção 7).** Cada uma tem padrão adotado, para a rota não parar. Nada aqui foi aprovado em nome dela.

> **Como ler.** Separo o que li e rodei do que suponho. Esta etapa é documento: **não rodei código nem teste.** Li o repositório na `origin/main` (b1f29fc, após `git fetch`), incluindo `V1` a `V3`, o `GlobalExceptionHandler`, o `ClienteController`, `MascaraDadoPessoal`, `http-client.ts` e `use-auth.tsx`. O card da F35 e o do F08 não existem como arquivo; o que digo da F35 vem do panorama do briefing. Não abri o Figma; o que cito dos frames vem de `docs/design/F26-prototipo-clientes-veiculos.md`.

## 1. Visão e histórias

Quem atende no balcão abre um cliente já encontrado na lista (F03a) e vê o cadastro completo: nome, CPF, telefone, e-mail e endereço. Hoje isso é caderno. A feature entrega o contrato da API de detalhe e a migration das colunas que faltam; a tela de detalhe fica na F35 se a pessoa confirmar (D-A).

- **H1.** Como **atendente da oficina**, quero abrir o cadastro completo de um cliente, para confirmar telefone e endereço no balcão sem procurar papel.
- **H2.** Como **atendente**, quero que o CPF apareça só parcialmente na tela, para não expor o documento inteiro a quem olha por cima do meu ombro.
- **H3.** Como **responsável pela oficina (controladora, LGPD)**, quero que CPF, telefone e demais dados pessoais nunca apareçam em log, para um vazamento de log não virar vazamento de cadastro.
- **H4.** Como **app mobile (F35 e F03d)**, quero um contrato estável de `GET /api/v1/clientes/{id}`, para montar o detalhe e pré-preencher a edição sem adivinhar campo.

Tamanho (INVEST): backend (migration, DTO, service, controller, testes) cabe em ~2 dias; a tela, em ~2 a 3. Por isso o corte da seção 4 não é só organização: cada metade cabe sozinha no limite de 3 dias.

## 2. Escopo

### Dentro (backend, sempre nesta feature)
- `GET /api/v1/clientes/{id}` devolvendo `ClienteDetalheResponse` (nome sugerido; CARTOGRAFO confirma): `id`, `nome`, `cpf`, `telefone`, `email`, `endereco`. Nunca a entidade; `createdAt` não sai.
- Migration Flyway **V4** aditiva com `clientes.cpf` e `clientes.endereco`, ambas `NULL`, e a atualização da linha na matriz de `docs/architecture/overview.md` (verificado: não existem nem na V2 nem na V3; ver seção 7, D-B e D-D).
- 404 (id inexistente), 400 (id inválido) e 401 (sem token) no formato `timestamp`, `status`, `erro`, `mensagem`, `path`.
- Linha de log do acesso sem dado pessoal; documentação no OpenAPI; testes de service, controller e integração.

### Dentro (tela, **se D-A for negada**; senão vai para a F35)
Tela de detalhe com carregando, erro, não encontrado e preenchido; CPF mascarado; "Não informado" via i18n `clientes.detalhe.*`; serviço e hook próprios; componentes e tokens centralizados.

### Fora
- Criar e editar (F03c, F03d); excluir e inativar (a política descarta por anonimização, não por exclusão).
- Lista de veículos do cliente e histórico de OS (F04, módulo de OS). O `ClienteDetalheResponse` **não traz `veiculos`** (padrão adotado de D-E).
- Máscara de CPF no backend: a API devolve o CPF inteiro porque a edição precisa dele (G3 da F26).
- Validar dígito verificador do CPF na leitura (é da F03c, na escrita).
- Perfil de permissão: qualquer usuário autenticado acessa (briefing e achado A3 da política).

### Fica para depois (priorização)
1. Atalho para veículos e botão "+ Veículo" no detalhe (F04; o protótipo F26 D1 já os desenha).
2. Rotina de anonimização por prazo (P2 da política; decisão da pessoa sobre a feature).
3. CNPJ (fechado na F26 como "só CPF por enquanto").

## 3. Glossário

- **Detalhe**: leitura de um cliente por id, com todos os campos de cadastro. Diferente da **lista** (F03a), que traz só `id`, `nome`, `telefone`, `email`.
- **Máscara de tela**: formatação do CPF para exibição no app. **Máscara de log**: `MascaraDadoPessoal` (política, seção 6.2.1). Hoje são duas regras diferentes; D-C propõe unificar.
- **Anonimizado**: cliente cujo nome virou `Cliente anonimizado` e cujos demais campos pessoais viraram `NULL` (política, seção 4).
- **Handler global**: `GlobalExceptionHandler` e `RestAuthenticationEntryPoint`; formato de erro do ADR-011.

## 4. Reparticionamento F08 × F35 (aguarda confirmação: D-A)

**Instrução do REGENTE:** depois que a pessoa confirmar, mover US-CLI-DET-01 e os estados de tela para a F35. **A condição não foi cumprida nesta sessão, então não apliquei.** Dois motivos: (1) falta a confirmação; (2) pelo briefing, features já escritas das Sprints 02 a 05 só são refinadas pela pessoa, e a F35 é uma delas. Por isso o texto da F35 está pronto na seção 10 e **não foi aplicado**.

Duplicação apontada: a tela de detalhe consta hoje na F08 e no objetivo da F35 (e a F26 desenha o protótipo para a F35 implementar).

A frase do REGENTE nomeia 01 e "os estados de tela". Os critérios de API, de log e de migração não são citados; **não podem ficar sem dono**, em especial o de log (LGPD). Proposta:

| Critério | Assunto | Fica em | Resposta HTTP / campos do contrato |
|---|---|---|---|
| US-CLI-DET-02 | contrato 200 | F08 | 200; `id, nome, cpf, telefone, email, endereco` |
| US-CLI-DET-04 | id inexistente | F08 | 404; `timestamp, status, erro, mensagem, path` |
| US-CLI-DET-05 | id não numérico | F08 | 400; mesmos 5 campos de erro |
| US-CLI-DET-06 | sem token | F08 | 401; mesmos 5 campos de erro |
| US-CLI-DET-11 | log sem dado pessoal | F08 | 200, 404, 400, 401 e 500 |
| US-CLI-DET-13 | id zero, negativo ou estoura `Long` | F08 | 400 |
| US-CLI-DET-14 | opcionais nulos | F08 | 200; `cpf, telefone, email, endereco` = `null` |
| US-CLI-DET-15 | cliente anonimizado | F08 | 200; `nome` = `Cliente anonimizado`, demais `null` |
| US-CLI-DET-16 | migration V4 | F08 | 200 de cliente pré-existente com `cpf` e `endereco` `null` |
| US-CLI-DET-17 | OpenAPI | F08 | 200, 400, 401, 404, 500 |
| US-CLI-DET-01 | detalhe preenchido na tela | **F35** | consome o 200 do 02 |
| US-CLI-DET-03 | opcionais ausentes na tela | **F35** | consome o 200 do 14 |
| US-CLI-DET-07 | carregando | **F35** | antes do 200 |
| US-CLI-DET-08 | erro de rede ou servidor | **F35** | falha de rede ou 500 |
| US-CLI-DET-09 | cliente não encontrado | **F35** | consome o 404 do 04 |
| US-CLI-DET-10 | CPF fora do formato | **F35** | consome 200 com `cpf` inválido |
| US-CLI-DET-12 | acessibilidade | **F35** | consome o 200 |
| US-CLI-DET-18 | sessão expirada | **F35** | consome o 401 do 06 |

Se D-A for **negada**, as oito linhas "F35" voltam para esta feature e nada mais muda. Os critérios da seção 8 já citam status e campos nos dois casos.

Tarefas (numeração do card): ficam na F08 as 1 a 7 e 13, mais README, OpenAPI, migration e a parte de API da 12. Vão para a F35 as 8 a 11 e a parte de app da 12.

## 5. Premissas (numeradas)

1. **Id numérico positivo.** Tipo `Long` (chave `BIGINT UNSIGNED` da V2). Não numérico, zero, negativo ou acima de `Long.MAX_VALUE` responde 400, nunca 404. *Zero e negativo são acréscimo meu ao card; custam uma anotação `@Positive`.*
2. **JWT herdado da F02.** O endpoint não entra em `PUBLIC_PATHS`; sem token válido a resposta é 401 antes de qualquer consulta ao cliente. Verificado por leitura: `anyRequest().authenticated()` e `RestAuthenticationEntryPoint` já existem.
3. **404 por exceção de domínio nova.** Hoje o handler só tem `AppError` (que vira 422). Precisa de um tipo próprio de "não encontrado" que o handler global mapeia para 404 com **mensagem fixa**, sem id e sem dado pessoal (nome sugerido: `ClienteNaoEncontradoException`; CARTOGRAFO confirma).
4. **400 de id inválido já está coberto** pelo handler de `MethodArgumentTypeMismatchException` e `HandlerMethodValidationException`, que citam só o nome do parâmetro, nunca o valor (verificado no código; falta o teste para esta rota).
5. **CPF trafega inteiro e só com dígitos**, como gravado, no detalhe e só nele (política, seção 2). **Telefone também sai como gravado** (`ClienteListResponse` já documenta "só dígitos"); a formatação `(11) 91234-5678` é da tela. Se o telefone gravado não tiver 10 ou 11 dígitos, a tela mostra como veio.
6. **Mensagem de erro nunca repete dado pessoal** e nunca o valor rejeitado.
7. **Log do acesso:** uma linha INFO por chamada com sucesso, só com `clienteId` e `usuarioId` (quem leu, para rastrear extração de CPF), no padrão da seção 6.3 da política. Nunca nome, e-mail, endereço, CPF (nem mascarado), telefone ou corpo. **VIGIA confirma se a linha deve existir.** Se preferir nenhuma linha, o critério 11 continua valendo sem a parte da linha do 200.
8. **Máscara de log é a da política** (6.2.1: telefone só os 4 últimos; CPF `***.*56.7**-**`), não a do card. Ver seção 9, divergência 1.
9. **Cliente anonimizado é lido normalmente**, sem erro especial (política, seção 4).
10. **`Cache-Control` com `no-store`** na resposta do detalhe, por carregar CPF. O Spring Security já o envia por padrão; **não verifiquei** que `SecurityConfig` não o desliga. O teste de controller prova ou reprova.
11. **O app já trata 401** (verificado: `fetchAutenticado` lança `SessaoExpiradaError` e `useAuth.tratarSessaoExpirada` apaga o token e volta ao login com aviso). O mecanismo existe, mas **nenhuma tela autenticada o consome ainda**; a F35 precisa chamá-lo (critério 18).
12. **Dado de teste fictício.** CPF `12345678900` tem dígito verificador inválido de propósito (um CPF válido pode ser de pessoa real; a F26 adotou o mesmo critério). Por isso a fixture entra por SQL ou `JdbcTemplate`, não por `POST` (a F03c vai rejeitá-lo).

## 6. Dados pessoais

| Dado | Finalidade | Base legal | Retenção | Observação |
|---|---|---|---|---|
| `nome` | identificar o cliente no atendimento | art. 7º, V | política, seção 3 (R1: 5 anos após o último evento; R2: 12 meses sem OS) | existe (V2) |
| `telefone` | contato sobre orçamento e veículo pronto | art. 7º, V | idem | existe (V2); sai completo no detalhe e na tela |
| `email` | idem | art. 7º, V | idem | existe (V2) |
| `cpf` | emissão de documento fiscal, **só quando o cliente pedir nota** | **art. 7º, II** (obrigação legal fiscal) | idem (R4: segue o cliente) | **coluna nova (V4)**. Sai inteiro só no detalhe; nunca na lista nem em log |
| `endereco` | nota fiscal ou busca e entrega do veículo | art. 7º, II (nota) ou V (busca e entrega) | idem | **coluna nova (V4)** |

- **Descarte:** anonimização (política, seção 4), nunca `DELETE`. `cpf` e `endereco` viram `NULL`.
- **Mínimo:** o detalhe expõe só o que a tela e a edição usam; sem `createdAt` e sem veículos.
- **Log e teste:** sem dado pessoal em log (critério 11); fixtures com nomes e números inventados; sem captura de dado real.
- **Aviso de privacidade ao cliente (P4 da política):** é da F03c e da F35, no cadastro; não bloqueia esta leitura.
- **Antes da migration V4:** o VIGIA aprova as linhas de `cpf` e `endereco` da política, que hoje estão como **proposta** (regra de coleta, seção 2 da política).

## 7. Dúvidas e decisões em aberto

Cada item tem **padrão adotado** para a rota seguir. Mudar o padrão depois de o ESPRESSO começar custa retrabalho de migration e DTO.

| ID | Pergunta | Quem decide | Padrão adotado |
|---|---|---|---|
| **D-A** | Confirma mover a tela (critérios 01, 03, 07, 08, 09, 10, 12, 18) para a F35, ou leitura literal (F08 só com 02 e 04)? Não recomendo a literal: 05, 06 e 11 ficariam sem dono | **Pessoa** | **Não movido.** Tudo fica na F08 até a confirmação |
| **D-B** | **Endereço: campo único ou estruturado?** O card diz rua, número, bairro, cidade, UF e CEP e afirma que seguem "o schema". **Não seguem: o schema não tem endereço algum.** Política, `overview.md` e protótipo F26 usam **um campo `endereco`** | **Pessoa**, com CARTOGRAFO | **Campo único `endereco`.** Estruturar custa 6 colunas, validação de CEP e UF e muda a F03c e a F03d |
| **D-C** | **Máscara de CPF na tela.** Card: `123.***.***-00` (3 primeiros e 2 últimos). Protótipo F26 e política: `***.*56.7**-**` (3 do meio). A paridade manda o código seguir o Figma | **Pessoa**, com VIGIA e ESQUADRO | **`***.*56.7**-**`**: mostra menos, uma regra só para tela e log, e já é a que está no Figma. Mudar para a do card exige editar os frames (ESQUADRO) |
| **D-D** | A migration V4 de `cpf` e `endereco` nasce **aqui**, mas política e `overview.md` dizem que "a F09 cria". A F09 depende da F08 no quadro, então a F08 não pode esperar a F09 | **CARTOGRAFO** e **VIGIA** | **Nasce na F08.** Nasce `NULL`, sem escrita até a F03c. VIGIA aprova as linhas da política antes; CARTOGRAFO corrige o texto do `overview.md` e da política |
| **D-E** | A lista de veículos do cliente vem no detalhe ou em chamada própria? (D13 e G4 da F26) | CARTOGRAFO ou ESPRESSO | **Chamada própria, da F04.** O detalhe não traz `veiculos` |

Dúvidas do card, respondidas: **(2)** quem cria as colunas: conferi V1 a V3, não existem; V3 só fixa collation; próximo número livre é V4 (conferido em `origin/main`; ramos não mesclados não foram varridos). **(4)** sessão expirada: premissa 11. **(1)** atalho de veículos: o protótipo F26 desenha cartões de veículo e "+ Veículo" no D1; é decisão de navegação da F35 e da F04, fora desta feature. **(3)** CPF inteiro no detalhe: mantido, pelo G3 da F26 (a edição precisa); reavaliar se entrarem perfis de permissão.

## 8. Critérios de aceitação (Gherkin)

Corpo de erro (ADR-011) em todos: `timestamp`, `status`, `erro`, `mensagem`, `path`. Fixtures fictícias: cliente `id=7`, nome "Ana Exemplo", CPF `12345678900`, telefone `11912345678`, e-mail `ana@example.com`, endereço "Rua Modelo, 100 - Jardim Exemplo".

### 8.1 API e dados (ficam na F08)

**US-CLI-DET-02 · Contrato 200**
- Dado o cliente 7 completo e um token JWT válido
- Quando chamo `GET /api/v1/clientes/7`
- Então a API responde **200** com exatamente os campos `id`=7, `nome`, `cpf`="12345678900", `telefone`="11912345678", `email`, `endereco`
- E o JSON não contém `createdAt`, `veiculos` nem campo da entidade
- E o cabeçalho `Cache-Control` contém `no-store`

**US-CLI-DET-04 · Id inexistente**
- Dado que não existe cliente com id 999999
- Quando chamo `GET /api/v1/clientes/999999` com token válido
- Então a API responde **404** com `status`=404, `erro`="Not Found", `path`="/api/v1/clientes/999999" e `mensagem` fixa
- E `mensagem` não contém nome, CPF, telefone, e-mail nem endereço

**US-CLI-DET-05 · Id não numérico**
- Dado um token válido
- Quando chamo `GET /api/v1/clientes/abc`
- Então a API responde **400** com `status`=400, `erro`="Bad Request" e `mensagem`="Parametro invalido: id"
- E `mensagem` não repete o valor "abc"

**US-CLI-DET-13 · Id fora da faixa (borda)**
- Dado um token válido
- Quando chamo o detalhe com id `0`, com id `-1` e com id `99999999999999999999`
- Então cada chamada responde **400** com os 5 campos de erro, e nunca 404 nem 500

**US-CLI-DET-06 · Sem autenticação**
- Dado nenhum token, um token malformado e um token expirado
- Quando chamo `GET /api/v1/clientes/7`
- Então cada chamada responde **401** com `status`=401, `erro`, `mensagem` e `path`
- E o repositório de clientes não é consultado (provado com `verifyNoInteractions` ou equivalente)

**US-CLI-DET-14 · Opcionais nulos (borda)**
- Dado o cliente 8 só com nome, e `cpf`, `telefone`, `email` e `endereco` `NULL` no banco
- Quando chamo `GET /api/v1/clientes/8` com token válido
- Então a API responde **200** com `nome` preenchido e `cpf`, `telefone`, `email` e `endereco` = `null` (campo presente, valor nulo)
- E a API não devolve string vazia no lugar de `null`

**US-CLI-DET-15 · Cliente anonimizado (borda)**
- Dado o cliente 9 com `nome`="Cliente anonimizado" e demais campos pessoais `NULL`
- Quando chamo `GET /api/v1/clientes/9` com token válido
- Então a API responde **200** com `nome`="Cliente anonimizado" e `cpf`, `telefone`, `email` e `endereco` = `null`

**US-CLI-DET-16 · Migration V4 aditiva**
- Dado um MySQL real (Testcontainers) com V1 a V3 aplicadas e o cliente 7 gravado só com `nome`, `telefone` e `email`
- Quando as migrations rodam até a V4
- Então o Flyway termina sem erro, as colunas `cpf` e `endereco` existem aceitando `NULL`, e nenhuma linha existente é alterada
- E `GET /api/v1/clientes/7` responde **200** com `cpf` e `endereco` = `null`

**US-CLI-DET-11 · Log sem dado pessoal**
- Dado o cliente 7 e captura do log (`ListAppender` ou `OutputCaptureExtension`)
- Quando chamo o detalhe e provoco 200, 404, 400 e 401, e um 500 forçado por falha de repositório com mensagem contendo "12345678900"
- Então nenhuma linha contém "12345678900", "123.456.789-00", "11912345678", "(11) 91234-5678", "91234-5678", "Ana Exemplo", "ana@example.com" nem "Rua Modelo"
- E a linha do 200, se existir, é só `clientes.detalhar clienteId=7 usuarioId=<id>`
- E a linha do 500 leva só a classe da exceção e o `path`, nunca `getMessage()`
- E quando o CPF ou o telefone precisar aparecer, passa por `MascaraDadoPessoal` e sai como `***.*56.7**-**` e `*******5678`

**US-CLI-DET-17 · OpenAPI**
- Dado a API no ar (teste) e o JSON do OpenAPI gerado
- Quando leio o caminho `GET /api/v1/clientes/{id}`
- Então ele documenta as respostas **200** (`ClienteDetalheResponse` com os 6 campos), **400**, **401**, **404** e **500** (as quatro últimas com `ErrorResponse`), exige o esquema Bearer e declara `id` como inteiro positivo

### 8.2 Tela (ficam na F08 só se D-A for negada; se confirmada, vão para a F35)

Valem os 4 estados, acessibilidade e i18n `clientes.detalhe.*`. Máscara de tela conforme D-C (padrão `***.*56.7**-**`).

**US-CLI-DET-01 · Detalhe preenchido**
- Dado o cliente 7 e `GET /api/v1/clientes/7` respondendo **200** com `nome`, `cpf`, `telefone`, `email` e `endereco`
- Quando abro o detalhe
- Então vejo o nome, o CPF como `***.*56.7**-**`, o telefone como `(11) 91234-5678`, o e-mail e o endereço
- E o CPF inteiro e o telefone cru (só dígitos) não aparecem na tela

**US-CLI-DET-03 · Opcionais ausentes**
- Dado `GET /api/v1/clientes/8` respondendo **200** com `cpf`, `telefone`, `email` e `endereco` = `null`
- Quando abro o detalhe
- Então cada campo ausente mostra "Não informado" (chave i18n) e a tela não mostra `null`, `undefined` nem campo em branco
- E a tela não quebra

**US-CLI-DET-10 · CPF fora do formato (borda)**
- Dado **200** com `cpf` vazio, `null` ou com menos ou mais de 11 dígitos
- Quando a tela exibe o campo
- Então aparece "Não informado" e o valor cru nunca é exibido

**US-CLI-DET-07 · Carregando**
- Dado que o detalhe foi solicitado e a resposta não chegou
- Quando a tela está em espera
- Então há um indicador de carregamento com nome acessível, anunciado por leitor de tela, e só o botão Voltar recebe foco

**US-CLI-DET-08 · Erro de rede ou de servidor**
- Dado que a chamada falha por rede ou responde **500** com os 5 campos de erro
- Quando a tela processa a falha
- Então aparece o estado de erro anunciado por leitor de tela, com "Tentar novamente" e "Voltar", ambos acessíveis por teclado
- E ao acionar "Tentar novamente" a tela volta a carregar e a mesma chamada é refeita

**US-CLI-DET-09 · Cliente não encontrado**
- Dado que a API respondeu **404** com `status`=404
- Quando a tela processa a resposta
- Então aparece "Cliente não encontrado", distinto do erro de rede, **sem** "Tentar novamente" e com ação de voltar

**US-CLI-DET-18 · Sessão expirada**
- Dado que a API respondeu **401** com `status`=401 ao abrir o detalhe
- Quando a tela processa a resposta
- Então o app chama `tratarSessaoExpirada`, apaga o token, volta ao login com o aviso de sessão expirada e não mostra o estado de erro de rede

**US-CLI-DET-12 · Acessibilidade**
- Dado o detalhe preenchido (**200**)
- Quando navego por teclado ou leitor de tela
- Então cada campo tem rótulo associado ao valor, o foco é visível e a informação não depende só de cor
- E o CPF tem rótulo acessível próprio que diz que está parcialmente oculto e **não soletra os asteriscos**

*Esta etapa não executa nem avalia os critérios; isso é do CRIVO.*

## 9. Divergências do card (lista para o CARTOGRAFO e o VIGIA)

1. **Máscara de log.** Card (premissa 5, critério 11): CPF `123.***.***-00` e telefone `(**) *****-5678`. Política vigente (6.2.1): CPF `***.*56.7**-**` e telefone `*******5678`, sem formatação. **Segui a política.** O card mostrava 5 dos 11 dígitos do CPF em log, mais que a política permite.
2. **Base legal do CPF.** Card: execução de contrato (V). Política: **obrigação legal fiscal (II)**, coletado só com nota. Segui a política.
3. **Retenção.** Card: "enquanto o cliente estiver ativo". Política: "enquanto ativo" não se aplica (não existe inativação); vale R1 e R2. Segui a política.
4. **Endereço.** Card: estruturado, "segundo o schema". O schema não tem endereço; os demais documentos usam campo único. Ver D-B.
5. **Exemplos do card.** CPF `12345678900` mantido como fixture (inválido de propósito) e telefone `(11) 91234-5678` virou entrada `11912345678`, porque a API devolve só dígitos.
6. **Quem cria as colunas.** Política e `overview.md` dizem F09; esta feature as cria. Ver D-D.
7. **Critérios novos** em relação ao card: 13, 14, 15, 16, 17 e 18. Os critérios 04, 05 e 06 passaram a nomear os valores esperados.

## 10. Texto pronto para a F35 (proposta, não aplicado)

> **Recebido da F08 (F03b), se a pessoa confirmar D-A:** tela de detalhe do cliente, consumindo `GET /api/v1/clientes/{id}` (200 com `id, nome, cpf, telefone, email, endereco`; 404, 400, 401 e 500 no formato `timestamp, status, erro, mensagem, path`). Critérios US-CLI-DET-01, 03, 07, 08, 09, 10, 12 e 18, com os textos da seção 8.2 do PRD `docs/product/F03b-clientes-detalhe.md`. Premissas herdadas: 5 (CPF só dígitos; telefone só dígitos, formatado na tela), 11 (sessão expirada) e a máscara de D-C. Depende de a F08 entregar o endpoint. Chaves i18n `clientes.detalhe.*`. Origem da lista de veículos: D-E.

Quem edita a F35 é a pessoa, ou eu, por pedido explícito dela.

## 11. Tarefas (numeração do card, com ajustes)

1. Criar a branch `feat/f03b-clientes-detalhe` a partir da `main`.
2. **Schema conferido por mim (V1 a V3 sem `cpf` nem `endereco`).** Resta criar a V4 e atualizar a matriz do `overview.md`, **depois** de D-B e D-D e da aprovação do VIGIA.
3. DTO `ClienteDetalheResponse` e mapper MapStruct.
4. Service com exceção de não encontrado e controller fino.
5. Handler: 404 (exceção nova), 400 e 401 com teste para esta rota.
6. Log do acesso e máscara conforme a política, com teste que inspeciona a saída (critério 11).
7. Testes de integração de 200, 404, 400, 401 e V4, com comando e saída real (JDK 21 Temurin, `JAVA_HOME` manual, contêiner se o Maven do host estiver barrado).
8. a 11. Ver seção 4: F35 se D-A for confirmada.
12. Rodar toda a suíte e registrar comando, saída real e o que ficou sem cobertura.
13. Commits pequenos em Conventional Commits, sem trailer de coautor.
14. **Novo:** teste do OpenAPI (critério 17).
15. **Novo:** README principal atualizado (rota, migration V4) em commit `docs(readme)`, ou registro de "README sem mudança" com o motivo.
16. **Novo:** CARTOGRAFO corrige o `overview.md` e a política sobre "F09 cria"; VIGIA aprova as linhas de `cpf` e `endereco`.

## 12. Riscos

- **Tela e API em features diferentes** (D-A) sem a F35 reescrita: se a pessoa não confirmar, nada se perde, mas o cartão da F35 segue duplicando escopo.
- **Dado novo coletado sem base legal aprovada.** Mitigação: a V4 só roda depois da aprovação do VIGIA (tarefa 16).
- **Colunas sem escrita até a F03c.** Em produção o detalhe mostra "Não informado" para CPF e endereço até lá. Esperado.
- **Máscara de tela divergente do Figma** se a pessoa escolher a do card em D-C.
- O código da F03a está na `main`, mas o último QA do CRIVO que li (rodada 4) deixou o merge com ressalva (ADR-017 desalinhado); o ADR foi corrigido no PR #21. Não reconferi os testes dela.

## Histórico

| Data | Autor | Mudança |
|---|---|---|
| 2026-11-17 | BUSSOLA | PRD fechado: escopo, premissas, 18 critérios com status HTTP e campos, 5 decisões abertas, divergências do card e texto para a F35 |
