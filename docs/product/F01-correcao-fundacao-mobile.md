# PRD — F01: Correção da fundação mobile

- Prioridade: P1
- Área: Full-stack (mobile + leitura do pom.xml do backend)
- Sprint: Sprint 01
- Autor: BUSSOLA (Product Owner)
- Data: 2026-11-03 (revisado após confirmação do fechamento do F00)
- Etapa da rota: BUSSOLA (1/4) → ORLA → PERGAMINHO → CRIVO

## 1. Visão

O scaffold mobile do commit `6feed2a` tem quatro achados técnicos que impedem
a fundação de ser considerada fechada: conflito de peer dependency do React,
versão de testing-library não confirmada contra a matriz do React Native
0.81, leitura de variável de ambiente que não usa o mecanismo oficial do
Expo, e um arquivo fora do padrão de formatação. A Feature F01 corrige os
quatro, um por fatia, em sequência estrita com aprovação humana entre elas, e
fecha com uma entrada de CHANGELOG que cita a versão do Spring Boot lida
diretamente do `pom.xml` do backend. Não há feature de produto nova aqui: é
fundação que precisa compilar, instalar e rodar de forma íntegra antes de
Login (próxima feature da rota, conforme o briefing da operação cita
"UX-UI-MAPEAMENTO.md") começar. **Nota de verificação**: não encontrei esse
arquivo no repositório nesta sessão (`find` não retornou resultado); a
referência vem do briefing recebido, não de um documento já commitado — não
bloqueia o F01, mas registro para não afirmar a existência de algo que não
confirmei.

## 2. Escopo

### Dentro do escopo
- Fatia A: corrigir a versão do `react` no `package.json` do mobile para a
  exigida por `react-native@0.81.0`.
- Fatia B: alinhar `@testing-library/react-native` à matriz oficial de
  compatibilidade do React Native 0.81.
- Fatia C: migrar a leitura da URL base da API de `process.env` direto para
  `expo-constants` (`Constants.expoConfig.extra`, populado por
  `app.config.ts`).
- Fatia D: formatar `app/index.tsx` conforme o Prettier do projeto.
- Fatia E: fechar `CHANGELOG.md` citando a versão do Spring Boot lida
  diretamente de `apps/api/pom.xml`.
- O gate estrito entre fatias (commit aprovado da anterior antes da próxima
  abrir) e a evidência verificável desse gate (hash referenciado, saída de
  lint/typecheck/teste colada no PR).

### Fora do escopo
- Qualquer feature nova de produto (Login, Clientes, Veículos, Catálogo,
  Ordens de Serviço, Financeiro, Perfil).
- Qualquer alteração em `apps/api` além de **ler** a versão do Spring Boot no
  `pom.xml` (fatia E não escreve em `apps/api`).
- Qualquer achado fora dos cinco listados (A a E) — se outro problema for
  encontrado no scaffold mobile durante a execução, ele vira feature própria,
  não entra por extensão desta.
- Dados pessoais: esta feature não toca em dado pessoal. Não há finalidade,
  base legal ou prazo de retenção a registrar — justificativa: as cinco
  fatias mexem em dependências, configuração de build e formatação; nenhuma
  delas cria, lê, grava ou expõe dado de cliente, veículo ou usuário.
- Acessibilidade: não há tela nova. A única tela existente (`app/index.tsx`)
  já tem `accessibilityRole="header"` no título; a fatia D não pode remover
  ou alterar esse atributo (ver US-MOBILE-04, cenário 2).

## 3. Glossário

- **Fatia**: unidade de entrega desta feature (A, B, C, D ou E), cada uma
  gerando exatamente um commit Conventional Commits.
- **Achado**: um dos quatro problemas técnicos do scaffold mobile herdado do
  commit `6feed2a` (peer dependency do React, versão de testing-library,
  leitura de env, formatação de `index.tsx`).
- **Gate estrito**: regra de sequenciamento em que a fatia N só pode abrir
  depois que o commit da fatia N-1 foi aprovado por um humano; não há
  paralelismo entre fatias.
- **expo-constants**: mecanismo oficial do Expo para expor variáveis de
  ambiente de build em runtime via `Constants.expoConfig.extra`, populado por
  `app.config.ts` (substitui leitura direta de `process.env` em runtime).
