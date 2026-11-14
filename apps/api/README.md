# api — backend Mecânica São Jorge

API REST em Java 21 + Spring Boot 4.1.2, MySQL via Spring Data JPA,
migrations com Flyway, autenticação stateless com JWT HS256 via OAuth2
Resource Server (ADR-004), documentação via springdoc-openapi. Pacotes
organizados por camada, não por feature (ADR-001/ADR-002).

**Etapa atual: F02 — Fundação backend + Login.** O template genérico
(`Category`/`Product`/`User`/`Itens` duplicada) foi removido.

> **Atualização (F37, 2026-11-11):** o que a seção abaixo descreve estava,
> numa revisão anterior, só no working tree — essa divergência foi fechada:
> `AuthController`, `dto/`, `mapper/`, `entity/`, `repository/`, `JwtConfig`,
> `RestAuthenticationEntryPoint`, `CredenciaisInvalidasException` e a
> migration `V2` estão commitados em `HEAD` desta branch (ESPRESSO,
> commits `eb5830d` a `79ed815`). Reconfirmei nesta revisão, contra o
> `HEAD` atual: `mvn clean install` → `BUILD SUCCESS`, 19 testes, 0 falhas.
> Detalhe completo da auditoria: `docs/product/F37-auditoria-sprint-01.md`.
> O que existe hoje:

- 12 entidades JPA reais no singular em `entity/` (11 tabelas de negócio da
  oficina + `Usuario`), mapeando o schema aplicado pelas migrations;
- migration Flyway `V1__criar_tabela_usuarios.sql` (tabela `usuarios`, da
  F00) + `V2__criar_schema_oficina.sql` (as demais 11 tabelas da oficina,
  aditiva — ver ADR-003);
- `SecurityConfig` como OAuth2 Resource Server stateless: endpoints públicos
  de documentação/health/login, qualquer outra rota exige `Authorization:
  Bearer <token>`;
- `POST /api/v1/auth/login`: autenticação por email e senha, devolve JWT
  HS256 válido por `jwt.expiration-minutes` (padrão 10080 min = 7 dias) e os
  dados básicos do usuário, sem nunca expor `senha_hash`;
- `RestAuthenticationEntryPoint` customizado: toda rejeição do resource
  server (sem token, token malformado, token expirado) responde no formato
  padrão do handler global (`timestamp`, `status`, `erro`, `mensagem`,
  `path`), não no desafio `WWW-Authenticate` padrão do Spring;
- proteção contra enumeração de usuário por timing: o BCrypt roda em todos
  os caminhos do login, mesmo quando o email não existe;
- documentação OpenAPI habilitada (`springdoc-openapi`; `springfox`
  removido);
- lint, formatação, 16 testes unitários + 3 testes de integração com
  Testcontainers.

Fora do escopo desta etapa: Clientes, Veículos, Ordens de Serviço,
Catálogo, Financeiro, diferenciação de permissão ADMIN/FUNCIONARIO,
cadastro de usuário, recuperação de senha e refresh token (ver
`docs/product/F02-fundacao-backend-login.md`).

## Pré-requisitos

- JDK 21 (travado pelo `maven-enforcer-plugin`: outro JDK falha no `validate`)
- Maven Wrapper incluso: `./mvnw` (Maven 3.9.9), sem Maven instalado no host.
  Com Maven próprio: 3.9+ (`mvn -v`) **rodando com o JDK 21**: confira a linha
  `Java version` do `mvn -v`, não só o `java -version`. O Maven do Homebrew
  instala e usa o OpenJDK mais recente (ex.: 27), e o Lombok falha nele com
  `ExceptionInInitializerError: com.sun.tools.javac.tree.EndPosTable`. No
  macOS, fixe o JDK 21 no shell:

  ```bash
  export JAVA_HOME=$(/usr/libexec/java_home -v 21)
  ```
- Docker (para o MySQL local e para os testes de integração com
  Testcontainers)

> O `./mvnw` confere o SHA-256 do Maven baixado (`distributionSha256Sum` em
> `.mvn/wrapper/maven-wrapper.properties`, OWASP A08). O hash é o do `.zip`:
> o script só baixa o `.zip` quando há `unzip` no PATH; sem `unzip` ele baixa o
> `.tar.gz` e a validação falha com "your Maven distribution might be
> compromised". macOS e os runners `ubuntu-latest` do GitHub já trazem `unzip`;
> em contêiner mínimo (ex.: `eclipse-temurin:21-jdk`), instale antes
> (`apt-get install -y unzip`). Ao trocar a versão do Maven, atualize o hash
> junto (`shasum -a 256` do `.zip`, conferindo o `.sha512` oficial).

## Subir o banco local

```bash
cd apps/api
docker compose up -d
```

Isso sobe um MySQL 8.4 em `localhost:3306` com o banco/usuário já definidos
em `docker-compose.yml` (iguais aos valores de exemplo do `.env.example`).

> Se a porta `3306` já estiver em uso por outro processo no seu ambiente,
> `docker compose up -d` falha com `address already in use`. Não precisa
> mexer no `docker-compose.yml`: crie o `.env` (seção abaixo) antes e defina
> nele `MYSQL_HOST_PORT=3307` e a mesma porta no `DB_URL`
> (`jdbc:mysql://localhost:3307/mecanica_sao_jorge`). O Docker Compose lê o
> `.env` da mesma pasta automaticamente.

## Configurar variáveis de ambiente

