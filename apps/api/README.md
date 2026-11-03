# api — backend Mecânica São Jorge

API REST em Java 21 + Spring Boot, MySQL via Spring Data JPA, migrations com
Flyway, autenticação stateless com JWT (ADR-004), documentação via
springdoc-openapi. Pacotes organizados por camada, não por feature
(ADR-002).

Esta etapa é **apenas fundação**: nenhum endpoint ou regra de negócio de
feature (Clientes, Veículos, Ordens de Serviço, Catálogo, Financeiro, Login)
foi implementada. O que existe hoje:

- scaffold Maven com as dependências da stack definida na arquitetura;
- configuração base de segurança (stateless, endpoints públicos de
  documentação/health; tudo o resto responde 401 até a feature de Login
  implementar o filtro JWT);
- handler global de erros no formato padronizado (`timestamp`, `status`,
  `erro`, `mensagem`, `path`);
- documentação OpenAPI habilitada;
- migration Flyway baseline (`V1__criar_tabela_usuarios.sql`) com a tabela
  `usuarios` (colunas `nome`, `email`, `senha_hash`, `perfil`, `ativo`) — sem
  nenhuma tabela de feature (Clientes, Veículos, OS, Catálogo, Financeiro) e
  sem as tabelas de template do briefing (`Categories`, `users`, `products`,
  que nunca chegaram a existir neste scaffold);
- lint, formatação, um teste unitário de exemplo e um teste de integração
  com Testcontainers.

## Pré-requisitos

- JDK 21
- Maven 3.9+ (`mvn -v`)
- Docker (para o MySQL local e, futuramente, para os testes de integração
  com Testcontainers)

> Esta etapa não inclui o Maven Wrapper (`mvnw`). Gerá-lo é um passo pendente
> (ver "Pendências" no final deste arquivo) — por ora, use o Maven instalado
> localmente.

## Subir o banco local

```bash
cd apps/api
docker compose up -d
```

Isso sobe um MySQL 8.4 em `localhost:3306` com o banco/usuário já definidos
em `docker-compose.yml` (iguais aos valores de exemplo do `.env.example`).

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

## Rodar a aplicação

```bash
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`. Documentação:

- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Health check: `http://localhost:8080/actuator/health`

## Rodar os testes

```bash
mvn test      # unitários (*Test.java) — sem Docker, sem banco
mvn verify    # unitários + integração (*IT.java) — precisa de Docker rodando
```

- `GlobalExceptionHandlerTest`: unitário, Mockito + AssertJ, sem dependência
  de banco de dados ou de contexto Spring.
- `FlywayMigrationIT`: sobe um MySQL real via Testcontainers, deixa o Spring
  Boot aplicar todas as migrations do Flyway do zero (ADR-010) e confirma que
  só a tabela `usuarios` existe, além de testar as constraints `uq_usuarios_email`
  e `ck_usuarios_perfil`. Roda na fase `verify` (maven-failsafe-plugin), não em
  `mvn test`, porque precisa de Docker.

> **Status real:** `apps/api/target/` já contém relatórios de uma execução
> bem-sucedida: `surefire-reports` (2 testes unitários, 0 falhas),
> `failsafe-reports` (3 testes de integração via Testcontainers, 0 falhas) e
> `checkstyle-result.xml` sem nenhuma violação. Esta sessão de revisão
> (ESPRESSO) não tem acesso a shell/Bash, então não re-executou os comandos —
> a validação acima vem dos relatórios já presentes no repositório local, não
> comitados (estão no `.gitignore`). Antes de avançar para a próxima feature,
> confirme rodando `mvn clean verify` localmente.

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
├── security/     # SecurityConfig (JWT filter chega com a feature de Login)
├── exception/    # AppError, ErrorResponse, GlobalExceptionHandler
├── controller/   # vazio — chega com a primeira feature
├── service/      # vazio — regra de negócio só aqui (ADR)
├── repository/   # vazio — Spring Data JPA
├── model/        # vazio — entidades JPA (nunca expostas na API)
├── dto/          # vazio — *Request / *Response
└── mapper/       # vazio — MapStruct entidade <-> DTO

src/main/resources/
├── application.yml
└── db/migration/   # Flyway — V1__criar_tabela_usuarios.sql (baseline)

src/test/java/br/com/mecanicasaojorge/api/
├── exception/      # GlobalExceptionHandlerTest (unitário, exemplo)
└── integration/    # FlywayMigrationIT (Testcontainers, ADR-010)
```

Os pacotes `controller`, `service`, `repository`, `model`, `dto` e `mapper`
ainda não existem como diretórios no git (diretório vazio não é versionado);
serão criados pela próxima feature de domínio.

## Pendências / riscos conhecidos

- **Build com evidência de execução, mas não reconfirmado nesta sessão.**
  `target/surefire-reports`, `target/failsafe-reports` e
  `target/checkstyle-result.xml` registram uma execução anterior bem-sucedida
  (`mvn verify` e `mvn checkstyle:check`, 0 falhas, 0 violações). As sessões de
  implementação e de revisão (ESPRESSO) não têm acesso a shell/Bash nesta
  operação, então ninguém reconfirmou isso rodando os comandos agora. Antes de
  aceitar esta etapa como pronta em definitivo, rode `mvn clean verify` e
  `mvn checkstyle:check` localmente ou no CI e confirme a saída.
- **`mvn spotless:check` sem evidência de execução** (não há relatório
  equivalente ao do checkstyle em `target/`). Rodar antes de aceitar a etapa.
- **Versão do Spring Boot (`4.1.0`) não verificada.** Até o meu
  conhecimento, a última linha estável publicada do Spring Boot é a 3.x; a
  versão 4.1.x vem do briefing da operação e não pude confirmar sua
  existência/disponibilidade no Maven Central nesta sessão (sem acesso à
  rede). O mesmo vale para a versão do `springdoc-openapi` compatível com
  essa linha do Boot. **Antes do primeiro build, validar essas duas
  versões** e ajustar se necessário.
- **Maven Wrapper (`mvnw`) não gerado.** Gerar com
  `mvn -N wrapper:wrapper -Dmaven=<versão>` em ambiente com rede, e commitar
  `mvnw`, `mvnw.cmd` e `.mvn/wrapper/maven-wrapper.properties`.
- **`docs/architecture` (ADRs, diagramas, mapa de dados LGPD) ainda não
  commitado.** Foi desenhado pelo CARTOGRAFO, mas a sessão dele não tinha
  ferramenta de escrita. Não fabriquei esse conteúdo aqui para não divergir
  do que foi de fato decidido — precisa de um commit específico de
  arquitetura.
- **`FlywayMigrationIT` escrito mas não executado nesta sessão**, pelo mesmo
  motivo acima (sem shell). O teste sobe um MySQL 8.4 real via Testcontainers,
  roda `mvn verify` e precisa de Docker disponível na máquina/CI; não foi
  possível confirmar que o container sobe nem que as asserções passam. Rodar
  `mvn verify` e colar a saída real antes de aceitar esta migration como
  validada.
- **Schema da migration baseline é mínimo por decisão de escopo**: a
  instrução desta etapa foi "schema real da fundação (`Usuarios.perfil`),
  fora tabelas de feature" — por isso `V1__criar_tabela_usuarios.sql` só tem
  `usuarios`. Clientes, Veículos, Catálogo, Ordens de Serviço e Financeiro
  ganham suas próprias migrations quando essas features forem implementadas.
