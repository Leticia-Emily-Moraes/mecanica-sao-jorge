---
status: proposto
date: 2026-11-24
decision-makers: [CARTOGRAFO (Arquiteto), pessoa dona do produto (aceite)]
consulted: [BUSSOLA (PRD F06a, decisão D7)]
informed: [REGENTE, ESPRESSO, ORLA, ANCORA, CRIVO, PERGAMINHO]
---

# Representar data e hora na API como `Instant` em UTC (`Z`) e fixar o fuso da conexão JDBC em UTC

Histórico de status:

* 2026-11-24: proposto (F06a, etapa do CARTOGRAFO), ramo `docs/f06a-cartografo-adrs`.

Vínculos: F06a ([PRD](../../product/F06a-os-listar.md), decisão D7), F42 (tela que formata a data), e toda feature futura que exponha data e hora (F18, F20, F22, financeiro). Padrão transversal: complementa o ADR-007 (DTO) e o ADR-009 (configuração). Usado pelo [ADR-037](ADR-037-listar-ordens-de-servico-com-filtro-de-status-e-busca-por-nome-do-cliente-ou-placa-com-join-fetch.md) e pelo [ADR-038](ADR-038-criar-data-abertura-e-data-previsao-entrega-da-os-pela-migration-v11-da-f06a.md).

## Contexto e problema

`dataAbertura` é o primeiro campo de data e hora de um recurso na API. Hoje (conferido em 2026-11-24): `LoginResponse.expiraEm` é `Instant`; `ErrorResponse.timestamp` e `Cliente.createdAt` são `OffsetDateTime`; o `application.yml` não fixa fuso de JVM, de Jackson nem de conexão. O driver é o MySQL Connector/J 9.7.0 (lido do `api.jar` da imagem `qa-f41-api:r8`), cujo padrão, segundo a documentação do driver (não conferi o código nem rodei), é `connectionTimeZone=LOCAL`, ou seja, interpreta os `TIMESTAMP` lidos no fuso da JVM. O Mac de desenvolvimento roda em `America/Sao_Paulo` e o MySQL do container em UTC: um `DEFAULT CURRENT_TIMESTAMP` gerado pelo banco pode chegar à API 3 horas deslocado. **Não reproduzi esse deslocamento**: é a leitura da documentação do driver, e o experimento ficou para o teste de confirmação. O PRD sugere ISO-8601 sem fuso no fuso do servidor. Qual formato a API usa e como garantir que o instante lido do banco é o certo?

## Fatores de decisão

* F1: o mesmo instante aparece igual na API, seja qual for o fuso da JVM (Mac do dev, container, servidor futuro).
* F2: o app (F42) formata para a hora local sem precisar saber o fuso do servidor.
* F3: coerência com o que já existe na API (`expiraEm`) e nenhuma dependência nova.
* F4: uma regra só, configurada em um lugar, que vale para as features seguintes.

## Opções consideradas

* T1: manter como está: DTO com `OffsetDateTime` e nenhum fuso fixado.
* T2: fixar o fuso da JVM em UTC (`-Duser.timezone=UTC` ou `TZ=UTC` em todo ambiente).
* T3: DTO com `Instant` e fuso da conexão JDBC fixado em UTC pelas propriedades do driver.
* T4: DTO com `Instant` e `hibernate.jdbc.time_zone=UTC`, sem mexer no driver.
* T5: ISO-8601 sem fuso (`LocalDateTime`) no fuso do servidor, sugestão do PRD.

## Resultado da decisão

Opção escolhida: **T3**, porque é a única que fixa os dois lados da conversão (sessão do MySQL e interpretação do driver) em um lugar versionado (F1, F4), sem depender de flag de execução, e porque o `Instant` já é o formato da API em `expiraEm` (F3) e chega ao app com `Z`, que `Intl.DateTimeFormat` converte para a hora local (F2).

Regras:

1. Campo de data e hora em DTO de saída é `Instant`; o JSON sai como ISO-8601 em UTC com `Z`, por exemplo `2026-11-24T12:30:00Z`.
2. Campo só de data é `LocalDate`, sem fuso: `2026-12-01`.
3. A entidade continua com `OffsetDateTime` para `TIMESTAMP` (como `Cliente.createdAt`); o mapper converte com `toInstant()`.
4. No `application.yml`:

```yaml
spring:
  datasource:
    hikari:
      data-source-properties:
        connectionTimeZone: UTC
        forceConnectionTimeZoneToSession: true
```

Com isso o driver lê e grava `TIMESTAMP` como UTC e põe a sessão do MySQL em UTC, então `CURRENT_TIMESTAMP` e o valor lido batem. Se o servidor MySQL recusar o nome `UTC` (sem tabela de fusos carregada), o valor passa a ser `+00:00`, sem nova decisão.

