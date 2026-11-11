# PRD — F02: Fundação backend + Login

- Prioridade: P1
- Área: Full-stack
- Sprint: Sprint 01: Fundação e Login
- Autor: BUSSOLA (Product Owner)
- Data: 2026-11-07
- Etapa da rota: BUSSOLA (1/6) → CARTOGRAFO → ESPRESSO → VIGIA → ANCORA → CRIVO

> **Recorte desta entrega**: por instrução direta do comandante, esta rodada cobre
> só quatro histórias: limpeza/guarda do template genérico, migration com o
> schema completo da oficina, as entidades JPA reais e o login JWT (com o
> cenário de credencial inválida sem vazar qual campo errou). As telas mobile de
> Login e Perfil (US-AUTH-02 e US-AUTH-03 do briefing original da feature) ficam
> fora desta rodada — é escopo da F30, conforme `docs/architecture/overview.md`
> §"Divergências do briefing", item 5.

## 1. Visão

A Feature F02 tira o backend `apps/api` do estado de fundação mínima deixado
pela F00 (pastas `config`, `exception`, `security` e só a tabela `usuarios`) e
entrega o schema completo da oficina por migration Flyway, as entidades JPA
reais mapeando esse schema, e o primeiro endpoint de negócio: login por email
e senha emitindo JWT. É o que destrava Clientes, Veículos, Catálogo, Ordens de
Serviço e Financeiro nas sprints seguintes.

**Nota de verificação importante**: o briefing da operação descreve um ponto de
partida com classes de template genérico (`Category`, `Product`, `User`,
`Itens`) sob nomes de domínio, controllers/services/repositories do mesmo
template e tabelas `Categories`/`users`/`products` inexistentes no schema.
Investiguei isso e **essa descrição não corresponde ao estado real de
`op-002/apps/api`**: o repositório `op-002/apps/api` foi criado do zero pela F00
(commit `e88e482`) e nunca teve classes de template genérico. A descrição do
briefing bate com um repositório de referência externo
(`mecanica-sao-jorge/backend`, fora desta pasta de operação), não com esta
pasta. Por isso a história de limpeza abaixo (US-FUND-01) é escrita como
**guarda de regressão e confirmação formal**, não como remoção de arquivo
específico.

**Atualização desta revisão**: CARTOGRAFO gravou os ADRs 001 a 011 em
`docs/architecture/` e ESPRESSO já materializou as 12 entidades JPA, o
repositório de usuário e a migration `V2__criar_schema_oficina.sql`. As cinco
dúvidas que eu tinha deixado em aberto na primeira versão deste PRD foram
resolvidas por esse trabalho; a seção 5 registra cada resolução com o ADR que
a decidiu, em vez de reabrir a pergunta.

## 2. Escopo

### Dentro do escopo desta entrega
- US-FUND-01: backend livre de classes de template genérico (guarda), compilando.
- US-FUND-02: migration com o schema completo da oficina (V2 aditiva sobre a V1 de `usuarios` já aplicada pela F00).
- US-FUND-03: as 12 entidades JPA reais mapeando as tabelas aplicadas (as 11 novas da V2 + `Usuario` da V1).
- US-AUTH-01: endpoint de login por email e senha emitindo JWT, incluindo o
  cenário de credencial inválida sem vazar qual campo (email ou senha) errou.

### Fora do escopo desta entrega (registrado, não decidido como "não vai fazer")
- Tela de login e tela de perfil no app mobile — escopo da F30 (depende de F02
  e F25), conforme `overview.md`.
- Diferenciação de permissão entre ADMIN e FUNCIONARIO.
- Cadastro de usuário, recuperação de senha, edição de perfil.
- Refresh token e blacklist de token.
- Servidor de autorização externo ou JWKS remoto.
- Clientes, Veículos, Catálogo, Ordens de Serviço, Financeiro (features
  próprias, ordem já definida no PRD da operação).
