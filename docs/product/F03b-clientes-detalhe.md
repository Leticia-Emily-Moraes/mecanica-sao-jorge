# PRD — F03b: Clientes, detalhe (card F08) — somente API

- Prioridade: P1
- Área: **Backend** (o card dizia Full-stack; a tela foi para a F35, ver seção 4)
- Sprint: Sprint 02: Clientes e Veículos
- Autora: BUSSOLA (Product Owner)
- Data: 2026-11-17 (revisão 2, após a revisão humana de 17/11, 20:16)
- Etapa da rota: **BUSSOLA (1/4)** → ESPRESSO → VIGIA → CRIVO
- Depende de: F00, F02, F03a (card F03, na `main`). Bloqueia: F03c (card F09), F03d (card F10), F35.
- Estado: **PRD reescrito só com API.** Restam 4 decisões abertas da pessoa (seção 7), cada uma com padrão adotado.

> **A tela de detalhe não entra no aceite da F08.** Os cenários de tela (US-CLI-DET-01, 03, 07, 08, 09, 10, 12 e 18) saíram deste PRD e estão em `docs/product/F35-recebido-da-F03b-detalhe-cliente.md`, para a F35. A F08 só fecha com o que a API entrega e prova.

> **Como ler.** Separo o que li do que suponho. Esta etapa é documento: **não rodei código nem teste.** Li o ramo `feat/f03b-clientes-detalhe` em `7a6874a`: `GlobalExceptionHandler`, `ClienteDetalheResponse`, `ClienteService`, ADR-018 e ADR-019 (ambos `proposto`) e a política de dados do cliente. O card da F35 não existe como arquivo no repositório; o que digo dela vem do panorama do briefing.

## 1. Visão e histórias

Quem atende no balcão abre um cliente já encontrado na lista (F03a) e precisa do cadastro completo. Esta feature entrega o **contrato da API de detalhe** e as colunas que faltam no banco, para a F35 (tela) e a F03d (edição) consumirem sem adivinhar campo.

- **H1.** Como **app mobile (F35 e F03d)**, quero `GET /api/v1/clientes/{id}` com contrato estável (campos, status e formato de erro), para montar o detalhe e pré-preencher a edição.
- **H2.** Como **responsável pela oficina (controladora, LGPD)**, quero que CPF, telefone e demais dados pessoais nunca apareçam em log nem em mensagem de erro, para um vazamento de log não virar vazamento de cadastro.
- **H3.** Como **desenvolvedor da squad**, quero que todo erro desta rota (404, 400, 401, 500) saia no formato do handler global, para o app tratar cada caso sem ler texto livre.

Tamanho (INVEST): migration, DTO, service, controller, handler e testes cabem em até 3 dias; por isso a tela, que somaria 2 a 3, ficou em outra feature.

## 2. Escopo

### Dentro
- `GET /api/v1/clientes/{id}` devolvendo `ClienteDetalheResponse`: `id`, `nome`, `cpf`, `telefone`, `email`, `endereco`. Nunca a entidade; `createdAt` não sai.
- Migration Flyway **V4** aditiva com `clientes.cpf` e `clientes.endereco`, ambas `NULL`, e a linha da matriz de `docs/architecture/overview.md`.
- 404 (id inexistente), 400 (id inválido, **incluindo id vazio ou só espaço**) e 401 (sem token) no formato `timestamp`, `status`, `erro`, `mensagem`, `path`.
- Log do acesso sem dado pessoal; documentação OpenAPI com exemplos fictícios; testes de service, controller e integração.

### Fora (explícito)
- **Tela de detalhe, estados de tela, máscara de CPF na tela, "Não informado", acessibilidade e paridade com o Figma:** F35. Nada disso é critério da F08.
- Criar e editar cliente (F03c, F03d); excluir e inativar (a política descarta por anonimização).
- Lista de veículos e histórico de OS do cliente (F04 e módulo de OS). O DTO não traz `veiculos`.
- Máscara de CPF no backend: a API devolve CPF inteiro porque a edição precisa dele.
- Validar dígito verificador do CPF na leitura (é da F03c, na escrita).
- Perfil de permissão: qualquer usuário autenticado acessa (briefing).

