---
status: proposto
date: 2026-11-24
decision-makers: [CARTOGRAFO (Arquiteto), pessoa dona do produto (aceite)]
consulted: []
informed: [REGENTE, BUSSOLA, PRUMO, ESPRESSO, CRIVO, ORLA, PERGAMINHO]
---

# Adotar um contrato único de paginação nas listagens: `page` base 0, `size` 20 até 100 e envelope `PaginaResponse`

Histórico de status:

* 2026-11-24: proposto (F17, etapa do CARTOGRAFO, a pedido do comandante), ramo `docs/f17-adr040-contrato-paginacao`, empilhado sobre `docs/f17-adr-pecas-listar`.

Vínculos: F17 (premissa 1 e critérios 2, 4, 5 e 6), F03a ([ADR-017](ADR-017-padronizar-listagem-com-busca-e-paginacao.md), na `main` pela PR #15), F05a ([ADR-032](ADR-032-reaproveitar-contrato-de-listagem-do-adr-017-com-paginacao-extraida-no-service.md), ramo `docs/f05a-adr-paginacao-e-nome-servico`), F06a (ADR-037, ramo `docs/f06a-cartografo-adrs`) e F31, a próxima listagem. Quem consome: F35, F36, F42 e F43. Complementa o ADR-017 e o ADR-032 **sem mudar nenhum dos dois**. Os valores de página aqui são os mesmos que eles já fixaram. Este ADR tira o contrato de dentro da seção da F03a, dá a ele um lugar próprio, fixa como ler PRD escrito com os nomes do Spring e registra onde F03a e F05a divergem hoje. Também complementa o ADR-007 (DTO) e o ADR-011 (formato de erro). O contrato de peças fica no [ADR-034](ADR-034-listar-pecas-com-busca-em-nome-ou-codigo-sem-filtro-de-ativo-e-sem-custo.md).

## Contexto e problema

O padrão de paginação nasceu no ADR-017 como "Contrato normativo (F03a, modelo para as próximas listagens)". Depois foi repetido pelo ADR-032 (serviços e peças), pelo ADR-034 (peças) e pelo ADR-037 (OS). Na F17 apareceram três problemas:

1. O texto da F17 diz que "F03a e F05a ainda não foram entregues" e que "a primeira a entrar define o envelope (content, page, size, totalElements, totalPages)". Só que a F03a já está na `main` com `PaginaResponse` e os campos `itens`, `pagina`, `tamanho`, `totalItens` e `totalPaginas`. Os critérios 2, 4 e 5 da F17 usam os nomes do Spring. O ADR-034 resolveu isso numa linha de risco residual, e a F31 vai esbarrar na mesma dúvida.
2. O contrato não tem lugar próprio. Para saber os limites de página, é preciso ler um ADR de 460 linhas sobre busca de clientes.
3. F03a e F05a já divergem entre si na implementação e na cobertura de teste, e nenhum documento registra isso.

Que contrato de paginação vale para toda listagem, e como tratar o que já diverge dele sem reabrir F03a e F05a?

## Evidência (verificada em 2026-11-24)

Fontes: código do ramo `docs/f17-adr-pecas-listar` (75b6680, que contém F03a, F05a e F17), a `main` (7aab1c0) e o ramo `docs/f06a-cartografo-adrs` (7d360de) para a OS. Tudo lido, não executado, salvo onde está escrito outra coisa.

| Item | Clientes (F03a) | Serviços (F05a) | Peças (F17) | OS (F06a, referência) |
|---|---|---|---|---|
| `page` | `@RequestParam(defaultValue = "0") @Min(0) int` | igual | igual | igual |
| `size` | `@RequestParam(defaultValue = "20") @Min(1) @Max(100) int` | igual | igual | igual |
| `q` | `@Size(max = 100)` | igual | igual | igual |
| `Pageable` no controller | não | não | não | não |
| Corpo 200 | `PaginaResponse<ClienteListResponse>` | `PaginaResponse<ServicoListResponse>` | `PaginaResponse<PecaListResponse>` | `PaginaResponse<OrdemServicoListResponse>` |
| Guarda O3 (`page * size` acima de 2.147.483.647) | na `main`: dois métodos privados do `ClienteService`; no ramo da F05a: `Paginacao` (commit 57bca0d) | `Paginacao` | `Paginacao` | `Paginacao` |
| Ordem | `nome` asc, `id` asc | `nome` asc, `id` asc | `nome` asc, `id` asc | `dataAbertura` desc, `id` desc |
| Filtro próprio | nenhum | `ativo` | nenhum | `status` |

* `git ls-tree -r --name-only main apps/api/src/main/java` lista `PaginaResponse.java` e `TermoBusca.java`, mas não `Paginacao.java`.
* `PecaService` chama `Paginacao.paginar` (linha 43). Logo, o código da F17 não compila a partir da `main` sem o commit 57bca0d da F05a.
* `application.yml` não tem `spring.data.web.pageable.*`.
* A F35 lê `itens` e `totalItens` no ramo dela (commits d661e45, 218c88f e d11e464, achados com `git log --all -S totalItens -- apps/mobile`).

Cobertura dos limites nos testes (grep nos testes do ramo da F17):

| Caso | Clientes | Serviços | Peças |
|---|---|---|---|
| `size=0`, `size=101`, `page=-1`, `q` com 101 caracteres → 400 | sim (`ClienteListagemIT:397`) | sim (`ServicoListagemIT:254`) | sim (`PecaListagemIT:164`) |
| `size=abc` → 400 | sim | sim | **não** |
| `page=abc` → 400 | sim (`ClienteControllerTest:144`) | **não** | **não** |
| `page=2147483648` → 400 | sim (`ClienteListagemIT:298`) | **não** | **não** |
| `q` com 101 espaços → 400 | sim (`ClienteControllerTest:146`) | **não** | **não** |
| `page=2147483647` (O3) → 200 vazio com total real | sim (`ClienteListagemIT:264`) | sim (`ServicoListagemIT:179`) | sim (`PecaListagemIT:153`) |
| Página além do fim → 200 vazio | sim (`ClienteListagemIT:247`) | sim (`ServicoListagemIT:167`) | sim (`PecaListagemIT:148`) |

## Fatores de decisão

* F1. Nada quebra para quem já consome o envelope: a F35 (`itens`, `totalItens`) e os testes da F03a na `main`. Medida: diff vazio em `PaginaResponse.java` e nos testes da F03a.
* F2. O contrato fica num lugar só: ADR ou PRD de listagem nova cita este ADR em vez de repetir os limites. Medida: revisão do PRD e do ADR da F31.
* F3. O critério de aceite se lê sem interpretação: o CRIVO tem uma tabela fixa de correspondência de nomes. Medida: nenhuma discussão sobre nome de campo no QA da F17.
* F4. A prova é a mesma em toda listagem, com a mesma lista de casos de limite em cada endpoint. Medida: a matriz da Confirmação, sem célula vazia nas listagens novas.
* F5. Custo: nenhuma linha de código de produção e nenhuma dependência nova.

## Opções consideradas

* A. Manter como está: o contrato continua dentro do ADR-017, e cada ADR de listagem resolve a correspondência de nomes num parágrafo próprio, como o ADR-034 fez.
* B. Consolidar o contrato que já vale num ADR transversal, com tabela de correspondência para os nomes do Spring, casos de teste obrigatórios e registro das divergências. F03a e F05a não mudam.
* C. Trocar o envelope para os nomes do Spring (`content`, `page`, `size`, `totalElements`, `totalPages`) em todas as listagens, com record próprio ou com o `PagedModel` do Spring Data, para casar com o texto dos PRDs.
* D. Devolver os dois conjuntos de nomes no mesmo JSON durante uma transição.

## Resultado da decisão

Opção escolhida: "B", porque é a única que atende os cinco fatores. A falha em F2 e F4: a F17 já mostra o custo, com cobertura que diverge sem ninguém perceber e nomes resolvidos caso a caso. C falha em F1 e F5: quebra a F35 e os testes de quatro listagens, e altera F03a e F05a. D falha em F2 e F3: dois nomes para o mesmo dado, e ninguém remove o alias depois.

### Contrato normativo de paginação

Vale para todo `GET` de coleção da API (`/api/v1/clientes`, `/servicos`, `/pecas`, `/ordens-servico` e as próximas, como F31).

| Parâmetro | Tipo | Padrão | Faixa aceita | Fora da faixa |
|---|---|---|---|---|
| `page` | inteiro, base 0 | 0 | 0 a 2.147.483.647 | 400, inclusive `page=-1`, `page=abc` e `page=2147483648` |
| `size` | inteiro | 20 | 1 a 100 | 400, inclusive `size=0`, `size=101` e `size=abc`. Nunca é corrigido em silêncio |

Regras:

1. O controller recebe `page` e `size` como `@RequestParam int` com `defaultValue` e com `@Min` e `@Max` exatamente como na tabela. Nunca recebe `Pageable` nem usa `@Validated` na classe (ADR-017).
2. O cliente não manda `sort`. A ordem é fixa por recurso, decidida no ADR do recurso, e sempre termina em `id`, no mesmo sentido do primeiro critério, para a página ser estável. Parâmetro desconhecido é ignorado.
3. O service monta a página só por `Paginacao.paginar` (ADR-032), que aplica a guarda O3 do ADR-017.
4. Página além do fim responde 200 com `itens` vazio e os totais reais, nunca 404.
5. Base vazia ou filtro sem resultado responde 200 com `itens: []`, `totalItens: 0` e `totalPaginas: 0`.
6. O corpo 200 é `PaginaResponse<T>` (pacote `dto`), com exatamente cinco campos:

| Campo | Tipo JSON | Significado |
|---|---|---|
| `itens` | lista, nunca `null` | itens da página, no DTO de lista do recurso |
| `pagina` | inteiro | o `page` pedido |
| `tamanho` | inteiro | o `size` pedido, não a quantidade devolvida |
| `totalItens` | inteiro (`long`) | total que casa com o filtro |
| `totalPaginas` | inteiro | `ceil(totalItens / tamanho)`, ou 0 quando não há itens |

7. Erros no formato do ADR-011 (`timestamp`, `status`, `erro`, `mensagem`, `path`). O 400 vem dos handlers do ADR-017, com `Parametro invalido: <nome>` e sem o valor rejeitado. O 401 vem do entry point de segurança. O 500 tem mensagem fixa.
8. Filtro próprio do recurso (`ativo` em serviços, `status` em OS) é permitido. Ele é tipado, responde 400 por `MethodArgumentTypeMismatchException` e é decidido no ADR do recurso. Nada disso muda as regras 1 a 7.
9. O termo `q` segue o ADR-017 (até 100 caracteres sobre o valor bruto, literal, `ESCAPE '!'`). Ele está aqui só porque entra na lista de casos de teste.

### Correspondência de nomes para PRD, critério e QA

Quando um PRD, briefing ou critério usar os nomes do Spring, vale esta leitura. O texto não precisa ser reescrito para o QA andar.

| Texto do PRD (estilo Spring) | Campo do contrato |
|---|---|
| `content` | `itens` |
| `number`, ou `page` na resposta | `pagina` |
| `size` na resposta | `tamanho` |
| `totalElements` | `totalItens` |
| `totalPages` | `totalPaginas` |
| `numberOfElements` | não existe; é o tamanho de `itens` |

Os parâmetros de entrada `page` e `size` mantêm o nome. PRD novo (F31 em diante) escreve com os nomes do contrato.

### Casos de teste obrigatórios por listagem

Cada endpoint de listagem prova, em IT com Testcontainers ou em teste de controller:

| Id | Caso | Esperado |
|---|---|---|
| P1 | sem parâmetro, com mais de 20 linhas | 200, 20 itens na ordem do recurso, `tamanho` 20 |
| P2 | `page=1` | o restante, sem repetir item da página 0 |
| P3 | página além do fim | 200, `itens` vazio, totais reais |
| P4 | base vazia | 200, `itens` vazio, `totalItens` 0, `totalPaginas` 0 |
| P5 | `size=0`, `size=101`, `size=abc` | 400 |
| P6 | `page=-1`, `page=abc`, `page=2147483648` | 400 |
| P7 | `page=2147483647&size=100` | 200, `itens` vazio, `totalItens` real |
| P8 | corpo de todo 400 de P5, P6 e P9 | formato do ADR-011, sem o valor rejeitado |
| P9 | `q` com 101 caracteres e `q` com 101 espaços | 400 |
| P10 | sem token e com token inválido | 401, sem itens |
| P11 | chaves de cada item | exatamente as do DTO de lista do recurso |

### Divergências registradas (F03a e F05a não mudam por este ADR)

* **DV1, documental (F17).** A premissa 1 e os critérios 2, 4 e 5 usam `content` e `totalElements`, e a premissa 1 diz que a F03a não foi entregue. Tratamento: vale a tabela de correspondência, e o CRIVO lê os critérios por ela. Corrigir o texto da F17 fica com a BUSSOLA e não bloqueia nada. Se o texto da F05a também usa esses nomes, **não foi verificado**, porque o PRD da F05a não está gravado no repositório.
* **DV2, implementação (F03a na `main` × F05a no ramo).** O contrato é idêntico, mas a guarda O3 vive em dois lugares até o merge da F05a: métodos privados do `ClienteService` na `main` e `Paginacao` no ramo, onde o commit 57bca0d também altera o `ClienteService` da F03a. Consequência para a F17: o código depende de `Paginacao`, então a F17 depende da F05a (pelo menos do 57bca0d). O panorama não mostra isso, porque lá a F17 depende só de F00 e F02. A tarefa 1 da F17 ("branch a partir da main atualizada") só fica cumprível depois do merge da F05a. Fica com o PRUMO e o REGENTE.
* **DV3, cobertura (F05a).** Faltam os casos `page=abc`, `page=2147483648` e `q` com 101 espaços (P6 e P9). As anotações do `ServicoController` são as mesmas do `ClienteController`, então o comportamento esperado é o mesmo, mas ele não está provado para `/servicos`. A F05a não muda aqui. Fica para o CRIVO, na revisão da F05a, decidir se pede esses casos.
* **DV4, cobertura (F17).** Faltam `size=abc`, `page=abc`, `page=2147483648` e `q` com 101 espaços (P5, P6 e P9). Esta é a própria F17: o ESPRESSO acrescenta os casos ao `PecaListagemIT`.
* **Não são divergências:** `ativo` (F05a) e `status` (F06a) seguem a regra 8, e a ordem decrescente da OS segue a regra 2.

### Dado pessoal e ameaças

O envelope não carrega dado pessoal. Os itens podem carregar, como nome, telefone e e-mail em clientes, e seguem a política e o ADR de cada recurso. Este ADR não abre finalidade, base legal nem prazo de retenção novos.

| Ameaça (STRIDE) | Onde | Mitigação | Verificação |
|---|---|---|---|
| Tampering | `sort` livre virando nome de coluna | não existe `sort` vindo do cliente (regra 2) | `git grep` da Confirmação |
| Information disclosure | `totalItens` revela o tamanho da base | só para usuário autenticado; o mesmo risco A3 já aceito no ADR-017 | P10 |
| Information disclosure | valor rejeitado ecoado no 400 | mensagem só com o nome do parâmetro (ADR-017) | P8 |
| Denial of service | `size` grande; `page` gigante | `size` até 100 com 400; guarda O3 sem consulta de itens | P5, P7 |

### Consequências

* Bom, porque o contrato de página tem um lugar só, e a F31 e as próximas listagens citam este ADR em vez de copiar a tabela.
* Bom, porque nenhuma linha de código muda: F35, F03a e F05a seguem como estão (F1, F5).
* Bom, porque o QA passa a ter uma lista fechada de casos (P1 a P11), e as lacunas DV3 e DV4 ficam visíveis em vez de escondidas.
* Ruim, porque ADR-017, ADR-032 e este ADR se sobrepõem nos valores de página. Quem mudar um tem de mudar os três, ou substituir este por um ADR novo.
* Ruim, porque os nomes em português (`itens`, `totalItens`) não são os que um dev acostumado ao Spring espera, e o PRD da F17 continua com os nomes do Spring até a BUSSOLA mexer.
* Ruim, porque o DV2 deixa a ordem de merge rígida: F05a antes de F17 e de F06a.
* Neutro, porque o ADR-017 continua normativo para busca (termo, collation, escape, telefone). Este ADR só trata de página.

### Risco residual

* Até o merge da F05a existem duas implementações da guarda O3, uma na `main` e uma no ramo. Uma correção feita numa não vale para a outra.
* O DV3 não está provado: `page=abc` e `page=2147483648` em `/servicos` devem dar 400 pelas mesmas anotações, mas isso é inferência, não teste.
* Se o ADR-017 mudar algum valor de página antes do próprio aceite (ele está como proposto), este ADR fica desalinhado. Mitigação: a revisão do CARTOGRAFO no ADR-017 confere este aqui.
* A dúvida 1 da F17 (20 por página serve?) está aberta com a BUSSOLA. Se a resposta mudar o padrão, mudam o `defaultValue` de todos os controllers e este ADR, por ADR novo depois do aceite.

### Confirmação

* Revisão de PR, com `git grep` a partir da pasta da operação (`C` = `apps/api/src/main/java/br/com/mecanicasaojorge/api`):
  * `git grep -n "Pageable " -- $C/controller` volta vazio;
  * `git grep -c 'defaultValue = "20"' -- $C/controller` e `git grep -c "@Max(100)" -- $C/controller` dão o mesmo número, igual ao de endpoints de listagem;
  * `git grep -n "Integer.MAX_VALUE" -- $C/service` acha só `Paginacao` depois do merge da F05a;
  * `git grep -n "spring.data.web.pageable" -- apps/api` volta vazio;
  * o PR que trouxer listagem nova não altera `$C/dto/PaginaResponse.java`.
* Testes: a matriz P1 a P11 por endpoint, marcada pelo CRIVO no relatório de QA de cada listagem. Na F17, o DV4 fecha com os casos novos no `PecaListagemIT`.
* Revisão do CARTOGRAFO no PRD e no ADR da F31 contra este contrato.

## Prós e contras das opções

### A. Manter como está

* Bom, porque não custa nada agora, e o ADR-034 já resolveu a F17 numa linha.
* Neutro, porque o contrato em si continua certo e igual nas quatro listagens.
* Ruim, porque cada listagem nova volta a discutir nomes e limites (falha F2), e sem lista fechada de casos a cobertura já divergiu (DV3 e DV4, falha F4).
* Custo do descarte: nenhum, além de um ADR a mais para ler.

### B. ADR transversal sobre o contrato vigente (escolhida)

* Bom, porque atende F1 a F5 sem tocar em código, e transforma a divergência de cobertura em item de QA verificável.
* Neutro, porque não decide valor novo: repete o ADR-017 e o ADR-032.
* Ruim, porque sobrepõe três ADRs nos mesmos números, e a seção de divergências envelhece quando F05a e F17 entrarem na `main` (DV2 e DV4 deixam de existir).

### C. Trocar o envelope para os nomes do Spring

* Bom, porque casa com o texto dos PRDs e com o vocabulário que todo dev de Spring conhece.
* Ruim, porque quebra a F35 (três commits de serviço, hook e tela que leem `itens` e `totalItens`), os testes de quatro listagens (`jsonPath("$.itens...")`), `docs/api` e o documento recebido pela F42. Falha F1 e F5, e altera F03a e F05a, o que a instrução desta etapa proíbe.
* Ruim, porque com o `PagedModel` do Spring Data o formato não sai plano: pelo que conheço, ele aninha os totais num objeto `page`. Isso **não foi verificado** nesta etapa, e de qualquer jeito também não casa com o texto da F17.
* Custo do descarte: manter nomes em português que um dev Spring novo estranha. A tabela de correspondência resolve isso.

### D. Devolver os dois conjuntos de nomes

* Bom, porque nenhum consumidor quebra na transição.
* Ruim, porque o JSON e o schema do springdoc ganham dez campos para cinco dados, o critério de aceite fica ambíguo (qual dos dois o CRIVO confere?) e nenhuma feature tem dono para remover o alias depois. Falha F2 e F3.
* Custo do descarte: nenhum.

## Mais informações

* Pendências: DV1 com a BUSSOLA (texto da F17), DV2 com o PRUMO e o REGENTE (dependência F17 → F05a e ordem de merge), DV3 com o CRIVO (revisão da F05a) e DV4 com o ESPRESSO (F17).
* Revisitar quando alguma tela pedir ordenação escolhida pelo usuário (`sort` com lista fechada de campos), quando o volume de uma tabela pedir paginação por cursor, ou quando a dúvida 1 da F17 for respondida.
* Quando F05a e F17 entrarem na `main`, DV2 e DV4 fecham. Como este ADR estará aceito e imutável nesse ponto, o fechamento é registrado só no `overview.md`.
* Pela regra da casa, nenhuma listagem nova depois da F17 começa com este ADR em `proposto`. A F17 já tem código escrito antes do aceite dos ADR-034 a 036, o mesmo registro honesto que o ADR-017 fez na F03a.