- Rate limiting / lockout de força bruta no login (risco residual registrado no
  threat model de `overview.md`, backlog de VIGIA/ANCORA).
- Qualquer item do backlog (dashboard, fotos, PDF, WhatsApp) sem decisão nova.

## 3. Glossário

- **Template genérico**: as classes `Category`/`Product`/`User`/`Itens`/
  `Trabalhos` do repositório de referência `mecanica-sao-jorge/backend`,
  nomeadas de forma genérica mas mapeando tabelas reais do domínio. Não existem
  em `op-002/apps/api`.
- **Schema de referência**: `BD/script.sql`, no repositório externo
  `mecanica-sao-jorge` (fora desta pasta de operação), lido só para consulta de
  **estrutura** (colunas, FKs, colunas geradas, enums) — não de nomenclatura
  (ver divergência de convenção em `overview.md`, "Modelo de dados").
- **Migration V2 aditiva**: `V2__criar_schema_oficina.sql`, as 11 tabelas do
  domínio da oficina além de `usuarios` (V1, já aplicada pela F00). Decisão
  registrada em ADR-003: a V1 nunca é reescrita, só se adiciona migration nova.
- **OAuth2 Resource Server**: mecanismo do Spring Security que valida um JWT
  recebido via Bearer token usando `JwtDecoder`, sem ser ele mesmo um servidor
  de autorização (a própria API emite e valida o próprio token). Decisão e
  biblioteca em ADR-004.
- **Chave simétrica HS256**: mesma chave usada para assinar e validar o token,
  sem par de chave pública/privada; propriedade `jwt.secret`, sem valor padrão
  (a aplicação falha ao subir sem `JWT_SECRET`), nunca em código nem em log.
- **Coluna gerada (`GENERATED ALWAYS AS ... STORED`)**: coluna calculada pelo
  próprio MySQL (subtotal das junções da OS); a aplicação nunca grava valor
  nela diretamente (ADR-005).

## 4. Premissas (verificadas em código e em ADR)

1. O schema de referência (`BD/script.sql`) não está nesta pasta de operação;
   está no repositório irmão `mecanica-sao-jorge`, lido só para consulta de
   estrutura. O domínio completo da oficina tem **12 tabelas**: `usuarios`
   (V1, já aplicada pela F00) + 11 novas na V2 (`clientes`, `veiculos`,
   `servicos`, `pecas`, `ordens_servico`, `ordens_servico_servicos`,
   `ordens_servico_pecas`, `movimentacoes_estoque`, `parcelas`, `pagamentos`,
   `financeiro`). Decisão em ADR-003.
2. A tabela `usuarios` segue a convenção já aplicada pela F00 (PK `id`
   `BIGINT UNSIGNED AUTO_INCREMENT`, snake_case), divergente do `Usuarios`
   PascalCase/`usuario_id` do schema de referência — divergência registrada e
   aceita em ADR-007/`overview.md`.
3. `apps/api/pom.xml` já tem `springdoc-openapi-starter-webmvc-ui`, `mapstruct`,
   `spring-boot-starter-flyway`/`flyway-mysql` e, por decisão desta entrega
   (ADR-004), `spring-boot-starter-oauth2-resource-server` — a dependência
   `io.jsonwebtoken` (jjwt) que a F00 havia deixado pré-cableada sem uso foi
   removida do `pom.xml`. Não há Springfox neste repositório (ADR-002): a
   restrição do briefing sobre Springfox refere-se ao repositório de
   referência externo, não a `op-002/apps/api`.
4. `application.yml`/`.env.example` definem `jwt.secret` sem valor padrão
   (`${JWT_SECRET}`, obrigatório) e `jwt.expiration-minutes` com padrão
   **10080** (7 dias), configurável por variável de ambiente — decisão em
   ADR-004, propriedade conforme ADR-009.
