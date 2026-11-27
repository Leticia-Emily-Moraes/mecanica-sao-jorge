# PRD — F05a: Serviços, listar com busca (card F05)

- Prioridade: P1
- Área: **Backend** (o card dizia Full-stack; a tela é da F36)
- Sprint: Sprint 03: Catálogo e Estoque
- Autora: BUSSOLA (Product Owner)
- Data: 2026-11-25 (revisão 2, após a revisão humana de 24/11, 23:13 e a instrução do comandante)
- Etapa da rota: **BUSSOLA (1/4)** → CARTOGRAFO → ESPRESSO → CRIVO
- Depende de: F00, F02. Bloqueia: F11, F12, F36 (e, por código, a F17, ver seção 9).
- Estado: **escopo cortado para um endpoint.** Restam 6 dúvidas (seção 6), cada uma com padrão adotado.

> **O que mudou nesta revisão.** O card trazia serviços, peças e movimentação de estoque (29 critérios). Por instrução do comandante, a F05a fica só com `GET /api/v1/servicos`. Os critérios US-SRV-07 a 10, US-PEC-01 a 09 e US-EST-01 a 10 (critérios 7 a 29 do card) **saíram** e estão com dono em `docs/product/F05a-criterios-redistribuidos.md`. Os critérios 1 a 6 ficam aqui, reescritos.

> **Como ler.** Separo o que li do que suponho. Esta etapa é documento: **não rodei código, teste nem curl.** Li, por `git show`, o ramo `docs/f05a-adr-paginacao-e-nome-servico` (tip `a37bb83`): `ServicoController`, `ServicoService`, `Paginacao`, `PaginaResponse`, `ServicoListResponse`, `V9__adicionar_nome_em_servicos.sql`, ADR-032 e ADR-033 (ambos `proposto`) e a lista de arquivos de teste. Li também o `pom.xml` desse ramo, o ADR-017 e o ADR-040 (proposto, no ramo da F17). O que o código faz hoje está dito como "li"; o que ninguém executou está dito como "não verificado".

## 1. Visão e histórias

Quem monta uma ordem de serviço, ou cadastra um serviço novo, precisa achar rápido o serviço do catálogo pelo nome e ver se ele ainda está ativo. Esta feature entrega o **contrato de leitura do catálogo de serviços**, para a F36 (tela), a F11 e a F12 (escrita) e a Sprint 04 (OS) consumirem sem adivinhar campo.

- **H1.** Como **atendente da oficina**, quero buscar serviço por um trecho do nome e ver só os ativos quando eu pedir, para escolher o serviço certo sem rolar o catálogo inteiro.
- **H2.** Como **app mobile (F36)**, quero um contrato de lista estável (campos, página, erro), para montar a tela e os estados vazio, carregando e erro sem ler texto livre.
- **H3.** Como **responsável pela oficina**, quero que a lista exija login e não grave o termo buscado nem token em log, para um vazamento de log não expor quem consultou o quê.

Tamanho (INVEST): migration V9, entidade, repository, DTO, service, controller e testes de um endpoint de leitura cabem em até 3 dias. O corte resolve o ponto do card original, que passava disso.

## 2. Escopo

### Dentro
- `GET /api/v1/servicos` com `q` (trecho do nome), `ativo` (opcional), `page` e `size`, devolvendo `PaginaResponse<ServicoListResponse>`: `itens`, `pagina`, `tamanho`, `totalItens`, `totalPaginas`. Item: `id`, `nome`, `valorPadraoMaoObra`, `tempoEstimadoHoras` (pode ser `null`), `ativo`.
- Migration Flyway **V9** aditiva com `servicos.nome` (`VARCHAR(150) NOT NULL`, `CHECK` de preenchimento, collation `utf8mb4_0900_ai_ci`) e a linha da matriz de reconciliação do `overview.md` (ADR-033).
- Reaproveitamento do contrato do ADR-017 por `service.Paginacao` (ADR-032).
- 400, 401 e 500 no formato do handler global (`timestamp`, `status`, `erro`, `mensagem`, `path`).
- Documentação do endpoint no springdoc-openapi, log sem dado pessoal e testes dos critérios US-SRV-01 a 06.