- **Matriz de compatibilidade do React Native**: tabela oficial mantida pelo
  projeto React Native que relaciona versões de RN com versões compatíveis
  de bibliotecas de teste e tooling.

## 4. Premissas

1. **Atualização (2026-11-03, 15:4x):** o commit do F00 fechou depois da
   primeira escrita deste PRD. `git log` mostra `e88e482 chore(api): fundação
   do backend Spring Boot (F00)`, criado às 15:40:31, três minutos depois da
   primeira versão deste documento (15:37:50). **Reverificado nesta sessão**:
   `git status` não lista mais `?? apps/api/` (resta apenas `CHANGELOG.md` e
   `docs/` como untracked, e `README.md` como modificado) e
   `git ls-files apps/api` retorna 17 arquivos rastreados. O commit segue
   Conventional Commits (`chore(api): ...`). **A pré-condição do F00 está
   satisfeita e a Fatia A pode abrir.**
2. "RN 0.81" é a versão do React Native já presente no scaffold do commit
   `6feed2a`. **Verificado**: `apps/mobile/package.json` fixa
   `"react-native": "0.81.0"`.
3. Cada fatia gera exatamente um commit Conventional Commits, referenciando
   o achado corrigido.
4. A aprovação entre fatias é humana, não automatizada por CI.
5. O mecanismo de env do app é expo-constants com `app.config.ts`: variáveis
   chegam via `Constants.expoConfig.extra`, não por `process.env` direto em
   runtime. **Verificado**: hoje `apps/mobile/src/config/env.ts` lê
   `process.env.EXPO_PUBLIC_API_BASE_URL` diretamente e não existe
   `app.config.ts` no projeto (só `app.json`, estático) — confirma que o
   achado C é real e a correção descrita na premissa é necessária.
6. A versão do testing-library na fatia B fica aberta por compatibilidade:
   quem implementar escolhe, no momento do commit, a versão compatível com
   RN 0.81 segundo a matriz oficial do React Native. **Verificado**: hoje
   `package.json` fixa `"@testing-library/react-native": "^12.7.0"` — essa é
   a versão que precisa ser conferida (e, se necessário, ajustada) contra a
   matriz vigente no momento do commit da fatia B.
7. O conflito de peer dependency do achado A é real e reproduzível:
   `npm install` em `apps/mobile` falha hoje com `ERESOLVE` porque
   `react-native@0.81.0` exige `react@^19.1.0` e o `package.json` fixa
   `react@19.0.0`. **Verificado nesta sessão** e também reportado pelo CRIVO
   no QA do F00.
8. O achado D é real e reproduzível: `npx prettier --check app/index.tsx`
   reporta o arquivo como fora do padrão de formatação. **Verificado nesta
   sessão**.
9. A versão do Spring Boot a citar na fatia E é a declarada em
   `spring-boot-starter-parent` dentro de `apps/api/pom.xml`. **Verificado
   nesta sessão**: a versão atual é `4.1.0`. Essa leitura deve ser refeita no
   momento da fatia E, não reaproveitada deste PRD, porque o `pom.xml` pode
   mudar entre a escrita deste documento e a execução da fatia E.

## 5. Dúvidas em aberto

1. A fatia E deve atualizar a entrada do CHANGELOG já existente para o F00
   (que já cita "Spring Boot 4.1.0" na seção `[Não lançado]`) ou criar uma
   entrada nova específica da F01 listando os achados A-D corrigidos? A
   feature não define isso; quem implementar decide e registra a escolha no
   corpo do commit da fatia E.
2. Qual é o artefato que materializa "aprovação humana" entre fatias
   (aprovação de PR no GitHub, comentário explícito, label) — a operação não
   tem esse mecanismo definido ainda. Até decisão em contrário, considerar
   aprovação de Pull Request por um revisor humano como evidência mínima.

## 6. Histórias de usuário e critérios de aceitação

IDs: `US-MOBILE-00` a `US-MOBILE-05`, área `MOBILE`, feature `F01`.

---

### US-MOBILE-00 — Gate sequencial entre fatias (cross-cutting)

**Como** QA responsável por validar a Feature F01,
**quero** verificar que cada fatia só inicia depois que o commit da fatia
anterior foi aprovado por um humano,
**para** garantir que não houve paralelismo e que a trilha de aprovação é
rastreável até o commit do F00.

