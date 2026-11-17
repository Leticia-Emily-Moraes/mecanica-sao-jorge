# Rascunho: PR de segurança sobre o PR 1a (F44) — Boot 4.1.2 e SHA-256 do wrapper

Autor: VIGIA, 2026-11-16. Rascunho de descrição de PR; não commitar. Nada foi publicado.

**Título sugerido:** `fix(api): Spring Boot 4.1.2 por CVE crítica e SHA-256 do Maven no wrapper (F44)`

**Ramo:** `fix/f44-boot-412-sha-wrapper` (local, sem push). **Base:** `fix/f44-pr1a-build-sem-seguranca` (o PR 1a separado, local, sem push); depois do merge do 1a, rebase trivial sobre a `main`.

## O que mudou

| Commit | Arquivos | Conteúdo |
|---|---|---|
| `3b00715` fix(api): atualizar Spring Boot para 4.1.2 por CVE critica | `apps/api/pom.xml`, `CLAUDE.md` | parent 4.1.0 → 4.1.2; linha de stack do CLAUDE.md passa a dizer 4.1.2 |
| `2f88b0c` build(api): validar SHA-256 do Maven baixado pelo wrapper | `apps/api/.mvn/wrapper/maven-wrapper.properties`, `apps/api/README.md` | `distributionSha256Sum` do `apache-maven-3.9.9-bin.zip`; README explica a dependência de `unzip` |

São os mesmos commits `9788d35` e `e3d9f44` já presentes no #14, reaplicados por cherry-pick. A linha do CLAUDE.md saiu do commit de LGPD e entrou no commit do Boot, para o 1a não afirmar 4.1.2 com o pom em 4.1.0.

## Por quê

- **A06 (componente vulnerável):** o Boot 4.1.0 gerencia `tomcat-embed-core` 11.0.22 e `spring-webmvc` 7.0.8, com 7 achados de CVSS ≥ 9,0. A `main` 348a43e está nesse estado hoje. A auditoria OWASP do CI não barra (depende da NVD e não é check obrigatório), então nada impede o merge de código novo sobre essa base.
- **A08 (integridade de software):** sem `distributionSha256Sum`, o `mvnw` executa o Maven baixado sem conferir integridade.

## osv-scanner antes e depois (2026-11-16)

Comando, para cada pom extraído com `git show <ramo>:apps/api/pom.xml`:

```
docker run --rm -v <dir>:/src:ro ghcr.io/google/osv-scanner@sha256:a70ffffc2bfd33482953e5d6b64c6fcdb30239717a07b0f0d3ab2859ce3e4cde scan source --format json -L /src/pom.xml
```

Severidade pelo maior CVSS de cada grupo (Crítica ≥ 9,0; Alta ≥ 7,0; Média ≥ 4,0).

| Pacote | Antes (1a, Boot 4.1.0) | Depois (este PR, Boot 4.1.2) |
|---|---|---|
| `tomcat-embed-core` 11.0.22 | 7 grupos: 5 Críticas (9,8 9,8 9,1 9,1 9,1), 1 Alta (7,3), 1 Média | ausente (Boot 4.1.2 traz 11.0.27) |
| `spring-webmvc` 7.0.8 | 2 Críticas (9,8 9,8) | ausente (7.0.10) |
| `tools.jackson.core:jackson-databind` 3.1.4 | 7 grupos: 3 Altas, 4 Médias | ausente |
| `tools.jackson.core:jackson-core` 3.1.4 | 2 Altas | ausente |
| `com.fasterxml.jackson.core:jackson-databind` 2.21.4 | 9 grupos: 3 Altas, 6 Médias | ausente |
| `com.fasterxml.jackson.core:jackson-core` 2.21.4 | 2 Altas | ausente |
| `log4j-api` 2.25.4 | 1 Média (6,3) | ausente |
| `commons-compress` 1.24.0 | 2 Médias (6,7 5,9) | 2 Médias (6,7 5,9): GHSA-4265-ccf5-phj5, GHSA-4g9r-vxhx-9pgx |
| **Total** | **32 grupos: 7 Críticas, 11 Altas, 14 Médias** | **2 grupos: 2 Médias** |

Código de saída do scanner: 1 nos dois casos (há achado). O `commons-compress` restante chega por `testcontainers`, escopo `test` (verificado na sessão de 2026-11-14, não refeito hoje); não vai para o jar da aplicação. Fica registrado como Média aceita até o Testcontainers subir a versão.

## SHA-256 do wrapper conferido contra o Maven Central (2026-11-16)

```
curl -sS https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.9/apache-maven-3.9.9-bin.zip.sha512
8beac8d11ef208f1e2a8df0682b9448a9a363d2ad13ca74af43705549e72e74c9378823bf689287801cbbfc2f6ea9596201d19ccacfdfb682ee8a2ff4c4418ba
shasum -a 512 apache-maven-3.9.9-bin.zip   -> 8beac8d1...4c4418ba (igual ao publicado)
shasum -a 256 apache-maven-3.9.9-bin.zip   -> 4ec3f26fb1a692473aea0235c300bd20f0f9fe741947c82c1234cefd76ac3a3c
maven-wrapper.properties                   -> distributionSha256Sum=4ec3f26fb1a692473aea0235c300bd20f0f9fe741947c82c1234cefd76ac3a3c
```