5. O handler global de erro (`GlobalExceptionHandler`) mapeia: **400** para
   `MethodArgumentNotValidException` (Bean Validation), **401** para
   `CredenciaisInvalidasException` (login com email ou senha incorretos,
   mensagem genérica única), **422** para `AppError` genérico (regra de
   negócio com entrada bem-formada), **500** para exceção inesperada
   (mensagem genérica, sem stack trace). O 401 de bearer token ausente,
   inválido ou expirado é tratado fora do `GlobalExceptionHandler`, por um
   `AuthenticationEntryPoint` customizado do resource server, no mesmo formato
   de corpo. Decisão em ADR-011.
6. A convenção de rota já registrada no projeto é `POST /api/v1/auth/login`
   (endpoint público, fora de `authenticated()`).
7. Login usa email e senha da tabela `usuarios`; a senha em texto claro nunca é
   persistida nem logada — é comparada em memória com `senha_hash` via
   `BCryptPasswordEncoder` (ADR-004/`overview.md`, threat model).
8. Logout é local: o app descarta o token do dispositivo, sem endpoint de
   invalidação no backend (esta fatia não cobre app, mas a premissa vale para
   quando a tela de Login/Perfil entrar, na F30).
9. ADMIN e FUNCIONARIO continuam sem diferença de permissão nesta fatia.
10. O token JWT expira em 7 dias (`exp = iat + jwt.expiration-minutes`); não há
    refresh token nem blacklist nesta fatia. Claims: `sub` (id do usuário),
    `perfil`, `iss` (`mecanica-sao-jorge-api`), `iat`, `exp`. Nunca inclui
    senha ou hash.
11. A API emite e valida o próprio JWT (sem servidor de autorização externo
    nem JWKS remoto), com chave simétrica HS256 configurada fora do código e
    do log (`JWT_SECRET`, mínimo 32 bytes).

## 5. Dúvidas em aberto

Nenhuma dúvida em aberto nesta revisão. As cinco dúvidas da primeira versão
deste PRD foram resolvidas por CARTOGRAFO e estão registradas abaixo só para
rastreabilidade — não é necessário decidir nada de novo aqui:

1. ~~Contagem de entidades (11 vs. 12)~~ — resolvido: **12** (ADR-007,
   `overview.md` "Divergências do briefing", item 1).
2. ~~V1 única ou V1 existente + V2 nova~~ — resolvido: **V2 aditiva**, a V1 da
   F00 nunca é reescrita (ADR-003).
3. ~~jjwt vs. `spring-security-oauth2-resource-server`~~ — resolvido: jjwt
   removida do `pom.xml`, resource server com HS256 via Nimbus (ADR-004).
4. ~~Expiração padrão~~ — resolvido: `jwt.expiration-minutes` passa a ter
   padrão 10080 (7 dias) (ADR-004).
5. ~~Status HTTP de validação (400 vs. 422)~~ — resolvido: 400 para Bean
   Validation em todo o projeto; 422 reservado para `AppError` genérico;
   credencial de login inválida usa 401, não 422 (ADR-011).
6. ~~Sobreposição de escopo com a F30~~ — resolvido: backend e endpoint de
   login são da F02; as telas de Login/Perfil são da F30. Confirmado por
   CARTOGRAFO em `overview.md` como decisão de produto já alinhada ao PRUMO,
   sem necessidade de ADR técnico.

## 6. Dados pessoais (LGPD)

| Dado | Finalidade | Base legal | Retenção |
|---|---|---|---|
| Email e senha (hash BCrypt) | Autenticação do usuário no sistema interno da oficina | Execução de contrato de trabalho / legítimo interesse do controlador para controle de acesso interno (LGPD art. 7º, V e IX) | Enquanto o vínculo do usuário com a oficina estiver ativo |
| Nome e perfil (ADMIN/FUNCIONARIO) | Identificação do usuário autenticado nas respostas da API | Execução de contrato de trabalho | Enquanto o vínculo do usuário com a oficina estiver ativo |
| Token JWT | Manter a sessão autenticada | Legítimo interesse (continuidade do acesso) | 7 dias a partir da emissão, ou até o logout, o que ocorrer primeiro; existe só no dispositivo do usuário |

