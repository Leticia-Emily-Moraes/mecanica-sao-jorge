# PRD — F06a: Ordens de Serviço, listar com filtro por status e busca por cliente ou placa (card F06) — somente API

- Prioridade: P1
- Área: **Backend** (o card dizia Full-stack; a tela está na feature de front de OS, ver seção 4)
- Sprint: Sprint 04: Ordens de Serviço
- Autora: BUSSOLA (Product Owner)
- Data: 2026-11-24 (revisão 1)
- Etapa da rota: **BUSSOLA (1/6)** → CARTOGRAFO → ESPRESSO → VIGIA → PERGAMINHO → CRIVO
- Depende de: F00, F02, F03a (clientes), F04 (veículos). Bloqueia: F18 (F06b, criar OS), F19 (F06c, detalhe), F42 (front de OS).
- Estado: **PRD fechado para o CARTOGRAFO.** Restam decisões abertas (seção 8). Cada uma tem um padrão adotado, que a pessoa pode trocar.

> **Como ler.** Separo o que li do que suponho. Esta etapa é documento: **não rodei código nem teste.** Li no ramo `docs/f06a-bussola-prd-os-listar` (cabeça `75b6680`): `V2__criar_schema_oficina.sql`, a lista de migrations (V1 a V4, V9 e V10), `entity/StatusOS.java`, a linha da OS na matriz de `docs/architecture/overview.md` e o ADR-017 inteiro. Li o PRD da F04 (`docs/product/F04-veiculos.md`) no ramo `docs/f04-bussola-prd-revisao`, que ainda não está neste ramo. **Não encontrei no repositório** o card da F42 nem o texto da US-OS-FRONT-01; o que digo dela vem do enunciado da instrução.

## 1. Visão e histórias

Quem atende no balcão tem o carro na frente e precisa achar a OS dele sem procurar em papel. Esta feature entrega o **contrato da API de listagem de OS**, para a feature de front (F42) consumir sem adivinhar campo. É a primeira fatia do módulo e **cria só duas colunas** que a lista exige (seção 5).

- **H1.** Como **atendente da oficina**, quero listar as ordens de serviço filtrando por status e buscando por cliente ou placa, para achar a OS do carro que está no balcão sem procurar em papel.
- **H2.** Como **app mobile (F42)**, quero `GET /api/v1/ordens-servico` com contrato estável (campos, paginação e formato de erro), para montar a lista sem ler texto livre.
- **H3.** Como **responsável pela oficina (controladora, LGPD)**, quero que o nome do cliente, a placa e o termo de busca nunca apareçam em log nem em mensagem de erro, e que a lista exponha só o mínimo, para um vazamento de log ou de resposta não virar vazamento de cadastro.

Tamanho (INVEST): migration, DTO, mapper, consulta, service, controller, handler e testes cabem em até 3 dias. Se passar disso, a migration e a consulta saem numa PR e o endurecimento do handler em outra.

## 2. Escopo

### Dentro
- `GET /api/v1/ordens-servico`, autenticado, com `status`, `q`, `page` e `size`, todos opcionais.
- Paginação: `page` base 0, `size` padrão 20 e máximo 100. Ordem fixa: `data_abertura` decrescente, `id` decrescente como desempate.
- Filtro `status`: nome exato de um valor do enum `StatusOS` (caixa importa, ver P8). Combinado com `q` vale com E.
- Busca `q`: trecho do nome do cliente ou da placa, sem diferenciar caixa nem acento, ignorando hífen e espaço na placa. `q` em branco equivale a sem busca.
- Resposta paginada no envelope da F03a (`PaginaResponse<T>`, ADR-017) com `OrdemServicoResumoResponse`: `id`, `status`, `dataAbertura`, `previsaoEntrega` (pode ser `null`), `valorTotal`, `cliente {id, nome}` e `veiculo {id, placa, modelo}`.
- Consulta sem N+1: cliente e veículo na mesma consulta da página.
- Migration Flyway **aditiva** com `ordens_servico.data_abertura` e `ordens_servico.data_previsao_entrega` (seção 5) e fechamento das duas linhas na matriz do `overview.md`.
- 400 e 401 no corpo de erro do handler global (ADR-011). 404 e 405 herdados do ADR-017, sem trabalho novo.
- Documentação OpenAPI por springdoc, com exemplos fictícios.

