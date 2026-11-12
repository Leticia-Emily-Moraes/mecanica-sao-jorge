---
status: aceito
date: 2026-11-07
decision-makers: [CARTOGRAFO (Arquiteto)]
consulted: [ESPRESSO (Dev Java), BUSSOLA (PO)]
informed: [REGENTE, VIGIA, ANCORA, CRIVO]
---

# Organizar o backend em pacotes por camada

## Contexto e problema

O backend `apps/api` precisa de uma organização de pacotes estável antes de a
primeira feature de negócio (Login, F02) e as seguintes (Clientes, Veículos,
Catálogo, OS, Financeiro) serem escritas. O briefing da operação restringe
explicitamente: "pacotes por camada e não por feature". Como estruturar os
pacotes para que todas as features sigam o mesmo desenho sem ambiguidade?

## Fatores de decisão

* Aderência à restrição do briefing (pacotes por camada).
* Previsibilidade: um desenvolvedor acha a classe pelo tipo sem conhecer a feature.
* Baixo atrito para uma oficina de pequeno porte (equipe pequena, um deployable).
* Compatibilidade com "regra de negócio só no service" e "nunca expor entidade na API".

## Opções consideradas

* **Opção A — Pacotes por camada** (`entity`, `repository`, `service`, `dto`, `mapper`, `controller`, `config`, `security`, `exception`).
* **Opção B — Pacotes por feature** (`cliente/`, `veiculo/`, `os/`, cada um com suas camadas).
* **Opção C — Arquitetura hexagonal estrita** (`domain/`, `application/`, `adapters/`).

## Resultado da decisão

Opção escolhida: **"Opção A — pacotes por camada"**, porque é a restrição direta
do briefing e a que melhor atende previsibilidade com o menor atrito para uma
equipe pequena e um único módulo. A camada é a dimensão primária; o nome da
classe carrega a feature (ex.: `ClienteService`, `ClienteController`).

Estrutura canônica sob `br.com.mecanicasaojorge.api`:

```
api
├── entity        # entidades JPA (ADR-007), uma por tabela, no singular
├── repository    # interfaces Spring Data JPA
├── service       # regra de negócio (única camada que a contém)
├── dto           # *Request (entrada, Bean Validation) e *Response (saída)
├── mapper        # MapStruct entity <-> dto (ADR-007)
├── controller    # endpoints REST, finos, sem regra de negócio
├── config        # configuração transversal (OpenAPI, propriedades)
├── security      # filtro/config de autenticação (ADR-004)
└── exception     # handler global e tipos de erro (ADR-011)
```

### Consequências

* Bom, porque qualquer desenvolvedor localiza uma classe pelo tipo, e o padrão é idêntico em todas as features.
* Bom, porque reforça a separação: regra no `service`, mapeamento no `mapper`, exposição no `controller`.
* Ruim, porque classes de uma mesma feature ficam espalhadas por vários pacotes.
* Ruim, porque não há barreira de compilação impedindo um `controller` de chamar um `repository` direto — fica a cargo de revisão (ver Confirmação).

### Confirmação

Revisão de código em todo PR verifica: (1) cada classe no pacote da sua camada;
(2) nenhum `controller` injeta `repository` nem retorna `entity`; (3) regra de
negócio só em `service`. O Checkstyle já roda (`mvn checkstyle:check`) e pode
receber regra de import-control numa etapa futura para automatizar (2).

## Prós e contras das opções

### Opção A — Por camada
* Bom, porque cumpre o briefing e é o padrão mais difundido em Spring Boot.
* Bom, porque a estrutura é a mesma para todas as features (previsível).
* Neutro, porque exige disciplina de revisão para impedir atalhos entre camadas.
* Ruim, porque dispersa os arquivos de uma feature.

### Opção B — Por feature
* Bom, porque mantém junto tudo de uma feature.
* Ruim, porque **viola a restrição explícita do briefing**.
* Ruim, porque incentiva divergência de padrão entre features.

### Opção C — Hexagonal estrita
* Bom, porque isola domínio de infraestrutura com portas/adaptadores.
* Neutro, porque o guia da casa descreve hexagonal como referência.
* Ruim, porque é peso excessivo para uma oficina de pequeno porte, com um único banco e sem integrações externas nesta fase; o custo de portas/adaptadores não se paga aqui, e conflita com "pacotes por camada" do briefing.

## Mais informações

Complementa [[ADR-007-nao-expor-entidade-na-api-dto-e-convencao-de-nomes]] e
[[ADR-011-handler-global-de-erro-e-mapeamento-de-status]]. Revisitar se o
sistema deixar de ser um único módulo (ex.: extração de serviço), cenário hoje
fora de escopo por restrição do briefing.
