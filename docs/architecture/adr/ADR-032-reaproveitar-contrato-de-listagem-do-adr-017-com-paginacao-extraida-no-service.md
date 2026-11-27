---
status: proposto
date: 2026-11-23
decision-makers: [CARTOGRAFO (Arquiteto), pessoa dona do produto (aceite)]
consulted: []
informed: [REGENTE, BUSSOLA, ESPRESSO, CRIVO, VIGIA, ORLA, PERGAMINHO]
---

# Reaproveitar o contrato de listagem do ADR-017 em serviços e peças, com a paginação extraída para um componente do service

Histórico de status:

* 2026-11-23: proposto (F05a, etapa do CARTOGRAFO), ramo `docs/f05a-adr-paginacao-e-nome-servico`.

Vínculos: F05a (`GET /api/v1/servicos`, US-SRV-01 a US-SRV-06) e F17 (`GET /api/v1/pecas`, US-PEC-01 a US-PEC-03), consumidas pela F36. PRD da F05a: `docs/product/F05a-servicos-listar.md` (ainda não gravado; a BUSSOLA parou por falta da ferramenta Write). Complementa o [ADR-017](ADR-017-padronizar-listagem-com-busca-e-paginacao.md) sem mudar nada dele: o contrato de página, o escape e os erros continuam lá. Complementa também o ADR-001 (pacotes por camada), o ADR-007 (DTO) e o ADR-011 (handler global). A coluna `servicos.nome`, que a busca exige, é decidida no [ADR-033](ADR-033-acrescentar-servicos-nome-por-migration-aditiva-v9-sem-tocar-nas-colunas-geradas.md).

## Contexto e problema

O ADR-017 fixou o contrato de listagem com busca na F03a: `page` base 0, `size` de 1 a 100 com padrão 20, 400 acima de 100 (nunca corrigido em silêncio), corpo `PaginaResponse<T>`, termo literal com `ESCAPE '!'` e a guarda de deslocamento O3 para `page * size` acima de 2.147.483.647. Ele já diz que F05, F17, F06 e F31 herdam esse contrato e que, "se o código começar a se repetir, a guarda vira um método utilitário no pacote `service`".

Hoje a guarda e a montagem do `PageRequest` são métodos privados do `ClienteService` (`offsetExcedeInteiro` e `paginaVaziaComTotal`). A F05a é a segunda listagem e a F17 é a terceira, e as duas entram na mesma sprint. Falta decidir como serviços e peças reaproveitam o contrato sem criar três cópias da mesma regra, e quais parâmetros e campos são próprios de cada recurso.

## Fatores de decisão

* F1. Mesmo contrato nas três listagens: `page` base 0, `size` padrão 20 e máximo 100, 400 para `size=101`, `size=0`, `page=-1` e valor não numérico, `PaginaResponse` com os mesmos cinco campos. Medido por um caso de teste por endpoint.
* F2. Uma única implementação da guarda O3 no pacote `service`. Medido por `grep -rn "Integer.MAX_VALUE" apps/api/src/main/java/br/com/mecanicasaojorge/api/service`, que deve achar 1 ocorrência.
* F3. Nenhuma mudança no JSON nem nas mensagens de erro que a F35 já consome em `GET /api/v1/clientes`. Medido pelos testes atuais da F03a passando sem alteração.
* F4. Custo de manutenção: no máximo uma classe nova e nenhuma dependência nova no `pom.xml`.

## Opções consideradas

* A. Manter como está: cada service copia a guarda O3 e a montagem do `PageRequest`.
* B. Extrair a guarda e a montagem para `service.Paginacao` (classe utilitária, função pura sobre uma consulta recebida por parâmetro) e migrar o `ClienteService` para ela.
* C. Receber `Pageable` no controller, com `spring.data.web.pageable.max-page-size=100`.
* D. Agrupar `page` e `size` num record `PaginaRequest` validado com `@Valid @ModelAttribute`.

## Resultado da decisão

Opção escolhida: "B", porque é a única que atende F2 sem mexer no contrato (F1, F3), ao custo de uma classe package-private (F4). A atende F1 e F3, mas falha em F2 com três cópias da guarda. C falha em F1, porque o Spring corrige `size` grande em silêncio, e já foi descartada no ADR-017 (opção P1). D muda a exceção de validação de `HandlerMethodValidationException` para `MethodArgumentNotValidException`, e com ela a mensagem do 400 de clientes, o que falha em F3.

### Componente compartilhado