A migration `V1__criar_tabela_usuarios.sql` já aplicada pela F00 documenta
essa mesma finalidade/base legal/retenção em comentário SQL. A senha em texto
claro nunca é gravada nem logada em nenhum ponto do fluxo (threat model em
`overview.md`); o hash repousa só no MySQL.

## 7. Histórias de usuário e critérios de aceitação

IDs: `US-FUND-01` a `US-FUND-03`, `US-AUTH-01`, área `FUND`/`AUTH`, feature
`F02`.

---

### US-FUND-01 — Backend livre de classes de template genérico e compilando

**Como** desenvolvedor,
**quero** que o backend não tenha nenhuma classe de template genérico
(`Category`, `Product`, `User`, `Itens`) e compile sem erro,
**para** que a fundação sirva de base limpa para as próximas features.

```gherkin
Cenário: Nenhuma classe de template genérico nos pacotes de domínio
  Dado o código-fonte de apps/api ao final desta fatia, com os pacotes entity, controller, service e repository já povoados pela F02
  Quando se busca por classes nomeadas Category, Product, User (como entidade de dominio) ou Itens
  Então nenhuma ocorrência deve ser encontrada
  E nenhuma entidade do pacote entity deve mapear uma tabela chamada Categories, users (generica) ou products

Cenário: Build limpa sem classes residuais
  Dado o repositório apps/api nesta fatia, com as 12 entidades, o UsuarioRepository e a migration V2 já adicionados
  Quando o backend é compilado com "mvn clean install"
  Então a build conclui com BUILD SUCCESS
  E o relatório de compilação não lista nenhuma classe de template genérico

Cenário de regressão: reintrodução de classe de template genérico é rejeitada
  Dado que alguém copia uma classe do repositório de referência externo (ex.: CategoryController, ProductService, Itens, Trabalhos) sem adaptar ao domínio real da oficina
  Quando essa classe é incluída em um Pull Request de apps/api
  Então a revisão de código deve rejeitar o Pull Request
  E o motivo registrado deve citar esta história (US-FUND-01)
```

---

### US-FUND-02 — Migration com o schema completo da oficina (V2 aditiva)

**Como** desenvolvedor,
**quero** que o Flyway aplique o schema completo da oficina a partir da
estrutura do schema de referência, sem `DROP DATABASE` e sem reescrever a V1
já aplicada,
**para** que qualquer ambiente (local, CI, futuro staging) suba com o mesmo
banco de forma reprodutível e sem quebrar o checksum do Flyway.

```gherkin
Cenário: Flyway aplica V1 e V2 do zero contra MySQL real no CI
  Dado o Testcontainers configurado com MySQL 8.4 no CI (ADR-010)
  Quando o Flyway aplica as migrations do zero (V1__criar_tabela_usuarios.sql e V2__criar_schema_oficina.sql)
  Então as 12 tabelas do schema da oficina (usuarios, clientes, veiculos, servicos, pecas, ordens_servico, ordens_servico_servicos, ordens_servico_pecas, movimentacoes_estoque, parcelas, pagamentos, financeiro) são criadas sem erro
  E nenhum arquivo em db/migration contém a instrução "DROP DATABASE"

Cenário: A V1 já aplicada pela F00 não é alterada
  Dado o arquivo V1__criar_tabela_usuarios.sql já aplicado em algum ambiente (ex.: CI da F00)
  Quando a migration V2 é adicionada por esta fatia
  Então o conteúdo e o checksum de V1__criar_tabela_usuarios.sql permanecem exatamente os mesmos
  E o Flyway aplica V2 como migration nova, sem erro de checksum divergente

Cenário: Colunas geradas das junções da OS ficam somente leitura
  Dado as tabelas ordens_servico_servicos e ordens_servico_pecas criadas pela V2
  Quando a estrutura dessas tabelas é inspecionada
  Então a coluna subtotal de cada uma é "GENERATED ALWAYS AS (...) STORED"
  E nenhuma aplicação grava valor diretamente nessa coluna

Cenário: Enum de domínio persistido como STRING
  Dado as colunas que representam um enum de domínio (status de ordens_servico, perfil de usuarios, forma_pagamento de pagamentos, tipo de movimentacoes_estoque, tipo de financeiro)
  Quando a migration é inspecionada
  Então cada uma dessas colunas é do tipo VARCHAR
  E nenhuma usa um tipo nativo de enum do MySQL

Cenário de erro: schema divergente é detectado na subida da aplicação
  Dado uma alteração de coluna feita diretamente no banco, fora de uma migration Flyway
  Quando a aplicação sobe com "hibernate.ddl-auto: validate"
  Então a inicialização falha com erro de validação de schema
  E o erro aponta a tabela e a coluna divergente, sem a aplicação subir de forma inconsistente
```