### Fora (explícito)
- **POST e PUT de serviço, ativar e inativar:** F11 e F12.
- **Peças** (lista, criação, edição, alerta de estoque mínimo) e **movimentação de estoque:** F17, F14, F15 e F16.
- **Telas, estados de tela, acessibilidade visual e paridade com o Figma:** F36 (liberada pelo protótipo da F27). Aqui a API só entrega o dado em texto e o `ativo` em booleano.
- Busca por categoria, descrição ou valor; ordenação escolhida pelo cliente (a ordem é fixa).
- Exclusão de serviço (nunca: inativar, na F12).
- Migrations de `pecas.nome` e `movimentacoes_estoque.quantidade`: F17 e F16.

### Fica para depois (priorização, por valor para quem usa)
1. Criar e editar serviço (F11, F12): sem eles o catálogo só se enche por SQL.
2. Peças e estoque (F17, F14, F15, F16).
3. Tela (F36).
4. Ordenação e filtro por faixa de valor: sem pedido da oficina, fica sem dono.

## 3. Glossário

- **Serviço**: item do catálogo de mão de obra da oficina (ex.: "Troca de Óleo"), com valor padrão e tempo estimado, reaproveitável entre ordens.
- **Valor congelado**: valor gravado na OS no momento da inclusão; mudança posterior no catálogo não o altera. **Não é exercitado nesta feature** (não há OS nem escrita de serviço ainda); a prova é da F12.
- **Ativo**: serviço disponível para novas OS. Inativo continua no banco e nas OS antigas.
- **Envelope de página**: `PaginaResponse` (ADR-017), com os nomes em português acima. Os nomes `content`, `totalElements` e `totalPages` do Spring **não** existem neste JSON.
- **Próxima página**: não é campo. Deriva-se de `pagina + 1 < totalPaginas`.
- **Handler global**: `GlobalExceptionHandler` e `RestAuthenticationEntryPoint`, formato do ADR-011.

## 4. Reparticionamento (resumo)

| Critérios do card | Assunto | Dono |
|---|---|---|
| 1, 2, 3, 4 (US-SRV-01 a 04) | busca, página, filtro ativo | **F05a** (reescritos na seção 7) |
| 5 (US-SRV-05) | 401 | **F05a só para `GET /servicos`**; segue aberto para os demais endpoints (seção 7) |
| 6 (US-SRV-06) | 500 | **F05a**, **não atendido** até a prova com o MySQL parado |
| 7, 8 (US-SRV-07, 08) | POST de serviço | F11 |
| 9, 10 (US-SRV-09, 10) | PUT, inativação | F12 |
| 11, 12, 13 (US-PEC-01 a 03) | lista de peças e alerta | F17 |
| 14, 15, 16 (US-PEC-04 a 06) | criar peça | F14 |
| 17, 18 (US-PEC-07, 08) | editar peça | F15 |
| 19 (US-PEC-09) | peça inexistente | F15 (PUT) e F16 (movimentação) |
| 20 a 29 (US-EST-01 a 10) | movimentação | F16 |

Detalhe, o que cada dono deve provar, premissas e dúvidas que acompanham cada critério, e as tarefas 1 a 10 repartidas: `docs/product/F05a-criterios-redistribuidos.md`. Os IDs US-SRV-07 a 10 ficam **reservados** nas outras features e não são reutilizados aqui.

## 5. Premissas (numeradas)

1. **Busca**: trecho em `nome`, sem diferenciar maiúsculas de minúsculas **nem acento** (ADR-017, pela collation `utf8mb4_0900_ai_ci` fixada na V9). Isso amplia a premissa 1 do card, que só falava de maiúsculas. Li no ADR-033 a prova em `mysql:8.4` por cliente `mysql`; a prova pela aplicação é da IT.
2. **Termo literal**: `%` e `_` no `q` são texto, não curinga (`ESCAPE '!'`). `q` ausente, vazio ou só espaços lista sem filtro. `q` com mais de 100 caracteres responde 400.
3. **Paginação**: `page` base 0 (padrão 0, mínimo 0), `size` padrão 20, de 1 a 100; fora disso 400, nunca corrigido em silêncio. Página além do fim responde 200 com `itens` vazio e `totalItens` real (ADR-017, O3).
4. **Próxima página é derivada** de `pagina + 1 < totalPaginas`; o contrato não tem campo `temProxima` (decisão desta revisão, atende o comentário do critério 3; ver D1).
5. **Ordem fixa**: `nome` crescente e depois `id`.
6. **`ativo`**: ausente lista todos; `true` só ativos; `false` só inativos. O contrato prometido é `true` e `false`; outras formas que o conversor do Spring talvez aceite (`1`, `yes`, `on`) **não são contrato** e não foram verificadas (ver D4).
7. **Dado de teste por SQL**: até a F11 entrar, serviços só existem por seed ou `INSERT` fictício; o `POST /api/v1/servicos` responde 405 (li no ADR-032: "vale só até a F11 entrar"). A prova por curl do critério 4 precisa de seed com ativos e inativos.
8. **Linha legada**: serviço criado antes da V9 recebe `nome` provisório `Servico sem nome #<id>` (ADR-033). A tela deve exibi-lo como está; a correção é pela edição (F12).
9. **`tempoEstimadoHoras` pode ser `null`**, porque a coluna é opcional na V2. O campo fica no item porque a F36 precisa dele no card e não é dado pessoal (recomendação do CARTOGRAFO no ADR-032; aguarda aceite, D2).
10. **Perfil**: qualquer usuário autenticado lista, ADMIN ou FUNCIONARIO (briefing).
11. **Erro de parâmetro** usa o handler existente. A mensagem de `ativo` inválido é `Parametro invalido: ativo` (ADR-032), sem acento, como já sai hoje. Texto de interface acentuado e chave i18n ficam na F36; aqui a API não manda chave.