`br.com.mecanicasaojorge.api.service.Paginacao`, `final`, package-private, construtor privado, sem estado:

```java
static <E> Page<E> paginar(int page, int size, Sort ordem, Function<Pageable, Page<E>> consulta)
```

* Se `(long) page * size > Integer.MAX_VALUE`, chama `consulta` com `PageRequest.of(0, 1, ordem)`, lê o `getTotalElements()` e devolve `new PageImpl<>(List.of(), PageRequest.of(page, size, ordem), total)`. É exatamente a regra O3 do ADR-017.
* Senão, devolve `consulta.apply(PageRequest.of(page, size, ordem))`.
* `page` e `size` chegam já validados pelo controller. `Paginacao` não valida e não loga.
* O `ClienteService` passa a chamar `Paginacao.paginar(page, size, ORDEM_PADRAO, pageable -> consultar(termo, pageable))` e perde os dois métodos privados. A troca vai num commit `refactor(service): ...` separado, no mesmo PR da F05a, e só entra se a suíte da F03a (`ClienteServiceTest`, `ClienteListagemIT`, `ClienteControllerTest`) passar sem alteração de teste.
* `TermoBusca` é reaproveitado como está. Serviços e peças usam só `padraoTexto()` e ignoram `padraoTelefone()`, que é regra de clientes (ADR-017, eixo 5). Renomear ou dividir o `TermoBusca` fica fora: o ganho seria só de nome.

### Contrato de `GET /api/v1/servicos` (F05a)

Autenticado por JWT, fora de `PUBLIC_PATHS`.

| Parâmetro | Tipo | Padrão | Regra | Inválido |
|---|---|---|---|---|
| `q` | texto | ausente | igual ao ADR-017: `@Size(max = 100)` sobre o valor bruto; ausente, vazio ou só espaços lista sem filtro; busca por trecho só em `nome` | 400 |
| `page` | inteiro, base 0 | 0 | igual ao ADR-017, `@Min(0)`; página além do fim devolve 200 com `itens` vazio e total real | 400 |
| `size` | inteiro | 20 | igual ao ADR-017, `@Min(1) @Max(100)` | 400 |
| `ativo` | booleano | ausente | ausente lista ativos e inativos; `true` só ativos; `false` só inativos | 400 pelo handler de `MethodArgumentTypeMismatchException` já existente, com mensagem `Parametro invalido: ativo` |

* Conversão de `ativo`: vale o conversor padrão do Spring. Pelo que conheço dele, também aceita `1`, `0`, `yes`, `no`, `on` e `off` e trata valor vazio como ausente. Isso é suposição, não verificada nesta etapa, e fica a confirmar num teste do controller. Se o teste mostrar outro comportamento, vale o do teste, e este ADR é corrigido antes do aceite.
* Consulta no `ServicoRepository`, em JPQL com parâmetros nomeados. É uma consulta só para todos os casos, para que a regra de filtro fique num lugar e a guarda O3 conte com o mesmo filtro:

```sql
select s from Servico s
where (:texto is null or s.nome like :texto escape '!')
  and (:ativo is null or s.ativo = :ativo)
```

* Sem `lower()` nem `upper()`: a insensibilidade a acento e caixa vem da collation fixada pela V9 (ADR-033), como no ADR-017.
* Ordem: `Sort.by(Sort.Order.asc("nome"), Sort.Order.asc("id"))`.
* Corpo 200: `PaginaResponse<ServicoListResponse>`. Item, mapeado por MapStruct: `id` (inteiro), `nome` (texto), `valorPadraoMaoObra` (decimal), `tempoEstimadoHoras` (decimal ou `null`, porque a coluna é opcional na V2) e `ativo` (booleano). A presença de `tempoEstimadoHoras` é a dúvida D8 da BUSSOLA; a recomendação do CARTOGRAFO é manter o campo, porque não é dado pessoal e a F36 precisa dele no card.

```json
{
  "itens": [
    { "id": 3, "nome": "Troca de Óleo", "valorPadraoMaoObra": 60.00, "tempoEstimadoHoras": 0.50, "ativo": true }
  ],
  "pagina": 0,
  "tamanho": 20,
  "totalItens": 1,
  "totalPaginas": 1
}
```

* Erros: 400, 401, 404, 405 e 500 exatamente como no ADR-017 e no ADR-011, sem handler novo. O 405 em `/api/v1/servicos` (`POST`) vale só até a F11 entrar.
* Log: uma linha INFO no service, `servicos.listar qLen={} ativo={} page={} size={} total={} usuarioId={}`. O termo nunca vai para o log; `usuarioId` é o `sub` do JWT, como na F03a.

