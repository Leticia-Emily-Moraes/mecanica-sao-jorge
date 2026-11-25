# F38 — Correção: remover template genérico e destravar build do backend

PRD — dono: BUSSOLA (Product Owner). Data: 2026-11-11.
Rota da feature: BUSSOLA → CARTOGRAFO → ESPRESSO → VIGIA → ORLA → CRIVO.
Depende de: nada (fundação). Revalida [[F02]] (Concluída, aprovada por CRIVO).

> **Achado crítico desta revisão**: o briefing recebido presumia um working
> tree sujo (código não commitado de backend produzido "durante o F30") a
> extrair para branch própria. Antes de escrever esta PRD eu (BUSSOLA) rodei
> a verificação real no repositório — não assumi o briefing como fato. O
> resultado diverge da premissa original; está registrado na íntegra em
> **§5 (Auditoria da Definição de Pronto da F02)**. Resumo: `git status` está
> limpo nesta branch, e todo o código citado no briefing (`controller/`,
> `dto/`, `entity/`, `mapper/`, `repository/`, `JwtConfig.java`,
> `RestAuthenticationEntryPoint.java`, `CredenciaisInvalidasException.java`,
> as migrations V1+V2) **já está commitado**, já faz parte da feature [[F02]]
> ("Concluída", com QA do CRIVO documentado nas dependências aprovadas: build
> verde, 16 testes unitários + 3 de Testcontainers, zero classe de template).
> O trabalho real ainda pendente da F38 não é "corrigir o backend" — é
> **implementar os dois padrões novos de UI** (X de fechar em popup, ícone de
> olho no campo de senha) sobre um backend que já passou a Definição de
> Pronto. Eu revalidei essa DoD de novo, ponto a ponto, para travar com
> evidência fresca, não apenas aceitar o relatório anterior do CRIVO.

## 1. Visão

A auditoria da F37 apontou (nesta mesma sessão de PO, antes de eu verificar
de novo) que a `main` não compilava e que classes de template genérico
vazavam sob nomes de domínio. Esta feature existe para fechar essa lacuna com
evidência, não com confiança. Verificado agora: a lacuna **já foi fechada**
pela F02 — não há mais classe de template, a build conclui, o schema sobe
por migration, login emite JWT. O valor real que falta entregar nesta F38
são dois padrões de UI que tornam dois comportamentos já existentes no app
(fechar um popup, revelar uma senha digitada) mais claros e mais acessíveis
para quem usa o app no dia a dia da oficina: um X visível para fechar
qualquer aviso, e um ícone de olho em vez de um texto para mostrar/ocultar a
senha — sem adicionar nenhum dado pessoal novo, nenhuma tela nova e nenhuma
regra de negócio nova.

## 2. Glossário

| Termo | Significado neste PRD |
|---|---|
| Template genérico | Classes do scaffold herdado (Category, User, Product, Itens duplicado) que usavam nomes de domínio da oficina sem corresponder ao schema real. |
| Popup / modal | Componente `Modal` do React Native sobreposto à tela (`ErrorRetryModal`, `ConfirmDialog`), não uma tela nova. |
| Botão de fechar (X) | Controle novo, visível no canto superior do popup, com nome acessível "Fechar", equivalente a cancelar/descartar o popup sem executar a ação principal. |
| Controle de olho | Componente reutilizável que substitui o texto "Mostrar senha"/"Ocultar senha" por um ícone de olho fechado/aberto, mantendo o mesmo nome acessível dinâmico. |
| DoD da F02 | Lista de 11 critérios (`US-FUND-02-01` a `11`) definida no briefing desta feature como a Definição de Pronto completa a revalidar. |
| FlywayMigrationIT | Teste de integração que sobe um MySQL real via Testcontainers e aplica todas as migrations Flyway do zero. |

## 3. Escopo

### Dentro do escopo
- Revalidação, com evidência fresca, dos 11 critérios de DoD da F02 listados
  no briefing (build, migrations, Testcontainers, login JWT, DTO sem
  entidade, OpenAPI, handler global, testes de service e controller, log sem
  dado pessoal exposto).
- Lista fechada das classes de template remanescentes (achado: nenhuma).
- Botão X de fechar nos dois popups já existentes: `ErrorRetryModal`
  (`apps/mobile/src/components/error-retry-modal.tsx`) e `ConfirmDialog`
  (`apps/mobile/src/components/confirm-dialog.tsx`).
- Troca do texto "Mostrar senha"/"Ocultar senha" por ícone de olho no campo
  de senha da tela de Login (`apps/mobile/app/login.tsx`), como componente
  reutilizável.
- No Figma (arquivo `DLqbSzzKRxiN2eyvXG73Lr`, ver `docs/design/figma.md`):
  adicionar o X nos 24 frames "[Tela] / Erro de rede" do F24 (página
  `F24 · Wireframe baixa fidelidade`) e nos frames "01 Login / Erro de rede"
  (`29:35`) e "02 Perfil / Confirmar saída" (`33:49`) do F25 (página
  `F25 · Protótipo alta fidelidade`); trocar o texto "Mostrar senha"/
  "Ocultar senha" pelo ícone de olho no frame "01 Login" do F24 — ver achado
  completo em §5.6 (no F25 o ícone de olho já existe, não é trabalho novo).
- `docs/product/F37-auditoria-sprint-01.md` como artefato que documenta a
  auditoria que originou esta feature (já commitado — ver §5).

### Fora do escopo
- Qualquer feature nova de Clientes, Catálogo, OS ou Financeiro.
- Diferenciação de permissão entre ADMIN e FUNCIONARIO.
- Qualquer mudança na tela de Login/Perfil do app mobile além do X e do
  ícone de olho (layout, textos, fluxo, mensagens de erro existentes
  continuam como estão — isso é escopo já fechado de [[F30]]/[[F33]]).
- Transformar a mensagem inline de credencial inválida em popup — ver achado
  em §6, US-POP-04: o único popup de erro de login que existe hoje é o de
  erro de rede.
