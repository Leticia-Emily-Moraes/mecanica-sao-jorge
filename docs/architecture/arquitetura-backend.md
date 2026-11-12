# Arquitetura do Back-end — Mecânica São Jorge

Complementa o `CLAUDE.md`. Não repete decisões já fechadas lá (stack, modelo de dados, status de OS, segurança) — detalha a estrutura de pastas, responsabilidade de cada uma e o padrão de classes por módulo.

> Nota sobre o pedido original: organização por feature e arquitetura pronta para microsserviços/multi-tenant/filas/cache foram avaliados e **não adotados**, por contrariarem decisões já justificadas no `CLAUDE.md` (pacotes por camada para projeto de uma pessoa só, complexidade proporcional ao porte do negócio). Este documento segue as decisões existentes.
>
> Nota de versão: este documento foi escrito antes da fundação F00 (`apps/api`). A stack real hoje é Java 21 + Spring Boot 4.1.0 e o schema evolui por migrations Flyway em `apps/api/src/main/resources/db/migration` — onde o texto abaixo divergir do código ou dos ADRs em `docs/architecture/adr/`, o código e os ADRs valem. Em especial: a estrutura canônica de pacotes é a do ADR-001 (sem `service/interfaces` + `service/impl`, sem `util`; enums de domínio no pacote `entity`) e a fonte única do schema é o Flyway (ADR-013).

---

## 1. Estrutura de pastas (por camada)

Pacote raiz real do projeto: `br.com.mecanicasaojorge.api` (em `apps/api/src/main/java`).

```
br.com.mecanicasaojorge.api
├── config
├── controller
├── dto
│   ├── request
│   └── response
├── entity
├── repository
├── service
│   ├── interfaces
│   └── impl
├── mapper
├── exception
├── security
├── util
└── enums
```

A pasta `model` que existe hoje no projeto deve ser renomeada para `entity` (mais explícito sobre o papel JPA da classe) quando os controllers genéricos forem reescritos — ver "Pendências conhecidas" no `CLAUDE.md`.

### config

Responsabilidade: configuração de beans do Spring (CORS, OpenAPI/Swagger, JWT filter chain, Jackson, MapStruct se precisar de bean central).

Quando usar: qualquer `@Configuration` ou `@Bean` que não pertença a um domínio específico.

Exemplos: `OpenApiConfig`, `SecurityConfig`, `CorsConfig`.

Pode depender de: `security`, `enums`.
Não pode depender de: `controller`, `service`, `repository` (configuração não conhece regra de negócio).

### controller

Responsabilidade: receber requisição HTTP, validar entrada (via `@Valid`), chamar o service, devolver `ResponseEntity` com o DTO de resposta. Nenhuma regra de negócio.

Exemplos: `ClienteController`, `VeiculoController`, `OrdemServicoController`.

Pode depender de: `service.interfaces`, `dto`, `mapper` (se a conversão DTO↔Entity for feita aqui em casos simples, embora o padrão do projeto prefira fazer isso no service).
Não pode depender de: `repository`, `entity` diretamente.

### dto/request, dto/response

Responsabilidade: contrato público da API. Nunca expor `entity` diretamente (decisão já no `CLAUDE.md`).

Exemplos: `ClienteRequestDTO`, `ClienteUpdateDTO`, `ClienteResponseDTO`, `OrdemServicoResponseDTO` (agregando dados de serviços/peças congelados no momento da venda).

Pode depender de: `enums`, Bean Validation.
Não pode depender de: `entity`, `repository`, `service`.

### entity

Responsabilidade: mapeamento JPA. Reflete o schema criado pelas migrations Flyway (`apps/api/src/main/resources/db/migration`), fonte única de verdade (ADR-013).

Exemplos: `Cliente`, `Veiculo`, `OrdemServico`, `Servico`, `Peca`, `MovimentacaoEstoque`, `Parcela`, `Pagamento`, `Financeiro`, `Usuario`.

Pode depender de: `enums` (ex.: `StatusOrdemServico` com `@Enumerated(EnumType.STRING)`).
Não pode depender de: `dto`, `controller`, `service`.

### repository

Responsabilidade: acesso a dados via Spring Data JPA. Queries derivadas ou `@Query` quando necessário.

