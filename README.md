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
    └── architecture/   # ADRs e decisões de arquitetura — pendente de commit (ver "Pendências")
```

> **Etapa atual: F00 — Setup do projeto.** Só existe a fundação de cada app
> (dependências, configuração, segurança base, migration baseline, lint e um
> teste de exemplo). Nenhuma regra de negócio de feature (Login, Clientes,
> Veículos, Catálogo, Ordens de Serviço, Financeiro) foi implementada ainda.

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
| `JWT_SECRET` | Segredo usado para assinar o JWT — gere um valor próprio de ao menos 32 bytes, nunca o valor de exemplo |
| `JWT_EXPIRATION_MINUTES` | Validade do token em minutos (padrão `120`) |
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

> **Evidência real encontrada nesta etapa:** `apps/api/target/` (não
> versionado) contém relatórios de uma execução anterior bem-sucedida:
> `surefire-reports` — `GlobalExceptionHandlerTest`, 2 testes, 0 falhas;
> `failsafe-reports` — `FlywayMigrationIT` (Testcontainers), 3 testes, 0
> falhas; `checkstyle-result.xml` sem violação. Esta etapa (PERGAMINHO) não
> teve acesso a shell/Bash e não re-executou os comandos — reporto o que
> está nos relatórios, não uma execução própria. Não há relatório
> equivalente de `mvn spotless:check`.

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

## Status desta etapa (Setup do projeto — F00)

- [x] `apps/api`: estrutura de pastas por camada, dependências da stack,
      segurança base, handler global de erro, migration Flyway baseline
      (`usuarios`), OpenAPI habilitado, lint/formatação configurados,
      1 teste unitário + 1 teste de integração com Testcontainers escritos.
      Execução real pendente de confirmação nesta sessão (ver "Testes").
- [x] `apps/mobile`: scaffold Expo + Expo Router + TypeScript estrito,
      ESLint/Prettier, 2 testes de exemplo, `.env.example` sem segredo.
      Execução real e teste em simulador/emulador pendentes (ver "Testes").
- [ ] `docs/architecture`: ADRs, diagramas e mapa de dados LGPD foram
      redigidos pelo CARTOGRAFO, mas não foram gravados em arquivo nesta
      operação por restrição de ferramenta de escrita na sessão dele. Não
      fabricado aqui para não divergir do que foi de fato decidido — pendente
      de um commit específico de arquitetura.
- [ ] CI (`.github/workflows/ci.yml`): entra na etapa de ANCORA.
- [ ] Maven Wrapper (`apps/api/mvnw`): não gerado nesta etapa.

Nenhuma regra de negócio de feature (Login, Clientes, Veículos, Catálogo,
Ordens de Serviço, Financeiro) foi implementada nesta etapa.

## Changelog

Ver [CHANGELOG.md](CHANGELOG.md).