```bash
cp .env.example .env
# edite .env se necessário (nunca comite o .env com valores reais)
```

O Spring Boot lê variáveis de ambiente do processo, não arquivos `.env`
diretamente. Para carregar o `.env` no shell antes de rodar a aplicação:

```bash
set -a; source .env; set +a
```

`JWT_SECRET` precisa ter ao menos 32 bytes — a aplicação recusa subir
(fail-closed) se o valor copiado do `.env.example` (`TROQUE-ESTE-VALOR`,
menos de 32 bytes) não for trocado.

## Rodar a aplicação

```bash
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`. Documentação:

- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Health check: `http://localhost:8080/actuator/health`

**Confirmado nesta etapa (PERGAMINHO, F37)**, com `mvn spring-boot:run` de
pé contra um MySQL 8.4 real (Docker): `/v3/api-docs` responde `200` e lista
só `/api/v1/auth/login`; `/actuator/health` responde
`{"groups":["liveness","readiness"],"status":"UP"}`; `/swagger-ui.html`
responde `302` (redirect padrão do springdoc).

### Testar o login manualmente

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@oficina.com","senha":"senha-do-usuario"}'
```

Exemplos completos de requisição/resposta (sucesso, credencial inválida,
validação, rota protegida sem token) estão no `README.md` da raiz da
operação, seção "Login" — todos testados de ponta a ponta nesta etapa,
incluindo o cenário de sucesso (`200`), com um usuário inserido manualmente
no banco (sem seed automático nas migrations).

## Rodar os testes

```bash
mvn test      # unitários (*Test.java) — sem Docker, sem banco
mvn verify    # unitários + integração (*IT.java) — precisa de Docker rodando
```

- `AuthServiceTest` (7 testes): Mockito, regra de negócio do login,
  incluindo a proteção contra timing attack.
- `AuthControllerTest` (7 testes): MockMvc com contexto Spring completo —
  sucesso, credencial inválida, validação, sem token, token malformado e
  token expirado (contra o `JwtDecoder`/`RestAuthenticationEntryPoint`
  reais).
- `GlobalExceptionHandlerTest` (2 testes): unitário, Mockito + AssertJ, sem
  dependência de banco de dados ou de contexto Spring.
- `FlywayMigrationIT` (3 testes): sobe um MySQL real via Testcontainers,
  deixa o Spring Boot aplicar `V1`+`V2` do zero e confirma as 12 tabelas
  (11 de negócio + `usuarios`). Roda na fase `verify`
  (maven-failsafe-plugin), não em `mvn test`, porque precisa de Docker.

> **Evidência real desta etapa (PERGAMINHO):** `mvn clean verify` rodado do
> zero (JDK Temurin 21, MySQL 8.4 via Testcontainers) — 19 testes, 0
> falhas. `mvn checkstyle:check` e `mvn spotless:check` sem violação.

## Lint e formatação

Não estão presos ao ciclo de vida padrão do Maven (não quebram `mvn verify`)
para evitar bloquear o build com regras ainda não auditadas em código real:

```bash
mvn checkstyle:check   # lint
mvn spotless:check     # verifica formatação (google-java-format)
mvn spotless:apply     # aplica a formatação
```

## Estrutura de pastas

```
src/main/java/br/com/mecanicasaojorge/api/
├── ApiApplication.java
├── config/       # beans de infraestrutura (OpenAPI, propriedades de JWT)
├── security/     # SecurityConfig, JwtConfig, RestAuthenticationEntryPoint
├── exception/    # AppError, ErrorResponse, GlobalExceptionHandler,
│                 # CredenciaisInvalidasException
├── controller/   # AuthController
├── service/      # AuthService (regra de negócio só aqui, ADR)
├── repository/   # Spring Data JPA
├── entity/       # 12 entidades JPA reais no singular (nunca expostas na API)
├── dto/          # LoginRequest, LoginResponse, UsuarioResumo
└── mapper/       # MapStruct entidade <-> DTO

src/main/resources/
├── application.yml
└── db/migration/
    ├── V1__criar_tabela_usuarios.sql   # baseline (F00)
    └── V2__criar_schema_oficina.sql    # demais 11 tabelas (F02, aditiva)

src/test/java/br/com/mecanicasaojorge/api/
├── controller/     # AuthControllerTest
├── service/        # AuthServiceTest
├── exception/      # GlobalExceptionHandlerTest
└── integration/    # FlywayMigrationIT (Testcontainers, ADR-010)
```

## Pendências / riscos conhecidos

- **Login sem usuário de seed**: as migrations desta fatia não inserem
  nenhum usuário. Para testar o caminho de sucesso (`200`) manualmente,
  é preciso inserir um usuário com `senha_hash` em BCrypt diretamente no
  banco — não há endpoint de cadastro nesta fatia (fora de escopo).
- **Scan completo do OWASP Dependency-Check não concluído** em nenhuma
  sessão local (sem `NVD_API_KEY`, o download da base do NVD leva 60+
  minutos na primeira vez) — só roda de ponta a ponta no CI real.
- **Schema `V2` deliberadamente mínimo**: algumas tabelas (`servicos`,
  `pecas`, `ordens_servico`, `movimentacoes_estoque`, `pagamentos`,
  `financeiro`) ainda não têm todas as colunas de negócio — cada feature
  futura (Catálogo, OS, Financeiro) adiciona as suas via migration própria
  (mapa de colunas pendentes em `docs/architecture/overview.md`).