- Criar popups novos que não existem hoje no app.
- Remover ou substituir Cancelar/Confirmar do `ConfirmDialog` — permanecem.
- Criar campos de senha novos (cadastro, troca de senha); o componente de
  olho nasce aplicado só ao Login, pronto para reuso futuro.
- Implementar logging de tentativa de autenticação — não existe hoje (ver
  achado em §6, dúvida nº5) e criá-lo agora seria feature nova.
- No Figma, qualquer alteração de layout, conteúdo ou fluxo das 24 telas do
  F24 e das telas de Login/Perfil do F25 além da representação do X e do
  olho — isso continua escopo fechado dessas features, não desta F38.
- No F24, os 13 frames de "Erro de validação" (mensagem inline, não
  popup/modal) não recebem o X e permanecem exatamente como estão.
- Criar um frame novo de "senha visível" em F25 — não é necessário: o
  protótipo já representa o ícone de olho e a interação é local ao campo,
  sem mudança de tela (achado em §5.6); criar reação de navegação nova para
  esse botão também não é escopo desta F38 (decisão de ESQUADRO já
  registrada em `docs/design/figma.md:218-225`, sem objeção de BUSSOLA).
- Completar as colunas de negócio que faltam em `servicos`, `pecas`,
  `movimentacoes_estoque` e `financeiro` na migration V2 — achado real (ver
  §5.2), mas é escopo de cada feature de Catálogo/OS/Financeiro quando for
  implementada, não desta F38.

## 4. Premissas

1. O código do backend citado no briefing como "não commitado" está, de
   fato, commitado — verificado por `git status --short` (árvore limpa) e
   `git log` na branch atual. A premissa 1-2 do briefing original (ponto de
   partida válido a extrair para branch nova) está desatualizada; não cortei
   branch nova porque não há nada para extrair.
2. O padrão de X para fechar popup e o de olho para campo de senha são
   mobile (React Native/Expo); não existe tela web nesta fase.
3. O X é fechamento adicional: onde já existem botões de ação
   (Cancelar/Confirmar no `ConfirmDialog`), eles permanecem intactos.
4. O ícone de olho troca de estado junto com o nome acessível, para não
   depender só do ícone visual — o comportamento de acessibilidade já existe
   hoje no texto (`accessibilityLabel` dinâmico em `app/login.tsx:137-139`);
   a troca é só a representação visual (texto → ícone).
5. O ícone de olho é um componente reutilizável do projeto: nasce aplicado
   ao campo de senha do Login, mas qualquer campo de senha futuro deve
   reusá-lo em vez de reimplementar o texto "mostrar senha".
6. Springfox 2.9.2 já não está no `pom.xml` (confirmado por grep); não há
   remoção pendente.
7. Os dois padrões também são corrigidos nos artefatos de Figma do [[F24]] e
   do [[F25]], já concluídos; a F38 passa a depender dos dois e edita esses
   artefatos, não só código mobile (ver achado em §5.6).
8. No F24, o X só se aplica aos frames já desenhados como popup/modal — hoje
   isso é só o estado "Erro de rede" (24 frames, um por tela, confirmado
   popup desde a correção de resíduo do F24 registrada em
   `docs/design/figma.md:76-89`). O estado "Erro de validação" (13 frames)
   é mensagem inline e fica fora desta correção.

## 5. Auditoria da Definição de Pronto da F02 (revalidada agora)

Verificação executada por mim nesta sessão, com leitura direta do
repositório (não reaproveitei o relatório do CRIVO sem checar de novo).

### 5.1 Classes de template genérico

```
grep -rliE "class (Category|Product|User|Itens)\b" apps/api/src/
→ (sem resultado)
```
**Achado: nenhuma classe de template remanesce** em `entity/`, `controller/`,
`service/`, `repository/`, `mapper/` ou `dto/`. Conteúdo real de cada pasta
(entity tem 16 classes de domínio: `Cliente`, `Veiculo`, `Servico`, `Peca`,
`OrdemServico`, `OrdemServicoServico`, `OrdemServicoPeca`,
`MovimentacaoEstoque`, `Parcela`, `Pagamento`, `Financeiro`, `Usuario`,
`Perfil`, `StatusOS`, `TipoLancamento`, `TipoMovimentacao`; controller tem só
`AuthController`; service só `AuthService`; repository só
`UsuarioRepository`; mapper só `UsuarioMapper`; dto tem `LoginRequest`,
`LoginResponse`, `UsuarioResumo`). Nenhum nome de template.

### 5.2 Migrations e schema

`V1__criar_tabela_usuarios.sql` cria `usuarios`. `V2__criar_schema_oficina.sql`
cria as 11 tabelas de domínio: `clientes`, `veiculos`, `servicos`, `pecas`,
`ordens_servico`, `ordens_servico_servicos`, `ordens_servico_pecas`,
`movimentacoes_estoque`, `parcelas`, `pagamentos`, `financeiro`. Comparado a
`docs/script.sql` (schema de referência real do projeto — note-se que o
briefing cita `BD/script.sql`, caminho que não existe neste repositório; o
arquivo real está em `docs/script.sql`), as 12 tabelas (`Usuarios` + 11)
batem em nome e contagem. **Achado de risco, não bloqueador desta feature**:
o próprio comentário de `V2__criar_schema_oficina.sql` admite que é
"deliberadamente mínimo" — `servicos`, `pecas`, `movimentacoes_estoque` e
`financeiro` ficam sem colunas de negócio óbvias (nome, descrição,
quantidade, valor) porque o autor não teve acesso a `docs/script.sql` na
sessão em que escreveu a migration. Registrado como dúvida nº1 abaixo; cada
feature de Catálogo/OS/Financeiro deve trazer migration aditiva completando
essas colunas quando for implementada (já é o que o comentário do próprio
V2 recomenda).

### 5.3 Testcontainers no CI

