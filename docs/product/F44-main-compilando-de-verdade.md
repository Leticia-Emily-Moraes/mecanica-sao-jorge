# F44 — Correção: main compilando de verdade (retrabalho da F38)

- Dono: BUSSOLA (Product Owner)
- Data: 2026-11-13
- Etapa da rota: BUSSOLA (1/5) → ESPRESSO → ANCORA → VIGIA → CRIVO
- Instrução do comandante: retirar da F44 o ajuste visual das telas (já é da F41 e da F39) e confirmar os cortes dos PRs 1a, 1b e 1c depois de reproduzir o erro de mvn compile na main.

## 1. Reprodução do erro (executada nesta sessão)

Árvore testada: origin/main em 11f35b3 (após git fetch). A main local estava defasada em 3067954; testei as duas.

| # | Comando | Ambiente | Resultado real |
|---|---|---|---|
| R1 | mvn -B -ntp -f apps/api/pom.xml clean compile | host, Maven 3.10.0, JDK padrão 27.0.1 (Homebrew), main local 3067954 | BUILD FAILURE: Fatal error compiling: java.lang.ExceptionInInitializerError: com.sun.tools.javac.tree.EndPosTable (Lombok no javac 27) |
| R2 | docker run maven:3.9-eclipse-temurin-21 mvn -B -ntp clean compile | contêiner, JDK 21, main local 3067954 | BUILD SUCCESS, 34 arquivos compilados com release 21, 43 s |
| R3 | mesmo comando de R2 com -q | contêiner, JDK 21, origin/main 11f35b3 | saída vazia, exit=0 |

Leitura: o erro relatado reproduz só com o JDK 27 padrão do host. Com JDK 21 a main compila. Não é erro de código.

Evidência de CI (GitHub Actions, Temurin 21), gh run view 43432378598 (push na main, 11f35b3): lint, teste-unitario, build-e-integracao (mvn clean verify com Testcontainers), segredo-vazado, imagem-docker e ci-api-ok em success. Único job em failure: auditoria-dependencia, com NvdApiException: NVD Returned Status Code: 524 (base do NVD, não compilação). As execuções 43427436574 e 43421987407 têm o mesmo padrão.

## 2. O que a main já tem hoje (verificado)