```gherkin
Cenário: Pré-condição do F00 satisfeita antes da fatia A abrir
  Dado que o commit do F00 que rastreia "apps/api" foi criado
  Quando eu rodo "git status" e "git ls-files apps/api"
  Então "git status" não deve listar "?? apps/api/"
  E "git ls-files apps/api" deve retornar uma lista não vazia
  E o commit que rastreou "apps/api" deve seguir Conventional Commits

Cenário: Fatia A bloqueada sem o commit do F00 fechado
  Dado que "git status" ainda lista "?? apps/api/" ou "git ls-files apps/api" retorna vazio
  Quando alguém tenta abrir a fatia A
  Então a fatia A não deve ser iniciada
  E o motivo registrado é "pré-requisito do F00 não fechado"

Cenário: Fatia B bloqueada sem commit aprovado da fatia A
  Dado que o commit da fatia A ainda não foi aprovado por um humano
  Quando alguém tenta abrir a fatia B
  Então a fatia B não deve ser iniciada

Cenário: Fatia C bloqueada sem commit aprovado da fatia B
  Dado que o commit da fatia B ainda não foi aprovado por um humano
  Quando alguém tenta abrir a fatia C
  Então a fatia C não deve ser iniciada

Cenário: Fatia D bloqueada sem commit aprovado da fatia C
  Dado que o commit da fatia C ainda não foi aprovado por um humano
  Quando alguém tenta abrir a fatia D
  Então a fatia D não deve ser iniciada

Cenário: Fatia E bloqueada sem commits aprovados de A, B, C e D
  Dado que ao menos um dos commits das fatias A, B, C ou D ainda não foi aprovado
  Quando alguém tenta abrir a fatia E
  Então a fatia E não deve ser iniciada

Cenário: Cada commit referencia o hash do commit aprovado anterior
  Dado que a fatia N, com N maior que A, foi concluída
  Quando eu leio a mensagem do commit da fatia N
  Então a mensagem deve citar o hash do commit aprovado da fatia imediatamente anterior

Cenário: Aprovação final humana antes do merge
  Dado que os commits das fatias A a E existem
  Quando a feature é proposta para merge
  Então deve existir um registro de aprovação humana anterior ao merge, distinto do CI verde
```

---

### US-MOBILE-01 — Fatia A: corrigir conflito de peer dependency do React

**Como** desenvolvedor mobile,
**quero** que a versão do `react` no `package.json` seja a exigida por
`react-native@0.81.0`,
**para** que `npm install` funcione sem erro de peer dependency e sem flag
de bypass.

```gherkin
Cenário: Instalação sem erro de peer dependency
  Dado que o package.json de apps/mobile fixa "react" em "^19.1.0"
  Quando eu rodo "npm install" sem flags adicionais
  Então a instalação deve terminar sem erro ERESOLVE
  E o react resolvido em node_modules/react/package.json deve satisfazer "^19.1.0"

Cenário: Lint, typecheck e teste verdes após a correção
  Dado que a dependência de react foi corrigida
  Quando eu rodo "npm run lint", "npm run typecheck" e "npm test"
  Então os três comandos devem terminar sem falha
  E a saída real de cada comando deve ser colada no PR

Cenário: Commit referencia o achado A
  Dado que a correção foi aplicada e validada
  Quando o commit é criado
  Então a mensagem deve seguir Conventional Commits e referenciar o achado A

Cenário de erro: regressão para versão incompatível
  Dado que alguém fixa "react" em uma versão menor que "19.1.0"
  Quando "npm install" é executado
  Então a instalação deve falhar com erro de peer dependency
  E o PR não deve ser aprovado nessa condição
```

---

### US-MOBILE-02 — Fatia B: alinhar testing-library à matriz do RN 0.81

**Como** desenvolvedor mobile,
**quero** que `@testing-library/react-native` esteja em versão compatível
com `react-native@0.81.x` segundo a matriz oficial,
**para** que os testes de componente rodem sem incompatibilidade de API
entre testing-library e o React Native instalado.

