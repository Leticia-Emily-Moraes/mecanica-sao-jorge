# OP-002 — App Mecânica São Jorge

## Visão geral

Monorepo da operação OP-002. Objetivo: substituir o controle manual da
Mecânica São Jorge por um sistema próprio de gestão de clientes, veículos,
ordens de serviço, catálogo de serviços e peças (com estoque), parcelas,
pagamentos e lançamentos financeiros. Uso interno da oficina, sem publicação
em loja de apps nesta fase.

Stack:

- **Backend** (`apps/api`): Java 21, Spring Boot 4.1.x, MySQL, Spring Data
  JPA, Spring Security com JWT, Bean Validation, Lombok, MapStruct, Flyway,
  springdoc-openapi.
- **Mobile** (`apps/mobile`): React Native com Expo (Expo Router) e
  TypeScript estrito.

```
op-002-app-mecanica-sao-jorge/
├── apps/
│   ├── api/      # backend Java 21 + Spring Boot
│   └── mobile/   # app React Native + Expo
└── docs/
    └── architecture/   # ADRs e decisões de arquitetura
```

> **Etapa atual: F37 — fechar pendência de commit da Sprint 01.** Veja
> `docs/product/F37-auditoria-sprint-01.md` para a auditoria completa. Resumo
> do que isso significa para quem só quer rodar o projeto:
>
> - O app mobile (`apps/mobile`) **já tem** as telas de Login e Perfil (F30)
>   e o menu principal pós-login (F33) implementadas e commitadas neste
>   histórico.
> - O backend (`apps/api`) **já tem** o endpoint de login (`AuthController`,
>   `JwtConfig`, DTOs) e a migration `V2` com as demais 11 tabelas da
>   oficina commitados (F02, recuperados pela F37) — login testado de ponta
>   a ponta nesta revisão, ver seção "Login" abaixo.
> - As demais features de negócio (Clientes, Veículos, Catálogo, Ordens de
>   Serviço, Financeiro) seguem sem implementação: as 11 tabelas existem no
>   schema, mas não há endpoint nem regra de negócio sobre elas ainda.

## Requisitos

Para rodar o backend e o mobile localmente:

- **JDK 21**
- **Maven 3.9+** (`mvn -v`) — o Maven Wrapper (`mvnw`) ainda não foi gerado
  nesta etapa (ver "Pendências")
- **Docker** — para o MySQL local do backend e para os testes de integração
  com Testcontainers
- **Node.js 20 LTS** (ou superior) e **npm** — para o app mobile
- **Expo Go** no celular (iOS/Android) **ou** um simulador iOS (Xcode) /
  emulador Android (Android Studio) — para abrir o app mobile

## Instalação

### Backend (`apps/api`)

```bash
cd apps/api
docker compose up -d        # sobe o MySQL 8.4 local (porta 3306)
cp .env.example .env        # edite se necessário; nunca comite valores reais
```

### Mobile (`apps/mobile`)

```bash
cd apps/mobile
npm install
cp .env.example .env
```

> Instruções completas e detalhadas de cada app, incluindo o que cada
> variável de ambiente faz: [apps/api/README.md](apps/api/README.md) e
> [apps/mobile/README.md](apps/mobile/README.md).

## Uso

### Rodar o backend

O Spring Boot lê variáveis de ambiente do processo, não o arquivo `.env`
diretamente. Carregue o `.env` no shell antes de subir a aplicação:

```bash
cd apps/api
set -a; source .env; set +a
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`:

- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Health check: `http://localhost:8080/actuator/health`

Confirmado nesta etapa (PERGAMINHO, F37), com a API de pé contra um MySQL
8.4 real (Docker, porta `3308`, só para esta verificação): `/v3/api-docs`
responde `200` e lista só `/api/v1/auth/login` (nenhuma outra rota de
negócio existe ainda); `/actuator/health` responde
`{"groups":["liveness","readiness"],"status":"UP"}`. `/swagger-ui.html`
responde `302` (redireciona para `/swagger-ui/index.html`, comportamento
padrão do springdoc — não testei o destino do redirect).

### Login (`POST /api/v1/auth/login`)

Único endpoint de negócio desta etapa. Público (sem token), recebe email e
senha, devolve um JWT HS256 válido por `JWT_EXPIRATION_MINUTES` (padrão 7
dias) e os dados básicos do usuário — nunca o hash da senha.

Requisição:

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@oficina.com","senha":"senha-do-usuario"}'
```

Resposta de sucesso (`200`) — **testada nesta etapa com um usuário real
inserido no banco (hash BCrypt gerado com `bcrypt`), resposta colada sem
edição, só com o token truncado por tamanho**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tipo": "Bearer",
  "expiraEm": "2026-11-18T23:08:25.526174Z",
  "usuario": {
    "id": 1,
    "nome": "Usuario Teste PERGAMINHO",
    "email": "usuario@oficina.com",
    "perfil": "ADMIN"
  }
}
```