### Fica para depois (priorização)
1. Tela de detalhe (F35).
2. Rotina de anonimização por prazo (P2 da política).
3. CNPJ ("só CPF por enquanto", F26).

## 3. Glossário

- **Detalhe**: leitura de um cliente por id, com todos os campos de cadastro. A **lista** (F03a) traz só `id`, `nome`, `telefone`, `email`.
- **Handler global**: `GlobalExceptionHandler` e `RestAuthenticationEntryPoint`; formato de erro do ADR-011.
- **Máscara de log**: `MascaraDadoPessoal` (política, seção 6.2.1). Aplica-se só se um campo pessoal precisar aparecer em log; o padrão é não aparecer.
- **Anonimizado**: cliente com nome `Cliente anonimizado` e demais campos pessoais `NULL` (política, seção 4).

## 4. Reparticionamento F08 × F35 (decidido)

A instrução do comandante e a revisão humana moveram a tela para a F35. Fica assim:

| Critério | Assunto | Dono |
|---|---|---|
| US-CLI-DET-02 | contrato 200 | **F08** |
| US-CLI-DET-04 | id inexistente (404) | **F08** |
| US-CLI-DET-05 | id inválido (400) | **F08** |
| US-CLI-DET-06 | sem token (401) | **F08** |
| US-CLI-DET-11 | log sem dado pessoal | **F08** |
| US-CLI-DET-13 | id zero, negativo ou estoura `Long` | **F08** |
| US-CLI-DET-14 | opcionais nulos | **F08** |
| US-CLI-DET-15 | cliente anonimizado | **F08** |
| US-CLI-DET-16 | migration V4 | **F08** |
| US-CLI-DET-17 | OpenAPI | **F08** |
| US-CLI-DET-19 | id vazio ou só espaço (400, regressão do F-1) | **F08** (novo) |
| US-CLI-DET-01, 03, 07, 08, 09, 10, 12, 18 | tela | **F35** |

Os critérios 03 e 10 têm uma metade de API que **fica** aqui: `null` sem quebrar (critério 14) e o `CHECK` de 11 dígitos no banco (critério 16). O texto "Não informado" e a máscara são da F35.

Duplicação resolvida: a tela constava na F08 e no objetivo da F35. Agora só na F35. O texto da F35 é proposta; **a F35 é refinada pela pessoa** (briefing), então não editei o card.

Tarefas do card: ficam na F08 as 1 a 7, 12 (parte API) e 13. Vão para a F35 as 8, 9, 10, 11 e a parte de app da 12.

## 5. Premissas (numeradas)

1. **Id numérico positivo**, tipo `Long`. Não numérico, vazio, só espaço, zero, negativo ou acima de `Long.MAX_VALUE` responde 400, nunca 404 nem 500.
2. **JWT herdado da F02.** Sem token válido, 401 antes de qualquer consulta ao cliente.
3. **404 por exceção de domínio** (`RecursoNaoEncontradoException`, ADR-019, ainda `proposto`), com mensagem fixa, sem id nem dado pessoal.
4. **CPF e telefone saem como gravados, só dígitos**; formatar é da tela.
5. **Endereço é campo único** (`endereco`), conforme ADR-018 (`proposto`). Ver D-B.
6. **Mensagem de erro nunca repete dado pessoal nem o valor rejeitado.**
7. **Log:** a política do VIGIA manda **não logar** CPF nem telefone, nem mascarados. Uma linha INFO por acesso, só com `clienteId` e `usuarioId`. Isto **difere do card** (que pedia máscara no log); ver D-F e seção 9.
8. **Cliente anonimizado é lido normalmente**, sem erro especial.
9. **`Cache-Control: no-store`** na resposta, por carregar CPF.
10. **Fixture fictícia:** CPF `12345678900` (dígito verificador inválido de propósito) entra por SQL ou `JdbcTemplate`, não por `POST`.
11. **Sessão expirada no app** (401 em tela autenticada) é tratada na F35; o mecanismo já existe no app (`SessaoExpiradaError`), mas nenhuma tela autenticada o consome ainda.