## 6. Dúvidas em aberto (numeradas)

| # | Dúvida | Quem decide | Padrão adotado enquanto isso |
|---|---|---|---|
| D1 | A próxima página precisa de **campo explícito** (`temProxima`)? Exige mudar o contrato do ADR-017, que vale para clientes, serviços, peças e OS. | Pessoa, com CARTOGRAFO | **Derivado** de `pagina + 1 < totalPaginas` (premissa 4). |
| D2 | Aceite do ADR-017, ADR-032 e ADR-033 (todos `proposto`; a V9 e a `Paginacao` já foram implementadas antes do aceite). | Pessoa | Código tratado como válido só depois do aceite; sem aceite, o PR não faz merge. |
| D3 | Ordem de merge da V9: a `main` tem V1 a V8; o ramo da F17 tem a V9 e a V10 empilhadas. | PRUMO e CARTOGRAFO | F05a entra antes da F17. A V9 não troca de número. Ver seção 9. |
| D4 | `ativo=1`, `yes` ou `on` devem ser aceitos ou dar 400? O ADR-032 diz que é suposição, a confirmar em teste de controller; não li esse teste na lista de arquivos. | CRIVO prova, CARTOGRAFO corrige o ADR | O contrato publicado é só `true` e `false`; o teste registra o que acontece com `1`, mas não vira promessa. |
| D5 | O Checkstyle roda no `verify`? Li no `pom.xml` do ramo: o plugin está configurado, mas com o comentário "não atrelado ao ciclo de vida padrão. Rodar com `mvn checkstyle:check`". Logo **não roda** no `verify` por configuração. Não executei. | ANCORA e ESPRESSO | Rodar `mvn checkstyle:check` à parte e registrar a saída; vincular ao `verify` é decisão separada. |
| D6 | Retenção do log de aplicação, que traz `usuarioId` (pendência P7 da política de dados: proposta de até 90 dias quando houver coletor). | Pessoa e VIGIA | Hoje só stdout do contêiner, sem persistência (política, seção "Segredos e logs"). |

As dúvidas D1 a D5 do card original foram redistribuídas: D1 (retenção do histórico) fechada em 12/11/2026, vai à F16; D2 (alerta de estoque mínimo) à F17; D3 (estoque inicial gera ENTRADA) à F14, **a responder antes da implementação**; D4 (nome do serviço único) à F11; D5 (LGPD e desligamento do funcionário) à F16, **antes do histórico ir para produção**. Detalhe no registro de redistribuição.

## 7. Critérios de aceitação (Gherkin)

Rota: `GET /api/v1/servicos`. Em todos os cenários com usuário, o token JWT é válido, salvo onde dito o contrário. Formato de erro: `timestamp`, `status`, `erro`, `mensagem`, `path`.

### US-SRV-01 — Busca de serviço (critério 1)

```gherkin
Cenário: US-SRV-01 busca de serviço com resultado
  Dado os serviços "Troca de Óleo", "Alinhamento" e "Balanceamento"
  Quando chamo GET /api/v1/servicos?q=ment
  Então a API responde 200
  E itens contém só "Alinhamento" e "Balanceamento", nessa ordem
  E totalItens é 2

Cenário: US-SRV-01a busca sem diferenciar caixa nem acento
  Dado o serviço "Troca de Óleo"
  Quando chamo GET /api/v1/servicos?q=OLEO e depois ?q=óleo
  Então as duas respostas são 200 e itens contém "Troca de Óleo"

Cenário: US-SRV-01b termo é texto literal e termo em branco não filtra
  Dado os serviços "Troca de Óleo" e "Desconto 10%"
  Quando chamo GET /api/v1/servicos?q=%25
  Então itens contém só "Desconto 10%"
  E ?q=_ não devolve todos os serviços
  E ?q=%20%20 (só espaços) devolve a lista sem filtro

Cenário: US-SRV-01c termo grande demais
  Dado um q com 101 caracteres
  Quando chamo GET /api/v1/servicos?q=<101 caracteres>
  Então a API responde 400 no formato do handler global
  E o corpo de erro não repete o termo enviado
```