---

### US-FUND-03 — As 12 entidades JPA reais mapeando o schema aplicado

**Como** desenvolvedor,
**quero** as 12 entidades JPA (`Usuario` da V1 + as 11 da V2) mapeando o
schema aplicado,
**para** que o domínio da oficina seja representado sem classes de template
genérico e sirva de base para as próximas features.

```gherkin
Cenário: Cada tabela real mapeada por uma entidade no singular
  Dado as 12 tabelas aplicadas por V1 e V2
  Quando o Hibernate carrega o contexto de persistência com "hibernate.ddl-auto: validate"
  Então a aplicação sobe sem erro de validação de schema
  E o pacote entity tem exatamente as classes Usuario, Cliente, Veiculo, Servico, Peca, OrdemServico, OrdemServicoServico, OrdemServicoPeca, MovimentacaoEstoque, Parcela, Pagamento e Financeiro
  E nenhuma entidade aponta para Categories, users (generico) ou products

Cenário: Relacionamentos refletem as chaves estrangeiras do schema
  Dado as entidades Veiculo, OrdemServico, OrdemServicoServico, OrdemServicoPeca, MovimentacaoEstoque, Parcela, Pagamento e Financeiro
  Quando o mapeamento JPA é inspecionado
  Então Veiculo referencia Cliente pela FK cliente_id
  E OrdemServico referencia Cliente e Veiculo pelas FKs cliente_id e veiculo_id
  E OrdemServicoServico e OrdemServicoPeca referenciam OrdemServico pela FK ordem_id
  E Pagamento referencia Parcela pela FK parcela_id

Cenário: Enum de domínio mapeado como STRING também no lado Java
  Dado os atributos de entidade que representam um enum (perfil de Usuario, status de OrdemServico, formaPagamento de Pagamento, tipo de MovimentacaoEstoque, tipo de Financeiro)
  Quando a anotação JPA é inspecionada
  Então cada atributo usa "@Enumerated(EnumType.STRING)"
  E nenhum usa "EnumType.ORDINAL"

Cenário: Colunas geradas mapeadas como somente leitura no lado Java
  Dado os atributos subtotal de OrdemServicoServico e OrdemServicoPeca
  Quando o mapeamento JPA é inspecionado
  Então cada atributo usa "@Column(insertable = false, updatable = false)"
  E nenhum service ou repository grava valor nesse atributo

Cenário de erro: entidade sem migration correspondente é rejeitada em revisão
  Dado uma entidade JPA nova ou alterada em um Pull Request
  Quando não existe uma migration Flyway correspondente no mesmo Pull Request
  Então a revisão de código deve rejeitar o Pull Request
```

---

### US-AUTH-01 — Login por email e senha emitindo JWT

**Como** usuário da oficina,
**quero** fazer login com email e senha,
**para** acessar o sistema de forma autenticada, sem que uma resposta de erro
revele se foi o email ou a senha que errou.