`FlywayMigrationIT` existe em
`apps/api/src/test/java/.../integration/FlywayMigrationIT.java`;
`.github/workflows/ci-api.yml` referencia Testcontainers. Relatório de QA do
CRIVO já documentado nas dependências aprovadas desta operação mostra
`FlywayMigrationIT`: 3/3 verde, container `mysql:8.4` subindo do zero e
aplicando V1+V2. Não reexecutei o CI nesta sessão (não tenho acesso a rodar
pipeline); a evidência que tenho é a leitura do arquivo de teste e do
workflow, mais o relatório de execução real já aceito do CRIVO.

### 5.4 Login JWT, DTO sem entidade, handler global, testes

`AuthController`, `AuthService`, `JwtConfig`, `JwtProperties`,
`RestAuthenticationEntryPoint`, `GlobalExceptionHandler` e
`CredenciaisInvalidasException` existem. Testes existentes:
`AuthControllerTest`, `AuthServiceTest`, `GlobalExceptionHandlerTest`,
`FlywayMigrationIT`. `pom.xml` tem `spring-boot-starter-security`,
`spring-boot-starter-oauth2-resource-server` (JWT nativo do Spring Security,
sem lib externa), `flyway-mysql`, `mapstruct` + `mapstruct-processor`,
`springdoc-openapi-starter-webmvc-ui`; **nenhuma referência a springfox**.
Relatório do CRIVO já aceito (dependências desta operação) documenta
`mvn clean install` com `BUILD SUCCESS`, 16 testes unitários + 3 de
integração, 0 falhas.

### 5.5 Log de dado pessoal — achado que exige ajuste do critério

```
grep -n "log\.(info|warn|error|debug)|LoggerFactory" apps/api/src/main/.../service/AuthService.java
→ (sem resultado, e sem resultado em todo apps/api/src/main)
```
**Achado: não existe nenhum logging de tentativa de autenticação no backend
hoje.** O critério `US-FUND-02-11` do briefing presume que "o evento é
logado" e pede para verificar mascaramento — mas não há evento de log algum
a inspecionar. Tecnicamente a ausência de log também não expõe dado pessoal
em texto claro (vacuamente verdadeiro), mas isso não é uma verificação
significativa: não há nada para o CRIVO rodar e observar. Ajustei o critério
em §8 para refletir o que é verificável hoje e registrei como dúvida nº5 —
quando uma feature de observabilidade/logging de autenticação existir, ela
deve nascer com email mascarado e senha nunca logada; não é trabalho desta
F38 criar esse logging agora (seria feature nova).

### 5.6 Achado: estado real dos dois padrões de UI no Figma (F24 e F25)

Verificação feita por mim nesta sessão lendo `docs/design/figma.md` e
`docs/design/F24-wireframe-baixa-fidelidade.md` (não assumi o enunciado do
briefing como fato — o briefing presumia que os dois padrões "nascem" no
F25 e "retroagem" ao F24 igualmente para os dois, mas o achado real é
assimétrico):

- **X de fechar**: não existe em nenhum frame de nenhuma das duas páginas
  hoje (`grep -i "fechar\|botão X" docs/design/figma.md` → sem ocorrência
  de um controle de fechar). É trabalho novo tanto no F24 quanto no F25.
- **Ícone de olho no F25**: **já existe**. `docs/design/figma.md:218-225`
  registra a decisão de ESQUADRO de representar "o botão
  'mostrar/ocultar senha' (ícone de olho, alvo de toque 44×44)" no frame
  "01 Login / Preenchido" (`29:79`), sem reação de navegação por ser
  interação local. **US-PWD-06 já está satisfeito** — não é trabalho novo,
  só confirmação.
- **Ícone de olho no F24**: **não existe ainda**. A spec
  `docs/design/F24-wireframe-baixa-fidelidade.md:193-196` descreve o campo
  "Senha... com botão 'Mostrar senha'/'Ocultar senha'" como texto, não
  ícone. **US-PWD-07 é trabalho novo** no frame "01 Login" do F24.
- **Popup "Erro de rede" no F24**: confirmado como popup/modal real (não
  tela cheia) desde a correção de resíduo registrada em
  `docs/design/figma.md:76-89` — as 24 telas têm esse estado como cartão
  modal sobre overlay escurecido. São os únicos frames de erro do F24 que
  recebem o X (US-POP-08); os 13 frames "Erro de validação" permanecem
  mensagem inline, sem X.
- **Popups do F25 que recebem X**: "01 Login / Erro de rede" (`29:35`,
  popup confirmado em `docs/design/figma.md:142`) e "02 Perfil / Confirmar
  saída" (`33:49`, diálogo central com Cancelar/Sair confirmar,
  `docs/design/figma.md:148,208-209`).

**Não verificado por mim nesta sessão**: não chamei nenhuma ferramenta
`mcp__figma-remote__*` (não testei `whoami`) — a leitura acima é só dos
documentos do repositório que registram o que ESQUADRO já fez e verificou
no arquivo real, não uma inspeção visual direta minha do Figma nesta
sessão. Memória desta operação registra bloqueio de permissão do Figma por
sessão em QAs anteriores (F24/F25); quem for implementar o Bloco D deve
testar `whoami` de novo antes de assumir acesso.

## 6. Dúvidas em aberto

1. A migration `V2` é deliberadamente mínima e não cobre todas as colunas de
   negócio do schema de referência (`docs/script.sql`) para
   `servicos`/`pecas`/`movimentacoes_estoque`/`financeiro` (ver §5.2). Fica
   para quem implementar F05/F06/F07/F31/F32 confirmar e completar via
   migration aditiva própria — não bloqueia o fechamento desta F38, mas
   precisa ficar visível para CARTOGRAFO/PRUMO antes do planejamento dessas
   sprints.