### Fora (explícito)
- **Tela de lista, chips de status, busca com debounce, estados de carregamento, vazio e erro, texto "Sem previsão", i18n `os.lista.*`, `Intl`, acessibilidade e paridade com o Figma:** feature de front de OS (F42). Nada disso é critério da F06a. Ver `docs/product/F42-recebido-da-F06a-os-listar.md`.
- Criar OS (F18), detalhe com itens, desconto e totais (F19), transição de status, cancelamento e estoque (F20), parcelas (F21).
- Filtro por período, ordenação escolhida pela pessoa, busca por outros campos (telefone, CPF, modelo, id da OS).
- Perfil de permissão: qualquer usuário autenticado acessa (briefing).
- Lista de OS dentro do cliente ou do veículo (histórico por veículo).

### Fica para depois (priorização por valor para quem usa)
1. Tela de lista (F42): sem ela o balcão não usa a API.
2. Filtro por período e ordenação escolhida: ajuda quando a oficina tiver meses de OS; hoje a ordem fixa serve.
3. Busca por telefone do cliente: exigiria a regra T2 do ADR-017 e mais um dado pessoal na consulta.

## 3. Glossário

- **OS**: ordem de serviço, tabela `ordens_servico`.
- **Resumo**: item da lista. Só campos de leitura rápida; o detalhe é da F19.
- **Placa normalizada**: 7 caracteres ASCII maiúsculos, sem hífen nem espaço (`ABC1D23`), como a F04 grava.
- **Envelope**: `PaginaResponse<T>` com `itens`, `pagina`, `tamanho`, `totalItens` e `totalPaginas` (ADR-017).
- **Handler global**: `GlobalExceptionHandler` e `RestAuthenticationEntryPoint`; corpo `{timestamp, status, erro, mensagem, path}` (ADR-011).
- **N+1**: uma consulta para a página mais uma por item para carregar cliente e veículo.

## 4. Reparticionamento F06a × front de OS

| Assunto | Dono |
|---|---|
| Contrato da API, paginação, filtro, busca, erros 400 e 401, LGPD da resposta, N+1 | **F06a** |
| Tela, chips, debounce, quatro estados, i18n, `Intl`, "Sem previsão", acessibilidade, paridade Figma | **F42** |
| 401 na lista levar ao login como na F30, sem "Tentar novamente" | **F42** |

Duplicidade que aponto: o card diz "Front mobile de Ordens de Serviço (lista)", e o panorama traz F42 como "lista e criação". Trato F42 como a feature de front. O card diz que os "critérios US-OS-LST-14 a 19 migram para lá", mas aqui o **US-OS-LST-14 é outro critério** (termo fora do log, de API). Recomendo que a F42 renumere o que receber como `US-OS-FRONT-*`, para o rastro de teste não colidir.

## 5. Schema: o que a V2 tem e o que falta (tarefa 1)

Verificado lendo `V2__criar_schema_oficina.sql` e a matriz do `overview.md` (linhas 87, 126, 145, 156):

| Campo do DTO | Coluna | Situação na V2 |
|---|---|---|
| `id`, `status` | `ordens_servico.id`, `status VARCHAR(20) NOT NULL` | existe |
| `valorTotal` | `valor_total DECIMAL(10,2) NOT NULL DEFAULT 0` | **existe** (coluna comum, recalculada no service pela F19). Resolve a dúvida 2 do card |
| `cliente {id, nome}` | `clientes.id`, `clientes.nome` | existe |
| `veiculo {id, placa, modelo}` | `veiculos.id`, `placa`, `modelo` | existe (placa normalizada e índice único chegam pela V7 da F04, fora deste ramo) |
| `dataAbertura` e a ordenação | `data_abertura` | **falta.** O `overview.md` põe na F18 |
| `previsaoEntrega` | `data_previsao_entrega DATE` | **falta.** O `overview.md` põe na F18 |