O Central publica só `.sha512` e `.asc` para esse zip; o SHA-256 foi calculado sobre o mesmo arquivo cujo SHA-512 bate. A assinatura `.asc` não foi conferida.

## Como verificar (comandos executados e saída real)

Ambiente: contêiner `maven:3.9.9-eclipse-temurin-21` (OpenJDK 21.0.7), árvore extraída por `git archive`, socket do Docker para o Testcontainers.

| # | Árvore | Comando | Resultado |
|---|---|---|---|
| V1 | 1a separado `caaeeac` (Boot 4.1.0, sem sha), imagem **sem** `unzip` | `./mvnw -B -ntp clean verify` | `Spring Boot (v4.1.0)`; 18 unitários (JwtPropertiesTest 2, AuthControllerTest 7, AuthServiceTest 7, GlobalExceptionHandlerTest 2); 3 `FlywayMigrationIT`; `now at version v2`; `BUILD SUCCESS`, EXIT=0 |
| V2 | este PR `2f88b0c` (Boot 4.1.2, com sha), imagem **com** `unzip` | `./mvnw -B -ntp clean verify` | `Spring Boot (v4.1.2)`; 18 unitários; 3 `FlywayMigrationIT`; `now at version v2`; `BUILD SUCCESS`, EXIT=0 |
| V3 | este PR com `distributionSha256Sum` trocado por 64 zeros (arquivo montado por cima, árvore não alterada) | `./mvnw -B -ntp -v` | `Error: Failed to validate Maven distribution SHA-256, your Maven distribution might be compromised.`, EXIT=1 |
| V4 | pilha 1a + este PR vs. #14 `d50a49b` | `git diff --stat d50a49b fix/f44-boot-412-sha-wrapper` | vazio: árvore idêntica ao #14 |

V1 mostra que o 1a, sem o sha, não exige `unzip`. A exigência de `unzip` no runner e na imagem nasce com este PR: sem `unzip` o `mvnw` baixa o `.tar.gz`, o hash configurado é o do `.zip` e o build é barrado (seguro, mas com mensagem enganosa de distribuição adulterada). O `Dockerfile` usa o `mvn` da imagem e não é afetado enquanto não trocar para `./mvnw`.

No CI, o job `compilacao` do #14 já roda `./mvnw` com este sha e ficou verde no `ubuntu-latest`, o que indica `unzip` presente no runner (inferido do check verde, não inspecionado na imagem do runner).

## Segredos nos PRs da etapa 1

| Varredura | Alcance | Resultado |
|---|---|---|
| `gitleaks git --redact` (imagem `ghcr.io/gitleaks/gitleaks@sha256:c00b6bd0…`, regras padrão) | `origin/main..` de `fix/f44-main-compilando` (#14), `prova/f44-erro-de-compilacao` (#12), `ci/f44-job-compilacao-sobre-pr1a` (#11), `fix/f44-seguranca-sobre-pr1a` (#13) e `fix/f44-boot-412-sha-wrapper` | 20 commits, `no leaks found` |
| `gitleaks dir --redact` | descrição e comentários dos PRs #11 a #14 e os rascunhos `docs/product/F44-pr1a-rascunho-descricao-e-provas.md` e `F44-revalidacao-main-348a43e.md` | ~29,8 KB, `no leaks found` |
| Busca manual por senha de baixa entropia, e-mail, `.env`, binário, jar, chave | `git diff origin/main fix/f44-boot-412-sha-wrapper` | nenhum arquivo binário; só ocorrências de nome de variável (`MVNW_PASSWORD` do script oficial, `JWT_SECRET` sem valor) e o fixture `segredo-ficticio-de-teste-com-mais-de-32-bytes` |

## OWASP Top 10 avaliado

- A06 Componentes vulneráveis: corrigido (tabela acima).
- A08 Integridade de software e dados: corrigido para a distribuição do Maven (V3). O conteúdo de `mvnw`/`mvnw.cmd` segue sem verificação automática (só revisão de PR).
- A02/A05: sem mudança de configuração; `management.endpoints.web.exposure.include: health` só, então `configprops`/`env` não expõem `jwt.secret`.
- Demais itens: não tocados por este PR.

## LGPD

Sem dado pessoal neste PR: mexe só em versão de dependência e integridade do build. Nenhuma saída de build anexada traz senha, token ou e-mail.

## O que ficou sem cobertura

- `commons-compress` 1.24.0 (2 Médias, escopo test) continua.
- Assinatura `.asc` do zip do Maven não conferida.
- Não rodei `docker compose up` nem `spring-boot:run` com o 4.1.2; a subida foi coberta só pelo contexto Spring dos testes e pelo `FlywayMigrationIT`.
- Lint do mobile e app não tocados.

**Estimativa:** menos de 1 dia (2 commits, 4 arquivos).