## 6. Dados pessoais

| Dado | Finalidade | Base legal | Retenção | Observação |
|---|---|---|---|---|
| `nome` | identificar o cliente no atendimento | art. 7º, V | política, seção 3 (R1 e R2) | existe (V2) |
| `telefone` | contato sobre orçamento e veículo pronto | art. 7º, V | idem | existe (V2); sai completo na API |
| `email` | idem | art. 7º, V | idem | existe (V2) |
| `cpf` | emissão de documento fiscal, só quando o cliente pedir nota | art. 7º, II | idem (R4) | **coluna nova (V4)**; sai inteiro só no detalhe |
| `endereco` | nota fiscal ou busca e entrega do veículo | art. 7º, II ou V | idem | **coluna nova (V4)** |

- **Descarte:** anonimização (política, seção 4); `cpf` e `endereco` viram `NULL`. Nunca `DELETE`.
- **Mínimo:** sem `createdAt`, sem veículos.
- **Log e teste:** sem dado pessoal em log; fixtures inventadas.
- **Risco B2 / P8:** CPF e endereço inteiros para qualquer token válido (todos os perfis têm o mesmo acesso). **Aceite da pessoa ainda pendente** (D-E); a política o exige registrado na PR antes do merge.
- As linhas de `cpf` e `endereco` foram aprovadas pelo VIGIA na revisão 2 da política (li o registro; base legal e prazos seguem como proposta P1).

## 7. Dúvidas e decisões em aberto

| ID | Pergunta | Quem decide | Padrão adotado |
|---|---|---|---|
| **D-B** | **Endereço: campo único ou estruturado** (rua, número, bairro, cidade, UF, CEP, como diz o card)? ADR-018 propõe campo único | **Pessoa** (aceitar o ADR-018 ou pedir o formato estruturado) | **Campo único.** Critério 02 só fecha depois da resposta. Estruturar custa 6 colunas e muda F03c e F03d |
| **D-E** | **Aceite do risco P8** (CPF e endereço inteiros a qualquer token válido) | **Pessoa** | Sem aceite, o merge não ocorre |
| **D-F** | **Desvio do card no log:** o card pedia CPF `123.***.***-00` e telefone `(**) *****-5678` se aparecessem; a política manda não logar. Aceita o desvio? | **Pessoa**, com VIGIA | **Não logar.** Critério 11 já escrito assim; só se marca atendido após a confirmação |
| **D-G** | **Aceite do ADR-018 e do ADR-019** (ambos `proposto`) | **Pessoa**, com CARTOGRAFO | Código segue os dois; mudança depois custa retrabalho de migration e handler |

Movidas para a F35: **D-C** (formato da máscara de CPF na tela: card `123.***.***-00` ou política `***.*56.7**-**`; parecer do VIGIA: o da política) e **D-A** (resolvida pela instrução do comandante). **D-D** (a V4 nasce na F08) está resolvida: a migration existe no ramo. Veículos no detalhe: chamada própria da F04; o DTO não traz `veiculos`.

Dúvidas do card, respondidas: **(1)** atalho para veículos: decisão da F35 e da F04. **(2)** colunas: V1 a V3 não tinham; a V4 as cria. **(3)** CPF inteiro no detalhe: mantido, a edição precisa; reavaliar se entrarem perfis. **(4)** sessão expirada: premissa 11, é da F35.

## 8. Critérios de aceitação (Gherkin, somente API)

Corpo de erro (ADR-011) em todos: `timestamp`, `status`, `erro`, `mensagem`, `path`. Fixtures: cliente `id=7`, nome "Ana Exemplo", CPF `12345678900`, telefone `11912345678`, e-mail `ana@example.com`, endereço "Rua Modelo, 100 - Jardim Exemplo".

**US-CLI-DET-02 · Contrato 200** *(fecha após D-B)*
- Dado o cliente 7 completo e um token JWT válido
- Quando chamo `GET /api/v1/clientes/7`
- Então a API responde **200** com exatamente `id`=7, `nome`, `cpf`="12345678900", `telefone`="11912345678", `email`, `endereco`
- E o JSON não contém `createdAt`, `veiculos` nem campo da entidade
- E o cabeçalho `Cache-Control` contém `no-store`

