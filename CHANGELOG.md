# Changelog

Todas as mudanças visíveis ao usuário desta operação são registradas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e
o versionamento [SemVer](https://semver.org/lang/pt-BR/). Enquanto a operação
está em fundação (sem endpoint ou tela de feature publicado), as entregas
ficam em `[Não lançado]`.

## [Não lançado]

### Adicionado

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

Nenhum impacto ainda: não há endpoint nem tela de feature publicados nesta
etapa. Nada quebra porque nada além da fundação existe.

### Não verificado nesta entrega

- Execução real de `mvn test` / `mvn verify` / `mvn checkstyle:check` /
  `mvn spotless:check` no backend: há relatórios de uma execução anterior em
  `apps/api/target/` (não versionado), mas nenhuma sessão desta operação
  reexecutou os comandos por falta de acesso a shell.
- Abertura do app mobile em simulador/emulador real (iOS/Android):
  `npm install`, `npm run lint`, `npm run typecheck` e `npm test` foram
  executados nesta entrega (ver commits da F01, com saída real colada),
  mas nenhuma sessão rodou `expo start --ios`/`--android` nem abriu o app
  num dispositivo ou simulador.
- Compatibilidade das versões do Spring Boot 4.1.0 e do Expo SDK `~54.0.0`
  com os respectivos registros (Maven Central / npm): confirmada via
  `npm view` nesta sessão para os pacotes do mobile tocados pela F01;
  não reconfirmada para o backend.

[Não lançado]: #