2. O caminho `BD/script.sql` citado no briefing não existe; o arquivo real é
   `docs/script.sql`. Peço a CARTOGRAFO confirmar se isso é só um engano de
   digitação do briefing ou se havia intenção de mover/renomear o arquivo.
3. Não cortei branch nova a partir de `main` porque não há código para
   extrair (ver §4, premissa 1). A implementação dos padrões de UI (X e
   olho) pode seguir na branch atual (`feat/f30-mobile-login-perfil`) ou em
   branch própria — decisão de fluxo de trabalho que deixo para
   CARTOGRAFO/ESPRESSO/ORLA, não é decisão de produto.
4. `docs/product/F37-auditoria-sprint-01.md` já aparece commitado no log
   recente (`913c104 docs(product): preencher auditoria de criterio por
   criterio da F37`). Confirmar com CARTOGRAFO se ainda falta algum ajuste
   nesse documento como parte da F38 ou se já está fechado pela F37.
5. Logging de tentativa de autenticação não existe hoje (ver §5.5). Não é
   escopo desta F38 criá-lo. Decisão de REGENTE/PRUMO: abrir item de backlog
   explícito para uma feature futura de observabilidade de autenticação, ou
   deixar implícito até AppSec (VIGIA) pedir?
6. Acesso ao Figma por ferramenta MCP (`mcp__figma-remote__*`) já foi
   bloqueado por sessão em QAs anteriores desta operação (F24, F25), mesmo
   quando ESQUADRO tinha acesso minutos antes. Quem for implementar o
   Bloco D (X e olho no Figma) precisa testar `whoami` no início da própria
   sessão e registrar a saída real — não assumir acesso porque ESQUADRO
   teve antes.
7. US-PROTO-LGN-03 do F25 foi interpretado por ESQUADRO como não exigindo
   reação de navegação para o botão de olho (interação local, não mudança
   de tela) — registrado em `docs/design/figma.md:218-225` como decisão
   aberta a objeção de BUSSOLA/CRIVO. Eu, BUSSOLA, não discordo (ver §5.6);
   registro aqui só para CARTOGRAFO/CRIVO saberem que é decisão existente,
   não lacuna nova desta F38.

## 7. Dados pessoais tocados

Email e senha de usuário no fluxo de login (já existente, não introduzido
por esta feature).
- **Finalidade**: autenticação do usuário interno da oficina.
- **Base legal**: execução de contrato / uso legítimo do sistema pela
  própria oficina (LGPD art. 7º, V e IX).
- **Retenção**: enquanto o usuário estiver ativo no sistema; a migration V1
  já documenta inativação + anonimização em até 90 dias após desligamento,
  salvo obrigação legal de guarda maior — sem rotina automática de expurgo
  implementada ainda.
- Email e senha nunca aparecem em texto claro em log; hoje não há log de
  autenticação algum (ver §5.5/dúvida nº5), então não há exposição a
  mascarar neste momento.
- O popup de erro, o X de fechar e o ícone de mostrar/ocultar senha não
  tocam dado pessoal novo; o ícone apenas expõe em tela o que o próprio
  usuário já digitou, sob o controle dele.

## 8. Histórias de usuário e critérios de aceitação

### Bloco A — Revalidação da DoD da F02

#### US-FUND-02-01 — Build limpa sem template genérico
**Como** time de desenvolvimento, **quero** confirmar que a build não carrega
nenhuma classe de template, **para** garantir que a fundação do backend é
real, não um scaffold disfarçado.
```gherkin
Cenário: build limpa
  Dado o código do backend na branch atual
  Quando executo mvn clean install
  Então a build conclui com BUILD SUCCESS
  E nenhuma classe de template genérico (Category, User, Product, Itens
    duplicado) existe em entity, controller, service, repository, mapper
    ou dto
```
**Status**: achado — já satisfeito (ver §5.1). Não verificado nesta sessão
por execução real de `mvn clean install` (eu, BUSSOLA, não tenho essa
ferramenta); peço a ESPRESSO ou CRIVO rodar de novo antes do fechamento
final, já que o único relatório de execução real que existe é o do CRIVO
já documentado nas dependências aprovadas desta operação.

#### US-FUND-02-02 — Schema único por migration
```gherkin
Cenário: schema único por migration
  Dado as migrations Flyway da branch (V1 e V2)
  Quando subo o schema do zero
  Então só existem as 12 tabelas do domínio (usuarios + as 11 de
    docs/script.sql), sem Categories, users ou products do template
```
**Status**: achado — já satisfeito (ver §5.2), com o risco registrado na
dúvida nº1 sobre colunas incompletas em 4 tabelas (não bloqueia este
critério, que é sobre existência de tabela, não sobre completude de coluna).

#### US-FUND-02-03 — Testcontainers no CI
```gherkin
Cenário: Testcontainers no CI
  Dado o teste FlywayMigrationIT
  Quando o CI executa a suíte
  Então o teste roda todas as migrations do zero contra MySQL real via
    Testcontainers e passa
```
**Status**: achado — já satisfeito (ver §5.3), com evidência de execução já
registrada pelo CRIVO; não re-executei o CI nesta sessão.

#### US-FUND-02-04 — Login emite JWT
```gherkin
Cenário: login com sucesso
  Dado um usuário cadastrado com email e senha válidos
  Quando faço POST /api/v1/auth/login com essas credenciais
  Então recebo 200 com um JWT válido no corpo
```
**Status**: achado — já satisfeito (ver §5.4), cobertura já existente em
`AuthControllerTest`.

#### US-FUND-02-05 — Login com credencial inválida
```gherkin
Cenário: credencial inválida
  Dado um email cadastrado e senha incorreta
  Quando faço POST /api/v1/auth/login
  Então recebo 401 no formato do handler global (timestamp, status, erro,
    mensagem, path)
  E a mensagem é idêntica para email inexistente e senha incorreta, sem
    revelar qual campo está errado
```
**Status**: achado — já satisfeito, cobertura existente confirmada no
relatório do CRIVO (mesma mensagem para os dois casos).