**US-CLI-DET-04 · Id inexistente**
- Dado que não existe cliente com id 999999
- Quando chamo `GET /api/v1/clientes/999999` com token válido
- Então a API responde **404** com `status`=404, `erro`="Not Found", `path`="/api/v1/clientes/999999" e `mensagem` fixa
- E `mensagem` não contém nome, CPF, telefone, e-mail nem endereço

**US-CLI-DET-05 · Id não numérico** *(fecha junto com o 19)*
- Dado um token válido
- Quando chamo `GET /api/v1/clientes/abc`
- Então a API responde **400** com `status`=400, `erro`="Bad Request" e `mensagem`="Parametro invalido: id"
- E `mensagem` não repete o valor "abc"

**US-CLI-DET-19 · Id vazio ou só espaço (regressão do F-1)**
- Dado um token válido
- Quando chamo `GET /api/v1/clientes/%20` (id só com espaço)
- Então a API responde **400** com os 5 campos de erro, e nunca 500
- E o log não registra `MissingPathVariableException` como erro inesperado nem repete o valor enviado
- E existe teste automatizado de regressão para esse caso, executado e verde

**US-CLI-DET-13 · Id fora da faixa (borda)**
- Dado um token válido
- Quando chamo o detalhe com id `0`, `-1` e `99999999999999999999`
- Então cada chamada responde **400** com os 5 campos de erro, e nunca 404 nem 500

**US-CLI-DET-06 · Sem autenticação**
- Dado nenhum token, um token malformado e um token expirado
- Quando chamo `GET /api/v1/clientes/7`
- Então cada chamada responde **401** com `status`=401, `erro`, `mensagem` e `path`
- E o repositório de clientes não é consultado

**US-CLI-DET-14 · Opcionais nulos (borda)**
- Dado o cliente 8 só com nome, e `cpf`, `telefone`, `email` e `endereco` `NULL` no banco
- Quando chamo `GET /api/v1/clientes/8` com token válido
- Então a API responde **200** com `nome` preenchido e `cpf`, `telefone`, `email` e `endereco` = `null` (campo presente, valor nulo)
- E a API não devolve string vazia no lugar de `null`

**US-CLI-DET-15 · Cliente anonimizado (borda)**
- Dado o cliente 9 com `nome`="Cliente anonimizado" e demais campos pessoais `NULL`
- Quando chamo `GET /api/v1/clientes/9` com token válido
- Então a API responde **200** com `nome`="Cliente anonimizado" e os demais = `null`

**US-CLI-DET-16 · Migration V4 aditiva**
- Dado um MySQL real (Testcontainers) com V1 a V3 e o cliente 7 gravado só com `nome`, `telefone` e `email`
- Quando as migrations rodam até a V4
- Então o Flyway termina sem erro, `cpf` e `endereco` existem aceitando `NULL`, e nenhuma linha existente é alterada
- E o banco rejeita `cpf` vazio ou com menos de 11 dígitos (`CHECK`)
- E `GET /api/v1/clientes/7` responde **200** com `cpf` e `endereco` = `null`

**US-CLI-DET-11 · Log sem dado pessoal** *(fecha após D-F)*
- Dado o cliente 7 e captura do log
- Quando chamo o detalhe e provoco 200, 404, 400, 401 e um 500 forçado por falha de repositório com mensagem contendo "12345678900"
- Então nenhuma linha contém "12345678900", "123.456.789-00", "11912345678", "(11) 91234-5678", "91234-5678", "Ana Exemplo", "ana@example.com" nem "Rua Modelo", **nem versões mascaradas de CPF e telefone**
- E a linha do 200 é só `clientes.detalhar clienteId=7 usuarioId=<id>`
- E a linha do 500 leva só a classe da exceção e o `path`, nunca `getMessage()`