**Consequência:** a F06a não consegue ordenar nem devolver o DTO sem as duas colunas, e a F18 (que as criaria) depende da F06. Proponho que a **F06a crie as duas**, e a F18 fique com `descricao_problema`, `diagnostico` e o resto:

- `data_abertura TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP` (decisão já registrada no `overview.md`, linha 156, achado A6).
- `data_previsao_entrega DATE NULL`.
- A numeração da migration é a próxima livre na hora do código (ADR-003). Neste ramo há V1 a V4, V9 e V10; V5 a V8 estão em ramos de outras features.
- O CARTOGRAFO confirma a troca de dono (D6) e o ESPRESSO atualiza as duas linhas da matriz.

## 6. Contrato (resumo; o normativo é o ADR-017, que esta feature herda)

`GET /api/v1/ordens-servico`, fora de `PUBLIC_PATHS`.

| Parâmetro | Tipo | Padrão | Regra | Inválido |
|---|---|---|---|---|
| `status` | texto | ausente | nome exato de um valor de `StatusOS`; ausente ou vazio lista sem filtro (P8) | 400, mensagem só com o nome do parâmetro |
| `q` | texto | ausente | `@Size(max = 100)` sobre o valor bruto; ausente, vazio ou só espaços lista sem filtro | 400 |
| `page` | inteiro, base 0 | 0 | 0 a 2.147.483.647; além do fim devolve 200 vazio | 400, inclusive `abc` e `2147483648` |
| `size` | inteiro | 20 | 1 a 100, nunca corrigido em silêncio | 400, inclusive `abc` |

Nomes do envelope: o card cita `content`, `page`, `size`, `totalElements` e `totalPages`; o ADR-017 define `itens`, `pagina`, `tamanho`, `totalItens` e `totalPaginas`. A premissa 3 do card manda valer a F03a, então **os critérios abaixo usam os nomes do ADR-017** (decisão D5).

Exemplo de resposta 200 (dados fictícios):

```json
{
  "itens": [
    {
      "id": 42,
      "status": "ABERTA",
      "dataAbertura": "2026-11-24T09:30:00",
      "previsaoEntrega": null,
      "valorTotal": 0.00,
      "cliente": { "id": 7, "nome": "Maria Souza" },
      "veiculo": { "id": 11, "placa": "ABC1D23", "modelo": "Gol" }
    }
  ],
  "pagina": 0,
  "tamanho": 20,
  "totalItens": 1,
  "totalPaginas": 1
}
```

Normalização de `q` no service (função pura com teste unitário, reaproveitando `TermoBusca` da F03a se couber):

1. `strip()`; vazio significa sem busca.
2. NFC.
3. **Padrão de nome:** `"%" + escapar(termo) + "%"`, com `ESCAPE '!'` (ADR-017, E2). O hífen fica, porque `Ana-Maria` é nome válido.
4. **Padrão de placa:** o termo em maiúsculas, **sem hífen e sem espaço**, escapado do mesmo jeito. Se sobrar vazio (`q` era `-`), a placa não entra na consulta.
5. Cláusula: `(cliente.nome like :nome escape '!' or (:placa is not null and veiculo.placa like :placa escape '!'))`, combinada com `status` por E quando houver.

## 7. Histórias de usuário e critérios de aceitação (Gherkin)

IDs `US-OS-LST-NN` mantêm a numeração do card (01 a 14). Os que têm letra são acréscimos desta revisão, para fechar bordas que o ADR-017 exige das listagens. **Acessibilidade e tela:** não se aplicam à API e estão na F42. **Estados de erro** fazem parte do aceite aqui: 400, 401 e lista vazia.