5. `ErrorResponse.timestamp` (`OffsetDateTime`) não muda neste ADR, para não alterar contrato publicado; a regra 1 vale para campos novos.

### Consequências

* Bom, porque a regra vale para todo campo de data futuro e o front tem um formato só para tratar.
* Bom, porque testes, Mac e container passam a ler o mesmo instante.
* Ruim, porque o horário em UTC no JSON não é legível de cabeça para quem lê a resposta crua (`12:30Z` é 09:30 em Brasília); o app formata.
* Ruim, porque dado de data e hora gravado antes por um ambiente com fuso de JVM diferente do banco pode ser lido 3 horas deslocado depois da mudança. Nos testes não há esse caso (banco do zero, ADR-010); em banco local antigo pode haver.
* Ruim, porque ficam dois tipos de data e hora na API (`OffsetDateTime` no erro e `Instant` nos recursos) até o `ErrorResponse` ser revisto.

### Confirmação

* Teste de integração da F06a com a JVM em `-Duser.timezone=America/Sao_Paulo` (`argLine` do failsafe): inserir OS com `data_abertura` explícita `2026-11-24 12:30:00` e outra com o default; esperar `2026-11-24T12:30:00Z` na API e, para o default, um instante a menos de 1 minuto do `Instant.now()` do teste. Sem a configuração da regra 4, o caso do default deve falhar (o valor explícito passa pelo mesmo driver na ida e na volta e pode mascarar o erro); se o caso do default passar sem ela, o risco do contexto não existe e a regra 4 é revista.
* Revisão de PR: DTO de saída novo com data e hora usa `Instant`; `LocalDateTime` não aparece em DTO.
* Se o teste falhar com a regra 4 aplicada, o ESPRESSO para e volta ao CARTOGRAFO.

## Prós e contras das opções

### T1: manter como está

* Bom, porque não muda nada.
* Ruim, porque o instante lido depende do fuso da máquina (F1): no Mac pode sair 3 horas errado.
* Custo de adotar: o deslocamento aparece na F42 ou em relatório de prazo, longe da causa.

### T2: fuso da JVM em UTC

* Bom, porque resolve driver, Jackson e `LocalDateTime` de uma vez.
* Ruim, porque depende de flag em cada forma de executar (Maven, IDE, Docker, servidor); quem esquecer roda com outro comportamento (F4).
* Ruim, porque muda o horário dos logs e de todo `LocalDate.now()` do processo.
* Custo de adotar: mexer no Dockerfile, no README e nas configurações de execução, e conferir cada `now()`.

### T3: `Instant` e fuso da conexão em UTC (escolhida)

* Bom, porque fica em um arquivo versionado e vale em qualquer máquina (F1, F4).
* Neutro, porque usa propriedades documentadas do Connector/J, sem dependência nova.
* Ruim, porque não verifiquei a combinação com o Hibernate 7.4; o teste de confirmação é o árbitro.
* Ruim, porque, se o MySQL de produção não tiver tabela de fusos, exige o valor `+00:00`.

### T4: `Instant` e `hibernate.jdbc.time_zone`

* Bom, porque é propriedade do Hibernate, também em um lugar só.
* Ruim, porque só ajusta como o Hibernate passa o valor ao driver; a sessão do MySQL continua no fuso do servidor e o `CURRENT_TIMESTAMP` gerado pelo banco pode continuar deslocado na leitura (F1).
* Custo de adotar: o mesmo experimento de T3, com mais chance de deixar o default do banco de fora.

### T5: ISO sem fuso no fuso do servidor (PRD)

* Bom, porque é legível direto (`2026-11-24T09:30:00`).
* Ruim, porque o app precisa saber o fuso do servidor para interpretar (F2), e o valor muda se o servidor mudar de fuso.
* Ruim, porque diverge de `expiraEm`, que já sai com `Z` (F3).
* Custo de adotar: fixar o fuso do servidor como parte do contrato e repetir isso para cada campo novo.

## Mais informações

* Diverge da sugestão do PRD para D7 (T5); a decisão final é da pessoa no aceite deste ADR.
* Avisar o ANCORA: `argLine` do failsafe com fuso diferente de UTC; o pipeline deve manter esse fuso nos testes para o teste de confirmação continuar valendo.
* Avisar a ORLA: a F42 formata `dataAbertura` com `Intl.DateTimeFormat` no fuso do aparelho e `previsaoEntrega` como data pura, sem converter fuso.
* Revisitar quando houver servidor de produção definido (tabela de fusos do MySQL) ou quando o `ErrorResponse` for revisto.