**US-CLI-DET-17 · OpenAPI**
- Dado a API no ar (teste) e o JSON do OpenAPI gerado
- Quando leio `GET /api/v1/clientes/{id}`
- Então ele documenta **200** (`ClienteDetalheResponse` com os 6 campos), **400**, **401**, **404** e **500** (as quatro últimas com `ErrorResponse`), exige o esquema Bearer e declara `id` como inteiro positivo
- E os exemplos do schema usam só dado fictício e coerente com o formato real devolvido (telefone só dígitos), corrigindo o exemplo do telefone apontado na revisão (F-4)

*Esta etapa não executa nem avalia os critérios; isso é do CRIVO.*

## 9. Divergências do card

1. **Log.** Card: máscara se o dado aparecer. Política: não logar. Segui a política (D-F).
2. **Base legal do CPF.** Card: contrato (V). Política: obrigação legal fiscal (II).
3. **Retenção.** Card: "enquanto ativo". Política: R1 e R2.
4. **Endereço.** Card: estruturado "segundo o schema"; o schema não tinha endereço. ADR-018: campo único (D-B).
5. **Exemplos.** CPF `12345678900` mantido (inválido de propósito); telefone do exemplo do card virou `11912345678`, porque a API devolve dígitos.
6. **Máscara de CPF e "Não informado":** saíram do aceite da F08 (F35).
7. **Critérios novos** em relação ao card: 13, 14, 15, 16, 17 e 19. (O 18 foi para a F35.)

## 10. Itens do card que seguem para a F35

Texto pronto em `docs/product/F35-recebido-da-F03b-detalhe-cliente.md`: critérios 01, 03, 07, 08, 09, 10, 12 e 18, tarefas 8 a 11 e a decisão D-C. A F35 depende da F08 entregar o endpoint e da F26 (protótipo).

## 11. Tarefas

Legenda: FEITA = existe no ramo (li o código, não rodei); ABERTA = falta.

1. FEITA — Branch `feat/f03b-clientes-detalhe` a partir da `main`.
2. FEITA — Migration V4 e linha da matriz.
3. FEITA — DTO `ClienteDetalheResponse` e mapper.
4. FEITA — Service com exceção de não encontrado e controller fino.
5. ABERTA — **Handler:** 404 e 401 existem; **falta o 400 de id vazio ou só espaço** (`MissingPathVariableException` hoje cai no `handleUnexpected` e vira 500; li o handler e não há tratamento) e o teste de regressão (critério 19).
6. FEITA — Log do acesso sem CPF e telefone, com teste (aguarda D-F).
7. FEITA — Testes de integração 200, 404, 400, 401 (existem; **reexecutar** após a correção da 5, com comando e saída real).
8 a 11. MOVIDAS para a F35.
12. ABERTA — Rodar toda a suíte da API e registrar comando, saída real e o que ficou sem cobertura. Parte de app: F35.
13. FEITA — Commits pequenos em Conventional Commits, sem trailer de coautor.
14. ABERTA (nova) — Corrigir o exemplo do telefone no schema OpenAPI (F-4) e cobrir no teste do critério 17.
15. ABERTA (nova) — README principal: já tem rota, V4 e contagem de testes (`7a6874a`); atualizar a contagem se os testes mudarem.

## 12. Riscos

- **ADR-018 e ADR-019 `proposto`:** código escrito sobre decisão não aceita; se a pessoa pedir endereço estruturado, muda migration, DTO e F03c/F03d.
- **P8 sem aceite:** merge bloqueado pela política.
- **F-1 aberto:** id só com espaço devolve 500 e registra a classe de exceção no log como erro inesperado.
- **F-4:** não achei a descrição do achado no repositório; entendi só que o exemplo do telefone no OpenAPI precisa de correção. ESPRESSO e CRIVO confirmam o que exatamente estava errado.
- **F35 sem reescrita:** se a pessoa não aplicar o texto, a tela fica sem dono de aceite.

## Histórico

| Data | Autor | Mudança |
|---|---|---|
| 2026-11-17 | BUSSOLA | PRD fechado: escopo, premissas, 18 critérios, decisões abertas |
| 2026-11-17 | BUSSOLA | Revisão 2: PRD só de API; tela movida para a F35; novo critério 19 (F-1); critério 11 sem máscara em log (D-F); critério 17 cobre F-4; D-A e D-D resolvidas |