### US-OS-LST-01 a 03: listar e paginar

```gherkin
Cenário: US-OS-LST-01 listagem padrão
  Dado 3 OS com datas de abertura distintas
  Quando chamo GET /api/v1/ordens-servico sem parâmetros
  Então recebo HTTP 200
  E itens traz as OS da mais recente para a mais antiga
  E pagina é 0, tamanho é 20 e totalItens é 3

Cenário: US-OS-LST-01b desempate por id
  Dado 2 OS com a mesma data de abertura e ids 10 e 11
  Quando chamo o endpoint sem parâmetros
  Então a OS de id 11 vem antes da de id 10

Cenário: US-OS-LST-02 paginação
  Dado 25 OS cadastradas
  Quando chamo com page=1 e size=10
  Então itens traz 10 OS
  E totalPaginas é 3 e totalItens é 25
  E a ordem continua da mais recente para a mais antiga

Esquema do Cenário: US-OS-LST-03 limites de paginação
  Quando chamo com <parametro>=<valor>
  Então recebo HTTP 400 no corpo padrão do handler global
  E a mensagem cita o parâmetro "<parametro>"
  E a mensagem não contém o valor "<valor>"
  Exemplos:
    | parametro | valor |
    | size      | 101   |
    | size      | 0     |
    | page      | -1    |

Esquema do Cenário: US-OS-LST-03b valor não numérico ou fora do int
  Quando chamo com <parametro>=<valor>
  Então recebo HTTP 400 no corpo padrão do handler global
  Exemplos:
    | parametro | valor      |
    | size      | abc        |
    | page      | abc        |
    | page      | 2147483648 |

Cenário: US-OS-LST-03c página além do fim e deslocamento acima de 2.147.483.647
  Dado 3 OS cadastradas
  Quando chamo com page=5 e size=20
  Então recebo HTTP 200 com itens vazio, totalItens 3 e totalPaginas 1
  Quando chamo com page=2147483647 e size=100
  Então recebo HTTP 200 com itens vazio e totalItens 3, nunca 500
```

### US-OS-LST-04 e 05: filtro por status

```gherkin
Cenário: US-OS-LST-04 filtro por status
  Dado OS em ABERTA e em EM_ANALISE
  Quando chamo com status=EM_ANALISE
  Então itens traz só OS em EM_ANALISE
  E totalItens conta só elas

Esquema do Cenário: US-OS-LST-05 status inválido
  Quando chamo com status=<valor>
  Então recebo HTTP 400, nunca 500
  E a mensagem cita o parâmetro "status" e não contém o valor "<valor>"
  Exemplos:
    | valor              |
    | XYZ                |
    | aberta             |
    | ABERTA,EM_ANALISE  |
```

### US-OS-LST-06 a 09: busca