```gherkin
Cenário: Login com sucesso
  Dado um usuário cadastrado em usuarios com email "usuario.cadastrado@oficina.com" e senha "SenhaForte#1", cujo senha_hash foi gerado com BCrypt
  Quando ele envia POST /api/v1/auth/login com o corpo {"email": "usuario.cadastrado@oficina.com", "senha": "SenhaForte#1"}
  Então a API responde 200
  E o corpo contém token (JWT assinado HS256), tipo "Bearer" e expiraEm
  E o claim exp do token reflete exatamente iat + jwt.expiration-minutes (7 dias por padrão)
  E o claim sub é o id do usuário, o claim perfil é o perfil do usuário e o claim iss é "mecanica-sao-jorge-api"
  E o corpo contém usuario.id, usuario.nome, usuario.email e usuario.perfil
  E nenhum campo do corpo contém senha ou senha_hash

Esquema do Cenário: credencial inválida sem vazar qual campo errou
  Dado "<situacao>"
  Quando POST /api/v1/auth/login é enviado com o corpo {"email": "<email>", "senha": "<senha>"}
  Então a API responde 401
  E o corpo segue o formato padrão de erro (timestamp, status, erro, mensagem, path), lançado por CredenciaisInvalidasException
  E a mensagem é exatamente "Credenciais inválidas" nos dois casos, sem citar "email" ou "senha"
  E nenhum campo extra ou código de erro diferente permite distinguir os dois casos

  Exemplos:
    | situacao                           | email                          | senha             |
    | email cadastrado, senha incorreta  | usuario.cadastrado@oficina.com | senha-errada-123  |
    | email não cadastrado               | inexistente@oficina.com        | qualquer-senha    |

Cenário: Validação de entrada antes de consultar credenciais
  Dado um POST /api/v1/auth/login com o corpo {"email": "", "senha": ""}
  Quando a requisição é enviada
  Então a API responde 400 com os campos email e senha listados pelo Bean Validation (@NotBlank, @Email)
  E nenhuma chamada a UsuarioRepository.findByEmail é disparada

Cenário: Rota protegida sem token
  Dado um endpoint protegido pelo OAuth2 Resource Server (qualquer rota fora de /api/v1/auth/login, /v3/api-docs, /swagger-ui e /actuator/health)
  Quando a requisição chega sem o header Authorization
  Então a API responde 401
  E a regra de negócio do endpoint não é executada

Cenário: Token expirado, com assinatura inválida ou malformado
  Dado um token JWT expirado após 7 dias, ou assinado com chave diferente de jwt.secret, ou malformado
  Quando ele é enviado em um endpoint protegido via header "Authorization: Bearer <token>"
  Então o JwtDecoder rejeita o token
  E a API responde 401 no formato padrão de erro

Cenário: Formato de erro do resource server segue o handler global
  Dado o OAuth2 Resource Server rejeitando um bearer token ausente, inválido ou expirado
  Quando a resposta 401 é gerada pelo AuthenticationEntryPoint customizado
  Então o corpo segue timestamp, status, erro, mensagem, path (mesmo formato de GlobalExceptionHandler)
  E o desafio "WWW-Authenticate" padrão do Spring não substitui esse corpo
```

## 8. Acessibilidade e i18n

Não aplicável a esta rodada: não há tela nova aqui (ver nota no topo sobre o
recorte desta entrega). Quando a tela de login/perfil entrar na F30, os
critérios de acessibilidade (WCAG 2.2 AA, `aria-live` para erro, navegação por
teclado) e de i18n (chaves `area.componente.texto`, sem texto fixo) do
briefing original da fatia devem ser retomados.

## 9. Priorização e o que fica para depois

As quatro histórias desta entrega são sequenciais e bloqueantes entre si:
US-FUND-01 e US-FUND-02 (limpeza/guarda + schema) precisam fechar antes de
US-FUND-03 (entidades mapeando esse schema), que por sua vez precisa fechar
antes de US-AUTH-01 (login depende da entidade Usuario). Fica para depois,
sem decisão nova: tela de login/perfil no app (F30), diferenciação de
permissão ADMIN/FUNCIONARIO, cadastro/recuperação de senha, refresh token,
rate limiting/lockout no login, e qualquer item do backlog de produto
(dashboard, fotos, PDF, WhatsApp).

