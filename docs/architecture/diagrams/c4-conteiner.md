# C4 — Nível 2: Contêineres

Contêineres do sistema. Mermaid versionado; atualizar com o ADR da mudança.

```mermaid
C4Container
  title Contêineres — Sistema Mecânica São Jorge

  Person(func, "Funcionário / Admin", "Usuário interno da oficina.")

  System_Boundary(msj, "Sistema Mecânica São Jorge") {
    Container(mobile, "App Mobile", "React Native + Expo", "Telas de login, perfil, clientes, veículos, catálogo, OS e financeiro. Guarda o token JWT no dispositivo; logout descarta o token localmente.")
    Container(api, "API REST", "Java 21, Spring Boot 4.1", "Regra de negócio no service, entidades não expostas (DTO + MapStruct). Resource Server JWT HS256 stateless. OpenAPI via springdoc.")
    ContainerDb(db, "Banco de Dados", "MySQL 8.4", "Schema aplicado por Flyway (V1 usuarios, V2 schema da oficina). Subtotais de item como coluna gerada; enums como VARCHAR.")
  }

  Rel(func, mobile, "Usa", "Toque")
  Rel(mobile, api, "Consome", "HTTPS / JSON, Bearer JWT")
  Rel(api, db, "Lê e grava", "JDBC, Hibernate (ddl-auto: validate)")
```

Componentes relevantes da API (nível 3, resumido):
- `security` — SecurityConfig (resource server), JwtEncoder/JwtDecoder,
  AuthenticationEntryPoint ([[ADR-004-autenticacao-stateless-via-jwt-hs256]]).
- `controller` → `service` → `repository`/`mapper` → `entity`
  ([[ADR-001-organizar-pacotes-por-camada]], [[ADR-007-nao-expor-entidade-na-api-dto-e-convencao-de-nomes]]).
- `exception` — GlobalExceptionHandler + ErrorResponse
  ([[ADR-011-handler-global-de-erro-e-mapeamento-de-status]]).

Fluxo de autenticação (login):

```mermaid
sequenceDiagram
    participant App as App Mobile
    participant API as API (AuthController)
    participant SVC as AuthService
    participant DB as MySQL (usuarios)

    App->>API: POST /api/v1/auth/login {email, senha}
    API->>API: Bean Validation (400 se vazio)
    API->>SVC: autenticar(email, senha)
    SVC->>DB: buscar usuario por email
    DB-->>SVC: usuario (ou vazio)
    SVC->>SVC: BCrypt.matches(senha, senha_hash)
    alt credencial inválida (email inexistente OU senha errada)
        SVC-->>API: AppError (mensagem genérica)
        API-->>App: 401 {timestamp,status,erro,mensagem,path}
    else credencial válida
        SVC->>SVC: JwtEncoder HS256 (sub=id, perfil, exp=iat+7d)
        SVC-->>API: token + dados básicos
        API-->>App: 200 {token, tipo, expiraEm, usuario{id,nome,email,perfil}}
    end
```