```gherkin
Cenário: US-OS-LST-06 busca por cliente
  Dado OS dos clientes "Maria Souza" e "João Lima"
  Quando busco q=souza
  Então itens traz só as OS de Maria Souza

Cenário: US-OS-LST-06b busca ignora caixa e acento
  Dado uma OS do cliente "José Antônio"
  Quando busco q=JOSE ANT
  Então a OS de José Antônio vem na lista

Cenário: US-OS-LST-06c q em branco equivale a sem busca
  Dado 3 OS cadastradas
  Quando busco q com só espaços
  Então recebo HTTP 200 com as 3 OS

Cenário: US-OS-LST-06d q com mais de 100 caracteres
  Quando busco q com 101 caracteres
  Então recebo HTTP 400 e a mensagem cita só o parâmetro "q"

Cenário: US-OS-LST-06e curinga é literal
  Dado OS dos clientes "Maria Souza" e "100% Peças Ltda"
  Quando busco q=%
  Então itens traz só a OS de "100% Peças Ltda"

Cenário: US-OS-LST-07 busca por veículo
  Dado OS dos veículos de placa ABC1234 e XYZ9876
  Quando busco q=abc-12
  Então itens traz só as OS do veículo ABC1234

Cenário: US-OS-LST-07b placa Mercosul, caixa e espaço
  Dado uma OS do veículo de placa ABC1D23
  Quando busco q=" abc 1d "
  Então a OS do veículo ABC1D23 vem na lista

Cenário: US-OS-LST-07c q só com hífen
  Dado OS dos clientes "Ana-Maria Reis" e "João Lima"
  Quando busco q=-
  Então itens traz só a OS de "Ana-Maria Reis"
  E a placa não entra na consulta

Cenário: US-OS-LST-08 filtro e busca combinados
  Dado OS de Maria Souza em ABERTA e em EM_ANALISE
  E uma OS de João Lima em ABERTA
  Quando chamo com status=ABERTA e q=souza
  Então itens traz só a OS de Maria Souza em ABERTA

Cenário: US-OS-LST-09 sem resultado
  Dado um filtro ou busca sem OS correspondente
  Quando chamo o endpoint
  Então recebo HTTP 200 com itens vazio, totalItens 0 e totalPaginas 0
```

### US-OS-LST-10 a 14: segurança, LGPD e desempenho

```gherkin
Esquema do Cenário: US-OS-LST-10 sem autenticação
  Dado uma chamada <situacao>
  Quando chamo GET /api/v1/ordens-servico
  Então recebo HTTP 401 no corpo padrão
  E nenhum dado de OS é retornado
  Exemplos:
    | situacao           |
    | sem token          |
    | com token inválido |
    | com token expirado |

Cenário: US-OS-LST-11 minimização de dados
  Dado uma OS cujo cliente tem CPF, telefone, email e endereço
  Quando listo
  Então cada item do JSON contém só id, status, dataAbertura, previsaoEntrega, valorTotal, cliente e veiculo
  E cliente contém só id e nome
  E veiculo contém só id, placa e modelo

Cenário: US-OS-LST-12 consulta sem N+1
  Dado uma página com 20 OS de clientes e veículos diferentes
  E outra página com 1 OS
  Quando listo cada uma
  Então o número de consultas SQL é o mesmo nas duas, medido pelas estatísticas do Hibernate

Cenário: US-OS-LST-13 previsão de entrega ausente
  Dado uma OS sem previsão de entrega
  Quando listo
  Então previsaoEntrega vem null no JSON, sem omitir o campo

Cenário: US-OS-LST-13b valor total sem itens
  Dado uma OS sem itens de serviço nem de peça
  Quando listo
  Então valorTotal é 0.00

Cenário: US-OS-LST-14 termo de busca fora do log e da mensagem de erro
  Dado q=souza e status=XYZ na mesma chamada
  Quando a API monta o erro 400 e registra o log
  Então o valor "souza" não aparece no corpo do erro
  E o valor "souza" não aparece em nenhuma linha de log capturada
  E o log de uma chamada válida traz só qLen, page, size, status, total e o id do usuário

Cenário: US-OS-LST-14b placa fora do log
  Dado q=abc-1d23 numa chamada válida e noutra inválida
  Quando a API registra o log
  Então "abc-1d23" e "ABC1D23" não aparecem em nenhuma linha de log
```

Rastro de teste: US-OS-LST-01 a 14 vão para teste de integração com Testcontainers (MySQL 8.4, todas as migrations do zero). Os cenários 03, 03b, 05 e 10 também têm teste de controller com MockMvc. A normalização de `q` tem teste unitário com tabela.

## 8. Premissas e dúvidas em aberto

### Premissas (P1 a P6 vêm do card; P7 a P12 são desta revisão)