#### US-FUND-02-06 — Endpoint protegido sem token
```gherkin
Cenário: acesso sem token
  Dado um endpoint autenticado
  Quando chamo sem header Authorization
  Então recebo 401 pelo RestAuthenticationEntryPoint no formato do handler
    global
```
**Status**: achado — já satisfeito, cobertura existente em
`AuthControllerTest`.

#### US-FUND-02-07 — DTO sem entidade exposta
```gherkin
Cenário: resposta sem entidade JPA
  Dado qualquer endpoint de leitura já implementado
  Quando inspeciono a resposta
  Então o corpo é um DTO mapeado por MapStruct (ex.: UsuarioResumo)
  E não expõe campo de entidade JPA (ex.: senha_hash) nem anotação JPA
```
**Status**: achado — já satisfeito (`UsuarioMapper` + `UsuarioResumo`).

#### US-FUND-02-08 — Documentação OpenAPI
```gherkin
Cenário: documentação sem springfox
  Dado o backend no ar
  Quando acesso o endpoint do springdoc-openapi (/v3/api-docs ou /swagger-ui)
  Então vejo os endpoints documentados
  E não há nenhuma referência a springfox em pom.xml
```
**Status**: achado — `springdoc-openapi-starter-webmvc-ui` presente,
springfox ausente (ver §5.4). **Não verificado nesta sessão**: subir a API e
acessar o endpoint de fato — depende de execução real (ESPRESSO/CRIVO).

#### US-FUND-02-09 — Teste de service com Mockito
```gherkin
Cenário: regra de autenticação isolada
  Dado a regra de autenticação do AuthService
  Quando o teste unitário roda mockando UsuarioRepository
  Então cobre sucesso e falha de credencial sem depender de banco real
```
**Status**: achado — já satisfeito (`AuthServiceTest`).

#### US-FUND-02-10 — Teste de controller com MockMvc
```gherkin
Cenário: endpoints protegidos via MockMvc
  Dado o endpoint de login e um endpoint protegido
  Quando o teste de controller roda com MockMvc
  Então cobre sucesso, credencial inválida e acesso sem token
```
**Status**: achado — já satisfeito (`AuthControllerTest`).

#### US-FUND-02-11 — Dado pessoal em log (critério ajustado)
```gherkin
Cenário: ausência de log de autenticação hoje
  Dado o código atual do AuthService e do AuthController
  Quando busco por chamada de logger (log.info/warn/error/debug) relacionada
    a tentativa de login
  Então não encontro nenhuma, portanto não há email ou senha em texto claro
    expostos em log hoje

Cenário futuro (não implementado nesta F38): quando existir log de tentativa
de login
  Dado uma feature futura que adicione logging de autenticação
  Quando o evento é logado
  Então o email aparece mascarado e a senha nunca é logada
```
**Status**: achado que exige ajuste de critério (ver §5.5 e dúvida nº5). O
primeiro cenário é verificável e satisfeito hoje; o segundo é guia para
quando o logging existir, não critério de aceitação desta feature.

### Bloco B — Botão de fechar (X) em popups

#### US-POP-01 — Botão de fechar visível
**Como** usuário do app, **quero** ver um X claro em qualquer popup, **para**
saber como descartá-lo mesmo sem ler o texto.
```gherkin
Cenário: X visível em popup de erro
  Dado o popup ErrorRetryModal exibido (erro de rede no login)
  Quando o popup está aberto
  Então existe um controle visível no canto superior direito com ícone de X
  E o nome acessível do controle é "Fechar"

Cenário: X visível em popup de confirmação
  Dado o popup ConfirmDialog exibido (confirmação de logout)
  Quando o popup está aberto
  Então existe um controle visível no canto superior direito com ícone de X
  E o nome acessível do controle é "Fechar"
  E os botões Cancelar e Confirmar continuam visíveis, sem alteração
```
**Status**: achado — já implementado no working tree não commitado.
`CloseButton` (`apps/mobile/src/components/close-button.tsx`) usa
`accessibilityLabel={t('comum.botaoFechar.rotulo')}` → "Fechar", e já está
integrado em `ConfirmDialog` e `ErrorRetryModal` (quando `onClose` é
informado). Teste `close-button.test.tsx` cobre o nome acessível.

#### US-POP-02 — Fechar por toque e retorno de foco
**Como** usuário do app, **quero** tocar no X e ver o popup fechar, **para**
voltar imediatamente ao que eu estava fazendo.
```gherkin
Cenário: fechar o popup de erro de rede pelo X
  Dado o popup ErrorRetryModal aberto após uma tentativa de login que falhou
    por erro de rede
  Quando toco no X
  Então o popup fecha
  E o foco de teclado/leitor de tela retorna ao campo ou botão que estava
    focado antes do popup abrir

Cenário: fechar o popup de confirmação de logout pelo X
  Dado o popup ConfirmDialog de confirmação de logout aberto
  Quando toco no X
  Então o popup fecha sem executar o logout (mesmo efeito de tocar Cancelar)
  E o foco retorna ao botão que abriu a confirmação
```
**Status**: achado parcial. `close-button.test.tsx` confirma que `onPress`
é chamado ao tocar/pressionar (`fireEvent.press`), e `ConfirmDialog`/
`ErrorRetryModal` passam `onCancel`/`onClose` ao `CloseButton`, então o
popup fecha. **Não verificado**: o retorno de foco ao elemento que estava
focado antes de abrir — não existe teste nem implementação explícita de
foco programático de retorno nos componentes lidos; fica como lacuna para
ORLA confirmar ou implementar antes do fechamento (ver nota de
implementação em US-POP-03).