| Item do escopo | Estado em origin/main | Como verifiquei |
|---|---|---|
| Template genérico (Category, User, Product, Itens duplicado) | Ausente | busca por Category, Product, Itens e User como palavra inteira em apps/api/src: nenhum arquivo; ADR-012 registra a remoção |
| pom.xml: Java 21, Boot 4.1.0, sem Springfox, springdoc, MapStruct, Flyway, JWT | Presente (springdoc 2.8.5, MapStruct 1.6.3, spring-boot-starter-flyway, spring-boot-starter-oauth2-resource-server) | busca no pom.xml; nenhuma ocorrência de springfox |
| Migrations na main, ddl-auto validate | V1 e V2 presentes; ddl-auto: validate | git ls-tree e application.yml; FlywayMigrationIT verde no CI |
| Maven Wrapper | Ausente | git ls-tree -r origin/main sem mvnw nem .mvn |
| Aviso de JDK errado | Só no README (PR #7); nada no pom.xml | git show b786b4c --stat: 3 arquivos, nenhum é pom.xml |
| Job de CI com compilação | Presente (build-e-integracao e agregador ci-api-ok) | ci-api.yml e gh run view |
| Merge bloqueado por CI | Não configurado | gh api .../branches/main/protection retornou 404 Branch not protected; gh api .../rulesets sem saída (não confirmei se é falta de ruleset ou de permissão) |

## 3. Causa raiz de a F38 não ter chegado funcionando na main (dúvida 1)

Verificado:
1. Os 7 commits da branch feat/f38-remover-template-destravar-build não estão na main e a branch não está em nenhum remoto (git branch -r --contains vazio; git log main..feat/f38-... lista 7). Todos são de mobile (X de fechar, ícone de olho, foco do popup); nenhum é de backend.
2. O backend da F38 (remover template, ADR-012 e ADR-013, Flyway como fonte do schema) chegou pelas PRs #4 e #5, já mergeadas, e a main compila no JDK 21.
3. O "mvn compile falha" vem do JDK 27 padrão do host, documentado só no README depois da #7.

Não verificado (hipótese): que a pessoa tenha visto a falha ao rodar mvn no host sem JAVA_HOME do JDK 21, ou numa main local defasada. Ver D1.

## 4. Decisões de escopo desta rodada

D-A. Etapa 2 (PRs 2b, 2c, 2d de ajuste visual) sai da F44, por instrução do comandante. Login, Perfil, logout e tab bar ficam com a F39 (frames novos) e a F41 (paridade e correções). Sem escopo duplicado.
D-B. PR 2a (ADR-014, mapa tela→frame, levantamento): a premissa 8 diz que o ADR-014 está sem commit, e isso não procede. Ele tem 4 commits na branch docs/f39-wireframe-redesenho (95a04c1, a9a364c, 23161f1, 18efb4e) e em nenhuma outra. Mapa de node-ids e levantamento do que F39 e F41 entregaram são trabalho dessas features. Proponho retirar o PR 2a da F44 e tratar a entrada do ADR-014 na main como pendência da F39 (D2).
D-C. Cortes da etapa 1, confirmados com ajuste (a reprodução mostra que não há erro de código a corrigir):
- PR 1a (absorve o 1b original): Maven Wrapper em apps/api e trava de JDK no build (maven-enforcer-plugin com requireJavaVersion [21,22) e mensagem em português), para o erro do JDK 27 virar mensagem clara em vez de EndPosTable. Inclui mvn clean verify com a saída real anexada. Estimativa: 1 dia. As tarefas 5 (template) e 8 (migrations) viram conferência registrada na descrição, não trabalho novo.
- PR 1b (antigo 1c): bloquear o merge. É configuração do repositório (proteção da main exigindo o check ci-api-ok), não código; precisa de quem administra o repositório. Prova com PR de teste com erro de compilação deliberado, fechado sem merge. Estimativa: 0,5 dia.
- Ordem: 1a e depois 1b. Juntar o 1a e o 1b originais cabe na regra "podem se juntar se o diagnóstico mostrar que cabe em menos".

Fora do corte: a falha de auditoria-dependencia (NVD 524). Não impede compilação e não está em ci-api-ok; pendência de ANCORA e VIGIA (D3).

## 5. Objetivo

Deixar a main compilável por qualquer pessoa com um comando e uma mensagem clara quando o JDK estiver errado, e fazer o CI bloquear o merge de código que não compila.

## 6. Dentro do escopo
- Maven Wrapper (apps/api/mvnw e .mvn/wrapper/).
- Trava de versão de JDK no pom.xml com mensagem em português.
- mvn clean verify com Testcontainers rodado e anexado.
- Proteção da main exigindo ci-api-ok e prova com PR de erro deliberado.
- README da API e README principal: comando com ./mvnw e aviso de JDK 21.
- Seção Pendências conhecidas do CLAUDE.md: Maven Wrapper deixa de ser pendência.

## 7. Fora do escopo
- Ajuste visual de telas, mapa tela→frame e ADR-014 (F39, F41).
- Feature nova de domínio e colunas faltantes do schema (matriz do overview.md).
- Corrigir a auditoria OWASP/NVD (D3).
- Remover classes de template: já feito (ADR-012); só conferência.
- Cache, fila, multi-tenant, microsserviço.

## 8. Premissas (revisadas)
1. A main compila com JDK 21 (verificado em R2, R3 e no CI). A premissa original 1 só vale para o JDK 27 do host.
2. O JDK 21 Temurin existe no host; o Maven do Homebrew usa JDK 27 por padrão e precisa de JAVA_HOME explícito. O Maven Wrapper não troca o JDK.
3. O backend da F38 já está na main (#4, #5). A branch feat/f38-... só tem mobile e é local.
4. A etapa 2 sai da F44 por instrução do comandante.
5. Mudar proteção de branch é ação sobre o repositório remoto: só com pessoa administradora e autorização explícita.
6. Esta feature não toca dado pessoal (ver seção 10).

## 9. Dúvidas em aberto
- D1. Onde a pessoa viu mvn compile falhar: JDK 27 no host, main local defasada ou outro ambiente? Sem isso não descarto um terceiro caso.
- D2. O ADR-014 entra na main por qual feature (F39 ou F41)? A premissa 8 e o critério 12 da F44 partiam de "sem commit".
- D3. A falha de auditoria-dependencia (NVD 524, três execuções seguidas) vira feature própria de ANCORA e VIGIA ou fica nesta?
- D4. Quem tem permissão de administrador para ligar a proteção da main? Exigir também ci-api-ok em PR de apps/mobile (o workflow hoje filtra por apps/api)?
- D5. A trava com maven-enforcer-plugin (dependência de build nova) é aceita ou basta documentar? Recomendo aceitar: um plugin, zero código de produção.

## 10. Dados pessoais (LGPD)
Nenhum dado pessoal é coletado ou tratado. Logs de CI e de build anexados aos PRs não podem trazer senha, token ou e-mail reais (o NVD_API_KEY já sai mascarado no log do CI). Finalidade, base legal e prazo de retenção: não se aplicam.

## 11. Histórias e critérios (Gherkin)

### US-BUILD-01 — Compilar a API com um comando
Como pessoa desenvolvedora, quero compilar a API com ./mvnw sem instalar Maven, para subir o projeto do zero sem depender da máquina.

Cenário US-BUILD-01-A caminho feliz
  Dado um clone limpo da main e o JDK 21 em JAVA_HOME
  Quando executo ./mvnw -B -ntp clean compile em apps/api
  Então a saída termina com BUILD SUCCESS e código de saída 0

Cenário US-BUILD-01-B wrapper versionado sem binário
  Dado o repositório após o PR 1a
  Quando listo git ls-files apps/api filtrando mvnw e .mvn
  Então aparecem mvnw, mvnw.cmd e .mvn/wrapper/maven-wrapper.properties
  E nenhum .jar de wrapper está versionado

### US-BUILD-02 — Erro claro com JDK errado
Como pessoa desenvolvedora, quero uma mensagem clara quando o JDK não for 21, para não perder tempo com ExceptionInInitializerError.

Cenário US-BUILD-02-A JDK 27
  Dado JAVA_HOME apontando para um JDK 27
  Quando executo ./mvnw -B -ntp clean compile em apps/api
  Então o build falha antes do compilador
  E a mensagem informa que o JDK 21 é obrigatório e a versão encontrada
  E o código de saída é diferente de 0

Cenário US-BUILD-02-B JDK 21
  Dado JAVA_HOME apontando para um JDK 21
  Quando executo ./mvnw -B -ntp clean compile
  Então a regra de versão passa e a compilação segue

### US-BUILD-03 — Verify com schema por migration
Como pessoa que revisa o PR, quero mvn clean verify verde com MySQL real, para saber que migrations e ddl-auto validate convivem.

Cenário US-BUILD-03-A caminho feliz
  Dado Docker em execução e JDK 21
  Quando executo ./mvnw -B -ntp clean verify em apps/api
  Então os testes unitários e o FlywayMigrationIT passam
  E o log mostra Successfully applied 2 migrations e a versão v2
  E a saída real do comando está na descrição do PR

Cenário US-BUILD-03-B Docker indisponível
  Dado o Docker parado
  Quando executo ./mvnw -B -ntp clean verify
  Então a falha aponta o Testcontainers sem MySQL, sem ser confundida com erro de código
  E a descrição do PR registra que a verificação não rodou

### US-BUILD-04 — Conferência do template removido
Cenário US-BUILD-04-A
  Dado apps/api/src/main/java
  Quando busco as classes Category, User, Product e Itens
  Então nenhuma existe
  E o pom.xml não contém springfox
  E contém springdoc-openapi, mapstruct, flyway e o resource server JWT

### US-BUILD-05 — CI bloqueia merge que não compila
Como pessoa mantenedora, quero o merge bloqueado quando a compilação falhar, para a main nunca quebrar.

Cenário US-BUILD-05-A proteção ligada
  Dado a proteção da main exigindo o check ci-api-ok
  Quando consulto gh api repos/DONO/REPO/branches/main/protection
  Então required_status_checks lista ci-api-ok

Cenário US-BUILD-05-B erro de compilação
  Dado um PR de teste com uma classe que não compila
  Quando o CI roda
  Então build-e-integracao falha e o log aponta classe e linha
  E ci-api-ok falha e o merge fica bloqueado

Cenário US-BUILD-05-C PR que não toca apps/api
  Dado um PR só de documentação
  Quando o CI roda
  Então ci-api-ok termina em success sem rodar compilação
  E o PR não fica bloqueado indefinidamente

### US-BUILD-06 — Segredo e arquivo gerado
Cenário US-BUILD-06-A
  Dado o diff dos PRs da F44
  Quando reviso os arquivos alterados
  Então não há segredo, .jar do wrapper, target/ nem arquivo gerado commitado
  E o gitleaks do CI passa

Acessibilidade e i18n não se aplicam (feature sem interface). Os estados de erro estão em US-BUILD-02-A, 03-B e 05-B.

## 12. Priorização
1. US-BUILD-02 e 01 (destravam quem tem JDK 27 hoje).
2. US-BUILD-05 (impede regressão).
3. US-BUILD-03, 04 e 06 (evidência e conferência).
Fica para depois: auditoria NVD (D3), ADR-014 na main (D2), qualquer ajuste visual.

## 13. Divisão em PRs (cada um com no máximo 3 dias)

| PR | Conteúdo | Estimativa | Depende de |
|---|---|---|---|
| 1a | mvnw, trava de JDK, verify anexado, conferência do template, READMEs, CLAUDE.md | 1 dia | nada |
| 1b | proteção da main com ci-api-ok e PR de teste com erro deliberado fechado sem merge | 0,5 dia | 1a |

Cada descrição de PR traz: o que mudou, por quê, como verificar, comando executado, saída real e o que ficou sem cobertura.

## 14. README principal
Muda: o comando de build passa a ./mvnw e o requisito de JDK 21 ganha trava no build. Commit próprio docs(readme) na mesma entrega do PR 1a.