Exemplos: `ClienteRepository`, `OrdemServicoRepository`, `ParcelaRepository`.

Pode depender de: `entity`.
Não pode depender de: `dto`, `controller`, `service`.

### service/interfaces, service/impl

Responsabilidade: toda regra de negócio (transições de status de OS, cálculo de status de parcela em runtime, geração de `Financeiro` a cada pagamento real, validações de domínio). Orquestra repositórios e mappers.

Exemplos: `OrdemServicoService` (interface) / `OrdemServicoServiceImpl`, `ParcelaService` / `ParcelaServiceImpl`.

Pode depender de: `repository`, `entity`, `mapper`, `dto`, `exception`, outros services (ex.: `OrdemServicoService` usa `ClienteService`, `VeiculoService`).
Não pode depender de: `controller`.

### mapper

Responsabilidade: conversão DTO↔Entity via MapStruct. Interfaces com `@Mapper(componentModel = "spring")`.

Exemplos: `ClienteMapper`, `OrdemServicoMapper`.

Pode depender de: `entity`, `dto`.
Não pode depender de: `service`, `controller`, `repository`.

### exception

Responsabilidade: exceções de domínio + handler global.

Exemplos: `RecursoNaoEncontradoException`, `RegraDeNegocioException`, `GlobalExceptionHandler` (`@RestControllerAdvice`), `ApiErrorResponse` (formato padrão de erro).

Padrão de resposta de erro sugerido:

```json
{
  "timestamp": "2026-06-30T10:00:00",
  "status": 404,
  "erro": "Recurso não encontrado",
  "mensagem": "Cliente com id 12 não encontrado",
  "path": "/api/v1/clientes/12"
}
```

### security

Responsabilidade: autenticação JWT (stateless), filtro de autenticação, geração/validação de token, `UserDetailsService`.

Exemplos: `JwtTokenProvider`, `JwtAuthenticationFilter`, `UsuarioDetailsService`.

Pode depender de: `entity` (Usuario), `repository` (UsuarioRepository), `enums` (Perfil).

### util / enums

`util`: classes estáticas de apoio (ex.: formatação de documento, geração de número de OS). Evitar virar "classe lixo" — só o que não tem dono natural em outra camada.

`enums`: `StatusOrdemServico`, `StatusParcela` (calculado em runtime, não persistido — usado só como retorno de DTO), `Perfil`, `TipoMovimentacaoEstoque`, `FormaPagamento`.

---

## 2. Por camada vs. por feature — por que por camada aqui

| Critério | Por camada (adotado) | Por feature/domínio |
|---|---|---|
| Times paralelos | Não traz benefício (1 desenvolvedora) | Vantagem real com vários times |
| Módulos muito acoplados (OS usa Cliente+Veículo+Serviço+Peça) | Imports diretos, sem fricção | Geraria import cruzado entre pastas de feature, anulando o isolamento que a separação prometeria |
| Curva de navegação no IDE | Mais arquivos por pasta, mas previsível | Encapsula melhor por domínio, pior quando domínios se misturam |
| Custo de migrar depois | Baixo — Spring não amarra a isso | N/A |

Conclusão mantida do `CLAUDE.md`: por camada agora; se o projeto crescer para múltiplos desenvolvedores ou virar SaaS multi-tenant, reavaliar nesse momento — não antes, para não pagar custo de complexidade sem benefício atual.

---

## 3. Classes por módulo

### Cliente
`ClienteController`, `ClienteService` (interface), `ClienteServiceImpl`, `ClienteRepository`, `Cliente` (entity), `ClienteMapper`, `ClienteRequestDTO`, `ClienteUpdateDTO`, `ClienteResponseDTO`.

### Veículo
`VeiculoController`, `VeiculoService`/`VeiculoServiceImpl`, `VeiculoRepository`, `Veiculo`, `VeiculoMapper`, `VeiculoRequestDTO`, `VeiculoResponseDTO`. Relaciona-se com `Cliente` (N veículos por cliente).

### Serviço (catálogo)
`ServicoController`, `ServicoService`/`Impl`, `ServicoRepository`, `Servico`, `ServicoMapper`, `ServicoRequestDTO`, `ServicoResponseDTO`.