Erro de credencial (`401`) — mesma mensagem genérica para email inexistente
e para senha incorreta, de propósito, para não revelar se o email existe
(testado nesta etapa, saída real):

```json
{
  "timestamp": "2026-11-11T20:08:25.836754-03:00",
  "status": 401,
  "erro": "Unauthorized",
  "mensagem": "Credenciais inválidas",
  "path": "/api/v1/auth/login"
}
```

Erro de validação (`400`, campos obrigatórios ausentes — testado nesta
etapa, saída real):

```json
{
  "timestamp": "2026-11-11T20:08:25.920136-03:00",
  "status": 400,
  "erro": "Bad Request",
  "mensagem": "senha e obrigatoria; email e obrigatorio",
  "path": "/api/v1/auth/login"
}
```

Endpoint protegido sem token (`401`, mesmo formato padrão do handler
global, não o desafio `WWW-Authenticate` padrão do Spring — testado nesta
etapa contra `/api/v1/clientes`, rota que ainda não existe como feature mas
já passa pelo filtro de segurança, saída real):

```json
{
  "timestamp": "2026-11-11T20:08:25.930291-03:00",
  "status": 401,
  "erro": "Unauthorized",
  "mensagem": "Nao autenticado",
  "path": "/api/v1/clientes"
}
```

> Não verificado nesta etapa: login a partir da tela do app mobile (Expo
> Go/simulador) contra este backend real — testei só via `curl`, não abri
> o app apontando para esta instância. O `usuario@oficina.com` acima é um
> registro de teste que inseri manualmente e removi junto com o container
> ao final da verificação; não há usuário de exemplo persistido no
> repositório nem seed automático nas migrations.

### Rodar o app mobile

```bash
cd apps/mobile
npm start
```

Escaneie o QR code com o Expo Go (iOS/Android), ou use os atalhos diretos:

```bash
npm run ios      # simulador iOS
npm run android  # emulador Android
npm run web      # navegador
```

## Configuração

### Backend — `apps/api/.env.example`

| Variável | Descrição |
|---|---|
| `DB_URL` | URL JDBC do MySQL (ex.: `jdbc:mysql://localhost:3306/mecanica_sao_jorge`) |
| `DB_USERNAME` | Usuário do banco |
| `DB_PASSWORD` | Senha do banco |
| `JWT_SECRET` | Segredo usado para assinar o JWT (HS256) — gere um valor próprio de ao menos 32 bytes, nunca o valor de exemplo. O placeholder do `.env.example` (`TROQUE-ESTE-VALOR`) tem menos de 32 bytes de propósito: se for copiado sem alterar, a API falha ao subir (fail-closed) em vez de rodar com um segredo público e forjável |
| `JWT_EXPIRATION_MINUTES` | Validade do token em minutos (padrão `10080` = 7 dias) |
| `SERVER_PORT` | Porta HTTP da API (padrão `8080`) |
| `SPRING_PROFILES_ACTIVE` | Perfil Spring ativo (padrão `local`) |

As credenciais de `docker-compose.yml` (`apps/api/docker-compose.yml`) já
coincidem com os valores de exemplo do `.env.example` para ambiente local.

### Mobile — `apps/mobile/.env.example`

| Variável | Descrição |
|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | URL base da API (padrão `http://localhost:8080/api/v1`) |

Variáveis `EXPO_PUBLIC_*` ficam embutidas no bundle do app — nunca coloque
segredo nelas.

## Testes

### Backend

```bash
cd apps/api
mvn test      # unitários (*Test.java) — sem Docker, sem banco
mvn verify    # unitários + integração (*IT.java) — precisa de Docker rodando
```

Lint e formatação (não presos ao ciclo de vida padrão do Maven):

```bash
mvn checkstyle:check   # lint
mvn spotless:check     # verifica formatação (google-java-format)
```

> **Evidência real desta etapa (PERGAMINHO, `mvn clean verify` do zero,
> MySQL 8.4 via Testcontainers, JDK Temurin 21):** 19 testes, 0 falhas —
> `AuthServiceTest` (7), `AuthControllerTest` (7, MockMvc com contexto
> Spring completo, incluindo token malformado/expirado contra o
> `JwtDecoder`/`RestAuthenticationEntryPoint` reais), `GlobalExceptionHandlerTest`
> (2) e `FlywayMigrationIT` (3, aplica V1+V2 do zero contra MySQL real).
> `mvn checkstyle:check` e `mvn spotless:check` sem violação. Além disso,
> subi a API de pé (`java -jar target/api.jar`) contra um MySQL local e
> testei com `curl`: ver exemplos reais na seção "Login" acima e em
> "Uso → Rodar o backend".

### Mobile

```bash
cd apps/mobile
npm test              # Jest — app/index.test.tsx e src/config/env.test.ts
npm run lint           # ESLint
npm run format:check   # Prettier
npm run typecheck      # tsc --noEmit
```

