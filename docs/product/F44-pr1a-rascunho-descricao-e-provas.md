# F44 — rascunho da descrição do PR 1a (#14) e provas de execução

Rascunho de 2026-11-16 (ESPRESSO). **Não publicado**: o PR #14 continua com a descrição antiga e só deve ser editado
depois do aceite do ADR-016 pela pessoa.

## Provas rodadas nesta sessão

Árvore: `git archive origin/fix/f44-main-compilando` (`d50a49b`, merge da `main` 348a43e), extraída em pasta limpa.
Ambiente: contêiner `maven:3.9.9-eclipse-temurin-21` (OpenJDK 21.0.7) com `unzip` instalado, socket do Docker
montado para o Testcontainers. O host não serve (JDK 27 padrão).

| # | Comando (em `apps/api`) | Resultado |
|---|---|---|
| P1 | `./mvnw -B -ntp clean compile` | enforcer `RequireJavaVersion passed`; 34 arquivos compilados; `BUILD SUCCESS`; `EXIT=0` |
| P2 | `./mvnw -B -ntp clean verify` | 18 unitários verdes (AuthControllerTest 7, GlobalExceptionHandlerTest 2, JwtPropertiesTest 2, AuthServiceTest 7); 3 `FlywayMigrationIT` verdes; `Successfully applied 2 migrations … now at version v2`; `BUILD SUCCESS`; `EXIT=0` |

Limite: a prova vale para `d50a49b`, não para a `main`. A `main` 348a43e não tem `mvnw`. Critérios 1 e 2 só se
provam num clone limpo da `main` depois do merge do #14.

## Corpo proposto para a descrição do PR #14

### Causa raiz (duas camadas)
1. Até 2026-11-12 a `main` não tinha dto, entity, mapper e repository que o `AuthService` usa (PRs #4 e #5 só
   chegaram em 12/11). Resolvido pelos merges; remoção do template: ADR-012 (aceito); schema por Flyway: ADR-013.
2. Depois disso, `mvn compile` ainda falha no host por causa do JDK 27 padrão (Homebrew): o Lombok quebra com
   `ExceptionInInitializerError: com.sun.tools.javac.tree.EndPosTable`. Em JDK 21 a `main` 348a43e compila.
   Decisão: ADR-016 (proposto) trava JDK 21 com enforcer e wrapper.

ADR citados: **012** (template) e **016** (JDK 21). Número de ADR não se reaproveita; confirmar com a pessoa se
ela se referia só ao 012.

### Maven Wrapper — as duas condições (critério 6)
- Com `unzip` no PATH: Maven 3.9.9 baixado como `.zip`, SHA-256 confere, build segue.
- Sem `unzip`: o wrapper baixa o `.tar.gz`, o hash configurado é o do `.zip` e falha com
  `Failed to validate Maven distribution SHA-256` (build barrado, mensagem enganosa). Prova registrada pelo
  CARTOGRAFO (R8).
- Requisito: `unzip` no runner de CI e, se o `Dockerfile` passar a usar `./mvnw`, na imagem.

### Como verificar
```
cd apps/api && ./mvnw -B -ntp clean verify   # JDK 21 e unzip
```
Saída: tabela P1/P2 acima.

### O que ficou sem cobertura
- Prova em clone limpo da `main` (depende do merge).
- Job `compilacao` bloqueando PR fora de rascunho (critério 7): o #11 já está mergeado neste ramo; a prova refeita
  só vale depois deste merge.
- `docker compose up` e `spring-boot:run` ponta a ponta.
- Critério 5 com MySQL vazio: evidência é o `FlywayMigrationIT` mais o teste do CRIVO.
- 500 em JSON malformado no login (`HttpMessageNotReadableException` cai no handler genérico): feature própria
  antes da F03a, com BUSSOLA e REGENTE.
- Estimativa: PR único com 1a+1b+1c (14 arquivos, +999 −38, 484 linhas de scripts gerados); passa de 3 dias só se
  o aceite do ADR atrasar.

## Etapa 2 (PR 2a) — estado
Figma negado ao CRIVO e a CARTOGRAFO; não reverifiquei. Ramo local `docs/f44-pr2a-adr014-mapa-telas` está na base
antiga e só tem `9e13e5d`. Rota recomendada pelo CARTOGRAFO: ramo novo sobre a `main` 348a43e, commit 1 com o
ADR-014 de `cf1576d`, commit 2 com `docs/design/f39-frames/` (6 arquivos, necessários aos links), URL completa
`https://www.figma.com/design/FPdB8RymAnN81pbKfizdzE`. Depende de aprovação para push e abertura.
