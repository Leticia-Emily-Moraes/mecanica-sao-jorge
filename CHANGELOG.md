# Changelog

Todas as mudanças visíveis ao usuário desta operação são registradas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e
o versionamento [SemVer](https://semver.org/lang/pt-BR/). Enquanto a operação
não corta a primeira tag, as entregas ficam em `[Não lançado]`.

## [Não lançado]

> **Nota de honestidade (auditoria F37, atualizada em 2026-11-11):** este
> changelog chegou a descrever, numa única lista de "Adicionado", tanto o
> que estava de fato no histórico git quanto código que só existia no
> working tree de uma sessão anterior — nunca commitado em nenhuma branch.
> **Essa divergência foi fechada nesta revisão**: os commits `eb5830d` até
> `79ed815` (ESPRESSO, backend F02) e `d385384`/`824490d`/`ef71319` (ANCORA,
> CI/gitleaks/Dockerfile) recuperaram todo o bloco que antes só existia no
> working tree. Reexecutei `mvn clean install` e `mvn checkstyle:check
> spotless:check` contra o `HEAD` atual desta branch (não contra working
> tree de sessão anterior) e confirmei: **19 testes, 0 falhas; 0 violação de
> lint/formatação.** Também subi a API de pé contra um MySQL 8.4 real
> (Docker, fora do Testcontainers) e testei `POST /api/v1/auth/login` com
> `curl` contra um usuário de fato inserido no banco — ver seção "Impacto
> para quem usa". Detalhe completo da auditoria, por feature, PR e teste:
> `docs/product/F37-auditoria-sprint-01.md`.

### Adicionado (commitado no histórico git)

- Fundação do backend (`apps/api`): scaffold Maven em Java 21 + Spring Boot
  4.1.0, Spring Security (stateless, sem filtro JWT ainda), Bean Validation,
  Lombok, MapStruct, Flyway, springdoc-openapi, Testcontainers.
- Migration Flyway baseline `V1__criar_tabela_usuarios.sql`: tabela
  `usuarios` (`nome`, `email` único, `senha_hash`, `perfil`
  `ADMIN`/`FUNCIONARIO` como `STRING`, `ativo`, `created_at`, `updated_at`).
- Handler global de erro no formato padronizado (`timestamp`, `status`,
  `erro`, `mensagem`, `path`).
- Teste unitário de exemplo (`GlobalExceptionHandlerTest`) e teste de
  integração com Testcontainers (`FlywayMigrationIT`, roda as migrations do
  zero contra MySQL real).
- Fundação do app mobile (`apps/mobile`): scaffold Expo com Expo Router,
  TypeScript estrito, ESLint + Prettier, Jest, leitor de variável de
  ambiente (`src/config/env.ts`) e tela única de smoke test (`app/index.tsx`).
- `.env.example` do backend e do mobile, sem segredo.
- `docker-compose.yml` com MySQL 8.4 para desenvolvimento local do backend.

### Commitado (F02 — Fundação backend + Login)

> Recuperado do working tree e commitado pela F37 em 13 commits pequenos
> (ESPRESSO, `eb5830d` até `79ed815`, todos referenciando "F02" na mensagem).
> Confirmado novamente nesta revisão: `mvn clean install` contra o `HEAD`
> atual desta branch — `BUILD SUCCESS`, 19 testes (7 `AuthServiceTest` + 7
> `AuthControllerTest` + 2 `GlobalExceptionHandlerTest` + 3 `FlywayMigrationIT`
> com Testcontainers real), 0 falhas; `mvn checkstyle:check spotless:check`
> sem violação.

- Template genérico removido de `apps/api`: nenhuma classe residual de
  `Category`, `Product`, `User` ou `Itens` (duplicada) sobra em
  `entity`/`controller`/`service`/`repository`.
- 12 entidades JPA reais no singular em `entity/` (11 tabelas de negócio da
  oficina + `Usuario`), mapeando o schema aplicado pelo Flyway — nenhuma
  aponta para `Categories`, `users` ou `products`.
- Migration `V2__criar_schema_oficina.sql`, aditiva à `V1__criar_tabela_usuarios.sql`
  da F00 (ADR-003: reescrever a V1 quebraria o checksum do Flyway já
  aplicado). As 11 tabelas restantes da oficina (clientes, veículos,
  serviços, peças, ordens de serviço e suas junções, movimentações de
  estoque, parcelas, pagamentos, financeiro) sobem do zero sem `DROP
  DATABASE`.
- `POST /api/v1/auth/login`: autenticação por email e senha, devolve JWT
  HS256 assinado com `JwtEncoder`/`JwtDecoder` (chave simétrica via
  `jwt.secret`, nunca no código ou no log) e os dados básicos do usuário
  (`id`, `nome`, `email`, `perfil`), sem nunca expor `senha_hash`. Token
  válido por `jwt.expiration-minutes` (padrão 10080 min = 7 dias,
  configurável, não hardcoded).
- `RestAuthenticationEntryPoint` customizado: toda rejeição do OAuth2
  Resource Server (sem token, token malformado, token expirado) responde no
  formato padrão do handler global (`timestamp`, `status`, `erro`,
  `mensagem`, `path`), em vez do desafio `WWW-Authenticate` padrão do
  Spring.
- `spring-boot-starter-oauth2-resource-server` ativo no `pom.xml` (diff
  ainda não commitado); `springdoc-openapi` e `MapStruct` já estavam no
  `pom.xml` commitado desde a F00 — `springfox` nunca existiu neste
  repositório.
- `CredenciaisInvalidasException`: mensagem genérica idêntica para email
  inexistente e senha incorreta, sem revelar se o email está cadastrado.

### Commitado (infraestrutura — F37)

- Pipeline de CI do backend (`.github/workflows/ci-api.yml`, ANCORA,
  `d385384`), em jobs sequenciais que falham rápido: lint (`checkstyle` +
  `spotless`) → teste unitário → build + teste de integração (`mvn verify`,
  que sobe um MySQL 8.4 real via Testcontainers e aplica as migrations
  V1+V2 do zero) → auditoria de dependência (OWASP Dependency-Check, CVSS ≥
  7 quebra o build) → verificação de segredo vazado (gitleaks, repositório
  inteiro e histórico de commits) → build da imagem Docker (sem push).
  Actions e a imagem do gitleaks fixadas por SHA/digest.
- `apps/api/Dockerfile` multi-stage (ANCORA, `ef71319`): build com Maven,
  runtime só com JRE 21 Temurin, usuário não-root (`app`, uid/gid 10001),
  healthcheck via `/actuator/health`, configuração só por variável de
  ambiente. Confirmado por ANCORA: imagem final 419MB, sem Maven/`.m2`
  dentro.
- Plugin `org.owasp:dependency-check-maven` no `pom.xml` (gate de
  auditoria de dependência, não atrelado ao ciclo de vida padrão).
- `.gitleaks.toml` na raiz da operação (ANCORA, `824490d`): exclui
  `node_modules`, `target`, `.expo`, `dist`, `build` do escaneamento e
  inclui uma allowlist estreita para o JWT de exemplo truncado deste
  README (termina em `...`, nunca um token real). Confirmado por ANCORA
  com `gitleaks detect` real: zero achados no working tree e no histórico
  de 37 commits.
- **Não concluído em nenhuma sessão local**: o scan completo do OWASP
  Dependency-Check (`mvn org.owasp:dependency-check-maven:check`). Sem
  `NVD_API_KEY`, o download da base do NVD (~424 mil registros) leva 60+
  minutos na primeira vez. Só vai rodar de ponta a ponta no CI real, com
  cache semanal configurado no workflow.

### Commitado (F24 — Wireframe de baixa fidelidade, PR #3 mergeado)

- Arquivo Figma único da operação com as 24 telas do wireframe de baixa
  fidelidade, nomeadas e com os quatro estados (`vazio`/`carregando`/`erro`/
  `preenchido`) conforme `docs/design/F24-wireframe-baixa-fidelidade.md`.
- Correções de resíduo encontradas em revisão: erro de rede como popup (não
  inline) em toda tela, texto sem `!`, sem emoji, e um erro de validação
  herdado indevidamente no campo "código" da tela 15 (Peças → Editar)
  removido.

### Commitado (F25 — Protótipo de alta fidelidade de Login e Perfil)

- 9 frames na página F25 do arquivo Figma, com os tokens `petro` (`#1E3A3F`)
  e `primary` (`#B5453D`) via Figma Variables e 10 conexões de navegação,
  documentados em `docs/design/figma.md`.
- **Gate de aprovação ainda aberto**: o QA (CRIVO) encontrou dois gaps não
  fechados — o grafo de navegação trava em "Carregando" sem clique de saída,
  e o anel de foco só está ilustrado em 2 dos 6+ controles. A linha
  "Aprovado" exigida pelo ADR-007 para liberar a F30 não existe no
  documento até esta revisão; a F30 avançou mesmo assim por instrução direta
  do comandante (registrado em `apps/mobile/README.md`, "Divergência de
  governança registrada").

### Commitado (F30 — Login e Perfil mobile, consumindo a API da F02)

- Telas `app/login.tsx` e `app/perfil.tsx` (com logout por diálogo de
  confirmação), reidratação de sessão em `app/index.tsx`, token e dados do
  usuário presos ao `expo-secure-store` (nunca `AsyncStorage`). Detalhe
  completo em `apps/mobile/README.md`.
- O backend que essas telas consomem (`POST /api/v1/auth/login`, F02) está
  commitado desde esta revisão — ver bloco "Commitado (F02...)" acima.

### Commitado (F33 — Tab bar do menu principal pós-login)

- Login passa a aterrissar no menu principal (5 posições fixas, só Perfil
  habilitado nesta sprint); guard de sessão duplicado no layout do grupo
  `(menu)` cobre deep link e retomada sem token.

### Corrigido (F02 — AppSec/LGPD, achados do VIGIA)

- Enumeração de usuário por diferença de tempo (timing attack):
  `AuthService.login` fazia *short-circuit* com `.orElseThrow` antes do
  BCrypt quando o email não existia ou o usuário estava inativo, criando
  uma diferença de tempo mensurável em relação ao caminho de senha
  incorreta (o BCrypt roda em milissegundos). Corrigido para rodar o
  BCrypt em todos os caminhos, contra um hash constante (`DUMMY_HASH`)
  quando o usuário não é encontrado.
- `.env.example`: `JWT_SECRET` de exemplo trocado de um valor que
  **passava** na validação de 32 bytes mínimos (`change-me-generate-a-32-plus-byte-secret`,
  38 bytes — risco de subir em produção com um segredo público e
  forjável se copiado sem alterar) para um placeholder **fail-closed**
  (`TROQUE-ESTE-VALOR`, menos de 32 bytes): a aplicação recusa subir se o
  valor não for trocado.

### Corrigido (F01 — correção da fundação mobile)

Backend nesta operação: Java 21 + Spring Boot `4.1.0` (versão lida
diretamente de `spring-boot-starter-parent` em `apps/api/pom.xml` no
momento desta entrega), sem nenhuma linha de `apps/api` alterada por esta
feature. Quatro achados técnicos do scaffold mobile herdado do commit
`6feed2a` foram corrigidos, um por fatia:

- Achado A: `react` preso em `19.0.0` conflitava com o peer dependency
  `^19.1.0` exigido por `react-native@0.81.0` (`npm install` falhava com
  `ERESOLVE`). Corrigido para `^19.1.0`, com `@types/react` acompanhando
  para `~19.1.0` pela mesma cadeia de dependência.
- Achado B: `@testing-library/react-native@^12.7.0` (linha sem suporte,
  segundo o próprio pacote) atualizado para `^13.3.3`, versão compatível
  com `react-native@0.81.0` e `react@19.x` que preserva a API síncrona de
  `render()` já usada nos testes existentes.
- Achado C: leitura da URL base da API migrada de `process.env` direto em
  runtime para `expo-constants` (`Constants.expoConfig.extra.apiBaseUrl`),
  populado por um novo `app.config.ts` (substitui o `app.json` estático).
- Achado D: `app/index.tsx` formatado conforme o Prettier do projeto.

### Problema conhecido, fora do escopo desta feature

Durante a Fatia B, o avanço do `@testing-library/react-native` expôs um
problema anterior, não listado entre os achados A-E: `babel-preset-expo`
(`~12.0.0`, instalado em `12.0.12`) e `expo-router` (`~4.0.0`, instalado
em `4.0.22`) estão presos na geração do Expo SDK 52, enquanto `expo`
(`~54.0.0`) e `react-native` (`0.81.0`) já estão na geração do SDK 54
(`expo@54.0.38` declara precisar de `babel-preset-expo@~54.0.12`; a
dist-tag `sdk-54` de `expo-router` aponta para `6.0.24`, não para a
versão instalada). Isso faz o Jest falhar ao fazer parse de sintaxe Flow
dentro do próprio `react-native` (`ViewConfigIgnore.js`) e trava
`app/index.test.tsx` mesmo com achados B e C corrigidos. Não foi
corrigido nesta feature — exige decisão própria (nova feature) para
alinhar essas dependências à geração do SDK 54.

### Impacto para quem usa

Primeiro endpoint de negócio, `POST /api/v1/auth/login`, está commitado,
testado automaticamente (16 testes unitários/controller + 3 de integração)
e **testado de ponta a ponta nesta revisão** com a API de pé contra um
MySQL 8.4 real (Docker) e um usuário inserido manualmente no banco
(hash BCrypt real): login com sucesso devolve `200` com `token`, `tipo`,
`expiraEm` e os dados do usuário (ver `apps/api/README.md`, seção "Login",
para a resposta real completa). As telas de Login e Perfil do app mobile
(F30) e a tab bar do menu (F33), já commitadas, conseguem de fato logar
contra esse backend hoje. Esta revisão corrige uma divergência anterior do
changelog, que descrevia esse endpoint como "só no working tree" — ele já
estava commitado pelos commits da F37 citados no topo deste arquivo.

### Não verificado nesta entrega

- Abertura do app mobile em simulador/emulador real (iOS/Android):
  `npm install`, `npm run lint`, `npm run typecheck` e `npm test` foram
  executados nesta entrega (ver commits da F01, com saída real colada),
  mas nenhuma sessão rodou `expo start --ios`/`--android` nem abriu o app
  num dispositivo ou simulador.
- Compatibilidade da versão do Expo SDK `~54.0.0` com o registro do npm:
  confirmada via `npm view` na F01. O lado backend (Spring Boot 4.1.0) foi
  confirmado nesta etapa de outra forma: `mvn clean verify` resolve as
  dependências do Maven Central e builda/sobe normalmente, o que já prova
  a disponibilidade da versão (não rodei um `npm view`-equivalente).
- `mvn org.owasp:dependency-check-maven:12.1.3:check` (o scan completo de
  CVE): o plugin foi resolvido e sua ajuda (`help`) rodou com sucesso, mas
  o `check` em si não foi executado nesta sessão — baixa a base do NVD e,
  sem `NVD_API_KEY`, pode demorar bastante na primeira vez. O job
  `dependency-audit` do CI real vai validar isso na primeira execução.
- Workflow de deploy: não criado nesta entrega porque não há decisão de
  infraestrutura/ambiente de produção registrada em nenhum ADR para esta
  operação. O CI entrega até a imagem Docker construída (sem push);
  publicar e implantar essa imagem depende de uma decisão de arquitetura
  ainda não tomada.
- `docker compose up -d` na porta `3306` padrão, usando exatamente o
  `docker-compose.yml` do repositório: não reexecutado nesta sessão porque
  a porta já estava ocupada por um processo externo ao projeto neste
  ambiente (mesmo achado já registrado por ESPRESSO/ORLA em sessões
  anteriores). A verificação desta etapa rodou a mesma imagem `mysql:8.4`
  numa porta alternativa (`3308`, só nesta sessão, sem alterar
  `docker-compose.yml`) e via Testcontainers (`mvn verify`), que sobe a
  mesma imagem de forma isolada e descartável.
- `mvn org.owasp:dependency-check-maven:12.1.3:check` completo: continua
  não executado em nenhuma sessão local por falta de `NVD_API_KEY` (ver
  nota em "Commitado (infraestrutura — F37)" acima).
- Abertura do app mobile contra este backend real (login na tela, não via
  `curl`): a API ficou de pé e o endpoint respondeu corretamente nesta
  sessão, mas não abri o Expo Go/simulador apontando para ela — mesma
  lacuna já registrada abaixo para o app mobile em geral.

[Não lançado]: #