> **Atualizado na F01 (correção da fundação mobile):** `npm install`,
> `npm run lint`, `npm run typecheck`, `npm run format:check` e `npm test`
> foram executados de verdade (ver commits da F01). `npm install` roda sem
> `ERESOLVE`, e `lint`/`typecheck`/`format:check` terminam com zero falha.
> `npm test` ainda tem 1 suíte falhando (`app/index.test.tsx`): um problema
> de versões pré-existente e fora do escopo da F01 (`babel-preset-expo` e
> `expo-router` presos na geração do Expo SDK 52, enquanto `expo` e
> `react-native` já estão no SDK 54) — detalhes no `CHANGELOG.md`. Abrir o
> app em um simulador ou emulador real segue pendente.

## Contribuição

- Trabalhe em branch própria; commits pequenos no padrão
  [Conventional Commits](https://www.conventionalcommits.org/).
- Nunca comite segredo (`.env` com valor real), binário grande ou arquivo
  gerado (`target/`, `node_modules/`, `.expo/`, `dist/`).
- Toda mudança de schema do backend exige uma migration Flyway nova; o
  Hibernate roda com `ddl-auto: validate` e não altera o schema sozinho.
- Toda função exportada (TypeScript) ou método público relevante (Java) deve
  ter documentação do propósito, parâmetros, retorno e erros lançados.
- Regra de negócio do backend só no `service`; nenhuma entidade JPA pode ser
  exposta na API — sempre via DTO `*Response`.
- Ao final de cada entrega, descreva o que mudou, por quê e como verificar.

## Status desta etapa

> A divergência entre "commitado no git" e "só no working tree" que esta
> seção registrava (auditoria F37, 2026-11-09) **foi fechada**: os blocos
> de backend, CI/container e documentação abaixo estão commitados em
> `HEAD` desta branch, confirmado via `git ls-files` nesta revisão. Detalhe
> completo, feature por feature, com a evidência de cada afirmação:
> `docs/product/F37-auditoria-sprint-01.md`.

**Commitado no histórico git (`HEAD` desta branch):**

- [x] `apps/api`: template genérico removido; pacotes `config`/`exception`/
      `security`/`entity`/`dto`/`mapper`/`repository`/`controller`/`service`;
      12 entidades JPA reais no singular (11 de negócio da oficina +
      `Usuario`); migrations `V1` (`usuarios`) e `V2` (demais 11 tabelas);
      `POST /api/v1/auth/login` emitindo JWT HS256 via OAuth2 Resource
      Server; `RestAuthenticationEntryPoint` customizado. 19 testes
      automatizados + checkstyle/spotless, reconfirmados nesta revisão
      contra o `HEAD` atual (ver "Testes").
- [x] `apps/mobile`: telas de Login e Perfil com logout (F30) e a tab bar do
      menu principal pós-login (F33), token e dados do usuário presos ao
      `expo-secure-store`.
- [x] `docs/design/`: wireframe de baixa fidelidade das 24 telas (F24) e
      protótipo de alta fidelidade de Login/Perfil (F25) e da tab bar (F34)
      no Figma — **gate de "Aprovado" da F25 ainda aberto** (ver
      `CHANGELOG.md`).
- [x] CI (`.github/workflows/ci-api.yml`), `apps/api/Dockerfile`,
      `apps/api/.dockerignore`, `.gitleaks.toml` e o plugin
      `dependency-check-maven` do `pom.xml`.
- [x] `docs/architecture/` (ADRs 001-011 do CARTOGRAFO, visão geral e
      diagramas C4) e `docs/product/` (PRDs de F02/F24/F25/F33 e a própria
      auditoria F37).

**Pendências que seguem em aberto (não é escopo da F37 corrigir):**

- [ ] Maven Wrapper (`apps/api/mvnw`): não gerado até esta etapa.
- [ ] `docs/script.sql`: arquivo não commitado de propósito nesta revisão —
      é um schema divergente e mais antigo (nomes em PascalCase, `DROP
      DATABASE`, fora do controle do Flyway) que conflita com as migrations
      `V1`/`V2` reais. Decisão de manter, mover ou remover fica para
      CARTOGRAFO/REGENTE; documentá-lo como "commitado" sem essa decisão
      espalharia uma segunda fonte de verdade para o schema.
- [ ] Scan completo do OWASP Dependency-Check: não concluído em nenhuma
      sessão local (ver `CHANGELOG.md`).

Fora do escopo das features desta sprint (ver PRDs em `docs/product/`):
diferenciação de permissão ADMIN/FUNCIONARIO, cadastro de usuário,
recuperação de senha, refresh token e as demais features de negócio
(Clientes, Veículos, Catálogo, Ordens de Serviço, Financeiro).

## Changelog

Ver [CHANGELOG.md](CHANGELOG.md).