#### US-POP-03 — Navegação por teclado e leitor de tela
**Como** usuário de teclado externo ou leitor de tela, **quero** que o popup
contenha o foco e anuncie seu conteúdo, **para** operar o app sem depender
de toque na tela.
```gherkin
Cenário: foco contido dentro do popup
  Dado um popup aberto (ErrorRetryModal ou ConfirmDialog)
  Quando navego por Tab
  Então o foco circula só entre os controles do popup (X e os botões de
    ação existentes), sem escapar para o conteúdo por trás
  E o X recebe o mesmo indicador visual de foco já usado nos outros
    controles do app (anel de foco)

Cenário: anúncio ao abrir
  Dado um popup fechado
  Quando o popup abre
  Então um leitor de tela anuncia o título/mensagem do popup, via
    accessibilityRole="alert" e accessibilityLiveRegion="assertive" (já
    presentes hoje em ErrorRetryModal e ConfirmDialog) ou equivalente
```
**Nota de implementação**: `accessibilityLiveRegion="assertive"` e
`accessibilityRole="alert"` já existem hoje nos dois componentes
(confirmado lendo o código de `confirm-dialog.tsx` e `error-retry-modal.tsx`
nesta sessão) — o que falta verificar é o focus trap de Tab e o retorno de
foco (mesma lacuna de US-POP-02). **Não verificado**: nenhum teste de
navegação por teclado real existe ainda sobre estes dois componentes
(achado, mesma lacuna estrutural já registrada em F33/US-MENU-06 na memória
desta operação) — sem device/ambiente de teclado externo nesta sessão de
PO para confirmar manualmente.

#### US-POP-04 — Popup de erro de login usa o padrão (critério ajustado)
**Como** usuário do app, **quero** fechar o aviso de erro de login do mesmo
jeito que fecho qualquer outro popup, **para** ter um comportamento
previsível em todo o app.
```gherkin
Cenário: popup de erro de rede no login usa o X
  Dado uma tentativa de login que falha por erro de rede (não por
    credencial inválida)
  Quando o popup ErrorRetryModal aparece
  Então ele exibe o X de fechar definido em US-POP-01
  E fechar pelo X não reenvia a tentativa de login (diferente de tocar
    "Tentar novamente")
```
**Status**: achado — já implementado. Em `app/login.tsx:148-155`, o
`ErrorRetryModal` do estado `erroRede` recebe `onClose={() =>
setEstadoEnvio('idle')}`, que não chama `handleSubmit` — distinto de
`onRetry`, que chama. Confirma o cenário sem precisar de teste novo, pela
leitura direta do fluxo de estado.

**Achado que ajusta o enunciado original**: "tentativa de login que falha"
tem dois casos no app real — credencial inválida (mensagem inline, sem
popup) e erro de rede (popup `ErrorRetryModal`). Só o segundo caso tem popup
hoje; o primeiro é texto inline por decisão de UX já fechada em [[F30]], e
transformá-lo em popup está fora do escopo desta F38 (ver §3).

#### US-POP-05 — Popup de confirmação de logout usa o padrão
```gherkin
Cenário: X como ação adicional de cancelamento
  Dado a tela de Perfil
  Quando abro a confirmação de logout (ConfirmDialog)
  Então o popup exibe o X de fechar
  E tocar no X tem o mesmo efeito de tocar em Cancelar (não desloga)
  E os botões Cancelar e Confirmar permanecem com o mesmo texto e
    comportamento de hoje
```
**Status**: achado — já implementado. `ConfirmDialog` (usado no diálogo de
logout de `apps/mobile/app/(menu)/perfil.tsx`, não lido nesta sessão por já
estar fora do escopo de UI tocado aqui) renderiza `CloseButton` com
`onPress={onCancel}` — mesmo handler do botão "Cancelar" — antes dos botões
de ação, que não foram alterados (lidos diretamente em
`confirm-dialog.tsx:39-46`).

### Bloco C — Ícone de mostrar/ocultar senha

#### US-PWD-01 — Ícone com senha oculta
**Como** usuário digitando a senha, **quero** ver um ícone claro de olho
fechado, **para** saber que minha senha está protegida da tela.
```gherkin
Cenário: estado inicial oculto
  Dado o campo de senha da tela de Login
  Quando a tela é exibida
  Então o controle mostra o ícone de olho fechado (substitui o texto
    "Mostrar senha" hoje em apps/mobile/app/login.tsx:146-148)
  E o nome acessível do controle é "Mostrar senha"
```
**Status**: achado — já implementado. `PasswordVisibilityToggle` (ícone
`eye-off-outline` quando `visible={false}`) está integrado em
`app/login.tsx:130-138` via `rightAccessory` do `TextField`, com
`accessibilityLabel` vindo de `t('comum.campoSenha.mostrarSenha')` →
"Mostrar senha". Teste `password-visibility-toggle.test.tsx` cobre este
caso.