```gherkin
Cenário: Versão escolhida compatível e documentada
  Dado a matriz oficial de compatibilidade do React Native vigente no momento do commit
  Quando o desenvolvedor escolhe a versão de "@testing-library/react-native"
  Então a versão escolhida deve constar como compatível com "react-native@0.81.x" nessa matriz
  E a justificativa da escolha deve estar no corpo do commit ou na descrição do PR

Cenário: Teste de componente existente continua passando
  Dado que a versão de testing-library foi atualizada
  Quando eu rodo "npm test"
  Então o teste em app/index.test.tsx deve passar
  E nenhum teste deve falhar por incompatibilidade de API de renderização

Cenário: Lint, typecheck e teste verdes
  Dado que a correção da fatia B foi aplicada
  Quando eu rodo "npm run lint", "npm run typecheck" e "npm test"
  Então os três comandos devem terminar sem falha
  E a saída real deve ser colada no PR

Cenário: Commit referencia o achado B e o hash da fatia A
  Dado que a correção foi validada
  Quando o commit é criado
  Então a mensagem deve seguir Conventional Commits, referenciar o achado B
  E deve citar o hash do commit aprovado da fatia A

Cenário de erro: versão fora da matriz de compatibilidade
  Dado que uma versão de testing-library fora da matriz de compatibilidade é instalada
  Quando "npm test" é executado
  Então os testes devem falhar ou "npm install" deve reportar peer dependency incompatível
  E o PR não deve ser aprovado nessa condição
```

---

### US-MOBILE-03 — Fatia C: ler variável de ambiente via expo-constants

**Como** desenvolvedor mobile,
**quero** que a leitura da URL base da API use `expo-constants`
(`Constants.expoConfig.extra`, populado por `app.config.ts`) em vez de
`process.env` direto em runtime,
**para** que a configuração funcione de forma consistente nos builds do
Expo (dev, preview, produção) sem depender de `process.env` indisponível em
runtime.

```gherkin
Cenário: app.config.ts expõe a variável via extra
  Dado que existe um app.config.ts que lê EXPO_PUBLIC_API_BASE_URL do ambiente de build
  E repassa o valor para expo.extra.apiBaseUrl
  Quando o app é iniciado
  Então Constants.expoConfig.extra.apiBaseUrl deve conter o valor configurado

Cenário: leitura usa Constants.expoConfig.extra, não process.env em runtime
  Dado que src/config/env.ts foi corrigido
  Quando getApiBaseUrl() é chamado
  Então a implementação deve ler o valor de Constants.expoConfig.extra
  E não deve ler nem mutar process.env em tempo de execução

Cenário: valor padrão quando a variável não está configurada
  Dado que app.config.ts não recebeu EXPO_PUBLIC_API_BASE_URL no ambiente de build
  Quando getApiBaseUrl() é chamado
  Então o valor retornado deve ser o padrão local "http://localhost:8080/api/v1"

Cenário: variável configurada como string vazia
  Dado que EXPO_PUBLIC_API_BASE_URL está definida como string vazia no ambiente de build
  E app.config.ts repassa esse valor para extra.apiBaseUrl
  Quando getApiBaseUrl() é chamado
  Então o valor retornado deve ser o padrão local, não a string vazia

Cenário: teste cobre a leitura via expo-constants
  Dado um teste para getApiBaseUrl()
  Quando o teste simula Constants.expoConfig.extra.apiBaseUrl configurado e não configurado
  Então o teste deve passar nos dois casos
  E o teste não deve mutar process.env.EXPO_PUBLIC_API_BASE_URL

Cenário: Lint, typecheck e teste verdes
  Dado que a correção da fatia C foi aplicada
  Quando eu rodo "npm run lint", "npm run typecheck" e "npm test"
  Então os três comandos devem terminar sem falha
  E a saída real deve ser colada no PR

Cenário: Commit referencia o achado C e o hash da fatia B
  Dado que a correção foi validada
  Quando o commit é criado
  Então a mensagem deve seguir Conventional Commits, referenciar o achado C
  E deve citar o hash do commit aprovado da fatia B
```

---

### US-MOBILE-04 — Fatia D: formatar `app/index.tsx`

**Como** desenvolvedor mobile,
**quero** que `app/index.tsx` esteja formatado conforme o Prettier do
projeto,
**para** que não haja diffs de formatação pendentes e o `format:check` do
CI passe.