### US-SRV-02 — Busca sem resultado (critério 2)

```gherkin
Cenário: US-SRV-02 busca de serviço sem resultado
  Dado um termo que não corresponde a nenhum serviço
  Quando chamo GET /api/v1/servicos?q=zzzz
  Então a API responde 200
  E itens é lista vazia, totalItens é 0 e totalPaginas é 0
  E não há erro no corpo
```

### US-SRV-03 — Paginação e limite (critério 3, reescrito)

A próxima página **deriva-se** de `pagina + 1 < totalPaginas` (premissa 4). Não existe campo `temProxima`.

```gherkin
Cenário: US-SRV-03 primeira página
  Dado 45 serviços cadastrados
  Quando chamo GET /api/v1/servicos sem parâmetros
  Então a API responde 200 com 20 itens
  E pagina é 0, tamanho é 20, totalItens é 45 e totalPaginas é 3
  E há próxima página, porque 0 + 1 < 3

Cenário: US-SRV-03a página intermediária e última página
  Dado 45 serviços cadastrados
  Quando chamo GET /api/v1/servicos?page=1
  Então a API responde 200 com 20 itens, pagina 1 e totalPaginas 3
  E há próxima página, porque 1 + 1 < 3
  Quando chamo GET /api/v1/servicos?page=2
  Então a API responde 200 com 5 itens, pagina 2 e totalPaginas 3
  E não há próxima página, porque 2 + 1 < 3 é falso

Cenário: US-SRV-03b limites do tamanho e da página
  Quando chamo GET /api/v1/servicos?size=101, ?size=0 ou ?page=-1
  Então a API responde 400 em cada caso, no formato do handler global
  E nenhuma página é devolvida
  Quando chamo GET /api/v1/servicos?size=100
  Então a API responde 200 (100 é o máximo aceito)

Cenário: US-SRV-03c página além do fim
  Dado 45 serviços cadastrados
  Quando chamo GET /api/v1/servicos?page=3
  Então a API responde 200 com itens vazio
  E totalItens continua 45 e totalPaginas continua 3
  E não há próxima página
```

### US-SRV-04 — Filtro de ativos (critério 4)

```gherkin
Cenário: US-SRV-04 só ativos
  Dado serviços ativos e inativos
  Quando chamo GET /api/v1/servicos?ativo=true
  Então a API responde 200
  E todo item tem ativo true e nenhum serviço inativo aparece

Cenário: US-SRV-04a sem filtro traz todos, com o campo ativo preenchido
  Dado serviços ativos e inativos
  Quando chamo GET /api/v1/servicos sem o parâmetro ativo
  Então itens contém ativos e inativos
  E cada inativo traz ativo false e cada ativo traz ativo true
  E ativo é sempre booleano, nunca ausente, para a tela escrever "Inativo" em texto e não só por cor

Cenário: US-SRV-04b só inativos e combinação com busca
  Dado serviços ativos e inativos
  Quando chamo GET /api/v1/servicos?ativo=false
  Então todo item tem ativo false
  E GET /api/v1/servicos?q=<trecho>&ativo=true devolve só ativos que contêm o trecho
  E totalItens conta só os itens que passaram nos dois filtros

Cenário: US-SRV-04c valor de ativo inválido
  Quando chamo GET /api/v1/servicos?ativo=talvez
  Então a API responde 400 com a mensagem "Parametro invalido: ativo"
```

Evidência exigida (revisão humana): o `ativo=true` só foi visto na IT. Repetir por **curl** contra a API no ar, com seed de ativos e inativos (premissa 7), e registrar a saída de `ativo=true`, `ativo=false` e sem filtro, mostrando os inativos com `ativo=false`.

### US-SRV-05 — Sem autenticação (critério 5, **parcial**)

