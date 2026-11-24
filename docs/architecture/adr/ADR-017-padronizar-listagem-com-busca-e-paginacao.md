---
status: proposto
date: 2026-11-14
decision-makers: [CARTOGRAFO (Arquiteto), pessoa dona do produto (aceite)]
consulted: [VIGIA (AppSec/LGPD)]
informed: [REGENTE, BUSSOLA, ESPRESSO, CRIVO, ORLA, PERGAMINHO, ANCORA]
---

# Padronizar a listagem com busca: termo literal, collation ai_ci fixada por migration e página própria

Histórico de status:

* 2026-11-14: proposto (F03a, etapa do CARTOGRAFO), commit 9213152. Entrou na `main` pela PR #15.
* 2026-11-17: revisão 1, ainda proposto. Decide o charset da sessão (eixo 4) com evidência contra o Connector/J real e contra servidor em `latin1`, fecha os casos de borda do contrato (`q` só de espaços acima de 100, `qLen`, `tamanho`), alinha o escape ao achado A2 da política e corrige a dependência de merge do PR #13 para o PR #14. Pronto para o aceite da pessoa. Pela regra da casa, o código da F03a só começa depois do aceite.
* 2026-11-17: revisão 2, ainda proposto. Vem depois do QA do CRIVO e da revisão humana de 17/11 (14:27). Fecha com o VIGIA a divergência da barra invertida com o achado A2 da política. Registra a regra final de extração de dígitos do termo (eixo 5, decisão D4 da BUSSOLA). Decide o caso de `page` cujo deslocamento passa de 2.147.483.647 (eixo 6). Acrescenta ao contrato os erros 404 e 405. Troca `trim` por `strip`, que é o que o código faz. Registro honesto: o código da F03a já foi escrito no ramo `feat/f03a-clientes-listar` antes do aceite deste ADR; as correções da revisão 2 seguem a regra da casa e esperam o aceite da pessoa.