### Regras para a F17 (`GET /api/v1/pecas`)

Só o que vem deste ADR. O resto do contrato de peças é da F17.

* Usa `Paginacao.paginar` e `TermoBusca.padraoTexto()`, com `ESCAPE '!'` em cada uma das duas cláusulas `like` (`nome` e `codigo`).
* Fixa a collation de `pecas` na própria migration (regra do ADR-017), no número livre seguinte ao da V9 (hoje V10), com o mesmo padrão do ADR-033 para `pecas.nome`.
* Atenção para a F17 e a F14: `ALTER TABLE pecas CONVERT ... utf8mb4_0900_ai_ci` torna o índice `uq_pecas_codigo` insensível a caixa e a acento. Isso combina com a US-PEC-05 ("ignorando maiúsculas"), mas também trata `ç` e `c` como iguais, e o `CONVERT` falha se já houver dois códigos que só diferem nisso. A F17 decide isso no seu ADR antes de escrever a migration.

### Fluxo de dados e ameaças

```mermaid
sequenceDiagram
    participant App as App mobile (F36)
    participant Ctl as ServicoController
    participant Svc as ServicoService
    participant Pag as Paginacao
    participant Repo as ServicoRepository
    participant DB as MySQL (servicos, utf8mb4_0900_ai_ci)
    App->>Ctl: GET /api/v1/servicos?q&ativo&page&size (Bearer JWT, HTTPS)
    Ctl->>Ctl: Bean Validation de q, page e size; conversão de ativo (400 se inválido)
    Ctl->>Svc: listar(q, ativo, page, size, sub do JWT)
    Svc->>Svc: TermoBusca.de(q): strip, NFC, escape com !
    Svc->>Pag: paginar(page, size, ordem, consulta)
    Pag->>Repo: buscar(texto, ativo, PageRequest)
    Repo->>DB: JPQL com parâmetros ligados e ESCAPE '!'
    DB-->>Repo: linhas de servicos
    Repo-->>Pag: Page de Servico
    Pag-->>Svc: Page de Servico (vazia com total real no caso O3)
    Svc->>Svc: log com qLen, ativo, page, size, total e usuarioId
    Svc-->>Ctl: PaginaResponse de ServicoListResponse (MapStruct)
    Ctl-->>App: 200
```

Dado pessoal: o catálogo de serviços não tem dado pessoal. O único identificador que circula é o `usuarioId` (o `sub` do JWT) na linha de log: identificador interno do funcionário, sem nome nem e-mail. Base legal e retenção: as mesmas da linha de log da F03a, na política de dados (`docs/security/politica-dados-pessoais-cliente.md`, seção 6). Nada sai do sistema além do corpo 200 para o app autenticado.