### Peça (catálogo + estoque)
`PecaController`, `PecaService`/`Impl`, `PecaRepository`, `Peca`, `PecaMapper`, `PecaRequestDTO`, `PecaResponseDTO`. Estoque tratado por `MovimentacaoEstoqueService` (entrada/saída/ajuste), não dentro do próprio `PecaService`, para manter responsabilidade única.

### Ordem de Serviço
`OrdemServicoController`, `OrdemServicoService`/`Impl`, `OrdemServicoRepository`, `OrdemServico` (+ entidades de junção `OrdemServicoServico`, `OrdemServicoPeca` que congelam valor no momento da venda), `OrdemServicoMapper`, `OrdemServicoRequestDTO`, `OrdemServicoResponseDTO`, `AtualizarStatusOrdemServicoDTO`. Validação de transição de status fica no service (`StatusOrdemServico`), nunca no controller.

### Financeiro / Pagamentos
`ParcelaController`, `ParcelaService`/`Impl`, `ParcelaRepository`, `Parcela`, `ParcelaResponseDTO` (com `StatusParcela` calculado em runtime, não persistido).
`PagamentoController`, `PagamentoService`/`Impl`, `PagamentoRepository`, `Pagamento`, `PagamentoRequestDTO`. Ao registrar um `Pagamento`, o service dispara a criação do lançamento em `Financeiro` (regra já definida no `CLAUDE.md`).
`FinanceiroController`, `FinanceiroService`/`Impl`, `FinanceiroRepository`, `Financeiro`, `FinanceiroResponseDTO` — aceita lançamento manual sem OS associada (despesas).

### Usuário / Autenticação
`AuthController` (`/api/v1/auth/login`), `UsuarioService`/`Impl`, `UsuarioRepository`, `Usuario`, `Perfil` (enum), `LoginRequestDTO`, `LoginResponseDTO` (token JWT). Sem `UsuarioController` de CRUD público por ora — fora do escopo até existir tela de gestão de funcionários.

---

## 4. API REST — convenção de rotas

```
POST   /api/v1/auth/login
GET    /api/v1/clientes
POST   /api/v1/clientes
GET    /api/v1/clientes/{id}
PUT    /api/v1/clientes/{id}
DELETE /api/v1/clientes/{id}
GET    /api/v1/clientes/{id}/veiculos

GET    /api/v1/veiculos
POST   /api/v1/veiculos
GET    /api/v1/veiculos/{id}

GET    /api/v1/servicos
POST   /api/v1/servicos

GET    /api/v1/pecas
POST   /api/v1/pecas
GET    /api/v1/pecas/{id}/movimentacoes-estoque

GET    /api/v1/ordens-servico
POST   /api/v1/ordens-servico
GET    /api/v1/ordens-servico/{id}
PATCH  /api/v1/ordens-servico/{id}/status

GET    /api/v1/ordens-servico/{id}/parcelas
POST   /api/v1/parcelas/{id}/pagamentos

GET    /api/v1/financeiro
POST   /api/v1/financeiro
```

Substantivos no plural, recursos aninhados só quando expressam hierarquia real (ex.: parcelas de uma OS). `PATCH` reservado para mudança de status (operação semântica diferente de update completo).

---

## 5. Testes

Seguir a mesma separação por camada em `src/test/java`: testes de service com Mockito (regra de negócio é o que mais vale testar — transições de status, cálculo de status de parcela, geração de Financeiro), testes de repository com `@DataJpaTest`, testes de controller com `@WebMvcTest` ou `MockMvc` + Spring Security test support para os endpoints protegidos por JWT.

---

## 6. O que fica fora por enquanto (não é esquecimento, é escopo)

Cache, filas, multi-tenant, microsserviços e painel de permissões granular não são endereçados nesta arquitetura porque o `CLAUDE.md` já decidiu isso conscientemente: a stack atual (Spring Boot + MySQL + JWT stateless) não impede evoluir para SaaS depois, mas implementar essas camadas agora seria custo sem benefício para uma oficina com um usuário só. Reavaliar quando houver demanda real (mais de uma oficina usando o sistema, ou volume que justifique fila assíncrona).