Vínculos: F03a (US-CLI-01 a US-CLI-08, mais US-CLI-01b, US-CLI-01c, US-CLI-03c, US-CLI-05a, US-CLI-05b e US-CLI-05c, da revisão da BUSSOLA de 17/11), consumida pela F35. O mesmo contrato vale para as próximas listagens com busca: F05 (serviços), F17 (peças), F06 (OS) e F31 (financeiro). Elas herdam o limite de página, a guarda de deslocamento e os erros 404 e 405; a regra de telefone do eixo 5 é só de clientes. Complementa o ADR-003 (migrations aditivas), o ADR-007 (DTO e nomes), o ADR-009 (configuração por variável de ambiente), o ADR-011 (handler global) e o ADR-013 (Flyway como fonte do schema). Atende os achados A1, A2, A7 e A8 e as seções 6.3 e 7 de `docs/security/politica-dados-pessoais-cliente.md` (revisão 1 na PR #17). Atende também os pontos A1, A2 e A3 da revisão humana de 17/11, chamados aqui de RH-A1 (página), RH-A2 (termo misto) e RH-A3 (404 e 405), para não confundir com os achados da política.

## Contexto e problema

A F03a abre o primeiro endpoint de listagem com busca, e mais quatro listagens vão seguir o mesmo modelo. Cinco pontos ainda não estão decididos no código:

1. Busca sem acento e sem caixa: hoje depende da collation padrão do servidor, porque a V2 não fixa `CHARACTER SET` nem `COLLATE` (A7).
2. Termo como texto literal: `%`, `_` e `\` viram curinga ou escape do `LIKE` se não forem tratados (A2).
3. Limites de página: o `Pageable` do Spring corrige `size` grande em silêncio, e o handler global transforma erro de parâmetro em 500 (A1). O critério US-CLI-03a pede 400.
4. Formato JSON da página, que é o contrato da F35.
5. Charset da sessão: em 2026-11-14 o cliente `mysql` do contêiner abriu a sessão em `latin1` e gravou acento com dupla codificação. Faltava saber se a aplicação corre o mesmo risco e se um servidor com padrão `latin1` muda o resultado da busca.

Na revisão 2, o QA de 17/11 achou mais três pontos no código já escrito:

6. Termo misto: `zeta5@example.org` devolveu 20 de 26 clientes, porque o `5` casou o telefone pela regra "pelo menos um dígito" (RH-A2).
7. `page=21474837` com `size=100` devolveu 500, enquanto `page=21474836` devolveu 200 (RH-A1).
8. Rota inexistente (404) e método não suportado (405) viram 500 no handler global (RH-A3).

Como fixar esse contrato para que a busca dê o mesmo resultado em teste, local e produção, e para que as próximas listagens não precisem reinventá-lo?

## Evidência

### 2026-11-14 (proposta original)

* Base compila: ramo `feat/f03a-clientes-listar` (`origin/main` 11f35b3 mais o commit 2488c75), compilado no contêiner `maven` fixado no `apps/api/Dockerfile` (Temurin 21.0.7). `mvn -B clean test-compile` terminou com BUILD SUCCESS. Os testes não foram rodados nessa etapa.
* `mysql:8.4` vazio (8.4.13): `@@collation_server` e `@@collation_database` são `utf8mb4_0900_ai_ci`, e a tabela `clientes` criada com o DDL da V2 herda essa collation nas colunas `nome`, `telefone` e `email`.
* Sem escape, `%` e `_` casaram 4 de 4 linhas. Com `ESCAPE` usando `!`, cada um casou só a linha que o contém. Barra invertida com parâmetro ligado (`PREPARE`/`EXECUTE`): com `ESCAPE` usando `!` o padrão `%a\I%` achou `Barra\Invertida`; sem a cláusula `ESCAPE`, não achou.

### 2026-11-17 (revisão 1)

Executado pelo CARTOGRAFO com contêineres `mysql:8.4` descartáveis e o driver real: `mysql-connector-j` 9.7.0, a versão gerenciada pelo Spring Boot 4.1.2 (alvo do PR #14), em Temurin 21.0.7 na imagem `maven` fixada no `apps/api/Dockerfile`. O programa de prova inseriu e buscou por `PreparedStatement`, o mesmo caminho de bind usado pelo Hibernate, com URL sem nenhum parâmetro de charset (`jdbc:mysql://host:3306/msj`). A pilha Hikari + Hibernate não foi exercitada; quem prova esse trecho é o teste de integração da F03a.

| Cenário | Sessão aberta pelo driver | Colunas de `clientes` | Resultado |
|---|---|---|---|
| Servidor padrão, DDL da V2 | `utf8mb4` / `utf8mb4_0900_ai_ci` | `utf8mb4_0900_ai_ci` | 12 de 12 buscas como esperado; `José` gravado com bytes `C3A9` no `é` (UTF-8 correto) |
| Servidor padrão, V2 + V3 | igual | igual | igual: a V3 é no-op lógico |
| Servidor com `--character-set-server=latin1`, DDL da V2 | `utf8mb4` / `utf8mb4_0900_ai_ci` | `latin1_swedish_ci` | as 12 buscas passaram, mas nome com emoji falhou com `Incorrect string value`; em comparação direta, `Müller` difere de `muller` e `Ö` difere de `o` na collation sueca |
| Servidor `latin1`, V2 + V3 | igual | `utf8mb4_0900_ai_ci` | 12 de 12 buscas; nome com emoji gravado |

Buscas do roteiro: `jose antonio`, `ana`, `pecas`, `PEÇAS`, `%`, `_`, `\`, `uau!`, `alvaro`, `(11) 98765`, `4444` e `José` escrito com acento combinante (U+0301) e normalizado em NFC. `%` casou só `100% Peças`; `_` casou só o email que tem `_`; `\` casou só `Barra\Invertida`; `ana` não consultou telefone; `alvaro` trouxe `Álvaro` e `Alvaro`, empatados na collation e desempatados por `id`. Em `utf8mb4_0900_ai_ci`, `Müller` casa `muller` e `Ö` é igual a `o`.

Conversão com dado já gravado: no servidor `latin1`, `José Antônio` e `Müller` foram inseridos por uma sessão `utf8mb4` na tabela ainda em `latin1_swedish_ci` (bytes `E9`, `F4` e `FC`), e só depois a V3 rodou. As colunas passaram para `utf8mb4_0900_ai_ci`, os bytes viraram `C3A9`, `C3B4` e `C3BC` (UTF-8 correto, sem perda), e `muller` passou de 0 para 1 resultado.

Origem do `latin1`: o cliente `mysql` dentro do contêiner, com `LANG` vazio, abre a sessão em `latin1` (`character_set_client`, `connection` e `results`), mesmo com o servidor em `utf8mb4`. Com `--default-character-set=utf8mb4`, ou com `LANG=C.UTF-8` no `docker exec` ou no ambiente do contêiner, abre em `utf8mb4`. Com `LANG=C.UTF-8` no ambiente do contêiner, o servidor continua em `utf8mb4_0900_ai_ci`.

Dano provado: `Joséfa` inserido pela sessão `latin1` ficou gravado com bytes `C383C2A9` no lugar do `é` (dupla codificação). Ele aparece certo para a própria sessão `latin1`, mas uma sessão `utf8mb4` buscando `josefa` não encontra nada.

Conclusão: o `latin1` vem do cliente de linha de comando, não do servidor nem do driver da aplicação. O risco real é um script manual (seed, correção de cadastro ou a anonimização da seção 4 da política) gravar dado que a busca depois não acha, e a V3 não corrige dado que já entrou com dupla codificação.

### 2026-11-17 (revisão 2)

Executado pelo CARTOGRAFO lendo o código do ramo `feat/f03a-clientes-listar` (5711f49) e o bytecode das bibliotecas empacotadas no `api.jar` da imagem local `qa-f41-api:r8` (`spring-data-jpa-4.1.0`, `spring-data-commons-4.1.0`, `spring-webmvc-7.0.8`, `spring-web-7.0.8`, `hibernate-core-7.4.1.Final`), com `javap` do `eclipse-temurin:21-jdk`. Nenhum teste foi rodado nesta etapa.

* Causa do 500 de RH-A1, confirmada no bytecode. `AbstractPageRequest.getOffset()` multiplica `page` por `size` em `long` (`i2l`, `i2l`, `lmul`), então não há estouro de `int` na conta. O 500 vem de `org.springframework.data.jpa.support.PageableUtils.getOffsetAsInteger`, que lança `InvalidDataAccessApiUsageException` ("Page offset exceeds Integer.MAX_VALUE (2147483647)") quando o deslocamento passa de 2.147.483.647, porque o JPA recebe o primeiro resultado como `int`. O handler cai em `Exception` e responde 500. A conta bate com o limiar do QA: 21.474.836 × 100 = 2.147.483.600 passa, e 21.474.837 × 100 = 2.147.483.700 falha. A mesma checagem no `spring-data-jpa` gerenciado pelo Boot 4.1.2 (PR #14) **não foi lida**; o teste de regressão prova na versão que estiver no ramo.
* Causa de RH-A2, confirmada no código: `TermoBusca.padraoTelefone` junta todo dígito ASCII do termo e consulta o telefone se sobrar pelo menos um.
* RH-A3: `NoResourceFoundException`, `HttpRequestMethodNotSupportedException` e `HttpMediaTypeException` (mãe das exceções de 406 e 415) implementam `org.springframework.web.ErrorResponse`, que carrega o status HTTP. `HttpMessageNotReadableException` (JSON malformado) não implementa. `NoHandlerFoundException` não foi lida. O `GlobalExceptionHandler` só tem handlers para 400, para o 401 de login, para 422 e para `Exception`, então todas essas exceções caem em 500.
* Barra invertida: o código já segue a revisão 1, porque `TermoBusca.escapar` não mexe em `\`. O `ClienteListagemIT` afirma que `q=\` traz só `Barra\Invertida` (lido, não rodado nesta etapa). A divergência era só de texto entre este ADR e o A2 da política. Em 2026-11-17 o VIGIA concordou com a regra da seção "Termo literal e o achado A2" e vai aplicar a mudança do A2 na PR #17.

## Fatores de decisão

* F1. A busca dá o mesmo resultado em Testcontainers, docker-compose e produção, sem depender do padrão implícito do servidor.
* F2. Termo hostil não amplia o resultado: `%`, `_`, `\` e `!` são literais, e o termo nunca é concatenado em SQL ou JPQL.
* F3. Entrada inválida (`size` 0, `size` acima de 100, `page` negativa, `page` não numérica, `q` com mais de 100 caracteres) responde 400 no formato do ADR-011. Nunca há correção silenciosa nem 500.
* F4. O JSON da página é explícito e estável para a F35, sem acoplar ao formato interno do Spring Data.
* F5. Custo: nenhuma dependência nova, nenhum cache, nenhum índice dedicado (premissa P2) e no máximo uma migration pequena e uma linha de configuração.
* F6. O contrato é reaproveitável sem mudança por F05, F17, F06 e F31.
* F7. Dado gravado por qualquer caminho de escrita previsto (aplicação, Flyway, script manual de ADMIN) fica em UTF-8 correto e é encontrado pela busca.
* F8. Termo que não é número de telefone não consulta o telefone: `zeta5@example.org` devolve só o cliente com esse email (US-CLI-01b).
* F9. Todo `page` aceito pelo contrato (0 a 2.147.483.647) responde 200 e nunca 500, com `totalItens` real (US-CLI-03c).
* F10. Erro do próprio Spring MVC (rota inexistente, método não suportado) sai com o status certo no formato do ADR-011, sem eco da query string.

## Opções consideradas

São seis eixos independentes; os eixos 5 e 6 entraram na revisão 2. Cada um tem a opção de manter como está.

Eixo 1, insensibilidade a acento e caixa:

* C1. Manter como está: confiar no padrão do servidor e só documentar.
* C2. Fixar a collation das colunas buscadas por migration aditiva (V3) e afirmá-la no teste de integração.
* C3. Coluna sombra normalizada em Java (`nome_busca` e afins), mantida pela aplicação a cada escrita.
* C4. `COLLATE` explícito dentro da consulta.

Eixo 2, termo como texto literal:

* E1. Manter o escape padrão do MySQL (`\`), escapando `\`, `%` e `_` no service.
* E2. Usar `!` como caractere de escape, com cláusula `ESCAPE` explícita em toda consulta e `!`, `%` e `_` escapados no service.
* E3. Trocar `LIKE` por `LOCATE`/`INSTR`, que não têm curinga.

Eixo 3, paginação e formato:

* P1. Manter o padrão do Spring: `Pageable` como argumento do controller e `Page` serializado direto.
* P2. Parâmetros `page` e `size` explícitos, validados por Bean Validation, e um DTO próprio `PaginaResponse<T>`.

Eixo 4, charset da sessão com o banco:

* K1. Manter como está: confiar no padrão do driver, sem afirmação em teste e sem regra para o cliente de linha de comando.
* K2. Confiar no padrão do Connector/J, afirmar a sessão `utf8mb4` no teste de integração e fechar o caminho do cliente `mysql` (`LANG=C.UTF-8` no serviço do docker-compose e `--default-character-set=utf8mb4` obrigatório em script manual).
* K3. Fixar `characterEncoding=UTF-8` e `connectionCollation` na URL ou em `spring.datasource.hikari.data-source-properties`.
* K4. Fixar o charset do servidor (`--character-set-server=utf8mb4`) no docker-compose e exigir o mesmo do banco de produção.

Eixo 5, quando consultar o telefone (revisão 2):

* T1. Manter como está: consultar o telefone sempre que o termo tiver pelo menos um dígito ASCII.
* T2. Consultar o telefone só quando o termo for numérico: todo caractere é dígito ASCII ou símbolo de máscara de uma lista fechada, com pelo menos um dígito.
* T3. Consultar o telefone com qualquer termo, mas só quando ele tiver pelo menos N dígitos (por exemplo 4).

Eixo 6, `page` com deslocamento acima de 2.147.483.647 (revisão 2):

* O1. Manter como está: 500 pela `InvalidDataAccessApiUsageException`.
* O2. Limitar `page` no controller (`@Max` calculado por `size`, ou um teto fixo) e responder 400.
* O3. No service, quando `(long) page * size` passar de `Integer.MAX_VALUE`, não buscar itens e responder a página vazia com o total real, obtido só por contagem.
* O4. Tratar `InvalidDataAccessApiUsageException` no handler global.

## Resultado da decisão

Opções escolhidas: **C2 + E2 + P2 + K2** (revisão 1) e **T2 + O3** (revisão 2).

* C2, porque atende F1 em qualquer servidor com o menor custo entre as opções que atendem (F5). A evidência de 2026-11-17 mostra que, num servidor `latin1`, a V3 leva as colunas para `utf8mb4_0900_ai_ci` e a busca passa a ignorar acento nos casos em que a collation sueca não ignora. C1 falha em F1 sem que nenhum teste perceba; C3 e C4 custam mais e se reaproveitam pior (F5, F6).
* E2, porque `!` não tem significado especial em literal Java, em JPQL nem no MySQL, enquanto `\` é escape em literal Java e no MySQL, e no MySQL o efeito muda com o `sql_mode` `NO_BACKSLASH_ESCAPES`. Provado com parâmetro ligado em 2026-11-14 e de novo pelo Connector/J em 2026-11-17 (F2).
* P2, porque é a única que devolve 400 para `size` acima de 100 (F3) e mantém o JSON sob controle (F4).
* K2, porque o driver já abre a sessão em `utf8mb4`, inclusive com servidor `latin1` (evidência de 2026-11-17). A única origem de dupla codificação observada é o cliente de linha de comando, e ela se fecha com uma linha no docker-compose e uma regra de operação (F7, F5). A afirmação no teste de integração pega troca de driver ou de padrão.
* T2, porque é a única que atende F8 sem perder a busca por pedaço de número: `zeta5@example.org`, `rua 7` e `5a` deixam de consultar o telefone, e `987` ou `(11) 98765` continuam casando. T1 falha em F8 (o QA mediu 20 de 26). T3 ainda casa `rua 1234` com telefone e impede achar telefone por 3 dígitos. É a decisão D4 da BUSSOLA, registrada aqui.
* O3, porque é a única que atende F9 sem mudar o contrato "página além do fim devolve 200" (premissa P9 da BUSSOLA) e sem consulta nova no repository. O2 transforma em 400 um pedido que o contrato diz ser 200. O1 falha em F9. O4 teria de decidir no handler, sem a página e o total, o que responder, e esconderia outros usos indevidos da mesma exceção.

### Contrato normativo (F03a, modelo para as próximas listagens)

Endpoint: `GET /api/v1/clientes`, autenticado por JWT (fora de `PUBLIC_PATHS`).

| Parâmetro | Tipo | Padrão | Regra | Inválido |
|---|---|---|---|---|
| `q` | texto | ausente | `@Size(max = 100)` sobre o valor bruto recebido; ausente, vazio ou só espaços lista sem filtro | 400 |
| `page` | inteiro, base 0 | 0 | `@Min(0)`, de 0 a 2.147.483.647 (`int`). Página além do fim devolve 200 com `itens` vazio, inclusive com deslocamento acima de 2.147.483.647 (regra O3) | 400, inclusive `page=abc` e `page=2147483648` |
| `size` | inteiro | 20 | `@Min(1) @Max(100)` | 400, inclusive `size=abc`; nunca corrigido em silêncio |

Casos de borda fechados na revisão 1:

* O limite de `q` conta `String.length()` (unidades UTF-16, como faz o `@Size` do Hibernate Validator) do valor bruto, antes do `strip`. A validação vem antes da normalização: `q` com 101 espaços responde 400, e `q` com até 100 espaços lista sem filtro. Um emoji conta 2.
* O controller não recebe `Pageable`. Ele recebe os três parâmetros com as anotações acima, sem `@Validated` na classe, e repassa ao service, que monta o `PageRequest`. Não há parâmetro `sort` nesta fatia, e parâmetro desconhecido é ignorado.

Normalização do termo, no service, numa função pura com teste unitário (`TermoBusca` no código atual). Regra final da revisão 2:

1. `String.strip()`. Se ficar vazio, a consulta é sem filtro. `strip` remove espaço em branco Unicode segundo `Character.isWhitespace`, que não inclui o espaço não separável U+00A0. A revisão 1 dizia `trim`; vale `strip`, que é o que o código faz.
2. `java.text.Normalizer` em NFC, para que acento composto por dois code points (alguns teclados) compare igual ao acento de um code point. Provado com `Jose` + U+0301 em 2026-11-17.
3. Padrão de texto, aplicado a nome e email com qualquer termo, inclusive o numérico: `"%" + escapar(termo) + "%"`. `escapar` troca, nesta ordem, `!` por `!!`, `%` por `!%` e `_` por `!_`. A ordem importa: `!` vem primeiro para não ser escapado duas vezes.
4. A barra invertida não é escapada (ver "Termo literal e o achado A2", abaixo).
5. Padrão de telefone. Regra final da extração de dígitos (eixo 5, opção T2):
   * O termo é **numérico** quando, depois dos passos 1 e 2, todo caractere pertence a esta lista fechada: dígitos ASCII `0` a `9`, `(`, `)`, `-`, `.`, `+`, espaço U+0020 e espaço não separável U+00A0. Além disso, precisa haver pelo menos um dígito ASCII.
   * Termo numérico: os dígitos ASCII são extraídos na ordem em que aparecem, e o resto é descartado. O padrão é `"%" + digitos + "%"`. Não há escape, porque só sobram dígitos.
   * Termo não numérico: o padrão de telefone é `null`, e o telefone não é consultado.
   * Ficam fora da lista, e por isso tornam o termo não numérico: letras, `@`, `/`, `#`, `*`, tabulação, quebra de linha, `%`, `_`, `!`, `\` e dígitos fora do ASCII. Isso inclui os arábico-índicos, como U+0665, e os de largura total, como U+FF11, que o NFC não converte.
   * Não há tamanho mínimo: `5` é numérico e casa todo telefone que tem `5`. Quem digita só número está procurando número.
   * Exemplos normativos, que viram teste unitário:

| Termo (depois do `strip`) | Numérico? | Padrão de telefone |
|---|---|---|
| `11987654321` | sim | `%11987654321%` |
| `(11) 98765-4321` | sim | `%11987654321%` |
| `11.98765.4321` | sim | `%11987654321%` |
| `+11 98765-4321` | sim | `%11987654321%` |
| `987` | sim | `%987%` |
| `11`, U+00A0, `9876` | sim | `%119876%` |
| `+55 11 98765-4321` | sim | `%5511987654321%`, que não casa o telefone gravado com 11 dígitos (limitação D6) |
| `zeta5@example.org` | não | `null` |
| `rua 7`, `5a`, `ana`, `%`, `_` | não | `null` |
| `()-`, `+`, `.` | não (sem dígito) | `null` |
| `٥٥٥` (U+0665) | não | `null` |
| `11/98765` | não | `null` |

6. `qLen` da linha de log (seção 6.3 da política) é o `length()` do termo depois dos passos 1 e 2, antes do escape. Sem termo, é 0. O termo em si nunca vai para o log.

Consulta no `ClienteRepository`, em JPQL com parâmetros nomeados e nunca concatenados:

```sql
select c from Cliente c
where c.nome like :texto escape '!'
   or c.email like :texto escape '!'
   or (:telefone is not null and c.telefone like :telefone escape '!')
```

Sem termo, a consulta é o `findAll(Pageable)` herdado. Nenhuma consulta usa `lower()` ou `upper()`: a insensibilidade vem só da collation. Assim, uma regressão de collation quebra o teste de integração em vez de ficar escondida.

Ordenação: `PageRequest.of(page, size, Sort.by(Sort.Order.asc("nome"), Sort.Order.asc("id")))`. A ordem segue a collation, então `Álvaro` e `Alvaro` empatam no nome e são desempatados pelo `id`.

Deslocamento acima de 2.147.483.647 (eixo 6, opção O3):

* No service, antes de consultar: se `(long) page * size > Integer.MAX_VALUE`, não se pede a página ao repository. O limiar é o mesmo do `PageableUtils.getOffsetAsInteger` do Spring Data JPA.
* O total vem da mesma consulta da busca, chamada com `PageRequest.of(0, 1, ordem)`: `findAll` sem termo e `buscar` com termo. O `getTotalElements()` dessa chamada é o `totalItens`. Não entra consulta nova no repository, e a regra de filtro continua num lugar só.
* A resposta é a página vazia no mesmo `PaginaResponse`, com `pagina` e `tamanho` pedidos, `totalItens` real e `totalPaginas` calculado a partir do total e do `size`. A forma de montar fica com o ESPRESSO, desde que o teste da US-CLI-03c passe. Uma possibilidade é passar `new PageImpl<>(List.of(), PageRequest.of(page, size, ordem), total)` ao `PaginaResponse.de`; que o `PageImpl` preserva o total com lista vazia é suposição a confirmar nesse teste.
* A linha de log é a mesma da listagem comum, com o `total` real.
* Regra reaproveitável: F05, F17, F06 e F31 aplicam a mesma guarda. Se o código começar a se repetir, a guarda vira um método utilitário no pacote `service`.

Resposta 200, corpo `PaginaResponse<ClienteListResponse>` (record genérico no pacote `dto`, reaproveitado pelas próximas listagens):

```json
{
  "itens": [
    { "id": 1, "nome": "José Antônio", "telefone": "11987654321", "email": "jose@example.com" }
  ],
  "pagina": 0,
  "tamanho": 20,
  "totalItens": 1,
  "totalPaginas": 1
}
```

* `pagina` é o `page` pedido (base 0). `tamanho` é o `size` pedido, não a quantidade de itens devolvidos. `totalItens` é `long`, e `totalPaginas` é `int`.
* `telefone` e `email` podem ser `null`, porque são opcionais na V2, e vão no JSON como `null` em vez de serem omitidos. `telefone` sai só com dígitos, como está gravado; a formatação para exibição é da F35.
* Página além do fim: `itens` vazio, com `totalItens` e `totalPaginas` reais (US-CLI-03b).
* Base vazia ou busca sem resultado: `itens` vazio, `totalItens` 0 e `totalPaginas` 0 (US-CLI-02).
* Os nomes dos campos seguem o português do `ErrorResponse` e do `LoginResponse` já publicados. O nome do schema que o springdoc gera para o tipo genérico não faz parte do contrato; a F35 se guia pelos nomes dos campos.

Erros, todos no corpo `{timestamp, status, erro, mensagem, path}` do ADR-011:

* 400: o `GlobalExceptionHandler` ganha handlers para `HandlerMethodValidationException`, `ConstraintViolationException` e `MethodArgumentTypeMismatchException`. A mensagem cita só o nome do parâmetro (por exemplo `Parametro invalido: size`) e nunca o valor rejeitado, e a mensagem de constraint não usa `${validatedValue}`. Isso completa o mapeamento "400 = validação de entrada" que o ADR-011 já define; o ADR-011 não muda.
* 401: sem mudança, pelo `RestAuthenticationEntryPoint`.
* 500: mensagem fixa. O log segue a seção 7 da política de dados: classe da exceção, caminho sem query string e identificador da requisição, sem `getMessage()` de causa de persistência (A5).
* 404 e 405 (revisão 2, RH-A3). O `GlobalExceptionHandler` ganha dois handlers:
  * `NoResourceFoundException` e `NoHandlerFoundException` respondem 404, com `mensagem` "Recurso nao encontrado".
  * `HttpRequestMethodNotSupportedException` responde 405, com `mensagem` "Metodo nao permitido" e o cabeçalho `Allow` preenchido por `getSupportedHttpMethods()`.
  * Nos dois, `erro` é a frase do status ("Not Found", "Method Not Allowed"), e `path` é `getRequestURI()`, sem query string. Nenhum dos dois é registrado como erro inesperado. Nenhum loga a query string nem o `getMessage()` da exceção, que traz o caminho e o método; se houver log, é em `DEBUG` ou `INFO`, só com o status e o caminho sem query.
  * Isso completa o mapeamento do ADR-011, que continua sem mudança, como já foi feito para o 400.
* Sem token, rota inexistente e método não suportado continuam respondendo 401 (US-CLI-05c). O filtro do Spring Security (`anyRequest().authenticated()`) responde antes do `DispatcherServlet`, então a resposta não revela quais rotas existem. Nenhuma rota nova entra em `PUBLIC_PATHS`.
* Fora desta decisão (D5, decisão da pessoa): 406, 415 e JSON malformado.
  * Recomendação do CARTOGRAFO: no handler de `Exception`, quando a exceção implementar `org.springframework.web.ErrorResponse`, responder com o status dela e mensagem fixa por status, sem registrar como erro inesperado.
  * JSON malformado (`HttpMessageNotReadableException`) já aparece no login e está no achado da F44.
  * A F44 também mexe no `GlobalExceptionHandler`. Quem entrar depois rebaseia sobre quem entrar antes.

### Migration da F03a

`V3__fixar_collation_clientes.sql`, aditiva, escrita pelo ESPRESSO na F03a:

```sql
ALTER TABLE clientes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

* No `mysql:8.4` padrão o resultado lógico não muda, mas a tabela deixa de depender do servidor. Num servidor `latin1`, a V3 converteu as três colunas para `utf8mb4_0900_ai_ci` sem perder o dado gravado (evidência de 2026-11-17). Tipos e tamanhos das colunas não mudam, então o `ddl-auto: validate` continua passando.
* O número V3 está livre: a `main` (dfab787) e a cabeça do PR #14 (927bfaa) só têm V1 e V2, conferido em 2026-11-17. Se outra feature entrar antes com V3, a F03a usa o próximo número livre (ADR-003).
* A V3 não conserta dado já gravado com dupla codificação: ela converte bytes que já estão errados. Por isso a regra do cliente de linha de comando abaixo vale antes do primeiro dado real.
* Regra para as próximas listagens: a feature dona de cada busca textual fixa a collation das colunas buscadas na própria migration (`servicos` na F05, `pecas` na F17, e assim por diante).
* `CHECK` de telefone só com dígitos (A8): fica para a migration da F03c, junto com a validação de escrita de 10 ou 11 dígitos, porque a regra e o seu teste nascem com o caminho de escrita.

### Charset da sessão

* Aplicação: nenhum parâmetro de charset em `DB_URL`, no `.env.example` nem no `application.yml`. Vale o padrão do Connector/J (`utf8mb4`), afirmado no teste de integração. `DB_URL` com `characterEncoding` diferente de `UTF-8` é proibido, e o comentário do `.env.example` passa a dizer isso (ADR-009).
* docker-compose: o serviço `mysql` de `apps/api/docker-compose.yml` ganha `LANG: C.UTF-8` em `environment`, para que `docker compose exec mysql mysql ...` abra a sessão em `utf8mb4`. O servidor não muda.
* Script manual (seed, correção de cadastro, anonimização da seção 4 da política): sempre executado com `mysql --default-character-set=utf8mb4`, inclusive fora do docker-compose. O script revisado pelo VIGIA para a pendência P2 traz esse comando no cabeçalho.

### Termo literal e o achado A2 (fechado na revisão 2)

Regra final, acordada com o VIGIA em 2026-11-17:

* Toda cláusula `like` traz `ESCAPE` com `!`, inclusive as cláusulas novas. O caractere de escape do service e o da consulta mudam juntos, ou nenhum dos dois muda.
* O service escapa exatamente o caractere de escape declarado (`!`), mais `%` e `_`, nessa ordem.
* A barra invertida **não** é escapada. Com `ESCAPE` usando `!`, ela já é literal no `LIKE` (provado em 2026-11-14 e 2026-11-17). Escapá-la é um erro de função, sem ganho de segurança: em 2026-11-17, o padrão `%\%` achou `Barra\Invertida`, e o padrão `%\\%` não achou nada.
* O A2 da política dizia "escapar `\`, `%` e `_`" porque partia do escape padrão do MySQL. O VIGIA reconheceu que essa parte estava errada e vai substituir, na PR #17, o texto de mitigação do A2 por: "Parâmetro sempre ligado (nunca concatenado em JPQL ou SQL nativo); `ESCAPE '!'` explícito em todo `like` (inclusive em cláusulas novas; o caractere de escape do service e o da consulta mudam juntos) e, no service, escapar `!`, `%` e `_`, nessa ordem (ADR-017, E2). A barra invertida não é escapada: com `ESCAPE '!'` ela já é literal, e escapá-la impede achar a barra. Teste de integração com `%`, `_`, `\` e `!` contra MySQL real, um caso por cláusula `like` (US-CLI-01a)."
* Até a PR #17 mudar, este ADR prevalece sobre o texto do A2.
* Risco que sobra, de gravidade média segundo o VIGIA: uma cláusula `like` nova sem `ESCAPE` volta ao escape padrão `\`. Aí `q=%` vira `%!%%`, que traz todo cliente com `!` seguido de qualquer coisa. A Confirmação cobre isso com `grep` e com um caso de teste por cláusula.

### Fluxo do dado pessoal na busca

```mermaid
sequenceDiagram
    participant App as App mobile (F35)
    participant Ctl as ClienteController
    participant Svc as ClienteService
    participant Repo as ClienteRepository
    participant DB as MySQL (clientes, utf8mb4_0900_ai_ci)
    App->>Ctl: GET /api/v1/clientes?q=termo&page&size (Bearer JWT, HTTPS)
    Ctl->>Ctl: Bean Validation de q, page e size (400 se inválido)
    Ctl->>Svc: listar(q, page, size)
    Svc->>Svc: strip, NFC, escape com !, dígitos só se o termo for numérico
    Note over Svc,Repo: deslocamento acima de 2^31-1, só a contagem e itens vazio (O3)
    Svc->>Repo: buscar(texto, telefone, PageRequest)
    Repo->>DB: JPQL com parâmetros ligados e ESCAPE, sessão utf8mb4
    DB-->>Repo: linhas de clientes
    Repo-->>Svc: Page de Cliente
    Svc->>Svc: log só com qLen, page, size, total e usuarioId
    Svc-->>Ctl: PaginaResponse de ClienteListResponse (MapStruct)
    Ctl-->>App: 200 com id, nome, telefone e email
```

O termo entra pela query string, circula só em memória e como parâmetro ligado, e nunca sai em log nem em mensagem de erro. Nome, telefone e email saem só no corpo da resposta 200. CPF e endereço não existem na V2 e, depois da F09, não entram neste DTO.

### Consequências

* Bom, porque a busca dá o mesmo resultado em todo servidor onde a V3 rodar, inclusive num servidor `latin1`, e o teste de integração quebra se a collation ou o charset da sessão mudarem.
* Bom, porque nenhum termo amplia o resultado: o curinga vira literal, e o parâmetro ligado impede injeção.
* Bom, porque entrada inválida vira 400 com o nome do parâmetro, sem eco do valor, o que fecha o A1 também para as próximas listagens.
* Bom, porque a F35 recebe um JSON explícito e estável, e as próximas listagens reaproveitam `PaginaResponse<T>` e a função de escape.
* Bom, porque o caminho que de fato corrompeu dado (cliente `mysql` em `latin1`) fica fechado no ambiente local e tem regra escrita para produção.
* Ruim, porque cada listagem nova precisa lembrar de `ESCAPE` em cada `like` e de fixar a collation na sua migration. A seção Confirmação torna isso verificável por `grep` e por teste.
* Ruim, porque `LIKE` com `%` no início faz varredura completa da tabela. Isso é aceito pelo volume da premissa P2.
* Ruim, porque telefone digitado com caractere fora da lista (`11/98765-4321`, `tel 1198765`) não consulta o telefone e só busca em nome e email. Telefone com `+55` não casa o número gravado sem o código do país (D6). Em troca, termo misto deixa de trazer clientes a mais pelo telefone (F8).
* Ruim, porque um segundo teste de integração com servidor `latin1` acrescenta um contêiner ao job de integração do CI.
* Neutro, porque o `ALTER TABLE ... CONVERT` reconstrói a tabela, mas com o volume atual o bloqueio é desprezível.
* Bom, porque nenhum `page` aceito pelo contrato gera 500, e o caso extremo custa só uma contagem, sem buscar linha.
* Ruim, porque a guarda de deslocamento é mais uma regra que cada listagem precisa repetir. O teste da US-CLI-03c em cada listagem é o que garante.
* Bom, porque 404 e 405 deixam de aparecer como erro inesperado no log, o que limpa o sinal de 500 para investigação.

### Risco residual

* Script manual em produção rodado sem `--default-character-set=utf8mb4` ainda grava dupla codificação. Nenhum teste pega isso; a mitigação é a regra acima e a revisão do VIGIA no script da P2.
* A afirmação de sessão `utf8mb4` no teste de integração vale para a URL do Testcontainers, não para a `DB_URL` de produção. Uma `DB_URL` com `characterEncoding` errado só é pega por revisão.
* A query string carrega o termo (A4). A mitigação está na seção 7 da política de dados: access log sem query, HTTPS fora do local e app sem log de URL.
* Qualquer token válido percorre a base em páginas de 100 (A3, risco aceito pela pessoa).
* Tabelas criadas no futuro sem collation explícita herdam o padrão do servidor. A regra deste ADR cobre só as colunas buscadas.
* Uma cláusula `like` nova sem `ESCAPE` volta ao escape padrão `\` e deixa curinga passar (risco apontado pelo VIGIA). A mitigação é o `grep` da Confirmação e um caso de teste por cláusula.
* A checagem de deslocamento do Spring Data JPA foi lida na versão 4.1.0. Se uma versão futura mudar o limiar ou o tipo, a guarda O3 fica redundante ou insuficiente. O teste da US-CLI-03c com `page=2147483647` pega os dois casos.
* 406, 415 e JSON malformado continuam respondendo 500 até a decisão D5.

### Confirmação

* Teste de integração com Testcontainers (`mysql:8.4`, todas as migrations do zero):
  * lê `information_schema.COLUMNS` e afirma `utf8mb4_0900_ai_ci` em `clientes.nome`, `telefone` e `email`;
  * afirma `SELECT @@character_set_connection` igual a `utf8mb4` pelo `DataSource` da aplicação;
  * afirma com dados, pela API: acento e caixa ignorados; `%`, `_`, `\` e `!` literais; telefone com e sem máscara; termo só de letras sem casar telefone; termo acentuado em forma decomposta (NFD); página além do fim; ordem por nome e id.
* Segundo teste de integração com o servidor em `latin1` (`withCommand("--character-set-server=latin1", "--collation-server=latin1_swedish_ci")`), todas as migrations do zero: afirma a collation das três colunas depois da V3 e que `muller` encontra `Müller`. É a prova do fator F1.
* Teste MockMvc: 400 para `size=0`, `size=101`, `size=abc`, `page=-1`, `page=abc`, `q` com 101 caracteres e `q` com 101 espaços, com o corpo sem o valor rejeitado.
* Teste unitário da função de normalização e escape, incluindo `!` seguido de `%`, a barra invertida intacta e o termo NFD.
* Teste unitário da regra de telefone com todos os exemplos normativos da tabela do passo 5, inclusive U+00A0, `٥٥٥` e `+55`.
* Testes de integração da revisão 2:
  * US-CLI-01b: `zeta5@example.org` devolve 1 de 26 clientes.
  * US-CLI-01c: `987` casa o telefone de um cliente e o nome de outro.
  * US-CLI-03c: a tabela de `page` e `size` da BUSSOLA, inclusive `page=2147483647` com `size` 1, 2 e 100, com e sem `q`.
  * Um caso de `\` e um de `!` para cada cláusula `like`.
* Testes MockMvc da revisão 2:
  * `page=2147483648` responde 400.
  * Com token válido, `GET /api/v1/rota-inexistente?q=ana` responde 404, e `DELETE /api/v1/clientes?q=ana` responde 405 com `Allow` contendo `GET`. Nos dois, o corpo vem sem stack trace e sem nome de classe, e o `path` vem sem query string.
  * Sem token, as duas rotas respondem 401.
  * O log capturado não contém `ana` nem a query string.
* Revisão de PR:
  * `git grep -niE "like :" -- apps/api/src/main/java` não pode ter linha sem `escape`;
  * `git grep -n "Pageable " -- apps/api/src/main/java/br/com/mecanicasaojorge/api/controller` deve vir vazio;
  * `git grep -n "characterEncoding" -- apps/api` vazio ou só com `UTF-8`;
  * `docker compose -f apps/api/docker-compose.yml config` mostra `LANG: C.UTF-8` no serviço `mysql`.
* Revisão do CARTOGRAFO nos PRs de F05, F17, F06 e F31 contra este contrato.

## Prós e contras das opções

### C1. Manter a collation padrão do servidor
* Bom, porque não exige mudança nenhuma e hoje funciona no `mysql:8.4`.
* Ruim, porque falha em F1: num servidor `latin1` as colunas viram `latin1_swedish_ci`, em que `Müller` difere de `muller` e emoji é recusado (provado em 2026-11-17), e nenhum teste percebe.
* Custo de descartar: nenhum.

### C2. Fixar a collation por migration aditiva (escolhida)
* Bom, porque atende F1 em todo ambiente que roda as migrations, com um único `ALTER` e sem dependência nova (F5). Provado em servidor `utf8mb4` e em servidor `latin1`.
* Neutro, porque no `mysql:8.4` padrão é um no-op lógico.
* Ruim, porque vale só para as tabelas que a fixarem, cada feature de busca precisa repetir a regra, e a conversão não conserta dado já corrompido.

### C3. Coluna sombra normalizada em Java
* Bom, porque independe do banco.
* Ruim, porque exige uma coluna a mais por campo buscado, sincronização em toda escrita (F03c e F03d), migration de backfill e mais código para manter. Falha em F5 e F6.
* Custo de descartar: perdemos a independência de banco, que o projeto não precisa, porque o MySQL é fixo no briefing.

### C4. COLLATE explícito na consulta
* Bom, porque não precisa de migration.
* Ruim, porque `COLLATE` não é JPQL padrão, o que obriga SQL nativo ou função específica do Hibernate. Também impede uso de índice e se repete em cada consulta. Num servidor `latin1`, não resolve o emoji recusado na escrita. Falha em F6.
* Custo de descartar: uma migration a mais por tabela buscada.

### E1. Escape padrão com barra invertida
* Bom, porque é o padrão do MySQL e dispensa a cláusula `ESCAPE`.
* Ruim, porque a barra é escape em literal Java e no MySQL, e no MySQL o efeito muda com o `sql_mode` `NO_BACKSLASH_ESCAPES`. São camadas de escape sobrepostas, e é fácil errar.
* Custo de descartar: escrever `ESCAPE` em cada consulta.

### E2. Escape com ! e ESCAPE explícito (escolhida)
* Bom, porque `!` não tem significado em nenhuma camada, e o comportamento foi provado contra `mysql:8.4` com parâmetro ligado e com o Connector/J.
* Ruim, porque o próprio `!` também precisa ser escapado, a cláusula não pode ser esquecida (coberto por `grep` e teste) e o texto do A2 da política precisa ser lido junto com este ADR.

### E3. LOCATE/INSTR em vez de LIKE
* Bom, porque não há curinga e, portanto, nada a escapar.
* Ruim, porque não foi verificado se respeita a insensibilidade a acento da collation, o custo de varredura é o mesmo do `LIKE`, e o padrão é menos conhecido pelo time.
* Custo de descartar: manter a função de escape, que é pequena e tem teste.

### P1. Pageable e Page do Spring
* Bom, porque exige menos código.
* Ruim, porque o `max-page-size` corrige `size=101` para 100 e responde 200 em vez de 400, e `page` negativa vira 0, o que fere F3 e US-CLI-03a. A serialização direta de `PageImpl` é desaconselhada pelo próprio Spring Data e expõe campos internos (`pageable`, `sort`), o que fere F4.
* Custo de descartar: um record genérico e três handlers novos.

### P2. Parâmetros explícitos e PaginaResponse (escolhida)
* Bom, porque a validação declarativa vira 400 pelo handler global, e o JSON fica sob controle do time.
* Ruim, porque cria um DTO genérico novo e exige handlers que hoje não existem (A1).

### K1. Manter o padrão do driver sem afirmação
* Bom, porque não exige mudança, e o driver já abre em `utf8mb4` (provado em 2026-11-17).
* Ruim, porque uma troca de driver ou de padrão passa sem teste, e o cliente `mysql` continua corrompendo dado em script manual, que foi o único dano observado. Falha em F7.
* Custo de descartar: nenhum.

### K2. Padrão do driver afirmado em teste e cliente de linha de comando fechado (escolhida)
* Bom, porque fecha a única origem de dupla codificação observada com uma linha no docker-compose, uma asserção e uma regra de operação, sem dependência nova (F5, F7).
* Ruim, porque depende de disciplina em script manual fora do docker-compose, e a asserção do teste não cobre a `DB_URL` de produção.

### K3. characterEncoding fixado na configuração
* Bom, porque deixa a escolha explícita na configuração da aplicação.
* Ruim, porque repete o padrão já verificado do driver, não resolve o cliente de linha de comando e, como a `DB_URL` é texto livre por ambiente (ADR-009), quem escreve a URL ainda pode sobrescrever. A precedência entre propriedade do Hikari e parâmetro da URL **não foi verificada**.
* Custo de descartar: perdemos a declaração explícita, compensada pela asserção no teste de integração.

### K4. Charset do servidor fixado no docker-compose
* Bom, porque tabelas futuras do ambiente local herdariam `utf8mb4` mesmo sem `COLLATE`.
* Ruim, porque no `mysql:8.4` já é o padrão, não vale para o banco de produção, que depende do provedor, e não resolve o cliente `mysql`: o cliente segue o locale, não o servidor (provado com servidor `utf8mb4` e cliente `latin1`).
* Custo de descartar: tabela futura sem collation herda o padrão do servidor, o que já está no risco residual.

### T1. Telefone com qualquer dígito (como estava)
* Bom, porque não muda nada e casa o telefone mesmo com máscara incomum.
* Ruim, porque falha em F8: `zeta5@example.org` trouxe 20 de 26 clientes no QA de 17/11, e `rua 7` traz todo telefone que tem `7`.
* Custo de descartar: telefone digitado com separador fora da lista deixa de casar.

### T2. Telefone só com termo numérico (escolhida)
* Bom, porque atende F8 e mantém a busca por pedaço de número, com regra fechada e testável por tabela.
* Neutro, porque o termo numérico também busca em nome e email, o que pode trazer `Oficina 987` junto com o telefone `987` (US-CLI-01c).
* Ruim, porque a lista de símbolos é fechada: `/`, tabulação e `+55` com código do país não funcionam como o atendente talvez espere.

### T3. Telefone com mínimo de dígitos
* Bom, porque reduz parte do ruído sem olhar para os outros caracteres.
* Ruim, porque ainda casa `rua 1234` e `zeta1234@example.org` com o telefone (falha em F8), impede achar o telefone por 3 dígitos e cria um número mágico sem base.
* Custo de descartar: nenhum além do ruído que T2 já resolve.

### O1. Manter o 500
* Bom, porque não exige código.
* Ruim, porque falha em F9 e no contrato da US-CLI-03b, e polui o log de erro inesperado.
* Custo de descartar: nenhum.

### O2. Teto de page no controller com 400
* Bom, porque é declarativo e evita a contagem extra.
* Ruim, porque troca 200 por 400 num pedido que o contrato chama de página além do fim (P9 da BUSSOLA). Além disso, o teto depende de `size`, o que o Bean Validation não expressa sem validador próprio.
* Custo de descartar: uma contagem extra num caso que só acontece com `page` absurdo.

### O3. Página vazia com total por contagem (escolhida)
* Bom, porque atende F9 sem mudar o contrato e sem consulta nova no repository.
* Ruim, porque é mais uma regra no service, que cada listagem nova repete, e depende do limiar do Spring Data JPA lido na versão 4.1.0.

### O4. Tratar a exceção no handler global
* Bom, porque a regra fica num lugar só.
* Ruim, porque o handler não tem `page`, `size` nem total para montar a resposta 200. Além disso, `InvalidDataAccessApiUsageException` também sinaliza erros de programação, que devem continuar respondendo 500.
* Custo de descartar: nenhum.

## Mais informações

* Revisitar quando a base passar de alguns milhares de clientes (premissa P2): avaliar índice `FULLTEXT` com parser `ngram` ou busca por prefixo.
* Revisitar se a F35 pedir ordenação: o parâmetro `sort` entra com uma lista fechada de campos, nunca com um nome de coluna livre.
* Termo misto (D4 da BUSSOLA): resolvido na revisão 2 pela opção T2. A premissa P4 da F03a passa a dizer que o telefone só é consultado quando o termo é numérico (dígitos ASCII, `(`, `)`, `-`, `.`, `+` e espaço, com pelo menos um dígito). O texto do PRD fica com a BUSSOLA.
* D6, termo com `+55`: limitação conhecida até a pessoa decidir. Se for aceito descartar o código do país, a regra muda no passo 5, por revisão deste ADR antes do aceite ou por um ADR novo depois dele.
* D5 (406, 415 e JSON malformado) e a ordem de merge com a F44 no `GlobalExceptionHandler`: decisão pendente da pessoa.
* Prioridade de correção, definida pela BUSSOLA: primeiro O3, depois T2, depois 404 e 405.
* Melhoria possível: `ALTER DATABASE` com a collation padrão numa migration faria tabelas futuras herdarem a regra. Fica de fora porque exige privilégio de `ALTER` no banco que não foi verificado no usuário de produção, e uma migration que falha impede a aplicação de subir.
* Dependência de merge: o código da F03a só entra na `main` depois do PR #14 (Spring Boot 4.1.2, achado A0) ou rebaseado sobre ele. O PR #13 foi mergeado no ramo do #14, não na `main`.
* ADR-014 já está na `main`. ADR-015 e ADR-016 continuam em ramos fora dela (ADR-016 no PR #14). A numeração deles está reservada, por isso este é o ADR-017.
* A evidência de 2026-11-17 veio de um programa descartável fora do repositório. A prova versionada é o teste de integração da F03a.
* A leitura de bytecode da revisão 2 também foi feita fora do repositório, com o `api.jar` copiado para uma pasta temporária. A prova versionada são os testes listados na Confirmação.