1. O enum `StatusOS` segue o `CLAUDE.md`. Hoje só existem `ABERTA` e `EM_ANALISE`; a lista fecha na Sprint 04. A F06a valida contra o enum existente e **não fixa a lista de valores**. Os testes usam só esses dois valores.
2. `valorTotal` vem 0,00 enquanto a OS não tem itens (serviços e peças entram na F19). **Verificado:** a coluna existe na V2 com `DEFAULT 0`.
3. Paginação e envelope seguem o padrão da F03a (ADR-017); se divergir, vale o da F03a. **Divergência encontrada**, ver D5.
4. `size` acima de 100, `size` 0 ou `page` negativa respondem 400, sem ajuste silencioso.
5. A busca é por trecho (contém), não por prefixo.
6. `previsaoEntrega` nula é estado válido e a API devolve `null`.
7. A placa está gravada normalizada (sem hífen, maiúscula) pela F04, e a F06a não normaliza a coluna. Se houver linha antiga com hífen, a busca por `abc12` não a acha. Dependência da V7 da F04 chegar antes ou junto.
8. `status` é comparado pelo nome exato do enum: `aberta` em minúscula é 400. `status=` vazio equivale a sem filtro (comportamento esperado do conversor do Spring para enum; **a confirmar no teste**).
9. A lista não exclui OS por status: inclui `CANCELADA` e `ENTREGUE` quando existirem, a menos que o filtro diga o contrário.
10. Não há índice dedicado nesta fatia (volume de pequeno porte, premissa P2 do ADR-017). O índice `idx_ordem_status` que o `overview.md` põe na F06 fica por decisão do CARTOGRAFO (D8).
11. Os dados de teste são fictícios e criados direto no banco (por repositório ou SQL), porque a criação de OS é da F18.
12. Nenhuma regra de visibilidade por perfil: ADMIN e FUNCIONARIO veem as mesmas OS.

### Dúvidas em aberto

| # | Dúvida | Padrão adotado | Quem decide |
|---|---|---|---|
| D1 | Os nomes do `CLAUDE.md` (`ABERTA`, `EM_ANALISE`, ...) prevalecem sobre `RECEBIDA` e `CONCLUIDA` citados antes na conversa? Não tenho esse trecho da conversa. | Vale o `CLAUDE.md`, que é o que está no código | pessoa |
| D2 | ~~`valorTotal` é coluna ou soma?~~ **Resolvida:** é coluna (`valor_total`, V2, linha 87 do `overview.md`). | n/a | n/a |
| D3 | ~~Tela fica nesta feature?~~ **Resolvida:** vai para a F42. | n/a | n/a |
| **D4** | **Campos do DTO da lista, e se `valorTotal` e `previsaoEntrega` entram já nesta fatia** (a US-OS-FRONT-01 da F42 exige os dois). Também: falta `veiculo.marca`? Falta `clienteId` solto? | **Entram os dois, no DTO do card:** `id`, `status`, `dataAbertura`, `previsaoEntrega`, `valorTotal`, `cliente {id, nome}`, `veiculo {id, placa, modelo}`. Sem `marca`. Custo: a migration de `data_abertura` e `data_previsao_entrega` fica na F06a (seção 5). Sem `valorTotal` a F42 teria de esperar a F19 | **pessoa (pedido do comandante)** |
| D5 | Nomes do envelope: card (`content`, `page`, `size`, `totalElements`, `totalPages`) contra ADR-017 (`itens`, `pagina`, `tamanho`, `totalItens`, `totalPaginas`). | ADR-017, pela premissa 3. A F42 usa os mesmos nomes da F35 | pessoa |
| D6 | Troca de dono das colunas `data_abertura` e `data_previsao_entrega`, da F18 para a F06a. | F06a cria as duas; F18 fica com `descricao_problema`, `diagnostico`, `data_fechamento` | CARTOGRAFO, avisar PRUMO |
| D7 | Formato de `dataAbertura` (data e hora, sem fuso ou com `Z`) e fuso do servidor. `previsaoEntrega` é só data (`2026-12-01`). | ISO-8601 sem fuso (`2026-11-24T09:30:00`), no fuso do servidor, em linha com o `TIMESTAMP` do MySQL. A F42 formata com `Intl` | CARTOGRAFO |
| D8 | Collation de `veiculos.placa` na busca, e o índice `idx_ordem_status`. A V3 já fixa `clientes`; não vi migration de collation para `veiculos` (a regra do ADR-017 manda a feature dona da busca fixá-la). | Fixar `utf8mb4_0900_ai_ci` em `veiculos` na migration da F06a, como a V10 fez em `pecas`, e não criar índice agora | CARTOGRAFO |
| D9 | `placa` é dado pessoal indireto? A F04 a mascara em log (`****D23`). O card só cita o nome do cliente na seção LGPD. | Tratar como dado pessoal: entra na tabela da seção 9 e fica fora de log | VIGIA |
| D10 | Qual formato do 400: só mensagem com o nome do parâmetro (ADR-017) ou também `erros[]` com `chave` (F04)? | Mensagem com o nome do parâmetro, sem valor; se `erros[]` já estiver na `main` quando a F06a for codificada, preencher também, com `campo` e sem valor | CARTOGRAFO |