```gherkin
Cenário: US-SRV-05 sem token válido em GET /api/v1/servicos
  Dado uma requisição sem token, com token malformado, com token expirado ou assinado por outra chave
  Quando chamo GET /api/v1/servicos
  Então a API responde 401 no formato do handler global
  E o corpo não contém nenhum item de serviço
```

**Este critério só vale para `GET /api/v1/servicos`.** O texto original falava de serviços, peças e movimentações; nesta feature só esse endpoint existe. O critério fica **aberto** para os outros: o 401 de `POST` e `PUT` de serviço será repetido na F11 e na F12, o de `/api/v1/pecas` na F17, F14 e F15, e o de `/api/v1/pecas/{id}/movimentacoes` na F16. Cada uma carrega o cenário no próprio PRD.

### US-SRV-06 — Erro de servidor na lista (critério 6, **não atendido**)

```gherkin
Cenário: US-SRV-06 banco indisponível na lista
  Dado a API no ar e o MySQL parado de verdade
  E um token JWT válido emitido antes de parar o banco
  Quando chamo GET /api/v1/servicos
  Então a API responde 500 no formato do handler global
  E o corpo traz timestamp, status 500, erro, mensagem genérica e path
  E o corpo não contém stack trace, nome de classe, SQL, host, porta nem URL de JDBC
  E o log registra a falha uma vez, com a classe da exceção, sem senha do banco e sem o token
```

Estado: a evidência até aqui é **falha simulada com spy**, que **não** atende o critério. Enquanto não houver a prova com o MySQL parado de verdade, registrando **status, corpo e linha de log**, o critério **não é tratado como atendido**. O spy continua útil como teste de regressão rápido, mas é complemento. Suposição não verificada: o JWT é stateless (ADR-004), então o token emitido antes continua válido com o banco parado; se o filtro de segurança tocar o banco, o 401 viria antes do 500 e o cenário precisa de outro jeito de chegar ao service.

### Reservados (saíram desta feature)

US-SRV-07 a 10 (F11, F12), US-PEC-01 a 09 (F17, F14, F15, F16) e US-EST-01 a 10 (F16). Texto e dono em `docs/product/F05a-criterios-redistribuidos.md`.

## 8. Dados pessoais

| Dado | Onde | Finalidade | Base legal | Retenção |
|---|---|---|---|---|
| Nenhum dado de cliente ou de funcionário no catálogo (`nome`, `valor`, `tempo`, `ativo` do serviço) | tabela `servicos` e resposta da lista | n/a | n/a | n/a |
| `usuarioId` (`sub` do JWT, identificador do funcionário) | uma linha INFO no service, `servicos.listar qLen ativo page size total usuarioId` (li no código) | Rastrear quem consultou o catálogo, para apurar uso indevido | LGPD art. 7, IX (legítimo interesse do controle interno), acesso restrito ao time | Log só em stdout do contêiner, sem persistência hoje; **prazo não decidido** (D6, proposta de até 90 dias quando houver coletor) |

- O **termo buscado nunca vai para o log**, só o tamanho (`qLen`). Token e senha também não. Isso é critério de teste: a linha de log da IT não contém o `q` enviado.
- Não há e-mail de usuário nesta feature, então não há máscara a aplicar aqui. A máscara do e-mail e o registro LGPD do histórico de movimentação são da F16.
- Coleta mínima: a F05a não coleta nada novo; só lê.

## 9. Dependências e sobreposições

- **F17 usa código da F05a.** O card da F17 depende só de F00 e F02, mas o ADR-032 manda a F17 reusar `service.Paginacao` e a V9, e o ramo da F17 já carrega a V9 e a V10 empilhadas sobre o ramo da F05a. Recomendo ao PRUMO acrescentar F05 às dependências da F17. Verificado por `git ls-tree`: `main` com V1 a V8; ramo da F17 com V9 e V10.
- **Numeração de migration.** A `main` já tem V5 a V8 (F03d, F04, F10). O comentário da revisão dizia que os números 5 a 8 estavam reservados em outros ramos; **na `main` eles já existem**. V9 é o próximo número livre e a V10 é da F17 (`pecas.nome`). A V9 deve entrar na `main` antes da V10 (D3). A migration de `movimentacoes_estoque.quantidade` (F16) leva o próximo número livre na hora, sem reservar agora.
- **F36** depende de F05 e das demais: o card já lista F05, F11, F12, F14, F15, F16 e F17. Nenhuma duplicação com a F36, que é só tela.
- **F11, F12 e F14 a F17** deixam de ser "absorvidas" pela F05a, como o card original sugeria, e voltam a ser cartões próprios. Cada um herda os critérios do registro de redistribuição.
- **ADR-040** (proposto, ramo da F17) centraliza o contrato de paginação e não muda o ADR-032. Se for aceito, os critérios US-SRV-03 a 03c seguem valendo sem mudança de texto.