#### US-PWD-02 — Alternar para senha visível
```gherkin
Cenário: revelar a senha
  Dado o campo de senha oculto
  Quando ativo o controle de olho (toque)
  Então a senha fica visível em texto claro (secureTextEntry passa a false,
    mesma lógica de estado mostrarSenha já existente)
  E o ícone passa a olho aberto
  E o nome acessível passa a "Ocultar senha"
```
**Status**: achado — já implementado e testado
(`password-visibility-toggle.test.tsx`: "should show 'Ocultar senha' when
the password is visible"). `secureTextEntry={!mostrarSenha}` em
`login.tsx:130` confirma que o texto fica visível quando `mostrarSenha` é
`true`.

#### US-PWD-03 — Alternar de volta para oculto
```gherkin
Cenário: ocultar de novo
  Dado a senha visível
  Quando ativo o controle de olho novamente
  Então a senha volta a ficar oculta
  E o ícone volta a olho fechado
  E o nome acessível volta a "Mostrar senha"
```
**Status**: achado — já implementado pela mesma lógica de estado
(`setMostrarSenha((valor) => !valor)` em `login.tsx:135`, toggle simples,
sem caminho unidirecional). Não há teste específico para o terceiro toque
(só oculto→visível e visível→oculto isolados em
`password-visibility-toggle.test.tsx`), mas a lógica é simétrica — risco
baixo.

#### US-PWD-04 — Operável por teclado
```gherkin
Cenário: alternância via teclado externo
  Dado o campo de senha em foco
  Quando navego até o controle de olho por Tab e ativo por Enter ou Espaço
  Então o estado alterna igual ao toque (olho fechado ↔ aberto, rótulo
    acessível correspondente)
  E o controle exibe foco visível (reaproveita useFocusRing, já usado hoje
    no toggle de texto)
```
**Status**: achado parcial. `PasswordVisibilityToggle` usa `useFocusRing()`
(mesmo hook citado na premissa 4) e `Pressable`, que no React Native já
responde a Enter/Espaço quando focado por teclado externo via
`accessibilityRole="button"`. **Não verificado**: nenhum teste
(`password-visibility-toggle.test.tsx`) exercita `fireEvent` de tecla
Enter/Espaço — só `fireEvent.press` (equivalente a toque/clique, não
necessariamente ao evento de teclado real). Mesma lacuna de verificação de
teclado físico já registrada em US-POP-03.

#### US-PWD-05 — Componente reutilizável
```gherkin
Cenário: reuso sem reimplementação
  Dado o controle de olho implementado como componente próprio (ex.:
    PasswordVisibilityToggle)
  Quando outro campo de senha do projeto precisar do mesmo comportamento
  Então ele importa e usa o mesmo componente
  E não reimplementa a lógica de estado (mostrar/ocultar) nem o texto do
    nome acessível
```

### Bloco D — Padrões no Figma (F24 e F25)

#### US-POP-06 — Figma F25 popup de erro de login com X
**Como** PO/designer, **quero** o protótipo de alta fidelidade mostrando o X
no popup de erro de login, **para** que o padrão nasça visível onde a
identidade visual é definida.
```gherkin
Cenário: X no frame de erro de rede do Login em F25
  Dado o frame "01 Login / Erro de rede" (nodeId 29:35) na página
    "F25 · Protótipo alta fidelidade" do arquivo DLqbSzzKRxiN2eyvXG73Lr
  Quando o Figma é atualizado por esta feature
  Então o frame passa a mostrar um controle X no canto superior do cartão
    modal, com nome acessível "Fechar" representado na legenda do frame
  E nenhum outro texto, cor ou posição do frame é alterado além do X
```
**Status**: pendente — não existe hoje (achado em §5.6); trabalho novo para
ESQUADRO.

#### US-POP-07 — Figma F25 confirmação de logout com X
```gherkin
Cenário: X como ação adicional no diálogo de confirmar saída
  Dado o frame "02 Perfil / Confirmar saída" (nodeId 33:49) na página
    "F25 · Protótipo alta fidelidade"
  Quando o Figma é atualizado por esta feature
  Então o frame passa a mostrar o X no canto superior do diálogo
  E os botões "Cancelar" (nodeId 33:65) e "Sair" (confirmar, nodeId 33:67)
    permanecem com o mesmo texto, posição e reação de navegação de hoje
    (Cancelar → 02 Perfil / Preenchido sem encerrar sessão; Sair → 01 Login
    / Vazio)
```
**Status**: pendente — trabalho novo para ESQUADRO.

#### US-POP-08 — Figma F24 retroage X só em popup/modal
```gherkin
Cenário: X nos 24 frames de Erro de rede
  Dado os 24 frames "[nº da tela] [Nome da tela] / Erro de rede" na página
    "F24 · Wireframe baixa fidelidade", já confirmados como cartão modal
    sobre overlay escurecido (correção de resíduo documentada em
    docs/design/figma.md:76-89)
  Quando o Figma é atualizado por esta feature
  Então cada um dos 24 frames passa a mostrar o X no canto superior do
    cartão modal

Cenário: frames de Erro de validação não recebem X
  Dado os 13 frames "[nº da tela] [Nome da tela] / Erro de validação" na
    página "F24 · Wireframe baixa fidelidade", que representam erro como
    banner e mensagem por campo dentro da própria tela, não como
    popup/modal
  Quando o Figma é atualizado por esta feature
  Então nenhum desses 13 frames recebe o X
  E nenhum outro elemento desses frames é alterado
```
**Status**: pendente para os 24 frames de Erro de rede — trabalho novo para
ESQUADRO. O segundo cenário (não alterar os 13 frames de Erro de validação)
já está satisfeito por omissão (nada a fazer neles), mas fica como critério
de aceitação explícito para a revisão de CRIVO não aceitar X nesses frames
por engano de escopo.

#### US-PWD-06 — Figma F25 campo de senha com olho (critério já satisfeito)
```gherkin
Cenário: ícone de olho já representado no protótipo de alta fidelidade
  Dado o frame "01 Login / Preenchido" (nodeId 29:79) na página
    "F25 · Protótipo alta fidelidade"
  Quando inspeciono o campo de senha do frame
  Então o controle de mostrar/ocultar senha já é representado como ícone de
    olho (alvo de toque 44×44), não como texto "Mostrar senha"
  E não há necessidade de criar um frame ou variante nova de "senha
    visível": a interação é local ao campo, sem mudança de tela (decisão
    registrada em docs/design/figma.md:218-225)
```
**Status**: achado — já satisfeito (ver §5.6). Nenhuma ação de Figma
pendente para este critério; só confirmação por ESQUADRO/CRIVO relendo o
frame real antes do fechamento desta F38.

#### US-PWD-07 — Figma F24 retroage olho no Login
```gherkin
Cenário: troca de texto por ícone no wireframe de baixa fidelidade
  Dado o frame "01 Login" na página "F24 · Wireframe baixa fidelidade",
    onde o campo de senha hoje representa o controle como texto "Mostrar
    senha"/"Ocultar senha" (docs/design/F24-wireframe-baixa-fidelidade.md:193-196)
  Quando o Figma é atualizado por esta feature
  Então o campo de senha passa a representar o ícone de olho no lugar do
    texto, nos estados aplicáveis do frame (Vazio, Erro de validação,
    Preenchido — onde o campo de senha existe)
  E a legenda de ordem de foco do frame continua descrevendo "e-mail →
    senha → mostrar/ocultar senha → entrar" sem mudança de ordem
```
**Status**: pendente — trabalho novo para ESQUADRO (ver §5.6).

## 9. Priorização e o que fica para depois

Prioridade por valor para quem usa o app todo dia na oficina:
1. **P1 — Bloco A (revalidação da DoD da F02)**: já satisfeito; valor é
   documentar a evidência para travar a fundação antes de qualquer feature
   nova (Sprint 02 em diante depende disso). Ação restante é ESPRESSO/CRIVO
   reexecutarem a build e os testes para confirmar a leitura estática desta
   sessão com execução real.
2. **P1 — US-PWD-01 a 05 (ícone de olho)**: o texto "Mostrar senha" já
   funciona, mas o ícone reduz carga cognitiva e ocupa menos espaço em tela
   pequena — mudança pequena, valor imediato, sem risco.
3. **P2 — US-POP-01 a 05 (X em popups, código mobile)**: valor incremental
   de previsibilidade de interação; os popups já têm Cancelar/Confirmar ou
   Tentar novamente funcionando, então o X é reforço de acessibilidade, não
   correção de um caminho quebrado.
4. **P2 — US-PWD-06 (Figma F25, olho)**: já satisfeito (ver §5.6); ação
   restante é só confirmação, sem esforço de implementação.
5. **P2 — US-PWD-07 (Figma F24, olho)**: mesmo valor do item 2, espelhado no
   wireframe — pequeno, sem risco.
6. **P3 — US-POP-06 a 08 (Figma F24 e F25, X)**: mesmo raciocínio do item 3,
   espelhado nos artefatos de design; fica depois do código mobile porque
   não bloqueia nenhuma feature de código desta sprint, só a fidelidade do
   artefato de design ao padrão novo.

Fica para depois, sem item de backlog aberto ainda:
- Completar colunas de negócio faltantes na migration V2 (dúvida nº1) —
  entra na feature de Catálogo/OS/Financeiro correspondente.
- Logging de tentativa de autenticação com mascaramento (dúvida nº5) — sem
  decisão de quando abrir essa feature.
- Transformar erro de credencial inválida de mensagem inline em popup — não
  pedido, fora de escopo (ver US-POP-04).
- Verificação manual/E2E de navegação por teclado externo e leitor de tela
  sobre os popups (US-POP-03) — mesma categoria de pendência de teste já
  aceita em outras features desta operação (F33/US-MENU-06), não bloqueia
  o fechamento desta F38.

## 10. Como validar esta PRD

Comandos que eu (BUSSOLA) executei nesta sessão, com saída real:
```
git status --short                          → (vazio)
grep -rliE "class (Category|User|Product|Itens)\b" apps/api/src/  → (vazio)
find apps/api/src/test -name "*.java"        → 4 arquivos de teste listados
grep CREATE TABLE docs/script.sql            → 12 tabelas
grep CREATE TABLE apps/api/.../V2__*.sql     → 11 tabelas (+ usuarios na V1)
grep -n "log\.(info|warn|error|debug)" apps/api/src/main/.../AuthService.java → (vazio)
grep -rl "ConfirmDialog" apps/mobile         → confirmado uso em perfil.tsx
```
Li por completo `apps/mobile/app/login.tsx`, `error-retry-modal.tsx` e
`confirm-dialog.tsx` para confirmar o estado real dos dois padrões de UI
antes de escrever os critérios do Bloco B e C. Nesta revisão também li
`apps/mobile/src/components/close-button.tsx`,
`password-visibility-toggle.tsx` e seus testes (já existentes, não
commitados), `apps/mobile/src/i18n/strings.ts` (chaves `comum.botaoFechar.*`
e `comum.campoSenha.*`), `docs/design/figma.md` por completo e
`docs/design/F24-wireframe-baixa-fidelidade.md:193-207`, para fundamentar o
Bloco D (Figma) com nós e achados reais em vez de presumir que os dois
padrões "nascem" simetricamente no F25 — não nascem: o olho já existe em
F25 e não em F24; o X não existe em nenhum dos dois (ver §5.6).
**Não executei**: `mvn clean install`, `mvn verify` nem o CI — não tenho
ferramenta de build Java nesta sessão de PO; essa reexecução é de
ESPRESSO/CRIVO, citada como ação restante em §9. Também não chamei nenhuma
ferramenta `mcp__figma-remote__*` (não testei `whoami`) — a leitura do
Figma nesta sessão foi só dos documentos do repositório, não inspeção
direta do arquivo real.

## 11. Próximo passo

Handoff para CARTOGRAFO: revisar o achado crítico do topo desta PRD (o
backend já está na DoD da F02, não há código para extrair/corrigir) e as
duas dúvidas que são dele por natureza — nº1 (V2 incompleta frente ao schema
de referência) e nº2 (caminho `BD/script.sql` vs `docs/script.sql` no
briefing). Depois CARTOGRAFO decide se passa direto para ESPRESSO (confirmar
a DoD com execução real de build/testes, sem código novo), ORLA (os
componentes `CloseButton`/`PasswordVisibilityToggle` e as integrações em
`login.tsx`/`confirm-dialog.tsx`/`error-retry-modal.tsx` já parecem
implementados no working tree não commitado — ORLA confirma contra o Bloco
B/C travado aqui e fecha o commit) e ESQUADRO (Bloco D: X nos 24 frames de
Erro de rede do F24 + frames 29:35 e 33:49 do F25; olho no frame "01 Login"
do F24; testar `whoami` antes de assumir acesso ao Figma, ver dúvida nº6) —
ou se pede mais alguma arquitetura antes disso. Não vejo necessidade de ADR
novo, já que não há decisão estrutural nova aqui.