| Ameaça (STRIDE) | Onde | Mitigação | Verificação |
|---|---|---|---|
| Spoofing | chamada sem token | `anyRequest().authenticated()`, 401 antes do controller | teste da US-SRV-05 |
| Tampering (injeção) | `q` e `ativo` | parâmetros ligados, nunca concatenados; `ESCAPE '!'` em cada `like`; `ativo` tipado | caso de teste com `%`, `_`, `!` e `\` em `q` |
| Repudiation | quem listou | `usuarioId` na linha de log | teste de log do service |
| Information disclosure | erro de banco | 500 com mensagem fixa, sem stack trace nem SQL (ADR-011); termo fora do log | teste da US-SRV-06 |
| Denial of service | `size`, `q` e varredura | `size` até 100, `q` até 100; `LIKE '%x%'` varre a tabela, aceito pelo volume de uma oficina | testes de 400 da US-SRV-03 |
| Elevation of privilege | perfis | sem distinção de perfil hoje, decisão registrada no `CLAUDE.md`; o catálogo não é sensível | n/a |

### Consequências

* Bom, porque a guarda O3 passa a existir num lugar só, e uma correção nela vale para clientes, serviços, peças e as listagens futuras (F06, F31).
* Bom, porque `Paginacao` é uma função pura com teste unitário sem Spring nem banco.
* Bom, porque o contrato visto pela F36 é o mesmo que a F35 já consome, com um parâmetro a mais (`ativo`) e itens próprios.
* Ruim, porque a F05a toca o `ClienteService`, código de outra feature já entregue. O risco é regressão na listagem de clientes, coberto pelos testes atuais da F03a e pelo commit separado, que pode ser revertido sozinho.
* Ruim, porque `TermoBusca` continua calculando `padraoTelefone` para serviços e peças, que o ignoram. O custo é uma varredura da string por chamada.
* Neutro, porque a regra de `like` com `ESCAPE` continua tendo de ser lembrada em cada consulta nova; `Paginacao` não cobre isso.

### Risco residual

* A conversão de `ativo` aceitar `1`, `yes` e `on` é suposição até o teste do controller rodar.
* A F17 pode criar a segunda cláusula `like` (`codigo`) sem `ESCAPE`. Mitigação: o `grep` da Confirmação e um caso de teste por cláusula, como no ADR-017.
* A colisão de `ç` com `c` no índice único de `pecas.codigo` depois do `CONVERT` fica para a F17 decidir.
* Se a F06 ou a F31 precisarem de ordenação escolhida pelo usuário, a assinatura de `Paginacao` continua servindo (a ordem é parâmetro), mas o contrato de `sort` não está decidido aqui.

### Confirmação

* `PaginacaoTest` (unitário): página comum chama a consulta com o `PageRequest` pedido; `page=2147483647` com `size=100` chama a consulta com `PageRequest.of(0, 1, ordem)` e devolve página vazia com o total da consulta e `getNumber()` e `getSize()` pedidos.
* `grep -rn "Integer.MAX_VALUE" apps/api/src/main/java/br/com/mecanicasaojorge/api/service` acha uma ocorrência, em `Paginacao`.
* `grep -rn " like " apps/api/src/main/java/br/com/mecanicasaojorge/api/repository` e `grep -rn "escape '!'"` no mesmo caminho dão o mesmo número de linhas.
* Testes da F03a (`ClienteServiceTest`, `ClienteListagemIT`, `ClienteControllerTest`) passam sem alteração depois do commit de refatoração.
* Teste de integração da F05a com Testcontainers (`mysql:8.4`, migrations do zero) cobre US-SRV-01 a US-SRV-06, mais `ativo=abc` (400), `q=%` literal, `q` com acento e caixa diferentes do gravado, `page=2147483647&size=100` (200 vazio com total real) e `size=101` (400).
* O CRIVO confere a tabela de parâmetros deste ADR contra as anotações springdoc do `ServicoController`.

## Prós e contras das opções

### A. Manter como está (copiar por service)

* Bom, porque não toca o `ClienteService` e cada service fica legível sozinho.
* Bom, porque custa zero classe nova.
* Ruim, porque são três cópias da guarda O3 na Sprint 03 e cinco quando F06 e F31 chegarem (falha F2). Uma correção esquecida numa cópia volta a dar 500 em `page` alto só naquele endpoint.
* Custo do descarte: nenhum hoje; o custo de A aparece depois, a cada listagem nova.

### B. `service.Paginacao` (escolhida)

* Bom, porque a guarda fica num lugar só (F2) e o contrato não muda (F1, F3).
* Bom, porque é uma classe pequena, sem dependência nova (F4), no pacote que o ADR-001 reserva para regra.
* Ruim, porque exige a refatoração do `ClienteService` no mesmo PR, com risco de regressão na F03a.
* Ruim, porque a consulta entra como lambda, um estilo um pouco menos direto de ler do que a chamada do repository em linha.

### C. `Pageable` com `max-page-size`

* Bom, porque é o caminho padrão do Spring Data e corta código do controller.
* Ruim, porque `size=101` vira 100 em silêncio, em vez de 400 (falha F1, US-SRV-03).
* Ruim, porque abre `sort` livre vindo do cliente.
* Custo do descarte: manter três parâmetros explícitos por controller, cerca de 10 linhas cada.

### D. Record `PaginaRequest` com `@Valid @ModelAttribute`

* Bom, porque junta `page`, `size` e `q` num tipo com validação declarada uma vez.
* Ruim, porque troca a exceção e a mensagem do 400 de clientes, que a F35 e os testes da F03a já usam (falha F3).
* Ruim, porque `@ModelAttribute` liga qualquer campo do record vindo da query string, o que pede cuidado a cada campo novo.
* Custo do descarte: as anotações `@Min`, `@Max` e `@Size` repetidas em cada controller.

## Mais informações

* Revisitar quando a F06 (OS) precisar de filtro por status e ordenação diferente, ou quando uma listagem quiser `sort` vindo do cliente.
* Pendências: D8 (tempo estimado na lista) com a BUSSOLA; colisão de acento no `codigo` de peças com a F17.
* Pela regra da casa, o código da F05a só começa depois do aceite deste ADR e do ADR-033.