## 10. Tarefas da F05a (revisão)

| # | Tarefa original | Na F05a | Resto vai para |
|---|---|---|---|
| 1 | Migration e matriz | **só `servicos.nome`** (V9, commit `6568834`, e linha da matriz no `overview.md`) | `pecas.nome` na F17 (V10); `movimentacoes_estoque.quantidade` na F16 |
| 2 | Entidades | só `Servico` | `Peca` (F17, F14, F15), `MovimentacaoEstoque` e enum de tipo STRING (F16) |
| 3 | Repositories | `ServicoRepository.buscar` (busca por nome) | busca por nome ou código: F17 |
| 4 | DTOs e mappers | `ServicoListResponse` e `ServicoMapper` | requests e responses de escrita: F11, F12, F14, F15, F16 |
| 5 | Service de serviços | **só `listar`** | criar (F11), editar e ativar/inativar (F12) |
| 6 | Service de peças | nada | F17 (listar), F14 (criar, 409), F15 (editar) |
| 7 | Service de movimentação | nada | F16 |
| 8 | Controllers | só `GET /api/v1/servicos` com springdoc | os demais: F11, F12, F14 a F17 |
| 9 | Testes unitários e de integração | testes dos critérios US-SRV-01 a 06; **ver abaixo** | US-PEC e US-EST: F17, F14, F15, F16 |
| 10 | Máscara do e-mail nos logs de movimentação | nada | F16 |
| 11 | Commits pequenos, sem coautor | já feito [x] | — |

**Tarefa 9, correção pedida na revisão.** O CRIVO registrou que não havia testes novos, mas a ESPRESSO escreveu quatro arquivos. Conferi no git que eles existem no ramo `docs/f05a-adr-paginacao-e-nome-servico`: `ServicoListagemIT` (347 linhas) e `ServicoServiceTest` (106) no commit `a37bb83`; `ServicoNomeMigrationIT` (89) no `6568834`; `PaginacaoTest` (73) no `57bca0d`. **Não os executei**, então não digo que passam. O CRIVO deve rodá-los nesse ramo, com o comando e a saída reais. Testes que **ainda não existem** e a tarefa 9 passa a exigir:
- IT da última página (sem próxima) e de página intermediária (US-SRV-03a);
- 401 com token malformado, expirado e de outra chave em `GET /api/v1/servicos` (US-SRV-05). Existe `PecaListagemIT` com esse padrão no ramo da F17; para serviços, não li na lista de arquivos;
- teste de controller para `ativo` inválido e para `ativo=1` (US-SRV-04c, D4). Não há `ServicoControllerTest` na lista de arquivos do ramo;
- prova por curl do `ativo` (US-SRV-04) e prova do 500 com MySQL parado (US-SRV-06).

## 11. Pendências antes de aprovar a F05a

1. **Aceite de ADR-017, ADR-032 e ADR-033** pela pessoa (D2). Eu não aceito ADR; só registro. O CARTOGRAFO deve corrigir o ADR-032 se o D4 mudar a conversão de `ativo`.
2. **Testes rodados** (tarefa 9) pelo CRIVO, mais as provas por curl e com MySQL parado.
3. **Checkstyle** à parte (D5) e **ordem de merge da V9** (D3).
4. **Critérios 7 a 29** com dono e no repositório (`docs/product/F05a-criterios-redistribuidos.md`). Só conta como feito depois do merge desse documento.

## 12. Rastreabilidade

| Critério do card | ID | Cenários | Teste esperado |
|---|---|---|---|
| 1 | US-SRV-01 | 01, 01a, 01b, 01c | `ServicoListagemIT` (a conferir), `ServicoServiceTest` |
| 2 | US-SRV-02 | 02 | `ServicoListagemIT` |
| 3 | US-SRV-03 | 03, 03a, 03b, 03c | `ServicoListagemIT` (03a: **a escrever**), `PaginacaoTest` |
| 4 | US-SRV-04 | 04, 04a, 04b, 04c | IT, teste de controller (**a escrever**), curl |
| 5 | US-SRV-05 | 05 (só `GET /servicos`) | IT (**a escrever**); aberto para os demais endpoints |
| 6 | US-SRV-06 | 06 | spy (regressão) e prova com MySQL parado (**a fazer**) |