```gherkin
Cenário: Prettier --check sem diffs
  Dado que app/index.tsx foi formatado
  Quando eu rodo "npm run format:check"
  Então o comando deve terminar sem reportar app/index.tsx como pendente de formatação

Cenário: Nenhuma mudança de comportamento ou de acessibilidade
  Dado que apenas a formatação de app/index.tsx foi alterada
  Quando eu rodo "npm test"
  Então o teste em app/index.test.tsx deve continuar passando sem alteração de asserção
  E o atributo accessibilityRole="header" no título deve continuar presente no JSX

Cenário: Lint, typecheck e teste verdes
  Dado que a correção da fatia D foi aplicada
  Quando eu rodo "npm run lint", "npm run typecheck" e "npm test"
  Então os três comandos devem terminar sem falha
  E a saída real deve ser colada no PR

Cenário: Commit referencia o achado D e o hash da fatia C
  Dado que a correção foi validada
  Quando o commit é criado
  Então a mensagem deve seguir Conventional Commits, referenciar o achado D
  E deve citar o hash do commit aprovado da fatia C

Cenário de erro: edição futura sem formatação
  Dado que uma edição futura em app/index.tsx não é formatada
  Quando "npm run format:check" é executado
  Então o comando deve reportar o arquivo como pendente de formatação
  E o PR não deve ser aprovado nessa condição
```

---

### US-MOBILE-05 — Fatia E: fechar o CHANGELOG com a versão do Spring Boot

**Como** Product Owner da operação,
**quero** que o CHANGELOG registre o fechamento da Feature F01 citando a
versão do Spring Boot lida diretamente do `pom.xml` de `apps/api`,
**para** que o changelog reflita com precisão o estado da fundação sem
exigir leitura cruzada de documentos para confirmar a versão do backend.

```gherkin
Cenário: Versão lida diretamente do pom.xml
  Dado o arquivo apps/api/pom.xml
  Quando a fatia E é executada
  Então a versão citada no CHANGELOG.md e no commit deve ser exatamente a versão de spring-boot-starter-parent declarada em apps/api/pom.xml
  E essa versão não deve ser presumida de briefing ou documentação externa

Cenário: CHANGELOG fechado sem alterar código do backend
  Dado que as fatias A a D foram concluídas e aprovadas
  Quando a entrada do CHANGELOG.md é adicionada para a Feature F01
  Então a entrada deve listar os quatro achados corrigidos (A a D)
  E nenhum arquivo dentro de apps/api/ deve aparecer no diff do commit da fatia E

Cenário: Gate — fatia E só abre após A, B, C e D aprovadas
  Dado que algum dos commits das fatias A, B, C ou D ainda não foi aprovado
  Quando alguém tenta abrir a fatia E
  Então a fatia E não deve ser iniciada

Cenário: Commit referencia a versão do Spring Boot e os hashes de A-D
  Dado que o CHANGELOG foi fechado
  Quando o commit é criado
  Então a mensagem deve seguir Conventional Commits e citar a versão do Spring Boot
  E deve citar os hashes dos commits aprovados das fatias A, B, C e D

Cenário de erro: pom.xml sem versão legível
  Dado que apps/api/pom.xml não declara uma versão legível de spring-boot-starter-parent
  Quando a fatia E tenta ler a versão
  Então a fatia E não deve ser fechada com uma versão presumida
  E o bloqueio deve ser registrado até a versão ser corrigida no pom.xml
```

## 7. Acessibilidade e i18n

- Não há tela nova nesta feature. A única tela existente mantém
  `accessibilityRole="header"` no título (verificado no AC de US-MOBILE-04).
- Nenhum texto de interface novo é introduzido; não há chave de i18n a
  criar nesta feature.

## 8. Dados pessoais (LGPD)

Não aplicável. Nenhuma das cinco fatias cria, lê, grava ou expõe dado
pessoal de cliente, veículo ou usuário — mexem em dependências de build,
configuração de ambiente e formatação de código. Ver "Fora do escopo".

## 9. Priorização e o que fica para depois

Todas as cinco fatias são P1 e bloqueantes entre si (gate estrito): não há
como entregar parcialmente dentro da feature sem quebrar a Definição de
Pronto da fundação. O que fica fora desta feature e não entra por extensão:
qualquer item do backlog de produto (dashboard, fotos, PDF, WhatsApp) e
qualquer achado novo encontrado durante a execução que não seja um dos
quatro (A-D) — vira feature própria, com decisão nova do comandante.