## 9. LGPD: dados pessoais que a feature toca

| Dado | Onde | Finalidade | Base legal | Retenção | Minimização e saída |
|---|---|---|---|---|---|
| `cliente.nome` | resposta da lista, consulta `LIKE` | Localizar a OS do cliente atendido no balcão | Execução de contrato, art. 7º, V (mesma da F03a) | Enquanto a OS existir, mesmo prazo do cadastro do cliente (política de dados do cliente) | Só `id` e `nome`. Nunca CPF, telefone, email, endereço |
| `veiculo.placa` (D9) | resposta da lista, consulta `LIKE` | Localizar a OS pelo carro que está no balcão | Execução de contrato, art. 7º, V (mesma da F04) | Enquanto a OS existir | Só `id`, `placa`, `modelo`. Fora de log e de mensagem de erro |
| Termo `q` | query string, memória e parâmetro ligado | Executar a busca | Execução de contrato, art. 7º, V | **Não é guardado.** Vive só na requisição | Não vai para log nem mensagem de erro. O log traz só `qLen` (tamanho depois do `strip` e NFC) |
| `dataAbertura`, `previsaoEntrega`, `valorTotal`, `status` | resposta | Priorizar o atendimento e acompanhar prazo e custo | Execução de contrato, art. 7º, V | Enquanto a OS existir | Dado da OS, ligado à pessoa pelo cliente; só sai junto de `id` e `nome` |
| Id do usuário autenticado | log da consulta | Rastrear quem consultou | Legítimo interesse (segurança), art. 7º, IX, como no log das outras listagens (a confirmar com o VIGIA) | Prazo do log da aplicação | Só o id, nunca email |

Em teste e ambiente local, nome, placa e termo são fictícios. A anonimização do cliente (política, seção 4) deixa a OS com o nome "Cliente anonimizado" na lista, sem mudar o contrato.

## 10. Riscos

- **Troca de dono das colunas (D6):** se a F18 já tiver ramo com as mesmas colunas, dois ramos criam a coluna e o Flyway quebra. Mitigação: avisar o PRUMO e usar o próximo número livre.
- **Placa antiga com hífen (P7):** a busca por placa depende da F04 ter gravado normalizado.
- **`LIKE` com `%` no início:** varredura completa. Aceito pelo volume; revisitar com milhares de OS.
- **`ESCAPE` esquecido numa cláusula nova:** `q=%` passa a casar tudo. O `grep` do ADR-017 (`git grep -niE "like :"`) e um teste por cláusula cobrem.
- **`StatusOS` incompleto:** a F20 acrescenta valores; teste que fixe a lista inteira quebra. Por isso a premissa 1.

## 11. Tarefas

Os números são os do card. A tarefa 1 está feita nesta etapa (resultado na seção 5). As tarefas 2 a 10 são do ESPRESSO, depois do aceite do ADR do CARTOGRAFO.