## 10. Confirmação de critérios de aceitação (follow-up do comandante, 2026-11-07)

Instrução recebida: "confirmar critérios de aceitação em Gherkin para limpeza
do template, migration V1 e login/perfil JWT, sem reabrir escopo já
entregue". Confirmação feita **contra o código real** de `apps/api`, não só
contra a leitura do PRD:

| Critério (seção 7) | Arquivo conferido | Resultado |
|---|---|---|
| US-FUND-01 (sem classe de template) | `entity/`, `controller/`, `service/`, `repository/` | Confirmado: só classes de domínio real (`Usuario`, `Cliente`, `AuthController`, `AuthService`, `UsuarioRepository` etc.), nenhuma `Category`/`Product`/`User`-genérico/`Itens` |
| US-FUND-02 (migration) | `V1__criar_tabela_usuarios.sql`, `V2__criar_schema_oficina.sql` | Confirmado: V1 intocada, V2 aditiva cria as 11 tabelas restantes; colunas `subtotal` com `GENERATED ALWAYS ... STORED`; `status`/`tipo`/`forma_pagamento` como `VARCHAR` |
| US-FUND-03 (12 entidades) | `entity/*.java` | Confirmado: 12 classes de entidade + 5 enums (`Perfil`, `StatusOS`, `FormaPagamento`, `TipoMovimentacao`, `TipoLancamento`) |
| US-AUTH-01 (login JWT) | `AuthController`, `AuthService`, `JwtConfig`, `SecurityConfig`, `GlobalExceptionHandler`, `CredenciaisInvalidasException`, `RestAuthenticationEntryPoint`, `.env.example` | Confirmado: `POST /api/v1/auth/login` público, claims `sub`/`perfil`/`iss`/`iat`/`exp`, expiração via `JWT_EXPIRATION_MINUTES` (10080 = 7 dias), 401 único para email inexistente/senha errada/usuário inativo, 401 do resource server no formato padrão via `RestAuthenticationEntryPoint` |

**Critérios confirmados sem alteração de texto** — o Gherkin da seção 7
(US-FUND-01, US-FUND-02, US-FUND-03, US-AUTH-01) já cobre os três eixos
pedidos e não precisou de ajuste de conteúdo.

Dois pontos de terminologia da instrução que não bati 1:1 com o texto do PRD,
registrados aqui para alinhamento — **sem reabrir a decisão**, já tomada e
justificada nas seções 1 e 5:

1. **"Migration V1"** — a instrução nomeia a migration de limpeza como V1; o
   PRD usa **V2 aditiva** (ADR-003), porque a V1 (`usuarios`) já foi aplicada
   pela F00 e não pode ser reescrita sem quebrar o checksum do Flyway no CI.
   Entendo que a instrução se refere à migration desta fatia em sentido
   amplo (schema da fundação), não ao nome literal do arquivo. Se o
   comandante quiser a V1 reaberta por outro motivo, preciso de uma instrução
   explícita antes, por ser decisão já fechada em ADR.
2. **"Login/perfil JWT"** — a instrução cita "perfil" junto do login. O PRD
   (nota do topo e seção 2) só cobre o endpoint de login emitindo JWT com o
   claim `perfil` do usuário; a **tela de perfil no app** é escopo da F30
   (depende de F02 e F25), decisão já registrada em `overview.md` e no quadro
   de features. Não incluí critério de tela de perfil aqui para não duplicar
   com a F30. Se a intenção era revisar os critérios de perfil da F30, esse
   PRD não é o documento certo.

**Pendência**: nenhuma nova. A confirmação acima não abre dúvida nova nem
altera as seções 2, 4 ou 5 deste PRD.
